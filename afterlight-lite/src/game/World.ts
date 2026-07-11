import type { AttachmentSlot, BossDef, BossPhase, EnemyDef } from "./types";
import { getShipDef } from "./data/shipDefs";
import { ENEMY_DEFS } from "./data/enemyDefs";
import { ELITE_DEFS } from "./data/eliteDefs";
import { BOSS_DEFS } from "./data/bossDefs";
import { getUpgradeDef } from "./data/upgradeDefs";
import { computePlayerStats, type AggregatedStats } from "./systems/StatEngine";
import { updateEnemyBehavior, explodeEnemy, type BehaviorContext } from "./systems/EnemyAI";
import { updateWeapons } from "./systems/WeaponSystem";
import { resolveCombat } from "./systems/CombatSystem";
import { updateSpawnDirector, type SpawnState } from "./systems/SpawnDirector";
import { SpatialHashGrid } from "../core/SpatialHashGrid";
import { Rng } from "../core/math/Rng";
import { EventBus } from "../core/EventBus";
import type { GameEvents } from "./events";
import {
  allocId,
  createEnemy,
  type Enemy,
  type Particle,
  type Pickup,
  type Player,
  type Projectile,
  type VisualEffect,
} from "./entities";

export const SPAWN_RADIUS = 850;
const DESPAWN_RADIUS = 1500;
/** Distance-equivalent preference per second of neglect in target scoring —
 * see `findPriorityTarget`. */
export const NEGLECT_TARGET_WEIGHT = 220;
/** Distance-equivalent preference (scaled by missing-hp fraction) for
 * finishing off an already-damaged enemy — see `targetScore`. Without this,
 * neglect resets to 0 on every hit, so a nearly-dead enemy scores no better
 * than a full-health one and the weapon wanders off to a "more neglected"
 * fresh target instead of landing the kill it already started. */
export const LOW_HP_TARGET_BONUS = 320;

export function targetScore(x: number, y: number, enemy: Enemy): number {
  const dist = Math.hypot(enemy.x - x, enemy.y - y);
  const missingHpFrac = 1 - enemy.hp / enemy.maxHp;
  return enemy.neglectTimer * NEGLECT_TARGET_WEIGHT - dist + missingHpFrac * LOW_HP_TARGET_BONUS;
}

export class World {
  player: Player;
  shipId: string;
  stats!: AggregatedStats;
  attachmentLevels: Record<AttachmentSlot, number>;

  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  pickups: Pickup[] = [];
  particles: Particle[] = [];
  effects: VisualEffect[] = [];

  grid = new SpatialHashGrid<Enemy>(140);
  rng: Rng;
  events = new EventBus<GameEvents>();

  spawn: SpawnState;
  bossActive: Enemy | null = null;
  miniBossActive: Enemy | null = null;

  gameOver = false;
  pendingLevelUp = false;
  motesRetainedFromLastRun = 0;
  killCount = 0;

  constructor(shipId: string, attachmentLevels: Record<AttachmentSlot, number>, seed?: number) {
    this.shipId = shipId;
    this.attachmentLevels = attachmentLevels;
    this.rng = new Rng(seed);

    const ship = getShipDef(shipId);
    this.player = {
      x: 0,
      y: 0,
      angle: -Math.PI / 2,
      hp: ship.baseHp,
      maxHp: ship.baseHp,
      level: 1,
      xp: 0,
      xpToNext: xpForLevel(1),
      motesThisRun: 0,
      shipId,
      weapons: [{ upgradeId: ship.weaponId, stackCount: 1, cooldown: 0 }],
      passiveStacks: {},
      shieldCharges: 0,
      shieldMax: 0,
      shieldRegenTimer: 0,
      regenAccum: 0,
      invulnTimer: 0,
      hitFlash: 0,
      meleeSweepTimer: 0,
    };
    this.spawn = { wave: 0, waveTimer: 0, elapsed: 0, cycleIndex: 0, gruntTrickleTimer: 0, gruntBudgetRemaining: 0 };
    this.recomputeStats();
    this.player.hp = this.stats.maxHp;
    this.player.shieldCharges = this.stats.shieldMax;
  }

  get ship() {
    return getShipDef(this.shipId);
  }

