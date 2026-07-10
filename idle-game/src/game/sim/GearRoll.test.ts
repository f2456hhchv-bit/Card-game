import { describe, it, expect } from "vitest";
import { Rng } from "../../core/math/Rng";
import { rollGear, isBetterGear, gearPower } from "./GearRoll";

describe("rollGear", () => {
  it("is deterministic for a given rng seed", () => {
    const a = rollGear(10, new Rng(42), 1);
    const b = rollGear(10, new Rng(42), 1);
    expect(a).toEqual(b);
  });

  it("produces higher-value items at higher stages on average", () => {
    const rng = new Rng(7);
    let lowTotal = 0;
    let highTotal = 0;
    for (let i = 0; i < 200; i++) {
      lowTotal += gearPower(rollGear(1, rng, i));
      highTotal += gearPower(rollGear(100, rng, 1000 + i));
    }
    expect(highTotal).toBeGreaterThan(lowTotal);
  });
});

describe("isBetterGear", () => {
  it("treats any item as better than nothing equipped", () => {
    const item = rollGear(1, new Rng(1), 1);
    expect(isBetterGear(item, null)).toBe(true);
  });

  it("prefers the higher-power item", () => {
    const weak = rollGear(1, new Rng(1), 1);
    const strong = rollGear(200, new Rng(1), 2);
    expect(isBetterGear(strong, weak)).toBe(true);
    expect(isBetterGear(weak, strong)).toBe(false);
  });
});
