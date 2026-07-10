import { describe, expect, it } from "vitest";
import {
  ECOLOGICAL_AWARENESS_FIELDS,
  ECONOMIC_AWARENESS_FIELDS,
  MISSION_UNDERSTANDING_FIELDS,
  PREDICTIVE_REASONING_EXAMPLES,
  SIMULATION_SUPPORT_TARGETS,
  SOCIAL_AWARENESS_CITIZEN_FIELDS,
  SOCIAL_AWARENESS_COMMANDER_FIELDS,
  SPATIAL_AWARENESS_FIELDS,
  TEMPORAL_AWARENESS_FIELDS,
  VISUAL_DEBUGGING_TOOLS,
  WORLD_CONTEXT_FIELDS,
  WORLD_MODEL_ACCESSIBILITY_SURFACES,
  WORLD_OBJECT_KIND_EXAMPLES,
  WORLD_QUERY_EXAMPLES,
  type WorldContext,
} from "../src/game/worldModel/worldModelData";
import { GoalTracker, SpatialAwarenessTracker, WorldModelRegistry } from "../src/game/worldModel/WorldModelRuntime";
import { NpcMemoryLog } from "../src/game/legacy/LegacyEngineRuntime";
import { PredictionEngine, PriorityEngine } from "../src/game/aos/AosRuntime";

function makeContext(overrides: Partial<WorldContext> = {}): WorldContext {
  return {
    entityId: "commander-fen-beastmaster",
    identity: "Beastmaster of the Wayfarer",
    purpose: "Protect and study recovered wildlife",
    currentState: "On expedition",
    threats: [],
    dependencies: [],
    futureOpportunities: [],
    currentImportance: 50,
    ...overrides,
  };
}

describe("The Atlas World Model (AF-152)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(WORLD_OBJECT_KIND_EXAMPLES.length).toBe(16);
    expect(WORLD_CONTEXT_FIELDS.length).toBe(10);
    expect(SPATIAL_AWARENESS_FIELDS.length).toBe(8);
    expect(TEMPORAL_AWARENESS_FIELDS.length).toBe(8);
    expect(SOCIAL_AWARENESS_CITIZEN_FIELDS.length).toBe(8);
    expect(SOCIAL_AWARENESS_COMMANDER_FIELDS.length).toBe(4);
    expect(ECOLOGICAL_AWARENESS_FIELDS.length).toBe(8);
    expect(ECONOMIC_AWARENESS_FIELDS.length).toBe(9);
    expect(MISSION_UNDERSTANDING_FIELDS.length).toBe(8);
    expect(WORLD_QUERY_EXAMPLES.length).toBe(5);
    expect(SIMULATION_SUPPORT_TARGETS.length).toBe(9);
    expect(PREDICTIVE_REASONING_EXAMPLES.length).toBe(7);
    expect(VISUAL_DEBUGGING_TOOLS.length).toBe(7);
    expect(WORLD_MODEL_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("the Memory Model reuses AF-133's real NpcMemoryLog directly — minor memories fade, historic ones never do", () => {
    const memory = new NpcMemoryLog(2);
    memory.remember("commander-fen-beastmaster", "encounter", "Tagged a migratory herd.", false);
    memory.remember("commander-fen-beastmaster", "encounter", "Rescued a stranded pup.", false);
    memory.remember("commander-fen-beastmaster", "encounter", "Discovered a new subspecies.", false);
    memory.remember("commander-fen-beastmaster", "milestone", "Founded the Wildlife Sanctuary.", true);
    const memories = memory.memoriesFor("commander-fen-beastmaster");
    expect(memories.filter((m) => !m.historic).length).toBe(2);
    expect(memories.some((m) => m.historic)).toBe(true);
  });

  it("Predictive Reasoning reuses AF-144's real PredictionEngine directly for the same numeric trend-forecasting mechanic", () => {
    const engine = new PredictionEngine();
    const forecast = engine.forecast("Population growth", [40, 44, 48]);
    expect(forecast.predictedNext).toBeCloseTo(52, 5);
  });

  it("Performance reuses AF-144's real PriorityEngine directly — nearby entities update far more often than remote ones", () => {
    const engine = new PriorityEngine();
    engine.register("commander-fen-beastmaster", "High");
    engine.register("remote-wildlife-population", "Low");
    let nearUpdates = 0;
    let farUpdates = 0;
    for (let frame = 0; frame < 40; frame++) {
      if (engine.shouldUpdate("commander-fen-beastmaster", frame)) nearUpdates++;
      if (engine.shouldUpdate("remote-wildlife-population", frame)) farUpdates++;
    }
    expect(nearUpdates).toBe(40);
    expect(farUpdates).toBeLessThan(nearUpdates);
  });

  it("WorldModelRegistry stores real per-entity context and answers 'who needs help' / importance queries", () => {
    const registry = new WorldModelRegistry();
    registry.register(makeContext());
    registry.register(makeContext({ entityId: "settlement-lucent-gate", currentImportance: 80, threats: ["Resource shortage"] }));
    expect(registry.contextFor("commander-fen-beastmaster")?.identity).toContain("Beastmaster");
    expect(registry.entitiesWithThreats().length).toBe(1);
    expect(registry.byImportance()[0]?.entityId).toBe("settlement-lucent-gate");
    registry.updateImportance("commander-fen-beastmaster", 95);
    expect(registry.contextFor("commander-fen-beastmaster")?.currentImportance).toBe(95);
  });

  it("GoalTracker ranks an entity's goals by priority, returning the top goal first", () => {
    const goals = new GoalTracker();
    goals.setGoal("commander-fen-beastmaster", "Protect colony", 5);
    goals.setGoal("commander-fen-beastmaster", "Research anomaly", 9);
    goals.setGoal("commander-fen-beastmaster", "Train recruits", 3);
    expect(goals.topGoal("commander-fen-beastmaster")?.goal).toBe("Research anomaly");
    expect(goals.goalsFor("commander-fen-beastmaster").map((g) => g.goal)).toEqual(["Research anomaly", "Protect colony", "Train recruits"]);
  });

  it("SpatialAwarenessTracker is decoupled from AF-038's real galaxy coordinate system, using plain caller-supplied location ids", () => {
    const spatial = new SpatialAwarenessTracker();
    spatial.setLocation("commander-fen-beastmaster", "sys-lucent-gate");
    spatial.setLocation("companion-wolf-1", "sys-lucent-gate");
    expect(spatial.locationFor("commander-fen-beastmaster")).toBe("sys-lucent-gate");
    expect(spatial.entitiesAt("sys-lucent-gate")).toEqual(["commander-fen-beastmaster", "companion-wolf-1"]);
  });
});
