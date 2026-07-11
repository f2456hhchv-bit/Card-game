import { describe, expect, it } from 'vitest';
import { trainingGain } from '../src/domain/training.js';

describe('trainingGain', () => {
  it('grants more gain for the same fuel at a lower current stat value', () => {
    const lowStatGain = trainingGain(0, 10);
    const highStatGain = trainingGain(500, 10);
    expect(lowStatGain).toBeGreaterThan(highStatGain);
  });

  it('scales up with more fuel spent at a fixed stat value', () => {
    const small = trainingGain(20, 5);
    const large = trainingGain(20, 50);
    expect(large).toBeGreaterThan(small);
  });

  it('never returns less than 1', () => {
    expect(trainingGain(100_000, 1)).toBeGreaterThanOrEqual(1);
  });
});
