/**
 * Relic Roster (AF-078). The AF-076 roster move applied to relics: AF-029's
 * RelicDef and AF-077's RelicProfileDef are UNCHANGED — the roster is data.
 * Fifteen relic families map totally onto AF-077's category shelf; eight
 * discovery origins each carry an authored identity; and the module's new
 * machinery is RELIC SETS, whose bonus shape carries a trigger and a
 * description and NO numeric field — "set bonuses change gameplay, not
 * only statistics" is unrepresentable, the AF-069/070 discipline again.
 * Two laws are authored into the roster: every VOID-family relic must pay
 * for its power with a negative effect clause ("power requires sacrifice",
 * asserted), and every set piece must be a real registered relic.
 */
import type { RelicDef } from "./relicData";
import {
  FRAMEWORK_RELICS,
  RELIC_PROFILES,
  type RelicFrameworkCategory,
  type RelicProfileDef,
} from "./relicFrameworkData";
import type { PassiveTrigger } from "../equipment/equipmentData";

/** The fifteen relic families (AF-078 §Relic Families) — mapped totally onto AF-077's category shelf. */
export const RELIC_FAMILIES = [
  "combatRelics",
  "mobilityRelics",
  "defensiveRelics",
  "droneRelics",
  "economyRelics",
  "researchRelics",
  "explorationRelics",
  "voidRelics",
  "crystalRelics",
  "machineRelics",
  "quantumRelics",
  "ancientRelics",
  "experimentalRelics",
  "factionRelics",
  "ascensionRelics",
] as const;
export type RelicFamily = (typeof RELIC_FAMILIES)[number];

export const FAMILY_TO_FRAMEWORK_CATEGORY: Readonly<Record<RelicFamily, RelicFrameworkCategory>> = {
  combatRelics: "combat",
  mobilityRelics: "mobility",
  defensiveRelics: "defence",
  droneRelics: "drone",
  economyRelics: "economy",
  researchRelics: "research",
  explorationRelics: "exploration",
  voidRelics: "void",
  crystalRelics: "crystal",
  machineRelics: "machine",
  quantumRelics: "quantum",
  ancientRelics: "boss",
  experimentalRelics: "experimental",
  factionRelics: "status",
  ascensionRelics: "summoning",
};

/** Set piece thresholds (AF-078 §Relic Sets) — six registered; the sandbox sets use two and three. */
export const SET_PIECE_COUNTS = ["twoPiece", "threePiece", "fivePiece", "legendarySetCompletion", "ancientSetCompletion", "prototypeCollections"] as const;

/** A set bonus — a trigger and a description, NO numeric field: gameplay, not statistics. */
export interface RelicSetBonusDef {
  piecesRequired: number;
  trigger: PassiveTrigger;
  description: string;
}

export interface RelicSetDef {
  id: string;
  name: string;
  pieceIds: readonly string[];
  bonuses: readonly RelicSetBonusDef[];
}

/** Build network surfaces (AF-078 §Build Networks) — nine registered. */
export const BUILD_NETWORK_SURFACES = ["ships", "commanders", "weapons", "equipment", "research", "talents", "biomeModifiers", "missionModifiers", "worldEvents"] as const;

/** Discovery origins (AF-078 §Discovery Structure) — eight, each with an authored identity. */
export const RELIC_ORIGINS = [
  { id: "bosses", identity: "Guardians yield what they guarded — boss relics carry their doctrine." },
  { id: "ancientVaults", identity: "Vault relics arrive with provenance: the precursors labelled everything." },
  { id: "civilisations", identity: "Living factions trade living relics — doctrine you can hold." },
  { id: "research", identity: "Research relics are built, not found — the receipt is part of the lore." },
  { id: "factionReputation", identity: "Reputation relics are given, never dropped — trust made physical." },
  { id: "legendaryExpeditions", identity: "Expedition relics remember where they were won." },
  { id: "hiddenDiscoveries", identity: "Hidden relics reward the player who checked behind the map." },
  { id: "galaxyRestoration", identity: "Restoration relics exist because the lights came back on." },
] as const;
export type RelicOriginId = (typeof RELIC_ORIGINS)[number]["id"];

