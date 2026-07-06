import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  EnemyDirector,
  computeThreat,
  type SpawnDirective,
  type ThreatInputs,
} from "../src/game/director/EnemyDirector";
import {
  DEFAULT_DIRECTOR_TUNING,
  type DirectorPhase,
  type DirectorTuning,
} from "../src/game/director/directorTuning";

const baseInputs: ThreatInputs = {
  missionDifficulty: 1,
  biomeModifier: 1,
  mutatorModifier: 1,
  ascension: 0,
  playerLevel: 1,
  equipmentQuality: 1,
};

/** Compressed cycle so simulated missions complete in milliseconds. */
const fastTuning: DirectorTuning = {
  ...DEFAULT_DIRECTOR_TUNING,
  phaseSequence: DEFAULT_DIRECTOR_TUNING.phaseSequence.map((step) => ({
    phase: step.phase,
    durationMs: step.durationMs / 20,
  })),
  decisionIntervalMs: 50,
  budgetRatePerSecond: 60,
};

interface SimResult {
  directives: SpawnDirective[];
  /** Pacing phase in effect when each directive was issued. */
  directivePhases: DirectorPhase[];
  phases: DirectorPhase[];
  events: string[];
  eliteCapBreached: boolean;
  budgetWentNegative: boolean;
  directiveDuringHandoff: boolean;
  msByPhase: Map<DirectorPhase, number>;
  totalMs: number;
}

function simulateMission(seed: number): SimResult {
  const result: SimResult = {
    directives: [],
    directivePhases: [],
    phases: [],
    events: [],
    eliteCapBreached: false,
    budgetWentNegative: false,
    directiveDuringHandoff: false,
    msByPhase: new Map(),
    totalMs: 0,
  };
  const director = new EnemyDirector({
    tuning: fastTuning,
    rng: new Rng(seed).fork("director"),
    threatInputs: baseInputs,
    onDirective: (directive) => {
      result.directives.push(directive);
      result.directivePhases.push(director.snapshot.phase);
      if (director.snapshot.phase === "BossHandoff") result.directiveDuringHandoff = true;
      // Simulate the Enemy System materialising the wave (cost ≈ enemy count).
      director.notifyEnemiesSpawned(Math.max(1, Math.round(directive.budgetCost)), directive.eliteCount);
      if (director.snapshot.activeElites > fastTuning.maxSimultaneousElites) {
        result.eliteCapBreached = true;
      }
    },
    onPhaseChanged: (_from, to) => result.phases.push(to),
    onEnvironmentalEvent: (event) => result.events.push(event),
  });

  const stepMs = 16;
  let clearClock = 0;
  for (let step = 0; step < 5000 && director.snapshot.phase !== "BossHandoff"; step += 1) {
    director.update(stepMs);
    result.totalMs += stepMs;
    const phase = director.snapshot.phase;
    result.msByPhase.set(phase, (result.msByPhase.get(phase) ?? 0) + stepMs);
    if (director.snapshot.budget < 0) result.budgetWentNegative = true;
    // Simulated player clears enemies steadily (deterministic).
    clearClock += stepMs;
    if (clearClock >= 100) {
      clearClock -= 100;
      director.notifyEnemiesRemoved(3, director.snapshot.activeElites > 0 && step % 25 === 0 ? 1 : 0);
    }
  }
  return result;
}

describe("computeThreat (deterministic, AF-017 §3)", () => {
  it("is pure and repeatable", () => {
    const a = computeThreat(baseInputs, 120_000, DEFAULT_DIRECTOR_TUNING);
    const b = computeThreat(baseInputs, 120_000, DEFAULT_DIRECTOR_TUNING);
    expect(a).toBe(b);
  });

  it("rises with elapsed time, difficulty, and ascension — never with mistakes (no such input exists)", () => {
    const early = computeThreat(baseInputs, 0, DEFAULT_DIRECTOR_TUNING);
    const late = computeThreat(baseInputs, 600_000, DEFAULT_DIRECTOR_TUNING);
    expect(late).toBeGreaterThan(early);
    const harder = computeThreat({ ...baseInputs, missionDifficulty: 2 }, 0, DEFAULT_DIRECTOR_TUNING);
    expect(harder).toBeGreaterThan(early);
    const ascended = computeThreat({ ...baseInputs, ascension: 4 }, 0, DEFAULT_DIRECTOR_TUNING);
    expect(ascended).toBeGreaterThan(early);
  });

  it("clamps to the tuned range", () => {
    const extreme = computeThreat(
      { ...baseInputs, missionDifficulty: 1000 },
      3_600_000,
      DEFAULT_DIRECTOR_TUNING,
    );
    expect(extreme).toBe(DEFAULT_DIRECTOR_TUNING.threatClamp.max);
  });
});

