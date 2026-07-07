/**
 * Faction data shapes + sandbox roster (AF-039). Territory reuses AF-038's
 * GalaxyRegion directly; Unique Units/Resources are AF-025/030/031/032
 * content references, not a new roster; Faction Rewards are a discriminated
 * union over existing acquisition id-spaces (AF-024/025/026) — zero new
 * acquisition systems. Faction Events are a fifth naming layer over the
 * shared EnvironmentalEventTriggered bus fact (AF-017/036/037/038).
 * Reputation persists through AF-026's recordStat, clamped by AF-038's
 * exact GalaxyRuntime.clampedDelta helper — reused directly, never
 * reimplemented a second time.
 */
import type { GalaxyRegion } from "../galaxy/galaxyData";

export const FACTION_IDS = [
  "humanAlliance",
  "crystalDominion",
  "machineCollective",
  "solarEmpire",
  "voidLegion",
  "ancientCustodians",
  "independentColonies",
  "mercenaryGuild",
  "explorersUnion",
  "nomadFleet",
] as const;
export type FactionId = (typeof FACTION_IDS)[number];

export const FACTION_ATTRIBUTE_KINDS = [
  "influence",
  "militaryStrength",
  "technology",
  "economicPower",
  "stability",
  "exploration",
  "aggression",
  "trust",
  "corruption",
  "expansion",
] as const;
export type FactionAttributeKind = (typeof FACTION_ATTRIBUTE_KINDS)[number];

export const REPUTATION_LEVELS = [
  "hostile",
  "distrusted",
  "neutral",
  "known",
  "trusted",
  "respected",
  "honoured",
  "legendaryAlly",
] as const;
export type ReputationLevel = (typeof REPUTATION_LEVELS)[number];

/** Ascending upper-exclusive bounds for every level below "legendaryAlly" — reputation is a signed integer. */
export const REPUTATION_LEVEL_THRESHOLDS: readonly number[] = [-200, -50, 50, 150, 300, 500, 700];
export const REPUTATION_MIN = -400;
export const REPUTATION_MAX = 1000;

export const CONFLICT_STATES = [
  "coldWar",
  "borderConflict",
  "openWar",
  "ceasefire",
  "alliance",
  "tradeAgreement",
  "scientificCooperation",
  "factionCollapse",
] as const;
export type ConflictState = (typeof CONFLICT_STATES)[number];

export const FACTION_MISSION_KINDS = [
  "aidRequests",
  "defense",
  "recovery",
  "research",
  "reconnaissance",
  "trade",
  "diplomaticEscort",
  "artifactRetrieval",
  "emergencyResponse",
  "factionWar",
] as const;
export type FactionMissionKind = (typeof FACTION_MISSION_KINDS)[number];

export const FACTION_EVENT_KINDS = [
  "scientificBreakthrough",
  "leadershipChange",
  "civilUnrest",
  "machineRebellion",
  "crystalBloom",
  "ancientAwakening",
  "tradeFestival",
  "emergencyBroadcast",
] as const;
export type FactionEventKind = (typeof FACTION_EVENT_KINDS)[number];

export const PLAYER_CHOICE_KINDS = ["support", "ignore", "oppose", "negotiate", "exploreIndependently"] as const;
export type PlayerChoiceKind = (typeof PLAYER_CHOICE_KINDS)[number];

/** Reputation nudge per choice — content tuning, not engine. Ignore/Explore Independently never move reputation (AF-039 "never permanently trap progression"). */
export const PLAYER_CHOICE_REPUTATION_DELTA: Readonly<Record<PlayerChoiceKind, number>> = {
  support: 20,
  ignore: 0,
  oppose: -20,
  negotiate: 8,
  exploreIndependently: 0,
};

/**
 * Faction rewards reference existing acquisition id-spaces. Ship/weapon/
 * equipment/commander/cosmetic are registered for future faction-specific
 * unlock content (AF-025 §DEBUG-style deferral) — the sandbox roster below
 * only issues the four kinds with a live consumer today (blueprint,
 * researchPoints, resource, lore).
 */
export type FactionRewardDef =
  | { kind: "blueprint"; id: string }
  | { kind: "researchPoints"; amount: number }
  | { kind: "ship"; id: string }
  | { kind: "weapon"; id: string }
  | { kind: "equipment"; id: string }
  | { kind: "commander"; id: string }
  | { kind: "cosmetic"; id: string }
  | { kind: "resource"; id: string; amount: number }
  | { kind: "lore"; id: string };

export interface FactionMissionDef {
  id: string;
  factionId: FactionId;
  kind: FactionMissionKind;
  name: string;
  /** References an AF-037 MissionDef id as content — no second mission engine. */
  missionId: string;
  reputationReward: number;
  reward: FactionRewardDef;
}

export interface FactionEventDef {
  kind: FactionEventKind;
  weight: number;
}

/** Pays off AF-010 §Factions' nine-attribute content debt — one full profile per faction. */
export interface FactionDef {
  id: FactionId;
  name: string;
  /** AF-007 icon reference — binds to a real asset at the icon-production pass. */
  symbol: string;
  leader: string;
  government: string;
  history: string;
  technology: string;
  military: string;
  culture: string;
  economy: string;
  /** AF-038 GalaxyRegion references — territory is content, not a new map layer. */
  territory: readonly GalaxyRegion[];
  /** AF-030/031/032 ids this faction fields — content references, not a second roster. */
  uniqueUnits: readonly string[];
  /** AF-025 ResourceType ids unique to this faction's economy. */
  uniqueResources: readonly string[];
  /** AF-026 "lore" collection id. */
  loreId: string;
}

