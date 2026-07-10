import type { RenaissanceTrigger } from "./atlasRenaissanceData";

interface TriggerRecord {
  kind: RenaissanceTrigger;
  epoch: number;
}

interface AgeRecord {
  startEpoch: number;
  endEpoch: number | null;
}

/** "A renaissance cannot be forced... it emerges when knowledge,
 * leadership, creativity, education, opportunity, cooperation and hope
 * all align together... multiple triggers compound together."
 * Confirmed genuinely new (see atlasRenaissanceData.ts module doc
 * comment): a golden age begins only once enough DISTINCT trigger
 * kinds have accumulated since the last conclusion — recording the
 * same trigger kind repeatedly never compounds. "Renaissances conclude
 * naturally, not through collapse, through maturity" — `concludeAge`
 * is always an explicit call, never an automatic decay. */
export class RenaissanceTracker {
  private static readonly COMPOUND_THRESHOLD = 3;
  private readonly triggers: TriggerRecord[] = [];
  private readonly records: AgeRecord[] = [];

  recordTrigger(kind: RenaissanceTrigger, epoch: number): void {
    this.triggers.push({ kind, epoch });
    if (!this.isGoldenAge() && this.distinctTriggerKindsSinceLastConclusion() >= RenaissanceTracker.COMPOUND_THRESHOLD) {
      this.records.push({ startEpoch: epoch, endEpoch: null });
    }
  }

  concludeAge(epoch: number): void {
    const active = this.records[this.records.length - 1];
    if (active && active.endEpoch === null) active.endEpoch = epoch;
  }

  isGoldenAge(): boolean {
    const active = this.records[this.records.length - 1];
    return active !== undefined && active.endEpoch === null;
  }

  distinctTriggerKindsSinceLastConclusion(): number {
    const lastConcluded = [...this.records].reverse().find((a) => a.endEpoch !== null)?.endEpoch ?? -Infinity;
    const relevant = this.triggers.filter((t) => t.epoch >= lastConcluded);
    return new Set(relevant.map((t) => t.kind)).size;
  }

  ages(): readonly AgeRecord[] {
    return this.records;
  }
}
