import { describe, expect, it } from "vitest";
import {
  ATLAS_PROTOCOL_STAGES,
  ATLAS_QUESTIONS,
  ATLAS_SCORE_CATEGORIES,
  ATLAS_SCORE_GATE_THRESHOLD,
  DEVELOPER_OATH_COMMITMENTS,
  DISCOVERY_QUESTIONS,
  DOCUMENTATION_OUTPUTS,
  EMERGENCE_QUESTIONS,
  EXPANSION_QUESTIONS,
  FINAL_VALIDATION_QUESTIONS,
  GREEN_FLAGS,
  INTEGRATION_TARGETS,
  ITERATION_LOOP_STEPS,
  POST_LAUNCH_REVIEW_CATEGORIES,
  PRESERVATION_TARGETS,
  RED_FLAGS,
  SIMULATION_HORIZON_HOURS,
  SYSTEM_IMPACT_CATEGORIES,
  VALIDATION_CRITERIA,
  featureFlagAssessment,
  finalValidationPassed,
  nextAtlasProtocolStage,
  systemImpactReportFor,
} from "../src/game/atlasProtocol/atlasProtocolData";
import { AtlasScoreCard, FeatureLifecycleTracker, IterationCycleTracker } from "../src/game/atlasProtocol/AtlasProtocolRuntime";

describe("The Atlas Protocol (AF-149)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ATLAS_PROTOCOL_STAGES.length).toBe(7);
    expect(DISCOVERY_QUESTIONS.length).toBe(3);
    expect(INTEGRATION_TARGETS.length).toBe(8);
    expect(SIMULATION_HORIZON_HOURS.length).toBe(4);
    expect(VALIDATION_CRITERIA.length).toBe(8);
    expect(EMERGENCE_QUESTIONS.length).toBe(4);
    expect(PRESERVATION_TARGETS.length).toBe(5);
    expect(EXPANSION_QUESTIONS.length).toBe(2);
    expect(SYSTEM_IMPACT_CATEGORIES.length).toBe(11);
    expect(ATLAS_QUESTIONS.length).toBe(8);
    expect(RED_FLAGS.length).toBe(10);
    expect(GREEN_FLAGS.length).toBe(10);
    expect(ITERATION_LOOP_STEPS.length).toBe(6);
    expect(DOCUMENTATION_OUTPUTS.length).toBe(8);
    expect(POST_LAUNCH_REVIEW_CATEGORIES.length).toBe(8);
    expect(ATLAS_SCORE_CATEGORIES.length).toBe(10);
    expect(DEVELOPER_OATH_COMMITMENTS.length).toBe(6);
    expect(FINAL_VALIDATION_QUESTIONS.length).toBe(4);
  });

  it("ATLAS_SCORE_GATE_THRESHOLD matches the spec's own 9.5 figure, kept separate from AF-143's real DesignScoreCard", () => {
    expect(ATLAS_SCORE_GATE_THRESHOLD).toBe(9.5);
  });

  it("nextAtlasProtocolStage advances strictly one stage at a time and returns null past Expansion", () => {
    expect(nextAtlasProtocolStage("Discovery")).toBe("Integration");
    expect(nextAtlasProtocolStage("Preservation")).toBe("Expansion");
    expect(nextAtlasProtocolStage("Expansion")).toBeNull();
  });

  it("systemImpactReportFor flags a feature as isolated only when it touches none of the 11 real categories", () => {
    expect(systemImpactReportFor({}).isolated).toBe(true);
    const report = systemImpactReportFor({ Gameplay: true, Narrative: true });
    expect(report.isolated).toBe(false);
    expect(report.affected).toEqual(["Gameplay", "Narrative"]);
  });

  it("featureFlagAssessment rejects immediately on any red flag regardless of green-flag strength", () => {
    const rejected = featureFlagAssessment(new Set(["Artificial grind"]), new Set(GREEN_FLAGS));
    expect(rejected.shouldReject).toBe(true);
    const accepted = featureFlagAssessment(new Set(), new Set(["Discovery", "Wonder"]));
    expect(accepted.shouldReject).toBe(false);
    expect(accepted.greenFlagStrength).toBe(2);
  });

  it("finalValidationPassed requires every one of the 4 questions, the seventh all-must-pass checklist gate in this codebase", () => {
    const partial = new Set(FINAL_VALIDATION_QUESTIONS.slice(0, 3));
    expect(finalValidationPassed(partial)).toBe(false);
    expect(finalValidationPassed(new Set(FINAL_VALIDATION_QUESTIONS))).toBe(true);
  });

  it("FeatureLifecycleTracker moves a feature through the Seven Stages one at a time, never skipping", () => {
    const tracker = new FeatureLifecycleTracker();
    tracker.register("feature-ocean-worlds", 0);
    expect(tracker.stageFor("feature-ocean-worlds")).toBe("Discovery");
    tracker.advance("feature-ocean-worlds", 1);
    expect(tracker.stageFor("feature-ocean-worlds")).toBe("Integration");
    for (let i = 0; i < 10; i++) tracker.advance("feature-ocean-worlds", i + 2);
    expect(tracker.stageFor("feature-ocean-worlds")).toBe("Expansion");
    expect(tracker.historyFor("feature-ocean-worlds").length).toBe(ATLAS_PROTOCOL_STAGES.length);
  });

  it("AtlasScoreCard only passes the gate once every category is scored and the average clears 9.5, mirroring AF-143's real DesignScoreCard shape", () => {
    const card = new AtlasScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const category of ATLAS_SCORE_CATEGORIES) card.score(category, 9.8);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
    card.score("Originality", 15);
    expect(card.scoreFor("Originality")).toBe(10);
  });

  it("IterationCycleTracker only marks a feature ready to ship after at least two real cycles — never the first version", () => {
    const tracker = new IterationCycleTracker();
    tracker.recordCycle("feature-ocean-worlds", 0);
    expect(tracker.readyToShip("feature-ocean-worlds")).toBe(false);
    tracker.recordCycle("feature-ocean-worlds", 5);
    expect(tracker.readyToShip("feature-ocean-worlds")).toBe(true);
    expect(tracker.cycleCountFor("feature-ocean-worlds")).toBe(2);
  });
});
