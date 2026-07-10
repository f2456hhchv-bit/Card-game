import { describe, expect, it } from "vitest";
import {
  CITY_FOUNDATION_EXAMPLES,
  COMMANDER_ORIGIN_EXAMPLES,
  CULTURAL_BEGINNING_EXAMPLES,
  ECOLOGICAL_BEGINNING_EXAMPLES,
  FOUNDER_LEGACY_EXAMPLES,
  GENESIS_DEVELOPER_TOOLS,
  GENESIS_DOMAINS,
  GENESIS_LIFECYCLE_STAGES,
  INSTITUTION_FOUNDING_ATTRIBUTES,
  INSTITUTION_TYPES,
  PLAYER_FOUNDATION_EXAMPLES,
  SCIENTIFIC_ORIGIN_EXAMPLES,
  TRADITION_ORIGIN_TRIGGERS,
} from "../src/game/atlasGenesis/atlasGenesisData";
import { GenesisRegistry } from "../src/game/atlasGenesis/AtlasGenesisRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { HORIZON_CATEGORIES } from "../src/game/atlasHorizon/atlasHorizonData";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { IdentityRegistry } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";
import type { Identity } from "../src/game/atlasConsciousness/atlasConsciousnessData";
import { EarnedTitleTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";

describe("The Atlas Genesis Engine (AF-177)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(GENESIS_DOMAINS.length).toBe(12);
    expect(COMMANDER_ORIGIN_EXAMPLES.length).toBe(6);
    expect(CITY_FOUNDATION_EXAMPLES.length).toBe(6);
    expect(SCIENTIFIC_ORIGIN_EXAMPLES.length).toBe(6);
    expect(TRADITION_ORIGIN_TRIGGERS.length).toBe(6);
    expect(INSTITUTION_TYPES.length).toBe(6);
    expect(INSTITUTION_FOUNDING_ATTRIBUTES.length).toBe(5);
    expect(CULTURAL_BEGINNING_EXAMPLES.length).toBe(6);
    expect(ECOLOGICAL_BEGINNING_EXAMPLES.length).toBe(5);
    expect(PLAYER_FOUNDATION_EXAMPLES.length).toBe(5);
    expect(FOUNDER_LEGACY_EXAMPLES.length).toBe(5);
    expect(GENESIS_LIFECYCLE_STAGES.length).toBe(5);
    expect(GENESIS_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("GENESIS_DOMAINS ties (does not break) the codebase's 10/12 absolute overlap record, sharing 10 of 12 exact-string members with the real HORIZON_CATEGORIES, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(GENESIS_DOMAINS, HORIZON_CATEGORIES);
    expect(report.shared.length).toBe(10);
  });

  it("GenesisRegistry permanently records an entity's first moment, and a second recordOrigin call for the same id is a no-op", () => {
    const registry = new GenesisRegistry();
    registry.recordOrigin("institution-verdance-academy", "commander-fen-beastmaster", "To teach the next generation to protect the wild.", "settlement-verdance", 5, "A child asking too many questions", ["scientist-vale"], ["commander-thorne-starforged"]);
    registry.recordOrigin("institution-verdance-academy", "someone-else", "A different reason", "elsewhere", 99, "a different inspiration", [], []);
    const origin = registry.originOf("institution-verdance-academy");
    expect(origin?.founder).toBe("commander-fen-beastmaster");
    expect(origin?.epoch).toBe(5);
    expect(registry.all().length).toBe(1);
  });

  it("Scientific Origins reuses AF-172's real HypothesisTracker directly for Original hypothesis/First experiment", () => {
    const tracker = new HypothesisTracker();
    tracker.propose("discipline-galactic-ecology", "Galactic Ecology may explain cross-system migration patterns.", 5);
    expect(tracker.isGrounded("discipline-galactic-ecology")).toBe(false);
    tracker.supportWithEvidence("discipline-galactic-ecology", 20);
    expect(tracker.isGrounded("discipline-galactic-ecology")).toBe(true);
  });

  it("Institution Foundations reuses AF-165's real InstitutionalMemoryTracker directly, since Founders is already the first real category", () => {
    const memory = new InstitutionalMemoryTracker();
    memory.remember("institution-verdance-academy", "Founders", "Commander Fen Beastmaster founded the academy.", 5);
    expect(memory.memoriesFor("institution-verdance-academy").length).toBe(1);
  });

  it("The Spark Network composes AF-151's real KnowledgeGraph.addEdge directly, using the already-real Inspired edge kind", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "discipline-galactic-ecology", toId: "institution-verdance-academy", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "The discipline's early findings inspired the academy's founding.", dateEstablished: 5 });
    expect(graph.neighbors("discipline-galactic-ecology")).toContain("institution-verdance-academy");
  });

  it("Beginning to Legacy is driven directly by AF-155's real generic CyclicStageTracker over the module's own 5-stage union, renewing after New Origin", () => {
    const lifecycle = new CyclicStageTracker(GENESIS_LIFECYCLE_STAGES);
    lifecycle.record("Origin", 1);
    lifecycle.record("Growth", 5);
    expect(lifecycle.currentStage()).toBe("Growth");
    expect(lifecycle.next("New Origin")).toBe("Origin");
  });

  it("Commander Origins composes AF-166's real IdentityRegistry directly via lifeMilestones", () => {
    const identityRegistry = new IdentityRegistry();
    const identity: Identity = {
      personalHistory: "Grew up on Verdance.",
      currentSelfImage: "A dedicated beastmaster.",
      professionalIdentity: "Wildlife Commander",
      privateAspirations: "To restore every wounded ecosystem.",
      publicReputation: "A dedicated beastmaster.",
      relationships: [],
      lifeMilestones: ["First mentor: Commander Thorne Starforged"],
      personalGrowth: "Learning patience.",
    };
    identityRegistry.record("commander-fen-beastmaster", identity, 5);
    expect(identityRegistry.currentIdentityOf("commander-fen-beastmaster")?.lifeMilestones).toContain("First mentor: Commander Thorne Starforged");
  });

  it("The Founders composes AF-167's real EarnedTitleTracker directly, since it already takes a plain free-text title", () => {
    const earnedTitles = new EarnedTitleTracker();
    earnedTitles.earn("commander-fen-beastmaster", "Founder", 5);
    expect(earnedTitles.titlesFor("commander-fen-beastmaster").map((t) => t.title)).toContain("Founder");
  });
});
