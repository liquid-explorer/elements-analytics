import { Asset } from '../domain/asset';
import { AssetChainTransaction } from '../domain/transaction';

export interface AssetRepository {
  getAsset(assetHash: string): Promise<Asset>;
  createAsset(asset: Asset): Promise<void>;
  createAssets(assets: Asset[]): Promise<void>;
  setAssetEnable(assetHash: string): Promise<void>;
  setAssetDisable(assetHash: string): Promise<void>;
  // search with a regular expression ?
  searchAssets(regex: string, limit: number): Promise<Asset[]>;
}

export interface SupplyTransactionRepository {
  addTransactionsData(
    assetHash: string,
    txs: AssetChainTransaction[]
  ): Promise<void>;
  getTransactionsData(assetHash: string): Promise<AssetChainTransaction[]>;
}
