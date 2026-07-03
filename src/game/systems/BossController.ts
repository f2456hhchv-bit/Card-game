import type { Enemy } from "../entities/Enemy";
import type { BossDef } from "../data/bossDefs";
import type { EnemyProjectileStyle } from "../entities/EnemyProjectile";
import { TAU } from "../../core/math/MathUtils";
import type { Rng } from "../../core/math/Rng";

/**
 * Everything the BossController needs from the World, abstracted so the boss's
 * phase/attack state machine can be unit-tested in isolation.
 */
export interface BossContext {
  player: { x: number; y: number };
  elapsedMinutes: number;
  rng: Rng;
  /** Fire a hostile projectile (with the boss's signature bullet silhouette). */
  fireEnemyProjectile(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    hue: number,
    radius: number,
    style?: EnemyProjectileStyle,
  ): void;
  /** Summon a normal enemy add at a world position. */
  spawnAdd(typeId: string, x: number, y: number): void;
}

import type { BossSignature } from "../data/bossDefs";

/**
 * Every attack the controller can fire. The first three are the shared,
 * always-readable staples; the rest are boss signatures (one per boss, woven
 * into that boss's rotation) so encounters play distinctly.
 */
type AttackKind =
  | "aimed"
  | "radial"
  | "spiral"
  | BossSignature;

interface QueuedAttack {
  kind: AttackKind;
  count: number;
  speed: number;
}

/** Phase boundaries as fractions of max HP. */
const PHASE2_AT = 0.66;
const PHASE3_AT = 0.33;

/**
 * Drives a boss `Enemy` through three escalating phases of telegraphed attacks.
 * Telegraphs (a wind-up during which the boss glows and slows) give the player a
 * fair window to react before each volley — the core of readable boss design.
 */
export class BossController {
  readonly def: BossDef;
  phase = 0; // 0,1,2 → encounter phases 1,2,3
  private attackTimer: number;
  private telegraph = 0;
  private telegraphMax = 0.7;
  private queued: QueuedAttack | null = null;
  private spiralAngle = 0;
  private cycleStep = 0;
  /** Rotating base for the rigid "cross" signature. */
  private crossAngle = 0;
  /** Advancing base for the "sweep" clock-hand signature. */
  private sweepAngle = 0;

  constructor(def: BossDef) {
    this.def = def;
    this.attackTimer = 1.5; // brief grace after spawn
  }

  /** 0..1 — how far through the current telegraph wind-up (for rendering). */
  get telegraphProgress(): number {
    return this.telegraph > 0 ? 1 - this.telegraph / this.telegraphMax : 0;
  }
  get isTelegraphing(): boolean {
    return this.telegraph > 0;
  }

  private phaseCadence(): number {
    const base = this.phase === 0 ? 2.6 : this.phase === 1 ? 2.0 : 1.5;
    return base * this.def.cadenceMult;
  }
  private phaseTelegraph(): number {
    return this.phase === 0 ? 0.7 : this.phase === 1 ? 0.6 : 0.5;
  }
  private projectileSpeed(): number {
    const base = this.phase === 0 ? 150 : this.phase === 1 ? 175 : 205;
    return base * this.def.projectileSpeedMult;
  }

