import { Player } from "./entities/Player";
import { Enemy } from "./entities/Enemy";
import { Projectile } from "./entities/Projectile";
import { Pickup } from "./entities/Pickup";
import { Particle } from "./entities/Particle";
import { DamageNumber } from "./entities/DamageNumber";
import { EnemyProjectile, type EnemyProjectileStyle } from "./entities/EnemyProjectile";
import { ArcEffect } from "./entities/ArcEffect";
import { Hazard } from "./entities/Hazard";
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
import { getStage, type StageDef, type StagePalette } from "./data/stageDefs";
import {
  getGalaxy,
  galaxyOf,
  sectorOf,
  levelDifficulty,
  levelDamageDifficulty,
  sectorBossMult,
  WAVES_PER_SECTOR,
  WAVE_DURATION,
  WAVE_MIN_TIME,
  waveHpMult,
  waveDamageMult,
  waveRateMult,
  waveBurstCount,
  modifierForLevel,
  type SectorModifier,
} from "./data/campaignDefs";
import { ELITE_AFFIXES, getAffix, SUMMON_INTERVAL } from "./data/affixDefs";
import { WEAPON_DEFS } from "./data/weaponDefs";
import { emptyEquip } from "./data/gearDefs";
import { getWarden, type CommanderSpecial } from "./data/wardenDefs";
import { getChassis } from "./data/chassisDefs";
import { Input } from "../engine/Input";
import { clamp, TAU } from "../core/math/MathUtils";

/** First boss appears at this many seconds; bosses recur on this interval. */
const BOSS_INTERVAL = 180;
/** Boss Rush: first boss delay, and gap after each boss falls (seconds). */
const RUSH_FIRST = 5;
const RUSH_GAP = 4;
/** Endless: seconds between Ascension steps, and the faster boss cadence. */
const ASCENSION_INTERVAL = 45;
const ENDLESS_BOSS_INTERVAL = 90;
/** Stage Gauntlet: the stage order, first boss delay, and gap after advancing. */
const GAUNTLET_ORDER = ["fade", "ember", "deep"] as const;
const GAUNTLET_FIRST = 75;
const GAUNTLET_GAP = 70;

/** Aggregate, read-only run statistics surfaced to HUD and endgame screen. */
export interface RunStats {
  elapsed: number;
  kills: number;
  eliteKills: number;
  bossKills: number;
  damageDealt: number;
  xpCollected: number;
  /** Light Motes physically collected on the field this run (bonus currency). */
  motesCollected: number;
  /** Affixed elite champions felled this run. */
  affixKills: number;
  /** Supply Pods secured this run (timed run-events). */
  podsCollected: number;
  level: number;
  /** Endless mode: highest Ascension tier reached this run (0 otherwise). */
  ascension: number;
  /** Gauntlet mode: stages cleared this run (0 otherwise). */
  stagesCleared: number;
}

/** Typed gameplay events for audio/UI/feedback decoupling. */
export interface GameEvents {
  enemyKilled: { x: number; y: number; xp: number; elite: boolean };
  playerHit: { damage: number };
  playerDied: Record<string, never>;
  levelUp: { level: number };
  pickup: { kind: string };
  podSpawned: { x: number; y: number };
  weaponFired: { weaponId: string };
  bombDetonate: { x: number; y: number };
  bossSpawned: { name: string; title: string; id: string; hue: number };
  bossDefeated: { x: number; y: number; id: string };
  /** Aegis perk fired: the Warden cheated death this run. */
  revived: { x: number; y: number };
  /** Overdrive perk fired: a light pulse damaged nearby foes. */
  pulse: { x: number; y: number; radius: number };
  /** Endless mode stepped up an Ascension tier. */
  ascension: { level: number };
  /** Gauntlet advanced to a new stage (after clearing the previous one's boss). */
  stageAdvance: { stageId: string; name: string; cleared: number };
  /** Campaign Sector cleared (the Sector boss on the final wave was felled). */
  levelCleared: { level: number };
  /** A campaign wave began (wave = 1-based; the final wave is the boss). */
  waveStarted: { wave: number; total: number };
  /** The Commander's activated special power fired. */
  special: { name: string; kind: string };
}

