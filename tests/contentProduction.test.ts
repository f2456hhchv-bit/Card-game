import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  AUTOMATED_VALIDATION_CHECKS,
  CONTENT_DEPENDENCY_REALISATION,
  CONTENT_DEPENDENCY_TARGETS,
  CONTENT_PIPELINE_STAGES,
  CONTENT_SCALE_CURRENT,
  CONTENT_SCALE_TARGETS,
  CONTENT_TEMPLATE_FIELDS,
  QUALITY_TARGET_TRAITS,
  RECOMMENDED_IMPLEMENTATION_ORDER,
  SUPPORTED_CONTENT_KINDS,
  SUPPORTED_CONTENT_REALISATION,
  automatedValidationLive,
  contentScaleProgressFor,
  contentScaleSummary,
  contentTemplateCompletenessFor,
  isContentTemplateComplete,
  nextContentPipelineStage,
  nextImplementationOrderStep,
  supportedContentCoverageSummary,
} from "../src/game/production/contentProductionData";

describe("Content Production Framework vocabulary (AF-097)", () => {
  it("registers a 13-stage pipeline, 22 supported-content kinds, 14 template fields, 11 dependency targets, a 15-step implementation order, 8 scale targets, 8 automated-validation checks, 7 quality-target traits", () => {
    expect(CONTENT_PIPELINE_STAGES.length).toBe(13);
    expect(SUPPORTED_CONTENT_KINDS.length).toBe(22);
    expect(CONTENT_TEMPLATE_FIELDS.length).toBe(14);
    expect(CONTENT_DEPENDENCY_TARGETS.length).toBe(11);
    expect(RECOMMENDED_IMPLEMENTATION_ORDER.length).toBe(15);
    expect(Object.keys(CONTENT_SCALE_TARGETS).length).toBe(8);
    expect(AUTOMATED_VALIDATION_CHECKS.length).toBe(8);
    expect(QUALITY_TARGET_TRAITS.length).toBe(7);
  });

  it("the content pipeline and implementation order are both LINEAR — every step advances to exactly one successor, the last advances to null, no cycling", () => {
    for (let i = 0; i < CONTENT_PIPELINE_STAGES.length - 1; i += 1) expect(nextContentPipelineStage(CONTENT_PIPELINE_STAGES[i]!)).toBe(CONTENT_PIPELINE_STAGES[i + 1]);
    expect(nextContentPipelineStage(CONTENT_PIPELINE_STAGES[CONTENT_PIPELINE_STAGES.length - 1]!)).toBeNull();
    for (let i = 0; i < RECOMMENDED_IMPLEMENTATION_ORDER.length - 1; i += 1) expect(nextImplementationOrderStep(RECOMMENDED_IMPLEMENTATION_ORDER[i]!)).toBe(RECOMMENDED_IMPLEMENTATION_ORDER[i + 1]);
    expect(nextImplementationOrderStep(RECOMMENDED_IMPLEMENTATION_ORDER[RECOMMENDED_IMPLEMENTATION_ORDER.length - 1]!)).toBeNull();
  });

  it("17 of 22 supported-content kinds already have a real registry; 5 are honest future gaps", () => {
    expect(supportedContentCoverageSummary()).toBe("17/22 supported content kinds have a real registry");
    for (const kind of ["planets", "dialogue", "species", "resources", "museumEntries"] as const) expect(SUPPORTED_CONTENT_REALISATION[kind].kind).toBe("future");
  });
});

describe("Content Template — a generic, reusable completeness checker (AF-097 §Content Template)", () => {
  it("flags every missing or empty field, and passes only when all 14 are present", () => {
    const empty = contentTemplateCompletenessFor({});
    for (const field of CONTENT_TEMPLATE_FIELDS) expect(empty[field]).toBe(false);
    expect(isContentTemplateComplete({})).toBe(false);

    const complete: Record<string, unknown> = {};
    for (const field of CONTENT_TEMPLATE_FIELDS) complete[field] = field === "relationships" ? ["x"] : field === "statistics" ? { power: 1 } : "x";
    expect(isContentTemplateComplete(complete)).toBe(true);

    const partial = { ...complete, lore: "" };
    expect(isContentTemplateComplete(partial)).toBe(false);
    expect(contentTemplateCompletenessFor(partial).lore).toBe(false);
  });
});

describe("Content Dependencies and Automated Validation delegate to real registries (AF-097)", () => {
  it("3 of 11 dependency targets are real automatic checks; 8 are honest future work", () => {
    let existing = 0;
    for (const target of CONTENT_DEPENDENCY_TARGETS) if (CONTENT_DEPENDENCY_REALISATION[target].kind === "existing") existing += 1;
    expect(existing).toBe(3);
  });

  it("7 of 8 automated-validation checks are live, each delegated to a real AF-092/094/095 function or registry — only replayability is future", () => {
    const live = automatedValidationLive();
    let liveCount = 0;
    for (const check of AUTOMATED_VALIDATION_CHECKS) if (live[check]) liveCount += 1;
    expect(liveCount).toBe(7);
    expect(live.replayability).toBe(false);
    expect(live.visualConsistency).toBe(true); // calls the real colourSignaturesAreDistinct()
    expect(live.technicalCompatibility).toBe(true); // calls the real ARCHITECTURE_PRINCIPLES
  });
});

describe("Content Scale reports the real, cited current roster counts (AF-097 §Content Scale)", () => {
  it("no fabricated progress — every current count is strictly below its target today", () => {
    for (const kind of Object.keys(CONTENT_SCALE_TARGETS) as Array<keyof typeof CONTENT_SCALE_TARGETS>) {
      expect(CONTENT_SCALE_CURRENT[kind]).toBeLessThan(CONTENT_SCALE_TARGETS[kind]!);
      expect(contentScaleProgressFor(kind)).toBeGreaterThan(0);
      expect(contentScaleProgressFor(kind)).toBeLessThan(1);
    }
  });

  it("bosses are the furthest from target (1/250); enemy types are the closest (61/500)", () => {
    expect(contentScaleProgressFor("bosses")).toBeLessThan(contentScaleProgressFor("enemyTypes"));
    expect(contentScaleSummary()).toContain("bosses 1/250");
    expect(contentScaleSummary()).toContain("enemyTypes 61/500");
  });
});

describe("Content Production Framework — self-review (AF-097 §Self Review Loop)", () => {
  it("150 seeded rounds: walking the pipeline from any starting stage always reaches productionLock, never cycling", () => {
    for (let seed = 0; seed < 150; seed += 1) {
      const rng = new Rng(seed);
      const startIndex = Math.floor(rng.next() * CONTENT_PIPELINE_STAGES.length);
      let stage = CONTENT_PIPELINE_STAGES[startIndex]!;
      const visited = new Set<string>([stage]);
      let steps = 0;
      while (stage !== "productionLock" && steps <= CONTENT_PIPELINE_STAGES.length) {
        const next = nextContentPipelineStage(stage);
        if (next === null) throw new Error(`seed ${seed}: pipeline stalled at ${stage}`);
        if (visited.has(next)) throw new Error(`seed ${seed}: pipeline cycled back to ${next}`);
        visited.add(next);
        stage = next;
        steps += 1;
      }
      if (stage !== "productionLock") throw new Error(`seed ${seed}: pipeline never reached productionLock`);
    }
  });
});
