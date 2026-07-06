/**
 * Meta progression ledger (AF-026): account level (AF-022 engine, re-tuned),
 * generic mastery tracks, compact-ID-set collections (AF-013 §6), permanent
 * statistics, and the challenge engine. Rewards are cosmetic/knowledge only
 * — the type system has nowhere to put a buff.
 */
import { XpSystem } from "../progression/XpSystem";
import {
  ACCOUNT_XP_TUNING,
  MASTERY_RANK_THRESHOLDS,
  type ChallengeDef,
  type CollectionCategory,
  type MasteryReward,
} from "./metaData";

interface MasteryTrack {
  xp: number;
  counters: Record<string, number>;
}

export interface MetaSaveData {
  accountXp: number;
  mastery: Record<string, MasteryTrack>;
  /** Compact ID sets — save grows with discovery, not catalogue (AF-013 §6). */
  collections: Partial<Record<CollectionCategory, string[]>>;
  statistics: Record<string, number>;
  completedChallenges: string[];
  unlockedCosmetics: string[];
}

export interface MetaSnapshot {
  accountLevel: number;
  accountXp: number;
  accountNextThreshold: number;
  masteryTrackCount: number;
  collectionCounts: Partial<Record<CollectionCategory, number>>;
  completedChallenges: number;
  totalChallenges: number;
  statistics: Readonly<Record<string, number>>;
}

export class MetaProgression {
  private readonly account = new XpSystem(ACCOUNT_XP_TUNING, null);
  private readonly mastery = new Map<string, MasteryTrack>();
  private readonly collections = new Map<CollectionCategory, Set<string>>();
  private readonly statistics = new Map<string, number>();
  private readonly completedChallenges = new Set<string>();
  private readonly unlockedCosmetics = new Set<string>();

  constructor(
    private readonly challenges: readonly ChallengeDef[],
    private readonly onChallengeCompleted?: (challenge: ChallengeDef) => void,
    private readonly onAccountLevel?: (level: number) => void,
  ) {}

  // ── Account (never resets — no reset operation exists) ──────────────────

  addAccountXp(amount: number): void {
    const before = this.account.snapshot.level;
    this.account.addXp(amount);
    const after = this.account.snapshot.level;
    for (let level = before + 1; level <= after; level += 1) this.onAccountLevel?.(level);
  }

  // ── Mastery (one engine, many tracks) ────────────────────────────────────

  addMasteryXp(trackId: string, amount: number): void {
    this.track(trackId).xp += amount;
  }

  addMasteryCounter(trackId: string, counterKey: string, amount = 1): void {
    const track = this.track(trackId);
    track.counters[counterKey] = (track.counters[counterKey] ?? 0) + amount;
  }

  masteryRank(trackId: string): number {
    const xp = this.mastery.get(trackId)?.xp ?? 0;
    let rank = 0;
    let cumulative = 0;
    for (const threshold of MASTERY_RANK_THRESHOLDS) {
      cumulative += threshold;
      if (xp < cumulative) break;
      rank += 1;
    }
    return rank;
  }

  // ── Collections (idempotent, compact) ────────────────────────────────────

  /** Returns true only on first discovery. */
  discover(category: CollectionCategory, id: string): boolean {
    let set = this.collections.get(category);
    if (!set) {
      set = new Set();
      this.collections.set(category, set);
    }
    if (set.has(id)) return false;
    set.add(id);
    return true;
  }

  hasDiscovered(category: CollectionCategory, id: string): boolean {
    return this.collections.get(category)?.has(id) ?? false;
  }

  // ── Statistics (permanent counters) ──────────────────────────────────────

  recordStat(key: string, amount = 1): void {
    this.statistics.set(key, (this.statistics.get(key) ?? 0) + amount);
    this.checkChallenges(key);
  }

  recordStatMax(key: string, value: number): void {
    if (value > (this.statistics.get(key) ?? 0)) this.statistics.set(key, value);
    this.checkChallenges(key);
  }

  stat(key: string): number {
    return this.statistics.get(key) ?? 0;
  }

  // ── Challenges (complete exactly once; cosmetic rewards only) ────────────

  private checkChallenges(counterKey: string): void {
    for (const challenge of this.challenges) {
      if (challenge.counterKey !== counterKey) continue;
      if (this.completedChallenges.has(challenge.id)) continue;
      if (this.stat(counterKey) >= challenge.target) {
        this.completedChallenges.add(challenge.id);
        this.grantReward(challenge.reward);
        this.onChallengeCompleted?.(challenge);
      }
    }
  }

  private grantReward(reward: MasteryReward): void {
    this.unlockedCosmetics.add(`${reward.kind}:${reward.id}`);
    this.discover("achievements", reward.id);
  }

  isChallengeCompleted(id: string): boolean {
    return this.completedChallenges.has(id);
  }

  challengeProgress(id: string): { current: number; target: number } | null {
    const challenge = this.challenges.find((c) => c.id === id);
    if (!challenge) return null;
    return {
      current: Math.min(this.stat(challenge.counterKey), challenge.target),
      target: challenge.target,
    };
  }

  // ── Profile & persistence ────────────────────────────────────────────────

  get snapshot(): MetaSnapshot {
    const collectionCounts: Partial<Record<CollectionCategory, number>> = {};
    for (const [category, set] of this.collections) collectionCounts[category] = set.size;
    const statistics: Record<string, number> = {};
    for (const [key, value] of this.statistics) statistics[key] = value;
    const account = this.account.snapshot;
    return {
      accountLevel: account.level,
      accountXp: account.xp,
      accountNextThreshold: account.nextThreshold,
      masteryTrackCount: this.mastery.size,
      collectionCounts,
      completedChallenges: this.completedChallenges.size,
      totalChallenges: this.challenges.length,
      statistics,
    };
  }

  toSave(): MetaSaveData {
    const mastery: Record<string, MasteryTrack> = {};
    for (const [id, track] of this.mastery) mastery[id] = { xp: track.xp, counters: { ...track.counters } };
    const collections: Partial<Record<CollectionCategory, string[]>> = {};
    for (const [category, set] of this.collections) collections[category] = [...set].sort();
    const statistics: Record<string, number> = {};
    for (const [key, value] of this.statistics) statistics[key] = value;
    return {
      accountXp: this.account.snapshot.totalXpEarned,
      mastery,
      collections,
      statistics,
      completedChallenges: [...this.completedChallenges],
      unlockedCosmetics: [...this.unlockedCosmetics],
    };
  }

  loadSave(data: MetaSaveData): void {
    this.account.addXp(Math.max(0, data.accountXp));
    this.mastery.clear();
    for (const [id, track] of Object.entries(data.mastery)) {
      this.mastery.set(id, { xp: track.xp, counters: { ...track.counters } });
    }
    this.collections.clear();
    for (const [category, ids] of Object.entries(data.collections)) {
      this.collections.set(category as CollectionCategory, new Set(ids));
    }
    this.statistics.clear();
    for (const [key, value] of Object.entries(data.statistics)) {
      if (typeof value === "number") this.statistics.set(key, value);
    }
    this.completedChallenges.clear();
    for (const id of data.completedChallenges) this.completedChallenges.add(id);
    this.unlockedCosmetics.clear();
    for (const id of data.unlockedCosmetics) this.unlockedCosmetics.add(id);
  }

  private track(trackId: string): MasteryTrack {
    let track = this.mastery.get(trackId);
    if (!track) {
      track = { xp: 0, counters: {} };
      this.mastery.set(trackId, track);
    }
    return track;
  }
}
