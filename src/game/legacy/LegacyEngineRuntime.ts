/**
 * LegacyEngineRuntime pieces (AF-133). Real, tested engines behind
 * every genuinely new piece of the Legacy Engine — composing with the
 * locked stack (MetaProgression, GalacticHistoryRuntime, AF-130's
 * EmotionalMemoryLog) rather than duplicating it.
 */
import type { GalacticRecordKind, JournalEntryDef, LegacyCategory, OfficialHistoricalRecord, PersonalGiftDef, PhotoDef, PhotoDestinationKind, PlayerJournalEntryKind, TimeCapsuleDef } from "./legacyEngineData";
import { ANNIVERSARY_CYCLE_EPOCHS, GALACTIC_RECORD_DIRECTIONS, LEGACY_CATEGORIES } from "./legacyEngineData";

/** Legacy only ever grows — awards never decrease a category's XP. */
export class LegacyProgressTracker {
  private readonly xp = new Map<LegacyCategory, number>(LEGACY_CATEGORIES.map((c) => [c, 0]));

  award(category: LegacyCategory, amount: number): void {
    if (amount <= 0) return;
    this.xp.set(category, (this.xp.get(category) ?? 0) + amount);
  }

  xpFor(category: LegacyCategory): number {
    return this.xp.get(category) ?? 0;
  }

  totalXp(): number {
    return [...this.xp.values()].reduce((sum, v) => sum + v, 0);
  }

  /** The category with the most XP; ties resolve to the first-declared category. */
  topCategory(): LegacyCategory {
    let best: LegacyCategory = LEGACY_CATEGORIES[0]!;
    let bestXp = this.xpFor(best);
    for (const category of LEGACY_CATEGORIES) {
      const value = this.xpFor(category);
      if (value > bestXp) {
        best = category;
        bestXp = value;
      }
    }
    return best;
  }
}

/**
 * Official historical records — richer than AF-086's GalacticHistoryRuntime
 * shape (date/planet/commanders/photo/dialogue/news/museum flags), so
 * this is a genuinely new, additive log. When a natural mapping exists,
 * `forwardTo` lets a caller (main.ts) also feed the real, locked
 * GalacticHistoryRuntime.record() — this class never calls it directly
 * and has no dependency on that module.
 */
export class GalacticHistoryLog {
  private readonly records: OfficialHistoricalRecord[] = [];

  constructor(private readonly forwardTo?: (description: string) => void) {}

  record(record: Omit<OfficialHistoricalRecord, "id">): OfficialHistoricalRecord {
    const full: OfficialHistoricalRecord = { ...record, id: `legacy-record-${this.records.length}` };
    this.records.push(full);
    this.forwardTo?.(record.description);
    return full;
  }

  all(): readonly OfficialHistoricalRecord[] {
    return this.records;
  }
}

/** "Every record can eventually be surpassed" — unlike append-only
 * logs, submit() only keeps the best value per kind. */
export interface GalacticRecordEntry {
  kind: GalacticRecordKind;
  value: number;
  holderDescription: string;
}

export class GalacticRecordBoard {
  private readonly records = new Map<GalacticRecordKind, GalacticRecordEntry>();

  /** Returns true if this submission set a new record. Direction (higher
   * or lower is better) depends on the kind — "Fastest expedition" is
   * the sole lower-is-better kind. */
  submit(kind: GalacticRecordKind, value: number, holderDescription: string): boolean {
    const current = this.records.get(kind);
    const direction = GALACTIC_RECORD_DIRECTIONS[kind];
    if (current) {
      const improved = direction === "lower" ? value < current.value : value > current.value;
      if (!improved) return false;
    }
    this.records.set(kind, { kind, value, holderDescription });
    return true;
  }

  recordFor(kind: GalacticRecordKind): GalacticRecordEntry | undefined {
    return this.records.get(kind);
  }

  all(): readonly GalacticRecordEntry[] {
    return [...this.records.values()];
  }
}

/** "Most visited planets" / "most used ship" / greatest victories and
 * defeats — none of this existed anywhere before this module. */
export class PlayerChronicle {
  private readonly planetVisits = new Map<string, number>();
  private readonly shipUses = new Map<string, number>();
  private readonly victories: string[] = [];
  private readonly defeats: string[] = [];

  visitPlanet(planetId: string): void {
    this.planetVisits.set(planetId, (this.planetVisits.get(planetId) ?? 0) + 1);
  }

  useShip(shipId: string): void {
    this.shipUses.set(shipId, (this.shipUses.get(shipId) ?? 0) + 1);
  }

  recordVictory(description: string): void {
    this.victories.push(description);
  }

  recordDefeat(description: string): void {
    this.defeats.push(description);
  }

  favouritePlanet(): string | null {
    return this.mostVisited(this.planetVisits);
  }

  favouriteShip(): string | null {
    return this.mostVisited(this.shipUses);
  }

