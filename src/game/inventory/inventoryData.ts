/**
 * Inventory data (AF-027). Inventory items ARE AF-023 items plus instance
 * metadata; stackable categories merge, equipment-like categories stay
 * unique instances. Limits are configurable data.
 */
import type { LootCategory } from "../loot/lootTuning";

export const STORAGE_LOCATIONS = [
  "player",
  "galaxyStorage",
  "archive", // AF-013 §5 never-delete for items
  "craftingQueue",
] as const;

export type StorageLocation = (typeof STORAGE_LOCATIONS)[number];

/** Categories that auto-stack (AF-027 stacking law). */
export const STACKABLE_CATEGORIES: readonly LootCategory[] = [
  "resource",
  "craftingMaterial",
  "blueprint",
  "currency",
  "researchSample",
];

export const SORT_KEYS = [
  "rarity",
  "power",
  "itemLevel",
  "newest",
  "oldest",
  "name",
  "category",
  "affixCount",
  "craftingValue",
  "favourite",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export interface InventoryFilter {
  category?: LootCategory;
  rarity?: string;
  affixId?: string;
  favouritesOnly?: boolean;
  minItemLevel?: number;
}

export interface InventoryTuning {
  /** Max stack size per stackable entry. */
  stackLimit: number;
  /** Per-location capacity in entries; null = unlimited. */
  storageLimits: Readonly<Record<StorageLocation, number | null>>;
  /** How many loadout slots the player may save. */
  maxLoadouts: number;
}

export const DEFAULT_INVENTORY_TUNING: InventoryTuning = {
  stackLimit: 999,
  storageLimits: {
    player: 300,
    galaxyStorage: null,
    archive: null,
    craftingQueue: 50,
  },
  maxLoadouts: 12,
};
