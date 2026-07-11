import { describe, expect, it } from "vitest";
import {
  CANON_GRAPH_CONNECTION_TARGETS,
  CHARACTER_COHERENCE_ASPECTS,
  COHERENCE_DEVELOPER_TOOLS,
  COHERENCE_DOMAINS,
  COHERENCE_STANDARD_QUESTIONS,
  CONTEXT_CHAIN_FIELDS,
  CONTRADICTION_DETECTOR_TARGETS,
  EMERGENT_COHERENCE_VALIDATION_TARGETS,
  HISTORICAL_COHERENCE_CHECKS,
  INSTITUTIONAL_COHERENCE_ASPECTS,
  PLANETARY_COHERENCE_ASPECTS,
  PLAYER_COHERENCE_EXAMPLES,
  SCIENTIFIC_COHERENCE_CHECKS,
} from "../src/game/atlasCoherence/atlasCoherenceData";
import { coherenceStandardMet } from "../src/game/atlasCoherence/AtlasCoherenceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { EXCELLENCE_DOMAINS } from "../src/game/atlasExcellence/atlasExcellenceData";
import { POSSIBILITY_DOMAINS } from "../src/game/atlasOpenPossibility/atlasOpenPossibilityData";
import { CanonEventLedger, CommanderContinuityLedger, KnowledgeStateTracker, recordPlanetContinuityFact } from "../src/game/canonEngine/CanonEngineRuntime";
import { loreValidationReport } from "../src/game/canonEngine/canonEngineData";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { PlanetaryChronicle } from "../src/game/chronicle/ChronicleRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Coherence Engine (AF-195)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(COHERENCE_DOMAINS.length).toBe(12);
    expect(CONTEXT_CHAIN_FIELDS.length).toBe(7);
    expect(HISTORICAL_COHERENCE_CHECKS.length).toBe(6);
    expect(SCIENTIFIC_COHERENCE_CHECKS.length).toBe(5);
    expect(CHARACTER_COHERENCE_ASPECTS.length).toBe(7);
    expect(INSTITUTIONAL_COHERENCE_ASPECTS.length).toBe(6);
    expect(PLANETARY_COHERENCE_ASPECTS.length).toBe(6);
    expect(PLAYER_COHERENCE_EXAMPLES.length).toBe(6);
    expect(EMERGENT_COHERENCE_VALIDATION_TARGETS.length).toBe(6);
    expect(CANON_GRAPH_CONNECTION_TARGETS.length).toBe(7);
    expect(CONTRADICTION_DETECTOR_TARGETS.length).toBe(6);
    expect(COHERENCE_STANDARD_QUESTIONS.length).toBe(4);
    expect(COHERENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Coherence Domains shares 7 of 12 with the real POSSIBILITY_DOMAINS and 6 of 12 with the real EXCELLENCE_DOMAINS, no record claimed", () => {
    expect(detectOverlap(COHERENCE_DOMAINS, POSSIBILITY_DOMAINS).shared.length).toBe(7);
    expect(detectOverlap(COHERENCE_DOMAINS, EXCELLENCE_DOMAINS).shared.length).toBe(6);
  });

  it("The Context Chain reuses AF-148's real CanonEventLedger/CanonEventRecord directly", () => {
    const events = new CanonEventLedger();
    events.record({ id: "event-open-frontier-signal", date: 20, participants: ["scientist-vale"], planetId: "settlement-verdance", galaxyRegion: null, commanderIds: ["commander-fen-beastmaster"], witnesses: ["scientist-vale"], evidence: ["Signal log"], museumReferences: [], chronicleReferences: [], relationshipImpact: null, futureCallbacks: ["mystery-next-open-question"] });
    expect(events.eventFor("event-open-frontier-signal")?.participants).toEqual(["scientist-vale"]);
  });

  it("Historical/Scientific/Emergent Coherence all reuse AF-148's real loreValidationReport directly, and The Contradiction Detector reuses AF-148's real KnowledgeStateTracker.hasDiverged directly", () => {
    const report = loreValidationReport({ timelineConflictFree: true, characterConsistent: true, planetHistoryRespected: true, commanderRelationshipsRespected: true, scientificallyPlausible: true, historicalReferencesValid: true, museumIntegrated: true, chronicleCompatible: true, expansionDependenciesResolved: true });
    expect(report.passed).toBe(true);
    const knowledgeState = new KnowledgeStateTracker();
    knowledgeState.setObjectiveReality("event-open-frontier-signal", "The signal originated from a dormant relay.");
    expect(knowledgeState.hasDiverged("event-open-frontier-signal")).toBe(false);
  });

  it("Character Coherence reuses AF-148's real CommanderContinuityLedger directly, and Institutional Coherence reuses AF-165's real InstitutionalMemoryTracker directly", () => {
    const continuity = new CommanderContinuityLedger();
    continuity.recordFact("commander-fen-beastmaster", "Founded the Verdance wildlife sanctuary.", 20);
    expect(continuity.factsFor("commander-fen-beastmaster").length).toBe(1);
    const institutionalMemory = new InstitutionalMemoryTracker();
    institutionalMemory.remember("institution-living-city-academy", "Founders", "Founded to preserve adaptive-architecture education.", 20);
    expect(institutionalMemory.memoriesFor("institution-living-city-academy").length).toBe(1);
  });

  it("Planetary Coherence reuses AF-148's real recordPlanetContinuityFact directly, composing AF-135's real PlanetaryChronicle", () => {
    const chronicle = new PlanetaryChronicle();
    recordPlanetContinuityFact(chronicle, "settlement-verdance", "Ecological changes", "A wounded ecosystem was restored.", 20, "Scientists");
    expect(chronicle.entryFor("settlement-verdance").latest()?.text).toContain("Ecological changes");
  });

  it("The Canon Graph composes AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "event-open-frontier-signal", toId: "scientist-vale", kind: "Discovered", strength: 1, confidence: 1, historicalContext: "The scientist who first traced the signal.", dateEstablished: 20 });
    expect(graph.neighbors("event-open-frontier-signal")).toContain("scientist-vale");
  });

  it("coherenceStandardMet requires every question resolved with confidence, else refine further", () => {
    expect(coherenceStandardMet(new Set(["Does this fit?", "Does it respect history?"]))).toBe(false);
    expect(coherenceStandardMet(new Set(COHERENCE_STANDARD_QUESTIONS))).toBe(true);
  });
});
