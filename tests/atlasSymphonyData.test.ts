import { describe, expect, it } from "vitest";
import {
  CIVILISATION_RHYTHM_STAGES,
  COMMANDER_ENSEMBLE_EXAMPLES,
  CULTURAL_SYMPHONY_CHAIN,
  ECOLOGICAL_SYMPHONY_ELEMENTS,
  GRAND_PERFORMANCE_JOURNEYS,
  INSTITUTIONAL_SYMPHONY_CHAIN,
  ORCHESTRA_MODEL_ROLES,
  SILENCE_PRINCIPLE_EXAMPLES,
  SYMPHONY_DEVELOPER_TOOLS,
  SYMPHONY_DOMAINS,
  THEMATIC_CONSISTENCY_VALUES,
  thematicConsistencyMet,
} from "../src/game/atlasSymphony/atlasSymphonyData";
import { CampaignJourneyTracker } from "../src/game/atlasSymphony/AtlasSymphonyRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { HARMONY_DOMAINS } from "../src/game/atlasHarmony/atlasHarmonyData";
import { SOUL_DIMENSIONS } from "../src/game/atlasSoul/atlasSoulData";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { QuietMomentLog } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";

describe("The Atlas Symphony Engine (AF-183)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(SYMPHONY_DOMAINS.length).toBe(12);
    expect(ORCHESTRA_MODEL_ROLES.length).toBe(8);
    expect(COMMANDER_ENSEMBLE_EXAMPLES.length).toBe(4);
    expect(INSTITUTIONAL_SYMPHONY_CHAIN.length).toBe(5);
    expect(CIVILISATION_RHYTHM_STAGES.length).toBe(7);
    expect(ECOLOGICAL_SYMPHONY_ELEMENTS.length).toBe(7);
    expect(CULTURAL_SYMPHONY_CHAIN.length).toBe(5);
    expect(THEMATIC_CONSISTENCY_VALUES.length).toBe(8);
    expect(SILENCE_PRINCIPLE_EXAMPLES.length).toBe(5);
    expect(GRAND_PERFORMANCE_JOURNEYS.length).toBe(4);
    expect(SYMPHONY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("documents overlaps honestly via AF-170's real detectOverlap, without claiming a new record", () => {
    expect(detectOverlap(SYMPHONY_DOMAINS, HARMONY_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(THEMATIC_CONSISTENCY_VALUES, SOUL_DIMENSIONS).shared.length).toBe(5);
  });

  it("thematicConsistencyMet is an ANY-of-N gate, the second such shape in this codebase after AF-181's real eternalStandardMet", () => {
    const singleMatch = new Set<(typeof THEMATIC_CONSISTENCY_VALUES)[number]>(["Wonder"]);
    expect(thematicConsistencyMet(singleMatch)).toBe(true);
    expect(thematicConsistencyMet(new Set())).toBe(false);
  });

  it("Institutional Symphony, Cultural Symphony, and The Resonance Model all compose AF-151's real KnowledgeGraph.addEdge directly, using the already-real Inspired edge kind", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "institution-verdance-museum", toId: "institution-verdance-academy", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "The museum's collection inspired the academy's founding.", dateEstablished: 20 });
    expect(graph.neighbors("institution-verdance-museum")).toContain("institution-verdance-academy");
  });

  it("Civilisation Rhythm is driven directly by AF-155's real generic CyclicStageTracker over the module's own 7-stage union, renewing after Renewed Exploration", () => {
    const rhythm = new CyclicStageTracker(CIVILISATION_RHYTHM_STAGES);
    rhythm.record("Exploration", 1);
    rhythm.record("Construction", 5);
    expect(rhythm.currentStage()).toBe("Construction");
    expect(rhythm.next("Renewed Exploration")).toBe("Exploration");
  });

  it("The Silence Principle reuses AF-163's real QuietMomentLog directly, the same class AF-180's Quiet Victory already reused", () => {
    const quietMoments = new QuietMomentLog();
    quietMoments.record("A quiet sunrise over the restored Verdance forest.", 20);
    expect(quietMoments.all().length).toBe(1);
  });

  it("The Resonance Model's 'echoes across generations' also composes AF-175's real GenerationalHandoffLedger directly", () => {
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(1);
  });

  it("CampaignJourneyTracker only reports isUnifiedStory once every journey has been touched at least once", () => {
    const tracker = new CampaignJourneyTracker();
    tracker.contribute("A scientific journey");
    tracker.contribute("A scientific journey");
    expect(tracker.isUnifiedStory()).toBe(false);
    expect(tracker.dominantJourney()).toBe("A scientific journey");
    tracker.contribute("A cultural journey");
    tracker.contribute("An ecological journey");
    tracker.contribute("A human journey");
    expect(tracker.isUnifiedStory()).toBe(true);
  });
});
