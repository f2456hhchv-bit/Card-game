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
