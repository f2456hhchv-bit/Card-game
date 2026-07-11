/**
 * Weapon data shapes (AF-032). A WeaponDef feeds AF-021's existing
 * DamagePacket/OffensiveModifiers "weapon" stage and StatusEngine directly —
 * no new damage or status plumbing. Energy Cost draws from AF-031's Energy
 * pool (a scope extension, not a second resource).
 */
import type { DamageSchool, DamageSourceKind, StatusKind } from "../combat/combatTuning";
import type { Rarity } from "../loot/lootTuning";

export const WEAPON_CATEGORIES = [
  "ballistic",
  "laser",
  "plasma",
  "railgun",
  "missile",
  "beam",
  "flak",
  "arc",
  "drone",
  "orbital",
  "crystal",
  "void",
  "prototype",
  "ancient",
  "singularity",
  // GP-004 §Content Engine: the audit found no category at all — not even a
  // naming-layer mapping (AF-075's WEAPON_FRAMEWORK_CATEGORIES) — could
  // represent a summon-flavoured weapon. Added additively; the fourteen
  // above are untouched.
  "summon",
] as const;

export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

/** Geometric fire patterns get a real angle generator (§2). */
export const GEOMETRIC_FIRE_PATTERNS = ["singleShot", "burst", "spread", "arc", "nova", "spiral"] as const;
/** Identity fire patterns pair with a matching ProjectileBehaviour instead of a second geometry system (§2). */
export const IDENTITY_FIRE_PATTERNS = ["beam", "orbit", "homing", "chain", "wave", "chargedShot"] as const;

export const FIRE_PATTERNS = [...GEOMETRIC_FIRE_PATTERNS, ...IDENTITY_FIRE_PATTERNS] as const;
export type FirePattern = (typeof FIRE_PATTERNS)[number];

export const PROJECTILE_BEHAVIOURS = [
  "straight",
  "seeking",
  "bouncing",
  "piercing",
  "explosive",
  "returning",
  "accelerating",
  "splitting",
  "orbiting",
  "chainLightning",
  "persistentBeam",
  "gravityAffected",
] as const;
export type ProjectileBehaviour = (typeof PROJECTILE_BEHAVIOURS)[number];

export interface StatusOnHit {
  kind: StatusKind;
  chance: number;
  strength: number;
  durationMs: number;
}

/** Generalises AF-029's evolution pattern to weapons' six heterogeneous triggers (§5). */
export interface WeaponEvolutionRequirement {
  minLevel?: number;
  requiresRelicIds?: readonly string[];
  requiresEquipmentIds?: readonly string[];
  requiresResearchIds?: readonly string[];
  minBossMaterials?: number;
  requiresAncientTechnology?: boolean;
}

export interface WeaponEvolution {
  evolvesInto: string;
  requirement: WeaponEvolutionRequirement;
}

export interface WeaponEvolutionContext {
  level: number;
  activeRelicIds: readonly string[];
  equippedItemIds: readonly string[];
  unlockedResearchIds: readonly string[];
  bossMaterialCount: number;
  hasAncientTechnology: boolean;
}

/** Pure read of existing systems' snapshots — no new persistence. */
export function evaluateWeaponEvolution(
  requirement: WeaponEvolutionRequirement,
  context: WeaponEvolutionContext,
): boolean {
  if (requirement.minLevel !== undefined && context.level < requirement.minLevel) return false;
  if (requirement.requiresRelicIds?.some((id) => !context.activeRelicIds.includes(id))) return false;
  if (requirement.requiresEquipmentIds?.some((id) => !context.equippedItemIds.includes(id))) return false;
  if (requirement.requiresResearchIds?.some((id) => !context.unlockedResearchIds.includes(id))) return false;
  if (requirement.minBossMaterials !== undefined && context.bossMaterialCount < requirement.minBossMaterials) return false;
  if (requirement.requiresAncientTechnology && !context.hasAncientTechnology) return false;
  return true;
}

export interface WeaponDef {
  id: string;
  name: string;
  category: WeaponCategory;
  manufacturer: string;
  tier: number;
  rarity: Rarity;
  lore: string;
  damageSchool: DamageSchool;
  damageSourceKind: DamageSourceKind;
  baseDamage: number;
  critChance: number;
  critMultiplier: number;
  /** Milliseconds between shots — Fire Rate and Cooldown collapse into one interval (§ simplification). */
  fireIntervalMs: number;
  firePattern: FirePattern;
  projectilesPerShot: number;
  projectileBehaviour: ProjectileBehaviour;
  range: number;
  projectileSpeed: number;
  pierceCount: number;
  explosionRadius: number;
  statusOnHit: StatusOnHit | null;
  /** 0 = energy-free; non-zero draws from AF-031's ship Energy pool (§4). */
  energyCost: number;
  evolution: WeaponEvolution | null;
}

