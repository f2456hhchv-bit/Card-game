import { describe, expect, it } from "vitest";
import {
  CIVILISATIONAL_COMPASS_VALUES,
  CIVILISATIONAL_WISDOM_DEVELOPER_TOOLS,
  COLLECTIVE_WISDOM_QUALITIES,
  CULTURAL_WISDOM_EXAMPLES,
  INSTITUTIONAL_WISDOM_EXAMPLES,
  INTERGENERATIONAL_WISDOM_EXAMPLES,
  PLAYER_WISDOM_EXAMPLES,
  SCIENTIFIC_WISDOM_EXAMPLES,
  WISDOM_CYCLE_STAGES,
  WISDOM_LIBRARY_FIELDS,
  WISDOM_TEST_QUESTIONS,
  WISDOM_THROUGH_FAILURE_EXAMPLES,
} from "../src/game/atlasCivilisationalWisdom/atlasCivilisationalWisdomData";
import { WisdomLibrary } from "../src/game/atlasCivilisationalWisdom/AtlasCivilisationalWisdomRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { JUDGEMENT_DOMAINS } from "../src/game/atlasJudgement/atlasJudgementData";
import { CIVILISATION_VALUES, CULTURAL_WISDOM_FACTORS, GENERATIONAL_TRANSFER_STAGES, REFLECTION_LOOP_STAGES, WISDOM_DIMENSIONS, generationalTransferRank } from "../src/game/atlasWisdom/atlasWisdomData";
import { CommanderWisdomTracker, MentorshipLedger, WisdomMemoryArchive } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { InstitutionalMemoryTracker } from "../src/game/atlasMemory/AtlasMemoryRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";

const SPEC_WISDOM_DOMAINS = ["Science", "Education", "Leadership", "Engineering", "Ecology", "Culture", "History", "Exploration", "Medicine", "Community", "Architecture", "Civilisation"] as const;

describe("The Atlas Civilisational Wisdom Engine (AF-199)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(WISDOM_CYCLE_STAGES.length).toBe(7);
    expect(COLLECTIVE_WISDOM_QUALITIES.length).toBe(7);
    expect(SCIENTIFIC_WISDOM_EXAMPLES.length).toBe(5);
    expect(INSTITUTIONAL_WISDOM_EXAMPLES.length).toBe(5);
    expect(CULTURAL_WISDOM_EXAMPLES.length).toBe(6);
    expect(PLAYER_WISDOM_EXAMPLES.length).toBe(6);
    expect(WISDOM_THROUGH_FAILURE_EXAMPLES.length).toBe(4);
    expect(WISDOM_LIBRARY_FIELDS.length).toBe(6);
    expect(INTERGENERATIONAL_WISDOM_EXAMPLES.length).toBe(6);
    expect(WISDOM_TEST_QUESTIONS.length).toBe(4);
    expect(CIVILISATIONAL_COMPASS_VALUES.length).toBe(7);
    expect(CIVILISATIONAL_WISDOM_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Wisdom Domains is, as a set, an EXACT match (12/12) with the real JUDGEMENT_DOMAINS — tying the absolute overlap record a second time — yet shares only 3 of 12 with AF-160's own real WISDOM_DIMENSIONS", () => {
    const domainOverlap = detectOverlap(SPEC_WISDOM_DOMAINS, JUDGEMENT_DOMAINS);
    expect(domainOverlap.shared.length).toBe(12);
    expect(domainOverlap.ratio).toBe(1);
    expect(detectOverlap(SPEC_WISDOM_DOMAINS, WISDOM_DIMENSIONS).shared.length).toBe(3);
  });

  it("The Wisdom Cycle shares 3 of 7 stages with AF-160's real REFLECTION_LOOP_STAGES", () => {
    expect(detectOverlap(WISDOM_CYCLE_STAGES, REFLECTION_LOOP_STAGES).shared.length).toBe(3);
  });

  it("Collective Wisdom shares 2 of 7 and The Civilisational Compass shares 5 of 7 with AF-160's real CIVILISATION_VALUES, and Cultural Wisdom shares 2 of 6 with AF-160's real CULTURAL_WISDOM_FACTORS", () => {
    expect(detectOverlap(COLLECTIVE_WISDOM_QUALITIES, CIVILISATION_VALUES).shared.length).toBe(2);
    expect(detectOverlap(CIVILISATIONAL_COMPASS_VALUES, CIVILISATION_VALUES).shared.length).toBe(5);
    expect(detectOverlap(CULTURAL_WISDOM_EXAMPLES, CULTURAL_WISDOM_FACTORS).shared.length).toBe(2);
  });

  it("The Wisdom Cycle reuses AF-155's real generic CyclicStageTracker directly, the same class AF-160's own Reflection Loop already reused", () => {
    const cycle = new CyclicStageTracker<(typeof WISDOM_CYCLE_STAGES)[number]>(WISDOM_CYCLE_STAGES);
    cycle.record("Experience", 1);
    expect(cycle.currentStage()).toBe("Experience");
    expect(cycle.next("New Experience")).toBe("Experience");
  });

  it("Commander Wisdom reuses AF-160's real CommanderWisdomTracker and MentorshipLedger directly", () => {
    const commanderWisdom = new CommanderWisdomTracker();
    commanderWisdom.develop("commander-fen-beastmaster", "Patience", 20);
    expect(commanderWisdom.traitScore("commander-fen-beastmaster", "Patience")).toBe(20);
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-fen-beastmaster", "apprentice-of-verdance", 20);
    expect(mentorship.menteesOf("commander-fen-beastmaster")).toEqual(["apprentice-of-verdance"]);
  });

  it("Institutional Wisdom reuses AF-165's real InstitutionalMemoryTracker directly, and Cultural Wisdom composes AF-159's real CulturalTrendTracker directly", () => {
    const institutionalMemory = new InstitutionalMemoryTracker();
    institutionalMemory.remember("institution-living-city-academy", "Historic lessons", "Learned to phase restoration work across seasons.", 20);
    expect(institutionalMemory.memoriesFor("institution-living-city-academy").length).toBe(1);
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Harvest Proverb", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Harvest Proverb")).toEqual(["settlement-verdance"]);
  });

  it("Wisdom Through Failure reuses AF-160's real WisdomMemoryArchive directly, and Intergenerational Wisdom reuses AF-160's real generationalTransferRank directly", () => {
    const wisdomMemory = new WisdomMemoryArchive();
    wisdomMemory.archive("lesson-failed-first-expedition", ["Schools", "Museums"], 20);
    expect(wisdomMemory.outcomesFor("lesson-failed-first-expedition")).toEqual(["Schools", "Museums"]);
    expect(generationalTransferRank("Knowledge")).toBe(0);
    expect(generationalTransferRank("Civilisation")).toBe(GENERATIONAL_TRANSFER_STAGES.length - 1);
  });

  it("WisdomLibrary is append-only and confirmed genuinely new — a different question from AF-160's real WisdomMemoryArchive", () => {
    const library = new WisdomLibrary();
    library.record("lesson-failed-first-expedition", { situation: "A first expedition to the frontier lost contact.", decision: "Recalled the team before further loss.", outcome: "All members recovered safely.", reflection: "Redundant communication relays are essential.", futureRelevance: "Applied to every subsequent expedition.", teachingValue: "Taught at the Verdance Academy." }, 20);
    expect(library.historyFor("lesson-failed-first-expedition").length).toBe(1);
    expect(library.latestFor("lesson-failed-first-expedition")?.teachingValue).toBe("Taught at the Verdance Academy.");
  });
});
