/**
 * Fire pattern geometry (AF-032 §2). Only the six geometric patterns
 * generate spawn angles; the six identity patterns pair with a matching
 * ProjectileBehaviour instead of a second geometry system (documented
 * simplification — see docs/WEAPON_FRAMEWORK.md §2).
 */
import type { FirePattern } from "./weaponData";

const TAU = Math.PI * 2;

/** Deterministic spawn angles (radians, absolute) for one shot. */
export function computeShotAngles(
  pattern: FirePattern,
  projectileCount: number,
  baseAngle: number,
  spiralStepRadians = 0,
): number[] {
  switch (pattern) {
    case "singleShot":
    case "burst":
      return [baseAngle];
    case "spread": {
      const count = Math.max(1, projectileCount);
      const spreadArc = Math.PI / 6;
      if (count === 1) return [baseAngle];
      const step = spreadArc / (count - 1);
      return Array.from({ length: count }, (_, i) => baseAngle - spreadArc / 2 + step * i);
    }
    case "arc": {
      const count = Math.max(1, projectileCount);
      const arcSpan = Math.PI / 3;
      if (count === 1) return [baseAngle];
      const step = arcSpan / (count - 1);
      return Array.from({ length: count }, (_, i) => baseAngle - arcSpan / 2 + step * i);
    }
    case "nova": {
      const count = Math.max(1, projectileCount);
      const step = TAU / count;
      return Array.from({ length: count }, (_, i) => baseAngle + step * i);
    }
    case "spiral":
      // A single projectile per shot, its angle advancing spiralStepRadians
      // each successive shot — the caller tracks and passes the running offset.
      return [baseAngle + spiralStepRadians];
    // Identity patterns spawn one projectile whose distinctiveness lives in
    // ProjectileBehaviour, not spawn geometry (§2).
    case "beam":
    case "orbit":
    case "homing":
    case "chain":
    case "wave":
    case "chargedShot":
      return [baseAngle];
  }
}
