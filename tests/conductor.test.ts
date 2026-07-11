import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { DirectorConductor } from "../src/game/director/DirectorConductor";
import {
  ADAPTIVE_RESPONSE_INPUTS,
  CONDUCTOR_TUNING,
  DIRECTOR_RESPONSIBILITIES,
  ENCOUNTER_TYPES_AF056,
  FACTION_MIX_KINDS,
  PACING_PRESSURES,
  RECOVERY_TRIGGERS,
  WAVE_TYPE_TO_ENCOUNTER_TYPE,
  pressureFor,
} from "../src/game/director/conductorData";
import { EnemyDirector, type SpawnDirective } from "../src/game/director/EnemyDirector";
import { DEFAULT_DIRECTOR_TUNING, type DirectorPhase, type WaveType } from "../src/game/director/directorTuning";

const ALL_WAVE_TYPES: readonly WaveType[] = [
  "AmbientPatrol",
  "SwarmWave",
  "HunterPack",
  "EliteSquad",
  "ReinforcementWave",
  "AmbushEvent",
  "MiniBossWave",
  "BossWave",
  "MixedEncounter",
];

const ALL_PHASES: readonly DirectorPhase[] = [
  "Recovery",
  "LightContact",
  "Combat",
  "HeavyCombat",
  "ElitePressure",
  "EnvironmentalEvent",
  "MiniBoss",
  "BossHandoff",
  "Reward",
];

describe("Conductor vocabulary — registered shelves (AF-056 §Responsibilities / §Encounter Types / §Pacing)", () => {
  it("registers nine responsibilities, ten encounter types, six pressures, five recovery triggers, eight adaptive inputs, six mix kinds", () => {
    expect(DIRECTOR_RESPONSIBILITIES.length).toBe(9);
    expect(ENCOUNTER_TYPES_AF056.length).toBe(10);
    expect(PACING_PRESSURES.length).toBe(6);
    expect(RECOVERY_TRIGGERS.length).toBe(5);
    expect(ADAPTIVE_RESPONSE_INPUTS.length).toBe(8);
    expect(FACTION_MIX_KINDS.length).toBe(6);
  });

  it("every AF-017 WaveType names an AF-056 encounter type — the faction routings ARE the encounter catalogue", () => {
    for (const waveType of ALL_WAVE_TYPES) {
      expect(ENCOUNTER_TYPES_AF056).toContain(WAVE_TYPE_TO_ENCOUNTER_TYPE[waveType]);
    }
  });

  it("every Director phase maps to a valid pressure, and an open window overrides everything to recovery", () => {
    const seen = new Set<string>();
    for (const phase of ALL_PHASES) {
      const pressure = pressureFor(phase, false);
      expect(PACING_PRESSURES).toContain(pressure);
      seen.add(pressure);
      expect(pressureFor(phase, true)).toBe("recovery");
    }
    expect(seen.size).toBe(5); // all five non-recovery pressures reachable from phases alone
  });
});

describe("DirectorConductor — Recovery Windows (AF-056 §Recovery Windows)", () => {
  it("opens a window for every one of the five triggers", () => {
    for (const trigger of RECOVERY_TRIGGERS) {
      const conductor = new DirectorConductor<string>();
      expect(conductor.openRecoveryWindow(trigger)).toBe(true);
      expect(conductor.windowOpen).toBe(true);
      expect(conductor.snapshot.lastTrigger).toBe(trigger);
    }
  });

  it("a dominating player gets barely a pause; a struggling one gets the full breath — hard-capped either way", () => {
    const dominating = new DirectorConductor<string>();
    dominating.update(16, 1); // full hull, no damage taken
    dominating.openRecoveryWindow("eliteBattles");
    expect(dominating.snapshot.windowRemainingMs).toBe(CONDUCTOR_TUNING.minWindowMs);

    const struggling = new DirectorConductor<string>();
    struggling.recordPlayerDamaged(10000);
    struggling.update(16, 0.1);
    struggling.openRecoveryWindow("eliteBattles");
    expect(struggling.snapshot.windowRemainingMs).toBe(CONDUCTOR_TUNING.maxWindowMs); // never exceeds the cap
  });

  it("windows never chain — a fresh trigger during the window or its cooldown is ignored", () => {
    const conductor = new DirectorConductor<string>();
    expect(conductor.openRecoveryWindow("eliteBattles")).toBe(true);
    expect(conductor.openRecoveryWindow("majorEvents")).toBe(false); // window open
    conductor.update(CONDUCTOR_TUNING.maxWindowMs, 1); // window fully elapses
    expect(conductor.windowOpen).toBe(false);
    expect(conductor.openRecoveryWindow("majorEvents")).toBe(false); // still cooling down
    conductor.update(CONDUCTOR_TUNING.windowCooldownMs, 1);
    expect(conductor.openRecoveryWindow("majorEvents")).toBe(true); // cooldown elapsed
  });

  it("only a genuinely large wave earns breathing room", () => {
    const conductor = new DirectorConductor<string>();
    conductor.notifyWaveLanded(CONDUCTOR_TUNING.largeWaveThreshold - 1);
    expect(conductor.windowOpen).toBe(false);
    conductor.notifyWaveLanded(CONDUCTOR_TUNING.largeWaveThreshold);
    expect(conductor.windowOpen).toBe(true);
    expect(conductor.snapshot.lastTrigger).toBe("largeEnemyWaves");
  });
});

