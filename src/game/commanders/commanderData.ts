/**
 * Commander data shapes (AF-030). The four-hook signature reuses AF-028's
 * PassiveTrigger/EquipmentBonus/ActiveModule vocabularies — only the
 * ultimate's charge-gated model is new (GP-FINAL's "memorable moment").
 */
import type { ActiveModule, EquipmentBonus, PassiveTrigger } from "../equipment/equipmentData";

export const COMMANDER_ARCHETYPES = [
  "assault",
  "guardian",
  "engineer",
  "recon",
  "support",
  "voidSpecialist",
  "droneCommander",
  "orbitalCommander",
  "crystalSpecialist",
  "prototypePilot",
] as const;

export type CommanderArchetype = (typeof COMMANDER_ARCHETYPES)[number];

export interface CommanderPassive {
  trigger: PassiveTrigger;
  bonus: EquipmentBonus;
  /** For onLowHealth — health fraction threshold. */
  threshold?: number;
}

/**
 * GP-004 §Content Engine / §Commanders: "Commanders should meaningfully
 * affect runs" — the audit found ultimate activation was presentation-only
 * (camera shake + toast) for every commander regardless of which one, with
 * no data field anywhere describing what an ultimate actually DOES. This
 * is the generic interpreter: any of 500+ future commanders becomes
 * mechanically distinct just by setting `effect` on their own def — zero
 * main.ts changes required, the same "generic enum, not per-id code"
 * discipline every other content category in this codebase already uses.
 */
export const COMMANDER_ULTIMATE_EFFECT_KINDS = ["novaDamage", "barrierBurst", "healBurst"] as const;
export type CommanderUltimateEffectKind = (typeof COMMANDER_ULTIMATE_EFFECT_KINDS)[number];

export interface CommanderUltimateEffect {
  kind: CommanderUltimateEffectKind;
  /** Meaning depends on kind: nova damage amount / barrier amount / heal amount. */
  value: number;
  /** novaDamage only — the AoE radius centred on the player. */
  radius?: number;
}

export interface CommanderUltimate {
  id: string;
  name: string;
  /** Charge required to activate (charge accrues from combat facts). */
  chargeRequired: number;
  /** Charge gained per kill / per point of damage dealt. */
  chargePerKill: number;
  chargePerDamage: number;
  /** Optional — absent means the generic default (a modest novaDamage burst)
   * applies, so every ultimate does SOMETHING real even before an author
   * gives it a bespoke effect. */
  effect?: CommanderUltimateEffect;
}

export interface CommanderSignatureMechanic {
  tag: string;
  description: string;
  passive: CommanderPassive;
}

export interface CommanderDef {
  id: string;
  name: string;
  callsign: string;
  archetype: CommanderArchetype;
  faction: string;
  biography: string;
  passive: CommanderPassive;
  active: ActiveModule;
  ultimate: CommanderUltimate;
  signature: CommanderSignatureMechanic;
}

/** Fingerprint for the no-overlap law (AF-030 §2) — trigger+bonus+tag only. */
export function fingerprint(commander: CommanderDef): string {
  return [
    commander.passive.trigger,
    commander.passive.bonus.kind,
    commander.signature.tag,
    commander.ultimate.id,
  ].join("|");
}

/** Returns the id of a near-duplicate Commander, or null if none conflicts. */
export function findOverlap(
  candidate: CommanderDef,
  existing: readonly CommanderDef[],
): string | null {
  const candidateFingerprint = fingerprint(candidate);
  for (const other of existing) {
    if (other.id === candidate.id) continue;
    if (fingerprint(other) === candidateFingerprint) return other.id;
  }
  return null;
}

/** Sandbox roster — proves the ability/mastery/overlap engine. */
export const SANDBOX_COMMANDERS: readonly CommanderDef[] = [
  {
    id: "reyes-longlight",
    name: "Ilsa Reyes",
    callsign: "Longlight",
    archetype: "assault",
    faction: "Human Alliance",
    biography: "The last gunnery officer of a fleet that no longer exists.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "criticalDamage", value: 0.1 } },
    active: { id: "energy-pulse", name: "Energy Pulse", cooldownMs: 8000 },
    // GP-004: a real mechanical effect, not just a name — an orbital strike is a nova.
    ultimate: { id: "orbital-strike", name: "Orbital Strike", chargeRequired: 100, chargePerKill: 4, chargePerDamage: 0.05, effect: { kind: "novaDamage", value: 90, radius: 6 } },
    signature: {
      tag: "longlight-doctrine",
      description: "Every fifth critical hit briefly overcharges weapons.",
      passive: { trigger: "onCriticalHit", bonus: { kind: "cooldownReduction", value: 0.02 } },
    },
  },
  {
    id: "vek-ironhull",
    name: "Vek Tarn",
    callsign: "Ironhull",
    archetype: "guardian",
    faction: "Machine Collective",
    biography: "Rebuilt three times. Remembers all three deaths.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 8 } },
    active: { id: "emergency-barrier", name: "Emergency Barrier", cooldownMs: 12000 },
    // GP-004: a real mechanical effect — a defence grid throws up a major barrier.
    ultimate: { id: "planetary-defence-grid", name: "Planetary Defence Grid", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03, effect: { kind: "barrierBurst", value: 120 } },
    signature: {
      tag: "ironhull-doctrine",
      description: "Taking damage below 30% health grants a stacking damage reduction.",
      passive: { trigger: "onLowHealth", bonus: { kind: "shieldCapacity", value: 10 }, threshold: 0.3 },
    },
  },
];
