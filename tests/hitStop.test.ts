import { describe, expect, it } from "vitest";
import { HitStopController } from "../src/engine/feel/HitStop";
import { DEFAULT_HITSTOP_TUNING } from "../src/engine/feel/hitStopTuning";

describe("HitStopController — GP-001 §Game Feel", () => {
  it("is inactive until triggered", () => {
    const hitStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    expect(hitStop.isActive).toBe(false);
    expect(hitStop.tick(16)).toBe(false);
  });

  it("freezes for the source's own configured duration, then releases", () => {
    const hitStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    hitStop.trigger("criticalHit");
    expect(hitStop.isActive).toBe(true);
    const duration = DEFAULT_HITSTOP_TUNING.durations.criticalHit;
    let remaining = duration;
    while (remaining > 0) {
      const frozen = hitStop.tick(5);
      expect(frozen).toBe(true);
      remaining -= 5;
    }
    expect(hitStop.tick(5)).toBe(false);
    expect(hitStop.isActive).toBe(false);
  });

  it("stacks impulses within the same window but never past the clarity cap", () => {
    const hitStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    for (let i = 0; i < 20; i += 1) hitStop.trigger("bossDefeated");
    expect(hitStop.remainingStopMs).toBe(DEFAULT_HITSTOP_TUNING.maxStopMs);
  });

  it("larger-impact sources freeze longer than smaller ones", () => {
    const critStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    critStop.trigger("criticalHit");
    const bossStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    bossStop.trigger("bossDefeated");
    expect(bossStop.remainingStopMs).toBeGreaterThan(critStop.remainingStopMs);
  });

  it("intensityScale of 0 disables hit-stop entirely (accessibility)", () => {
    const hitStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    hitStop.intensityScale = 0;
    hitStop.trigger("playerDefeated");
    expect(hitStop.isActive).toBe(false);
  });

  it("intensityScale scales the impulse proportionally", () => {
    const hitStop = new HitStopController(DEFAULT_HITSTOP_TUNING);
    hitStop.intensityScale = 0.5;
    hitStop.trigger("eliteKill");
    expect(hitStop.remainingStopMs).toBeCloseTo(DEFAULT_HITSTOP_TUNING.durations.eliteKill * 0.5);
  });
});
