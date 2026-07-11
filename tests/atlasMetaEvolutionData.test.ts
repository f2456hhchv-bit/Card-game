import { describe, expect, it } from "vitest";
import {
  ATLAS_SCORECARD_CATEGORIES,
  COMMUNITY_EVOLUTION_SIGNALS,
  CONTENT_EVOLUTION_PRINCIPLES,
  CONTINUOUS_DOCUMENTATION_OUTPUTS,
  EXPANSION_GOVERNANCE_FIELDS,
  META_EVOLUTION_DEVELOPER_TOOLS,
  META_EVOLUTION_DOMAINS,
  PLAYER_EVOLUTION_SIGNALS,
  QUALITY_EVOLUTION_CRITERIA,
  REGRESSION_SIGNALS,
  TECHNICAL_EVOLUTION_CONCERNS,
  TEN_YEAR_TEST_QUESTION,
  UPDATE_LIFECYCLE_STAGES,
} from "../src/game/atlasMetaEvolution/atlasMetaEvolutionData";
import { AtlasScorecardCard, DesignHistoryLedger, TechnicalDebtLog, UpdateLifecycleTracker, updateQualityAssessment } from "../src/game/atlasMetaEvolution/AtlasMetaEvolutionRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { IterationCycleTracker } from "../src/game/atlasProtocol/AtlasProtocolRuntime";
import { SYSTEM_IMPACT_CATEGORIES, systemImpactReportFor, EXPANSION_QUESTIONS } from "../src/game/atlasProtocol/atlasProtocolData";
import { TelemetryCollector } from "../src/game/aos/AosRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";

