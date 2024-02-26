import { Browser, Page } from 'puppeteer-core';
import { PineconeDb } from '../utils/pinecone';
import { config } from "../../config";

const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
import { z } from "zod";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions(isDev: boolean) {
    let options;
    console.log('exePath:', exePath);
    if (isDev) {
        options = {
        args: [],
        executablePath: exePath,
        headless: 'new',
        };
    } else {
        options = {
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(
                `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
            ),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        };
    }
    return options;
}

async function getBrowser(): Promise<Browser> {
    const options = await getOptions(config.isDevMode);
    return puppeteer.launch(options);

}

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
        await initiateScraping(url);
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

  async function getPage(): Promise<Page> {
    const browser = await getBrowser();
    const page = await browser.newPage();
    return page;
  }
  
  async function initiateScraping(url: string, ratio = 1) {
    const page = await getPage();
    await page.goto(url, {
      timeout: 0,
      waitUntil: 'networkidle0',
    });
    await page.setViewport({
      width: 1000,
      height: 600,
      deviceScaleFactor: ratio
    });
    const pageTitle = await page.title();
    console.log('pageTitle', pageTitle);
    
    // @ts-ignore
    const extractedText = await page.$eval('*', (el) => el.innerText);
    // close page for better memory management
    await page.close();

    try {
      await new PineconeDb().createIndex(config.pinecode.indexName, config.pinecode.vectorDimensions);
      await new PineconeDb().upsertDb(config.pinecode.indexName, {
          content: extractedText,
          title: pageTitle,
          url,
      });
    } catch (err) {
      console.log('error: ', err);
      throw err;
    }
  }
  