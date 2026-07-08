/**
 * Ship Framework data shapes (AF-073). EXTENDS AF-031's locked ship system —
 * `ShipDef`, the eleven-class shelf, the energy resource, the AF-020
 * MovementProfile production, and the fingerprint no-overlap law are
 * untouched. AF-073 wraps each ship in a PROFILE (the AF-071 commander
 * pattern): the ten spec classes map totally onto AF-031's locked shelf;
 * the five-stage ability structure completes AF-031's passive+ability with
 * an ultimate that REUSES AF-030's charge-gated CommanderUltimate shape, a
 * special mechanic, and an AF-069-gated ascension upgrade (a module
 * unlocked free at the gate); the spec's eight movement-model fields map
 * onto AF-020's REAL profile keys — the movement model has been live since
 * AF-020, this module names it; modules are AF-028 bonuses; mastery is
 * AF-026 vocabulary; customisation is neutral by shape. Heat and cargo
 * capacities are REGISTERED DORMANT numeric fields (the biomeId pattern):
 * data today, first consumers when heat/cargo modules arrive.
 * `shipArchitectureFor` proves all 22 architecture parts per ship.
 */
import type { EquipmentBonus } from "../equipment/equipmentData";
import type { CommanderUltimate } from "../commanders/commanderData";
import { SANDBOX_SHIPS, type ShipAbility, type ShipClass, type ShipDef, type ShipPassive } from "./shipData";

/** The ten spec ship classes (AF-073 §Ship Classes) — mapped totally onto AF-031's locked shelf. */
export const SHIP_FRAMEWORK_CLASSES = [
  "interceptor",
  "fighter",
  "corvette",
  "frigate",
  "destroyer",
  "heavyCruiser",
  "scienceVessel",
  "droneCarrier",
  "supportShip",
  "experimentalPrototype",
] as const;
export type ShipFrameworkClass = (typeof SHIP_FRAMEWORK_CLASSES)[number];

export const FRAMEWORK_CLASS_TO_SHIP_CLASS: Readonly<Record<ShipFrameworkClass, ShipClass>> = {
  interceptor: "interceptor",
  fighter: "assault",
  corvette: "scout",
  frigate: "guardian",
  destroyer: "destroyer",
  heavyCruiser: "destroyer",
  scienceVessel: "experimental",
  droneCarrier: "carrier",
  supportShip: "engineer",
  experimentalPrototype: "prototype",
};

/** The 22-part ship architecture (AF-073 §Ship Architecture) — nothing remains undefined. */
export const SHIP_ARCHITECTURE_PARTS = [
  "uniqueId",
  "manufacturer",
  "visualIdentity",
  "class",
  "lore",
  "hullStatistics",
  "shieldStatistics",
  "engineProfile",
  "energyCapacity",
  "heatCapacity",
  "cargoCapacity",
  "weaponSlots",
  "equipmentSlots",
  "moduleSlots",
  "passiveAbility",
  "shipAbility",
  "ultimateSystem",
  "mobilityProfile",
  "progression",
  "mastery",
  "cosmetics",
  "futureExpansionHooks",
] as const;
export type ShipArchitecturePart = (typeof SHIP_ARCHITECTURE_PARTS)[number];

/** The five-stage ship ability structure (AF-073 §Ship Abilities). AF-031 owns
 * the first two stages; the profile adds the rest. */
export const SHIP_ABILITY_STAGES = ["passiveSystem", "activeAbility", "ultimateSystem", "specialMechanic", "ascensionUpgrade"] as const;
export type ShipAbilityStage = (typeof SHIP_ABILITY_STAGES)[number];

/** The spec's eight movement-model fields (AF-073 §Movement Model), mapped onto
 * AF-020's REAL MovementProfile keys — live since AF-020, named here. */
export const MOVEMENT_MODEL_TO_PROFILE_KEY = {
  acceleration: "acceleration",
  topSpeed: "maxSpeed",
  boostSpeed: "boostSpeed",
  drift: "impulseDecayPerSecond",
  turnRate: "turnRatePerSecond",
  mass: "mass",
  inertia: "handling",
  braking: "deceleration",
} as const;
export type MovementModelField = keyof typeof MOVEMENT_MODEL_TO_PROFILE_KEY;

