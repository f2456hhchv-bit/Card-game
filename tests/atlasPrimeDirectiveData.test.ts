import { describe, expect, it } from "vitest";
import {
  CONFLICT_RESOLUTION_PRIORITIES,
  DESIGN_ARBITER_CRITERIA,
  DEVELOPER_PROMISE,
  FINAL_TEST_QUESTIONS,
  FUTURE_COMPATIBILITY_TARGETS,
  PLAYER_PROMISE,
  PRIME_DIRECTIVES,
  QUALITY_LOCK_CRITERIA,
  REDUNDANCY_DETECTOR_TARGETS,
  SYSTEM_PRIORITY_LADDER,
  finalTestPassed,
  futureCompatibilityValidated,
  qualityLockPassed,
  resolveConflictPriority,
  resolvePrimeDirectivePriority,
  systemPriorityRank,
} from "../src/game/atlasPrimeDirective/atlasPrimeDirectiveData";
import { detectOverlap, PrimeDirectiveScoreCard } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { PURPOSE_DOMAINS } from "../src/game/atlasPurpose/atlasPurposeData";
import { PHILOSOPHICAL_DOMAINS } from "../src/game/atlasPhilosophy/atlasPhilosophyData";
import { LEGACY_DOMAINS } from "../src/game/atlasLegacyOfTomorrow/atlasLegacyOfTomorrowData";

describe("The Atlas Prime Directive (AF-170)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(PRIME_DIRECTIVES.length).toBe(10);
    expect(DESIGN_ARBITER_CRITERIA.length).toBe(10);
    expect(CONFLICT_RESOLUTION_PRIORITIES.length).toBe(8);
    expect(SYSTEM_PRIORITY_LADDER.length).toBe(6);
    expect(FUTURE_COMPATIBILITY_TARGETS.length).toBe(10);
    expect(QUALITY_LOCK_CRITERIA.length).toBe(7);
    expect(FINAL_TEST_QUESTIONS.length).toBe(5);
    expect(REDUNDANCY_DETECTOR_TARGETS.length).toBe(6);
    expect(PLAYER_PROMISE.length).toBe(5);
    expect(DEVELOPER_PROMISE.length).toBe(5);
  });

  it("resolvePrimeDirectivePriority always yields the highest-numbered directive present — order IS authority", () => {
    expect(resolvePrimeDirectivePriority(new Set(["Protect Wonder", "Protect Hope", "Protect Tomorrow"]))).toBe("Protect Hope");
    expect(resolvePrimeDirectivePriority(new Set())).toBeNull();
  });

  it("resolveConflictPriority is a second, separate priority order from the Prime Directives themselves", () => {
    expect(resolveConflictPriority(new Set(["Performance", "Player agency", "Legacy"]))).toBe("Player agency");
  });

  it("systemPriorityRank orders the in-fiction AF-XXX governance ladder only, never claiming authority over the real Constitution", () => {
    expect(systemPriorityRank("Atlas Prime Directive")).toBe(0);
    expect(systemPriorityRank("Gameplay Systems")).toBe(5);
  });

  it("futureCompatibilityValidated, qualityLockPassed and finalTestPassed are three more all-must-pass checklist gates", () => {
    expect(futureCompatibilityValidated(new Set(FUTURE_COMPATIBILITY_TARGETS.slice(0, 9)))).toBe(false);
    expect(futureCompatibilityValidated(new Set(FUTURE_COMPATIBILITY_TARGETS))).toBe(true);
    expect(qualityLockPassed(new Set(QUALITY_LOCK_CRITERIA.slice(0, 6)))).toBe(false);
    expect(qualityLockPassed(new Set(QUALITY_LOCK_CRITERIA))).toBe(true);
    expect(finalTestPassed(new Set(FINAL_TEST_QUESTIONS.slice(0, 4)))).toBe(false);
    expect(finalTestPassed(new Set(FINAL_TEST_QUESTIONS))).toBe(true);
  });

  it("PrimeDirectiveScoreCard mirrors AF-143/149's real DesignScoreCard/AtlasScoreCard shape, gated at 9.5", () => {
    const card = new PrimeDirectiveScoreCard();
    for (const criterion of DESIGN_ARBITER_CRITERIA) card.score(criterion, 9.5);
    expect(card.isComplete()).toBe(true);
    expect(card.overallScore()).toBeCloseTo(9.5, 5);
    expect(card.passesGate()).toBe(true);
    card.score("Performance", 5);
    expect(card.passesGate()).toBe(false);
  });

  it("detectOverlap formalises this session's own manual overlap-checking discipline into a real function, reproducing two previously hand-computed overlap facts", () => {
    const purposeVsPhilosophical = detectOverlap(PURPOSE_DOMAINS, PHILOSOPHICAL_DOMAINS);
    expect(purposeVsPhilosophical.shared.length).toBe(8);
    expect(purposeVsPhilosophical.ratio).toBeCloseTo(8 / 12, 5);

    const legacyVsPurpose = detectOverlap(LEGACY_DOMAINS, PURPOSE_DOMAINS);
    expect(legacyVsPurpose.shared.length).toBe(8);
  });

  it("detectOverlap returns an empty report for disjoint lists", () => {
    const report = detectOverlap(["Alpha", "Beta"], ["Gamma", "Delta"]);
    expect(report.shared).toEqual([]);
    expect(report.ratio).toBe(0);
  });
});
