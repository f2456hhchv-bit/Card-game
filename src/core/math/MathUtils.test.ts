import { describe, it, expect } from "vitest";
import {
  clamp,
  clamp01,
  lerp,
  inverseLerp,
  remap,
  angleDelta,
  approxEqual,
  TAU,
} from "./MathUtils";

describe("MathUtils", () => {
  it("clamp bounds a value", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it("clamp01 bounds to [0,1]", () => {
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(2)).toBe(1);
  });

  it("lerp interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("inverseLerp is the inverse of lerp", () => {
    expect(inverseLerp(10, 20, 15)).toBeCloseTo(0.5);
    expect(inverseLerp(5, 5, 5)).toBe(0); // degenerate range
  });

  it("remap moves a value between ranges", () => {
    expect(remap(5, 0, 10, 0, 100)).toBeCloseTo(50);
  });

  it("angleDelta returns the shortest signed difference", () => {
    expect(approxEqual(angleDelta(0, Math.PI / 2), Math.PI / 2)).toBe(true);
    // Wrapping past TAU should still be a small delta.
    const d = angleDelta(0.1, TAU - 0.1);
    expect(Math.abs(d)).toBeLessThan(0.3);
  });
});
