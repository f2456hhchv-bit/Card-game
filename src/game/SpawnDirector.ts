import type { Rng } from "../core/math/Rng";
import { ENEMY_LIST, type EnemyDef } from "./data/enemyDefs";

/**
 * Decides what the Hollow throws at the Warden over time.
 *
 * Design goals:
 *  - A smooth, ever-rising pressure curve (the "just one more minute" hook).
 *  - Periodic swarm surges and elite pressure so the run has texture.
 *  - HP/damage scaling that keeps early enemies relevant without spiking.
 *
 * The director is purely a scheduler: it tells the World *when* and *what* to
 * spawn via a small request struct, keeping spawning logic testable in
 * isolation from rendering and pooling.
 */
export interface SpawnRequest {
  def: EnemyDef;
  elite: boolean;
}

export class SpawnDirector {
  private spawnAccumulator = 0;
  /** Seconds until the next elite is allowed. */
  private eliteTimer = 22;
  /** Seconds until the next surge event. */
  private surgeTimer = 45;
  /** Active surge: extra spawn-rate multiplier and its remaining time. */
  private surgeRemaining = 0;
  /** Enemy ids eligible for this run's stage (null = the whole bestiary). */
  private pool: Set<string> | null = null;
  /** Difficulty multiplier on enemy HP scaling (1 = base stage). */
  private difficulty = 1;
  /** Difficulty multiplier on enemy damage scaling — may be milder than HP. */
  private damageDifficulty = 1;
  /** Endless Ascension multipliers (HP, damage, spawn-rate); 1 = no ascension. */
  private ascHp = 1;
  private ascDmg = 1;
  private ascRate = 1;
  /** Campaign wave multipliers (HP, damage, spawn-rate); 1 = wave 1 / no waves. */
  private waveHp = 1;
  private waveDmg = 1;
  private waveRate = 1;
  /** Elite cadence multiplier (Crimson Nebula Sector Modifier doubles it). */
  private eliteRate = 1;

  /**
   * @param pool optional stage enemy-id whitelist; omit for all enemies.
   * @param difficulty stage HP/damage multiplier (1 = base).
   */
  reset(pool?: readonly string[], difficulty = 1, damageDifficulty = difficulty): void {
    this.spawnAccumulator = 0;
    this.eliteTimer = 22;
    this.eliteRate = 1;
    this.surgeTimer = 45;
    this.surgeRemaining = 0;
    this.pool = pool ? new Set(pool) : null;
    this.difficulty = difficulty;
    this.damageDifficulty = damageDifficulty;
    this.ascHp = 1;
    this.ascDmg = 1;
    this.ascRate = 1;
    this.waveHp = 1;
    this.waveDmg = 1;
    this.waveRate = 1;
  }

  /**
   * Swap the active enemy pool + difficulty (e.g. when restoring a run) without
   * disturbing the spawn/elite/surge timers.
   */
  setStage(pool: readonly string[], difficulty: number, damageDifficulty = difficulty): void {
    this.pool = new Set(pool);
    this.difficulty = difficulty;
    this.damageDifficulty = damageDifficulty;
  }

  /** Set the endless Ascension multipliers (HP, damage, spawn-rate). */
  setAscension(hp: number, dmg: number, rate: number): void {
    this.ascHp = hp;
    this.ascDmg = dmg;
    this.ascRate = rate;
  }

  /** Set the campaign wave multipliers (HP, damage, spawn-rate). */
  setWaveIntensity(hp: number, dmg: number, rate: number): void {
    this.waveHp = hp;
    this.waveDmg = dmg;
    this.waveRate = rate;
  }

  /** Elite cadence multiplier (2 = elites twice as often). */
  setEliteRate(mult: number): void {
    this.eliteRate = mult;
  }

  /** Burst-spawn requests for a wave opener, drawn from the active pool. */
  requestBurst(count: number, minutes: number, rng: Rng): SpawnRequest[] {
    const defs = this.availableDefs(minutes);
    if (defs.length === 0) return [];
    const weights = defs.map((d) => d.weight);
    const out: SpawnRequest[] = [];
    for (let i = 0; i < count; i++) {
      out.push({ def: rng.weighted(defs, weights), elite: false });
    }
    return out;
  }

