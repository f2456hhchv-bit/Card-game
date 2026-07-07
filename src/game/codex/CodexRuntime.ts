/**
 * Codex runtime (AF-043): pure reads over the discovery state AF-026's
 * MetaProgression and AF-042's CollectionLedger already track — never a
 * new unlock flag, never a new persistence layer. Search, the Timeline
 * view, Missing Links, Discovery %, and Section Completion are the
 * genuinely new mechanical surfaces; every one of them is a pure function
 * of the existing entry list plus an `isUnlocked` check.
 */
import type { CollectionCategory } from "../meta/metaData";
import type { ExtraCollectionCategory } from "../achievements/achievementData";
import type { CodexCategory, CodexEntryDef } from "./codexData";
import { CODEX_CATEGORIES } from "./codexData";

export interface CodexUnlockReader {
  hasDiscovered(category: CollectionCategory, id: string): boolean;
  hasExtraDiscovered(category: ExtraCollectionCategory, id: string): boolean;
}

export class CodexRuntime {
  constructor(private readonly entries: readonly CodexEntryDef[]) {}

  get all(): readonly CodexEntryDef[] {
    return this.entries;
  }

  findEntry(id: string): CodexEntryDef | null {
    return this.entries.find((e) => e.id === id) ?? null;
  }

  isUnlocked(entry: CodexEntryDef, reader: CodexUnlockReader): boolean {
    const unlock = entry.unlock;
    if (unlock.kind === "alwaysUnlocked") return true;
    if (unlock.kind === "collection") return reader.hasDiscovered(unlock.category, unlock.id);
    return reader.hasExtraDiscovered(unlock.category, unlock.id);
  }

  unlockedEntries(reader: CodexUnlockReader): readonly CodexEntryDef[] {
    return this.entries.filter((entry) => this.isUnlocked(entry, reader));
  }

  entriesByCategory(category: CodexCategory): readonly CodexEntryDef[] {
    return this.entries.filter((entry) => entry.category === category);
  }

  /** Timeline entries, unlocked only, ordered by their authored position. */
  timeline(reader: CodexUnlockReader): readonly CodexEntryDef[] {
    return this.entriesByCategory("timeline")
      .filter((entry) => this.isUnlocked(entry, reader))
      .slice()
      .sort((a, b) => (a.timelinePosition ?? 0) - (b.timelinePosition ?? 0));
  }

  /** Interconnected Knowledge — resolved, existing related entries only. */
  relatedEntries(entry: CodexEntryDef): readonly CodexEntryDef[] {
    return entry.relatedEntryIds
      .map((id) => this.findEntry(id))
      .filter((e): e is CodexEntryDef => e !== null);
  }

  /** Missing Links (AF-043 §DEBUG) — relatedEntryIds pointing at an id that doesn't exist. */
  missingLinkCount(): number {
    let missing = 0;
    for (const entry of this.entries) {
      for (const id of entry.relatedEntryIds) {
        if (!this.entries.some((e) => e.id === id)) missing += 1;
      }
    }
    return missing;
  }

  /** Discovery % (AF-043 §DEBUG) — unlocked entries over total. */
  discoveryPercent(reader: CodexUnlockReader): number {
    if (this.entries.length === 0) return 0;
    return (this.unlockedEntries(reader).length / this.entries.length) * 100;
  }

  /** Search — Name/Category/Keyword/Partial Match, case-insensitive, unlocked entries only. */
  search(query: string, reader: CodexUnlockReader): readonly CodexEntryDef[] {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return this.unlockedEntries(reader).filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.lore.summary.toLowerCase().includes(q),
    );
  }

  /** Newly-100%-unlocked Codex sections the caller hasn't already recorded as complete. */
  checkSectionCompletions(reader: CodexUnlockReader, alreadyCompleted: (category: CodexCategory) => boolean): readonly CodexCategory[] {
    const completed: CodexCategory[] = [];
    for (const category of CODEX_CATEGORIES) {
      if (alreadyCompleted(category)) continue;
      const entriesInCategory = this.entriesByCategory(category);
      if (entriesInCategory.length === 0) continue;
      if (entriesInCategory.every((entry) => this.isUnlocked(entry, reader))) completed.push(category);
    }
    return completed;
  }
}
