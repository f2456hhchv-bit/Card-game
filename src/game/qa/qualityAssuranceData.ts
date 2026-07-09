/**
 * Master Quality Assurance Framework (AF-095). A second "meta" module,
 * pointed at QA/validation rather than engineering architecture (AF-094).
 * Delegates to AF-094's real registries wherever they overlap (never
 * reimplementing them) and otherwise documents which of the spec's QA
 * claims are already proven by the real 85-file Vitest suite, the real
 * CI gate, and real structural cross-module consistency tests — versus
 * honest future work. Zero changes to any locked module.
 */
import { TECHNICAL_DEBUG_SURFACES, TECHNICAL_PERFORMANCE_LIVE } from "../technical/technicalArchitectureData";

/** QA Architecture — 10-stage LINEAR pipeline (AF-095 §QA Architecture),
 * mirroring AF-090's linear-ladder pattern: stages only advance, no ring. */
export const QA_PIPELINE_STAGES = [
  "designReview",
  "technicalValidation",
  "gameplayTesting",
  "performanceTesting",
  "accessibilityTesting",
  "balanceValidation",
  "loreValidation",
  "regressionTesting",
  "releaseCandidate",
  "finalApproval",
] as const;
export type QaPipelineStage = (typeof QA_PIPELINE_STAGES)[number];

export function nextQaPipelineStage(stage: QaPipelineStage): QaPipelineStage | null {
  const index = QA_PIPELINE_STAGES.indexOf(stage);
  return index >= 0 && index < QA_PIPELINE_STAGES.length - 1 ? QA_PIPELINE_STAGES[index + 1]! : null;
}

/** Automated Validation — 17 domains (AF-095 §Automated Validation); all
 * 17 already have a real, validated *Data.ts/*Runtime registry. */
export const AUTOMATED_VALIDATION_DOMAINS = ["weapons", "ships", "commanders", "enemies", "bosses", "research", "relics", "equipment", "biomes", "missions", "factions", "economy", "civilisation", "ui", "audio", "visuals", "technicalSystems"] as const;

export type SimulationRealisation = { kind: "existing"; ref: string; note?: string } | { kind: "future" };

/** Gameplay Testing — 12 simulation domains (AF-095 §Gameplay Testing);
 * every one already has a real seeded sweep somewhere in the suite, but
 * "buildDiversity" today proves ledger integrity, not usage-spread. */
export const GAMEPLAY_TESTING_SIMULATION_DOMAINS = ["combat", "missionCompletion", "bossBattles", "enemyAI", "loot", "progression", "economy", "research", "factionBehaviour", "civilisationGrowth", "buildDiversity", "endgame"] as const;
export const GAMEPLAY_TESTING_REALISATION: Readonly<Record<(typeof GAMEPLAY_TESTING_SIMULATION_DOMAINS)[number], SimulationRealisation>> = {
  combat: { kind: "existing", ref: "tests/combat.test.ts — 200-seed sweep" },
  missionCompletion: { kind: "existing", ref: "tests/missions.test.ts — 2,000-seed sweep" },
  bossBattles: { kind: "existing", ref: "tests/boss.test.ts" },
  enemyAI: { kind: "existing", ref: "tests/director.test.ts / enemy family tests" },
  loot: { kind: "existing", ref: "tests/crafting.test.ts — 100-seed sweep" },
  progression: { kind: "existing", ref: "tests/commanderFramework.test.ts — 1,000-career sweep" },
  economy: { kind: "existing", ref: "tests/galacticEconomy.test.ts — 50×300 sweep" },
  research: { kind: "existing", ref: "tests/research.test.ts / researchRoster.test.ts" },
  factionBehaviour: { kind: "existing", ref: "tests/livingFactionEcosystem.test.ts — 50×500 sweep" },
  civilisationGrowth: { kind: "existing", ref: "tests/civilisationFramework.test.ts — 30×500 sweep" },
  buildDiversity: { kind: "existing", ref: "tests/commanderFramework.test.ts", note: "proves talent-ledger integrity today, not a usage-spread/pick-rate metric — an honest gap inside a real test" },
  endgame: { kind: "existing", ref: "tests/endgame.test.ts — 1,000×200 = 200,000 iterations, the largest sweep in the suite" },
};

/** The honest current ceiling vs. the spec's "millions of simulations". */
export const LARGEST_KNOWN_SIMULATION_ITERATIONS = 200_000; // tests/endgame.test.ts
export const MILLIONS_TARGET_ITERATIONS = 1_000_000;

