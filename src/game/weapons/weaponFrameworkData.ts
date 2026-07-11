/**
 * Weapon Framework data shapes (AF-075). EXTENDS AF-032's locked weapon
 * system — `WeaponDef`, the fifteen-category shelf, the twelve fire
 * patterns, the twelve projectile behaviours, the evolution model, and the
 * fingerprint no-overlap law are untouched. AF-075 wraps each weapon in a
 * PROFILE (the AF-071/073 pattern): the seventeen spec categories, ten
 * fire modes, and ten projectile-system kinds are naming layers mapped
 * TOTALLY onto AF-032's locked shelves; the ten ELEMENTS map totally onto
 * AF-021's status kinds (kinetic maps to none — purity is a mapping too);
 * heat generation is a registered DORMANT numeric (the AF-073 pattern);
 * passives are AF-028 vocabulary; mastery is AF-026's; and "evolution
 * enhances identity, not replaces it" follows AF-032's own precedent —
 * the evolved weapon keeps its name lineage and manufacturer even where
 * the category shifts (Coil Ripper → Coil Ripper Mk. II).
 * `weaponArchitectureFor` proves all 20 architecture parts per weapon.
 */
import type { EquipmentBonus, PassiveTrigger } from "../equipment/equipmentData";
import type { StatusKind } from "../combat/combatTuning";
import {
  SANDBOX_WEAPONS,
  type FirePattern,
  type ProjectileBehaviour,
  type WeaponCategory,
  type WeaponDef,
} from "./weaponData";

/**
 * The seventeen spec categories (AF-075 §Weapon Categories) — mapped
 * totally onto AF-032's locked shelf, plus GP-004's own addition below.
 *
 * GP-004 §Content Engine used a shorter, differently-worded weapon-category
 * list (Laser/Ballistic/Missile/Plasma/Energy/Gravity/Drone/Summon/
 * Explosive/Biological/Experimental). Every name in that list already maps
 * onto this superset: Laser→pulseRifles/laserArrays, Ballistic→
 * assaultCannons, Missile→missileLaunchers/rocketBatteries, Plasma→
 * plasmaWeapons, Energy→beamWeapons (damageSchool "energy" already spans
 * several), Gravity→gravityWeapons, Drone→droneControllers, Explosive→
 * rocketBatteries/shotguns (PROJECTILE_SYSTEM_KINDS "explosive"),
 * Experimental→experimentalWeapons. Two names had no real weapon behind
 * them anywhere in this shelf — Summon (not even a naming-layer entry) and
 * Biological (a naming-layer entry with zero weapons using it). Both now
 * have one: SWARM_TENDER (summonWeapons) and SPORE_LANCE
 * (biologicalWeapons) below.
 */
export const WEAPON_FRAMEWORK_CATEGORIES = [
  "assaultCannons",
  "pulseRifles",
  "railguns",
  "laserArrays",
  "beamWeapons",
  "missileLaunchers",
  "rocketBatteries",
  "shotguns",
  "plasmaWeapons",
  "arcWeapons",
  "droneControllers",
  "gravityWeapons",
  "cryoWeapons",
  "flamethrowers",
  "biologicalWeapons",
  "voidWeapons",
  "experimentalWeapons",
  "summonWeapons", // GP-004: the one genuine gap — no prior category, naming layer, or weapon.
] as const;
export type WeaponFrameworkCategory = (typeof WEAPON_FRAMEWORK_CATEGORIES)[number];

export const FRAMEWORK_CATEGORY_TO_WEAPON_CATEGORY: Readonly<Record<WeaponFrameworkCategory, WeaponCategory>> = {
  assaultCannons: "ballistic",
  pulseRifles: "laser",
  railguns: "railgun",
  laserArrays: "laser",
  beamWeapons: "beam",
  missileLaunchers: "missile",
  rocketBatteries: "missile",
  shotguns: "flak",
  plasmaWeapons: "plasma",
  arcWeapons: "arc",
  droneControllers: "drone",
  gravityWeapons: "singularity",
  cryoWeapons: "crystal",
  flamethrowers: "plasma",
  biologicalWeapons: "plasma",
  voidWeapons: "void",
  experimentalWeapons: "prototype",
  summonWeapons: "summon", // GP-004: the new WeaponCategory value, added additively to AF-032's shelf.
};

