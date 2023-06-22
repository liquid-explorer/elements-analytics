import { Router } from 'express';

import {
  createAsset,
  //disableAsset,
  enableAssetId,
  getAsset,
  //getSupply,
  //searchAssetWithRegexp,
} from '../controllers/asset';

export const assetRoutes = Router();

assetRoutes.get('/ping', (_, res) =>
  res.status(200).json({
    message: 'OK',
  })
);

assetRoutes.get('/:assetHash', getAsset);
assetRoutes.get('/:assetHash/enable', enableAssetId);
//assetRoutes.get('/', searchAssetWithRegexp);
assetRoutes.post('/', createAsset);
//assetRoutes.get('/:assetID/disable', disableAsset);

//assetRoutes.get('/supply', getSupply);
