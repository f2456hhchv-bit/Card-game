import type { EternalArchiveCategory } from "./atlasEternityData";

interface ArchiveRecord {
  category: EternalArchiveCategory;
  epoch: number;
}

/** "Everything remains accessible." The SECOND instance of a
 * permanent, no-removal preservation registry in this codebase, after
 * AF-180's real `UniversalLibrary` — same shape, typed to its own
 * `EternalArchiveCategory` union (see atlasEternityData.ts module doc
 * comment). No removal method exists; a second `preserve` call for an
 * already-preserved id never overwrites the original record. */
export class EternalArchive {
  private readonly records = new Map<string, ArchiveRecord>();

  preserve(id: string, category: EternalArchiveCategory, epoch: number): void {
    if (this.records.has(id)) return;
    this.records.set(id, { category, epoch });
  }

  isPreserved(id: string): boolean {
    return this.records.has(id);
  }

  categoryOf(id: string): EternalArchiveCategory | null {
    return this.records.get(id)?.category ?? null;
  }

  countForCategory(category: EternalArchiveCategory): number {
    return [...this.records.values()].filter((r) => r.category === category).length;
  }

  all(): ReadonlyMap<string, ArchiveRecord> {
    return this.records;
  }
}
