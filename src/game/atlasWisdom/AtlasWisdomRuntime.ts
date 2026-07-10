import { COMMANDER_WISDOM_TRAITS, type CommanderWisdomTrait, type WisdomMemoryOutcome } from "./atlasWisdomData";

/** "Commanders gradually develop [6 traits]... leadership evolves
 * naturally." Six fine-grained scores per Commander that accumulate
 * with lived experience — never AF-030's fixed, dialogue-only
 * `PersonalityTrait`, and a finer grain than AF-139's real 4-stage
 * `COMMANDER_MATURITY_STAGES` ladder (see module doc comment for the
 * full distinction). */
export class CommanderWisdomTracker {
  private readonly scores = new Map<string, Map<CommanderWisdomTrait, number>>();

  develop(commanderId: string, trait: CommanderWisdomTrait, amount: number): void {
    const traits = this.scores.get(commanderId) ?? new Map(COMMANDER_WISDOM_TRAITS.map((t) => [t, 0]));
    traits.set(trait, Math.max(0, Math.min(100, (traits.get(trait) ?? 0) + amount)));
    this.scores.set(commanderId, traits);
  }

  traitScore(commanderId: string, trait: CommanderWisdomTrait): number {
    return this.scores.get(commanderId)?.get(trait) ?? 0;
  }

  overallWisdom(commanderId: string): number {
    const traits = this.scores.get(commanderId);
    if (!traits) return 0;
    return Array.from(traits.values()).reduce((sum, value) => sum + value, 0) / COMMANDER_WISDOM_TRAITS.length;
  }
}

interface MentorshipRecord {
  mentorId: string;
  menteeId: string;
  epoch: number;
}

/** "Mentorship preserves wisdom. Not just skill." The first REAL
 * mentor/mentee relationship ledger in the codebase (see module doc
 * comment) — prior mentions of mentorship elsewhere were reference
 * vocabulary only. */
export class MentorshipLedger {
  private readonly records: MentorshipRecord[] = [];

  assign(mentorId: string, menteeId: string, epoch: number): void {
    this.records.push({ mentorId, menteeId, epoch });
  }

  menteesOf(mentorId: string): readonly string[] {
    return this.records.filter((r) => r.mentorId === mentorId).map((r) => r.menteeId);
  }

  mentorOf(menteeId: string): string | null {
    return this.records.find((r) => r.menteeId === menteeId)?.mentorId ?? null;
  }

  all(): readonly MentorshipRecord[] {
    return this.records;
  }
}

interface WisdomMemoryRecord {
  lessonId: string;
  outcomes: readonly WisdomMemoryOutcome[];
  epoch: number;
}

/** The FOURTH mirrored "completed experience becomes a named
 * institution" archive in this codebase, after AF-157/158/159's real
 * `PlanMemoryArchive`/`FutureMemoryArchive`/`InnovationMemoryArchive`
 * (see atlasWisdomData.ts module doc comment). */
export class WisdomMemoryArchive {
  private readonly records: WisdomMemoryRecord[] = [];

  archive(lessonId: string, outcomes: readonly WisdomMemoryOutcome[], epoch: number): void {
    this.records.push({ lessonId, outcomes, epoch });
  }

  outcomesFor(lessonId: string): readonly WisdomMemoryOutcome[] {
    return this.records.find((r) => r.lessonId === lessonId)?.outcomes ?? [];
  }

  all(): readonly WisdomMemoryRecord[] {
    return this.records;
  }
}
