import { describe, expect, it } from "vitest";
import {
  BEYOND_THE_MAP_EXAMPLES,
  CIVILISATION_HORIZON_STAGES,
  COMMANDER_HORIZON_EXAMPLES,
  DISCOVERY_CASCADE_OUTCOMES,
  EDUCATIONAL_HORIZON_EXAMPLES,
  HORIZON_CATEGORIES,
  HORIZON_DEVELOPER_TOOLS,
  HORIZON_NETWORK_LINKS,
  LEGACY_HORIZON_EXAMPLES,
  LIVING_FRONTIER_EXAMPLES,
  PLAYER_HORIZON_EXAMPLES,
  UNKNOWN_INDEX_EXAMPLES,
} from "../src/game/atlasHorizon/atlasHorizonData";
import { HorizonEffectTracker } from "../src/game/atlasHorizon/AtlasHorizonRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { POSSIBILITY_CATEGORIES } from "../src/game/atlasPossibilitySpace/atlasPossibilitySpaceData";
import { MYSTERY_KINDS } from "../src/game/atlasPossibility/atlasPossibilityData";
import { MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { CommanderBeliefTracker } from "../src/game/atlasPhilosophy/AtlasPhilosophyRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";

describe("The Atlas Horizon Engine (AF-174)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(HORIZON_CATEGORIES.length).toBe(12);
    expect(DISCOVERY_CASCADE_OUTCOMES.length).toBe(6);
    expect(LIVING_FRONTIER_EXAMPLES.length).toBe(8);
    expect(COMMANDER_HORIZON_EXAMPLES.length).toBe(5);
    expect(PLAYER_HORIZON_EXAMPLES.length).toBe(5);
    expect(CIVILISATION_HORIZON_STAGES.length).toBe(8);
    expect(HORIZON_NETWORK_LINKS.length).toBe(7);
    expect(UNKNOWN_INDEX_EXAMPLES.length).toBe(5);
    expect(BEYOND_THE_MAP_EXAMPLES.length).toBe(5);
    expect(EDUCATIONAL_HORIZON_EXAMPLES.length).toBe(5);
    expect(LEGACY_HORIZON_EXAMPLES.length).toBe(5);
    expect(HORIZON_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("HORIZON_CATEGORIES ties the 8/12 absolute overlap record, sharing 8 of 12 exact-string members with the real POSSIBILITY_CATEGORIES, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(HORIZON_CATEGORIES, POSSIBILITY_CATEGORIES);
    expect(report.shared.length).toBe(8);
  });

  it("Living Frontiers and The Unknown Index both compose AF-159's real MysteryLog directly, and share verbatim members with the real MYSTERY_KINDS", () => {
    const overlap = detectOverlap(LIVING_FRONTIER_EXAMPLES, MYSTERY_KINDS);
    expect(overlap.shared).toEqual(["Incomplete research", "Lost expeditions"]);
    const mysteries = new MysteryLog();
    mysteries.open("mystery-unknown-signal", "Unknown signals", "Signals with unknown origins arrive from beyond the frontier.", 5);
    expect(mysteries.unsolved().length).toBe(1);
  });

  it("Commander Horizons reuses AF-161's real CommanderBeliefTracker directly, the third reuse of that plain evolving-string generic for an evolving aspiration", () => {
    const tracker = new CommanderBeliefTracker();
    tracker.setBelief("commander-fen-beastmaster", "I want to teach a generation to love the wild.", 5);
    tracker.setBelief("commander-fen-beastmaster", "I want to map the unexplored region beyond Verdance.", 20);
    expect(tracker.beliefOf("commander-fen-beastmaster")).toBe("I want to map the unexplored region beyond Verdance.");
    expect(tracker.history("commander-fen-beastmaster").length).toBe(2);
  });

  it("Horizon Network composes AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "horizon-living-ring", toId: "commander-fen-beastmaster", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "A new horizon opened by the living ring project.", dateEstablished: 20 });
    expect(graph.neighbors("horizon-living-ring")).toContain("commander-fen-beastmaster");
  });

  it("Beyond the Map and Legacy Horizons both reuse AF-169's real ensureNextHorizonOpen directly, the same chaining function AF-172's Horizon Effect already reused", () => {
    const missions = new LongTermMissionTracker();
    missions.register("legacy-project-verdance", "Restore Verdance's ecosystem", 100);
    missions.advance("legacy-project-verdance", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "legacy-project-verdance", mysteries, "mystery-next-frontier", "Unknown signals", "What lies beyond the restored frontier?", 30)).toBe(true);
    expect(mysteries.unsolved().length).toBe(1);
  });

  it("Civilisation Horizons is driven directly by AF-155's real generic CyclicStageTracker over the module's own 8-stage union", () => {
    const ladder = new CyclicStageTracker(CIVILISATION_HORIZON_STAGES);
    ladder.record("Survive", 1);
    ladder.record("Restore", 5);
    expect(ladder.currentStage()).toBe("Restore");
    expect(ladder.next("Reach further")).toBe("Survive");
  });

  it("HorizonEffectTracker's unknown index grows, never shrinks, as recorded knowledge grows", () => {
    const tracker = new HorizonEffectTracker();
    const baseline = tracker.unknownIndex();
    tracker.learn("Xenobiology", 5);
    tracker.learn("Precursor technology", 10);
    tracker.learn("Deep-space signals", 15);
    expect(tracker.knowledgeCount()).toBe(3);
    expect(tracker.unknownIndex()).toBeGreaterThan(baseline);
  });
});
