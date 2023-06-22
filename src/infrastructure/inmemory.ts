import { Asset } from '../domain/asset';

import { AssetRepository } from './repository';

// TODO
export class InMemoryRepository implements AssetRepository {
  private assets: Asset[] = [];

  getAsset(assetHash: string): Promise<Asset> {
    throw new Error('Method not implemented.');
  }

  createAsset(asset: Asset): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setAssetEnable(assetHash: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