/** The 20-part weapon architecture (AF-075 §Weapon Architecture) — nothing remains undefined. */
export const WEAPON_ARCHITECTURE_PARTS = [
  "uniqueId",
  "manufacturer",
  "category",
  "visualIdentity",
  "lore",
  "fireBehaviour",
  "damageProfile",
  "scaling",
  "range",
  "projectileBehaviour",
  "ammoEnergyRules",
  "heatGeneration",
  "criticalBehaviour",
  "passiveTrait",
  "uniqueMechanic",
  "evolutionPath",
  "mastery",
  "statistics",
  "cosmetics",
  "futureExpansionHooks",
] as const;
export type WeaponArchitecturePart = (typeof WEAPON_ARCHITECTURE_PARTS)[number];

/** The ten spec fire modes (AF-075 §Fire Modes) — mapped totally onto AF-032's twelve locked patterns. */
export const FIRE_MODES = [
  "singleFire",
  "burstFire",
  "automatic",
  "chargeFire",
  "beam",
  "continuousFire",
  "volley",
  "chainFire",
  "orbitalStrike",
  "areaPulse",
] as const;
export type FireMode = (typeof FIRE_MODES)[number];

export const FIRE_MODE_TO_PATTERN: Readonly<Record<FireMode, FirePattern>> = {
  singleFire: "singleShot",
  burstFire: "burst",
  automatic: "singleShot",
  chargeFire: "chargedShot",
  beam: "beam",
  continuousFire: "wave",
  volley: "spread",
  chainFire: "chain",
  orbitalStrike: "orbit",
  areaPulse: "nova",
};

/** The ten spec projectile-system kinds (AF-075 §Projectile System) — mapped totally onto AF-032's behaviours. */
export const PROJECTILE_SYSTEM_KINDS = [
  "hitscan",
  "physicalProjectiles",
  "seekingMissiles",
  "ricochet",
  "piercing",
  "explosive",
  "chainLightning",
  "gravityWells",
  "orbitingProjectiles",
  "splittingShots",
] as const;
export type ProjectileSystemKind = (typeof PROJECTILE_SYSTEM_KINDS)[number];

export const PROJECTILE_SYSTEM_TO_BEHAVIOUR: Readonly<Record<ProjectileSystemKind, ProjectileBehaviour>> = {
  hitscan: "persistentBeam",
  physicalProjectiles: "straight",
  seekingMissiles: "seeking",
  ricochet: "bouncing",
  piercing: "piercing",
  explosive: "explosive",
  chainLightning: "chainLightning",
  gravityWells: "gravityAffected",
  orbitingProjectiles: "orbiting",
  splittingShots: "splitting",
};

/** The ten elements (AF-075 §Elemental Support) — integrated with AF-021's status
 * system by TOTAL mapping; kinetic maps to none (purity is a mapping too). */
export const WEAPON_ELEMENTS = [
  "kinetic",
  "thermal",
  "cryogenic",
  "electrical",
  "plasma",
  "corrosive",
  "radiation",
  "void",
  "resonance",
  "quantum",
] as const;
export type WeaponElement = (typeof WEAPON_ELEMENTS)[number];

export const ELEMENT_TO_STATUS: Readonly<Record<WeaponElement, StatusKind | null>> = {
  kinetic: null,
  thermal: "burn",
  cryogenic: "freeze",
  electrical: "shock",
  plasma: "burn",
  corrosive: "armourBreak",
  radiation: "poison",
  void: "corruption",
  resonance: "shieldBreak",
  quantum: "overload",
};

/** Evolution sources (AF-075 §Weapon Evolution) — six registered. */
export const WEAPON_EVOLUTION_SOURCES = ["research", "blueprints", "mastery", "legendaryUpgrades", "prototypeTechnology", "ancientTechnology"] as const;
export type WeaponEvolutionSource = (typeof WEAPON_EVOLUTION_SOURCES)[number];

/** Mastery metrics (AF-075 §Weapon Mastery) — eight registered; AF-026 vocabulary. */
export const WEAPON_MASTERY_METRICS = ["kills", "accuracy", "criticalHits", "bossDamage", "distance", "buildDiversity", "challenges", "achievements"] as const;

