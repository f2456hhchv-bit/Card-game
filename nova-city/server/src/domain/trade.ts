export interface TradeRank {
  name: string;
  sellBonusPct: number;
  unlocksContraband: boolean;
}

const TIERS: { minTrades: number; rank: TradeRank }[] = [
  { minTrades: 0, rank: { name: 'Novice Trader', sellBonusPct: 0, unlocksContraband: false } },
  { minTrades: 15, rank: { name: 'Licensed Trader', sellBonusPct: 0.05, unlocksContraband: false } },
  { minTrades: 40, rank: { name: 'Black Market Contact', sellBonusPct: 0.1, unlocksContraband: true } },
  { minTrades: 80, rank: { name: 'Master Trader', sellBonusPct: 0.15, unlocksContraband: true } },
];

/** Trader rank derived from lifetime completed trades (buys + sells) — a repetition-based skill, not a timer. */
export function tradeRank(tradesCompleted: number): TradeRank {
  let current = TIERS[0].rank;
  for (const tier of TIERS) {
    if (tradesCompleted >= tier.minTrades) current = tier.rank;
  }
  return current;
}
