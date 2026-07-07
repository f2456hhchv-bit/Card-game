import { describe, expect, it } from "vitest";
import { BossDirectorRuntime } from "../src/game/bosses/BossDirector";
import {
  ARENA_CONTROL_FEATURES,
  BOSS_DIRECTOR_TUNING,
  BOSS_ENCOUNTER_BEATS,
  BOSS_MEMORY_KEYS,
  BOSS_SUMMON_KINDS,
  CINEMATIC_BEATS,
  LEGENDARY_MOMENT_KINDS,
  MULTI_BOSS_KINDS,
  PHASE_ALTERATIONS,
  SANDBOX_BOSS_SUMMON_PLAN,
  beatFor,
} from "../src/game/bosses/bossDirectorData";
import { BossRuntime } from "../src/game/bosses/BossRuntime";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { SANDBOX_ENEMIES } from "../src/game/enemies/enemyData";
import { DEFAULT_COMBAT_TUNING } from "../src/game/combat/combatTuning";
import { Rng } from "../src/core/rng/Rng";

function makeDirector(): BossDirectorRuntime {
  return new BossDirectorRuntime("hollow-sentinel", SANDBOX_BOSS_SUMMON_PLAN);
}

describe("Boss Director vocabulary — registered shelves (AF-057 §Responsibilities / §Flow / §Cinematics)", () => {
  it("registers twelve beats, nine phase alterations, seven arena features, seven summon kinds, seven cinematic beats, seven legendary moments, eight memory keys, seven multi-boss kinds", () => {
    expect(BOSS_ENCOUNTER_BEATS.length).toBe(12);
    expect(PHASE_ALTERATIONS.length).toBe(9);
    expect(ARENA_CONTROL_FEATURES.length).toBe(7);
    expect(BOSS_SUMMON_KINDS.length).toBe(7);
    expect(CINEMATIC_BEATS.length).toBe(7);
    expect(LEGENDARY_MOMENT_KINDS.length).toBe(7);
    expect(BOSS_MEMORY_KEYS.length).toBe(8);
    expect(MULTI_BOSS_KINDS.length).toBe(7);
  });

  it("every summon in the sandbox plan is a valid kind referencing a real enemy def", () => {
    for (const specs of Object.values(SANDBOX_BOSS_SUMMON_PLAN)) {
      for (const spec of specs) {
        expect(BOSS_SUMMON_KINDS).toContain(spec.kind);
        expect(SANDBOX_ENEMIES.some((d) => d.id === spec.enemyId)).toBe(true);
        expect(spec.count).toBeGreaterThan(0);
      }
    }
  });

  it("beatFor derives every live beat from the runtime's own state plus the transition window", () => {
    expect(beatFor("introduction", 0, 2, false)).toBe("introductionSequence");
    expect(beatFor("fighting", 0, 2, false)).toBe("phaseOne");
    expect(beatFor("fighting", 0, 3, true)).toBe("arenaEvolution"); // mid-fight evolution
    expect(beatFor("fighting", 1, 3, false)).toBe("phaseTwo");
    expect(beatFor("fighting", 2, 3, true)).toBe("environmentalEscalation"); // entering the last phase
    expect(beatFor("fighting", 1, 2, false)).toBe("finalPhase");
    expect(beatFor("deathSequence", 1, 2, false)).toBe("defeatSequence");
    expect(beatFor("rewardCeremony", 1, 2, false)).toBe("rewardCeremony");
  });
});

