import type { Enemy } from "../entities";
import { Rng } from "../../core/math/Rng";

export interface BehaviorContext {
  playerX: number;
  playerY: number;
  rng: Rng;
  spawnEnemyProjectile: (x: number, y: number, angle: number, speed: number, damage: number, radius: number) => void;
  spawnEnemyAt: (defId: string, x: number, y: number) => void;
  damagePlayerIfInRange: (x: number, y: number, radius: number, damage: number) => void;
  killEnemy: (enemy: Enemy) => void;
}

/** Advances one enemy's AI for `dt` seconds. Mutates velocity/position and
 * behavior-specific runtime state; may emit projectiles/summons/AoE damage
 * via `ctx`. Each BehaviorId reads only the BehaviorParams fields it needs. */
export function updateEnemyBehavior(enemy: Enemy, dt: number, ctx: BehaviorContext): void {
  const dx = ctx.playerX - enemy.x;
  const dy = ctx.playerY - enemy.y;
  const dist = Math.hypot(dx, dy) || 1;
  const dirX = dx / dist;
  const dirY = dy / dist;
  enemy.facingAngle = Math.atan2(dy, dx);
  enemy.stateTimer += dt;

  const p = enemy.behaviorParams;

  switch (enemy.behavior) {
    case "chase": {
      enemy.vx = dirX * enemy.moveSpeed;
      enemy.vy = dirY * enemy.moveSpeed;
      break;
    }

    case "erraticChase": {
      const jitter = p.jitter ?? 0.5;
      const wobble = Math.sin(enemy.stateTimer * 6 + enemy.id) * jitter;
      const perpX = -dirY;
      const perpY = dirX;
      enemy.vx = (dirX + perpX * wobble) * enemy.moveSpeed;
      enemy.vy = (dirY + perpY * wobble) * enemy.moveSpeed;
      break;
    }

    case "kamikaze": {
      enemy.vx = dirX * enemy.moveSpeed;
      enemy.vy = dirY * enemy.moveSpeed;
      const triggerRange = enemy.radius + 20;
      if (dist <= triggerRange) {
        ctx.killEnemy(enemy);
      }
      break;
    }

    case "chaseRanged": {
      const preferred = p.preferredRange ?? 250;
      if (dist > preferred * 1.1) {
        enemy.vx = dirX * enemy.moveSpeed;
        enemy.vy = dirY * enemy.moveSpeed;
      } else if (dist < preferred * 0.8) {
        enemy.vx = -dirX * enemy.moveSpeed;
        enemy.vy = -dirY * enemy.moveSpeed;
      } else {
        enemy.vx = -dirY * enemy.moveSpeed * 0.4;
        enemy.vy = dirX * enemy.moveSpeed * 0.4;
      }
      fireIntervalTick(enemy, dt, p.fireInterval ?? 1.4, () => {
        ctx.spawnEnemyProjectile(enemy.x, enemy.y, enemy.facingAngle, p.projectileSpeed ?? 220, p.projectileDamage ?? 6, 6);
      });
      break;
    }

    case "orbitRanged": {
      const preferred = p.preferredRange ?? 260;
      const radialError = dist - preferred;
      const tangentX = -dirY;
      const tangentY = dirX;
      const radialX = dirX * Math.sign(radialError) * 0.6;
      const radialY = dirY * Math.sign(radialError) * 0.6;
      enemy.vx = (tangentX * 0.8 + radialX) * enemy.moveSpeed;
      enemy.vy = (tangentY * 0.8 + radialY) * enemy.moveSpeed;
      fireIntervalTick(enemy, dt, p.fireInterval ?? 1.2, () => {
        const count = p.spreadCount ?? 1;
        const spreadArc = 0.5;
        for (let i = 0; i < count; i++) {
          const t = count === 1 ? 0 : i / (count - 1) - 0.5;
          const a = enemy.facingAngle + Math.PI + t * spreadArc;
          ctx.spawnEnemyProjectile(enemy.x, enemy.y, a, p.projectileSpeed ?? 260, p.projectileDamage ?? 6, 6);
        }
      });
      break;
    }

    case "dashCharge": {
      updateDashCharge(enemy, dt, dirX, dirY);
      break;
    }

    case "shieldBurst": {
      const shieldInterval = p.shieldInterval ?? 4;
      const shieldDuration = p.shieldDuration ?? 1.5;
      const cyclePos = enemy.stateTimer % shieldInterval;
      enemy.behaviorActive = cyclePos < shieldDuration;
      const preferred = p.preferredRange ?? 240;
      if (dist > preferred) {
        enemy.vx = dirX * enemy.moveSpeed;
        enemy.vy = dirY * enemy.moveSpeed;
      } else {
        enemy.vx = -dirY * enemy.moveSpeed * 0.3;
        enemy.vy = dirX * enemy.moveSpeed * 0.3;
      }
      fireIntervalTick(enemy, dt, p.fireInterval ?? 1, () => {
        const count = p.spreadCount ?? 4;
        for (let i = 0; i < count; i++) {
          const a = enemy.facingAngle + Math.PI + (i / count) * Math.PI * 2;
          ctx.spawnEnemyProjectile(enemy.x, enemy.y, a, p.projectileSpeed ?? 260, p.projectileDamage ?? 6, 6);
        }
      });
      break;
    }

    case "teleportStrike": {
      const interval = p.teleportInterval ?? 2.5;
      if (enemy.stateTimer >= interval) {
        enemy.stateTimer = 0;
        const angle = ctx.rng.angle();
        const range = ctx.rng.range(70, 140);
        enemy.x = ctx.playerX + Math.cos(angle) * range;
        enemy.y = ctx.playerY + Math.sin(angle) * range;
        enemy.vx = 0;
        enemy.vy = 0;
      } else {
        enemy.vx = dirX * enemy.moveSpeed * 0.6;
        enemy.vy = dirY * enemy.moveSpeed * 0.6;
      }
      break;
    }

    case "auraPulse": {
      enemy.vx = dirX * enemy.moveSpeed;
      enemy.vy = dirY * enemy.moveSpeed;
      fireIntervalTick(enemy, dt, p.auraInterval ?? 1.2, () => {
        ctx.damagePlayerIfInRange(enemy.x, enemy.y, p.auraRadius ?? 90, p.auraDamage ?? 6);
      });
      break;
    }

    case "lavaTrail": {
      enemy.vx = dirX * enemy.moveSpeed;
      enemy.vy = dirY * enemy.moveSpeed;
      fireIntervalTick(enemy, dt, p.trailInterval ?? 0.5, () => {
        ctx.damagePlayerIfInRange(enemy.x, enemy.y, p.trailRadius ?? 40, p.trailDamage ?? 5);
      });
      break;
    }

    case "summon": {
      enemy.vx = dirX * enemy.moveSpeed * 0.4;
      enemy.vy = dirY * enemy.moveSpeed * 0.4;
      fireIntervalTick(enemy, dt, p.summonInterval ?? 5, () => {
        const count = p.summonCount ?? 1;
        const defId = p.summonDefId;
        if (!defId) return;
        for (let i = 0; i < count; i++) {
          const a = ctx.rng.angle();
          const r = 40 + ctx.rng.range(0, 40);
          ctx.spawnEnemyAt(defId, enemy.x + Math.cos(a) * r, enemy.y + Math.sin(a) * r);
        }
      });
      break;
    }

    case "stationaryTurret": {
      enemy.vx = 0;
      enemy.vy = 0;
      fireIntervalTick(enemy, dt, p.fireInterval ?? 1.2, () => {
        ctx.spawnEnemyProjectile(enemy.x, enemy.y, enemy.facingAngle, p.projectileSpeed ?? 240, p.projectileDamage ?? 6, 6);
      });
      break;
    }
  }
}

