import { describe, expect, it } from "vitest";
import { BOSS_TRANSITIONS, createBossStateMachine } from "../src/game/bosses/BossAI";
import { isInsideHazard, stepHazardZone, type HazardZoneDef, type HazardZoneState } from "../src/game/bosses/BossArena";
import { MINI_BOSS, SANDBOX_BOSSES, WORLD_BOSS, createMiniBossVariant, createWorldBossVariant } from "../src/game/bosses/bossData";
import { BossRuntime } from "../src/game/bosses/BossRuntime";
import { DEFAULT_COMBAT_TUNING } from "../src/game/combat/combatTuning";

const bossDef = SANDBOX_BOSSES[0]!; // Hollow Sentinel — 900 hull, 200 shield, 2 phases, lowHealth enrage @0.15

describe("BossAI — deterministic phase states over AF-016's StateMachine (AF-035)", () => {
  it("follows the documented structure as legal transitions", () => {
    const machine = createBossStateMachine("introduction");
    expect(machine.transitionTo("engaging")).toBe(true);
    expect(machine.transitionTo("transitioning")).toBe(true);
    expect(machine.transitionTo("engaging")).toBe(true);
    expect(machine.transitionTo("enrage")).toBe(true);
    expect(machine.transitionTo("deathSequence")).toBe(true);
    expect(machine.transitionTo("rewardCeremony")).toBe(true);
  });

  it("deathSequence is reachable from every live state", () => {
    for (const state of Object.keys(BOSS_TRANSITIONS) as (keyof typeof BOSS_TRANSITIONS)[]) {
      if (state === "deathSequence" || state === "rewardCeremony") continue;
      expect(BOSS_TRANSITIONS[state]).toContain("deathSequence");
    }
  });

  it("rewardCeremony is terminal", () => {
    expect(BOSS_TRANSITIONS.rewardCeremony).toEqual([]);
  });

  it("rejects an illegal transition rather than silently coercing it", () => {
    const machine = createBossStateMachine("introduction");
    expect(machine.transitionTo("rewardCeremony")).toBe(false);
    expect(machine.current).toBe("introduction");
  });
});

