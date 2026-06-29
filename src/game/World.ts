import { Player } from "./entities/Player";
import { Enemy } from "./entities/Enemy";
import { Projectile } from "./entities/Projectile";
import { Pickup } from "./entities/Pickup";
import { Particle } from "./entities/Particle";
import { DamageNumber } from "./entities/DamageNumber";
import { EnemyProjectile } from "./entities/EnemyProjectile";
import { ArcEffect } from "./entities/ArcEffect";
import { ObjectPool } from "../core/ObjectPool";
import { SpatialHashGrid } from "../core/SpatialHashGrid";
import { EventBus } from "../core/EventBus";
import { Rng } from "../core/math/Rng";
import { Loadout } from "./Loadout";
import { SpawnDirector } from "./SpawnDirector";
import { WeaponSystem } from "./systems/WeaponSystem";
import { BossController } from "./systems/BossController";
import { bossForEncounter } from "./data/bossDefs";
import { ENEMY_DEFS } from "./data/enemyDefs";
import { WEAPON_DEFS } from "./data/weaponDefs";
import { Input } from "../engine/Input";
import { clamp, TAU } from "../core/math/MathUtils";

/** First boss appears at this many seconds; bosses recur on this interval. */
const BOSS_INTERVAL = 180;

/** Aggregate, read-only run statistics surfaced to HUD and endgame screen. */
export interface RunStats {
  elapsed: number;
  kills: number;
  eliteKills: number;
  damageDealt: number;
  xpCollected: number;
  level: number;
}

/** Typed gameplay events for audio/UI/feedback decoupling. */
export interface GameEvents {
  enemyKilled: { x: number; y: number; xp: number; elite: boolean };
  playerHit: { damage: number };
  playerDied: Record<string, never>;
  levelUp: { level: number };
  pickup: { kind: string };
  weaponFired: { weaponId: string };
  bombDetonate: { x: number; y: number };
  bossSpawned: { name: string; title: string };
  bossDefeated: { x: number; y: number };
}

/** Position of an orbit-weapon orb, mirrored out for the renderer. */
export interface OrbitOrb {
  x: number;
  y: number;
  radius: number;
  hue: number;
}

const ARENA_RADIUS = 1600; // Soft circular boundary the Warden cannot leave.

/**
 * The authoritative game simulation: owns all entities, advances them each
 * fixed step, resolves combat, spawning, pickups and leveling. Rendering reads
 * from here but never mutates it.
 */
export class World {
  readonly player = new Player();
  readonly loadout = new Loadout();
  readonly events = new EventBus<GameEvents>();
  readonly rng: Rng;

  readonly enemies: Enemy[] = [];
  readonly projectiles: Projectile[] = [];
  readonly enemyProjectiles: EnemyProjectile[] = [];
  readonly pickups: Pickup[] = [];
  readonly particles: Particle[] = [];
  readonly damageNumbers: DamageNumber[] = [];
  readonly arcs: ArcEffect[] = [];

  private readonly enemyPool = new ObjectPool<Enemy>(() => new Enemy(), (e) => e.reset(), 256);
  private readonly projectilePool = new ObjectPool<Projectile>(
    () => new Projectile(),
    (p) => p.reset(),
    256,
  );
  private readonly enemyProjectilePool = new ObjectPool<EnemyProjectile>(
    () => new EnemyProjectile(),
    (p) => p.reset(),
    128,
  );
  private readonly pickupPool = new ObjectPool<Pickup>(() => new Pickup(), (p) => p.reset(), 256);
  private readonly particlePool = new ObjectPool<Particle>(
    () => new Particle(),
    (p) => p.reset(),
    256,
  );
  private readonly damageNumberPool = new ObjectPool<DamageNumber>(
    () => new DamageNumber(),
    (d) => d.reset(),
    128,
  );
  private readonly arcPool = new ObjectPool<ArcEffect>(
    () => new ArcEffect(),
    (a) => a.reset(),
    64,
  );

  readonly enemyGrid = new SpatialHashGrid<Enemy>(96);
  private readonly spawnDirector = new SpawnDirector();
  private readonly weaponSystem = new WeaponSystem();

  readonly stats: RunStats = {
    elapsed: 0,
    kills: 0,
    eliteKills: 0,
    damageDealt: 0,
    xpCollected: 0,
    level: 1,
  };

  /** Pending level-up drafts the Game state machine must resolve (pauses sim). */
  pendingLevelUps = 0;
  /** Set true the moment the Warden dies. */
  isDead = false;

