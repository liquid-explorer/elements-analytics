import { Router } from "express";

// import { getAsset, getSupply } from "../controllers/asset";

export const assetRoutes = Router()

assetRoutes.get('/ping', (_, res) => res.status(200).json({
    message: 'OK'
}))

/**

assetRoutes.get('/', getAsset)
assetRoutes.get('/supply', getSupply)
*/