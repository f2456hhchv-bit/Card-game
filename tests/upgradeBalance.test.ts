import { describe, expect, it } from "vitest";
import { SANDBOX_UPGRADES } from "../src/game/progression/sandboxUpgrades";

/**
 * GP-005 §Balance — the audit found Rapid Cycler (cooldownReduction,
 * compounding) strictly dominated Focused Coils (damage, additive) at
 * every stack ≥2 despite identical weight/maxStacks/cost: ~2.13x DPS vs
 * ~1.75x at 5/5 stacks, no offsetting tradeoff. Rapid Cycler's per-stack
 * value was rebalanced (0.14 → 0.10) to bring max-stack power to near
 * parity. This test hardcodes the SAME two formulas applyUpgrade's
 * interpreter implements (additive for "damage", compounding for
 * "cooldownReduction" — see main.ts) so a future value change that
 * reopens the dominance gap fails here rather than shipping silently.
 */
describe("GP-005 §Balance — Rapid Cycler no longer strictly dominates Focused Coils", () => {
  const focusedCoils = SANDBOX_UPGRADES.find((u) => u.id === "damage")!;
  const rapidCycler = SANDBOX_UPGRADES.find((u) => u.id === "firerate")!;

  it("both cost the same weight and maxStacks — a fair comparison", () => {
    expect(focusedCoils.weight).toBe(rapidCycler.weight);
    expect(focusedCoils.maxStacks).toBe(rapidCycler.maxStacks);
  });

  it("at every stack count up to max, Rapid Cycler's DPS multiplier never meaningfully exceeds Focused Coils'", () => {
    const maxStacks = focusedCoils.maxStacks!;
    for (let stacks = 1; stacks <= maxStacks; stacks += 1) {
      const damageMultiplier = 1 + focusedCoils.effect!.value * stacks;
      const fireIntervalScale = (1 - rapidCycler.effect!.value) ** stacks;
      const rateMultiplier = 1 / fireIntervalScale;
      expect(rateMultiplier).toBeLessThanOrEqual(damageMultiplier * 1.05); // no more than a 5% edge — not a dominant strategy
    }
  });

  it("at max stacks, both land within 10% of each other — no strict dominance either way", () => {
    const maxStacks = focusedCoils.maxStacks!;
    const damageMultiplier = 1 + focusedCoils.effect!.value * maxStacks;
    const rateMultiplier = 1 / (1 - rapidCycler.effect!.value) ** maxStacks;
    const ratio = rateMultiplier / damageMultiplier;
    expect(ratio).toBeGreaterThan(0.9);
    expect(ratio).toBeLessThan(1.1);
  });
});
