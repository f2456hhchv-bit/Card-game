/**
 * Equipment Roster (AF-080). The AF-076/078 roster move applied to
 * engineering: AF-028's EquipmentItemDef and AF-079's EquipmentProfileDef
 * are UNCHANGED — the ecosystem is data. Fourteen engineering
 * manufacturers (the spec's twelve plus the two already shipped in
 * AF-079 profiles), each with all SIX identity parts and a cross-binding
 * to AF-074's shipwright register where the company also builds hulls;
 * eighteen module families mapped TOTALLY onto AF-079's sixteen
 * categories; ten engineering philosophies; module sets classified by
 * kind with a GAMEPLAY clause; prototype engineering that PAYS
 * (instability as a negative bonus, the AF-078 void law applied to
 * modules); and the engineering lab as DERIVATION over data every module
 * already carries. syntheticEquipmentFor(n) proves the roster scales to
 * 100+ through AF-079's unchanged laws.
 */
import type { ManufacturerId } from "../ships/shipRosterData";
import { SANDBOX_SETS, type EquipmentItemDef, type SetDef } from "./equipmentData";
import {
  EQUIPMENT_PROFILES,
  FRAMEWORK_EQUIPMENT,
  MODULE_CATEGORIES,
  type EquipmentProfileDef,
  type ModuleCategory,
} from "./equipmentFrameworkData";

/** Engineering manufacturers (AF-080 §Manufacturers) — the spec's twelve plus
 * the two already shipped (Ironmoor, Meridian appear in AF-079 profiles). */
export const ENGINEERING_MANUFACTURER_IDS = [
  "atlas-dynamics",
  "helios-industries",
  "nova-forge",
  "vanguard-systems",
  "aegis-engineering",
  "quantum-horizon",
  "black-horizon",
  "frontier-salvage",
  "ancient-foundry",
  "paragon-laboratories",
  "void-recovery-initiative",
  "crystal-resonance-guild",
  "ironmoor-foundry",
  "meridian-yards",
] as const;
export type EngineeringManufacturerId = (typeof ENGINEERING_MANUFACTURER_IDS)[number];

/** The six identity parts every engineering company must carry (AF-080 §Manufacturers). */
export interface EngineeringManufacturerDef {
  id: EngineeringManufacturerId;
  name: string;
  engineeringPhilosophy: string;
  visualLanguage: string;
  lore: string;
  technologySpecialisation: string;
  audioIdentity: string;
  signatureMechanic: string;
  /** AF-074 cross-binding — set when the same company also builds hulls;
   * a profiled module by a bound maker must carry that shipwright id. */
  shipwrightId: ManufacturerId | null;
}

