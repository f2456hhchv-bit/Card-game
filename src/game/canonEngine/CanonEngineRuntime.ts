/**
 * CanonEngineRuntime pieces (AF-148). `KnowledgeStateTracker` reuses
 * AF-135's real `EvolvingEntry` for "Historical Understanding" directly
 * — the one state that must expand-not-overwrite, per the confirmed
 * research finding that `EvolvingEntry` already fully implements that
 * mechanic.
 */
import { EvolvingEntry, type AuthorVoice } from "../chronicle/chronicleData";
import type { PlanetaryChronicle } from "../chronicle/ChronicleRuntime";
import { GalacticHistoryLog } from "../legacy/LegacyEngineRuntime";
import type { OfficialHistoricalRecord } from "../legacy/legacyEngineData";
import type { ArtifactAuthenticityRecord, CanonEventRecord, PlanetContinuityField } from "./canonEngineData";

/**
 * "Every event stores date/participants/planet/galaxy/commanders/
 * witnesses/evidence/museum+chronicle references/relationship impact/
 * future callbacks" — a genuinely richer shape than AF-133's real
 * `OfficialHistoricalRecord` (no witnesses/evidence fields there).
 * Optionally forwards a summarised entry into that real, locked log —
 * the same `forwardTo` composition pattern AF-133 itself established
 * for reaching into AF-086's `GalacticHistoryRuntime`.
 */
export class CanonEventLedger {
  private readonly records: CanonEventRecord[] = [];

  constructor(private readonly forwardTo?: GalacticHistoryLog) {}

  record(event: CanonEventRecord, forwardedSummary?: Omit<OfficialHistoricalRecord, "id">): CanonEventRecord {
    this.records.push(event);
    if (this.forwardTo && forwardedSummary) this.forwardTo.record(forwardedSummary);
    return event;
  }

  all(): readonly CanonEventRecord[] {
    return this.records;
  }

  eventFor(id: string): CanonEventRecord | null {
    return this.records.find((r) => r.id === id) ?? null;
  }
}

/**
 * "Every historical event exists in three forms... these may differ."
 * Objective Reality is enforced-immutable ("Core Timeline cannot be
 * contradicted" — Canon Pyramid Level One), Historical Understanding
 * reuses AF-135's real `EvolvingEntry` directly (expand-not-overwrite),
 * and Public Knowledge is freely mutable, since ordinary citizens'
 * awareness genuinely lags and shifts.
 */
export class KnowledgeStateTracker {
  private readonly objectiveReality = new Map<string, string>();
  private readonly historicalUnderstanding = new Map<string, EvolvingEntry>();
  private readonly publicKnowledge = new Map<string, string>();

  setObjectiveReality(eventId: string, truth: string): void {
    const existing = this.objectiveReality.get(eventId);
    if (existing !== undefined && existing !== truth) {
      throw new Error(`Objective Reality for "${eventId}" is Canon Pyramid Level One — it cannot be contradicted once set.`);
    }
    this.objectiveReality.set(eventId, truth);
  }

  objectiveRealityFor(eventId: string): string | null {
    return this.objectiveReality.get(eventId) ?? null;
  }

  revealHistoricalUnderstanding(eventId: string, text: string, epoch: number, authorVoice: AuthorVoice): void {
    const entry = this.historicalUnderstanding.get(eventId) ?? new EvolvingEntry(eventId);
    entry.expand(text, epoch, authorVoice);
    this.historicalUnderstanding.set(eventId, entry);
  }

  historicalUnderstandingFor(eventId: string): string | null {
    return this.historicalUnderstanding.get(eventId)?.latest()?.text ?? null;
  }

  setPublicKnowledge(eventId: string, text: string): void {
    this.publicKnowledge.set(eventId, text);
  }

  publicKnowledgeFor(eventId: string): string | null {
    return this.publicKnowledge.get(eventId) ?? null;
  }

  hasDiverged(eventId: string): boolean {
    const forms = [this.objectiveRealityFor(eventId), this.historicalUnderstandingFor(eventId), this.publicKnowledgeFor(eventId)].filter((f): f is string => f !== null);
    return new Set(forms).size > 1;
  }
}

export interface CommanderContinuityFact {
  commanderId: string;
  fact: string;
  epoch: number;
}

/** "Every Commander permanently tracks... nothing contradicts earlier
 * records." Append-only — a materially richer, free-text biographical
 * record than AF-135's real `commanderHistoryFor` (a thin numeric
 * aggregate), composed alongside it rather than replacing it. */
export class CommanderContinuityLedger {
  private readonly facts: CommanderContinuityFact[] = [];

  recordFact(commanderId: string, fact: string, epoch: number): CommanderContinuityFact {
    const entry: CommanderContinuityFact = { commanderId, fact, epoch };
    this.facts.push(entry);
    return entry;
  }

  factsFor(commanderId: string): readonly CommanderContinuityFact[] {
    return this.facts.filter((f) => f.commanderId === commanderId);
  }

  all(): readonly CommanderContinuityFact[] {
    return this.facts;
  }
}

/** "Recovered artifacts include provenance, ownership chain,
 * restoration history..." Confirmed genuinely new — AF-134's
 * `GiftLedger`/`RestorationLab` never track provenance or authenticity
 * confidence. */
export class ArtifactAuthenticityRegistry {
  private readonly records = new Map<string, ArtifactAuthenticityRecord>();

  register(record: ArtifactAuthenticityRecord): void {
    this.records.set(record.artifactId, record);
  }

  recordFor(artifactId: string): ArtifactAuthenticityRecord | null {
    return this.records.get(artifactId) ?? null;
  }

  updateConfidence(artifactId: string, confidence: number): void {
    const record = this.records.get(artifactId);
    if (record) this.records.set(artifactId, { ...record, authenticityConfidence: Math.max(0, Math.min(100, confidence)) });
  }

  all(): readonly ArtifactAuthenticityRecord[] {
    return [...this.records.values()];
  }
}

/** "Every world tracks discovery/settlement/wars/..." — composes
 * AF-135's real `PlanetaryChronicle` directly rather than a parallel
 * store, since `PlanetaryChronicle` already holds one `EvolvingEntry`
 * per planet; this only adds the field-typed write path the real class
 * confirmed it lacks. */
export function recordPlanetContinuityFact(chronicle: PlanetaryChronicle, planetId: string, field: PlanetContinuityField, text: string, epoch: number, authorVoice: AuthorVoice): void {
  chronicle.write(planetId, `[${field}] ${text}`, epoch, authorVoice);
}
