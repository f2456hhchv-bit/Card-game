import { describe, expect, it } from "vitest";
import {
  COMMANDER_VERIFICATION_SOURCES,
  CONFIDENCE_LEVELS,
  CONTRADICTION_REVIEW_PRINCIPLES,
  ECOLOGICAL_VERIFICATION_SOURCES,
  ENGINEERING_VERIFICATION_CHECKS,
  EVIDENCE_GRAPH_LINK_TARGETS,
  HISTORICAL_VERIFICATION_SOURCES,
  INSTITUTIONAL_VERIFICATION_EXAMPLES,
  PLAYER_VERIFICATION_FIELDS,
  TRUTH_STANDARD_QUESTIONS,
  VERIFICATION_CHAIN_STAGES,
  VERIFICATION_DEVELOPER_TOOLS,
  VERIFICATION_DOMAINS,
  confidenceLevelRank,
  verificationChainRank,
} from "../src/game/atlasVerification/atlasVerificationData";
import { truthStandardMet } from "../src/game/atlasVerification/AtlasVerificationRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { COHERENCE_DOMAINS } from "../src/game/atlasCoherence/atlasCoherenceData";
import { POSSIBILITY_DOMAINS } from "../src/game/atlasOpenPossibility/atlasOpenPossibilityData";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CanonEventLedger, KnowledgeStateTracker } from "../src/game/canonEngine/CanonEngineRuntime";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";

describe("The Atlas Verification Engine (AF-196)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(VERIFICATION_DOMAINS.length).toBe(12);
    expect(VERIFICATION_CHAIN_STAGES.length).toBe(10);
    expect(ENGINEERING_VERIFICATION_CHECKS.length).toBe(6);
    expect(HISTORICAL_VERIFICATION_SOURCES.length).toBe(6);
    expect(COMMANDER_VERIFICATION_SOURCES.length).toBe(6);
    expect(ECOLOGICAL_VERIFICATION_SOURCES.length).toBe(6);
    expect(PLAYER_VERIFICATION_FIELDS.length).toBe(6);
    expect(INSTITUTIONAL_VERIFICATION_EXAMPLES.length).toBe(6);
    expect(EVIDENCE_GRAPH_LINK_TARGETS.length).toBe(7);
    expect(CONFIDENCE_LEVELS.length).toBe(5);
    expect(CONTRADICTION_REVIEW_PRINCIPLES.length).toBe(5);
    expect(TRUTH_STANDARD_QUESTIONS.length).toBe(4);
    expect(VERIFICATION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Verification Domains shares 9 of 12 with the real COHERENCE_DOMAINS and 8 of 12 with the real POSSIBILITY_DOMAINS, no record claimed", () => {
    expect(detectOverlap(VERIFICATION_DOMAINS, COHERENCE_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(VERIFICATION_DOMAINS, POSSIBILITY_DOMAINS).shared.length).toBe(8);
  });

  it("verificationChainRank and confidenceLevelRank are both ordered, non-cyclic lookups", () => {
    expect(verificationChainRank("Proposal")).toBe(0);
    expect(verificationChainRank("Future Reference")).toBe(9);
    expect(confidenceLevelRank("Active Investigation")).toBe(0);
    expect(confidenceLevelRank("Established")).toBe(4);
    expect(confidenceLevelRank("Strong Evidence")).toBeGreaterThan(confidenceLevelRank("Working Hypothesis"));
  });

  it("Scientific Verification reuses AF-172's real HypothesisTracker directly", () => {
    const hypotheses = new HypothesisTracker();
    hypotheses.propose("theory-open-frontier-signal", "The signal originates from a dormant relay.", 20);
    hypotheses.supportWithEvidence("theory-open-frontier-signal", 20);
    expect(hypotheses.isGrounded("theory-open-frontier-signal")).toBe(true);
  });

  it("The Evidence Graph composes AF-151's real KnowledgeGraph.addEdge directly, using its existing numeric confidence field", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "fact-dormant-relay", toId: "scientist-vale", kind: "Discovered", strength: 1, confidence: 0.8, historicalContext: "Confirmed via independent replication.", dateEstablished: 20 });
    expect(graph.neighbors("fact-dormant-relay")).toContain("scientist-vale");
  });

  it("Player Verification reuses AF-148's real CanonEventLedger directly, and Institutional Verification reuses AF-165's real InstitutionalMemoryTracker directly", () => {
    const events = new CanonEventLedger();
    events.record({ id: "event-player-restored-frontier", date: 20, participants: ["player"], planetId: "settlement-verdance", galaxyRegion: null, commanderIds: [], witnesses: ["scientist-vale"], evidence: ["Restoration survey"], museumReferences: [], chronicleReferences: [], relationshipImpact: null, futureCallbacks: [] });
    expect(events.eventFor("event-player-restored-frontier")?.witnesses).toEqual(["scientist-vale"]);
    const institutionalMemory = new InstitutionalMemoryTracker();
    institutionalMemory.remember("institution-living-city-academy", "Research", "Validated the restoration survey before publication.", 20);
    expect(institutionalMemory.memoriesFor("institution-living-city-academy").length).toBe(1);
  });

  it("Contradiction Review reuses AF-148's real KnowledgeStateTracker.revealHistoricalUnderstanding directly, expanding rather than erasing history", () => {
    const knowledgeState = new KnowledgeStateTracker();
    knowledgeState.revealHistoricalUnderstanding("event-player-restored-frontier", "Initially attributed to a single scientist.", 20, "Scientists");
    knowledgeState.revealHistoricalUnderstanding("event-player-restored-frontier", "Later evidence showed a full team contributed.", 25, "Scientists");
    expect(knowledgeState.historicalUnderstandingFor("event-player-restored-frontier")).toBe("Later evidence showed a full team contributed.");
  });

  it("truthStandardMet mirrors AF-195's real coherenceStandardMet shape — every question must be affirmed before canon strengthens", () => {
    expect(truthStandardMet(new Set(["Can it be explained?", "Can it be demonstrated?"]))).toBe(false);
    expect(truthStandardMet(new Set(TRUTH_STANDARD_QUESTIONS))).toBe(true);
  });
});
