/**
 * GP-002 §Synergy System: "Snipers punish standing still." The one named
 * example with no real analog at all — pure, testable damage-multiplier
 * math; the composition root owns the actual player-stationary clock.
 */
import type { EnemyRole } from "./enemyData";

/** How long the player must stay still before a sniper's bonus kicks in. */
export const SNIPER_STILLNESS_THRESHOLD_MS = 1500;
/** The bonus itself — a flat damage multiplier once the threshold is crossed. */
export const SNIPER_STILLNESS_DAMAGE_BONUS = 0.5;

/** 1 for every non-sniper or moving-target case; 1 + bonus once a sniper's target has held still long enough. */
export function sniperStillnessMultiplier(roles: readonly EnemyRole[], playerStationaryMs: number): number {
  if (!roles.includes("sniper")) return 1;
  return playerStationaryMs >= SNIPER_STILLNESS_THRESHOLD_MS ? 1 + SNIPER_STILLNESS_DAMAGE_BONUS : 1;
}
