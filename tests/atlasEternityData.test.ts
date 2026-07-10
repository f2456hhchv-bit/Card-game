import { describe, expect, it } from "vitest";
import {
  COMMANDER_ETERNITY_EXAMPLES,
  CULTURAL_PRESERVATION_EXAMPLES,
  ETERNAL_ARCHIVE_CATEGORIES,
  ETERNAL_MUSEUM_EXAMPLES,
  ETERNAL_PROMISE_QUESTIONS,
  ETERNAL_STANDARD_QUESTIONS,
  eternalStandardMet,
  ETERNITY_DEVELOPER_TOOLS,
  ETERNITY_DOMAINS,
  FUTURE_CURATOR_INHERITANCE,
  LIVING_RESTORATION_EXAMPLES,
  MEMORY_CONSTELLATION_LINKS,
  PLANETARY_HERITAGE_EXAMPLES,
  PRESERVATION_CYCLE_STAGES,
} from "../src/game/atlasEternity/atlasEternityData";
import { EternalArchive } from "../src/game/atlasEternity/AtlasEternityRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CONTINUUM_DOMAINS } from "../src/game/atlasContinuum/atlasContinuumData";
import { LIBRARY_CATEGORIES } from "../src/game/atlasTranscendence/atlasTranscendenceData";
import { PlanetaryChronicle } from "../src/game/chronicle/ChronicleRuntime";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";

describe("The Atlas Eternity Engine (AF-181)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ETERNITY_DOMAINS.length).toBe(12);
    expect(ETERNAL_ARCHIVE_CATEGORIES.length).toBe(8);
    expect(ETERNAL_MUSEUM_EXAMPLES.length).toBe(5);
    expect(COMMANDER_ETERNITY_EXAMPLES.length).toBe(6);
    expect(CULTURAL_PRESERVATION_EXAMPLES.length).toBe(7);
    expect(PLANETARY_HERITAGE_EXAMPLES.length).toBe(6);
    expect(MEMORY_CONSTELLATION_LINKS.length).toBe(5);
    expect(PRESERVATION_CYCLE_STAGES.length).toBe(7);
    expect(ETERNAL_STANDARD_QUESTIONS.length).toBe(4);
    expect(LIVING_RESTORATION_EXAMPLES.length).toBe(5);
    expect(FUTURE_CURATOR_INHERITANCE.length).toBe(4);
    expect(ETERNAL_PROMISE_QUESTIONS.length).toBe(4);
    expect(ETERNITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("ETERNITY_DOMAINS shares 8 of 12 exact-string members with the real CONTINUUM_DOMAINS, verified via AF-170's real detectOverlap (no record claimed)", () => {
    expect(detectOverlap(ETERNITY_DOMAINS, CONTINUUM_DOMAINS).shared.length).toBe(8);
  });

  it("ETERNAL_ARCHIVE_CATEGORIES shares zero exact-string members with AF-180's real LIBRARY_CATEGORIES, despite both describing what gets permanently preserved", () => {
    expect(detectOverlap(ETERNAL_ARCHIVE_CATEGORIES, LIBRARY_CATEGORIES).shared.length).toBe(0);
  });

  it("eternalStandardMet is an ANY-of-N gate, the opposite of every existing all-must-pass checklist function in this codebase", () => {
    const singleYes = new Set<(typeof ETERNAL_STANDARD_QUESTIONS)[number]>(["Does this teach?"]);
    expect(eternalStandardMet(singleYes)).toBe(true);
    expect(eternalStandardMet(new Set())).toBe(false);
  });

  it("EternalArchive mirrors AF-180's real UniversalLibrary shape, the second no-removal preservation registry, write-once per id", () => {
    const archive = new EternalArchive();
    archive.preserve("record-first-contact-speech", "Historic speeches", 5);
    archive.preserve("record-first-contact-speech", "Player legacy", 50);
    expect(archive.categoryOf("record-first-contact-speech")).toBe("Historic speeches");
    expect(archive.isPreserved("record-first-contact-speech")).toBe(true);
    expect(archive.countForCategory("Historic speeches")).toBe(1);
    expect((archive as unknown as Record<string, unknown>).remove).toBeUndefined();
  });

  it("The Eternal Library and Living Restoration reuse AF-135's real PlanetaryChronicle/EvolvingEntry directly, keeping every prior version", () => {
    const chronicle = new PlanetaryChronicle();
    chronicle.write("settlement-verdance", "The original survey established First Contact.", 5, "Explorers");
    chronicle.write("settlement-verdance", "A new translation clarifies the original survey's intent.", 20, "Military historians");
    expect(chronicle.entryFor("settlement-verdance").allVersions().length).toBe(2);
  });

  it("The Eternal Museum composes AF-165's real InstitutionalMemoryTracker, Cultural Preservation composes AF-159's real CulturalTrendTracker, and Planetary Heritage composes AF-163's real SignificanceTracker, all directly", () => {
    const memory = new InstitutionalMemoryTracker();
    memory.remember("institution-verdance-academy", "Artifacts", "The founding charter remains on public display.", 5);
    expect(memory.memoriesFor("institution-verdance-academy").length).toBe(1);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Old Verdance Tongue", "settlement-verdance", 5);
    expect(culturalTrends.adoptersFor("Old Verdance Tongue")).toEqual(["settlement-verdance"]);
    const significance = new SignificanceTracker();
    significance.register("planet-verdance", "Verdance", 5);
    significance.reinforce("planet-verdance", 20);
    expect(significance.significanceOf("planet-verdance")).toBe(1);
  });

  it("The Memory Constellation composes AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "achievement-verdance-restoration", toId: "commander-fen-beastmaster", kind: "Created", strength: 1, confidence: 1, historicalContext: "The restoration's primary creator.", dateEstablished: 20 });
    expect(graph.neighbors("achievement-verdance-restoration")).toContain("commander-fen-beastmaster");
  });

  it("The Cycle of Preservation is driven directly by AF-155's real generic CyclicStageTracker, wrapping around because nothing truly ends", () => {
    const cycle = new CyclicStageTracker(PRESERVATION_CYCLE_STAGES);
    cycle.record("Discover", 1);
    cycle.record("Understand", 5);
    expect(cycle.currentStage()).toBe("Understand");
    expect(cycle.next("Rediscover")).toBe("Discover");
  });

  it("The Future Curators reuses AF-175's real GenerationalHandoffLedger directly, at least the third reuse of that ledger", () => {
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(1);
  });
});
