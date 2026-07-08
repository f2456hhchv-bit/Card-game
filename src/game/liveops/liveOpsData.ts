/**
 * Live Operations data shapes (AF-070). Live ops is the third ledger module
 * (AF-068 campaign → AF-069 endgame → AF-070 live ops): a validating
 * CONTENT-PACK REGISTRY over the locked game, where the spec's promises are
 * registration-time GATES rather than guidelines:
 * - "Never invalidate previous content / never replace older systems": a
 *   pack whose addition reuses an already-registered content id is a
 *   replacement attempt and is REJECTED. Packs have no removal field —
 *   removal is unrepresentable.
 * - "Never create power creep / gameplay power remains horizontal": a
 *   seasonal reward is a kind from the cosmetic/lore shelf plus an id —
 *   there is no stat field to inflate.
 * - "Regression testing becomes mandatory": a pack missing ANY of the six
 *   QA gates is rejected outright.
 * - "Avoid FOMO-exclusive gameplay / core progression never resets": only
 *   additions of kind `temporaryChallenges` may be marked temporary; a
 *   season's end retires exactly those, and the registry exposes no reset
 *   or removal operation for anything else.
 */

/** The live content structure (AF-070 §Live Content Structure) — ten tiers registered. */
export const LIVE_CONTENT_TIERS = [
  "coreGame",
  "seasonUpdates",
  "galaxyEvents",
  "majorExpansions",
  "newFactions",
  "newCampaigns",
  "newBiomes",
  "legendaryExpeditions",
  "communityFeatures",
  "futureDecadeRoadmap",
] as const;
export type LiveContentTier = (typeof LIVE_CONTENT_TIERS)[number];

/** Seasonal content kinds (AF-070 §Seasonal Model) — eight registered; core progression never resets. */
export const SEASONAL_CONTENT_KINDS = [
  "galaxyEvents",
  "newMissions",
  "newRelics",
  "newCosmetics",
  "newLore",
  "temporaryChallenges",
  "permanentDiscoveries",
  "qualityOfLifeImprovements",
] as const;
export type SeasonalContentKind = (typeof SEASONAL_CONTENT_KINDS)[number];

/** Expansion content kinds (AF-070 §Expansion Model) — eight registered; existing content remains valuable. */
export const EXPANSION_CONTENT_KINDS = [
  "newGalaxyRegions",
  "newBiomes",
  "newFactions",
  "newBosses",
  "newShips",
  "newCommanders",
  "newResearch",
  "newCampaignChapters",
] as const;
export type ExpansionContentKind = (typeof EXPANSION_CONTENT_KINDS)[number];

/** Galaxy evolution sources (AF-070 §Galaxy Evolution) — seven registered; alive across years. */
export const GALAXY_EVOLUTION_SOURCES = [
  "newCivilisations",
  "scientificDiscoveries",
  "ancientRecoveries",
  "exploration",
  "politicalChange",
  "environmentalEvolution",
  "voidActivity",
] as const;
export type GalaxyEvolutionSource = (typeof GALAXY_EVOLUTION_SOURCES)[number];

/** Live event kinds (AF-070 §Live Events) — eight registered; integrate naturally with the world. */
export const LIVE_EVENT_KINDS = [
  "factionWars",
  "galaxyEmergencies",
  "ancientReactivations",
  "scientificExpeditions",
  "communityGoals",
  "legendaryBossHunts",
  "explorationCampaigns",
  "discoveryEvents",
] as const;
export type LiveEventKind = (typeof LIVE_EVENT_KINDS)[number];

/** Community objectives (AF-070 §Community Objectives) — six registered FUTURE
 * (online is an optional later layer per the Constitution); rewards cosmetic or optional. */
export const COMMUNITY_OBJECTIVE_KINDS = [
  "globalRestoration",
  "researchProjects",
  "explorationGoals",
  "factionContributions",
  "galaxyDefence",
  "worldMilestones",
] as const;
export type CommunityObjectiveKind = (typeof COMMUNITY_OBJECTIVE_KINDS)[number];

/** Seasonal reward kinds (AF-070 §Seasonal Rewards) — eight registered, ALL cosmetic or lore.
 * Gameplay power remains horizontal: there is no stat-bearing kind on this shelf. */
export const SEASONAL_REWARD_KINDS = [
  "commanderSkins",
  "shipPaints",
  "portraitFrames",
  "titles",
  "engineTrails",
  "musicPacks",
  "codexEntries",
  "lore",
] as const;
export type SeasonalRewardKind = (typeof SEASONAL_REWARD_KINDS)[number];

