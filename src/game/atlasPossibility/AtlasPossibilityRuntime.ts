import type { InnovationMemoryOutcome, MysteryKind, PlayerInspirationKind, Possibility } from "./atlasPossibilityData";

/** Real storage for "Opportunity Network" — every possibility links to
 * required knowledge/people/locations, risks, rewards, historical
 * significance and future implications (see the `Possibility`
 * interface). */
export class PossibilityRegistry {
  private readonly possibilities = new Map<string, Possibility>();

  register(possibility: Possibility): void {
    this.possibilities.set(possibility.id, possibility);
  }

  get(id: string): Possibility | null {
    return this.possibilities.get(id) ?? null;
  }

  all(): readonly Possibility[] {
    return Array.from(this.possibilities.values());
  }
}

interface InspirationRecord {
  kind: PlayerInspirationKind;
  description: string;
  epoch: number;
}

/** Mirrors AF-155's real `DiscoverySuggestionLog`/AF-158's real
 * `OpportunityLog` append-only shape, but over this module's own
 * `PlayerInspirationKind` union (see atlasPossibilityData.ts module
 * doc comment). */
export class PlayerInspirationLog {
  private readonly records: InspirationRecord[] = [];

  surface(kind: PlayerInspirationKind, description: string, epoch: number): void {
    this.records.push({ kind, description, epoch });
  }

  countFor(kind: PlayerInspirationKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }

  all(): readonly InspirationRecord[] {
    return this.records;
  }
}

interface SerendipityRecord {
  description: string;
  participantIds: readonly string[];
  epoch: number;
}

/** "Nothing feels contrived." Free-text records rather than a closed
 * union — the four spec'd examples are full scenarios, not short
 * category names. Surfacing a real serendipity moment should compose
 * AF-151's real `KnowledgeGraph.suggestConnections` at the call site
 * (see module doc comment) rather than a second convergence algorithm. */
export class SerendipityLog {
  private readonly records: SerendipityRecord[] = [];

  record(description: string, participantIds: readonly string[], epoch: number): void {
    this.records.push({ description, participantIds, epoch });
  }

  all(): readonly SerendipityRecord[] {
    return this.records;
  }
}

interface MysteryRecord {
  id: string;
  kind: MysteryKind;
  description: string;
  openedEpoch: number;
  resolvedEpoch: number | null;
}

/** "Players always have mysteries worth pursuing." A mystery stays
 * open until explicitly resolved — `unsolved()` is never empty by
 * construction once at least one mystery has been opened and not
 * every one resolved. */
export class MysteryLog {
  private readonly records: MysteryRecord[] = [];

  open(id: string, kind: MysteryKind, description: string, epoch: number): void {
    this.records.push({ id, kind, description, openedEpoch: epoch, resolvedEpoch: null });
  }

  resolve(id: string, epoch: number): void {
    const record = this.records.find((r) => r.id === id);
    if (record) record.resolvedEpoch = epoch;
  }

  unsolved(): readonly MysteryRecord[] {
    return this.records.filter((r) => r.resolvedEpoch === null);
  }

  all(): readonly MysteryRecord[] {
    return this.records;
  }
}

interface CulturalTrendRecord {
  trend: string;
  adopterId: string;
  epoch: number;
}

/** "New ideas spread." Tracks which entities have adopted which
 * cultural trend, over plain caller-supplied trend names rather than a
 * closed union (cultural movements are player/simulation-authored, not
 * a fixed catalogue). */
export class CulturalTrendTracker {
  private readonly records: CulturalTrendRecord[] = [];

  record(trend: string, adopterId: string, epoch: number): void {
    this.records.push({ trend, adopterId, epoch });
  }

  adoptersFor(trend: string): readonly string[] {
    return this.records.filter((r) => r.trend === trend).map((r) => r.adopterId);
  }
}

interface InnovationMemoryRecord {
  possibilityId: string;
  outcomes: readonly InnovationMemoryOutcome[];
  epoch: number;
}

/** The THIRD mirrored "completed work becomes a named output" archive
 * in this codebase, after AF-157's real `PlanMemoryArchive` and AF-158's
 * real `FutureMemoryArchive` (see atlasPossibilityData.ts module doc
 * comment). */
export class InnovationMemoryArchive {
  private readonly records: InnovationMemoryRecord[] = [];

  archive(possibilityId: string, outcomes: readonly InnovationMemoryOutcome[], epoch: number): void {
    this.records.push({ possibilityId, outcomes, epoch });
  }

  outcomesFor(possibilityId: string): readonly InnovationMemoryOutcome[] {
    return this.records.find((r) => r.possibilityId === possibilityId)?.outcomes ?? [];
  }

  all(): readonly InnovationMemoryRecord[] {
    return this.records;
  }
}
