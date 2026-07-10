/**
 * LivingGalaxyRuntime pieces (AF-132). Composes with, and never
 * modifies, the real locked simulation stack (AF-041/086/089/090).
 */
import {
  clampIndex,
  DEEP_SPACE_PHENOMENA,
  DISCOVERY_KINDS,
  FESTIVALS,
  NEWS_CATEGORIES,
  pickFrom,
  WEATHER_CONDITIONS,
  type CrimeCategory,
  type DeepSpacePhenomenon,
  type DiscoveryKind,
  type EnvironmentalSystemState,
  type Festival,
  type NewsCategory,
  type ReputationCategory,
  type SimpleRng,
} from "./livingGalaxyData";
import { CRIME_CATEGORIES } from "./livingGalaxyData";

/** Per-star-system pollution/wildlife/healthcare/crime/weather —
 * the fields the real locked stack does not already track. Values
 * drift slowly each epoch and are always clamped to [0, 100]. */
export class EnvironmentalRuntime {
  private readonly states: Map<string, EnvironmentalSystemState>;

  constructor(seed: readonly EnvironmentalSystemState[]) {
    this.states = new Map(seed.map((s) => [s.systemId, { ...s }]));
  }

  stateFor(systemId: string): EnvironmentalSystemState | undefined {
    return this.states.get(systemId);
  }

  allStates(): readonly EnvironmentalSystemState[] {
    return [...this.states.values()];
  }

  /** One epoch of slow, bounded drift — "the universe never waits." */
  advanceEpoch(rng: SimpleRng): void {
    for (const state of this.states.values()) {
      state.pollution = clampIndex(state.pollution + (rng.next() - 0.45) * 4);
      state.wildlifeIndex = clampIndex(state.wildlifeIndex + (rng.next() - 0.5) * 4);
      state.healthcareIndex = clampIndex(state.healthcareIndex + (rng.next() - 0.5) * 3);
      state.crimeLevel = clampIndex(state.crimeLevel + (rng.next() - 0.5) * 3);
      if (rng.next() < 0.3) state.weatherCondition = pickFrom(WEATHER_CONDITIONS, rng);
    }
  }

  averagePollution(): number {
    return this.average((s) => s.pollution);
  }

  averageWildlife(): number {
    return this.average((s) => s.wildlifeIndex);
  }

  private average(pick: (state: EnvironmentalSystemState) => number): number {
    const values = this.allStates();
    if (values.length === 0) return 0;
    return values.reduce((sum, s) => sum + pick(s), 0) / values.length;
  }
}

/**
 * The galaxy "remembers" reputation across the eight spec'd categories.
 * Only a static reputationLevel() threshold lookup existed before this
 * module — this is the real, stateful ledger the spec calls for.
 */
export interface ReputationLedgerEntry {
  category: ReputationCategory;
  delta: number;
  description: string;
  sequence: number;
}

export class PlayerReputationLedger {
  private readonly entries: ReputationLedgerEntry[] = [];
  private readonly totals = new Map<ReputationCategory, number>();

  record(category: ReputationCategory, delta: number, description: string): void {
    this.entries.push({ category, delta, description, sequence: this.entries.length });
    this.totals.set(category, (this.totals.get(category) ?? 0) + delta);
  }

  totalFor(category: ReputationCategory): number {
    return this.totals.get(category) ?? 0;
  }

  grandTotal(): number {
    return [...this.totals.values()].reduce((sum, v) => sum + v, 0);
  }

  history(): readonly ReputationLedgerEntry[] {
    return this.entries;
  }
}

/**
 * A parallel, append-only chronicle for Living-Galaxy-originated events
 * (news/festivals/crime/discoveries). Complements, never modifies, the
 * locked GalacticHistoryRuntime.
 */
export interface ChronicleEntry {
  kind: string;
  description: string;
  sequence: number;
}

export class LivingGalaxyChronicle {
  private readonly entries: ChronicleEntry[] = [];

  record(kind: string, description: string): void {
    this.entries.push({ kind, description, sequence: this.entries.length });
  }

  all(): readonly ChronicleEntry[] {
    return this.entries;
  }
}

/** Deterministic epoch-indexed festival scheduling — always one active. */
export class FestivalCalendar {
  private epoch = 0;

  currentFestival(): Festival {
    return FESTIVALS[this.epoch % FESTIVALS.length]!;
  }

  advanceEpoch(): void {
    this.epoch += 1;
  }
}

export interface NewsItem {
  category: NewsCategory;
  headline: string;
}

/** "Nothing becomes permanently exhausted" — a pure draw over the real
 * pool, with no removal; drawing more times than the pool size is fine. */
export function drawNewsItem(rng: SimpleRng): NewsItem {
  const category = pickFrom(NEWS_CATEGORIES, rng);
  return { category, headline: `${category}.` };
}

export function drawDiscovery(rng: SimpleRng): DiscoveryKind {
  return pickFrom(DISCOVERY_KINDS, rng);
}

export function drawDeepSpacePhenomenon(rng: SimpleRng): DeepSpacePhenomenon {
  return pickFrom(DEEP_SPACE_PHENOMENA, rng);
}

export interface CrimeReport {
  category: CrimeCategory;
  systemId: string;
  investigated: boolean;
}

export class CrimeLedger {
  private readonly reports: CrimeReport[] = [];

  report(systemId: string, rng: SimpleRng): CrimeReport {
    const entry: CrimeReport = { category: pickFrom(CRIME_CATEGORIES, rng), systemId, investigated: false };
    this.reports.push(entry);
    return entry;
  }

  /** "Player may investigate" — never mandatory, only ever a real action. */
  investigate(report: CrimeReport): void {
    report.investigated = true;
  }

  all(): readonly CrimeReport[] {
    return this.reports;
  }

  unresolvedCount(): number {
    return this.reports.filter((r) => !r.investigated).length;
  }
}
