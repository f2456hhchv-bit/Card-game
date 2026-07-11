import { describe, expect, it } from 'vitest';
import { canClaimDailyBonus, dailyBonusReward, stampDailyBonusDate } from '../src/domain/dailyBonus.js';

describe('canClaimDailyBonus', () => {
  it('allows a claim when nothing has been claimed yet', () => {
    expect(canClaimDailyBonus(null, Date.UTC(2026, 0, 1, 10))).toBe(true);
  });

  it('blocks a second claim on the same UTC day', () => {
    const now = Date.UTC(2026, 0, 1, 10);
    const claimedDate = stampDailyBonusDate(now);
    expect(canClaimDailyBonus(claimedDate, now + 3_600_000)).toBe(false);
  });

  it('allows a claim again on the next UTC day, regardless of hours elapsed', () => {
    const claimedDate = stampDailyBonusDate(Date.UTC(2026, 0, 1, 23, 55));
    const nextDay = Date.UTC(2026, 0, 2, 0, 5);
    expect(canClaimDailyBonus(claimedDate, nextDay)).toBe(true);
  });
});

describe('dailyBonusReward', () => {
  it('scales gently with level', () => {
    const low = dailyBonusReward(1);
    const high = dailyBonusReward(10);
    expect(high.credits).toBeGreaterThan(low.credits);
    expect(high.fuel).toBe(low.fuel);
  });
});
