import { describe, expect, it } from 'vitest';
import { tradeRank } from '../src/domain/trade.js';

describe('tradeRank', () => {
  it('starts as a Novice Trader with no bonus', () => {
    const rank = tradeRank(0);
    expect(rank.name).toBe('Novice Trader');
    expect(rank.sellBonusPct).toBe(0);
    expect(rank.unlocksContraband).toBe(false);
  });

  it('progresses through ranks as trades accumulate', () => {
    expect(tradeRank(15).name).toBe('Licensed Trader');
    expect(tradeRank(40).name).toBe('Black Market Contact');
    expect(tradeRank(80).name).toBe('Master Trader');
  });

  it('unlocks contraband only from Black Market Contact onward', () => {
    expect(tradeRank(39).unlocksContraband).toBe(false);
    expect(tradeRank(40).unlocksContraband).toBe(true);
  });

  it('never regresses below the highest tier reached', () => {
    expect(tradeRank(1000).name).toBe('Master Trader');
  });
});
