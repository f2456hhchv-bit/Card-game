import type { AtlasScorecardCategory, QualityEvolutionCriterion, RegressionSignal, UpdateLifecycleStage } from "./atlasMetaEvolutionData";
import { ATLAS_SCORECARD_CATEGORIES, ATLAS_SCORECARD_GATE_THRESHOLD, UPDATE_LIFECYCLE_STAGES, nextUpdateLifecycleStage } from "./atlasMetaEvolutionData";

export interface UpdateLifecycleTransition {
  featureId: string;
  stage: UpdateLifecycleStage;
  epoch: number;
}

/**
 * "Every feature progresses through [12 stages]." Mirrors AF-149's real
 * `FeatureLifecycleTracker` shape exactly — `advance` takes no target
 * stage and always moves to the next one internally, structurally
 * incapable of skipping or regressing — the SECOND instance of this
 * shape, typed to its own 12-stage `UpdateLifecycleStage` union.
 */
export class UpdateLifecycleTracker {
  private readonly current = new Map<string, UpdateLifecycleStage>();
  private readonly history: UpdateLifecycleTransition[] = [];

  register(featureId: string, epoch: number): void {
    if (this.current.has(featureId)) return;
    const stage = UPDATE_LIFECYCLE_STAGES[0]!;
    this.current.set(featureId, stage);
    this.history.push({ featureId, stage, epoch });
  }

  advance(featureId: string, epoch: number): UpdateLifecycleStage | null {
    const stage = this.current.get(featureId);
    if (!stage) return null;
    const next = nextUpdateLifecycleStage(stage);
    if (!next) return null;
    this.current.set(featureId, next);
    this.history.push({ featureId, stage: next, epoch });
    return next;
  }

  stageFor(featureId: string): UpdateLifecycleStage | null {
    return this.current.get(featureId) ?? null;
  }

  historyFor(featureId: string): readonly UpdateLifecycleTransition[] {
    return this.history.filter((t) => t.featureId === featureId);
  }
}

export interface DesignHistoryEntry {
  originalIntent: string;
  currentImplementation: string;
  playerReception: string;
  technicalComplexity: number;
  futureOpportunities: string;
  replacementRisk: number;
  epoch: number;
}

/** "Every mechanic records... design history remains permanent."
 * Confirmed genuinely new in domain: no per-mechanic historical ledger
 * of intent/implementation/reception/complexity/opportunity/risk exists
 * anywhere else. Append-only, mirroring AF-135/139's established
 * evolving-history shape. */
export class DesignHistoryLedger {
  private readonly entries = new Map<string, DesignHistoryEntry[]>();

  record(mechanicId: string, entry: Omit<DesignHistoryEntry, "epoch">, epoch: number): void {
    const history = this.entries.get(mechanicId) ?? [];
    history.push({ ...entry, epoch });
    this.entries.set(mechanicId, history);
  }

  latestFor(mechanicId: string): DesignHistoryEntry | null {
    const history = this.entries.get(mechanicId);
    return history && history.length > 0 ? history[history.length - 1]! : null;
  }

  historyFor(mechanicId: string): readonly DesignHistoryEntry[] {
    return this.entries.get(mechanicId) ?? [];
  }
}

export interface TechnicalDebtRecord {
  concern: string;
  description: string;
  epoch: number;
}

/** "Continuously identifies... recommend improvements before problems
 * grow." Confirmed genuinely new — no technical-debt tracker exists
 * anywhere in the codebase. A simple append-only record. */
export class TechnicalDebtLog {
  private readonly records: TechnicalDebtRecord[] = [];

  record(concern: string, description: string, epoch: number): TechnicalDebtRecord {
    const entry: TechnicalDebtRecord = { concern, description, epoch };
    this.records.push(entry);
    return entry;
  }

  all(): readonly TechnicalDebtRecord[] {
    return this.records;
  }
}

export interface UpdateQualityAssessment {
  shouldReject: boolean;
  regressionCount: number;
  qualityImprovementCount: number;
}

/** "Automatically detect [regressions]... prevent degradation" paired
 * with "every update must improve at least one [quality]... no neutral
 * updates." Mirrors AF-149's real `featureFlagAssessment` shape a second
 * time — any regression signal present rejects, regardless of how many
 * qualities improve alongside it. */
export function updateQualityAssessment(activeRegressionSignals: ReadonlySet<RegressionSignal>, improvedQualityCriteria: ReadonlySet<QualityEvolutionCriterion>): UpdateQualityAssessment {
  return { shouldReject: activeRegressionSignals.size > 0, regressionCount: activeRegressionSignals.size, qualityImprovementCount: improvedQualityCriteria.size };
}

/** The TENTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180/182/184/188's real rubrics — same shape,
 * same 9.5 gate, typed to its own `AtlasScorecardCategory` union. */
export class AtlasScorecardCard {
  private readonly scores = new Map<AtlasScorecardCategory, number>();

  score(category: AtlasScorecardCategory, value: number): void {
    this.scores.set(category, Math.max(0, Math.min(10, value)));
  }

  scoreFor(category: AtlasScorecardCategory): number | null {
    return this.scores.get(category) ?? null;
  }

  isComplete(): boolean {
    return ATLAS_SCORECARD_CATEGORIES.every((category) => this.scores.has(category));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const category of ATLAS_SCORECARD_CATEGORIES) total += this.scores.get(category) ?? 0;
    return total / ATLAS_SCORECARD_CATEGORIES.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= ATLAS_SCORECARD_GATE_THRESHOLD;
  }
}
