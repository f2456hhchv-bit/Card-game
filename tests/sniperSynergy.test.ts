import { describe, expect, it } from "vitest";
import { SNIPER_STILLNESS_DAMAGE_BONUS, SNIPER_STILLNESS_THRESHOLD_MS, sniperStillnessMultiplier } from "../src/game/enemies/sniperSynergy";

describe("GP-002 — Snipers punish standing still", () => {
  it("non-sniper roles are never affected, regardless of stillness", () => {
    expect(sniperStillnessMultiplier(["tank"], 999999)).toBe(1);
    expect(sniperStillnessMultiplier([], 999999)).toBe(1);
  });

  it("a sniper deals normal damage against a target that hasn't held still long enough", () => {
    expect(sniperStillnessMultiplier(["sniper"], 0)).toBe(1);
    expect(sniperStillnessMultiplier(["sniper"], SNIPER_STILLNESS_THRESHOLD_MS - 1)).toBe(1);
  });

  it("a sniper's bonus kicks in exactly at the threshold and beyond", () => {
    expect(sniperStillnessMultiplier(["sniper"], SNIPER_STILLNESS_THRESHOLD_MS)).toBe(1 + SNIPER_STILLNESS_DAMAGE_BONUS);
    expect(sniperStillnessMultiplier(["sniper"], SNIPER_STILLNESS_THRESHOLD_MS * 10)).toBe(1 + SNIPER_STILLNESS_DAMAGE_BONUS);
  });

  it("works alongside other roles — the sniper tag alone is what matters", () => {
    expect(sniperStillnessMultiplier(["sniper", "flanker"], SNIPER_STILLNESS_THRESHOLD_MS)).toBe(1 + SNIPER_STILLNESS_DAMAGE_BONUS);
  });
});
