/**
 * Endgame data shapes (AF-069). Like AF-068, the endgame is a ledger over
 * engines the game already owns, gated on the campaign's completion: the
 * milestone/counter pattern is AF-026/035/037's; mastery names AF-026's
 * mastery-track engine; legacy writes ride AF-026's statistics and the
 * Codex; world events are a seeded weighted pick (AF-036's event-pool
 * discipline). Two spec rules are made STRUCTURAL here rather than
 * promised: (1) "Not inflated health. Not inflated damage." — an
 * AscensionModifierDef carries an axis and a description and has NO
 * numeric stat field at all, so a health/damage multiplier is
 * unrepresentable; (2) "Resets expedition progression. Retains permanent
 * progression." — the runtime keeps those in two separate maps and
 * ascension clears exactly one of them.
 */

/** The endgame flow (AF-069 §Endgame Structure) — ten phases registered; continually expands. */
export const ENDGAME_PHASES = [
  "campaignComplete",
  "galaxyRestoration",
  "ascension",
  "legendaryExpeditions",
  "infiniteResearch",
  "worldEvents",
  "seasonalDiscoveries",
  "mythicChallenges",
  "communityEvents", // registered future — online is an optional later layer (Constitution)
  "infiniteExploration",
] as const;
export type EndgamePhase = (typeof ENDGAME_PHASES)[number];

/** Legendary expedition kinds (AF-069 §Legendary Expeditions) — eight registered; the primary endgame activity. */
export const LEGENDARY_EXPEDITION_KINDS = [
  "ancientVaultChains",
  "galaxyEmergencies",
  "prototypeRecoveries",
  "infiniteBossHunts",
  "factionWars",
  "voidIncursions",
  "planetaryRestoration",
  "quantumExpeditions",
] as const;
export type LegendaryExpeditionKind = (typeof LEGENDARY_EXPEDITION_KINDS)[number];

/** World evolution kinds (AF-069 §World Evolution) — six registered; nothing remains static. */
export const WORLD_EVOLUTION_KINDS = [
  "newColonies",
  "newTechnologies",
  "newThreats",
  "newDiscoveries",
  "newFactions",
  "newSectors",
] as const;
export type WorldEvolutionKind = (typeof WORLD_EVOLUTION_KINDS)[number];

/** The ONLY levers endgame difficulty may pull (AF-069 §Endgame Difficulty).
 * Health and damage inflation are deliberately not on this shelf — and the
 * modifier shape has no numeric field to smuggle them through. */
export const ENDGAME_DIFFICULTY_AXES = [
  "enemyIntelligence",
  "encounterComposition",
  "environmentalComplexity",
  "missionModifiers",
  "bossMechanics",
] as const;
export type EndgameDifficultyAxis = (typeof ENDGAME_DIFFICULTY_AXES)[number];

/** Infinite research branches (AF-069 §Infinite Research) — six registered; every node remains meaningful. */
export const INFINITE_RESEARCH_BRANCHES = [
  "efficiency",
  "exploration",
  "technology",
  "experimentalSystems",
  "prototypeEngineering",
  "civilianDevelopment",
] as const;
export type InfiniteResearchBranch = (typeof INFINITE_RESEARCH_BRANCHES)[number];

/** Legendary reward kinds (AF-069 §Legendary Rewards) — eight registered; prestige cosmetic where appropriate. */
export const LEGENDARY_REWARD_KINDS = [
  "mythicRelics",
  "legendaryShips",
  "ancientWeapons",
  "commanderSkins",
  "animatedCosmetics",
  "titles",
  "galaxyStatues",
  "historicalRecords",
] as const;
export type LegendaryRewardKind = (typeof LEGENDARY_REWARD_KINDS)[number];

/** Endgame world events (AF-069 §World Events) — eight registered, weighted for the seeded pick. */
export const ENDGAME_WORLD_EVENTS: readonly { kind: string; weight: number }[] = [
  { kind: "galaxyCrises", weight: 3 },
  { kind: "voidExpansion", weight: 3 },
  { kind: "factionCampaigns", weight: 3 },
  { kind: "ancientReactivations", weight: 2 },
  { kind: "scientificDiscoveries", weight: 2 },
  { kind: "civilianEmergencies", weight: 2 },
  { kind: "legendaryBosses", weight: 1 },
  { kind: "seasonalEvents", weight: 1 },
];

/** Mastery tracks (AF-069 §Mastery) — eight registered; these are AF-026 mastery-track IDs,
 * not a new engine: `meta.addMasteryXp("endgame:ships", …)` etc. There is always another goal. */
