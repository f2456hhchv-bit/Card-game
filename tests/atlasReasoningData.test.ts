import { describe, expect, it } from "vitest";
import {
  COLLABORATIVE_REASONING_CHANNELS,
  COMMANDER_REASONING_CRITERIA,
  ENGINEERING_REASONING_CRITERIA,
  HISTORICAL_REASONING_CRITERIA,
  INDIVIDUAL_REASONING_STYLES,
  META_REASONING_QUESTIONS,
  PLAYER_REASONING_EXAMPLES,
  REASONING_CYCLE_STAGES,
  REASONING_DEVELOPER_TOOLS,
  REASONING_DOMAINS,
  REASONING_RECORD_FIELDS,
  REASONING_STANDARD_QUESTIONS,
  SCIENTIFIC_REASONING_CRITERIA,
  reasoningCycleRank,
} from "../src/game/atlasReasoning/atlasReasoningData";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { VERIFICATION_DOMAINS } from "../src/game/atlasVerification/atlasVerificationData";
import { COHERENCE_DOMAINS } from "../src/game/atlasCoherence/atlasCoherenceData";
import { COMMANDER_REASONING_FACTORS, INTELLIGENCE_LAYERS, LEARNING_LOOP_STAGES, rankOptions, suggestUncertaintyResponse } from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { DECISION_PYRAMID_LEVELS, explainDecision } from "../src/game/atlasDecision/atlasDecisionData";
import { DecisionLog } from "../src/game/atlasDecision/AtlasDecisionRuntime";

describe("The Atlas Reasoning Engine (AF-197)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(REASONING_DOMAINS.length).toBe(12);
    expect(REASONING_CYCLE_STAGES.length).toBe(9);
    expect(INDIVIDUAL_REASONING_STYLES.length).toBe(8);
    expect(COMMANDER_REASONING_CRITERIA.length).toBe(7);
    expect(SCIENTIFIC_REASONING_CRITERIA.length).toBe(6);
    expect(ENGINEERING_REASONING_CRITERIA.length).toBe(7);
    expect(HISTORICAL_REASONING_CRITERIA.length).toBe(6);
    expect(PLAYER_REASONING_EXAMPLES.length).toBe(6);
    expect(COLLABORATIVE_REASONING_CHANNELS.length).toBe(5);
    expect(REASONING_RECORD_FIELDS.length).toBe(6);
    expect(META_REASONING_QUESTIONS.length).toBe(4);
    expect(REASONING_STANDARD_QUESTIONS.length).toBe(5);
    expect(REASONING_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Reasoning Domains shares 7 of 12 with the real VERIFICATION_DOMAINS and 6 of 12 with the real COHERENCE_DOMAINS, no record claimed", () => {
    expect(detectOverlap(REASONING_DOMAINS, VERIFICATION_DOMAINS).shared.length).toBe(7);
    expect(detectOverlap(REASONING_DOMAINS, COHERENCE_DOMAINS).shared.length).toBe(6);
  });

  it("Commander Reasoning Criteria shares ZERO exact members with the real COMMANDER_REASONING_FACTORS despite the identical conceptual purpose, mirroring AF-156's own precedent of never force-merging differently-worded factor lists", () => {
    expect(detectOverlap(COMMANDER_REASONING_CRITERIA, COMMANDER_REASONING_FACTORS).shared.length).toBe(0);
  });

  it("The Reasoning Cycle shares only 2 of 9 stages with either AF-155's real INTELLIGENCE_LAYERS or AF-156's real DECISION_PYRAMID_LEVELS, and zero with AF-155's own LEARNING_LOOP_STAGES", () => {
    expect(detectOverlap(REASONING_CYCLE_STAGES, INTELLIGENCE_LAYERS).shared.length).toBe(2);
    expect(detectOverlap(REASONING_CYCLE_STAGES, DECISION_PYRAMID_LEVELS).shared.length).toBe(2);
    expect(detectOverlap(REASONING_CYCLE_STAGES, LEARNING_LOOP_STAGES).shared.length).toBe(0);
  });

  it("reasoningCycleRank is an ordered, non-cyclic lookup — 'Improved Reasoning' is the highest rank, never wrapping back to Observation by name", () => {
    expect(reasoningCycleRank("Observation")).toBe(0);
    expect(reasoningCycleRank("Improved Reasoning")).toBe(8);
  });

  it("Uncertainty reuses AF-155's real suggestUncertaintyResponse directly, and Collaborative Reasoning reuses AF-155's real CollaborativeProblemLog directly", () => {
    expect(suggestUncertaintyResponse(0.05)).toBe("Investigation");
    expect(suggestUncertaintyResponse(0.9)).toBeNull();
    const collaboration = new CollaborativeProblemLog();
    collaboration.propose("problem-open-frontier-signal-origin", ["scientist-vale", "commander-fen-beastmaster"], "Science", 20);
    expect(collaboration.participantsFor("problem-open-frontier-signal-origin").length).toBe(2);
  });

  it("Commander/Scientific/Engineering/Historical Reasoning's underlying mechanism reuses AF-155's real rankOptions directly", () => {
    const outcome = rankOptions([
      { id: "hypothesis-dormant-relay", scores: { "Evidence quality": 0.8, Replication: 0.6 } },
      { id: "hypothesis-natural-phenomenon", scores: { "Evidence quality": 0.3, Replication: 0.2 } },
    ]);
    expect(outcome?.bestId).toBe("hypothesis-dormant-relay");
  });

  it("Reasoning Record reuses AF-156's real explainDecision together with AF-156's real DecisionLog.record directly", () => {
    const outcome = explainDecision([
      { id: "hypothesis-dormant-relay", scores: { "Evidence quality": 0.8 } },
      { id: "hypothesis-natural-phenomenon", scores: { "Evidence quality": 0.3 } },
    ]);
    expect(outcome?.rejectedIds).toEqual(["hypothesis-natural-phenomenon"]);
    const decisions = new DecisionLog();
    decisions.record("Science", "Hypothesis selection", outcome!.chosenId, outcome!.confidence, 20);
    expect(decisions.forDomain("Science").length).toBe(1);
  });
});
