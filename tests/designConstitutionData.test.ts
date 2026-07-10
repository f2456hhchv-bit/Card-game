import { describe, expect, it } from "vitest";
import {
  ARTISTIC_PRINCIPLES,
  AUDIO_PRINCIPLES,
  CONTENT_TEST_PASS_THRESHOLD,
  CONTENT_TEST_QUESTIONS,
  DEVELOPER_PROMISE,
  EXPANSION_TEST_REQUIREMENTS,
  FINAL_PROMISE_QUESTION,
  FINAL_PROMISE_REJECTED_QUESTION,
  NARRATIVE_PRINCIPLES,
  PILLAR_DESCRIPTIONS,
  PLAYER_PROMISE,
  PROHIBITED_DESIGN_PATTERNS,
  REQUIRED_DESIGN_PATTERNS,
  TECHNICAL_PRINCIPLES,
  TEN_PILLARS,
  contentTestScore,
  expansionTestPassed,
} from "../src/game/designConstitution/designConstitutionData";
import { FeatureComplianceRegistry, PillarReinforcementLedger } from "../src/game/designConstitution/DesignConstitutionRuntime";

describe("The Afterlight Design Constitution (AF-146)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(TEN_PILLARS.length).toBe(10);
    expect(Object.keys(PILLAR_DESCRIPTIONS).length).toBe(10);
    expect(PROHIBITED_DESIGN_PATTERNS.length).toBe(10);
    expect(REQUIRED_DESIGN_PATTERNS.length).toBe(10);
    expect(CONTENT_TEST_QUESTIONS.length).toBe(10);
    expect(EXPANSION_TEST_REQUIREMENTS.length).toBe(6);
    expect(TECHNICAL_PRINCIPLES.length).toBe(8);
    expect(ARTISTIC_PRINCIPLES.length).toBe(7);
    expect(AUDIO_PRINCIPLES.length).toBe(5);
    expect(NARRATIVE_PRINCIPLES.length).toBe(7);
    expect(PLAYER_PROMISE.length).toBe(6);
    expect(DEVELOPER_PROMISE.length).toBe(7);
  });

  it("CONTENT_TEST_PASS_THRESHOLD matches the spec's own 'at least eight of these' figure", () => {
    expect(CONTENT_TEST_PASS_THRESHOLD).toBe(8);
  });

  it("THE FINAL PROMISE asks what future we can build together, never what we can make players do", () => {
    expect(FINAL_PROMISE_QUESTION).toBe("What future can we build together?");
    expect(FINAL_PROMISE_REJECTED_QUESTION).toBe("What can we make players do?");
  });

  it("contentTestScore passes at exactly 8-of-10 and fails at 7, kept separate from the real Constitution's all-must-pass gates", () => {
    const answers: Partial<Record<(typeof CONTENT_TEST_QUESTIONS)[number], boolean>> = {};
    for (let i = 0; i < 7; i++) answers[CONTENT_TEST_QUESTIONS[i]!] = true;
    expect(contentTestScore(answers).passed).toBe(false);
    answers[CONTENT_TEST_QUESTIONS[7]!] = true;
    const result = contentTestScore(answers);
    expect(result.yesCount).toBe(8);
    expect(result.passed).toBe(true);
  });

  it("expansionTestPassed requires every single requirement, unlike the partial-pass Content Test", () => {
    const satisfied = new Set(EXPANSION_TEST_REQUIREMENTS.slice(0, 5));
    expect(expansionTestPassed(satisfied)).toBe(false);
    expect(expansionTestPassed(new Set(EXPANSION_TEST_REQUIREMENTS))).toBe(true);
  });

  it("FeatureComplianceRegistry is append-only and reports real per-feature compliance history", () => {
    const registry = new FeatureComplianceRegistry();
    const weakAnswers = { "Does it create wonder?": true } as const;
    registry.evaluate("feature-daily-login-bonus", weakAnswers, new Set());
    const strongAnswers = Object.fromEntries(CONTENT_TEST_QUESTIONS.map((q) => [q, true])) as Record<(typeof CONTENT_TEST_QUESTIONS)[number], boolean>;
    registry.evaluate("feature-ocean-world-restoration", strongAnswers, new Set(EXPANSION_TEST_REQUIREMENTS));
    expect(registry.all().length).toBe(2);
    expect(registry.passedCount()).toBe(1);
    expect(registry.historyFor("feature-ocean-world-restoration")[0]?.expansionTestPassed).toBe(true);
  });

  it("PillarReinforcementLedger tracks which pillar each feature reinforces, kept separate from AF-136's real StoryPillarTracker", () => {
    const ledger = new PillarReinforcementLedger();
    ledger.reinforce("Wonder", "feature-ocean-world-restoration");
    ledger.reinforce("Wonder", "feature-deep-space-observatory");
    ledger.reinforce("History", "feature-chronicle-expansion");
    expect(ledger.countFor("Wonder")).toBe(2);
    expect(ledger.dominantPillar()).toBe("Wonder");
    expect(ledger.all().length).toBe(3);
  });
});