/** Defensive profile kinds (AF-073 §Defensive Profile) — no single defence dominates. */
export const DEFENSIVE_PROFILE_KINDS = ["hull", "shield", "armour", "energyBarrier", "repairSystems", "avoidance", "mobility"] as const;
export type DefensiveProfileKind = (typeof DEFENSIVE_PROFILE_KINDS)[number];

/** Offensive profile kinds (AF-073 §Offensive Profile) — combat identity remains distinct. */
export const OFFENSIVE_PROFILE_KINDS = ["precision", "burstDamage", "areaDamage", "droneWarfare", "beamWeapons", "missiles", "support", "hybridCombat"] as const;
export type OffensiveProfileKind = (typeof OFFENSIVE_PROFILE_KINDS)[number];

/** Module kinds (AF-073 §Module Support) — eight registered; modules define long-term builds. */
export const SHIP_MODULE_KINDS = [
  "reactors",
  "engines",
  "shieldSystems",
  "targetingSystems",
  "droneBays",
  "sensorArrays",
  "coolingSystems",
  "experimentalModules",
] as const;
export type ShipModuleKind = (typeof SHIP_MODULE_KINDS)[number];

/** A ship module — a kind, an id, an AF-028 bonus. No new bonus system. */
export interface ShipModuleDef {
  kind: ShipModuleKind;
  id: string;
  name: string;
  bonus: EquipmentBonus;
}

/** Mastery metrics (AF-073 §Ship Mastery) — eight registered; AF-026 vocabulary. */
export const SHIP_MASTERY_METRICS = [
  "usage",
  "kills",
  "bossVictories",
  "distanceTravelled",
  "masteryChallenges",
  "achievements",
  "statistics",
  "cosmetics",
] as const;
export type ShipMasteryMetric = (typeof SHIP_MASTERY_METRICS)[number];

/** Customisation kinds (AF-073 §Customisation) — eight registered, gameplay-neutral by shape. */
export const SHIP_CUSTOMISATION_KINDS = [
  "paintSchemes",
  "engineTrails",
  "cockpitThemes",
  "hullVariants",
  "decals",
  "animatedSkins",
  "shipNames",
  "victoryAnimations",
] as const;
export type ShipCustomisationKind = (typeof SHIP_CUSTOMISATION_KINDS)[number];

export interface ShipCosmeticDef {
  kind: ShipCustomisationKind;
  id: string;
}

export interface ShipSpecialMechanicDef {
  tag: string;
  description: string;
  passive: ShipPassive;
}

/** The AF-069 tie-in: at the gated ascension level the designated module fits free, once. */
export interface ShipAscensionUpgradeDef {
  requiredAscensionLevel: number;
  moduleId: string;
  description: string;
}

/** The AF-073 profile — wraps an AF-031 ShipDef by id; the def itself is never modified. */
export interface ShipProfileDef {
  shipId: string;
  frameworkClass: ShipFrameworkClass;
  visualIdentity: string;
  primaryDefence: DefensiveProfileKind;
  offensiveIdentity: OffensiveProfileKind;
  /** Registered DORMANT numeric fields (the biomeId pattern) — heat/cargo modules become their first consumers. */
  heatCapacity: number;
  cargoCapacity: number;
  weaponSlots: number;
  equipmentSlots: number;
  moduleSlots: number;
  /** Reuses AF-030's charge-gated ultimate shape — no second ultimate model. */
  ultimate: CommanderUltimate;
  specialMechanic: ShipSpecialMechanicDef;
  ascensionUpgrade: ShipAscensionUpgradeDef;
  /** AF-026 mastery-track ID — no new mastery engine. */
  masteryTrackId: string;
  statisticKeys: readonly string[];
  cosmetics: readonly ShipCosmeticDef[];
  futureExpansionHooks: readonly string[];
}