/** Synergy surfaces (AF-075 §Weapon Synergy) — seven registered; every build interconnects. */
export const WEAPON_SYNERGY_SURFACES = ["ships", "commanders", "research", "relics", "equipment", "talents", "biomeModifiers"] as const;

/** Customisation kinds (AF-075 §Customisation) — seven registered, gameplay-neutral by shape. */
export const WEAPON_CUSTOMISATION_KINDS = [
  "weaponSkins",
  "projectileColours",
  "impactEffects",
  "audioPacks",
  "manufacturerThemes",
  "inspectionAnimations",
  "killEffects",
] as const;
export type WeaponCustomisationKind = (typeof WEAPON_CUSTOMISATION_KINDS)[number];

export interface WeaponCosmeticDef {
  kind: WeaponCustomisationKind;
  id: string;
}

/** The AF-075 profile — wraps an AF-032 WeaponDef by id; the def itself is never modified. */
export interface WeaponProfileDef {
  weaponId: string;
  frameworkCategory: WeaponFrameworkCategory;
  visualIdentity: string;
  element: WeaponElement;
  /** Registered DORMANT numeric (the AF-073 heat pattern) — heat systems become the first consumer. */
  heatGenerationPerShot: number;
  passiveTrait: { trigger: PassiveTrigger; bonus: EquipmentBonus };
  uniqueMechanic: { tag: string; description: string };
  /** Which registered source drives this weapon's evolution — null when the def has no evolution. */
  evolutionSource: WeaponEvolutionSource | null;
  masteryTrackId: string;
  statisticKeys: readonly string[];
  cosmetics: readonly WeaponCosmeticDef[];
  futureExpansionHooks: readonly string[];
}

/** AF-075's roster addition — a cryo weapon through AF-032's UNCHANGED WeaponDef shape,
 * giving the freeze status its first WEAPON producer (AF-064's biome was the first overall). */
export const HAILBORN_ARRAY: WeaponDef = {
  id: "hailborn-array",
  name: "Hailborn Array",
  category: "crystal",
  manufacturer: "Meridian Yards",
  tier: 2,
  rarity: "rare",
  lore: "Grown, not machined — the lattice fires the winter it remembers from Winterline's survey runs.",
  damageSchool: "energy",
  damageSourceKind: "direct",
  baseDamage: 7,
  critChance: 0.08,
  critMultiplier: 1.8,
  fireIntervalMs: 900,
  firePattern: "spread",
  projectilesPerShot: 3,
  projectileBehaviour: "splitting",
  range: 14,
  projectileSpeed: 16,
  pierceCount: 0,
  explosionRadius: 0,
  statusOnHit: { kind: "freeze", chance: 0.15, strength: 1, durationMs: 900 },
  energyCost: 0,
  evolution: null,
};

/**
 * GP-004 §Content Engine's roster addition — the Summon category's first
 * real weapon. No "summon a persistent ally" engine exists to invent, so
 * this reuses AF-032's own closest existing primitive for it: a projectile
 * that never returns (`orbiting`, the same behaviour "orbital"-category
 * weapons already use for a satellite that circles and fires).
 */
export const SWARM_TENDER: WeaponDef = {
  id: "swarm-tender",
  name: "Swarm Tender",
  category: "summon",
  manufacturer: "Halcyon Driveworks",
  tier: 2,
  rarity: "rare",
  lore: "Doesn't fire so much as release — a tending drone that never comes back to dock.",
  damageSchool: "energy",
  damageSourceKind: "direct",
  baseDamage: 5,
  critChance: 0.05,
  critMultiplier: 1.5,
  fireIntervalMs: 1400,
  firePattern: "orbit",
  projectilesPerShot: 1,
  projectileBehaviour: "orbiting",
  range: 6,
  projectileSpeed: 10,
  pierceCount: 0,
  explosionRadius: 0,
  statusOnHit: null,
  energyCost: 6,
  evolution: null,
};

/**
 * GP-004 §Content Engine's roster addition — the Biological naming layer's
 * first real weapon (biologicalWeapons already mapped totally onto
 * "plasma"; nothing had ever used the mapping). Poison is AF-021's own
 * existing status kind — no new damage-over-time mechanic invented.
 */
