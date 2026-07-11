import { describe, expect, it } from "vitest";
import { PASSIVE_CATEGORIES, SANDBOX_PASSIVES, type PassiveCategory } from "../src/game/passives/passiveData";

/**
 * GP-004 §Content Engine — the audit found Passives existed only embedded
 * per weapon/ship/commander/equipment (AF-028's PassiveTrigger+EquipmentBonus),
 * with no independent, addressable content category. These tests guard the
 * new standalone registry: full category coverage, every entry carrying a
 * real, positive, well-typed effect, and no id collisions.
 */
describe("GP-004 §Content Engine — standalone Passive registry", () => {
  it("registers all 14 named passive categories from the spec", () => {
    expect(PASSIVE_CATEGORIES).toHaveLength(14);
    expect(new Set(PASSIVE_CATEGORIES).size).toBe(14);
  });

  it("every category has at least one real sandbox entry", () => {
    const covered = new Set(SANDBOX_PASSIVES.map((p) => p.category));
    for (const category of PASSIVE_CATEGORIES) {
      expect(covered.has(category as PassiveCategory)).toBe(true);
    }
  });

  it("every entry carries a positive bonus magnitude — never a zero-value placeholder", () => {
    for (const passive of SANDBOX_PASSIVES) {
      expect(passive.bonus.value).toBeGreaterThan(0);
    }
  });

  it("every id is unique", () => {
    const ids = SANDBOX_PASSIVES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("threshold, when present, is a valid health fraction", () => {
    for (const passive of SANDBOX_PASSIVES) {
      if (passive.threshold !== undefined) {
        expect(passive.threshold).toBeGreaterThan(0);
        expect(passive.threshold).toBeLessThanOrEqual(1);
      }
    }
  });
});

/**
 * GP-005 §Passives — the audit found `trigger` was never read anywhere:
 * every Passive applied as a flat permanent bonus at pickup regardless of
 * its stated trigger. main.ts's fix (applyUpgrade/firePassiveTrigger/
 * checkLowHealthPassives) only converts the INSTANT-EFFECT kinds
 * (shieldCapacity/shieldRegeneration) into real, repeatable triggered
 * procs — stat kinds correctly stay pickup-permanent, since re-firing them
 * on every trigger would compound unboundedly. These tests guard that
 * classification stays exhaustive and every instant-effect passive's
 * trigger is one the dispatcher actually handles (onKill/onCriticalHit/
 * onDamageTaken/onShieldBreak/onLowHealth) — a future passive using
 * onBossPresent/onMissionModifier would otherwise silently never fire.
 */
describe("GP-005 §Passives — instant-effect vs stat-kind classification stays exhaustive", () => {
  const DISPATCHABLE_TRIGGERS = ["onKill", "onCriticalHit", "onDamageTaken", "onShieldBreak", "onLowHealth"] as const;
  const instantEffectKinds = ["shieldCapacity", "shieldRegeneration"] as const;
  const instantEffectPassives = SANDBOX_PASSIVES.filter((p) => instantEffectKinds.includes(p.bonus.kind as never));

  it("exactly three sandbox passives are instant-effect (real triggered procs) — Hardened Plating, Guardian Ward, Nanite Mesh", () => {
    expect(instantEffectPassives.map((p) => p.id).sort()).toEqual(
      ["passive-guardian-ward", "passive-hardened-plating", "passive-nanite-mesh"].sort(),
    );
  });

  it("every instant-effect passive's trigger is one the dispatcher actually handles", () => {
    for (const passive of instantEffectPassives) {
      expect(DISPATCHABLE_TRIGGERS).toContain(passive.trigger);
    }
  });

  it("stat-kind passives (everything else) are NOT instant-effect kinds — the split is exhaustive, no overlap", () => {
    const statKindPassives = SANDBOX_PASSIVES.filter((p) => !instantEffectPassives.includes(p));
    for (const passive of statKindPassives) {
      expect(instantEffectKinds).not.toContain(passive.bonus.kind as never);
    }
    expect(statKindPassives.length + instantEffectPassives.length).toBe(SANDBOX_PASSIVES.length);
  });
});
