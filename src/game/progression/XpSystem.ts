/**
 * XP and level state (AF-022 §3). Thresholds come from the tuned curve with
 * the anti-grind growth-ratio cap; multi-level grants queue so every level
 * gets its own upgrade choice; level cap is mission data (null = endless).
 */
import type { XpTuning } from "./xpTuning";

export interface XpSnapshot {
  level: number;
  xp: number;
  nextThreshold: number;
  pendingLevels: number;
  totalXpEarned: number;
}

export class XpSystem {
  private level = 1;
  private xp = 0;
  private pendingLevelQueue = 0;
  private totalXp = 0;
  private readonly levelCap: number | null;

  constructor(
    private readonly tuning: XpTuning,
    levelCap?: number | null,
    private readonly onLevelGained?: (newLevel: number) => void,
  ) {
    this.levelCap = levelCap === undefined ? tuning.defaultLevelCap : levelCap;
  }

  private readonly thresholdCache: number[] = [];

  /** XP required to advance FROM the given level. Cached — O(1) amortised. */
  thresholdFor(level: number): number {
    const { base, linear, soft, knee } = this.tuning.curve;
    for (let l = this.thresholdCache.length + 1; l <= level; l += 1) {
      const raw = base + linear * l + soft * l ** knee;
      const previous = this.thresholdCache[l - 2];
      // Anti-grind cap: never grow faster than the tuned ratio per level.
      this.thresholdCache.push(
        previous === undefined
          ? raw
          : Math.min(raw, previous * this.tuning.maxThresholdGrowthRatio),
      );
    }
    return this.thresholdCache[level - 1] as number;
  }

  addXp(amount: number): void {
    if (amount <= 0) return;
    this.totalXp += amount;
    if (this.atCap()) return;
    this.xp += amount;
    while (this.xp >= this.thresholdFor(this.level) && !this.atCap()) {
      this.xp -= this.thresholdFor(this.level);
      this.level += 1;
      this.pendingLevelQueue += 1;
      this.onLevelGained?.(this.level);
    }
    if (this.atCap()) this.xp = 0;
  }

  /** Consume one queued level (one upgrade choice per level — none wasted). */
  consumePendingLevel(): boolean {
    if (this.pendingLevelQueue === 0) return false;
    this.pendingLevelQueue -= 1;
    return true;
  }

  private atCap(): boolean {
    return this.levelCap !== null && this.level >= this.levelCap;
  }

  get snapshot(): XpSnapshot {
    return {
      level: this.level,
      xp: this.xp,
      nextThreshold: this.thresholdFor(this.level),
      pendingLevels: this.pendingLevelQueue,
      totalXpEarned: this.totalXp,
    };
  }
}
