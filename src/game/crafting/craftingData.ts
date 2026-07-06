/**
 * Crafting data shapes + sandbox content (AF-025). Categories, resources,
 * and stations are registered shelves; recipes are data. Real recipe
 * content arrives with equipment modules.
 */
import type { Rarity } from "../loot/lootTuning";

export const CRAFTING_CATEGORIES = [
  "weapons",
  "shipComponents",
  "equipment",
  "relics",
  "droneModules",
  "orbitalModules",
  "consumables", // future
  "commanderModules",
  "researchCatalysts",
  "cosmetics",
  "ancientTechnology",
  "prototypeTechnology",
] as const;

export type CraftingCategory = (typeof CRAFTING_CATEGORIES)[number];

export const RESOURCE_TYPES = [
  "commonMaterials",
  "rareAlloys",
  "crystalFragments",
  "voidEssence",
  "ancientComponents",
  "quantumCores",
  "energyCells",
  "researchSamples",
  "mythicMaterials",
  "singularityMatter",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const CRAFTING_STATIONS = [
  "forge",
  "researchLab",
  "prototypeFacility",
  "salvageBay",
  "blueprintArchive",
  "ancientFabricator",
] as const;

export type CraftingStation = (typeof CRAFTING_STATIONS)[number];

export type MaterialCost = Partial<Record<ResourceType, number>>;

export interface RecipeDef {
  id: string;
  blueprintId: string;
  category: CraftingCategory;
  station: CraftingStation;
  materials: MaterialCost;
  /** Research node required before this recipe is craftable (null = none). */
  researchRequirement: string | null;
  /** Always 0 — instant per DR-005's reasoning; reserved for data stability. */
  craftingTimeMs: number;
  outputBaseItemId: string;
  outputRarity: Rarity;
  /** Craft quality rolls within this range; reforging can improve it. */
  qualityRange: { min: number; max: number };
}

export interface CraftingTuning {
  /** Salvage return fraction of estimated material value, by rarity index. */
  salvageReturnFraction: number;
  /** Per-rarity minimum salvage yield — never punitive (AF-025 §4). */
  salvageFloor: MaterialCost;
  /** Reforge base cost and per-reforge escalation multiplier. */
  reforgeBaseCost: MaterialCost;
  reforgeCostEscalation: number;
  /** Hangar cap for the sandbox demo (real inventory at equipment modules). */
  hangarCap: number;
}

export const DEFAULT_CRAFTING_TUNING: CraftingTuning = {
  salvageReturnFraction: 0.4,
  salvageFloor: { commonMaterials: 1 },
  reforgeBaseCost: { commonMaterials: 4, rareAlloys: 1 },
  reforgeCostEscalation: 1.6,
  hangarCap: 10,
};

/** Sandbox recipes — placeholder content proving the framework. */
export const SANDBOX_RECIPES: readonly RecipeDef[] = [
  {
    id: "refit-cannon",
    blueprintId: "bp-refit-cannon",
    category: "weapons",
    station: "forge",
    materials: { commonMaterials: 5 },
    researchRequirement: null,
    craftingTimeMs: 0,
    outputBaseItemId: "REFIT_CANNON",
    outputRarity: "improved",
    qualityRange: { min: 30, max: 90 },
  },
  {
    id: "prototype-lance",
    blueprintId: "bp-prototype-lance",
    category: "prototypeTechnology",
    station: "prototypeFacility",
    materials: { commonMaterials: 8, rareAlloys: 3 },
    researchRequirement: "harmonic-overload",
    craftingTimeMs: 0,
    outputBaseItemId: "PROTOTYPE_LANCE",
    outputRarity: "epic",
    qualityRange: { min: 40, max: 100 },
  },
];

/** Blueprints known from the start (the rest unlock through play). */
export const STARTING_BLUEPRINTS: readonly string[] = ["bp-refit-cannon"];