export const ENGINEERING_MANUFACTURERS: readonly EngineeringManufacturerDef[] = [
  { id: "atlas-dynamics", name: "Atlas Dynamics", engineeringPhilosophy: "If it cannot be repaired with a wrench, it is a prototype.", visualLanguage: "Slab housings, visible bolts, output tables stencilled by hand.", lore: "The shipyard's module division — same bolts, smaller crates.", technologySpecialisation: "Reactors and structural power.", audioIdentity: "Deep transformer hums with mechanical relays.", signatureMechanic: "Overbuilt cores that shrug off overload states.", shipwrightId: "atlas-dynamics" },
  { id: "helios-industries", name: "Helios Industries", engineeringPhilosophy: "Speed is a form of armour.", visualLanguage: "Sun-gold cowlings over white ceramic.", lore: "Racing-stock engineering detuned exactly once for the survey market.", technologySpecialisation: "Engine systems and thrust management.", audioIdentity: "Rising turbine notes that settle a tone above silence.", signatureMechanic: "Boost curves that reward committed throttle.", shipwrightId: "helios-industries" },
  { id: "nova-forge", name: "Nova Forge", engineeringPhilosophy: "The ship is a nest; the work belongs to the flock.", visualLanguage: "Hive-textured housings, always slightly in motion.", lore: "The mining collective's fabricators — the tools still look after themselves.", technologySpecialisation: "Drone control and autonomous systems.", audioIdentity: "Chittering servo choruses under a low nest-hum.", signatureMechanic: "Modules that delegate their work to the swarm.", shipwrightId: "nova-forge" },
  { id: "vanguard-systems", name: "Vanguard Systems", engineeringPhilosophy: "Every system serves the killing shot.", visualLanguage: "Blade-lined casings, gunmetal blue, one running light.", lore: "Fleetworks' integration subsidiary — the doctrine, sold by the module.", technologySpecialisation: "Fire-control integration.", audioIdentity: "A held breath, then a confirmation click.", signatureMechanic: "Cross-module timing that sharpens critical windows.", shipwrightId: "vanguard-fleetworks" },
  { id: "aegis-engineering", name: "Aegis Engineering", engineeringPhilosophy: "The best module returns everyone home.", visualLanguage: "Rounded white housings with green field-lines.", lore: "The convoy guard's engineering arm; the umbrella doctrine, miniaturised.", technologySpecialisation: "Shield harmonics and repair arrays.", audioIdentity: "Soft field hums with chime confirmations.", signatureMechanic: "Defences that keep working while damage keeps arriving.", shipwrightId: "aegis-systems" },
  { id: "quantum-horizon", name: "Quantum Horizon", engineeringPhilosophy: "The impossible is an engineering deadline.", visualLanguage: "Iridescent panelling that renders a frame late.", lore: "Zone researchers who came back employable — their modules almost did.", technologySpecialisation: "Quantum systems and exotic capacitance.", audioIdentity: "Sounds that arrive slightly before the switch.", signatureMechanic: "Probability-weighted performance — unstable, and worth it.", shipwrightId: "quantum-horizon" },
  { id: "black-horizon", name: "Black Horizon", engineeringPhilosophy: "Control the field and the fight concedes.", visualLanguage: "Matte void panels; hard to photograph, harder to trace.", lore: "Nobody incorporates Black Horizon. It is simply, occasionally, invoiced.", technologySpecialisation: "Sensor denial and interdiction packages.", audioIdentity: "Near-silence with a pressure drop on activation.", signatureMechanic: "Modules the enemy discovers by their absence of warning.", shipwrightId: null },
  { id: "frontier-salvage", name: "Frontier Salvage", engineeringPhilosophy: "It runs, it ships.", visualLanguage: "Mismatched panels, honest rust, serials from three fleets.", lore: "The graveyard's quartermasters — every module has a previous owner.", technologySpecialisation: "Reclamation engineering and field repair.", audioIdentity: "Rattling starts with a proud aftershake.", signatureMechanic: "Performance tuned by whatever parts arrived that week.", shipwrightId: null },
  { id: "ancient-foundry", name: "Ancient Foundry", engineeringPhilosophy: "The precursors finished this design; we merely reprint it.", visualLanguage: "White stone alloy and gold conduit, excavated not machined.", lore: "Not a company — a licensed dig site with a clean room attached.", technologySpecialisation: "Vigil-grade integration.", audioIdentity: "A choir-like idle that predates its operators.", signatureMechanic: "Systems that recognise what they were built to guard against.", shipwrightId: "ancient-foundry" },
  { id: "paragon-laboratories", name: "Paragon Laboratories", engineeringPhilosophy: "Ship it before it is safe; learn why it was not.", visualLanguage: "Exposed telemetry, warning stencils, one fresh weld always cooling.", lore: "The Protocol's module programme, resumed by volunteers with insurance.", technologySpecialisation: "Experimental systems and overdrive states.", audioIdentity: "Unstable charge whines the manual says are normal.", signatureMechanic: "Overdriven modes that trade heat for possibility.", shipwrightId: null },
  { id: "void-recovery-initiative", name: "Void Recovery Initiative", engineeringPhilosophy: "Recovered, not designed.", visualLanguage: "Seams of not-quite-black that drip upward.", lore: "A salvage designation for what the Legion left running.", technologySpecialisation: "Void technology containment.", audioIdentity: "A sound best described as an absence arriving.", signatureMechanic: "Power that requires sacrifice — the void law, in a housing.", shipwrightId: null },
  { id: "crystal-resonance-guild", name: "Crystal Resonance Guild", engineeringPhilosophy: "The lattice remembers; we only tune it.", visualLanguage: "Grown crystal cores in survey-white frames.", lore: "Expanse harmonicists who taught the shard-song to circuitry.", technologySpecialisation: "Crystal resonance and frequency work.", audioIdentity: "Glass-chime harmonics that frost at the edges.", signatureMechanic: "Modules that answer to frequency, not force.", shipwrightId: null },
  { id: "ironmoor-foundry", name: "Ironmoor Foundry", engineeringPhilosophy: "Mass is honesty.", visualLanguage: "Foundry grey, proud weld seams, amber indicators.", lore: "The hull foundry's fittings division — sold by weight, warrantied by it.", technologySpecialisation: "Armour systems and stationary resilience.", audioIdentity: "One flat authoritative clunk per activation.", signatureMechanic: "Plating that treats standing still as a doctrine.", shipwrightId: "ironmoor-foundry" },
  { id: "meridian-yards", name: "Meridian Yards", engineeringPhilosophy: "See everything first.", visualLanguage: "Survey-white lattices grown around instrument cores.", lore: "The survey yard's field kit — instruments before armour, always.", technologySpecialisation: "Cooling arrays and sensor mass.", audioIdentity: "Quiet sublimation hiss under instrument ticks.", signatureMechanic: "Heat vented the way the Reach vents everything: quietly.", shipwrightId: "meridian-yards" },
];

