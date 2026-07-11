import type { ExcellenceIndexCategory, ExcellenceStandardQuestion } from "./atlasExcellenceData";
import { EXCELLENCE_INDEX_CATEGORIES, EXCELLENCE_INDEX_GATE_THRESHOLD } from "./atlasExcellenceData";

export interface ExcellenceStandardAssessment {
  shouldContinueRefining: boolean;
  affirmedCount: number;
}

/** "Every meaningful project asks... if yes, continue refining." The
 * SECOND instance of AF-192's real `standardOfExcellenceAssessment`
 * shape, typed to its own `ExcellenceStandardQuestion` union. */
export function excellenceStandardAssessment(affirmed: ReadonlySet<ExcellenceStandardQuestion>): ExcellenceStandardAssessment {
  return { shouldContinueRefining: affirmed.size > 0, affirmedCount: affirmed.size };
}

export interface ImprovementRecord {
  reason: string;
  method: string;
  evidence: string;
  outcome: string;
  educationalValue: string;
  futureOpportunities: string;
  epoch: number;
}

/** "Every improvement records... civilisation learns from improvement
 * itself." Confirmed genuinely new in domain (see
 * atlasExcellenceData.ts module doc comment) — mirrors the established
 * append-only-record-list shape rather than inventing a new one. */
export class ImprovementNetworkLedger {
  private readonly records = new Map<string, ImprovementRecord[]>();

  record(improvementId: string, entry: Omit<ImprovementRecord, "epoch">, epoch: number): void {
    const history = this.records.get(improvementId) ?? [];
    history.push({ ...entry, epoch });
    this.records.set(improvementId, history);
  }

  historyFor(improvementId: string): readonly ImprovementRecord[] {
    return this.records.get(improvementId) ?? [];
  }
}

/** The ELEVENTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179/180/182/184/188/190's real rubrics — same
 * shape, same 9.5 gate, typed to its own `ExcellenceIndexCategory`
 * union. */
export class ExcellenceIndexScoreCard {
  private readonly scores = new Map<ExcellenceIndexCategory, number>();

  score(category: ExcellenceIndexCategory, value: number): void {
    this.scores.set(category, Math.max(0, Math.min(10, value)));
  }

  scoreFor(category: ExcellenceIndexCategory): number | null {
    return this.scores.get(category) ?? null;
  }

  isComplete(): boolean {
    return EXCELLENCE_INDEX_CATEGORIES.every((category) => this.scores.has(category));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const category of EXCELLENCE_INDEX_CATEGORIES) total += this.scores.get(category) ?? 0;
    return total / EXCELLENCE_INDEX_CATEGORIES.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= EXCELLENCE_INDEX_GATE_THRESHOLD;
  }
}
