import { describe, expect, it } from "vitest";
import { METEOR_SHOWER_TUNING, createMeteorImpact } from "../src/game/director/meteorShower";
import { isInsideHazard, stepHazardZone } from "../src/game/bosses/BossArena";

describe("GP-002 §Events — Meteor Shower", () => {
  it("createMeteorImpact produces a real hazard zone at the given position", () => {
    const impact = createMeteorImpact("meteor-1", 5, -2);
    expect(impact.x).toBe(5);
    expect(impact.y).toBe(-2);
    expect(impact.radius).toBe(METEOR_SHOWER_TUNING.radius);
    expect(impact.damagePerTick).toBe(METEOR_SHOWER_TUNING.damagePerTick);
  });

  it("ticks and damages through the exact same shared hazard engine every other event/mine uses", () => {
    const impact = createMeteorImpact("meteor-2", 0, 0);
    const state = { tickClockMs: 0 };
    expect(isInsideHazard(impact, 0.5, 0.5)).toBe(true);
    expect(isInsideHazard(impact, 100, 100)).toBe(false);
    expect(stepHazardZone(impact, state, METEOR_SHOWER_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(impact, state, 1)).toBe(true);
  });
});
