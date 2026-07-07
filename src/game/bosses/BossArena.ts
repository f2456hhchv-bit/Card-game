/**
 * Boss arena hazards (AF-035 §Arena Design). Deterministic, pure tick
 * accumulation — the same style as AF-032's stepProjectile and AF-033's
 * stepEnemyMovement. A hazard zone is a circular area that ticks damage
 * (and, optionally, an AF-021 status) to anything standing inside it.
 */
import type { StatusKind } from "../combat/combatTuning";

export interface HazardZoneDef {
  id: string;
  x: number;
  y: number;
  radius: number;
  tickIntervalMs: number;
  damagePerTick: number;
  statusOnTick: { kind: StatusKind; strength: number; durationMs: number } | null;
}

export interface HazardZoneState {
  tickClockMs: number;
}

export function isInsideHazard(zone: HazardZoneDef, x: number, y: number): boolean {
  return Math.hypot(x - zone.x, y - zone.y) <= zone.radius;
}

/** Mutates state in place; returns true the tick(s) a damage/status application should fire. */
export function stepHazardZone(zone: HazardZoneDef, state: HazardZoneState, dtMs: number): boolean {
  state.tickClockMs += dtMs;
  if (state.tickClockMs < zone.tickIntervalMs) return false;
  state.tickClockMs -= zone.tickIntervalMs;
  return true;
}
