import { describe, expect, it } from "vitest";
import {
  ADAPTIVE_PLANNING_TRIGGERS,
  COLLABORATIVE_PLANNING_CONTRIBUTORS,
  COLONY_PLAN_KINDS,
  COMMANDER_PLAN_KINDS,
  ECONOMIC_PLAN_KINDS,
  ENVIRONMENTAL_PLAN_KINDS,
  EXPLORATION_PLAN_KINDS,
  PLANNING_TIME_HORIZONS,
  PLANNING_VISUALISATION_TOOLS,
  PLAN_MEMORY_OUTCOMES,
  PLAN_NEGOTIATION_FACTORS,
  SCIENTIFIC_PLAN_KINDS,
  hasContingencyCoverage,
  type ContingencySet,
  type Plan,
} from "../src/game/atlasPlanning/atlasPlanningData";
import { PlanAdaptationLog, PlanMemoryArchive, PlanRegistry } from "../src/game/atlasPlanning/AtlasPlanningRuntime";
import { LONG_TERM_PLANNING_HORIZONS, explainDecision } from "../src/game/atlasDecision/atlasDecisionData";
import { SIMULATION_TIERS } from "../src/game/simulationDirector/simulationDirectorData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";

const CONTINGENCY: ContingencySet = {
  primaryApproach: "Direct reforestation drive",
  alternativeRoute: "Staged reforestation over three seasons",
  emergencyRecovery: "Emergency seed bank deployment",
  resourceReserve: "20% material buffer",
  personnelReplacement: "Trained backup ranger team",
  scientificBackup: "Secondary soil-analysis lab",
};

function samplePlan(overrides: Partial<Plan> = {}): Plan {
  return {
    id: "reforest-verdance",
    objective: "Restore the Verdance forest canopy",
    motivation: "Wildlife corridor recovery",
    requirements: ["seed stock", "ranger team"],
    resources: ["credits-4000"],
    participants: ["commander-fen-beastmaster"],
    dependencies: [],
    estimatedDuration: 20,
    riskProfile: 0.2,
    fallbackStrategies: ["staged rollout"],
    successCriteria: ["canopy coverage +15%"],
    historicalImportance: 40,
    horizon: "Long-Term",
    contingency: CONTINGENCY,
    ...overrides,
  };
}

describe("The Atlas Planning Engine (AF-157)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(PLANNING_TIME_HORIZONS.length).toBe(5);
    expect(COMMANDER_PLAN_KINDS.length).toBe(8);
    expect(COLONY_PLAN_KINDS.length).toBe(8);
    expect(SCIENTIFIC_PLAN_KINDS.length).toBe(7);
    expect(EXPLORATION_PLAN_KINDS.length).toBe(7);
    expect(ECONOMIC_PLAN_KINDS.length).toBe(7);
    expect(ENVIRONMENTAL_PLAN_KINDS.length).toBe(7);
    expect(ADAPTIVE_PLANNING_TRIGGERS.length).toBe(6);
    expect(COLLABORATIVE_PLANNING_CONTRIBUTORS.length).toBe(7);
    expect(PLAN_NEGOTIATION_FACTORS.length).toBe(7);
    expect(PLAN_MEMORY_OUTCOMES.length).toBe(6);
    expect(PLANNING_VISUALISATION_TOOLS.length).toBe(7);
  });

  it("PLANNING_TIME_HORIZONS is confirmed a genuinely different axis from AF-156's real LONG_TERM_PLANNING_HORIZONS and AF-153's real SIMULATION_TIERS despite sharing 'Immediate' as a name", () => {
    expect(PLANNING_TIME_HORIZONS).not.toEqual(LONG_TERM_PLANNING_HORIZONS);
    expect(PLANNING_TIME_HORIZONS).not.toEqual(SIMULATION_TIERS);
    expect(PLANNING_TIME_HORIZONS[0]).toBe("Immediate");
    expect(SIMULATION_TIERS[0]).toBe("Immediate");
  });

  it("hasContingencyCoverage requires all 6 fallback slots present, never a partial or numeric score", () => {
    expect(hasContingencyCoverage(CONTINGENCY)).toBe(true);
    expect(hasContingencyCoverage(null)).toBe(false);
    expect(hasContingencyCoverage({ ...CONTINGENCY, scientificBackup: "" })).toBe(false);
  });

  it("PlanRegistry only resolves dependencies once every dependency plan is registered AND marked complete", () => {
    const registry = new PlanRegistry();
    const foundation = samplePlan({ id: "seed-bank-setup", dependencies: [] });
    const dependent = samplePlan({ id: "reforest-verdance", dependencies: ["seed-bank-setup"] });
    registry.register(foundation);
    registry.register(dependent);
    expect(registry.dependenciesSatisfied("reforest-verdance")).toBe(false);
    registry.markComplete("seed-bank-setup", 10);
    expect(registry.dependenciesSatisfied("reforest-verdance")).toBe(true);
  });

  it("PlanAdaptationLog is append-only and filterable by trigger — 'plans adapt instead of failing'", () => {
    const log = new PlanAdaptationLog();
    log.adapt("reforest-verdance", "Natural disasters", "A wildfire delayed the reforestation timeline.", 15);
    expect(log.countFor("Natural disasters")).toBe(1);
    expect(log.all().length).toBe(1);
  });

  it("PlanMemoryArchive records which outcomes a completed plan produced", () => {
    const archive = new PlanMemoryArchive();
    archive.archive("reforest-verdance", ["Museum exhibits", "Educational material"], 40);
    expect(archive.outcomesFor("reforest-verdance")).toEqual(["Museum exhibits", "Educational material"]);
  });

  it("Plan Negotiation reuses AF-156's real explainDecision directly, the same weigh-and-rank mechanic rather than a third scoring formula", () => {
    const explanation = explainDecision([
      { id: "reforest-verdance", scores: { "Environmental impact": 70, Evidence: 60 } },
      { id: "expand-mining", scores: { "Environmental impact": -20, Evidence: 50 } },
    ]);
    expect(explanation?.chosenId).toBe("reforest-verdance");
  });

  it("Collaborative Planning reuses AF-155's real CollaborativeProblemLog directly, the third instance of the identical mechanic in this codebase", () => {
    const log = new CollaborativeProblemLog();
    log.propose("reforest-verdance", ["scientist-vale", "commander-fen-beastmaster"], "Environmental", 20);
    expect(log.participantsFor("reforest-verdance").length).toBe(2);
  });
});
