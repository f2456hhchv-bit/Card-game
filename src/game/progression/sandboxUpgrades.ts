/**
 * Sandbox level-up offer roster (AF-022 §5 / GP-004 §Content Engine). Pure
 * data — extracted from main.ts (GP-005 §Balance) so its own numeric
 * balance is independently testable without importing the entry point.
 */
import { SANDBOX_PASSIVES } from "../passives/passiveData";
import type { UpgradeDefinition } from "./xpTuning";

export const SANDBOX_UPGRADES: UpgradeDefinition[] = [
  { id: "damage", category: "weaponUpgrade", name: "Focused Coils", description: "+15% weapon damage", weight: 10, maxStacks: 5, effect: { kind: "damage", value: 0.15 } },
  // GP-005 §Balance: was 0.14 (compounding) — at 5/5 stacks that's ~2.13x DPS
  // against Focused Coils' ~1.75x for the same weight/maxStacks/cost, a
  // strict dominant strategy with no offsetting tradeoff. 0.10 brings max-
  // stack power to near-parity (~1.69x) without touching the shared
  // cooldownReduction formula (also used by 2 Passives) or Focused Coils'
  // own additive value — see tests/upgradeBalance.test.ts.
  { id: "firerate", category: "weaponUpgrade", name: "Rapid Cycler", description: "+10% fire rate", weight: 10, maxStacks: 5, effect: { kind: "cooldownReduction", value: 0.1 } },
  { id: "crit", category: "critical", name: "Precision Optics", description: "+5% critical chance", weight: 6, maxStacks: 4, effect: { kind: "criticalChance", value: 0.05 } },
  { id: "speed", category: "movement", name: "Tuned Thrusters", description: "+8% movement speed", weight: 6, maxStacks: 5, effect: { kind: "movementSpeed", value: 0.08 } },
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
];