  /** Difficulty multiplier on enemy HP as a function of elapsed minutes. */
  hpScale(minutes: number): number {
    // Gentle quadratic-ish ramp: ~1x at 0min, ~2.5x at 5min, ~6x at 12min.
    return (1 + minutes * 0.28 + minutes * minutes * 0.018) * this.difficulty * this.ascHp * this.waveHp;
  }

  /** Difficulty multiplier on enemy damage. */
  damageScale(minutes: number): number {
    // Linear early, with a quadratic tail so that late enemies keep biting even
    // once the Warden's build is monstrous (addresses "too easy after ~20 min").
    return (
      (1 + minutes * 0.12 + minutes * minutes * 0.006) *
      this.damageDifficulty *
      this.ascDmg *
      this.waveDmg
    );
  }

  /** Base spawn interval (seconds between spawns), shrinking over time. */
  private spawnInterval(minutes: number): number {
    // From ~0.7s early to ~0.12s late, clamped; ascension shortens it further.
    const v = (0.72 - minutes * 0.05) / (this.ascRate * this.waveRate);
    return Math.max(0.08, v);
  }

  /** Soft cap on concurrent enemies, rising with time. */
  enemyCap(minutes: number): number {
    return Math.min(900, Math.floor(140 + minutes * 90));
  }

  private availableDefs(minutes: number): EnemyDef[] {
    return ENEMY_LIST.filter(
      (d) =>
        !d.summonOnly &&
        minutes >= d.unlockAtMinutes &&
        (this.pool === null || this.pool.has(d.id)),
    );
  }

  /**
   * Advance the director and return spawn requests for this step (often empty).
   * @param dt seconds, @param elapsed total run seconds, @param liveCount current enemy count
   * @param bossActive when true, fodder is throttled and its cap halved so the
   *        boss fight stays readable (fixes "adds swarm the boss"); elites still
   *        tick so the pressure doesn't vanish entirely.
   */
  update(
    dt: number,
    elapsed: number,
    liveCount: number,
    rng: Rng,
    bossActive = false,
  ): SpawnRequest[] {
    const minutes = elapsed / 60;
    const requests: SpawnRequest[] = [];

    // Surge scheduling — brief windows of heavy pressure (never during a boss).
    this.surgeTimer -= dt;
    if (this.surgeTimer <= 0) {
      if (!bossActive) this.surgeRemaining = 6;
      this.surgeTimer = 50 + rng.range(-8, 8);
    }
    let rateMult = 1;
    if (this.surgeRemaining > 0) {
      this.surgeRemaining -= dt;
      rateMult = 2.6;
    }

    // During a boss, thin the fodder: fewer, and capped low so it never walls
    // the player off from the boss.
    const bossLull = bossActive ? 2.8 : 1;
    const cap = bossActive
      ? Math.floor(this.enemyCap(minutes) * 0.45)
      : this.enemyCap(minutes);
    if (liveCount >= cap) {
      // At cap: still tick elite timer but suppress fodder spawns.
      this.eliteTimer -= dt * this.eliteRate;
      return requests;
    }

    const interval = (this.spawnInterval(minutes) * bossLull) / rateMult;
    this.spawnAccumulator += dt;

    const defs = this.availableDefs(minutes);
    const weights = defs.map((d) => d.weight);

    while (this.spawnAccumulator >= interval && liveCount + requests.length < cap) {
      this.spawnAccumulator -= interval;
      const def = rng.weighted(defs, weights);
      requests.push({ def, elite: false });
    }

    // Elite spawns — tankier, rewarding targets that punctuate the run. Late in
    // a run they arrive faster and in pairs, keeping veterans honest.
    this.eliteTimer -= dt * this.eliteRate;
    if (this.eliteTimer <= 0 && minutes >= 1) {
      const floor = minutes >= 14 ? 8 : 12;
      this.eliteTimer = Math.max(floor, 26 - minutes) + rng.range(-3, 3);
      requests.push({ def: rng.weighted(defs, weights), elite: true });
      // Past the mid-late game, elites hunt in pairs.
      if (minutes >= 16) requests.push({ def: rng.weighted(defs, weights), elite: true });
    }

    return requests;
  }
}
