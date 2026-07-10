/**
 * MasterIndexRuntime pieces (AF-150). `topologicalOrderOver` mirrors
 * AF-142's real adjacency-list algorithm exactly — the same fix that
 * corrected an O(n²)-per-registration performance bug in that module —
 * rather than reinventing or regressing to a slower approach.
 */
import type { DependencyRelationKind, MasterCatalogueCategory, MasterIndexEntry, QualityTrackingCategory, RelationshipKind } from "./masterIndexData";

export type MasterIndexRegistrationResult = { ok: true } | { ok: false; reasons: readonly string[] };

function topologicalOrderOver(entries: ReadonlyMap<string, MasterIndexEntry>): string[] | null {
  const ids = [...entries.keys()];
  const dependents = new Map<string, string[]>();
  const remainingDeps = new Map<string, number>();
  for (const id of ids) {
    const realDeps = entries.get(id)!.dependencies.filter((d) => entries.has(d));
    remainingDeps.set(id, realDeps.length);
    for (const dep of realDeps) dependents.set(dep, [...(dependents.get(dep) ?? []), id]);
  }
  const queue = ids.filter((id) => remainingDeps.get(id) === 0);
  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const dependent of dependents.get(id) ?? []) {
      const remaining = remainingDeps.get(dependent)! - 1;
      remainingDeps.set(dependent, remaining);
      if (remaining === 0) queue.push(dependent);
    }
  }
  return order.length === ids.length ? order : null;
}

/**
 * "A single authoritative source of truth... nothing exists without
 * metadata." An all-or-nothing gauntlet at the individual-OBJECT
 * granularity — distinct from AF-142's real `ModuleRegistry`, which
 * registers whole modules.
 */
export class MasterIndexRegistry {
  private readonly entries = new Map<string, MasterIndexEntry>();

  register(entry: MasterIndexEntry): MasterIndexRegistrationResult {
    const reasons: string[] = [];
    if (this.entries.has(entry.id)) reasons.push(`duplicate index id "${entry.id}"`);
    if (entry.dependencies.includes(entry.id)) reasons.push(`entry "${entry.id}" cannot depend on itself`);
    if (reasons.length > 0) return { ok: false, reasons };

    const candidate = new Map(this.entries);
    candidate.set(entry.id, entry);
    if (topologicalOrderOver(candidate) === null) return { ok: false, reasons: [`registering "${entry.id}" would create a dependency cycle`] };

    this.entries.set(entry.id, entry);
    return { ok: true };
  }

  entryFor(id: string): MasterIndexEntry | null {
    return this.entries.get(id) ?? null;
  }

  all(): readonly MasterIndexEntry[] {
    return [...this.entries.values()];
  }

  byCategory(category: MasterCatalogueCategory): readonly MasterIndexEntry[] {
    return this.all().filter((e) => e.category === category);
  }

  /** "Developers can instantly locate..." — a real substring search
   * over id/category/related systems, not a player-facing feature. */
  search(query: string): readonly MasterIndexEntry[] {
    const needle = query.toLowerCase();
    return this.all().filter((e) => e.id.toLowerCase().includes(needle) || e.category.toLowerCase().includes(needle) || e.relatedSystems.some((s) => s.toLowerCase().includes(needle)));
  }

  dependencyOrder(): string[] | null {
    return topologicalOrderOver(this.entries);
  }
}

export interface RelationshipLink {
  fromId: string;
  kind: RelationshipKind;
  toId: string;
}

/** "The entire universe becomes one connected knowledge graph." Append
 * -only edges, queryable in either direction. */
export class RelationshipGraph {
  private readonly links: RelationshipLink[] = [];

  link(fromId: string, kind: RelationshipKind, toId: string): RelationshipLink {
    const entry: RelationshipLink = { fromId, kind, toId };
    this.links.push(entry);
    return entry;
  }

  relatedTo(id: string): readonly RelationshipLink[] {
    return this.links.filter((l) => l.fromId === id || l.toId === id);
  }

  all(): readonly RelationshipLink[] {
    return this.links;
  }
}

export interface DependencyMapEntry {
  fromId: string;
  relation: DependencyRelationKind;
  toId: string;
}

/** "Every system records parent/child/required/optional/expansion/
 * deprecated systems. No hidden dependencies." A richer, typed
 * relation on top of `MasterIndexRegistry`'s flat dependency-cycle
 * check — this never replaces that check, only labels the edges. */
export class DependencyMap {
  private readonly entries: DependencyMapEntry[] = [];

  record(fromId: string, relation: DependencyRelationKind, toId: string): DependencyMapEntry {
    const entry: DependencyMapEntry = { fromId, relation, toId };
    this.entries.push(entry);
    return entry;
  }

  relationsFor(id: string, relation?: DependencyRelationKind): readonly DependencyMapEntry[] {
    return this.entries.filter((e) => e.fromId === id && (relation === undefined || e.relation === relation));
  }

  all(): readonly DependencyMapEntry[] {
    return this.entries;
  }
}

export interface VersionHistoryRecord {
  entryId: string;
  developer: string;
  reason: string;
  systemsAffected: readonly string[];
  epoch: number;
}

/** "Every modification records date/developer/reason/systems affected...
 * history is never deleted." Append-only, confirmed no delete/mutate
 * method exists on the class. */
export class VersionHistoryLedger {
  private readonly records: VersionHistoryRecord[] = [];

  recordChange(entryId: string, developer: string, reason: string, systemsAffected: readonly string[], epoch: number): VersionHistoryRecord {
    const record: VersionHistoryRecord = { entryId, developer, reason, systemsAffected, epoch };
    this.records.push(record);
    return record;
  }

  historyFor(entryId: string): readonly VersionHistoryRecord[] {
    return this.records.filter((r) => r.entryId === entryId);
  }

  all(): readonly VersionHistoryRecord[] {
    return this.records;
  }
}

/**
 * "Every indexed item stores completion status, review score..." Per-
 * category numeric/status tracking keyed by indexed OBJECT id — a
 * different shape than AF-143/149's real per-FEATURE `DesignScoreCard`/
 * `AtlasScoreCard` (both single-feature rubrics), so this is its own
 * new class rather than a third reuse of that shape.
 */
export class QualityTracker {
  private readonly scores = new Map<string, Map<QualityTrackingCategory, number>>();

  setScore(entryId: string, category: QualityTrackingCategory, value: number): void {
    const forEntry = this.scores.get(entryId) ?? new Map<QualityTrackingCategory, number>();
    forEntry.set(category, Math.max(0, Math.min(10, value)));
    this.scores.set(entryId, forEntry);
  }

  scoreFor(entryId: string, category: QualityTrackingCategory): number | null {
    return this.scores.get(entryId)?.get(category) ?? null;
  }

  overallFor(entryId: string): number {
    const forEntry = this.scores.get(entryId);
    if (!forEntry || forEntry.size === 0) return 0;
    let total = 0;
    for (const value of forEntry.values()) total += value;
    return total / forEntry.size;
  }
}