/** Fingerprint for the no-overlap law (AF-032 — mirrors AF-030/031's findOverlap/findShipOverlap). */
export function weaponFingerprint(weapon: WeaponDef): string {
  return [
    weapon.category,
    weapon.firePattern,
    weapon.projectileBehaviour,
    weapon.statusOnHit?.kind ?? "none",
  ].join("|");
}

export function findWeaponOverlap(
  candidate: WeaponDef,
  existing: readonly WeaponDef[],
): string | null {
  const candidateFingerprint = weaponFingerprint(candidate);
  for (const other of existing) {
    if (other.id === candidate.id) continue;
    if (weaponFingerprint(other) === candidateFingerprint) return other.id;
  }
  return null;
}

/** Sandbox roster — proves the category/pattern/behaviour/evolution/overlap engine. */
export const SANDBOX_WEAPONS: readonly WeaponDef[] = [
  {
    id: "coil-ripper",
    name: "Coil Ripper",
    category: "ballistic",
    manufacturer: "Halcyon Driveworks",
    tier: 1,
    rarity: "common",
    lore: "A miner's tool repurposed into something that shouldn't pierce hull plate. It does anyway.",
    damageSchool: "physical",
    damageSourceKind: "direct",
    baseDamage: 9,
    critChance: 0.15,
    critMultiplier: 2,
    fireIntervalMs: 320,
    firePattern: "singleShot",
    projectilesPerShot: 1,
    projectileBehaviour: "piercing",
    range: 14,
    projectileSpeed: 28,
    pierceCount: 2,
    explosionRadius: 0,
    statusOnHit: { kind: "shock", chance: 0.2, strength: 6, durationMs: 1500 },
    energyCost: 0,
    evolution: {
      evolvesInto: "coil-ripper-mk2",
      requirement: { minLevel: 5 },
    },
  },
  {
    id: "coil-ripper-mk2",
    name: "Coil Ripper Mk. II",
    category: "arc",
    manufacturer: "Halcyon Driveworks",
    tier: 2,
    rarity: "rare",
    lore: "The evolved coil no longer just pierces — it arcs between everything it grazes.",
    damageSchool: "physical",
    damageSourceKind: "direct",
    baseDamage: 14,
    critChance: 0.18,
    critMultiplier: 2.2,
    fireIntervalMs: 300,
    firePattern: "chain",
    projectilesPerShot: 1,
    projectileBehaviour: "chainLightning",
    range: 15,
    projectileSpeed: 30,
    pierceCount: 0,
    explosionRadius: 0,
    statusOnHit: { kind: "shock", chance: 0.3, strength: 9, durationMs: 1800 },
    energyCost: 0,
    evolution: null,
  },
  {
    id: "novasplitter",
    name: "Novasplitter",
    category: "flak",
    manufacturer: "Ironmoor Foundry",
    tier: 2,
    rarity: "improved",
    lore: "Fires wide, forgives poor aim, punishes crowds.",
    damageSchool: "energy",
    damageSourceKind: "area",
    baseDamage: 6,
    critChance: 0.1,
    critMultiplier: 2,
    fireIntervalMs: 700,
    firePattern: "nova",
    projectilesPerShot: 6,
    projectileBehaviour: "explosive",
    range: 10,
    projectileSpeed: 18,
    pierceCount: 0,
    explosionRadius: 1.5,
    statusOnHit: null,
    energyCost: 0,
    evolution: null,
  },
  {
    id: "voidlance",
    name: "Voidlance",
    category: "void",
    manufacturer: "Void Legion Remnant",
    tier: 3,
    rarity: "epic",
    lore: "It does not fire so much as it insists.",
    damageSchool: "energy",
    damageSourceKind: "beam",
    baseDamage: 4,
    critChance: 0.05,
    critMultiplier: 1.5,
    fireIntervalMs: 80,
    firePattern: "beam",
    projectilesPerShot: 1,
    projectileBehaviour: "persistentBeam",
    range: 12,
    projectileSpeed: 0,
    pierceCount: 99,
    explosionRadius: 0,
    statusOnHit: { kind: "corruption", chance: 0.4, strength: 5, durationMs: 2500 },
    energyCost: 8,
    evolution: {
      evolvesInto: "singularity-lance",
      requirement: { requiresAncientTechnology: true, minBossMaterials: 3 },
    },
  },
];
