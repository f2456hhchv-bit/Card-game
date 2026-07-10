/**
 * AtlasFrameworkRuntime pieces (AF-143). `commanderCompletenessFor`/
 * `worldCompletenessFor` take plain signal values a caller extracts from
 * real systems — the decoupled-composition discipline AF-137's
 * `tierWeightsFor` established, continued through AF-138/139/140/141/142.
 */
import {
  COMMANDER_VALIDATION_CHECKLIST,
  WORLD_VALIDATION_CHECKLIST,
  type CommanderCompletenessSignals,
  type CommanderValidationCheck,
  type DesignScoreCategory,
  type KnowledgeBaseCategory,
  type PostLaunchTrackingCategory,
  type WorldCompletenessSignals,
  type WorldValidationCheck,
  DESIGN_SCORE_CATEGORIES,
  DESIGN_SCORE_GATE_THRESHOLD,
} from "./atlasFrameworkData";

export interface CompletenessReport<TCheck extends string> {
  checks: Readonly<Record<TCheck, boolean>>;
  passed: boolean;
}

/** "Every future Commander must include..." — real, composed signals in,
 * a real per-check report out. Never imports AF-130/131/134/135 directly. */
export function commanderCompletenessFor(signals: CommanderCompletenessSignals): CompletenessReport<CommanderValidationCheck> {
  const checks: Record<CommanderValidationCheck, boolean> = {
    "Unique fantasy": signals.hasUniqueFantasy,
    "No gameplay duplication": !signals.gameplayDuplicatesExisting,
    "Bond Network integration": signals.bondLinkCount > 0,
    "Living Ship interactions": signals.shipRoomAssigned,
    "Museum contribution": signals.museumContributionCount > 0,
    "Chronicle biography": signals.hasChronicleBiography,
    "Personal quests": signals.personalQuestCount > 0,
    "Mastery track": signals.masteryTrackProgress > 0,
    "Accessibility review": signals.accessibilityReviewed,
  };
  const passed = COMMANDER_VALIDATION_CHECKLIST.every((check) => checks[check]);
  return { checks, passed };
}

/** "Every new planet must include..." — same decoupled-composition shape. */
export function worldCompletenessFor(signals: WorldCompletenessSignals): CompletenessReport<WorldValidationCheck> {
  const checks: Record<WorldValidationCheck, boolean> = {
    "Unique ecology": signals.hasUniqueEcology,
    "Distinct architecture": signals.hasDistinctArchitecture,
    "Weather profile": signals.hasWeatherProfile,
    Wildlife: signals.hasWildlife,
    History: signals.hasHistory,
    Economy: signals.hasEconomy,
    Culture: signals.hasCulture,
    Music: signals.hasMusic,
    "Exploration identity": signals.hasExplorationIdentity,
    "Museum compatibility": signals.museumCompatible,
  };
  const passed = WORLD_VALIDATION_CHECKLIST.every((check) => checks[check]);
  return { checks, passed };
}

/**
 * "Every feature receives... only features scoring above 9.5/10
 * proceed." The spec's own, genuinely new 9-category rubric — kept
 * distinct from the real 10-category gate `docs/FOUNDATION_LOCK.md`
 * already governs this project by (see module doc comment). Scores are
 * clamped 0-10; the gate requires every category scored AND the average
 * above `DESIGN_SCORE_GATE_THRESHOLD`.
 */
export class DesignScoreCard {
  private readonly scores = new Map<DesignScoreCategory, number>();

  score(category: DesignScoreCategory, value: number): void {
    this.scores.set(category, Math.max(0, Math.min(10, value)));
  }

  scoreFor(category: DesignScoreCategory): number | null {
    return this.scores.get(category) ?? null;
  }

  isComplete(): boolean {
    return DESIGN_SCORE_CATEGORIES.every((category) => this.scores.has(category));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const category of DESIGN_SCORE_CATEGORIES) total += this.scores.get(category) ?? 0;
    return total / DESIGN_SCORE_CATEGORIES.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= DESIGN_SCORE_GATE_THRESHOLD;
  }
}

export interface PostLaunchRecord {
  category: PostLaunchTrackingCategory;
  note: string;
  epoch: number;
}

/** "Every release tracks... nothing is abandoned." Append-only —
 * confirmed genuinely new: neither AF-070's `LiveOpsRegistry` nor
 * AF-142's `ModuleRegistry` tracks any metric over time, only at
 * registration time. */
export class PostLaunchSupportTracker {
  private readonly records: PostLaunchRecord[] = [];

  record(category: PostLaunchTrackingCategory, note: string, epoch: number): PostLaunchRecord {
    const entry: PostLaunchRecord = { category, note, epoch };
    this.records.push(entry);
    return entry;
  }

  all(): readonly PostLaunchRecord[] {
    return this.records;
  }

  historyFor(category: PostLaunchTrackingCategory): readonly PostLaunchRecord[] {
    return this.records.filter((r) => r.category === category);
  }

  countFor(category: PostLaunchTrackingCategory): number {
    return this.historyFor(category).length;
  }
}

export interface KnowledgeBaseEntry {
  category: KnowledgeBaseCategory;
  title: string;
  description: string;
  sequence: number;
}

/** "Every solved problem becomes reusable knowledge... future teams
 * inherit accumulated experience." Append-only — knowledge is never
 * deleted, only added to. */
export class KnowledgeBaseRegistry {
  private readonly entries: KnowledgeBaseEntry[] = [];

  contribute(category: KnowledgeBaseCategory, title: string, description: string): KnowledgeBaseEntry {
    const entry: KnowledgeBaseEntry = { category, title, description, sequence: this.entries.length };
    this.entries.push(entry);
    return entry;
  }

  all(): readonly KnowledgeBaseEntry[] {
    return this.entries;
  }

  countFor(category: KnowledgeBaseCategory): number {
    return this.entries.filter((e) => e.category === category).length;
  }
}
