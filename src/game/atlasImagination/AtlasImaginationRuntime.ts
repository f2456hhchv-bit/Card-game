interface HypothesisRecord {
  description: string;
  proposedEpoch: number;
  groundedEpoch: number | null;
}

/** "Every hypothesis remains grounded in evidence"... "imagination
 * never breaks established science... every extraordinary possibility
 * eventually gains believable scientific grounding." A speculative
 * idea starts ungrounded and only becomes grounded through an
 * explicit later action — confirmed genuinely new (see
 * atlasImaginationData.ts module doc comment): a fundamentally
 * different concept from AF-155's real `rankOptions` (weighs already-
 * known options) and AF-159's real `PossibilityRegistry` (a fully-
 * specified opportunity, not an open guess). */
export class HypothesisTracker {
  private readonly records = new Map<string, HypothesisRecord>();

  propose(id: string, description: string, epoch: number): void {
    this.records.set(id, { description, proposedEpoch: epoch, groundedEpoch: null });
  }

  supportWithEvidence(id: string, epoch: number): void {
    const record = this.records.get(id);
    if (record) record.groundedEpoch = epoch;
  }

  isGrounded(id: string): boolean {
    const record = this.records.get(id);
    return record !== undefined && record.groundedEpoch !== null;
  }

  all(): ReadonlyMap<string, HypothesisRecord> {
    return this.records;
  }
}