  // Boss state.
  /** The live boss enemy, or null when none is active. */
  boss: Enemy | null = null;
  private bossController: BossController | null = null;
  private nextBossTime = BOSS_INTERVAL;
  private bossEncounter = 0;

  // Rendering mirrors written by the weapon system (read by GameRenderer).
  auraRadius = 0;
  auraHue = 180;
  orbitAngle = 0;
  orbitOrbCount = 0;
  private readonly orbitOrbs: OrbitOrb[] = [];

  constructor(seed?: number) {
    this.rng = new Rng(seed);
    for (let i = 0; i < 8; i++) this.orbitOrbs.push({ x: 0, y: 0, radius: 0, hue: 50 });
  }

  get arenaRadius(): number {
    return ARENA_RADIUS;
  }

  getOrbitOrbs(): readonly OrbitOrb[] {
    return this.orbitOrbs;
  }

  setOrbitOrb(i: number, x: number, y: number, radius: number, hue: number): void {
    const o = this.orbitOrbs[i];
    if (!o) return;
    o.x = x;
    o.y = y;
    o.radius = radius;
    o.hue = hue;
  }

  reset(): void {
    // Return all live entities to their pools.
    for (const e of this.enemies) this.enemyPool.release(e);
    for (const p of this.projectiles) this.projectilePool.release(p);
    for (const p of this.enemyProjectiles) this.enemyProjectilePool.release(p);
    for (const p of this.pickups) this.pickupPool.release(p);
    for (const p of this.particles) this.particlePool.release(p);
    for (const d of this.damageNumbers) this.damageNumberPool.release(d);
    for (const a of this.arcs) this.arcPool.release(a);
    this.enemies.length = 0;
    this.projectiles.length = 0;
    this.enemyProjectiles.length = 0;
    this.pickups.length = 0;
    this.particles.length = 0;
    this.damageNumbers.length = 0;
    this.arcs.length = 0;

    this.player.reset();
    this.loadout.reset();
    this.loadout.recomputeStats(this.player);
    this.player.hp = this.player.stats.maxHp;
    this.spawnDirector.reset();

    this.stats.elapsed = 0;
    this.stats.kills = 0;
    this.stats.eliteKills = 0;
    this.stats.damageDealt = 0;
    this.stats.xpCollected = 0;
    this.stats.level = 1;
    this.pendingLevelUps = 0;
    this.isDead = false;
    this.auraRadius = 0;
    this.orbitOrbCount = 0;
    this.orbitAngle = 0;
    this.boss = null;
    this.bossController = null;
    this.nextBossTime = BOSS_INTERVAL;
    this.bossEncounter = 0;
  }

  obtainProjectile(): Projectile {
    const p = this.projectilePool.obtain();
    this.projectiles.push(p);
    return p;
  }

  /** Spawn a chain-lightning visual segment between two points. */
  spawnArc(x1: number, y1: number, x2: number, y2: number, hue: number): void {
    const a = this.arcPool.obtain();
    a.x1 = x1;
    a.y1 = y1;
    a.x2 = x2;
    a.y2 = y2;
    a.life = 0;
    a.maxLife = 0.16;
    a.hue = hue;
    a.active = true;
    this.arcs.push(a);
  }

  /**
   * Dev/testing affordance: make the next step spawn a boss immediately.
   * Exposed through the optional debug console hook (see main.ts).
   */
  debugTriggerBoss(): void {
    if (!this.bossActive) this.nextBossTime = this.stats.elapsed;
  }

  /** Dev/testing affordance: replace the first weapon slot with a given id. */
  debugGiveWeapon(id: string): void {
    const def = WEAPON_DEFS[id];
    if (!def || this.loadout.weapons.length === 0) return;
    this.loadout.weapons[0].def = def;
    this.loadout.weapons[0].level = 1;
    this.loadout.weapons[0].cooldownRemaining = 0;
    this.loadout.recomputeStats(this.player);
  }

  /** Spawn a hostile projectile (used by ranged enemies and bosses). */
  fireEnemyProjectile(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    hue: number,
    radius: number,
  ): void {
    const p = this.enemyProjectilePool.obtain();
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.damage = damage;
    p.hue = hue;
    p.radius = radius;
    p.life = 5;
    p.active = true;
    this.enemyProjectiles.push(p);
  }

