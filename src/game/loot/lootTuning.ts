/**
 * Loot tuning surface (AF-023). Rarity rows, category shelves, generation
 * parameters — balance through data, never hardcoded (AF-011 §7).
 * Rarity ladder and colours are AF-007 §4 canon (never change).
 */
export const RARITY_LADDER = [
  "damaged",
  "common",
  "improved",
  "rare",
  "epic",
  "legendary",
  "ancient",
  "mythic",
  "singularity",
] as const;

export type Rarity = (typeof RARITY_LADDER)[number];

export const LOOT_CATEGORIES = [
  "weapon",
  "equipment",
  "relic",
  "resource",
  "blueprint",
  "craftingMaterial",
  "currency",
  "researchSample",
  "ancientArtifact",
  "commanderItem",
  "shipComponent",
  "cosmetic",
  "loreObject",
] as const;

export type LootCategory = (typeof LOOT_CATEGORIES)[number];

export type SpecialDropKind =
  | "setItem"
  | "questItem"
  | "bossExclusive"
  | "ancientTechnology"
  | "prototypeEquipment"
  | "uniqueRelic"
  | "loreArtifact"
  | "seasonalItem";

export interface RarityRow {
  /** Base drop weight — bonuses shift weight up the ladder (§3). */
  weight: number;
  affixCount: number;
  /** Presentation intensity 0–1 (beam/glow scale; Legendary+ enhanced). */
  presentation: number;
  collectionValue: number;
  /** AF-007 §4 canonical token hex (single tone; duotones use the base). */
  colour: string;
}

export const RARITY_TABLE: Readonly<Record<Rarity, RarityRow>> = {
  damaged: { weight: 180, affixCount: 0, presentation: 0.2, collectionValue: 1, colour: "#7a8296" },
  common: { weight: 420, affixCount: 0, presentation: 0.3, collectionValue: 2, colour: "#dce4f2" },
  improved: { weight: 240, affixCount: 1, presentation: 0.4, collectionValue: 5, colour: "#4de868" },
  rare: { weight: 100, affixCount: 2, presentation: 0.55, collectionValue: 12, colour: "#4d7cff" },
  epic: { weight: 40, affixCount: 3, presentation: 0.7, collectionValue: 30, colour: "#9b5cff" },
  legendary: { weight: 12, affixCount: 4, presentation: 0.85, collectionValue: 80, colour: "#ffc652" },
  ancient: { weight: 4, affixCount: 4, presentation: 0.92, collectionValue: 200, colour: "#c8323c" },
  mythic: { weight: 1.2, affixCount: 5, presentation: 0.97, collectionValue: 500, colour: "#fff3d6" },
  singularity: { weight: 0.15, affixCount: 6, presentation: 1, collectionValue: 2000, colour: "#e4d4ff" },
};

/** Placeholder affix pool — real affixes arrive with equipment modules. */
export interface AffixDefinition {
  id: string;
  minValue: number;
  maxValue: number;
}

export const PLACEHOLDER_AFFIXES: readonly AffixDefinition[] = [
  { id: "power", minValue: 2, maxValue: 10 },
  { id: "haste", minValue: 1, maxValue: 8 },
  { id: "ward", minValue: 3, maxValue: 12 },
  { id: "focus", minValue: 1, maxValue: 6 },
  { id: "amplify", minValue: 2, maxValue: 9 },
  { id: "surge", minValue: 1, maxValue: 7 },
];

export interface LootTuning {
  /** Smart-loot multiplier clamp — relevance, never rigging (AF-023 §4). */
  smartLootClamp: { min: number; max: number };
  /** Per-point-of-difficulty ladder-shift factor (applied as factor^(tier/8)). */
  difficultyShiftPerPoint: number;
  ascensionShiftPerLevel: number;
  /** Ground loot live cap; overflow banks lowest-rarity-oldest to Results. */
  maxGroundLoot: number;
  /** Rarities at or above this index never bank — moments stay physical. */
  neverBankAtOrAbove: Rarity;
  /** Affix value scaling per item level. */
  affixLevelScaling: number;
}

export const DEFAULT_LOOT_TUNING: LootTuning = {
  smartLootClamp: { min: 0.5, max: 3 },
  difficultyShiftPerPoint: 1.4,
  ascensionShiftPerLevel: 1.25,
  maxGroundLoot: 40,
  neverBankAtOrAbove: "legendary",
  affixLevelScaling: 0.05,
};

export const PLAYER_DECISIONS = [
  "equip",
  "store",
  "salvage",
  "ignore",
  "compare",
  "favourite",
  "markForCrafting",
] as const;

export type PlayerDecision = (typeof PLAYER_DECISIONS)[number];
