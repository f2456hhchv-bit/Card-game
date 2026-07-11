import { describe, expect, it } from 'vitest';
import { crimeSuccessChance, resolveCrime } from '../src/domain/crimes.js';
import type { Crime } from '../src/types.js';

const crime: Crime = {
  id: 'crime-test',
  name: 'Test Crime',
  flavor: '',
  locationId: null,
  fuelCost: 10,
  difficulty: 0.3,
  primaryStats: ['dexterity'],
  minReward: 50,
  maxReward: 100,
  jailMinutes: 5,
  xp: 10,
};

describe('crimeSuccessChance', () => {
  it('increases with the relevant stat', () => {
    const weak = crimeSuccessChance({ strength: 0, defense: 0, speed: 0, dexterity: 5 }, 50, crime);
    const strong = crimeSuccessChance({ strength: 0, defense: 0, speed: 0, dexterity: 500 }, 50, crime);
    expect(strong).toBeGreaterThan(weak);
  });

  it('stays within [0.05, 0.95]', () => {
    const min = crimeSuccessChance({ strength: 0, defense: 0, speed: 0, dexterity: 0 }, 0, {
      ...crime,
      difficulty: 1,
    });
    const max = crimeSuccessChance({ strength: 0, defense: 0, speed: 0, dexterity: 100_000 }, 100, {
      ...crime,
      difficulty: 0,
    });
    expect(min).toBeGreaterThanOrEqual(0.05);
    expect(max).toBeLessThanOrEqual(0.95);
  });
});

describe('resolveCrime', () => {
  const stats = { strength: 10, defense: 10, speed: 10, dexterity: 10 };

  it('succeeds and grants full reward when the roll beats the chance', () => {
    const result = resolveCrime(stats, 50, crime, () => 0);
    expect(result.success).toBe(true);
    expect(result.reward).toBeGreaterThanOrEqual(crime.minReward);
    expect(result.reward).toBeLessThanOrEqual(crime.maxReward);
    expect(result.jailMinutes).toBe(0);
  });

  it('fails and risks jail time when the roll loses to the chance', () => {
    const result = resolveCrime(stats, 50, crime, () => 0.999);
    expect(result.success).toBe(false);
    expect(result.reward).toBe(0);
    expect(result.jailMinutes).toBe(crime.jailMinutes);
  });
});