function fireIntervalTick(enemy: Enemy, dt: number, interval: number, fire: () => void): void {
  enemy.telegraphTimer -= dt;
  if (enemy.telegraphTimer <= 0) {
    enemy.telegraphTimer = interval;
    fire();
  }
}

function updateDashCharge(enemy: Enemy, dt: number, dirX: number, dirY: number): void {
  const p = enemy.behaviorParams;
  const interval = p.dashInterval ?? 3;
  const telegraph = p.dashTelegraph ?? 0.5;
  const dashDuration = 0.35;
  const speedMult = p.dashSpeedMult ?? 3;

  if (enemy.behaviorActive) {
    // Currently dashing along the locked direction.
    enemy.vx = enemy.originX * enemy.moveSpeed * speedMult;
    enemy.vy = enemy.originY * enemy.moveSpeed * speedMult;
    enemy.telegraphTimer -= dt;
    if (enemy.telegraphTimer <= 0) {
      enemy.behaviorActive = false;
      enemy.stateTimer = 0;
    }
    return;
  }

  if (enemy.stateTimer >= interval - telegraph && enemy.stateTimer < interval) {
    // Telegraphing: hold still, lock in the dash direction.
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.originX = dirX;
    enemy.originY = dirY;
    return;
  }

  if (enemy.stateTimer >= interval) {
    enemy.behaviorActive = true;
    enemy.telegraphTimer = dashDuration;
    return;
  }

  enemy.vx = dirX * enemy.moveSpeed * 0.6;
  enemy.vy = dirY * enemy.moveSpeed * 0.6;
}

export function explodeEnemy(enemy: Enemy, ctx: BehaviorContext): void {
  const p = enemy.behaviorParams;
  ctx.damagePlayerIfInRange(enemy.x, enemy.y, p.explodeRadius ?? 70, p.explodeDamage ?? 18);
}