describe("BossDirectorRuntime — transition windows (AF-057 §Player Recovery / §Phase Management)", () => {
  it("a phase change opens breathing room during which the boss holds fire, then attacks resume", () => {
    const director = makeDirector();
    expect(director.attacksHeld).toBe(false);
    director.notifyPhaseChanged(1);
    expect(director.attacksHeld).toBe(true);
    director.update(BOSS_DIRECTOR_TUNING.phaseTransitionRecoveryMs - 1);
    expect(director.attacksHeld).toBe(true);
    director.update(1);
    expect(director.attacksHeld).toBe(false);
  });

  it("arena escalation grows the existing hazard zone per phase reached", () => {
    const director = makeDirector();
    expect(director.hazardRadiusScaleFor(0)).toBe(1);
    expect(director.hazardRadiusScaleFor(1)).toBeCloseTo(1 + BOSS_DIRECTOR_TUNING.hazardRadiusGrowthPerPhase, 5);
    expect(director.hazardRadiusScaleFor(2)).toBeGreaterThan(director.hazardRadiusScaleFor(1));
  });
});

describe("BossDirectorRuntime — summon queue (AF-057 §Summon System)", () => {
  it("summons wait out the transition, then drain one spec per cadence tick — a queue, never a dump", () => {
    const director = makeDirector();
    director.notifyPhaseChanged(1); // enqueues the Collapse plan: drones + an elite guard
    expect(director.snapshot.queuedSummons).toBe(2);
    expect(director.consumeSummon()).toBeNull(); // transition still open
    director.update(BOSS_DIRECTOR_TUNING.phaseTransitionRecoveryMs);
    expect(director.consumeSummon()).toBeNull(); // cadence not yet elapsed after the window
    director.update(BOSS_DIRECTOR_TUNING.summonCadenceMs);
    const first = director.consumeSummon();
    expect(first?.kind).toBe("droneWaves");
    expect(director.consumeSummon()).toBeNull(); // never two per cadence
    director.update(BOSS_DIRECTOR_TUNING.summonCadenceMs);
    const second = director.consumeSummon();
    expect(second?.kind).toBe("eliteGuards");
    expect(second?.elite).toBe(true);
    expect(director.snapshot.queuedSummons).toBe(0);
    expect(director.snapshot.summonsIssued).toBe(2);
  });

  it("defeat clears the summon queue — the guards stand down with their warden", () => {
    const director = makeDirector();
    director.notifyPhaseChanged(1);
    director.notifyDefeated();
    expect(director.snapshot.queuedSummons).toBe(0);
    director.update(60000);
    expect(director.consumeSummon()).toBeNull();
  });

  it("the queue is capped — a plan can never dump unbounded summons", () => {
    const bigPlan = { 1: Array.from({ length: 20 }, () => ({ enemyId: "wisp-chaser", count: 1, elite: false, kind: "droneWaves" as const })) };
    const director = new BossDirectorRuntime("test", bigPlan);
    director.notifyPhaseChanged(1);
    expect(director.snapshot.queuedSummons).toBe(BOSS_DIRECTOR_TUNING.maxQueuedSummons);
  });
});

describe("BossDirectorRuntime — cinematics & ceremony (AF-057 §Cinematic Presentation / §Reward Ceremony)", () => {
  it("bossArrival fires once at encounter start and victorySequence once at defeat — one-shots, never repeats", () => {
    const director = makeDirector();
    expect(director.consumeCinematicEvent()).toBe("bossArrival");
    expect(director.consumeCinematicEvent()).toBeNull();
    director.notifyDefeated();
    expect(director.consumeCinematicEvent()).toBe("victorySequence");
    expect(director.consumeCinematicEvent()).toBeNull();
  });

  it("ceremony lines land one per cadence — the first immediately, the rest paced", () => {
    const director = makeDirector();
    director.queueCeremonyLines(["VICTORY", "FASTEST KILL", "ATTEMPT 3"]);
    expect(director.consumeCeremonyLine()).toBe("VICTORY"); // first line lands immediately
    expect(director.consumeCeremonyLine()).toBeNull();
    director.update(BOSS_DIRECTOR_TUNING.ceremonyLineCadenceMs);
    expect(director.consumeCeremonyLine()).toBe("FASTEST KILL");
    director.update(BOSS_DIRECTOR_TUNING.ceremonyLineCadenceMs);
    expect(director.consumeCeremonyLine()).toBe("ATTEMPT 3");
    expect(director.consumeCeremonyLine()).toBeNull();
  });
});

