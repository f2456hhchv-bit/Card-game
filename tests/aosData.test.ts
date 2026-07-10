import { describe, expect, it } from "vitest";
import { EventBus } from "../src/core/events/EventBus";
import {
  AOS_ACCESSIBILITY_SURFACES,
  AOS_EVENT_KINDS,
  AOS_RESPONSIBILITIES,
  DEBUG_FRAMEWORK_TOOLS,
  FAILSAFE_PRINCIPLES,
  LIVE_TELEMETRY_PURPOSES,
  MEMORY_MANAGER_CATEGORIES,
  PERFORMANCE_ORCHESTRATOR_DOMAINS,
  PRIORITY_TIERS,
  PRIORITY_TIER_EXAMPLES,
  PREDICTION_KINDS,
  RECOVERY_SCENARIO_KINDS,
  SCALABILITY_TARGETS,
  SIMULATION_TIME_LAYERS,
  WORLD_STATE_SLOTS,
  type AosEventMap,
} from "../src/game/aos/aosData";
import { NpcMemoryLog } from "../src/game/legacy/LegacyEngineRuntime";
import {
  DecisionRouter,
  PerformanceBudgetTracker,
  PredictionEngine,
  PriorityEngine,
  RecoveryLog,
  SimulationClockRegistry,
  TelemetryCollector,
  WorldStateStore,
  buildDialogueContext,
  type ChangeRequest,
} from "../src/game/aos/AosRuntime";

