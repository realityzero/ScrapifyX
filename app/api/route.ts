const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
let _page: Promise<Page>;

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
        // options = {
        // args: chromium.args,
        // executablePath: await chromium.executablePath,
        // headless: chromium.headless,
        // };
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
    // local development is broken for this 👇
    // but it works in vercel so I'm not gonna touch it
    // return puppeteer.launch({
    //   args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath(
    //     `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    //   ),
    //   headless: chromium.headless,
    //   ignoreHTTPSErrors: true,
    // });
    const options = await getOptions(true);
    return puppeteer.launch(options);

}
import { headers } from 'next/headers'
import { Browser, Page } from 'puppeteer-core';
import { PineconeDb } from '../utils/pinecone';
import { config } from '@/config';
 
// export async function GET(request: Request) {
//   const headersList = headers()
//   const referer = headersList.get('referer')
 
//   return new Response('Hello, Next.js!', {
//     status: 200,
//     // headers: { referer: referer },
//   })
// }

export async function POST() {
    // const res = await fetch('https://www.npmjs.com/package/puppeteer');
    // const html = await res.text();
    // console.log(html);
   
    // // const data = await res.json()
    // return new Response('Hello, Next.js!', {
    // status: 200,
    // // headers: { referer: referer },
    // })
   
    // return Response.json(data)
    try {
        // const file = await getScreenshot('https://www.npmjs.com/package/puppeteer');
        const file = await getScreenshot('https://www.oziva.in/products/oziva-protein-herbs-men-whey-protein-with-ayurvedic-herbs-multivitamins-soy-free-gluten-free-no-preservatives?variant=20052525711419');
        return new Response(file, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, immutable, no-transform, s-maxage=604800, max-age=604800',
            },
        })
      } catch (error) {
        console.error(error);
        return new Response('The server encountered an error. You may have inputted an invalid query.', {
        status: 500,
    })
      }
  }

  async function getPage(): Promise<Page> {
    if (_page) return _page;
  
    const browser = await getBrowser();
    // @ts-ignore
    _page = await browser.newPage();
    return _page;
  }
  
  function checkUrl(urlString: string) {
    let url;
    try {
      url = new URL(urlString);
    } catch (error) {
      return false;
    }
    return true;
  }
  
  async function getScreenshot(url: string, ratio = 1) {
    const page = await getPage();
    await page.goto(url, {
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
    console.log('extractedText', extractedText);

    try {
      // await createPineconeIndex(client, indexName, vectorDimensions);
      // await updatePineconesss(client, indexName, {
      //   content: extractedText,
      //   title: pageTitle,
      //   url: 'https://arxiv.org/abs/2310.05421',
      // });
      // await new PineconeDb().createIndex(config.pinecode.indexName, config.pinecode.vectorDimensions);
      await new PineconeDb().queryVectorStore(config.pinecode.indexName, 'How does protein work?');
      // await new PineconeDb().upsertDb(config.pinecode.indexName, {
      //     content: extractedText,
      //     title: pageTitle,
      //     url: 'https://www.oziva.in/products/oziva-protein-herbs-men-whey-protein-with-ayurvedic-herbs-multivitamins-soy-free-gluten-free-no-preservatives?variant=20052525711419',
      // });
      // await queryPineconeVectorStoreAndQueryLLM(client, indexName, 'Can we automate customer service using LangChain?');
    } catch (err) {
      console.log('error: ', err)
    }

    const file = await page.screenshot();
    // const screenshot = await page.screenshot({
    //     encoding: 'base64',
    // });

    await page.close();
    return file;
  }
  
//   module.exports = async (req, res) => {
//     if (!req.query.url) return res.status(400).send('No url query specified.');
//     if (!checkUrl(req.query.url))
//       return res.status(400).send('Invalid url query specified.');
//     try {
//       const file = await getScreenshot(req.query.url, req.query.ratio);
//       res.setHeader('Content-Type', 'image/png');
//       res.setHeader(
//         'Cache-Control',
//         'public, immutable, no-transform, s-maxage=604800, max-age=604800'
//       );
//       res.status(200).end(file);
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .send(
//           'The server encountered an error. You may have inputted an invalid query.'
//         );
//     }
//   };