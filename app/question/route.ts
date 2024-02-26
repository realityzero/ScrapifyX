import { PineconeDb } from '../utils/pinecone';
import { config } from "../../config";
import { z } from "zod";

export async function POST(request: Request) {
    const schema = z.object({
        question: z.string().min(3),
    });

    const zodCheck = schema.safeParse(request.body);

    if (!zodCheck.success) {
        const { errors } = zodCheck.error;
        return Response.json({
            error: { message: "Invalid request", errors },
        }, {
            status: 400
        });
    }

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
