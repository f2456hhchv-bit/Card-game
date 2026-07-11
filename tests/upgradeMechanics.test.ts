import { describe, expect, it } from "vitest";
import { SANDBOX_UPGRADES } from "../src/game/progression/sandboxUpgrades";
import type { UpgradeDefinition } from "../src/game/progression/xpTuning";

/**
 * GP-FINAL §Level Ups — "Never offer boring percentage upgrades unless
 * attached to meaningful mechanics." The audit named Focused Coils/Rapid
 * Cycler/Precision Optics/Tuned Thrusters as exactly that violation: pure
 * stat numbers with zero build-shaping texture. Each now carries a SECOND
 * bonus using a previously-dormant BonusKind (statusChance/statusDuration/
 * criticalDamage/boostEfficiency) that main.ts wires into a real mechanic
 * (weapon status-on-hit, crit multiplier, the dash/boost cooldown) —
 * these tests guard the data shape; main.ts's interpreter wiring is
 * exercised live via the browser-verification step, not unit-testable
 * without importing the entry point (see sandboxUpgrades.ts's own header).
 */
describe("GP-FINAL §Level Ups — mechanic-attached secondary bonuses", () => {
  const effectsOf = (u: UpgradeDefinition) => (Array.isArray(u.effect) ? u.effect : u.effect ? [u.effect] : []);

  const cases: Array<{ id: string; primaryKind: string; secondaryKind: string }> = [
    { id: "damage", primaryKind: "damage", secondaryKind: "statusChance" },
    { id: "firerate", primaryKind: "cooldownReduction", secondaryKind: "statusDuration" },
    { id: "crit", primaryKind: "criticalChance", secondaryKind: "criticalDamage" },
    { id: "speed", primaryKind: "movementSpeed", secondaryKind: "boostEfficiency" },
  ];

  for (const { id, primaryKind, secondaryKind } of cases) {
    it(`${id} carries exactly two positive-value bonuses: ${primaryKind} + ${secondaryKind}`, () => {
      const upgrade = SANDBOX_UPGRADES.find((u) => u.id === id)!;
      const effects = effectsOf(upgrade);
      expect(effects).toHaveLength(2);
      expect(effects.map((e) => e!.kind).sort()).toEqual([primaryKind, secondaryKind].sort());
      for (const e of effects) expect(e!.value).toBeGreaterThan(0);
    });
  }

  it("Emergency Barrier and Collection Field are untouched — single-bonus, not flagged by the audit", () => {
    for (const id of ["barrier", "magnet"]) {
      const upgrade = SANDBOX_UPGRADES.find((u) => u.id === id)!;
      expect(Array.isArray(upgrade.effect)).toBe(false);
    }
  });

  it("every Passive-category entry still carries a single bonus — the array form is core-stat-only", () => {
    for (const upgrade of SANDBOX_UPGRADES.filter((u) => u.category === "passive")) {
      expect(Array.isArray(upgrade.effect)).toBe(false);
    }
  });
});
