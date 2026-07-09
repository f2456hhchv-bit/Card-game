/**
 * The Civilisation Framework runtime (AF-090). Deterministic per seed,
 * in-memory (the same session-scoped discipline every AF-036→089
 * ambient runtime keeps). Collaborates with TWO real engines: AF-086's
 * `CivilisationSimulationRuntime` (read population, write history — the
 * SAME one-directional discipline AF-089 established) and AF-089's
 * `GalacticEconomyRuntime` (four of the eight Player Investment actions
 * delegate to its own real, bounded methods rather than reimplementing
 * them). Settlement development is a LINEAR monotone lattice — states
 * only advance, capped at Legendary Status, never a ring.
 */
import type { Rng } from "../../core/rng/Rng";
import type { ResearchTree } from "../research/ResearchTree";
import type { CivilisationSimulationRuntime } from "../factions/CivilisationSimulationRuntime";
import type { GalacticEconomyRuntime } from "../economy/GalacticEconomyRuntime";
import type { GalacticResourceCategory } from "../economy/galacticEconomyData";
import {
  DEVELOPMENT_STAGE_THRESHOLD,
  INVESTMENT_MAX_DELTA,
  MEGASTRUCTURES,
  SEEDED_SETTLEMENTS,
  SETTLEMENT_DEVELOPMENT_STAGES,
  SPECIALISATION_FAVOURED_STAT,
  type CivilisationSpecialisation,
  type PopulationStat,
  type SettlementDevelopmentStage,
  type SettlementProfileDef,
} from "./civilisationFrameworkData";

const NEW_POPULATION_STATS: readonly PopulationStat[] = ["education", "health", "security", "scientificWorkforce", "industrialWorkforce", "militaryPersonnel", "civilianHappiness"];

function baselinePopulationStats(): Record<PopulationStat, number> {
  const stats = {} as Record<PopulationStat, number>;
  for (const stat of NEW_POPULATION_STATS) stats[stat] = 40;
  return stats;
}

export interface SettlementState {
  profile: SettlementProfileDef;
  developmentStage: SettlementDevelopmentStage;
  constructionProgress: number;
  populationStats: Record<PopulationStat, number>;
  specialisation: CivilisationSpecialisation | null;
  builtUpgrades: Set<string>;
}

export interface MegastructureState {
  def: (typeof MEGASTRUCTURES)[number];
  progress: number;
  completed: boolean;
}

export interface CivilisationFrameworkSnapshot {
  settlementCount: number;
  averagePopulation: number;
  totalUpgradesBuilt: number;
  averageConstructionProgress: number;
  averageDevelopmentLevel: number;
  civilisationRating: number;
}

function nextDevelopmentStage(stage: SettlementDevelopmentStage): SettlementDevelopmentStage | null {
  const index = SETTLEMENT_DEVELOPMENT_STAGES.indexOf(stage);
  if (index >= SETTLEMENT_DEVELOPMENT_STAGES.length - 1) return null; // legendaryStatus is a ceiling
  return SETTLEMENT_DEVELOPMENT_STAGES[index + 1]!;
}

export class CivilisationFrameworkRuntime {
  private readonly settlements = new Map<string, SettlementState>();
  private readonly megastructures = new Map<string, MegastructureState>();
  private epochTimerMs = 0;
  private epochsSimulated = 0;

  constructor(
    private readonly civSim: CivilisationSimulationRuntime,
    private readonly economy: GalacticEconomyRuntime,
    private readonly researchTree: ResearchTree,
    private readonly rng: Rng,
    profiles: readonly SettlementProfileDef[] = SEEDED_SETTLEMENTS,
    private readonly epochIntervalMs = 9000,
  ) {
    for (const profile of profiles) {
      this.settlements.set(profile.settlementId, {
        profile,
        developmentStage: "founding",
        constructionProgress: 0,
        populationStats: baselinePopulationStats(),
        specialisation: null,
        builtUpgrades: new Set(),
      });
    }
    for (const def of MEGASTRUCTURES) {
      this.megastructures.set(def.id, { def, progress: 0, completed: false });
    }
  }

  settlementFor(settlementId: string): SettlementState | null {
    return this.settlements.get(settlementId) ?? null;
  }

  get allSettlements(): readonly SettlementState[] {
    return [...this.settlements.values()];
  }

  megastructureFor(id: string): MegastructureState | null {
    return this.megastructures.get(id) ?? null;
  }

  get allMegastructures(): readonly MegastructureState[] {
    return [...this.megastructures.values()];
  }

  update(fixedDtMs: number): void {
    this.epochTimerMs += fixedDtMs;
    if (this.epochTimerMs >= this.epochIntervalMs) {
      this.epochTimerMs = 0;
      this.advanceEpoch();
    }
  }

  /** One tick of civilisation time — the pure core, directly callable by
   * tests without waiting on `update`'s wall-clock timer. */
  advanceEpoch(): void {
    this.epochsSimulated += 1;
    for (const settlement of this.settlements.values()) {
      this.tickPopulation(settlement);
      // A small passive trickle — "growth remains organic," construction
      // advances even without direct investment, just slowly.
      this.addConstructionProgress(settlement, 1);
    }
  }

  private tickPopulation(settlement: SettlementState): void {
    const favouredStat = settlement.specialisation ? SPECIALISATION_FAVOURED_STAT[settlement.specialisation] : null;
    for (const stat of NEW_POPULATION_STATS) {
      const delta = (stat === favouredStat ? 0.9 : 0.2) * (0.5 + this.rng.next());
      settlement.populationStats[stat] = Math.min(100, settlement.populationStats[stat] + delta);
    }
  }

