import type { AcademicSchoolName, PhilosophicalEventKind, PlayerPhilosophyDimension } from "./atlasPhilosophyData";

interface BeliefRecord {
  belief: string;
  epoch: number;
}

/** "Each Commander develops personal beliefs... these beliefs evolve
 * naturally." Built generically over any real commander id rather than
 * hard-coding the spec's six illustrative names (see module doc
 * comment) — a full history is kept since beliefs evolve, never
 * overwritten in place. */
export class CommanderBeliefTracker {
  private readonly records = new Map<string, BeliefRecord[]>();

  setBelief(commanderId: string, belief: string, epoch: number): void {
    const history = this.records.get(commanderId) ?? [];
    history.push({ belief, epoch });
    this.records.set(commanderId, history);
  }

  beliefOf(commanderId: string): string | null {
    const history = this.records.get(commanderId);
    return history && history.length > 0 ? history[history.length - 1]!.belief : null;
  }

  history(commanderId: string): readonly BeliefRecord[] {
    return this.records.get(commanderId) ?? [];
  }
}

interface AdherenceRecord {
  schoolName: AcademicSchoolName;
  epoch: number;
}

/** "Different philosophies emerge... each influences society
 * differently." Tracks which school an entity currently adheres to,
 * over the real `ACADEMIC_SCHOOLS` catalogue. */
export class AcademicInfluenceTracker {
  private readonly records = new Map<string, AdherenceRecord[]>();

  recordAdherence(entityId: string, schoolName: AcademicSchoolName, epoch: number): void {
    const history = this.records.get(entityId) ?? [];
    history.push({ schoolName, epoch });
    this.records.set(entityId, history);
  }

  schoolOf(entityId: string): AcademicSchoolName | null {
    const history = this.records.get(entityId);
    return history && history.length > 0 ? history[history.length - 1]!.schoolName : null;
  }
}

/** "The game observes. It never labels." Per-dimension tallies only —
 * deliberately exposes no function that collapses these into a single
 * categorical player "type" (see atlasPhilosophyData.ts module doc
 * comment). */
export class PlayerPhilosophyObserver {
  private readonly tallies = new Map<PlayerPhilosophyDimension, number>();

  observe(dimension: PlayerPhilosophyDimension): void {
    this.tallies.set(dimension, (this.tallies.get(dimension) ?? 0) + 1);
  }

  tallyFor(dimension: PlayerPhilosophyDimension): number {
    return this.tallies.get(dimension) ?? 0;
  }

  observedDimensions(): readonly PlayerPhilosophyDimension[] {
    return Array.from(this.tallies.keys());
  }
}

interface PhilosophicalEventRecord {
  kind: PhilosophicalEventKind;
  description: string;
  epoch: number;
}

/** "Nothing changes through combat. Ideas matter." Append-only record
 * of scheduled philosophical events. */
export class PhilosophicalEventLog {
  private readonly records: PhilosophicalEventRecord[] = [];

  schedule(kind: PhilosophicalEventKind, description: string, epoch: number): void {
    this.records.push({ kind, description, epoch });
  }

  countFor(kind: PhilosophicalEventKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }

  all(): readonly PhilosophicalEventRecord[] {
    return this.records;
  }
}
