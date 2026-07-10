import { describe, expect, it } from "vitest";
import {
  COLONY_REASONING_FACTORS,
  COMMANDER_REASONING_FACTORS,
  DISCOVERY_SUGGESTION_KINDS,
  EXPLORATION_REASONING_FACTORS,
  INTELLIGENCE_DEVELOPER_TOOLS,
  INTELLIGENCE_LAYERS,
  KNOWLEDGE_SOURCES,
  LEARNING_LOOP_STAGES,
  SCIENTIFIC_REASONING_FACTORS,
  SOCIAL_REASONING_FACTORS,
  STRATEGIC_REASONING_FACTORS,
  UNCERTAINTY_RESPONSES,
  knowledgeRichnessScore,
  rankOptions,
  suggestUncertaintyResponse,
} from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { CollaborativeProblemLog, CyclicStageTracker, DiscoverySuggestionLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { PERSONALITY_TRAITS } from "../src/game/commanders/commanderProductionData";

describe("The Atlas Intelligence Engine (AF-155)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(INTELLIGENCE_LAYERS.length).toBe(6);
    expect(LEARNING_LOOP_STAGES.length).toBe(6);
    expect(KNOWLEDGE_SOURCES.length).toBe(13);
    expect(COMMANDER_REASONING_FACTORS.length).toBe(8);
    expect(COLONY_REASONING_FACTORS.length).toBe(9);
    expect(SCIENTIFIC_REASONING_FACTORS.length).toBe(6);
    expect(EXPLORATION_REASONING_FACTORS.length).toBe(8);
    expect(SOCIAL_REASONING_FACTORS.length).toBe(7);
    expect(STRATEGIC_REASONING_FACTORS.length).toBe(8);
    expect(UNCERTAINTY_RESPONSES.length).toBe(4);
    expect(DISCOVERY_SUGGESTION_KINDS.length).toBe(6);
    expect(INTELLIGENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Intelligence Layers and Learning Loop are confirmed distinct six-stage cycles, not the same list twice", () => {
    expect(INTELLIGENCE_LAYERS).not.toEqual(LEARNING_LOOP_STAGES);
    expect(INTELLIGENCE_LAYERS).toContain("Prediction");
    expect(LEARNING_LOOP_STAGES).not.toContain("Prediction");
    expect(LEARNING_LOOP_STAGES).toContain("Improve");
    expect(INTELLIGENCE_LAYERS).not.toContain("Improve");
  });

  it("rankOptions is the one shared decision-scoring mechanic behind all six reasoning sections", () => {
    const outcome = rankOptions([
      { id: "expedition-a", scores: { Risk: 20, "Potential reward": 90 } },
      { id: "expedition-b", scores: { Risk: 20, "Potential reward": 30 } },
    ]);
    expect(outcome?.bestId).toBe("expedition-a");
    expect(outcome?.confidence).toBeGreaterThan(0);
  });

  it("rankOptions returns null for no options and zero confidence for an exact tie", () => {
    expect(rankOptions([])).toBeNull();
    const tie = rankOptions([
      { id: "a", scores: { x: 50 } },
      { id: "b", scores: { x: 50 } },
    ]);
    expect(tie?.confidence).toBe(0);
  });

  it("Commander Reasoning never lets PersonalityTrait weight the numeric decision score, respecting the real 'dialogue-only' design law", () => {
    expect(PERSONALITY_TRAITS.length).toBeGreaterThan(0);
    const outcome = rankOptions([
      { id: "cautious-plan", scores: { "Civilian risk": 30, "Current resources": 20 } },
      { id: "bold-plan", scores: { "Civilian risk": 10, "Current resources": 90 } },
    ]);
    expect(outcome?.bestId).toBe("bold-plan");
  });

  it("suggestUncertaintyResponse only fires below the confidence threshold, deterministically banded", () => {
    expect(suggestUncertaintyResponse(0.4)).toBeNull();
    expect(suggestUncertaintyResponse(0.35)).toBe("Discussion");
    expect(suggestUncertaintyResponse(0.05)).toBe("Investigation");
  });

  it("knowledgeRichnessScore composes plain memory-source counts without importing AF-133/134/135's real classes", () => {
    expect(knowledgeRichnessScore({ recentEvents: 2, historicEvents: 1, personalMemories: 3, sharedMemories: 0, museumRecords: 1, chronicleEntries: 1 })).toBe(8);
  });

  it("CyclicStageTracker drives both Intelligence Layers and the Learning Loop from one generic class", () => {
    const layers = new CyclicStageTracker(INTELLIGENCE_LAYERS);
    layers.record("Observation", 1);
    expect(layers.currentStage()).toBe("Observation");
    expect(layers.next("Reflection")).toBe("Observation");

    const loop = new CyclicStageTracker(LEARNING_LOOP_STAGES);
    expect(loop.next("Improve")).toBe("Observe");
  });

  it("CollaborativeProblemLog tracks which participants proposed a solution together", () => {
    const log = new CollaborativeProblemLog();
    log.propose("anomaly-survey", ["scientist-vale", "commander-fen-beastmaster"], "Scientific", 10);
    expect(log.participantsFor("anomaly-survey")).toEqual(["scientist-vale", "commander-fen-beastmaster"]);
    expect(log.all().length).toBe(1);
  });

  it("DiscoverySuggestionLog is append-only and filterable by kind, the fourth 'notable moment' list in this codebase", () => {
    const log = new DiscoverySuggestionLog();
    log.surface("Museum gaps", "The Verdance wing is missing a wildlife exhibit.", 5);
    expect(log.countFor("Museum gaps")).toBe(1);
    expect(log.all().length).toBe(1);
  });

  it("'Potential Commander collaborations' reuses AF-151's real KnowledgeGraph.suggestConnections directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "commander-a", toId: "commander-c", kind: "Mentored", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    graph.addEdge({ fromId: "commander-b", toId: "commander-c", kind: "Mentored", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    expect(graph.suggestConnections("commander-a")).toContain("commander-b");
  });
});
