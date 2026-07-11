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
