import { describe, expect, it } from "vitest";
import {
  COMMANDER_EXCELLENCE_CHANNELS,
  COMMUNITY_EXCELLENCE_CHANNELS,
  CULTURAL_EXCELLENCE_VALUES,
  EDUCATIONAL_EXCELLENCE_CHANNELS,
  ENGINEERING_EXCELLENCE_VALUES,
  EXCELLENCE_CYCLE_STAGES,
  EXCELLENCE_DEVELOPER_TOOLS,
  EXCELLENCE_DOMAINS,
  EXCELLENCE_INDEX_CATEGORIES,
  EXCELLENCE_STANDARD_QUESTIONS,
  IMPROVEMENT_NETWORK_FIELDS,
  INSTITUTIONAL_EXCELLENCE_EXAMPLES,
  PERSONAL_EXCELLENCE_CHANNELS,
  PLAYER_EXCELLENCE_EXAMPLES,
  SCIENTIFIC_EXCELLENCE_VALUES,
} from "../src/game/atlasExcellence/atlasExcellenceData";
import { ExcellenceIndexScoreCard, ImprovementNetworkLedger, excellenceStandardAssessment } from "../src/game/atlasExcellence/AtlasExcellenceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { CRAFTSMANSHIP_DOMAINS, CRAFT_CYCLE_STAGES, STANDARD_OF_EXCELLENCE_QUESTIONS } from "../src/game/atlasCraftsmanship/atlasCraftsmanshipData";
import { CREATION_CYCLE_STAGES } from "../src/game/atlasCreator/atlasCreatorData";
import { ATLAS_SCORECARD_CATEGORIES } from "../src/game/atlasMetaEvolution/atlasMetaEvolutionData";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { ReputationTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { IterationCycleTracker } from "../src/game/atlasProtocol/AtlasProtocolRuntime";

describe("The Atlas Excellence Engine (AF-193)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EXCELLENCE_DOMAINS.length).toBe(12);
    expect(EXCELLENCE_CYCLE_STAGES.length).toBe(8);
    expect(PERSONAL_EXCELLENCE_CHANNELS.length).toBe(7);
    expect(COMMANDER_EXCELLENCE_CHANNELS.length).toBe(7);
    expect(SCIENTIFIC_EXCELLENCE_VALUES.length).toBe(7);
    expect(ENGINEERING_EXCELLENCE_VALUES.length).toBe(7);
    expect(EDUCATIONAL_EXCELLENCE_CHANNELS.length).toBe(7);
    expect(COMMUNITY_EXCELLENCE_CHANNELS.length).toBe(7);
    expect(CULTURAL_EXCELLENCE_VALUES.length).toBe(7);
    expect(INSTITUTIONAL_EXCELLENCE_EXAMPLES.length).toBe(6);
    expect(PLAYER_EXCELLENCE_EXAMPLES.length).toBe(6);
    expect(EXCELLENCE_STANDARD_QUESTIONS.length).toBe(5);
    expect(IMPROVEMENT_NETWORK_FIELDS.length).toBe(6);
    expect(EXCELLENCE_INDEX_CATEGORIES.length).toBe(8);
    expect(EXCELLENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("Excellence Domains shares 9 of 12 with the real CREATIVE_DOMAINS and 8 of 12 with the real CRAFTSMANSHIP_DOMAINS, no record claimed", () => {
    expect(detectOverlap(EXCELLENCE_DOMAINS, CREATIVE_DOMAINS).shared.length).toBe(9);
    expect(detectOverlap(EXCELLENCE_DOMAINS, CRAFTSMANSHIP_DOMAINS).shared.length).toBe(8);
  });

  it("The Excellence Cycle shares ZERO exact-string stages with either sibling process ladder (AF-191's CREATION_CYCLE_STAGES or AF-192's CRAFT_CYCLE_STAGES), despite being the third such ladder authored back to back", () => {
    expect(detectOverlap(EXCELLENCE_CYCLE_STAGES, CREATION_CYCLE_STAGES).shared.length).toBe(0);
    expect(detectOverlap(EXCELLENCE_CYCLE_STAGES, CRAFT_CYCLE_STAGES).shared.length).toBe(0);
  });

  it("The Excellence Standard shares zero exact-string questions with AF-192's real STANDARD_OF_EXCELLENCE_QUESTIONS, and The Excellence Index shares only 1 of 8 with AF-190's real ATLAS_SCORECARD_CATEGORIES", () => {
    expect(detectOverlap(EXCELLENCE_STANDARD_QUESTIONS, STANDARD_OF_EXCELLENCE_QUESTIONS).shared.length).toBe(0);
    expect(detectOverlap(EXCELLENCE_INDEX_CATEGORIES, ATLAS_SCORECARD_CATEGORIES).shared.length).toBe(1);
  });

  it("The Excellence Cycle reuses AF-155's real generic CyclicStageTracker directly, an explicit closed loop unlike AF-192's non-cyclic Craft Cycle", () => {
    const cycle = new CyclicStageTracker<(typeof EXCELLENCE_CYCLE_STAGES)[number]>(EXCELLENCE_CYCLE_STAGES);
    cycle.record("Learn", 1);
    expect(cycle.currentStage()).toBe("Learn");
    expect(cycle.next("Inspire")).toBe("Learn");
  });

  it("Personal Excellence's Mentorship channel reuses AF-160's real MentorshipLedger directly, Commander Excellence reuses AF-166's real ReputationTracker directly, and Cultural Excellence composes AF-159's real CulturalTrendTracker directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("scientist-vale", "student-of-verdance", 20);
    expect(mentorship.menteesOf("scientist-vale")).toEqual(["student-of-verdance"]);
    const reputation = new ReputationTracker();
    reputation.recognizeFor("commander-thorne-starforged", "Strategic thinking", 20);
    expect(reputation.mostRecognizedQuality("commander-thorne-starforged")).toBe("Strategic thinking");
    const culturalTrends = new CulturalTrendTracker();
    culturalTrends.record("Verdance Stewardship Ethic", "settlement-verdance", 20);
    expect(culturalTrends.adoptersFor("Verdance Stewardship Ethic")).toEqual(["settlement-verdance"]);
  });

  it("Institutional Excellence reuses AF-149's real IterationCycleTracker directly — regularly evaluating and improving service", () => {
    const iterations = new IterationCycleTracker();
    expect(iterations.readyToShip("institution-living-city-academy")).toBe(false);
    iterations.recordCycle("institution-living-city-academy", 1);
    iterations.recordCycle("institution-living-city-academy", 2);
    expect(iterations.readyToShip("institution-living-city-academy")).toBe(true);
  });

  it("excellenceStandardAssessment mirrors AF-192's real standardOfExcellenceAssessment shape a second time, triggering continued refinement on any single affirmed question", () => {
    expect(excellenceStandardAssessment(new Set()).shouldContinueRefining).toBe(false);
    const result = excellenceStandardAssessment(new Set(["Can it endure?", "Can it teach?"]));
    expect(result.shouldContinueRefining).toBe(true);
    expect(result.affirmedCount).toBe(2);
  });

  it("ImprovementNetworkLedger is append-only and confirmed genuinely new in domain", () => {
    const improvements = new ImprovementNetworkLedger();
    improvements.record("improvement-verdance-lecture-hall", { reason: "Attendance outgrew capacity.", method: "Expanded seating and added remote broadcast.", evidence: "Post-expansion attendance logs.", outcome: "Doubled attendance.", educationalValue: "More students reached.", futureOpportunities: "Extend broadcast to neighbouring settlements." }, 20);
    expect(improvements.historyFor("improvement-verdance-lecture-hall").length).toBe(1);
    expect(improvements.historyFor("improvement-verdance-lecture-hall")[0]?.outcome).toBe("Doubled attendance.");
  });

  it("ExcellenceIndexScoreCard mirrors AF-143/149/170/173/179/180/182/184/188/190's real scoring-rubric shape, the eleventh such rubric, requiring every category before passing the shared 9.5 gate", () => {
    const card = new ExcellenceIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const category of EXCELLENCE_INDEX_CATEGORIES) card.score(category, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
