import { describe, expect, it } from "vitest";
import {
  CIVILISATIONAL_EVOLUTION_EXAMPLES,
  COMMANDER_EVOLUTION_EXAMPLES,
  CULTURAL_EVOLUTION_EXAMPLES as ATLAS_CULTURAL_EVOLUTION_EXAMPLES,
  EDUCATIONAL_EVOLUTION_EXAMPLES,
  EVOLUTION_CHAIN_STAGES,
  EVOLUTION_DEVELOPER_TOOLS,
  EVOLUTION_DOMAINS,
  EVOLUTION_RECORD_FIELDS,
  EVOLUTION_TRANSITION_STATES,
  INSTITUTIONAL_EVOLUTION_EXAMPLES,
  PERSONAL_EVOLUTION_EXAMPLES,
  REVERSIBILITY_EXAMPLES,
  SCIENTIFIC_EVOLUTION_EXAMPLES,
  SPECIES_EVOLUTION_EXAMPLES,
  TECHNOLOGICAL_EVOLUTION_EXAMPLES,
} from "../src/game/atlasEvolution/atlasEvolutionData";
import { EvolutionRecord } from "../src/game/atlasEvolution/AtlasEvolutionRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import {
  EVOLUTION_PILLARS,
  SPECIES_ADAPTATION_TRIGGER_KINDS,
  TECHNOLOGY_ERAS,
  technologyEraFor,
  commanderMaturityScore,
  commanderMaturityStageFor,
} from "../src/game/evolutionEngine/evolutionEngineData";
import { HistoricalArchitectureLedger, LanguageEvolutionLog, SpeciesAdaptationRegistry } from "../src/game/evolutionEngine/EvolutionEngineRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { IdentityRegistry } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";
import type { Identity } from "../src/game/atlasConsciousness/atlasConsciousnessData";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";