  recomputeStats(): void {
    const weaponStacks: Record<string, number> = {};
    for (const w of this.player.weapons) weaponStacks[w.upgradeId] = w.stackCount;
    const prevMax = this.stats?.maxHp ?? 0;
    this.stats = computePlayerStats(this.ship, this.player.passiveStacks, weaponStacks, this.attachmentLevels);
    if (prevMax > 0) {
      const delta = this.stats.maxHp - prevMax;
      if (delta > 0) this.player.hp = Math.min(this.stats.maxHp, this.player.hp + delta);
    }
    this.player.hp = Math.min(this.player.hp, this.stats.maxHp);
    this.player.shieldMax = this.stats.shieldMax;
    this.player.shieldCharges = Math.min(this.player.shieldCharges, this.stats.shieldMax);
  }

  update(dt: number, moveX: number, moveY: number): void {
    if (this.gameOver || this.pendingLevelUp) return;

    this.updatePlayerMovement(dt, moveX, moveY);
    updateSpawnDirector(dt, this);
    this.updateEnemies(dt);
    updateWeapons(dt, this);
    this.updateProjectiles(dt);
    resolveCombat(this);
    this.updatePickups(dt);
    this.updatePlayerRegenAndShield(dt);
    this.updateEffects(dt);
    this.cleanupDead();

    if (this.player.hp <= 0 && !this.gameOver) this.triggerGameOver();
  }

  private updatePlayerMovement(dt: number, moveX: number, moveY: number): void {
    const speed = this.stats.moveSpeed;
    this.player.x += moveX * speed * dt;
    this.player.y += moveY * speed * dt;
    if (moveX !== 0 || moveY !== 0) {
      this.player.angle = Math.atan2(moveY, moveX);
    }
    if (this.player.hitFlash > 0) this.player.hitFlash = Math.max(0, this.player.hitFlash - dt);
  }

  private behaviorContext(): BehaviorContext {
    return {
      playerX: this.player.x,
      playerY: this.player.y,
      rng: this.rng,
      spawnEnemyProjectile: (x, y, angle, speed, damage, radius) => {
        this.projectiles.push({
          id: allocId(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          damage,
          pierceRemaining: 0,
          radius,
          friendly: false,
          life: 5,
          homing: 0,
          color: "#ff6b6b",
          dead: false,
        });
      },
      spawnEnemyAt: (defId, x, y) => this.spawnMinionByDefId(defId, x, y),
      damagePlayerIfInRange: (x, y, radius, damage) => {
        const dist = Math.hypot(this.player.x - x, this.player.y - y);
        if (dist <= radius) this.dealDamageToPlayer(damage);
      },
      killEnemy: (enemy) => this.killEnemy(enemy),
    };
  }

  private updateEnemies(dt: number): void {
    const ctx = this.behaviorContext();
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      if (enemy.isBoss) this.updateBossPhase(enemy);
      updateEnemyBehavior(enemy, dt, ctx);
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.hitFlash > 0) enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.neglectTimer += dt;
    }

