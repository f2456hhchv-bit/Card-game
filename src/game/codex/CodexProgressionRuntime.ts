/**
 * Codex progression + player journal (AF-087). Two small, pure,
 * in-memory runtimes riding ON TOP of AF-043's unchanged binary unlock
 * gate — neither touches `CodexRuntime` or `CodexEntryDef`.
 *
 * `CodexDiscoveryRuntime` is the six-stage monotone lattice (the
 * AF-077/079/084 pattern again): Unknown → Observed → Scanned → Studied
 * → Understood → Mastered. States only ever advance; no removal API.
 * The lattice does not itself check AF-043's `isUnlocked` — the caller
 * (the composition root) only ever advances an entry once it is
 * genuinely unlocked, the same decoupling every prior collection runtime
 * keeps against its own locked engine.
 *
 * `CodexJournalRuntime` is the Player Journal (§Player Journal):
 * pinned entries, bookmarks, favourites, and free-text notes are
 * per-entry curation sets/maps; discovery history and search history
 * are append-only logs (search history bounded — a personal utility
 * list, not the galaxy's permanent memory AF-084/086 already own).
 */
import type { DiscoveryProgressionStage } from "./codexFrameworkData";

export interface CodexDiscoverySnapshot {
  totalTracked: number;
  observedCount: number;
  scannedCount: number;
  studiedCount: number;
  understoodCount: number;
  masteredCount: number;
}

const STAGE_ORDER: Readonly<Record<DiscoveryProgressionStage, number>> = {
  unknown: 0,
  observed: 1,
  scanned: 2,
  studied: 3,
  understood: 4,
  mastered: 5,
};

export class CodexDiscoveryRuntime {
  private readonly stages = new Map<string, DiscoveryProgressionStage>();

  private advanceTo(entryId: string, stage: DiscoveryProgressionStage): boolean {
    const current = this.stages.get(entryId) ?? "unknown";
    if (STAGE_ORDER[stage] <= STAGE_ORDER[current]) return false; // states only advance
    this.stages.set(entryId, stage);
    return true;
  }

  recordObserved(entryId: string): boolean {
    return this.advanceTo(entryId, "observed");
  }

  recordScanned(entryId: string): boolean {
    return this.advanceTo(entryId, "scanned");
  }

  recordStudied(entryId: string): boolean {
    return this.advanceTo(entryId, "studied");
  }

  recordUnderstood(entryId: string): boolean {
    return this.advanceTo(entryId, "understood");
  }

  recordMastered(entryId: string): boolean {
    return this.advanceTo(entryId, "mastered");
  }

  stageOf(entryId: string): DiscoveryProgressionStage {
    return this.stages.get(entryId) ?? "unknown";
  }

  get snapshot(): CodexDiscoverySnapshot {
    let observed = 0;
    let scanned = 0;
    let studied = 0;
    let understood = 0;
    let mastered = 0;
    for (const stage of this.stages.values()) {
      if (STAGE_ORDER[stage] >= STAGE_ORDER.observed) observed += 1;
      if (STAGE_ORDER[stage] >= STAGE_ORDER.scanned) scanned += 1;
      if (STAGE_ORDER[stage] >= STAGE_ORDER.studied) studied += 1;
      if (STAGE_ORDER[stage] >= STAGE_ORDER.understood) understood += 1;
      if (stage === "mastered") mastered += 1;
    }
    return {
      totalTracked: this.stages.size,
      observedCount: observed,
      scannedCount: scanned,
      studiedCount: studied,
      understoodCount: understood,
      masteredCount: mastered,
    };
  }
}

export interface DiscoveryHistoryRecord {
  sequence: number;
  entryId: string;
  stage: DiscoveryProgressionStage;
}

export interface SearchHistoryRecord {
  sequence: number;
  query: string;
}

export interface CodexJournalSnapshot {
  pinnedCount: number;
  bookmarkedCount: number;
  favouriteCount: number;
  noteCount: number;
  discoveryHistoryLength: number;
  searchHistoryLength: number;
}

/** The bound on Search History — a personal convenience list, capped so it
 * never grows without limit; the oldest query is dropped, never the log
 * corrupted. Distinct in kind from AF-084/086's permanent galaxy history. */
export const SEARCH_HISTORY_CAP = 50;

export class CodexJournalRuntime {
  private readonly pinned = new Set<string>();
  private readonly bookmarked = new Set<string>();
  private readonly favourites = new Set<string>();
  private readonly notes = new Map<string, string>();
  private readonly discoveryHistory: DiscoveryHistoryRecord[] = [];
  private readonly searchHistory: SearchHistoryRecord[] = [];

  togglePin(entryId: string): boolean {
    if (this.pinned.has(entryId)) {
      this.pinned.delete(entryId);
      return false;
    }
    this.pinned.add(entryId);
    return true;
  }

  toggleBookmark(entryId: string): boolean {
    if (this.bookmarked.has(entryId)) {
      this.bookmarked.delete(entryId);
      return false;
    }
    this.bookmarked.add(entryId);
    return true;
  }

  toggleFavourite(entryId: string): boolean {
    if (this.favourites.has(entryId)) {
      this.favourites.delete(entryId);
      return false;
    }
    this.favourites.add(entryId);
    return true;
  }

  setNote(entryId: string, text: string): void {
    if (text.length === 0) this.notes.delete(entryId);
    else this.notes.set(entryId, text);
  }

  noteFor(entryId: string): string | null {
    return this.notes.get(entryId) ?? null;
  }

  isPinned(entryId: string): boolean {
    return this.pinned.has(entryId);
  }

  isBookmarked(entryId: string): boolean {
    return this.bookmarked.has(entryId);
  }

  isFavourite(entryId: string): boolean {
    return this.favourites.has(entryId);
  }

  get pinnedIds(): readonly string[] {
    return [...this.pinned];
  }

  get bookmarkedIds(): readonly string[] {
    return [...this.bookmarked];
  }

  get favouriteIds(): readonly string[] {
    return [...this.favourites];
  }

  /** Discovery History — permanent, append-only (this is the player's own
   * record of progression events, distinct from the galaxy's history). */
  recordDiscoveryEvent(entryId: string, stage: DiscoveryProgressionStage): DiscoveryHistoryRecord {
    const record: DiscoveryHistoryRecord = { sequence: this.discoveryHistory.length + 1, entryId, stage };
    this.discoveryHistory.push(record);
    return record;
  }

  get discoveryHistoryTimeline(): readonly DiscoveryHistoryRecord[] {
    return this.discoveryHistory;
  }

  /** Search History — bounded; the oldest query drops once the cap is
   * reached (a convenience list, never a permanent record). */
  recordSearch(query: string): void {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    this.searchHistory.push({ sequence: this.searchHistory.length + 1, query: trimmed });
    if (this.searchHistory.length > SEARCH_HISTORY_CAP) this.searchHistory.shift();
  }

  get searchHistoryList(): readonly SearchHistoryRecord[] {
    return this.searchHistory;
  }

  get snapshot(): CodexJournalSnapshot {
    return {
      pinnedCount: this.pinned.size,
      bookmarkedCount: this.bookmarked.size,
      favouriteCount: this.favourites.size,
      noteCount: this.notes.size,
      discoveryHistoryLength: this.discoveryHistory.length,
      searchHistoryLength: this.searchHistory.length,
    };
  }
}