/** Sandbox modules — one per kind, all AF-028 bonuses. */
export const SANDBOX_SHIP_MODULES: readonly ShipModuleDef[] = [
  { kind: "reactors", id: "module-fusion-reactor", name: "Fusion Reactor", bonus: { kind: "cooldownReduction", value: 0.05 } },
  { kind: "engines", id: "module-vector-engine", name: "Vector Engine", bonus: { kind: "movementSpeed", value: 0.06 } },
  { kind: "shieldSystems", id: "module-lattice-shield", name: "Lattice Shield", bonus: { kind: "shieldCapacity", value: 12 } },
  { kind: "targetingSystems", id: "module-predictive-targeter", name: "Predictive Targeter", bonus: { kind: "criticalChance", value: 0.04 } },
  { kind: "droneBays", id: "module-drone-bay", name: "Drone Bay", bonus: { kind: "droneEffectiveness", value: 0.06 } },
  { kind: "sensorArrays", id: "module-deep-sensor", name: "Deep Sensor Array", bonus: { kind: "pickupRadius", value: 0.12 } },
  { kind: "coolingSystems", id: "module-cryo-loop", name: "Cryo Cooling Loop", bonus: { kind: "boostEfficiency", value: 0.08 } },
  { kind: "experimentalModules", id: "module-axiom-core", name: "Axiom Core", bonus: { kind: "experienceGain", value: 0.06 } },
];

/** AF-073's roster addition — a science vessel through AF-031's UNCHANGED ShipDef shape. */
export const AURELIA_SHIP: ShipDef = {
  id: "aurelia-hull-mk1",
  name: "Aurelia Mk. I",
  shipClass: "experimental",
  manufacturer: "Meridian Yards",
  faction: "Human Alliance",
  lore: "A survey platform with more sensor mass than armour. It has never lost a fight it saw coming, because it always sees them coming.",
  hull: 90,
  shield: 45,
  maxEnergy: 130,
  energyRegenPerSecond: 8,
  movementProfile: {
    maxSpeed: 9,
    acceleration: 50,
    deceleration: 60,
    boostSpeed: 20,
    boostDurationMs: 300,
    boostCooldownMs: 1500,
    boostGrantsInvulnerability: false,
    collisionRadius: 0.45,
    speedMultiplierClamp: { min: 0.15, max: 3 },
    impulseDecayPerSecond: 7,
    turnRatePerSecond: "instant",
    mass: 1.0,
    handling: 1.0,
    movementFriction: 0,
  },
  passive: { trigger: "onDamageTaken", bonus: { kind: "pickupRadius", value: 0.05 } },
  ability: { id: "survey-burst", name: "Survey Burst", cooldownMs: 11000, energyCost: 45 },
};

/** The extended roster — AF-031's sandbox pair plus AF-073's addition, additively. */
export const FRAMEWORK_SHIPS: readonly ShipDef[] = [...SANDBOX_SHIPS, AURELIA_SHIP];