/** Ancient relic traits (AF-078 §Ancient Relics) — seven; irreplaceable, not stronger. */
export const ANCIENT_RELIC_TRAITS = ["historicalLore", "uniqueVisuals", "exclusiveMechanics", "evolutionPaths", "codexStories", "discoveryChains", "museumEntries"] as const;

/** Void relic traits (AF-078 §Void Relics) — six; power requires sacrifice, asserted as a law below. */
export const VOID_RELIC_TRAITS = ["corruption", "riskVsReward", "realityManipulation", "gravityEffects", "probabilityChanges", "uniqueBuildPaths"] as const;

/** Prototype relic traits (AF-078 §Prototype Relics) — six; mastery, not power. */
export const PROTOTYPE_RELIC_TRAITS = ["experimentalMechanics", "instability", "conditionalBonuses", "adaptiveBehaviour", "unexpectedInteractions", "highSkillCeiling"] as const;

/** Evolution routes (AF-078 §Relic Evolution) — seven, mapped totally onto AF-077's six triggers. */
export const RELIC_EVOLUTION_ROUTES = ["bossKills", "discovery", "research", "ascension", "legendaryChallenges", "biomeCompletion", "collectionProgress"] as const;
export type RelicEvolutionRoute = (typeof RELIC_EVOLUTION_ROUTES)[number];

export const EVOLUTION_ROUTE_TO_TRIGGER: Readonly<Record<RelicEvolutionRoute, string>> = {
  bossKills: "bosses",
  discovery: "exploration",
  research: "research",
  ascension: "ascension",
  legendaryChallenges: "legendaryDiscoveries",
  biomeCompletion: "exploration",
  collectionProgress: "kills",
};

/** Collection kinds (AF-078 §Collection) — eight registered; completionists supported. */
export const RELIC_ROSTER_COLLECTION_KINDS = ["relics", "setPieces", "ancientVariants", "prototypeVariants", "hiddenRelics", "evolutionStates", "lore", "statistics"] as const;

/** Museum features (AF-078 §Museum) — seven registered; celebrated in the completeness function below. */
export const MUSEUM_FEATURES = ["threeDInspection", "lore", "history", "discoveryTimeline", "civilisationOrigin", "relatedEntries", "statistics"] as const;
export type MuseumFeature = (typeof MUSEUM_FEATURES)[number];

/** Forbidden balance outcomes (AF-078 §Balance Principles) — registered by name, the AF-070 move. */
export const RELIC_FORBIDDEN_OUTCOMES = ["mandatoryCombinations", "singleDominantBuilds", "meaninglessStatInflation"] as const;

/** A roster entry — family, origin, optional set membership. NO stat field. */
export interface RelicRosterEntry {
  relicId: string;
  family: RelicFamily;
  originId: RelicOriginId;
  setId: string | null;
}

/** AF-078's roster addition — a VOID relic through AF-029's UNCHANGED shape,
 * obeying the module's own law: power requires sacrifice (a negative clause). */
export const VEIL_FRAGMENT: RelicDef = {
  id: "veil-fragment",
  name: "Veil Fragment",
  category: "void",
  rarity: "epic",
  tier: 3,
  effects: [
    { kind: "statusChance", value: 0.08 },
    { kind: "shieldCapacity", value: -8 }, // the Veil takes its toll in shield lattice
  ],
  behaviours: [
    { trigger: "onDamageTaken", description: "Taking damage occasionally answers with a pulse of corruption around you." },
  ],
  stacking: "unique",
  maxStacks: 1,
  exclusionGroup: null,
  synergyWith: ["warden-token"],
  evolvesInto: null,
  evolutionRequires: [],
  lore: "A shard of somewhere that stopped being a where. It remembers being larger.",
};

export const VEIL_FRAGMENT_PROFILE: RelicProfileDef = {
  relicId: "veil-fragment",
  frameworkCategory: "void",
  frameworkTier: "epic",
  visualIdentity: "A splinter of not-quite-black in a containment ring that hums off-key.",
  origin: "Cut from a sealed breach at Hollow Crown.",
  discoverySource: "bosses",
  buildDefiningKind: "riskVsReward",
  synergyTags: ["void", "corruption", "tradeoff"],
  evolutionTrigger: null,
  codexNote: "Power requires sacrifice — the shield penalty is the membership fee.",
  statisticKeys: ["relic:veil-fragment:pulses"],
  futureExpansionHooks: ["evolution-veil-whole"],
};