/** Module families (AF-080 §Module Families) — eighteen, mapped TOTALLY onto AF-079's sixteen categories. */
export const MODULE_FAMILIES = [
  "powerGeneration",
  "powerDistribution",
  "shieldSystems",
  "engineSystems",
  "coolingArrays",
  "targetingComputers",
  "droneControl",
  "navigation",
  "scanning",
  "sensorPackages",
  "missileGuidance",
  "armourSystems",
  "repairTechnology",
  "experimentalSystems",
  "ancientTechnology",
  "quantumSystems",
  "voidTechnology",
  "crystalResonance",
] as const;
export type ModuleFamily = (typeof MODULE_FAMILIES)[number];

export const FAMILY_TO_MODULE_CATEGORY: Readonly<Record<ModuleFamily, ModuleCategory>> = {
  powerGeneration: "reactors",
  powerDistribution: "powerConverters",
  shieldSystems: "shieldGenerators",
  engineSystems: "engineSystems",
  coolingArrays: "coolingSystems",
  targetingComputers: "targetingComputers",
  droneControl: "droneBays",
  navigation: "navigationSystems",
  scanning: "sensorArrays",
  sensorPackages: "sensorArrays",
  missileGuidance: "missileSystems",
  armourSystems: "armourPlating",
  repairTechnology: "repairSystems",
  experimentalSystems: "experimentalModules",
  ancientTechnology: "ancientModules",
  quantumSystems: "prototypeModules",
  voidTechnology: "experimentalModules",
  crystalResonance: "experimentalModules",
};

/** Engineering philosophies (AF-080 §Engineering Philosophies) — ten registered; every roster module carries one. */
export const ENGINEERING_PHILOSOPHIES = [
  "efficiency",
  "overclocking",
  "reliability",
  "riskVsReward",
  "mobility",
  "defence",
  "automation",
  "energyControl",
  "heatManagement",
  "support",
] as const;
export type EngineeringPhilosophy = (typeof ENGINEERING_PHILOSOPHIES)[number];

/** Advanced synergy surfaces (AF-080 §Advanced Synergy) — ten; extends AF-079's eight. */
export const ADVANCED_SYNERGY_SURFACES = ["ships", "weapons", "commanders", "relics", "research", "ascension", "biomeEffects", "factionBonuses", "missionModifiers", "worldEvents"] as const;

/** Module set kinds (AF-080 §Module Sets) — seven registered. */
export const MODULE_SET_KINDS = ["manufacturerSet", "technologySet", "ancientSet", "prototypeSet", "factionSet", "experimentalSet", "hybridSet"] as const;
export type ModuleSetKind = (typeof MODULE_SET_KINDS)[number];

/** Every roster set is classified by kind and carries a GAMEPLAY clause —
 * "set bonuses alter gameplay, never only statistics" as authored intent
 * riding AF-028's unchanged SetDef engine. */
export interface ModuleSetEntry {
  setId: string;
  kind: ModuleSetKind;
  gameplayClause: string;
}

/** Engineering research kinds (AF-080 §Engineering Research) — six registered. */
export const ENGINEERING_RESEARCH_KINDS = ["alternativeConfigurations", "efficiency", "experimentalTechnologies", "manufacturerSpecialisations", "prototypeCompatibility", "ancientIntegration"] as const;

/** Collection kinds (AF-080 §Collection) — eight registered; permanent by the AF-026 pattern. */
export const ENGINEERING_COLLECTION_KINDS = ["modules", "manufacturers", "prototypeSystems", "ancientSystems", "setCollections", "engineeringBlueprints", "statistics", "lore"] as const;

