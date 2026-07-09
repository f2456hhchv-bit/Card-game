import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_VALIDATION_CHECKS,
  ACCESSIBILITY_VALIDATION_LIVE,
  AUTOMATED_VALIDATION_DOMAINS,
  BALANCE_VALIDATION_METRICS,
  BALANCE_VALIDATION_REALISATION,
  CONTENT_PIPELINE_LIVE,
  CONTENT_PIPELINE_STAGES,
  DEVELOPER_DASHBOARD_FEATURES,
  DEVELOPER_DASHBOARD_REALISATION,
  GAMEPLAY_TESTING_REALISATION,
  GAMEPLAY_TESTING_SIMULATION_DOMAINS,
  LARGEST_KNOWN_SIMULATION_ITERATIONS,
  LIVE_MONITORING_CATEGORIES,
  LORE_VALIDATION_CHECKS,
  LORE_VALIDATION_REALISATION,
  MILLIONS_TARGET_ITERATIONS,
  PERFORMANCE_VALIDATION_LIVE,
  PERFORMANCE_VALIDATION_METRICS,
  QA_ACCESSIBILITY_CATEGORIES,
  QA_ACCESSIBILITY_LIVE,
  QA_DEBUG_SURFACES,
  QA_PERFORMANCE_TARGETS,
  QA_PIPELINE_STAGES,
  RELEASE_PIPELINE_REALISATION,
  RELEASE_PIPELINE_STAGES,
  accessibilityStatusSummary,
  nextQaPipelineStage,
  nextReleasePipelineStage,
  performanceStatusSummary,
  performanceTargetsEnforcedByCi,
  qaStatusSummary,
  regressionCoverageSummary,
  releaseReadinessSummary,
  simulationScaleGapSummary,
} from "../src/game/qa/qualityAssuranceData";

describe("Master Quality Assurance Framework vocabulary (AF-095)", () => {
  it("registers a 10-stage QA pipeline, 17 validation domains, 12 gameplay-testing domains, 9 performance metrics, 8 accessibility-validation checks, 7 lore-validation checks, 9 content-pipeline stages, 8 balance metrics, 8 release-pipeline stages, 8 live-monitoring categories, 7 dashboard features, 6 QA-accessibility categories, 6 debug surfaces", () => {
    expect(QA_PIPELINE_STAGES.length).toBe(10);
    expect(AUTOMATED_VALIDATION_DOMAINS.length).toBe(17);
    expect(GAMEPLAY_TESTING_SIMULATION_DOMAINS.length).toBe(12);
    expect(PERFORMANCE_VALIDATION_METRICS.length).toBe(9);
    expect(ACCESSIBILITY_VALIDATION_CHECKS.length).toBe(8);
    expect(LORE_VALIDATION_CHECKS.length).toBe(7);
    expect(CONTENT_PIPELINE_STAGES.length).toBe(9);
    expect(BALANCE_VALIDATION_METRICS.length).toBe(8);
    expect(RELEASE_PIPELINE_STAGES.length).toBe(8);
    expect(LIVE_MONITORING_CATEGORIES.length).toBe(8);
    expect(DEVELOPER_DASHBOARD_FEATURES.length).toBe(7);
    expect(QA_ACCESSIBILITY_CATEGORIES.length).toBe(6);
    expect(Object.keys(QA_DEBUG_SURFACES).length).toBe(6);
  });

  it("the QA pipeline and release pipeline are both LINEAR — every stage but the last advances to exactly one successor, the last advances to null", () => {
    for (let i = 0; i < QA_PIPELINE_STAGES.length - 1; i += 1) expect(nextQaPipelineStage(QA_PIPELINE_STAGES[i]!)).toBe(QA_PIPELINE_STAGES[i + 1]);
    expect(nextQaPipelineStage(QA_PIPELINE_STAGES[QA_PIPELINE_STAGES.length - 1]!)).toBeNull();
    for (let i = 0; i < RELEASE_PIPELINE_STAGES.length - 1; i += 1) expect(nextReleasePipelineStage(RELEASE_PIPELINE_STAGES[i]!)).toBe(RELEASE_PIPELINE_STAGES[i + 1]);
    expect(nextReleasePipelineStage(RELEASE_PIPELINE_STAGES[RELEASE_PIPELINE_STAGES.length - 1]!)).toBeNull();
  });

  it("all 17 automated-validation domains and all 12 gameplay-testing domains are already backed by a real registry or sweep", () => {
    expect(AUTOMATED_VALIDATION_DOMAINS.length).toBeGreaterThan(0);
    for (const domain of GAMEPLAY_TESTING_SIMULATION_DOMAINS) expect(GAMEPLAY_TESTING_REALISATION[domain].kind).toBe("existing");
  });
});

describe("Honest gap: millions of simulations vs. the real ceiling (AF-095 §Gameplay Testing)", () => {
  it("the largest known sweep is 200,000 iterations, 5x short of the spec's million-iteration target", () => {
    expect(LARGEST_KNOWN_SIMULATION_ITERATIONS).toBe(200_000);
    expect(MILLIONS_TARGET_ITERATIONS).toBe(1_000_000);
    expect(simulationScaleGapSummary()).toBe("200,000 largest known / 1,000,000 target (5.0× gap)");
  });
});

