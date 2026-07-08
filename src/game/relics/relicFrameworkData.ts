/**
 * Relic Framework data shapes (AF-077). EXTENDS AF-029's locked relic
 * system — `RelicDef`, the rarity and category shelves, the stacking
 * rules, the exclusion/synergy/evolution model, and `validateRelicDef`'s
 * no-flat-bonus law are untouched. AF-077 wraps each relic in a PROFILE
 * (the AF-071/073/075 pattern): the eight spec tiers and sixteen spec
 * categories are naming layers mapped TOTALLY onto AF-029's locked
 * shelves; the six spec stacking rules map onto AF-029's four rules plus
 * its maxStacks semantics (fusion combinations bind to the existing
 * evolutionRequires field — registered future, no second fusion engine);
 * "relics should rarely provide only flat bonuses" was ALREADY a law —
 * AF-029's validator rejects any relic without a behaviour clause, and
 * the tests re-assert it across the extended roster.
 * `relicArchitectureFor` proves all 15 architecture parts per relic.
 */
import {
  SANDBOX_RELICS,
  type RelicCategory,
  type RelicDef,
  type StackingRule,
} from "./relicData";
import type { Rarity } from "../loot/lootTuning";

/** The eight spec tiers (AF-077 §Relic Tiers) — mapped totally onto AF-029's locked rarity shelf. */
export const RELIC_FRAMEWORK_TIERS = ["common", "uncommon", "rare", "epic", "legendary", "ancient", "prototype", "mythic"] as const;
export type RelicFrameworkTier = (typeof RELIC_FRAMEWORK_TIERS)[number];

export const FRAMEWORK_TIER_TO_RARITY: Readonly<Record<RelicFrameworkTier, Rarity>> = {
  common: "common",
  uncommon: "common",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
  ancient: "ancient",
  prototype: "singularity",
  mythic: "mythic",
};

/** The sixteen spec categories (AF-077 §Relic Categories) — mapped totally onto AF-029's locked shelf. */
export const RELIC_FRAMEWORK_CATEGORIES = [
  "combat",
  "mobility",
  "defence",
  "economy",
  "critical",
  "status",
  "summoning",
  "drone",
  "exploration",
  "research",
  "boss",
  "void",
  "crystal",
  "machine",
  "quantum",
  "experimental",
] as const;
export type RelicFrameworkCategory = (typeof RELIC_FRAMEWORK_CATEGORIES)[number];

export const FRAMEWORK_CATEGORY_TO_RELIC_CATEGORY: Readonly<Record<RelicFrameworkCategory, RelicCategory>> = {
  combat: "offensive",
  mobility: "movement",
  defence: "defensive",
  economy: "utility",
  critical: "offensive",
  status: "elemental",
  summoning: "drone",
  drone: "drone",
  exploration: "utility",
  research: "utility",
  boss: "ancient",
  void: "void",
  crystal: "crystal",
  machine: "prototype",
  quantum: "singularity",
  experimental: "prototype",
};

/** The 15-part relic architecture (AF-077 §Relic Architecture) — every relic feels handcrafted. */
export const RELIC_ARCHITECTURE_PARTS = [
  "uniqueId",
  "name",
  "visualIdentity",
  "rarity",
  "origin",
  "lore",
  "passiveEffect",
  "conditionalEffect",
  "synergyTags",
  "stackingRules",
  "evolutionRules",
  "statistics",
  "collectionStatus",
  "codexEntry",
  "futureExpansionHooks",
] as const;
export type RelicArchitecturePart = (typeof RELIC_ARCHITECTURE_PARTS)[number];

/** The six spec stacking rules (AF-077 §Stacking Rules) — mapped onto AF-029's four rules
 * plus its maxStacks semantics; fusion binds to the existing evolutionRequires field. */
export const SPEC_STACKING_RULES = ["uniqueRelics", "limitedStack", "unlimitedStack", "mutuallyExclusive", "evolutionChains", "fusionCombinations"] as const;
export type SpecStackingRule = (typeof SPEC_STACKING_RULES)[number];

export const SPEC_STACKING_TO_ENGINE: Readonly<Record<SpecStackingRule, StackingRule>> = {
  uniqueRelics: "unique",
  limitedStack: "stackable", // with maxStacks set
  unlimitedStack: "stackable", // with maxStacks null
  mutuallyExclusive: "mutuallyExclusive",
  evolutionChains: "evolving",
  fusionCombinations: "evolving", // evolutionRequires carries the fusion partner — registered future
};

/** Evolution triggers (AF-077 §Relic Evolution) — six registered; mechanics, not only numbers. */
export const RELIC_EVOLUTION_TRIGGERS = ["kills", "bosses", "exploration", "research", "ascension", "legendaryDiscoveries"] as const;
export type RelicEvolutionTrigger = (typeof RELIC_EVOLUTION_TRIGGERS)[number];