/** Engineering lab features (AF-080 §Engineering Lab) — seven; DERIVED from data below. */
export const ENGINEERING_LAB_FEATURES = ["blueprintViewer", "moduleTesting", "damageSimulator", "powerSimulator", "heatSimulator", "buildComparison", "theorycraftSandbox"] as const;
export type EngineeringLabFeature = (typeof ENGINEERING_LAB_FEATURES)[number];

/** Forbidden balance outcomes (AF-080 §Balance Principles) — registered BY NAME, the AF-070 move. */
export const ENGINEERING_FORBIDDEN_OUTCOMES = ["mandatoryOptimisation", "dominantModule"] as const;

/** Accessibility surfaces (AF-080 §Accessibility) — eight registered. */
export const ENGINEERING_ACCESSIBILITY_SURFACES = ["recommendedModules", "powerVisualisation", "heatVisualisation", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport", "detailedComparisons"] as const;

/** Performance disciplines (AF-080 §Performance) — four registered. */
export const ENGINEERING_PERFORMANCE_DISCIPLINES = ["cacheEngineeringCalculations", "optimisePassiveEvaluation", "poolModuleEffects", "reuseSharedEngineeringLogic"] as const;

// ─── The roster modules — data on AF-028/079's unchanged shapes ─────────────

/** Aegis Bastion Array — pure Aegis defence; one half of the Bastion set. */
export const AEGIS_BASTION_ARRAY: EquipmentItemDef = {
  id: "aegis-bastion-array",
  category: "defensiveModule",
  name: "Aegis Bastion Array",
  bonuses: [{ kind: "shieldCapacity", value: 12 }],
  passives: [{ trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 2 } }],
  active: null,
  setId: "bastion",
  uniqueExclusive: false,
  requiresCategory: null,
};

/** Aegis Ward Projector — repair technology; the other half of the Bastion set. */
export const AEGIS_WARD_PROJECTOR: EquipmentItemDef = {
  id: "aegis-ward-projector",
  category: "utilityModule",
  name: "Aegis Ward Projector",
  bonuses: [{ kind: "shieldRegeneration", value: 3 }],
  passives: [{ trigger: "onLowHealth", bonus: { kind: "shieldCapacity", value: 10 }, threshold: 0.3 }],
  active: null,
  setId: "bastion",
  uniqueExclusive: false,
  requiresCategory: null,
};

/** Horizon Flux Capacitor — PROTOTYPE engineering that PAYS: a conditional
 * critical engine with INSTABILITY as a real negative clause (the AF-078
 * void law applied to modules), unique, and reactor-gated. */
export const HORIZON_FLUX_CAPACITOR: EquipmentItemDef = {
  id: "horizon-flux-capacitor",
  category: "prototypeEquipment",
  name: "Horizon Flux Capacitor",
  bonuses: [
    { kind: "criticalChance", value: 0.05 },
    { kind: "movementSpeed", value: -0.02 }, // instability — the prototype pays
  ],
  passives: [{ trigger: "onCriticalHit", bonus: { kind: "damage", value: 0.04 } }],
  active: null,
  setId: null,
  uniqueExclusive: true,
  requiresCategory: "energyModule", // needs a reactor aboard — conditional by design
};

/** Nova Warden Hive — drone control; the first EQUIPMENT producer of AF-028's
 * registered-future droneEffectiveness bonus kind. */
export const NOVA_WARDEN_HIVE: EquipmentItemDef = {
  id: "nova-warden-hive",
  category: "droneModule",
  name: "Nova Warden Hive",
  bonuses: [{ kind: "droneEffectiveness", value: 0.1 }],
  passives: [{ trigger: "onKill", bonus: { kind: "droneEffectiveness", value: 0.02 } }],
  active: null,
  setId: null,
  uniqueExclusive: false,
  requiresCategory: null,
};

/** The full workshop roster — AF-079's six head the array unchanged. */
export const ROSTER_EQUIPMENT: readonly EquipmentItemDef[] = [
  ...FRAMEWORK_EQUIPMENT,
  AEGIS_BASTION_ARRAY,
  AEGIS_WARD_PROJECTOR,
  HORIZON_FLUX_CAPACITOR,
  NOVA_WARDEN_HIVE,
];

