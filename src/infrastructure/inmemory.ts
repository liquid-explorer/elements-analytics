import { Asset } from '../domain/asset';

import { AssetRepository } from './repository';

export class InMemoryRepository implements AssetRepository {
  private assets: Asset[] = [];

  getAsset(assetHash: string): Promise<Asset> {
    const asset = this.assets.find((asset: Asset) => {
      return asset.assetHash === assetHash;
    });

    if (!asset) throw new Error('not found');

    return Promise.resolve(asset);
  }

  createAsset(asset: Asset): Promise<void> {
    this.assets.push(asset);
    return Promise.resolve();
  }

  async setAssetEnable(assetHash: string): Promise<void> {
    const asset = await this.getAsset(assetHash);
    if (asset.isEnable === true) return;

    // si isEnable est false
    asset.isEnable = true;
    this.assets.filter((asset: Asset) => asset.assetHash !== assetHash);
    this.assets.push(asset);
  }
}
