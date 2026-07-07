/**
 * Stat aggregation, set bonuses, and build validation (AF-028). Aggregation
 * writes bonus totals only — it feeds AF-020/AF-021/AF-022/AF-025's EXISTING
 * fields at the composition-root seam; it invents no new stat pipeline.
 */
import {
  SLOT_ACCEPTS,
  type BonusKind,
  type EquipmentItemDef,
  type EquipmentSlot,
  type PassiveEffect,
  type SetDef,
} from "./equipmentData";

export type BonusTotals = Partial<Record<BonusKind, number>>;

export interface AggregateResult {
  bonuses: BonusTotals;
  passives: readonly PassiveEffect[];
  activeModules: readonly { slot: EquipmentSlot; itemId: string; cooldownMs: number }[];
  activeSetBonuses: readonly { setId: string; piecesEquipped: number; thresholdsMet: readonly number[] }[];
  powerRating: number;
}

export type ValidationFailure =
  | { ok: false; reason: "slotTypeMismatch"; slot: EquipmentSlot; itemId: string }
  | { ok: false; reason: "duplicateUniqueExclusive"; itemId: string }
  | { ok: false; reason: "missingDependency"; itemId: string; requiresCategory: string };

export type ValidationResult = { ok: true } | ValidationFailure;

/** Every rejection names the rule broken (AF-028 §6 / AF-003 §8 pattern). */
export function validateLoadout(
  slots: Readonly<Partial<Record<EquipmentSlot, string>>>,
  itemsById: ReadonlyMap<string, EquipmentItemDef>,
): ValidationResult {
  const equippedIds = Object.values(slots).filter((id): id is string => id !== undefined);
  const equippedCategories = new Set(
    equippedIds
      .map((id) => itemsById.get(id)?.category)
      .filter((c): c is NonNullable<typeof c> => c !== undefined),
  );

  for (const [slotName, itemId] of Object.entries(slots)) {
    if (!itemId) continue;
    const slot = slotName as EquipmentSlot;
    const item = itemsById.get(itemId);
    if (!item) continue;
    if (!SLOT_ACCEPTS[slot].includes(item.category)) {
      return { ok: false, reason: "slotTypeMismatch", slot, itemId };
    }
    if (item.requiresCategory && !equippedCategories.has(item.requiresCategory)) {
      return { ok: false, reason: "missingDependency", itemId, requiresCategory: item.requiresCategory };
    }
  }

  const uniqueCounts = new Map<string, number>();
  for (const id of equippedIds) {
    const item = itemsById.get(id);
    if (item?.uniqueExclusive) {
      uniqueCounts.set(item.id, (uniqueCounts.get(item.id) ?? 0) + 1);
    }
  }
  for (const [itemId, count] of uniqueCounts) {
    if (count > 1) return { ok: false, reason: "duplicateUniqueExclusive", itemId };
  }

  return { ok: true };
}

/** Aggregation is additive across items; set bonuses layer ON TOP (§5). */
export function aggregateLoadout(
  slots: Readonly<Partial<Record<EquipmentSlot, string>>>,
  itemsById: ReadonlyMap<string, EquipmentItemDef>,
  sets: readonly SetDef[],
): AggregateResult {
  const bonuses: BonusTotals = {};
  const passives: PassiveEffect[] = [];
  const activeModules: Array<{ slot: EquipmentSlot; itemId: string; cooldownMs: number }> = [];
  const setPieceCounts = new Map<string, number>();
  let powerRating = 0;

  for (const [slotName, itemId] of Object.entries(slots)) {
    if (!itemId) continue;
    const item = itemsById.get(itemId);
    if (!item) continue;

    for (const bonus of item.bonuses) {
      bonuses[bonus.kind] = (bonuses[bonus.kind] ?? 0) + bonus.value;
      powerRating += bonus.value * 100;
    }
    passives.push(...item.passives);
    if (item.active) {
      activeModules.push({ slot: slotName as EquipmentSlot, itemId: item.id, cooldownMs: item.active.cooldownMs });
    }
    if (item.setId) setPieceCounts.set(item.setId, (setPieceCounts.get(item.setId) ?? 0) + 1);
  }

  const activeSetBonuses: Array<{ setId: string; piecesEquipped: number; thresholdsMet: readonly number[] }> = [];
  for (const set of sets) {
    const equipped = setPieceCounts.get(set.id) ?? 0;
    if (equipped === 0) continue;
    const thresholdsMet: number[] = [];
    for (const [thresholdText, setBonuses] of Object.entries(set.thresholds)) {
      const threshold = Number(thresholdText);
      if (equipped >= threshold) {
        thresholdsMet.push(threshold);
        for (const bonus of setBonuses) {
          bonuses[bonus.kind] = (bonuses[bonus.kind] ?? 0) + bonus.value; // additive on top — never subtracts
          powerRating += bonus.value * 100;
        }
      }
    }
    if (thresholdsMet.length > 0) {
      activeSetBonuses.push({ setId: set.id, piecesEquipped: equipped, thresholdsMet });
    }
  }

  return { bonuses, passives, activeModules, activeSetBonuses, powerRating: Math.round(powerRating) };
}
