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
  // GP-003 §Resources: the spec's own exact-named list (Dark Matter/Quantum
  // Crystals/Biomass/Living Metal/Atlas Fragments) — none of the ten
  // existing resources matched verbatim (quantumCores/energyCells are close
  // but distinct), so these five are additive.
  "darkMatter",
  "quantumCrystals",
  "biomass",
  "livingMetal",
  "atlasFragments",
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

/**
 * GP-003 §Blueprints: a real category tag spanning the spec's own named
 * list — Ships/Weapons/Commander Equipment/Drone Types/Modules/Artifacts.
 * "Passives" and "Buildings" are deliberately excluded: passives are chosen
 * mid-run through AF-022 level-ups (never blueprint-crafted), and no
 * building system exists anywhere in this codebase to tag a blueprint
 * against — inventing either would be fabricating a mechanism this
 * module's audit never found dormant, unlike every other real gap here.
 */
export const BLUEPRINT_CATEGORIES = ["ships", "weapons", "commanderEquipment", "droneTypes", "modules", "artifacts"] as const;
export type BlueprintCategory = (typeof BLUEPRINT_CATEGORIES)[number];

export type MaterialCost = Partial<Record<ResourceType, number>>;

export interface RecipeDef {
  id: string;
  blueprintId: string;
  category: CraftingCategory;
  /** GP-003 §Blueprints: which of the spec's named categories this blueprint belongs to. */
  blueprintCategory: BlueprintCategory;
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
    blueprintCategory: "weapons",
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
    blueprintCategory: "weapons",
    station: "prototypeFacility",
    materials: { commonMaterials: 8, rareAlloys: 3 },
    researchRequirement: "harmonic-overload",
    craftingTimeMs: 0,
    outputBaseItemId: "PROTOTYPE_LANCE",
    outputRarity: "epic",
    qualityRange: { min: 40, max: 100 },
  },
  // GP-003 §Resources: real spend sites for three of the five newly-added
  // resources (darkMatter/quantumCrystals/atlasFragments) — "each resource
  // has multiple uses" means grant AND spend, not grant-only.
  {
    id: "ancient-tech-core",
    blueprintId: "bp-ancient-tech-core",
    category: "ancientTechnology",
    blueprintCategory: "artifacts",
    station: "ancientFabricator",
    materials: { darkMatter: 3, quantumCrystals: 2, atlasFragments: 1 },
    researchRequirement: "unified-theory",
    craftingTimeMs: 0,
    outputBaseItemId: "ANCIENT_TECH_CORE",
    outputRarity: "legendary",
    qualityRange: { min: 50, max: 100 },
  },
  // GP-003 §Resources: the remaining two (biomass/livingMetal) get their own real spend site.
  {
    id: "biosynth-plating",
    blueprintId: "bp-biosynth-plating",
    category: "shipComponents",
    blueprintCategory: "ships",
    station: "forge",
    materials: { biomass: 4, livingMetal: 2 },
    researchRequirement: null,
    craftingTimeMs: 0,
    outputBaseItemId: "BIOSYNTH_PLATING",
    outputRarity: "epic",
    qualityRange: { min: 40, max: 95 },
  },
  // GP-003 §Blueprints: real content for the two remaining named categories
  // (Commander Equipment / Drone Types) — every BLUEPRINT_CATEGORIES entry
  // now has at least one real, craftable recipe.
  {
    id: "commander-badge",
    blueprintId: "bp-commander-badge",
    category: "commanderModules",
    blueprintCategory: "commanderEquipment",
    station: "forge",
    materials: { rareAlloys: 3, researchSamples: 2 },
    researchRequirement: null,
    craftingTimeMs: 0,
    outputBaseItemId: "COMMANDER_BADGE",
    outputRarity: "epic",
    qualityRange: { min: 40, max: 95 },
  },
  {
    id: "drone-companion-core",
    blueprintId: "bp-drone-companion-core",
    category: "droneModules",
    blueprintCategory: "droneTypes",
    station: "forge",
    materials: { commonMaterials: 6, energyCells: 2 },
    researchRequirement: null,
    craftingTimeMs: 0,
    outputBaseItemId: "DRONE_COMPANION_CORE",
    outputRarity: "improved",
    qualityRange: { min: 30, max: 90 },
  },
  {
    id: "shield-capacitor-module",
    blueprintId: "bp-shield-capacitor-module",
    category: "orbitalModules",
    blueprintCategory: "modules",
    station: "forge",
    materials: { crystalFragments: 3, energyCells: 2 },
    researchRequirement: null,
    craftingTimeMs: 0,
    outputBaseItemId: "SHIELD_CAPACITOR_MODULE",
    outputRarity: "improved",
    qualityRange: { min: 30, max: 90 },
  },
];

/** Blueprints known from the start (the rest unlock through play). */
export const STARTING_BLUEPRINTS: readonly string[] = ["bp-refit-cannon"];
