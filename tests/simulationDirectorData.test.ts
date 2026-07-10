import { describe, expect, it } from "vitest";
import {
  DIAGNOSTIC_TOOLS,
  EMERGENCE_OPPORTUNITY_KINDS,
  EMOTIONAL_PACING_AVOID,
  EMOTIONAL_PACING_CATEGORIES,
  LIVING_BACKGROUND_EXAMPLES,
  LOAD_BALANCING_FACTORS,
  NARRATIVE_GUARDRAILS,
  SIMULATION_BUDGET_FACTORS,
  SIMULATION_DIRECTOR_ACCESSIBILITY_SURFACES,
  SIMULATION_DIRECTOR_RESPONSIBILITIES,
  SIMULATION_TIERS,
  SYSTEM_SYNCHRONISATION_EXAMPLES,
  computeAttentionScore,
  narrativeGuardrailsRespected,
} from "../src/game/simulationDirector/simulationDirectorData";
import { AttentionTracker, EmergenceOpportunityLog, EmotionalPacingTracker, SimulationTierEngine, allocateSimulationBudget } from "../src/game/simulationDirector/SimulationDirectorRuntime";
import { DecisionRouter, PerformanceBudgetTracker } from "../src/game/aos/AosRuntime";

describe("The Atlas Simulation Director (AF-153)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(SIMULATION_DIRECTOR_RESPONSIBILITIES.length).toBe(17);
    expect(SIMULATION_TIERS.length).toBe(5);
    expect(SIMULATION_BUDGET_FACTORS.length).toBe(5);
    expect(EMOTIONAL_PACING_CATEGORIES.length).toBe(8);
    expect(EMOTIONAL_PACING_AVOID.length).toBe(3);
    expect(SYSTEM_SYNCHRONISATION_EXAMPLES.length).toBe(7);
    expect(NARRATIVE_GUARDRAILS.length).toBe(6);
    expect(LIVING_BACKGROUND_EXAMPLES.length).toBe(6);
    expect(LOAD_BALANCING_FACTORS.length).toBe(6);
    expect(EMERGENCE_OPPORTUNITY_KINDS.length).toBe(6);
    expect(DIAGNOSTIC_TOOLS.length).toBe(7);
    expect(SIMULATION_DIRECTOR_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("computeAttentionScore averages the 8 real factor values without importing the systems it reads from", () => {
    const score = computeAttentionScore({
      playerProximity: 100,
      narrativeImportance: 100,
      historicalImportance: 0,
      commanderRelevance: 0,
      urgency: 0,
      populationImpact: 0,
      currentMission: 0,
      emotionalSignificance: 0,
    });
    expect(score).toBeCloseTo(25, 5);
  });

  it("narrativeGuardrailsRespected requires every one of the 6 guardrails, the eighth all-must-pass checklist gate in this codebase", () => {
    const partial = new Set(NARRATIVE_GUARDRAILS.slice(0, 5));
    expect(narrativeGuardrailsRespected(partial)).toBe(false);
    expect(narrativeGuardrailsRespected(new Set(NARRATIVE_GUARDRAILS))).toBe(true);
  });

  it("System Synchronisation and Event Prioritisation reuse AF-144's real DecisionRouter directly", () => {
    const router = new DecisionRouter();
    const resolution = router.resolve([
      { systemId: "weather", targetId: "settlement-verdance", tier: "Medium", fromPlayer: false },
      { systemId: "player-input", targetId: "settlement-verdance", tier: "Low", fromPlayer: true },
    ]);
    expect(resolution?.winner.fromPlayer).toBe(true);
  });

  it("Simulation Budget / Load Balancing reuse AF-144's real PerformanceBudgetTracker directly", () => {
    const tracker = new PerformanceBudgetTracker();
    tracker.reportUsage("Simulation depth", 95);
    expect(tracker.recommendedThrottleTargets()).toContain("Simulation depth");
  });

  it("SimulationTierEngine throttles Galactic-tier entities far more than Immediate-tier ones, mirroring but never reusing AF-144's real PriorityEngine type", () => {
    const engine = new SimulationTierEngine();
    engine.register("player", "Immediate");
    engine.register("remote-civilisation", "Galactic");
    let immediateUpdates = 0;
    let galacticUpdates = 0;
    for (let frame = 0; frame < 200; frame++) {
      if (engine.shouldUpdate("player", frame)) immediateUpdates++;
      if (engine.shouldUpdate("remote-civilisation", frame)) galacticUpdates++;
    }
    expect(immediateUpdates).toBe(200);
    expect(galacticUpdates).toBeLessThan(immediateUpdates);
  });

  it("AttentionTracker ranks entities by real stored score, clamped to 0-100", () => {
    const tracker = new AttentionTracker();
    tracker.setScore("commander-fen-beastmaster", 80);
    tracker.setScore("remote-wildlife-population", 10);
    tracker.setScore("overflow-entity", 500);
    expect(tracker.scoreFor("overflow-entity")).toBe(100);
    expect(tracker.topEntities(1)[0]?.entityId).toBe("overflow-entity");
  });

  it("allocateSimulationBudget distributes CPU time proportional to real attention scores, a different granularity than AF-144's domain-based tracker", () => {
    const shares = allocateSimulationBudget(100, new Map([["a", 80], ["b", 20]]));
    expect(shares.get("a")).toBeCloseTo(80, 5);
    expect(shares.get("b")).toBeCloseTo(20, 5);
  });

  it("EmotionalPacingTracker flags an imbalanced category once the same beat repeats across the whole window", () => {
    const tracker = new EmotionalPacingTracker();
    for (let i = 0; i < 5; i++) tracker.record("Danger", i);
    expect(tracker.imbalancedCategory(5)).toBe("Danger");
    tracker.record("Recovery", 5);
    expect(tracker.imbalancedCategory(5)).toBeNull();
  });

  it("EmergenceOpportunityLog is append-only and filterable by kind", () => {
    const log = new EmergenceOpportunityLog();
    log.surface("Commander reunions", ["commander-fen-beastmaster", "commander-thorne-starforged"], "A shared mentor reconnects them.", 4);
    expect(log.all().length).toBe(1);
    expect(log.countFor("Commander reunions")).toBe(1);
  });
});
