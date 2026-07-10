import type { DiscoverySuggestionKind } from "./atlasIntelligenceData";

interface StageRecord<TStage> {
  stage: TStage;
  epoch: number;
}

/** Drives both AF-155's `INTELLIGENCE_LAYERS` and `LEARNING_LOOP_STAGES`
 * — two similar-but-distinct six-stage cycles (see atlasIntelligenceData.ts
 * module doc comment) — from one generic class rather than two
 * near-identical ones. Cyclic, mirroring AF-154's real
 * `PacingCycleTracker` wrap-around behaviour, but reusable across any
 * closed stage loop rather than hand-typed to one union. */
export class CyclicStageTracker<TStage extends string> {
  private readonly records: StageRecord<TStage>[] = [];

  constructor(private readonly stages: readonly TStage[]) {}

  record(stage: TStage, epoch: number): void {
    this.records.push({ stage, epoch });
  }

  currentStage(): TStage | null {
    return this.records.length > 0 ? this.records[this.records.length - 1]!.stage : null;
  }

  next(stage: TStage): TStage {
    const index = this.stages.indexOf(stage);
    return this.stages[(index + 1) % this.stages.length]!;
  }

  all(): readonly StageRecord<TStage>[] {
    return this.records;
  }
}

interface CollaborativeProblemRecord {
  problemId: string;
  participantIds: readonly string[];
  domain: string;
  epoch: number;
}

/** "Multiple entities solve problems together... knowledge spreads
 * across civilisation." Confirmed genuinely new — no existing
 * multi-participant problem-solving log exists anywhere else. */
export class CollaborativeProblemLog {
  private readonly records: CollaborativeProblemRecord[] = [];

  propose(problemId: string, participantIds: readonly string[], domain: string, epoch: number): void {
    this.records.push({ problemId, participantIds, domain, epoch });
  }

  participantsFor(problemId: string): readonly string[] {
    return this.records.find((r) => r.problemId === problemId)?.participantIds ?? [];
  }

  all(): readonly CollaborativeProblemRecord[] {
    return this.records;
  }
}

interface DiscoverySuggestionRecord {
  kind: DiscoverySuggestionKind;
  description: string;
  epoch: number;
}

/** Mirrors AF-153's real `EmergenceOpportunityLog` append-only shape,
 * but over AF-155's own `DiscoverySuggestionKind` union — the fourth
 * "kind of notable moment" list in this codebase (see
 * atlasIntelligenceData.ts module doc comment). "Potential Commander
 * collaborations" suggestions should be surfaced by composing AF-151's
 * real `KnowledgeGraph.suggestConnections` at the call site, never a
 * second suggestion algorithm. */
export class DiscoverySuggestionLog {
  private readonly records: DiscoverySuggestionRecord[] = [];

  surface(kind: DiscoverySuggestionKind, description: string, epoch: number): void {
    this.records.push({ kind, description, epoch });
  }

  countFor(kind: DiscoverySuggestionKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }

  all(): readonly DiscoverySuggestionRecord[] {
    return this.records;
  }
}
