import type { QualityGateCriterion, RealisationStage } from "./atlasRealisationData";
import { QUALITY_GATE_CRITERIA, QUALITY_GATE_THRESHOLD, REALISATION_STAGES } from "./atlasRealisationData";

/** "Ideas become reality through effort. Not instantly. Not
 * automatically. Progress is earned." Confirmed genuinely new (see
 * atlasRealisationData.ts module doc comment): the FIRST tracker in
 * this codebase that structurally rejects out-of-order or
 * skipped-ahead advancement — `advanceTo` only succeeds when the
 * requested stage is exactly the next one in `REALISATION_STAGES`. */
export class RealisationTracker {
  private readonly stageIndex = new Map<string, number>();

  advanceTo(entityId: string, stage: RealisationStage, _epoch: number): boolean {
    const current = this.stageIndex.get(entityId) ?? -1;
    const target = REALISATION_STAGES.indexOf(stage);
    if (target !== current + 1) return false;
    this.stageIndex.set(entityId, target);
    return true;
  }

  currentStageOf(entityId: string): RealisationStage | null {
    const index = this.stageIndex.get(entityId);
    return index === undefined ? null : REALISATION_STAGES[index]!;
  }

  hasReachedStage(entityId: string, stage: RealisationStage): boolean {
    const current = this.stageIndex.get(entityId) ?? -1;
    return current >= REALISATION_STAGES.indexOf(stage);
  }
}

/** The NINTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180/182/184's real rubrics — same shape,
 * same 9.5 gate, typed to its own `QualityGateCriterion` union (see
 * atlasRealisationData.ts module doc comment). */
export class QualityGateScoreCard {
  private readonly scores = new Map<QualityGateCriterion, number>();

  score(criterion: QualityGateCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: QualityGateCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return QUALITY_GATE_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of QUALITY_GATE_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / QUALITY_GATE_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= QUALITY_GATE_THRESHOLD;
  }
}
