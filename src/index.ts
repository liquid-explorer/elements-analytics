import path from 'path';

import dotenv from 'dotenv';
import express from 'express';

// import { EsploraChainSource } from './application/chainsource';
// import { Updater } from './application/updater';
// import { AssetController } from './controllers/asset';
// import { connect } from './infrastructure/mongo';
import { logger } from './middlewares/logger';
// import { makeAssetRouter } from './routes/asset';

dotenv.config();

async function run() {
  // if (!process.env.DATABASE_URL) {
  //   throw new Error('DATABASE_URL is not defined');
  // }

  // if (!process.env.ESPLORA_URL) {
  //   throw new Error('ESPLORA_URL is not defined');
  // }

  // const [assetRepo, txsRepo] = await connect(process.env.DATABASE_URL);

  console.log('starting the server...');
  const app = express();
  app.listen(5000);

  // const controller = new AssetController(assetRepo, txsRepo);

  // // const chainSource = new EsploraChainSource(process.env.ESPLORA_URL);
  // const updater = new Updater(chainSource, txsRepo);

  // const assetRouter = makeAssetRouter(controller, updater);

  app.use(logger);
  app.use(express.json());
  // app.use('/api/asset', assetRouter);

  // serve static views/index.html file via GET /supply/html
  app.get('/supply/html', (_, res) => {
    // TODO: implement this
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

run()
  .catch(console.error)
  .finally(() => console.log('done'));
