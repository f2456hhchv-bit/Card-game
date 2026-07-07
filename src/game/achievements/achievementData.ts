/**
 * Achievement and Collection Framework data shapes (AF-042). Prestige
 * Rewards are exactly AF-026's existing nine-value `CosmeticRewardKind` —
 * Titles/Portrait Frames/Ship Paints/Commander Skins/Engine Trails/Banner
 * Elements/Music/Codex Entries/Visual Effects were all already registered,
 * zero new reward kinds. Statistics and Mastery Records are AF-026's
 * `recordStat`/mastery tracks, read (never edited) through its public
 * `stat()`/`snapshot` getters. Ten of the fifteen Collections categories
 * this module names are AF-026's existing `CollectionCategory` values;
 * Resources and Ancient Artefacts are the two genuinely new categories,
 * tracked by this module's own small `CollectionLedger` rather than by
 * editing AF-026's locked category union; Elite Variants/Blueprints/Galaxy
 * Discoveries are documented views over data that already exists elsewhere
 * (see `CollectionLedger`'s and `README.md`'s notes).
 */
import type { CollectionCategory, MasteryReward } from "../meta/metaData";

export const ACHIEVEMENT_CATEGORIES = [
  "story",
  "combat",
  "bosses",
  "weapons",
  "ships",
  "commanders",
  "research",
  "crafting",
  "exploration",
  "collections",
  "galaxyRestoration",
  "factionReputation",
  "challengeModes",
  "hiddenAchievements",
  "developerChallenges",
] as const;
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

export const ACHIEVEMENT_DIFFICULTIES = ["bronze", "silver", "gold", "platinum"] as const;
export type AchievementDifficulty = (typeof ACHIEVEMENT_DIFFICULTIES)[number];

/** Two ways to define Completion Criteria — both read existing, already-public
 * MetaProgression state; neither requires editing the locked class. */
export type AchievementCriteria =
  | { kind: "statThreshold"; counterKey: string; target: number }
  | { kind: "collectionCount"; category: CollectionCategory; target: number };

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  difficulty: AchievementDifficulty;
  criteria: AchievementCriteria;
  /** Reuses AF-026's MasteryReward — a Prestige Reward, cosmetic/knowledge only. */
  reward: MasteryReward;
  lore: string | null;
  /** Visibility — a Hidden Achievement's criteria stay unrevealed until completed. */
  hidden: boolean;
}

/** Challenge System cadence — orthogonal to AF-026's existing ChallengeCategory
 * (what a challenge is about); this is when it resets. Daily/Weekly are
 * registered as the spec's own "(optional)" hedge — no clock-based reset
 * mechanic exists in this offline-first project to safely hook into yet. */
export const CHALLENGE_CADENCE_KINDS = ["permanent", "daily", "weekly", "seasonal"] as const;
export type ChallengeCadenceKind = (typeof CHALLENGE_CADENCE_KINDS)[number];

/** The two Collection categories with no existing AF-026 bucket to reuse. */
export const EXTRA_COLLECTION_CATEGORIES = ["resources", "ancientArtefacts"] as const;
export type ExtraCollectionCategory = (typeof EXTRA_COLLECTION_CATEGORIES)[number];

/** A Discovery Log entry — the context AF-026's plain discover(category, id)
 * never captured. Capped in the ledger (performance: bounded, not a growing database). */
export interface DiscoveryLogEntry {
  id: string;
  category: string;
  atMs: number;
  missionId: string | null;
  biomeId: string | null;
  galaxySectorId: string | null;
  commanderId: string | null;
  shipId: string | null;
}

/** Sandbox achievements — eight entries spanning distinct categories,
 * every criterion reachable through a real, already-wired existing stat. */
export const SANDBOX_ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: "ach-veteran",
    name: "Veteran",
    description: "Destroy 50 enemies.",
    category: "combat",
    difficulty: "bronze",
    criteria: { kind: "statThreshold", counterKey: "enemiesDestroyed", target: 50 },
    reward: { kind: "title", id: "TITLE_VETERAN" },
    lore: null,
    hidden: false,
  },
  {
    id: "ach-boss-hunter",
    name: "Boss Hunter",
    description: "Defeat a Boss.",
    category: "bosses",
    difficulty: "silver",
    criteria: { kind: "statThreshold", counterKey: "bossesDefeated", target: 1 },
    reward: { kind: "portraitFrame", id: "FRAME_BOSS_HUNTER" },
    lore: "The Hollow Sentinel's silence, finally broken.",
    hidden: false,
  },
  {
    id: "ach-curator",
    name: "Curator",
    description: "Discover 2 Lore Entries.",
    category: "collections",
    difficulty: "bronze",
    criteria: { kind: "collectionCount", category: "lore", target: 2 },
    reward: { kind: "codexEntry", id: "CODEX_CURATOR" },
    lore: null,
    hidden: false,
  },
  {
    id: "ach-trusted-ally",
    name: "Trusted Ally",
    description: "Reach 50 Reputation with the Crystal Dominion.",
    category: "factionReputation",
    difficulty: "gold",
    criteria: { kind: "statThreshold", counterKey: "faction:crystalDominion:reputation", target: 50 },
    reward: { kind: "bannerCustomisation", id: "BANNER_TRUSTED_ALLY" },
    lore: null,
    hidden: false,
  },
  {
    id: "ach-researcher",
    name: "Master Researcher",
    description: "Unlock 2 Research Nodes.",
    category: "research",
    difficulty: "silver",
    criteria: { kind: "collectionCount", category: "research", target: 2 },
    reward: { kind: "codexEntry", id: "CODEX_RESEARCHER" },
    lore: null,
    hidden: false,
  },
  {
    id: "ach-restorer",
    name: "Trade Networks Restored",
    description: "Restore Trade Networks to 10.",
    category: "galaxyRestoration",
    difficulty: "gold",
    criteria: { kind: "statThreshold", counterKey: "worldState:tradeNetworks", target: 10 },
    reward: { kind: "engineTrail", id: "TRAIL_RESTORER" },
    lore: null,
    hidden: false,
  },
  {
    id: "ach-ghost-vault",
    name: "Ghost in the Vault",
    description: "???",
    category: "hiddenAchievements",
    difficulty: "silver",
    criteria: { kind: "collectionCount", category: "lore", target: 1 },
    reward: { kind: "visualEffect", id: "FX_GHOST_VAULT" },
    lore: "Something was already inside the Lucent Gate Vault, and it left before you arrived.",
    hidden: true,
  },
  {
    id: "ach-first-contact",
    name: "First Contact",
    description: "???",
    category: "hiddenAchievements",
    difficulty: "platinum",
    criteria: { kind: "statThreshold", counterKey: "worldState:factionActivity", target: 25 },
    reward: { kind: "music", id: "MUSIC_FIRST_CONTACT" },
    lore: "A signal that answers, rather than merely echoes.",
    hidden: true,
  },
];
