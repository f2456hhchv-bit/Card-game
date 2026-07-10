import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_PHILOSOPHY_STATEMENT,
  ATLAS_PRINCIPLES,
  ATLAS_SYSTEM_HIERARCHY,
  DESIGN_VALIDATION_QUESTIONS,
  EMOTIONAL_COMPASS_AVOID,
  EMOTIONAL_COMPASS_TARGET,
  FINAL_QUESTION,
  LONG_TERM_PHILOSOPHY_STATEMENTS,
  PLAYER_EXPERIENCE_PILLARS,
  QUALITY_BAR,
  designValidationPassed,
} from "../src/game/atlasCore/atlasCoreData";
import { AtlasCoreComplianceRegistry, AtlasPrincipleReinforcementLedger } from "../src/game/atlasCore/AtlasCoreRuntime";

describe("The Atlas Core (AF-145)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ATLAS_PRINCIPLES.length).toBe(12);
    expect(DESIGN_VALIDATION_QUESTIONS.length).toBe(8);
    expect(EMOTIONAL_COMPASS_TARGET.length).toBe(9);
    expect(EMOTIONAL_COMPASS_AVOID.length).toBe(4);
    expect(PLAYER_EXPERIENCE_PILLARS.length).toBe(5);
    expect(ATLAS_SYSTEM_HIERARCHY.length).toBe(10);
    expect(QUALITY_BAR.length).toBe(8);
    expect(LONG_TERM_PHILOSOPHY_STATEMENTS.length).toBe(4);
  });

  it("every Atlas Principle has a distinct virtue/vice pair and a stable ordering", () => {
    const ids = new Set(ATLAS_PRINCIPLES.map((p) => p.id));
    expect(ids.size).toBe(12);
    for (const principle of ATLAS_PRINCIPLES) {
      expect(principle.virtue).not.toBe(principle.vice);
    }
    expect(ATLAS_PRINCIPLES.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("ACCESSIBILITY_PHILOSOPHY_STATEMENT and FINAL_QUESTION match the spec's own wording", () => {
    expect(ACCESSIBILITY_PHILOSOPHY_STATEMENT).toContain("foundational");
    expect(FINAL_QUESTION).toBe("Does this make humanity's future brighter?");
  });

  it("designValidationPassed requires every one of the 8 questions, unlike AF-146's partial-pass Content Test", () => {
    const partial = new Set(DESIGN_VALIDATION_QUESTIONS.slice(0, 7));
    expect(designValidationPassed(partial)).toBe(false);
    expect(designValidationPassed(new Set(DESIGN_VALIDATION_QUESTIONS))).toBe(true);
  });

  it("AtlasCoreComplianceRegistry is append-only and reports real per-feature validation history", () => {
    const registry = new AtlasCoreComplianceRegistry();
    registry.evaluate("feature-daily-login-bonus", new Set(["Does it encourage exploration?"]), new Set());
    registry.evaluate("feature-ocean-world-restoration", new Set(DESIGN_VALIDATION_QUESTIONS), new Set(["hope-over-despair", "discovery-over-grinding"]));
    expect(registry.all().length).toBe(2);
    expect(registry.passedCount()).toBe(1);
    expect(registry.all()[1]?.principlesReinforcedCount).toBe(2);
  });

  it("AtlasPrincipleReinforcementLedger tracks which principle each feature reinforces, kept separate from AF-146's Pillar-typed ledger", () => {
    const ledger = new AtlasPrincipleReinforcementLedger();
    ledger.reinforce("hope-over-despair", "feature-ocean-world-restoration");
    ledger.reinforce("hope-over-despair", "feature-deep-space-observatory");
    ledger.reinforce("history-over-forgetting", "feature-chronicle-expansion");
    expect(ledger.countFor("hope-over-despair")).toBe(2);
    expect(ledger.dominantPrinciple()).toBe("hope-over-despair");
    expect(ledger.all().length).toBe(3);
  });
});
