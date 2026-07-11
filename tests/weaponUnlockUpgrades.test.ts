import { describe, expect, it } from "vitest";
import { SANDBOX_UPGRADES, WEAPON_UNLOCK_UPGRADES } from "../src/game/progression/sandboxUpgrades";
import { LAUNCH_ARSENAL, STARTING_WEAPON_IDS } from "../src/game/weapons/weaponRosterData";
import { SANDBOX_WEAPONS } from "../src/game/weapons/weaponData";

/**
 * GP-FINAL §Build Philosophy — the 6-weapon loadout's real acquisition
 * point. The starting weapon (SANDBOX_WEAPONS[0]) plus these five unlocks
 * reach the spec's cap of six; each references a real LAUNCH_ARSENAL
 * weapon and carries no `effect` (applyUpgrade in main.ts dispatches them
 * through addEquippedWeapon instead of the EquipmentBonus interpreter).
 */
describe("GP-FINAL §Build Philosophy — weapon-unlock upgrade roster", () => {
  it("the starting weapon plus the unlock roster reaches exactly six", () => {
    expect(1 + WEAPON_UNLOCK_UPGRADES.length).toBe(6);
  });

  it("every unlock references a real, distinct LAUNCH_ARSENAL weapon", () => {
    const weaponIds = WEAPON_UNLOCK_UPGRADES.map((u) => u.weaponId);
    expect(new Set(weaponIds).size).toBe(weaponIds.length);
    for (const weaponId of weaponIds) {
      expect(LAUNCH_ARSENAL.some((w) => w.id === weaponId)).toBe(true);
    }
  });

  it("no unlock targets the starting weapon — acquiring it again would be a no-op", () => {
    for (const unlock of WEAPON_UNLOCK_UPGRADES) {
      expect(STARTING_WEAPON_IDS).not.toContain(unlock.weaponId);
      expect(unlock.weaponId).not.toBe(SANDBOX_WEAPONS[0]!.id);
    }
  });

  it("each unlock has exactly one matching SANDBOX_UPGRADES entry, category weaponEvolution, maxStacks 1, no effect", () => {
    for (const unlock of WEAPON_UNLOCK_UPGRADES) {
      const matches = SANDBOX_UPGRADES.filter((u) => u.id === unlock.id);
      expect(matches).toHaveLength(1);
      const def = matches[0]!;
      expect(def.category).toBe("weaponEvolution");
      expect(def.maxStacks).toBe(1);
      expect(def.effect).toBeUndefined();
      expect(def.weight).toBeGreaterThan(0);
    }
  });

  it("every SANDBOX_UPGRADES id is unique — the new unlock entries don't collide with existing content", () => {
    const ids = SANDBOX_UPGRADES.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
