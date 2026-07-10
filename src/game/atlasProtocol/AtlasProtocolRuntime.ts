/**
 * AtlasProtocolRuntime pieces (AF-149). `AtlasScoreCard` mirrors AF-143's
 * real `DesignScoreCard` shape exactly, but typed to this module's own
 * `AtlasScoreCategory` — AF-143's class is hand-typed to its own closed
 * union rather than a reusable generic, so a direct reuse isn't
 * possible without modifying a locked module.
 */
import { ATLAS_PROTOCOL_STAGES, ATLAS_SCORE_CATEGORIES, ATLAS_SCORE_GATE_THRESHOLD, nextAtlasProtocolStage, type AtlasProtocolStage, type AtlasScoreCategory } from "./atlasProtocolData";

export interface StageTransition {
  featureId: string;
  stage: AtlasProtocolStage;
  epoch: number;
}

/**
 * "Every future development decision must follow this protocol." Tracks
 * a feature's real progress through the Seven Stages; `advance` only
 * moves forward one stage at a time (mirroring AF-095/097's real
 * `next*PipelineStage` functions), never skips, never regresses.
 */
export class FeatureLifecycleTracker {
  private readonly current = new Map<string, AtlasProtocolStage>();
  private readonly history: StageTransition[] = [];

  register(featureId: string, epoch: number): void {
    if (this.current.has(featureId)) return;
    const stage = ATLAS_PROTOCOL_STAGES[0]!;
    this.current.set(featureId, stage);
    this.history.push({ featureId, stage, epoch });
  }

  advance(featureId: string, epoch: number): AtlasProtocolStage | null {
    const stage = this.current.get(featureId);
    if (!stage) return null;
    const next = nextAtlasProtocolStage(stage);
    if (!next) return null;
    this.current.set(featureId, next);
    this.history.push({ featureId, stage: next, epoch });
    return next;
  }

  stageFor(featureId: string): AtlasProtocolStage | null {
    return this.current.get(featureId) ?? null;
  }

  historyFor(featureId: string): readonly StageTransition[] {
    return this.history.filter((t) => t.featureId === featureId);
  }
}

/**
 * "Every feature receives... an Overall Atlas Score. Features below
 * 9.5/10 return to Stage I." Mirrors AF-143's real `DesignScoreCard`
 * shape exactly (clamp 0-10, require every category scored, average
 * gated at the real 9.5 threshold) but typed to this module's own
 * separate `AtlasScoreCategory` union.
 */
export class AtlasScoreCard {
  private readonly scores = new Map<AtlasScoreCategory, number>();

  score(category: AtlasScoreCategory, value: number): void {
    this.scores.set(category, Math.max(0, Math.min(10, value)));
  }

  scoreFor(category: AtlasScoreCategory): number | null {
    return this.scores.get(category) ?? null;
  }

  isComplete(): boolean {
    return ATLAS_SCORE_CATEGORIES.every((category) => this.scores.has(category));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const category of ATLAS_SCORE_CATEGORIES) total += this.scores.get(category) ?? 0;
    return total / ATLAS_SCORE_CATEGORIES.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= ATLAS_SCORE_GATE_THRESHOLD;
  }
}

export interface IterationCycleRecord {
  featureId: string;
  epoch: number;
  sequence: number;
}

/** "Never ship the first version." A feature is only ready once it has
 * genuinely cycled through the loop at least twice — the first pass is
 * the prototype, never the ship candidate. */
export class IterationCycleTracker {
  private readonly records: IterationCycleRecord[] = [];
  private static readonly MINIMUM_CYCLES = 2;

  recordCycle(featureId: string, epoch: number): IterationCycleRecord {
    const entry: IterationCycleRecord = { featureId, epoch, sequence: this.cycleCountFor(featureId) };
    this.records.push(entry);
    return entry;
  }

  cycleCountFor(featureId: string): number {
    return this.records.filter((r) => r.featureId === featureId).length;
  }

  readyToShip(featureId: string): boolean {
    return this.cycleCountFor(featureId) >= IterationCycleTracker.MINIMUM_CYCLES;
  }
}
