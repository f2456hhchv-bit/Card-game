/**
 * WorldModelRuntime pieces (AF-152). The genuinely new core: a per-
 * entity context store, a goal tracker, and a spatial-location tracker.
 * "Memory Model"/"Predictive Reasoning"/"Performance" are deliberately
 * NOT reimplemented here — see `worldModelData.ts` for why AF-133's
 * real `NpcMemoryLog` and AF-144's real `PredictionEngine`/
 * `PriorityEngine` are reused directly at the call site instead.
 */
import type { WorldContext } from "./worldModelData";

/** "Every object stores Identity/Purpose/Current State/Threats/
 * Dependencies/Future Opportunities/Current Importance." Confirmed
 * genuinely new — no unified per-entity context store exists anywhere
 * else in the codebase. */
export class WorldModelRegistry {
  private readonly contexts = new Map<string, WorldContext>();

  register(context: WorldContext): void {
    this.contexts.set(context.entityId, context);
  }

  contextFor(entityId: string): WorldContext | null {
    return this.contexts.get(entityId) ?? null;
  }

  updateImportance(entityId: string, importance: number): void {
    const context = this.contexts.get(entityId);
    if (context) this.contexts.set(entityId, { ...context, currentImportance: Math.max(0, Math.min(100, importance)) });
  }

  all(): readonly WorldContext[] {
    return [...this.contexts.values()];
  }

  /** "Who needs help?" — a real query over real stored threats. */
  entitiesWithThreats(): readonly WorldContext[] {
    return this.all().filter((c) => c.threats.length > 0);
  }

  /** "Which colony is thriving?" — a real query, highest importance first. */
  byImportance(): readonly WorldContext[] {
    return [...this.all()].sort((a, b) => b.currentImportance - a.currentImportance);
  }
}

export interface GoalRecord {
  entityId: string;
  goal: string;
  priority: number;
}

/** "Every entity maintains priorities." Confirmed genuinely new. */
export class GoalTracker {
  private readonly goals = new Map<string, GoalRecord[]>();

  setGoal(entityId: string, goal: string, priority: number): void {
    const list = this.goals.get(entityId) ?? [];
    list.push({ entityId, goal, priority });
    this.goals.set(entityId, list);
  }

  goalsFor(entityId: string): readonly GoalRecord[] {
    return [...(this.goals.get(entityId) ?? [])].sort((a, b) => b.priority - a.priority);
  }

  topGoal(entityId: string): GoalRecord | null {
    return this.goalsFor(entityId)[0] ?? null;
  }
}

/** "Every entity understands current location, nearby entities."
 * Deliberately decoupled from AF-038's real galaxy coordinate system —
 * locations are plain caller-supplied ids, so this module has no
 * import-time dependency on it. */
export class SpatialAwarenessTracker {
  private readonly locationOf = new Map<string, string>();

  setLocation(entityId: string, locationId: string): void {
    this.locationOf.set(entityId, locationId);
  }

  locationFor(entityId: string): string | null {
    return this.locationOf.get(entityId) ?? null;
  }

  entitiesAt(locationId: string): readonly string[] {
    return [...this.locationOf.entries()].filter(([, loc]) => loc === locationId).map(([entityId]) => entityId);
  }
}
