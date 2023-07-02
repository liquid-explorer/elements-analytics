interface Issuance {
  assetAmount: number;
  tokenAmount: number;
  isReissuance: boolean;
}

interface BurnOutput {
  vout: number;
  amount: number;
}

export interface AssetChainTransaction {
  txID: string;
  issuances: Issuance[];
  burnOutputs: BurnOutput[];
  blockHeight: number;
  blockTime: number;
}
