/**
 * Projectile behaviour — deterministic per-tick motion (AF-032 §2, "remains
 * deterministic"). Piercing/Explosive/Splitting/Chain Lightning describe
 * what happens ON HIT, not flight path — their trajectory is identical to
 * Straight; hit-resolution is a combat-module concern (main.ts), not motion.
 */
import type { ProjectileBehaviour } from "./weaponData";

const TAU = Math.PI * 2;

export interface ProjectileState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  originX: number;
  originY: number;
  elapsedMs: number;
  bouncesRemaining: number;
  reversed: boolean;
}

export interface ProjectileStepContext {
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  seekTargetX?: number;
  seekTargetY?: number;
  turnRatePerSecond?: number;
  accelerationPerSecond?: number;
  maxRange?: number;
  anchorX?: number;
  anchorY?: number;
  orbitRadius?: number;
  orbitAngularSpeedPerSecond?: number;
  gravityX?: number;
  gravityY?: number;
}

const TRAJECTORY_IS_STRAIGHT: ReadonlySet<ProjectileBehaviour> = new Set([
  "straight",
  "piercing",
  "explosive",
  "splitting",
  "chainLightning",
]);

/** Mutates state in place for one fixed tick. Pure given (behaviour, state, dtMs, context). */
export function stepProjectile(
  behaviour: ProjectileBehaviour,
  state: ProjectileState,
  dtMs: number,
  context: ProjectileStepContext,
): void {
  const dt = dtMs / 1000;
  state.elapsedMs += dtMs;

  if (behaviour === "persistentBeam") {
    // Stationary in this model — a beam's endpoints are recomputed by the
    // renderer from firer/target each frame, not by projectile motion.
    return;
  }

  if (TRAJECTORY_IS_STRAIGHT.has(behaviour)) {
    state.x += state.velocityX * dt;
    state.y += state.velocityY * dt;
    return;
  }

  switch (behaviour) {
    case "seeking": {
      if (context.seekTargetX !== undefined && context.seekTargetY !== undefined) {
        const speed = Math.hypot(state.velocityX, state.velocityY);
        const desiredAngle = Math.atan2(context.seekTargetY - state.y, context.seekTargetX - state.x);
        const currentAngle = Math.atan2(state.velocityY, state.velocityX);
        const turnRate = context.turnRatePerSecond ?? Math.PI;
        const maxTurn = turnRate * dt;
        let delta = desiredAngle - currentAngle;
        while (delta > Math.PI) delta -= TAU;
        while (delta < -Math.PI) delta += TAU;
        const clampedTurn = Math.max(-maxTurn, Math.min(maxTurn, delta));
        const newAngle = currentAngle + clampedTurn;
        state.velocityX = Math.cos(newAngle) * speed;
        state.velocityY = Math.sin(newAngle) * speed;
      }
      state.x += state.velocityX * dt;
      state.y += state.velocityY * dt;
      break;
    }
    case "bouncing": {
      state.x += state.velocityX * dt;
      state.y += state.velocityY * dt;
      if (state.bouncesRemaining > 0) {
        if (state.x < context.bounds.minX || state.x > context.bounds.maxX) {
          state.velocityX = -state.velocityX;
          state.x = Math.max(context.bounds.minX, Math.min(context.bounds.maxX, state.x));
          state.bouncesRemaining -= 1;
        }
        if (state.y < context.bounds.minY || state.y > context.bounds.maxY) {
          state.velocityY = -state.velocityY;
          state.y = Math.max(context.bounds.minY, Math.min(context.bounds.maxY, state.y));
          state.bouncesRemaining -= 1;
        }
      }
      break;
    }
    case "returning": {
      const traveled = Math.hypot(state.x - state.originX, state.y - state.originY);
      if (!state.reversed && context.maxRange !== undefined && traveled >= context.maxRange) {
        state.reversed = true;
        state.velocityX = -state.velocityX;
        state.velocityY = -state.velocityY;
      }
      state.x += state.velocityX * dt;
      state.y += state.velocityY * dt;
      break;
    }
    case "accelerating": {
      const accel = context.accelerationPerSecond ?? 0;
      if (accel > 0) {
        const speed = Math.hypot(state.velocityX, state.velocityY);
        const angle = Math.atan2(state.velocityY, state.velocityX);
        const newSpeed = speed + accel * dt;
        state.velocityX = Math.cos(angle) * newSpeed;
        state.velocityY = Math.sin(angle) * newSpeed;
      }
      state.x += state.velocityX * dt;
      state.y += state.velocityY * dt;
      break;
    }
    case "orbiting": {
      const anchorX = context.anchorX ?? state.originX;
      const anchorY = context.anchorY ?? state.originY;
      const radius = context.orbitRadius ?? Math.hypot(state.x - anchorX, state.y - anchorY);
      const angularSpeed = context.orbitAngularSpeedPerSecond ?? Math.PI;
      const currentAngle = Math.atan2(state.y - anchorY, state.x - anchorX);
      const newAngle = currentAngle + angularSpeed * dt;
      state.x = anchorX + Math.cos(newAngle) * radius;
      state.y = anchorY + Math.sin(newAngle) * radius;
      break;
    }
    case "gravityAffected": {
      state.velocityX += (context.gravityX ?? 0) * dt;
      state.velocityY += (context.gravityY ?? 0) * dt;
      state.x += state.velocityX * dt;
      state.y += state.velocityY * dt;
      break;
    }
  }
}
