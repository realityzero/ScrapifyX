import { PineconeDb } from '../utils/pinecone';
import { config } from "../../config";


export async function POST(request: Request) {
    try {
        const { question } = await request.json();
        console.log('Question', question);
        const response = await new PineconeDb().queryVectorStore(config.pinecode.indexName, question);
        return Response.json(response, {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('The server encountered an error. You may have inputted an invalid query.', {
            status: 500,
        });
    }
  }
