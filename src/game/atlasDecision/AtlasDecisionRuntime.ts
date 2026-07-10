interface DecisionRecord {
  domain: string;
  decisionKind: string;
  chosenOptionId: string;
  confidence: number;
  epoch: number;
}

/** A single append-only ledger across all seven Decision domains
 * (Commander/Citizen/Colony/Research/Exploration/Wildlife/Social),
 * tagged by plain domain/decisionKind strings rather than seven
 * near-identical classes. `isRepetitive` mirrors AF-153/154's real
 * "same value across the whole window" stall/imbalance check
 * (`EmotionalPacingTracker.imbalancedCategory`/`PacingCycleTracker.isStalled`),
 * generalised here to satisfy this module's own self-review directive
 * ("eliminate repetitive choices") across any domain. */
export class DecisionLog {
  private readonly records: DecisionRecord[] = [];

  record(domain: string, decisionKind: string, chosenOptionId: string, confidence: number, epoch: number): void {
    this.records.push({ domain, decisionKind, chosenOptionId, confidence, epoch });
  }

  forDomain(domain: string): readonly DecisionRecord[] {
    return this.records.filter((r) => r.domain === domain);
  }

  isRepetitive(domain: string, windowSize = 5): boolean {
    const recent = this.forDomain(domain).slice(-windowSize);
    if (recent.length < windowSize) return false;
    return recent.every((r) => r.chosenOptionId === recent[0]!.chosenOptionId);
  }

  all(): readonly DecisionRecord[] {
    return this.records;
  }
}
