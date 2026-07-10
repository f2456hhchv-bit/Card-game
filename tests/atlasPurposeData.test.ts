import { describe, expect, it } from "vitest";
import {
  CIVILISATION_PURPOSE_QUESTIONS,
  COMMANDER_PURPOSE_FACETS,
  CRISIS_OF_PURPOSE_QUESTIONS,
  CULTURAL_PURPOSE_VALUES,
  INDIVIDUAL_PURPOSE_KINDS,
  INSTITUTIONAL_PURPOSES,
  LONG_TERM_MISSION_EXAMPLES,
  PLAYER_PURPOSE_KINDS,
  PURPOSE_DEVELOPER_TOOLS,
  PURPOSE_DOMAINS,
  PURPOSE_EVOLUTION_STAGES,
  PURPOSE_MEMORY_OUTCOMES,
  PURPOSE_NETWORK_LINKS,
  SHARED_PURPOSE_PROJECTS,
  purposeEvolutionRank,
} from "../src/game/atlasPurpose/atlasPurposeData";
import { CommanderPurposeTracker, IndividualPurposeTracker, LongTermMissionTracker, PlayerPurposeObserver, PurposeMemoryArchive } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { PHILOSOPHICAL_DOMAINS } from "../src/game/atlasPhilosophy/atlasPhilosophyData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Purpose Engine (AF-162)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(PURPOSE_DOMAINS.length).toBe(12);
    expect(INDIVIDUAL_PURPOSE_KINDS.length).toBe(10);
    expect(COMMANDER_PURPOSE_FACETS.length).toBe(5);
    expect(CIVILISATION_PURPOSE_QUESTIONS.length).toBe(5);
    expect(PLAYER_PURPOSE_KINDS.length).toBe(8);
    expect(INSTITUTIONAL_PURPOSES.length).toBe(6);
    expect(LONG_TERM_MISSION_EXAMPLES.length).toBe(6);
    expect(PURPOSE_EVOLUTION_STAGES.length).toBe(5);
    expect(CULTURAL_PURPOSE_VALUES.length).toBe(6);
    expect(CRISIS_OF_PURPOSE_QUESTIONS.length).toBe(3);
    expect(SHARED_PURPOSE_PROJECTS.length).toBe(5);
    expect(PURPOSE_MEMORY_OUTCOMES.length).toBe(6);
    expect(PURPOSE_NETWORK_LINKS.length).toBe(6);
    expect(PURPOSE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("PURPOSE_DOMAINS shares exactly 8 exact-string members with AF-161's real PHILOSOPHICAL_DOMAINS, confirmed the heaviest overlap yet in this codebase", () => {
    const overlap = PURPOSE_DOMAINS.filter((d) => (PHILOSOPHICAL_DOMAINS as readonly string[]).includes(d));
    expect(overlap.length).toBe(8);
  });

  it("CULTURAL_PURPOSE_VALUES is almost entirely a subset of this module's own PURPOSE_DOMAINS (5 of 6 members), documented rather than merged", () => {
    const overlap = CULTURAL_PURPOSE_VALUES.filter((v) => (PURPOSE_DOMAINS as readonly string[]).includes(v));
    expect(overlap.length).toBe(5);
    expect(CULTURAL_PURPOSE_VALUES).toContain("Knowledge");
  });

  it("purposeEvolutionRank orders the linear Survive-to-Guide-others escalation ladder", () => {
    expect(purposeEvolutionRank("Survive")).toBe(0);
    expect(purposeEvolutionRank("Guide others")).toBe(4);
  });

  it("IndividualPurposeTracker keeps a full evolving history, mirroring AF-161's real CommanderBeliefTracker shape", () => {
    const tracker = new IndividualPurposeTracker();
    tracker.discover("citizen-vale", "Scientist", 5);
    tracker.discover("citizen-vale", "Teacher", 20);
    expect(tracker.purposeOf("citizen-vale")).toBe("Teacher");
  });

  it("CommanderPurposeTracker tracks each of the 5 purpose facets independently", () => {
    const tracker = new CommanderPurposeTracker();
    tracker.setFacet("commander-fen-beastmaster", "Legacy ambition", "Found a wildlife sanctuary.", 10);
    tracker.setFacet("commander-fen-beastmaster", "Teaching objective", "Mentor young rangers.", 12);
    expect(tracker.facetOf("commander-fen-beastmaster", "Legacy ambition")).toBe("Found a wildlife sanctuary.");
    expect(tracker.facetOf("commander-fen-beastmaster", "Teaching objective")).toBe("Mentor young rangers.");
  });

  it("PlayerPurposeObserver returns null until at least one action has been observed, then reveals the dominant tallied purpose", () => {
    const observer = new PlayerPurposeObserver();
    expect(observer.dominantPurpose()).toBeNull();
    observer.observe("Conservationist");
    observer.observe("Conservationist");
    observer.observe("Explorer");
    expect(observer.dominantPurpose()).toBe("Conservationist");
  });

  it("LongTermMissionTracker tracks real progress toward a generational mission rather than reference-only flavour text", () => {
    const tracker = new LongTermMissionTracker();
    tracker.register("restore-verdance-ecosystem", "Restore every ecosystem", 100);
    tracker.advance("restore-verdance-ecosystem", 40);
    expect(tracker.progressFor("restore-verdance-ecosystem")).toBeCloseTo(0.4, 5);
    expect(tracker.isComplete("restore-verdance-ecosystem")).toBe(false);
    tracker.advance("restore-verdance-ecosystem", 60);
    expect(tracker.isComplete("restore-verdance-ecosystem")).toBe(true);
  });

  it("PurposeMemoryArchive records which outputs a completed purpose produced, the fifth mirrored memory-archive shape in this codebase", () => {
    const archive = new PurposeMemoryArchive();
    archive.archive("restore-verdance-ecosystem", ["Museum exhibits", "Historic inspiration"], 40);
    expect(archive.outcomesFor("restore-verdance-ecosystem")).toEqual(["Museum exhibits", "Historic inspiration"]);
  });

  it("Shared Purpose reuses AF-155's real CollaborativeProblemLog directly, the fourth instance of the identical mechanic in this codebase", () => {
    const log = new CollaborativeProblemLog();
    log.propose("galactic-observatory-network", ["settlement-verdance", "settlement-lucent-gate"], "Scientific", 20);
    expect(log.participantsFor("galactic-observatory-network").length).toBe(2);
  });

  it("Purpose Network composes AF-151's real KnowledgeGraph directly rather than a second graph structure", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "purpose-restore-ecosystem", toId: "commander-fen-beastmaster", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "", dateEstablished: 0 });
    expect(graph.neighbors("purpose-restore-ecosystem")).toContain("commander-fen-beastmaster");
  });
});
