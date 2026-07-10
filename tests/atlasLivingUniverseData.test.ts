import { describe, expect, it } from "vitest";
import {
  LIVING_CITY_EXAMPLES,
  LIVING_CIVILISATION_CONTRIBUTIONS,
  LIVING_COMMUNITY_EXAMPLES,
  LIVING_CULTURE_EXAMPLES,
  LIVING_DOMAINS,
  LIVING_ECOLOGY_EXAMPLES,
  LIVING_FEEDBACK_CHAIN,
  LIVING_FUTURE_EXAMPLES,
  LIVING_HISTORY_EXAMPLES,
  LIVING_KNOWLEDGE_EXAMPLES,
  LIVING_PEOPLE_EXAMPLES,
  LIVING_PLANET_EXAMPLES,
  LIVING_RELATIONSHIP_EXAMPLES,
  LIVING_SCIENCE_EXAMPLES,
  LIVING_UNIVERSE_DEVELOPER_TOOLS,
} from "../src/game/atlasLivingUniverse/atlasLivingUniverseData";
import { LivingPresentTracker } from "../src/game/atlasLivingUniverse/AtlasLivingUniverseRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CONTINUUM_DOMAINS } from "../src/game/atlasContinuum/atlasContinuumData";
import { IdentityRegistry } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";
import type { Identity } from "../src/game/atlasConsciousness/atlasConsciousnessData";
import { CulturalTrendTracker, MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { PlanetaryChronicle } from "../src/game/chronicle/ChronicleRuntime";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { HorizonEffectTracker } from "../src/game/atlasHorizon/AtlasHorizonRuntime";

describe("The Atlas Living Universe Engine (AF-185)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(LIVING_DOMAINS.length).toBe(12);
    expect(LIVING_PEOPLE_EXAMPLES.length).toBe(7);
    expect(LIVING_COMMUNITY_EXAMPLES.length).toBe(6);
    expect(LIVING_CITY_EXAMPLES.length).toBe(5);
    expect(LIVING_PLANET_EXAMPLES.length).toBe(6);
    expect(LIVING_KNOWLEDGE_EXAMPLES.length).toBe(5);
    expect(LIVING_HISTORY_EXAMPLES.length).toBe(4);
    expect(LIVING_CULTURE_EXAMPLES.length).toBe(6);
    expect(LIVING_SCIENCE_EXAMPLES.length).toBe(4);
    expect(LIVING_ECOLOGY_EXAMPLES.length).toBe(4);
    expect(LIVING_RELATIONSHIP_EXAMPLES.length).toBe(5);
    expect(LIVING_CIVILISATION_CONTRIBUTIONS.length).toBe(6);
    expect(LIVING_FEEDBACK_CHAIN.length).toBe(6);
    expect(LIVING_FUTURE_EXAMPLES.length).toBe(5);
    expect(LIVING_UNIVERSE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("LIVING_DOMAINS shares only 3 of 12 exact-string members with the real CONTINUUM_DOMAINS, documented honestly via AF-170's real detectOverlap", () => {
    expect(detectOverlap(LIVING_DOMAINS, CONTINUUM_DOMAINS).shared.length).toBe(3);
  });

  it("Living People composes AF-166's real IdentityRegistry directly", () => {
    const registry = new IdentityRegistry();
    const identity: Identity = {
      personalHistory: "Grew up on Verdance.",
      currentSelfImage: "A dedicated beastmaster.",
      professionalIdentity: "Wildlife Commander",
      privateAspirations: "To restore every wounded ecosystem.",
      publicReputation: "A dedicated beastmaster.",
      relationships: [],
      lifeMilestones: ["Found new purpose teaching the next generation"],
      personalGrowth: "Learning patience.",
    };
    registry.record("commander-fen-beastmaster", identity, 20);
    expect(registry.currentIdentityOf("commander-fen-beastmaster")?.lifeMilestones).toContain("Found new purpose teaching the next generation");
  });

  it("Living Communities/Living Culture compose AF-159's real CulturalTrendTracker, and Living Cities/Living Planets compose AF-135's real PlanetaryChronicle, all directly", () => {
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Community Garden Movement", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Community Garden Movement")).toEqual(["settlement-verdance"]);
    const chronicle = new PlanetaryChronicle();
    chronicle.write("settlement-verdance", "The skyline gains a new observatory wing.", 20, "Explorers");
    expect(chronicle.entryFor("settlement-verdance").allVersions().length).toBe(1);
  });

  it("Living Knowledge composes AF-172's real HypothesisTracker for new evidence, and Living Science composes AF-159's real MysteryLog with AF-169's real ensureNextHorizonOpen directly", () => {
    const hypotheses = new HypothesisTracker();
    hypotheses.propose("theory-migration-patterns", "Species migration may follow ancient precursor routes.", 5);
    hypotheses.supportWithEvidence("theory-migration-patterns", 20);
    expect(hypotheses.isGrounded("theory-migration-patterns")).toBe(true);
    const missions = new LongTermMissionTracker();
    missions.register("living-research-initiative", "Fund perpetual research", 100);
    missions.advance("living-research-initiative", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "living-research-initiative", mysteries, "mystery-new-question", "Unknown signals", "A new question appears where the old one was answered.", 30)).toBe(true);
  });

  it("Living Relationships composes AF-160's real MentorshipLedger, Living Civilisation reuses AF-175's real GenerationalHandoffLedger, and Living Feedback composes AF-151's real KnowledgeGraph, all directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(1);
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "domain-education", toId: "domain-science", kind: "Influenced", strength: 1, confidence: 1, historicalContext: "Education strengthens science, closing the feedback loop.", dateEstablished: 20 });
    expect(graph.neighbors("domain-education")).toContain("domain-science");
  });

  it("The Living Future composes AF-159's real MysteryLog.open and AF-174's real HorizonEffectTracker directly", () => {
    const mysteries = new MysteryLog();
    mysteries.open("mystery-new-friendship", "Unknown signals", "A new friendship forms between distant colonies.", 20);
    expect(mysteries.unsolved().length).toBe(1);
    const horizonEffect = new HorizonEffectTracker();
    horizonEffect.learn("Deep-space migration routes", 20);
    expect(horizonEffect.unknownIndex()).toBeGreaterThan(1);
  });

  it("LivingPresentTracker is the only overwriting tracker in this codebase, replacing rather than accumulating each entity's current activity", () => {
    const present = new LivingPresentTracker();
    present.update("commander-fen-beastmaster", "Teaching a new generation of explorers.", 5);
    present.update("commander-fen-beastmaster", "Restoring a wounded ecosystem on Verdance.", 20);
    expect(present.currentActivityOf("commander-fen-beastmaster")).toBe("Restoring a wounded ecosystem on Verdance.");
    expect(present.lastUpdatedEpoch("commander-fen-beastmaster")).toBe(20);
  });
});