/** The Bastion set — Aegis Engineering's manufacturer set, through AF-028's
 * UNCHANGED SetDef engine. */
export const BASTION_SET: SetDef = {
  id: "bastion",
  name: "Bastion Doctrine",
  pieceIds: ["aegis-bastion-array", "aegis-ward-projector"],
  thresholds: {
    2: [{ kind: "shieldRegeneration", value: 4 }],
  },
};

/** All live sets — AF-028's vanguard set heads the array unchanged. */
export const ROSTER_EQUIPMENT_SETS: readonly SetDef[] = [...SANDBOX_SETS, BASTION_SET];

/** Set classifications: the vanguard set spans THREE manufacturers (hybrid);
 * the Bastion is pure Aegis (manufacturer). Five kinds honestly await content. */
export const MODULE_SET_ENTRIES: readonly ModuleSetEntry[] = [
  { setId: "vanguard", kind: "hybridSet", gameplayClause: "Three manufacturers, one doctrine — the pieces reward committing the whole hull to the killing shot." },
  { setId: "bastion", kind: "manufacturerSet", gameplayClause: "The umbrella doctrine: defences keep working while damage keeps arriving, and desperation is the trigger." },
];

/** AF-079 profiles for the roster additions — the locked five head the array unchanged. */
export const ROSTER_EQUIPMENT_PROFILES: readonly EquipmentProfileDef[] = [
  ...EQUIPMENT_PROFILES,
  {
    itemId: "aegis-bastion-array",
    moduleCategory: "armourPlating",
    manufacturerId: "aegis-systems",
    visualIdentity: "Rounded white segments with green field-lines that brighten under fire.",
    lore: "Convoy doctrine in a housing: the shield that shares.",
    energyRequirement: 0,
    heatOutput: 3,
    weight: 10,
    rarity: "improved",
    synergyTags: ["shield", "defence", "bastion"],
    upgradeRoute: "engineering",
    evolutionRoute: null,
    statisticKeys: ["equipment:aegis-bastion-array:absorbs"],
    futureExpansionHooks: ["upgrade-bastion-array-mk2"],
  },
  {
    itemId: "aegis-ward-projector",
    moduleCategory: "repairSystems",
    manufacturerId: "aegis-systems",
    visualIdentity: "A soft green lantern that swings toward whatever is bleeding.",
    lore: "Aegis never lost an escorted hull. This is why.",
    energyRequirement: 0,
    heatOutput: 2,
    weight: 7,
    rarity: "rare",
    synergyTags: ["repair", "support", "bastion"],
    upgradeRoute: "blueprints",
    evolutionRoute: null,
    statisticKeys: ["equipment:aegis-ward-projector:saves"],
    futureExpansionHooks: ["upgrade-ward-projector-choir"],
  },
  {
    itemId: "horizon-flux-capacitor",
    moduleCategory: "prototypeModules",
    manufacturerId: "quantum-horizon",
    visualIdentity: "An iridescent bottle whose contents render a frame late.",
    lore: "The deadline was impossible. Horizon shipped it anyway, and the warning label is load-bearing.",
    energyRequirement: 0,
    heatOutput: 9, // strictly the hottest module — prototype heat, the AF-076 discipline
    weight: 4,
    rarity: "epic",
    synergyTags: ["critical", "prototype", "instability"],
    upgradeRoute: "research",
    evolutionRoute: "research",
    statisticKeys: ["equipment:horizon-flux-capacitor:surges"],
    futureExpansionHooks: ["evolution-flux-capacitor-stable"],
  },
  {
    itemId: "nova-warden-hive",
    moduleCategory: "droneBays",
    manufacturerId: "nova-forge",
    visualIdentity: "A hive-textured berth that is never quite still.",
    lore: "The tools defended themselves first. Now they defend you.",
    energyRequirement: 0,
    heatOutput: 3,
    weight: 9,
    rarity: "rare",
    synergyTags: ["drones", "automation", "swarm"],
    upgradeRoute: "mastery",
    evolutionRoute: "combat",
    statisticKeys: ["equipment:nova-warden-hive:sorties"],
    futureExpansionHooks: ["evolution-warden-hive-brood"],
  },
];

/** A roster entry binds identity ONLY — engineering manufacturer, family,
 * philosophy, set membership. No stat field exists, so a roster-driven
 * stat bump is unrepresentable (the AF-072/074/076/078 discipline). */
