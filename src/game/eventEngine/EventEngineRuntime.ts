/**
 * EventEngineRuntime pieces (AF-137). Real, tested, and deliberately
 * decoupled from AF-041's WorldEventRuntime — this module classifies
 * and chains events by SCALE; AF-041 still owns actually rolling
 * events by TYPE. A caller (main.ts) is free to tag a real AF-041
 * event with a tier from this module without either module importing
 * the other's types.
 */
import { EVENT_TIERS, tierWeightsFor, type EventTier, type EventTierInputs } from "./eventEngineData";

export interface TieredEventRecord {
  tier: EventTier;
  description: string;
  epoch: number;
  sequence: number;
}

/** "Event history" (AF-137 §Accessibility) — append-only, filterable by tier. */
export class GalacticEventLog {
  private readonly records: TieredEventRecord[] = [];

  record(tier: EventTier, description: string, epoch: number): TieredEventRecord {
    const entry: TieredEventRecord = { tier, description, epoch, sequence: this.records.length };
    this.records.push(entry);
    return entry;
  }

  all(): readonly TieredEventRecord[] {
    return this.records;
  }

  byTier(tier: EventTier): readonly TieredEventRecord[] {
    return this.records.filter((r) => r.tier === tier);
  }

  countFor(tier: EventTier): number {
    return this.byTier(tier).length;
  }
}

/** Weighted-random tier selection over `tierWeightsFor`'s real
 * composed weights — "nothing appears randomly," the weights are
 * never uniform. */
export function rollTier(inputs: EventTierInputs, roll: number): EventTier {
  const weights = tierWeightsFor(inputs);
  const total = EVENT_TIERS.reduce((sum, tier) => sum + weights[tier], 0);
  let threshold = roll * total;
  for (const tier of EVENT_TIERS) {
    threshold -= weights[tier];
    if (threshold <= 0) return tier;
  }
  return EVENT_TIERS[0]!;
}

/**
 * "Small events create larger ones... every action ripples." Tracks
 * progress through an ordered chain (e.g. AF-137's own mining-boom
 * example); each `advance()` call is a real, observable ripple.
 */
export class EventChainRuntime {
  private index = 0;

  constructor(private readonly steps: readonly string[]) {}

  currentStep(): string | null {
    return this.steps[this.index] ?? null;
  }

  advance(): string | null {
    if (this.isComplete()) return null;
    const completed = this.steps[this.index]!;
    this.index += 1;
    return completed;
  }

  isComplete(): boolean {
    return this.index >= this.steps.length;
  }

  stepsCompleted(): number {
    return this.index;
  }

  totalSteps(): number {
    return this.steps.length;
  }
}
