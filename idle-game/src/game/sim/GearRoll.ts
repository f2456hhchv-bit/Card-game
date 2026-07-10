import { Rng } from "../../core/math/Rng";
import {
  GEAR_SLOTS,
  RARITIES,
  RARITY_WEIGHT,
  RARITY_VALUE_MULT,
  SLOT_STAT_POOL,
  SLOT_NAME_POOL,
  STAT_BASE_VALUE,
  gearStageScale,
  gearEffectiveValue,
  type GearItem,
  type Rarity,
} from "../data/gearDefs";

export function rollRarity(rng: Rng): Rarity {
  return rng.weighted(
    RARITIES,
    RARITIES.map((r) => RARITY_WEIGHT[r]),
  );
}

/** Roll a fresh gear item found at `stage`. `id` should be a monotonically
 * increasing counter from GameState.nextGearId so identity stays stable and
 * generation stays pure/deterministic given the same Rng stream. */
export function rollGear(stage: number, rng: Rng, id: number): GearItem {
  const slot = rng.pick(GEAR_SLOTS);
  const rarity = rollRarity(rng);
  const stat = rng.pick(SLOT_STAT_POOL[slot]);
  const name = rng.pick(SLOT_NAME_POOL[slot]);
  const value =
    STAT_BASE_VALUE[stat] * RARITY_VALUE_MULT[rarity] * gearStageScale(stage) * rng.range(0.9, 1.1);
  return {
    id: `g${id}`,
    slot,
    rarity,
    stat,
    name,
    baseValue: value,
    enhanceLevel: 0,
    foundAtStage: stage,
  };
}

/** A comparability score normalized by the stat's base value, so items with
 * different rolled stats (e.g. armor rolling Defense vs. Max HP) can still be
 * ranked against each other within the same slot. */
export function gearPower(item: GearItem): number {
  return gearEffectiveValue(item) / STAT_BASE_VALUE[item.stat];
}

export function isBetterGear(candidate: GearItem, current: GearItem | null): boolean {
  if (!current) return true;
  return gearPower(candidate) > gearPower(current);
}
