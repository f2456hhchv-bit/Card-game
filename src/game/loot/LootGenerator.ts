/**
 * Deterministic drop generation (AF-023 §3). Eight rolls in fixed order
 * from the mission-seed loot fork; every drop records its own child seed so
 * any item is reproducible (and future-verifiable, AF-001 §11). Bonuses
 * shift rarity weight progressively up the ladder; smart-loot multipliers
 * are hard-clamped — relevance without rigging.
 */
import type { Rng } from "../../core/rng/Rng";
import {
  PLACEHOLDER_AFFIXES,
  RARITY_LADDER,
  RARITY_TABLE,
  type LootCategory,
  type LootTuning,
  type Rarity,
  type SpecialDropKind,
} from "./lootTuning";

export interface DropTableEntry {
  baseItemId: string;
  category: LootCategory;
  weight: number;
  special?: SpecialDropKind;
}

export interface DropContext {
  itemLevel: number;
  difficulty: number;
  ascension: number;
  /** Additional ladder-shift bonuses (mutators, research), ≥ 0. */
  mutatorBonus: number;
  researchBonus: number;
  smartLoot?: { categoryWeights: Partial<Record<LootCategory, number>> };
}

export interface AffixRoll {
  id: string;
  value: number;
}

export interface LootDrop {
  baseItemId: string;
  category: LootCategory;
  itemLevel: number;
  rarity: Rarity;
  affixes: readonly AffixRoll[];
  quality: number;
  special: SpecialDropKind | null;
  /** Child seed — reproduces this exact drop. */
  seed: number;
}

export function rollRarity(context: DropContext, tuning: LootTuning, rng: Rng): Rarity {
  // Ladder-shift factor: multiplies tier weights by factor^(tierIndex/8),
  // so bonuses help high tiers most without erasing low tiers.
  const factor =
    tuning.difficultyShiftPerPoint ** Math.max(0, context.difficulty - 1) *
    tuning.ascensionShiftPerLevel ** context.ascension *
    (1 + context.mutatorBonus) *
    (1 + context.researchBonus);

  const weights = RARITY_LADDER.map((rarity, index) => {
    const shift = factor ** (index / (RARITY_LADDER.length - 1));
    return RARITY_TABLE[rarity].weight * shift;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = rng.next() * total;
  for (let i = 0; i < weights.length; i += 1) {
    roll -= weights[i] as number;
    if (roll <= 0) return RARITY_LADDER[i] as Rarity;
  }
  return "singularity";
}

export function generateDrop(
  table: readonly DropTableEntry[],
  context: DropContext,
  tuning: LootTuning,
  rng: Rng,
): LootDrop {
  if (table.length === 0) throw new Error("generateDrop: empty drop table");
  const dropSeed = Math.floor(rng.next() * 4294967296);
  const dropRng = rng.fork(`drop-${dropSeed}`);

  // 1–2: Category + base item (weighted, smart-loot-clamped multipliers).
  const clamp = tuning.smartLootClamp;
  const weights = table.map((entry) => {
    const smart = context.smartLoot?.categoryWeights[entry.category] ?? 1;
    return entry.weight * Math.min(clamp.max, Math.max(clamp.min, smart));
  });
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let roll = dropRng.next() * totalWeight;
  let entry = table[table.length - 1] as DropTableEntry;
  for (let i = 0; i < table.length; i += 1) {
    roll -= weights[i] as number;
    if (roll <= 0) {
      entry = table[i] as DropTableEntry;
      break;
    }
  }

  // 3: Item level (context-driven; missions may jitter later via context).
  const itemLevel = Math.max(1, Math.round(context.itemLevel));

  // 4: Rarity.
  const rarity = rollRarity(context, tuning, dropRng);

  // 5: Affixes — distinct, count by rarity, values scale with level+tier.
  const affixCount = Math.min(RARITY_TABLE[rarity].affixCount, PLACEHOLDER_AFFIXES.length);
  const pool = [...PLACEHOLDER_AFFIXES];
  const affixes: AffixRoll[] = [];
  const tierIndex = RARITY_LADDER.indexOf(rarity);
  const levelScale = 1 + tuning.affixLevelScaling * (itemLevel - 1) + 0.1 * tierIndex;
  for (let i = 0; i < affixCount; i += 1) {
    const pickIndex = dropRng.int(0, pool.length - 1);
    const affix = pool.splice(pickIndex, 1)[0];
    if (!affix) break;
    affixes.push({ id: affix.id, value: dropRng.float(affix.minValue, affix.maxValue) * levelScale });
  }

  // 6: Quality.
  const quality = dropRng.int(0, 100);

  // 7: Special properties (from the table entry; content modules extend).
  const special = entry.special ?? null;

  return { baseItemId: entry.baseItemId, category: entry.category, itemLevel, rarity, affixes, quality, special, seed: dropSeed };
}
