import mongoose, { Document } from 'mongoose';

import { Asset } from '../domain/asset';
import { AssetChainTransaction } from '../domain/transaction';

import { AssetRepository, SupplyTransactionRepository } from './repository';

const assetSchema = new mongoose.Schema({
  assetHash: String,
  name: String,
  ticker: String,
  precision: Number,
  isEnable: Boolean,
});

const AssetModel = mongoose.model('Asset', assetSchema);

// AssetMongoRepository is the implementation of the AssetRepository for the mongo database.
class AssetMongoRepository implements AssetRepository {
  async createAsset(asset: Asset): Promise<void> {
    await AssetModel.create(asset);
  }

  async createAssets(assets: Asset[]): Promise<void> {
    await AssetModel.insertMany(assets);
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

const IssuanceSchema = new mongoose.Schema({
  assetAmount: Number,
  tokenAmount: Number,
  isReissuance: Boolean,
});

const BurnOutputSchema = new mongoose.Schema({
  vout: Number,
  amount: Number,
});

const ChainTransactionSchema = new mongoose.Schema({
  txID: {
    type: String,
    unique: true,
  },
  blockHeight: Number,
  blockTime: Number,
  burnOutputs: [BurnOutputSchema],
  issuances: [IssuanceSchema],
});

const ChainTransactionModel = mongoose.model(
  'ChainTransaction',
  ChainTransactionSchema
);

const AssetTransactionsSchema = new mongoose.Schema({
  assetHash: {
    type: String,
    unique: true,
  },
  transactions: [
    {
      // ref to tx
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChainTransaction',
    },
  ],
});

const AssetTransactionsModel = mongoose.model(
  'AssetTransactions',
  AssetTransactionsSchema
);

class SupplyTransactionMongoRepository implements SupplyTransactionRepository {
  async addTransactionsData(
    assetHash: string,
    txs: AssetChainTransaction[]
  ): Promise<void> {
    // find already existing txs in db
    const existingTxs = await ChainTransactionModel.find({
      txID: { $in: txs.map((tx) => tx.txID) },
    });

    // remove already existing txs from txs
    const filteredTxs = txs.filter(
      (tx) => !existingTxs.find((existingTx) => existingTx.txID === tx.txID)
    );

    const documents = await ChainTransactionModel.insertMany(filteredTxs);

    const ids = documents.map((doc) => doc._id);

    const existing = await AssetTransactionsModel.findOne({
      assetHash,
    });

    if (!existing) {
      await AssetTransactionsModel.create({
        assetHash,
        transactions: ids,
      });
    }

    await AssetTransactionsModel.findOneAndUpdate(
      { assetHash },
      {
        $addToSet: { transactions: ids },
      }
    );
  }

  async getTransactionsData(
    assetHash: string
  ): Promise<AssetChainTransaction[]> {
    const document = await AssetTransactionsModel.findOne({
      assetHash,
    })
      .populate('transactions')
      .exec();

    if (!document) return [];

    return document.transactions.map((doc) => {
      return {
        txID: doc['txID'],
        blockHeight: doc['blockHeight'],
        blockTime: doc['blockTime'],
        burnOutputs: doc['burnOutputs'],
        issuances: doc['issuances'],
      };
    });
  }
}

export async function connect(
  URL: string
): Promise<[AssetRepository, SupplyTransactionRepository]> {
  await mongoose.connect(URL);
  return [new AssetMongoRepository(), new SupplyTransactionMongoRepository()];
}
