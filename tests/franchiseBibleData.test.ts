import { describe, expect, it } from "vitest";
import {
  ADAPTATION_MEDIA_KINDS,
  ADAPTATION_PRESERVATION_REQUIREMENTS,
  CANON_TIERS,
  COMMANDER_STANDARDS,
  COMMUNITY_VALUES,
  CORE_THEMES,
  ERAS,
  EXPANSION_RULES,
  FRANCHISE_PURPOSE_GOALS,
  FRANCHISE_TEST_QUESTIONS,
  LANGUAGE_STYLE_AVOID,
  LANGUAGE_STYLE_EMPHASISE,
  MERCHANDISE_CELEBRATE,
  MUSIC_PILLARS,
  TECHNOLOGY_RULES,
  THEME_MINIMUM_COUNT,
  VISUAL_IDENTITY_COLOUR_LANGUAGE,
  WORLD_STANDARDS,
  canonTierRank,
  eraFor,
  franchiseTestPassed,
  themeCoverageMet,
} from "../src/game/franchiseBible/franchiseBibleData";
import { CanonAuthorityResolver, CanonRecordLedger, FranchiseComplianceRegistry } from "../src/game/franchiseBible/FranchiseBibleRuntime";

describe("The Afterlight Franchise Bible (AF-147)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(FRANCHISE_PURPOSE_GOALS.length).toBe(7);
    expect(CORE_THEMES.length).toBe(10);
    expect(ERAS.length).toBe(8);
    expect(CANON_TIERS.length).toBe(6);
    expect(VISUAL_IDENTITY_COLOUR_LANGUAGE.length).toBe(6);
    expect(MUSIC_PILLARS.length).toBe(6);
    expect(LANGUAGE_STYLE_AVOID.length).toBe(3);
    expect(LANGUAGE_STYLE_EMPHASISE.length).toBe(5);
    expect(COMMANDER_STANDARDS.length).toBe(4);
    expect(WORLD_STANDARDS.length).toBe(9);
    expect(TECHNOLOGY_RULES.length).toBe(5);
    expect(EXPANSION_RULES.length).toBe(5);
    expect(MERCHANDISE_CELEBRATE.length).toBe(8);
    expect(ADAPTATION_MEDIA_KINDS.length).toBe(6);
    expect(ADAPTATION_PRESERVATION_REQUIREMENTS.length).toBe(4);
    expect(COMMUNITY_VALUES.length).toBe(6);
    expect(FRANCHISE_TEST_QUESTIONS.length).toBe(6);
    expect(THEME_MINIMUM_COUNT).toBe(3);
  });

  it("eraFor climbs the 8-Era chronology in strict order, never skipping backwards", () => {
    expect(eraFor(0).id).toBe("earth-era");
    expect(eraFor(4).id).toBe("earth-era");
    expect(eraFor(5).id).toBe("collapse-era");
    expect(eraFor(25).id).toBe("atlas-initiative");
    expect(eraFor(1000).id).toBe("future-eras");
  });

  it("canonTierRank ranks Main Games highest and Developer Commentary lowest", () => {
    expect(canonTierRank("Main Games")).toBe(0);
    expect(canonTierRank("Developer Commentary")).toBe(CANON_TIERS.length - 1);
    expect(canonTierRank("Main Games")).toBeLessThan(canonTierRank("Museum Records"));
  });

  it("themeCoverageMet requires at least THEME_MINIMUM_COUNT themes, a different mechanic shape than the other four checklist gates", () => {
    expect(themeCoverageMet(new Set(["Hope", "Discovery"]))).toBe(false);
    expect(themeCoverageMet(new Set(["Hope", "Discovery", "Legacy"]))).toBe(true);
  });

  it("franchiseTestPassed requires every one of the 6 questions, the fifth all-must-pass checklist gate in this codebase", () => {
    const partial = new Set(FRANCHISE_TEST_QUESTIONS.slice(0, 5));
    expect(franchiseTestPassed(partial)).toBe(false);
    expect(franchiseTestPassed(new Set(FRANCHISE_TEST_QUESTIONS))).toBe(true);
  });

  it("CanonAuthorityResolver always resolves a conflict in favour of the highest canon tier", () => {
    const resolver = new CanonAuthorityResolver();
    const resolved = resolver.resolve([
      { sourceId: "companion-book-3", tier: "Official Companion Books", subject: "atlas-prime-origin", claim: "Atlas Prime was born on Meridian Rest." },
      { sourceId: "afterlight-2", tier: "Main Games", subject: "atlas-prime-origin", claim: "Atlas Prime was born on Lucent Gate." },
      { sourceId: "museum-exhibit-4", tier: "Museum Records", subject: "atlas-prime-origin", claim: "Atlas Prime's birthworld is undocumented." },
    ]);
    expect(resolved?.sourceId).toBe("afterlight-2");
  });

  it("CanonRecordLedger keeps every statement ever made about a subject, not just the resolved winner", () => {
    const ledger = new CanonRecordLedger();
    ledger.record({ sourceId: "afterlight-1", tier: "Main Games", subject: "first-expedition", claim: "The First Expedition departed from Earth orbit." });
    ledger.record({ sourceId: "companion-book-1", tier: "Official Companion Books", subject: "first-expedition", claim: "The First Expedition carried twelve founding commanders." });
    expect(ledger.statementsFor("first-expedition").length).toBe(2);
    expect(ledger.all().length).toBe(2);
  });

  it("FranchiseComplianceRegistry is append-only and reports real per-project evaluation history", () => {
    const registry = new FranchiseComplianceRegistry();
    registry.evaluate("hypothetical-novel", new Set(["Does it strengthen hope?"]), new Set(["Hope"]));
    registry.evaluate("hypothetical-expansion", new Set(FRANCHISE_TEST_QUESTIONS), new Set(["Hope", "Discovery", "Legacy"]));
    expect(registry.all().length).toBe(2);
    expect(registry.passedCount()).toBe(1);
  });
});