  /** §Colony Development: construction progress only ever grows; crossing
   * an authored threshold advances the LINEAR ladder exactly one step
   * (never skipping), logging the milestone to AF-086's REAL permanent
   * history — "growth remains organic," and it is recorded forever. */
  private addConstructionProgress(settlement: SettlementState, amount: number): void {
    if (settlement.developmentStage === "legendaryStatus") return; // the ceiling — no further progress tracked
    settlement.constructionProgress = Math.min(100, settlement.constructionProgress + Math.max(0, amount));
    const threshold = DEVELOPMENT_STAGE_THRESHOLD[settlement.developmentStage];
    if (settlement.constructionProgress >= threshold) {
      const next = nextDevelopmentStage(settlement.developmentStage);
      if (next) {
        settlement.developmentStage = next;
        const kind = next === "legendaryStatus" ? "legendaryEvents" : "colonisation";
        this.civSim.history.record(kind, settlement.profile.factionId, `${settlement.profile.name} reaches ${next}`);
      }
    }
  }

  private cap(amount: number): number {
    return Math.max(-INVESTMENT_MAX_DELTA, Math.min(INVESTMENT_MAX_DELTA, amount));
  }

  // ─── §Player Investment — four delegate to AF-089's real methods ───

  fundProjects(settlementId: string, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    this.economy.fundColonies(settlement.profile.factionId, amount);
    this.addConstructionProgress(settlement, Math.abs(this.cap(amount)) * 0.5);
  }

  assignResources(settlementId: string, category: GalacticResourceCategory, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    this.economy.deliverResources(settlement.profile.factionId, category, amount);
  }

  deliverTechnology(settlementId: string, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    this.economy.recoverTechnology(settlement.profile.factionId, amount);
  }

  upgradeInfrastructure(settlementId: string, upgradeId: string, amount: number): boolean {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return false;
    this.economy.restoreInfrastructure(settlement.profile.factionId, amount);
    if (settlement.builtUpgrades.has(upgradeId)) return false;
    if (settlement.constructionProgress < DEVELOPMENT_STAGE_THRESHOLD.founding) return false; // must be past Founding
    settlement.builtUpgrades.add(upgradeId);
    return true;
  }

  // ─── Four of this module's own, capped identically ───

  recruitScientists(settlementId: string, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    settlement.populationStats.scientificWorkforce = Math.min(100, settlement.populationStats.scientificWorkforce + Math.abs(this.cap(amount)));
  }

  restoreAncientSystems(settlementId: string, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    this.addConstructionProgress(settlement, Math.abs(this.cap(amount)));
  }

  protectConstruction(settlementId: string, amount: number): void {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return;
    settlement.populationStats.security = Math.min(100, settlement.populationStats.security + Math.abs(this.cap(amount)));
  }

  /** Influencing priorities chooses the settlement's specialisation — only
   * possible once the ladder reaches the Specialisation stage, and only
   * once (permanent, not switchable — "player choices SHAPE civilisation"). */
  influencePriorities(settlementId: string, specialisation: CivilisationSpecialisation): boolean {
    const settlement = this.settlements.get(settlementId);
    if (!settlement || settlement.specialisation !== null) return false;
    if (settlement.developmentStage !== "specialisation" && settlement.developmentStage !== "legendaryStatus") return false;
    settlement.specialisation = specialisation;
    return true;
  }

  // ─── §Megastructures — galaxy-wide, deliberate, never passive ───

  /** Investment is bounded exactly like every settlement action; crossing
   * the authored threshold permanently completes the megastructure
   * (monotone — no un-completing) and logs to AF-086's real history.
   * Research-gated megastructures refuse investment until the real
   * research node is unlocked. */
  investInMegastructure(megastructureId: string, amount: number): boolean {
    const state = this.megastructures.get(megastructureId);
    if (!state || state.completed) return false;
    if (state.def.requiresResearchNodeId && !this.researchTree.isUnlocked(state.def.requiresResearchNodeId)) return false;
    state.progress = Math.min(state.def.threshold, state.progress + Math.abs(this.cap(amount)));
    if (state.progress >= state.def.threshold) {
      state.completed = true;
      this.civSim.history.record("legendaryEvents", null, `${state.def.name} completed in ${state.def.region}`);
    }
    return state.completed;
  }

  get snapshot(): CivilisationFrameworkSnapshot {
    const settlements = [...this.settlements.values()];
    const count = settlements.length || 1;
    const averagePopulation = settlements.reduce((sum, s) => sum + (this.civSim.stateFor(s.profile.factionId)?.attributes.population ?? 0), 0) / count;
    const totalUpgradesBuilt = settlements.reduce((sum, s) => sum + s.builtUpgrades.size, 0);
    const averageConstructionProgress = settlements.reduce((sum, s) => sum + s.constructionProgress, 0) / count;
    const averageDevelopmentLevel = settlements.reduce((sum, s) => sum + SETTLEMENT_DEVELOPMENT_STAGES.indexOf(s.developmentStage), 0) / count;
    const civilisationRating = Math.min(
      100,
      (averageConstructionProgress + averageDevelopmentLevel * (100 / (SETTLEMENT_DEVELOPMENT_STAGES.length - 1)) + totalUpgradesBuilt * 2) / 3,
    );
    return {
      settlementCount: settlements.length,
      averagePopulation,
      totalUpgradesBuilt,
      averageConstructionProgress,
      averageDevelopmentLevel,
      civilisationRating,
    };
  }

  get epochCount(): number {
    return this.epochsSimulated;
  }
}
