import { AssetChainTransaction } from './transaction';

export type SupplyGraph = Array<{
  blockHeight: number;
  blockTime: number;
  txs: {
    txID: string;
    supplyModifier: number; // < 0 for burn tx, > 0 for issuances transactions
  }[];
}>;

export function makeSupplyGraph(
  transactions: AssetChainTransaction[]
): SupplyGraph {
  const heightTxs = new Map<
    number,
    { txID: string; supplyModifier: number }[]
  >();

  const blockTimes = new Map<number, number>();

  for (const tx of transactions) {
    const height = tx.blockHeight;

    if (!heightTxs.has(height)) {
      heightTxs.set(height, []);
    }

    const txs = heightTxs.get(height);

    txs.push({
      txID: tx.txID,
      supplyModifier: computeModifier(tx),
    });

    blockTimes.set(height, tx.blockTime);
    heightTxs.set(height, txs);
  }

  const supplyGraph: SupplyGraph = [];

  for (const [height, txs] of heightTxs) {
    supplyGraph.push({
      blockHeight: height,
      blockTime: blockTimes.get(height),
      txs,
    });
  }

  // sort by block height (0 -> h_max)
  supplyGraph.sort((a, b) => a.blockHeight - b.blockHeight);
  return supplyGraph;
}

function computeModifier(tx: AssetChainTransaction): number {
  let modifier = 0;

  for (const issuance of tx.issuances) {
    modifier += issuance.assetAmount;
  }

  for (const burn of tx.burnOutputs) {
    modifier -= burn.amount;
  }

  return modifier;
}
