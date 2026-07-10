/** "Identity influences reputation. Reputation influences opportunity.
 * Opportunity influences future identity. A continuous feedback loop."
 * One generic tracker, keyed by plain entity id and quality string,
 * serves both "Commander Identity" ("the galaxy recognises these
 * qualities") and "Institutional Identity" ("each develops its own
 * reputation") rather than two near-identical trackers — see
 * atlasIdentityData.ts module doc comment. */
export class ReputationTracker {
  private readonly recognitions = new Map<string, Map<string, number>>();

  recognizeFor(entityId: string, quality: string, _epoch: number): void {
    const qualities = this.recognitions.get(entityId) ?? new Map<string, number>();
    qualities.set(quality, (qualities.get(quality) ?? 0) + 1);
    this.recognitions.set(entityId, qualities);
  }

  recognitionCountFor(entityId: string, quality: string): number {
    return this.recognitions.get(entityId)?.get(quality) ?? 0;
  }

  mostRecognizedQuality(entityId: string): string | null {
    const qualities = this.recognitions.get(entityId);
    if (!qualities || qualities.size === 0) return null;
    let best: string | null = null;
    let bestCount = 0;
    for (const [quality, count] of qualities) {
      if (count > bestCount) {
        best = quality;
        bestCount = count;
      }
    }
    return best;
  }
}

interface EarnedTitleRecord {
  title: string;
  epoch: number;
}

/** "The city that rebuilt the oceans"... "identity becomes history."
 * Append-only — a title, once earned, is never replaced or curated
 * away, distinct from AF-163's real `MeaningCurator` (curates a
 * single favourite per category) and AF-135's Chronicle (records what
 * happened, not what an entity is known for). */
export class EarnedTitleTracker {
  private readonly records = new Map<string, EarnedTitleRecord[]>();

  earn(entityId: string, title: string, epoch: number): void {
    const titles = this.records.get(entityId) ?? [];
    titles.push({ title, epoch });
    this.records.set(entityId, titles);
  }

  titlesFor(entityId: string): readonly EarnedTitleRecord[] {
    return this.records.get(entityId) ?? [];
  }
}
