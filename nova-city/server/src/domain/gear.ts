import type { Item, Stat } from '../types.js';

export const BASE_STAT_KEYS: Stat[] = ['strength', 'defense', 'speed', 'dexterity'];

/** Combines base stats with any bonuses from equipped weapon/armor. */
export function effectiveStats(
  baseStats: Record<Stat, number>,
  weapon: Item | undefined,
  armor: Item | undefined,
): Record<Stat, number> {
  const result = { ...baseStats };
  for (const item of [weapon, armor]) {
    if (!item?.statBonus) continue;
    for (const key of BASE_STAT_KEYS) {
      const bonus = item.statBonus[key];
      if (bonus) result[key] += bonus;
    }
  }
  return result;
}
