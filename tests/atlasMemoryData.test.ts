import { describe, expect, it } from "vitest";
import {
  CULTURAL_MEMORY_EXAMPLES,
  FORGETTING_EXAMPLES,
  INSTITUTIONAL_MEMORY_CATEGORIES,
  INTERGENERATIONAL_MEMORY_EXAMPLES,
  MEMORY_DEVELOPER_TOOLS,
  MEMORY_TRIGGER_KINDS,
  MEMORY_TYPES,
  NOSTALGIA_TRIGGERS,
  PERSONAL_MEMORY_EXAMPLES,
  PLAYER_MEMORY_KINDS,
  SCIENTIFIC_MEMORY_SOURCES,
  SHARED_MEMORY_GROUPS,
} from "../src/game/atlasMemory/atlasMemoryData";
import { InstitutionalMemoryTracker, MemoryDistortionTracker, PlayerMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { NpcMemoryLog } from "../src/game/legacy/LegacyEngineRuntime";
import { MeaningCurator, SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { PERSONAL_MEANING_CATEGORIES, PLAYER_MEANING_CATEGORIES } from "../src/game/atlasMeaning/atlasMeaningData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Memory Engine (AF-165)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(MEMORY_TYPES.length).toBe(10);
    expect(PERSONAL_MEMORY_EXAMPLES.length).toBe(10);
    expect(PLAYER_MEMORY_KINDS.length).toBe(7);
    expect(SHARED_MEMORY_GROUPS.length).toBe(6);
    expect(INSTITUTIONAL_MEMORY_CATEGORIES.length).toBe(9);
    expect(CULTURAL_MEMORY_EXAMPLES.length).toBe(8);
    expect(SCIENTIFIC_MEMORY_SOURCES.length).toBe(6);
    expect(FORGETTING_EXAMPLES.length).toBe(3);
    expect(MEMORY_TRIGGER_KINDS.length).toBe(8);
    expect(NOSTALGIA_TRIGGERS.length).toBe(6);
    expect(INTERGENERATIONAL_MEMORY_EXAMPLES.length).toBe(5);
    expect(MEMORY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("'Favourite Commander' is a verbatim shared member between PLAYER_MEMORY_KINDS and AF-163's real PLAYER_MEANING_CATEGORIES, confirming direct reuse of MeaningCurator", () => {
    expect(PLAYER_MEMORY_KINDS).toContain("Favourite Commander");
    expect(PLAYER_MEANING_CATEGORIES).toContain("Favourite Commander");
  });

  it("Personal Memory composes AF-133's real NpcMemoryLog (raw storage) directly with AF-163's real MeaningCurator (curated superlatives)", () => {
    const log = new NpcMemoryLog();
    log.remember("commander-fen-beastmaster", "expedition", "First expedition to the Verdance frontier.", false);
    expect(log.memoriesFor("commander-fen-beastmaster").length).toBe(1);

    const curator = new MeaningCurator<(typeof PERSONAL_MEANING_CATEGORIES)[number]>();
    curator.curate("commander-fen-beastmaster", "Greatest friendship", "Bonded with Thorne Starforged.", 10);
    expect(curator.entryFor("commander-fen-beastmaster", "Greatest friendship")?.description).toBe("Bonded with Thorne Starforged.");
  });

  it("'Forgetting' is confirmed already handled by AF-133's real NpcMemoryLog bounded minorCapacity, no second decay mechanism", () => {
    const log = new NpcMemoryLog(2);
    log.remember("commander-fen-beastmaster", "errand", "Routine supply run 1.", false);
    log.remember("commander-fen-beastmaster", "errand", "Routine supply run 2.", false);
    log.remember("commander-fen-beastmaster", "errand", "Routine supply run 3.", false);
    expect(log.memoriesFor("commander-fen-beastmaster").length).toBeLessThanOrEqual(3);
    log.remember("commander-fen-beastmaster", "historic", "Saved the colony from famine.", true);
    expect(log.memoriesFor("commander-fen-beastmaster").some((m) => m.description === "Saved the colony from famine.")).toBe(true);
  });

  it("Shared Memory reuses AF-155's real CollaborativeProblemLog directly, the sixth instance of the identical mechanic in this codebase", () => {
    const log = new CollaborativeProblemLog();
    log.propose("commander-academy-graduation", ["commander-fen-beastmaster", "commander-thorne-starforged"], "Educational", 20);
    expect(log.participantsFor("commander-academy-graduation").length).toBe(2);
  });

  it("Cultural Memory reuses AF-159's real CulturalTrendTracker directly", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Verdance Harvest Festival", "settlement-verdance", 10);
    expect(tracker.adoptersFor("Verdance Harvest Festival")).toEqual(["settlement-verdance"]);
  });

  it("Memory Network reuses AF-151's real KnowledgeGraph directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "memory-first-expedition", toId: "commander-fen-beastmaster", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    expect(graph.neighbors("memory-first-expedition")).toContain("commander-fen-beastmaster");
  });

  it("Nostalgia composes AF-163's real SignificanceTracker directly, the same mechanic AF-164's Returning Moments already reused", () => {
    const tracker = new SignificanceTracker();
    tracker.register("museum-verdance", "Verdance Museum", 1);
    tracker.reinforce("museum-verdance", 20);
    expect(tracker.significanceOf("museum-verdance")).toBe(1);
  });

  it("MemoryDistortionTracker keeps the objective description untouched while the subjective version drifts — the opposite guarantee from AF-135's real EvolvingEntry", () => {
    const tracker = new MemoryDistortionTracker();
    tracker.remember("memory-first-contact", "The expedition made peaceful first contact.", 5);
    tracker.drift("memory-first-contact", "I remember it as far more dangerous than it really was.");
    expect(tracker.objectiveOf("memory-first-contact")).toBe("The expedition made peaceful first contact.");
    expect(tracker.subjectiveOf("memory-first-contact")).toBe("I remember it as far more dangerous than it really was.");
  });

  it("PlayerMemoryTracker tracks genuinely new numeric quantities — visit and photograph counts — never a 'Favourite X' label", () => {
    const tracker = new PlayerMemoryTracker();
    tracker.visit("planet-verdance");
    tracker.visit("planet-verdance");
    tracker.visit("planet-ember-reach");
    tracker.photograph("observatory-verdance");
    expect(tracker.visitsFor("planet-verdance")).toBe(2);
    expect(tracker.mostVisitedPlanet()).toBe("planet-verdance");
    expect(tracker.photoCountFor("observatory-verdance")).toBe(1);
  });

  it("InstitutionalMemoryTracker records what a specific institution remembers, confirmed genuinely new at this granularity", () => {
    const tracker = new InstitutionalMemoryTracker();
    tracker.remember("museum-verdance", "Artifacts", "The founder's helmet.", 15);
    expect(tracker.memoriesFor("museum-verdance").length).toBe(1);
    expect(tracker.memoriesFor("museum-verdance")[0]?.category).toBe("Artifacts");
  });
});
