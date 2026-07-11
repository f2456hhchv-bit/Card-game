import { describe, expect, it } from "vitest";
import { HAPTIC_EFFECTS, hapticEffectFor } from "../src/engine/input/hapticTuning";

describe("GP-001 §Game Feel — Controller vibration", () => {
  it("returns null when intensity is 0 (accessibility off-switch)", () => {
    expect(hapticEffectFor("criticalHit", 0)).toBeNull();
  });

  it("returns the full configured effect at intensity 1", () => {
    const effect = hapticEffectFor("eliteKill", 1);
    expect(effect).toEqual(HAPTIC_EFFECTS.eliteKill);
  });

  it("scales magnitudes proportionally at partial intensity, never touching duration", () => {
    const effect = hapticEffectFor("bossDefeated", 0.5);
    expect(effect).not.toBeNull();
    expect(effect!.durationMs).toBe(HAPTIC_EFFECTS.bossDefeated.durationMs);
    expect(effect!.strongMagnitude).toBeCloseTo(HAPTIC_EFFECTS.bossDefeated.strongMagnitude * 0.5);
    expect(effect!.weakMagnitude).toBeCloseTo(HAPTIC_EFFECTS.bossDefeated.weakMagnitude * 0.5);
  });

  it("never exceeds magnitude 1 even if intensity is boosted above 1", () => {
    const effect = hapticEffectFor("playerDefeated", 2);
    expect(effect!.strongMagnitude).toBeLessThanOrEqual(1);
    expect(effect!.weakMagnitude).toBeLessThanOrEqual(1);
  });

  it("larger-impact sources are configured with a larger magnitude than smaller ones", () => {
    expect(HAPTIC_EFFECTS.bossDefeated.strongMagnitude).toBeGreaterThan(HAPTIC_EFFECTS.criticalHit.strongMagnitude);
  });
});
