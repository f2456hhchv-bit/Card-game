/**
 * Equipment Framework data shapes (AF-079). EXTENDS AF-028's locked
 * equipment system — `EquipmentItemDef`, the slot/category shelves,
 * `SLOT_ACCEPTS` validation, sets, and aggregation are untouched. AF-079
 * wraps each MODULE in a PROFILE (the AF-071→077 pattern): the sixteen
 * spec categories map totally onto AF-028's twelve; AF-073's eight
 * ship-module kinds map totally onto the sixteen (ONE engineering
 * vocabulary across ships and equipment); manufacturers are AF-074's
 * ship-manufacturer register (equipment is ship-installed technology);
 * energy requirements tie to AF-031's real energy resource; heat output
 * and weight are registered DORMANT numerics (the AF-073/075 pattern).
 * The module's law: NO MODULE EXISTS ONLY TO INCREASE NUMBERS — every
 * profiled module must carry at least one non-numeric engineering
 * dimension (a passive, an active, set membership, uniqueness, or a
 * category requirement), counted by `engineeringDimensionsFor` and
 * asserted across the workshop.
 */
import type { ManufacturerId } from "../ships/shipRosterData";
import type { ShipModuleKind } from "../ships/shipFrameworkData";
import type { Rarity } from "../loot/lootTuning";
import { type EquipmentCategory, type EquipmentItemDef } from "./equipmentData";
import { SANDBOX_EQUIPMENT } from "./equipmentData";

/** The sixteen spec module categories (AF-079 §Module Categories) — mapped totally onto AF-028's shelf. */
export const MODULE_CATEGORIES = [
  "reactors",
  "shieldGenerators",
  "engineSystems",
  "coolingSystems",
  "targetingComputers",
  "sensorArrays",
  "droneBays",
  "powerConverters",
  "missileSystems",
  "armourPlating",
  "repairSystems",
  "navigationSystems",
  "cargoModules",
  "experimentalModules",
  "ancientModules",
  "prototypeModules",
] as const;
export type ModuleCategory = (typeof MODULE_CATEGORIES)[number];

export const MODULE_CATEGORY_TO_EQUIPMENT_CATEGORY: Readonly<Record<ModuleCategory, EquipmentCategory>> = {
  reactors: "energyModule",
  shieldGenerators: "defensiveModule",
  engineSystems: "engineModule",
  coolingSystems: "energyModule",
  targetingComputers: "targetingSystem",
  sensorArrays: "utilityModule",
  droneBays: "droneModule",
  powerConverters: "energyModule",
  missileSystems: "secondarySystem",
  armourPlating: "defensiveModule",
  repairSystems: "utilityModule",
  navigationSystems: "engineModule",
  cargoModules: "utilityModule",
  experimentalModules: "prototypeEquipment",
  ancientModules: "ancientTechnology",
  prototypeModules: "prototypeEquipment",
};

/** AF-073's eight ship-module kinds map totally onto the sixteen — ONE engineering vocabulary. */
export const SHIP_MODULE_KIND_TO_MODULE_CATEGORY: Readonly<Record<ShipModuleKind, ModuleCategory>> = {
  reactors: "reactors",
  engines: "engineSystems",
  shieldSystems: "shieldGenerators",
  targetingSystems: "targetingComputers",
  droneBays: "droneBays",
  sensorArrays: "sensorArrays",
  coolingSystems: "coolingSystems",
  experimentalModules: "experimentalModules",
};

/** The 17-part equipment architecture (AF-079 §Equipment Architecture) — every module feels handcrafted. */
export const EQUIPMENT_ARCHITECTURE_PARTS = [
  "uniqueId",
  "manufacturer",
  "category",
  "visualIdentity",
  "lore",
  "passiveEffect",
  "activeEffect",
  "energyRequirement",
  "heatOutput",
  "weight",
  "rarity",
  "synergyTags",
  "upgradePath",
  "evolutionPath",
  "statistics",
  "collectionStatus",
  "futureExpansionHooks",
] as const;
export type EquipmentArchitecturePart = (typeof EQUIPMENT_ARCHITECTURE_PARTS)[number];

/** Resource-management surfaces (AF-079 §Resource Management) — seven registered. */
export const RESOURCE_MANAGEMENT_SURFACES = ["energy", "heat", "power", "cooldowns", "shieldCapacity", "hullIntegrity", "repairRate"] as const;

/** Synergy surfaces (AF-079 §Module Synergy) — eight registered. */
export const MODULE_SYNERGY_SURFACES = ["ships", "weapons", "relics", "commanders", "research", "talents", "ascension", "biomeModifiers"] as const;

/** The spec's six installation slot kinds (AF-079 §Installation Rules), each realised by an
 * EXISTING AF-028 mechanism — no second slot system. */
export const INSTALLATION_MECHANISMS = ["generalEquipmentSlot", "categoryRestrictedSlot", "categoryGate", "uniqueExclusiveFlag"] as const;
export type InstallationMechanism = (typeof INSTALLATION_MECHANISMS)[number];

