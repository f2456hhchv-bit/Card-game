/**
 * Campaign runtime (AF-068). Pure, bus-free, and fully deterministic — no
 * RNG, no clock: the same sequence of recordProgress/recordChoice calls
 * always produces the same campaign state, which is what makes "every
 * player experiences a slightly different version of the galaxy" a
 * function of their PLAY rather than of chance.
 *
 * Design constraints made structural:
 * - "Gameplay should never pause for the story": story beats queue and are
 *   DRAINED by presentation through consumeStoryBeat() — the AF-055 echo /
 *   AF-057 ceremony seam. Nothing here can block a frame.
 * - "Choices influence future opportunities. Never permanently remove core
 *   content": flags and unlocks are grant-only and choices append-only —
 *   the class exposes no removal operation. The property holds by type.
 * - "Every stage naturally unlocks the next": chapters complete strictly
 *   in ladder order; counters persist across chapters, so progress earned
 *   early counts toward later thresholds automatically.
 * - Post-campaign is a STATE, not an ending: after the final chapter the
 *   runtime keeps accepting progress forever and exposes AF-038's
 *   long-term goals (their first producer) as the standing horizon.
 */
import {
  POST_CAMPAIGN_KINDS,
  POST_CAMPAIGN_TO_LONG_TERM_GOAL,
  type CampaignChapterDef,
  type CampaignStage,
  type CampaignStoryBeatDef,
  type CampaignUnlockDef,
  type CampaignWorldChangeDef,
  type ChoiceDomain,
  type MajorEventKind,
} from "./campaignData";
import type { LongTermGoalKind } from "../galaxy/galaxyData";

export interface CampaignObjectiveProgress {
  id: string;
  description: string;
  current: number;
  target: number;
  complete: boolean;
}

/** GP-003 §The Campaign: "no two players' galaxies" reset — this is the
 * permanent-save shape campaign progress round-trips through. grantedUnlocks/
 * firedEvents/appliedWorldChanges mirror static chapter data (never player
 * state) and are recomputed from chapterIndex on load rather than serialized;
 * the pending story-beat queue is a same-session presentation-drain queue
 * (AF-068 §Design constraints), deliberately not persisted. */
export interface CampaignSaveData {
  chapterIndex: number;
  finalChapterGranted: boolean;
  counters: Readonly<Record<string, number>>;
  flags: readonly string[];
  choices: ReadonlyArray<{ domain: ChoiceDomain; optionId: string }>;
}

export interface CampaignSnapshot {
  stage: CampaignStage;
  chapterName: string;
  chapterIndex: number;
  chapterCount: number;
  objectives: readonly CampaignObjectiveProgress[];
  storyFlagCount: number;
  unlockCount: number;
  pendingBeats: number;
  choiceCount: number;
  majorEventsFired: number;
  worldChangeCount: number;
  isComplete: boolean;
}

export class CampaignRuntime {
  private chapterIndex = 0;
  private finalChapterGranted = false;
  private readonly counters = new Map<string, number>();
  private readonly flags = new Set<string>();
  private readonly choices: Array<{ domain: ChoiceDomain; optionId: string }> = [];
  private readonly beatQueue: CampaignStoryBeatDef[] = [];
  private readonly grantedUnlocks: CampaignUnlockDef[] = [];
  private readonly firedEvents: MajorEventKind[] = [];
  private readonly appliedWorldChanges: CampaignWorldChangeDef[] = [];

  constructor(private readonly chapters: readonly CampaignChapterDef[]) {
    if (chapters.length === 0) throw new Error("Campaign requires at least one chapter");
    // A trailing zero-objective chapter is the open post-campaign door; a
    // LEADING one would auto-complete instantly, which is also legal — sweep
    // forward so construction lands on the first incomplete chapter.
    this.advanceThroughSatisfiedChapters();
  }

  /** Feed play into the campaign — AF-026/035/037's counterKey pattern, no new progress engine. */
  recordProgress(counterKey: string, amount = 1): void {
    this.counters.set(counterKey, (this.counters.get(counterKey) ?? 0) + amount);
    this.advanceThroughSatisfiedChapters();
  }

  /** Append-only by construction — there is no operation that removes a choice, flag, or unlock. */
  recordChoice(domain: ChoiceDomain, optionId: string): void {
    this.choices.push({ domain, optionId });
  }

  grantStoryFlag(flag: string): void {
    this.flags.add(flag);
  }

  hasStoryFlag(flag: string): boolean {
    return this.flags.has(flag);
  }

  /** Presentation drains beats at its own pace — gameplay never pauses for story. */
  consumeStoryBeat(): CampaignStoryBeatDef | null {
    return this.beatQueue.shift() ?? null;
  }

  get stage(): CampaignStage {
    return this.currentChapter.stage;
  }

  get currentChapter(): CampaignChapterDef {
    return this.chapters[Math.min(this.chapterIndex, this.chapters.length - 1)]!;
  }

  /** True once the final chapter's stage is reached — the galaxy stays alive from here. */
  get isComplete(): boolean {
    return this.chapterIndex >= this.chapters.length - 1 && this.objectiveProgress().every((o) => o.complete);
  }

  get unlocks(): readonly CampaignUnlockDef[] {
    return this.grantedUnlocks;
  }

