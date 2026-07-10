import type { CommanderPurposeFacet, IndividualPurposeKind, PlayerPurposeKind, PurposeMemoryOutcome } from "./atlasPurposeData";

interface IndividualPurposeRecord {
  kind: IndividualPurposeKind;
  epoch: number;
}

/** "Purpose evolves naturally through life." A full history per
 * citizen, mirroring AF-161's real `CommanderBeliefTracker` shape —
 * never overwritten in place. */
export class IndividualPurposeTracker {
  private readonly records = new Map<string, IndividualPurposeRecord[]>();

  discover(citizenId: string, kind: IndividualPurposeKind, epoch: number): void {
    const history = this.records.get(citizenId) ?? [];
    history.push({ kind, epoch });
    this.records.set(citizenId, history);
  }

  purposeOf(citizenId: string): IndividualPurposeKind | null {
    const history = this.records.get(citizenId);
    return history && history.length > 0 ? history[history.length - 1]!.kind : null;
  }
}

interface CommanderPurposeRecord {
  facet: CommanderPurposeFacet;
  description: string;
  epoch: number;
}

/** "Their purpose evolves with experience." Tracks each of a
 * Commander's 5 purpose facets independently, each with its own
 * history. */
export class CommanderPurposeTracker {
  private readonly records = new Map<string, CommanderPurposeRecord[]>();

  setFacet(commanderId: string, facet: CommanderPurposeFacet, description: string, epoch: number): void {
    const history = this.records.get(commanderId) ?? [];
    history.push({ facet, description, epoch });
    this.records.set(commanderId, history);
  }

  facetOf(commanderId: string, facet: CommanderPurposeFacet): string | null {
    const history = this.records.get(commanderId) ?? [];
    const matching = history.filter((r) => r.facet === facet);
    return matching.length > 0 ? matching[matching.length - 1]!.description : null;
  }
}

/** "The game never assigns destiny... the player's actions reveal
 * purpose." Deliberately less strict than AF-161's real
 * `PlayerPhilosophyObserver` (see atlasPurposeData.ts module doc
 * comment) — `dominantPurpose` is an emergent read of real tallies,
 * never a destiny assigned before anything has been observed. */
export class PlayerPurposeObserver {
  private readonly tallies = new Map<PlayerPurposeKind, number>();

  observe(kind: PlayerPurposeKind): void {
    this.tallies.set(kind, (this.tallies.get(kind) ?? 0) + 1);
  }

  tallyFor(kind: PlayerPurposeKind): number {
    return this.tallies.get(kind) ?? 0;
  }

  dominantPurpose(): PlayerPurposeKind | null {
    if (this.tallies.size === 0) return null;
    let best: PlayerPurposeKind | null = null;
    let bestCount = 0;
    for (const [kind, count] of this.tallies) {
      if (count > bestCount) {
        best = kind;
        bestCount = count;
      }
    }
    return best;
  }
}

interface LongTermMission {
  id: string;
  description: string;
  targetProgress: number;
  currentProgress: number;
}

/** "These span generations." Real progress tracking rather than
 * reference-only flavour text. */
export class LongTermMissionTracker {
  private readonly missions = new Map<string, LongTermMission>();

  register(id: string, description: string, targetProgress: number): void {
    this.missions.set(id, { id, description, targetProgress, currentProgress: 0 });
  }

  advance(id: string, delta: number): void {
    const mission = this.missions.get(id);
    if (mission) mission.currentProgress = Math.max(0, Math.min(mission.targetProgress, mission.currentProgress + delta));
  }

  progressFor(id: string): number {
    const mission = this.missions.get(id);
    return mission ? mission.currentProgress / mission.targetProgress : 0;
  }

  isComplete(id: string): boolean {
    const mission = this.missions.get(id);
    return mission ? mission.currentProgress >= mission.targetProgress : false;
  }

  all(): readonly LongTermMission[] {
    return Array.from(this.missions.values());
  }
}

interface PurposeMemoryRecord {
  purposeId: string;
  outcomes: readonly PurposeMemoryOutcome[];
  epoch: number;
}

/** The FIFTH mirrored "completed work becomes a named output" archive
 * in this codebase, after AF-157/158/159/160's real
 * `PlanMemoryArchive`/`FutureMemoryArchive`/`InnovationMemoryArchive`/
 * `WisdomMemoryArchive` (see atlasPurposeData.ts module doc comment). */
export class PurposeMemoryArchive {
  private readonly records: PurposeMemoryRecord[] = [];

  archive(purposeId: string, outcomes: readonly PurposeMemoryOutcome[], epoch: number): void {
    this.records.push({ purposeId, outcomes, epoch });
  }

  outcomesFor(purposeId: string): readonly PurposeMemoryOutcome[] {
    return this.records.find((r) => r.purposeId === purposeId)?.outcomes ?? [];
  }

  all(): readonly PurposeMemoryRecord[] {
    return this.records;
  }
}
