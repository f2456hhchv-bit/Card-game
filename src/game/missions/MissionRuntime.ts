/**
 * Mission runtime (AF-037): tracks run-scoped objective progress (a local
 * counter map — mission counters are never persisted, the same distinction
 * AF-035 drew for boss mastery-challenge damage-tracking), grants optional
 * objectives without ever blocking completion, and exposes modifier-derived
 * numeric feeds for AF-017/023's already-reserved hooks. The weighted event
 * timer uses the same algorithm AF-036's BiomeRuntime already implements
 * inline — not extracted into a shared utility, to avoid editing a locked
 * module for a non-bug refactor — but the pattern is reused, not reinvented.
 */
import type { Rng } from "../../core/rng/Rng";
import type { MissionInstance } from "./MissionGenerator";
import type { MissionEventKind, ObjectiveDef } from "./missionData";

export interface MissionSnapshot {
  missionId: string;
  primaryObjectivesComplete: boolean;
  primaryTotal: number;
  primaryDone: number;
  optionalTotal: number;
  optionalDone: number;
  activeModifierKinds: readonly string[];
}

export class MissionRuntime {
  private readonly progress = new Map<string, number>();
  private readonly completedPrimaryIds = new Set<string>();
  private readonly completedOptionalIds = new Set<string>();
  private eventTimerMs = 0;

  constructor(
    private readonly instance: MissionInstance,
    private readonly rng: Rng,
    private readonly eventIntervalMs = 20000,
  ) {
    // A target of 0 means "never let this counter rise above zero" (e.g. No
    // Damage) — it starts satisfied and is revoked the first time it's
    // exceeded, rather than waiting to be "reached" like every other target.
    for (const objective of this.allObjectives()) {
      if (objective.target === 0) {
        (objective.optional ? this.completedOptionalIds : this.completedPrimaryIds).add(objective.id);
      }
    }
  }

  update(fixedDtMs: number): void {
    this.eventTimerMs += fixedDtMs;
  }

  /** Increments a counter and checks every objective watching it. */
  recordProgress(counterKey: string, amount = 1): void {
    this.progress.set(counterKey, (this.progress.get(counterKey) ?? 0) + amount);
    for (const objective of this.allObjectives()) {
      if (objective.counterKey !== counterKey) continue;
      const set = objective.optional ? this.completedOptionalIds : this.completedPrimaryIds;
      if (objective.target === 0) {
        // "Stay under" objective — any increase past zero revokes it, permanently.
        if (this.currentValue(counterKey) > 0) set.delete(objective.id);
      } else if (!set.has(objective.id) && this.currentValue(counterKey) >= objective.target) {
        set.add(objective.id);
      }
    }
  }

  /** Objectives targeting 0 (e.g. "no damage") start satisfied and fail on the first increment above it. */
  private allObjectives(): readonly ObjectiveDef[] {
    return [...this.instance.def.primaryObjectives, ...this.instance.def.optionalObjectives];
  }

  currentValue(counterKey: string): number {
    return this.progress.get(counterKey) ?? 0;
  }

  isComplete(objectiveId: string): boolean {
    return this.completedPrimaryIds.has(objectiveId) || this.completedOptionalIds.has(objectiveId);
  }

  get primaryObjectivesComplete(): boolean {
    return this.instance.def.primaryObjectives.every((objective) => this.completedPrimaryIds.has(objective.id));
  }

  get completedOptionalObjectiveIds(): readonly string[] {
    return [...this.completedOptionalIds];
  }

  /** Returns a newly-fired event kind exactly once per interval, or null. */
  tryTriggerEvent(): MissionEventKind | null {
    const pool = this.instance.def.eventPool;
    if (pool.length === 0 || this.eventTimerMs < this.eventIntervalMs) return null;
    this.eventTimerMs = 0;
    const totalWeight = pool.reduce((sum, event) => sum + event.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    for (const event of pool) {
      roll -= event.weight;
      if (roll <= 0) return event.kind;
    }
    return null;
  }

  /** Feeds AF-017's reserved ThreatInputs.mutatorModifier — baseline 1. */
  get mutatorModifier(): number {
    return 1 + this.instance.activeModifiers.reduce((sum, m) => sum + m.mutatorModifierDelta, 0);
  }

  /** Feeds AF-023's reserved DropContext.mutatorBonus — baseline 0. */
  get lootMutatorBonus(): number {
    return this.instance.activeModifiers.reduce((sum, m) => sum + m.lootMutatorBonusDelta, 0);
  }

  /** Feeds a per-run DirectorTuning.eliteSquadSize override — baseline 0 (no change). */
  get eliteSquadSizeBonus(): number {
    return this.instance.activeModifiers.reduce((sum, m) => sum + m.eliteSquadSizeDelta, 0);
  }

  /** Baseline 1 — applied to XP/loot quantity at the reward ceremony. */
  get rewardMultiplier(): number {
    return 1 + this.instance.activeModifiers.reduce((sum, m) => sum + m.rewardMultiplierDelta, 0);
  }

  get snapshot(): MissionSnapshot {
    return {
      missionId: this.instance.id,
      primaryObjectivesComplete: this.primaryObjectivesComplete,
      primaryTotal: this.instance.def.primaryObjectives.length,
      primaryDone: this.instance.def.primaryObjectives.filter((o) => this.completedPrimaryIds.has(o.id)).length,
      optionalTotal: this.instance.def.optionalObjectives.length,
      optionalDone: this.completedOptionalIds.size,
      activeModifierKinds: this.instance.activeModifiers.map((m) => m.kind),
    };
  }
}
