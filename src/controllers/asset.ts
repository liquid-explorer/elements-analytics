import { Request, Response } from 'express';

import { makeSupplyGraph } from '../domain/supplyGraph';
import {
  AssetRepository,
  SupplyTransactionRepository,
} from '../infrastructure/repository';

// limit the number of results of GET /api/assets?regex=???
const LIMIT_SEARCH = 50;

export class AssetController {
  constructor(
    private assetRepository: AssetRepository,
    private supplyRepository: SupplyTransactionRepository
  ) {}

  async createAsset(req: Request, res: Response) {
    // admin
    try {
      if (
        !req.body.assetHash ||
        !req.body.name ||
        !req.body.ticker ||
        !req.body.precision
      ) {
        throw new Error('error');
      }
      try {
        await this.assetRepository.getAsset(req.body.assetHash);
        res.status(400).json({ msg: `${req.body.assetHash} already exists` });
        return;
        // eslint-disable-next-line no-empty
      } catch {}

      const result = await this.assetRepository.createAsset({
        ...req.body,
        isEnable: false,
      });
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  }

  async getAsset(req: Request, res: Response) {
    try {
      if (!req.params.assetHash) throw new Error('asset hash unknown');

      const result = await this.assetRepository.getAsset(req.params.assetHash);
      if (!result) throw new Error('not found');
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(404).json({ msg: error.message });
    }
  }

  async enableAsset(req: Request, res: Response) {
    // cherkAdmin(req, res);
    try {
      await this.assetRepository.setAssetEnable(req.params.assetHash);
      res.status(200).json({ msg: 'Asset has been enabled' });
    } catch (error) {
      res.status(404).json({ msg: 'Not found' });
    }
  }
  async disableAsset(req: Request, res: Response) {
    // cherkAdmin(req, res);
    try {
      await this.assetRepository.setAssetDisable(req.params.assetHash);
      res.status(200).json({ msg: 'Asset not has been enabled' });
    } catch (error) {
      res.status(404).json({ msg: 'Not found' });
    }
  }
  async searchAssets(req: Request, res: Response) {
    try {
      if (typeof req.query.regex !== 'string' || !req.query.regex)
        throw new Error('query parameter regex invalid');
      const assetSearch = await this.assetRepository.searchAssets(
        req.query.regex,
        LIMIT_SEARCH
      );
      res.status(200).json({ assetSearch });
    } catch (error) {
      res.status(404).json({ msg: 'not found' });
    }
  }

  async getAssetSupply(req: Request, res: Response) {
    try {
      if (!req.params.assetHash) throw new Error('assetHash not found');
      const transactions = await this.supplyRepository.getTransactionsData(
        req.params.assetHash
      );
      const supply = makeSupplyGraph(transactions);
      res.status(200).json({ supply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: error.message });
    }
  }
}
