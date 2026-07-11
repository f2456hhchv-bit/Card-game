import type { World } from "../World";
import type { UpgradeDef } from "../types";
import { UPGRADE_DEFS } from "../data/upgradeDefs";

/** Rolls 3 distinct upgrade choices for a level-up draft. Excludes upgrades
 * already at their max (5) stacks; the player's currently-owned weapon and
 * passive picks are favoured over fresh ones by weighting, matching the
 * "specialize or diversify" feel of the genre. */
export function rollUpgradeChoices(world: World): UpgradeDef[] {
  const ownedWeaponIds = new Set(world.player.weapons.map((w) => w.upgradeId));
  const ownedPassiveIds = new Set(Object.keys(world.player.passiveStacks));

  const available = UPGRADE_DEFS.filter((def) => {
    const owned = def.category === "weapon" ? world.player.weapons.find((w) => w.upgradeId === def.id) : undefined;
    const stack = def.category === "weapon" ? (owned?.stackCount ?? 0) : (world.player.passiveStacks[def.id] ?? 0);
    return stack < 5;
  });

  const weights = available.map((def) => {
    const isOwned = def.category === "weapon" ? ownedWeaponIds.has(def.id) : ownedPassiveIds.has(def.id);
    return isOwned ? 2.2 : 1;
  });

  const picks: UpgradeDef[] = [];
  const pool = [...available];
  const poolWeights = [...weights];
  const count = Math.min(3, pool.length);

  for (let i = 0; i < count; i++) {
    const chosen = world.rng.weighted(pool, poolWeights);
    const idx = pool.indexOf(chosen);
    picks.push(chosen);
    pool.splice(idx, 1);
    poolWeights.splice(idx, 1);
  }

  return picks;
}
