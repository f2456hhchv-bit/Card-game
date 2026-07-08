/**
 * Ship Roster (AF-074). The AF-072 commander-roster move applied to hulls:
 * AF-031's ShipDef and AF-073's ShipProfileDef are UNCHANGED — the roster
 * is data. Ten ships, ten specialisations (a bijection), twelve fully
 * identified manufacturers (the spec's nine plus the three already
 * shipped), and eight tiers where TIER AFFECTS ACQUISITION, NEVER
 * VIABILITY — a roster entry carries a tier, an acquisition route, and
 * no stat field, so a tier-based stat bump is unrepresentable. Legendary
 * means six unique traits, not bigger numbers; prototype means five
 * experimental mechanics, not power. syntheticShipFor(n) proves the
 * roster scales to 100+ through AF-031/073's unchanged laws.
 */
import type { BonusKind, PassiveTrigger } from "../equipment/equipmentData";
import { SANDBOX_SHIPS, type ShipClass, type ShipDef } from "./shipData";
import {
  FRAMEWORK_SHIPS,
  SHIP_PROFILES,
  type DefensiveProfileKind,
  type OffensiveProfileKind,
  type ShipFrameworkClass,
  type ShipProfileDef,
} from "./shipFrameworkData";

/** Manufacturers (AF-074 §Ship Manufacturers) — the spec's nine plus the three already shipped. */
export const MANUFACTURER_IDS = [
  "atlas-dynamics",
  "helios-industries",
  "nova-forge",
  "aegis-systems",
  "vanguard-fleetworks",
  "eclipse-engineering",
  "quantum-horizon",
  "ancient-foundry",
  "prototype-division",
  "halcyon-driveworks",
  "ironmoor-foundry",
  "meridian-yards",
] as const;
export type ManufacturerId = (typeof MANUFACTURER_IDS)[number];

/** The five identity parts every manufacturer must carry (AF-074 §Ship Manufacturers). */
export interface ManufacturerDef {
  id: ManufacturerId;
  name: string;
  visualIdentity: string;
  technologyPhilosophy: string;
  engineeringStrengths: string;
  historicalLore: string;
  signatureSystem: string;
}

