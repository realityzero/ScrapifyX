const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
let _page;

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
import { HfInference } from '@huggingface/inference';
import { chunk } from 'llm-chunk';
// const getDownloads = async () => {
//     console.log('Hey!');
//     const res = await fetch('https://www.npmjs.com/package/puppeteer');
//     const html = await res.text();

// }
// export async function GET() {
//     console.log('Hey!');
//     const res = await fetch('https://www.npmjs.com/package/puppeteer', {
//     });
//     const html = await res.text();
//     const data = await res.json()
   
//     return Response.json({ data })
//   }
  

// export default getDownloads;
import { headers } from 'next/headers'
import { Browser, Page } from 'puppeteer-core';
 
// export async function GET(request: Request) {
//   const headersList = headers()
//   const referer = headersList.get('referer')
 
//   return new Response('Hello, Next.js!', {
//     status: 200,
//     // headers: { referer: referer },
//   })
// }

export async function POST() {
    // const res = await fetch('https://data.mongodb-api.com/...', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'API-Key': process.env.DATA_API_KEY!,
    //   },
    //   body: JSON.stringify({ time: new Date().toISOString() }),
    // })
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
        const file = await getScreenshot('https://arxiv.org/abs/2310.05421');
        return new Response(file, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, immutable, no-transform, s-maxage=604800, max-age=604800',
            },
        })
        // res.setHeader('Content-Type', 'image/png');
        // res.setHeader(
        //   'Cache-Control',
        //   'public, immutable, no-transform, s-maxage=604800, max-age=604800'
        // );
        // res.status(200).end(file);
      } catch (error) {
        console.error(error);
        // res
        //   .status(500)
        //   .send(
        //     'The server encountered an error. You may have inputted an invalid query.'
        //   );
        return new Response('The server encountered an error. You may have inputted an invalid query.', {
        status: 500,
    })
      }
  }

  async function getPage(): Promise<Page> {
    if (_page) return _page;
  
    const browser = await getBrowser();
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
  
  export async function getScreenshot(url: string, ratio = 1) {
    const page = await getPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    await page.setViewport({
      width: 1000,
      height: 600,
      devicePixelRatio: ratio,
    });
    const extractedText = await page.$eval('*', (el) => el.innerText);
    console.log('extractedText', extractedText);
    const chunks = chunk(extractedText, {
      minLength: 5,          // number of minimum characters into chunk
      maxLength: 2048,       // number of maximum characters into chunk
      splitter: "paragraph", // paragraph | sentence
      overlap: 0,            // number of overlap chracters
      delimiters: ""         // regex for base split method
    });
    // console.log('chunks', chunks);
    console.log('printing chunks', chunks.length);


    const hf = new HfInference('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')
    const vectorArray = [];
    
    for (const chunk of chunks) {
      console.log('-------------------------------------------------------');
      console.log(chunk);
      // const vectorEmbedding = await hf.featureExtraction({
      //   model: 'sentence-transformers/all-MiniLM-L6-v2',
      //   inputs: chunk
      // });
      // vectorArray.push(vectorEmbedding);
    }
    console.log('printing vector embeddings', vectorArray);
    const file = await page.screenshot();
    // const screenshot = await page.screenshot({
    //     encoding: 'base64',
    // });

    await page.close();
    // res.json({ blob: `data:image/jpeg;base64,${screenshot}` });
    return file;
    // return `data:image/jpeg;base64,${screenshot}`;
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