export interface EquipmentRosterEntry {
  itemId: string;
  engineeringManufacturerId: EngineeringManufacturerId;
  family: ModuleFamily;
  philosophy: EngineeringPhilosophy;
  setId: string | null;
}

export const EQUIPMENT_ROSTER_ENTRIES: readonly EquipmentRosterEntry[] = [
  { itemId: "barrier-plate", engineeringManufacturerId: "ironmoor-foundry", family: "shieldSystems", philosophy: "defence", setId: "vanguard" },
  { itemId: "vanguard-thrusters", engineeringManufacturerId: "helios-industries", family: "engineSystems", philosophy: "mobility", setId: "vanguard" },
  { itemId: "vanguard-core", engineeringManufacturerId: "atlas-dynamics", family: "powerGeneration", philosophy: "energyControl", setId: "vanguard" },
  { itemId: "ancient-relay", engineeringManufacturerId: "ancient-foundry", family: "ancientTechnology", philosophy: "support", setId: null },
  { itemId: "cryo-manifold", engineeringManufacturerId: "meridian-yards", family: "coolingArrays", philosophy: "heatManagement", setId: null },
  { itemId: "aegis-bastion-array", engineeringManufacturerId: "aegis-engineering", family: "armourSystems", philosophy: "defence", setId: "bastion" },
  { itemId: "aegis-ward-projector", engineeringManufacturerId: "aegis-engineering", family: "repairTechnology", philosophy: "support", setId: "bastion" },
  { itemId: "horizon-flux-capacitor", engineeringManufacturerId: "quantum-horizon", family: "quantumSystems", philosophy: "riskVsReward", setId: null },
  { itemId: "nova-warden-hive", engineeringManufacturerId: "nova-forge", family: "droneControl", philosophy: "automation", setId: null },
];

/** §Engineering Lab: all seven features DERIVED from data every module
 * already carries — the lab is a viewer, not a system. */
export function engineeringLabFor(def: EquipmentItemDef, profile: EquipmentProfileDef): Record<EngineeringLabFeature, string> {
  const bonusKinds = def.bonuses.map((b) => b.kind).join(", ");
  return {
    blueprintViewer: profile.visualIdentity,
    moduleTesting: `${def.bonuses.length} bonuses · ${def.passives.length} passives · ${def.active ? "1 active" : "no active"}`,
    damageSimulator: bonusKinds.length > 0 ? `surfaces: ${bonusKinds}` : "no combat surface",
    powerSimulator: `energy draw ${profile.energyRequirement}`,
    heatSimulator: `heat output ${profile.heatOutput}`,
    buildComparison: `${profile.rarity} ${profile.moduleCategory} · ${profile.weight} mass`,
    theorycraftSandbox: profile.synergyTags.join(" + "),
  };
}

/** "Limitless engineering possibilities" as a generator — deterministic
 * synthetic modules passing AF-079's unchanged laws, for scalability proofs. */
export function syntheticEquipmentFor(n: number): { def: EquipmentItemDef; profile: EquipmentProfileDef } {
  const category = MODULE_CATEGORIES[n % MODULE_CATEGORIES.length]!;
  const philosophy = ENGINEERING_PHILOSOPHIES[n % ENGINEERING_PHILOSOPHIES.length]!;
  const def: EquipmentItemDef = {
    id: `synthetic-module-${n}`,
    category: "utilityModule",
    name: `Synthetic Module ${n}`,
    bonuses: [{ kind: "resourceGain", value: 0.01 + (n % 7) * 0.01 }],
    passives: [{ trigger: "onKill", bonus: { kind: "pickupRadius", value: 0.01 } }],
    active: null,
    setId: null,
    uniqueExclusive: false,
    requiresCategory: null,
  };
  const profile: EquipmentProfileDef = {
    itemId: def.id,
    moduleCategory: category,
    manufacturerId: "atlas-dynamics",
    visualIdentity: `Synthetic housing pattern ${n}.`,
    lore: `Batch ${n} of the synthetic proving run.`,
    energyRequirement: 0,
    heatOutput: n % 5,
    weight: 1 + (n % 9),
    rarity: "common",
    synergyTags: [philosophy],
    upgradeRoute: "engineering",
    evolutionRoute: null,
    statisticKeys: [`equipment:synthetic-${n}:uses`],
    futureExpansionHooks: [`synthetic-${n}-mk2`],
  };
  return { def, profile };
}
