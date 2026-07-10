/**
 * EndgameEngineRuntime pieces (AF-140). Every class composes with real
 * locked state via plain ids/values passed in by the caller (main.ts),
 * the same decoupled-composition discipline established by AF-137's
 * `tierWeightsFor` and continued through AF-139.
 */
import {
  ANNUAL_ENDGAME_EVENT_KINDS,
  GREAT_EXPEDITION_DESTINATIONS,
  type AnnualEndgameEventKind,
  type CommanderLegacyRoleKind,
  type EmergentIndustryKind,
  type ExpeditionCouncilPriority,
  type MegaDiscoveryKind,
} from "./endgameEngineData";

/** "Entire unexplored galaxies become available... each lasts dozens of
 * hours." Progress is capped 0-100 per destination and never regresses. */
export class FrontierExpeditionRegistry {
  private readonly progress = new Map<string, number>();

  advance(destinationId: string, amount: number): number {
    const next = Math.min(100, this.progressFor(destinationId) + Math.max(0, amount));
    this.progress.set(destinationId, next);
    return next;
  }

  progressFor(destinationId: string): number {
    return this.progress.get(destinationId) ?? 0;
  }

  isComplete(destinationId: string): boolean {
    return this.progressFor(destinationId) >= 100;
  }

  completedCount(): number {
    return GREAT_EXPEDITION_DESTINATIONS.filter((d) => this.isComplete(d.id)).length;
  }
}

export interface SuccessorRecord {
  id: string;
  mentorCommanderId: string;
  name: string;
  epoch: number;
}

/** "Every Commander gains Legacy Missions, Teaching roles... students,
 * protégés. New generations appear... not replacements, successors."
 * Roles are a per-commander set (idempotent); successors are lore-only,
 * append-only records — never new entries in AF-030's real, closed
 * commander roster arrays. */
export class CommanderLegacyRuntime {
  private readonly roles = new Map<string, Set<CommanderLegacyRoleKind>>();
  private readonly successors: SuccessorRecord[] = [];

  assignRole(commanderId: string, role: CommanderLegacyRoleKind): void {
    const set = this.roles.get(commanderId) ?? new Set<CommanderLegacyRoleKind>();
    set.add(role);
    this.roles.set(commanderId, set);
  }

  rolesFor(commanderId: string): readonly CommanderLegacyRoleKind[] {
    return [...(this.roles.get(commanderId) ?? [])];
  }

  induct(mentorCommanderId: string, name: string, epoch: number): SuccessorRecord {
    const record: SuccessorRecord = { id: `successor-${this.successors.length}`, mentorCommanderId, name, epoch };
    this.successors.push(record);
    return record;
  }

  successorsFor(mentorCommanderId: string): readonly SuccessorRecord[] {
    return this.successors.filter((s) => s.mentorCommanderId === mentorCommanderId);
  }

  all(): readonly SuccessorRecord[] {
    return this.successors;
  }
}

/** "Late-game government... player helps shape... nothing is
 * mandatory." Mirrors AF-138's real `GovernmentPriorityTracker` lean-only
 * mechanic exactly (a lean is nudged, never hard-set) but typed to its
 * own priority vocabulary. */
export class ExpeditionCouncilTracker {
  private readonly leans = new Map<ExpeditionCouncilPriority, number>();

  influence(priority: ExpeditionCouncilPriority, amount: number): void {
    this.leans.set(priority, (this.leans.get(priority) ?? 0) + amount);
  }

  leaningFor(priority: ExpeditionCouncilPriority): number {
    return this.leans.get(priority) ?? 0;
  }

  dominantPriority(): ExpeditionCouncilPriority | null {
    let best: ExpeditionCouncilPriority | null = null;
    let bestValue = 0;
    for (const [priority, value] of this.leans) {
      if (value > bestValue) {
        best = priority;
        bestValue = value;
      }
    }
    return best;
  }
}

export interface MegaDiscoveryRecord {
  kind: MegaDiscoveryKind;
  description: string;
  epoch: number;
  sequence: number;
}

/** "Each permanently expands lore" — append-only, never overwritten. */
export class MegaDiscoveryLog {
  private readonly records: MegaDiscoveryRecord[] = [];

  discover(kind: MegaDiscoveryKind, description: string, epoch: number): MegaDiscoveryRecord {
    const record: MegaDiscoveryRecord = { kind, description, epoch, sequence: this.records.length };
    this.records.push(record);
    return record;
  }

  all(): readonly MegaDiscoveryRecord[] {
    return this.records;
  }

  countFor(kind: MegaDiscoveryKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }
}

/** "Museum becomes galactic. Artifacts arrive automatically. Researchers
 * travel across sectors." Additive over AF-134's real
 * `MuseumQualityTracker`/`MuseumCollectionRegistry` — never a second
 * quality/collection tracker, just the two genuinely new counters. */
export class GalacticMuseumExpansionTracker {
  private readonly sectorsCovered = new Set<string>();
  private artifactsArrived = 0;

  dispatchResearcher(sectorId: string): void {
    this.sectorsCovered.add(sectorId);
  }

  sectorCount(): number {
    return this.sectorsCovered.size;
  }

  receiveArtifact(): void {
    this.artifactsArrived += 1;
  }

  artifactCount(): number {
    return this.artifactsArrived;
  }
}

export interface MegacityRecord {
  settlementId: string;
  epoch: number;
}

/** "New megacities emerge" — append-only, one record per settlement the
 * first time it crosses AF-090's real population + specialisation
 * threshold (`megacityThresholdMet`); never re-recorded. */
export class MegacityLedger {
  private readonly records: MegacityRecord[] = [];

  record(settlementId: string, epoch: number): boolean {
    if (this.records.some((r) => r.settlementId === settlementId)) return false;
    this.records.push({ settlementId, epoch });
    return true;
  }

  all(): readonly MegacityRecord[] {
    return this.records;
  }

  isMegacity(settlementId: string): boolean {
    return this.records.some((r) => r.settlementId === settlementId);
  }
}

export interface EmergentIndustryRecord {
  kind: EmergentIndustryKind;
  epoch: number;
}

/** "New industries appear... tourism flourishes." Append-only, gated by
 * `industryEmergenceEligible` at the call site rather than a random roll. */
export class EmergentIndustryLedger {
  private readonly records: EmergentIndustryRecord[] = [];

  emerge(kind: EmergentIndustryKind, epoch: number): void {
    this.records.push({ kind, epoch });
  }

  all(): readonly EmergentIndustryRecord[] {
    return this.records;
  }

  countFor(kind: EmergentIndustryKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }
}

/** "Every in-game year includes..." — a small, deterministic
 * epoch-cycling calendar, deliberately kept separate from (never merged
 * with) AF-132's real `FestivalCalendar` and AF-138's real
 * `SocialEventCalendar` despite some documented flavour overlap. */
export class AnnualEndgameCalendar {
  private epoch = 0;

  currentEvent(): AnnualEndgameEventKind {
    return ANNUAL_ENDGAME_EVENT_KINDS[this.epoch % ANNUAL_ENDGAME_EVENT_KINDS.length]!;
  }

  advanceEpoch(): void {
    this.epoch += 1;
  }
}
