/**
 * Adaptive Enemy Director (AF-017): the pacing brain of every expedition.
 * Walks a data-driven phase cycle, accrues a spawn budget throttled by phase
 * intensity and deterministic threat, and emits spawn directives that the
 * Enemy System (AF-021+) materialises. It never touches player performance:
 * the forbidden inputs (accuracy, mistakes, loot) are simply not part of its
 * interface — fairness by construction.
 */
import type { System } from "../../core/GameManager";
import type { Rng } from "../../core/rng/Rng";
import {
  ENVIRONMENTAL_EVENTS,
  type DirectorPhase,
  type DirectorTuning,
  type EnvironmentalEventType,
  type WaveType,
} from "./directorTuning";

export interface ThreatInputs {
  missionDifficulty: number;
  biomeModifier: number;
  mutatorModifier: number;
  ascension: number;
  playerLevel: number;
  equipmentQuality: number;
}

/** Deterministic threat (AF-017 §3). Pure — same inputs, same threat, always. */
export function computeThreat(
  inputs: ThreatInputs,
  elapsedMs: number,
  tuning: DirectorTuning,
): number {
  const w = tuning.threatWeights;
  const base =
    inputs.missionDifficulty *
    (1 + w.ascensionFactor * inputs.ascension) *
    inputs.biomeModifier *
    inputs.mutatorModifier;
  const timeFactor = 1 + w.elapsedSlopePerMinute * (elapsedMs / 60_000);
  const playerFactor =
    1 + w.levelWeight * inputs.playerLevel + w.equipmentWeight * inputs.equipmentQuality;
  const threat = base * timeFactor * playerFactor;
  return Math.min(tuning.threatClamp.max, Math.max(tuning.threatClamp.min, threat));
}

/** Fairness contract carried on every directive (AF-017 §6). */
export interface SpawnPlacement {
  minDistanceFromPlayer: number;
  avoidSafeZones: true;
  telegraphMs: number;
}

export interface SpawnDirective {
  waveType: WaveType;
  budgetCost: number;
  eliteCount: number;
  placement: SpawnPlacement;
}

export interface DirectorSnapshot {
  phase: DirectorPhase;
  threat: number;
  budget: number;
  activeEnemies: number;
  activeElites: number;
  lastWave: WaveType | null;
  bossActive: boolean;
}

export interface EnemyDirectorOptions {
  tuning: DirectorTuning;
  /** Fork of the mission-seed RNG (e.g. rng.fork("director")). */
  rng: Rng;
  threatInputs: ThreatInputs;
  onDirective?: (directive: SpawnDirective) => void;
  onPhaseChanged?: (from: DirectorPhase, to: DirectorPhase) => void;
  onEnvironmentalEvent?: (event: EnvironmentalEventType) => void;
  /**
   * GP-FINAL §Run Structure: when true, the phase cycle wraps back to its
   * start once exhausted instead of handing off to BossHandoff — boss
   * encounters are triggered externally, by wave count, via pauseForBoss/
   * resumeAfterBoss below. Defaults to false, so every existing caller's
   * terminate-into-BossHandoff behaviour (and the tests asserting it) is
   * unchanged unless a caller opts in.
   */
  loop?: boolean;
}

export class EnemyDirector implements System {
  readonly name = "enemy-director";

  private readonly tuning: DirectorTuning;
  private readonly rng: Rng;
  private threatInputs: ThreatInputs;
  private readonly onDirective: ((d: SpawnDirective) => void) | undefined;
  private readonly onPhaseChanged: ((from: DirectorPhase, to: DirectorPhase) => void) | undefined;
  private readonly onEnvironmentalEvent: ((e: EnvironmentalEventType) => void) | undefined;

  private phase: DirectorPhase;
  private stepIndex = 0;
  private phaseRemainingMs: number;
  private elapsedMs = 0;
  private budget = 0;
  private decisionClockMs = 0;
  private activeEnemies = 0;
  private activeElites = 0;
  private lastWave: WaveType | null = null;
  private lastEnvironmentalEvent: EnvironmentalEventType | null = null;
  private bossActive = false;
  private readonly loop: boolean;
  /** GP-FINAL §Run Structure: true while an externally-triggered (wave-count
   * driven) boss encounter is live — spawning pauses without touching the
   * phase sequence's own position, so it resumes exactly where it left off. */
  private externallyPaused = false;

  constructor(options: EnemyDirectorOptions) {
    this.tuning = options.tuning;
    this.rng = options.rng;
    this.threatInputs = options.threatInputs;
    this.loop = options.loop ?? false;
    this.onDirective = options.onDirective;
    this.onPhaseChanged = options.onPhaseChanged;
    this.onEnvironmentalEvent = options.onEnvironmentalEvent;
    const first = this.tuning.phaseSequence[0];
    if (!first) throw new Error("EnemyDirector: empty phase sequence");
    this.phase = first.phase;
    this.phaseRemainingMs = this.jitteredDuration(first.durationMs);
    this.enterPhase(this.phase, null);
  }

  update(fixedDtMs: number): void {
    if (this.externallyPaused || this.phase === "BossHandoff" || this.phase === "Reward") return;

    this.elapsedMs += fixedDtMs;
    const intensity = this.tuning.phaseIntensity[this.phase];
    this.budget +=
      (this.tuning.budgetRatePerSecond * intensity * this.threat * fixedDtMs) / 1000;

    this.decisionClockMs += fixedDtMs;
    while (this.decisionClockMs >= this.tuning.decisionIntervalMs) {
      this.decisionClockMs -= this.tuning.decisionIntervalMs;
      this.decide();
    }

    this.phaseRemainingMs -= fixedDtMs;
    if (this.phaseRemainingMs <= 0) this.advancePhase();
  }