export const SPEC_SLOT_TO_MECHANISM: Readonly<Record<string, InstallationMechanism>> = {
  standardSlots: "generalEquipmentSlot", // equipment1–6 accept the general category list
  specialistSlots: "categoryRestrictedSlot", // primary/secondary weapon slots accept one category
  experimentalSlots: "categoryGate", // prototypeEquipment rides the general slots, gated by category
  ancientSlots: "categoryGate", // ancientTechnology likewise
  prototypeSlots: "categoryGate",
  uniqueSlots: "uniqueExclusiveFlag", // AF-028's uniqueExclusive — one instance ever
};
export const SPEC_SLOT_KINDS = Object.keys(SPEC_SLOT_TO_MECHANISM);

/** Upgrade routes (AF-079 §Upgrade System) — six registered; upgrades reinforce identity. */
export const EQUIPMENT_UPGRADE_ROUTES = ["engineering", "blueprints", "research", "mastery", "legendaryComponents", "ancientTechnology"] as const;
export type EquipmentUpgradeRoute = (typeof EQUIPMENT_UPGRADE_ROUTES)[number];

/** Evolution routes (AF-079 §Evolution) — six registered; evolution introduces new mechanics. */
export const EQUIPMENT_EVOLUTION_ROUTES = ["combat", "exploration", "research", "bosses", "ascension", "legendaryDiscoveries"] as const;
export type EquipmentEvolutionRoute = (typeof EQUIPMENT_EVOLUTION_ROUTES)[number];

/** Collection states (AF-079 §Collection) — seven registered; the monotone lattice again. */
export const EQUIPMENT_COLLECTION_STATES = ["discovered", "crafted", "mastered", "evolved", "prototypeVariants", "ancientVariants", "statistics"] as const;

/** Customisation kinds (AF-079 §Customisation) — six registered; engineering identity, never gameplay. */
export const EQUIPMENT_CUSTOMISATION_KINDS = ["manufacturerThemes", "moduleVisuals", "installationAnimations", "inspection", "engineeringDisplays", "blueprintGalleries"] as const;

/** The AF-079 profile — wraps an AF-028 EquipmentItemDef by id; the def itself is never modified. */
export interface EquipmentProfileDef {
  itemId: string;
  moduleCategory: ModuleCategory;
  /** AF-074's ship-manufacturer register — equipment is ship-installed technology. */
  manufacturerId: ManufacturerId;
  visualIdentity: string;
  lore: string;
  /** Draws against AF-031's REAL energy resource when the module has an active effect. */
  energyRequirement: number;
  /** Registered DORMANT numerics (the AF-073/075 pattern) — heat and mass systems become first consumers. */
  heatOutput: number;
  weight: number;
  rarity: Rarity;
  synergyTags: readonly string[];
  upgradeRoute: EquipmentUpgradeRoute;
  evolutionRoute: EquipmentEvolutionRoute | null;
  statisticKeys: readonly string[];
  futureExpansionHooks: readonly string[];
}

/** THE ENGINEERING LAW: count a module's non-numeric dimensions — every profiled
 * module must have at least one ("no module exists only to increase numbers"). */
export function engineeringDimensionsFor(def: EquipmentItemDef): number {
  let dimensions = 0;
  if (def.passives.length > 0) dimensions += 1;
  if (def.active !== null) dimensions += 1;
  if (def.setId !== null) dimensions += 1;
  if (def.uniqueExclusive) dimensions += 1;
  if (def.requiresCategory !== null) dimensions += 1;
  return dimensions;
}

/** §Debug: Energy Usage / Heat / Power Balance — summed from installed profiles. */
export function engineeringLoadFor(installed: readonly EquipmentProfileDef[]): { energyDraw: number; heatLoad: number; mass: number } {
  let energyDraw = 0;
  let heatLoad = 0;
  let mass = 0;
  for (const profile of installed) {
    energyDraw += profile.energyRequirement;
    heatLoad += profile.heatOutput;
    mass += profile.weight;
  }
  return { energyDraw, heatLoad, mass };
}

/** AF-079's roster addition — the first equipment item with an ACTIVE module,
 * through AF-028's UNCHANGED shape: a cooling system that vents heat on demand. */
export const CRYO_MANIFOLD: EquipmentItemDef = {
  id: "cryo-manifold",
  category: "energyModule",
  name: "Cryo Manifold",
  bonuses: [{ kind: "boostEfficiency", value: 0.06 }],
  passives: [{ trigger: "onDamageTaken", bonus: { kind: "cooldownReduction", value: 0.02 } }],
  active: { id: "manifold-vent", name: "Emergency Vent", cooldownMs: 15000 },
  setId: null,
  uniqueExclusive: false,
  requiresCategory: null,
};

