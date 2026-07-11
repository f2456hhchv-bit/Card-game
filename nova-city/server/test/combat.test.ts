import { describe, expect, it } from 'vitest';
import { combatRating, hospitalMinutesFor, resolveCombat, salvageCredits } from '../src/domain/combat.js';

const rngAt = (value: number) => () => value;

describe('combatRating', () => {
  it('rewards higher stats with a higher rating', () => {
    const weak = combatRating({ strength: 1, defense: 1, speed: 1, dexterity: 1 });
    const strong = combatRating({ strength: 50, defense: 50, speed: 50, dexterity: 50 });
    expect(strong).toBeGreaterThan(weak);
  });
});

describe('resolveCombat', () => {
  it('is deterministic for a fixed rng', () => {
    const attacker = { strength: 20, defense: 10, speed: 10, dexterity: 10 };
    const defender = { strength: 5, defense: 5, speed: 5, dexterity: 5 };
    const a = resolveCombat(attacker, defender, rngAt(0.5));
    const b = resolveCombat(attacker, defender, rngAt(0.5));
    expect(a).toEqual(b);
  });

  it('lets a much stronger attacker win at the same roll', () => {
    const attacker = { strength: 100, defense: 100, speed: 100, dexterity: 100 };
    const defender = { strength: 1, defense: 1, speed: 1, dexterity: 1 };
    const outcome = resolveCombat(attacker, defender, rngAt(0.5));
    expect(outcome.winner).toBe('attacker');
  });
});

describe('hospitalMinutesFor and salvageCredits', () => {
  it('produces a positive, capped hospital stay', () => {
    const outcome = resolveCombat(
      { strength: 200, defense: 200, speed: 200, dexterity: 200 },
      { strength: 1, defense: 1, speed: 1, dexterity: 1 },
      rngAt(0.5),
    );
    const minutes = hospitalMinutesFor(outcome);
    expect(minutes).toBeGreaterThan(0);
    expect(minutes).toBeLessThanOrEqual(30);
  });

  it('caps salvage credits', () => {
    expect(salvageCredits(1_000_000)).toBe(500);
    expect(salvageCredits(1000)).toBe(50);
  });
});
