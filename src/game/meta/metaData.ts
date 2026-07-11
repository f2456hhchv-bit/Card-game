/**
 * Meta progression data (AF-026). Reward payloads are cosmetic/knowledge
 * ONLY — there is no stat field, so mastery rewards structurally cannot
 * affect gameplay balance (AF-026 §5).
 */
import type { XpTuning } from "../progression/xpTuning";

export const COLLECTION_CATEGORIES = [
  "weapons",
  "relics",
  "equipment",
  "ships",
  "commanders",
  "biomes",
  "enemies",
  "bosses",
  "research",
  "achievements",
  "lore",
  // GP-003 §Long Term Goals: "Collect Legendary Artifacts" needs a real
  // permanent record — GP-001's BossArtifactRuntime resets every run by
  // design (a per-run choice), so nothing tracked "ever claimed" until now.
  "bossArtifacts",
] as const;

export type CollectionCategory = (typeof COLLECTION_CATEGORIES)[number];

export type CosmeticRewardKind =
  | "commanderSkin"
  | "shipPaint"
  | "portraitFrame"
  | "title"
  | "codexEntry"
  | "music"
  | "engineTrail"
  | "visualEffect"
  | "bannerCustomisation";

export interface MasteryReward {
  kind: CosmeticRewardKind;
  id: string;
}

export const CHALLENGE_CATEGORIES = [
  "general",
  "commander",
  "ship",
  "weapon",
  "boss",
  "biome",
  "galaxy",
  "seasonal", // future — rotates into the permanent pool (AF-013 §7)
] as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export interface ChallengeDef {
  id: string;
  category: ChallengeCategory;
  name: string;
  description: string;
  /** Statistics counter the challenge watches. */
  counterKey: string;
  target: number;
  reward: MasteryReward;
}

/** Account-level curve — reuses the AF-022 engine with meta tuning. */
export const ACCOUNT_XP_TUNING: XpTuning = {
  tierValues: { small: 0, medium: 0, large: 0, elite: 0, boss: 0, ancient: 0, research: 0 },
  curve: { base: 100, linear: 40, soft: 8, knee: 1.5 },
  maxThresholdGrowthRatio: 1.25,
  defaultLevelCap: null, // account level never caps, never resets
  basePickupRadius: 0,
  baseMagnetRadius: 0,
  magnetAccelerationPerSecond: 0,
  magnetMaxSpeed: 0,
  maxLivePickups: 0,
  choicesPerLevel: 0,
};

/** Account XP awards per event (AF-026 §2) — tuning data. */
export const ACCOUNT_XP_AWARDS = {
  missionCompleted: 50,
  missionFailed: 15, // failure still pays — no run is wasted
  bossDefeated: 100,
  eliteDefeated: 5,
  researchUnlocked: 10,
  collectionEntry: 2,
  challengeCompleted: 25,
} as const;

/** Mastery rank thresholds (XP per rank) — data curve, shared by tracks. */
export const MASTERY_RANK_THRESHOLDS: readonly number[] = [
  100, 250, 500, 900, 1500, 2400, 3600, 5200, 7200, 10000,
];

/** Sandbox challenges — placeholder content proving the engine. */
export const SANDBOX_CHALLENGES: readonly ChallengeDef[] = [
  {
    id: "drone-reaper",
    category: "general",
    name: "Drone Reaper",
    description: "Destroy 25 drones",
    counterKey: "enemiesDestroyed",
    target: 25,
    reward: { kind: "title", id: "TITLE_DRONE_REAPER" },
  },
  {
    id: "field-harvester",
    category: "general",
    name: "Field Harvester",
    description: "Collect 5 items",
    counterKey: "itemsCollected",
    target: 5,
    reward: { kind: "portraitFrame", id: "FRAME_HARVESTER" },
  },
  {
    id: "veteran",
    category: "general",
    name: "Veteran",
    description: "Complete 3 expeditions",
    counterKey: "runs",
    target: 3,
    reward: { kind: "bannerCustomisation", id: "BANNER_VETERAN" },
  },
];