describe("BossRuntime — phases, weak points, enrage (AF-035)", () => {
  it("starts in introduction and enters phase 0 on begin()", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    expect(boss.snapshot.state).toBe("introduction");
    boss.begin();
    expect(boss.snapshot.state).toBe("engaging");
    expect(boss.snapshot.phaseIndex).toBe(0);
  });

  it("does not attack before begin() is called", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    expect(boss.tryAttack(true)).toBe(false);
  });

  /**
   * DefenceState reduces by armour, then absorbs via shield before hull —
   * so this drives realistic small hits (like a real weapon tick) until a
   * predicate holds, rather than reverse-engineering one exact "big hit"
   * amount that would have to land past armour+shield in a single call.
   */
  function hitUntil(boss: BossRuntime, predicate: () => boolean, maxTicks = 3000): void {
    for (let i = 0; i < maxTicks && !predicate(); i += 1) {
      boss.defence.takeDamage(15);
      boss.update(16);
    }
    expect(predicate()).toBe(true); // fail loudly if the cap was hit without reaching the target state
  }

  it("auto-transitions to phase 2 once hull drops to the next phase's threshold, holding transitioning briefly", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    hitUntil(boss, () => boss.snapshot.state === "transitioning");
    expect(boss.snapshot.phaseIndex).toBe(1);
    for (let i = 0; i < 40; i += 1) boss.update(16); // 640ms > 500ms transition duration
    expect(boss.snapshot.state).toBe("engaging");
    expect(boss.currentPhase.phaseId).toBe("phase-2-collapse");
  });

  it("ignores attack attempts entirely while transitioning", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    hitUntil(boss, () => boss.snapshot.state === "transitioning");
    expect(boss.tryAttack(true)).toBe(false);
  });

  it("enters enrage once hull drops to the lowHealth threshold and boosts damage/speed", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    expect(boss.damageMultiplier).toBe(1);
    hitUntil(boss, () => boss.snapshot.enraged);
    expect(boss.snapshot.state).toBe("enrage");
    expect(boss.damageMultiplier).toBeCloseTo(1 + bossDef.enrage!.damageMultiplier, 5);
    expect(boss.speedMultiplier).toBeCloseTo(1 + bossDef.enrage!.speedMultiplier, 5);
  });

  it("can still attack while enraged", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    hitUntil(boss, () => boss.snapshot.enraged);
    expect(boss.snapshot.state).toBe("enrage");
    // The current phase's attack has a real telegraph window — tick through it.
    let fired = false;
    for (let i = 0; i < 200 && !fired; i += 1) {
      boss.update(16);
      if (boss.tryAttack(true)) fired = true;
    }
    expect(fired).toBe(true);
  });

  it("transitions to deathSequence once hull reaches zero", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    hitUntil(boss, () => boss.snapshot.state === "deathSequence");
  });

  it("weak point destruction fires exactly once and increases incomingDamageMultiplier", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    const weakPoint = bossDef.weakPoints[0]!;
    expect(boss.incomingDamageMultiplier).toBe(1);
    const destroyedNow = boss.applyWeakPointDamage(weakPoint.id, weakPoint.hullFraction * bossDef.hull);
    expect(destroyedNow).toBe(true);
    expect(boss.incomingDamageMultiplier).toBeGreaterThan(1);
    // Further damage to an already-destroyed weak point does nothing new.
    expect(boss.applyWeakPointDamage(weakPoint.id, 999)).toBe(false);
  });

  it("ascension enrage only fires via the external notifyAscension hook", () => {
    const ascensionBoss = new BossRuntime(
      { ...bossDef, enrage: { trigger: "ascension", ascensionThreshold: 5, damageMultiplier: 0.3, speedMultiplier: 0.2 } },
      DEFAULT_COMBAT_TUNING,
    );
    ascensionBoss.begin();
    ascensionBoss.update(16);
    expect(ascensionBoss.snapshot.enraged).toBe(false);
    ascensionBoss.notifyAscension(5);
    expect(ascensionBoss.snapshot.enraged).toBe(true);
  });
});

describe("BossArena — deterministic hazard zone ticking (AF-035 §Arena Design)", () => {
  const zone: HazardZoneDef = {
    id: "vault-static",
    x: 0,
    y: 0,
    radius: 3,
    tickIntervalMs: 1000,
    damagePerTick: 5,
    statusOnTick: null,
  };

  it("isInsideHazard checks radius correctly", () => {
    expect(isInsideHazard(zone, 1, 1)).toBe(true);
    expect(isInsideHazard(zone, 10, 10)).toBe(false);
  });

  it("stepHazardZone ticks exactly once per interval, deterministically", () => {
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(zone, state, 999)).toBe(false);
    expect(stepHazardZone(zone, state, 1)).toBe(true);
    expect(stepHazardZone(zone, state, 500)).toBe(false);
    expect(stepHazardZone(zone, state, 500)).toBe(true);
  });
});

describe("Bosses — self-review: the sandbox boss runs a full encounter without exception", () => {
  it("survives thousands of ticks across a full fight, reaching deathSequence exactly once", () => {
    const boss = new BossRuntime(bossDef, DEFAULT_COMBAT_TUNING);
    boss.begin();
    let deathTransitions = 0;
    for (let tick = 0; tick < 5000; tick += 1) {
      boss.update(16);
      boss.tryAttack(true);
      if (tick === 2000) {
        const before = boss.snapshot.state;
        boss.defence.takeDamage(boss.snapshot.hull + boss.snapshot.shield + 1000);
        boss.update(16);
        if (before !== "deathSequence" && boss.snapshot.state === "deathSequence") deathTransitions += 1;
      }
    }
    expect(deathTransitions).toBe(1);
    expect(boss.snapshot.state).toBe("deathSequence");
  });
});