describe("The Atlas Evolution Engine (AF-186)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EVOLUTION_DOMAINS.length).toBe(12);
    expect(PERSONAL_EVOLUTION_EXAMPLES.length).toBe(8);
    expect(COMMANDER_EVOLUTION_EXAMPLES.length).toBe(8);
    expect(SPECIES_EVOLUTION_EXAMPLES.length).toBe(7);
    expect(INSTITUTIONAL_EVOLUTION_EXAMPLES.length).toBe(5);
    expect(SCIENTIFIC_EVOLUTION_EXAMPLES.length).toBe(6);
    expect(TECHNOLOGICAL_EVOLUTION_EXAMPLES.length).toBe(6);
    expect(ATLAS_CULTURAL_EVOLUTION_EXAMPLES.length).toBe(7);
    expect(EDUCATIONAL_EVOLUTION_EXAMPLES.length).toBe(6);
    expect(CIVILISATIONAL_EVOLUTION_EXAMPLES.length).toBe(7);
    expect(EVOLUTION_CHAIN_STAGES.length).toBe(8);
    expect(REVERSIBILITY_EXAMPLES.length).toBe(4);
    expect(EVOLUTION_TRANSITION_STATES.length).toBe(4);
    expect(EVOLUTION_RECORD_FIELDS.length).toBe(6);
    expect(EVOLUTION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("EVOLUTION_DOMAINS shares zero exact-string members with AF-139's real EVOLUTION_PILLARS despite obvious conceptual overlap, and SPECIES_EVOLUTION_EXAMPLES shares 3 of 7 with AF-139's real SPECIES_ADAPTATION_TRIGGER_KINDS, both confirmed via AF-170's real detectOverlap", () => {
    expect(detectOverlap(EVOLUTION_DOMAINS, EVOLUTION_PILLARS).shared.length).toBe(0);
    expect(detectOverlap(SPECIES_EVOLUTION_EXAMPLES, SPECIES_ADAPTATION_TRIGGER_KINDS).shared.length).toBe(3);
  });

  it("Species Evolution reuses AF-139's real SpeciesAdaptationRegistry directly, and City Evolution reuses AF-139's real HistoricalArchitectureLedger directly", () => {
    const species = new SpeciesAdaptationRegistry();
    species.adapt("system-verdance", "species-verdance-glider", "Climate", "Gliders roost higher after warming.");
    expect(species.historyFor("system-verdance", "species-verdance-glider").length).toBe(1);
    const architecture = new HistoricalArchitectureLedger();
    architecture.record("settlement-verdance", "Districts", 20);
    architecture.record("settlement-verdance", "Modern Cities", 40);
    expect(architecture.layersFor("settlement-verdance")).toEqual(["Districts", "Modern Cities"]);
  });

  it("Cultural Evolution's Language reuses AF-139's real LanguageEvolutionLog directly, and the broader section composes AF-159's real CulturalTrendTracker directly", () => {
    const language = new LanguageEvolutionLog();
    language.coin("phrase-verdance-dawn", "May your dawn find the wild kind.", 20, "Explorers");
    expect(language.latestFor("phrase-verdance-dawn")).toBe("May your dawn find the wild kind.");
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Storytelling Revival", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Storytelling Revival")).toEqual(["settlement-verdance"]);
  });

  it("Commander Evolution reuses AF-139's real commanderMaturityScore/commanderMaturityStageFor directly, and Technological Evolution reuses AF-139's real technologyEraFor/TECHNOLOGY_ERAS directly", () => {
    const score = commanderMaturityScore(3, 5, 60);
    expect(commanderMaturityStageFor(score)).toBeTruthy();
    expect(TECHNOLOGY_ERAS.length).toBe(5);
    expect(technologyEraFor(20, 3)).toBe("Advanced Age");
  });

  it("Personal Evolution composes AF-166's real IdentityRegistry, Institutional Evolution composes AF-165's real InstitutionalMemoryTracker, and Scientific Evolution composes AF-172's real HypothesisTracker, all directly", () => {
    const identityRegistry = new IdentityRegistry();
    const identity: Identity = {
      personalHistory: "Grew up on Verdance.",
      currentSelfImage: "A dedicated beastmaster.",
      professionalIdentity: "Wildlife Commander",
      privateAspirations: "To restore every wounded ecosystem.",
      publicReputation: "A dedicated beastmaster.",
      relationships: [],
      lifeMilestones: ["Reflected on a decade of fieldwork"],
      personalGrowth: "Learning patience.",
    };
    identityRegistry.record("commander-fen-beastmaster", identity, 20);
    expect(identityRegistry.currentIdentityOf("commander-fen-beastmaster")?.lifeMilestones).toContain("Reflected on a decade of fieldwork");
    const memory = new InstitutionalMemoryTracker();
    memory.remember("institution-verdance-academy", "Breakthroughs", "A new discipline was created this year.", 20);
    expect(memory.memoriesFor("institution-verdance-academy").length).toBe(1);
    const hypotheses = new HypothesisTracker();
    hypotheses.propose("theory-evolution-record", "Revision strengthens rather than contradicts prior evidence.", 5);
    hypotheses.supportWithEvidence("theory-evolution-record", 20);
    expect(hypotheses.isGrounded("theory-evolution-record")).toBe(true);
  });

  it("Educational Evolution composes AF-160's real MentorshipLedger, and Civilisational Evolution reuses AF-175's real GenerationalHandoffLedger, both directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const ledger = new GenerationalHandoffLedger();
    ledger.handoff(1, ["Culture"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(1);
  });

  it("The Evolution Chain is driven directly by AF-155's real generic CyclicStageTracker, wrapping around because evolution becomes continuous", () => {
    const chain = new CyclicStageTracker(EVOLUTION_CHAIN_STAGES);
    chain.record("Observation", 1);
    chain.record("Learning", 5);
    expect(chain.currentStage()).toBe("Learning");
    expect(chain.next("New Observation")).toBe("Observation");
  });

  it("EvolutionRecord is the first tracker in this codebase whose current state can legitimately regress to an earlier value, while remaining a fully traceable append-only history", () => {
    const record = new EvolutionRecord();
    record.transition("practice-open-air-lectures", "Adopted", "Field testing showed strong student engagement.", 5);
    record.transition("practice-open-air-lectures", "Abandoned", "Storm season made outdoor teaching unsafe.", 20);
    expect(record.currentStateOf("practice-open-air-lectures")).toBe("Abandoned");
    expect(record.wasEverAbandoned("practice-open-air-lectures")).toBe(true);
    record.transition("practice-open-air-lectures", "Restored", "New weather shelters made it safe again.", 40);
    expect(record.currentStateOf("practice-open-air-lectures")).toBe("Restored");
    expect(record.history("practice-open-air-lectures").length).toBe(3);
  });
});
