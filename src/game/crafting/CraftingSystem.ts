/**
 * Crafting system (AF-025): persistent material inventory, permanent
 * blueprints, deterministic crafting producing AF-023-shaped items,
 * floor-guaranteed salvage, and escalating-cost reforge. No automatic
 * crafting exists — every operation is an explicit player call.
 */
import type { Rng } from "../../core/rng/Rng";
import { PLACEHOLDER_AFFIXES, RARITY_LADDER, RARITY_TABLE } from "../loot/lootTuning";
import type { AffixRoll, LootDrop } from "../loot/LootGenerator";
import type {
  CraftingTuning,
  MaterialCost,
  RecipeDef,
  ResourceType,
} from "./craftingData";

export interface CraftedItem extends LootDrop {
  crafted: true;
  reforgeCount: number;
}

export interface CraftingSaveData {
  materials: Partial<Record<ResourceType, number>>;
  blueprints: string[];
  hangar: CraftedItem[];
}

export type CraftResult =
  | { ok: true; item: CraftedItem }
  | { ok: false; reason: "unknownRecipe" | "blueprintUnknown" | "researchLocked" | "insufficientMaterials" };

export class CraftingSystem {
  private readonly materials = new Map<ResourceType, number>();
  private readonly blueprints = new Set<string>();
  private hangar: CraftedItem[] = [];

  constructor(
    private readonly recipes: readonly RecipeDef[],
    private readonly tuning: CraftingTuning,
    /** Research gate — injected so crafting never imports the tree. */
    private readonly isResearchUnlocked: (nodeId: string) => boolean,
    private readonly onBlueprintUnlocked?: (blueprintId: string) => void,
  ) {}

  // ── Materials ────────────────────────────────────────────────────────────

  addMaterial(type: ResourceType, amount: number): void {
    if (amount <= 0) return;
    this.materials.set(type, (this.materials.get(type) ?? 0) + amount);
  }

  materialCount(type: ResourceType): number {
    return this.materials.get(type) ?? 0;
  }

  canAfford(cost: MaterialCost): boolean {
    return Object.entries(cost).every(
      ([type, amount]) => this.materialCount(type as ResourceType) >= (amount ?? 0),
    );
  }

  private spend(cost: MaterialCost): void {
    for (const [type, amount] of Object.entries(cost)) {
      const resource = type as ResourceType;
      this.materials.set(resource, this.materialCount(resource) - (amount ?? 0));
    }
  }

  // ── Blueprints ───────────────────────────────────────────────────────────

  unlockBlueprint(blueprintId: string): boolean {
    if (this.blueprints.has(blueprintId)) return false;
    this.blueprints.add(blueprintId);
    this.onBlueprintUnlocked?.(blueprintId);
    return true;
  }

  knowsBlueprint(blueprintId: string): boolean {
    return this.blueprints.has(blueprintId);
  }

  /** Recipes visible to the player: blueprint known (research may still gate). */
  get knownRecipes(): readonly RecipeDef[] {
    return this.recipes.filter((r) => this.blueprints.has(r.blueprintId));
  }

  canCraft(recipeId: string): CraftResult | { ok: true; item: null } {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    if (!recipe) return { ok: false, reason: "unknownRecipe" };
    if (!this.blueprints.has(recipe.blueprintId)) return { ok: false, reason: "blueprintUnknown" };
    if (recipe.researchRequirement && !this.isResearchUnlocked(recipe.researchRequirement)) {
      return { ok: false, reason: "researchLocked" };
    }
    if (!this.canAfford(recipe.materials)) return { ok: false, reason: "insufficientMaterials" };
    return { ok: true, item: null };
  }

  // ── Crafting (AF-025 §3) ─────────────────────────────────────────────────

  craft(recipeId: string, itemLevel: number, rng: Rng): CraftResult {
    const check = this.canCraft(recipeId);
    if (!check.ok) return check;
    const recipe = this.recipes.find((r) => r.id === recipeId) as RecipeDef;
    this.spend(recipe.materials);

    const seed = Math.floor(rng.next() * 4294967296);
    const craftRng = rng.fork(`craft-${seed}`);
    const quality = craftRng.int(recipe.qualityRange.min, recipe.qualityRange.max);
    const item: CraftedItem = {
      baseItemId: recipe.outputBaseItemId,
      category: "equipment",
      itemLevel: Math.max(1, Math.round(itemLevel)),
      rarity: recipe.outputRarity,
      affixes: this.rollAffixes(recipe.outputRarity, itemLevel, craftRng),
      quality,
      special: null,
      seed,
      crafted: true,
      reforgeCount: 0,
    };
    this.hangar.push(item);
    if (this.hangar.length > this.tuning.hangarCap) this.hangar.shift();
    return { ok: true, item };
  }

