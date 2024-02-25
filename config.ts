interface Config {
    timeout: number;
    pinecode: {
        indexName: string;
        timeout: number;
        vectorDimensions: number;
        selectTopK: number;
        apiKey: string;
    }
    huggingface: {
        apiKey: string;
        model: string;
    }
    isDevMode: boolean;
}

const config: Config = {
    timeout: 80000,
    pinecode: {
        indexName: 'scrapify-x',
        timeout: 80000,
        vectorDimensions: 384,
        selectTopK: 3,
        apiKey: process.env.PINECONE_API_KEY || '',
    },
    huggingface: {
        apiKey: process.env.HUGGING_FACE_API_KEY || '',
        model: 'sentence-transformers/all-MiniLM-L6-v2',
    },
    isDevMode: process.env.NODE_ENV == 'development',
}

export { config };