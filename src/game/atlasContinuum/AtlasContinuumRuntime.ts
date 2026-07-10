import type { KnowledgeGraph } from "../knowledgeGraph/KnowledgeGraphRuntime";

interface ThreadRecord {
  entityId: string;
  markedEpoch: number;
}

/** "Every important object becomes a thread... nothing exists in
 * isolation." Confirmed genuinely new (see atlasContinuumData.ts
 * module doc comment): a curation layer distinguishing entities marked
 * as permanently significant from every other node AF-151's real
 * `KnowledgeGraph` already stores uniformly. */
export class ThreadRegistry {
  private readonly threads = new Map<string, ThreadRecord>();

  mark(entityId: string, epoch: number): void {
    this.threads.set(entityId, { entityId, markedEpoch: epoch });
  }

  isThread(entityId: string): boolean {
    return this.threads.has(entityId);
  }

  all(): readonly ThreadRecord[] {
    return [...this.threads.values()];
  }
}

/** "The universe becomes one woven tapestry." Composes AF-151's real
 * `KnowledgeGraph.isIsolated` to verify every marked thread stays
 * connected — never a second edge store, just the structural guarantee
 * this module contributes on top of the real one. */
export function allThreadsConnected(threadIds: readonly string[], graph: KnowledgeGraph): boolean {
  return threadIds.every((id) => !graph.isIsolated(id));
}