export const MANUFACTURERS: readonly ManufacturerDef[] = [
  { id: "atlas-dynamics", name: "Atlas Dynamics", visualIdentity: "Slab geometry, load-bearing everything, bolts you can see from orbit.", technologyPhilosophy: "If it cannot be repaired with a wrench, it is a prototype.", engineeringStrengths: "Ordnance mounts and structural tolerance.", historicalLore: "Armed half the Alliance fleet before the Collapse and rearmed the other half after.", signatureSystem: "Atlas hardpoint lattice — missiles fit where missiles should not." },
  { id: "helios-industries", name: "Helios Industries", visualIdentity: "Sun-gold trim over white ceramic, engines like sunrise.", technologyPhilosophy: "Speed is a form of armour.", engineeringStrengths: "Thrust-to-mass ratios nobody else certifies.", historicalLore: "Built racing hulls until the Collapse made couriers more valuable than trophies.", signatureSystem: "Helios afterburn manifold — the boost that keeps boosting." },
  { id: "nova-forge", name: "Nova Forge", visualIdentity: "Hive-textured hulls with visible drone berths, always slightly in motion.", technologyPhilosophy: "The ship is a nest; the fight belongs to the flock.", engineeringStrengths: "Drone fabrication and swarm coordination.", historicalLore: "Began as an asteroid-mining collective whose tools learned to defend themselves.", signatureSystem: "Nova brood bay — drones assembled mid-sortie." },
  { id: "aegis-systems", name: "Aegis Systems", visualIdentity: "Rounded white hulls, green field-lines, medical calm.", technologyPhilosophy: "The best weapon returns everyone home.", engineeringStrengths: "Shield harmonics and support arrays.", historicalLore: "Ran the Collapse's evacuation convoys; never lost an escorted hull.", signatureSystem: "Aegis umbrella — shields that share." },
  { id: "vanguard-fleetworks", name: "Vanguard Fleetworks", visualIdentity: "Predator lines, gunmetal blue, one blade-edge running light.", technologyPhilosophy: "Every system serves the killing shot.", engineeringStrengths: "Fire-control integration and target acquisition.", historicalLore: "The Alliance's duelling-ship yard, retooled for survival.", signatureSystem: "Vanguard executioner suite — the crit that was always going to happen." },
  { id: "eclipse-engineering", name: "Eclipse Engineering", visualIdentity: "Matte black with storm-grey baffles; hard to photograph on purpose.", technologyPhilosophy: "Control the field and the fight concedes.", engineeringStrengths: "Area denial and battlefield shaping.", historicalLore: "Wrote the book on gravity-assisted interdiction, then classified the book.", signatureSystem: "Eclipse shear field — space that disagrees with pursuit." },
  { id: "quantum-horizon", name: "Quantum Horizon", visualIdentity: "Iridescent panelling that renders a frame late, seams that hum.", technologyPhilosophy: "The impossible is an engineering deadline.", engineeringStrengths: "Energy projection and exotic optics.", historicalLore: "Founded by researchers who studied the Zone and came back employable.", signatureSystem: "Horizon lance array — beams with opinions." },
  { id: "ancient-foundry", name: "Ancient Foundry", visualIdentity: "White stone alloy and gold conduit — hulls that look excavated, not built.", technologyPhilosophy: "The precursors finished this design; we merely reprint it.", engineeringStrengths: "Materials nobody can replicate and tolerances nobody can measure.", historicalLore: "Not a company — a licensed dig site with a shipyard attached.", signatureSystem: "Foundry vigil core — systems that predate their operators." },
  { id: "prototype-division", name: "Prototype Division", visualIdentity: "Mismatched panels, exposed telemetry, warning stencils in three languages.", technologyPhilosophy: "Ship it before it is safe; learn why it was not.", engineeringStrengths: "Experimental mechanics and rapid iteration.", historicalLore: "The Protocol's abandoned test programme, resumed by volunteers with excellent insurance.", signatureSystem: "Division override bus — the controls the manual forbids." },
  { id: "halcyon-driveworks", name: "Halcyon Driveworks", visualIdentity: "Expedition white, doubled nav-lights, panels made to be swapped in the dark.", technologyPhilosophy: "A ship is a promise to come back.", engineeringStrengths: "Endurance drives and field maintainability.", historicalLore: "Built the survey fleets that mapped the frontier before the Collapse unmapped it.", signatureSystem: "Halcyon long-run drive — efficiency that compounds." },
  { id: "ironmoor-foundry", name: "Ironmoor Foundry", visualIdentity: "Foundry grey, proud weld seams, amber running lights.", technologyPhilosophy: "Mass is honesty.", engineeringStrengths: "Hull integrity and stationary resilience.", historicalLore: "Collective-adjacent foundry that sells to anyone who respects the metal.", signatureSystem: "Ironmoor rampart plating — standing still as a doctrine." },
  { id: "meridian-yards", name: "Meridian Yards", visualIdentity: "Survey white with sensor-vane crowns; instruments before armour.", technologyPhilosophy: "See everything first.", engineeringStrengths: "Sensor mass and analysis suites.", historicalLore: "Founded on the frontier to prove the dark could be measured.", signatureSystem: "Meridian survey lattice — nothing arrives unannounced." },
];

/** Ship tiers (AF-074 §Ship Tiers) — tier affects acquisition, never viability;
 * a roster entry has no stat field, so a tier stat bump is unrepresentable. */
export const SHIP_TIERS = ["common", "uncommon", "rare", "epic", "legendary", "ancient", "prototype", "mythic"] as const;
export type ShipTier = (typeof SHIP_TIERS)[number];

/** Specialisations (AF-074 §Ship Specialisation) — ten registered; one per roster ship. */
export const SHIP_SPECIALISATIONS = [
  "speed",
  "tanking",
  "criticalHits",
  "droneWarfare",
  "energyWeapons",
  "missiles",
  "support",
  "crowdControl",
  "exploration",
  "scientificOperations",
] as const;
export type ShipSpecialisation = (typeof SHIP_SPECIALISATIONS)[number];

/** Build architecture kinds (AF-074 §Build Architecture) — seven registered. */
export const BUILD_ARCHITECTURE_KINDS = [
  "multipleWeapons",
  "multipleReactors",
  "multipleEngines",
  "multipleShieldTypes",
  "multipleRelics",
  "multipleCommanderPairings",
  "multipleTalentPaths",
] as const;

