/**
 * Galaxy runtime (AF-038): route traversal, Fast Travel gating, and
 * weighted Galaxy Event scheduling — the same weighted-pick-on-a-timer
 * pattern AF-036/037 already established twice. Sector Stability/Faction
 * Influence/Exploration% are NOT a new persistence layer: this runtime
 * stays pure and returns clamped deltas; the composition root applies them
 * through AF-026's existing `MetaProgression.recordStat`, namespaced per
 * system, exactly as AF-037 did for Galaxy Impact statistics.
 */
import type { Rng } from "../../core/rng/Rng";
import type { GalaxyDef, GalaxyEventKind, StarSystemDef } from "./galaxyData";

export interface GalaxySnapshot {
  currentSystemId: string;
  currentSystemName: string;
  region: string;
  eventsTriggered: number;
  lastEventKind: GalaxyEventKind | null;
}

export class GalaxyRuntime {
  private currentSystemId: string;
  private eventTimerMs = 0;
  private eventsTriggered = 0;
  private lastEventKind: GalaxyEventKind | null = null;

  constructor(
    private readonly def: GalaxyDef,
    private readonly rng: Rng,
    startSystemId: string,
    private readonly eventIntervalMs = 30000,
  ) {
    this.currentSystemId = startSystemId;
  }

  get currentSystem(): StarSystemDef {
    const system = this.def.systems.find((s) => s.id === this.currentSystemId);
    if (!system) throw new Error(`GalaxyRuntime: unknown current system "${this.currentSystemId}"`);
    return system;
  }

  findSystem(systemId: string): StarSystemDef | null {
    return this.def.systems.find((s) => s.id === systemId) ?? null;
  }

  /** Adjacent systems are always reachable; a Fast-Travel-gated system needs the unlock regardless of adjacency. */
  canTravelTo(systemId: string, fastTravelUnlocked: boolean): boolean {
    const target = this.findSystem(systemId);
    if (!target) return false;
    if (target.requiresFastTravelUnlock && !fastTravelUnlocked) return false;
    if (fastTravelUnlocked) return true;
    return this.currentSystem.connectedSystemIds.includes(systemId);
  }

  travelTo(systemId: string, fastTravelUnlocked: boolean): boolean {
    if (!this.canTravelTo(systemId, fastTravelUnlocked)) return false;
    this.currentSystemId = systemId;
    return true;
  }

  update(fixedDtMs: number): void {
    this.eventTimerMs += fixedDtMs;
  }

  /** Returns a newly-fired event kind exactly once per interval, or null. */
  tryTriggerEvent(): GalaxyEventKind | null {
    if (this.def.events.length === 0 || this.eventTimerMs < this.eventIntervalMs) return null;
    this.eventTimerMs = 0;
    const totalWeight = this.def.events.reduce((sum, event) => sum + event.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    for (const event of this.def.events) {
      roll -= event.weight;
      if (roll <= 0) {
        this.lastEventKind = event.kind;
        this.eventsTriggered += 1;
        return event.kind;
      }
    }
    return null;
  }

  /** Pure clamp — the caller applies the returned delta via meta.recordStat itself. */
  static clampedDelta(current: number, delta: number, min: number, max: number): number {
    const next = Math.min(max, Math.max(min, current + delta));
    return next - current;
  }

  get snapshot(): GalaxySnapshot {
    return {
      currentSystemId: this.currentSystemId,
      currentSystemName: this.currentSystem.name,
      region: this.currentSystem.region,
      eventsTriggered: this.eventsTriggered,
      lastEventKind: this.lastEventKind,
    };
  }
}
