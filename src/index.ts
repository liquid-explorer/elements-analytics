import dotenv from 'dotenv';
import express from 'express';

import { AssetController } from './controllers/asset';
import { AssetMongoRepository } from './infrastructure/mongo';
import { logger } from './middlewares/logger';
import { makeAssetRoutes } from './routes/asset';

dotenv.config();

async function run() {
  const app = express();

  const mongoRepo = await AssetMongoRepository.connect(
    process.env.DATABASE_URL
  );

  console.log('starting the server...');
  app.listen(5000);

  const controller = new AssetController(mongoRepo);
  const assetRoutes = makeAssetRoutes(controller);

  app.use(logger);
  app.use(express.json());
  app.use('/api/asset', assetRoutes);
}

run().catch(console.error);