/** Collection kinds (AF-074 §Ship Collection) — seven registered; permanent by the AF-026 pattern. */
export const SHIP_COLLECTION_KINDS = [
  "blueprints",
  "manufacturers",
  "variants",
  "experimentalModels",
  "legendaryShips",
  "prototypeHulls",
  "ancientDesigns",
] as const;
export type ShipCollectionKind = (typeof SHIP_COLLECTION_KINDS)[number];

/** Research kinds (AF-074 §Ship Research) — six registered. */
export const SHIP_RESEARCH_KINDS = [
  "improvedEfficiency",
  "alternativeModules",
  "experimentalSystems",
  "engineeringImprovements",
  "visualVariants",
  "qualityOfLifeUpgrades",
] as const;

/** Legendary traits (AF-074 §Legendary Ships) — six; legendary does not mean strictly stronger. */
export const LEGENDARY_TRAITS = ["uniqueVisuals", "uniqueLore", "uniqueAbilities", "uniqueProgression", "uniqueMastery", "uniqueDiscoveryMethods"] as const;

/** Prototype mechanics (AF-074 §Prototype Ships) — five; experimentation, not power. */
export const PROTOTYPE_MECHANICS = ["experimentalMechanics", "riskRewardSystems", "uniqueControls", "advancedBuilds", "highSkillCeiling"] as const;

/** Roster statistics (AF-074 §Ship Statistics) — eight registered; AF-026 vocabulary. */
export const SHIP_ROSTER_STAT_KINDS = ["usage", "missionSuccess", "damage", "distance", "resourcesGathered", "bossVictories", "exploration", "buildDiversity"] as const;

/** Balance axes (AF-074 §Balance Principles) — raw statistics deliberately absent. */
export const SHIP_BALANCE_AXES = ["role", "utility", "movement", "decisionMaking", "buildSynergy"] as const;

/** Customisation kinds (AF-074 §Customisation) — eight registered, cosmetic by shape. */
export const SHIP_ROSTER_CUSTOMISATION = ["paint", "engineTrails", "cockpitThemes", "hullMaterials", "animatedSkins", "manufacturerDecals", "callsigns", "shipHistory"] as const;

/** A roster entry — identity and acquisition only. NO stat field: tiers cannot buff. */
export interface RosterShipEntry {
  shipId: string;
  manufacturerId: ManufacturerId;
  tier: ShipTier;
  specialisation: ShipSpecialisation;
  collectionKind: ShipCollectionKind;
  discoveryMethod: string;
}

interface RosterShipSpec {
  id: string;
  name: string;
  shipClass: ShipClass;
  frameworkClass: ShipFrameworkClass;
  manufacturerId: ManufacturerId;
  tier: ShipTier;
  specialisation: ShipSpecialisation;
  collectionKind: ShipCollectionKind;
  discoveryMethod: string;
  lore: string;
  hull: number;
  shield: number;
  maxEnergy: number;
  passive: [PassiveTrigger, BonusKind, number];
  abilityName: string;
  primaryDefence: DefensiveProfileKind;
  offensiveIdentity: OffensiveProfileKind;
  visualIdentity: string;
  ascensionGate: 1 | 2 | 3;
  ascensionModuleId: string;
}

