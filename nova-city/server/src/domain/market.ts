import type { Item } from '../types.js';

export function decayMultiplier(item: Item, acquiredAt: number, now: number): number {
  if (!item.decays) return 1;
  const ageHours = (now - acquiredAt) / 3_600_000;
  return Math.max(0.3, 1 - ageHours * 0.05);
}

export function sellPrice(item: Item, acquiredAt: number, now: number): number {
  return Math.round(item.price * 0.9 * decayMultiplier(item, acquiredAt, now));
}
