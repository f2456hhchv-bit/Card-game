import type { FutureMemoryOutcome, OpportunityAnalysisKind, RiskAnalysisKind } from "./atlasFutureData";

interface RiskRecord {
  entityId: string;
  riskKind: RiskAnalysisKind;
  severity: number;
  epoch: number;
}

/** "Risk creates preparation. Not punishment." Confirmed genuinely new
 * — no existing per-entity risk-severity log at this granularity. */
export class RiskLog {
  private readonly records: RiskRecord[] = [];

  flag(entityId: string, riskKind: RiskAnalysisKind, severity: number, epoch: number): void {
    this.records.push({ entityId, riskKind, severity: Math.max(0, Math.min(1, severity)), epoch });
  }

  severityFor(entityId: string, riskKind: RiskAnalysisKind): number {
    const matching = this.records.filter((r) => r.entityId === entityId && r.riskKind === riskKind);
    return matching.length > 0 ? matching[matching.length - 1]!.severity : 0;
  }

  all(): readonly RiskRecord[] {
    return this.records;
  }
}

interface OpportunityRecord {
  kind: OpportunityAnalysisKind;
  description: string;
  epoch: number;
}

/** Mirrors AF-155's real `DiscoverySuggestionLog` append-only shape,
 * but over this module's own `OpportunityAnalysisKind` union — that
 * class is hand-typed to its own closed union, not a reusable generic
 * (see atlasFutureData.ts module doc comment). */
export class OpportunityLog {
  private readonly records: OpportunityRecord[] = [];

  surface(kind: OpportunityAnalysisKind, description: string, epoch: number): void {
    this.records.push({ kind, description, epoch });
  }

  countFor(kind: OpportunityAnalysisKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }

  all(): readonly OpportunityRecord[] {
    return this.records;
  }
}

interface FutureMemoryRecord {
  forecastId: string;
  outcomes: readonly FutureMemoryOutcome[];
  epoch: number;
}

/** Mirrors AF-157's real `PlanMemoryArchive` shape, but over this
 * module's own `FutureMemoryOutcome` union (see module doc comment for
 * the exact overlap/difference against AF-157's real
 * `PLAN_MEMORY_OUTCOMES`). */
export class FutureMemoryArchive {
  private readonly records: FutureMemoryRecord[] = [];

  archive(forecastId: string, outcomes: readonly FutureMemoryOutcome[], epoch: number): void {
    this.records.push({ forecastId, outcomes, epoch });
  }

  outcomesFor(forecastId: string): readonly FutureMemoryOutcome[] {
    return this.records.find((r) => r.forecastId === forecastId)?.outcomes ?? [];
  }

  all(): readonly FutureMemoryRecord[] {
    return this.records;
  }
}
