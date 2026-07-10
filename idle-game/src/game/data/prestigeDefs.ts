/**
 * Renewal — the prestige loop. Resets the march (stage, hero level,
 * gold, gear, shop upgrades) in exchange for permanent Afterglow, which grants
 * a flat percentage bonus to every hero stat forever. Classic idle-genre
 * "reset to re-climb faster" pressure valve.
 */
export const PRESTIGE = {
  /** Stage the player must reach at least once to unlock rebirth. */
  unlockStage: 40,
  /** +this much all-stats power per Afterglow point owned. */
  powerPerAfterglow: 0.02,
} as const;

/** Afterglow granted for rebirthing from `stage` (0 below the unlock stage). */
export function afterglowForStage(stage: number): number {
  if (stage < PRESTIGE.unlockStage) return 0;
  const progress = stage - PRESTIGE.unlockStage + 1;
  return Math.floor(Math.pow(progress, 0.62) * 1.15);
}

/** All-stats multiplier granted by a given Afterglow total. */
export function powerMultiplier(afterglow: number): number {
  return 1 + Math.max(0, afterglow) * PRESTIGE.powerPerAfterglow;
}
