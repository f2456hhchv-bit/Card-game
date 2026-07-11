import type { Station } from '../types.js';

/** Lazily accrues station income since the last collection, same settle-on-read shape as domain/regen.ts. */
export function settleStationCredits(station: Station, now: number): number {
  const elapsedHours = Math.max(0, (now - station.lastCollectedAt) / 3_600_000);
  return station.credits + elapsedHours * station.outputPerHour;
}

const STATION_TIER_FIREPOWER_REQUIREMENT: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
};

const COMMAND_LICENSE_NAMES: Record<number, string | null> = {
  1: null,
  2: 'Garrison License',
  3: 'Fortress License',
  4: 'Bastion License',
};

/** Fleet firepower required to hold a station of this tier — your fleet garrisons what it builds. */
export function requiredFleetPowerForStationTier(tier: number): number {
  return STATION_TIER_FIREPOWER_REQUIREMENT[tier] ?? 0;
}

export function commandLicenseForStationTier(tier: number): string | null {
  return COMMAND_LICENSE_NAMES[tier] ?? null;
}
