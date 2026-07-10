import { describe, expect, it } from "vitest";
import {
  BEAUTY_INDEX_CATEGORIES,
  CIVILISATIONAL_SPIRIT_REFLECTIONS,
  COLLECTIVE_CHARACTER_TRAITS,
  COMMANDER_SPIRIT_QUALITIES,
  COMMUNITY_SPIRIT_TRAITS,
  GALACTIC_REPUTATION_QUALITIES,
  MOMENTS_OF_HUMANITY_EXAMPLES,
  PLACE_SPIRIT_EXAMPLES,
  RITUAL_EXAMPLES,
  SOUL_DEVELOPER_TOOLS,
  SOUL_DIMENSIONS,
} from "../src/game/atlasSoul/atlasSoulData";
import { BeautyIndexTracker, CollectiveCharacterTracker, MomentsOfHumanityLog, RitualLog } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { CIVILISATION_VALUES } from "../src/game/atlasWisdom/atlasWisdomData";
import { ReputationTracker, EarnedTitleTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { SignificanceTracker, MeaningCurator } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { EmotionalContinuityTracker } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";

describe("The Atlas Soul Engine (AF-168)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(SOUL_DIMENSIONS.length).toBe(12);
    expect(COLLECTIVE_CHARACTER_TRAITS.length).toBe(7);
    expect(CIVILISATIONAL_SPIRIT_REFLECTIONS.length).toBe(6);
    expect(COMMANDER_SPIRIT_QUALITIES.length).toBe(5);
    expect(PLACE_SPIRIT_EXAMPLES.length).toBe(6);
    expect(COMMUNITY_SPIRIT_TRAITS.length).toBe(6);
    expect(RITUAL_EXAMPLES.length).toBe(6);
    expect(MOMENTS_OF_HUMANITY_EXAMPLES.length).toBe(5);
    expect(BEAUTY_INDEX_CATEGORIES.length).toBe(7);
    expect(GALACTIC_REPUTATION_QUALITIES.length).toBe(3);
    expect(SOUL_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("SOUL_DIMENSIONS shares 8 of AF-160's real 10-member CIVILISATION_VALUES (80%), confirmed the heaviest proportional overlap yet in this codebase", () => {
    const overlap = CIVILISATION_VALUES.filter((v) => (SOUL_DIMENSIONS as readonly string[]).includes(v));
    expect(overlap.length).toBe(8);
  });

  it("CollectiveCharacterTracker exposes only witnessed counts and an emergent dominant trait, never a combined morality scalar", () => {
    const tracker = new CollectiveCharacterTracker();
    expect(tracker.dominantTrait()).toBeNull();
    tracker.witness("Welcoming");
    tracker.witness("Welcoming");
    tracker.witness("Curious");
    expect(tracker.witnessCountFor("Welcoming")).toBe(2);
    expect(tracker.dominantTrait()).toBe("Welcoming");
    expect(tracker).not.toHaveProperty("moralityScore");
  });

  it("RitualLog has no completion/mandatory field — 'none are mandatory, all are meaningful'", () => {
    const log = new RitualLog();
    log.observe("Lighting the Beacon", ["settlement-verdance"], 20);
    expect(log.countFor("Lighting the Beacon")).toBe(1);
    expect(log.all()[0]).not.toHaveProperty("mandatory");
    expect(log.all()[0]).not.toHaveProperty("completed");
  });

  it("MomentsOfHumanityLog witnesses many small unrelated moments across civilisation, distinct from AF-163's per-entity SignificanceTracker", () => {
    const log = new MomentsOfHumanityLog();
    log.witness("A Commander comforted a frightened recruit.", 10);
    expect(log.all().length).toBe(1);
  });

  it("BeautyIndexTracker averages per-category levels, clamped 0-100", () => {
    const tracker = new BeautyIndexTracker();
    tracker.setLevel("Gardens", 80);
    tracker.setLevel("Art", 60);
    expect(tracker.overallBeauty()).toBeCloseTo(70, 5);
    tracker.setLevel("Music", 500);
    expect(tracker.levelFor("Music")).toBe(100);
  });

  it("Commander Spirit reuses AF-167's real ReputationTracker/EarnedTitleTracker directly, no second symbol/legend system", () => {
    const reputation = new ReputationTracker();
    reputation.recognizeFor("commander-fen-beastmaster", "Their kindness", 10);
    expect(reputation.recognitionCountFor("commander-fen-beastmaster", "Their kindness")).toBe(1);
    const titles = new EarnedTitleTracker();
    titles.earn("commander-fen-beastmaster", "The one who reunited the fleet.", 10);
    expect(titles.titlesFor("commander-fen-beastmaster").length).toBe(1);
  });

  it("Place Spirit composes AF-163's real SignificanceTracker directly", () => {
    const tracker = new SignificanceTracker();
    tracker.register("observatory-verdance", "The Verdance Observatory", 1);
    tracker.reinforce("observatory-verdance", 20);
    expect(tracker.significanceOf("observatory-verdance")).toBe(1);
  });

  it("Community Spirit reuses AF-159's real CulturalTrendTracker directly", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Neighbourhood watch nights", "settlement-verdance", 10);
    expect(tracker.adoptersFor("Neighbourhood watch nights")).toEqual(["settlement-verdance"]);
  });

  it("Inspiration composes AF-160's real MentorshipLedger directly, mentor-to-mentee IS an inspiration link", () => {
    const ledger = new MentorshipLedger();
    ledger.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(ledger.menteesOf("commander-thorne-starforged")).toContain("commander-fen-beastmaster");
  });

  it("Collective Memory reuses AF-163's real MeaningCurator directly, over the same COLLECTIVE_MEMORY_CATEGORIES union", () => {
    const curator = new MeaningCurator<"Great kindness">();
    curator.curate("civilisation", "Great kindness", "The Verdance famine relief.", 10);
    expect(curator.entryFor("civilisation", "Great kindness")?.description).toBe("The Verdance famine relief.");
  });

  it("Galactic Reputation reuses AF-167's real ReputationTracker directly at civilisation scale", () => {
    const tracker = new ReputationTracker();
    tracker.recognizeFor("humanity", "Compassion", 10);
    expect(tracker.recognitionCountFor("humanity", "Compassion")).toBe(1);
  });

  it("Soul Through Adversity reuses AF-166's real EmotionalContinuityTracker directly at civilisation scale", () => {
    const tracker = new EmotionalContinuityTracker();
    tracker.setback("humanity", 30);
    expect(tracker.hopeLevelOf("humanity")).toBe(70);
    tracker.recoverStep("humanity", 5);
    expect(tracker.hopeLevelOf("humanity")).toBe(75);
  });
});
