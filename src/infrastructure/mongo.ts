import mongoose from 'mongoose';

import { Asset } from '../domain/asset';

import { AssetRepository } from './repository';

// const SupplyGraphSchema = new mongoose.Schema({
//   supply: Number,
//   date: Number,
// });

// const SupplyGraph = mongoose.model('SupplyGraph', SupplyGraphSchema);

const assetSchema = new mongoose.Schema({
  assetHash: String,
  name: String,
  ticker: String,
  precision: Number,
  isEnable: Boolean,
});

const AssetModel = mongoose.model('Asset', assetSchema);

// AssetMongoRepository is the implementation of the AssetRepository for the mongo database.
export class AssetMongoRepository implements AssetRepository {
  private constructor() {
    // private constructor
  }

  static async connect(url: string): Promise<AssetMongoRepository> {
    await mongoose.connect(url);
    return new AssetMongoRepository();
  }

  async createAsset(asset: Asset): Promise<void> {
    await AssetModel.create(asset);
  }

  async setAssetEnable(assetHash: string): Promise<void> {
    await AssetModel.findOneAndUpdate(
      { assetHash: assetHash },
      { isEnable: true },
      { new: true, runValidators: true }
    );
  }

  async getAsset(assetHash: string): Promise<Asset> {
    const document = await AssetModel.findOne({
      assetHash: assetHash,
    });

    if (!document) {
      throw new Error('not found');
    }

    return {
      assetHash: document.assetHash,
      name: document.name,
      ticker: document.ticker,
      precision: document.precision,
      isEnable: document.isEnable,
    };
  }
}
