/**
 * Deterministic, seedable pseudo-random number generator.
 *
 * Uses the `mulberry32` algorithm: small, fast, and good enough statistically
 * for gameplay. Determinism matters for reproducible playtests and any
 * seed-driven content, so the entire game routes randomness through this
 * rather than `Math.random()`.
 */
export class Rng {
  private state: number;

  constructor(seed: number = (Math.random() * 0xffffffff) >>> 0) {
    this.state = seed >>> 0;
  }

  /** Hash an arbitrary string into a 32-bit seed (e.g. a daily date string). */
  static seedFromString(str: string): number {
    // FNV-1a 32-bit
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /** Restore generator state (for save/replay). */
  setState(state: number): void {
    this.state = state >>> 0;
  }

  getState(): number {
    return this.state >>> 0;
  }

  /** Next float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** True with probability `p` (0..1). */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Random angle in radians [0, 2PI). */
  angle(): number {
    return this.next() * Math.PI * 2;
  }

  /** Pick a uniformly random element from a non-empty array. */
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** In-place Fisher–Yates shuffle. Returns the same array for convenience. */
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /**
   * Weighted pick. `weights[i]` is the relative weight of `items[i]`.
   * Weights need not be normalized. Returns the chosen item.
   */
  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r < 0) return items[i];
    }
    return items[items.length - 1];
  }
}
