import { DESIGN_ARBITER_CRITERIA, DESIGN_ARBITER_GATE_THRESHOLD, type DesignArbiterCriterion } from "./atlasPrimeDirectiveData";

/** The THIRD scoring rubric in this codebase mirroring AF-143's real
 * `DesignScoreCard`/AF-149's real `AtlasScoreCard` shape (see
 * atlasPrimeDirectiveData.ts module doc comment) — typed to its own
 * `DesignArbiterCriterion` union rather than either real class. */
export class PrimeDirectiveScoreCard {
  private readonly scores = new Map<DesignArbiterCriterion, number>();

  score(criterion: DesignArbiterCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: DesignArbiterCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return DESIGN_ARBITER_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of DESIGN_ARBITER_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / DESIGN_ARBITER_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= DESIGN_ARBITER_GATE_THRESHOLD;
  }
}

export interface OverlapReport {
  shared: readonly string[];
  ratio: number;
}

/** "Redundancy Detector": formalises the exact manual overlap-checking
 * discipline this session's own module-implementation process has
 * performed by hand since AF-145/146 (see atlasPrimeDirectiveData.ts
 * module doc comment) into one reusable function. `ratio` is the
 * fraction of `listA` that reappears verbatim in `listB`. */
export function detectOverlap(listA: readonly string[], listB: readonly string[]): OverlapReport {
  const shared = listA.filter((item) => listB.includes(item));
  return { shared, ratio: listA.length === 0 ? 0 : shared.length / listA.length };
}