describe("Boss Memory arithmetic (AF-057 §Boss Memory)", () => {
  it("fastestKillStatDelta sets the first time, improves on a faster kill, and stands otherwise", () => {
    expect(BossDirectorRuntime.fastestKillStatDelta(0, 90000)).toBe(90000); // first victory records outright
    expect(BossDirectorRuntime.fastestKillStatDelta(90000, 60000)).toBe(-30000); // improvement adjusts down
    expect(BossDirectorRuntime.fastestKillStatDelta(60000, 75000)).toBe(0); // a slower kill never regresses the best
  });
});

describe("Director over the real AF-035 BossRuntime — integration (AF-057 §Output)", () => {
  it("decorates a real Hollow Sentinel fight: phase change detected, breathing room opens, summons flow, victory fires", () => {
    const boss = new BossRuntime(SANDBOX_BOSSES[0]!, DEFAULT_COMBAT_TUNING);
    const director = makeDirector();
    expect(director.consumeCinematicEvent()).toBe("bossArrival");
    boss.begin();
    let lastPhase = boss.snapshot.phaseIndex;
    const summoned: string[] = [];
    let heldTicks = 0;
    for (let tick = 0; tick < 4000 && boss.snapshot.state !== "deathSequence"; tick += 1) {
      boss.update(16.67);
      director.update(16.67);
      if (boss.snapshot.phaseIndex !== lastPhase) {
        lastPhase = boss.snapshot.phaseIndex;
        director.notifyPhaseChanged(lastPhase);
      }
      if (director.attacksHeld) heldTicks += 1;
      const summon = director.consumeSummon();
      if (summon) summoned.push(summon.kind);
      boss.defence.takeDamage(1.5); // steady piloted pressure — slow enough for the encounter to breathe
    }
    expect(lastPhase).toBeGreaterThan(0); // the Collapse phase was reached
    expect(heldTicks).toBeGreaterThan(0); // breathing room actually held fire
    expect(summoned).toEqual(["droneWaves", "eliteGuards"]); // the plan flowed, in order, at cadence
    director.notifyDefeated();
    expect(director.consumeCinematicEvent()).toBe("victorySequence");
  });
});

describe("Boss Director — self-review: thousands of encounters stay consistent (AF-057 §Self Review Loop)", () => {
  it("survives 5,000 randomised encounter timelines without breaching any invariant", () => {
    const rng = new Rng(4057);
    let invariantsHeld = true;
    for (let encounter = 0; encounter < 5000; encounter += 1) {
      const director = makeDirector();
      let issued = 0;
      for (let step = 0; step < 50; step += 1) {
        const roll = rng.next();
        if (roll < 0.15) director.notifyPhaseChanged(rng.int(1, 3));
        else if (roll < 0.2) director.queueCeremonyLines(["line"]);
        director.update(rng.int(0, 2000));
        if (director.consumeSummon()) issued += 1;
        director.consumeCeremonyLine();
        director.consumeCinematicEvent();
        const snap = director.snapshot;
        invariantsHeld =
          invariantsHeld &&
          snap.queuedSummons <= BOSS_DIRECTOR_TUNING.maxQueuedSummons &&
          snap.transitionRemainingMs <= BOSS_DIRECTOR_TUNING.phaseTransitionRecoveryMs &&
          snap.transitionRemainingMs >= 0 &&
          !(snap.transitionActive && director.consumeSummon() !== null); // never a summon inside breathing room
      }
      director.notifyDefeated();
      invariantsHeld = invariantsHeld && director.snapshot.queuedSummons === 0 && issued === director.snapshot.summonsIssued;
    }
    expect(invariantsHeld).toBe(true);
  });
});
