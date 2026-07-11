import { describe, expect, it } from "vitest";
import {
  ACCOUNTABILITY_TARGETS,
  COMMANDER_JUDGEMENT_CRITERIA,
  COST_OF_DECISIONS_FACTORS,
  ENGINEERING_JUDGEMENT_CRITERIA,
  HISTORICAL_JUDGEMENT_CRITERIA,
  INDIVIDUAL_JUDGEMENT_TRAITS,
  JUDGEMENT_CYCLE_STAGES,
  JUDGEMENT_DEVELOPER_TOOLS,
  JUDGEMENT_DOMAINS,
  JUDGEMENT_MATURITY_QUESTIONS,
  JUDGEMENT_RECORD_FIELDS,
  PLAYER_JUDGEMENT_EXAMPLES,
  SCIENTIFIC_JUDGEMENT_CRITERIA,
  judgementCycleRank,
} from "../src/game/atlasJudgement/atlasJudgementData";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { REASONING_CYCLE_STAGES, REASONING_DOMAINS, REASONING_RECORD_FIELDS } from "../src/game/atlasReasoning/atlasReasoningData";
import { DECISION_PYRAMID_LEVELS, ETHICAL_VALUES, ethicalAlignmentScore, explainDecision } from "../src/game/atlasDecision/atlasDecisionData";
import { DecisionLog } from "../src/game/atlasDecision/AtlasDecisionRuntime";
import { rankOptions } from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";

describe("The Atlas Judgement Engine (AF-198)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(JUDGEMENT_DOMAINS.length).toBe(12);
    expect(JUDGEMENT_CYCLE_STAGES.length).toBe(9);
    expect(INDIVIDUAL_JUDGEMENT_TRAITS.length).toBe(7);
    expect(COMMANDER_JUDGEMENT_CRITERIA.length).toBe(7);
    expect(SCIENTIFIC_JUDGEMENT_CRITERIA.length).toBe(6);
    expect(ENGINEERING_JUDGEMENT_CRITERIA.length).toBe(6);
    expect(HISTORICAL_JUDGEMENT_CRITERIA.length).toBe(6);
    expect(PLAYER_JUDGEMENT_EXAMPLES.length).toBe(6);
    expect(COST_OF_DECISIONS_FACTORS.length).toBe(5);
    expect(JUDGEMENT_RECORD_FIELDS.length).toBe(6);
    expect(JUDGEMENT_MATURITY_QUESTIONS.length).toBe(2);
    expect(ACCOUNTABILITY_TARGETS.length).toBe(5);
    expect(JUDGEMENT_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Judgement Domains shares 11 of 12 with the real REASONING_DOMAINS (ties but does not break AF-191's own 12/12 record)", () => {
    expect(detectOverlap(JUDGEMENT_DOMAINS, REASONING_DOMAINS).shared.length).toBe(11);
  });

  it("The Judgement Cycle shares 3 of 9 stages with AF-197's real REASONING_CYCLE_STAGES and 2 of 9 with AF-156's real DECISION_PYRAMID_LEVELS", () => {
    expect(detectOverlap(JUDGEMENT_CYCLE_STAGES, REASONING_CYCLE_STAGES).shared.length).toBe(3);
    expect(detectOverlap(JUDGEMENT_CYCLE_STAGES, DECISION_PYRAMID_LEVELS).shared.length).toBe(2);
  });

  it("Judgement Record shares 4 of 6 fields exactly with AF-197's real REASONING_RECORD_FIELDS", () => {
    expect(detectOverlap(JUDGEMENT_RECORD_FIELDS, REASONING_RECORD_FIELDS).shared.length).toBe(4);
  });

  it("judgementCycleRank is an ordered, non-cyclic lookup — 'Improved Judgement' is the highest rank, never wrapping back to Context by name", () => {
    expect(judgementCycleRank("Context")).toBe(0);
    expect(judgementCycleRank("Improved Judgement")).toBe(8);
  });

  it("balancing evidence with humanity reuses AF-156's real ethicalAlignmentScore/ETHICAL_VALUES directly", () => {
    const score = ethicalAlignmentScore({ Compassion: 3, "Scientific integrity": 2 }, new Set(["Compassion", "Scientific integrity"]));
    expect(score).toBe(5);
    expect(ETHICAL_VALUES).toContain("Compassion");
  });

  it("Scientific/Engineering/Historical Judgement's mechanism reuses AF-155's real rankOptions directly", () => {
    const outcome = rankOptions([
      { id: "option-restore-ecosystem", scores: { "Public benefit": 0.7, "Research ethics": 0.5 } },
      { id: "option-defer-restoration", scores: { "Public benefit": 0.2, "Research ethics": 0.2 } },
    ]);
    expect(outcome?.bestId).toBe("option-restore-ecosystem");
  });

  it("Judgement Record reuses AF-156's real explainDecision together with AF-156's real DecisionLog.record directly", () => {
    const outcome = explainDecision([
      { id: "option-restore-ecosystem", scores: { "Public benefit": 0.7 } },
      { id: "option-defer-restoration", scores: { "Public benefit": 0.2 } },
    ]);
    const decisions = new DecisionLog();
    decisions.record("Ecology", "Restoration priority", outcome!.chosenId, outcome!.confidence, 20);
    expect(decisions.forDomain("Ecology").length).toBe(1);
  });

  it("Collective Judgement reuses AF-155's real CollaborativeProblemLog directly", () => {
    const collaboration = new CollaborativeProblemLog();
    collaboration.propose("problem-restoration-priority-panel", ["scientist-vale", "commander-fen-beastmaster"], "Ecology", 20);
    expect(collaboration.participantsFor("problem-restoration-priority-panel").length).toBe(2);
  });
});
