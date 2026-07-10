import type { CivilisationFailsafeConcern, CivilisationHealthDomain, CivilisationHeartbeatQuestion, ResourcePoolKind } from "./atlasCivilisationOSData";
import { CIVILISATION_FAILSAFE_PRIORITY_ORDER } from "./atlasCivilisationOSData";

/** "Balance competing needs... always prioritise." The SECOND instance
 * of AF-154's real `resolveByFailsafePriority` shape (strict single-
 * highest-priority-match resolver, never an all-must-pass gate), typed
 * to its own `CivilisationFailsafeConcern` union. */
export function resolveByCivilisationFailsafePriority(active: ReadonlySet<CivilisationFailsafeConcern>): CivilisationFailsafeConcern | null {
  return CIVILISATION_FAILSAFE_PRIORITY_ORDER.find((concern) => active.has(concern)) ?? null;
}

/** "Monitor system health... automatically identify weaknesses."
 * Mirrors the SHAPE of AF-144's real `PerformanceBudgetTracker` (report
 * a per-domain score, then rank) but INVERTS its direction: a LOW score
 * is the concern here, not a high one. */
export class CivilisationHealthTracker {
  private readonly scores = new Map<CivilisationHealthDomain, number>();
  private readonly threshold = 50;

  reportHealth(domain: CivilisationHealthDomain, score: number): void {
    this.scores.set(domain, Math.max(0, Math.min(100, score)));
  }

  isWeak(domain: CivilisationHealthDomain): boolean {
    return (this.scores.get(domain) ?? 100) < this.threshold;
  }

  weakestDomains(): readonly CivilisationHealthDomain[] {
    return [...this.scores.entries()]
      .filter(([, score]) => score < this.threshold)
      .sort((a, b) => a[1] - b[1])
      .map(([domain]) => domain);
  }
}

/** "Coordinate researchers, teachers, builders... resources flow
 * intelligently." Confirmed genuinely absent elsewhere: nothing tracks a
 * named pool of resources with allocate/release semantics. */
export class ResourcePoolCoordinator {
  private readonly total = new Map<ResourcePoolKind, number>();
  private readonly allocated = new Map<ResourcePoolKind, number>();

  registerPool(kind: ResourcePoolKind, total: number): void {
    this.total.set(kind, total);
    if (!this.allocated.has(kind)) this.allocated.set(kind, 0);
  }

  allocate(kind: ResourcePoolKind, amount: number): boolean {
    const total = this.total.get(kind) ?? 0;
    const used = this.allocated.get(kind) ?? 0;
    if (used + amount > total) return false;
    this.allocated.set(kind, used + amount);
    return true;
  }

  release(kind: ResourcePoolKind, amount: number): void {
    const used = this.allocated.get(kind) ?? 0;
    this.allocated.set(kind, Math.max(0, used - amount));
  }

  availableFor(kind: ResourcePoolKind): number {
    const total = this.total.get(kind) ?? 0;
    const used = this.allocated.get(kind) ?? 0;
    return total - used;
  }
}

export interface HeartbeatTick {
  epoch: number;
  answers: Partial<Record<CivilisationHeartbeatQuestion, string>>;
}

/** "Every simulation cycle asks... civilisation never stands still."
 * Confirmed genuinely new: an append-only per-cycle log, distinct from
 * AF-185's real `LivingPresentTracker` (the only OVERWRITING tracker in
 * this codebase) since every tick is preserved as history rather than
 * replacing the last. */
export class CivilisationHeartbeat {
  private readonly ticks: HeartbeatTick[] = [];

  tick(epoch: number, answers: Partial<Record<CivilisationHeartbeatQuestion, string>>): void {
    this.ticks.push({ epoch, answers });
  }

  latest(): HeartbeatTick | null {
    return this.ticks.length > 0 ? this.ticks[this.ticks.length - 1]! : null;
  }

  history(): readonly HeartbeatTick[] {
    return this.ticks;
  }
}