export const SPORE_LANCE: WeaponDef = {
  id: "spore-lance",
  name: "Spore Lance",
  category: "plasma",
  manufacturer: "Meridian Yards",
  tier: 2,
  rarity: "improved",
  lore: "Grown from the same lattice as Winterline's crystal work — this one blooms toxin instead of frost.",
  damageSchool: "physical",
  damageSourceKind: "direct",
  baseDamage: 6,
  critChance: 0.1,
  critMultiplier: 1.8,
  fireIntervalMs: 650,
  firePattern: "burst",
  projectilesPerShot: 2,
  projectileBehaviour: "piercing",
  range: 11,
  projectileSpeed: 20,
  pierceCount: 1,
  explosionRadius: 0,
  statusOnHit: { kind: "poison", chance: 0.35, strength: 4, durationMs: 3000 },
  energyCost: 0,
  evolution: null,
};

/** The extended arsenal — AF-032's sandbox four plus AF-075/GP-004's additions, additively. */
export const FRAMEWORK_WEAPONS: readonly WeaponDef[] = [...SANDBOX_WEAPONS, HAILBORN_ARRAY, SWARM_TENDER, SPORE_LANCE];

export const WEAPON_PROFILES: readonly WeaponProfileDef[] = [
  {
    weaponId: "coil-ripper",
    frameworkCategory: "railguns",
    visualIdentity: "Halcyon expedition-white rails with exposed coil windings — a survey tool that learned to argue.",
    element: "electrical",
    heatGenerationPerShot: 4,
    passiveTrait: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.03 } },
    uniqueMechanic: { tag: "coil-doctrine", description: "Pierced targets carry the charge to whoever stands behind them." },
    evolutionSource: "research",
    masteryTrackId: "weapon:coil-ripper",
    statisticKeys: ["weapon:coil-ripper:kills", "weapon:coil-ripper:crits"],
    cosmetics: [{ kind: "weaponSkins", id: "coil-ripper-halcyon" }, { kind: "projectileColours", id: "coil-ripper-arc-blue" }],
    futureExpansionHooks: ["evolution-coil-ripper-mk3"],
  },
  {
    weaponId: "coil-ripper-mk2",
    frameworkCategory: "arcWeapons",
    visualIdentity: "The Mk. I with the safety interlocks reinterpreted — chain terminals glowing where the sights used to be.",
    element: "electrical",
    heatGenerationPerShot: 6,
    passiveTrait: { trigger: "onKill", bonus: { kind: "statusDuration", value: 0.05 } },
    uniqueMechanic: { tag: "coil-mk2-doctrine", description: "The chain prefers crowds — every jump is a fresh argument." },
    evolutionSource: null,
    masteryTrackId: "weapon:coil-ripper-mk2",
    statisticKeys: ["weapon:coil-ripper-mk2:kills", "weapon:coil-ripper-mk2:chains"],
    cosmetics: [{ kind: "impactEffects", id: "coil-mk2-arc-burst" }],
    futureExpansionHooks: ["evolution-coil-ripper-mk3"],
  },
  {
    weaponId: "novasplitter",
    frameworkCategory: "shotguns",
    visualIdentity: "Ironmoor slab-breech with proud welds — recoil handled by refusing to acknowledge it.",
    element: "kinetic",
    heatGenerationPerShot: 8,
    passiveTrait: { trigger: "onKill", bonus: { kind: "damage", value: 0.03 } },
    uniqueMechanic: { tag: "novasplitter-doctrine", description: "The nova rewards standing exactly where you should not." },
    evolutionSource: null,
    masteryTrackId: "weapon:novasplitter",
    statisticKeys: ["weapon:novasplitter:kills", "weapon:novasplitter:multiKills"],
    cosmetics: [{ kind: "audioPacks", id: "novasplitter-foundry-report" }],
    futureExpansionHooks: ["evolution-novasplitter-mk2"],
  },
  {
    weaponId: "voidlance",
    frameworkCategory: "voidWeapons",
    visualIdentity: "A seam of not-quite-black that resolves into a barrel only when aimed — it drips upward.",
    element: "void",
    heatGenerationPerShot: 5,
    passiveTrait: { trigger: "onDamageTaken", bonus: { kind: "statusChance", value: 0.04 } },
    uniqueMechanic: { tag: "voidlance-doctrine", description: "Corruption remembers its targets — reapplication deepens, never resets." },
    evolutionSource: "ancientTechnology",
    masteryTrackId: "weapon:voidlance",
    statisticKeys: ["weapon:voidlance:kills", "weapon:voidlance:corruptions"],
    cosmetics: [{ kind: "killEffects", id: "voidlance-unmaking" }],
    futureExpansionHooks: ["evolution-voidlance-nadir"],
  },
  {
    weaponId: "hailborn-array",
    frameworkCategory: "cryoWeapons",
    visualIdentity: "A grown lattice of survey crystal, frost sublimating off the emitter between volleys.",
    element: "cryogenic",
    heatGenerationPerShot: 2,
    passiveTrait: { trigger: "onCriticalHit", bonus: { kind: "statusDuration", value: 0.06 } },
    uniqueMechanic: { tag: "hailborn-doctrine", description: "Split shards inherit the cold — every fragment remembers winter." },
    evolutionSource: "blueprints",
    masteryTrackId: "weapon:hailborn-array",
    statisticKeys: ["weapon:hailborn-array:kills", "weapon:hailborn-array:freezes"],
    cosmetics: [{ kind: "projectileColours", id: "hailborn-aurora" }],
    futureExpansionHooks: ["evolution-hailborn-glacier"],
  },
  {
    weaponId: "swarm-tender",
    frameworkCategory: "summonWeapons",
    visualIdentity: "A stubby launcher that ejects a palm-sized drone — it never returns, just keeps circling.",
    element: "kinetic",
    heatGenerationPerShot: 3,
    passiveTrait: { trigger: "onKill", bonus: { kind: "droneEffectiveness", value: 0.05 } },
    uniqueMechanic: { tag: "swarm-tender-doctrine", description: "Every drone launched joins the last — a growing ring, never a replacement." },
    evolutionSource: "mastery",
    masteryTrackId: "weapon:swarm-tender",
    statisticKeys: ["weapon:swarm-tender:kills", "weapon:swarm-tender:dronesLaunched"],
    cosmetics: [{ kind: "weaponSkins", id: "swarm-tender-halcyon" }],
    futureExpansionHooks: ["evolution-swarm-tender-hive"],
  },
  {
    weaponId: "spore-lance",
    frameworkCategory: "biologicalWeapons",
    visualIdentity: "A grown lattice barrel, veined and faintly warm, that exhales more than it fires.",
    element: "radiation",
    heatGenerationPerShot: 2,
    passiveTrait: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.05 } },
    uniqueMechanic: { tag: "spore-lance-doctrine", description: "Poisoned targets that die release a cloud that reapplies the toxin to whoever stands near." },
    evolutionSource: "research",
    masteryTrackId: "weapon:spore-lance",
    statisticKeys: ["weapon:spore-lance:kills", "weapon:spore-lance:poisons"],
    cosmetics: [{ kind: "impactEffects", id: "spore-lance-bloom" }],
    futureExpansionHooks: ["evolution-spore-lance-bloom"],
  },
];

/** "Nothing remains undefined" as a function — all 20 parts must be present. */
export function weaponArchitectureFor(def: WeaponDef, profile: WeaponProfileDef): Record<WeaponArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    manufacturer: def.manufacturer.length > 0,
    category: profile.frameworkCategory.length > 0,
    visualIdentity: profile.visualIdentity.length > 0,
    lore: def.lore.length > 0,
    fireBehaviour: def.fireIntervalMs > 0,
    damageProfile: def.baseDamage > 0,
    scaling: def.tier > 0,
    range: def.range > 0,
    projectileBehaviour: def.projectileBehaviour.length > 0,
    ammoEnergyRules: def.energyCost >= 0,
    heatGeneration: profile.heatGenerationPerShot > 0,
    criticalBehaviour: def.critChance > 0 && def.critMultiplier > 1,
    passiveTrait: profile.passiveTrait !== undefined,
    uniqueMechanic: profile.uniqueMechanic.tag.length > 0,
    evolutionPath: def.evolution !== null || profile.futureExpansionHooks.length > 0,
    mastery: profile.masteryTrackId.startsWith("weapon:"),
    statistics: profile.statisticKeys.length > 0,
    cosmetics: profile.cosmetics.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}