describe("GP-002 — World Boss variant (§Enemy Hierarchy)", () => {
  it("createWorldBossVariant scales hull and threat while reusing every phase/weak-point/enrage/mastery unchanged", () => {
    const worldBoss = createWorldBossVariant(bossDef, 2);
    expect(worldBoss.hull).toBe(bossDef.hull * 2);
    expect(worldBoss.threatRating).toBe(bossDef.threatRating + 2);
    expect(worldBoss.phases).toBe(bossDef.phases); // same reference — no duplicated content
    expect(worldBoss.weakPoints).toBe(bossDef.weakPoints);
    expect(worldBoss.enrage).toBe(bossDef.enrage);
    expect(worldBoss.masteryChallenges).toBe(bossDef.masteryChallenges);
    expect(worldBoss.id).not.toBe(bossDef.id);
    expect(worldBoss.codexId).not.toBe(bossDef.codexId);
  });

  it("does not mutate the base BossDef", () => {
    const hullBefore = bossDef.hull;
    createWorldBossVariant(bossDef, 5);
    expect(bossDef.hull).toBe(hullBefore);
  });

  it("WORLD_BOSS is a real, distinct, playable BossDef built from the sandbox boss", () => {
    expect(WORLD_BOSS.hull).toBeGreaterThan(SANDBOX_BOSSES[0]!.hull);
    const boss = new BossRuntime(WORLD_BOSS, DEFAULT_COMBAT_TUNING);
    boss.begin();
    expect(boss.snapshot.state).toBe("engaging");
    expect(boss.snapshot.maxHull).toBe(WORLD_BOSS.hull);
  });
});

/**
 * GP-FINAL §Run Structure — the audit found only one boss tier existed (the
 * ordinary Boss, once per run, on a fixed timer, never wave-count-driven).
 * createMiniBossVariant is createWorldBossVariant's own scaling pattern
 * inverted — fewer phases and reduced hull, over the exact same engine.
 */
describe("GP-FINAL — Mini Boss variant (§Run Structure)", () => {
  it("createMiniBossVariant reduces hull and truncates phases while reusing weak-points/enrage/mastery unchanged", () => {
    const miniBoss = createMiniBossVariant(bossDef, 0.4, 2);
    expect(miniBoss.hull).toBe(bossDef.hull * 0.4);
    expect(miniBoss.phases.length).toBe(2);
    expect(miniBoss.phases).toEqual(bossDef.phases.slice(0, 2));
    expect(miniBoss.threatRating).toBeLessThan(bossDef.threatRating);
    expect(miniBoss.weakPoints).toBe(bossDef.weakPoints);
    expect(miniBoss.enrage).toBe(bossDef.enrage);
    expect(miniBoss.masteryChallenges).toBe(bossDef.masteryChallenges);
    expect(miniBoss.id).not.toBe(bossDef.id);
    expect(miniBoss.id).not.toBe(WORLD_BOSS.id);
    expect(miniBoss.codexId).not.toBe(bossDef.codexId);
  });

  it("does not mutate the base BossDef", () => {
    const hullBefore = bossDef.hull;
    const phasesBefore = bossDef.phases;
    createMiniBossVariant(bossDef, 0.2, 1);
    expect(bossDef.hull).toBe(hullBefore);
    expect(bossDef.phases).toBe(phasesBefore);
  });

  it("phaseCount is clamped to at least one phase — never an empty, unplayable boss", () => {
    const miniBoss = createMiniBossVariant(bossDef, 0.3, 0);
    expect(miniBoss.phases.length).toBe(1);
    expect(miniBoss.phaseSystem).toBe("onePhase");
  });

  it("MINI_BOSS is a real, distinct, playable, genuinely lighter BossDef than the ordinary Boss and the World Boss", () => {
    expect(MINI_BOSS.hull).toBeLessThan(SANDBOX_BOSSES[0]!.hull);
    expect(MINI_BOSS.hull).toBeLessThan(WORLD_BOSS.hull);
    expect(MINI_BOSS.phases.length).toBeLessThan(SANDBOX_BOSSES[0]!.phases.length);
    const boss = new BossRuntime(MINI_BOSS, DEFAULT_COMBAT_TUNING);
    boss.begin();
    expect(boss.snapshot.state).toBe("engaging");
    expect(boss.snapshot.maxHull).toBe(MINI_BOSS.hull);
  });
});
