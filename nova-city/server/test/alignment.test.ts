import { describe, expect, it } from 'vitest';
import { ALIGNMENT_MAX, ALIGNMENT_MIN, alignmentLabel, shiftAlignment } from '../src/domain/alignment.js';

describe('shiftAlignment', () => {
  it('applies the delta within range', () => {
    expect(shiftAlignment(0, 5)).toBe(5);
    expect(shiftAlignment(10, -8)).toBe(2);
  });

  it('clamps at the max', () => {
    expect(shiftAlignment(ALIGNMENT_MAX - 2, 10)).toBe(ALIGNMENT_MAX);
  });

  it('clamps at the min', () => {
    expect(shiftAlignment(ALIGNMENT_MIN + 2, -10)).toBe(ALIGNMENT_MIN);
  });
});

describe('alignmentLabel', () => {
  it('labels the extremes and the middle distinctly', () => {
    expect(alignmentLabel(100)).toBe('Beacon of the Frontier');
    expect(alignmentLabel(0)).toBe('Undecided');
    expect(alignmentLabel(-100)).toBe('Tyrant of the Reach');
  });
});
