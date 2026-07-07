/**
 * Boss Director runtime (AF-057 §Boss Director Responsibilities): the one
 * genuinely new mechanical surface of the Boss Director Framework — and,
 * like AF-056's conductor, a layer whose subject is orchestration, not a
 * combatant. AF-035's BossRuntime remains byte-for-byte unmodified and
 * keeps owning phases, enrage, weak points, and its own state machine; the
 * director decorates the encounter AROUND it: between-phase transition
 * windows during which the boss holds fire (recovery through skill — the
 * player repositions, nothing heals), a cadence-drained summon queue fed by
 * a data-driven per-phase plan, arena escalation for the existing AF-035
 * hazard zone, cinematic one-shots (AF-053's consume-event shape, a third
 * reuse after AF-055's echoes), and paced Reward Ceremony lines. Boss
 * Memory's arithmetic lives here as a pure helper; the composition root
 * persists it through AF-026's existing stats. Deterministic — the
 * director holds no RNG. Pure and bus-free, like every prior *Runtime.
 */
import { BOSS_DIRECTOR_TUNING, type BossSummonSpec, type CinematicBeat } from "./bossDirectorData";

export interface BossDirectorSnapshot {
  transitionActive: boolean;
  transitionRemainingMs: number;
  queuedSummons: number;
  summonsIssued: number;
  queuedCeremonyLines: number;
  cinematicsFired: number;
}

export class BossDirectorRuntime {
  private transitionRemainingMs = 0;
  private summonClockMs = 0;
  private ceremonyClockMs = 0;
  private readonly summonQueue: BossSummonSpec[] = [];
  private readonly ceremonyQueue: string[] = [];
  private readonly cinematicQueue: CinematicBeat[] = [];
  private summonsIssuedCount = 0;
  private cinematicsFiredCount = 0;

  constructor(
    readonly bossId: string,
    private readonly summonPlan: Readonly<Record<number, readonly BossSummonSpec[]>>,
  ) {
    this.cinematicQueue.push("bossArrival");
  }

  /** Advances every director clock. Summons and ceremony lines are pulled
   * via the consume methods; this only makes them eligible. */
  update(dtMs: number): void {
    if (this.transitionRemainingMs > 0) {
      this.transitionRemainingMs = Math.max(0, this.transitionRemainingMs - dtMs);
    } else {
      this.summonClockMs += dtMs;
    }
    this.ceremonyClockMs += dtMs;
  }

  /** A phase was entered: open the breathing-room window and enqueue that
   * phase's summon plan (§Phase Management: summons + arena layout). */
  notifyPhaseChanged(enteredPhaseIndex: number): void {
    this.transitionRemainingMs = BOSS_DIRECTOR_TUNING.phaseTransitionRecoveryMs;
    this.summonClockMs = 0;
    for (const spec of this.summonPlan[enteredPhaseIndex] ?? []) {
      if (this.summonQueue.length < BOSS_DIRECTOR_TUNING.maxQueuedSummons) this.summonQueue.push(spec);
    }
  }

  notifyDefeated(): void {
    this.cinematicQueue.push("victorySequence");
    this.transitionRemainingMs = 0;
    this.summonQueue.length = 0; // the vault's guards stand down with their warden
  }

  /** Recovery through skill: the boss holds fire while the arena evolves. */
  get attacksHeld(): boolean {
    return this.transitionRemainingMs > 0;
  }

  get transitionActive(): boolean {
    return this.transitionRemainingMs > 0;
  }

  /** One summon spec per cadence tick, only after the breathing room ends —
   * a queue, never a dump (§Summon System / DEBUG's Summon Queue). */
  consumeSummon(): BossSummonSpec | null {
    if (this.transitionRemainingMs > 0) return null;
    if (this.summonQueue.length === 0) return null;
    if (this.summonClockMs < BOSS_DIRECTOR_TUNING.summonCadenceMs) return null;
    this.summonClockMs = 0;
    this.summonsIssuedCount += 1;
    return this.summonQueue.shift()!;
  }

  /** Cinematic one-shots — AF-053's consume-event shape, presentation only. */
  consumeCinematicEvent(): CinematicBeat | null {
    const beat = this.cinematicQueue.shift() ?? null;
    if (beat) this.cinematicsFiredCount += 1;
    return beat;
  }

  /** Arena escalation: the existing AF-035 hazard zone grows per phase reached. */
  hazardRadiusScaleFor(phaseIndex: number): number {
    return 1 + phaseIndex * BOSS_DIRECTOR_TUNING.hazardRadiusGrowthPerPhase;
  }

  /** Reward Ceremony pacing — lines land one at a time (§Reward Ceremony). */
  queueCeremonyLines(lines: readonly string[]): void {
    this.ceremonyQueue.push(...lines);
    this.ceremonyClockMs = BOSS_DIRECTOR_TUNING.ceremonyLineCadenceMs; // first line lands immediately
  }

  consumeCeremonyLine(): string | null {
    if (this.ceremonyQueue.length === 0) return null;
    if (this.ceremonyClockMs < BOSS_DIRECTOR_TUNING.ceremonyLineCadenceMs) return null;
    this.ceremonyClockMs = 0;
    return this.ceremonyQueue.shift()!;
  }

  /** Boss Memory arithmetic (pure): the AF-026 stat delta that makes a
   * recorded fastest-kill stat equal the new best — or zero if it stands. */
  static fastestKillStatDelta(currentBestMs: number, killTimeMs: number): number {
    if (currentBestMs <= 0) return killTimeMs;
    if (killTimeMs < currentBestMs) return killTimeMs - currentBestMs;
    return 0;
  }

  get snapshot(): BossDirectorSnapshot {
    return {
      transitionActive: this.transitionActive,
      transitionRemainingMs: this.transitionRemainingMs,
      queuedSummons: this.summonQueue.length,
      summonsIssued: this.summonsIssuedCount,
      queuedCeremonyLines: this.ceremonyQueue.length,
      cinematicsFired: this.cinematicsFiredCount,
    };
  }
}