  victoryCount(): number {
    return this.victories.length;
  }

  defeatCount(): number {
    return this.defeats.length;
  }

  private mostVisited(counts: Map<string, number>): string | null {
    let best: string | null = null;
    let bestCount = 0;
    for (const [id, count] of counts) {
      if (count > bestCount) {
        best = id;
        bestCount = count;
      }
    }
    return best;
  }
}

/** NPC memory that fades for minor events but never for historic ones —
 * a real behavioural difference from AF-130's always-permanent
 * EmotionalMemoryLog, which is why this is a new class rather than a
 * reuse of it. Each subject keeps at most `minorCapacity` non-historic
 * entries (oldest drops first); historic entries are never dropped. */
export interface NpcMemoryEntry {
  kind: string;
  description: string;
  historic: boolean;
}

export class NpcMemoryLog {
  private readonly memories = new Map<string, NpcMemoryEntry[]>();

  constructor(private readonly minorCapacity = 5) {}

  remember(subjectId: string, kind: string, description: string, historic: boolean): void {
    const list = this.memories.get(subjectId) ?? [];
    list.push({ kind, description, historic });
    const minorEntries = list.filter((e) => !e.historic);
    if (minorEntries.length > this.minorCapacity) {
      const oldestMinor = minorEntries[0]!;
      const index = list.indexOf(oldestMinor);
      list.splice(index, 1);
    }
    this.memories.set(subjectId, list);
  }

  memoriesFor(subjectId: string): readonly NpcMemoryEntry[] {
    return this.memories.get(subjectId) ?? [];
  }
}

export class GiftLedger {
  private readonly gifts: PersonalGiftDef[] = [];

  receive(gift: PersonalGiftDef): void {
    this.gifts.push(gift);
  }

  all(): readonly PersonalGiftDef[] {
    return this.gifts;
  }

  fromCommander(commanderId: string): readonly PersonalGiftDef[] {
    return this.gifts.filter((g) => g.commanderId === commanderId);
  }
}

/** Append-only and searchable, per AF-133's own Accessibility section. */
export class PlayerJournalRuntime {
  private readonly entries: JournalEntryDef[] = [];

  write(kind: PlayerJournalEntryKind, text: string): void {
    this.entries.push({ kind, text, sequence: this.entries.length });
  }

  all(): readonly JournalEntryDef[] {
    return this.entries;
  }

  search(query: string): readonly JournalEntryDef[] {
    const needle = query.toLowerCase();
    return this.entries.filter((e) => e.text.toLowerCase().includes(needle));
  }
}

export class PhotoAlbum {
  private readonly photos = new Map<string, PhotoDef>();

  capture(photo: PhotoDef): void {
    this.photos.set(photo.id, photo);
  }

  all(): readonly PhotoDef[] {
    return [...this.photos.values()];
  }

  forDestination(destinationKind: PhotoDestinationKind): readonly PhotoDef[] {
    return this.all().filter((p) => p.destinationKinds.includes(destinationKind));
  }
}

/** "Years later they reopen" — a capsule cannot be reopened the same
 * epoch it was created. */
export class TimeCapsuleVault {
  private readonly capsules = new Map<string, TimeCapsuleDef>();

  create(capsule: TimeCapsuleDef): void {
    this.capsules.set(capsule.id, capsule);
  }

  reopen(id: string, currentEpoch: number): TimeCapsuleDef | null {
    const capsule = this.capsules.get(id);
    if (!capsule) return null;
    if (currentEpoch <= capsule.createdAtEpoch) return null;
    return capsule;
  }

  all(): readonly TimeCapsuleDef[] {
    return [...this.capsules.values()];
  }
}

export function isAnniversary(currentEpoch: number, anchorEpoch: number): boolean {
  const elapsed = currentEpoch - anchorEpoch;
  return elapsed > 0 && elapsed % ANNIVERSARY_CYCLE_EPOCHS === 0;
}

/**
 * Snapshot of a completed save's legacy, meant to be handed to a new
 * profile. SaveProfileManager itself is never modified — this is a
 * pure, composable summary layer over data the caller already has.
 */
export interface LegacyInheritanceSnapshot {
  totalXp: number;
  topCategory: LegacyCategory;
  notableEvents: readonly string[];
}

export function exportLegacySnapshot(tracker: LegacyProgressTracker, history: GalacticHistoryLog): LegacyInheritanceSnapshot {
  return {
    totalXp: tracker.totalXp(),
    topCategory: tracker.topCategory(),
    notableEvents: history.all().map((r) => r.description),
  };
}

/** "The previous expedition restored Helios."-style inherited flavour lines. */
export function inheritedFlavourLines(snapshot: LegacyInheritanceSnapshot): readonly string[] {
  return snapshot.notableEvents.map((event) => `The previous expedition: ${event}`);
}
