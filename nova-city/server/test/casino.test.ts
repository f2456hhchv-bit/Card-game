import { describe, expect, it } from 'vitest';
import { flipCoin, spinSlots } from '../src/domain/casino.js';

const rngAt = (value: number) => () => value;
const seq = (values: number[]) => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};

describe('spinSlots', () => {
  it('pays out a big multiplier on a triple', () => {
    const result = spinSlots(100, rngAt(0));
    expect(result.reels[0]).toBe(result.reels[1]);
    expect(result.reels[1]).toBe(result.reels[2]);
    expect(result.multiplier).toBeGreaterThan(1);
    expect(result.payout).toBe(Math.round(100 * result.multiplier));
  });

  it('pays out a small multiplier on a pair', () => {
    const result = spinSlots(100, seq([0, 0, 0.99]));
    expect(result.reels[0]).toBe(result.reels[1]);
    expect(result.reels[2]).not.toBe(result.reels[0]);
    expect(result.multiplier).toBe(1.5);
    expect(result.payout).toBe(150);
  });

  it('pays out nothing on a miss', () => {
    const result = spinSlots(100, seq([0, 0.5, 0.99]));
    expect(new Set(result.reels).size).toBe(3);
    expect(result.multiplier).toBe(0);
    expect(result.payout).toBe(0);
  });

  it('never returns a negative payout', () => {
    for (let i = 0; i < 50; i++) {
      const result = spinSlots(50, Math.random);
      expect(result.payout).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('flipCoin', () => {
  it('pays out on a correct call', () => {
    const result = flipCoin(100, 'heads', rngAt(0));
    expect(result.result).toBe('heads');
    expect(result.won).toBe(true);
    expect(result.payout).toBe(190);
  });

  it('pays out nothing on a wrong call', () => {
    const result = flipCoin(100, 'heads', rngAt(0.9));
    expect(result.result).toBe('tails');
    expect(result.won).toBe(false);
    expect(result.payout).toBe(0);
  });
});