const ROSTER_SPECS: readonly RosterShipSpec[] = [
  {
    id: "sable-dart-mk1", name: "Sable Dart Mk. I", shipClass: "interceptor", frameworkClass: "interceptor",
    manufacturerId: "helios-industries", tier: "uncommon", specialisation: "speed",
    collectionKind: "blueprints", discoveryMethod: "Blueprint drop from frontier expeditions.",
    lore: "Helios built it to win races. The Collapse repurposed the finish line.",
    hull: 60, shield: 25, maxEnergy: 110, passive: ["onKill", "boostEfficiency", 0.05], abilityName: "Afterburn Manifold",
    primaryDefence: "mobility", offensiveIdentity: "burstDamage",
    visualIdentity: "Sun-gold racing trim over matte black, engines longer than the cockpit.",
    ascensionGate: 1, ascensionModuleId: "module-vector-engine",
  },
  {
    id: "falchion-mk2", name: "Falchion Mk. II", shipClass: "assault", frameworkClass: "fighter",
    manufacturerId: "vanguard-fleetworks", tier: "rare", specialisation: "criticalHits",
    collectionKind: "blueprints", discoveryMethod: "Blueprint drop from elite encounters.",
    lore: "A duelling hull with the safeties filed off and the paperwork lost on purpose.",
    hull: 75, shield: 35, maxEnergy: 95, passive: ["onCriticalHit", "criticalDamage", 0.08], abilityName: "Executioner Suite",
    primaryDefence: "shield", offensiveIdentity: "precision",
    visualIdentity: "Predator lines in gunmetal blue, one blade-edge running light.",
    ascensionGate: 2, ascensionModuleId: "module-predictive-targeter",
  },
  {
    id: "hivemother-mk1", name: "Hivemother Mk. I", shipClass: "carrier", frameworkClass: "droneCarrier",
    manufacturerId: "nova-forge", tier: "epic", specialisation: "droneWarfare",
    collectionKind: "experimentalModels", discoveryMethod: "Recovered from a Nova Forge assembly derelict.",
    lore: "The mining tools learned to defend themselves. Then they learned to be a fleet.",
    hull: 110, shield: 50, maxEnergy: 120, passive: ["onKill", "droneEffectiveness", 0.06], abilityName: "Brood Bay",
    primaryDefence: "repairSystems", offensiveIdentity: "droneWarfare",
    visualIdentity: "Hive-textured hull with visible drone berths, always slightly in motion.",
    ascensionGate: 2, ascensionModuleId: "module-drone-bay",
  },
  {
    id: "dawnspire", name: "Dawnspire", shipClass: "ancient", frameworkClass: "heavyCruiser",
    manufacturerId: "ancient-foundry", tier: "legendary", specialisation: "energyWeapons",
    collectionKind: "legendaryShips", discoveryMethod: "Unique discovery — the Foundry vault beneath First Light.",
    lore: "The Foundry did not build the Dawnspire. It excavated her, lit her, and has apologised to her ever since.",
    hull: 100, shield: 55, maxEnergy: 140, passive: ["onCriticalHit", "cooldownReduction", 0.03], abilityName: "Vigil Lance",
    primaryDefence: "armour", offensiveIdentity: "beamWeapons", // precursor stone alloy — armour the Foundry cannot replicate

    visualIdentity: "White stone alloy and gold conduit; she looks excavated, not built, and lit from within.",
    ascensionGate: 3, ascensionModuleId: "module-axiom-core",
  },
  {
    id: "ballista-mk3", name: "Ballista Mk. III", shipClass: "destroyer", frameworkClass: "destroyer",
    manufacturerId: "atlas-dynamics", tier: "uncommon", specialisation: "missiles",
    collectionKind: "blueprints", discoveryMethod: "Blueprint purchase from Alliance quartermasters.",
    lore: "Atlas put missiles where missiles should not fit, then reinforced the places that complained.",
    hull: 120, shield: 40, maxEnergy: 90, passive: ["onKill", "damage", 0.04], abilityName: "Hardpoint Lattice",
    primaryDefence: "hull", offensiveIdentity: "missiles",
    visualIdentity: "Slab geometry and visible bolts, hardpoints stacked like bookshelves.",
    ascensionGate: 1, ascensionModuleId: "module-fusion-reactor",
  },
  {
    id: "caduceus-mk1", name: "Caduceus Mk. I", shipClass: "engineer", frameworkClass: "supportShip",
    manufacturerId: "aegis-systems", tier: "rare", specialisation: "support",
    collectionKind: "variants", discoveryMethod: "Awarded for the first civilian rescue chain.",
    lore: "Never lost an escorted hull. The record is painted inside the cockpit where only the pilot can read it.",
    hull: 95, shield: 65, maxEnergy: 115, passive: ["onShieldBreak", "shieldCapacity", 8], abilityName: "Umbrella Field",
    primaryDefence: "shield", offensiveIdentity: "support",
    visualIdentity: "Rounded white hull, green field-lines, medical calm at combat speed.",
    ascensionGate: 2, ascensionModuleId: "module-lattice-shield",
  },
  {
    id: "maelstrom-x1", name: "Maelstrom X-1", shipClass: "prototype", frameworkClass: "experimentalPrototype",
    manufacturerId: "prototype-division", tier: "prototype", specialisation: "crowdControl",
    collectionKind: "prototypeHulls", discoveryMethod: "Volunteered for — the Division does not assign the X-1.",
    lore: "The shear field works. The warning stencils are for everything else.",
    hull: 85, shield: 45, maxEnergy: 125, passive: ["onDamageTaken", "statusChance", 0.05], abilityName: "Shear Field",
    primaryDefence: "avoidance", offensiveIdentity: "areaDamage",
    visualIdentity: "Matte black baffles over mismatched test panels, telemetry exposed, stencils in three languages.",
    ascensionGate: 3, ascensionModuleId: "module-cryo-loop",
  },
];