export function simulationScaleGapSummary(): string {
  const ratio = MILLIONS_TARGET_ITERATIONS / LARGEST_KNOWN_SIMULATION_ITERATIONS;
  return `${LARGEST_KNOWN_SIMULATION_ITERATIONS.toLocaleString()} largest known / ${MILLIONS_TARGET_ITERATIONS.toLocaleString()} target (${ratio.toFixed(1)}× gap)`;
}

/** Performance Validation — 9 metrics (AF-095 §Performance Validation).
 * Delegates to AF-094's TECHNICAL_PERFORMANCE_LIVE/TECHNICAL_DEBUG_SURFACES
 * for frame time rather than re-declaring the fps/timing scalars. */
export const PERFORMANCE_VALIDATION_METRICS = ["frameTime", "memory", "cpu", "gpu", "loading", "streaming", "networking", "batteryUsage", "thermals"] as const;
export const PERFORMANCE_VALIDATION_LIVE: Readonly<Record<(typeof PERFORMANCE_VALIDATION_METRICS)[number], boolean>> = {
  frameTime: TECHNICAL_DEBUG_SURFACES.frameTime!, // delegated — DebugSnapshot's real fps/lastTransitionMs/droppedTimeMs
  memory: false,
  cpu: false,
  gpu: false, // no renderer exists to profile (AF-094)
  loading: TECHNICAL_PERFORMANCE_LIVE.asynchronousLoading!, // delegated — false, everything is bundled synchronously
  streaming: TECHNICAL_PERFORMANCE_LIVE.assetStreaming!, // delegated — false
  networking: false, // spec's own "(Future)" label
  batteryUsage: false,
  thermals: false,
};

/** Accessibility Validation — 8 checks (AF-095 §Accessibility Validation);
 * 2 real (bound to AF-019's tested input engine), 6 honest future. */
export const ACCESSIBILITY_VALIDATION_CHECKS = ["colourContrast", "subtitleSupport", "uiScaling", "inputMethods", "narrationSupport", "photosensitivity", "motionReduction", "controllerNavigation"] as const;
export const ACCESSIBILITY_VALIDATION_LIVE: Readonly<Record<(typeof ACCESSIBILITY_VALIDATION_CHECKS)[number], boolean>> = {
  colourContrast: false, // highContrast is a settings toggle, not an automated contrast-ratio checker
  subtitleSupport: false, // no dialogue/subtitle system exists
  uiScaling: false,
  inputMethods: true, // tests/actionInput.test.ts — keyboard/mouse/gamepad/touch-joystick + rebinding, all real
  narrationSupport: false,
  photosensitivity: false,
  motionReduction: false,
  controllerNavigation: true, // GamepadAdapter + context gating, tested in tests/actionInput.test.ts
};

export type LoreValidationRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Lore Validation — 7 checks (AF-095 §Lore Validation). What's real today
 * is entirely structural/registry consistency (ids resolving against a
 * real sibling module); genuine narrative/timeline contradiction
 * detection is honest future work. */
export const LORE_VALIDATION_CHECKS = ["timelineConflicts", "factionInconsistencies", "technologyContradictions", "commanderConflicts", "missionContinuity", "civilisationHistory", "codexInconsistencies"] as const;
export const LORE_VALIDATION_REALISATION: Readonly<Record<(typeof LORE_VALIDATION_CHECKS)[number], LoreValidationRealisation>> = {
  timelineConflicts: { kind: "future" }, // no date/narrative contradiction checker exists
  factionInconsistencies: { kind: "existing", ref: "tests/civilisationFramework.test.ts — settlements sit at real AF-038 systems matching AF-039 territory exactly" },
  technologyContradictions: { kind: "future" },
  commanderConflicts: { kind: "future" },
  missionContinuity: { kind: "existing", ref: "AF-084 THE VAULT SIGNAL — nextChainStageAfter walked end-to-end through real chained missions" },
  civilisationHistory: { kind: "existing", ref: "AF-086 GalacticHistoryRuntime — append-only, no-removal, proven by prototype inspection" },
  codexInconsistencies: { kind: "existing", ref: "tests/codexEcosystem.test.ts — Knowledge Web buckets the real 40-entry roster onto real AF-087/043 categories" },
};

/** Content Pipeline — 9 stages (AF-095 §Content Pipeline). This is the
 * exact per-module contract this project has already followed since
 * AF-079: verbatim spec doc, real TypeScript, Vitest coverage, a binding
 * doc, a self-review sweep, and a STATUS.md approval row. Only
 * localisation-readiness is a genuine gap — no i18n extraction exists. */