export const ENDGAME_MASTERY_TRACKS = [
  "endgame:ships",
  "endgame:weapons",
  "endgame:commanders",
  "endgame:biomes",
  "endgame:bosses",
  "endgame:research",
  "endgame:exploration",
  "endgame:collections",
] as const;
export type EndgameMasteryTrack = (typeof ENDGAME_MASTERY_TRACKS)[number];

/** Galaxy legacy record kinds (AF-069 §Galaxy Legacy) — six registered; the journey becomes part of the universe. */
export const LEGACY_RECORD_KINDS = [
  "galaxyHistory",
  "codex",
  "statistics",
  "memorials",
  "historicalRecords",
  "namedDiscoveries",
] as const;
export type LegacyRecordKind = (typeof LEGACY_RECORD_KINDS)[number];

/** A difficulty change with NO numeric stat field — health/damage inflation is unrepresentable. */
export interface AscensionModifierDef {
  axis: EndgameDifficultyAxis;
  description: string;
}

export interface AscensionRewardDef {
  kind: LegendaryRewardKind;
  id: string;
}

export interface AscensionLevelDef {
  level: number;
  name: string;
  modifiers: readonly AscensionModifierDef[];
  rewards: readonly AscensionRewardDef[];
  unlockedMechanic: string;
}

export const ENDGAME_TUNING = {
  /** Milestones required per ascension scale with the next level — each climb is longer. */
  milestonesPerAscension: 5,
  /** Infinite research: node cost grows geometrically — no cap, no wall, just commitment. */
  researchBaseCost: 10,
  researchCostGrowth: 1.15,
} as const;

/** Authored Ascension levels I–III; levels beyond extend the same shape
 * automatically (§Ascension Levels: "Unlimited future expansion"). */
export const SANDBOX_ASCENSIONS: readonly AscensionLevelDef[] = [
  {
    level: 1,
    name: "Ascension I — The Second Dawn",
    modifiers: [
      { axis: "enemyIntelligence", description: "Faction leaders open recovery windows less often." },
      { axis: "encounterComposition", description: "Mixed-faction encounters become the norm, not the event." },
    ],
    rewards: [
      { kind: "titles", id: "title-restorer" },
      { kind: "commanderSkins", id: "skin-longlight-dawn" },
    ],
    unlockedMechanic: "Legendary expedition chains",
  },
  {
    level: 2,
    name: "Ascension II — The Long Watch",
    modifiers: [
      { axis: "environmentalComplexity", description: "Biome hazards overlap — the Forge's grid inside the Void's tears." },
      { axis: "missionModifiers", description: "Two mission modifiers roll on every expedition." },
    ],
    rewards: [
      { kind: "mythicRelics", id: "relic-first-light-shard" },
      { kind: "galaxyStatues", id: "statue-meridian-vigil" },
    ],
    unlockedMechanic: "Void incursion expeditions",
  },
  {
    level: 3,
    name: "Ascension III — Past the Horizon",
    modifiers: [
      { axis: "bossMechanics", description: "Guardians remember: boss phase patterns adapt to your recorded victories." },
      { axis: "enemyIntelligence", description: "Directors escalate through struggle score faster." },
    ],
    rewards: [
      { kind: "legendaryShips", id: "ship-axiom-runner" },
      { kind: "historicalRecords", id: "record-third-ascension" },
    ],
    unlockedMechanic: "Quantum expeditions",
  },
];

/** Levels beyond the authored defs — the same shape, generated, forever. */
export function ascensionLevelFor(level: number, authored: readonly AscensionLevelDef[] = SANDBOX_ASCENSIONS): AscensionLevelDef {
  const def = authored.find((a) => a.level === level);
  if (def) return def;
  const axis = ENDGAME_DIFFICULTY_AXES[(level - 1) % ENDGAME_DIFFICULTY_AXES.length]!;
  return {
    level,
    name: `Ascension ${level}`,
    modifiers: [{ axis, description: `Escalation along ${axis} — never inflated health, never inflated damage.` }],
    rewards: [{ kind: "titles", id: `title-ascension-${level}` }],
    unlockedMechanic: `Ascension ${level} expedition mutations`,
  };
}

/** Escalating requirement — each climb is longer than the last, without walls. */
export function milestonesRequiredFor(nextLevel: number): number {
  return ENDGAME_TUNING.milestonesPerAscension * nextLevel;
}

/** Geometric node cost — infinite research has no cap and no cliff. */
export function researchNodeCostFor(nodesOwned: number): number {
  return Math.ceil(ENDGAME_TUNING.researchBaseCost * ENDGAME_TUNING.researchCostGrowth ** nodesOwned);
}
