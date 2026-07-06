/**
 * Deterministic seeded RNG (mulberry32). One seed reproduces one run
 * (AF-001 determinism; AF-016 §4 mission seed). Never use Math.random()
 * inside the simulation.
 */
export function hashSeed(text: string): number {
  // xmur3 string hash — spreads short human-readable seeds across 32 bits.
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export class Rng {
  private state: number;

  constructor(seed: number | string) {
    this.state = (typeof seed === "string" ? hashSeed(seed) : seed >>> 0) || 1;
  }

  /** Uniform float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform integer in [minInclusive, maxInclusive]. */
  int(minInclusive: number, maxInclusive: number): number {
    return minInclusive + Math.floor(this.next() * (maxInclusive - minInclusive + 1));
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("Rng.pick: empty array");
    const index = this.int(0, items.length - 1);
    const item = items[index];
    if (item === undefined && !(index in items)) throw new Error("Rng.pick: sparse array");
    return item as T;
  }

  /**
   * Derive an independent, reproducible child stream (e.g. one per system)
   * so consumption order in one system never perturbs another.
   */
  fork(label: string): Rng {
    return new Rng((hashSeed(label) ^ Math.floor(this.next() * 4294967296)) >>> 0);
  }
}
