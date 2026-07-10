import { describe, expect, it } from "vitest";
import {
  COLONY_FORECASTING_KINDS,
  COMMANDER_FORESIGHT_KINDS,
  ECONOMIC_FORECASTING_KINDS,
  ENVIRONMENTAL_FORECASTING_KINDS,
  EXPLORATION_FORECASTING_KINDS,
  FORECAST_FACTORS,
  FUTURE_HORIZONS,
  FUTURE_MEMORY_OUTCOMES,
  FUTURE_RESHAPING_FACTORS,
  FUTURE_STATE_KINDS,
  FUTURE_VISUALISATION_TOOLS,
  OPPORTUNITY_ANALYSIS_KINDS,
  RESEARCH_FORECASTING_KINDS,
  RISK_ANALYSIS_KINDS,
  mostLikelyFutureState,
  type FutureStateForecast,
} from "../src/game/atlasFuture/atlasFutureData";
import { FutureMemoryArchive, OpportunityLog, RiskLog } from "../src/game/atlasFuture/AtlasFutureRuntime";
import { DISCOVERY_SUGGESTION_KINDS } from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { PredictionEngine } from "../src/game/aos/AosRuntime";
import { PREDICTION_KINDS } from "../src/game/aos/aosData";
import { SIMULATION_TIERS } from "../src/game/simulationDirector/simulationDirectorData";
import { LONG_TERM_PLANNING_HORIZONS } from "../src/game/atlasDecision/atlasDecisionData";
import { PLANNING_TIME_HORIZONS } from "../src/game/atlasPlanning/atlasPlanningData";

describe("The Atlas Future Engine (AF-158)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(FUTURE_HORIZONS.length).toBe(5);
    expect(FUTURE_STATE_KINDS.length).toBe(5);
    expect(FORECAST_FACTORS.length).toBe(11);
    expect(COMMANDER_FORESIGHT_KINDS.length).toBe(8);
    expect(COLONY_FORECASTING_KINDS.length).toBe(8);
    expect(RESEARCH_FORECASTING_KINDS.length).toBe(7);
    expect(EXPLORATION_FORECASTING_KINDS.length).toBe(7);
    expect(ENVIRONMENTAL_FORECASTING_KINDS.length).toBe(7);
    expect(ECONOMIC_FORECASTING_KINDS.length).toBe(8);
    expect(RISK_ANALYSIS_KINDS.length).toBe(8);
    expect(OPPORTUNITY_ANALYSIS_KINDS.length).toBe(8);
    expect(FUTURE_RESHAPING_FACTORS.length).toBe(4);
    expect(FUTURE_MEMORY_OUTCOMES.length).toBe(5);
    expect(FUTURE_VISUALISATION_TOOLS.length).toBe(7);
  });

  it("FUTURE_HORIZONS is confirmed the fourth 'Immediate'-sharing time/scope ladder, distinct from AF-153/156/157's real lists", () => {
    expect(FUTURE_HORIZONS[0]).toBe("Immediate");
    expect(FUTURE_HORIZONS).not.toEqual(SIMULATION_TIERS);
    expect(FUTURE_HORIZONS).not.toEqual(LONG_TERM_PLANNING_HORIZONS);
    expect(FUTURE_HORIZONS).not.toEqual(PLANNING_TIME_HORIZONS);
  });

  it("OPPORTUNITY_ANALYSIS_KINDS shares zero members with AF-155's real DiscoverySuggestionKind, confirming the fifth 'notable moment' list", () => {
    const overlap = OPPORTUNITY_ANALYSIS_KINDS.filter((kind) => (DISCOVERY_SUGGESTION_KINDS as readonly string[]).includes(kind));
    expect(overlap.length).toBe(0);
  });

  it("Population growth is a verbatim shared member between COLONY_FORECASTING_KINDS and AF-144's real PREDICTION_KINDS, confirming the direct-reuse case", () => {
    expect(COLONY_FORECASTING_KINDS).toContain("Population growth");
    expect(PREDICTION_KINDS).toContain("Population growth");
  });

  it("numeric point-forecasts compose AF-144's real PredictionEngine directly rather than a second time-series forecaster", () => {
    const engine = new PredictionEngine();
    const forecast = engine.forecast("Population growth", [40, 44, 48]);
    expect(forecast.predictedNext).toBeGreaterThan(48);
    expect(forecast.confidence).toBeGreaterThan(0);
  });

  it("mostLikelyFutureState picks the branch with the highest currently-stored confidence, never a random pick", () => {
    const forecast: FutureStateForecast = {
      entityId: "settlement-verdance",
      confidences: { "Most Likely Future": 0.6, "Optimistic Future": 0.2, "Conservative Future": 0.5, "High-Risk Future": 0.1, "Unknown Future": 0.05 },
    };
    expect(mostLikelyFutureState(forecast)).toBe("Most Likely Future");
  });

  it("RiskLog tracks the latest severity per entity+kind, clamped to 0-1 — 'risk creates preparation, not punishment'", () => {
    const log = new RiskLog();
    log.flag("settlement-verdance", "Resource shortages", 0.9, 5);
    log.flag("settlement-verdance", "Resource shortages", 2, 10);
    expect(log.severityFor("settlement-verdance", "Resource shortages")).toBe(1);
    expect(log.all().length).toBe(2);
  });

  it("OpportunityLog is append-only and filterable by kind, mirroring AF-155's real DiscoverySuggestionLog shape over a new union", () => {
    const log = new OpportunityLog();
    log.surface("Scientific partnerships", "Two labs propose a joint anomaly study.", 12);
    expect(log.countFor("Scientific partnerships")).toBe(1);
    expect(log.all().length).toBe(1);
  });

  it("FutureMemoryArchive records which outcomes a completed forecast produced, mirroring AF-157's real PlanMemoryArchive shape over a new union", () => {
    const archive = new FutureMemoryArchive();
    archive.archive("forecast-verdance-growth", ["Research papers", "Educational material"], 30);
    expect(archive.outcomesFor("forecast-verdance-growth")).toEqual(["Research papers", "Educational material"]);
  });
});