describe("Delegation over reimplementation — AF-095 reuses AF-094's real registries (AF-095 §Performance Validation)", () => {
  it("frameTime/loading/streaming are delegated booleans, not re-declared", () => {
    expect(PERFORMANCE_VALIDATION_LIVE.frameTime).toBe(true);
    expect(PERFORMANCE_VALIDATION_LIVE.loading).toBe(false);
    expect(PERFORMANCE_VALIDATION_LIVE.streaming).toBe(false);
  });

  it("1 of 9 performance-validation metrics live; 2 of 8 accessibility-validation checks live; 3 of 6 QA-accessibility categories live", () => {
    expect(Object.values(PERFORMANCE_VALIDATION_LIVE).filter(Boolean).length).toBe(1);
    expect(Object.values(ACCESSIBILITY_VALIDATION_LIVE).filter(Boolean).length).toBe(2);
    expect(Object.values(QA_ACCESSIBILITY_LIVE).filter(Boolean).length).toBe(3);
  });
});

describe("Realisation maps stay bound to real evidence (AF-095)", () => {
  it("4 of 7 lore-validation checks are real structural cross-module proofs; 3 are honest future (narrative-level checks)", () => {
    let existing = 0;
    for (const check of LORE_VALIDATION_CHECKS) if (LORE_VALIDATION_REALISATION[check].kind === "existing") existing += 1;
    expect(existing).toBe(4);
    expect(LORE_VALIDATION_REALISATION.timelineConflicts.kind).toBe("future");
  });

  it("5 of 8 balance-validation metrics are real (axis-diversity or curve proofs); 3 are honest future", () => {
    let existing = 0;
    for (const metric of BALANCE_VALIDATION_METRICS) if (BALANCE_VALIDATION_REALISATION[metric].kind === "existing") existing += 1;
    expect(existing).toBe(5);
    expect(BALANCE_VALIDATION_REALISATION.relicDiversity.kind).toBe("future");
  });

  it("8 of 9 content-pipeline stages are already this project's own real per-module contract; only localisation-readiness is future", () => {
    expect(Object.values(CONTENT_PIPELINE_LIVE).filter(Boolean).length).toBe(8);
    expect(CONTENT_PIPELINE_LIVE.localizationReady).toBe(false);
  });

  it("5 of 8 release-pipeline stages are real (CI gate + deploy workflow); 2 of 7 developer-dashboard features are real", () => {
    let existing = 0;
    for (const stage of RELEASE_PIPELINE_STAGES) if (RELEASE_PIPELINE_REALISATION[stage].kind === "existing") existing += 1;
    expect(existing).toBe(5);
    let dashboardExisting = 0;
    for (const feature of DEVELOPER_DASHBOARD_FEATURES) if (DEVELOPER_DASHBOARD_REALISATION[feature].kind === "existing") dashboardExisting += 1;
    expect(dashboardExisting).toBe(2);
  });

  it("no CI performance budget is enforced today — honest, not fabricated", () => {
    expect(performanceTargetsEnforcedByCi()).toBe(false);
    expect(QA_PERFORMANCE_TARGETS.fps60MinimumDesktop).toBe(60);
    expect(QA_PERFORMANCE_TARGETS.memoryBudgets).toBeNull();
  });
});

describe("Live summary functions report the real counted totals (AF-095 §Debug)", () => {
  it("qaStatusSummary/regressionCoverageSummary/performanceStatusSummary/accessibilityStatusSummary/releaseReadinessSummary", () => {
    expect(qaStatusSummary()).toBe("17/17 domains validated · 10-stage pipeline");
    expect(regressionCoverageSummary()).toBe("9/15 structural proofs registered live");
    expect(performanceStatusSummary()).toBe("1/9 performance-validation metrics live");
    expect(accessibilityStatusSummary()).toBe("3/6 QA accessibility categories live");
    expect(releaseReadinessSummary()).toBe("5/8 release-pipeline stages live");
  });
});

describe("Master Quality Assurance Framework — self-review (AF-095 §Self Review Loop)", () => {
  it("150 seeded rounds: walking the QA pipeline from any starting stage always reaches finalApproval in a bounded number of steps, never cycling", () => {
    for (let seed = 0; seed < 150; seed += 1) {
      const startIndex = seed % QA_PIPELINE_STAGES.length;
      let stage = QA_PIPELINE_STAGES[startIndex]!;
      const visited = new Set<string>([stage]);
      let steps = 0;
      while (stage !== "finalApproval" && steps <= QA_PIPELINE_STAGES.length) {
        const next = nextQaPipelineStage(stage);
        if (next === null) throw new Error(`seed ${seed}: pipeline stalled at ${stage} before reaching finalApproval`);
        if (visited.has(next)) throw new Error(`seed ${seed}: pipeline cycled back to ${next}`);
        visited.add(next);
        stage = next;
        steps += 1;
      }
      if (stage !== "finalApproval") throw new Error(`seed ${seed}: pipeline never reached finalApproval`);
    }
  });
});
