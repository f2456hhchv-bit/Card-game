/**
 * Faction relationship + event engine (AF-039). Reputation and the ten
 * Faction Attributes persist entirely through AF-026's
 * MetaProgression.recordStat at the composition root, clamped by AF-038's
 * exact GalaxyRuntime.clampedDelta — imported and reused directly, not
 * reimplemented. This runtime stays pure: it only tracks in-memory
 * inter-faction relationships (Conflict System) and the weighted Faction
 * Event timer, mirroring GalaxyRuntime's discipline exactly — the same
 * weighted-pick-on-a-timer algorithm, written inline a fifth time
 * (AF-036/037/038 precedent) rather than extracted into a shared utility.
 */
import type { Rng } from "../../core/rng/Rng";
import {
  REPUTATION_LEVEL_THRESHOLDS,
  REPUTATION_LEVELS,
  type ConflictState,
  type FactionDef,
  type FactionEventKind,
  type FactionId,
  type FactionMissionDef,
  type FactionRosterDef,
  type ReputationLevel,
} from "./factionData";

function pairKey(a: FactionId, b: FactionId): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export interface FactionSnapshot {
  eventsTriggered: number;
  lastEventKind: FactionEventKind | null;
}

export class FactionRuntime {
  private readonly relationships = new Map<string, ConflictState>();
  private eventTimerMs = 0;
  private eventsTriggered = 0;
  private lastEventKind: FactionEventKind | null = null;

  constructor(
    private readonly def: FactionRosterDef,
    private readonly rng: Rng,
    private readonly eventIntervalMs = 45000,
  ) {
    for (const [key, state] of Object.entries(def.initialRelationships)) {
      this.relationships.set(key, state);
    }
  }

  findFaction(factionId: string): FactionDef | null {
    return this.def.factions.find((f) => f.id === factionId) ?? null;
  }

  findFactionByName(name: string): FactionDef | null {
    return this.def.factions.find((f) => f.name === name) ?? null;
  }

  missionsFor(factionId: FactionId): readonly FactionMissionDef[] {
    return this.def.missions.filter((m) => m.factionId === factionId);
  }

  /** Two factions are always in alliance with themselves; every other pair falls back to the roster default. */
  relationshipBetween(a: FactionId, b: FactionId): ConflictState {
    if (a === b) return "alliance";
    return this.relationships.get(pairKey(a, b)) ?? this.def.defaultRelationship;
  }

  setRelationship(a: FactionId, b: FactionId, state: ConflictState): void {
    if (a === b) return;
    this.relationships.set(pairKey(a, b), state);
  }

  update(fixedDtMs: number): void {
    this.eventTimerMs += fixedDtMs;
  }

  /** Returns a newly-fired event kind exactly once per interval, or null. */
  tryTriggerEvent(): FactionEventKind | null {
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

  /** Pure threshold lookup — Reputation Levels are a read of the persisted stat, not runtime state. */
  static reputationLevel(value: number): ReputationLevel {
    let level = 0;
    for (const threshold of REPUTATION_LEVEL_THRESHOLDS) {
      if (value < threshold) break;
      level += 1;
    }
    return REPUTATION_LEVELS[level]!;
  }

  get snapshot(): FactionSnapshot {
    return { eventsTriggered: this.eventsTriggered, lastEventKind: this.lastEventKind };
  }
}
