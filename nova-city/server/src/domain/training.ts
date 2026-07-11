import type { Stat } from '../types.js';

const GAIN_RATE = 0.6;
const DIMINISHING_SCALE = 40;

/**
 * Stat points gained from spending `fuelSpent` Fuel training a stat currently
 * at `currentValue`. Diminishing returns: gain shrinks as the stat grows,
 * so early training is efficient and late-game grinding slows down.
 */
export function trainingGain(currentValue: number, fuelSpent: number): number {
  const factor = DIMINISHING_SCALE / (DIMINISHING_SCALE + currentValue);
  return Math.max(1, Math.round(fuelSpent * GAIN_RATE * factor));
}

/** Total trained stat points — stats only ever grow through the Training Bay, so this is a direct measure of training investment. */
export function totalStatPoints(stats: Record<Stat, number>): number {
  return stats.strength + stats.defense + stats.speed + stats.dexterity;
}
