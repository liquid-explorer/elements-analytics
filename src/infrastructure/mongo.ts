import mongoose from 'mongoose';

export const SupplyGraphSchema = new mongoose.Schema({
  supply: Number,
  date: Number,
});

export const assetSchema = new mongoose.Schema({
  assetID: String,
  name: String,
  ticker: String,
  precision: Number,
});
