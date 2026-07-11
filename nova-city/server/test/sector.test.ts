import { describe, expect, it } from 'vitest';
import { resolveSectorAttack, settleAlienStrength } from '../src/domain/sector.js';
import type { Sector } from '../src/types.js';

function sector(overrides: Partial<Sector> = {}): Sector {
  return {
    id: 'sector_1',
    name: 'Test Sector',
    flavor: '',
    alienStrength: 50,
    maxAlienStrength: 200,
    alienGrowthPerHour: 10,
    lastTickAt: 0,
    resourceYield: 10,
    scoutFuelCost: 5,
    stationTier: 1,
    stationPrice: 1000,
    plunderedByCharacterId: null,
    ...overrides,
  };
}

describe('settleAlienStrength', () => {
  it('grows proportionally to elapsed hours', () => {
    const s = sector({ alienStrength: 50, alienGrowthPerHour: 10, lastTickAt: 0 });
    expect(settleAlienStrength(s, 2 * 3_600_000)).toBeCloseTo(70, 5);
  });

  it('caps at maxAlienStrength', () => {
    const s = sector({ alienStrength: 50, maxAlienStrength: 200, alienGrowthPerHour: 10, lastTickAt: 0 });
    expect(settleAlienStrength(s, 1000 * 3_600_000)).toBe(200);
  });
});

const rngAt = (value: number) => () => value;

describe('resolveSectorAttack', () => {
  it('is deterministic for a fixed rng', () => {
    const a = resolveSectorAttack(100, 50, 80, rngAt(0.5));
    const b = resolveSectorAttack(100, 50, 80, rngAt(0.5));
    expect(a).toEqual(b);
  });

  it('clears the sector once damage meets or exceeds remaining strength', () => {
    const outcome = resolveSectorAttack(1000, 0, 10, rngAt(0.5));
    expect(outcome.cleared).toBe(true);
    expect(outcome.remainingStrength).toBe(0);
  });

  it('flags an outmatched attack and applies character damage', () => {
    const outcome = resolveSectorAttack(1, 0, 1000, rngAt(0.5));
    expect(outcome.outmatched).toBe(true);
    expect(outcome.characterDamage).toBeGreaterThan(0);
  });

  it('does not damage the character when reasonably matched', () => {
    const outcome = resolveSectorAttack(1000, 0, 10, rngAt(0.5));
    expect(outcome.outmatched).toBe(false);
    expect(outcome.characterDamage).toBe(0);
  });
});
