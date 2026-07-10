interface PresentRecord {
  description: string;
  epoch: number;
}

/** "What is happening now? Not only what happened before?" Confirmed
 * genuinely new (see atlasLivingUniverseData.ts module doc comment):
 * the ONLY overwriting tracker in a codebase otherwise built entirely
 * from append-only or write-once permanence. A later `update` call
 * for the same entity intentionally replaces the previous one — "the
 * living present" deliberately never accumulates a version history. */
export class LivingPresentTracker {
  private readonly current = new Map<string, PresentRecord>();

  update(entityId: string, description: string, epoch: number): void {
    this.current.set(entityId, { description, epoch });
  }

  currentActivityOf(entityId: string): string | null {
    return this.current.get(entityId)?.description ?? null;
  }

  lastUpdatedEpoch(entityId: string): number | null {
    return this.current.get(entityId)?.epoch ?? null;
  }
}
