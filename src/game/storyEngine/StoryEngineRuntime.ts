/**
 * StoryEngineRuntime pieces (AF-136). Composes with AF-133's real
 * LegacyProgressTracker/generateFinalChronicle (via AF-135) and
 * AF-135's real EvolvingEntry — never duplicates them.
 */
import type { LegacyProgressTracker } from "../legacy/LegacyEngineRuntime";
import type { FinalChronicle } from "../chronicle/ChronicleRuntime";
import { EvolvingEntry, type AuthorVoice } from "../chronicle/chronicleData";
import {
  CAMPAIGN_THEME_BY_STORY_PILLAR,
  REPUTATION_TITLE_BY_LEGACY_CATEGORY,
  STORY_PILLARS,
  type CampaignTheme,
  type PersonalStorylineBeat,
  type PlayerReputationTitle,
  type StoryBranchAxis,
  type StoryPillar,
} from "./storyEngineData";

/** "These values influence future events" — reinforcement only ever
 * grows, exactly like AF-133's LegacyProgressTracker. */
export class StoryPillarTracker {
  private readonly values = new Map<StoryPillar, number>(STORY_PILLARS.map((p) => [p, 0]));

  reinforce(pillar: StoryPillar, amount: number): void {
    if (amount <= 0) return;
    this.values.set(pillar, (this.values.get(pillar) ?? 0) + amount);
  }

  valueFor(pillar: StoryPillar): number {
    return this.values.get(pillar) ?? 0;
  }

  /** Multiple pillars can co-dominate — "each campaign experiences
   * different combinations," not a single forced winner. */
  dominantPillars(count = 2): readonly StoryPillar[] {
    return [...this.values.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .filter(([, value]) => value > 0)
      .map(([pillar]) => pillar);
  }
}

/** "The player never explicitly chooses the theme. It emerges." */
export function deriveCampaignTheme(tracker: StoryPillarTracker): CampaignTheme {
  const [dominant] = tracker.dominantPillars(1);
  return CAMPAIGN_THEME_BY_STORY_PILLAR[dominant ?? "Hope"];
}

/** Derived from AF-133's real LegacyProgressTracker — no new stat tracking. */
export function reputationTitleFor(legacyProgress: LegacyProgressTracker): PlayerReputationTitle {
  return REPUTATION_TITLE_BY_LEGACY_CATEGORY[legacyProgress.topCategory()] ?? "The Explorer";
}

/**
 * A narrative-level pacing evaluator — deliberately distinct state
 * from AF-056's DirectorConductor (combat-encounter recovery windows).
 * Tracks broad play-pattern counts and returns a bias, never applying
 * it directly to any locked event roller.
 */
export interface PacingBias {
  combat: number;
  exploration: number;
  downtime: number;
}

export class StoryDirector {
  private combatActions = 0;
  private explorationActions = 0;
  private downtimeTicks = 0;

  recordCombat(): void {
    this.combatActions += 1;
  }

  recordExploration(): void {
    this.explorationActions += 1;
  }

  recordDowntime(): void {
    this.downtimeTicks += 1;
  }

  /** Proportional shares — "adjusts future events naturally," a bias
   * for a caller to weight event selection with, never forced. */
  pacingBias(): PacingBias {
    const total = this.combatActions + this.explorationActions + this.downtimeTicks;
    if (total === 0) return { combat: 0, exploration: 0, downtime: 0 };
    return {
      combat: this.combatActions / total,
      exploration: this.explorationActions / total,
      downtime: this.downtimeTicks / total,
    };
  }
}

/** Personal Storylines reuse AF-135's real EvolvingEntry directly —
 * each beat is its own evolving entry per Commander, so "Friendships
 * alter every chapter" is just another expand() call. */
export class CommanderStorylineLog {
  private readonly beats = new Map<string, EvolvingEntry>();

  private key(commanderId: string, beat: PersonalStorylineBeat): string {
    return `${commanderId}:${beat}`;
  }

  write(commanderId: string, beat: PersonalStorylineBeat, text: string, epoch: number, authorVoice: AuthorVoice = "Commanders"): void {
    const key = this.key(commanderId, beat);
    let entry = this.beats.get(key);
    if (!entry) {
      entry = new EvolvingEntry(key);
      this.beats.set(key, entry);
    }
    entry.expand(text, epoch, authorVoice);
  }

  beatFor(commanderId: string, beat: PersonalStorylineBeat): EvolvingEntry | undefined {
    return this.beats.get(this.key(commanderId, beat));
  }
}

export interface StoryBranchLean {
  axis: StoryBranchAxis;
  lean: number;
}

/** "No binary morality... every choice has strengths" — a running
 * lean, never a locked-in alignment. */
export class StoryBranchTracker {
  private readonly leans = new Map<StoryBranchAxis, number>();

  lean(axis: StoryBranchAxis, amount: number): void {
    this.leans.set(axis, (this.leans.get(axis) ?? 0) + amount);
  }

  leaningFor(axis: StoryBranchAxis): number {
    return this.leans.get(axis) ?? 0;
  }
}

/** "Tiny details may return dozens of hours later" — records are only
 * eligible for callback once enough epochs have actually passed. */
export interface NarrativeCallbackEntry {
  tag: string;
  detail: string;
  recordedAtEpoch: number;
}

export class NarrativeCallbackLog {
  private readonly entries: NarrativeCallbackEntry[] = [];

  register(tag: string, detail: string, epoch: number): void {
    this.entries.push({ tag, detail, recordedAtEpoch: epoch });
  }

  eligibleCallbacks(currentEpoch: number, minDelayEpochs: number): readonly NarrativeCallbackEntry[] {
    return this.entries.filter((e) => currentEpoch - e.recordedAtEpoch >= minDelayEpochs);
  }

  all(): readonly NarrativeCallbackEntry[] {
    return this.entries;
  }
}

export interface EndingSummary {
  theme: CampaignTheme;
  reputationTitle: PlayerReputationTitle;
  finalChronicle: FinalChronicle;
}

/** "Every ending feels personal" — composes AF-135's real
 * generateFinalChronicle rather than a second aggregator. */
export function generateEndingSummary(pillarTracker: StoryPillarTracker, legacyProgress: LegacyProgressTracker, finalChronicle: FinalChronicle): EndingSummary {
  return {
    theme: deriveCampaignTheme(pillarTracker),
    reputationTitle: reputationTitleFor(legacyProgress),
    finalChronicle,
  };
}