  // ── Salvage (AF-025 §4) ──────────────────────────────────────────────────

  /** Floor-guaranteed returns scaled by rarity and quality. Never punitive. */
  salvage(item: LootDrop, craftingResearchBonus = 0): MaterialCost {
    const tierIndex = RARITY_LADDER.indexOf(item.rarity);
    const value = RARITY_TABLE[item.rarity].collectionValue;
    const qualityScale = 0.5 + (item.quality / 100) * 0.5;
    const bonus = 1 + craftingResearchBonus;
    const returned: MaterialCost = {
      commonMaterials: Math.max(
        this.tuning.salvageFloor.commonMaterials ?? 1,
        Math.round(value * this.tuning.salvageReturnFraction * qualityScale * bonus * 0.5),
      ),
    };
    if (tierIndex >= RARITY_LADDER.indexOf("rare")) {
      returned.rareAlloys = Math.max(1, Math.round(tierIndex - 2));
    }
    if (tierIndex >= RARITY_LADDER.indexOf("ancient")) {
      returned.ancientComponents = 1;
    }
    for (const [type, amount] of Object.entries(returned)) {
      this.addMaterial(type as ResourceType, amount ?? 0);
    }
    return returned;
  }

  salvageFromHangar(index: number, craftingResearchBonus = 0): MaterialCost | null {
    const item = this.hangar[index];
    if (!item) return null;
    this.hangar.splice(index, 1);
    return this.salvage(item, craftingResearchBonus);
  }

  // ── Reforge (AF-025 §5) ──────────────────────────────────────────────────

  reforgeCost(item: CraftedItem): MaterialCost {
    const factor = this.tuning.reforgeCostEscalation ** item.reforgeCount;
    const cost: MaterialCost = {};
    for (const [type, amount] of Object.entries(this.tuning.reforgeBaseCost)) {
      cost[type as ResourceType] = Math.ceil((amount ?? 0) * factor);
    }
    return cost;
  }

  /** Rerolls affixes at escalating cost. No pity, no guaranteed perfection. */
  reforge(item: CraftedItem, rng: Rng): boolean {
    const cost = this.reforgeCost(item);
    if (!this.canAfford(cost)) return false;
    this.spend(cost);
    const reforgeRng = rng.fork(`reforge-${item.seed}-${item.reforgeCount}`);
    item.affixes = this.rollAffixes(item.rarity, item.itemLevel, reforgeRng);
    item.reforgeCount += 1;
    return true;
  }

  // ── Persistence (AF-024 save slice) ──────────────────────────────────────

  toSave(): CraftingSaveData {
    const materials: Partial<Record<ResourceType, number>> = {};
    for (const [type, amount] of this.materials) materials[type] = amount;
    return { materials, blueprints: [...this.blueprints], hangar: [...this.hangar] };
  }

  loadSave(data: CraftingSaveData): void {
    this.materials.clear();
    for (const [type, amount] of Object.entries(data.materials)) {
      if (typeof amount === "number" && amount > 0) this.materials.set(type as ResourceType, amount);
    }
    this.blueprints.clear();
    for (const id of data.blueprints) this.blueprints.add(id);
    this.hangar = data.hangar.slice(0, this.tuning.hangarCap);
  }

  get hangarItems(): readonly CraftedItem[] {
    return this.hangar;
  }

  private rollAffixes(rarity: LootDrop["rarity"], itemLevel: number, rng: Rng): AffixRoll[] {
    const count = Math.min(RARITY_TABLE[rarity].affixCount, PLACEHOLDER_AFFIXES.length);
    const pool = [...PLACEHOLDER_AFFIXES];
    const tierIndex = RARITY_LADDER.indexOf(rarity);
    const scale = 1 + 0.05 * (itemLevel - 1) + 0.1 * tierIndex;
    const affixes: AffixRoll[] = [];
    for (let i = 0; i < count; i += 1) {
      const affix = pool.splice(rng.int(0, pool.length - 1), 1)[0];
      if (!affix) break;
      affixes.push({ id: affix.id, value: rng.float(affix.minValue, affix.maxValue) * scale });
    }
    return affixes;
  }
}
