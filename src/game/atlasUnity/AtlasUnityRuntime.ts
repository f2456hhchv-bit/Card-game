import type { UnityIndexCriterion } from "./atlasUnityData";
import { UNITY_INDEX_CRITERIA, UNITY_INDEX_GATE_THRESHOLD } from "./atlasUnityData";

/** The EIGHTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180/182's real rubrics — same shape, same 9.5
 * gate, typed to its own `UnityIndexCriterion` union (see
 * atlasUnityData.ts module doc comment). */
export class UnityIndexScoreCard {
  private readonly scores = new Map<UnityIndexCriterion, number>();

  score(criterion: UnityIndexCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: UnityIndexCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return UNITY_INDEX_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of UNITY_INDEX_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / UNITY_INDEX_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= UNITY_INDEX_GATE_THRESHOLD;
  }
}
