import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { logger } from './middlewares/logger';
import { assetRoutes } from './routes/asset';

dotenv.config();

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('starting the server...');

    // initializer la db avec les assset manquantes!

    app.listen(5000);
  })
  .catch((err) => console.log(err));

// register asset assetRoutes

// middleware
app.use(logger);
app.use(express.json());

// routes
app.use('/api/asset', assetRoutes);