  get threat(): number {
    return computeThreat(this.threatInputs, this.elapsedMs, this.tuning);
  }

  get snapshot(): DirectorSnapshot {
    return {
      phase: this.phase,
      threat: this.threat,
      budget: this.budget,
      activeEnemies: this.activeEnemies,
      activeElites: this.activeElites,
      lastWave: this.lastWave,
      bossActive: this.bossActive,
    };
  }

  setThreatInputs(inputs: Partial<ThreatInputs>): void {
    this.threatInputs = { ...this.threatInputs, ...inputs };
  }

  /** The Enemy System reports materialised spawns so caps stay honest. */
  notifyEnemiesSpawned(count: number, elites = 0): void {
    this.activeEnemies += count;
    this.activeElites += elites;
  }

  notifyEnemiesRemoved(count: number, elites = 0): void {
    this.activeEnemies = Math.max(0, this.activeEnemies - count);
    this.activeElites = Math.max(0, this.activeElites - elites);
  }

  /** Boss owns the encounter: all spawning and events pause (AF-017 §5). */
  endBossEncounter(): void {
    if (this.phase !== "BossHandoff") return;
    this.setPhase("Reward");
  }

  /**
   * GP-FINAL §Run Structure: pause spawning for an externally-triggered
   * (wave-count driven) boss encounter — Mini/Major Boss, or the existing
   * Push-Deeper World Boss roll — without touching the phase sequence's own
   * position, so ordinary pacing resumes exactly where it left off after.
   */
  pauseForBoss(): void {
    this.externallyPaused = true;
    this.bossActive = true;
  }

  /** GP-FINAL §Run Structure: resume ordinary spawning once the boss encounter ends. */
  resumeAfterBoss(): void {
    this.externallyPaused = false;
    this.bossActive = false;
  }

  private decide(): void {
    const options = this.tuning.wavesByPhase[this.phase];
    if (!options || options.length === 0) return;
    if (this.activeEnemies >= this.tuning.maxActiveEnemies) return;

    const candidates =
      options.length > 1 && this.lastWave !== null
        ? options.filter((w) => w !== this.lastWave)
        : options;
    const waveType = candidates.length === 1 ? (candidates[0] as WaveType) : this.rng.pick(candidates);
    const cost = this.tuning.waveCost[waveType];
    if (this.budget < cost) return;

    let eliteCount = 0;
    if (waveType === "EliteSquad") {
      eliteCount = Math.min(
        this.tuning.eliteSquadSize,
        this.tuning.maxSimultaneousElites - this.activeElites,
      );
      if (eliteCount <= 0) return; // never breach the elite cap — skip, don't shrink to zero elites
    }

    this.budget -= cost;
    this.lastWave = waveType;
    this.onDirective?.(this.makeDirective(waveType, cost, eliteCount));
  }

  private makeDirective(waveType: WaveType, cost: number, eliteCount: number): SpawnDirective {
    return {
      waveType,
      budgetCost: cost,
      eliteCount,
      placement: {
        minDistanceFromPlayer: this.tuning.minSpawnDistanceFromPlayer,
        avoidSafeZones: true,
        telegraphMs: this.tuning.spawnTelegraphMs,
      },
    };
  }

  private advancePhase(): void {
    this.stepIndex += 1;
    const step = this.tuning.phaseSequence[this.stepIndex];
    if (!step) {
      // GP-FINAL §Run Structure: looping directors wrap back to the start of
      // the cycle instead of terminating — boss encounters are triggered
      // externally, by wave count, via pauseForBoss/resumeAfterBoss, so the
      // ordinary pacing cycle keeps running for the whole (now longer) run.
      if (this.loop) {
        this.stepIndex = 0;
        const first = this.tuning.phaseSequence[0]!;
        this.phaseRemainingMs = this.jitteredDuration(first.durationMs);
        this.setPhase(first.phase);
        return;
      }
      // Cycle complete: hand the encounter to the Boss (AF-017 §5).
      this.bossActive = true;
      this.onDirective?.(this.makeDirective("BossWave", 0, 0));
      this.setPhase("BossHandoff");
      return;
    }
    this.phaseRemainingMs = this.jitteredDuration(step.durationMs);
    this.setPhase(step.phase);
  }

  private setPhase(next: DirectorPhase): void {
    const previous = this.phase;
    this.phase = next;
    if (next !== "BossHandoff") this.bossActive = false;
    this.enterPhase(next, previous);
    this.onPhaseChanged?.(previous, next);
  }

  private enterPhase(phase: DirectorPhase, _from: DirectorPhase | null): void {
    if (phase === "EnvironmentalEvent") {
      const candidates =
        this.lastEnvironmentalEvent === null
          ? ENVIRONMENTAL_EVENTS
          : ENVIRONMENTAL_EVENTS.filter((e) => e !== this.lastEnvironmentalEvent);
      const event = this.rng.pick(candidates);
      this.lastEnvironmentalEvent = event;
      this.onEnvironmentalEvent?.(event);
    }
    if (phase === "MiniBoss") {
      const cost = this.tuning.waveCost.MiniBossWave;
      this.lastWave = "MiniBossWave";
      this.onDirective?.(this.makeDirective("MiniBossWave", Math.min(cost, this.budget), 0));
      this.budget = Math.max(0, this.budget - cost);
    }
  }

  private jitteredDuration(baseMs: number): number {
    const ratio = this.tuning.phaseDurationJitterRatio;
    return baseMs * this.rng.float(1 - ratio, 1 + ratio);
  }
}
