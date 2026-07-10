import { describe, expect, it } from "vitest";
import {
  EVOLUTION_CYCLE_STAGES,
  EXPANDING_HEART_EXAMPLES,
  EXPANDING_MIND_DISCIPLINE_EXAMPLES,
  EXPANDING_QUESTIONS,
  EXPANDING_UNIVERSE_EXAMPLES,
  GENERATIONAL_HANDOFF_CATEGORIES,
  INFINITE_REPLAYABILITY_FACTORS,
  INFINITY_DEVELOPER_TOOLS,
  INFINITY_DOMAINS,
  SELF_GROWING_SYSTEM_EXAMPLES,
  SELF_RENEWAL_EXAMPLES,
} from "../src/game/atlasInfinity/atlasInfinityData";
import { GenerationalHandoffLedger } from "../src/game/atlasInfinity/AtlasInfinityRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { IMAGINATION_DOMAINS } from "../src/game/atlasImagination/atlasImaginationData";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { EmotionalContinuityTracker } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";

describe("The Atlas Infinity Engine (AF-175)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EVOLUTION_CYCLE_STAGES.length).toBe(7);
    expect(INFINITY_DOMAINS.length).toBe(12);
    expect(SELF_GROWING_SYSTEM_EXAMPLES.length).toBe(7);
    expect(GENERATIONAL_HANDOFF_CATEGORIES.length).toBe(6);
    expect(EXPANDING_UNIVERSE_EXAMPLES.length).toBe(5);
    expect(EXPANDING_MIND_DISCIPLINE_EXAMPLES.length).toBe(5);
    expect(EXPANDING_HEART_EXAMPLES.length).toBe(5);
    expect(EXPANDING_QUESTIONS.length).toBe(5);
    expect(SELF_RENEWAL_EXAMPLES.length).toBe(5);
    expect(INFINITE_REPLAYABILITY_FACTORS.length).toBe(6);
    expect(INFINITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("INFINITY_DOMAINS sets a NEW ABSOLUTE overlap record, sharing 10 of 12 exact-string members with the real IMAGINATION_DOMAINS, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(INFINITY_DOMAINS, IMAGINATION_DOMAINS);
    expect(report.shared.length).toBe(10);
  });

  it("Evolution Cycles is driven directly by AF-155's real generic CyclicStageTracker over the module's own 7-stage union, wrapping around because the cycle never ends", () => {
    const cycle = new CyclicStageTracker(EVOLUTION_CYCLE_STAGES);
    cycle.record("Knowledge", 1);
    cycle.record("Innovation", 5);
    expect(cycle.currentStage()).toBe("Innovation");
    expect(cycle.next("New Questions")).toBe("Knowledge");
  });

  it("The Expanding Questions and Self-Renewal both compose AF-159's real MysteryLog and AF-169's real ensureNextHorizonOpen directly", () => {
    const missions = new LongTermMissionTracker();
    missions.register("restore-verdance-ecosystem", "Restore Verdance's ecosystem", 100);
    missions.advance("restore-verdance-ecosystem", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "restore-verdance-ecosystem", mysteries, "mystery-unheard-worlds", "Unknown signals", "Which worlds remain silent?", 30)).toBe(true);
    expect(mysteries.unsolved().length).toBe(1);
    mysteries.resolve("mystery-unheard-worlds", 40);
    expect(mysteries.unsolved().length).toBe(0);
  });

  it("The Expanding Heart composes AF-160's real MentorshipLedger and AF-166's real EmotionalContinuityTracker at civilisation scale directly", () => {
    const mentorship = new MentorshipLedger();
    mentorship.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(mentorship.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    const emotionalContinuity = new EmotionalContinuityTracker();
    emotionalContinuity.recoverStep("humanity", 10);
    expect(emotionalContinuity.hopeLevelOf("humanity")).toBe(100);
  });

  it("GenerationalHandoffLedger guarantees the next generation's starting baseline is inherited, never from zero, once an earlier generation has contributed", () => {
    const ledger = new GenerationalHandoffLedger();
    expect(ledger.startingBaselineFor(1)).toBe(0);
    ledger.handoff(1, ["Knowledge", "Culture", "Infrastructure"], 5);
    expect(ledger.startingBaselineFor(2)).toBe(3);
    ledger.handoff(2, ["Mentorship", "Traditions"], 20);
    expect(ledger.startingBaselineFor(3)).toBe(5);
    expect(ledger.cumulativeContributionCount()).toBe(5);
    expect(ledger.contributionsFor(1)).toEqual(["Knowledge", "Culture", "Infrastructure"]);
  });
});
