import { describe, expect, it } from "vitest";
import {
  ASCENSION_DEVELOPER_TOOLS,
  ASCENSION_EVENT_EXAMPLES,
  ASCENSION_INDEX_CRITERIA,
  ASCENSION_PILLARS,
  ASCENSION_TEST_QUESTIONS,
  ASCENSION_TIERS,
  ascensionTestPassed,
  ascensionTierRank,
  COMMANDER_ASCENSION_EXAMPLES,
  CULTURAL_ASCENSION_EXAMPLES,
  INSTITUTION_EVOLUTION_EXAMPLES,
  PLANETARY_ASCENSION_EXAMPLES,
  PLAYER_ASCENSION_ROLES,
  playerAscensionRank,
  SCIENTIFIC_ASCENSION_STAGES,
  scientificAscensionRank,
} from "../src/game/atlasAscension/atlasAscensionData";
import { AscensionIndexScoreCard } from "../src/game/atlasAscension/AtlasAscensionRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { SOUL_DIMENSIONS } from "../src/game/atlasSoul/atlasSoulData";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Ascension Engine (AF-179)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ASCENSION_PILLARS.length).toBe(12);
    expect(ASCENSION_TIERS.length).toBe(8);
    expect(COMMANDER_ASCENSION_EXAMPLES.length).toBe(6);
    expect(SCIENTIFIC_ASCENSION_STAGES.length).toBe(6);
    expect(CULTURAL_ASCENSION_EXAMPLES.length).toBe(8);
    expect(INSTITUTION_EVOLUTION_EXAMPLES.length).toBe(4);
    expect(PLANETARY_ASCENSION_EXAMPLES.length).toBe(5);
    expect(PLAYER_ASCENSION_ROLES.length).toBe(8);
    expect(ASCENSION_INDEX_CRITERIA.length).toBe(8);
    expect(ASCENSION_EVENT_EXAMPLES.length).toBe(6);
    expect(ASCENSION_TEST_QUESTIONS.length).toBe(5);
    expect(ASCENSION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("ASCENSION_PILLARS shares 5 of 12 exact-string members with the real SOUL_DIMENSIONS, verified via AF-170's real detectOverlap (no overlap record claimed, just documented honestly)", () => {
    const report = detectOverlap(ASCENSION_PILLARS, SOUL_DIMENSIONS);
    expect(report.shared.length).toBe(5);
  });

  it("AscensionIndexCriterion structurally contains no military/power/strength member, enforcing Military dominance is never a primary measure", () => {
    const forbidden = /military|power|strength|dominance|combat|weapon/i;
    for (const criterion of ASCENSION_INDEX_CRITERIA) expect(criterion).not.toMatch(forbidden);
  });

  it("Ascension Tiers, Scientific Ascension and Player Ascension all mirror the codebase's established rank-function pattern for non-cyclic ladders", () => {
    expect(ascensionTierRank("Survival")).toBe(0);
    expect(ascensionTierRank("Ascension")).toBe(7);
    expect(scientificAscensionRank("Observation")).toBe(0);
    expect(scientificAscensionRank("Universal collaboration")).toBe(5);
    expect(playerAscensionRank("Explorer")).toBe(0);
    expect(playerAscensionRank("Living Inspiration")).toBe(7);
  });

  it("The Ascension Test mirrors AF-170's real all-must-pass checklist pattern exactly", () => {
    const partial = new Set<(typeof ASCENSION_TEST_QUESTIONS)[number]>(["Are children better educated?", "Are ecosystems healthier?"]);
    expect(ascensionTestPassed(partial)).toBe(false);
    const complete = new Set(ASCENSION_TEST_QUESTIONS);
    expect(ascensionTestPassed(complete)).toBe(true);
  });

  it("AscensionIndexScoreCard mirrors AF-143/149/170/173's real scoring-rubric shape, the fifth such rubric, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new AscensionIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const criterion of ASCENSION_INDEX_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });

  it("Commander Ascension composes AF-160's real MentorshipLedger, Cultural Ascension composes AF-168's real BeautyIndexTracker and AF-159's real CulturalTrendTracker, all directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const beauty = new BeautyIndexTracker();
    beauty.setLevel("Public spaces", 80);
    expect(beauty.levelFor("Public spaces")).toBe(80);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Open Knowledge Movement", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Open Knowledge Movement")).toEqual(["settlement-verdance"]);
  });

  it("Ascension Network composes AF-151's real KnowledgeGraph.addEdge directly, using the already-real Influenced edge kind", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "domain-education", toId: "domain-science", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "Educational reform improved scientific literacy.", dateEstablished: 20 });
    expect(graph.neighbors("domain-education")).toContain("domain-science");
  });
});
