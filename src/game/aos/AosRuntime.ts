/**
 * AosRuntime pieces (AF-144). `buildDialogueContext` takes plain signal
 * values a caller extracts from real systems — the decoupled-composition
 * discipline AF-137's `tierWeightsFor` established, continued through
 * AF-138 → AF-143.
 */
import type { DialogueContextSignals, PerformanceOrchestratorDomain, PredictionKind, PriorityTier, RecoveryScenarioKind, WorldStateSlot } from "./aosData";

/**
 * "The Operating System continuously maintains... every system queries a
 * single source of truth." Generic over `T` so any real module's data
 * shape can be the payload — this module never redefines what "world
 * state" contains, only where it's held. Confirmed genuinely new: no
 * unified single-source-of-truth store exists anywhere (AF-144 §Foundation).
 */
export class WorldStateStore<T> {
  private current: T | null = null;
  private currentSetAtEpoch = 0;
  private readonly historical: Array<{ value: T; epoch: number }> = [];
  private projected: T | null = null;
  private readonly temporary = new Map<string, { value: T; expiresAtEpoch: number }>();
  private emergencyReason: string | null = null;

  setCurrent(value: T, epoch: number): void {
    if (this.current !== null) this.historical.push({ value: this.current, epoch: this.currentSetAtEpoch });
    this.current = value;
    this.currentSetAtEpoch = epoch;
  }

  getCurrent(): T | null {
    return this.current;
  }

  historyAt(epoch: number): T | null {
    let latest: T | null = null;
    for (const entry of this.historical) if (entry.epoch <= epoch) latest = entry.value;
    return latest;
  }

  setProjected(value: T): void {
    this.projected = value;
  }

  getProjected(): T | null {
    return this.projected;
  }

  setTemporary(key: string, value: T, expiresAtEpoch: number): void {
    this.temporary.set(key, { value, expiresAtEpoch });
  }

  getTemporary(key: string, currentEpoch: number): T | null {
    const entry = this.temporary.get(key);
    if (!entry) return null;
    if (currentEpoch >= entry.expiresAtEpoch) {
      this.temporary.delete(key);
      return null;
    }
    return entry.value;
  }

  declareEmergency(reason: string): void {
    this.emergencyReason = reason;
  }

  clearEmergency(): void {
    this.emergencyReason = null;
  }

  isEmergency(): boolean {
    return this.emergencyReason !== null;
  }

  emergencyReasonFor(): string | null {
    return this.emergencyReason;
  }

  slotSummary(): Readonly<Record<WorldStateSlot, boolean>> {
    return {
      Current: this.current !== null,
      Historical: this.historical.length > 0,
      Projected: this.projected !== null,
      Temporary: this.temporary.size > 0,
      Emergency: this.isEmergency(),
      Simulation: this.current !== null,
    };
  }
}

/**
 * "Time operates on multiple layers... the Operating System synchronises
 * all timelines." A read-only reporting aggregator — callers feed it the
 * REAL value from each module's own existing clock; this never becomes a
 * second source of truth for any of them.
 */
export class SimulationClockRegistry {
  private readonly layers = new Map<string, number>();

  report(layer: string, value: number): void {
    this.layers.set(layer, value);
  }

  valueFor(layer: string): number {
    return this.layers.get(layer) ?? 0;
  }

  all(): ReadonlyMap<string, number> {
    return this.layers;
  }
}

/**
 * "Not everything updates equally." Registers a tier per system and
 * throttles low-priority systems to update less often — a real,
 * testable frequency divisor, not just a label.
 */
export class PriorityEngine {
  private readonly tiers = new Map<string, PriorityTier>();
  private static readonly FRAME_DIVISOR: Readonly<Record<PriorityTier, number>> = { High: 1, Medium: 4, Low: 20 };

  register(systemId: string, tier: PriorityTier): void {
    this.tiers.set(systemId, tier);
  }

  tierFor(systemId: string): PriorityTier | null {
    return this.tiers.get(systemId) ?? null;
  }

  shouldUpdate(systemId: string, frameCount: number): boolean {
    const tier = this.tiers.get(systemId) ?? "Low";
    return frameCount % PriorityEngine.FRAME_DIVISOR[tier] === 0;
  }
}

export interface DialogueContextSnapshot extends DialogueContextSignals {
  isFriendly: boolean;
}

/** "Every interaction considers context... dialogue always feels
 * appropriate." A pure aggregator — never imports the systems it reads
 * from. */
export function buildDialogueContext(signals: DialogueContextSignals): DialogueContextSnapshot {
  return { ...signals, isFriendly: signals.relationshipStatus !== "hostile" && signals.playerReputation >= 0 };
}

