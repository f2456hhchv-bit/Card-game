import { describe, expect, it } from "vitest";
import {
  ARCHITECTURAL_CRAFTSMANSHIP_VALUES,
  ARTISTIC_CRAFTSMANSHIP_VALUES,
  CRAFTSMANSHIP_DEVELOPER_TOOLS,
  CRAFTSMANSHIP_DOMAINS,
  CRAFT_CYCLE_STAGES,
  CRAFT_GUILD_EXAMPLES,
  EDUCATIONAL_CRAFTSMANSHIP_VALUES,
  ENGINEERING_CRAFTSMANSHIP_VALUES,
  LEADERSHIP_CRAFTSMANSHIP_VALUES,
  MAKERS_MARK_FIELDS,
  MASTER_CRAFTSMAN_TRAITS,
  PLAYER_CRAFTSMANSHIP_EXAMPLES,
  SCIENTIFIC_CRAFTSMANSHIP_VALUES,
  STANDARD_OF_EXCELLENCE_QUESTIONS,
  craftCycleRank,
} from "../src/game/atlasCraftsmanship/atlasCraftsmanshipData";
import { standardOfExcellenceAssessment } from "../src/game/atlasCraftsmanship/AtlasCraftsmanshipRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { CREATION_CYCLE_STAGES } from "../src/game/atlasCreator/atlasCreatorData";
import { ReputationTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { IterationCycleTracker } from "../src/game/atlasProtocol/AtlasProtocolRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";

describe("The Atlas Craftsmanship Engine (AF-192)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CRAFTSMANSHIP_DOMAINS.length).toBe(12);
    expect(CRAFT_CYCLE_STAGES.length).toBe(10);
    expect(MASTER_CRAFTSMAN_TRAITS.length).toBe(7);
    expect(SCIENTIFIC_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(ENGINEERING_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(ARCHITECTURAL_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(ARTISTIC_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(EDUCATIONAL_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(LEADERSHIP_CRAFTSMANSHIP_VALUES.length).toBe(6);
    expect(PLAYER_CRAFTSMANSHIP_EXAMPLES.length).toBe(6);
    expect(MAKERS_MARK_FIELDS.length).toBe(6);
    expect(CRAFT_GUILD_EXAMPLES.length).toBe(6);
    expect(STANDARD_OF_EXCELLENCE_QUESTIONS.length).toBe(4);
    expect(CRAFTSMANSHIP_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Craftsmanship Domains shares 9 of 12 exact-string members with the real CREATIVE_DOMAINS, and the Craft Cycle shares only 3 of 10 stages with AF-191's real CREATION_CYCLE_STAGES despite being sibling 10-stage process ladders", () => {
    expect(detectOverlap(CRAFTSMANSHIP_DOMAINS, CREATIVE_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(CRAFT_CYCLE_STAGES, CREATION_CYCLE_STAGES).shared.length).toBe(3);
  });

  it("craftCycleRank is an ordered, non-cyclic lookup — Legacy is the highest rank, with no wraparound back to Inspiration", () => {
    expect(craftCycleRank("Inspiration")).toBe(0);
    expect(craftCycleRank("Legacy")).toBe(9);
    expect(craftCycleRank("Mastery")).toBeLessThan(craftCycleRank("Teaching"));
  });

  it("Master Craftsmen reuses AF-166's real ReputationTracker directly, revealing rather than assigning a most-recognised quality", () => {
    const reputation = new ReputationTracker();
    reputation.recognizeFor("engineer-of-verdance", "Precision", 20);
    reputation.recognizeFor("engineer-of-verdance", "Precision", 21);
    reputation.recognizeFor("engineer-of-verdance", "Patience", 21);
    expect(reputation.mostRecognizedQuality("engineer-of-verdance")).toBe("Precision");
  });

  it("Quality Without Perfection reuses AF-149's real IterationCycleTracker directly — never ship the first version", () => {
    const iterations = new IterationCycleTracker();
    expect(iterations.readyToShip("creation-living-city-garden")).toBe(false);
    iterations.recordCycle("creation-living-city-garden", 1);
    iterations.recordCycle("creation-living-city-garden", 2);
    expect(iterations.readyToShip("creation-living-city-garden")).toBe(true);
  });

  it("The Maker's Mark composes AF-151's real KnowledgeGraph.addEdge directly for provenance, and The Craft Guilds reuses AF-160's real MentorshipLedger directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "creation-living-city-garden", toId: "engineer-of-verdance", kind: "Created", strength: 1, confidence: 1, historicalContext: "Built using adaptive-materials techniques pioneered at the Verdance workshop.", dateEstablished: 20 });
    expect(graph.neighbors("creation-living-city-garden")).toContain("engineer-of-verdance");
    const mentorship = new MentorshipLedger();
    mentorship.assign("engineer-of-verdance", "apprentice-of-verdance", 20);
    expect(mentorship.menteesOf("engineer-of-verdance")).toEqual(["apprentice-of-verdance"]);
  });

  it("standardOfExcellenceAssessment triggers continued refinement on any single affirmed question, gating ongoing investment rather than rejection or completion", () => {
    expect(standardOfExcellenceAssessment(new Set()).shouldContinueRefining).toBe(false);
    const result = standardOfExcellenceAssessment(new Set(["Will it endure?"]));
    expect(result.shouldContinueRefining).toBe(true);
    expect(result.affirmedCount).toBe(1);
  });
});
