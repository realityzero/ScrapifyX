import { z } from "zod";
import { Puppeteer } from "../utils/puppeteer";


export async function POST(request: Request) {
      const schema = z.object({
        url: z.string().url(),
    });

    const zodCheck = schema.safeParse(await request.json());

    if (!zodCheck.success) {
        const { errors } = zodCheck.error;
        return Response.json({
            error: { message: "Invalid request", errors },
        }, {
            status: 400
        });
    }

    const { url } = zodCheck.data;
    try {
        await new Puppeteer().initiateScraping(url);
        return Response.json('Success', {
          status: 200,
        })
      } catch (error) {
        console.error(error);
        return new Response('The server encountered an error. You may have inputted an invalid query.', {
        status: 500,
    })
      }
  }