/** Position of an orbit-weapon orb, mirrored out for the renderer. */
export interface OrbitOrb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  /** Per-weapon shape (matches ProjectileStyle), so orbit weapons look distinct. */
  style: string;
  /** Tangent angle of orbit travel (radians) — orients bladed shapes. */
  angle: number;
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

  /** Permanent meta-upgrade levels, supplied by Game from the save profile. */
  metaLevels: Record<string, number> = {};
  /** Owned gear inventory, supplied by Game from the save profile. */
  gearInventory: Record<string, import("./data/gearDefs").ModuleState> = {};
  /** Equipped gear per slot, supplied by Game from the save profile. */
  gearEquipped: import("./data/gearDefs").EquipMap = emptyEquip();
  /** Equipped boss-signature id, supplied by Game from the save profile. */
  signatureId: string | null = null;
  /** Selected Warden id, supplied by Game from the save profile. */
  selectedWarden = "lumen";
  /** Mastery level of the selected Warden, supplied by Game from the save. */
  wardenLevel = 0;
  /** Selected chassis (ship) id, supplied by Game from the save. */
  selectedChassis = "skiff";
  /** Countdown to the next chassis passive tick (magnet/phase/drone). */
  private chassisTimer = 0;
  /** Stage id, supplied by Game; drives the enemy pool and backdrop palette. */
  stageId = "fade";
  /**
   * Boss Rush mode: no fodder spawns — bosses arrive fast and escalate endlessly,
   * each a few seconds after the last falls. A pure gauntlet to flex a build.
   */
  bossRush = false;
  /**
   * Endless / Ascension mode: a normal run whose difficulty ramps every
   * {@link ASCENSION_INTERVAL}s — enemy HP/damage/spawn-rate climb without bound
   * and bosses recur faster. A pure high-score chase ("how high can you climb").
   */
  endless = false;
  /**
   * Stage Gauntlet mode: clear Fade → Ember → Deep back-to-back on a single life
   * (HP/level/loadout carry over). Defeating a stage's boss advances to the next.
   */
  gauntlet = false;
  private gauntletIndex = 0;
  /**
   * Campaign mode: a finite Sector with a clear condition (survive the duration,
   * or defeat the Sector boss). Cleared → the run ends in victory, not death.
   */
  campaign = false;
  /** Global Sector index being played (galaxy*10 + sector), set by Game. */
  campaignLevel = 0;
  /** Set true the instant a Campaign Sector is cleared. */
  levelCleared = false;
  /** The Sector Modifier in force this run (campaign only; null = clean). */
  modifier: SectorModifier | null = null;
  /** Current campaign wave (1..WAVES_PER_SECTOR); 0 outside campaign. */
  waveNumber = 0;
  private waveTimer = 0;
  private waveMinTimer = 0;
  /** Current Ascension tier (endless mode); mirrored into stats for the HUD. */
  private ascHp = 1;
  private ascDmg = 1;
  private ascTimer = 0;

  /** Commander special-ability cooldown (seconds remaining) and its maximum. */
  private specialCd = 0;
  private specialCdMax = 12;
  /** Temporary damage multiplier from an "empower" special (1 = none). */
  damageBuff = 1;
  private buffTimer = 0;

  /** Reactor "Overdrive" pulse timer (seconds until next pulse). */
  private pulseTimer = 0;
  /** Visual radius of the last Overdrive pulse (read by the renderer). */
  pulseFx = 0;
  /** Aegis "revive" charges remaining this run (from Plating perk). */
  private revivesLeft = 0;

  /** How often the Overdrive light pulse fires, in seconds. */
  private static readonly PULSE_INTERVAL = 3;
  /** World-unit radius of the Overdrive light pulse. */
  private static readonly PULSE_RADIUS = 150;

  readonly enemies: Enemy[] = [];
  readonly projectiles: Projectile[] = [];
  readonly enemyProjectiles: EnemyProjectile[] = [];
  readonly pickups: Pickup[] = [];
  readonly particles: Particle[] = [];
  readonly damageNumbers: DamageNumber[] = [];
  readonly arcs: ArcEffect[] = [];
  readonly hazards: Hazard[] = [];

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
  private readonly hazardPool = new ObjectPool<Hazard>(() => new Hazard(), (h) => h.reset(), 32);
  private hazardTimer = 3;

  readonly enemyGrid = new SpatialHashGrid<Enemy>(96);
  private readonly spawnDirector = new SpawnDirector();
  private readonly weaponSystem = new WeaponSystem();

  readonly stats: RunStats = {
    elapsed: 0,
    kills: 0,
    eliteKills: 0,
    bossKills: 0,
    damageDealt: 0,
    xpCollected: 0,
    motesCollected: 0,
    affixKills: 0,
    podsCollected: 0,
    level: 1,
    ascension: 0,
    stagesCleared: 0,
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
    for (let i = 0; i < 8; i++)
      this.orbitOrbs.push({ x: 0, y: 0, radius: 0, hue: 50, style: "orb", angle: 0 });
  }

  get arenaRadius(): number {
    return ARENA_RADIUS;
  }

  /** The active stage definition (palette + enemy pool) for non-campaign modes. */
  get stage(): StageDef {
    return getStage(this.stageId);
  }

  /** Backdrop palette for the active arena (campaign Galaxy or stage). */
  get palette(): StagePalette {
    return this.campaign ? getGalaxy(galaxyOf(this.campaignLevel)).palette : this.stage.palette;
  }

  /** Stable cache key for the current palette (renderer rebakes on change). */
  get paletteKey(): string {
    return this.campaign ? `g${galaxyOf(this.campaignLevel)}` : this.stageId;
  }

  /** Enemy pool for the active arena. */
  private get activeEnemyPool(): readonly string[] {
    return this.campaign
      ? getGalaxy(galaxyOf(this.campaignLevel)).enemyPool
      : this.stage.enemyPool;
  }

  /** Boss pool for the active arena. */
  private get activeBossPool(): readonly string[] {
    return this.campaign
      ? getGalaxy(galaxyOf(this.campaignLevel)).bossPool
      : this.stage.bossPool;
  }

  /** Enemy HP difficulty multiplier for the active arena. */
  private get activeDifficulty(): number {
    return this.campaign ? levelDifficulty(this.campaignLevel) : this.stage.difficulty;
  }

  /** Enemy damage difficulty — milder than HP in campaign (see campaignDefs). */
  private get activeDamageDifficulty(): number {
    return this.campaign ? levelDamageDifficulty(this.campaignLevel) : this.stage.difficulty;
  }

  /** Re-seed the world RNG (used to start a deterministic Daily Run). */
  reseed(seed: number): void {
    this.rng.setState(seed);
  }

  getOrbitOrbs(): readonly OrbitOrb[] {
    return this.orbitOrbs;
  }

  setOrbitOrb(
    i: number,
    x: number,
    y: number,
    radius: number,
    hue: number,
    style = "orb",
    angle = 0,
  ): void {
    const o = this.orbitOrbs[i];
    if (!o) return;
    o.x = x;
    o.y = y;
    o.radius = radius;
    o.hue = hue;
    o.style = style;
    o.angle = angle;
  }

  reset(): void {
    // Gauntlet always begins on the first stage of its fixed order.
    if (this.gauntlet) {
      this.gauntletIndex = 0;
      this.stageId = GAUNTLET_ORDER[0];
    }
    // Return all live entities to their pools.
    for (const e of this.enemies) this.enemyPool.release(e);
    for (const p of this.projectiles) this.projectilePool.release(p);
    for (const p of this.enemyProjectiles) this.enemyProjectilePool.release(p);
    for (const p of this.pickups) this.pickupPool.release(p);
    for (const p of this.particles) this.particlePool.release(p);
    for (const d of this.damageNumbers) this.damageNumberPool.release(d);
    for (const a of this.arcs) this.arcPool.release(a);
    for (const h of this.hazards) this.hazardPool.release(h);
    this.enemies.length = 0;
    this.projectiles.length = 0;
    this.enemyProjectiles.length = 0;
    this.pickups.length = 0;
    this.particles.length = 0;
    this.damageNumbers.length = 0;
    this.arcs.length = 0;
    this.hazards.length = 0;
    this.hazardTimer = this.rng.range(3, 5);

    this.player.reset();
    this.loadout.metaLevels = this.metaLevels;
    this.loadout.gearInventory = this.gearInventory;
    this.loadout.gearEquipped = this.gearEquipped;
    this.loadout.signatureId = this.signatureId;
    this.loadout.wardenId = this.selectedWarden;
    this.loadout.wardenLevel = this.wardenLevel;
    this.loadout.chassisId = this.selectedChassis;
    this.loadout.reset();
    this.loadout.recomputeStats(this.player);
    this.player.hp = this.player.stats.maxHp;
    // Snapshot the run's revive charges from the merged stat block.
    this.revivesLeft = this.player.stats.revive;
    this.pulseTimer = World.PULSE_INTERVAL;
    this.pulseFx = 0;
    // Commander special: ready at run start, cooldown from the selected Commander.
    this.specialCdMax = getWarden(this.selectedWarden).special.cooldown;
    this.specialCd = 0;
    this.damageBuff = 1;
    this.buffTimer = 0;
    this.chassisTimer = 2; // brief grace before the first hull-passive tick
    this.spawnDirector.reset(
      this.activeEnemyPool,
      this.activeDifficulty,
      this.activeDamageDifficulty,
    );
    this.ascHp = 1;
    this.ascDmg = 1;
    this.ascTimer = ASCENSION_INTERVAL;

    this.stats.elapsed = 0;
    this.stats.kills = 0;
    this.stats.eliteKills = 0;
    this.stats.bossKills = 0;
    this.stats.damageDealt = 0;
    this.stats.xpCollected = 0;
    this.stats.motesCollected = 0;
    this.stats.affixKills = 0;
    this.stats.podsCollected = 0;
    this.podTimer = World.POD_FIRST;
    this.stats.level = 1;
    this.stats.ascension = 0;
    this.stats.stagesCleared = 0;
    this.pendingLevelUps = 0;
    this.isDead = false;
    this.auraRadius = 0;
    this.orbitOrbCount = 0;
    this.orbitAngle = 0;
    this.boss = null;
    this.bossController = null;
    // Campaign: fought in waves; the final wave IS the Sector boss, so the
    // interval-based boss scheduler stays off (startWave spawns it directly).
    this.levelCleared = false;
    this.modifier = this.campaign ? modifierForLevel(this.campaignLevel) : null;
    this.nextBossTime = this.bossRush
      ? RUSH_FIRST
      : this.gauntlet
        ? GAUNTLET_FIRST
        : this.campaign
          ? Infinity
          : this.bossInterval();
    this.bossEncounter = 0;
    this.waveNumber = 0;
    if (this.campaign) this.startWave(1);
  }

  // ---- Campaign waves ------------------------------------------------------

  /** Total waves per Sector (mirrored for the HUD). */
  get wavesTotal(): number {
    return WAVES_PER_SECTOR;
  }

  /**
   * Elapsed time as fed to the spawn director's scaling curves. The underlying
   * time ramp was tuned for 10–20-minute survival runs; a campaign Sector is a
   * ~5-minute fight whose difficulty should come from its WAVES, so campaign
   * dilates the clock — without this the two ramps compound and waves 7–8 spike
   * (playtest feedback).
   */
  private get directorElapsed(): number {
    return this.campaign ? this.stats.elapsed * 0.55 : this.stats.elapsed;
  }

  /**
   * Begin wave `n`. Waves 1..N-1: set the director's wave intensity and
   * burst-spawn an opening pack. The final wave summons the Sector boss —
   * felling it clears the Sector (see onBossDefeated).
   */
  private startWave(n: number): void {
    this.waveNumber = n;
    this.waveTimer = WAVE_DURATION;
    this.waveMinTimer = WAVE_MIN_TIME;
    if (n >= WAVES_PER_SECTOR) {
      // Boss wave: fodder pressure eases automatically (bossActive throttle).
      this.spawnBoss();
    } else {
      this.spawnDirector.setWaveIntensity(waveHpMult(n), waveDamageMult(n), waveRateMult(n));
      const minutes = this.directorElapsed / 60;
      for (const req of this.spawnDirector.requestBurst(waveBurstCount(n), minutes, this.rng)) {
        this.spawnFromRequest(req);
      }
    }
    this.events.emit("waveStarted", { wave: n, total: WAVES_PER_SECTOR });
  }

  /**
   * Advance the wave clock: the next wave auto-starts when the timer lapses, or
   * early once the field is (nearly) cleared past the minimum wave time — strong
   * builds accelerate the Sector instead of standing around.
   */
  private updateCampaignWaves(dt: number): void {
    if (this.levelCleared || this.waveNumber >= WAVES_PER_SECTOR) return;
    this.waveTimer -= dt;
    this.waveMinTimer -= dt;
    const fieldCleared = this.waveMinTimer <= 0 && this.enemies.length <= 2;
    if (this.waveTimer <= 0 || fieldCleared) {
      this.startWave(this.waveNumber + 1);
    }
  }

  /** Seconds between bosses for the current mode (endless recurs faster). */
  private bossInterval(): number {
    return this.endless ? ENDLESS_BOSS_INTERVAL : BOSS_INTERVAL;
  }

  // ---- Resumable run snapshot -------------------------------------------

  /**
   * Snapshot the run's meaningful state (build, progress, timers) for a resume.
   * Live enemies/projectiles/pickups are intentionally omitted — they regenerate.
   */
  captureRunState(): import("./save/RunSnapshot").WorldRunState {
    const p = this.player;
    return {
      stageId: this.stageId,
      campaignLevel: this.campaignLevel,
      gauntletIndex: this.gauntletIndex,
      rngState: this.rng.getState(),
      player: {
        x: p.x,
        y: p.y,
        hp: p.hp,
        level: p.level,
        xp: p.xp,
        xpToNext: p.xpToNext,
        facing: p.facing,
      },
      loadout: this.loadout.capture(),
      stats: { ...this.stats },
      nextBossTime: this.nextBossTime,
      bossEncounter: this.bossEncounter,
      waveNumber: this.waveNumber,
      waveTimer: this.waveTimer,
      ascHp: this.ascHp,
      ascDmg: this.ascDmg,
      ascTimer: this.ascTimer,
      pulseTimer: this.pulseTimer,
      revivesLeft: this.revivesLeft,
      pendingLevelUps: this.pendingLevelUps,
    };
  }

  /**
   * Overlay a snapshot onto a freshly-{@link reset} World, continuing the run
   * from where it was captured. The swarm respawns from empty — deliberately.
   */
  restoreRunState(s: import("./save/RunSnapshot").WorldRunState): void {
    this.rng.setState(s.rngState);
    // Restore the active arena (gauntlet's reset() forces the first stage) and
    // re-point the spawn director at the correct pool/difficulty.
    this.stageId = s.stageId;
    this.campaignLevel = s.campaignLevel;
    this.gauntletIndex = s.gauntletIndex;
    this.spawnDirector.setStage(
      this.activeEnemyPool as string[],
      this.activeDifficulty,
    );
    const p = this.player;
    p.x = s.player.x;
    p.y = s.player.y;
    p.level = s.player.level;
    p.xp = s.player.xp;
    p.xpToNext = s.player.xpToNext;
    p.facing = s.player.facing;
    p.aim = s.player.facing; // re-snaps to the nearest foe on the first shot
    this.loadout.restore(s.loadout, p);
    p.hp = Math.min(s.player.hp, p.stats.maxHp);
    Object.assign(this.stats, s.stats);
    this.nextBossTime = s.nextBossTime;
    this.bossEncounter = s.bossEncounter;
    this.ascHp = s.ascHp;
    this.ascDmg = s.ascDmg;
    this.ascTimer = s.ascTimer;
    this.spawnDirector.setAscension(this.ascHp, this.ascDmg, 1 + this.stats.ascension * 0.08);
    this.pulseTimer = s.pulseTimer;
    this.revivesLeft = s.revivesLeft;
    this.pendingLevelUps = s.pendingLevelUps;
    // The captured boss (if any) is gone; it reappears on its schedule. Make sure
    // a boss that was mid-fight isn't left dangling.
    this.boss = null;
    this.bossController = null;
    // Campaign: re-enter the captured wave (a boss-wave resume respawns the
    // boss via startWave; earlier waves re-apply intensity + a fresh burst).
    if (this.campaign) {
      this.startWave(Math.max(1, s.waveNumber ?? 1));
      if (s.waveTimer !== undefined) this.waveTimer = s.waveTimer;
    }
  }

  /**
   * Gauntlet: clearing a stage's boss advances to the next stage (swapping its
   * enemy pool, difficulty and palette) until all are cleared, then keeps the
   * bosses coming on the final stage. The Warden's HP/level/loadout carry over.
   */
  private advanceGauntlet(): void {
    this.stats.stagesCleared++;
    if (this.gauntletIndex < GAUNTLET_ORDER.length - 1) {
      this.gauntletIndex++;
      this.stageId = GAUNTLET_ORDER[this.gauntletIndex];
      const stage = this.stage;
      this.spawnDirector.setStage(stage.enemyPool, stage.difficulty);
      this.nextBossTime = this.stats.elapsed + GAUNTLET_GAP;
      this.events.emit("stageAdvance", {
        stageId: stage.id,
        name: stage.name,
        cleared: this.stats.stagesCleared,
      });
    } else {
      // Final stage cleared — keep bosses arriving for an endless victory lap.
      this.nextBossTime = this.stats.elapsed + GAUNTLET_GAP;
    }
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
    style: EnemyProjectileStyle = "orb",
  ): void {
    const p = this.enemyProjectilePool.obtain();
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.damage = damage;
    p.hue = hue;
    p.radius = radius;
    p.style = style;
    p.rotation = 0;
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
    if (this.isDead || this.levelCleared) return;
    this.stats.elapsed += dt;

    // Record previous-tick positions before ANY movement, so the renderer can
    // interpolate. Done here (not in updateEnemies) because the boss moves in
    // updateBoss, which runs first — capturing later left bosses unsmoothed.
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      e.prevX = e.x;
      e.prevY = e.y;
    }

    if (this.specialCd > 0) this.specialCd = Math.max(0, this.specialCd - dt);
    if (this.buffTimer > 0) {
      this.buffTimer -= dt;
      if (this.buffTimer <= 0) this.damageBuff = 1;
    }
    this.updatePlayer(dt, input);
    this.rebuildGrid();
    // Boss Rush suppresses fodder spawns — only bosses and their summons appear.
    if (!this.bossRush) this.spawnEnemies(dt);
    this.updateBoss(dt);
    this.weaponSystem.update(this, dt);
    this.updateProjectiles(dt);
    this.updateEnemies(dt);
    this.updateEnemyProjectiles(dt);
    this.updatePickups(dt);
    this.updateHazards(dt);
    this.updateSupplyPods(dt);
    this.updateOverdrive(dt);
    this.updateChassisPassive(dt);
    if (this.endless) this.updateAscension(dt);
    if (this.campaign) this.updateCampaignWaves(dt);
  }

  /** Supply Pod run-event: first drop and recurrence window (seconds). */
  private static readonly POD_FIRST = 55;
  private static readonly POD_MIN_GAP = 80;
  private static readonly POD_MAX_GAP = 115;
  private static readonly POD_LIFE = 20;
  private podTimer = World.POD_FIRST;

  /**
   * Run-event: a Supply Pod periodically drifts in at the field's edge and
   * self-destructs after {@link POD_LIFE}s — reach it in time for a cache of
   * healing, Motes and light. It never homes to the ship (the trek IS the
   * event) and holds off while a boss commands the field.
   */
  /**
   * Biome hazards — the field's environmental threat. On a cadence set by the
   * stage's biome, a hazard telegraphs (a growing warning ring), erupts for a
   * brief dangerous beat, then fades. Damage lands only during the active beat,
   * so a hazard is always dodgeable if read. Absent biome = a calm field.
   */
  private updateHazards(dt: number): void {
    const biome = getStage(this.stageId).biome;
    if (biome && !this.bossActive) {
      this.hazardTimer -= dt;
      if (this.hazardTimer <= 0) {
        const [lo, hi] = biome.hazardEvery;
        this.hazardTimer = this.rng.range(lo, hi);
        this.spawnHazard(biome);
      }
    }
    const arr = this.hazards;
    for (let i = arr.length - 1; i >= 0; i--) {
      const h = arr[i];
      h.timer += dt;
      if (h.phase === 0) {
        if (h.timer >= h.telegraphTime) {
          h.phase = 1;
          h.timer = 0;
        }
      } else if (h.phase === 1) {
        const r2 = h.radius * h.radius;
        const pdx = this.player.x - h.x;
        const pdy = this.player.y - h.y;
        const playerInside = pdx * pdx + pdy * pdy < r2;
        if (h.kind === "iceRift") {
          // A frozen field: it barely burns, but it chills the Warden to a
          // crawl — deadly when the swarm closes while you're mired.
          if (playerInside) {
            this.player.chill = Math.min(this.player.chill, 0.42);
            this.damagePlayer(h.damage);
          }
        } else {
          // lavaVent (and default): continuous burn while inside (i-frame
          // throttled), plus a one-time blast to Hollow caught in the eruption.
          if (playerInside) this.damagePlayer(h.damage);
          if (!h.burst) {
            h.burst = true;
            for (const e of this.enemies) {
              if (!e.active) continue;
              const dx = e.x - h.x;
              const dy = e.y - h.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < r2) {
                const inv = 1 / (Math.sqrt(d2) || 1);
                this.damageEnemy(e, h.damage * 1.6, false, dx * inv * 120, dy * inv * 120);
              }
            }
          }
        }
        if (h.timer >= h.activeTime) {
          h.phase = 2;
          h.timer = 0;
        }
      } else if (h.timer >= h.fadeTime) {
        this.hazardPool.release(h);
        arr[i] = arr[arr.length - 1];
        arr.pop();
      }
    }
  }

  private spawnHazard(biome: NonNullable<ReturnType<typeof getStage>["biome"]>): void {
    const a = this.rng.angle();
    const dist = this.rng.range(150, 360);
    const lim = ARENA_RADIUS - biome.hazardRadius;
    const h = this.hazardPool.obtain();
    h.x = clamp(this.player.x + Math.cos(a) * dist, -lim, lim);
    h.y = clamp(this.player.y + Math.sin(a) * dist, -lim, lim);
    h.kind = biome.hazard;
    h.radius = biome.hazardRadius;
    h.damage = biome.hazardDamage;
    h.hue = biome.hazardHue;
    h.phase = 0;
    h.timer = 0;
    h.burst = false;
    h.telegraphTime = 1.1;
    h.activeTime = 1.0;
    h.fadeTime = 0.5;
    h.active = true;
    this.hazards.push(h);
  }

  /** A small, short-lived ember patch dropped by a felled Hollow (Ember rule). */
  private spawnScorch(x: number, y: number): void {
    const h = this.hazardPool.obtain();
    h.x = x;
    h.y = y;
    h.kind = "lavaVent";
    h.radius = 46;
    h.damage = 7;
    h.hue = 24;
    h.phase = 0;
    h.timer = 0;
    h.burst = false;
    h.telegraphTime = 0.35;
    h.activeTime = 0.7;
    h.fadeTime = 0.4;
    h.active = true;
    this.hazards.push(h);
  }

  private updateSupplyPods(dt: number): void {
    if (this.bossRush) return; // boss-only mode has no fodder lulls to fill
    if (this.bossActive) return;
    this.podTimer -= dt;
    if (this.podTimer > 0) return;
    this.podTimer = this.rng.range(World.POD_MIN_GAP, World.POD_MAX_GAP);
    const a = this.rng.angle();
    const dist = this.rng.range(420, 620);
    const k = this.pickupPool.obtain();
    k.kind = "pod";
    k.value = 0;
    k.x = clamp(this.player.x + Math.cos(a) * dist, -ARENA_RADIUS + 60, ARENA_RADIUS - 60);
    k.y = clamp(this.player.y + Math.sin(a) * dist, -ARENA_RADIUS + 60, ARENA_RADIUS - 60);
    k.radius = 20;
    k.life = World.POD_LIFE;
    k.active = true;
    k.bob = this.rng.range(0, TAU);
    this.pickups.push(k);
    this.events.emit("podSpawned", { x: k.x, y: k.y });
  }

  /** Crack a secured Supply Pod open: heal, Motes and a fan of light shards. */
  private openSupplyPod(k: Pickup): void {
    this.stats.podsCollected++;
    this.spawnRing(k.x, k.y, 190, 60, 0.6);
    this.dropSpecial(k.x - 18, k.y + 6, "heal", 30);
    this.dropSpecial(k.x + 18, k.y + 6, "mote", 4);
    const shards = 5;
    const shardValue = 2 + Math.round(this.player.level * 0.6);
    for (let i = 0; i < shards; i++) {
      const a = (i / shards) * TAU;
      this.dropSpecial(k.x + Math.cos(a) * 26, k.y - 8 + Math.sin(a) * 26, "xp", shardValue);
    }
    this.events.emit("pickup", { kind: "pod" });
  }

  /**
   * Endless mode: every {@link ASCENSION_INTERVAL}s, raise the Ascension tier —
   * compounding enemy HP/damage and spawn-rate via the spawn director, plus
   * tougher bosses. Unbounded; the tier reached is the score.
   */
  private updateAscension(dt: number): void {
    this.ascTimer -= dt;
    if (this.ascTimer > 0) return;
    this.ascTimer += ASCENSION_INTERVAL;
    this.stats.ascension++;
    const n = this.stats.ascension;
    // Linear-in-tier ramps (gentle at first, brutal deep in).
    this.ascHp = 1 + n * 0.18;
    this.ascDmg = 1 + n * 0.12;
    const rate = 1 + n * 0.08;
    this.spawnDirector.setAscension(this.ascHp, this.ascDmg, rate);
    this.events.emit("ascension", { level: n });
  }

  /**
   * Reactor "Overdrive" perk: periodically emit a light pulse that damages
   * every enemy within range. Inert unless the perk is unlocked (pulseDamage>0).
   */
  private updateOverdrive(dt: number): void {
    const dmg = this.player.stats.pulseDamage;
    if (dmg <= 0) return;
    this.pulseTimer -= dt;
    if (this.pulseTimer > 0) return;
    this.pulseTimer = World.PULSE_INTERVAL;

    const px = this.player.x;
    const py = this.player.y;
    const r = World.PULSE_RADIUS * Math.sqrt(this.player.stats.areaMult);
    const r2 = r * r;
    const scaled = dmg * this.player.stats.damageMult;
    const near = this.enemyGrid.query(px, py, r);
    for (let i = 0; i < near.length; i++) {
      const e = near[i];
      if (!e.active) continue;
      const dx = e.x - px;
      const dy = e.y - py;
      if (dx * dx + dy * dy > r2) continue;
      const inv = 1 / (Math.hypot(dx, dy) || 1);
      this.damageEnemy(e, scaled, false, dx * inv * 90, dy * inv * 90);
    }
    this.pulseFx = r;
    this.spawnRing(px, py, 30, r, 0.45);
    this.events.emit("pulse", { x: px, y: py, radius: r });
  }

  // ---- Chassis (ship) passive hull specials ------------------------------

  /** Timed hull passives: magnet pulse, phase (brief invuln), drone volley. */
  private updateChassisPassive(dt: number): void {
    const passive = getChassis(this.selectedChassis).passive;
    if (passive === "none" || passive === "thorns") return; // "thorns" is reactive
    this.chassisTimer -= dt;
    if (this.chassisTimer > 0) return;
    const p = this.player;
    switch (passive) {
      case "magnet":
        this.chassisTimer = 7;
        for (const k of this.pickups) k.homing = true;
        this.spawnRing(p.x, p.y, 150, p.stats.pickupRadius, 0.5);
        break;
      case "phase":
        this.chassisTimer = 9;
        p.invuln = Math.max(p.invuln, 0.7);
        this.spawnRing(p.x, p.y, 258, p.radius * 1.5, 0.5);
        break;
      case "drone":
        this.chassisTimer = 4;
        this.fireDroneVolley();
        break;
      case "shock":
        this.chassisTimer = 5;
        this.chainShock();
        break;
    }
  }

  /** Corsair shock hull: an arc of light zaps the nearest few foes. */
  private chainShock(): void {
    const p = this.player;
    const near = this.enemyGrid.query(p.x, p.y, 320);
    const targets = near
      .filter((e) => e.active && !e.isBoss)
      .sort(
        (a, b) =>
          (a.x - p.x) ** 2 + (a.y - p.y) ** 2 - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2),
      )
      .slice(0, 3);
    let fromX = p.x;
    let fromY = p.y;
    const dmg = 24 * p.stats.damageMult * this.damageBuff;
    for (const e of targets) {
      this.spawnArc(fromX, fromY, e.x, e.y, 190);
      this.damageEnemy(e, dmg, false, 0, 0);
      fromX = e.x;
      fromY = e.y;
    }
  }

  /** Carrier escort drone: a small seeking volley toward the nearest foe. */
  private fireDroneVolley(): void {
    const p = this.player;
    const target = this.enemyGrid.findNearest(p.x, p.y, 720);
    const base = target ? Math.atan2(target.y - p.y, target.x - p.x) : p.aim;
    const dmg = Math.round(22 * p.stats.damageMult * this.damageBuff);
    const speed = 520 * p.stats.projectileSpeedMult;
    for (let i = 0; i < 3; i++) {
      const a = base + (i - 1) * 0.18;
      const proj = this.obtainProjectile();
      proj.x = p.x;
      proj.y = p.y;
      proj.vx = Math.cos(a) * speed;
      proj.vy = Math.sin(a) * speed;
      proj.radius = 6;
      proj.damage = dmg;
      proj.crit = false;
      proj.life = 1.4;
      proj.pierce = 1;
      proj.knockback = 60;
      proj.style = "bolt";
      proj.hue = 95;
      proj.weaponSeq = -1;
      proj.rotation = a;
      proj.rotationSpeed = 0;
      proj.evolved = false;
      proj.active = true;
    }
  }

  // ---- Commander special ability -----------------------------------------

  /** True when the special is off cooldown and ready to fire. */
  get specialReady(): boolean {
    return this.specialCd <= 0;
  }
  /** 0 (ready) … 1 (just used) — drives the cooldown sweep on the HUD button. */
  get specialCooldownFraction(): number {
    return this.specialCdMax > 0 ? this.specialCd / this.specialCdMax : 0;
  }
  /** The selected Commander's special (for the HUD icon / label). */
  get special(): CommanderSpecial {
    return getWarden(this.selectedWarden).special;
  }

  /** Fire the Commander's special if ready. Returns whether it activated. */
  activateSpecial(): boolean {
    if (this.isDead || this.levelCleared || this.specialCd > 0) return false;
    const sp = this.special;
    this.applySpecial(sp);
    this.specialCd = this.specialCdMax;
    this.events.emit("special", { name: sp.name, kind: sp.kind });
    return true;
  }

  private applySpecial(sp: CommanderSpecial): void {
    const p = this.player;
    switch (sp.kind) {
      case "nova": {
        const r = (sp.radius ?? 200) * Math.sqrt(p.stats.areaMult);
        const dmg = (sp.damage ?? 50) * p.stats.damageMult * this.damageBuff;
        const r2 = r * r;
        const near = this.enemyGrid.query(p.x, p.y, r);
        for (let i = 0; i < near.length; i++) {
          const e = near[i];
          if (!e.active) continue;
          const dx = e.x - p.x;
          const dy = e.y - p.y;
          if (dx * dx + dy * dy > r2) continue;
          const inv = 1 / (Math.hypot(dx, dy) || 1);
          this.damageEnemy(e, dmg, false, dx * inv * 240, dy * inv * 240);
        }
        this.spawnRing(p.x, p.y, 200, r, 0.55);
        this.spawnRing(p.x, p.y, 190, r * 0.6, 0.7);
        p.invuln = Math.max(p.invuln, 0.4);
        break;
      }
      case "heal": {
        p.hp = Math.min(p.stats.maxHp, p.hp + p.stats.maxHp * (sp.healFrac ?? 0.3));
        this.spawnRing(p.x, p.y, 150, p.radius * 1.6, 0.7);
        break;
      }
      case "empower": {
        this.damageBuff = sp.mult ?? 1.5;
        this.buffTimer = sp.duration ?? 5;
        this.spawnRing(p.x, p.y, 20, p.radius * 1.3, 0.6);
        break;
      }
      case "dash": {
        const d = sp.distance ?? 200;
        p.x = clamp(p.x + Math.cos(p.facing) * d, -ARENA_RADIUS, ARENA_RADIUS);
        p.y = clamp(p.y + Math.sin(p.facing) * d, -ARENA_RADIUS, ARENA_RADIUS);
        p.invuln = Math.max(p.invuln, sp.invuln ?? 0.5);
        this.spawnRing(p.x, p.y, 190, p.radius * 1.3, 0.5);
        break;
      }
      case "guard": {
        p.invuln = Math.max(p.invuln, sp.invuln ?? 3);
        this.spawnRing(p.x, p.y, 210, p.radius * 1.6, 0.8);
        break;
      }
      case "vortex": {
        // Gravity Well: haul nearby foes toward you and crush them together.
        const r = (sp.radius ?? 300) * Math.sqrt(p.stats.areaMult);
        const dmg = (sp.damage ?? 30) * p.stats.damageMult * this.damageBuff;
        const r2 = r * r;
        const near = this.enemyGrid.query(p.x, p.y, r);
        for (let i = 0; i < near.length; i++) {
          const e = near[i];
          if (!e.active || e.isBoss) continue;
          const dx = p.x - e.x;
          const dy = p.y - e.y;
          if (dx * dx + dy * dy > r2) continue;
          const inv = 1 / (Math.hypot(dx, dy) || 1);
          this.damageEnemy(e, dmg, false, dx * inv * 420, dy * inv * 420); // pull inward
        }
        this.spawnRing(p.x, p.y, 300, r, 0.6);
        break;
      }
    }
  }

  // ---- Boss lifecycle ----------------------------------------------------

  private updateBoss(dt: number): void {
    // Schedule a new boss when its time arrives and none is active.
    if (!this.bossActive && this.stats.elapsed >= this.nextBossTime) {
      this.spawnBoss();
      // In rush the next boss is scheduled when this one dies; a campaign Sector
      // has exactly one boss; otherwise it recurs on the fixed interval.
      this.nextBossTime += this.bossRush || this.campaign ? 1e9 : this.bossInterval();
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
        style: EnemyProjectileStyle = "orb",
      ) => this.fireEnemyProjectile(x, y, vx, vy, damage, hue, radius, style),
      spawnAdd: (typeId: string, x: number, y: number) => this.spawnAdd(typeId, x, y),
    };
  }

  private spawnBoss(): void {
    // Campaign: cycle the Galaxy's boss pool by Sector so consecutive Sectors
    // meet different bosses; other modes cycle by encounter as before.
    const def = bossForEncounter(
      this.campaign ? sectorOf(this.campaignLevel) : this.bossEncounter,
      this.activeBossPool,
    );
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
    // HP scales with encounter index, a touch with time, stage difficulty, and
    // (in endless) the current Ascension tier.
    const encounterScale = 1 + this.bossEncounter * 0.85;
    const diff = this.activeDifficulty;
    // Campaign milestone Sectors (5 & 10) field elite bosses.
    const milestone = this.campaign ? sectorBossMult(this.campaignLevel) : 1;
    e.maxHp = def.baseHp * encounterScale * (1 + minutes * 0.04) * diff * this.ascHp * milestone;
    e.hp = e.maxHp;
    // Boss damage uses the milder damage curve so deep-Galaxy bosses are tanky,
    // not one-shot machines.
    e.damage =
      def.contactDamage * (1 + minutes * 0.08) * this.activeDamageDifficulty * this.ascDmg;
    e.xpValue = 60 + this.bossEncounter * 30;
    e.knockX = 0;
    e.knockY = 0;
    e.active = true;
    this.enemies.push(e);
    this.boss = e;
    this.bossController = new BossController(def);
    this.bossEncounter++;
    this.events.emit("bossSpawned", { name: def.name, title: def.title, id: def.id, hue: def.hue });
  }

  /** Spawn a normal enemy add at a position (used by boss summons). */
  private spawnAdd(typeId: string, x: number, y: number): void {
    const def = ENEMY_DEFS[typeId] ?? ENEMY_DEFS.husk;
    const minutes = this.directorElapsed / 60;
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
    p.prevX = p.x;
    p.prevY = p.y;
    p.invuln = Math.max(0, p.invuln - dt);
    p.hitFlash = Math.max(0, p.hitFlash - dt);

    p.x += input.moveX * s.moveSpeed * p.chill * dt;
    p.y += input.moveY * s.moveSpeed * p.chill * dt;
    p.chill = 1; // consumed each frame; ice hazards re-apply it below
    if (input.moveX !== 0 || input.moveY !== 0) {
      // Turn toward the stick smoothly — an instant snap made the sprite
      // jitter with every thumb wobble (the reported movement flicker).
      const target = Math.atan2(input.moveY, input.moveX);
      let d = target - p.facing;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      p.facing += d * Math.min(1, dt * 14);
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
    // Sector Modifiers can throttle the director clock (Locust Swarm etc.);
    // Crimson Nebula doubles the elite cadence specifically.
    const rate = this.modifier?.spawnRateMult ?? 1;
    this.spawnDirector.setEliteRate(this.modifier?.eliteFrenzy ? 2 : 1);
    const requests = this.spawnDirector.update(
      dt * rate,
      this.directorElapsed,
      this.enemies.length,
      this.rng,
      this.bossActive,
    );
    for (const req of requests) this.spawnFromRequest(req);
  }

  /** Materialise one director spawn request just outside the visible ring. */
  private spawnFromRequest(req: import("./SpawnDirector").SpawnRequest): void {
    const minutes = this.directorElapsed / 60;
    const hpScale = this.spawnDirector.hpScale(minutes);
    const dmgScale = this.spawnDirector.damageScale(minutes);
    const e = this.enemyPool.obtain();
    const def = req.def;
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
    // Sector Modifier stat hooks (campaign texture layer).
    const mod = this.modifier;
    e.maxHp = def.hp * hpScale * eliteHp * (mod?.enemyHpMult ?? 1);
    e.hp = e.maxHp;
    e.damage = def.damage * dmgScale * eliteDmg * (mod?.enemyDamageMult ?? 1);
    e.radius = def.radius * eliteSize;
    e.speed = def.speed * (mod?.enemySpeedMult ?? 1);
    e.xpValue = def.xpValue * (req.elite ? 8 : 1);
    // Elite Affixes: deeper in, champions roll a telegraphed twist.
    if (req.elite && this.affixesUnlocked() && this.rng.next() < 0.6) {
      const affix = ELITE_AFFIXES[Math.floor(this.rng.next() * ELITE_AFFIXES.length)];
      e.affix = affix.id;
      e.affixTimer = SUMMON_INTERVAL;
      if (affix.hpMult) {
        e.maxHp *= affix.hpMult;
        e.hp = e.maxHp;
      }
      if (affix.speedMult) e.speed *= affix.speedMult;
    }
    e.active = true;
    this.enemies.push(e);
  }

  /**
   * Affixed elites arrive once the player has found their feet: campaign
   * Galaxy 2+, or four minutes into any survival mode.
   */
  private affixesUnlocked(): boolean {
    return this.campaign ? this.campaignLevel >= 10 : this.stats.elapsed >= 240;
  }

  private updateProjectiles(dt: number): void {
    const arr = this.projectiles;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.prevX = p.x;
      p.prevY = p.y;
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
          // Impact spark burst kicked back along the projectile's travel.
          this.spawnImpact(p.x, p.y, p.hue, p.vx, p.vy);
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
      e.age += dt;
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      if (e.hitScale !== 1) e.hitScale += (1 - e.hitScale) * Math.min(1, dt * 16);
      e.contactCooldown = Math.max(0, e.contactCooldown - dt);

      // Elite affix upkeep: Regenerators knit themselves back together;
      // Summoners call fodder reinforcements on a fixed clock.
      if (e.affix) {
        const affix = getAffix(e.affix);
        if (affix?.regenFrac && e.hp > 0) {
          e.hp = Math.min(e.maxHp, e.hp + e.maxHp * affix.regenFrac * dt);
        }
        if (affix?.summoner) {
          e.affixTimer -= dt;
          if (e.affixTimer <= 0 && this.enemies.length < 80) {
            e.affixTimer = SUMMON_INTERVAL;
            const pool = this.activeEnemyPool;
            const addId = pool[0] ?? "drifter";
            for (let s = 0; s < 2; s++) {
              const a = this.rng.angle();
              this.spawnAdd(addId, e.x + Math.cos(a) * (e.radius + 14), e.y + Math.sin(a) * (e.radius + 14));
            }
            this.spawnRing(e.x, e.y, 130, e.radius * 1.2, 0.4);
          }
        }
      }

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

      // Elemental ambient wisps give fire/ice foes a distinct read on the field.
      this.emitEnemyAmbient(e);
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
      ep.prevX = ep.x;
      ep.prevY = ep.y;
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
      k.prevX = k.x;
      k.prevY = k.y;
      k.bob += dt * 4;

      // Timed pickups (Supply Pods) burn down and vanish uncollected.
      if (k.life > 0) {
        k.life -= dt;
        if (k.life <= 0) {
          this.pickupPool.release(k);
          arr[i] = arr[arr.length - 1];
          arr.pop();
          continue;
        }
      }

      const dx = p.x - k.x;
      const dy = p.y - k.y;
      const dSq = dx * dx + dy * dy;

      // Pods never home — reaching them is the event.
      if (!k.homing && dSq <= pickR2 && k.kind !== "pod") k.homing = true;

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
        // Dim Light Sectors thin the essence in every shard.
        const gain = k.value * this.player.stats.xpMult * (this.modifier?.xpMult ?? 1);
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
        // Pull every pickup on the field toward the Warden (pods stay put).
        for (const other of this.pickups) if (other.kind !== "pod") other.homing = true;
        this.events.emit("pickup", { kind: "magnet" });
        break;
      }
      case "bomb": {
        this.detonateBomb();
        this.events.emit("pickup", { kind: "bomb" });
        break;
      }
      case "mote": {
        // Banked into the end-of-run Light Mote payout (see Game reward math).
        this.stats.motesCollected += k.value;
        this.events.emit("pickup", { kind: "mote" });
        break;
      }
      case "pod": {
        this.openSupplyPod(k);
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
    // Warded elites shrug off a chunk of every hit (their purple ring says so).
    const ward = getAffix(e.affix)?.damageReduction;
    if (ward) amount *= 1 - ward;
    e.hp -= amount;
    e.hitFlash = 0.08;
    e.hitScale = crit ? 1.5 : 1.32; // squash-and-stretch pop, eased back in updateEnemies
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
    if (e.isElite && e.affix) this.stats.affixKills++;
    this.events.emit("enemyKilled", { x: e.x, y: e.y, xp: e.xpValue, elite: e.isElite });
    this.spawnDeathBurst(e);

    if (e.isBoss) {
      this.onBossDefeated(e);
    } else {
      // Death detonations: Unstable Cores Sectors make every kill a hazard;
      // Volatile elites always go out with a bang. Telegraphed by a ring.
      const detonates = getAffix(e.affix)?.volatile || (this.modifier?.volatile && !e.isElite);
      if (detonates) this.detonateCorpse(e);
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
      // Ember biome rule ("scorch"): a felled Hollow may leave a brief burning
      // patch, seeding chain-burns through the swarm.
      if (getStage(this.stageId).biome?.rule === "scorch" && this.hazards.length < 24) {
        if (this.rng.chance(0.08)) this.spawnScorch(e.x, e.y);
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

  /**
   * A slain enemy detonates (Unstable Cores Sectors / Volatile elites): a
   * visible blast ring, and the Warden takes contact-grade damage if caught
   * inside it. Enemies are unharmed — the hazard is aimed at the player.
   */
  private detonateCorpse(e: Enemy): void {
    const r = e.radius + (e.isElite ? 110 : 70);
    this.spawnRing(e.x, e.y, 200, r, 0.45);
    const dx = this.player.x - e.x;
    const dy = this.player.y - e.y;
    if (dx * dx + dy * dy <= r * r) {
      this.damagePlayer(e.damage * 0.9);
    }
  }

  /** Boss death: clear refs, big celebratory loot shower, and an event. */
  private onBossDefeated(e: Enemy): void {
    this.boss = null;
    this.bossController = null;
    this.stats.bossKills++;
    // Boss Rush: queue the next escalating boss a short beat later.
    if (this.bossRush) this.nextBossTime = this.stats.elapsed + RUSH_GAP;
    // Gauntlet: a boss kill clears the current stage; advance to the next.
    if (this.gauntlet) this.advanceGauntlet();
    this.events.emit("bossDefeated", { x: e.x, y: e.y, id: e.typeId });
    // Campaign: every Sector's final wave is its boss — felling it clears.
    if (this.campaign && !this.levelCleared) {
      this.levelCleared = true;
      this.events.emit("levelCleared", { level: this.campaignLevel });
    }

    // Generous reward: a fan of XP shards plus guaranteed support drops.
    const shards = 14;
    for (let i = 0; i < shards; i++) {
      const a = (i / shards) * TAU;
      const r = e.radius * 0.6;
      this.dropSpecial(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r, "xp", e.xpValue / shards);
    }
    this.dropSpecial(e.x - 20, e.y, "heal", 45);
    this.dropSpecial(e.x + 20, e.y, "magnet", 0);
    this.dropSpecial(e.x, e.y - 24, "mote", 6);
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

    // Light Motes: elites always shed a small purse (affixed champions pay
    // extra for the added danger); fodder rarely sheds one.
    if (e.isElite) this.dropSpecial(e.x, e.y - 10, "mote", e.affix ? 5 : 3);
    else if (this.rng.next() < 0.012) this.dropSpecial(e.x, e.y, "mote", 1);
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
    p.invuln = p.stats.iframes;
    p.hitFlash = 0.25;
    this.events.emit("playerHit", { damage: reduced });
    // Bulwark chassis: reflect a punishing burst to nearby foes when struck.
    if (getChassis(this.selectedChassis).passive === "thorns") this.reflectThorns(reduced);
    if (p.hp <= 0) {
      // Aegis (Plating max-grade): cheat death once per run, recover to 35% HP.
      if (this.revivesLeft > 0) {
        this.revivesLeft--;
        p.hp = p.stats.maxHp * 0.35;
        p.invuln = 1.5;
        this.spawnRing(p.x, p.y, 210, p.radius * 1.4, 0.8);
        this.events.emit("revived", { x: p.x, y: p.y });
        return;
      }
      p.hp = 0;
      this.isDead = true;
      this.events.emit("playerDied", {});
    }
  }

  /** Bulwark thorns: burst damage to enemies around the struck player. */
  private reflectThorns(damageTaken: number): void {
    const p = this.player;
    const r = 170;
    const r2 = r * r;
    const dmg = 30 + damageTaken * 2.5;
    const near = this.enemyGrid.query(p.x, p.y, r);
    for (let i = 0; i < near.length; i++) {
      const e = near[i];
      if (!e.active) continue;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      if (dx * dx + dy * dy > r2) continue;
      const inv = 1 / (Math.hypot(dx, dy) || 1);
      this.damageEnemy(e, dmg, false, dx * inv * 160, dy * inv * 160);
    }
    this.spawnRing(p.x, p.y, 280, r, 0.4);
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
    // A shockwave ring punctuates every kill — bigger and brighter for bigger
    // foes — so deaths land with a satisfying pop.
    if (e.isElite || e.isBoss) {
      this.spawnRing(e.x, e.y, e.hue, e.radius * 0.8, e.isBoss ? 0.7 : 0.5);
    } else if (this.particles.length < 380) {
      this.spawnRing(e.x, e.y, e.hue, e.radius * 0.5, 0.28);
    }
  }

  /**
   * Impact burst where a shot lands — a small fan of sparks kicked back along
   * the hit direction plus a quick flash ring. Bounded so heavy multi-projectile
   * builds can't flood the particle pool.
   */
  spawnImpact(x: number, y: number, hue: number, nx: number, ny: number): void {
    if (this.particles.length > 420) return;
    const base = Math.atan2(ny, nx);
    for (let i = 0; i < 3; i++) {
      const pt = this.particlePool.obtain();
      const a = base + this.rng.range(-0.6, 0.6);
      const sp = this.rng.range(70, 190);
      pt.x = x;
      pt.y = y;
      pt.vx = Math.cos(a) * sp;
      pt.vy = Math.sin(a) * sp;
      pt.life = 0;
      pt.maxLife = this.rng.range(0.14, 0.26);
      pt.size = this.rng.range(1.5, 3);
      pt.hue = hue;
      pt.alpha = 1;
      pt.drag = 0.82;
      pt.shape = "spark";
      pt.active = true;
      this.particles.push(pt);
    }
    this.spawnRing(x, y, hue, 8, 0.16);
  }

  /**
   * Occasional elemental wisp trailing a fire (ember rising) or ice (frost
   * drifting) enemy — pure identity flavour. Bounded and low-probability so
   * dense swarms stay cheap.
   */
  private emitEnemyAmbient(e: Enemy): void {
    if (this.particles.length > 280) return;
    const fire = e.typeId === "cinder" || e.typeId === "revenant";
    const ice = e.typeId === "shard" || e.typeId === "colossus";
    if ((!fire && !ice) || !this.rng.chance(0.02)) return;
    const pt = this.particlePool.obtain();
    pt.x = e.x + this.rng.range(-e.radius, e.radius) * 0.5;
    pt.y = e.y + this.rng.range(-e.radius, e.radius) * 0.5;
    if (fire) {
      pt.vx = this.rng.range(-8, 8);
      pt.vy = this.rng.range(-40, -18); // embers rise
      pt.hue = this.rng.range(18, 42);
      pt.maxLife = this.rng.range(0.3, 0.6);
      pt.size = this.rng.range(1.4, 2.6);
    } else {
      pt.vx = this.rng.range(-14, 14);
      pt.vy = this.rng.range(-6, 10);
      pt.hue = this.rng.range(180, 205);
      pt.maxLife = this.rng.range(0.4, 0.8);
      pt.size = this.rng.range(1.2, 2.2);
    }
    pt.life = 0;
    pt.alpha = 1;
    pt.drag = 0.9;
    pt.shape = "spark";
    pt.active = true;
    this.particles.push(pt);
  }

  /** Muzzle flash at a weapon's origin, thrown in the firing direction. */
  spawnMuzzle(x: number, y: number, angle: number, hue: number): void {
    if (this.particles.length > 420) return;
    for (let i = 0; i < 2; i++) {
      const pt = this.particlePool.obtain();
      const a = angle + this.rng.range(-0.22, 0.22);
      const sp = this.rng.range(120, 240);
      pt.x = x;
      pt.y = y;
      pt.vx = Math.cos(a) * sp;
      pt.vy = Math.sin(a) * sp;
      pt.life = 0;
      pt.maxLife = this.rng.range(0.08, 0.16);
      pt.size = this.rng.range(2, 3.4);
      pt.hue = hue;
      pt.alpha = 1;
      pt.drag = 0.8;
      pt.shape = "spark";
      pt.active = true;
      this.particles.push(pt);
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
    // Fade the Overdrive pulse marker the renderer reads.
    if (this.pulseFx > 0) {
      this.pulseFx = Math.max(0, this.pulseFx - frameDt * 600);
    }
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
