import { describe, expect, it } from 'vitest';
import {
  commandLicenseForStationTier,
  requiredFleetPowerForStationTier,
  settleStationCredits,
} from '../src/domain/station.js';
import type { Station } from '../src/types.js';

function station(overrides: Partial<Station> = {}): Station {
  return {
    id: 'station_1',
    sectorId: 'sector_1',
    ownerCharacterId: 'char_1',
    tier: 1,
    outputPerHour: 100,
    credits: 0,
    lastCollectedAt: 0,
    ...overrides,
  };
}

describe('settleStationCredits', () => {
  it('accrues credits proportional to elapsed hours', () => {
    const s = station({ credits: 0, outputPerHour: 100, lastCollectedAt: 0 });
    expect(settleStationCredits(s, 3 * 3_600_000)).toBeCloseTo(300, 5);
  });

  it('adds to any already-accrued balance', () => {
    const s = station({ credits: 50, outputPerHour: 100, lastCollectedAt: 0 });
    expect(settleStationCredits(s, 1 * 3_600_000)).toBeCloseTo(150, 5);
  });

  it('does not accrue for non-positive elapsed time', () => {
    const s = station({ credits: 50, outputPerHour: 100, lastCollectedAt: 1000 });
    expect(settleStationCredits(s, 500)).toBe(50);
  });
});

describe('requiredFleetPowerForStationTier', () => {
  it('requires no fleet power for tier 1', () => {
    expect(requiredFleetPowerForStationTier(1)).toBe(0);
  });

  it('escalates with tier', () => {
    expect(requiredFleetPowerForStationTier(2)).toBeGreaterThan(requiredFleetPowerForStationTier(1));
    expect(requiredFleetPowerForStationTier(3)).toBeGreaterThan(requiredFleetPowerForStationTier(2));
    expect(requiredFleetPowerForStationTier(4)).toBeGreaterThan(requiredFleetPowerForStationTier(3));
  });
});

describe('commandLicenseForStationTier', () => {
  it('has no license name for tier 1', () => {
    expect(commandLicenseForStationTier(1)).toBeNull();
  });

  it('names a license for higher tiers', () => {
    expect(commandLicenseForStationTier(2)).toBe('Garrison License');
    expect(commandLicenseForStationTier(4)).toBe('Bastion License');
  });
});
