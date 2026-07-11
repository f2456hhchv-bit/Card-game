/**
 * Sandbox level-up offer roster (AF-022 §5 / GP-004 §Content Engine). Pure
 * data — extracted from main.ts (GP-005 §Balance) so its own numeric
 * balance is independently testable without importing the entry point.
 */
import { SANDBOX_PASSIVES } from "../passives/passiveData";
import { LAUNCH_ARSENAL } from "../weapons/weaponRosterData";
import type { UpgradeDefinition } from "./xpTuning";

/**
 * GP-FINAL §Build Philosophy: real acquisition points for the 6-weapon
 * loadout — one upgrade offer per bonus weapon (the starting Coil Ripper
 * plus these five reaches the spec's cap of six). Dispatched through
 * addEquippedWeapon (main.ts) rather than the EquipmentBonus/BonusKind
 * interpreter, since "add a weapon to the loadout" isn't a stat bonus and
 * doesn't need to become one — mirrors how instant-effect Passives already
 * bypass that same interpreter for their own real trigger.
 */
const WEAPON_UNLOCK_WEAPON_IDS = ["novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array"] as const;

export const WEAPON_UNLOCK_UPGRADES: readonly { id: string; weaponId: string }[] = WEAPON_UNLOCK_WEAPON_IDS.map(
  (weaponId) => ({ id: `weapon-unlock-${weaponId}`, weaponId }),
);

/**
 * GP-FINAL §Level Ups: "Never offer boring percentage upgrades unless
 * attached to meaningful mechanics." The audit named these four ("+15%
 * weapon damage" its own cited example) as exactly the violation — pure
 * stat numbers with zero build-shaping texture, unlike Emergency Barrier
 * (a real barrier-mechanic amount) or Collection Field (changes positioning
 * play), which the audit did not flag. Each now carries a SECOND bonus —
 * `effect` widened to accept an array (see xpTuning.ts) — using a BonusKind
 * that was registered in AF-028 but had no consumer anywhere until this:
 * statusChance/statusDuration (weapon status-on-hit, main.ts hit
 * resolution), criticalDamage (playerPacket's critMultiplier), and
 * boostEfficiency (PlayerMovement's real dash/i-frame mechanic). The
 * primary stat values are unchanged from GP-005's balance pass.
 */
export const SANDBOX_UPGRADES: UpgradeDefinition[] = [
  {
    id: "damage",
    category: "weaponUpgrade",
    name: "Focused Coils",
    description: "+15% weapon damage, +3% status-on-hit chance",
    weight: 10,
    maxStacks: 5,
    effect: [{ kind: "damage", value: 0.15 }, { kind: "statusChance", value: 0.03 }],
  },
  // GP-005 §Balance: was 0.14 (compounding) — at 5/5 stacks that's ~2.13x DPS
  // against Focused Coils' ~1.75x for the same weight/maxStacks/cost, a
  // strict dominant strategy with no offsetting tradeoff. 0.10 brings max-
  // stack power to near-parity (~1.69x) without touching the shared
  // cooldownReduction formula (also used by 2 Passives) or Focused Coils'
  // own additive value — see tests/upgradeBalance.test.ts.
  {
    id: "firerate",
    category: "weaponUpgrade",
    name: "Rapid Cycler",
    description: "+10% fire rate, +300ms status-on-hit duration",
    weight: 10,
    maxStacks: 5,
    effect: [{ kind: "cooldownReduction", value: 0.1 }, { kind: "statusDuration", value: 300 }],
  },
  {
    id: "crit",
    category: "critical",
    name: "Precision Optics",
    description: "+5% critical chance, +10% critical damage",
    weight: 6,
    maxStacks: 4,
    effect: [{ kind: "criticalChance", value: 0.05 }, { kind: "criticalDamage", value: 0.1 }],
  },
  {
    id: "speed",
    category: "movement",
    name: "Tuned Thrusters",
    description: "+8% movement speed, 12% shorter boost cooldown",
    weight: 6,
    maxStacks: 5,
    effect: [{ kind: "movementSpeed", value: 0.08 }, { kind: "boostEfficiency", value: 0.12 }],
  },
  { id: "barrier", category: "shield", name: "Emergency Barrier", description: "+20 barrier now", weight: 5, maxStacks: null, effect: { kind: "shieldCapacity", value: 20 } },
  { id: "magnet", category: "resource", name: "Collection Field", description: "+1.5 magnet radius", weight: 4, maxStacks: 3, effect: { kind: "pickupRadius", value: 1.5 } },
  // GP-004 §Content Engine: the standalone Passive registry, offered through
  // this same real, tested acquisition flow — not a disconnected parallel
  // system. Each carries `category: "passive"` (already registered in
  // UPGRADE_CATEGORIES) plus its own taxonomy sub-category for future filtering.
  ...SANDBOX_PASSIVES.map((passive) => ({
    id: passive.id,
    category: "passive" as const,
    name: passive.name,
    description: passive.description,
    weight: 5,
    maxStacks: 5,
    effect: passive.bonus,
  })),
  // GP-FINAL §Build Philosophy: no `effect` — applyUpgrade (main.ts) dispatches
  // these through WEAPON_UNLOCK_UPGRADES instead, calling addEquippedWeapon.
  ...WEAPON_UNLOCK_UPGRADES.map((unlock) => {
    const weapon = LAUNCH_ARSENAL.find((w) => w.id === unlock.weaponId)!;
    return {
      id: unlock.id,
      category: "weaponEvolution" as const,
      name: `Salvaged ${weapon.name}`,
      description: `Adds the ${weapon.name} to your loadout — it fires independently alongside your other weapons.`,
      weight: 4,
      maxStacks: 1,
    };
  }),
];
