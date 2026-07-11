/**
 * Meteor Shower (GP-002 §Events): the one named environmental event with no
 * faction-entrance equivalent at all — a pure ambient hazard, using AF-035's
 * exact hazard-zone engine, the same "new content, same engine" discipline
 * OUTLAW_MINE_TUNING/createOutlawMine already established.
 */
import type { HazardZoneDef } from "../bosses/BossArena";

export const METEOR_SHOWER_TUNING = {
  radius: 2,
  tickIntervalMs: 500,
  damagePerTick: 8,
  ttlMs: 6000,
  /** How many impacts one triggered shower drops at once. */
  impactCount: 3,
  /** Impacts scatter within this radius of the trigger point. */
  scatterRadius: 6,
} as const;

export function createMeteorImpact(id: string, x: number, y: number): HazardZoneDef {
  return {
    id,
    x,
    y,
    radius: METEOR_SHOWER_TUNING.radius,
    tickIntervalMs: METEOR_SHOWER_TUNING.tickIntervalMs,
    damagePerTick: METEOR_SHOWER_TUNING.damagePerTick,
    statusOnTick: null,
  };
}
