import { describe, it, expect } from "vitest";
import { Rng } from "./Rng";

describe("Rng", () => {
  it("is deterministic for a given seed", () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    for (let i = 0; i < 100; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it("produces different streams for different seeds", () => {
    const a = new Rng(1);
    const b = new Rng(2);
    const av = Array.from({ length: 10 }, () => a.next());
    const bv = Array.from({ length: 10 }, () => b.next());
    expect(av).not.toEqual(bv);
  });

  it("keeps next() within [0,1)", () => {
    const r = new Rng(99);
    for (let i = 0; i < 1000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("int() respects inclusive bounds", () => {
    const r = new Rng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("seedFromString is stable and case-sensitive", () => {
    expect(Rng.seedFromString("2026-06-28")).toBe(Rng.seedFromString("2026-06-28"));
    expect(Rng.seedFromString("a")).not.toBe(Rng.seedFromString("A"));
  });

  it("weighted() never selects a zero-weight item", () => {
    const r = new Rng(42);
    const items = ["a", "b", "c"];
    const weights = [0, 5, 0];
    for (let i = 0; i < 200; i++) {
      expect(r.weighted(items, weights)).toBe("b");
    }
  });

  it("getState/setState round-trips the stream", () => {
    const r = new Rng(555);
    r.next();
    const state = r.getState();
    const expected = r.next();
    r.setState(state);
    expect(r.next()).toBe(expected);
  });
});
