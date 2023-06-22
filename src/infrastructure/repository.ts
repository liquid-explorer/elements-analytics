import { Asset } from '../domain/asset';

export interface AssetRepository {
  getAsset(assetHash: string): Promise<Asset>;
  createAsset(asset: Asset): Promise<void>;
  setAssetEnable(assetHash: string): Promise<void>;
  // disable?
}
