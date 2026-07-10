import type { HarmonyDomain, HarmonyIndexCriterion } from "./atlasHarmonyData";
import { HARMONY_DOMAINS, HARMONY_INDEX_CRITERIA, HARMONY_INDEX_GATE_THRESHOLD } from "./atlasHarmonyData";

/** "No single domain should permanently dominate another... balance
 * changes gradually. Not static." Mirrors AF-166's real
 * `ValuePriorityTracker`'s capped-delta-per-update constraint, but at
 * civilisation scale over `HarmonyDomain` (see atlasHarmonyData.ts
 * module doc comment). `mostDominantDomain`/`mostNeglectedDomain`/
 * `isBalanced` read the emergent spread across all tracked domains —
 * confirmed genuinely new, never a fixed-criterion quality gate. */
export class HarmonyTracker {
  private static readonly MAX_DELTA_PER_UPDATE = 5;
  private static readonly BALANCE_SPREAD_THRESHOLD = 20;
  private readonly levels = new Map<HarmonyDomain, number>();

  adjustToward(domain: HarmonyDomain, target: number): void {
    const current = this.levels.get(domain) ?? 50;
    const delta = Math.max(-HarmonyTracker.MAX_DELTA_PER_UPDATE, Math.min(HarmonyTracker.MAX_DELTA_PER_UPDATE, target - current));
    this.levels.set(domain, current + delta);
  }

  levelOf(domain: HarmonyDomain): number {
    return this.levels.get(domain) ?? 50;
  }

  mostDominantDomain(): HarmonyDomain | null {
    if (this.levels.size === 0) return null;
    return HARMONY_DOMAINS.reduce((best, domain) => (this.levelOf(domain) > this.levelOf(best) ? domain : best), HARMONY_DOMAINS[0]!);
  }

  mostNeglectedDomain(): HarmonyDomain | null {
    if (this.levels.size === 0) return null;
    return HARMONY_DOMAINS.reduce((worst, domain) => (this.levelOf(domain) < this.levelOf(worst) ? domain : worst), HARMONY_DOMAINS[0]!);
  }

  isBalanced(): boolean {
    if (this.levels.size === 0) return true;
    const values = HARMONY_DOMAINS.map((domain) => this.levelOf(domain));
    return Math.max(...values) - Math.min(...values) <= HarmonyTracker.BALANCE_SPREAD_THRESHOLD;
  }
}

/** The SEVENTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180's real rubrics — same shape, same 9.5
 * gate, typed to its own `HarmonyIndexCriterion` union (see
 * atlasHarmonyData.ts module doc comment). */
export class HarmonyIndexScoreCard {
  private readonly scores = new Map<HarmonyIndexCriterion, number>();

  score(criterion: HarmonyIndexCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: HarmonyIndexCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return HARMONY_INDEX_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of HARMONY_INDEX_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / HARMONY_INDEX_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= HARMONY_INDEX_GATE_THRESHOLD;
  }
}