  update(boss: Enemy, ctx: BossContext, dt: number): void {
    if (!boss.active) return;
    this.updatePhase(boss, ctx);

    const { player } = ctx;
    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Telegraphing commits the boss: it slows to a crawl while winding up.
    const moveScale = this.telegraph > 0 ? 0.2 : 1;
    boss.x += (dx / dist) * this.def.speed * moveScale * dt;
    boss.y += (dy / dist) * this.def.speed * moveScale * dt;

    // Attack pipeline: schedule → telegraph → fire.
    if (this.telegraph > 0) {
      this.telegraph -= dt;
      if (this.telegraph <= 0 && this.queued) {
        this.fire(this.queued, boss, ctx);
        this.queued = null;
      }
      return;
    }

    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      this.attackTimer = this.phaseCadence();
      this.telegraphMax = this.phaseTelegraph();
      this.telegraph = this.telegraphMax;
      this.queued = this.chooseAttack();
    }
  }

  private updatePhase(boss: Enemy, ctx: BossContext): void {
    const frac = boss.hp / boss.maxHp;
    if (this.phase === 0 && frac <= PHASE2_AT) {
      this.phase = 1;
      this.onEnterPhase(boss, ctx);
    } else if (this.phase === 1 && frac <= PHASE3_AT) {
      this.phase = 2;
      this.onEnterPhase(boss, ctx);
    }
  }

  /** On phase change, summon a wave of adds to ramp the pressure. */
  private onEnterPhase(boss: Enemy, ctx: BossContext): void {
    const count = this.phase === 1 ? this.def.addCounts[0] : this.def.addCounts[1];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU + ctx.rng.angle();
      const r = boss.radius + 60;
      ctx.spawnAdd(this.def.addType, boss.x + Math.cos(a) * r, boss.y + Math.sin(a) * r);
    }
    // Brief reprieve from ranged fire right after a summon.
    this.attackTimer = Math.max(this.attackTimer, 1.0);
  }

  /**
   * The attack rotation for the current phase, with the boss's **signature**
   * woven in — appearing occasionally in phase 1 and frequently by phase 3, so
   * every boss reads as its own fight while still escalating.
   */
  private phaseCycle(): AttackKind[] {
    const sig = this.def.signature;
    // The signature carries the fight — it appears immediately and dominates by
    // the last phase — with just enough shared aimed/radial pressure between
    // beats to keep the boss readable. This is what makes each boss feel its own.
    switch (this.phase) {
      case 0:
        return ["aimed", sig, sig, "radial"];
      case 1:
        return [sig, "aimed", sig, "radial", sig];
      default:
        return [sig, sig, "aimed", sig, sig, "radial"];
    }
  }

  private chooseAttack(): QueuedAttack {
    const speed = this.projectileSpeed();
    const cycle = this.phaseCycle();
    const kind = cycle[this.cycleStep % cycle.length];
    this.cycleStep++;
    return { kind, count: this.attackCount(kind), speed };
  }

  /** Bullet/arm count for an attack, scaled by phase. */
  private attackCount(kind: AttackKind): number {
    const p = this.phase;
    switch (kind) {
      case "aimed":
        return 5 + p * 2;
      case "radial":
        return 12 + p * 4;
      case "spiral":
        return 3 + p;
      case "aimedSpread":
        return 6 + p * 2; // dense shotgun cone
      case "ringGap":
        return 18 + p * 5; // full ring minus a dodge gap
      case "cross":
        return 4 + (p >= 2 ? 4 : 0); // 4 arms, 8 in the final phase
      case "spiralTwin":
        return 3 + p; // arms per side
      case "wall":
        return 7 + p * 2; // parallel bullets across the wall
      case "lattice":
        return 7 + p * 2; // bullets per ring (fired twice, interleaved)
      case "sweep":
        return 4 + p; // bullets along the sweeping arm
    }
  }

  private fire(attack: QueuedAttack, boss: Enemy, ctx: BossContext): void {
    const dmg = this.def.projectileDamage * (1 + ctx.elapsedMinutes * 0.1);
    const r = this.phase >= 2 ? 11 : 9;
    switch (attack.kind) {
      case "aimed": {
        const base = Math.atan2(ctx.player.y - boss.y, ctx.player.x - boss.x);
        const arc = 0.5;
        for (let i = 0; i < attack.count; i++) {
          const t = attack.count > 1 ? i / (attack.count - 1) - 0.5 : 0;
          this.spawn(boss, ctx, base + t * arc, attack.speed, dmg, r);
        }
        break;
      }
      case "radial": {
        const offset = ctx.rng.angle();
        for (let i = 0; i < attack.count; i++) {
          this.spawn(boss, ctx, offset + (i / attack.count) * TAU, attack.speed, dmg, r);
        }
        break;
      }
      case "spiral": {
        // Several arms offset from a rotating base; successive volleys rotate.
        this.spiralAngle += 0.5;
        const arms = attack.count;
        for (let i = 0; i < arms; i++) {
          this.spawn(
            boss,
            ctx,
            this.spiralAngle + (i / arms) * TAU,
            attack.speed * 0.92,
            dmg,
            r,
          );
        }
        break;
      }
      case "aimedSpread": {
        // A tight shotgun cluster hurled at the Warden — punishing up close,
        // easy to sidestep at range. The Pyre's aggressive signature.
        const base = Math.atan2(ctx.player.y - boss.y, ctx.player.x - boss.x);
        const arc = 0.42;
        for (let i = 0; i < attack.count; i++) {
          const t = attack.count > 1 ? i / (attack.count - 1) - 0.5 : 0;
          const jitter = ctx.rng.range(-0.03, 0.03);
          this.spawn(boss, ctx, base + t * arc + jitter, attack.speed * 1.15, dmg, r);
        }
        break;
      }
      case "ringGap": {
        // A full radial ring with one wedge left open — there is always a lane
        // to dodge through if you read it. The Maw/Rime's devouring signature.
        const offset = ctx.rng.angle();
        const n = attack.count;
        const gapStart = Math.floor(ctx.rng.range(0, n));
        const gapWidth = 3; // slots left open
        for (let i = 0; i < n; i++) {
          if ((i - gapStart + n) % n < gapWidth) continue;
          this.spawn(boss, ctx, offset + (i / n) * TAU, attack.speed, dmg, r);
        }
        break;
      }
      case "cross": {
        // A rigid cross of bullet-lines that rotates a little each volley — a
        // slow, geometric, hammering pattern. The Forge/Nadir's signature.
        this.crossAngle += 0.28;
        const arms = attack.count;
        const perLine = 3;
        for (let a = 0; a < arms; a++) {
          const ang = this.crossAngle + (a / arms) * TAU;
          for (let k = 0; k < perLine; k++) {
            this.spawn(boss, ctx, ang, attack.speed * (0.8 + k * 0.22), dmg, r);
          }
        }
        break;
      }
      case "spiralTwin": {
        // Two counter-rotating spiral arms — a hypnotic, weaving mesh. The
        // Choir's chorus signature.
        this.spiralAngle += 0.42;
        const arms = attack.count;
        for (let i = 0; i < arms; i++) {
          const spread = (i / arms) * TAU;
          this.spawn(boss, ctx, this.spiralAngle + spread, attack.speed * 0.9, dmg, r);
          this.spawn(boss, ctx, -this.spiralAngle + spread, attack.speed * 0.9, dmg, r);
        }
        break;
      }
      case "wall": {
        // A wall of parallel bullets sweeping in from the boss's flank — you
        // must slip around its end. The Sovereign's imperious signature.
        const base = Math.atan2(ctx.player.y - boss.y, ctx.player.x - boss.x);
        const dirX = Math.cos(base);
        const dirY = Math.sin(base);
        const perpX = -dirY;
        const perpY = dirX;
        const n = attack.count;
        const spacing = 44;
        for (let i = 0; i < n; i++) {
          const off = (i - (n - 1) / 2) * spacing;
          const sx = boss.x + perpX * off + dirX * boss.radius;
          const sy = boss.y + perpY * off + dirY * boss.radius;
          ctx.fireEnemyProjectile(
            sx,
            sy,
            dirX * attack.speed,
            dirY * attack.speed,
            dmg,
            this.def.hue,
            r,
            this.def.bulletStyle,
          );
        }
        break;
      }
      case "lattice": {
        // Two interleaved rings — an outer fast ring and an inner, half-step
        // offset, slower one — that expand into a crystalline mesh. The Rime's
        // freezing signature: dense, but the lanes between rings can be threaded.
        const offset = ctx.rng.angle();
        const n = attack.count;
        for (let i = 0; i < n; i++) {
          this.spawn(boss, ctx, offset + (i / n) * TAU, attack.speed, dmg, r);
          this.spawn(boss, ctx, offset + ((i + 0.5) / n) * TAU, attack.speed * 0.62, dmg, r);
        }
        break;
      }
      case "sweep": {
        // A rotating spoke that advances a fixed step each volley, sweeping
        // around the arena like a clock hand — you must orbit ahead of it. The
        // Nadir's inexorable signature. A staggered line makes the arm long.
        this.sweepAngle += 0.7;
        const line = attack.count;
        for (let k = 0; k < line; k++) {
          this.spawn(boss, ctx, this.sweepAngle, attack.speed * (0.55 + k * 0.16), dmg, r);
        }
        this.spawn(boss, ctx, this.sweepAngle + 0.13, attack.speed * 0.85, dmg, r);
        this.spawn(boss, ctx, this.sweepAngle - 0.13, attack.speed * 0.85, dmg, r);
        break;
      }
    }
  }

  private spawn(
    boss: Enemy,
    ctx: BossContext,
    angle: number,
    speed: number,
    dmg: number,
    radius: number,
  ): void {
    ctx.fireEnemyProjectile(
      boss.x + Math.cos(angle) * boss.radius,
      boss.y + Math.sin(angle) * boss.radius,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      dmg,
      this.def.hue,
      radius,
      this.def.bulletStyle,
    );
  }
}
