import { describe, expect, it } from "vitest";
import {
  CIVILISATIONAL_SHIFT_STAGES,
  civilisationalShiftRank,
  COMMANDER_TRANSCENDENCE_EXAMPLES,
  GARDEN_PRINCIPLE_VERBS,
  GIFT_PRINCIPLE_QUESTIONS,
  giftPrincipleSatisfied,
  LIBRARY_CATEGORIES,
  QUIET_VICTORY_EXAMPLES,
  STEWARDSHIP_LOOP_STAGES,
  TRANSCENDENCE_DEVELOPER_TOOLS,
  TRANSCENDENCE_DOMAINS,
  TRANSCENDENCE_INDEX_CRITERIA,
  TRANSCENDENT_CITY_EXAMPLES,
  TRANSCENDENT_GALAXY_EXAMPLES,
  TRANSCENDENT_INSTITUTIONS,
  TRANSCENDENT_PLANET_EXAMPLES,
} from "../src/game/atlasTranscendence/atlasTranscendenceData";
import { TranscendenceIndexScoreCard, UniversalLibrary } from "../src/game/atlasTranscendence/AtlasTranscendenceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { ASCENSION_INDEX_CRITERIA, ASCENSION_PILLARS, ASCENSION_TIERS, INSTITUTION_EVOLUTION_EXAMPLES, PLANETARY_ASCENSION_EXAMPLES } from "../src/game/atlasAscension/atlasAscensionData";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { QuietMomentLog } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { EarnedTitleTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { BeautyIndexTracker } from "../src/game/atlasSoul/AtlasSoulRuntime";

describe("The Atlas Transcendence Engine (AF-180)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(TRANSCENDENCE_DOMAINS.length).toBe(12);
    expect(CIVILISATIONAL_SHIFT_STAGES.length).toBe(8);
    expect(TRANSCENDENT_INSTITUTIONS.length).toBe(5);
    expect(COMMANDER_TRANSCENDENCE_EXAMPLES.length).toBe(6);
    expect(TRANSCENDENT_CITY_EXAMPLES.length).toBe(8);
    expect(TRANSCENDENT_PLANET_EXAMPLES.length).toBe(5);
    expect(TRANSCENDENT_GALAXY_EXAMPLES.length).toBe(6);
    expect(GIFT_PRINCIPLE_QUESTIONS.length).toBe(3);
    expect(STEWARDSHIP_LOOP_STAGES.length).toBe(6);
    expect(LIBRARY_CATEGORIES.length).toBe(6);
    expect(GARDEN_PRINCIPLE_VERBS.length).toBe(5);
    expect(TRANSCENDENCE_INDEX_CRITERIA.length).toBe(9);
    expect(QUIET_VICTORY_EXAMPLES.length).toBe(6);
    expect(TRANSCENDENCE_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("documents overlaps honestly against AF-179's real lists, verified via AF-170's real detectOverlap, without claiming a new record", () => {
    expect(detectOverlap(TRANSCENDENCE_DOMAINS, ASCENSION_PILLARS).shared.length).toBe(8);
    expect(detectOverlap(CIVILISATIONAL_SHIFT_STAGES, ASCENSION_TIERS.map((t) => t.name)).shared.length).toBe(3);
    expect(detectOverlap(TRANSCENDENT_INSTITUTIONS.map((t) => t[0]), INSTITUTION_EVOLUTION_EXAMPLES.map((t) => t[0])).shared.length).toBe(4);
    expect(detectOverlap(TRANSCENDENT_PLANET_EXAMPLES, PLANETARY_ASCENSION_EXAMPLES).shared.length).toBe(1);
    expect(detectOverlap(TRANSCENDENCE_INDEX_CRITERIA, ASCENSION_INDEX_CRITERIA).shared.length).toBe(3);
  });

  it("The Civilisational Shift mirrors the codebase's established rank-function pattern for non-cyclic ladders, distinct from AF-179's own ascensionTierRank type", () => {
    expect(civilisationalShiftRank("Survival")).toBe(0);
    expect(civilisationalShiftRank("Transcendence")).toBe(7);
  });

  it("The Stewardship Loop is driven directly by AF-155's real generic CyclicStageTracker, wrapping around because the cycle never ends", () => {
    const loop = new CyclicStageTracker(STEWARDSHIP_LOOP_STAGES);
    loop.record("Discover", 1);
    loop.record("Understand", 5);
    expect(loop.currentStage()).toBe("Understand");
    expect(loop.next("Discover Again")).toBe("Discover");
  });

  it("The Gift Principle mirrors AF-170's real finalTestPassed/AF-179's real ascensionTestPassed all-must-pass checklist pattern", () => {
    const partial = new Set<(typeof GIFT_PRINCIPLE_QUESTIONS)[number]>(["Who benefits?"]);
    expect(giftPrincipleSatisfied(partial)).toBe(false);
    expect(giftPrincipleSatisfied(new Set(GIFT_PRINCIPLE_QUESTIONS))).toBe(true);
  });

  it("The Quiet Victory reuses AF-163's real QuietMomentLog directly", () => {
    const quietMoments = new QuietMomentLog();
    quietMoments.record("A restored river now runs clean through Verdance.", 20);
    expect(quietMoments.all().length).toBe(1);
  });

  it("Commander Transcendence composes AF-160's real MentorshipLedger and AF-167's real EarnedTitleTracker directly, and The Transcendent City composes AF-168's real BeautyIndexTracker directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const earnedTitles = new EarnedTitleTracker();
    earnedTitles.earn("commander-thorne-starforged", "Guardian of the Galaxy", 5);
    expect(earnedTitles.titlesFor("commander-thorne-starforged").map((t) => t.title)).toContain("Guardian of the Galaxy");
    const beauty = new BeautyIndexTracker();
    beauty.setLevel("Public spaces", 90);
    expect(beauty.levelFor("Public spaces")).toBe(90);
  });

  it("UniversalLibrary has no removal method, and a second preserve call for an already-preserved id never overwrites the original category", () => {
    const library = new UniversalLibrary();
    library.preserve("language-verdance-old-tongue", "Language", 5);
    library.preserve("language-verdance-old-tongue", "Memory", 50);
    expect(library.categoryOf("language-verdance-old-tongue")).toBe("Language");
    expect(library.isPreserved("language-verdance-old-tongue")).toBe(true);
    expect(library.countForCategory("Language")).toBe(1);
    expect((library as unknown as Record<string, unknown>).remove).toBeUndefined();
    expect((library as unknown as Record<string, unknown>).forget).toBeUndefined();
  });

  it("TranscendenceIndexScoreCard mirrors AF-143/149/170/173/179's real scoring-rubric shape, the sixth such rubric, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new TranscendenceIndexScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const criterion of TRANSCENDENCE_INDEX_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(true);
  });
});
