import { Router } from 'express';

import { AssetController } from '../controllers/asset';

export function makeAssetRoutes(controller: AssetController): Router {
  const assetRoutes = Router();
  assetRoutes.get('/ping', (_, res) =>
    res.status(200).json({
      message: 'OK',
    })
  );
  assetRoutes.get('/:assetHash', controller.getAsset);
  assetRoutes.get('/:assetHash/enable', controller.enableAsset);
  assetRoutes.post('/', controller.createAsset);
  return assetRoutes;
}

//assetRoutes.get('/:assetID/disable', disableAsset);

//assetRoutes.get('/supply', getSupply);
