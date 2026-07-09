/**
 * Mission Framework data shapes (AF-083). EXTENDS AF-037's locked mission
 * system — `MissionDef`, the category/objective/modifier/event shelves,
 * `generateMission` (deterministic per seed), and `MissionRuntime`
 * (run-scoped counters, stay-under objectives, optional-never-blocks)
 * are untouched. AF-083 wraps each EXPEDITION in a PROFILE (the
 * AF-071→081 pattern): seventeen spec mission categories map TOTALLY
 * onto AF-037's fifteen; the spec's eight mission events map TOTALLY
 * onto AF-037's ten (which already bind to the REAL environmental-event
 * vocabulary); the nine-phase mission structure names the EXISTING seam
 * that realises each phase — no second state machine; the eight
 * objective kinds are realised by AF-037's TWO engine mechanisms; and
 * "nothing remains undefined" is a fourteen-part completeness function.
 * Two new expeditions extend the template roster additively — the first
 * missions set outside the sandbox biome.
 */
import type { FactionId } from "../factions/factionData";
import {
  SANDBOX_MISSIONS,
  type MissionCategory,
  type MissionDef,
  type MissionEventKind,
} from "./missionData";

/** The 14-part mission architecture (AF-083 §Mission Architecture) —
 * nothing remains undefined. */
export const MISSION_ARCHITECTURE_PARTS = [
  "uniqueId",
  "missionType",
  "biome",
  "difficulty",
  "threatBudget",
  "objectives",
  "subObjectives",
  "factionPresence",
  "environmentalSystems",
  "bossPotential",
  "rewards",
  "narrativeHooks",
  "worldState",
  "futureExpansionHooks",
] as const;
export type MissionArchitecturePart = (typeof MISSION_ARCHITECTURE_PARTS)[number];

/** The spec's seventeen mission categories (AF-083 §Mission Categories) —
 * mapped totally onto AF-037's fifteen. */
export const FRAMEWORK_MISSION_CATEGORIES = [
  "exploration",
  "combat",
  "rescue",
  "escort",
  "defense",
  "sabotage",
  "investigation",
  "research",
  "recovery",
  "assassination",
  "construction",
  "restoration",
  "survey",
  "legendary",
  "ancient",
  "prototype",
  "worldEvent",
] as const;
export type FrameworkMissionCategory = (typeof FRAMEWORK_MISSION_CATEGORIES)[number];

export const FRAMEWORK_CATEGORY_TO_MISSION_CATEGORY: Readonly<Record<FrameworkMissionCategory, MissionCategory>> = {
  exploration: "exploration",
  combat: "survival",
  rescue: "rescue",
  escort: "escort",
  defense: "defense",
  sabotage: "machineAssault", // striking infrastructure is machine-assault work today
  investigation: "investigation",
  research: "research",
  recovery: "recovery",
  assassination: "assassination",
  construction: "galaxyRestoration",
  restoration: "galaxyRestoration",
  survey: "exploration",
  legendary: "storyMission",
  ancient: "ancientVault",
  prototype: "prototypeRetrieval",
  worldEvent: "voidIncursion", // today's world-event expeditions are incursions
};

/** The nine-phase mission structure (AF-083 §Mission Structure) — each phase
 * names the EXISTING seam that realises it; no second state machine. */
export const MISSION_STRUCTURE_PHASES = [
  "preparation",
  "deployment",
  "discovery",
  "primaryObjective",
  "escalation",
  "majorEncounter",
  "bossOrEvent",
  "extraction",
  "debrief",
] as const;
export type MissionStructurePhase = (typeof MISSION_STRUCTURE_PHASES)[number];

export const PHASE_TO_LIVE_SEAM: Readonly<Record<MissionStructurePhase, string>> = {
  preparation: "GalaxyCommand state — loadout, research, market, mission select (AF-016 machine)",
  deployment: "startRun() through the Loading state's async seam (AF-016)",
  discovery: "BiomeRuntime weather/POI/event surface on entry (AF-036)",
  primaryObjective: "MissionRuntime.recordProgress counter engine (AF-037)",
  escalation: "Director threat curve and phase ladder (AF-017)",
  majorEncounter: "Director MiniBoss phase — elite squads (AF-017)",
  bossOrEvent: "Boss spawn on the MiniBoss seam (AF-035) or scheduled mission event (AF-037)",
  extraction: "extractionRemainingMs window after primaries complete (AF-037)",
  debrief: "endRun() summary, rewards, and history recording (AF-016/026)",
};

/** The eight objective kinds (AF-083 §Objective System), realised by AF-037's
 * TWO engine mechanisms — the primary array and the optional array. */