/** Discovery sources (AF-077 §Discovery) — seven registered; always rewarding. */
export const RELIC_DISCOVERY_SOURCES = ["exploration", "bosses", "ancientVaults", "legendaryMissions", "research", "worldEvents", "galaxyRestoration"] as const;
export type RelicDiscoverySource = (typeof RELIC_DISCOVERY_SOURCES)[number];

/** Collection states (AF-077 §Collection) — a monotone lattice; states only advance. */
export const RELIC_COLLECTION_STATES = ["owned", "discovered", "mastered", "evolved", "hiddenVariants", "statistics", "lore"] as const;

/** Build-defining kinds (AF-077 §Build Defining Design) — six registered. */
export const BUILD_DEFINING_KINDS = ["newPlaystyles", "unexpectedSynergies", "alternativeScaling", "riskVsReward", "comboInteractions", "mechanicalExperimentation"] as const;
export type BuildDefiningKind = (typeof BUILD_DEFINING_KINDS)[number];

/** Synergy surfaces (AF-077 §Synergy System) — eight registered; builds become ecosystems. */
export const RELIC_SYNERGY_SURFACES = ["weapons", "ships", "commanders", "equipment", "research", "ascension", "biomeEffects", "missionModifiers"] as const;

/** Customisation kinds (AF-077 §Customisation) — six registered; visuals reinforce rarity, never gameplay. */
export const RELIC_CUSTOMISATION_KINDS = ["relicFrames", "animatedIcons", "discoveryAnimations", "loreThemes", "collectionDisplays", "museumPresentation"] as const;

/** The AF-077 profile — wraps an AF-029 RelicDef by id; the def itself is never modified. */
export interface RelicProfileDef {
  relicId: string;
  frameworkCategory: RelicFrameworkCategory;
  frameworkTier: RelicFrameworkTier;
  visualIdentity: string;
  origin: string;
  discoverySource: RelicDiscoverySource;
  buildDefiningKind: BuildDefiningKind;
  synergyTags: readonly string[];
  /** Required when the def evolves; null otherwise. */
  evolutionTrigger: RelicEvolutionTrigger | null;
  codexNote: string;
  statisticKeys: readonly string[];
  futureExpansionHooks: readonly string[];
}

/** AF-077's roster addition — a quantum relic through AF-029's UNCHANGED RelicDef shape,
 * with a real trade-off (§Build Defining Design: risk vs reward, never only flat bonuses). */
export const SINGULARITY_KEEPSAKE: RelicDef = {
  id: "singularity-keepsake",
  name: "Singularity Keepsake",
  category: "singularity",
  rarity: "singularity",
  tier: 4,
  effects: [
    { kind: "damage", value: 0.06 },
    { kind: "movementSpeed", value: -0.04 }, // the Zone charges rent
  ],
  behaviours: [
    { trigger: "onKill", description: "Kills briefly fold nearby loot toward you — the Keepsake insists on tidiness." },
  ],
  stacking: "unique",
  maxStacks: 1, // AF-029 expresses uniqueness through the stack cap
  exclusionGroup: null,
  synergyWith: ["warden-token"], // sorts after the Keepsake — AF-029 consults the earlier id's declaration
  evolvesInto: null,
  evolutionRequires: [],
  lore: "A paperweight from Axiom. It weighs exactly as much as it decides to.",
};

/** The extended reliquary — AF-029's sandbox seven plus AF-077's addition, additively. */
export const FRAMEWORK_RELICS: readonly RelicDef[] = [...SANDBOX_RELICS, SINGULARITY_KEEPSAKE];

