import { describe, expect, it } from 'vitest';
import { settleStationCredits } from '../src/domain/station.js';
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