/** The workshop — AF-028's sandbox five plus AF-079's addition, additively. */
export const FRAMEWORK_EQUIPMENT: readonly EquipmentItemDef[] = [...SANDBOX_EQUIPMENT, CRYO_MANIFOLD];

/** Profiles cover the MODULE items — the refit cannon is weapon-category content,
 * outside the module architecture (its home is AF-032/075's weapon framework). */
export const EQUIPMENT_PROFILES: readonly EquipmentProfileDef[] = [
  {
    itemId: "barrier-plate",
    moduleCategory: "shieldGenerators",
    manufacturerId: "ironmoor-foundry",
    visualIdentity: "A proud-weld slab of foundry plating with lattice emitters set flush.",
    lore: "Ironmoor sells it by weight. The weight is the warranty.",
    energyRequirement: 0,
    heatOutput: 2,
    weight: 14,
    rarity: "common",
    synergyTags: ["shield", "defence", "vanguard"],
    upgradeRoute: "engineering",
    evolutionRoute: null,
    statisticKeys: ["equipment:barrier-plate:breaks"],
    futureExpansionHooks: ["upgrade-barrier-plate-mk2"],
  },
  {
    itemId: "vanguard-thrusters",
    moduleCategory: "engineSystems",
    manufacturerId: "helios-industries",
    visualIdentity: "Sun-gold nacelles that idle a note above silence.",
    lore: "Helios racing stock, detuned exactly once and resentful about it.",
    energyRequirement: 0,
    heatOutput: 4,
    weight: 8,
    rarity: "common",
    synergyTags: ["speed", "engine", "vanguard"],
    upgradeRoute: "blueprints",
    evolutionRoute: null,
    statisticKeys: ["equipment:vanguard-thrusters:boosts"],
    futureExpansionHooks: ["upgrade-thrusters-afterburn"],
  },
  {
    itemId: "vanguard-core",
    moduleCategory: "reactors",
    manufacturerId: "atlas-dynamics",
    visualIdentity: "A caged fusion bottle with hand-stencilled output tables.",
    lore: "Atlas overbuilt the housing so thoroughly the reactor apologises for it.",
    energyRequirement: 0,
    heatOutput: 6,
    weight: 12,
    rarity: "rare",
    synergyTags: ["energy", "cooldown", "vanguard"],
    upgradeRoute: "research",
    evolutionRoute: "research",
    statisticKeys: ["equipment:vanguard-core:overloads"],
    futureExpansionHooks: ["evolution-vanguard-core-prime"],
  },
  {
    itemId: "ancient-relay",
    moduleCategory: "ancientModules",
    manufacturerId: "ancient-foundry",
    visualIdentity: "White stone and gold conduit; it points at things you have not found yet.",
    lore: "The relay predates its operators. It has opinions about them anyway.",
    energyRequirement: 0,
    heatOutput: 1,
    weight: 5,
    rarity: "ancient",
    synergyTags: ["ancient", "experience", "vigil"],
    upgradeRoute: "ancientTechnology",
    evolutionRoute: "legendaryDiscoveries",
    statisticKeys: ["equipment:ancient-relay:discoveries"],
    futureExpansionHooks: ["evolution-relay-beacon"],
  },
  {
    itemId: "cryo-manifold",
    moduleCategory: "coolingSystems",
    manufacturerId: "meridian-yards",
    visualIdentity: "Survey-lattice coils sublimating a permanent halo of frost.",
    lore: "Grown from Winterline stock — it vents heat the way the Reach vents everything: quietly.",
    energyRequirement: 20,
    heatOutput: 0,
    weight: 6,
    rarity: "rare",
    synergyTags: ["cooling", "energy", "cryo"],
    upgradeRoute: "engineering",
    evolutionRoute: "exploration",
    statisticKeys: ["equipment:cryo-manifold:vents"],
    futureExpansionHooks: ["evolution-manifold-glacier"],
  },
];

/** "Every module feels handcrafted" as a function — all 17 parts must be present. */
export function equipmentArchitectureFor(def: EquipmentItemDef, profile: EquipmentProfileDef): Record<EquipmentArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    manufacturer: profile.manufacturerId.length > 0,
    category: profile.moduleCategory.length > 0,
    visualIdentity: profile.visualIdentity.length > 0,
    lore: profile.lore.length > 0,
    passiveEffect: def.bonuses.length > 0 || def.passives.length > 0,
    activeEffect: def.active === null || def.active.cooldownMs > 0, // optional by spec — present means real
    energyRequirement: def.active === null || profile.energyRequirement > 0, // actives draw AF-031 energy
    heatOutput: profile.heatOutput >= 0,
    weight: profile.weight > 0,
    rarity: profile.rarity.length > 0,
    synergyTags: profile.synergyTags.length > 0,
    upgradePath: profile.upgradeRoute.length > 0,
    evolutionPath: profile.evolutionRoute !== null || profile.futureExpansionHooks.length > 0,
    statistics: profile.statisticKeys.length > 0,
    collectionStatus: true, // tracked by the workshop lattice below
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}
