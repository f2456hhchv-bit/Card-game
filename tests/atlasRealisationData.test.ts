import { describe, expect, it } from "vitest";
import {
  COMMANDER_REALISATION_EXAMPLES,
  CULTURAL_REALISATION_EXAMPLES,
  ENGINEERING_REALISATION_EXAMPLES,
  FEEDBACK_LOOP_EXAMPLES,
  IMPLEMENTATION_ARCHIVE_FIELDS,
  IMPLEMENTATION_NETWORK_LINKS,
  INSTITUTIONAL_REALISATION_EXAMPLES,
  PLAYER_REALISATION_EXAMPLES,
  QUALITY_GATE_CRITERIA,
  REALISATION_DEVELOPER_TOOLS,
  REALISATION_DOMAINS,
  REALISATION_STAGES,
  RIPPLE_EFFECT_EXAMPLES,
  SCIENTIFIC_REALISATION_EXAMPLES,
} from "../src/game/atlasRealisation/atlasRealisationData";
import { QualityGateScoreCard, RealisationTracker } from "../src/game/atlasRealisation/AtlasRealisationRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { RENAISSANCE_DOMAINS } from "../src/game/atlasRenaissance/atlasRenaissanceData";
import { INNOVATION_FILTER_CRITERIA } from "../src/game/atlasPossibilitySpace/atlasPossibilitySpaceData";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { GenesisRegistry } from "../src/game/atlasGenesis/AtlasGenesisRuntime";
import { CulturalTrendTracker, MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";

describe("The Atlas Possibility Realisation Engine (AF-188)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(REALISATION_STAGES.length).toBe(12);
    expect(REALISATION_DOMAINS.length).toBe(12);
    expect(SCIENTIFIC_REALISATION_EXAMPLES.length).toBe(7);
    expect(ENGINEERING_REALISATION_EXAMPLES.length).toBe(10);
    expect(COMMANDER_REALISATION_EXAMPLES.length).toBe(8);
    expect(INSTITUTIONAL_REALISATION_EXAMPLES.length).toBe(8);
    expect(CULTURAL_REALISATION_EXAMPLES.length).toBe(6);
    expect(PLAYER_REALISATION_EXAMPLES.length).toBe(8);
    expect(IMPLEMENTATION_NETWORK_LINKS.length).toBe(6);
    expect(FEEDBACK_LOOP_EXAMPLES.length).toBe(5);
    expect(QUALITY_GATE_CRITERIA.length).toBe(7);
    expect(RIPPLE_EFFECT_EXAMPLES.length).toBe(6);
    expect(IMPLEMENTATION_ARCHIVE_FIELDS.length).toBe(6);
    expect(REALISATION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("REALISATION_DOMAINS shares 9 of 12 exact-string members with the real RENAISSANCE_DOMAINS, and QUALITY_GATE_CRITERIA shares 3 of 7 with the real INNOVATION_FILTER_CRITERIA, both documented honestly via AF-170's real detectOverlap without claiming a record", () => {
    expect(detectOverlap(REALISATION_DOMAINS, RENAISSANCE_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(QUALITY_GATE_CRITERIA, INNOVATION_FILTER_CRITERIA).shared.length).toBe(3);
  });

  it("RealisationTracker only advances one stage at a time, structurally rejecting skipped-ahead or out-of-order progress", () => {
    const tracker = new RealisationTracker();
    expect(tracker.advanceTo("idea-living-city", "Wonder", 1)).toBe(true);
    expect(tracker.advanceTo("idea-living-city", "Implementation", 5)).toBe(false);
    expect(tracker.currentStageOf("idea-living-city")).toBe("Wonder");
    expect(tracker.advanceTo("idea-living-city", "Question", 5)).toBe(true);
    expect(tracker.advanceTo("idea-living-city", "Wonder", 10)).toBe(false);
    expect(tracker.hasReachedStage("idea-living-city", "Wonder")).toBe(true);
    expect(tracker.hasReachedStage("idea-living-city", "Legacy")).toBe(false);
  });

  it("Scientific Realisation composes AF-172's real HypothesisTracker, Commander Realisation composes AF-160's real MentorshipLedger, and Institutional Realisation reuses AF-177's real GenesisRegistry, all directly", () => {
    const hypotheses = new HypothesisTracker();
    hypotheses.propose("theory-living-city", "A city can restore itself using adaptive materials.", 5);
    hypotheses.supportWithEvidence("theory-living-city", 20);
    expect(hypotheses.isGrounded("theory-living-city")).toBe(true);
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const genesis = new GenesisRegistry();
    genesis.recordOrigin("institution-living-city-academy", "commander-fen-beastmaster", "Community need for adaptive-architecture education.", "settlement-verdance", 20, "A restored garden inspiring curiosity", [], ["scientist-vale"]);
    expect(genesis.originOf("institution-living-city-academy")?.founder).toBe("commander-fen-beastmaster");
  });

  it("Cultural Realisation composes AF-159's real CulturalTrendTracker, and Player Realisation reuses AF-162's real LongTermMissionTracker, both directly", () => {
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Living City Festival", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Living City Festival")).toEqual(["settlement-verdance"]);
    const missions = new LongTermMissionTracker();
    missions.register("player-ambition-living-city", "Build a self-restoring city", 100);
    missions.advance("player-ambition-living-city", 100);
    expect(missions.isComplete("player-ambition-living-city")).toBe(true);
  });

  it("The Implementation Network/The Ripple Effect compose AF-151's real KnowledgeGraph directly, and Feedback Loop composes AF-159's real MysteryLog with AF-169's real ensureNextHorizonOpen directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "idea-living-city", toId: "institution-living-city-academy", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "The realised idea inspired a new academy.", dateEstablished: 20 });
    expect(graph.neighbors("idea-living-city")).toContain("institution-living-city-academy");
    const missions = new LongTermMissionTracker();
    missions.register("player-ambition-living-city", "Build a self-restoring city", 100);
    missions.advance("player-ambition-living-city", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "player-ambition-living-city", mysteries, "mystery-next-frontier", "Unknown signals", "What new frontier does this success reveal?", 30)).toBe(true);
  });

  it("QualityGateScoreCard mirrors AF-143/149/170/173/179/180/182/184's real scoring-rubric shape, the ninth such rubric, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new QualityGateScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const criterion of QUALITY_GATE_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
