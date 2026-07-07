/**
 * Ship data shapes (AF-031). A ShipDef IS an AF-020 MovementProfile producer
 * plus an AF-021 DefenceState seed — no second movement or defence system.
 * Passive/ability reuse AF-028/AF-030's PassiveTrigger/EquipmentBonus/
 * ActiveModule vocabulary exactly. Energy is the one new resource this
 * module introduces, scoped tightly to ability activation cost.
 */
import type { ActiveModule, EquipmentBonus, PassiveTrigger } from "../equipment/equipmentData";
import type { MovementProfile } from "../movement/movementTuning";

export const SHIP_CLASSES = [
  "scout",
  "interceptor",
  "assault",
  "guardian",
  "destroyer",
  "carrier",
  "engineer",
  "experimental",
  "prototype",
  "ancient",
  "mythic",
] as const;

export type ShipClass = (typeof SHIP_CLASSES)[number];

export interface ShipPassive {
  trigger: PassiveTrigger;
  bonus: EquipmentBonus;
  /** For onLowHealth — health fraction threshold. */
  threshold?: number;
}

/** A ship ability reuses AF-028's ActiveModule shape and spends energy (AF-031's new resource). */
export interface ShipAbility extends ActiveModule {
  energyCost: number;
}

export interface ShipDef {
  id: string;
  name: string;
  shipClass: ShipClass;
  manufacturer: string;
  faction: string;
  lore: string;
  hull: number;
  shield: number;
  maxEnergy: number;
  /** Energy regenerated per second while not spent on abilities. */
  energyRegenPerSecond: number;
  /** AF-020 MovementProfile — the ship IS this profile, not a second system. */
  movementProfile: MovementProfile;
  passive: ShipPassive;
  ability: ShipAbility;
}

/** Fingerprint for the no-overlap law (AF-031 — mirrors AF-030 §2 findOverlap). */
export function shipFingerprint(ship: ShipDef): string {
  return [ship.passive.trigger, ship.passive.bonus.kind, ship.ability.id].join("|");
}

/** Returns the id of a near-duplicate Ship, or null if none conflicts. */
export function findShipOverlap(
  candidate: ShipDef,
  existing: readonly ShipDef[],
): string | null {
  const candidateFingerprint = shipFingerprint(candidate);
  for (const other of existing) {
    if (other.id === candidate.id) continue;
    if (shipFingerprint(other) === candidateFingerprint) return other.id;
  }
  return null;
}

/** Sandbox roster — proves the movement/defence/energy/passive/ability engine. */
export const SANDBOX_SHIPS: readonly ShipDef[] = [
  {
    id: "wayfarer-hull-mk2",
    name: "Wayfarer Mk. II",
    shipClass: "scout",
    manufacturer: "Halcyon Driveworks",
    faction: "Human Alliance",
    lore: "Built for expeditions that were never meant to end in combat.",
    hull: 80,
    shield: 30,
    maxEnergy: 100,
    energyRegenPerSecond: 6,
    movementProfile: {
      maxSpeed: 11,
      acceleration: 62,
      deceleration: 70,
      boostSpeed: 26,
      boostDurationMs: 260,
      boostCooldownMs: 1200,
      boostGrantsInvulnerability: true,
      collisionRadius: 0.4,
      speedMultiplierClamp: { min: 0.15, max: 3 },
      impulseDecayPerSecond: 8,
      turnRatePerSecond: "instant",
      mass: 0.8,
      handling: 1.2,
      movementFriction: 0,
    },
    passive: { trigger: "onKill", bonus: { kind: "movementSpeed", value: 0.03 } },
    ability: { id: "emergency-thrusters", name: "Emergency Thrusters", cooldownMs: 9000, energyCost: 40 },
  },
  {
    id: "bastion-hull-mk1",
    name: "Bastion Mk. I",
    shipClass: "guardian",
    manufacturer: "Ironmoor Foundry",
    faction: "Machine Collective",
    lore: "Slow to move, slower to fall.",
    hull: 140,
    shield: 60,
    maxEnergy: 80,
    energyRegenPerSecond: 4,
    movementProfile: {
      maxSpeed: 7,
      acceleration: 40,
      deceleration: 55,
      boostSpeed: 16,
      boostDurationMs: 200,
      boostCooldownMs: 1800,
      boostGrantsInvulnerability: true,
      collisionRadius: 0.55,
      speedMultiplierClamp: { min: 0.15, max: 3 },
      impulseDecayPerSecond: 10,
      turnRatePerSecond: 6,
      mass: 1.6,
      handling: 0.7,
      movementFriction: 0.4,
    },
    passive: { trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 6 } },
    ability: { id: "shield-overload", name: "Shield Overload", cooldownMs: 14000, energyCost: 60 },
  },
];
