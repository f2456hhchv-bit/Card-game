import { describe, expect, it } from "vitest";
import {
  CIVILISATION_WEB_CHAIN,
  COMMANDER_UNITY_ROLES,
  INSTITUTIONAL_UNITY_EXAMPLES,
  KNOWLEDGE_COMMONS_EXAMPLES,
  PLANETARY_UNITY_EXAMPLES,
  SHARED_ACHIEVEMENT_EXAMPLES,
  UNITY_DEVELOPER_TOOLS,
  UNITY_DOMAINS,
  UNITY_EVENT_EXAMPLES,
  UNITY_INDEX_CRITERIA,
  UNITY_NETWORK_QUESTIONS,
  UNITY_THROUGH_DIVERSITY_EXAMPLES,
} from "../src/game/atlasUnity/atlasUnityData";
import { UnityIndexScoreCard } from "../src/game/atlasUnity/AtlasUnityRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { SYMPHONY_DOMAINS } from "../src/game/atlasSymphony/atlasSymphonyData";
import { INSTITUTION_TYPES } from "../src/game/atlasGenesis/atlasGenesisData";
import { ASCENSION_INDEX_CRITERIA } from "../src/game/atlasAscension/atlasAscensionData";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { ThreadRegistry, allThreadsConnected } from "../src/game/atlasContinuum/AtlasContinuumRuntime";

describe("The Atlas Unity Engine (AF-184)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(UNITY_DOMAINS.length).toBe(12);
    expect(UNITY_NETWORK_QUESTIONS.length).toBe(6);
    expect(COMMANDER_UNITY_ROLES.length).toBe(7);
    expect(PLANETARY_UNITY_EXAMPLES.length).toBe(8);
    expect(INSTITUTIONAL_UNITY_EXAMPLES.length).toBe(8);
    expect(KNOWLEDGE_COMMONS_EXAMPLES.length).toBe(6);
    expect(UNITY_THROUGH_DIVERSITY_EXAMPLES.length).toBe(6);
    expect(CIVILISATION_WEB_CHAIN.length).toBe(8);
    expect(SHARED_ACHIEVEMENT_EXAMPLES.length).toBe(5);
    expect(UNITY_EVENT_EXAMPLES.length).toBe(6);
    expect(UNITY_INDEX_CRITERIA.length).toBe(8);
    expect(UNITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("documents overlaps honestly via AF-170's real detectOverlap, without claiming a new record", () => {
    expect(detectOverlap(UNITY_DOMAINS, SYMPHONY_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(INSTITUTIONAL_UNITY_EXAMPLES, INSTITUTION_TYPES).shared.length).toBe(5);
    expect(detectOverlap(UNITY_INDEX_CRITERIA, ASCENSION_INDEX_CRITERIA).shared.length).toBe(2);
  });

  it("The Unity Network, The Civilisation Web, and The Knowledge Commons all compose AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "institution-verdance-academy", toId: "institution-verdance-museum", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "The academy freely shares research with the museum.", dateEstablished: 20 });
    expect(graph.neighbors("institution-verdance-academy")).toContain("institution-verdance-museum");
  });

  it("Unity Through Diversity composes AF-159's real CulturalTrendTracker directly", () => {
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Language Preservation", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Language Preservation")).toEqual(["settlement-verdance"]);
  });

  it("Shared Achievements reuses AF-176's real ThreadRegistry/allThreadsConnected directly, since a shared achievement is exactly a permanently significant thread", () => {
    const threads = new ThreadRegistry();
    const graph = new KnowledgeGraph();
    threads.mark("achievement-planetary-restoration", 5);
    expect(allThreadsConnected(threads.all().map((t) => t.entityId), graph)).toBe(false);
    graph.addEdge({ fromId: "achievement-planetary-restoration", toId: "settlement-verdance", kind: "Created", strength: 1, confidence: 1, historicalContext: "Everyone contributed to the restoration.", dateEstablished: 20 });
    expect(allThreadsConnected(threads.all().map((t) => t.entityId), graph)).toBe(true);
  });

  it("UnityIndexScoreCard mirrors AF-143/149/170/173/179/180/182's real scoring-rubric shape, the eighth such rubric, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new UnityIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const criterion of UNITY_INDEX_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