describe("DirectorConductor — Spawn Queue (AF-056 §Spawn System / §Spawn Rules)", () => {
  it("directives pass straight through while no window is open", () => {
    const conductor = new DirectorConductor<string>();
    expect(conductor.gateDirective("wave-1")).toEqual(["wave-1"]);
    expect(conductor.queuedCount).toBe(0);
  });

  it("directives wait during a window and flush the tick it closes — never deleted, only deferred", () => {
    const conductor = new DirectorConductor<string>();
    conductor.openRecoveryWindow("eliteBattles");
    expect(conductor.gateDirective("wave-1")).toEqual([]);
    expect(conductor.gateDirective("wave-2")).toEqual([]);
    expect(conductor.queuedCount).toBe(2);
    const flushed = conductor.update(CONDUCTOR_TUNING.maxWindowMs, 1);
    expect(flushed).toEqual(["wave-1", "wave-2"]); // two directives landing together — a dual-faction moment
    expect(conductor.queuedCount).toBe(0);
  });

  it("queue overflow flushes the oldest immediately — soft-lock prevention, FIFO preserved", () => {
    const conductor = new DirectorConductor<string>();
    conductor.recordPlayerDamaged(10000);
    conductor.update(16, 0.1);
    conductor.openRecoveryWindow("eliteBattles");
    for (let i = 1; i <= CONDUCTOR_TUNING.maxQueuedDirectives; i += 1) {
      expect(conductor.gateDirective(`wave-${i}`)).toEqual([]);
    }
    expect(conductor.gateDirective("wave-overflow")).toEqual(["wave-1"]); // oldest lands now
    expect(conductor.queuedCount).toBe(CONDUCTOR_TUNING.maxQueuedDirectives);
  });

  it("holds no RNG at all — identical inputs produce identical outputs", () => {
    const run = () => {
      const conductor = new DirectorConductor<string>();
      const log: string[] = [];
      conductor.recordPlayerDamaged(25);
      conductor.openRecoveryWindow("majorEvents");
      log.push(...conductor.gateDirective("a"), ...conductor.gateDirective("b"));
      for (let i = 0; i < 10; i += 1) log.push(...conductor.update(1000, 0.8));
      return { log, snapshot: conductor.snapshot };
    };
    expect(run()).toEqual(run());
  });
});

describe("DirectorConductor — Adaptive Response (AF-056 §Adaptive Response)", () => {
  it("struggle rises with damage taken and decays over time", () => {
    const conductor = new DirectorConductor<string>();
    expect(conductor.struggleScore).toBe(0);
    conductor.recordPlayerDamaged(CONDUCTOR_TUNING.struggleReferenceDamage);
    expect(conductor.struggleScore).toBe(1);
    conductor.update(CONDUCTOR_TUNING.struggleHalfLifeMs, 1);
    expect(conductor.struggleScore).toBeCloseTo(0.5, 5);
  });

  it("low hull alone counts as struggle — Player Health is a live input", () => {
    const conductor = new DirectorConductor<string>();
    conductor.update(16, 0.25);
    expect(conductor.struggleScore).toBeCloseTo(0.75, 5);
  });
});