function buildRosterShip(spec: RosterShipSpec): ShipDef {
  return {
    id: spec.id,
    name: spec.name,
    shipClass: spec.shipClass,
    manufacturer: MANUFACTURERS.find((m) => m.id === spec.manufacturerId)!.name,
    faction: "Human Alliance",
    lore: spec.lore,
    hull: spec.hull,
    shield: spec.shield,
    maxEnergy: spec.maxEnergy,
    energyRegenPerSecond: 6,
    movementProfile: {
      maxSpeed: 8 + (spec.hull <= 80 ? 3 : 0),
      acceleration: 45 + (spec.specialisation === "speed" ? 25 : 0),
      deceleration: 60,
      boostSpeed: 18 + (spec.specialisation === "speed" ? 8 : 0),
      boostDurationMs: 260,
      boostCooldownMs: 1400,
      boostGrantsInvulnerability: spec.specialisation === "speed",
      collisionRadius: spec.hull >= 110 ? 0.55 : 0.45,
      speedMultiplierClamp: { min: 0.15, max: 3 },
      impulseDecayPerSecond: 8,
      turnRatePerSecond: "instant",
      mass: spec.hull / 100,
      handling: spec.hull <= 80 ? 1.15 : 0.85,
      movementFriction: 0,
    },
    passive: { trigger: spec.passive[0], bonus: { kind: spec.passive[1], value: spec.passive[2] }, ...(spec.passive[0] === "onLowHealth" ? { threshold: 0.3 } : {}) },
    ability: { id: `${spec.id}-ability`, name: spec.abilityName, cooldownMs: 11000, energyCost: 45 },
  };
}

function buildRosterProfile(spec: RosterShipSpec): ShipProfileDef {
  return {
    shipId: spec.id,
    frameworkClass: spec.frameworkClass,
    visualIdentity: spec.visualIdentity,
    primaryDefence: spec.primaryDefence,
    offensiveIdentity: spec.offensiveIdentity,
    heatCapacity: 60 + Math.round(spec.maxEnergy / 4),
    cargoCapacity: 40 + Math.round(spec.hull / 4),
    weaponSlots: spec.hull >= 110 ? 3 : 2,
    equipmentSlots: 3,
    moduleSlots: spec.tier === "legendary" || spec.tier === "prototype" ? 4 : 3,
    ultimate: { id: `${spec.id}-ultimate`, name: `${spec.name} Ultimate System`, chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.04 },
    specialMechanic: {
      tag: `${spec.id}-doctrine`,
      description: `${spec.name} — ${spec.specialisation} as an engineering philosophy.`,
      passive: { trigger: spec.passive[0], bonus: { kind: spec.passive[1], value: spec.passive[2] / 2 } },
    },
    ascensionUpgrade: {
      requiredAscensionLevel: spec.ascensionGate,
      moduleId: spec.ascensionModuleId,
      description: `Ascension ${spec.ascensionGate}: the ${spec.name}'s signature module fits free.`,
    },
    masteryTrackId: `ship:${spec.id}`,
    statisticKeys: [`ship:${spec.id}:usage`, `ship:${spec.id}:missionSuccess`],
    cosmetics: [
      { kind: "paintSchemes", id: `${spec.id}-manufacturer-livery` },
      { kind: "decals", id: `${spec.id}-manufacturer-decal` },
    ],
    futureExpansionHooks: [`variant-${spec.id}-mk-next`],
  };
}