/** Practices the framework REJECTS by design (AF-070 §Player Respect) — registered so
 * tests and future tooling can assert against them by name. */
export const FORBIDDEN_LIVE_PRACTICES = [
  "mandatoryDailyLogins",
  "fomoExclusiveGameplay",
  "powerLockedBehindSeasons",
  "artificialTimeGates",
  "exploitativeMonetisation",
] as const;
export type ForbiddenLivePractice = (typeof FORBIDDEN_LIVE_PRACTICES)[number];

/** Monetisation kinds (AF-070 §Monetisation Principles) — five registered; never pay-to-win.
 * Like rewards, an item is a kind plus an id — no gameplay field exists. */
export const MONETISATION_KINDS = [
  "cosmetics",
  "soundtracks",
  "artBooks",
  "expansionPacks",
  "supporterPacks",
] as const;
export type MonetisationKind = (typeof MONETISATION_KINDS)[number];

/** The six mandatory QA gates (AF-070 §Quality Assurance) — a pack failing ANY is rejected. */
export const QA_GATES = [
  "performance",
  "balance",
  "saveCompatibility",
  "accessibility",
  "loreConsistency",
  "existingProgression",
] as const;
export type QaGate = (typeof QA_GATES)[number];

/** One piece of added content — a kind, an id, nothing else. No stat field,
 * no power field, no removal field: horizontal expansion is the only shape. */
export interface ContentAdditionDef {
  kind: SeasonalContentKind | ExpansionContentKind;
  id: string;
  /** Only `temporaryChallenges` additions may set this — validated at registration. */
  temporary?: boolean;
}

export interface ContentPackDef {
  id: string;
  tier: LiveContentTier;
  name: string;
  additions: readonly ContentAdditionDef[];
  /** All six gates must be true — regression testing is mandatory, structurally. */
  qa: Readonly<Record<QaGate, boolean>>;
}

export interface SeasonDef {
  number: number;
  name: string;
  packIds: readonly string[];
}

export type PackRegistrationResult = { ok: true; version: number } | { ok: false; reasons: readonly string[] };

/** The core game as pack zero — REAL shipped content ids, so the registry's
 * no-replacement gate protects the actual game: a future pack reusing any of
 * these ids is rejected. */
export const CORE_GAME_PACK: ContentPackDef = {
  id: "core-afterlight",
  tier: "coreGame",
  name: "Afterlight — Core Game",
  additions: [
    { kind: "newBiomes", id: "meridian-rest-frontier" },
    { kind: "newBiomes", id: "crystal-expanse" },
    { kind: "newBiomes", id: "machine-expanse" },
    { kind: "newBiomes", id: "void-expanse" },
    { kind: "newBiomes", id: "ancient-core" },
    { kind: "newBiomes", id: "solar-wastes" },
    { kind: "newBiomes", id: "frozen-reach" },
    { kind: "newBiomes", id: "derelict-expanse" },
    { kind: "newBiomes", id: "living-ecospheres" },
    { kind: "newBiomes", id: "singularity-zone" },
    { kind: "newBosses", id: "hollow-sentinel" },
    { kind: "newCampaignChapters", id: "ch-prologue" },
    { kind: "newCampaignChapters", id: "ch-post-campaign" },
  ],
  qa: { performance: true, balance: true, saveCompatibility: true, accessibility: true, loreConsistency: true, existingProgression: true },
};

/** A sandbox first season — additive, cosmetic, honest about what's temporary. */
export const SEASON_ONE_PACK: ContentPackDef = {
  id: "season-1-embers",
  tier: "seasonUpdates",
  name: "Season 1 — Embers of the Frontier",
  additions: [
    { kind: "newCosmetics", id: "skin-longlight-ember" },
    { kind: "newCosmetics", id: "trail-cinderfall-wake" },
    { kind: "newLore", id: "lore-season1-frontier-letters" },
    { kind: "temporaryChallenges", id: "challenge-s1-ember-run", temporary: true },
    { kind: "permanentDiscoveries", id: "discovery-s1-ember-cache" },
    { kind: "qualityOfLifeImprovements", id: "qol-loadout-quick-swap" },
  ],
  qa: { performance: true, balance: true, saveCompatibility: true, accessibility: true, loreConsistency: true, existingProgression: true },
};

export const SEASON_ONE: SeasonDef = {
  number: 1,
  name: "Embers of the Frontier",
  packIds: ["season-1-embers"],
};
