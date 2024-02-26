import { Browser, Page } from 'puppeteer-core';
import { PineconeDb } from '../utils/pinecone';
import { config } from "../../config";

const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
export class Puppeteer {
    static exePath =
    process.platform === "win32"
        ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "linux"
        ? "/usr/bin/google-chrome"
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

    async getOptions(isDev: boolean) {
        let options;
        console.log('exePath:', Puppeteer.exePath);
        if (isDev) {
            options = {
            args: [],
            executablePath: Puppeteer.exePath,
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

    async getBrowser(): Promise<Browser> {
        const options = await this.getOptions(config.isDevMode);
        return puppeteer.launch(options);

    }

    async getPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        return page;
    }

    async initiateScraping(url: string, ratio = 1) {
        const page = await this.getPage();
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
}