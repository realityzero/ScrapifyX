import { Pinecone, RecordMetadata, RecordValues, ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { ChunkedDocument } from "../interfaces/document";
import { chunk } from "llm-chunk";
import { HuggingFace } from "./huggingface";
import { config } from "../../config";

export class PineconeDb {
    private _client;
    
    constructor() {
        this._client = new Pinecone({
            apiKey: config.pinecode.apiKey || '',
        });
    }

    async createIndex(indexName: string, vectorDimension: number) {
        console.log(`Checking "${indexName}"...`);

        // if index doesn't exist, create it
        const existingIndexes = await this._client.listIndexes();
        if (!existingIndexes?.indexes?.find((index) => index.name == indexName)) {
            console.log(`Creating "${indexName}"...`);
            await this._client.createIndex({
                name: indexName,
                dimension: vectorDimension,
                metric: 'cosine',
                spec: { 
                    serverless: { 
                        cloud: 'gcp', 
                        region: 'us-central1' 
                    }
                } 
            });
            console.log(`Creating index.... please wait for it to finish initializing.`);
        } else {
            console.log(`${indexName} already exists.`);
        }
    }

    async queryVectorStore(indexName: string, question: string): Promise<ScoredPineconeRecord<RecordMetadata>[] | undefined> {
        console.log('Querying Pinecone vector store...');
        // Retrieve the Pinecone index
        const index = this._client.Index(indexName);

        let queryEmbedding;
        try {
            // Scope of improvement: use singleton
            queryEmbedding = await new HuggingFace().generateEmbedding(question);
        } catch (error) {
            // Scope of improvement: use exception classes and catch at controller
            throw new Error('Exception occurred at HuggingFace');
        }
        // query Pinecone index and return top k matches
        const queryResponse = await index.query({
            topK: config.pinecode.selectTopK,
            vector: queryEmbedding as RecordValues,
            includeValues: false,
            includeMetadata: true,
        });

        console.log(`Found ${queryResponse.matches.length} matches...`);
        console.log(`Asking question: ${question}...`);

        if (queryResponse.matches.length) {
            console.log(`Matches: ${JSON.stringify(queryResponse.matches)}`);
            return queryResponse.matches;
        } else {
            console.log('No matches found');
        }
    }

    // Split text into chunks
    chunks = (document: string) => chunk(document, {
        minLength: 5,          // number of minimum characters into chunk
        maxLength: 2000,       // number of maximum characters into chunk
        splitter: "paragraph", // paragraph | sentence
        overlap: 0,            // number of overlap chracters
        delimiters: ""         // regex for base split method
    });

    async upsertDb(indexName: string, doc: ChunkedDocument): Promise<void> {
        console.log('Retrieving Pinecone index...');
        
        // Retrieve Pinecone index
        const index = this._client.Index(indexName);
        console.log(`Pinecone index retrieved: ${indexName}`);
        console.log(`Processing document: ${doc.title}`);
        const txtPath = doc.url;

        const chunks = this.chunks(doc.content);
        console.log(`Text split into ${chunks.length} chunks`);
        console.log(
        `Calling Hugging Face's Embedding endpoint documents with ${chunks.length} text chunks ...`
        );

        const embeddingsArrays = [];
        const huggingface = new HuggingFace();
        for (const chunk of chunks) {
            console.log('-------------------------------------------------------');
            console.log(chunk);
            const vectorEmbedding = await huggingface.generateEmbedding(chunk);
            embeddingsArrays.push(vectorEmbedding);
        }

        console.log('Finished embedding documents');
        console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);

        // upsert vectors in batches of 100
        const batchSize = 100;
        let batch:any = [];
        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            const vector = {
                // can come up w/ better way to generate id e.g. uuid
                id: `${encodeURIComponent(txtPath)}_${idx}`,
                values: embeddingsArrays[idx],
                metadata: {
                loc: doc.url,
                pageContent: chunk,
                txtPath: doc.title,
                },
            };
            batch = [...batch, vector]

            // when batch is full or it's the last item, upsert the vectors
            if (batch.length === batchSize || idx === chunks.length - 1) {
                await index.upsert(batch);
                // empty the batch
                batch = [];
            }
        }

        console.log(`Pinecone index updated with ${chunks.length} vectors`);
        }
}