import { Router } from 'express';

import { Updater } from '../application/updater';
import { AssetController } from '../controllers/asset';

export function makeAssetRouter(
  controller: AssetController,
  updater: Updater
): Router {
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
  assetRoutes.get('/:assetHash/supply', async (req, res) => {
    if (req.params.assetHash) await updater.update(req.params.assetHash);
    return controller.getAssetSupply(req, res);
  });
  assetRoutes.get('/:assetHash/view', async (req, res) => {
    if (req.params.assetHash) await updater.update(req.params.assetHash);
    return controller.getAssetSupplyPage(req, res);
  });

  return assetRoutes;
}