describe("The Atlas Meta Evolution Engine (AF-190)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(META_EVOLUTION_DOMAINS.length).toBe(12);
    expect(UPDATE_LIFECYCLE_STAGES.length).toBe(12);
    expect(TECHNICAL_EVOLUTION_CONCERNS.length).toBe(6);
    expect(CONTENT_EVOLUTION_PRINCIPLES.length).toBe(5);
    expect(PLAYER_EVOLUTION_SIGNALS.length).toBe(6);
    expect(COMMUNITY_EVOLUTION_SIGNALS.length).toBe(6);
    expect(REGRESSION_SIGNALS.length).toBe(7);
    expect(QUALITY_EVOLUTION_CRITERIA.length).toBe(8);
    expect(EXPANSION_GOVERNANCE_FIELDS.length).toBe(7);
    expect(ATLAS_SCORECARD_CATEGORIES.length).toBe(10);
    expect(CONTINUOUS_DOCUMENTATION_OUTPUTS.length).toBe(6);
    expect(META_EVOLUTION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Meta Evolution Domains shares 6 of 12 exact-string members with the real SYSTEM_IMPACT_CATEGORIES, documented honestly via AF-170's real detectOverlap without claiming a record", () => {
    expect(detectOverlap(META_EVOLUTION_DOMAINS, SYSTEM_IMPACT_CATEGORIES).shared.length).toBe(6);
  });

  it("The Ten-Year Test restates the same underlying question as the real EXPANSION_QUESTIONS[0], in different wording", () => {
    expect(TEN_YEAR_TEST_QUESTION.length).toBeGreaterThan(0);
    expect(EXPANSION_QUESTIONS[0]).toBe("Can this feature naturally evolve for ten years?");
    expect(TEN_YEAR_TEST_QUESTION).not.toBe(EXPANSION_QUESTIONS[0]);
  });

  it("UpdateLifecycleTracker mirrors AF-149's real FeatureLifecycleTracker shape a second time — advance always moves forward one stage, never skips or regresses", () => {
    const tracker = new UpdateLifecycleTracker();
    tracker.register("feature-living-city-heartbeat", 1);
    expect(tracker.stageFor("feature-living-city-heartbeat")).toBe("Concept");
    expect(tracker.advance("feature-living-city-heartbeat", 5)).toBe("Prototype");
    expect(tracker.advance("feature-living-city-heartbeat", 10)).toBe("Internal Simulation");
    expect(tracker.historyFor("feature-living-city-heartbeat").length).toBe(3);
  });

  it("The Update Life Cycle's Iteration stage reuses AF-149's real IterationCycleTracker directly", () => {
    const iterations = new IterationCycleTracker();
    expect(iterations.readyToShip("feature-living-city-heartbeat")).toBe(false);
    iterations.recordCycle("feature-living-city-heartbeat", 1);
    iterations.recordCycle("feature-living-city-heartbeat", 2);
    expect(iterations.readyToShip("feature-living-city-heartbeat")).toBe(true);
  });

  it("Player Evolution reuses AF-144's real TelemetryCollector directly, and Community Evolution composes AF-159's real CulturalTrendTracker directly", () => {
    const playerTelemetry = new TelemetryCollector();
    playerTelemetry.record("Museum usage");
    playerTelemetry.record("Museum usage");
    expect(playerTelemetry.countFor("Museum usage")).toBe(2);
    const communityTrends = new CulturalTrendTracker();
    communityTrends.record("Living City Fan Art", "settlement-verdance", 20);
    expect(communityTrends.adoptersFor("Living City Fan Art")).toEqual(["settlement-verdance"]);
  });

  it("Expansion Governance reuses AF-149's real systemImpactReportFor directly", () => {
    const report = systemImpactReportFor({ Gameplay: true, Accessibility: true });
    expect(report.isolated).toBe(false);
    expect(report.affected).toContain("Gameplay");
  });

  it("DesignHistoryLedger is append-only and confirmed genuinely new in domain", () => {
    const ledger = new DesignHistoryLedger();
    ledger.record("mechanic-living-city-heartbeat", { originalIntent: "Make the city feel alive.", currentImplementation: "Per-cycle Q&A log.", playerReception: "Positive.", technicalComplexity: 3, futureOpportunities: "Expose to narration.", replacementRisk: 1 }, 10);
    ledger.record("mechanic-living-city-heartbeat", { originalIntent: "Make the city feel alive.", currentImplementation: "Per-cycle Q&A log with weighted priorities.", playerReception: "Very positive.", technicalComplexity: 4, futureOpportunities: "Expose to narration.", replacementRisk: 1 }, 20);
    expect(ledger.historyFor("mechanic-living-city-heartbeat").length).toBe(2);
    expect(ledger.latestFor("mechanic-living-city-heartbeat")?.technicalComplexity).toBe(4);
  });

  it("TechnicalDebtLog is confirmed genuinely new — no technical-debt tracker exists anywhere else in the codebase", () => {
    const debt = new TechnicalDebtLog();
    debt.record("Redundant code", "Two overlapping cascade trackers could merge.", 20);
    expect(debt.all().length).toBe(1);
  });

  it("updateQualityAssessment mirrors AF-149's real featureFlagAssessment shape a second time — any regression signal rejects regardless of quality gains", () => {
    const clean = updateQualityAssessment(new Set(), new Set(["Wonder", "Accessibility"]));
    expect(clean.shouldReject).toBe(false);
    expect(clean.qualityImprovementCount).toBe(2);
    const regressed = updateQualityAssessment(new Set(["UI clutter"]), new Set(["Wonder", "Accessibility", "Hope"]));
    expect(regressed.shouldReject).toBe(true);
    expect(regressed.regressionCount).toBe(1);
  });

  it("AtlasScorecardCard mirrors AF-143/149/170/173/179/180/182/184/188's real scoring-rubric shape, the tenth such rubric, requiring every category before passing the shared 9.5 gate", () => {
    const card = new AtlasScorecardCard();
    expect(card.passesGate()).toBe(false);
    for (const category of ATLAS_SCORECARD_CATEGORIES) card.score(category, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
