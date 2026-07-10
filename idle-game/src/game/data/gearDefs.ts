/** Equipment: four slots, five rarity tiers, one rolled stat per item. */
export type GearSlot = "weapon" | "armor" | "charm" | "companion";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type GearStat = "atk" | "def" | "hp" | "critChance" | "critMulti" | "goldFind" | "essenceFind";

export const GEAR_SLOTS: GearSlot[] = ["weapon", "armor", "charm", "companion"];
export const RARITIES: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

/** Rim-light / accent colour per rarity, used by both UI chrome and gear icons. */
export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#9fb0a8",
  uncommon: "#63e07a",
  rare: "#4fb2ff",
  epic: "#c26bff",
  legendary: "#ffc93c",
};

export const RARITY_HUE: Record<Rarity, number> = {
  common: 150,
  uncommon: 130,
  rare: 205,
  epic: 280,
  legendary: 42,
};

/** Relative drop weights (higher = more common). */
export const RARITY_WEIGHT: Record<Rarity, number> = {
  common: 100,
  uncommon: 42,
  rare: 14,
  epic: 4,
  legendary: 1,
};

/** Multiplier applied to a stat's rolled value at this rarity. */
export const RARITY_VALUE_MULT: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.35,
  rare: 1.9,
  epic: 2.7,
  legendary: 4,
};

export const SLOT_LABEL: Record<GearSlot, string> = {
  weapon: "Weapon",
  armor: "Armor",
  charm: "Charm",
  companion: "Companion",
};

/** Which stats each slot may roll. */
export const SLOT_STAT_POOL: Record<GearSlot, GearStat[]> = {
  weapon: ["atk"],
  armor: ["def", "hp"],
  charm: ["critChance", "critMulti"],
  companion: ["goldFind", "essenceFind"],
};

export const SLOT_NAME_POOL: Record<GearSlot, string[]> = {
  weapon: ["Lightblade", "Ion Saber", "Fusion Lance", "Photon Edge"],
  armor: ["Aegis Plating", "Void Ward", "Bulwark Coil", "Kinetic Shell"],
  charm: ["Resonance Core", "Sync Module", "Focus Crystal"],
  companion: ["Escort Drone", "Beacon Wisp", "Relay Sprite"],
};

export const STAT_LABEL: Record<GearStat, string> = {
  atk: "Attack",
  def: "Defense",
  hp: "Max HP",
  critChance: "Crit Chance",
  critMulti: "Crit Damage",
  goldFind: "Gold Find",
  essenceFind: "Essence Find",
};

/** Base rolled value at common rarity, stage 1, before the stage-scale factor. */
export const STAT_BASE_VALUE: Record<GearStat, number> = {
  atk: 1.1,
  def: 0.7,
  hp: 5,
  critChance: 0.008,
  critMulti: 0.025,
  goldFind: 0.015,
  essenceFind: 0.015,
};

/** How much stronger a rolled item is per stage it was found at. */
export function gearStageScale(stage: number): number {
  return 1 + Math.max(0, stage - 1) * 0.11;
}

/** Alloy granted for salvaging an item of this rarity. */
export const SALVAGE_ALLOY: Record<Rarity, number> = {
  common: 2,
  uncommon: 5,
  rare: 14,
  epic: 40,
  legendary: 120,
};

/** Alloy cost to enhance an equipped item by one level. */
export function enhanceCost(rarity: Rarity, currentEnhanceLevel: number): number {
  const base = { common: 4, uncommon: 8, rare: 18, epic: 45, legendary: 130 }[rarity];
  return Math.ceil(base * Math.pow(1.22, currentEnhanceLevel));
}

/** +7% value per enhancement level, applied on top of the rolled value. */
export const ENHANCE_VALUE_BONUS_PER_LEVEL = 0.07;

export interface GearItem {
  id: string;
  slot: GearSlot;
  rarity: Rarity;
  stat: GearStat;
  name: string;
  /** Rolled value before enhancement. */
  baseValue: number;
  enhanceLevel: number;
  foundAtStage: number;
}

export function gearEffectiveValue(item: GearItem): number {
  return item.baseValue * (1 + ENHANCE_VALUE_BONUS_PER_LEVEL * item.enhanceLevel);
}