  /** True while a boss is alive (read by HUD and spawn pacing). */
  get bossActive(): boolean {
    return this.boss !== null && this.boss.active;
  }

  /** Boss telegraph progress 0..1 for the renderer, or 0 when not winding up. */
  get bossTelegraph(): number {
    return this.bossController?.telegraphProgress ?? 0;
  }

  get bossHpFraction(): number {
    return this.boss ? Math.max(0, this.boss.hp / this.boss.maxHp) : 0;
  }

  // ---- Main fixed-step update -------------------------------------------

  step(dt: number, input: Input): void {
    if (this.isDead) return;
    this.stats.elapsed += dt;

    this.updatePlayer(dt, input);
    this.rebuildGrid();
    this.spawnEnemies(dt);
    this.updateBoss(dt);
    this.weaponSystem.update(this, dt);
    this.updateProjectiles(dt);
    this.updateEnemies(dt);
    this.updateEnemyProjectiles(dt);
    this.updatePickups(dt);
  }

  // ---- Boss lifecycle ----------------------------------------------------

  private updateBoss(dt: number): void {
    // Schedule a new boss when its time arrives and none is active.
    if (!this.bossActive && this.stats.elapsed >= this.nextBossTime) {
      this.spawnBoss();
      this.nextBossTime += BOSS_INTERVAL;
    }
    if (this.boss && this.bossController) {
      if (!this.boss.active) {
        // Boss was killed elsewhere this step; clear refs.
        this.boss = null;
        this.bossController = null;
        return;
      }
      this.bossController.update(this.boss, this.bossContext(), dt);
    }
  }

  private bossContext() {
    return {
      player: this.player,
      elapsedMinutes: this.stats.elapsed / 60,
      rng: this.rng,
      fireEnemyProjectile: (
        x: number,
        y: number,
        vx: number,
        vy: number,
        damage: number,
        hue: number,
        radius: number,
      ) => this.fireEnemyProjectile(x, y, vx, vy, damage, hue, radius),
      spawnAdd: (typeId: string, x: number, y: number) => this.spawnAdd(typeId, x, y),
    };
  }

  private spawnBoss(): void {
    const def = bossForEncounter(this.bossEncounter);
    const minutes = this.stats.elapsed / 60;
    const e = this.enemyPool.obtain();
    const angle = this.rng.angle();
    const dist = 520;
    e.x = clamp(this.player.x + Math.cos(angle) * dist, -ARENA_RADIUS, ARENA_RADIUS);
    e.y = clamp(this.player.y + Math.sin(angle) * dist, -ARENA_RADIUS, ARENA_RADIUS);
    e.vx = 0;
    e.vy = 0;
    e.typeId = def.id;
    e.behaviour = "chase";
    e.radius = def.radius;
    e.speed = def.speed;
    e.hue = def.hue;
    e.isElite = false;
    e.isBoss = true;
    e.animPhase = 0;
    // HP scales with encounter index and a touch with time.
    const encounterScale = 1 + this.bossEncounter * 0.85;
    e.maxHp = def.baseHp * encounterScale * (1 + minutes * 0.04);
    e.hp = e.maxHp;
    e.damage = def.contactDamage * (1 + minutes * 0.08);
    e.xpValue = 60 + this.bossEncounter * 30;
    e.knockX = 0;
    e.knockY = 0;
    e.active = true;
    this.enemies.push(e);
    this.boss = e;
    this.bossController = new BossController(def);
    this.bossEncounter++;
    this.events.emit("bossSpawned", { name: def.name, title: def.title });
  }

  /** Spawn a normal enemy add at a position (used by boss summons). */
  private spawnAdd(typeId: string, x: number, y: number): void {
    const def = ENEMY_DEFS[typeId] ?? ENEMY_DEFS.husk;
    const minutes = this.stats.elapsed / 60;
    const e = this.enemyPool.obtain();
    e.x = clamp(x, -ARENA_RADIUS, ARENA_RADIUS);
    e.y = clamp(y, -ARENA_RADIUS, ARENA_RADIUS);
    e.vx = 0;
    e.vy = 0;
    e.typeId = def.id;
    e.behaviour = def.behaviour;
    e.radius = def.radius;
    e.speed = def.speed;
    e.hue = def.hue;
    e.xpValue = def.xpValue;
    e.animPhase = this.rng.range(0, TAU);
    e.isElite = false;
    e.isBoss = false;
    e.maxHp = def.hp * this.spawnDirector.hpScale(minutes);
    e.hp = e.maxHp;
    e.damage = def.damage * this.spawnDirector.damageScale(minutes);
    e.active = true;
    this.enemies.push(e);
  }