describe("The Afterlight Operating System (AF-144)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(AOS_RESPONSIBILITIES.length).toBe(17);
    expect(AOS_EVENT_KINDS.length).toBe(9);
    expect(WORLD_STATE_SLOTS.length).toBe(6);
    expect(SIMULATION_TIME_LAYERS.length).toBe(7);
    expect(PRIORITY_TIERS.length).toBe(3);
    expect(MEMORY_MANAGER_CATEGORIES.length).toBe(6);
    expect(PREDICTION_KINDS.length).toBe(6);
    expect(PERFORMANCE_ORCHESTRATOR_DOMAINS.length).toBe(9);
    expect(RECOVERY_SCENARIO_KINDS.length).toBe(5);
    expect(DEBUG_FRAMEWORK_TOOLS.length).toBe(7);
    expect(LIVE_TELEMETRY_PURPOSES.length).toBe(6);
    expect(SCALABILITY_TARGETS.length).toBe(5);
    expect(FAILSAFE_PRINCIPLES.length).toBe(5);
    expect(AOS_ACCESSIBILITY_SURFACES.length).toBe(5);
    expect(Object.values(PRIORITY_TIER_EXAMPLES).flat().length).toBe(13);
  });

  it("the System Bus reuses AF-001's real, generic EventBus directly rather than a second bus class", () => {
    const bus = new EventBus<AosEventMap>();
    const received: string[] = [];
    bus.on("PlanetRestored", (payload) => received.push(payload.planetId));
    bus.emit("PlanetRestored", { planetId: "settlement-verdance" });
    expect(received).toEqual(["settlement-verdance"]);
    expect(bus.listenerCount("PlanetRestored")).toBe(1);
  });

  it("the Memory Manager reuses AF-133's real NpcMemoryLog directly — minor memories fade, historic ones never do", () => {
    const memory = new NpcMemoryLog(2);
    memory.remember("npc-1", "chat", "Talked about the weather.", false);
    memory.remember("npc-1", "chat", "Talked about wildlife.", false);
    memory.remember("npc-1", "chat", "Talked about the harvest.", false);
    memory.remember("npc-1", "milestone", "Witnessed the founding.", true);
    const memories = memory.memoriesFor("npc-1");
    expect(memories.filter((m) => !m.historic).length).toBe(2);
    expect(memories.some((m) => m.historic)).toBe(true);
  });

  it("WorldStateStore is a real single source of truth over Current/Historical/Projected/Temporary/Emergency state", () => {
    const store = new WorldStateStore<{ population: number }>();
    store.setCurrent({ population: 100 }, 0);
    store.setCurrent({ population: 120 }, 5);
    expect(store.getCurrent()).toEqual({ population: 120 });
    expect(store.historyAt(0)).toEqual({ population: 100 });
    store.setProjected({ population: 140 });
    expect(store.getProjected()).toEqual({ population: 140 });
    store.setTemporary("festival-bonus", { population: 130 }, 10);
    expect(store.getTemporary("festival-bonus", 5)).toEqual({ population: 130 });
    expect(store.getTemporary("festival-bonus", 11)).toBeNull();
    expect(store.isEmergency()).toBe(false);
    store.declareEmergency("contradiction detected");
    expect(store.isEmergency()).toBe(true);
    store.clearEmergency();
    expect(store.isEmergency()).toBe(false);
    expect(store.slotSummary().Historical).toBe(true);
  });

  it("SimulationClockRegistry is a read-only reporting aggregator, never a second source of truth for any real clock", () => {
    const clocks = new SimulationClockRegistry();
    clocks.report("Civilisation Time", 42);
    clocks.report("Real Time", 1200);
    expect(clocks.valueFor("Civilisation Time")).toBe(42);
    expect(clocks.valueFor("Ship Time")).toBe(0);
    expect(clocks.all().size).toBe(2);
  });

  it("PriorityEngine throttles Low-tier systems to update far less often than High-tier ones", () => {
    const engine = new PriorityEngine();
    engine.register("player", "High");
    engine.register("remote-galaxy-sim", "Low");
    let highUpdates = 0;
    let lowUpdates = 0;
    for (let frame = 0; frame < 40; frame++) {
      if (engine.shouldUpdate("player", frame)) highUpdates++;
      if (engine.shouldUpdate("remote-galaxy-sim", frame)) lowUpdates++;
    }
    expect(highUpdates).toBe(40);
    expect(lowUpdates).toBeLessThan(highUpdates);
    expect(engine.tierFor("player")).toBe("High");
  });

  it("buildDialogueContext composes real signal values without importing the systems it reads from", () => {
    const context = buildDialogueContext({
      playerReputation: 10,
      currentCommanderId: "voss-pathfinder",
      planetHistoryCount: 3,
      timeOfDay: "dusk",
      relationshipStatus: "friendly",
      weatherCondition: "clear",
      nearbyDiscoveryCount: 1,
      recentConversationCount: 2,
    });
    expect(context.isFriendly).toBe(true);
    expect(buildDialogueContext({ ...context, relationshipStatus: "hostile" }).isFriendly).toBe(false);
  });

  it("DecisionRouter always lets a player-sourced request win over a higher-tier non-player request, protecting player agency", () => {
    const router = new DecisionRouter();
    const requests: ChangeRequest[] = [
      { systemId: "living-galaxy", targetId: "settlement-verdance", tier: "High", fromPlayer: false },
      { systemId: "player-input", targetId: "settlement-verdance", tier: "Low", fromPlayer: true },
    ];
    const resolution = router.resolve(requests)!;
    expect(resolution.winner.fromPlayer).toBe(true);
    expect(resolution.rejected.length).toBe(1);
  });

  it("DecisionRouter falls back to priority tier when no request is player-sourced", () => {
    const router = new DecisionRouter();
    const requests: ChangeRequest[] = [
      { systemId: "economy", targetId: "settlement-verdance", tier: "Medium", fromPlayer: false },
      { systemId: "weather", targetId: "settlement-verdance", tier: "High", fromPlayer: false },
    ];
    const resolution = router.resolve(requests)!;
    expect(resolution.winner.systemId).toBe("weather");
  });

  it("PredictionEngine forecasts a real linear trend and reports lower confidence over noisier history", () => {
    const engine = new PredictionEngine();
    const steady = engine.forecast("Population growth", [10, 20, 30, 40]);
    expect(steady.predictedNext).toBeCloseTo(50, 5);
    const noisy = engine.forecast("Economic shortages", [10, 40, 5, 45]);
    expect(noisy.confidence).toBeLessThan(steady.confidence);
  });

  it("PerformanceBudgetTracker recommends throttling the domains furthest over budget first", () => {
    const tracker = new PerformanceBudgetTracker();
    tracker.reportUsage("Rendering", 95);
    tracker.reportUsage("Audio", 85);
    tracker.reportUsage("Networking", 40);
    expect(tracker.isOverBudget("Networking")).toBe(false);
    expect(tracker.recommendedThrottleTargets()).toEqual(["Rendering", "Audio"]);
  });

  it("RecoveryLog is append-only, distinct from AF-044's real save-slice corruption recovery", () => {
    const log = new RecoveryLog();
    log.record("Unexpected contradictions", "Rolled the settlement population back to its last consistent value.", 4);
    expect(log.all().length).toBe(1);
  });

  it("TelemetryCollector counts event kinds only, carrying no payload data", () => {
    const telemetry = new TelemetryCollector();
    const bus = new EventBus<AosEventMap>();
    bus.on("PlanetRestored", () => telemetry.record("PlanetRestored"));
    bus.on("CommanderRecruited", () => telemetry.record("CommanderRecruited"));
    bus.emit("PlanetRestored", { planetId: "settlement-verdance" });
    bus.emit("PlanetRestored", { planetId: "settlement-lucent-gate" });
    bus.emit("CommanderRecruited", { commanderId: "voss-pathfinder" });
    expect(telemetry.countFor("PlanetRestored")).toBe(2);
    expect(telemetry.totalEvents()).toBe(3);
  });
});