  get majorEventsFired(): readonly MajorEventKind[] {
    return this.firedEvents;
  }

  get worldChanges(): readonly CampaignWorldChangeDef[] {
    return this.appliedWorldChanges;
  }

  get choiceLog(): ReadonlyArray<{ domain: ChoiceDomain; optionId: string }> {
    return this.choices;
  }

  /** AF-038's LongTermGoalKind shelf, first producer: the post-campaign horizon. */
  get postCampaignGoals(): readonly LongTermGoalKind[] {
    return [...new Set(POST_CAMPAIGN_KINDS.map((kind) => POST_CAMPAIGN_TO_LONG_TERM_GOAL[kind]))];
  }

  objectiveProgress(): readonly CampaignObjectiveProgress[] {
    return this.currentChapter.objectives.map((objective) => {
      const current = this.counters.get(objective.counterKey) ?? 0;
      return {
        id: objective.id,
        description: objective.description,
        current: Math.min(current, objective.target),
        target: objective.target,
        complete: current >= objective.target,
      };
    });
  }

  get snapshot(): CampaignSnapshot {
    return {
      stage: this.stage,
      chapterName: this.currentChapter.name,
      chapterIndex: this.chapterIndex,
      chapterCount: this.chapters.length,
      objectives: this.objectiveProgress(),
      storyFlagCount: this.flags.size,
      unlockCount: this.grantedUnlocks.length,
      pendingBeats: this.beatQueue.length,
      choiceCount: this.choices.length,
      majorEventsFired: this.firedEvents.length,
      worldChangeCount: this.appliedWorldChanges.length,
      isComplete: this.isComplete,
    };
  }

  toSave(): CampaignSaveData {
    return {
      chapterIndex: this.chapterIndex,
      finalChapterGranted: this.finalChapterGranted,
      counters: Object.fromEntries(this.counters),
      flags: [...this.flags],
      choices: [...this.choices],
    };
  }

  /** Restore from a save slice. grantedUnlocks/firedEvents/appliedWorldChanges
   * are recomputed from the loaded chapterIndex (static chapter content),
   * never serialized directly; the pending beat queue is deliberately reset. */
  loadSave(data: CampaignSaveData): void {
    this.counters.clear();
    for (const [key, value] of Object.entries(data.counters)) this.counters.set(key, Math.max(0, value));
    this.flags.clear();
    for (const flag of data.flags) this.flags.add(flag);
    this.choices.length = 0;
    this.choices.push(...data.choices);
    this.chapterIndex = Math.max(0, Math.min(data.chapterIndex, this.chapters.length - 1));
    this.finalChapterGranted = data.finalChapterGranted;
    this.beatQueue.length = 0;
    this.grantedUnlocks.length = 0;
    this.firedEvents.length = 0;
    this.appliedWorldChanges.length = 0;
    for (let i = 0; i < this.chapterIndex; i += 1) {
      const chapter = this.chapters[i]!;
      this.grantedUnlocks.push(...chapter.unlocks);
      this.appliedWorldChanges.push(...chapter.worldChanges);
      if (chapter.majorEvent) this.firedEvents.push(chapter.majorEvent);
    }
    if (this.finalChapterGranted && this.chapterIndex === this.chapters.length - 1) {
      const last = this.chapters[this.chapters.length - 1]!;
      this.grantedUnlocks.push(...last.unlocks);
      this.appliedWorldChanges.push(...last.worldChanges);
      if (last.majorEvent) this.firedEvents.push(last.majorEvent);
    }
  }

  /** Counters persist across chapters, so a satisfied next chapter completes immediately —
   * "every stage naturally unlocks the next", including in chains. The final chapter is
   * never advanced past: post-campaign is a standing state, not an exit. */
  private advanceThroughSatisfiedChapters(): void {
    while (this.chapterIndex < this.chapters.length - 1) {
      const chapter = this.chapters[this.chapterIndex]!;
      const satisfied = chapter.objectives.every((o) => (this.counters.get(o.counterKey) ?? 0) >= o.target);
      if (!satisfied) return;
      this.beatQueue.push(...chapter.storyBeats);
      for (const flag of chapter.storyFlags) this.flags.add(flag);
      this.grantedUnlocks.push(...chapter.unlocks);
      this.appliedWorldChanges.push(...chapter.worldChanges);
      if (chapter.majorEvent) this.firedEvents.push(chapter.majorEvent);
      this.chapterIndex += 1;
    }
    // Final chapter: grant its payload exactly once when reached with no objectives outstanding.
    const last = this.chapters[this.chapters.length - 1]!;
    if (this.chapterIndex === this.chapters.length - 1 && !this.finalChapterGranted) {
      const satisfied = last.objectives.every((o) => (this.counters.get(o.counterKey) ?? 0) >= o.target);
      if (satisfied) {
        this.finalChapterGranted = true;
        this.beatQueue.push(...last.storyBeats);
        for (const flag of last.storyFlags) this.flags.add(flag);
        this.grantedUnlocks.push(...last.unlocks);
        this.appliedWorldChanges.push(...last.worldChanges);
        if (last.majorEvent) this.firedEvents.push(last.majorEvent);
      }
    }
  }
}
