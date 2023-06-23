import { Router } from 'express';

import { AssetController } from '../controllers/asset';

export function makeAssetRoutes(controller: AssetController): Router {
  const assetRoutes = Router();
  assetRoutes.get('/ping', (_, res) =>
    res.status(200).json({
      message: 'OK',
    })
  );

  assetRoutes.get('/:assetHash', (req, res) => controller.getAsset(req, res));
  assetRoutes.get('/:assetHash/enable', (req, res) =>
    controller.enableAsset(req, res)
  );
  assetRoutes.get('/', (req, res) => controller.searchAssets(req, res));
  assetRoutes.get('/:assetHash/disable', (req, res) =>
    controller.disableAsset(req, res)
  );
  assetRoutes.post('/', (req, res) => controller.createAsset(req, res));

  return assetRoutes;
}

//assetRoutes.get('/supply', getSupply);
