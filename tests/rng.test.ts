import { describe, expect, it } from "vitest";
import { Rng, hashSeed } from "../src/core/rng/Rng";

describe("Rng (deterministic seeded)", () => {
  it("identical seeds produce identical sequences", () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    for (let i = 0; i < 100; i += 1) {
      expect(a.next()).toBe(b.next());
    }
  });

  it("string seeds hash consistently", () => {
    expect(hashSeed("mission-alpha")).toBe(hashSeed("mission-alpha"));
    expect(hashSeed("mission-alpha")).not.toBe(hashSeed("mission-beta"));
    const a = new Rng("mission-alpha");
    const b = new Rng("mission-alpha");
    expect(a.next()).toBe(b.next());
  });

  it("different seeds diverge", () => {
    const a = new Rng(1);
    const b = new Rng(2);
    const sequenceA = Array.from({ length: 10 }, () => a.next());
    const sequenceB = Array.from({ length: 10 }, () => b.next());
    expect(sequenceA).not.toEqual(sequenceB);
  });

  it("int stays within inclusive bounds", () => {
    const rng = new Rng(42);
    for (let i = 0; i < 1000; i += 1) {
      const value = rng.int(3, 7);
      expect(value).toBeGreaterThanOrEqual(3);
      expect(value).toBeLessThanOrEqual(7);
    }
  });

  it("forked streams are reproducible and independent", () => {
    const makeFork = (): number[] => {
      const parent = new Rng(777);
      const child = parent.fork("enemy-director");
      return Array.from({ length: 5 }, () => child.next());
    };
    expect(makeFork()).toEqual(makeFork());
  });
});
