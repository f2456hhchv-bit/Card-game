/**
 * Director Conductor runtime (AF-056 §Recovery Windows / §Adaptive Response /
 * §Spawn System): the one genuinely new mechanical surface of the Enemy
 * Director Framework — a conductor layer OVER AF-017's locked engine, never a
 * replacement for it. The EnemyDirector keeps deciding WHAT to spawn and how
 * much it costs; the conductor shapes WHEN it lands: reactive Recovery
 * Windows open after elite battles, boss phases, major events, large waves,
 * and resource discoveries, and while one is open, ordinary directives wait
 * in a fair, capped Spawn Queue instead of piling onto the breathing room.
 * Window length adapts to player struggle (recent damage taken + current
 * hull) — a dominating player gets barely a pause, a struggling one gets the
 * full breath — and is hard-capped so recovery never feels excessive.
 * "Adaptation adjusts pacing, not hidden difficulty" is structural: nothing
 * in this class can touch an enemy stat, a budget, or the phase engine.
 * Deterministic by construction — the conductor holds no RNG at all. Pure
 * and bus-free, like every prior *Runtime; generic over the directive type
 * so it never even needs to understand what it queues.
 */
import { CONDUCTOR_TUNING, type RecoveryTrigger } from "./conductorData";

export interface ConductorSnapshot {
  windowOpen: boolean;
  windowRemainingMs: number;
  cooldownRemainingMs: number;
  queuedDirectives: number;
  struggleScore: number;
  windowsOpened: number;
  lastTrigger: RecoveryTrigger | null;
  /** GP-002: the two newly-live Adaptive Response inputs, exposed for debug/observability. */
  recentKills: number;
  nearDeathCount: number;
}

export class DirectorConductor<TDirective> {
  private windowRemainingMs = 0;
  private cooldownRemainingMs = 0;
  private recentDamage = 0;
  private hullFraction = 1;
  private readonly queue: TDirective[] = [];
  private windowsOpenedCount = 0;
  private lastTriggerKind: RecoveryTrigger | null = null;
  // GP-002: two more decaying accumulators, the exact same shape as
  // recentDamage above — Average Kill Speed and Near Deaths, both registered
  // Adaptive Response inputs (AF-056) with no producer until now.
  private aliveMs = 0;
  private recentKillsValue = 0;
  private recentNearDeathImpulse = 0;
  private nearDeathTotal = 0;

  /** Advances the window/cooldown clocks and decays struggle; returns every
   * directive whose wait just ended — a flush of two different faction
   * directives in one tick IS a dual-faction moment (§Faction Mixing). */
  update(dtMs: number, hullFraction: number): TDirective[] {
    this.hullFraction = Math.max(0, Math.min(1, hullFraction));
    this.aliveMs += dtMs;
    // Exponential decay of the recent-damage accumulator (halflife-based).
    this.recentDamage *= Math.pow(0.5, dtMs / CONDUCTOR_TUNING.struggleHalfLifeMs);
    this.recentKillsValue *= Math.pow(0.5, dtMs / CONDUCTOR_TUNING.killSpeedHalfLifeMs);
    this.recentNearDeathImpulse *= Math.pow(0.5, dtMs / CONDUCTOR_TUNING.nearDeathHalfLifeMs);
    if (this.cooldownRemainingMs > 0) this.cooldownRemainingMs = Math.max(0, this.cooldownRemainingMs - dtMs);
    if (this.windowRemainingMs > 0) {
      this.windowRemainingMs = Math.max(0, this.windowRemainingMs - dtMs);
      if (this.windowRemainingMs === 0) return this.queue.splice(0, this.queue.length);
    }
    return [];
  }

  /** Adaptive Response's live inputs — Damage Taken feeds the accumulator... */
  recordPlayerDamaged(amount: number): void {
    this.recentDamage += amount;
  }

  /** GP-002: Average Kill Speed — a decaying per-kill impulse; the composition root calls this once per kill. */
  recordKill(): void {
    this.recentKillsValue += 1;
  }

  /** GP-002: Near Deaths — a decaying per-event impulse; the composition root
   * calls this once per hull-fraction crossing below its own critical
   * threshold, never every tick spent under it (an edge, not a level). */
  recordNearDeath(): void {
    this.recentNearDeathImpulse += 1;
    this.nearDeathTotal += 1;
  }

  /** ...and combines with Player Health, Average Kill Speed, and Near Deaths into one struggle score in [0, 1]. */
  get struggleScore(): number {
    const damageStruggle = Math.min(1, this.recentDamage / CONDUCTOR_TUNING.struggleReferenceDamage);
    const healthStruggle = 1 - this.hullFraction;
    // Low recent kill throughput reads as struggle — but only once the
    // encounter has run long enough that "zero kills so far" is a real
    // signal rather than just the run having barely started.
    const clearSpeedStruggle =
      this.aliveMs > CONDUCTOR_TUNING.killSpeedWarmupMs
        ? Math.max(0, 1 - this.recentKillsValue / CONDUCTOR_TUNING.killSpeedReference)
        : 0;
    const nearDeathStruggle = Math.min(1, this.recentNearDeathImpulse / CONDUCTOR_TUNING.nearDeathReference);
    return Math.max(damageStruggle, healthStruggle, clearSpeedStruggle, nearDeathStruggle);
  }

  /** Opens a Recovery Window unless one is open or cooling down — windows
   * never chain, so recovery can never become excessive by stacking. */
  openRecoveryWindow(trigger: RecoveryTrigger): boolean {
    if (this.windowRemainingMs > 0 || this.cooldownRemainingMs > 0) return false;
    const struggle = this.struggleScore;
    this.windowRemainingMs =
      CONDUCTOR_TUNING.minWindowMs + struggle * (CONDUCTOR_TUNING.maxWindowMs - CONDUCTOR_TUNING.minWindowMs);
    this.cooldownRemainingMs = CONDUCTOR_TUNING.windowCooldownMs;
    this.windowsOpenedCount += 1;
    this.lastTriggerKind = trigger;
    return true;
  }

  /** The composition root reports each landed wave's size; a large one earns
   * the breathing room the spec promises after Large Enemy Waves. */
  notifyWaveLanded(enemyCount: number): void {
    if (enemyCount >= CONDUCTOR_TUNING.largeWaveThreshold) this.openRecoveryWindow("largeEnemyWaves");
  }

  /** The gate: returns the directives to execute NOW. Outside a window the
   * directive passes straight through; inside one it waits in the queue —
   * and if the queue would overflow, the oldest flushes immediately instead
   * (§Spawn Rules: pressure is deferred, never deleted — no soft locks,
   * and no directive is ever silently dropped). */
  gateDirective(directive: TDirective): TDirective[] {
    if (this.windowRemainingMs <= 0) return [directive];
    this.queue.push(directive);
    if (this.queue.length > CONDUCTOR_TUNING.maxQueuedDirectives) {
      return [this.queue.shift()!];
    }
    return [];
  }

  get windowOpen(): boolean {
    return this.windowRemainingMs > 0;
  }

  get queuedCount(): number {
    return this.queue.length;
  }

  get snapshot(): ConductorSnapshot {
    return {
      windowOpen: this.windowOpen,
      windowRemainingMs: this.windowRemainingMs,
      cooldownRemainingMs: this.cooldownRemainingMs,
      queuedDirectives: this.queue.length,
      struggleScore: this.struggleScore,
      windowsOpened: this.windowsOpenedCount,
      lastTrigger: this.lastTriggerKind,
      recentKills: this.recentKillsValue,
      nearDeathCount: this.nearDeathTotal,
    };
  }
}