describe("GP-002 — Average Kill Speed and Near Deaths, now live Adaptive Response inputs", () => {
  it("zero kills read as zero struggle before the warmup period elapses", () => {
    const conductor = new DirectorConductor<string>();
    conductor.update(CONDUCTOR_TUNING.killSpeedWarmupMs - 1, 1);
    expect(conductor.struggleScore).toBe(0);
  });

  it("zero kills past the warmup period reads as full clear-speed struggle", () => {
    const conductor = new DirectorConductor<string>();
    conductor.update(CONDUCTOR_TUNING.killSpeedWarmupMs + 1, 1);
    expect(conductor.struggleScore).toBe(1);
  });

  it("a real, steady kill rate keeps clear-speed struggle low even past warmup", () => {
    const conductor = new DirectorConductor<string>();
    // Simulate steady kills every second past the warmup point — a real pace, not one long-decayed burst.
    for (let ms = 0; ms < CONDUCTOR_TUNING.killSpeedWarmupMs + 5000; ms += 1000) {
      conductor.recordKill();
      conductor.update(1000, 1);
    }
    expect(conductor.struggleScore).toBeLessThan(0.2);
  });

  it("near deaths raise struggle immediately, regardless of warmup, and decay over time", () => {
    const conductor = new DirectorConductor<string>();
    conductor.recordNearDeath();
    conductor.recordNearDeath();
    expect(conductor.struggleScore).toBe(1); // 2/2 reference — maxed
    conductor.update(CONDUCTOR_TUNING.nearDeathHalfLifeMs, 1);
    expect(conductor.struggleScore).toBeCloseTo(0.5, 5);
  });

  it("nearDeathCount on the snapshot is a permanent tally, never decayed", () => {
    const conductor = new DirectorConductor<string>();
    conductor.recordNearDeath();
    conductor.update(CONDUCTOR_TUNING.nearDeathHalfLifeMs * 10, 1);
    conductor.recordNearDeath();
    expect(conductor.snapshot.nearDeathCount).toBe(2);
  });

  it("holds no RNG at all for the two new inputs either — identical inputs produce identical outputs", () => {
    const run = () => {
      const conductor = new DirectorConductor<string>();
      conductor.recordKill();
      conductor.recordNearDeath();
      conductor.update(1000, 0.9);
      return conductor.snapshot;
    };
    expect(run()).toEqual(run());
  });
});

describe("Conductor over the real AF-017 EnemyDirector — integration (AF-056 §Output)", () => {
  it("gates a real Director's directives end-to-end: every directive is eventually executed, none lost", () => {
    const conductor = new DirectorConductor<SpawnDirective>();
    const executed: SpawnDirective[] = [];
    const issued: SpawnDirective[] = [];
    const director = new EnemyDirector({
      tuning: DEFAULT_DIRECTOR_TUNING,
      rng: new Rng(2056).fork("director"),
      threatInputs: { missionDifficulty: 1, biomeModifier: 1, mutatorModifier: 1, ascension: 0, playerLevel: 1, equipmentQuality: 1 },
      onDirective: (directive) => {
        issued.push(directive);
        // Boss timing is AF-017/035's own — never deferred (mirrors main.ts).
        if (directive.waveType === "MiniBossWave" || directive.waveType === "BossWave") {
          executed.push(directive);
          return;
        }
        for (const d of conductor.gateDirective(directive)) executed.push(d);
      },
    });
    // Simulate two minutes of fixed ticks with periodic recovery triggers and enemy clearing.
    for (let tick = 0; tick < 7200; tick += 1) {
      director.update(16.67);
      for (const d of conductor.update(16.67, 0.8)) executed.push(d);
      if (tick % 600 === 599) conductor.openRecoveryWindow("eliteBattles");
      if (tick % 120 === 119) director.notifyEnemiesRemoved(2); // keep the census below the spawn cap
    }
    for (const d of conductor.update(CONDUCTOR_TUNING.maxWindowMs, 1)) executed.push(d); // final flush
    expect(issued.length).toBeGreaterThan(5);
    expect(executed.length).toBe(issued.length); // deferred, never deleted
    expect(new Set(executed)).toEqual(new Set(issued));
  });
});

describe("Conductor — self-review: thousands of simulated missions stay consistent (AF-056 §Self Review Loop)", () => {
  it("survives 5,000 randomised mission timelines without breaching any pacing invariant", () => {
    const rng = new Rng(4056);
    let invariantsHeld = true;
    let allDirectivesAccounted = true;
    for (let mission = 0; mission < 5000; mission += 1) {
      const conductor = new DirectorConductor<number>();
      let issued = 0;
      let executed = 0;
      for (let step = 0; step < 60; step += 1) {
        const roll = rng.next();
        if (roll < 0.3) {
          issued += 1;
          executed += conductor.gateDirective(issued).length;
        } else if (roll < 0.4) {
          conductor.openRecoveryWindow(RECOVERY_TRIGGERS[rng.int(0, RECOVERY_TRIGGERS.length - 1)]!);
        } else if (roll < 0.5) {
          conductor.recordPlayerDamaged(rng.int(0, 30));
        } else if (roll < 0.6) {
          conductor.notifyWaveLanded(rng.int(1, 8));
        }
        executed += conductor.update(rng.int(0, 3000), rng.next()).length;
        const snap = conductor.snapshot;
        invariantsHeld =
          invariantsHeld &&
          snap.windowRemainingMs <= CONDUCTOR_TUNING.maxWindowMs &&
          snap.queuedDirectives <= CONDUCTOR_TUNING.maxQueuedDirectives &&
          snap.struggleScore >= 0 &&
          snap.struggleScore <= 1;
      }
      executed += conductor.update(CONDUCTOR_TUNING.maxWindowMs, 1).length;
      allDirectivesAccounted = allDirectivesAccounted && executed === issued;
    }
    expect(invariantsHeld).toBe(true); // window/queue/struggle bounds held across every timeline
    expect(allDirectivesAccounted).toBe(true); // pressure is deferred, never deleted
  });
});
