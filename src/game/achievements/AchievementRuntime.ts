/**
 * Achievement checking (AF-042): a pure read over state AF-026's
 * MetaProgression already exposes publicly (`stat()`, `snapshot.collectionCounts`)
 * — never edits the locked class, never duplicates its persistence.
 * Completion itself is recorded exactly the way AF-026's own Challenge
 * engine already records completion — `meta.discover("achievements", id)`,
 * the same collection bucket AF-026's `grantReward` already writes into.
 */
import type { CollectionCategory } from "../meta/metaData";
import type { AchievementDef } from "./achievementData";

export interface AchievementProgressReader {
  stat(key: string): number;
  collectionCount(category: CollectionCategory): number;
  isCompleted(achievementId: string): boolean;
}

export class AchievementRuntime {
  constructor(private readonly roster: readonly AchievementDef[]) {}

  get all(): readonly AchievementDef[] {
    return this.roster;
  }

  private currentValue(achievement: AchievementDef, reader: AchievementProgressReader): number {
    return achievement.criteria.kind === "statThreshold"
      ? reader.stat(achievement.criteria.counterKey)
      : reader.collectionCount(achievement.criteria.category);
  }

  progress(achievement: AchievementDef, reader: AchievementProgressReader): { current: number; target: number } {
    return { current: Math.min(this.currentValue(achievement, reader), achievement.criteria.target), target: achievement.criteria.target };
  }

  isSatisfied(achievement: AchievementDef, reader: AchievementProgressReader): boolean {
    return this.currentValue(achievement, reader) >= achievement.criteria.target;
  }

  /** Every not-yet-completed achievement whose criteria is now satisfied. */
  checkCompletions(reader: AchievementProgressReader): readonly AchievementDef[] {
    return this.roster.filter((achievement) => !reader.isCompleted(achievement.id) && this.isSatisfied(achievement, reader));
  }
}