export const SHIP_PROFILES: readonly ShipProfileDef[] = [
  {
    shipId: "wayfarer-hull-mk2",
    frameworkClass: "corvette",
    visualIdentity: "Long expedition hull in Halcyon white, nav-lights doubled for deep-dark running, every panel field-replaceable.",
    primaryDefence: "avoidance",
    offensiveIdentity: "precision",
    heatCapacity: 60,
    cargoCapacity: 40,
    weaponSlots: 2,
    equipmentSlots: 3,
    moduleSlots: 2,
    ultimate: { id: "wayfarer-overdrive", name: "Expedition Overdrive", chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.04 },
    specialMechanic: {
      tag: "wayfarer-doctrine",
      description: "Momentum is armour — sustained top speed hardens the boost.",
      passive: { trigger: "onKill", bonus: { kind: "boostEfficiency", value: 0.04 } },
    },
    ascensionUpgrade: { requiredAscensionLevel: 1, moduleId: "module-vector-engine", description: "Ascension I: the Vector Engine fits free." },
    masteryTrackId: "ship:wayfarer-hull-mk2",
    statisticKeys: ["ship:wayfarer-hull-mk2:usage", "ship:wayfarer-hull-mk2:distance"],
    cosmetics: [
      { kind: "paintSchemes", id: "wayfarer-halcyon-white" },
      { kind: "engineTrails", id: "wayfarer-long-dawn" },
    ],
    futureExpansionHooks: ["hull-variant-wayfarer-mk3"],
  },
  {
    shipId: "bastion-hull-mk1",
    frameworkClass: "frigate",
    visualIdentity: "Foundry-grey slab hull, amber running lights, weld seams left proud — Ironmoor does not apologise for mass.",
    primaryDefence: "hull",
    offensiveIdentity: "areaDamage",
    heatCapacity: 90,
    cargoCapacity: 80,
    weaponSlots: 3,
    equipmentSlots: 4,
    moduleSlots: 3,
    ultimate: { id: "bastion-aegis", name: "Aegis Protocol", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
    specialMechanic: {
      tag: "bastion-doctrine",
      description: "Standing ground compounds — damage taken while stationary feeds the shields.",
      passive: { trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 3 } },
    },
    ascensionUpgrade: { requiredAscensionLevel: 2, moduleId: "module-lattice-shield", description: "Ascension II: the Lattice Shield fits free." },
    masteryTrackId: "ship:bastion-hull-mk1",
    statisticKeys: ["ship:bastion-hull-mk1:usage", "ship:bastion-hull-mk1:damageAbsorbed"],
    cosmetics: [
      { kind: "hullVariants", id: "bastion-foundry-grey" },
      { kind: "victoryAnimations", id: "bastion-hold-the-line" },
    ],
    futureExpansionHooks: ["hull-variant-bastion-mk2"],
  },
  {
    shipId: "aurelia-hull-mk1",
    frameworkClass: "scienceVessel",
    visualIdentity: "Sensor-vane crown over a survey-white hull, instrument pods like a held breath, always angled toward the anomaly.",
    primaryDefence: "energyBarrier",
    offensiveIdentity: "beamWeapons",
    heatCapacity: 70,
    cargoCapacity: 100,
    weaponSlots: 1,
    equipmentSlots: 4,
    moduleSlots: 4,
    ultimate: { id: "aurelia-full-spectrum", name: "Full Spectrum Survey", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.05 },
    specialMechanic: {
      tag: "aurelia-doctrine",
      description: "Nothing arrives unannounced — incoming fire is data first, damage second.",
      passive: { trigger: "onDamageTaken", bonus: { kind: "experienceGain", value: 0.04 } },
    },
    ascensionUpgrade: { requiredAscensionLevel: 3, moduleId: "module-deep-sensor", description: "Ascension III: the Deep Sensor Array fits free." },
    masteryTrackId: "ship:aurelia-hull-mk1",
    statisticKeys: ["ship:aurelia-hull-mk1:usage", "ship:aurelia-hull-mk1:scans"],
    cosmetics: [
      { kind: "cockpitThemes", id: "aurelia-observatory" },
      { kind: "decals", id: "aurelia-survey-charter" },
    ],
    futureExpansionHooks: ["hull-variant-aurelia-mk2"],
  },
];

/** "Nothing remains undefined" as a function — all 22 parts must be present. */
export function shipArchitectureFor(def: ShipDef, profile: ShipProfileDef): Record<ShipArchitecturePart, boolean> {
  const ability: ShipAbility = def.ability;
  return {
    uniqueId: def.id.length > 0,
    manufacturer: def.manufacturer.length > 0,
    visualIdentity: profile.visualIdentity.length > 0,
    class: profile.frameworkClass.length > 0,
    lore: def.lore.length > 0,
    hullStatistics: def.hull > 0,
    shieldStatistics: def.shield > 0,
    engineProfile: def.movementProfile.acceleration > 0,
    energyCapacity: def.maxEnergy > 0,
    heatCapacity: profile.heatCapacity > 0,
    cargoCapacity: profile.cargoCapacity > 0,
    weaponSlots: profile.weaponSlots > 0,
    equipmentSlots: profile.equipmentSlots > 0,
    moduleSlots: profile.moduleSlots > 0,
    passiveAbility: def.passive !== undefined,
    shipAbility: ability.energyCost > 0,
    ultimateSystem: profile.ultimate.chargeRequired > 0,
    mobilityProfile: def.movementProfile.maxSpeed > 0,
    progression: profile.ascensionUpgrade.requiredAscensionLevel > 0,
    mastery: profile.masteryTrackId.startsWith("ship:"),
    cosmetics: profile.cosmetics.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}
