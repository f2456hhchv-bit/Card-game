/**
 * SimulationDirectorRuntime pieces (AF-153). "System Synchronisation"/
 * "Event Prioritisation" reuse AF-144's real `DecisionRouter` directly
 * at the call site; "Simulation Budget"/"Load Balancing" reuse AF-144's
 * real `PerformanceBudgetTracker` directly. Neither is re-declared
 * here — see `simulationDirectorData.ts` for the full reuse notes.
 */
import { SIMULATION_TIERS, type EmergenceOpportunityKind, type EmotionalPacingCategory, type SimulationTier } from "./simulationDirectorData";

/**
 * "Not everything updates equally." Mirrors AF-144's real
 * `PriorityEngine` frame-divisor mechanism, but over this module's own
 * separate 5-tier `SimulationTier` union (Immediate → Galactic),
 * since `PriorityEngine` is hand-typed to its own closed 3-tier union.
 */
export class SimulationTierEngine {
  private readonly tiers = new Map<string, SimulationTier>();
  private static readonly FRAME_DIVISOR: Readonly<Record<SimulationTier, number>> = { Immediate: 1, "Local Region": 4, Planetary: 20, Sector: 60, Galactic: 200 };

  register(entityId: string, tier: SimulationTier): void {
    this.tiers.set(entityId, tier);
  }

  tierFor(entityId: string): SimulationTier | null {
    return this.tiers.get(entityId) ?? null;
  }

  shouldUpdate(entityId: string, frameCount: number): boolean {
    const tier = this.tiers.get(entityId) ?? SIMULATION_TIERS[SIMULATION_TIERS.length - 1]!;
    return frameCount % SimulationTierEngine.FRAME_DIVISOR[tier] === 0;
  }
}

export interface AttentionRecord {
  entityId: string;
  score: number;
}

/** "Every entity receives an Attention Score... attention dynamically
 * changes." Real per-entity score storage, composing
 * `computeAttentionScore` at the call site rather than duplicating the
 * factor formula here. */
export class AttentionTracker {
  private readonly scores = new Map<string, number>();

  setScore(entityId: string, score: number): void {
    this.scores.set(entityId, Math.max(0, Math.min(100, score)));
  }

  scoreFor(entityId: string): number {
    return this.scores.get(entityId) ?? 0;
  }

  topEntities(limit = 5): readonly AttentionRecord[] {
    return [...this.scores.entries()]
      .map(([entityId, score]) => ({ entityId, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

/**
 * "CPU time allocated according to importance... no hidden waste."
 * Genuinely different granularity from AF-144's real
 * `PerformanceBudgetTracker` (which allocates by DOMAIN — Rendering/
 * Audio/etc. — not by individual entity). Given a total budget and
 * each entity's real Attention Score, allocates proportional shares.
 */
export function allocateSimulationBudget(totalBudget: number, attention: ReadonlyMap<string, number>): ReadonlyMap<string, number> {
  const totalAttention = [...attention.values()].reduce((sum, v) => sum + v, 0);
  const shares = new Map<string, number>();
  if (totalAttention <= 0) return shares;
  for (const [entityId, score] of attention) shares.set(entityId, (score / totalAttention) * totalBudget);
  return shares;
}

export interface PacingRecord {
  category: EmotionalPacingCategory;
  epoch: number;
}

/**
 * "Avoid constant crisis/rewards/combat. Instead balance discovery/
 * reflection/construction/conversation/celebration/danger/recovery/
 * wonder." A materially wider 8-category tracker than AF-136's real
 * `StoryDirector` (3 categories) — kept separate, never widening that
 * locked class. `imbalancedCategory` flags whichever category has
 * dominated the last `windowSize` beats, so a caller can consciously
 * favour something else next.
 */
export class EmotionalPacingTracker {
  private readonly beats: PacingRecord[] = [];

  record(category: EmotionalPacingCategory, epoch: number): void {
    this.beats.push({ category, epoch });
  }

  countFor(category: EmotionalPacingCategory): number {
    return this.beats.filter((b) => b.category === category).length;
  }

  imbalancedCategory(windowSize = 5): EmotionalPacingCategory | null {
    const recent = this.beats.slice(-windowSize);
    if (recent.length < windowSize) return null;
    const first = recent[0]!.category;
    return recent.every((b) => b.category === first) ? first : null;
  }

  all(): readonly PacingRecord[] {
    return this.beats;
  }
}

export interface EmergenceOpportunityRecord {
  kind: EmergenceOpportunityKind;
  entityIds: readonly string[];
  description: string;
  epoch: number;
}

/**
 * "Identify opportunities... gently encourage meaningful coincidences
 * without scripting outcomes." Append-only — records what the Director
 * chose to surface. The actual discovery mechanism composes AF-151's
 * real `KnowledgeGraph.suggestConnections` at the call site (e.g. a
 * "Commander reunion" is a shared-neighbour suggestion between two
 * Commander nodes); this class never reimplements that algorithm.
 */
export class EmergenceOpportunityLog {
  private readonly records: EmergenceOpportunityRecord[] = [];

  surface(kind: EmergenceOpportunityKind, entityIds: readonly string[], description: string, epoch: number): EmergenceOpportunityRecord {
    const record: EmergenceOpportunityRecord = { kind, entityIds, description, epoch };
    this.records.push(record);
    return record;
  }

  all(): readonly EmergenceOpportunityRecord[] {
    return this.records;
  }

  countFor(kind: EmergenceOpportunityKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }
}