    this.grid.clear();
    for (const enemy of this.enemies) this.grid.insert(enemy);
  }

  private updateBossPhase(enemy: Enemy): void {
    if (!enemy.phases || enemy.phases.length === 0) return;
    const hpFrac = enemy.hp / enemy.maxHp;
    let target = enemy.currentPhaseIndex;
    for (let i = 0; i < enemy.phases.length; i++) {
      if (hpFrac <= enemy.phases[i].hpThreshold) target = i;
    }
    if (target !== enemy.currentPhaseIndex) {
      const phase: BossPhase = enemy.phases[target];
      enemy.currentPhaseIndex = target;
      enemy.behavior = phase.behavior;
      enemy.behaviorParams = phase.behaviorParams;
      enemy.stateTimer = 0;
      enemy.telegraphTimer = 0;
      enemy.behaviorActive = false;
    }
  }

  private updateProjectiles(dt: number): void {
    for (const proj of this.projectiles) {
      if (proj.dead) continue;
      if (proj.isMine) {
        if (proj.armTimer !== undefined && proj.armTimer > 0) proj.armTimer -= dt;
        proj.life -= dt;
        if (proj.life <= 0) proj.dead = true;
        continue;
      }
      if (proj.homing > 0 && proj.friendly) {
        const target =
          proj.homingTargetId !== undefined
            ? (this.enemies.find((e) => e.id === proj.homingTargetId && !e.dead) ?? null)
            : null;
        if (target) {
          const desiredAngle = Math.atan2(target.y - proj.y, target.x - proj.x);
          const curAngle = Math.atan2(proj.vy, proj.vx);
          const speed = Math.hypot(proj.vx, proj.vy);
          const diff = normalizeAngle(desiredAngle - curAngle);
          const turn = Math.sign(diff) * Math.min(Math.abs(diff), proj.homing * 6 * dt);
          const newAngle = curAngle + turn;
          proj.vx = Math.cos(newAngle) * speed;
          proj.vy = Math.sin(newAngle) * speed;
        }
      }
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.life -= dt;
      if (proj.life <= 0) proj.dead = true;
    }
  }

  private updatePickups(dt: number): void {
    const magnetR = this.stats.magnetRadius;
    for (const pickup of this.pickups) {
      if (pickup.dead) continue;
      const dx = this.player.x - pickup.x;
      const dy = this.player.y - pickup.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist <= magnetR) pickup.magnetized = true;
      if (pickup.magnetized) {
        const pullSpeed = 380 + (magnetR - dist);
        pickup.vx = (dx / dist) * pullSpeed;
        pickup.vy = (dy / dist) * pullSpeed;
      }
      pickup.x += pickup.vx * dt;
      pickup.y += pickup.vy * dt;
    }
  }

  private updatePlayerRegenAndShield(dt: number): void {
    const p = this.player;
    if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);

    if (this.stats.regenPerSec > 0 && p.hp < this.stats.maxHp) {
      p.regenAccum += this.stats.regenPerSec * dt;
      const whole = Math.floor(p.regenAccum);
      if (whole > 0) {
        p.hp = Math.min(this.stats.maxHp, p.hp + whole);
        p.regenAccum -= whole;
      }
    }

    if (p.shieldCharges < this.stats.shieldMax) {
      p.shieldRegenTimer += dt;
      if (p.shieldRegenTimer >= this.stats.shieldRegenTime) {
        p.shieldRegenTimer = 0;
        p.shieldCharges = Math.min(this.stats.shieldMax, p.shieldCharges + 1);
      }
    } else {
      p.shieldRegenTimer = 0;
    }
  }

  private updateEffects(dt: number): void {
    for (const fx of this.effects) fx.life -= dt;
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      if (particle.life <= 0) particle.dead = true;
    }
  }

  private cleanupDead(): void {
    if (this.enemies.length > 0) {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (e.tier !== "boss") {
          const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
          if (dist > DESPAWN_RADIUS) e.dead = true;
        }
      }
      this.enemies = this.enemies.filter((e) => !e.dead);
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
    this.pickups = this.pickups.filter((p) => !p.dead);
    this.particles = this.particles.filter((p) => !p.dead);
    this.effects = this.effects.filter((e) => e.life > 0);
  }

  // ----------------------------------------------------------------- spawns

  spawnGruntWave(count: number, hpMult: number, dmgMult: number, speedMult: number): void {
    for (let i = 0; i < count; i++) {
      const def = this.rng.pick(ENEMY_DEFS);
      const { x, y } = this.randomSpawnPoint();
      this.enemies.push(
        createEnemy({
          defId: def.id,
          name: def.name,
          x,
          y,
          hp: def.hp * hpMult,
          contactDamage: def.contactDamage * dmgMult,
          moveSpeed: def.moveSpeed * speedMult,
          radius: def.radius,
          tier: "grunt",
          behavior: def.behavior,
          behaviorParams: def.behaviorParams,
          shape: def.shape,
          xpValue: def.xpValue,
        }),
      );
    }
  }

  spawnEliteAt(def: EnemyDef, hpMult: number, dmgMult: number, isMiniBoss: boolean): Enemy {
    const { x, y } = this.randomSpawnPoint();
    const enemy = createEnemy({
      defId: def.id,
      name: isMiniBoss ? `${def.name} (Mini-Boss)` : def.name,
      x,
      y,
      hp: def.hp * hpMult,
      contactDamage: def.contactDamage * dmgMult,
      moveSpeed: def.moveSpeed,
      radius: def.radius * (isMiniBoss ? 1.25 : 1),
      tier: isMiniBoss ? "miniboss" : "elite",
      behavior: def.behavior,
      behaviorParams: def.behaviorParams,
      shape: def.shape,
      xpValue: isMiniBoss ? def.xpValue * 4 : def.xpValue,
    });
    this.enemies.push(enemy);
    if (isMiniBoss) this.miniBossActive = enemy;
    return enemy;
  }

  spawnBoss(def: BossDef, hpMult: number, dmgMult: number): Enemy {
    const { x, y } = this.randomSpawnPoint(true);
    const enemy = createEnemy({
      defId: def.id,
      name: def.name,
      x,
      y,
      hp: def.hp * hpMult,
      contactDamage: def.contactDamage * dmgMult,
      moveSpeed: def.moveSpeed,
      radius: def.radius,
      tier: "boss",
      behavior: def.phases[0].behavior,
      behaviorParams: def.phases[0].behaviorParams,
      shape: def.shape,
      xpValue: def.xpValue,
      isBoss: true,
      phases: def.phases,
    });
    this.enemies.push(enemy);
    this.bossActive = enemy;
    this.events.emit("bossSpawned", { name: def.name });
    return enemy;
  }

  private spawnMinionByDefId(defId: string, x: number, y: number): void {
    const def = ENEMY_DEFS.find((e) => e.id === defId) ?? ELITE_DEFS.find((e) => e.id === defId);
    if (!def) return;
    this.enemies.push(
      createEnemy({
        defId: def.id,
        name: def.name,
        x,
        y,
        hp: def.hp,
        contactDamage: def.contactDamage,
        moveSpeed: def.moveSpeed,
        radius: def.radius,
        tier: def.tier === "elite" ? "elite" : "grunt",
        behavior: def.behavior,
        behaviorParams: def.behaviorParams,
        shape: def.shape,
        xpValue: def.xpValue,
      }),
    );
  }

  /** Dev/test helper (see main.ts `#dev`): force-spawns any grunt/elite/boss
   * by id near the player, regardless of wave. Not used by normal gameplay. */
  debugSpawnByDefId(defId: string): void {
    const grunt = ENEMY_DEFS.find((e) => e.id === defId);
    if (grunt) {
      this.spawnMinionByDefId(defId, this.player.x + 150, this.player.y);
      return;
    }
    const elite = ELITE_DEFS.find((e) => e.id === defId);
    if (elite) {
      const enemy = this.spawnEliteAt(elite, 1, 1, false);
      enemy.x = this.player.x + 250;
      enemy.y = this.player.y;
      return;
    }
    const boss = BOSS_DEFS.find((b) => b.id === defId);
    if (boss) {
      const enemy = this.spawnBoss(boss, 1, 1);
      enemy.x = this.player.x + 350;
      enemy.y = this.player.y;
      return;
    }
  }

  private randomSpawnPoint(closer = false): { x: number; y: number } {
    const angle = this.rng.angle();
    const r = closer ? SPAWN_RADIUS * 0.7 : SPAWN_RADIUS;
    return { x: this.player.x + Math.cos(angle) * r, y: this.player.y + Math.sin(angle) * r };
  }

  // ------------------------------------------------------------- queries

  findNearestEnemy(x: number, y: number, maxRadius: number): Enemy | null {
    return this.grid.findNearest(x, y, maxRadius);
  }

  /** Like `findNearestEnemy`, but biases toward enemies that have gone
   * longest without taking damage (so an enemy that holds its distance can't
   * lose the "nearest" comparison to every fresh spawn indefinitely) and
   * toward already-damaged enemies (so the weapon finishes a kill it
   * started instead of wandering to a fresher target). See `targetScore`. */
  findPriorityTarget(x: number, y: number, maxRadius: number): Enemy | null {
    const candidates = this.grid.query(x, y, maxRadius).filter((e) => e.active && Math.hypot(e.x - x, e.y - y) <= maxRadius);
    let best: Enemy | null = null;
    let bestScore = -Infinity;
    for (const e of candidates) {
      const score = targetScore(x, y, e);
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }
    return best;
  }

  findNearestEnemies(x: number, y: number, maxRadius: number, count: number): Enemy[] {
    const candidates = this.grid.query(x, y, maxRadius).filter((e) => e.active);
    candidates.sort((a, b) => distSq(a, x, y) - distSq(b, x, y));
    return candidates.slice(0, count);
  }

  /** Like `findNearestEnemies`, but ranked by the same neglect-biased score
   * as `findPriorityTarget` so multi-target weapons don't systematically
   * skip enemies that hold their distance. */
  findPriorityTargets(x: number, y: number, maxRadius: number, count: number): Enemy[] {
    const candidates = this.grid.query(x, y, maxRadius).filter((e) => e.active && Math.hypot(e.x - x, e.y - y) <= maxRadius);
    candidates.sort((a, b) => targetScore(x, y, b) - targetScore(x, y, a));
    return candidates.slice(0, count);
  }

  enemiesWithinRadius(x: number, y: number, radius: number): Enemy[] {
    return this.grid.query(x, y, radius).filter((e) => e.active && Math.hypot(e.x - x, e.y - y) <= radius);
  }

  // ------------------------------------------------------------- damage

  dealDamageToEnemy(enemy: Enemy, baseDamage: number): void {
    if (enemy.dead) return;
    const crit = this.rng.chance(this.stats.critChance);
    const dmg = crit ? baseDamage * this.stats.critDamageMult : baseDamage;
    enemy.hp -= dmg;
    enemy.hitFlash = 0.15;
    enemy.neglectTimer = 0;
    this.effects.push({ kind: "hit", x: enemy.x, y: enemy.y, life: 0.2, maxLife: 0.2, color: crit ? "#ffffff" : enemy.shape.colorSecondary, crit });
    if (this.stats.lifestealPct > 0) this.healPlayer(dmg * this.stats.lifestealPct);
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  private killEnemy(enemy: Enemy): void {
    if (enemy.dead) return;
    if (enemy.behavior === "kamikaze") explodeEnemy(enemy, this.behaviorContext());
    enemy.dead = true;
    enemy.active = false;
    this.killCount += 1;
    this.spawnPickup(enemy.x, enemy.y, enemy.xpValue);
    if (enemy.isBoss) {
      this.bossActive = null;
      this.events.emit("bossDefeated", { name: enemy.name, wave: this.spawn.wave });
    }
    if (enemy.tier === "miniboss") this.miniBossActive = null;
  }

  spawnPickup(x: number, y: number, value: number): void {
    this.pickups.push({ id: allocId(), x, y, vx: 0, vy: 0, value, radius: 8, dead: false, magnetized: false });
  }

  dealDamageToPlayer(amount: number): void {
    if (this.gameOver || this.player.invulnTimer > 0) return;
    if (this.player.shieldCharges > 0) {
      this.player.shieldCharges -= 1;
      this.player.shieldRegenTimer = 0;
      this.player.invulnTimer = 0.4;
      this.player.hitFlash = 0.15;
      return;
    }
    const reduced = Math.max(1, amount - this.stats.armorFlat);
    this.player.hp -= reduced;
    this.player.hitFlash = 0.15;
    this.player.invulnTimer = 0.65;
  }

  healPlayer(amount: number): void {
    this.player.hp = Math.min(this.stats.maxHp, this.player.hp + amount);
  }

  collectPickup(pickup: Pickup): void {
    pickup.dead = true;
    const xp = pickup.value * this.stats.xpGainMult;
    this.player.xp += xp;
    this.player.motesThisRun += pickup.value;
    while (this.player.xp >= this.player.xpToNext) {
      this.player.xp -= this.player.xpToNext;
      this.player.level += 1;
      this.player.xpToNext = xpForLevel(this.player.level);
      this.events.emit("levelUp", { level: this.player.level });
    }
  }

  addWeaponStack(upgradeId: string): void {
    const existing = this.player.weapons.find((w) => w.upgradeId === upgradeId);
    if (existing) {
      existing.stackCount = Math.min(5, existing.stackCount + 1);
    } else {
      this.player.weapons.push({ upgradeId, stackCount: 1, cooldown: 0 });
    }
    this.recomputeStats();
  }

  addPassiveStack(upgradeId: string): void {
    this.player.passiveStacks[upgradeId] = Math.min(5, (this.player.passiveStacks[upgradeId] ?? 0) + 1);
    this.recomputeStats();
  }

  pickUpgrade(upgradeId: string): void {
    const def = getUpgradeDef(upgradeId);
    if (def.category === "weapon") this.addWeaponStack(upgradeId);
    else this.addPassiveStack(upgradeId);
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    this.motesRetainedFromLastRun = Math.floor(this.player.motesThisRun * this.stats.motesRetainedPct);
    this.events.emit("gameOver", {
      wave: this.spawn.wave,
      level: this.player.level,
      motesCollected: this.player.motesThisRun,
      motesRetained: this.motesRetainedFromLastRun,
    });
  }
}

function distSq(a: { x: number; y: number }, x: number, y: number): number {
  const dx = a.x - x;
  const dy = a.y - y;
  return dx * dx + dy * dy;
}

function normalizeAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export function xpForLevel(level: number): number {
  return Math.round(12 + level * 9 + level * level * 1.3);
}
