import { PERSONAL_GROWTH_AREAS, type Identity, type PersonalGrowthArea, type ValueExample } from "./atlasConsciousnessData";

interface IdentitySnapshot {
  identity: Identity;
  epoch: number;
}

/** "Identity evolves continuously." A full evolving history per
 * character rather than a single mutable record — mirrors AF-161's
 * real `CommanderBeliefTracker` full-history discipline. */
export class IdentityRegistry {
  private readonly records = new Map<string, IdentitySnapshot[]>();

  record(characterId: string, identity: Identity, epoch: number): void {
    const history = this.records.get(characterId) ?? [];
    history.push({ identity, epoch });
    this.records.set(characterId, history);
  }

  currentIdentityOf(characterId: string): Identity | null {
    const history = this.records.get(characterId);
    return history && history.length > 0 ? history[history.length - 1]!.identity : null;
  }

  history(characterId: string): readonly IdentitySnapshot[] {
    return this.records.get(characterId) ?? [];
  }
}

/** "Values change gradually. Never abruptly." The real constraint
 * this module adds over the recurring domain-vocabulary lists: each
 * update to a value's priority is capped to a maximum delta,
 * regardless of how large a swing the caller requests. */
export class ValuePriorityTracker {
  private static readonly MAX_DELTA_PER_UPDATE = 5;
  private readonly priorities = new Map<string, Map<ValueExample, number>>();

  shiftToward(characterId: string, value: ValueExample, targetPriority: number): void {
    const values = this.priorities.get(characterId) ?? new Map<ValueExample, number>();
    const current = values.get(value) ?? 0;
    const delta = Math.max(-ValuePriorityTracker.MAX_DELTA_PER_UPDATE, Math.min(ValuePriorityTracker.MAX_DELTA_PER_UPDATE, targetPriority - current));
    values.set(value, current + delta);
    this.priorities.set(characterId, values);
  }

  priorityOf(characterId: string, value: ValueExample): number {
    return this.priorities.get(characterId)?.get(value) ?? 0;
  }
}

/** Mirrors AF-160's real `CommanderWisdomTracker` shape, but over this
 * module's own `PersonalGrowthArea` union (see atlasConsciousnessData.ts
 * module doc comment) — never that class's type. */
export class PersonalGrowthTracker {
  private readonly scores = new Map<string, Map<PersonalGrowthArea, number>>();

  develop(characterId: string, area: PersonalGrowthArea, amount: number): void {
    const areas = this.scores.get(characterId) ?? new Map(PERSONAL_GROWTH_AREAS.map((a) => [a, 0]));
    areas.set(area, Math.max(0, Math.min(100, (areas.get(area) ?? 0) + amount)));
    this.scores.set(characterId, areas);
  }

  areaScore(characterId: string, area: PersonalGrowthArea): number {
    return this.scores.get(characterId)?.get(area) ?? 0;
  }

  overallGrowth(characterId: string): number {
    const areas = this.scores.get(characterId);
    if (!areas) return 0;
    return Array.from(areas.values()).reduce((sum, value) => sum + value, 0) / PERSONAL_GROWTH_AREAS.length;
  }
}

/** "Hope gradually returns after setbacks." A bounded 0-100 level per
 * entity — setbacks lower it immediately, recovery raises it only a
 * step at a time. */
export class EmotionalContinuityTracker {
  private readonly hopeLevels = new Map<string, number>();

  setback(entityId: string, severity: number): void {
    const current = this.hopeLevels.get(entityId) ?? 100;
    this.hopeLevels.set(entityId, Math.max(0, current - severity));
  }

  recoverStep(entityId: string, amount: number): void {
    const current = this.hopeLevels.get(entityId) ?? 100;
    this.hopeLevels.set(entityId, Math.min(100, current + amount));
  }

  hopeLevelOf(entityId: string): number {
    return this.hopeLevels.get(entityId) ?? 100;
  }
}
