## Scrapify-X

Web scraper powered by Puppeteer and Pinecone DB as Vector DB.

## General Architecture
![Architectural working](./docs/Web%20Scraper.png?raw=true)

## Video Brief from Author
[![Loom Video](./docs/Loom.png?raw=true)](https://www.loom.com/share/139f9b9c7ae94b09a41e15771995af5d)

## Notes from Author
- UI flow is tested for a happy path. There will be some bugs available.
- Refer ```.env.example``` file for example env variables
- Service is based on Next.js 13 and deployed using [Render](https://render.com/). Due to limitations of free tier of [Render](https://render.com/), it suffers from cold start issues. Usually takes 1 minute to start after certain inactivity period.
- Model to convert text to vectors: [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Live link](https://scrapifyx.onrender.com/)

## Challenges during cloud deployment
- We don't have an active high volume storage available in Free Tier accounts. That's why we're downloading chromium build at runtime.
- Easiest deployment solution is [Vercel](https://vercel.com/). But due to recent changes in Free Tier, we can't run Puppeteer. There are Network Bandwidth limitations and [Vercel](https://vercel.com/) has a timeout of 10 seconds.
- [Render](https://render.com/) is another free option. It gives a free machine to run web services, but suffers from cold start or spin down after a while. Also, suffers from random server crash.

## UI Inspiration
- [shadcn/ui](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)

## Live Link
https://scrapifyx.onrender.com/

## Steps for local/dev run
- You will need huggingface and pineconedb api keys, refer ```.env.example``` for env keys.
```
$ npm i
$ npm run dev
```

## Steps for prod

```
$ npm i
$ npm build
$ npm start
```

## Api Endpoints

1. Trigger web scraping
```
curl --location 'https://scrapifyx.onrender.com/api' \
--header 'content-type: application/json' \
--data '{"url":"https://www.britannica.com/plant/plant"}'
```

2. Ask questions
```
curl --location 'https://scrapifyx.onrender.com/question' \
--header 'content-type: application/json' \
--data '{"question":"how does protein work?"}'
```

## Database Design

```
id|values|metadata
```
- Keeping the design simple and straightforward.
- id: Identifier of the object. Should be an auto-increment number or uuid. I made a mistake of putting encoded urls under id.
- values: This is where you'll keep your vector data. Working with vector databases and learning more about it, I understood vector dbs are more optimised to query vectors. One key thing they have is indexes over these vectors and a lot more. Refer this article to learn more: https://www.pinecone.io/learn/vector-database/
- metadata: Now, this is where you will store metadata of your vectors like some content or path location. 
```
metadata: {
    loc: <value>
    pageContent: <value>
    textPath: <value>
}
```
- metadata.loc: stores url of scraping website.
- metadata.pageContent: splitted chunks of text stored in raw string format. Good to have, since we need to show the text after query.
- metadata.txtPath: contains page title of that website.
- Querying strategy: As mentioned in ```General Architecture```, questions are converted to vectors embeddings. Using those vector embeddings, we query our vector db (Pinecone DB) w/ questions vector embeddings to find similar results (also known as Top K). Behind the scenes we are doing a dot product of ``` vector(question) . vector(db record) ``` and trying to find the top related results.

## Scope of Improvements:
- Keep a snapshot in cache of scraped website. Avoid multiple web scraping triggers within a small time period. This is a complete usecase specific thing.
- Better exception handing w/ error classes and show relevant api response from api handlers. Provides better code readability.
- Instead of relying on 3rd party api for vector embedding generation, use a locally cached model to optimise for query performance. This can't be done for existing deployment due to space and hardware limitations.
- Random UI issues w/ changing screen size. Handled for common mobile and desktop size.
- Mention in UI to ask short questions and limit to vector embedding model's token length.
- Ability to scrape pages in depth. Depth 0: url, Depth 1: href or side links, Depth 2 and so one.

## Update
- April 9, 2024: Less frequent downtime at page load. Thanks to ping on render from [@UptimeRobot](https://www.github.com/uptimerobot)
