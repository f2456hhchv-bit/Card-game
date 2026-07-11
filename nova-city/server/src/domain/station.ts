import type { Station } from '../types.js';

/** Lazily accrues station income since the last collection, same settle-on-read shape as domain/regen.ts. */
export function settleStationCredits(station: Station, now: number): number {
  const elapsedHours = Math.max(0, (now - station.lastCollectedAt) / 3_600_000);
  return station.credits + elapsedHours * station.outputPerHour;
}
