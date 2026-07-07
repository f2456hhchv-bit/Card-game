import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { generateMission } from "../src/game/missions/MissionGenerator";
import { MissionRuntime } from "../src/game/missions/MissionRuntime";
import { SANDBOX_MISSIONS, MISSION_EVENT_TO_ENVIRONMENTAL_EVENT, MISSION_EVENT_KINDS } from "../src/game/missions/missionData";

const template = SANDBOX_MISSIONS[0]!; // Crystal Fields Incursion — 2 primary, 2 optional, 3 modifiers (1 slot), 4 events

describe("generateMission — deterministic modifier rolling (AF-037 §Mission Generation)", () => {
  it("is deterministic given the same seed", () => {
    const a = generateMission(template, 42);
    const b = generateMission(template, 42);
    expect(a.id).toBe(b.id);
    expect(a.activeModifiers.map((m) => m.kind)).toEqual(b.activeModifiers.map((m) => m.kind));
  });

  it("rolls exactly modifierSlots modifiers", () => {
    const instance = generateMission(template, 1);
    expect(instance.activeModifiers).toHaveLength(template.modifierSlots);
  });

  it("different seeds can roll different modifiers", () => {
    const results = new Set<string>();
    for (let seed = 0; seed < 20; seed += 1) {
      results.add(generateMission(template, seed).activeModifiers.map((m) => m.kind).join(","));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it("does not mutate the template", () => {
    const before = template.modifierPool.length;
    generateMission(template, 7);
    expect(template.modifierPool.length).toBe(before);
  });
});

describe("MissionRuntime — objective progress (AF-037 §Objective Types)", () => {
  it("marks a target-reaching objective complete once its counter meets the target", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    expect(runtime.isComplete("clear-drones")).toBe(false);
    for (let i = 0; i < 15; i += 1) runtime.recordProgress("missionKills");
    expect(runtime.isComplete("clear-drones")).toBe(true);
  });

  it("primaryObjectivesComplete requires every primary objective, not just one", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    for (let i = 0; i < 15; i += 1) runtime.recordProgress("missionKills");
    expect(runtime.primaryObjectivesComplete).toBe(false); // boss not yet defeated
    runtime.recordProgress("missionBossDefeated");
    expect(runtime.primaryObjectivesComplete).toBe(true);
  });

  it("a zero-target 'stay under' objective starts satisfied and is revoked once exceeded", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    expect(runtime.isComplete("no-damage-run")).toBe(true);
    runtime.recordProgress("missionDamageTaken", 5);
    expect(runtime.isComplete("no-damage-run")).toBe(false);
  });

  it("a zero-target objective that is never incremented survives to the end, satisfied", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    for (let i = 0; i < 15; i += 1) runtime.recordProgress("missionKills");
    runtime.recordProgress("missionBossDefeated");
    expect(runtime.primaryObjectivesComplete).toBe(true);
    expect(runtime.isComplete("no-damage-run")).toBe(true); // never touched missionDamageTaken
  });

  it("optional objectives never gate primaryObjectivesComplete", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    for (let i = 0; i < 15; i += 1) runtime.recordProgress("missionKills");
    runtime.recordProgress("missionBossDefeated");
    runtime.recordProgress("missionDamageTaken", 999); // fails the no-damage optional
    expect(runtime.primaryObjectivesComplete).toBe(true);
    expect(runtime.isComplete("no-damage-run")).toBe(false);
  });

  it("completedOptionalObjectiveIds reports exactly the ones achieved", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    runtime.recordProgress("missionElitesKilled", 2);
    expect(runtime.completedOptionalObjectiveIds).toContain("elite-hunt");
    expect(runtime.completedOptionalObjectiveIds).toContain("no-damage-run"); // still untouched, still satisfied
  });
});

describe("MissionRuntime — weighted Mission Events (AF-037 §Dynamic Events)", () => {
  it("fires no event before the interval elapses", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1), 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the mission's own pool", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(5), 1000);
    const configuredKinds = template.eventPool.map((e) => e.kind);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredKinds).toContain(event);
      }
    }
    expect(fired).toBe(50);
  });
});

describe("MissionRuntime — modifier-derived numeric feeds (AF-037 §Mission Modifiers)", () => {
  it("baselines are unchanged with zero active modifiers", () => {
    const instance = generateMission({ ...template, modifierSlots: 0 }, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    expect(runtime.mutatorModifier).toBe(1);
    expect(runtime.lootMutatorBonus).toBe(0);
    expect(runtime.eliteSquadSizeBonus).toBe(0);
    expect(runtime.rewardMultiplier).toBe(1);
  });

  it("an active modifier's deltas apply on top of the baselines", () => {
    const instance = generateMission(template, 1);
    const runtime = new MissionRuntime(instance, new Rng(1));
    const modifier = instance.activeModifiers[0]!;
    expect(runtime.mutatorModifier).toBeCloseTo(1 + modifier.mutatorModifierDelta, 5);
    expect(runtime.lootMutatorBonus).toBeCloseTo(modifier.lootMutatorBonusDelta, 5);
    expect(runtime.eliteSquadSizeBonus).toBe(modifier.eliteSquadSizeDelta);
    expect(runtime.rewardMultiplier).toBeCloseTo(1 + modifier.rewardMultiplierDelta, 5);
  });
});

describe("MISSION_EVENT_TO_ENVIRONMENTAL_EVENT — every kind maps to a real event-type string (AF-037)", () => {
  it("covers all ten Mission Event kinds with a non-empty mapping", () => {
    for (const kind of MISSION_EVENT_KINDS) {
      expect(MISSION_EVENT_TO_ENVIRONMENTAL_EVENT[kind].length).toBeGreaterThan(0);
    }
  });
});

describe("Missions — self-review: thousands of generated instances stay internally consistent", () => {
  it("every seed across a wide range produces a valid, deterministic instance", () => {
    for (let seed = 0; seed < 2000; seed += 1) {
      const instance = generateMission(template, seed);
      expect(instance.activeModifiers.length).toBeLessThanOrEqual(template.modifierSlots);
      const repeat = generateMission(template, seed);
      expect(repeat.id).toBe(instance.id);
      expect(repeat.activeModifiers.map((m) => m.kind)).toEqual(instance.activeModifiers.map((m) => m.kind));
    }
  });
});
