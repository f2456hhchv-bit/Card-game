import type { CommunityMeaningPlaceType } from "./atlasMeaningData";

interface CuratedEntry {
  description: string;
  epoch: number;
}

/** The one generic mechanic behind "Personal Meaning", "Player
 * Meaning" and "Collective Memory" (see atlasMeaningData.ts module doc
 * comment) — a single best-of entry per named category for an entity,
 * overwritten (never appended) as a new favourite emerges, since these
 * are superlatives ("favourite", "proudest") rather than a full
 * history log. */
export class MeaningCurator<TCategory extends string> {
  private readonly entries = new Map<string, Map<TCategory, CuratedEntry>>();

  curate(entityId: string, category: TCategory, description: string, epoch: number): void {
    const categories = this.entries.get(entityId) ?? new Map<TCategory, CuratedEntry>();
    categories.set(category, { description, epoch });
    this.entries.set(entityId, categories);
  }

  entryFor(entityId: string, category: TCategory): CuratedEntry | null {
    return this.entries.get(entityId)?.get(category) ?? null;
  }
}

interface SignificantEntity {
  name: string;
  registeredEpoch: number;
  weight: number;
}

/** The one generic mechanic behind "Symbols" and "Meaning Through
 * Time" (see atlasMeaningData.ts module doc comment) — any named
 * object or event accumulates significance through reinforcing
 * moments (a child learning about it, a book referencing it, ...)
 * rather than being assigned a fixed importance up front. */
export class SignificanceTracker {
  private readonly entities = new Map<string, SignificantEntity>();

  register(entityId: string, name: string, epoch: number): void {
    if (!this.entities.has(entityId)) this.entities.set(entityId, { name, registeredEpoch: epoch, weight: 0 });
  }

  reinforce(entityId: string, _epoch: number): void {
    const entity = this.entities.get(entityId);
    if (entity) entity.weight += 1;
  }

  significanceOf(entityId: string): number {
    return this.entities.get(entityId)?.weight ?? 0;
  }
}

interface CommunityMeaningRecord {
  placeType: CommunityMeaningPlaceType;
  description: string;
  epoch: number;
}

/** "Places become emotionally important." */
export class CommunityMeaningTracker {
  private readonly records = new Map<string, CommunityMeaningRecord>();

  attachMeaning(placeId: string, placeType: CommunityMeaningPlaceType, description: string, epoch: number): void {
    this.records.set(placeId, { placeType, description, epoch });
  }

  meaningOf(placeId: string): CommunityMeaningRecord | null {
    return this.records.get(placeId) ?? null;
  }
}

interface QuietMomentRecord {
  description: string;
  epoch: number;
}

/** "Silence is valuable." A simple append-only record — quiet moments
 * are never scored or ranked, only remembered. */
export class QuietMomentLog {
  private readonly records: QuietMomentRecord[] = [];

  record(description: string, epoch: number): void {
    this.records.push({ description, epoch });
  }

  all(): readonly QuietMomentRecord[] {
    return this.records;
  }
}
