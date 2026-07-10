import { describe, expect, it } from "vitest";
import {
  COLONY_INNOVATION_EXAMPLES,
  COMMANDER_INSPIRATION_KINDS,
  COMMANDER_INSPIRATION_TRIGGERS,
  CROSS_DISCIPLINARY_PAIRS,
  CULTURAL_EVOLUTION_EXAMPLES,
  DISCOVERY_CATEGORIES,
  ENGINEERING_INNOVATION_EXAMPLES,
  INNOVATION_MEMORY_OUTCOMES,
  MYSTERY_KINDS,
  PLAYER_INSPIRATION_KINDS,
  POSSIBILITY_SOURCES,
  POSSIBILITY_VISUALISATION_TOOLS,
  SCIENTIFIC_BREAKTHROUGH_EXAMPLES,
  type Possibility,
} from "../src/game/atlasPossibility/atlasPossibilityData";
import { CulturalTrendTracker, InnovationMemoryArchive, MysteryLog, PlayerInspirationLog, PossibilityRegistry, SerendipityLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { DISCOVERY_SUGGESTION_KINDS } from "../src/game/atlasIntelligence/atlasIntelligenceData";
import { OPPORTUNITY_ANALYSIS_KINDS } from "../src/game/atlasFuture/atlasFutureData";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Possibility Engine (AF-159)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(POSSIBILITY_SOURCES.length).toBe(12);
    expect(DISCOVERY_CATEGORIES.length).toBe(12);
    expect(SCIENTIFIC_BREAKTHROUGH_EXAMPLES.length).toBe(6);
    expect(ENGINEERING_INNOVATION_EXAMPLES.length).toBe(6);
    expect(COMMANDER_INSPIRATION_KINDS.length).toBe(6);
    expect(COMMANDER_INSPIRATION_TRIGGERS.length).toBe(4);
    expect(COLONY_INNOVATION_EXAMPLES.length).toBe(6);
    expect(PLAYER_INSPIRATION_KINDS.length).toBe(6);
    expect(CROSS_DISCIPLINARY_PAIRS.length).toBe(6);
    expect(CULTURAL_EVOLUTION_EXAMPLES.length).toBe(6);
    expect(MYSTERY_KINDS.length).toBe(6);
    expect(INNOVATION_MEMORY_OUTCOMES.length).toBe(6);
    expect(POSSIBILITY_VISUALISATION_TOOLS.length).toBe(6);
  });

  it("PLAYER_INSPIRATION_KINDS shares zero members with AF-155's real DiscoverySuggestionKind or AF-158's real OpportunityAnalysisKind, confirming the sixth 'notable moment' list", () => {
    const overlapWithDiscovery = PLAYER_INSPIRATION_KINDS.filter((kind) => (DISCOVERY_SUGGESTION_KINDS as readonly string[]).includes(kind));
    const overlapWithOpportunity = PLAYER_INSPIRATION_KINDS.filter((kind) => (OPPORTUNITY_ANALYSIS_KINDS as readonly string[]).includes(kind));
    expect(overlapWithDiscovery.length).toBe(0);
    expect(overlapWithOpportunity.length).toBe(0);
  });

  it("PossibilityRegistry stores the full Opportunity Network shape for a possibility", () => {
    const registry = new PossibilityRegistry();
    const possibility: Possibility = {
      id: "quantum-signal-decoding",
      discoveryCategory: "Scientific",
      requiredKnowledge: ["quantum theory"],
      requiredPeople: ["scientist-vale"],
      requiredLocations: ["laboratory-verdance"],
      potentialRisks: ["equipment overload"],
      potentialRewards: ["new communication method"],
      historicalSignificance: 60,
      futureImplications: ["faster deep-space contact"],
    };
    registry.register(possibility);
    expect(registry.get("quantum-signal-decoding")?.discoveryCategory).toBe("Scientific");
    expect(registry.all().length).toBe(1);
  });

  it("PlayerInspirationLog is append-only and filterable by kind, mirroring AF-155/158's real logs over a new union", () => {
    const log = new PlayerInspirationLog();
    log.surface("Commander synergies", "Two commanders share a rare tactical style.", 10);
    expect(log.countFor("Commander synergies")).toBe(1);
    expect(log.all().length).toBe(1);
  });

  it("SerendipityLog records free-text coincidences rather than a closed union, since the spec's own examples are full scenarios", () => {
    const log = new SerendipityLog();
    log.record("Two scientists independently solved related anomaly equations.", ["scientist-vale", "scientist-oduya"], 12);
    expect(log.all().length).toBe(1);
    expect(log.all()[0]?.participantIds).toContain("scientist-vale");
  });

  it("A serendipity moment can be surfaced by composing AF-151's real KnowledgeGraph.suggestConnections directly, never a second convergence algorithm", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "scientist-vale", toId: "scientist-oduya", kind: "Researched", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    graph.addEdge({ fromId: "scientist-fen", toId: "scientist-oduya", kind: "Researched", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    expect(graph.suggestConnections("scientist-vale")).toContain("scientist-fen");
  });

  it("MysteryLog keeps a mystery in the unsolved set until explicitly resolved", () => {
    const log = new MysteryLog();
    log.open("signal-alpha", "Unknown signals", "A repeating signal from beyond the frontier.", 5);
    expect(log.unsolved().length).toBe(1);
    log.resolve("signal-alpha", 20);
    expect(log.unsolved().length).toBe(0);
    expect(log.all().length).toBe(1);
  });

  it("CulturalTrendTracker tracks which entities have adopted a given trend", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Solar Minimalism", "settlement-verdance", 8);
    tracker.record("Solar Minimalism", "settlement-lucent-gate", 10);
    expect(tracker.adoptersFor("Solar Minimalism")).toEqual(["settlement-verdance", "settlement-lucent-gate"]);
  });

  it("InnovationMemoryArchive records which outcomes a successful innovation produced, the third mirrored memory-archive shape in this codebase", () => {
    const archive = new InnovationMemoryArchive();
    archive.archive("quantum-signal-decoding", ["Academic disciplines", "Museum exhibits"], 40);
    expect(archive.outcomesFor("quantum-signal-decoding")).toEqual(["Academic disciplines", "Museum exhibits"]);
  });
});
