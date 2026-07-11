import { describe, expect, it } from "vitest";
import { MISSION_MODIFIER_KINDS, SANDBOX_MISSIONS } from "../src/game/missions/missionData";
import { FRAMEWORK_MISSIONS } from "../src/game/missions/missionFrameworkData";

const GP_003_NEW_MODIFIER_KINDS = [
  "meteorStorm",
  "solarRadiation",
  "blackHoleDistortion",
  "electricalNebula",
  "frozenSector",
  "toxicClouds",
  "darkMatter",
  "ancientBattlefield",
  "civilianEvacuation",
] as const;

describe("GP-003 §Mission Modifiers — the spec's named list, additive over the existing 10", () => {
  it("registers all nine newly-added modifier kinds on MISSION_MODIFIER_KINDS without disturbing the original ten", () => {
    for (const kind of GP_003_NEW_MODIFIER_KINDS) expect(MISSION_MODIFIER_KINDS).toContain(kind);
    expect(MISSION_MODIFIER_KINDS).toContain("lowGravity"); // the one pre-existing verbatim match, untouched
    expect(MISSION_MODIFIER_KINDS.length).toBe(19); // 10 original + 9 new
  });

  it("every new modifier kind is genuinely selectable — present in at least one real mission's modifierPool", () => {
    const allPooledKinds = new Set(FRAMEWORK_MISSIONS.flatMap((m) => m.modifierPool.map((mod) => mod.kind)));
    for (const kind of GP_003_NEW_MODIFIER_KINDS) expect(allPooledKinds.has(kind)).toBe(true);
  });

  it("every new modifier carries real, non-trivial mechanical deltas (never a flavour-only entry)", () => {
    for (const mission of FRAMEWORK_MISSIONS) {
      for (const modifier of mission.modifierPool) {
        if (!(GP_003_NEW_MODIFIER_KINDS as readonly string[]).includes(modifier.kind)) continue;
        const totalDelta =
          Math.abs(modifier.mutatorModifierDelta) +
          Math.abs(modifier.lootMutatorBonusDelta) +
          Math.abs(modifier.eliteSquadSizeDelta) +
          Math.abs(modifier.rewardMultiplierDelta);
        expect(totalDelta).toBeGreaterThan(0);
      }
    }
  });

  it("the Crystal Fields Incursion sandbox mission carries three of the new modifiers", () => {
    const crystalFields = SANDBOX_MISSIONS[0]!;
    const kinds = crystalFields.modifierPool.map((m) => m.kind);
    expect(kinds).toContain("meteorStorm");
    expect(kinds).toContain("solarRadiation");
    expect(kinds).toContain("civilianEvacuation");
  });
});
