import { describe, expect, it } from "vitest";
import {
  CIVILISATIONAL_POSSIBILITY_QUESTIONS,
  COMMANDER_POSSIBILITY_EXAMPLES,
  ENGINEERING_POSSIBILITY_EXAMPLES,
  LIMITATION_BENEFITS,
  OPEN_DOOR_UNLOCK_KINDS,
  POSSIBILITY_COOPERATION_PARTICIPANTS,
  POSSIBILITY_CYCLE_STAGES,
  POSSIBILITY_DEVELOPER_TOOLS,
  POSSIBILITY_DOMAINS,
  POSSIBILITY_INDEX_CATEGORIES,
  PLAYER_POSSIBILITY_EXAMPLES,
  SCIENTIFIC_POSSIBILITY_EXAMPLES,
  UNKNOWN_RESERVE_EXAMPLES,
  possibilityCycleRank,
} from "../src/game/atlasOpenPossibility/atlasOpenPossibilityData";
import { PossibilityIndexScoreCard } from "../src/game/atlasOpenPossibility/AtlasOpenPossibilityRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { EXCELLENCE_DOMAINS, EXCELLENCE_INDEX_CATEGORIES, EXCELLENCE_CYCLE_STAGES } from "../src/game/atlasExcellence/atlasExcellenceData";
import { DISCOVERY_CATEGORIES } from "../src/game/atlasPossibility/atlasPossibilityData";
import { CREATION_CYCLE_STAGES } from "../src/game/atlasCreator/atlasCreatorData";
import { CRAFT_CYCLE_STAGES } from "../src/game/atlasCraftsmanship/atlasCraftsmanshipData";
import { MysteryLog, PlayerInspirationLog, PossibilityRegistry } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";

describe("The Atlas Possibility Engine (AF-194) — disambiguated from AF-159's identically-titled locked module", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(POSSIBILITY_DOMAINS.length).toBe(12);
    expect(POSSIBILITY_CYCLE_STAGES.length).toBe(8);
    expect(SCIENTIFIC_POSSIBILITY_EXAMPLES.length).toBe(5);
    expect(ENGINEERING_POSSIBILITY_EXAMPLES.length).toBe(5);
    expect(COMMANDER_POSSIBILITY_EXAMPLES.length).toBe(5);
    expect(PLAYER_POSSIBILITY_EXAMPLES.length).toBe(7);
    expect(CIVILISATIONAL_POSSIBILITY_QUESTIONS.length).toBe(4);
    expect(POSSIBILITY_COOPERATION_PARTICIPANTS.length).toBe(7);
    expect(LIMITATION_BENEFITS.length).toBe(5);
    expect(UNKNOWN_RESERVE_EXAMPLES.length).toBe(6);
    expect(POSSIBILITY_INDEX_CATEGORIES.length).toBe(8);
    expect(OPEN_DOOR_UNLOCK_KINDS.length).toBe(4);
    expect(POSSIBILITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Possibility Domains shares 11 of 12 with the real EXCELLENCE_DOMAINS (ties but does not break AF-191's own 12/12 record) and only 2 of 12 with AF-159's own real DISCOVERY_CATEGORIES", () => {
    expect(detectOverlap(POSSIBILITY_DOMAINS, EXCELLENCE_DOMAINS).shared.length).toBe(11);
    expect(detectOverlap(POSSIBILITY_DOMAINS, DISCOVERY_CATEGORIES).shared.length).toBe(2);
  });

  it("The Possibility Cycle shares 2 of 8 stages with AF-191's real CREATION_CYCLE_STAGES and zero with either AF-192's or AF-193's own sibling cycle", () => {
    expect(detectOverlap(POSSIBILITY_CYCLE_STAGES, CREATION_CYCLE_STAGES).shared.length).toBe(2);
    expect(detectOverlap(POSSIBILITY_CYCLE_STAGES, CRAFT_CYCLE_STAGES).shared.length).toBe(0);
    expect(detectOverlap(POSSIBILITY_CYCLE_STAGES, EXCELLENCE_CYCLE_STAGES).shared.length).toBe(0);
  });

  it("The Possibility Index shares zero exact categories with AF-193's real EXCELLENCE_INDEX_CATEGORIES", () => {
    expect(detectOverlap(POSSIBILITY_INDEX_CATEGORIES, EXCELLENCE_INDEX_CATEGORIES).shared.length).toBe(0);
  });

  it("possibilityCycleRank is an ordered, non-cyclic lookup — 'New Possibilities' is the highest rank, never wrapping back to Observation by name", () => {
    expect(possibilityCycleRank("Observation")).toBe(0);
    expect(possibilityCycleRank("New Possibilities")).toBe(7);
  });

  it("The Possibility Web reuses AF-159's real PossibilityRegistry/Possibility interface directly", () => {
    const registry = new PossibilityRegistry();
    registry.register({ id: "possibility-restored-frontier", discoveryCategory: "Ecological", requiredKnowledge: ["Adaptive materials"], requiredPeople: ["scientist-vale"], requiredLocations: ["settlement-verdance"], potentialRisks: ["Resource strain"], potentialRewards: ["A thriving new habitat"], historicalSignificance: 4, futureImplications: ["A model for future restorations"] });
    expect(registry.get("possibility-restored-frontier")?.requiredPeople).toEqual(["scientist-vale"]);
  });

  it("The Unknown Reserve reuses AF-159's real MysteryLog directly, and Player Possibility reuses AF-159's real PlayerInspirationLog directly", () => {
    const mysteries = new MysteryLog();
    mysteries.open("mystery-unexplored-sector", "Unknown signals", "A signal source beyond the charted frontier.", 20);
    expect(mysteries.unsolved().length).toBeGreaterThan(0);
    const inspiration = new PlayerInspirationLog();
    inspiration.surface("Historic mysteries", "An old expedition log hints at a lost settlement.", 20);
    expect(inspiration.countFor("Historic mysteries")).toBe(1);
  });

  it("The Open Door Principle reuses AF-169's real ensureNextHorizonOpen directly", () => {
    const missions = new LongTermMissionTracker();
    missions.register("player-ambition-open-frontier", "Restore a new frontier ecosystem", 100);
    missions.advance("player-ambition-open-frontier", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "player-ambition-open-frontier", mysteries, "mystery-next-open-question", "Unknown signals", "What new possibility does this success reveal?", 30)).toBe(true);
  });

  it("Possibility Through Cooperation reuses AF-155's real CollaborativeProblemLog directly, and Civilisational Possibility composes AF-151's real KnowledgeGraph.suggestConnections directly", () => {
    const collaboration = new CollaborativeProblemLog();
    collaboration.propose("problem-open-frontier-restoration", ["scientist-vale", "commander-fen-beastmaster"], "Ecology", 20);
    expect(collaboration.participantsFor("problem-open-frontier-restoration")).toEqual(["scientist-vale", "commander-fen-beastmaster"]);
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "scientist-vale", toId: "commander-fen-beastmaster", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "Shared curiosity about the unexplored frontier.", dateEstablished: 20 });
    expect(Array.isArray(graph.suggestConnections("scientist-vale"))).toBe(true);
  });

  it("PossibilityIndexScoreCard mirrors AF-143/149/170/173/179/180/182/184/188/190/193's real scoring-rubric shape, the twelfth such rubric, requiring every category before passing the shared 9.5 gate", () => {
    const card = new PossibilityIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const category of POSSIBILITY_INDEX_CATEGORIES) card.score(category, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
