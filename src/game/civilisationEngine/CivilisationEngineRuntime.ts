/**
 * CivilisationEngineRuntime pieces (AF-138). Composes with AF-090's real,
 * locked `CivilisationFrameworkRuntime`/`SettlementState` rather than
 * duplicating anything it already tracks — see `civilisationEngineData.ts`
 * for the full research-confirmed overlap map.
 */
import type { CivilisationFrameworkRuntime } from "../civilisation/CivilisationFrameworkRuntime";
import type { CivilisationSimulationRuntime } from "../factions/CivilisationSimulationRuntime";
import {
  CIVILISATION_ATTRIBUTES,
  CIVILISATION_ATTRIBUTE_TO_POPULATION_STAT,
  CIVILISATION_MEGAPROJECTS,
  GOVERNMENT_PRIORITIES,
  NEW_CIVILISATION_ATTRIBUTES,
  PUBLIC_OPINION_REACTION_KINDS,
  civilisationStageFor,
  type CareerPathKind,
  type CivilisationAttribute,
  type CivilisationStage,
  type GovernmentPriority,
  type ImmigrationMotivationKind,
  type NewCivilisationAttribute,
  type PublicOpinionReactionKind,
  type SocialEventKind,
} from "./civilisationEngineData";
import { SOCIAL_EVENT_KINDS } from "./civilisationEngineData";

const NEW_ATTRIBUTE_BASELINE = 20;

/** Tracks this module's ten genuinely new per-settlement attributes
 * (Food, Water, Energy, ...) — grow-only, mirroring AF-090's own
 * population stats never regressing outside of its own simulation. */
export class CivilisationAttributeExtension {
  private readonly bySettlement = new Map<string, Map<NewCivilisationAttribute, number>>();

  improve(settlementId: string, attribute: NewCivilisationAttribute, amount: number): void {
    const attributes = this.bySettlement.get(settlementId) ?? new Map<NewCivilisationAttribute, number>();
    const current = attributes.get(attribute) ?? NEW_ATTRIBUTE_BASELINE;
    attributes.set(attribute, current + Math.max(0, amount));
    this.bySettlement.set(settlementId, attributes);
  }

  valueFor(settlementId: string, attribute: NewCivilisationAttribute): number {
    return this.bySettlement.get(settlementId)?.get(attribute) ?? NEW_ATTRIBUTE_BASELINE;
  }

  averageFor(settlementId: string): number {
    const total = NEW_CIVILISATION_ATTRIBUTES.reduce((sum, attribute) => sum + this.valueFor(settlementId, attribute), 0);
    return total / NEW_CIVILISATION_ATTRIBUTES.length;
  }
}

export interface CivilisationAttributeSummary {
  values: Record<CivilisationAttribute, number>;
  stage: CivilisationStage;
}

/**
 * The spec's own 18-attribute "Civilisation dashboard" (AF-138
 * §Accessibility). Reads AF-090's real, live-mutated
 * `SettlementState.populationStats` for the 5 attributes it already
 * tracks, AF-086's real `CivilisationSimulationRuntime` for Population
 * (per-faction, since AF-090 never mutates its own `population` stat),
 * a live-workforce-average proxy for Employment (unbacked anywhere
 * else), a `builtUpgrades`-count proxy for Infrastructure, and this
 * module's own extension for the 10 genuinely new attributes.
 */
export function civilisationAttributeSummaryFor(
  settlementId: string,
  civFramework: CivilisationFrameworkRuntime,
  civSim: CivilisationSimulationRuntime,
  extension: CivilisationAttributeExtension,
): CivilisationAttributeSummary | null {
  const settlement = civFramework.settlementFor(settlementId);
  if (!settlement) return null;

  const stats = settlement.populationStats;
  const population = civSim.stateFor(settlement.profile.factionId)?.attributes.population ?? 0;
  const employment = (stats.industrialWorkforce + stats.scientificWorkforce + stats.militaryPersonnel) / 3;

  const values = {} as Record<CivilisationAttribute, number>;
  for (const attribute of CIVILISATION_ATTRIBUTES) {
    const populationStat = CIVILISATION_ATTRIBUTE_TO_POPULATION_STAT[attribute];
    if (attribute === "Population") {
      values[attribute] = population;
    } else if (attribute === "Employment") {
      values[attribute] = employment;
    } else if (populationStat) {
      values[attribute] = stats[populationStat];
    } else if (attribute === "Infrastructure") {
      values[attribute] = Math.min(100, settlement.builtUpgrades.size * 20);
    } else {
      values[attribute] = extension.valueFor(settlementId, attribute as NewCivilisationAttribute);
    }
  }

  const stage = civilisationStageFor(population, extension.averageFor(settlementId));
  return { values, stage };
}

/** Mirrors AF-090's own `investInMegastructure` pattern over this
 * module's own, distinctly-idd `CIVILISATION_MEGAPROJECTS` roster —
 * "require decades of effort," never instant. */
export class MegaprojectTracker {
  private readonly progress = new Map<string, number>();

