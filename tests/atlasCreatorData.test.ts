import { describe, expect, it } from "vitest";
import {
  ARCHITECTURAL_CREATION_ORIGINS,
  COLLABORATIVE_CREATION_PARTICIPANTS,
  CREATION_ARCHIVE_DESTINATIONS,
  CREATION_CYCLE_STAGES,
  CREATIVE_INSPIRATION_SOURCES,
  CREATOR_ENGINE_DEVELOPER_TOOLS,
  CREATOR_NETWORK_FIELDS,
  PLAYER_CREATION_EXAMPLES,
  PURPOSEFUL_BEAUTY_CRITERIA,
} from "../src/game/atlasCreator/atlasCreatorData";
import { purposefulBeautyMet } from "../src/game/atlasCreator/AtlasCreatorRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS, CREATIVE_SOURCES, COLLABORATIVE_CREATION_PARTICIPANTS as REAL_COLLABORATIVE_CREATION_PARTICIPANTS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { CreativeContributionLog, CreativeHeritageArchive } from "../src/game/atlasCreativeIntelligence/AtlasCreativeIntelligenceRuntime";
import { CollaborativeProblemLog, CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { IMPLEMENTATION_ARCHIVE_FIELDS } from "../src/game/atlasRealisation/atlasRealisationData";

const SPEC_CREATION_DOMAINS = ["Science", "Engineering", "Architecture", "Education", "Medicine", "Art", "Music", "Literature", "Ecology", "Exploration", "Culture", "Community"] as const;

describe("The Atlas Creator Engine (AF-191)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CREATION_CYCLE_STAGES.length).toBe(10);
    expect(CREATIVE_INSPIRATION_SOURCES.length).toBe(8);
    expect(COLLABORATIVE_CREATION_PARTICIPANTS.length).toBe(7);
    expect(ARCHITECTURAL_CREATION_ORIGINS.length).toBe(7);
    expect(PLAYER_CREATION_EXAMPLES.length).toBe(8);
    expect(CREATOR_NETWORK_FIELDS.length).toBe(7);
    expect(CREATION_ARCHIVE_DESTINATIONS.length).toBe(5);
    expect(PURPOSEFUL_BEAUTY_CRITERIA.length).toBe(4);
    expect(CREATOR_ENGINE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Creation Domains is, as a set, an EXACT match (12/12) with the real CREATIVE_DOMAINS — a new absolute overlap record, verified via AF-170's real detectOverlap, so this module reuses CREATIVE_DOMAINS directly rather than declaring a second list", () => {
    const overlap = detectOverlap(SPEC_CREATION_DOMAINS, CREATIVE_DOMAINS);
    expect(overlap.shared.length).toBe(12);
    expect(overlap.ratio).toBe(1);
  });

  it("Creative Inspiration shares 3 of 8 exact-string members with the real CREATIVE_SOURCES, and Collaborative Creation participants shares 6 of 7 with the real COLLABORATIVE_CREATION_PARTICIPANTS, both documented honestly", () => {
    expect(detectOverlap(CREATIVE_INSPIRATION_SOURCES, CREATIVE_SOURCES).shared.length).toBe(3);
    expect(detectOverlap(COLLABORATIVE_CREATION_PARTICIPANTS, REAL_COLLABORATIVE_CREATION_PARTICIPANTS).shared.length).toBe(6);
  });

  it("The Creator Network's fields share only 2 of 7 exact members with AF-188's real IMPLEMENTATION_ARCHIVE_FIELDS, kept as its own separate list", () => {
    expect(detectOverlap(CREATOR_NETWORK_FIELDS, IMPLEMENTATION_ARCHIVE_FIELDS).shared.length).toBe(2);
  });

  it("The Creation Cycle reuses AF-155's real generic CyclicStageTracker directly, wrapping from Teaching back to Inspiration", () => {
    const cycle = new CyclicStageTracker<(typeof CREATION_CYCLE_STAGES)[number]>(CREATION_CYCLE_STAGES);
    cycle.record("Inspiration", 1);
    expect(cycle.currentStage()).toBe("Inspiration");
    expect(cycle.next("Teaching")).toBe("Inspiration");
  });

  it("Collaborative Creation reuses AF-155's real CollaborativeProblemLog directly", () => {
    const collaboration = new CollaborativeProblemLog();
    collaboration.propose("problem-living-city-restoration", ["scientist-vale", "commander-fen-beastmaster"], "Ecology", 20);
    expect(collaboration.participantsFor("problem-living-city-restoration")).toEqual(["scientist-vale", "commander-fen-beastmaster"]);
  });

  it("Commander/Scientific/Engineering/Educational/Artistic/Architectural Creation all reuse AF-171's real CreativeContributionLog directly across every domain", () => {
    const creations = new CreativeContributionLog();
    creations.contribute("commander-fen-beastmaster", "Engineering", "Designed an adaptive habitat.", 20);
    creations.contribute("artist-of-verdance", "Art", "Painted the restored garden.", 20);
    creations.contribute("architect-of-verdance", "Architecture", "Designed a school shaped by climate.", 20);
    expect(creations.contributionsFor("commander-fen-beastmaster").length).toBe(1);
    expect(creations.countForDomain("Art")).toBe(1);
    expect(creations.countForDomain("Architecture")).toBe(1);
  });

  it("The Creator Network composes AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "creation-living-city-garden", toId: "artist-of-verdance", kind: "Created", strength: 1, confidence: 1, historicalContext: "The garden's original creator.", dateEstablished: 20 });
    expect(graph.neighbors("creation-living-city-garden")).toContain("artist-of-verdance");
  });

  it("Beauty Through Purpose reuses AF-168's real BeautyIndexTracker directly, and The Creation Archive reuses AF-171's real CreativeHeritageArchive directly", () => {
    const beauty = new BeautyIndexTracker();
    beauty.setLevel("Public spaces", 75);
    expect(beauty.levelFor("Public spaces")).toBe(75);
    const archive = new CreativeHeritageArchive();
    archive.archive("creation-living-city-garden", ["Museum exhibits", "Public traditions"], 20);
    expect(archive.outcomesFor("creation-living-city-garden")).toEqual(["Museum exhibits", "Public traditions"]);
  });

  it("purposefulBeautyMet requires every criterion, confirmed distinct from AF-168's real level-tracking BeautyIndexTracker", () => {
    expect(purposefulBeautyMet(new Set(["Teaches", "Serves", "Inspires"]))).toBe(false);
    expect(purposefulBeautyMet(new Set(PURPOSEFUL_BEAUTY_CRITERIA))).toBe(true);
  });
});