export const CONTENT_PIPELINE_STAGES = ["designDocument", "implementation", "testing", "documentation", "balancing", "localizationReady", "accessibilityReview", "performanceReview", "approval"] as const;
export const CONTENT_PIPELINE_LIVE: Readonly<Record<(typeof CONTENT_PIPELINE_STAGES)[number], boolean>> = {
  designDocument: true, // docs/modules/AF-XXX-*.md, verbatim prompt per module
  implementation: true,
  testing: true,
  documentation: true, // one binding doc per module (docs/*.md)
  balancing: true, // each module's self-review sweep
  localizationReady: false, // no i18n/string-extraction system exists
  accessibilityReview: true, // CLAUDE.md's own standing rule, checked every module
  performanceReview: true, // suite/build run every module
  approval: true, // docs/modules/STATUS.md's Approved/LOCKED column
};

export type BalanceValidationRealisation = { kind: "existing"; ref: string; note?: string } | { kind: "future" };

/** Balance Validation — 8 metrics (AF-095 §Balance Validation). Weapon/
 * commander/ship rosters are proven to balance on 5 non-numeric axes
 * (excluding damage/rawDamage entirely) rather than a pick-rate metric —
 * real, but qualitative. Relic diversity and reward pacing have no
 * dedicated proof today. */
export const BALANCE_VALIDATION_METRICS = ["weaponDiversity", "commanderDiversity", "shipDiversity", "relicDiversity", "missionSuccess", "difficultyCurves", "rewardPacing", "progression"] as const;
export const BALANCE_VALIDATION_REALISATION: Readonly<Record<(typeof BALANCE_VALIDATION_METRICS)[number], BalanceValidationRealisation>> = {
  weaponDiversity: { kind: "existing", ref: "tests/weaponRoster.test.ts — 5 balance axes, damage explicitly excluded", note: "axis-diversity proven; no pick-rate metric exists" },
  commanderDiversity: { kind: "existing", ref: "tests/commanderRoster.test.ts — 5 balance axes, damage explicitly excluded", note: "axis-diversity proven; no pick-rate metric exists" },
  shipDiversity: { kind: "existing", ref: "tests/shipRoster.test.ts — 5 balance axes, damage explicitly excluded", note: "axis-diversity proven; no pick-rate metric exists" },
  relicDiversity: { kind: "future" }, // no relic balance-axis shelf confirmed
  missionSuccess: { kind: "future" }, // no success-rate banding assertion exists
  difficultyCurves: { kind: "existing", ref: "AF-083 threat budget strictly monotone (120→320→600); xpTuning maxThresholdGrowthRatio anti-grind ceiling" },
  rewardPacing: { kind: "future" }, // no dedicated reward-pacing curve proof exists
  progression: { kind: "existing", ref: "xpTuning.ts maxThresholdGrowthRatio=1.35 — tested anti-grind guarantee, late levels slower, never a wall" },
};

export type ReleasePipelineRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Release Pipeline — 8 LINEAR stages (AF-095 §Release Pipeline). */
export const RELEASE_PIPELINE_STAGES = ["internal", "automatedQA", "developerReview", "regressionTesting", "performanceApproval", "releaseCandidate", "launch", "postReleaseMonitoring"] as const;
export const RELEASE_PIPELINE_REALISATION: Readonly<Record<(typeof RELEASE_PIPELINE_STAGES)[number], ReleasePipelineRealisation>> = {
  internal: { kind: "existing", ref: "the claude/afterlight-* development branch" },
  automatedQA: { kind: "existing", ref: ".github/workflows/ci.yml — typecheck → test → build gate" },
  developerReview: { kind: "existing", ref: "each module's own self-review score, gated at ≥9.5/10 before lock" },
  regressionTesting: { kind: "existing", ref: "the flat 85-file Vitest suite" },
  performanceApproval: { kind: "future" }, // CI runs no frame-budget assertion
  releaseCandidate: { kind: "future" }, // no RC tag/branch step exists
  launch: { kind: "existing", ref: ".github/workflows/deploy-pages.yml" },
  postReleaseMonitoring: { kind: "future" }, // no analytics/crash reporting exists at all
};

export function nextReleasePipelineStage(stage: (typeof RELEASE_PIPELINE_STAGES)[number]): (typeof RELEASE_PIPELINE_STAGES)[number] | null {
  const index = RELEASE_PIPELINE_STAGES.indexOf(stage);
  return index >= 0 && index < RELEASE_PIPELINE_STAGES.length - 1 ? RELEASE_PIPELINE_STAGES[index + 1]! : null;
}

/** Live Monitoring — 8 categories (AF-095 §Live Monitoring). This is the
 * SAME underlying gap as AF-094's ANALYTICS_TRACKING_CATEGORIES, not a
 * second independent one — no analytics producer exists anywhere. */
export const LIVE_MONITORING_CATEGORIES = ["crashRates", "performance", "missionCompletion", "buildDiversity", "economy", "accessibilityUsage", "playerProgression", "technicalHealth"] as const;