  contribute(megaprojectId: string, amount: number): boolean {
    const def = CIVILISATION_MEGAPROJECTS.find((m) => m.id === megaprojectId);
    if (!def) return false;
    if (this.isComplete(megaprojectId)) return false;
    const next = Math.min(def.threshold, this.progressFor(megaprojectId) + Math.max(0, amount));
    this.progress.set(megaprojectId, next);
    return true;
  }

  progressFor(megaprojectId: string): number {
    return this.progress.get(megaprojectId) ?? 0;
  }

  isComplete(megaprojectId: string): boolean {
    const def = CIVILISATION_MEGAPROJECTS.find((m) => m.id === megaprojectId);
    if (!def) return false;
    return this.progressFor(megaprojectId) >= def.threshold;
  }

  completedCount(): number {
    return CIVILISATION_MEGAPROJECTS.filter((m) => this.isComplete(m.id)).length;
  }
}

export interface ImmigrationRecord {
  fromSettlementId: string;
  toSettlementId: string;
  motivation: ImmigrationMotivationKind;
  epoch: number;
}

/** "People relocate naturally... migration changes cities over time" —
 * append-only, so a settlement's real immigration history is always
 * inspectable, never collapsed into a single running total. */
export class ImmigrationLedger {
  private readonly records: ImmigrationRecord[] = [];

  relocate(fromSettlementId: string, toSettlementId: string, motivation: ImmigrationMotivationKind, epoch: number): ImmigrationRecord {
    const record: ImmigrationRecord = { fromSettlementId, toSettlementId, motivation, epoch };
    this.records.push(record);
    return record;
  }

  all(): readonly ImmigrationRecord[] {
    return this.records;
  }

  countFor(motivation: ImmigrationMotivationKind): number {
    return this.records.filter((r) => r.motivation === motivation).length;
  }

  arrivalsFor(settlementId: string): number {
    return this.records.filter((r) => r.toSettlementId === settlementId).length;
  }
}

/** Deterministic epoch-cycling over `SOCIAL_EVENT_KINDS` — a genuinely
 * new, small class rather than reusing AF-132's non-generic
 * `FestivalCalendar`, which is tied to that module's own `Festival`
 * union and carries no civic/graduation theming. */
export class SocialEventCalendar {
  private epoch = 0;

  currentEvent(): SocialEventKind {
    return SOCIAL_EVENT_KINDS[this.epoch % SOCIAL_EVENT_KINDS.length]!;
  }

  advanceEpoch(): void {
    this.epoch += 1;
  }
}

/** "Player influences direction. Never absolute control." — influence
 * nudges a lean per priority; nothing is ever hard-set. */
export class GovernmentPriorityTracker {
  private readonly leans = new Map<GovernmentPriority, number>();

  influence(priority: GovernmentPriority, amount: number): void {
    this.leans.set(priority, (this.leans.get(priority) ?? 0) + amount);
  }

  leaningFor(priority: GovernmentPriority): number {
    return this.leans.get(priority) ?? 0;
  }

  dominantPriority(): GovernmentPriority | null {
    let best: GovernmentPriority | null = null;
    let bestValue = 0;
    for (const priority of GOVERNMENT_PRIORITIES) {
      const value = this.leaningFor(priority);
      if (value > bestValue) {
        best = priority;
        bestValue = value;
      }
    }
    return best;
  }
}

/** "Citizens react to..." — a running lean per reaction kind, kept
 * separate from AF-136's `StoryBranchTracker` since that class is
 * typed to the closed `StoryBranchAxis` union. */
export class PublicOpinionTracker {
  private readonly leans = new Map<PublicOpinionReactionKind, number>();

  react(kind: PublicOpinionReactionKind, delta: number): void {
    this.leans.set(kind, (this.leans.get(kind) ?? 0) + delta);
  }

  opinionFor(kind: PublicOpinionReactionKind): number {
    return this.leans.get(kind) ?? 0;
  }

  overallOpinion(): number {
    if (this.leans.size === 0) return 0;
    let total = 0;
    for (const kind of PUBLIC_OPINION_REACTION_KINDS) total += this.opinionFor(kind);
    return total / PUBLIC_OPINION_REACTION_KINDS.length;
  }
}

export interface CitizenCareer {
  path: CareerPathKind;
  promotions: number;
}

/** "Children gradually become Scientists... Commanders" — per-citizen
 * current path plus a promotion count, so a career is always a real,
 * inspectable progression rather than a flavour label. */
export class CareerPipeline {
  private readonly citizens = new Map<string, CitizenCareer>();

  assign(citizenId: string, path: CareerPathKind): void {
    if (this.citizens.has(citizenId)) return;
    this.citizens.set(citizenId, { path, promotions: 0 });
  }

  promote(citizenId: string, newPath: CareerPathKind): void {
    const citizen = this.citizens.get(citizenId);
    if (!citizen) {
      this.assign(citizenId, newPath);
      return;
    }
    citizen.path = newPath;
    citizen.promotions += 1;
  }

  careerFor(citizenId: string): CitizenCareer | null {
    return this.citizens.get(citizenId) ?? null;
  }

  totalPromotions(): number {
    let total = 0;
    for (const citizen of this.citizens.values()) total += citizen.promotions;
    return total;
  }
}
