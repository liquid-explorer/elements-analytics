import mongoose, { Document } from 'mongoose';

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

  async setAssetDisable(assetHash: string): Promise<void> {
    await AssetModel.findOneAndUpdate(
      { assetHash: assetHash },
      { isEnable: false },
      { new: false, runValidators: true }
    );
  }

  async getAsset(assetHash: string): Promise<Asset> {
    const document = await AssetModel.findOne({
      assetHash: assetHash,
    });

    if (!document) {
      throw new Error('not found');
    }

    return makeAssetFromModel(document);
  }

  async searchAssets(regex: string, limit: number): Promise<Asset[]> {
    const documents = await AssetModel.find({
      $or: [
        { assetHash: { $regex: regex } },
        { name: { $regex: regex } },
        { ticker: { $regex: regex } },
      ],
    }).limit(limit);
    return documents.map(makeAssetFromModel);
  }
}

// makeAssetFromModel converts a document (using AssetModel) to an Asset interface (from domain)
function makeAssetFromModel(document: Document): Asset {
  if (!document['assetHash'])
    throw new Error('assetHash is missing in document');

  if (!document['name']) throw new Error('name is missing in document');

  if (!document['ticker']) throw new Error('ticker is missing in document');

  return {
    assetHash: document['assetHash'],
    name: document['name'],
    ticker: document['ticker'],
    precision: document['precision'],
    isEnable: document['isEnable'],
  };
}
