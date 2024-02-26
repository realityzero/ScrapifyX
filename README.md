## Scrapify-X

Web scraper powered by Puppeteer and Pinecone DB as Vector DB.

## General Architecture
- insert doc link here

## Video Brief from Author
- [Loom Video](https://www.loom.com/share/139f9b9c7ae94b09a41e15771995af5d)

## Notes from Author
- UI flow is tested for a happy path. There will be some bugs available.
- Refer ```.env.example``` file for example env variables
- Service is based on Next.js 13 and deployed using [Render](https://render.com/). Due to limitations of free tier of [Render](https://render.com/), it suffers from cold start issues. Usually takes 1 minute to start after certain inactivity period.
- [Live link](https://scrapifyx.onrender.com/)

## Challenges during cloud deployment
- We don't have an active high volume storage available in Free Tier accounts. That's why we're downloading chromium build at runtime.
- Easiest deployment solution is [Vercel](https://vercel.com/). But due to recent changes in Free Tier, we can't run Puppeteer. There are Network Bandwidth limitations and [Vercel](https://vercel.com/) has a timeout of 10 seconds.
- [Render](https://render.com/) is another free option. It gives a free machine to run web services, but suffers from cold start or spin down after a while.

## UI Inspiration
- [shadcn/ui](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)

## Live Link
https://scrapifyx.onrender.com/

## Steps for local/dev run
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
