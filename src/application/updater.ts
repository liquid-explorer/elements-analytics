import { AssetChainTransaction } from '../domain/transaction';
import { SupplyTransactionRepository } from '../infrastructure/repository';

import { ChainSource } from './chainsource';

export class Updater {
  private loaders: Map<string, boolean> = new Map();

  constructor(
    private chainSource: ChainSource,
    private txsRepository: SupplyTransactionRepository
  ) {}

  async safeGetTxs(assetHash: string): Promise<AssetChainTransaction[]> {
    try {
      return await this.txsRepository.getTransactionsData(assetHash);
    } catch (e) {
      console.error('updater: ', e);
      return [];
    }
  }

  async update(assetHash: string) {
    if (this.loaders.has(assetHash)) return;
    this.loaders.set(assetHash, true);
    try {
      const txs = await this.safeGetTxs(assetHash);

      let lastSeenTxID = undefined;
      if (txs.length > 0) {
        // get the last (max block height) txID
        lastSeenTxID = txs.reduceRight((prev, current) => {
          return prev.blockHeight > current.blockHeight ? prev : current;
        }).txID;
      }

      const newTxs = await this.chainSource.getChainTransactions(
        assetHash,
        lastSeenTxID
      );

      if (newTxs.length > 0) {
        await this.txsRepository.addTransactionsData(assetHash, newTxs);
      }
    } finally {
      this.loaders.delete(assetHash);
    }
  }
}
