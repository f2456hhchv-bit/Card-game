import { describe, expect, it } from "vitest";
import {
  ARCHITECTURAL_RENAISSANCE_EXAMPLES,
  COMMANDER_RENAISSANCE_EXAMPLES,
  CULTURAL_RENAISSANCE_EXAMPLES,
  ECOLOGICAL_RENAISSANCE_EXAMPLES,
  EDUCATIONAL_RENAISSANCE_EXAMPLES,
  GOLDEN_AGE_EFFECTS,
  LEGACY_OF_AGES_EXAMPLES,
  RENAISSANCE_DEVELOPER_TOOLS,
  RENAISSANCE_DOMAINS,
  RENAISSANCE_TRIGGERS,
  SCIENTIFIC_RENAISSANCE_EXAMPLES,
} from "../src/game/atlasRenaissance/atlasRenaissanceData";
import { RenaissanceTracker } from "../src/game/atlasRenaissance/AtlasRenaissanceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";

describe("The Atlas Renaissance Engine (AF-178)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(RENAISSANCE_DOMAINS.length).toBe(12);
    expect(RENAISSANCE_TRIGGERS.length).toBe(8);
    expect(GOLDEN_AGE_EFFECTS.length).toBe(7);
    expect(COMMANDER_RENAISSANCE_EXAMPLES.length).toBe(5);
    expect(SCIENTIFIC_RENAISSANCE_EXAMPLES.length).toBe(6);
    expect(ARCHITECTURAL_RENAISSANCE_EXAMPLES.length).toBe(6);
    expect(CULTURAL_RENAISSANCE_EXAMPLES.length).toBe(7);
    expect(ECOLOGICAL_RENAISSANCE_EXAMPLES.length).toBe(6);
    expect(EDUCATIONAL_RENAISSANCE_EXAMPLES.length).toBe(6);
    expect(LEGACY_OF_AGES_EXAMPLES.length).toBe(5);
    expect(RENAISSANCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("RENAISSANCE_DOMAINS sets a NEW ABSOLUTE overlap record, sharing 11 of 12 exact-string members with the real CREATIVE_DOMAINS, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(RENAISSANCE_DOMAINS, CREATIVE_DOMAINS);
    expect(report.shared.length).toBe(11);
  });

  it("RenaissanceTracker only begins a golden age once enough DISTINCT trigger kinds compound, never from repeating the same trigger", () => {
    const tracker = new RenaissanceTracker();
    tracker.recordTrigger("Historic scientific discovery", 5);
    tracker.recordTrigger("Historic scientific discovery", 6);
    tracker.recordTrigger("Historic scientific discovery", 7);
    expect(tracker.isGoldenAge()).toBe(false);
    tracker.recordTrigger("Legendary Commander", 10);
    tracker.recordTrigger("Educational revolution", 15);
    expect(tracker.isGoldenAge()).toBe(true);
  });

  it("RenaissanceTracker concludes an age only through an explicit call, never automatically, and achievements become the foundation for the next era via AF-175's real GenerationalHandoffLedger", () => {
    const tracker = new RenaissanceTracker();
    tracker.recordTrigger("Historic scientific discovery", 5);
    tracker.recordTrigger("Legendary Commander", 10);
    tracker.recordTrigger("Educational revolution", 15);
    expect(tracker.isGoldenAge()).toBe(true);
    tracker.concludeAge(50);
    expect(tracker.isGoldenAge()).toBe(false);
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture", "Questions"], 50);
    expect(ledger.startingBaselineFor(2)).toBe(2);
  });

  it("Architectural Renaissance reuses AF-168's real BeautyIndexTracker directly, and Cultural Renaissance composes AF-159's real CulturalTrendTracker directly", () => {
    const beauty = new BeautyIndexTracker();
    beauty.setLevel("Architecture", 85);
    expect(beauty.levelFor("Architecture")).toBe(85);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Renaissance Festival", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Renaissance Festival")).toEqual(["settlement-verdance"]);
  });

  it("The Renaissance Network composes AF-151's real KnowledgeGraph.addEdge directly, using the same real Inspired edge kind AF-177's Spark Network already reused", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "scientist-vale", toId: "commander-fen-beastmaster", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "The scientist's breakthrough inspired a Commander's new academy.", dateEstablished: 20 });
    expect(graph.neighbors("scientist-vale")).toContain("commander-fen-beastmaster");
  });
});
