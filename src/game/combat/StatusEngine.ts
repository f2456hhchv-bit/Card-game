/**
 * Status effect engine (AF-021 §2). Data-ruled statuses with stacking,
 * DoT ticks, immunities, resistance-reduced durations, and the AF-020
 * movement bridge: combat requests movement effects, never reimplements
 * them (no duplicated functionality).
 */
import type { MovementModifier } from "../movement/movementTuning";
import {
  STATUS_RULES,
  type ResistanceKind,
  type StatusKind,
} from "./combatTuning";

export interface StatusApplication {
  kind: StatusKind;
  /** Effect magnitude — DoT ticks derive from it per the status rule. */
  strength: number;
  durationMs: number;
}

interface ActiveStatus {
  kind: StatusKind;
  strength: number;
  remainingMs: number;
  stacks: number;
  tickClockMs: number;
}

export interface StatusSnapshot {
  kind: StatusKind;
  stacks: number;
  remainingMs: number;
  strength: number;
}

export interface StatusEngineOptions {
  /** DoT ticks feed damage here (routes into the defence model). */
  onTickDamage?: (kind: StatusKind, amount: number) => void;
  onApplied?: (kind: StatusKind) => void;
  onExpired?: (kind: StatusKind) => void;
}

export class StatusEngine {
  private readonly active: ActiveStatus[] = [];
  private readonly immunities = new Set<StatusKind>();

  constructor(private readonly options: StatusEngineOptions = {}) {}

  setImmunity(kind: StatusKind, immune: boolean): void {
    if (immune) this.immunities.add(kind);
    else this.immunities.delete(kind);
  }

  /**
   * Apply a status. Resistance reduces duration proportionally; immunity
   * blocks outright. Stacking follows the status rule. Returns applied?
   */
  apply(
    application: StatusApplication,
    resistances: Partial<Record<ResistanceKind, number>> = {},
  ): boolean {
    if (this.immunities.has(application.kind)) return false;
    const rule = STATUS_RULES[application.kind];

    let durationMs = application.durationMs;
    if (rule.resistance) {
      const resistance = Math.min(0.75, Math.max(0, resistances[rule.resistance] ?? 0));
      durationMs *= 1 - resistance;
    }
    if (durationMs <= 0) return false;

    const existing = this.active.find((s) => s.kind === application.kind);
    if (!existing) {
      this.active.push({
        kind: application.kind,
        strength: application.strength,
        remainingMs: durationMs,
        stacks: 1,
        tickClockMs: 0,
      });
    } else {
      switch (rule.stacking) {
        case "refresh":
          existing.remainingMs = Math.max(existing.remainingMs, durationMs);
          existing.strength = Math.max(existing.strength, application.strength);
          break;
        case "stackIntensity":
          existing.stacks = Math.min(rule.maxStacks, existing.stacks + 1);
          existing.remainingMs = Math.max(existing.remainingMs, durationMs);
          break;
        case "stackDuration":
          existing.remainingMs += durationMs;
          break;
      }
    }
    this.options.onApplied?.(application.kind);
    return true;
  }

  /** Advance timers; emit DoT ticks; expire statuses. Fixed timestep only. */
  update(fixedDtMs: number): void {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const status = this.active[i] as ActiveStatus;
      const rule = STATUS_RULES[status.kind];

      if (rule.tickIntervalMs && rule.tickFractionOfStrength) {
        status.tickClockMs += fixedDtMs;
        while (status.tickClockMs >= rule.tickIntervalMs) {
          status.tickClockMs -= rule.tickIntervalMs;
          this.options.onTickDamage?.(
            status.kind,
            status.strength * rule.tickFractionOfStrength * status.stacks,
          );
        }
      }

      status.remainingMs -= fixedDtMs;
      if (status.remainingMs <= 0) {
        this.active.splice(i, 1);
        this.options.onExpired?.(status.kind);
      }
    }
  }

  has(kind: StatusKind): boolean {
    return this.active.some((s) => s.kind === kind);
  }

  /** Cleanse — the removal method for cleansable statuses. */
  remove(kind: StatusKind): boolean {
    const index = this.active.findIndex((s) => s.kind === kind);
    if (index < 0) return false;
    this.active.splice(index, 1);
    this.options.onExpired?.(kind);
    return true;
  }

  /** Readable indicator data (HUD status row, AF-007 §5 icons). */
  get snapshot(): readonly StatusSnapshot[] {
    return this.active.map((s) => ({
      kind: s.kind,
      stacks: s.stacks,
      remainingMs: s.remainingMs,
      strength: s.strength,
    }));
  }

  /**
   * The AF-020 bridge: movement modifiers this entity's statuses request.
   * Stable ids let PlayerMovement refresh rather than stack.
   */
  get movementModifiers(): MovementModifier[] {
    const modifiers: MovementModifier[] = [];
    for (const status of this.active) {
      const movement = STATUS_RULES[status.kind].movement;
      if (!movement) continue;
      if (movement.kind === "root") {
        modifiers.push({ id: `status-${status.kind}`, kind: "root", durationMs: status.remainingMs });
      } else {
        modifiers.push({
          id: `status-${status.kind}`,
          kind: "speedMultiplier",
          multiplier: movement.multiplier,
          durationMs: status.remainingMs,
        });
      }
    }
    return modifiers;
  }
}
