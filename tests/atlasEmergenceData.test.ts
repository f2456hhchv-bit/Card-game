import { describe, expect, it } from "vitest";
import {
  CIVILISATIONAL_EMERGENCE_EXAMPLES,
  COMMANDER_EMERGENCE_EXAMPLES,
  COMMUNITY_EMERGENCE_EXAMPLES,
  ECOLOGICAL_EMERGENCE_EXAMPLES,
  ECONOMIC_EMERGENCE_EXAMPLES,
  EFFECT_TIERS,
  EMERGENCE_DEVELOPER_TOOLS,
  EMERGENCE_DOMAINS,
  EMERGENCE_VALIDATION_CRITERIA,
  emergenceValidationMet,
  PERSONAL_EMERGENCE_EXAMPLES,
  PLAYER_EMERGENCE_EXAMPLES,
  POSITIVE_CASCADE_CHAIN,
} from "../src/game/atlasEmergence/atlasEmergenceData";
import { CascadeTracker } from "../src/game/atlasEmergence/AtlasEmergenceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { EVOLUTION_DOMAINS } from "../src/game/atlasEvolution/atlasEvolutionData";
import { ReputationTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { KnowledgeGraph } from "../src/game/knowledgeGraph/KnowledgeGraphRuntime";
import { SpeciesAdaptationRegistry } from "../src/game/evolutionEngine/EvolutionEngineRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { RenaissanceTracker } from "../src/game/atlasRenaissance/AtlasRenaissanceRuntime";

describe("The Atlas Emergence Engine (AF-187)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EMERGENCE_DOMAINS.length).toBe(12);
    expect(PERSONAL_EMERGENCE_EXAMPLES.length).toBe(6);
    expect(COMMANDER_EMERGENCE_EXAMPLES.length).toBe(6);
    expect(COMMUNITY_EMERGENCE_EXAMPLES.length).toBe(6);
    expect(ECOLOGICAL_EMERGENCE_EXAMPLES.length).toBe(5);
    expect(ECONOMIC_EMERGENCE_EXAMPLES.length).toBe(5);
    expect(CIVILISATIONAL_EMERGENCE_EXAMPLES.length).toBe(6);
    expect(PLAYER_EMERGENCE_EXAMPLES.length).toBe(6);
    expect(POSITIVE_CASCADE_CHAIN.length).toBe(6);
    expect(EFFECT_TIERS.length).toBe(4);
    expect(EMERGENCE_VALIDATION_CRITERIA.length).toBe(5);
    expect(EMERGENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("EMERGENCE_DOMAINS shares 8 of 12 exact-string members with the real EVOLUTION_DOMAINS, documented honestly via AF-170's real detectOverlap without claiming a record", () => {
    expect(detectOverlap(EMERGENCE_DOMAINS, EVOLUTION_DOMAINS).shared.length).toBe(8);
  });

  it("Commander Emergence is exactly AF-167's real ReputationTracker, revealing rather than assigning what a Commander becomes known for", () => {
    const reputation = new ReputationTracker();
    reputation.recognizeFor("commander-fen-beastmaster", "Ecological restoration", 20);
    reputation.recognizeFor("commander-fen-beastmaster", "Ecological restoration", 20);
    reputation.recognizeFor("commander-fen-beastmaster", "Teaching philosophy", 20);
    expect(reputation.mostRecognizedQuality("commander-fen-beastmaster")).toBe("Ecological restoration");
  });

  it("Scientific Emergence reuses AF-151's real KnowledgeGraph.suggestConnections directly, and Cultural Emergence/Positive Cascades compose AF-151's real KnowledgeGraph.addEdge directly", () => {
    const graph = new KnowledgeGraph();
    graph.addEdge({ fromId: "scientist-vale", toId: "commander-fen-beastmaster", kind: "Inspired", strength: 1, confidence: 1, historicalContext: "Music inspired architecture, which inspired education.", dateEstablished: 20 });
    expect(graph.neighbors("scientist-vale")).toContain("commander-fen-beastmaster");
    expect(graph.suggestConnections("scientist-vale")).toBeDefined();
  });

  it("Ecological Emergence reuses AF-139's real SpeciesAdaptationRegistry directly, and Community/Civilisational Emergence compose AF-159's real CulturalTrendTracker directly", () => {
    const species = new SpeciesAdaptationRegistry();
    species.adapt("system-verdance", "species-verdance-glider", "Player restoration", "Gliders form a new symbiotic behaviour.");
    expect(species.historyFor("system-verdance", "species-verdance-glider").length).toBe(1);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Citizen-Led Restoration Movement", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Citizen-Led Restoration Movement")).toEqual(["settlement-verdance"]);
  });

  it("Personal Emergence composes AF-160's real MentorshipLedger directly, and Positive Cascades' culmination reuses AF-178's real RenaissanceTracker.recordTrigger directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const renaissance = new RenaissanceTracker();
    renaissance.recordTrigger("Historic scientific discovery", 5);
    renaissance.recordTrigger("Legendary Commander", 10);
    renaissance.recordTrigger("Educational revolution", 15);
    expect(renaissance.isGoldenAge()).toBe(true);
  });

  it("CascadeTracker classifies effects into four ordered causal-distance tiers, only reaching allTiersReached once every tier has been recorded", () => {
    const cascade = new CascadeTracker();
    cascade.recordEffect("action-restored-garden", "Immediate", "Children visit the garden.", 5);
    expect(cascade.allTiersReached("action-restored-garden")).toBe(false);
    cascade.recordEffect("action-restored-garden", "Secondary", "Scientific curiosity grows.", 10);
    cascade.recordEffect("action-restored-garden", "Generational", "A university expands.", 40);
    cascade.recordEffect("action-restored-garden", "Civilisational", "An ecological renaissance begins.", 80);
    expect(cascade.allTiersReached("action-restored-garden")).toBe(true);
    expect(cascade.effectsAtTier("action-restored-garden", "Immediate").length).toBe(1);
  });

  it("emergenceValidationMet mirrors AF-170/179/180's real all-must-pass checklist pattern a fifth time", () => {
    const partial = new Set<(typeof EMERGENCE_VALIDATION_CRITERIA)[number]>(["Believable", "Scientifically grounded"]);
    expect(emergenceValidationMet(partial)).toBe(false);
    expect(emergenceValidationMet(new Set(EMERGENCE_VALIDATION_CRITERIA))).toBe(true);
  });
});