/** The full reliquary — AF-077's eight plus the Veil Fragment, additively. */
export const ROSTER_RELICS: readonly RelicDef[] = [...FRAMEWORK_RELICS, VEIL_FRAGMENT];
export const ROSTER_RELIC_PROFILES: readonly RelicProfileDef[] = [...RELIC_PROFILES, VEIL_FRAGMENT_PROFILE];

/** Two sandbox sets over REAL registered relics — bonuses are behaviours, never numbers. */
export const SANDBOX_RELIC_SETS: readonly RelicSetDef[] = [
  {
    id: "set-thermal-cycle",
    name: "Thermal Cycle",
    // AUTHORING CONVENTION (discovered against AF-029's live engine): fusion
    // INPUTS must never be set pieces — ember+frost are CONSUMED by the
    // Cinder Heart fusion, so the set is built from the product and a
    // fusion-free partner. Evolution then only ever ADVANCES the set.
    pieceIds: ["cinder-heart", "static-node"],
    bonuses: [
      { piecesRequired: 2, trigger: "onCriticalHit", description: "Criticals against statused enemies arc the full cycle: burn, then shock, in sequence." },
    ],
  },
  {
    id: "set-expedition-ledger",
    name: "Expedition Ledger",
    pieceIds: ["conduit-loop", "gambler-die", "singularity-keepsake"],
    bonuses: [
      { piecesRequired: 2, trigger: "onKill", description: "The ledger balances — pickup radius pulses after every fifth kill." },
      { piecesRequired: 3, trigger: "onLowHealth", description: "The ledger pays out — dropping low folds ALL ground loot toward you, once per expedition." },
    ],
  },
];

/** Family and origin assignments for the full reliquary. */
export const RELIC_ROSTER_ENTRIES: readonly RelicRosterEntry[] = [
  { relicId: "ember-core", family: "combatRelics", originId: "civilisations", setId: null },
  { relicId: "frost-shard", family: "combatRelics", originId: "hiddenDiscoveries", setId: null },
  { relicId: "cinder-heart", family: "combatRelics", originId: "bosses", setId: "set-thermal-cycle" },
  { relicId: "gambler-die", family: "experimentalRelics", originId: "factionReputation", setId: "set-expedition-ledger" },
  { relicId: "static-node", family: "machineRelics", originId: "civilisations", setId: "set-thermal-cycle" },
  { relicId: "conduit-loop", family: "economyRelics", originId: "research", setId: "set-expedition-ledger" },
  { relicId: "warden-token", family: "ancientRelics", originId: "ancientVaults", setId: null },
  { relicId: "singularity-keepsake", family: "quantumRelics", originId: "legendaryExpeditions", setId: "set-expedition-ledger" },
  { relicId: "veil-fragment", family: "voidRelics", originId: "bosses", setId: null },
];

/** Which set bonuses are live for a given active-relic loadout — pure and order-independent. */
export function activeSetBonusesFor(activeRelicIds: readonly string[], sets: readonly RelicSetDef[] = SANDBOX_RELIC_SETS): readonly { setId: string; bonus: RelicSetBonusDef }[] {
  const active = new Set(activeRelicIds);
  const result: { setId: string; bonus: RelicSetBonusDef }[] = [];
  for (const set of sets) {
    const owned = set.pieceIds.filter((id) => active.has(id)).length;
    for (const bonus of set.bonuses) {
      if (owned >= bonus.piecesRequired) result.push({ setId: set.id, bonus });
    }
  }
  return result;
}

/** The Museum (AF-078 §Museum) — every roster relic yields an entry with all seven features. */
export function museumEntryFor(def: RelicDef, profile: RelicProfileDef, entry: RelicRosterEntry): Record<MuseumFeature, string> {
  return {
    threeDInspection: profile.visualIdentity,
    lore: def.lore,
    history: profile.origin,
    discoveryTimeline: profile.discoverySource,
    civilisationOrigin: entry.originId,
    relatedEntries: profile.synergyTags.join(", "),
    statistics: profile.statisticKeys.join(", "),
  };
}
