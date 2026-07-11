import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, unlockedAchievementIds } from '../src/domain/achievements.js';

const baseInput = {
  level: 1,
  totalTrainedStats: 40,
  tradesCompleted: 0,
  sectorsExplored: 0,
  shipCount: 1,
  stationCount: 0,
  sectorsControlled: 0,
  alignment: 0,
  credits: 250,
};

describe('unlockedAchievementIds', () => {
  it('unlocks nothing for a brand-new character', () => {
    expect(unlockedAchievementIds(baseInput)).toEqual([]);
  });

  it('unlocks achievements whose thresholds are met', () => {
    const unlocked = unlockedAchievementIds({ ...baseInput, level: 6, tradesCompleted: 20 });
    expect(unlocked).toContain('first-blood');
    expect(unlocked).toContain('seasoned-pilot');
    expect(unlocked).toContain('licensed-trader');
    expect(unlocked).not.toContain('veteran-commander');
    expect(unlocked).not.toContain('black-market-contact');
  });

  it('supports both alignment extremes independently', () => {
    expect(unlockedAchievementIds({ ...baseInput, alignment: 60 })).toContain('steward-of-light');
    expect(unlockedAchievementIds({ ...baseInput, alignment: -60 })).toContain('warlord-of-the-dark');
    expect(unlockedAchievementIds({ ...baseInput, alignment: 60 })).not.toContain('warlord-of-the-dark');
  });

  it('every defined achievement has a positive reward and unique id', () => {
    const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
    expect(ids.size).toBe(ACHIEVEMENTS.length);
    for (const a of ACHIEVEMENTS) expect(a.reward).toBeGreaterThan(0);
  });
});
