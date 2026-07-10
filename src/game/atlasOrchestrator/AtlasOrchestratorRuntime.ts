import { CONTENT_ROTATION_CATEGORIES, MILESTONE_KINDS, type ContentRotationCategory, type DiscoveryKind, type MilestoneKind, type PacingCycleStage, type PlayerExperienceFactors } from "./atlasOrchestratorData";

/** Mirrors AF-153's real `EmotionalPacingTracker` record/count shape,
 * but adds `recommendedNextStage` since this list is a fixed cycle
 * rather than a free-form imbalance tracker (see module doc comment in
 * atlasOrchestratorData.ts). */
interface PacingRecord {
  stage: PacingCycleStage;
  epoch: number;
}

export class PacingCycleTracker {
  private readonly records: PacingRecord[] = [];

  record(stage: PacingCycleStage, epoch: number): void {
    this.records.push({ stage, epoch });
  }

  currentStage(): PacingCycleStage | null {
    return this.records.length > 0 ? this.records[this.records.length - 1]!.stage : null;
  }

  /** "No activity dominates for too long" — true only if every one of
   * the last `windowSize` beats shares the same stage. */
  isStalled(windowSize = 5): boolean {
    if (this.records.length < windowSize) return false;
    const recent = this.records.slice(-windowSize);
    return recent.every((r) => r.stage === recent[0]!.stage);
  }

  all(): readonly PacingRecord[] {
    return this.records;
  }
}

export class PlayerExperienceTracker {
  private latestFactors: PlayerExperienceFactors | null = null;
  private readonly records: PlayerExperienceFactors[] = [];

  record(factors: PlayerExperienceFactors): void {
    this.latestFactors = factors;
    this.records.push(factors);
  }

  latest(): PlayerExperienceFactors | null {
    return this.latestFactors;
  }

  history(): readonly PlayerExperienceFactors[] {
    return this.records;
  }
}

interface DiscoveryRecord {
  kind: DiscoveryKind;
  epoch: number;
}

export class DiscoveryCurveTracker {
  private readonly records: DiscoveryRecord[] = [];

  record(kind: DiscoveryKind, epoch: number): void {
    this.records.push({ kind, epoch });
  }

  lastEpochOverall(): number | null {
    return this.records.length > 0 ? this.records[this.records.length - 1]!.epoch : null;
  }

  /** "Prevent long dry periods" — true when nothing of any kind has
   * been discovered for at least `thresholdEpochs`. */
  isDryPeriod(currentEpoch: number, thresholdEpochs: number): boolean {
    const last = this.lastEpochOverall();
    if (last === null) return currentEpoch >= thresholdEpochs;
    return currentEpoch - last >= thresholdEpochs;
  }

  all(): readonly DiscoveryRecord[] {
    return this.records;
  }
}

export class ContentRotationTracker {
  private readonly usageCounts = new Map<ContentRotationCategory, number>(CONTENT_ROTATION_CATEGORIES.map((c) => [c, 0]));

  recordUsage(category: ContentRotationCategory): void {
    this.usageCounts.set(category, (this.usageCounts.get(category) ?? 0) + 1);
  }

  usageCountFor(category: ContentRotationCategory): number {
    return this.usageCounts.get(category) ?? 0;
  }

  /** "Prioritise underused content" — the least-used category, ties
   * broken by declared order. */
  leastUsedCategory(): ContentRotationCategory {
    return CONTENT_ROTATION_CATEGORIES.reduce((least, category) => (this.usageCountFor(category) < this.usageCountFor(least) ? category : least), CONTENT_ROTATION_CATEGORIES[0]!);
  }
}

interface MilestoneRecord {
  epoch: number;
  description: string;
}

/** Player-journey-level "last time X happened" log — distinct from
 * AF-133's real `NpcMemoryLog`, which tracks per-NPC memories rather
 * than player-journey milestones. */
export class LongTermMemoryLog {
  private readonly lastByKind = new Map<MilestoneKind, MilestoneRecord>();

  record(kind: MilestoneKind, epoch: number, description: string): void {
    this.lastByKind.set(kind, { epoch, description });
  }

  lastOf(kind: MilestoneKind): MilestoneRecord | null {
    return this.lastByKind.get(kind) ?? null;
  }

  epochsSince(kind: MilestoneKind, currentEpoch: number): number | null {
    const last = this.lastByKind.get(kind);
    return last ? currentEpoch - last.epoch : null;
  }

  recordedKinds(): readonly MilestoneKind[] {
    return MILESTONE_KINDS.filter((kind) => this.lastByKind.has(kind));
  }
}

export interface SystemEngagementScores {
  curiosity: number;
  satisfaction: number;
  exposure: number;
}

/** "Estimate which systems currently provide highest curiosity/
 * satisfaction/lowest exposure... recommend subtle opportunities. Never
 * force participation" — recommendation is advisory only, never applied
 * automatically. */
export class EngagementMap {
  private readonly scores = new Map<string, SystemEngagementScores>();

  setScores(systemId: string, scores: SystemEngagementScores): void {
    this.scores.set(systemId, scores);
  }

  scoresFor(systemId: string): SystemEngagementScores | null {
    return this.scores.get(systemId) ?? null;
  }

  /** Highest curiosity + satisfaction combined with the lowest exposure
   * — a gentle nudge, never a forced participation trigger. */
  recommend(): string | null {
    let best: string | null = null;
    let bestValue = -Infinity;
    for (const [systemId, s] of this.scores) {
      const value = s.curiosity + s.satisfaction - s.exposure;
      if (value > bestValue) {
        bestValue = value;
        best = systemId;
      }
    }
    return best;
  }

  all(): ReadonlyMap<string, SystemEngagementScores> {
    return this.scores;
  }
}
