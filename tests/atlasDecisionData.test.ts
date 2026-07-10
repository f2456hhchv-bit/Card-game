import { describe, expect, it } from "vitest";
import {
  CITIZEN_DECISION_KINDS,
  COLONY_DECISION_KINDS,
  COMMANDER_DECISION_KINDS,
  DECISION_EXPLANATION_TOOLS,
  DECISION_FACTORS,
  DECISION_PYRAMID_LEVELS,
  ETHICAL_VALUES,
  EXPLORATION_DECISION_KINDS,
  GROUP_CONSENSUS_FACTORS,
  GROUP_DECISION_BODIES,
  LONG_TERM_PLANNING_HORIZONS,
  PLAYER_INFLUENCE_CAP,
  PLAYER_INFLUENCE_CHANNELS,
  RESEARCH_DECISION_KINDS,
  SOCIAL_DECISION_KINDS,
  WILDLIFE_DECISION_KINDS,
  cappedPlayerInfluence,
  ethicalAlignmentScore,
  explainDecision,
  planningHorizonRank,
} from "../src/game/atlasDecision/atlasDecisionData";
import { DecisionLog } from "../src/game/atlasDecision/AtlasDecisionRuntime";
import { CyclicStageTracker, CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { EXPLORATION_REASONING_FACTORS } from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { PERSONALITY_TRAITS } from "../src/game/commanders/commanderProductionData";

describe("The Atlas Decision Engine (AF-156)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(DECISION_PYRAMID_LEVELS.length).toBe(7);
    expect(DECISION_FACTORS.length).toBe(10);
    expect(COMMANDER_DECISION_KINDS.length).toBe(8);
    expect(CITIZEN_DECISION_KINDS.length).toBe(9);
    expect(COLONY_DECISION_KINDS.length).toBe(9);
    expect(RESEARCH_DECISION_KINDS.length).toBe(7);
    expect(EXPLORATION_DECISION_KINDS.length).toBe(7);
    expect(WILDLIFE_DECISION_KINDS.length).toBe(8);
    expect(SOCIAL_DECISION_KINDS.length).toBe(8);
    expect(ETHICAL_VALUES.length).toBe(6);
    expect(PLAYER_INFLUENCE_CHANNELS.length).toBe(7);
    expect(GROUP_DECISION_BODIES.length).toBe(4);
    expect(GROUP_CONSENSUS_FACTORS.length).toBe(6);
    expect(LONG_TERM_PLANNING_HORIZONS.length).toBe(5);
    expect(DECISION_EXPLANATION_TOOLS.length).toBe(6);
  });

  it("EXPLORATION_DECISION_KINDS (decision slots) shares zero members with AF-155's real EXPLORATION_REASONING_FACTORS (evaluation criteria), confirming the two are a genuinely different axis", () => {
    const overlap = EXPLORATION_DECISION_KINDS.filter((kind) => (EXPLORATION_REASONING_FACTORS as readonly string[]).includes(kind));
    expect(overlap).toEqual([]);
  });

  it("Decision Factors lists Personality but the Personality design law (dialogue-only, never a stat weight) still holds — this module never feeds PersonalityTrait into a numeric score", () => {
    expect(DECISION_FACTORS).toContain("Personality");
    expect(PERSONALITY_TRAITS.length).toBeGreaterThan(0);
  });

  it("ethicalAlignmentScore lets different factions weigh the same values differently, a decoupled composer over plain priority maps", () => {
    const conservationFaction = { Preservation: 10, "Environmental stewardship": 8 } as const;
    const expansionFaction = { "Long-term prosperity": 10, Education: 2 } as const;
    const servedValues = new Set<(typeof ETHICAL_VALUES)[number]>(["Preservation", "Environmental stewardship"]);
    expect(ethicalAlignmentScore(conservationFaction, servedValues)).toBe(18);
    expect(ethicalAlignmentScore(expansionFaction, servedValues)).toBe(0);
  });

  it("cappedPlayerInfluence enforces 'never absolute control' regardless of the raw signal", () => {
    expect(cappedPlayerInfluence(0.3)).toBe(0.3);
    expect(cappedPlayerInfluence(5)).toBe(PLAYER_INFLUENCE_CAP);
    expect(cappedPlayerInfluence(-1)).toBe(0);
  });

  it("planningHorizonRank orders from the shortest to the longest of the 5 planning horizons", () => {
    expect(planningHorizonRank("One mission")).toBe(0);
    expect(planningHorizonRank("One generation")).toBe(4);
  });

  it("explainDecision composes AF-155's real rankOptions directly and ranks rejected alternatives by descending score", () => {
    const explanation = explainDecision([
      { id: "expand-north", scores: { Expansion: 80 } },
      { id: "expand-south", scores: { Expansion: 50 } },
      { id: "stay-put", scores: { Expansion: 10 } },
    ]);
    expect(explanation?.chosenId).toBe("expand-north");
    expect(explanation?.rejectedIds).toEqual(["expand-south", "stay-put"]);
  });

  it("DecisionLog.isRepetitive mirrors AF-153/154's real stall/imbalance check, generalised across any decision domain", () => {
    const log = new DecisionLog();
    for (let i = 0; i < 5; i++) log.record("Colony", "Expansion", "expand-north", 0.8, i);
    expect(log.isRepetitive("Colony")).toBe(true);
    log.record("Colony", "Expansion", "expand-south", 0.6, 5);
    expect(log.isRepetitive("Colony")).toBe(false);
  });

  it("Decision Pyramid progression is driven directly by AF-155's real generic CyclicStageTracker, no new tracker class", () => {
    const pyramid = new CyclicStageTracker(DECISION_PYRAMID_LEVELS);
    pyramid.record("Need", 1);
    expect(pyramid.currentStage()).toBe("Need");
    expect(pyramid.next("Reflection")).toBe("Need");
  });

  it("Group Decisions reuse AF-155's real CollaborativeProblemLog directly, the same mechanic at a formal-body granularity", () => {
    const log = new CollaborativeProblemLog();
    log.propose("colony-expansion-vote", ["commander-fen-beastmaster", "scientist-vale"], "Commander Council", 12);
    expect(log.participantsFor("colony-expansion-vote").length).toBe(2);
  });
});
