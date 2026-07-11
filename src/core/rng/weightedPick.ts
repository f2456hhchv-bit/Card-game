/**
 * Generic weighted-pick over a fixed 0..1 roll — the same algorithm AF-022's
 * UpgradePool.offer() established, extracted here so it has exactly one real
 * implementation instead of being reinvented per content category (the
 * Master Build Directive's own "avoid duplicated logic" code standard).
 */
export function pickWeighted<T extends { weight: number }>(pool: readonly T[], roll: number): T {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let remaining = roll * totalWeight;
  for (const item of pool) {
    remaining -= item.weight;
    if (remaining <= 0) return item;
  }
  return pool[pool.length - 1]!;
}