describe("EnemyDirector — determinism", () => {
  it("same seed produces an identical encounter script", () => {
    const script = (seed: number): string =>
      JSON.stringify(simulateMission(seed).directives) + simulateMission(seed).phases.join(",");
    expect(script(42)).toBe(script(42));
  });

  it("different seeds produce different encounter scripts", () => {
    const a = simulateMission(1);
    const b = simulateMission(2);
    expect(JSON.stringify(a.directives)).not.toBe(JSON.stringify(b.directives));
  });
});

describe("EnemyDirector — simulated mission invariants (AF-017 self-review, 300 seeded runs)", () => {
  const runs = Array.from({ length: 300 }, (_, i) => simulateMission(i + 1));

  it("never overspends the budget", () => {
    expect(runs.every((r) => !r.budgetWentNegative)).toBe(true);
  });

  it("never breaches the simultaneous elite cap", () => {
    expect(runs.every((r) => !r.eliteCapBreached)).toBe(true);
  });

  it("issues no directives during boss handoff (boss owns the encounter)", () => {
    expect(runs.every((r) => !r.directiveDuringHandoff)).toBe(true);
  });

  it("reaches the boss handoff with a BossWave directive in every run", () => {
    for (const run of runs) {
      expect(run.phases.at(-1)).toBe("BossHandoff");
      expect(run.directives.at(-1)?.waveType).toBe("BossWave");
    }
  });

  it("walks the tuned pacing cycle in order (recovery follows every pressure spike)", () => {
    const expected = fastTuning.phaseSequence.slice(1).map((s) => s.phase);
    for (const run of runs) {
      expect(run.phases.slice(0, expected.length)).toEqual(expected);
    }
  });

  it("never sustains maximum intensity for the majority of a mission", () => {
    for (const run of runs) {
      const heavy = run.msByPhase.get("HeavyCombat") ?? 0;
      expect(heavy / run.totalMs).toBeLessThan(0.5);
    }
  });

  it("never repeats the same wave type consecutively when alternatives exist", () => {
    for (const run of runs) {
      for (let i = 1; i < run.directives.length; i += 1) {
        const previous = run.directives[i - 1];
        const current = run.directives[i];
        const phase = run.directivePhases[i];
        if (!previous || !current || !phase) continue;
        // Repetition is only forbidden when the issuing phase offered a choice.
        const options = fastTuning.wavesByPhase[phase];
        if (!options || options.length <= 1) continue;
        if (current.waveType === "MiniBossWave" || current.waveType === "BossWave") continue;
        expect(current.waveType).not.toBe(previous.waveType);
      }
    }
  });

  it("carries the fairness contract on every directive", () => {
    for (const run of runs) {
      for (const directive of run.directives) {
        expect(directive.placement.minDistanceFromPlayer).toBeGreaterThan(0);
        expect(directive.placement.avoidSafeZones).toBe(true);
        if (directive.waveType !== "BossWave") {
          expect(directive.placement.telegraphMs).toBeGreaterThanOrEqual(500);
        }
      }
    }
  });

  it("triggers exactly one environmental event per cycle and varies it across runs", () => {
    for (const run of runs) {
      expect(run.events).toHaveLength(1);
    }
    const distinctEvents = new Set(runs.map((r) => r.events[0]));
    expect(distinctEvents.size).toBeGreaterThan(3);
  });

  it("elite squads always contain at least one elite (skip beats shrink-to-zero)", () => {
    for (const run of runs) {
      for (const directive of run.directives) {
        if (directive.waveType === "EliteSquad") {
          expect(directive.eliteCount).toBeGreaterThan(0);
          expect(directive.eliteCount).toBeLessThanOrEqual(fastTuning.maxSimultaneousElites);
        }
      }
    }
  });

  it("resumes to Reward when the boss encounter ends", () => {
    const director = new EnemyDirector({
      tuning: fastTuning,
      rng: new Rng(7).fork("director"),
      threatInputs: baseInputs,
    });
    for (let i = 0; i < 5000 && director.snapshot.phase !== "BossHandoff"; i += 1) {
      director.update(16);
    }
    expect(director.snapshot.phase).toBe("BossHandoff");
    director.endBossEncounter();
    expect(director.snapshot.phase).toBe("Reward");
  });
});
