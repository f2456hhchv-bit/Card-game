const SYMBOLS = ['void', 'ember', 'ion', 'nova'] as const;
type Symbol = (typeof SYMBOLS)[number];

// Rarer symbols weight lower, so triple-nova jackpots stay uncommon.
const WEIGHTS: Record<Symbol, number> = { void: 40, ember: 30, ion: 20, nova: 10 };
const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

const TRIPLE_MULTIPLIER: Record<Symbol, number> = { void: 3, ember: 6, ion: 12, nova: 30 };
const PAIR_MULTIPLIER = 1.5;

function rollSymbol(rng: () => number): Symbol {
  let roll = rng() * TOTAL_WEIGHT;
  for (const symbol of SYMBOLS) {
    roll -= WEIGHTS[symbol];
    if (roll <= 0) return symbol;
  }
  return SYMBOLS[0];
}

export interface SlotResult {
  reels: [Symbol, Symbol, Symbol];
  multiplier: number;
  payout: number;
}

/** Three-reel slot pull. Payout is bet * multiplier (0 on a miss). */
export function spinSlots(bet: number, rng: () => number): SlotResult {
  const reels: [Symbol, Symbol, Symbol] = [rollSymbol(rng), rollSymbol(rng), rollSymbol(rng)];
  let multiplier = 0;
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    multiplier = TRIPLE_MULTIPLIER[reels[0]];
  } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
    multiplier = PAIR_MULTIPLIER;
  }
  return { reels, multiplier, payout: Math.round(bet * multiplier) };
}

export interface CoinFlipResult {
  result: 'heads' | 'tails';
  won: boolean;
  payout: number;
}

/** Even-money coin flip. A win returns bet * 1.9 (a small house edge), a loss returns 0. */
export function flipCoin(bet: number, choice: 'heads' | 'tails', rng: () => number): CoinFlipResult {
  const result: CoinFlipResult['result'] = rng() < 0.5 ? 'heads' : 'tails';
  const won = result === choice;
  return { result, won, payout: won ? Math.round(bet * 1.9) : 0 };
}
