/**
 * Collection Ledger (AF-042): the one genuinely new persistence surface
 * this module adds, deliberately scoped to exactly the two Collection
 * categories nothing else already tracks (Resources, Ancient Artefacts)
 * plus the Discovery Log AF-026's plain `discover(category, id)` never
 * captured (date/mission/biome/sector/commander/ship context). Mirrors
 * MetaProgression's own idempotent discover()/hasDiscovered() shape rather
 * than inventing a different one. The Discovery Log is capped — a bounded
 * recent-history list, never an unbounded growing database.
 */
import { EXTRA_COLLECTION_CATEGORIES, type DiscoveryLogEntry, type ExtraCollectionCategory } from "./achievementData";

const DISCOVERY_LOG_CAP = 50;

export interface CollectionLedgerSaveData {
  extraCollections: Partial<Record<ExtraCollectionCategory, string[]>>;
  discoveryLog: DiscoveryLogEntry[];
}

export class CollectionLedger {
  private readonly extraCollections = new Map<ExtraCollectionCategory, Set<string>>();
  private discoveryLog: DiscoveryLogEntry[] = [];

  /** Returns true only on first discovery — the same idempotence guarantee AF-026's discover() makes. */
  discover(category: ExtraCollectionCategory, id: string): boolean {
    let set = this.extraCollections.get(category);
    if (!set) {
      set = new Set();
      this.extraCollections.set(category, set);
    }
    if (set.has(id)) return false;
    set.add(id);
    return true;
  }

  hasDiscovered(category: ExtraCollectionCategory, id: string): boolean {
    return this.extraCollections.get(category)?.has(id) ?? false;
  }

  collectionCount(category: ExtraCollectionCategory): number {
    return this.extraCollections.get(category)?.size ?? 0;
  }

  recordDiscovery(entry: DiscoveryLogEntry): void {
    this.discoveryLog.push(entry);
    if (this.discoveryLog.length > DISCOVERY_LOG_CAP) this.discoveryLog.shift();
  }

  get recentDiscoveries(): readonly DiscoveryLogEntry[] {
    return this.discoveryLog;
  }

  toSave(): CollectionLedgerSaveData {
    const extraCollections: Partial<Record<ExtraCollectionCategory, string[]>> = {};
    for (const [category, set] of this.extraCollections) extraCollections[category] = [...set].sort();
    return { extraCollections, discoveryLog: [...this.discoveryLog] };
  }

  loadSave(data: CollectionLedgerSaveData): void {
    this.extraCollections.clear();
    for (const category of EXTRA_COLLECTION_CATEGORIES) {
      const ids = data.extraCollections[category];
      if (ids) this.extraCollections.set(category, new Set(ids));
    }
    this.discoveryLog = data.discoveryLog.slice(-DISCOVERY_LOG_CAP);
  }
}