/** Roster entries for the AF-031/073 trio — the fleet's first three berths. */
const EXISTING_ENTRIES: readonly RosterShipEntry[] = [
  { shipId: "wayfarer-hull-mk2", manufacturerId: "halcyon-driveworks", tier: "common", specialisation: "exploration", collectionKind: "blueprints", discoveryMethod: "The starting hull — every restoration begins with a survey." },
  { shipId: "bastion-hull-mk1", manufacturerId: "ironmoor-foundry", tier: "uncommon", specialisation: "tanking", collectionKind: "blueprints", discoveryMethod: "Blueprint purchase from Ironmoor's open catalogue." },
  { shipId: "aurelia-hull-mk1", manufacturerId: "meridian-yards", tier: "ancient", specialisation: "scientificOperations", collectionKind: "ancientDesigns", discoveryMethod: "Reprinted from precursor sensor schematics recovered at First Light." },
];

/** The launch fleet — ten hulls on unchanged shapes; the mythic tier is registered
 * vocabulary awaiting its first hull (the bossId-null honesty pattern). */
export const LAUNCH_FLEET: readonly ShipDef[] = [...FRAMEWORK_SHIPS, ...ROSTER_SPECS.map(buildRosterShip)];
export const FLEET_PROFILES: readonly ShipProfileDef[] = [...SHIP_PROFILES, ...ROSTER_SPECS.map(buildRosterProfile)];
export const FLEET_ENTRIES: readonly RosterShipEntry[] = [
  ...EXISTING_ENTRIES,
  ...ROSTER_SPECS.map((spec) => ({
    shipId: spec.id,
    manufacturerId: spec.manufacturerId,
    tier: spec.tier,
    specialisation: spec.specialisation,
    collectionKind: spec.collectionKind,
    discoveryMethod: spec.discoveryMethod,
  })),
];

export const STARTING_SHIP_IDS: readonly string[] = ["wayfarer-hull-mk2"];

/** "Future ships extend naturally" at 25+/50+/100+ — deterministic synthetic hulls on the same shapes. */
export function syntheticShipFor(index: number): { def: ShipDef; profile: ShipProfileDef; entry: RosterShipEntry } {
  const triggers: readonly PassiveTrigger[] = ["onKill", "onDamageTaken", "onShieldBreak", "onLowHealth", "onCriticalHit"];
  const bonuses: readonly BonusKind[] = [
    "damage", "criticalChance", "criticalDamage", "shieldCapacity", "shieldRegeneration", "movementSpeed",
    "boostEfficiency", "cooldownReduction", "statusChance", "statusDuration", "resourceGain", "experienceGain", "pickupRadius",
  ];
  const spec: RosterShipSpec = {
    id: `synthetic-hull-${index}`,
    name: `Synthetic Hull ${index}`,
    shipClass: "experimental",
    frameworkClass: "experimentalPrototype",
    manufacturerId: MANUFACTURER_IDS[index % MANUFACTURER_IDS.length]!,
    tier: SHIP_TIERS[index % SHIP_TIERS.length]!,
    specialisation: SHIP_SPECIALISATIONS[index % SHIP_SPECIALISATIONS.length]!,
    collectionKind: SHIP_COLLECTION_KINDS[index % SHIP_COLLECTION_KINDS.length]!,
    discoveryMethod: `Expansion discovery ${index}.`,
    lore: `Fleet expansion proof ${index}.`,
    hull: 80 + (index % 5) * 10,
    shield: 30 + (index % 4) * 10,
    maxEnergy: 100,
    passive: [triggers[index % triggers.length]!, bonuses[index % bonuses.length]!, 0.04],
    abilityName: `Synthetic Ability ${index}`,
    primaryDefence: (["hull", "shield", "armour", "energyBarrier", "repairSystems", "avoidance", "mobility"] as const)[index % 7]!,
    offensiveIdentity: (["precision", "burstDamage", "areaDamage", "droneWarfare", "beamWeapons", "missiles", "support", "hybridCombat"] as const)[index % 8]!,
    visualIdentity: `Synthetic visual ${index}.`,
    ascensionGate: ((index % 3) + 1) as 1 | 2 | 3,
    ascensionModuleId: "module-fusion-reactor",
  };
  return {
    def: buildRosterShip(spec),
    profile: buildRosterProfile(spec),
    entry: { shipId: spec.id, manufacturerId: spec.manufacturerId, tier: spec.tier, specialisation: spec.specialisation, collectionKind: spec.collectionKind, discoveryMethod: spec.discoveryMethod },
  };
}

/** Sanity re-export so tests can assert the locked pair heads the fleet unchanged. */
export const LOCKED_SANDBOX_SHIPS = SANDBOX_SHIPS;
