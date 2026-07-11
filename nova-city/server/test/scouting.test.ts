import { describe, expect, it } from 'vitest';
import { discountedScoutCost, navigatorRank } from '../src/domain/scouting.js';

describe('navigatorRank', () => {
  it('starts as a Novice Navigator with no discount', () => {
    expect(navigatorRank(0)).toEqual({ name: 'Novice Navigator', discountPct: 0 });
  });

  it('progresses as more sectors are scouted', () => {
    expect(navigatorRank(3).name).toBe('Charted Navigator');
    expect(navigatorRank(6).name).toBe('Veteran Navigator');
    expect(navigatorRank(10).name).toBe('Master Navigator');
  });
});

describe('discountedScoutCost', () => {
  it('applies no discount at rank zero', () => {
    expect(discountedScoutCost(20, 0)).toBe(20);
  });

  it('discounts proportionally to navigator rank', () => {
    expect(discountedScoutCost(20, 3)).toBe(16);
    expect(discountedScoutCost(20, 10)).toBe(10);
  });

  it('never goes below 1', () => {
    expect(discountedScoutCost(1, 10)).toBeGreaterThanOrEqual(1);
  });
});