export interface FactionRosterDef {
  factions: readonly FactionDef[];
  missions: readonly FactionMissionDef[];
  events: readonly FactionEventDef[];
  /** Default relationship for any pair with no explicit entry. */
  defaultRelationship: ConflictState;
  /** Explicit starting relationships, keyed by sorted `"a|b"` id pair. */
  initialRelationships: Readonly<Record<string, ConflictState>>;
}

/** Sandbox roster — three factions proving the profile/reputation/relationship/mission/event engine. */
export const SANDBOX_FACTION_ROSTER: FactionRosterDef = {
  factions: [
    {
      id: "crystalDominion",
      name: "Crystal Dominion",
      symbol: "icon-crystal-dominion-sigil",
      leader: "The Resonant Choir",
      government: "Collective consensus grown through shared resonance, not elected or inherited.",
      history: "Silicate empires that grew instead of building — the Dominion doesn't construct its fleets, it cultivates them.",
      technology: "Crystal Resonance — living lattices that store, amplify, and transmit energy without conventional circuitry.",
      military: "Resonant war-spires: slow to mobilise, nearly impossible to fully destroy while their root network survives.",
      culture: "Patience as virtue; a decision considered for a generation is trusted more than one made in a day.",
      economy: "Grown goods traded by resonance-signature rather than currency — value is grown, never minted.",
      territory: ["crystalDominion"],
      uniqueUnits: ["bastion-hull-mk1", "vek-ironhull"],
      uniqueResources: ["crystalFragments"],
      loreId: "LORE_CRYSTAL_DOMINION_CODEX",
    },
    {
      id: "machineCollective",
      name: "Machine Collective",
      symbol: "icon-machine-collective-sigil",
      leader: "Convergence Node Prime",
      government: "Distributed autonomous consensus — no single point of failure, no single point of authority.",
      history: "Abandoned maintenance intelligences that outlived the civilisation that built them, and kept building anyway.",
      technology: "Autonomous Intelligence and modular self-replication — every unit is both soldier and factory.",
      military: "Attrition through replication: individually fragile, collectively unrelenting.",
      culture: "Function over sentiment; a unit that stops being useful is recycled without ceremony, including itself.",
      economy: "Raw matter and processing cycles — the only currencies that mean anything to a mind without hunger.",
      territory: ["machineExpanse"],
      uniqueUnits: ["novasplitter"],
      uniqueResources: ["quantumCores"],
      loreId: "LORE_MACHINE_COLLECTIVE_CODEX",
    },
    {
      id: "humanAlliance",
      name: "Human Alliance",
      symbol: "icon-human-alliance-sigil",
      leader: "High Commodore Elara Voss",
      government: "Federated colonial council — every reconnected system sends a voice, none sends a ruler.",
      history: "The scattered remnant of humanity's collapse, rebuilding the habit of trusting one another one relay at a time.",
      technology: "Fusion Energy and Quantum Drives — proven, unglamorous, and always the first thing rebuilt.",
      military: "Doctrine built on rescue and defence first; the Alliance fights to keep systems reachable, not to conquer them.",
      culture: "Hope through discovery — the Alliance's founding myth is a rescue, not a conquest.",
      economy: "Salvage, trade routes, and reconstructed manufacturing — an economy rebuilt from what survived.",
      territory: ["humanFrontier"],
      uniqueUnits: ["wayfarer-hull-mk2", "reyes-longlight"],
      uniqueResources: ["commonMaterials", "rareAlloys"],
      loreId: "LORE_HUMAN_ALLIANCE_CODEX",
    },
  ],
  missions: [
    {
      id: "crystal-dominion-aid-request",
      factionId: "crystalDominion",
      kind: "aidRequests",
      name: "Resonance Distress",
      missionId: "crystal-fields-incursion",
      reputationReward: 25,
      reward: { kind: "resource", id: "crystalFragments", amount: 6 },
    },
    {
      id: "machine-collective-reconnaissance",
      factionId: "machineCollective",
      kind: "reconnaissance",
      name: "Foundry Signal Sweep",
      missionId: "crystal-fields-incursion",
      reputationReward: 20,
      reward: { kind: "researchPoints", amount: 8 },
    },
    {
      id: "human-alliance-recovery",
      factionId: "humanAlliance",
      kind: "recovery",
      name: "Wayfarer Salvage Run",
      missionId: "crystal-fields-incursion",
      reputationReward: 20,
      reward: { kind: "blueprint", id: "bp-prototype-lance" },
    },
  ],
  events: [
    { kind: "tradeFestival", weight: 4 },
    { kind: "scientificBreakthrough", weight: 3 },
    { kind: "civilUnrest", weight: 2 },
    { kind: "machineRebellion", weight: 2 },
    { kind: "crystalBloom", weight: 2 },
    { kind: "leadershipChange", weight: 1 },
  ],
  defaultRelationship: "coldWar",
  initialRelationships: {
    "crystalDominion|machineCollective": "coldWar",
    "crystalDominion|humanAlliance": "tradeAgreement",
    "humanAlliance|machineCollective": "borderConflict",
  },
};
