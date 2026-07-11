export const SALVAGE_DURATION_MINUTES = 5;
export const SALVAGE_BASE_POOL = 2000;

/** Credits paid out per point of Fuel committed, split from a fixed pool across all contributors. */
export function salvagePayoutPerFuel(totalFuel: number): number {
  if (totalFuel <= 0) return 0;
  return SALVAGE_BASE_POOL / totalFuel;
}