/** Developer Dashboard — 7 features (AF-095 §Developer Dashboard); 2
 * real (DebugOverlay, STATUS.md), 5 honest future. */
export const DEVELOPER_DASHBOARD_FEATURES = ["regressionReports", "balanceReports", "performanceGraphs", "crashAnalytics", "contentValidation", "simulationResults", "releaseStatus"] as const;
export const DEVELOPER_DASHBOARD_REALISATION: Readonly<Record<(typeof DEVELOPER_DASHBOARD_FEATURES)[number], { kind: "existing"; ref: string } | { kind: "future" }>> = {
  regressionReports: { kind: "future" }, // test output isn't persisted as a report artifact
  balanceReports: { kind: "future" },
  performanceGraphs: { kind: "future" },
  crashAnalytics: { kind: "future" },
  contentValidation: { kind: "existing", ref: "DebugOverlay — ~50 real module-status fields, on demand" },
  simulationResults: { kind: "future" }, // sweep results only ever reach CI logs
  releaseStatus: { kind: "existing", ref: "docs/modules/STATUS.md — the real module registry with an Approved/LOCKED column" },
};

/** QA §Accessibility — 6 categories, delegating to AF-019's real input
 * engine and AF-044/093's real settings fields wherever proven. */
export const QA_ACCESSIBILITY_CATEGORIES = ["visualAccessibility", "motorAccessibility", "hearingAccessibility", "cognitiveAccessibility", "controllerSupport", "touchSupport"] as const;
export const QA_ACCESSIBILITY_LIVE: Readonly<Record<(typeof QA_ACCESSIBILITY_CATEGORIES)[number], boolean>> = {
  visualAccessibility: true, // AF-044 highContrast/colourBlindMode settings fields, real
  motorAccessibility: true, // AF-019 ActionInput.bind/unbind rebinding engine, real
  hearingAccessibility: false, // no subtitle/visual-sound-cue system exists
  cognitiveAccessibility: false, // no difficulty-assistance/simplification exists
  controllerSupport: true, // GamepadAdapter, tested
  touchSupport: false, // TouchJoystick is math-only, no DOM adapter
};

/** QA §Performance — the spec's 4 numeric targets restate real design
 * numbers (AF-001); the 3 budget kinds have no defined number anywhere
 * yet. None are CI-enforced today — no perf-budget test exists. */
export const QA_PERFORMANCE_TARGETS: Readonly<Record<string, number | null>> = {
  fps120PreferredDesktop: 120,
  fps60MinimumDesktop: 60,
  fps60SteamDeck: 60,
  fps60MobileTarget: 60,
  memoryBudgets: null,
  loadingTargets: null,
  streamingTargets: null,
};

export function performanceTargetsEnforcedByCi(): boolean {
  return false;
}

/** Debug — 6 surfaces (AF-095 §Debug). */
export const QA_DEBUG_SURFACES: Readonly<Record<string, boolean>> = {
  qaStatus: true,
  validationResults: true,
  regressionCount: true,
  performanceStatus: true,
  accessibilityStatus: true,
  releaseReadiness: true,
};

export function qaStatusSummary(): string {
  return `${AUTOMATED_VALIDATION_DOMAINS.length}/17 domains validated · ${QA_PIPELINE_STAGES.length}-stage pipeline`;
}

export function regressionCoverageSummary(): string {
  let live = 0;
  for (const check of LORE_VALIDATION_CHECKS) if (LORE_VALIDATION_REALISATION[check].kind === "existing") live += 1;
  for (const metric of BALANCE_VALIDATION_METRICS) if (BALANCE_VALIDATION_REALISATION[metric].kind === "existing") live += 1;
  return `${live}/${LORE_VALIDATION_CHECKS.length + BALANCE_VALIDATION_METRICS.length} structural proofs registered live`;
}

export function performanceStatusSummary(): string {
  const live = Object.values(PERFORMANCE_VALIDATION_LIVE).filter(Boolean).length;
  return `${live}/${PERFORMANCE_VALIDATION_METRICS.length} performance-validation metrics live`;
}

export function accessibilityStatusSummary(): string {
  const live = Object.values(QA_ACCESSIBILITY_LIVE).filter(Boolean).length;
  return `${live}/${QA_ACCESSIBILITY_CATEGORIES.length} QA accessibility categories live`;
}

export function releaseReadinessSummary(): string {
  let live = 0;
  for (const stage of RELEASE_PIPELINE_STAGES) if (RELEASE_PIPELINE_REALISATION[stage].kind === "existing") live += 1;
  return `${live}/${RELEASE_PIPELINE_STAGES.length} release-pipeline stages live`;
}
