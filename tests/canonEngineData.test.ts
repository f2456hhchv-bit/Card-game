import { describe, expect, it } from "vitest";
import {
  CANON_ACCESSIBILITY_SURFACES,
  CANON_PYRAMID_LEVELS,
  CANON_TOOLS,
  FUTURE_DISCOVERY_KINDS,
  LORE_VALIDATION_CHECK_KINDS,
  PLANET_CONTINUITY_FIELDS,
  canonPyramidRank,
  expansionRespectsTimeline,
  loreValidationReport,
  type LoreValidationSignals,
} from "../src/game/canonEngine/canonEngineData";
import { ArtifactAuthenticityRegistry, CanonEventLedger, CommanderContinuityLedger, KnowledgeStateTracker, recordPlanetContinuityFact } from "../src/game/canonEngine/CanonEngineRuntime";
import { PlanetaryChronicle } from "../src/game/chronicle/ChronicleRuntime";
import { GalacticHistoryLog } from "../src/game/legacy/LegacyEngineRuntime";

function fullSignals(overrides: Partial<LoreValidationSignals> = {}): LoreValidationSignals {
  return {
    timelineConflictFree: true,
    characterConsistent: true,
    planetHistoryRespected: true,
    commanderRelationshipsRespected: true,
    scientificallyPlausible: true,
    historicalReferencesValid: true,
    museumIntegrated: true,
    chronicleCompatible: true,
    expansionDependenciesResolved: true,
    ...overrides,
  };
}

describe("The Atlas Canon Engine (AF-148)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CANON_PYRAMID_LEVELS.length).toBe(6);
    expect(LORE_VALIDATION_CHECK_KINDS.length).toBe(9);
    expect(PLANET_CONTINUITY_FIELDS.length).toBe(10);
    expect(FUTURE_DISCOVERY_KINDS.length).toBe(5);
    expect(CANON_TOOLS.length).toBe(7);
    expect(CANON_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("canonPyramidRank ranks Core Timeline highest and Legends & Folklore lowest, a separate axis from AF-147's real CanonTier", () => {
    expect(canonPyramidRank("Core Timeline")).toBe(0);
    expect(canonPyramidRank("Legends & Folklore")).toBe(CANON_PYRAMID_LEVELS.length - 1);
  });

  it("loreValidationReport requires every one of the 9 checks", () => {
    expect(loreValidationReport(fullSignals({ scientificallyPlausible: false })).passed).toBe(false);
    expect(loreValidationReport(fullSignals()).passed).toBe(true);
  });

  it("expansionRespectsTimeline requires zero of the 5 forbidden invalidations, confirmed genuinely new territory", () => {
    expect(expansionRespectsTimeline({ erasesHistory: true, invalidatesAchievements: false, removesCommanderGrowth: false, breaksRelationships: false, undoesProgress: false })).toBe(false);
    expect(expansionRespectsTimeline({ erasesHistory: false, invalidatesAchievements: false, removesCommanderGrowth: false, breaksRelationships: false, undoesProgress: false })).toBe(true);
  });

  it("CanonEventLedger stores a genuinely richer event shape than AF-133's real OfficialHistoricalRecord and can optionally forward a summary into it", () => {
    const forward = new GalacticHistoryLog();
    const ledger = new CanonEventLedger(forward);
    ledger.record(
      { id: "event-first-contact", date: 12, participants: ["prime-founder"], planetId: "settlement-lucent-gate", galaxyRegion: "core", commanderIds: ["prime-founder"], witnesses: ["colonist-anya"], evidence: ["recovered-beacon-log"], museumReferences: [], chronicleReferences: [], relationshipImpact: null, futureCallbacks: [] },
      { title: "First Contact", epoch: 12, planetId: "settlement-lucent-gate", commanderIds: ["prime-founder"], description: "Humanity's first confirmed contact.", hasPhoto: false, hasDialogue: false, hasNewsCoverage: true, hasMuseumEntry: false },
    );
    expect(ledger.eventFor("event-first-contact")?.witnesses).toEqual(["colonist-anya"]);
    expect(forward.all().length).toBe(1);
  });

  it("KnowledgeStateTracker enforces Objective Reality as immutable (Canon Pyramid Level One) while Historical Understanding expands via AF-135's real EvolvingEntry and Public Knowledge stays freely mutable", () => {
    const tracker = new KnowledgeStateTracker();
    tracker.setObjectiveReality("event-first-contact", "The beacon was ancient precursor technology.");
    expect(() => tracker.setObjectiveReality("event-first-contact", "It was actually a hoax.")).toThrow();
    tracker.setObjectiveReality("event-first-contact", "The beacon was ancient precursor technology.");

    tracker.revealHistoricalUnderstanding("event-first-contact", "Scholars believe it predates recorded history.", 5, "Scientists");
    tracker.revealHistoricalUnderstanding("event-first-contact", "New analysis suggests a much older origin.", 40, "Scientists");
    expect(tracker.historicalUnderstandingFor("event-first-contact")).toContain("much older");

    tracker.setPublicKnowledge("event-first-contact", "People say it's an alien artifact.");
    expect(tracker.hasDiverged("event-first-contact")).toBe(true);
  });

  it("CommanderContinuityLedger is append-only and materially richer than AF-135's thin numeric commanderHistoryFor aggregate", () => {
    const ledger = new CommanderContinuityLedger();
    ledger.recordFact("prime-founder", "Born aboard the Wayfarer during the Collapse Era.", 0);
    ledger.recordFact("prime-founder", "Retired from active command after the Reconstruction.", 60);
    expect(ledger.factsFor("prime-founder").length).toBe(2);
    expect(ledger.all().length).toBe(2);
  });

  it("ArtifactAuthenticityRegistry tracks provenance/confidence confirmed absent from AF-134's real GiftLedger/RestorationLab", () => {
    const registry = new ArtifactAuthenticityRegistry();
    registry.register({ artifactId: "artifact-beacon-fragment", provenance: "Recovered from the Lucent Gate ruins.", ownershipChain: ["First Expedition"], restorationHistory: ["Initial cleaning"], scientificAnalysis: "Pre-Collapse alloy signature.", museumLocation: "Lucent Gate Wing", authenticityConfidence: 40, publicInterpretation: "Believed to be precursor technology." });
    registry.updateConfidence("artifact-beacon-fragment", 85);
    expect(registry.recordFor("artifact-beacon-fragment")?.authenticityConfidence).toBe(85);
    expect(registry.all().length).toBe(1);
  });

  it("recordPlanetContinuityFact composes AF-135's real PlanetaryChronicle directly rather than a parallel store", () => {
    const chronicle = new PlanetaryChronicle();
    recordPlanetContinuityFact(chronicle, "settlement-lucent-gate", "Wars", "The Mining Uprising lasted three years.", 8, "Military historians");
    const entry = chronicle.entryFor("settlement-lucent-gate");
    expect(entry.latest()?.text).toContain("Mining Uprising");
    expect(entry.latest()?.text).toContain("[Wars]");
  });
});
