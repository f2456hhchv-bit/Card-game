/**
 * Enemy movement behaviour — deterministic per-tick motion (AF-033 §8),
 * built the same way AF-032's stepProjectile was: pure, one case per
 * behaviour, fully tested. The one genuinely new mechanical surface this
 * module needs — no prior module modeled non-player motion.
 */
import type { MovementBehaviour } from "./enemyData";

export interface EnemyMovementState {
  x: number;
  y: number;
  elapsedMs: number;
  strafeDirection: 1 | -1;
  phase: "hidden" | "active";
}

export interface EnemyMovementContext {
  targetX: number;
  targetY: number;
  speed: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  /** Orbiting radius / kiting preferred range / ambush jump distance. */
  preferredRange?: number;
  /** Ambush trigger distance. */
  triggerRange?: number;
  /** Burrow surface/submerge or teleport jump interval. */
  phaseIntervalMs?: number;
  formationAnchorX?: number;
  formationAnchorY?: number;
  formationOffsetX?: number;
  formationOffsetY?: number;
  /** [0,1) — deterministic given a seeded source; defaults to a fixed value. */
  rng?: () => number;
}

/** Mutates state in place for one fixed tick. Pure given (behaviour, state, dtMs, context). */
export function stepEnemyMovement(
  behaviour: MovementBehaviour,
  state: EnemyMovementState,
  dtMs: number,
  context: EnemyMovementContext,
): void {
  const dt = dtMs / 1000;
  const previousElapsedMs = state.elapsedMs;
  state.elapsedMs += dtMs;

  const dx = context.targetX - state.x;
  const dy = context.targetY - state.y;
  const distance = Math.hypot(dx, dy) || 0.0001;
  const dirX = dx / distance;
  const dirY = dy / distance;

  switch (behaviour) {
    case "directPursuit": {
      state.x += dirX * context.speed * dt;
      state.y += dirY * context.speed * dt;
      break;
    }
    case "retreat": {
      state.x -= dirX * context.speed * dt;
      state.y -= dirY * context.speed * dt;
      break;
    }
    case "kiting": {
      const preferred = context.preferredRange ?? 6;
      if (distance < preferred) {
        state.x -= dirX * context.speed * dt;
        state.y -= dirY * context.speed * dt;
      } else if (distance > preferred + 1) {
        state.x += dirX * context.speed * dt;
        state.y += dirY * context.speed * dt;
      }
      break;
    }
    case "orbiting": {
      const radius = context.preferredRange ?? 6;
      const angularSpeed = context.speed / radius;
      const currentAngle = Math.atan2(state.y - context.targetY, state.x - context.targetX);
      const newAngle = currentAngle + angularSpeed * dt;
      const radiusError = radius - distance;
      const correctedRadius = distance + Math.sign(radiusError) * Math.min(Math.abs(radiusError), context.speed * dt);
      state.x = context.targetX + Math.cos(newAngle) * correctedRadius;
      state.y = context.targetY + Math.sin(newAngle) * correctedRadius;
      break;
    }
    case "strafing": {
      state.strafeDirection = Math.floor(state.elapsedMs / 1200) % 2 === 0 ? 1 : -1;
      const perpX = -dirY * state.strafeDirection;
      const perpY = dirX * state.strafeDirection;
      state.x += perpX * context.speed * dt;
      state.y += perpY * context.speed * dt;
      break;
    }
    case "ambush": {
      const trigger = context.triggerRange ?? 4;
      if (state.phase === "hidden" && distance <= trigger) {
        state.phase = "active";
      }
      if (state.phase === "active") {
        state.x += dirX * context.speed * dt;
        state.y += dirY * context.speed * dt;
      }
      break;
    }
    case "burrow": {
      const interval = context.phaseIntervalMs ?? 2000;
      const surfaced = Math.floor(state.elapsedMs / interval) % 2 === 1;
      state.phase = surfaced ? "active" : "hidden";
      if (surfaced) {
        state.x += dirX * context.speed * dt;
        state.y += dirY * context.speed * dt;
      }
      break;
    }
    case "teleport": {
      const interval = context.phaseIntervalMs ?? 3000;
      const previousTicks = Math.floor(previousElapsedMs / interval);
      const currentTicks = Math.floor(state.elapsedMs / interval);
      if (currentTicks > previousTicks) {
        const roll = context.rng ? context.rng() : 0.5;
        const angle = roll * Math.PI * 2;
        const jump = context.preferredRange ?? 5;
        state.x = context.targetX + Math.cos(angle) * jump;
        state.y = context.targetY + Math.sin(angle) * jump;
      }
      break;
    }
    case "wallCrawling": {
      const distLeft = state.x - context.bounds.minX;
      const distRight = context.bounds.maxX - state.x;
      const distTop = state.y - context.bounds.minY;
      const distBottom = context.bounds.maxY - state.y;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      if (minDist === distLeft || minDist === distRight) {
        state.x = minDist === distLeft ? context.bounds.minX : context.bounds.maxX;
        state.y += Math.sign(dy) * context.speed * dt;
      } else {
        state.y = minDist === distTop ? context.bounds.minY : context.bounds.maxY;
        state.x += Math.sign(dx) * context.speed * dt;
      }
      break;
    }
    case "formation": {
      const anchorX = context.formationAnchorX ?? context.targetX;
      const anchorY = context.formationAnchorY ?? context.targetY;
      const goalX = anchorX + (context.formationOffsetX ?? 0);
      const goalY = anchorY + (context.formationOffsetY ?? 0);
      const gx = goalX - state.x;
      const gy = goalY - state.y;
      const gDist = Math.hypot(gx, gy) || 0.0001;
      state.x += (gx / gDist) * context.speed * dt;
      state.y += (gy / gDist) * context.speed * dt;
      break;
    }
  }
}
