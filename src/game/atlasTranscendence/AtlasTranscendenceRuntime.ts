import type { LibraryCategory, TranscendenceIndexCriterion } from "./atlasTranscendenceData";
import { TRANSCENDENCE_INDEX_CRITERIA, TRANSCENDENCE_INDEX_GATE_THRESHOLD } from "./atlasTranscendenceData";

interface PreservationRecord {
  category: LibraryCategory;
  epoch: number;
}

/** "Preserve every language, species, culture, scientific discovery,
 * work of art, important memory. Nothing worthy is intentionally
 * lost." Confirmed genuinely new (see atlasTranscendenceData.ts
 * module doc comment): this class has no removal method at all —
 * permanence is structural. Preserving the same id twice keeps the
 * original category and epoch, never overwritten. */
export class UniversalLibrary {
  private readonly records = new Map<string, PreservationRecord>();

  preserve(id: string, category: LibraryCategory, epoch: number): void {
    if (this.records.has(id)) return;
    this.records.set(id, { category, epoch });
  }

  isPreserved(id: string): boolean {
    return this.records.has(id);
  }

  categoryOf(id: string): LibraryCategory | null {
    return this.records.get(id)?.category ?? null;
  }

  countForCategory(category: LibraryCategory): number {
    return [...this.records.values()].filter((r) => r.category === category).length;
  }

  all(): ReadonlyMap<string, PreservationRecord> {
    return this.records;
  }
}

/** The SIXTH mirrored scoring-rubric shape in this codebase, after
 * AF-143/149/170/173/179's real rubrics — same shape, same 9.5 gate,
 * typed to its own `TranscendenceIndexCriterion` union (see
 * atlasTranscendenceData.ts module doc comment). */
export class TranscendenceIndexScoreCard {
  private readonly scores = new Map<TranscendenceIndexCriterion, number>();

  score(criterion: TranscendenceIndexCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: TranscendenceIndexCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return TRANSCENDENCE_INDEX_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of TRANSCENDENCE_INDEX_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / TRANSCENDENCE_INDEX_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= TRANSCENDENCE_INDEX_GATE_THRESHOLD;
  }
}