export interface ChangeRequest {
  systemId: string;
  targetId: string;
  tier: PriorityTier;
  fromPlayer: boolean;
}

export interface DecisionResolution {
  targetId: string;
  winner: ChangeRequest;
  rejected: readonly ChangeRequest[];
}

const TIER_RANK: Readonly<Record<PriorityTier, number>> = { High: 3, Medium: 2, Low: 1 };

/**
 * "When multiple systems request changes... resolve priorities, prevent
 * contradictions, protect player agency." Player-sourced requests always
 * win ties; otherwise the highest priority tier wins. Confirmed
 * genuinely new — nothing else arbitrates cross-system requests.
 */
export class DecisionRouter {
  resolve(requests: readonly ChangeRequest[]): DecisionResolution | null {
    if (requests.length === 0) return null;
    const targetId = requests[0]!.targetId;
    const sameTarget = requests.filter((r) => r.targetId === targetId);
    const winner = sameTarget.reduce((best, candidate) => {
      if (candidate.fromPlayer && !best.fromPlayer) return candidate;
      if (best.fromPlayer && !candidate.fromPlayer) return best;
      return TIER_RANK[candidate.tier] > TIER_RANK[best.tier] ? candidate : best;
    });
    const rejected = sameTarget.filter((r) => r !== winner);
    return { targetId, winner, rejected };
  }
}

export interface Forecast {
  kind: PredictionKind;
  predictedNext: number;
  confidence: number;
}

/**
 * "Forecast likely future events... allows believable anticipation."
 * A simple, real linear-trend forecaster over a caller-supplied history
 * series — confidence falls as the series' own variance rises.
 */
export class PredictionEngine {
  forecast(kind: PredictionKind, history: readonly number[]): Forecast {
    if (history.length < 2) return { kind, predictedNext: history[0] ?? 0, confidence: history.length === 1 ? 0.5 : 0 };
    const deltas: number[] = [];
    for (let i = 1; i < history.length; i++) deltas.push(history[i]! - history[i - 1]!);
    const averageDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const predictedNext = history[history.length - 1]! + averageDelta;
    const variance = deltas.reduce((sum, d) => sum + (d - averageDelta) ** 2, 0) / deltas.length;
    const confidence = 1 / (1 + variance);
    return { kind, predictedNext, confidence };
  }
}

/**
 * "Continuously balances simulation depth, rendering, audio... nothing
 * important stalls." Tracks a 0-100 usage per domain; recommends
 * throttling the domains furthest over budget first.
 */
export class PerformanceBudgetTracker {
  private readonly usage = new Map<PerformanceOrchestratorDomain, number>();
  private readonly budget = 80;

  reportUsage(domain: PerformanceOrchestratorDomain, percent: number): void {
    this.usage.set(domain, Math.max(0, Math.min(100, percent)));
  }

  isOverBudget(domain: PerformanceOrchestratorDomain): boolean {
    return (this.usage.get(domain) ?? 0) > this.budget;
  }

  recommendedThrottleTargets(): readonly PerformanceOrchestratorDomain[] {
    return [...this.usage.entries()]
      .filter(([, percent]) => percent > this.budget)
      .sort((a, b) => b[1] - a[1])
      .map(([domain]) => domain);
  }
}

export interface RecoveryRecord {
  scenario: RecoveryScenarioKind;
  resolution: string;
  epoch: number;
}

/**
 * "Graceful recovery without immersion breaks." Distinct from AF-044's
 * real save-slice corruption recovery — this handles world-state-level
 * contradictions (e.g. a `WorldStateStore` emergency flag), not save
 * bytes. Append-only.
 */
export class RecoveryLog {
  private readonly records: RecoveryRecord[] = [];

  record(scenario: RecoveryScenarioKind, resolution: string, epoch: number): RecoveryRecord {
    const entry: RecoveryRecord = { scenario, resolution, epoch };
    this.records.push(entry);
    return entry;
  }

  all(): readonly RecoveryRecord[] {
    return this.records;
  }
}

/**
 * "Anonymous metrics support balance improvements... offline play
 * remains fully supported." Confirmed genuinely new — no telemetry
 * producer exists anywhere. Counts event kinds only; carries no payload
 * data, so nothing personally identifying is ever stored.
 */
export class TelemetryCollector {
  private readonly counts = new Map<string, number>();

  record(eventKind: string): void {
    this.counts.set(eventKind, (this.counts.get(eventKind) ?? 0) + 1);
  }

  countFor(eventKind: string): number {
    return this.counts.get(eventKind) ?? 0;
  }

  totalEvents(): number {
    let total = 0;
    for (const count of this.counts.values()) total += count;
    return total;
  }
}
