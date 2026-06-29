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

  reset(): void {
    this.spawnAccumulator = 0;
    this.eliteTimer = 22;
    this.surgeTimer = 45;
    this.surgeRemaining = 0;
  }

  /** Difficulty multiplier on enemy HP as a function of elapsed minutes. */
  hpScale(minutes: number): number {
    // Gentle quadratic-ish ramp: ~1x at 0min, ~2.5x at 5min, ~6x at 12min.
    return 1 + minutes * 0.28 + minutes * minutes * 0.018;
  }

  /** Difficulty multiplier on enemy damage. */
  damageScale(minutes: number): number {
    return 1 + minutes * 0.12;
  }

  /** Base spawn interval (seconds between spawns), shrinking over time. */
  private spawnInterval(minutes: number): number {
    // From ~0.7s early to ~0.12s late, clamped.
    const v = 0.72 - minutes * 0.05;
    return Math.max(0.12, v);
  }

  /** Soft cap on concurrent enemies, rising with time. */
  enemyCap(minutes: number): number {
    return Math.min(900, Math.floor(120 + minutes * 70));
  }

  private availableDefs(minutes: number): EnemyDef[] {
    return ENEMY_LIST.filter((d) => !d.summonOnly && minutes >= d.unlockAtMinutes);
  }

  /**
   * Advance the director and return spawn requests for this step (often empty).
   * @param dt seconds, @param elapsed total run seconds, @param liveCount current enemy count
   */
  update(dt: number, elapsed: number, liveCount: number, rng: Rng): SpawnRequest[] {
    const minutes = elapsed / 60;
    const requests: SpawnRequest[] = [];

    // Surge scheduling — brief windows of heavy pressure.
    this.surgeTimer -= dt;
    if (this.surgeTimer <= 0) {
      this.surgeRemaining = 6;
      this.surgeTimer = 50 + rng.range(-8, 8);
    }
    let rateMult = 1;
    if (this.surgeRemaining > 0) {
      this.surgeRemaining -= dt;
      rateMult = 2.6;
    }

    const cap = this.enemyCap(minutes);
    if (liveCount >= cap) {
      // At cap: still tick elite timer but suppress fodder spawns.
      this.eliteTimer -= dt;
      return requests;
    }

    const interval = this.spawnInterval(minutes) / rateMult;
    this.spawnAccumulator += dt;

    const defs = this.availableDefs(minutes);
    const weights = defs.map((d) => d.weight);

    while (this.spawnAccumulator >= interval && liveCount + requests.length < cap) {
      this.spawnAccumulator -= interval;
      const def = rng.weighted(defs, weights);
      requests.push({ def, elite: false });
    }

    // Elite spawns — tankier, rewarding targets that punctuate the run.
    this.eliteTimer -= dt;
    if (this.eliteTimer <= 0 && minutes >= 1) {
      this.eliteTimer = Math.max(12, 26 - minutes) + rng.range(-3, 3);
      const def = rng.weighted(defs, weights);
      requests.push({ def, elite: true });
    }

    return requests;
  }
}