export const OBJECTIVE_SYSTEM_KINDS = ["primary", "optional", "hidden", "faction", "commander", "research", "collection", "legendary"] as const;
export type ObjectiveSystemKind = (typeof OBJECTIVE_SYSTEM_KINDS)[number];

export const OBJECTIVE_KIND_TO_MECHANISM: Readonly<Record<ObjectiveSystemKind, "primaryArray" | "optionalArray">> = {
  primary: "primaryArray",
  optional: "optionalArray",
  hidden: "optionalArray",
  faction: "optionalArray",
  commander: "optionalArray",
  research: "optionalArray",
  collection: "optionalArray",
  legendary: "optionalArray",
};

/** Generation inputs (AF-083 §Procedural Generation) — nine, each naming the
 * LIVE system it reads. Generation always respects lore. */
export interface GenerationInputDef {
  id: string;
  liveBinding: string;
}

export const MISSION_GENERATION_INPUTS: readonly GenerationInputDef[] = [
  { id: "biome", liveBinding: "AF-036 BiomeDef via MissionDef.biomeId" },
  { id: "threatLevel", liveBinding: "AF-017 ThreatInputs.mutatorModifier fed by active modifiers" },
  { id: "campaignProgress", liveBinding: "AF-068 CampaignRuntime chapter state" },
  { id: "factionActivity", liveBinding: "AF-039 faction reputation and queued faction missions" },
  { id: "galaxyState", liveBinding: "AF-038 current system, region, and exploration stats" },
  { id: "research", liveBinding: "AF-024 unlocked nodes (warp charting gates travel)" },
  { id: "difficulty", liveBinding: "MissionDef.difficulty into AF-020 session difficulty" },
  { id: "worldEvents", liveBinding: "AF-059 galaxy events surfacing in-run" },
  { id: "playerHistory", liveBinding: "AF-026 meta statistics (runs, kills, challenges)" },
];

/** The spec's eight mission events (AF-083 §Mission Events) — mapped totally
 * onto AF-037's ten event kinds, which already bind to the REAL
 * environmental-event vocabulary. */
export const FRAMEWORK_MISSION_EVENTS = [
  "distressCalls",
  "unexpectedBosses",
  "ancientDiscoveries",
  "factionBattles",
  "prototypeRecovery",
  "scientificOpportunities",
  "civilianEmergencies",
  "environmentalDisasters",
] as const;
export type FrameworkMissionEvent = (typeof FRAMEWORK_MISSION_EVENTS)[number];

export const FRAMEWORK_EVENT_TO_MISSION_EVENT: Readonly<Record<FrameworkMissionEvent, MissionEventKind>> = {
  distressCalls: "distressCalls",
  unexpectedBosses: "machineAwakening",
  ancientDiscoveries: "ancientSignal",
  factionBattles: "factionAmbush",
  prototypeRecovery: "prototypeDiscovery",
  scientificOpportunities: "lostExplorer",
  civilianEmergencies: "distressCalls",
  environmentalDisasters: "solarStorm",
};

/** Reward kinds (AF-083 §Mission Rewards) — ten registered with an honesty
 * flag; rewards reflect mission difficulty. */
export interface MissionRewardKindDef {
  id: string;
  identity: string;
  live: boolean;
}

export const MISSION_REWARD_KINDS: readonly MissionRewardKindDef[] = [
  { id: "credits", identity: "AF-041 economy — banked on extraction.", live: true },
  { id: "resources", identity: "AF-023 loot ladder — materials and salvage.", live: true },
  { id: "blueprints", identity: "Crafting recipes beyond the starting set.", live: false },
  { id: "research", identity: "AF-024 points banked from research samples.", live: true },
  { id: "commanderXp", identity: "AF-071 talent points per mission victory.", live: true },
  { id: "shipXp", identity: "AF-074 fleet mission records per hull.", live: true },
  { id: "equipment", identity: "AF-028 module drops through the loot engine.", live: true },
  { id: "relics", identity: "AF-029 relic drops from the roster pools.", live: true },
  { id: "ancientTechnology", identity: "Precursor rewards awaiting the ancient economy.", live: false },
  { id: "legendaryDiscoveries", identity: "Singular finds awaiting legendary expeditions.", live: false },
];

/** Variation sources (AF-083 §Mission Variation) — eight, each naming the
 * LIVE system it draws from; no mission relies on randomisation alone. */
