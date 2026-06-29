import type { Enemy } from "../entities/Enemy";
import type { BossDef } from "../data/bossDefs";
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
  /** Fire a hostile projectile. */
  fireEnemyProjectile(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    hue: number,
    radius: number,
  ): void;
  /** Summon a normal enemy add at a world position. */
  spawnAdd(typeId: string, x: number, y: number): void;
}

type AttackKind = "aimed" | "radial" | "spiral";

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

  private chooseAttack(): QueuedAttack {
    const speed = this.projectileSpeed();
    // Each phase cycles a themed rotation of attacks.
    const cycles: AttackKind[][] = [
      ["aimed", "radial"],
      ["aimed", "radial", "spiral"],
      ["radial", "spiral", "aimed"],
    ];
    const cycle = cycles[this.phase];
    const kind = cycle[this.cycleStep % cycle.length];
    this.cycleStep++;
    const count =
      kind === "aimed"
        ? 5 + this.phase * 2
        : kind === "radial"
          ? 12 + this.phase * 4
          : 3 + this.phase;
    return { kind, count, speed };
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
    );
  }
}
