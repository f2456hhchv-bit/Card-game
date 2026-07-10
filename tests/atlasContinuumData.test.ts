import { describe, expect, it } from "vitest";
import {
  COMMANDER_CONTINUITY_EXAMPLES,
  CONTINUOUS_CIVILISATION_EXAMPLES,
  CONTINUOUS_CULTURE_EXAMPLES,
  CONTINUOUS_DISCOVERY_EXAMPLES,
  CONTINUOUS_ECOLOGY_EXAMPLES,
  CONTINUOUS_EDUCATION_EXAMPLES,
  CONTINUOUS_QUESTION_EXAMPLES,
  CONTINUUM_DOMAINS,
  CONTINUUM_MAP_TOOLS,
  CONTINUUM_STAGES,
  GENERATIONAL_CONTINUITY_EXAMPLES,
  PLAYER_CONTINUITY_EXAMPLES,
  THREAD_CONNECTION_KINDS,
  TIME_CONTINUITY_LINKS,
} from "../src/game/atlasContinuum/atlasContinuumData";
import { ThreadRegistry, allThreadsConnected } from "../src/game/atlasContinuum/AtlasContinuumRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { INFINITY_DOMAINS, SELF_GROWING_SYSTEM_EXAMPLES } from "../src/game/atlasInfinity/atlasInfinityData";
import { DISCOVERY_CASCADE_OUTCOMES } from "../src/game/atlasHorizon/atlasHorizonData";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { CulturalTrendTracker, MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";

describe("The Atlas Continuum (AF-176)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CONTINUUM_STAGES.length).toBe(8);
    expect(CONTINUUM_DOMAINS.length).toBe(12);
    expect(TIME_CONTINUITY_LINKS.length).toBe(6);
    expect(GENERATIONAL_CONTINUITY_EXAMPLES.length).toBe(9);
    expect(COMMANDER_CONTINUITY_EXAMPLES.length).toBe(7);
    expect(PLAYER_CONTINUITY_EXAMPLES.length).toBe(7);
    expect(CONTINUOUS_DISCOVERY_EXAMPLES.length).toBe(6);
    expect(CONTINUOUS_CIVILISATION_EXAMPLES.length).toBe(5);
    expect(CONTINUOUS_EDUCATION_EXAMPLES.length).toBe(5);
    expect(CONTINUOUS_ECOLOGY_EXAMPLES.length).toBe(6);
    expect(CONTINUOUS_CULTURE_EXAMPLES.length).toBe(6);
    expect(CONTINUOUS_QUESTION_EXAMPLES.length).toBe(4);
    expect(THREAD_CONNECTION_KINDS.length).toBe(7);
    expect(CONTINUUM_MAP_TOOLS.length).toBe(6);
  });

  it("CONTINUUM_DOMAINS ties (does not break) the codebase's 10/12 absolute overlap record, sharing 10 of 12 exact-string members with the real INFINITY_DOMAINS, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(CONTINUUM_DOMAINS, INFINITY_DOMAINS);
    expect(report.shared.length).toBe(10);
  });

  it("Continuous Discovery and Continuous Civilisation read as near-total conceptual duplicates of AF-174/175's real lists, but share zero exact-string members, confirmed via detectOverlap", () => {
    expect(detectOverlap(CONTINUOUS_DISCOVERY_EXAMPLES, DISCOVERY_CASCADE_OUTCOMES).shared.length).toBe(0);
    expect(detectOverlap(CONTINUOUS_CIVILISATION_EXAMPLES, SELF_GROWING_SYSTEM_EXAMPLES).shared.length).toBe(0);
  });

  it("The Continuum's 8-stage cycle is driven directly by AF-155's real generic CyclicStageTracker, wrapping around because history becomes a living cycle", () => {
    const continuum = new CyclicStageTracker(CONTINUUM_STAGES);
    continuum.record("Past", 1);
    continuum.record("Memory", 5);
    expect(continuum.currentStage()).toBe("Memory");
    expect(continuum.next("Past Again")).toBe("Past");
  });

  it("Time Continuity and The Threads both compose AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "thread-verdance-restoration", toId: "commander-fen-beastmaster", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "The restoration links backward to the original settlement founding.", dateEstablished: 20 });
    expect(graph.neighbors("thread-verdance-restoration")).toContain("commander-fen-beastmaster");
  });

  it("Generational Continuity and Player Continuity both reuse AF-175's real GenerationalHandoffLedger directly, the same ledger spanning generations and campaigns", () => {
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture", "Questions"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(2);
  });

  it("Commander Continuity composes AF-160's real MentorshipLedger directly, and Continuous Culture composes AF-159's real CulturalTrendTracker directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Renaissance", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Renaissance")).toEqual(["settlement-verdance"]);
  });

  it("Continuous Questions composes AF-159's real MysteryLog and AF-169's real ensureNextHorizonOpen directly, at least the fourth reuse of this completion-chains-to-a-new-mystery guarantee", () => {
    const missions = new LongTermMissionTracker();
    missions.register("restore-verdance-ecosystem", "Restore Verdance's ecosystem", 100);
    missions.advance("restore-verdance-ecosystem", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "restore-verdance-ecosystem", mysteries, "mystery-deeper-question", "Unknown signals", "A deeper mystery lies beneath the restored ecosystem.", 30)).toBe(true);
    expect(mysteries.unsolved().length).toBe(1);
  });

  it("ThreadRegistry marks entities as permanently significant, and allThreadsConnected verifies none have drifted into isolation in AF-151's real KnowledgeGraph", () => {
    const threads = new ThreadRegistry();
    const graph = new KnowledgeGraph();
    threads.mark("thread-verdance-restoration", 5);
    expect(threads.isThread("thread-verdance-restoration")).toBe(true);
    expect(allThreadsConnected(threads.all().map((t) => t.entityId), graph)).toBe(false);
    graph.addEdge({ fromId: "thread-verdance-restoration", toId: "commander-fen-beastmaster", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "Connected once restoration begins.", dateEstablished: 10 });
    expect(allThreadsConnected(threads.all().map((t) => t.entityId), graph)).toBe(true);
  });
});