export const MISSION_VARIATION_SOURCES: readonly GenerationInputDef[] = [
  { id: "objectives", liveBinding: "AF-037 primary/optional objective arrays per template" },
  { id: "layout", liveBinding: "AF-036 biome obstacle and POI placement" },
  { id: "enemyMix", liveBinding: "AF-017 Director spawn tables + AF-036 biome enemy pools" },
  { id: "weather", liveBinding: "AF-036 weather cycles per biome" },
  { id: "hazards", liveBinding: "AF-036 biome hazard shelves" },
  { id: "narrativeEvents", liveBinding: "AF-037 weighted mission-event pools" },
  { id: "bosses", liveBinding: "AF-035 boss spawn via MissionDef.bossId" },
  { id: "exploration", liveBinding: "AF-036 interactables and secrets per biome" },
];

/** Failure consequences (AF-083 §Mission Failure) — five registered; failure
 * generates stories, never frustration. */
export const MISSION_FAILURE_CONSEQUENCES = ["reducedRewards", "galaxyChanges", "factionReactions", "lostOpportunities", "alternativeMissions"] as const;

/** History fields (AF-083 §Mission History) — nine registered; permanent by
 * the AF-026 pattern. */
export const MISSION_HISTORY_FIELDS = ["completion", "time", "commander", "ship", "weapons", "bosses", "objectives", "rewards", "statistics"] as const;

/** Forbidden outcomes (AF-083) — registered BY NAME. */
export const MISSION_FORBIDDEN_OUTCOMES = ["randomisationAlone", "frustration"] as const;

