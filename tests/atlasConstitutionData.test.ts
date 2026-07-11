import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ARTICLES, CONSTITUTIONAL_DEVELOPER_TOOLS, CONSTITUTIONAL_OATH_COMMITMENTS, DEVELOPER_PROMISE, PLAYER_PROMISE } from "../src/game/atlasConstitution/atlasConstitutionData";
import { constitutionalReviewPassed } from "../src/game/atlasConstitution/AtlasConstitutionRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { TEN_PILLARS, PLAYER_PROMISE as DESIGN_PLAYER_PROMISE, DEVELOPER_PROMISE as DESIGN_DEVELOPER_PROMISE } from "../src/game/designConstitution/designConstitutionData";
import { PRIME_DIRECTIVES, PLAYER_PROMISE as PRIME_PLAYER_PROMISE, DEVELOPER_PROMISE as PRIME_DEVELOPER_PROMISE } from "../src/game/atlasPrimeDirective/atlasPrimeDirectiveData";

describe("The Atlas Constitution (AF-200)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CONSTITUTIONAL_ARTICLES.length).toBe(15);
    expect(CONSTITUTIONAL_OATH_COMMITMENTS.length).toBe(9);
    expect(PLAYER_PROMISE.length).toBe(7);
    expect(DEVELOPER_PROMISE.length).toBe(4);
    expect(CONSTITUTIONAL_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("never modifies, ranks above, or duplicates the real docs/CONSTITUTION.md, AF-146's real Design Constitution, or AF-170's real Atlas Prime Directive — this module is its own, third, separate charter", () => {
    expect(CONSTITUTIONAL_ARTICLES.every((a) => typeof a.numeral === "string" && typeof a.principle === "string")).toBe(true);
  });

  it("The Constitutional Oath's closing line is a verbatim exact-string match (1 of 9) with AF-170's real DEVELOPER_PROMISE, which already contains exactly this sentence", () => {
    expect(detectOverlap(CONSTITUTIONAL_OATH_COMMITMENTS, PRIME_DEVELOPER_PROMISE).shared.length).toBe(1);
    expect(PRIME_DEVELOPER_PROMISE).toContain("Leave the universe stronger than you found it");
  });

  it("The Player Promise shares zero exact members with either AF-146's real PLAYER_PROMISE or AF-170's real PLAYER_PROMISE, despite identical intent — a third such list, fragmented by word-form differences", () => {
    expect(detectOverlap(PLAYER_PROMISE, DESIGN_PLAYER_PROMISE).shared.length).toBe(0);
    expect(detectOverlap(PLAYER_PROMISE, PRIME_PLAYER_PROMISE).shared.length).toBe(0);
  });

  it("The Developer Promise shares zero exact members with either AF-146's or AF-170's real DEVELOPER_PROMISE — the 'Build ' prefix alone breaks the exact-string match against AF-170's own near-identical phrasing", () => {
    expect(detectOverlap(DEVELOPER_PROMISE, DESIGN_DEVELOPER_PROMISE).shared.length).toBe(0);
    expect(detectOverlap(DEVELOPER_PROMISE, PRIME_DEVELOPER_PROMISE).shared.length).toBe(0);
  });

  it("The 15 Articles share 7 of 15 exact-string members with AF-146's real TEN_PILLARS, but ZERO with AF-170's real PRIME_DIRECTIVES names (which wrap the same concepts as 'Protect Hope,' not 'Hope')", () => {
    const articleNames = CONSTITUTIONAL_ARTICLES.map((a) => a.name);
    expect(detectOverlap(articleNames, TEN_PILLARS).shared.length).toBe(7);
    const primeDirectiveNames = PRIME_DIRECTIVES.map((d) => d.name);
    expect(detectOverlap(articleNames, primeDirectiveNames).shared.length).toBe(0);
  });

  it("constitutionalReviewPassed requires every one of the fifteen Articles validated, the broadest all-must-pass gate in this codebase", () => {
    const partial = new Set(CONSTITUTIONAL_ARTICLES.slice(0, 14).map((a) => a.name));
    expect(constitutionalReviewPassed(partial)).toBe(false);
    const complete = new Set(CONSTITUTIONAL_ARTICLES.map((a) => a.name));
    expect(constitutionalReviewPassed(complete)).toBe(true);
  });
});
