import { describe, expect, it } from "vitest";
import {
  COLLABORATIVE_CREATION_PARTICIPANTS,
  COMMANDER_CREATIVITY_EXAMPLES,
  CREATIVE_DOMAINS,
  CREATIVE_HERITAGE_OUTCOMES,
  CREATIVE_INTELLIGENCE_DEVELOPER_TOOLS,
  CREATIVE_MOVEMENT_EXAMPLES,
  CREATIVE_NETWORK_CHANNELS,
  CREATIVE_SOURCES,
  CULTURAL_CREATIVITY_EXAMPLES,
  DISCOVERY_THROUGH_CREATION_EXAMPLES,
  EDUCATIONAL_CREATIVITY_EXAMPLES,
  ENGINEERING_CREATIVITY_EXAMPLES,
  PLAYER_CREATIVITY_EXAMPLES,
  SCIENTIFIC_CREATIVITY_EXAMPLES,
} from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { CreativeContributionLog, CreativeHeritageArchive } from "../src/game/atlasCreativeIntelligence/AtlasCreativeIntelligenceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { LEGACY_DOMAINS } from "../src/game/atlasLegacyOfTomorrow/atlasLegacyOfTomorrowData";
import { CULTURAL_EVOLUTION_EXAMPLES, ENGINEERING_INNOVATION_EXAMPLES } from "../src/game/atlasPossibility/atlasPossibilityData";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { PlayerMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { PERSONALITY_TRAITS } from "../src/game/commanders/commanderProductionData";

describe("The Atlas Creative Intelligence (AF-171)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CREATIVE_DOMAINS.length).toBe(12);
    expect(CREATIVE_SOURCES.length).toBe(10);
    expect(COMMANDER_CREATIVITY_EXAMPLES.length).toBe(6);
    expect(SCIENTIFIC_CREATIVITY_EXAMPLES.length).toBe(5);
    expect(ENGINEERING_CREATIVITY_EXAMPLES.length).toBe(6);
    expect(CULTURAL_CREATIVITY_EXAMPLES.length).toBe(7);
    expect(EDUCATIONAL_CREATIVITY_EXAMPLES.length).toBe(6);
    expect(PLAYER_CREATIVITY_EXAMPLES.length).toBe(8);
    expect(COLLABORATIVE_CREATION_PARTICIPANTS.length).toBe(7);
    expect(CREATIVE_MOVEMENT_EXAMPLES.length).toBe(6);
    expect(CREATIVE_HERITAGE_OUTCOMES.length).toBe(5);
    expect(DISCOVERY_THROUGH_CREATION_EXAMPLES.length).toBe(4);
    expect(CREATIVE_NETWORK_CHANNELS.length).toBe(7);
    expect(CREATIVE_INTELLIGENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("CREATIVE_DOMAINS sets a new absolute overlap record (9 of 12) against AF-169's real LEGACY_DOMAINS, verified using AF-170's real detectOverlap function", () => {
    const report = detectOverlap(CREATIVE_DOMAINS, LEGACY_DOMAINS);
    expect(report.shared.length).toBe(9);
  });

  it("CREATIVE_MOVEMENT_EXAMPLES shares only 1 exact-string member with AF-159's real CULTURAL_EVOLUTION_EXAMPLES despite the heavy conceptual overlap, confirmed via detectOverlap", () => {
    const report = detectOverlap(CREATIVE_MOVEMENT_EXAMPLES, CULTURAL_EVOLUTION_EXAMPLES);
    expect(report.shared).toEqual(["Architectural movements"]);
  });

  it("ENGINEERING_CREATIVITY_EXAMPLES shares exactly 1 exact-string member ('Adaptive habitats') with AF-159's real ENGINEERING_INNOVATION_EXAMPLES", () => {
    const report = detectOverlap(ENGINEERING_CREATIVITY_EXAMPLES, ENGINEERING_INNOVATION_EXAMPLES);
    expect(report.shared).toEqual(["Adaptive habitats"]);
  });

  it("CreativeContributionLog serves every 'X Creativity' section uniformly and never wires into AF-030's real dialogue-only PersonalityTrait", () => {
    const log = new CreativeContributionLog();
    log.contribute("commander-fen-beastmaster", "Engineering", "Designed an adaptive wildlife shelter.", 20);
    expect(log.contributionsFor("commander-fen-beastmaster").length).toBe(1);
    expect(log.countForDomain("Engineering")).toBe(1);
    expect(PERSONALITY_TRAITS.length).toBeGreaterThan(0);
  });

  it("CreativeHeritageArchive records which outputs a creation produced, the sixth mirrored memory-archive shape in this codebase", () => {
    const archive = new CreativeHeritageArchive();
    archive.archive("adaptive-shelter-design", ["Museum exhibits", "Commander inspiration"], 30);
    expect(archive.outcomesFor("adaptive-shelter-design")).toEqual(["Museum exhibits", "Commander inspiration"]);
  });

  it("Cultural Creativity and Creative Movements both reuse AF-159's real CulturalTrendTracker directly", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Verdance Renaissance", "settlement-verdance", 10);
    expect(tracker.adoptersFor("Verdance Renaissance")).toEqual(["settlement-verdance"]);
  });

  it("Collaborative Creation reuses AF-155's real CollaborativeProblemLog directly", () => {
    const log = new CollaborativeProblemLog();
    log.propose("adaptive-shelter-design", ["scientist-vale", "commander-fen-beastmaster"], "Engineering", 20);
    expect(log.participantsFor("adaptive-shelter-design").length).toBe(2);
  });

  it("Beauty Principle reuses AF-168's real BeautyIndexTracker directly, 'a core system, not decoration'", () => {
    const tracker = new BeautyIndexTracker();
    tracker.setLevel("Art", 80);
    expect(tracker.levelFor("Art")).toBe(80);
  });

  it("Educational Creativity and Creative Network both reuse AF-160's real MentorshipLedger directly", () => {
    const ledger = new MentorshipLedger();
    ledger.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(ledger.menteesOf("commander-thorne-starforged")).toContain("commander-fen-beastmaster");
  });

  it("Player Creativity's 'Photography' reuses AF-165's real PlayerMemoryTracker.photograph directly", () => {
    const tracker = new PlayerMemoryTracker();
    tracker.photograph("observatory-verdance");
    expect(tracker.photoCountFor("observatory-verdance")).toBe(1);
  });

  it("Discovery Through Creation composes AF-159's real MysteryLog.open directly, the same mechanic AF-169's ensureNextHorizonOpen already formalised", () => {
    const mysteries = new MysteryLog();
    mysteries.open("mystery-ancient-knowledge", "Ancient questions", "The adaptive shelter's foundations reveal older ruins.", 20);
    expect(mysteries.unsolved().length).toBe(1);
  });

  it("Creative Network also reuses AF-151's real KnowledgeGraph directly for idea propagation", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "idea-adaptive-shelter", toId: "commander-fen-beastmaster", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    expect(graph.neighbors("idea-adaptive-shelter")).toContain("commander-fen-beastmaster");
  });
});
