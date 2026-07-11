import type { PossibilityIndexCategory } from "./atlasOpenPossibilityData";
import { POSSIBILITY_INDEX_CATEGORIES, POSSIBILITY_INDEX_GATE_THRESHOLD } from "./atlasOpenPossibilityData";

/** The TWELFTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180/182/184/188/190/193's real rubrics — same
 * shape, same 9.5 gate, typed to its own `PossibilityIndexCategory`
 * union. */
export class PossibilityIndexScoreCard {
  private readonly scores = new Map<PossibilityIndexCategory, number>();

  score(category: PossibilityIndexCategory, value: number): void {
    this.scores.set(category, Math.max(0, Math.min(10, value)));
  }

  scoreFor(category: PossibilityIndexCategory): number | null {
    return this.scores.get(category) ?? null;
  }

  isComplete(): boolean {
    return POSSIBILITY_INDEX_CATEGORIES.every((category) => this.scores.has(category));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const category of POSSIBILITY_INDEX_CATEGORIES) total += this.scores.get(category) ?? 0;
    return total / POSSIBILITY_INDEX_CATEGORIES.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= POSSIBILITY_INDEX_GATE_THRESHOLD;
  }
}