  private updatePlayer(dt: number, input: Input): void {
    const p = this.player;
    const s = p.stats;
    p.invuln = Math.max(0, p.invuln - dt);
    p.hitFlash = Math.max(0, p.hitFlash - dt);

    p.x += input.moveX * s.moveSpeed * dt;
    p.y += input.moveY * s.moveSpeed * dt;
    if (input.moveX !== 0 || input.moveY !== 0) {
      p.facing = Math.atan2(input.moveY, input.moveX);
    }

    // Keep inside the circular arena.
    const distSq = p.x * p.x + p.y * p.y;
    const limit = ARENA_RADIUS - p.radius;
    if (distSq > limit * limit) {
      const d = Math.sqrt(distSq) || 1;
      p.x = (p.x / d) * limit;
      p.y = (p.y / d) * limit;
    }

    // Regen.
    if (s.regen > 0 && p.hp < s.maxHp) {
      p.hp = Math.min(s.maxHp, p.hp + s.regen * dt);
    }
  }

  private rebuildGrid(): void {
    this.enemyGrid.clear();
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemyGrid.insert(this.enemies[i]);
    }
  }

  private spawnEnemies(dt: number): void {
    const requests = this.spawnDirector.update(
      dt,
      this.stats.elapsed,
      this.enemies.length,
      this.rng,
    );
    if (requests.length === 0) return;
    const minutes = this.stats.elapsed / 60;
    const hpScale = this.spawnDirector.hpScale(minutes);
    const dmgScale = this.spawnDirector.damageScale(minutes);

    for (const req of requests) {
      const e = this.enemyPool.obtain();
      const def = req.def;
      // Spawn just outside the camera-visible ring around the player.
      const angle = this.rng.angle();
      const dist = 560 + this.rng.range(0, 120);
      e.x = clamp(this.player.x + Math.cos(angle) * dist, -ARENA_RADIUS, ARENA_RADIUS);
      e.y = clamp(this.player.y + Math.sin(angle) * dist, -ARENA_RADIUS, ARENA_RADIUS);
      e.vx = 0;
      e.vy = 0;
      e.typeId = def.id;
      e.behaviour = def.behaviour;
      e.radius = def.radius;
      e.speed = def.speed;
      e.hue = def.hue;
      e.xpValue = def.xpValue;
      e.animPhase = this.rng.range(0, TAU);
      e.isElite = req.elite;
      e.isBoss = false;
      const eliteHp = req.elite ? 6 : 1;
      const eliteDmg = req.elite ? 1.8 : 1;
      const eliteSize = req.elite ? 1.7 : 1;
      e.maxHp = def.hp * hpScale * eliteHp;
      e.hp = e.maxHp;
      e.damage = def.damage * dmgScale * eliteDmg;
      e.radius = def.radius * eliteSize;
      e.xpValue = def.xpValue * (req.elite ? 8 : 1);
      e.active = true;
      this.enemies.push(e);
    }
  }

  private updateProjectiles(dt: number): void {
    const arr = this.projectiles;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;

      let expired = p.life <= 0;
      if (!expired) {
        // Collision against nearby enemies.
        const near = this.enemyGrid.query(p.x, p.y, p.radius + 24);
        for (let j = 0; j < near.length; j++) {
          const e = near[j];
          if (!e.active) continue;
          const rr = p.radius + e.radius;
          const dx = e.x - p.x;
          const dy = e.y - p.y;
          if (dx * dx + dy * dy > rr * rr) continue;
          const inv = 1 / (Math.hypot(dx, dy) || 1);
          this.damageEnemy(e, p.damage, p.crit, dx * inv * p.knockback, dy * inv * p.knockback);
          p.pierce--;
          if (p.pierce <= 0) {
            expired = true;
            break;
          }
        }
      }

      if (expired) {
        this.projectilePool.release(p);
        arr[i] = arr[arr.length - 1];
        arr.pop();
      }
    }
  }

  private updateEnemies(dt: number): void {
    const arr = this.enemies;
    const px = this.player.x;
    const py = this.player.y;
    for (let i = arr.length - 1; i >= 0; i--) {
      const e = arr[i];
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.contactCooldown = Math.max(0, e.contactCooldown - dt);

      const dx = px - e.x;
      const dy = py - e.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;

      // The boss steers itself via BossController; everything else uses AI here.
      // The boss is also immune to knockback (it's a fixed point of dread).
      if (!e.isBoss) {
        this.steerEnemy(e, nx, ny, dist, dt);
        e.x += e.knockX * dt;
        e.y += e.knockY * dt;
        e.knockX *= 0.86;
        e.knockY *= 0.86;
      }

      // Contact damage to the player.
      const touch = e.radius + this.player.radius;
      if (dist < touch && e.contactCooldown <= 0) {
        this.damagePlayer(e.damage);
        e.contactCooldown = 0.6;
      }
    }
    // Cheap soft separation so enemies don't fully stack into one pixel.
    this.separateEnemies();
  }

  private steerEnemy(e: Enemy, nx: number, ny: number, dist: number, dt: number): void {
    switch (e.behaviour) {
      case "charger": {
        // Periodically winds up then lunges in the player's direction.
        e.stateTimer -= dt;
        if (e.stateTimer <= 0) {
          e.stateTimer = 2.2;
          e.vx = nx * e.speed * 3.2;
          e.vy = ny * e.speed * 3.2;
        }
        e.vx *= 0.93;
        e.vy *= 0.93;
        // Baseline drift toward player between lunges.
        e.x += (nx * e.speed * 0.4 + e.vx) * dt;
        e.y += (ny * e.speed * 0.4 + e.vy) * dt;
        break;
      }
      case "orbiter": {
        // Circles the player while slowly closing in.
        const tangentX = -ny;
        const tangentY = nx;
        const closing = dist > 180 ? 1 : 0.15;
        e.x += (nx * e.speed * closing + tangentX * e.speed * 0.8) * dt;
        e.y += (ny * e.speed * closing + tangentY * e.speed * 0.8) * dt;
        break;
      }
      case "shooter": {
        // Maintains a firing range, strafing, and looses aimed bolts.
        const ideal = 280;
        if (dist < ideal - 40) {
          // Too close: back away while strafing.
          e.x += (-nx * 0.7 - ny * 0.6) * e.speed * dt;
          e.y += (-ny * 0.7 + nx * 0.6) * e.speed * dt;
        } else if (dist > ideal + 60) {
          e.x += nx * e.speed * dt;
          e.y += ny * e.speed * dt;
        } else {
          // In range: strafe sideways.
          e.x += -ny * e.speed * 0.7 * dt;
          e.y += nx * e.speed * 0.7 * dt;
        }
        e.attackCooldown -= dt;
        if (e.attackCooldown <= 0 && dist < 540) {
          e.attackCooldown = 1.9;
          const speed = 175;
          this.fireEnemyProjectile(
            e.x + nx * e.radius,
            e.y + ny * e.radius,
            nx * speed,
            ny * speed,
            e.damage,
            e.hue,
            8,
          );
        }
        break;
      }
      case "chase":
      default: {
        e.x += nx * e.speed * dt;
        e.y += ny * e.speed * dt;
        break;
      }
    }
  }

  private updateEnemyProjectiles(dt: number): void {
    const arr = this.enemyProjectiles;
    const p = this.player;
    for (let i = arr.length - 1; i >= 0; i--) {
      const ep = arr[i];
      ep.life -= dt;
      ep.x += ep.vx * dt;
      ep.y += ep.vy * dt;
      ep.rotation += dt * 6;

      let expired = ep.life <= 0;
      if (!expired) {
        const rr = ep.radius + p.radius;
        const dx = p.x - ep.x;
        const dy = p.y - ep.y;
        if (dx * dx + dy * dy <= rr * rr) {
          this.damagePlayer(ep.damage);
          expired = true;
        }
      }
      if (expired) {
        this.enemyProjectilePool.release(ep);
        arr[i] = arr[arr.length - 1];
        arr.pop();
      }
    }
  }

  /**
   * Lightweight positional separation using the spatial grid. Only nudges a
   * capped number of overlapping neighbours per enemy to stay O(n).
   */
  private separateEnemies(): void {
    const arr = this.enemies;
    for (let i = 0; i < arr.length; i++) {
      const e = arr[i];
      // The boss is immovable — it shoves others but is never shoved.
      if (e.isBoss) continue;
      const near = this.enemyGrid.query(e.x, e.y, e.radius * 2);
      let nudged = 0;
      for (let j = 0; j < near.length && nudged < 6; j++) {
        const o = near[j];
        if (o === e || !o.active) continue;
        const dx = e.x - o.x;
        const dy = e.y - o.y;
        const minDist = e.radius + o.radius;
        const dSq = dx * dx + dy * dy;
        if (dSq > 0 && dSq < minDist * minDist) {
          const d = Math.sqrt(dSq);
          const push = (minDist - d) * 0.5;
          const ix = (dx / d) * push;
          const iy = (dy / d) * push;
          e.x += ix;
          e.y += iy;
          // Don't displace an immovable boss.
          if (!o.isBoss) {
            o.x -= ix;
            o.y -= iy;
          }
          nudged++;
        }
      }
    }
  }

  private updatePickups(dt: number): void {
    const arr = this.pickups;
    const p = this.player;
    const pickR = p.stats.pickupRadius;
    const pickR2 = pickR * pickR;
    for (let i = arr.length - 1; i >= 0; i--) {
      const k = arr[i];
      k.bob += dt * 4;
      const dx = p.x - k.x;
      const dy = p.y - k.y;
      const dSq = dx * dx + dy * dy;

      if (!k.homing && dSq <= pickR2) k.homing = true;

      if (k.homing) {
        const d = Math.sqrt(dSq) || 1;
        const speed = 380;
        k.x += (dx / d) * speed * dt;
        k.y += (dy / d) * speed * dt;
      }

      // Collection.
      const collectR = p.radius + k.radius + 4;
      if (dSq <= collectR * collectR) {
        this.collectPickup(k);
        this.pickupPool.release(k);
        arr[i] = arr[arr.length - 1];
        arr.pop();
      }
    }
  }

  private collectPickup(k: Pickup): void {
    switch (k.kind) {
      case "xp": {
        const gain = k.value * this.player.stats.xpMult;
        this.player.xp += gain;
        this.stats.xpCollected += gain;
        this.checkLevelUp();
        this.events.emit("pickup", { kind: "xp" });
        break;
      }
      case "heal": {
        this.player.hp = Math.min(this.player.stats.maxHp, this.player.hp + k.value);
        this.events.emit("pickup", { kind: "heal" });
        break;
      }
      case "magnet": {
        // Pull every pickup on the field toward the Warden.
        for (const other of this.pickups) other.homing = true;
        this.events.emit("pickup", { kind: "magnet" });
        break;
      }
      case "bomb": {
        this.detonateBomb();
        this.events.emit("pickup", { kind: "bomb" });
        break;
      }
    }
  }

  private detonateBomb(): void {
    const p = this.player;
    this.events.emit("bombDetonate", { x: p.x, y: p.y });
    // Bombs clear the swarm but only dent a boss (no cheap boss one-shots).
    for (const e of [...this.enemies]) {
      if (!e.active) continue;
      if (e.isBoss) this.damageEnemy(e, e.maxHp * 0.12, false, 0, 0);
      else this.damageEnemy(e, 9999, false, 0, 0);
    }
  }

  private checkLevelUp(): void {
    const p = this.player;
    while (p.xp >= p.xpToNext) {
      p.xp -= p.xpToNext;
      p.level++;
      this.stats.level = p.level;
      // XP curve: smooth escalation that keeps level-ups frequent but slowing.
      p.xpToNext = Math.round(5 + p.level * 4 + p.level * p.level * 0.7);
      this.pendingLevelUps++;
      this.events.emit("levelUp", { level: p.level });
    }
  }

  // ---- Combat resolution -------------------------------------------------

  /** Apply damage to an enemy, spawn feedback, and handle death. */
  damageEnemy(e: Enemy, amount: number, crit: boolean, knockX: number, knockY: number): void {
    if (!e.active) return;
    e.hp -= amount;
    e.hitFlash = 0.08;
    e.knockX += knockX;
    e.knockY += knockY;
    this.stats.damageDealt += amount;
    this.spawnDamageNumber(e.x, e.y - e.radius, Math.round(amount), crit);
    if (crit) this.spawnCritSparks(e.x, e.y);
    if (e.hp <= 0) this.killEnemy(e);
  }

  private killEnemy(e: Enemy): void {
    e.active = false;
    this.stats.kills++;
    if (e.isElite) this.stats.eliteKills++;
    this.events.emit("enemyKilled", { x: e.x, y: e.y, xp: e.xpValue, elite: e.isElite });
    this.spawnDeathBurst(e);

    if (e.isBoss) {
      this.onBossDefeated(e);
    } else {
      this.dropLoot(e);
      // Splitters burst into a cluster of smaller enemies on death.
      const def = ENEMY_DEFS[e.typeId];
      if (def?.splitInto && !e.isElite) {
        const count = def.splitCount ?? 2;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * TAU + this.rng.range(-0.4, 0.4);
          const d = e.radius + 6;
          this.spawnAdd(def.splitInto, e.x + Math.cos(a) * d, e.y + Math.sin(a) * d);
        }
      }
    }

    // Remove from the live list (swap-pop) and recycle.
    const arr = this.enemies;
    const idx = arr.indexOf(e);
    if (idx >= 0) {
      arr[idx] = arr[arr.length - 1];
      arr.pop();
    }
    this.enemyPool.release(e);
  }

  /** Boss death: clear refs, big celebratory loot shower, and an event. */
  private onBossDefeated(e: Enemy): void {
    this.boss = null;
    this.bossController = null;
    this.events.emit("bossDefeated", { x: e.x, y: e.y });

    // Generous reward: a fan of XP shards plus guaranteed support drops.
    const shards = 14;
    for (let i = 0; i < shards; i++) {
      const a = (i / shards) * TAU;
      const r = e.radius * 0.6;
      this.dropSpecial(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r, "xp", e.xpValue / shards);
    }
    this.dropSpecial(e.x - 20, e.y, "heal", 45);
    this.dropSpecial(e.x + 20, e.y, "magnet", 0);
  }

  private dropLoot(e: Enemy): void {
    // XP shard (always).
    const gem = this.pickupPool.obtain();
    gem.kind = "xp";
    gem.value = e.xpValue;
    gem.x = e.x;
    gem.y = e.y;
    gem.radius = e.isElite ? 12 : 7;
    gem.active = true;
    gem.bob = this.rng.range(0, TAU);
    this.pickups.push(gem);

    // Occasional support drops, more likely from elites.
    const roll = this.rng.next();
    const healChance = e.isElite ? 0.5 : 0.012;
    const magnetChance = e.isElite ? 0.18 : 0.004;
    const bombChance = e.isElite ? 0.14 : 0.003;
    if (roll < bombChance) this.dropSpecial(e.x, e.y, "bomb");
    else if (roll < bombChance + magnetChance) this.dropSpecial(e.x, e.y, "magnet");
    else if (roll < bombChance + magnetChance + healChance)
      this.dropSpecial(e.x, e.y, "heal", e.isElite ? 30 : 12);
  }

  private dropSpecial(x: number, y: number, kind: Pickup["kind"], value = 0): void {
    const k = this.pickupPool.obtain();
    k.kind = kind;
    k.value = value;
    k.x = x;
    k.y = y;
    k.radius = 12;
    k.active = true;
    k.bob = this.rng.range(0, TAU);
    this.pickups.push(k);
  }

  damagePlayer(amount: number): void {
    const p = this.player;
    if (p.invuln > 0 || this.isDead) return;
    const reduced = amount * (1 - p.stats.armor);
    p.hp -= reduced;
    p.invuln = 0.5;
    p.hitFlash = 0.25;
    this.events.emit("playerHit", { damage: reduced });
    if (p.hp <= 0) {
      p.hp = 0;
      this.isDead = true;
      this.events.emit("playerDied", {});
    }
  }

  // ---- Cosmetic spawners (pooled) ---------------------------------------

  spawnDamageNumber(x: number, y: number, value: number, crit: boolean): void {
    const d = this.damageNumberPool.obtain();
    d.x = x + this.rng.range(-6, 6);
    d.y = y;
    d.vy = -42;
    d.life = 0;
    d.maxLife = crit ? 0.85 : 0.65;
    d.value = value;
    d.crit = crit;
    d.active = true;
    this.damageNumbers.push(d);
  }

  spawnDeathBurst(e: Enemy): void {
    const n = e.isElite ? 18 : 7;
    for (let i = 0; i < n; i++) {
      const pt = this.particlePool.obtain();
      const a = this.rng.angle();
      const sp = this.rng.range(40, e.isElite ? 220 : 140);
      pt.x = e.x;
      pt.y = e.y;
      pt.vx = Math.cos(a) * sp;
      pt.vy = Math.sin(a) * sp;
      pt.life = 0;
      pt.maxLife = this.rng.range(0.3, 0.6);
      pt.size = this.rng.range(2, e.isElite ? 6 : 4);
      pt.hue = e.hue;
      pt.alpha = 1;
      pt.drag = 0.88;
      pt.shape = "spark";
      pt.active = true;
      this.particles.push(pt);
    }
    // A shockwave ring punctuates bigger kills.
    if (e.isElite || e.isBoss) {
      this.spawnRing(e.x, e.y, e.hue, e.radius * 0.8, e.isBoss ? 0.7 : 0.5);
    }
  }

  /** A few small bright sparks at a crit impact. */
  private spawnCritSparks(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const pt = this.particlePool.obtain();
      const a = this.rng.angle();
      const sp = this.rng.range(60, 180);
      pt.x = x;
      pt.y = y;
      pt.vx = Math.cos(a) * sp;
      pt.vy = Math.sin(a) * sp;
      pt.life = 0;
      pt.maxLife = this.rng.range(0.18, 0.34);
      pt.size = this.rng.range(1.5, 3);
      pt.hue = 48; // warm gold, matching crit numbers
      pt.alpha = 1;
      pt.drag = 0.85;
      pt.shape = "spark";
      pt.active = true;
      this.particles.push(pt);
    }
  }

  /** A celebratory golden burst at the Warden — used when a weapon evolves. */
  spawnEvolveBurst(): void {
    const p = this.player;
    this.spawnRing(p.x, p.y, 48, p.radius * 1.1, 0.7);
    this.spawnRing(p.x, p.y, 45, p.radius * 0.7, 0.9);
    for (let i = 0; i < 26; i++) {
      const pt = this.particlePool.obtain();
      const a = this.rng.angle();
      const sp = this.rng.range(80, 280);
      pt.x = p.x;
      pt.y = p.y;
      pt.vx = Math.cos(a) * sp;
      pt.vy = Math.sin(a) * sp;
      pt.life = 0;
      pt.maxLife = this.rng.range(0.4, 0.8);
      pt.size = this.rng.range(2, 4.5);
      pt.hue = this.rng.range(44, 54);
      pt.alpha = 1;
      pt.drag = 0.9;
      pt.shape = "spark";
      pt.active = true;
      this.particles.push(pt);
    }
  }

  /** An expanding shockwave ring. */
  private spawnRing(x: number, y: number, hue: number, size: number, maxLife: number): void {
    const pt = this.particlePool.obtain();
    pt.x = x;
    pt.y = y;
    pt.vx = 0;
    pt.vy = 0;
    pt.life = 0;
    pt.maxLife = maxLife;
    pt.size = size;
    pt.hue = hue;
    pt.alpha = 1;
    pt.drag = 1;
    pt.shape = "ring";
    pt.active = true;
    this.particles.push(pt);
  }

  /** Cosmetic update — runs on real frame time for smoothness. */
  updateCosmetic(frameDt: number): void {
    // Particles.
    const ps = this.particles;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.life += frameDt;
      if (p.life >= p.maxLife) {
        this.particlePool.release(p);
        ps[i] = ps[ps.length - 1];
        ps.pop();
        continue;
      }
      p.x += p.vx * frameDt;
      p.y += p.vy * frameDt;
      const drag = Math.pow(p.drag, frameDt * 60);
      p.vx *= drag;
      p.vy *= drag;
      p.alpha = 1 - p.life / p.maxLife;
    }
    // Damage numbers.
    const ds = this.damageNumbers;
    for (let i = ds.length - 1; i >= 0; i--) {
      const d = ds[i];
      d.life += frameDt;
      if (d.life >= d.maxLife) {
        this.damageNumberPool.release(d);
        ds[i] = ds[ds.length - 1];
        ds.pop();
        continue;
      }
      d.y += d.vy * frameDt;
      d.vy *= Math.pow(0.9, frameDt * 60);
    }
    // Chain-lightning arcs (very short-lived).
    const arcs = this.arcs;
    for (let i = arcs.length - 1; i >= 0; i--) {
      const a = arcs[i];
      a.life += frameDt;
      if (a.life >= a.maxLife) {
        this.arcPool.release(a);
        arcs[i] = arcs[arcs.length - 1];
        arcs.pop();
      }
    }
  }

  // Debug/perf helpers.
  get entityCount(): number {
    return (
      this.enemies.length +
      this.projectiles.length +
      this.enemyProjectiles.length +
      this.pickups.length +
      this.particles.length
    );
  }
}