/** Accessibility surfaces (AF-083 §Accessibility) — eight registered. */
export const MISSION_ACCESSIBILITY_SURFACES = ["missionPreview", "difficultyPreview", "objectiveTracker", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport", "subtitles"] as const;

/** The AF-083 profile — wraps an AF-037 MissionDef by id; the def and the
 * engine are never modified. */
export interface MissionProfileDef {
  missionId: string;
  frameworkCategory: FrameworkMissionCategory;
  /** The expedition's threat allowance — scales with difficulty, never against it. */
  threatBudget: number;
  factionPresence: FactionId | "none";
  environmentalSystems: readonly string[];
  narrativeHooks: readonly string[];
  worldStateKey: string;
  rewardKinds: readonly string[];
  futureExpansionHooks: readonly string[];
}

// ─── The expedition roster — data on AF-037's unchanged shapes ──────────────

/** Winterline Rescue — the first expedition set outside the sandbox biome:
 * a civilian rescue in the Frozen Reach's stillness. */
export const WINTERLINE_RESCUE: MissionDef = {
  id: "winterline-rescue",
  name: "Winterline Rescue",
  category: "rescue",
  briefing: "Three survey crews went dark past the Winterline. The Reach does not kill quickly — there is still time, if you fly now.",
  biomeId: "frozen-reach",
  bossId: null,
  primaryObjectives: [
    { id: "recover-crews", type: "rescue", description: "Recover 3 stranded survey crews", counterKey: "missionCiviliansRescued", target: 3, optional: false, reward: null },
    { id: "clear-approach", type: "destroy", description: "Destroy 10 hostiles harassing the crews", counterKey: "missionKills", target: 10, optional: false, reward: null },
  ],
  optionalObjectives: [
    { id: "cold-hunt", type: "destroy", description: "Destroy 1 Elite in the deep cold", counterKey: "missionElitesKilled", target: 1, optional: true, reward: { kind: "title", id: "TITLE_WINTERLINE_WARDEN" } },
    { id: "untouched-ice", type: "survive", description: "Take no damage in the stillness", counterKey: "missionDamageTaken", target: 0, optional: true, reward: null },
  ],
  modifierPool: [
    { kind: "darkSector", description: "The Winterline runs dark — visibility collapses.", mutatorModifierDelta: 0.1, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.1 },
    { kind: "shieldInstability", description: "Deep cold saps shield lattices.", mutatorModifierDelta: 0.15, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.15 },
    { kind: "doubleRewards", description: "The colonies pay well for their people.", mutatorModifierDelta: 0, lootMutatorBonusDelta: 0.3, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.5 },
  ],
  modifierSlots: 1,
  eventPool: [
    { kind: "distressCalls", weight: 4 },
    { kind: "meteorShower", weight: 2 },
    { kind: "lostExplorer", weight: 2 },
    { kind: "travellingMerchant", weight: 1 },
  ],
  difficulty: 3,
  xpTier: "medium",
};

/** First Light Excavation — an ancient-vault expedition into the Core,
 * with real boss potential on the Sentinel seam. */
export const FIRST_LIGHT_EXCAVATION: MissionDef = {
  id: "first-light-excavation",
  name: "First Light Excavation",
  category: "ancientVault",
  briefing: "The Archive has cleared a dig window at First Light. Scan the vault sites, recover what the precursors left, and do not assume the Core is unguarded.",
  biomeId: "ancient-core",
  bossId: "hollow-sentinel",
  primaryObjectives: [
    { id: "scan-sites", type: "scan", description: "Scan 3 vault sites", counterKey: "missionSitesScanned", target: 3, optional: false, reward: null },
    { id: "recover-artefacts", type: "collect", description: "Recover 2 precursor artefacts", counterKey: "missionArtefactsCollected", target: 2, optional: false, reward: null },
  ],
  optionalObjectives: [
    { id: "light-the-beacon", type: "activate", description: "Activate the ancient beacon", counterKey: "missionBeaconsActivated", target: 1, optional: true, reward: { kind: "portraitFrame", id: "FRAME_FIRST_LIGHT" } },
    { id: "vault-hunt", type: "destroy", description: "Destroy 3 Elites among the ruins", counterKey: "missionElitesKilled", target: 3, optional: true, reward: null },
  ],
  modifierPool: [
    { kind: "experimentalConditions", description: "The vault's systems are still calibrating.", mutatorModifierDelta: 0.2, lootMutatorBonusDelta: 0.1, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.2 },
    { kind: "radiation", description: "Core radiation seeps through the dig window.", mutatorModifierDelta: 0.15, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.1 },
    { kind: "eliteActivity", description: "The custodians patrol in force.", mutatorModifierDelta: 0.15, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 1, rewardMultiplierDelta: 0.15 },
  ],
  modifierSlots: 2,
  eventPool: [
    { kind: "ancientSignal", weight: 4 },
    { kind: "machineAwakening", weight: 2 },
    { kind: "prototypeDiscovery", weight: 2 },
  ],
  difficulty: 6,
  xpTier: "large",
};

/** The expedition roster — AF-037's sandbox template heads the array unchanged. */
export const FRAMEWORK_MISSIONS: readonly MissionDef[] = [...SANDBOX_MISSIONS, WINTERLINE_RESCUE, FIRST_LIGHT_EXCAVATION];

export const MISSION_PROFILES: readonly MissionProfileDef[] = [
  {
    missionId: "crystal-fields-incursion",
    frameworkCategory: "worldEvent",
    threatBudget: 120,
    factionPresence: "crystalDominion",
    environmentalSystems: ["weather:ionClouds", "hazard:crystalBloom", "poi:shard-cluster"],
    narrativeHooks: ["A Void signature where no Void should reach.", "The Dominion is watching how you handle their fields."],
    worldStateKey: "campaign:missionsCompleted",
    rewardKinds: ["credits", "resources", "research", "relics", "equipment"],
    futureExpansionHooks: ["mission-crystal-fields-aftermath"],
  },
  {
    missionId: "winterline-rescue",
    frameworkCategory: "rescue",
    threatBudget: 320,
    factionPresence: "independentColonies",
    environmentalSystems: ["weather:whiteout", "hazard:deepCold", "stillness:slowTicks"],
    narrativeHooks: ["The Reach does not kill quickly.", "Every crew recovered is a colony that remembers."],
    worldStateKey: "campaign:missionsCompleted",
    rewardKinds: ["credits", "resources", "commanderXp", "shipXp"],
    futureExpansionHooks: ["mission-winterline-second-thaw"],
  },
  {
    missionId: "first-light-excavation",
    frameworkCategory: "ancient",
    threatBudget: 600,
    factionPresence: "ancientCustodians",
    environmentalSystems: ["hazard:coreRadiation", "poi:vault-sites", "guardian:sentinel-seam"],
    narrativeHooks: ["The precursors finished this vault. The question is for whom.", "The Archive pays in translation time."],
    worldStateKey: "campaign:bossesDefeated",
    rewardKinds: ["credits", "research", "relics", "equipment"],
    futureExpansionHooks: ["mission-first-light-network-thread"],
  },
];

/** "Nothing remains undefined" as a function — all 14 parts must hold. */
export function missionArchitectureFor(def: MissionDef, profile: MissionProfileDef): Record<MissionArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    missionType: FRAMEWORK_CATEGORY_TO_MISSION_CATEGORY[profile.frameworkCategory] === def.category,
    biome: def.biomeId.length > 0,
    difficulty: def.difficulty > 0,
    threatBudget: profile.threatBudget > 0,
    objectives: def.primaryObjectives.length > 0,
    subObjectives: def.optionalObjectives.length > 0,
    factionPresence: profile.factionPresence.length > 0,
    environmentalSystems: profile.environmentalSystems.length > 0,
    bossPotential: def.bossId === null || def.bossId.length > 0, // declared either way
    rewards: profile.rewardKinds.length > 0 && def.xpTier.length > 0,
    narrativeHooks: def.briefing.length > 0 && profile.narrativeHooks.length > 0,
    worldState: profile.worldStateKey.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}
