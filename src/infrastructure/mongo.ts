import mongoose from 'mongoose';

const SupplyGraphSchema = new mongoose.Schema({
  supply: Number,
  date: Number,
});

export const SupplyGraph = mongoose.model('SupplyGraph', SupplyGraphSchema);

const assetSchema = new mongoose.Schema({
  assetHash: String,
  name: String,
  ticker: String,
  precision: Number,
  isEnable: Boolean,
});

export const Asset = mongoose.model('Asset', assetSchema);

export function findOneAsset() {
  throw console.error();
}

export function findCoords() {
  throw console.error();
}
