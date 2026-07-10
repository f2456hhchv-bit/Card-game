interface HorizonEffectRecord {
  topic: string;
  epoch: number;
}

/** "The more civilisation learns, the more it realises remains
 * unknown. Knowledge expands humility, not certainty." Confirmed
 * genuinely new (see atlasHorizonData.ts module doc comment):
 * `unknownIndex` grows, never shrinks, as recorded knowledge grows —
 * the opposite guarantee from a tracker that resolves toward
 * completion. */
export class HorizonEffectTracker {
  private readonly learned: HorizonEffectRecord[] = [];

  learn(topic: string, epoch: number): void {
    this.learned.push({ topic, epoch });
  }

  knowledgeCount(): number {
    return this.learned.length;
  }

  unknownIndex(): number {
    return this.learned.length + 1;
  }

  all(): readonly HorizonEffectRecord[] {
    return this.learned;
  }
}
