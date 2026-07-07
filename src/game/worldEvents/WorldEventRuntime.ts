/**
 * Galaxy Event runtime (AF-041): weighted Dynamic Event Generation across
 * all ten Event Categories, using the exact weighted-pick-on-a-timer
 * algorithm AF-036/037/038/039/040 already wrote inline five times —
 * reused here a sixth time rather than extracted into a shared utility, to
 * avoid editing a locked module for a non-bug refactor. Stays pure like
 * every prior *Runtime in this project: it holds no World State of its
 * own. The composition root applies each fired event's ambient World
 * State delta — and any additional Player Participation delta — through
 * AF-026's MetaProgression.recordStat, clamped by AF-038's exact
 * GalaxyRuntime.clampedDelta, exactly mirroring AF-039's reputation and
 * AF-040's Credits.
 */
import type { Rng } from "../../core/rng/Rng";
import type { GalaxyWorldEventDef, WorldEventDef } from "./worldEventData";

export interface WorldEventSnapshot {
  eventsTriggered: number;
  lastEvent: WorldEventDef | null;
}

export class WorldEventRuntime {
  private eventTimerMs = 0;
  private eventsTriggered = 0;
  private lastEvent: WorldEventDef | null = null;

  constructor(
    private readonly def: GalaxyWorldEventDef,
    private readonly rng: Rng,
    private readonly eventIntervalMs = 50000,
  ) {}

  update(fixedDtMs: number): void {
    this.eventTimerMs += fixedDtMs;
  }

  /** Returns a newly-fired World Event exactly once per interval, or null.
   * Deterministic from the runtime's own seeded Rng — the same "world seed"
   * guarantee every generator in this project already makes. */
  tryTriggerEvent(): WorldEventDef | null {
    if (this.def.events.length === 0 || this.eventTimerMs < this.eventIntervalMs) return null;
    this.eventTimerMs = 0;
    const totalWeight = this.def.events.reduce((sum, event) => sum + event.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    for (const event of this.def.events) {
      roll -= event.weight;
      if (roll <= 0) {
        this.lastEvent = event;
        this.eventsTriggered += 1;
        return event;
      }
    }
    return null;
  }

  /** The most recently fired event, available for Player Participation until the next one fires. */
  get currentEvent(): WorldEventDef | null {
    return this.lastEvent;
  }

  get snapshot(): WorldEventSnapshot {
    return { eventsTriggered: this.eventsTriggered, lastEvent: this.lastEvent };
  }
}
