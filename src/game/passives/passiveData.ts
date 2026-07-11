/**
 * Standalone Passive registry (GP-004 §Content Engine). Passives previously
 * existed only embedded per weapon/ship/commander/equipment as
 * PassiveTrigger+EquipmentBonus (AF-028), with no independently addressable
 * top-level content category — the audit flagged that gap. This reuses that
 * SAME generic trigger+bonus vocabulary (no new mechanism invented) as its
 * own content type, wired into the real, tested level-up acquisition flow
 * (SANDBOX_UPGRADES / applyUpgrade in main.ts) rather than a disconnected
 * parallel system.
 */
import type { EquipmentBonus, PassiveTrigger } from "../equipment/equipmentData";

/** The spec's 14 named passive categories. */
export const PASSIVE_CATEGORIES = [
  "support",
  "defensive",
  "offensive",
  "utility",
  "movement",
  "economy",
  "cooldown",
  "critical",
  "summons",
  "shield",
  "healing",
  "xp",
  "loot",
  "synergy",
] as const;

export type PassiveCategory = (typeof PASSIVE_CATEGORIES)[number];

export interface PassiveDef {
  id: string;
  name: string;
  description: string;
  category: PassiveCategory;
  trigger: PassiveTrigger;
  bonus: EquipmentBonus;
  /** For onLowHealth — health fraction threshold. */
  threshold?: number;
}

/**
 * Sandbox roster — one real entry per category. Nine categories (offensive,
 * cooldown, critical, movement, shield, loot, healing, economy, xp) resolve
 * to a bonus kind with a real, already-wired runtime consumer (see
 * applyUpgrade's interpreter in main.ts). Support/defensive/utility
 * deliberately reuse those same wired kinds under different flavour/trigger
 * framing — a taxonomy tag, not a claim every category needs a bespoke
 * mechanic. Summons/synergy use BonusKind's own pre-existing
 * "registered future" kinds (droneEffectiveness/orbitalPower) honestly:
 * they await a drone/stacking-history system this module doesn't add.
 */
export const SANDBOX_PASSIVES: readonly PassiveDef[] = [
  {
    id: "passive-focus-fire",
    name: "Focus Fire",
    description: "Permanently boosts weapon damage.",
    category: "offensive",
    trigger: "onKill",
    bonus: { kind: "damage", value: 0.12 },
  },
  {
    id: "passive-overcharge-coils",
    name: "Overcharge Coils",
    description: "Reduces active-module cooldowns.",
    category: "cooldown",
    trigger: "onKill",
    bonus: { kind: "cooldownReduction", value: 0.06 },
  },
  {
    id: "passive-deadeye",
    name: "Deadeye",
    description: "Raises critical hit chance.",
    category: "critical",
    trigger: "onCriticalHit",
    bonus: { kind: "criticalChance", value: 0.05 },
  },
  {
    id: "passive-light-frame",
    name: "Light Frame",
    description: "Raises movement speed.",
    category: "movement",
    trigger: "onKill",
    bonus: { kind: "movementSpeed", value: 0.06 },
  },
  {
    id: "passive-hardened-plating",
    name: "Hardened Plating",
    description: "Raises barrier capacity on shield break.",
    category: "shield",
    trigger: "onShieldBreak",
    bonus: { kind: "shieldCapacity", value: 15 },
  },
  {
    id: "passive-wide-net",
    name: "Wide Net",
    description: "Extends the pickup magnet radius.",
    category: "loot",
    trigger: "onKill",
    bonus: { kind: "pickupRadius", value: 1.2 },
  },
  {
    id: "passive-nanite-mesh",
    name: "Nanite Mesh",
    description: "Restores hull when critically wounded.",
    category: "healing",
    trigger: "onLowHealth",
    bonus: { kind: "shieldRegeneration", value: 10 },
    threshold: 0.4,
  },
  {
    id: "passive-salvage-protocol",
    name: "Salvage Protocol",
    description: "Improves loot yield.",
    category: "economy",
    trigger: "onKill",
    bonus: { kind: "resourceGain", value: 0.08 },
  },
  {
    id: "passive-fast-learner",
    name: "Fast Learner",
    description: "Raises experience gained.",
    category: "xp",
    trigger: "onKill",
    bonus: { kind: "experienceGain", value: 0.1 },
  },
  {
    id: "passive-escort-link",
    name: "Escort Link",
    description: "Shortens active-module cooldowns further while wounded, backing up the pilot.",
    category: "support",
    trigger: "onLowHealth",
    bonus: { kind: "cooldownReduction", value: 0.05 },
    threshold: 0.5,
  },
  {
    id: "passive-guardian-ward",
    name: "Guardian Ward",
    description: "Raises barrier capacity on taking damage.",
    category: "defensive",
    trigger: "onDamageTaken",
    bonus: { kind: "shieldCapacity", value: 6 },
  },
  {
    id: "passive-signal-boost",
    name: "Signal Boost",
    description: "Extends the pickup magnet radius on a critical hit.",
    category: "utility",
    trigger: "onCriticalHit",
    bonus: { kind: "pickupRadius", value: 0.6 },
  },
  {
    id: "passive-drone-primer",
    name: "Drone Primer",
    description: "Improves future drone effectiveness. (Awaiting a drone system.)",
    category: "summons",
    trigger: "onKill",
    bonus: { kind: "droneEffectiveness", value: 0.1 },
  },
  {
    id: "passive-resonance",
    name: "Resonance",
    description: "Improves future orbital-weapon power. (Awaiting an orbital system.)",
    category: "synergy",
    trigger: "onKill",
    bonus: { kind: "orbitalPower", value: 0.1 },
  },
];
