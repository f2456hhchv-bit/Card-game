/**
 * Target priority selectors (AF-021 §5). Pure framework functions —
 * weapons pick a selector in data. Manual override is future, bound by
 * AF-019's law: assistance never overrides player intent.
 */
export interface TargetCandidate {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  isBoss: boolean;
  isElite: boolean;
}

export type TargetSelector = (
  candidates: readonly TargetCandidate[],
  originX: number,
  originY: number,
) => TargetCandidate | null;

const byDistance = (
  candidates: readonly TargetCandidate[],
  originX: number,
  originY: number,
): TargetCandidate | null => {
  let best: TargetCandidate | null = null;
  let bestDistanceSq = Infinity;
  for (const candidate of candidates) {
    const dx = candidate.x - originX;
    const dy = candidate.y - originY;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < bestDistanceSq) {
      bestDistanceSq = distanceSq;
      best = candidate;
    }
  }
  return best;
};

export const nearestEnemy: TargetSelector = byDistance;

export const bossPriority: TargetSelector = (candidates, x, y) => {
  const bosses = candidates.filter((c) => c.isBoss);
  return byDistance(bosses.length > 0 ? bosses : candidates, x, y);
};

export const elitePriority: TargetSelector = (candidates, x, y) => {
  const elites = candidates.filter((c) => c.isElite || c.isBoss);
  return byDistance(elites.length > 0 ? elites : candidates, x, y);
};

export const lowestHealth: TargetSelector = (candidates) => {
  let best: TargetCandidate | null = null;
  for (const candidate of candidates) {
    if (!best || candidate.health < best.health) best = candidate;
  }
  return best;
};

export const highestHealth: TargetSelector = (candidates) => {
  let best: TargetCandidate | null = null;
  for (const candidate of candidates) {
    if (!best || candidate.health > best.health) best = candidate;
  }
  return best;
};

export const TARGET_SELECTORS = {
  nearest: nearestEnemy,
  boss: bossPriority,
  elite: elitePriority,
  lowestHealth,
  highestHealth,
} as const;

export type TargetSelectorId = keyof typeof TARGET_SELECTORS;