export const RELIC_PROFILES: readonly RelicProfileDef[] = [
  {
    relicId: "ember-core",
    frameworkCategory: "status",
    frameworkTier: "common",
    visualIdentity: "A coal that never finishes burning, set in expedition brass.",
    origin: "Pulled from Cinderfall's plasma channels.",
    discoverySource: "exploration",
    buildDefiningKind: "alternativeScaling",
    synergyTags: ["burn", "status", "thermal"],
    evolutionTrigger: "kills",
    codexNote: "The first relic most survey crews ever log — and the last one they trade away.",
    statisticKeys: ["relic:ember-core:burns"],
    futureExpansionHooks: ["hidden-variant-ember-core-blue"],
  },
  {
    relicId: "frost-shard",
    frameworkCategory: "status",
    frameworkTier: "rare",
    visualIdentity: "Winterline lattice, still sublimating, mounted point-down.",
    origin: "Chipped from the Frozen Reach's preservation fields.",
    discoverySource: "exploration",
    buildDefiningKind: "comboInteractions",
    synergyTags: ["freeze", "status", "cryo"],
    evolutionTrigger: null,
    codexNote: "Pairs with anything that appreciates a stationary target.",
    statisticKeys: ["relic:frost-shard:freezes"],
    futureExpansionHooks: ["hidden-variant-frost-shard-deep"],
  },
  {
    relicId: "cinder-heart",
    frameworkCategory: "status",
    frameworkTier: "epic",
    visualIdentity: "The Ember Core, grown up — a furnace with a pulse.",
    origin: "What an Ember Core becomes when it is fed properly.",
    discoverySource: "bosses",
    buildDefiningKind: "alternativeScaling",
    synergyTags: ["burn", "status", "thermal", "evolved"],
    evolutionTrigger: null,
    codexNote: "Evolution changed the mechanics, not just the numbers — the burn spreads now.",
    statisticKeys: ["relic:cinder-heart:spreads"],
    futureExpansionHooks: ["fusion-cinder-frost"],
  },
  {
    relicId: "gambler-die",
    frameworkCategory: "critical",
    frameworkTier: "legendary",
    visualIdentity: "A die with the wrong number of faces, all of them sixes eventually.",
    origin: "Won from a Nomad junker who insists it was a fair game.",
    discoverySource: "worldEvents",
    buildDefiningKind: "riskVsReward",
    synergyTags: ["critical", "luck", "tradeoff"],
    evolutionTrigger: null,
    codexNote: "The trade-off is the point — the die always charges a stake.",
    statisticKeys: ["relic:gambler-die:jackpots"],
    futureExpansionHooks: ["hidden-variant-loaded-die"],
  },
  {
    relicId: "static-node",
    frameworkCategory: "status",
    frameworkTier: "uncommon",
    visualIdentity: "A Collective relay node, still politely requesting network access.",
    origin: "Salvaged from Forge Primus's security lattice.",
    discoverySource: "exploration",
    buildDefiningKind: "comboInteractions",
    synergyTags: ["shock", "status", "chain"],
    evolutionTrigger: null,
    codexNote: "It wants to complete a circuit. Any circuit.",
    statisticKeys: ["relic:static-node:shocks"],
    futureExpansionHooks: ["hidden-variant-storm-node"],
  },
  {
    relicId: "conduit-loop",
    frameworkCategory: "economy",
    frameworkTier: "rare",
    visualIdentity: "A closed loop of Halcyon drive-conduit that hums when loot is near.",
    origin: "A drive-yard apprentice's graduation piece.",
    discoverySource: "research",
    buildDefiningKind: "unexpectedSynergies",
    synergyTags: ["economy", "pickup", "loop"],
    evolutionTrigger: null,
    codexNote: "Economy relics change routes, not damage numbers.",
    statisticKeys: ["relic:conduit-loop:pickups"],
    futureExpansionHooks: ["hidden-variant-double-loop"],
  },
  {
    relicId: "warden-token",
    frameworkCategory: "defence",
    frameworkTier: "ancient",
    visualIdentity: "A Custodian sentry's identification chit, white stone and gold.",
    origin: "Granted — not looted — at a Custodian site that chose to stand down.",
    discoverySource: "ancientVaults",
    buildDefiningKind: "newPlaystyles",
    synergyTags: ["defence", "ancient", "vigil"],
    evolutionTrigger: null,
    codexNote: "The security recognises its keepers; the token is how it says so.",
    statisticKeys: ["relic:warden-token:saves"],
    futureExpansionHooks: ["hidden-variant-vigil-seal"],
  },
  {
    relicId: "singularity-keepsake",
    frameworkCategory: "quantum",
    frameworkTier: "prototype",
    visualIdentity: "A paperweight-sized fold in space, mounted on a plinth that disagrees.",
    origin: "Brought back from Axiom by someone who will not say how.",
    discoverySource: "legendaryMissions",
    buildDefiningKind: "riskVsReward",
    synergyTags: ["quantum", "loot", "tradeoff", "vigil"],
    evolutionTrigger: null,
    codexNote: "It weighs exactly as much as it decides to — the speed penalty is not metaphorical.",
    statisticKeys: ["relic:singularity-keepsake:folds"],
    futureExpansionHooks: ["fusion-keepsake-token"],
  },
];

/** "Every Relic feels handcrafted" as a function — all 15 parts must be present. */
export function relicArchitectureFor(def: RelicDef, profile: RelicProfileDef): Record<RelicArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    name: def.name.length > 0,
    visualIdentity: profile.visualIdentity.length > 0,
    rarity: def.rarity.length > 0,
    origin: profile.origin.length > 0,
    lore: def.lore.length > 0,
    passiveEffect: def.effects.length > 0,
    conditionalEffect: def.behaviours.length > 0, // AF-029's no-flat-bonus law IS the conditional effect
    synergyTags: profile.synergyTags.length > 0,
    stackingRules: def.stacking.length > 0,
    evolutionRules: def.evolvesInto === null || profile.evolutionTrigger !== null,
    statistics: profile.statisticKeys.length > 0,
    collectionStatus: profile.discoverySource.length > 0,
    codexEntry: profile.codexNote.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}
