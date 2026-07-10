import type { AscensionIndexCriterion } from "./atlasAscensionData";
import { ASCENSION_INDEX_CRITERIA, ASCENSION_INDEX_GATE_THRESHOLD } from "./atlasAscensionData";

/** "Military dominance is never a primary measure." The FIFTH
 * mirrored scoring-rubric shape in this codebase, after AF-143/149/
 * 170/173's real rubrics — same shape, same 9.5 gate, typed to its own
 * `AscensionIndexCriterion` union, which structurally contains no
 * military/power/strength member at all (see atlasAscensionData.ts
 * module doc comment). */
export class AscensionIndexScoreCard {
  private readonly scores = new Map<AscensionIndexCriterion, number>();

  score(criterion: AscensionIndexCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: AscensionIndexCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return ASCENSION_INDEX_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of ASCENSION_INDEX_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / ASCENSION_INDEX_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= ASCENSION_INDEX_GATE_THRESHOLD;
  }
}
