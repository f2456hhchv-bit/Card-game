import type { AdaptivePlanningTrigger, Plan, PlanMemoryOutcome } from "./atlasPlanningData";

/** Real dependency tracking for "Plan Components: Dependencies" — a
 * plan's dependencies only resolve once every dependency plan is both
 * registered AND marked complete, mirroring AF-150's real dependency-
 * graph philosophy at the plan granularity rather than the module
 * granularity. */
export class PlanRegistry {
  private readonly plans = new Map<string, Plan>();
  private readonly completed = new Set<string>();

  register(plan: Plan): void {
    this.plans.set(plan.id, plan);
  }

  get(id: string): Plan | null {
    return this.plans.get(id) ?? null;
  }

  markComplete(id: string, _epoch: number): void {
    this.completed.add(id);
  }

  isComplete(id: string): boolean {
    return this.completed.has(id);
  }

  dependenciesSatisfied(id: string): boolean {
    const plan = this.plans.get(id);
    if (!plan) return false;
    return plan.dependencies.every((dependencyId) => this.plans.has(dependencyId) && this.completed.has(dependencyId));
  }

  all(): readonly Plan[] {
    return Array.from(this.plans.values());
  }
}

interface PlanAdaptationRecord {
  planId: string;
  trigger: AdaptivePlanningTrigger;
  description: string;
  epoch: number;
}

/** "Plans adapt instead of failing." Confirmed genuinely new — nothing
 * in the codebase already models a plan mutating in response to
 * circumstance at this granularity. */
export class PlanAdaptationLog {
  private readonly records: PlanAdaptationRecord[] = [];

  adapt(planId: string, trigger: AdaptivePlanningTrigger, description: string, epoch: number): void {
    this.records.push({ planId, trigger, description, epoch });
  }

  countFor(trigger: AdaptivePlanningTrigger): number {
    return this.records.filter((r) => r.trigger === trigger).length;
  }

  all(): readonly PlanAdaptationRecord[] {
    return this.records;
  }
}

interface PlanMemoryRecord {
  planId: string;
  outcomes: readonly PlanMemoryOutcome[];
  epoch: number;
}

/** "Completed plans become... civilisation learns." Confirmed
 * genuinely new — nothing already composes completed work into
 * historical/museum/academic outputs at this granularity. */
export class PlanMemoryArchive {
  private readonly records: PlanMemoryRecord[] = [];

  archive(planId: string, outcomes: readonly PlanMemoryOutcome[], epoch: number): void {
    this.records.push({ planId, outcomes, epoch });
  }

  outcomesFor(planId: string): readonly PlanMemoryOutcome[] {
    return this.records.find((r) => r.planId === planId)?.outcomes ?? [];
  }

  all(): readonly PlanMemoryRecord[] {
    return this.records;
  }
}
