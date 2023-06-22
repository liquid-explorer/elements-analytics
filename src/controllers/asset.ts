import { Request, Response } from 'express';

import { Asset } from '../infrastructure/mongo';

export async function createAsset(req: Request, res: Response) {
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
    const assetFoundInDB = await Asset.findOne({
      assetHash: req.body.assetHash,
    });
    if (assetFoundInDB) {
      res.status(400).json({ msg: `${req.body.assetHash} already exists` });
      return;
    }

    const result = await Asset.create({
      ...req.body,
      isEnable: false,
    });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
}

export async function getAsset(req: Request, res: Response) {
  try {
    const result = await Asset.findOne({ assetHash: req.params.assetHash });
    if (!result) throw new Error('not found');
    res.status(200).json({ result });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
}

export async function enableAssetId(req: Request, res: Response) {
  // cherkAdmin(req, res);
  try {
    const result = await Asset.findOneAndUpdate(
      { assetHash: req.params.assetHash },
      { isEnable: true },
      { new: true, runValidators: true }
    );
    res.status(200).json({ result });
  } catch (error) {
    res.status(404).json({ msg: 'Not found' });
  }
}

export async function disableAsset(_: Request, res: Response) {
  // cherkAdmin(req, res);
  if (!enableAssetId) {
    res.status(200).json({ msg: 'Okay' });
  }
}
/*
// a faire apres lecture de regexp
export async function searchAssetWithRegexp(req: Request, res: Response) {
  try {
    const result = await Asset.findOne({  });
    res.status(200).json({ result });
  } catch (error) {
    res.status(404).json({ msg: 'Product not found' });
  }
}

export async function getSupply(req: Request, res: Response) {
  throw new Error('not implemented');
}
*/
