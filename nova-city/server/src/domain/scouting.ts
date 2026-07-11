export interface NavigatorRank {
  name: string;
  discountPct: number;
}

const TIERS: { minExplored: number; rank: NavigatorRank }[] = [
  { minExplored: 0, rank: { name: 'Novice Navigator', discountPct: 0 } },
  { minExplored: 3, rank: { name: 'Charted Navigator', discountPct: 0.2 } },
  { minExplored: 6, rank: { name: 'Veteran Navigator', discountPct: 0.35 } },
  { minExplored: 10, rank: { name: 'Master Navigator', discountPct: 0.5 } },
];

/** Navigator rank from sectors already scouted — repeated scouting makes future scouting cheaper. */
export function navigatorRank(sectorsExplored: number): NavigatorRank {
  let current = TIERS[0].rank;
  for (const tier of TIERS) {
    if (sectorsExplored >= tier.minExplored) current = tier.rank;
  }
  return current;
}

export function discountedScoutCost(baseCost: number, sectorsExplored: number): number {
  const { discountPct } = navigatorRank(sectorsExplored);
  return Math.max(1, Math.round(baseCost * (1 - discountPct)));
}
