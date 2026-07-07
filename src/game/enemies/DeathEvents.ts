/**
 * Death event configuration (AF-033 §6) — over AF-021's existing EnemyKilled
 * event, not a new event-driven layer. EnemyKilled already drives XP/loot/
 * meta/achievements unconditionally; this supplies which of those (plus the
 * two mechanics this module adds — statusExplosion, spawnEvent) a specific
 * EnemyDef triggers.
 */
import type { DeathEventKind, EnemyDef } from "./enemyData";

export function hasDeathEvent(def: EnemyDef, kind: DeathEventKind): boolean {
  return def.deathEvents.includes(kind);
}
