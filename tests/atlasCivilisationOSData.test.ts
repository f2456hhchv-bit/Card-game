import { describe, expect, it } from "vitest";
import {
  ADAPTIVE_COORDINATION_TIERS,
  CIVILISATION_BUS_EVENT_KINDS,
  CIVILISATION_FAILSAFE_PRIORITY_ORDER,
  CIVILISATION_HEALTH_DOMAINS,
  CIVILISATION_HEARTBEAT_QUESTIONS,
  CIVILISATION_OS_DEVELOPER_TOOLS,
  CORE_SERVICES,
  RESOURCE_POOL_KINDS,
  SELF_OPTIMISATION_TARGETS,
  adaptiveCoordinationTierRank,
  type CivilisationBusEventMap,
} from "../src/game/atlasCivilisationOS/atlasCivilisationOSData";
import { CivilisationHealthTracker, CivilisationHeartbeat, ResourcePoolCoordinator, resolveByCivilisationFailsafePriority } from "../src/game/atlasCivilisationOS/AtlasCivilisationOSRuntime";
import { EventBus } from "../src/core/events/EventBus";
import { PriorityEngine, TelemetryCollector, WorldStateStore } from "../src/game/aos/AosRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CIVILISATION_ATTRIBUTES, type CivilisationAttribute } from "../src/game/civilisationEngine/civilisationEngineData";

describe("The Atlas Civilisation Operating System (AF-189)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CORE_SERVICES.length).toBe(12);
    expect(CIVILISATION_BUS_EVENT_KINDS.length).toBe(8);
    expect(RESOURCE_POOL_KINDS.length).toBe(8);
    expect(CIVILISATION_FAILSAFE_PRIORITY_ORDER.length).toBe(6);
    expect(CIVILISATION_HEALTH_DOMAINS.length).toBe(7);
    expect(ADAPTIVE_COORDINATION_TIERS.length).toBe(4);
    expect(CIVILISATION_HEARTBEAT_QUESTIONS.length).toBe(5);
    expect(SELF_OPTIMISATION_TARGETS.length).toBe(6);
    expect(CIVILISATION_OS_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("The Civilisation Bus reuses AF-001's real generic EventBus directly, instantiated with its own CivilisationBusEventMap", () => {
    const bus = new EventBus<CivilisationBusEventMap>();
    let heard: string | null = null;
    bus.on("UniversityFounded", (payload) => (heard = payload.institutionId));
    bus.emit("UniversityFounded", { institutionId: "institution-living-city-academy" });
    expect(heard).toBe("institution-living-city-academy");
  });

  it("State Management reuses AF-144's real generic WorldStateStore directly, instantiated over the real, already-locked CivilisationAttribute union", () => {
    const state = new WorldStateStore<Partial<Record<CivilisationAttribute, number>>>();
    expect(CIVILISATION_ATTRIBUTES).toContain("Population");
    state.setCurrent({ Population: 500, Education: 70 }, 10);
    expect(state.getCurrent()?.Population).toBe(500);
  });

  it("Priority Management and Civilisation Telemetry reuse AF-144's real PriorityEngine and TelemetryCollector directly", () => {
    const priority = new PriorityEngine();
    priority.register("emergency-recovery", "High");
    expect(priority.tierFor("emergency-recovery")).toBe("High");
    const telemetry = new TelemetryCollector();
    telemetry.record("DiscoveryCompleted");
    telemetry.record("DiscoveryCompleted");
    expect(telemetry.countFor("DiscoveryCompleted")).toBe(2);
  });

  it("Task Orchestration reuses AF-162's real LongTermMissionTracker directly for a megaproject", () => {
    const tasks = new LongTermMissionTracker();
    tasks.register("megaproject-orbital-ring", "Construct the Orbital Ring", 100);
    tasks.advance("megaproject-orbital-ring", 100);
    expect(tasks.isComplete("megaproject-orbital-ring")).toBe(true);
  });

  it("Service Dependencies composes AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "service-education", toId: "service-research", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "Education outputs feed Research inputs.", dateEstablished: 20 });
    expect(graph.neighbors("service-education")).toContain("service-research");
  });

  it("resolveByCivilisationFailsafePriority resolves the single highest-priority active concern, mirroring AF-154's real resolveByFailsafePriority shape a second time", () => {
    expect(resolveByCivilisationFailsafePriority(new Set())).toBeNull();
    expect(resolveByCivilisationFailsafePriority(new Set(["Commander burnout", "Knowledge loss"]))).toBe("Knowledge loss");
    expect(resolveByCivilisationFailsafePriority(new Set(["Infrastructure overload"]))).toBe("Infrastructure overload");
  });

  it("CivilisationHealthTracker inverts AF-144's real PerformanceBudgetTracker direction — a low score, not a high one, marks a domain weak", () => {
    const health = new CivilisationHealthTracker();
    health.reportHealth("Commander workload", 30);
    health.reportHealth("Educational quality", 90);
    health.reportHealth("Community wellbeing", 10);
    expect(health.isWeak("Commander workload")).toBe(true);
    expect(health.isWeak("Educational quality")).toBe(false);
    expect(health.weakestDomains()).toEqual(["Community wellbeing", "Commander workload"]);
  });

  it("ResourcePoolCoordinator allocates and releases named resource pools, rejecting over-allocation", () => {
    const resources = new ResourcePoolCoordinator();
    resources.registerPool("Researchers", 10);
    expect(resources.allocate("Researchers", 7)).toBe(true);
    expect(resources.availableFor("Researchers")).toBe(3);
    expect(resources.allocate("Researchers", 5)).toBe(false);
    resources.release("Researchers", 7);
    expect(resources.availableFor("Researchers")).toBe(10);
  });

  it("adaptiveCoordinationTierRank orders the 4-tier ladder from Local settlements to Galactic institutions", () => {
    expect(adaptiveCoordinationTierRank("Local settlements")).toBe(0);
    expect(adaptiveCoordinationTierRank("Galactic institutions")).toBe(3);
  });

  it("CivilisationHeartbeat is append-only, preserving every tick as history rather than overwriting the last (distinct from AF-185's real LivingPresentTracker)", () => {
    const heartbeat = new CivilisationHeartbeat();
    heartbeat.tick(10, { "What has changed?": "A new university opened." });
    heartbeat.tick(20, { "Who needs help?": "The frontier settlement needs teachers." });
    expect(heartbeat.history().length).toBe(2);
    expect(heartbeat.latest()?.epoch).toBe(20);
    expect(heartbeat.history()[0]?.answers["What has changed?"]).toBe("A new university opened.");
  });
});
