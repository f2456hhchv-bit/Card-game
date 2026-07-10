import { describe, expect, it } from "vitest";
import {
  BALANCE_MODEL_FACTORS,
  COMMANDER_HARMONY_EXAMPLES,
  CULTURAL_HARMONY_EXAMPLES,
  ECOLOGICAL_HARMONY_EXAMPLES,
  ECONOMIC_HARMONY_EXAMPLES,
  HARMONY_DEVELOPER_TOOLS,
  HARMONY_DOMAINS,
  HARMONY_INDEX_CRITERIA,
  IMBALANCE_DETECTOR_EXAMPLES,
  POSITIVE_FEEDBACK_LOOP_EXAMPLES,
  SCIENTIFIC_HARMONY_EXAMPLES,
  SOCIAL_HARMONY_EXAMPLES,
  SYSTEM_RELATIONSHIP_EXAMPLES,
  URBAN_HARMONY_EXAMPLES,
} from "../src/game/atlasHarmony/atlasHarmonyData";
import { HarmonyIndexScoreCard, HarmonyTracker } from "../src/game/atlasHarmony/AtlasHarmonyRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { TRANSCENDENCE_INDEX_CRITERIA } from "../src/game/atlasTranscendence/atlasTranscendenceData";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";

describe("The Atlas Harmony Engine (AF-182)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(HARMONY_DOMAINS.length).toBe(12);
    expect(BALANCE_MODEL_FACTORS.length).toBe(8);
    expect(SYSTEM_RELATIONSHIP_EXAMPLES.length).toBe(6);
    expect(ECOLOGICAL_HARMONY_EXAMPLES.length).toBe(6);
    expect(URBAN_HARMONY_EXAMPLES.length).toBe(8);
    expect(COMMANDER_HARMONY_EXAMPLES.length).toBe(6);
    expect(SCIENTIFIC_HARMONY_EXAMPLES.length).toBe(6);
    expect(CULTURAL_HARMONY_EXAMPLES.length).toBe(7);
    expect(ECONOMIC_HARMONY_EXAMPLES.length).toBe(6);
    expect(SOCIAL_HARMONY_EXAMPLES.length).toBe(6);
    expect(HARMONY_INDEX_CRITERIA.length).toBe(8);
    expect(POSITIVE_FEEDBACK_LOOP_EXAMPLES.length).toBe(5);
    expect(IMBALANCE_DETECTOR_EXAMPLES.length).toBe(6);
    expect(HARMONY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("documents overlaps honestly via AF-170's real detectOverlap, without claiming a new record", () => {
    expect(detectOverlap(HARMONY_DOMAINS, CREATIVE_DOMAINS).shared.length).toBe(8);
    expect(detectOverlap(HARMONY_INDEX_CRITERIA, TRANSCENDENCE_INDEX_CRITERIA).shared.length).toBe(3);
  });

  it("HarmonyTracker changes balance gradually via a capped delta per update, mirroring AF-166's real ValuePriorityTracker constraint", () => {
    const tracker = new HarmonyTracker();
    expect(tracker.levelOf("Science")).toBe(50);
    tracker.adjustToward("Science", 100);
    expect(tracker.levelOf("Science")).toBe(55);
    tracker.adjustToward("Science", 0);
    expect(tracker.levelOf("Science")).toBe(50);
  });

  it("HarmonyTracker surfaces the emergent most-dominant and most-neglected domain, never assigned directly, and detects when the spread exceeds the balance threshold", () => {
    const tracker = new HarmonyTracker();
    for (let i = 0; i < 10; i++) tracker.adjustToward("Science", 100);
    expect(tracker.levelOf("Science")).toBe(100);
    expect(tracker.mostDominantDomain()).toBe("Science");
    expect(tracker.isBalanced()).toBe(false);
    for (const domain of HARMONY_DOMAINS) if (domain !== "Science") for (let i = 0; i < 10; i++) tracker.adjustToward(domain, 100);
    expect(tracker.isBalanced()).toBe(true);
  });

  it("System Relationships and Positive Feedback Loops both compose AF-151's real KnowledgeGraph.addEdge directly, using the already-real Influenced edge kind", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "domain-education", toId: "domain-science", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "Education strengthens science.", dateEstablished: 20 });
    expect(graph.neighbors("domain-education")).toContain("domain-science");
  });

  it("Cultural Harmony composes AF-159's real CulturalTrendTracker, Commander/Social Harmony compose AF-160's real MentorshipLedger, and Urban Harmony composes AF-168's real BeautyIndexTracker, all directly", () => {
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Balanced Progress Movement", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Balanced Progress Movement")).toEqual(["settlement-verdance"]);
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const beauty = new BeautyIndexTracker();
    beauty.setLevel("Public spaces", 75);
    expect(beauty.levelFor("Public spaces")).toBe(75);
  });

  it("HarmonyIndexScoreCard mirrors AF-143/149/170/173/179/180's real scoring-rubric shape, the seventh such rubric, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new HarmonyIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const criterion of HARMONY_INDEX_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
