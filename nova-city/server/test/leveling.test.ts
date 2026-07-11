import { describe, expect, it } from 'vitest';
import { applyXp, xpToNextLevel } from '../src/domain/leveling.js';

describe('applyXp', () => {
  it('accumulates xp without leveling up when under the threshold', () => {
    const result = applyXp(1, 0, 5);
    expect(result.level).toBe(1);
    expect(result.xp).toBe(5);
    expect(result.leveledUp).toBe(false);
  });

  it('levels up and carries remainder xp over', () => {
    const threshold = xpToNextLevel(1);
    const result = applyXp(1, 0, threshold + 10);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(10);
    expect(result.leveledUp).toBe(true);
  });

  it('can cascade multiple level-ups from a huge xp gain', () => {
    const result = applyXp(1, 0, 100_000);
    expect(result.level).toBeGreaterThan(2);
    expect(result.leveledUp).toBe(true);
  });
});
