/**
 * The Galactic Economy simulation (AF-089). Deterministic per seed,
 * in-memory (the same session-scoped discipline every AF-036→086 ambient
 * runtime already keeps). Reads AF-086's REAL `CivilisationSimulationRuntime`
 * directly (population, industrial output, technology, economic power)
 * and writes back to it ONLY through the real, bounded
 * `feedPlayerImpact` — ambient economic events never touch AF-086's
 * state, keeping the coupling one-directional and clean. Production
 * chains are AF-086's closed-ring life-cycle pattern applied to goods
 * instead of civilisations; galactic economic events reuse AF-085/086's
 * real vocabularies wherever one already fits, and author their own
 * deltas only for the four genuinely new kinds.
 */
import type { Rng } from "../../core/rng/Rng";
import type { FactionId } from "../factions/factionData";
import type { CivilisationSimulationRuntime } from "../factions/CivilisationSimulationRuntime";
import type { PlayerImpactSurface } from "../factions/livingEcosystemData";
import {
  GALACTIC_RESOURCE_CATEGORIES,
  GALAXY_ECONOMIC_EVENT_DEFS,
  INDUSTRY_PRIMARY_OUTPUT,
  INFRASTRUCTURE_BUILD_THRESHOLD,
  INFRASTRUCTURE_KINDS,
  PLAYER_PARTICIPATION_MAX_DELTA,
  PRODUCTION_CHAIN_MAX_EPOCHS_PER_STAGE,
  PRODUCTION_STAGE_YIELD,
  nextProductionStage,
  type GalacticIndustry,
  type GalacticResourceCategory,
  type GalaxyEconomicEvent,
  type InfrastructureKindDef,
  type ProductionChainStage,
  type TradeNetworkRoute,
} from "./galacticEconomyData";

/** Every profiled civilisation's primary industry (AF-089 §Industries) —
 * a SEVENTH identity-uniqueness axis, alongside AF-085's five and
 * AF-086's scientific-priority sixth: pairwise-distinct, asserted. */
export const PRIMARY_INDUSTRY_BY_FACTION: Readonly<Partial<Record<FactionId, GalacticIndustry>>> = {
  crystalDominion: "mining",
  machineCollective: "engineering",
  humanAlliance: "shipbuilding",
  mercenaryGuild: "weapons",
  ancientCustodians: "research",
  nomadFleet: "exploration",
};

const CONSUMED_CATEGORIES: readonly GalacticResourceCategory[] = ["food", "water", "energy"];
const CONSUMPTION_RATE = 0.1; // fraction of population consumed per epoch, per consumed category
const DEMAND_BASELINE = 10; // authored — the stockpile level at which price pressure is neutral

export interface ColonyState {
  factionId: FactionId;
  primaryIndustry: GalacticIndustry;
  stockpiles: Record<GalacticResourceCategory, number>;
  chainPosition: Record<GalacticResourceCategory, ProductionChainStage>;
  epochsInStage: Record<GalacticResourceCategory, number>;
  employment: number;
  defence: number;
  growth: number;
  researchContribution: number;
  investmentProgress: number;
  openRoutes: Set<TradeNetworkRoute>;
  builtInfrastructure: Set<string>;
  shortfallEpochs: number;
}

export interface GalacticEconomySnapshot {
  colonyCount: number;
  totalSupply: number;
  totalDemand: number;
  openTradeRouteCount: number;
  averageIndustrialOutput: number;
  averagePopulation: number;
  economicHealth: number;
}

function baselineStockpiles(): Record<GalacticResourceCategory, number> {
  const stockpiles = {} as Record<GalacticResourceCategory, number>;
  for (const category of GALACTIC_RESOURCE_CATEGORIES) stockpiles[category] = 15;
  return stockpiles;
}

function baselineChainPositions(): Record<GalacticResourceCategory, ProductionChainStage> {
  const positions = {} as Record<GalacticResourceCategory, ProductionChainStage>;
  for (const category of GALACTIC_RESOURCE_CATEGORIES) positions[category] = "extraction";
  return positions;
}

function baselineEpochsInStage(): Record<GalacticResourceCategory, number> {
  const epochs = {} as Record<GalacticResourceCategory, number>;
  for (const category of GALACTIC_RESOURCE_CATEGORIES) epochs[category] = 0;
  return epochs;
}

export class GalacticEconomyRuntime {
  private readonly colonies = new Map<FactionId, ColonyState>();
  private epochTimerMs = 0;
  private eventTimerMs = 0;
  private epochsSimulated = 0;
  private lastEvent: { kind: GalaxyEconomicEvent; factionId: FactionId } | null = null;

  constructor(
    private readonly civSim: CivilisationSimulationRuntime,
    private readonly rng: Rng,
    private readonly epochIntervalMs = 8000,
    private readonly eventIntervalMs = 25000,
  ) {
    for (const [factionId, industry] of Object.entries(PRIMARY_INDUSTRY_BY_FACTION) as Array<[FactionId, GalacticIndustry]>) {
      this.colonies.set(factionId, {
        factionId,
        primaryIndustry: industry,
        stockpiles: baselineStockpiles(),
        chainPosition: baselineChainPositions(),
        epochsInStage: baselineEpochsInStage(),
        employment: 50,
        defence: 40,
        growth: 0,
        researchContribution: 0,
        investmentProgress: 0,
        openRoutes: new Set(),
        builtInfrastructure: new Set(),
        shortfallEpochs: 0,
      });
    }
  }

  colonyFor(factionId: FactionId): ColonyState | null {
    return this.colonies.get(factionId) ?? null;
  }

  get allColonies(): readonly ColonyState[] {
    return [...this.colonies.values()];
  }

  update(fixedDtMs: number): void {
    this.epochTimerMs += fixedDtMs;
    this.eventTimerMs += fixedDtMs;
    if (this.epochTimerMs >= this.epochIntervalMs) {
      this.epochTimerMs = 0;
      this.advanceEpoch();
    }
    if (this.eventTimerMs >= this.eventIntervalMs) {
      this.eventTimerMs = 0;
      this.rollGalaxyEconomicEvent();
    }
  }

  /** One tick of galactic industrial time — the pure core, directly
   * callable by tests without waiting on `update`'s wall-clock timer. */
  advanceEpoch(): void {
    this.epochsSimulated += 1;
    for (const colony of this.colonies.values()) {
      this.advanceProductionChains(colony);
      this.applyConsumption(colony);
    }
  }

  /** §Production Chains: every category's chain position advances one
   * step per epoch (a closed ring — "every resource has logical
   * origins"), forced after a bounded number of epochs so no category
   * ever stalls. Distribution yields stockpile (boosted for the
   * colony's primary industry output); Recovery recycles a fraction
   * back into the loop — never invented from nothing. */
  private advanceProductionChains(colony: ColonyState): void {
    for (const category of GALACTIC_RESOURCE_CATEGORIES) {
      colony.epochsInStage[category] += 1;
      const forced = colony.epochsInStage[category] >= PRODUCTION_CHAIN_MAX_EPOCHS_PER_STAGE;
      if (forced || this.rng.next() < 0.5) {
        colony.chainPosition[category] = nextProductionStage(colony.chainPosition[category]);
        colony.epochsInStage[category] = 0;
      }
      const stage = colony.chainPosition[category];
      const yieldAmount = PRODUCTION_STAGE_YIELD[stage];
      if (yieldAmount > 0) {
        const bonus = INDUSTRY_PRIMARY_OUTPUT[colony.primaryIndustry] === category ? 2 : 1;
        colony.stockpiles[category] += yieldAmount * bonus;
      }
    }
  }

  /** §Colonies / §Resource Categories: population consumes food, water,
   * and energy every epoch. Scarcity is real — a shortfall dents growth,
   * never silently ignored ("every colony should consume something"). */
  private applyConsumption(colony: ColonyState): void {
    const population = this.civSim.stateFor(colony.factionId)?.attributes.population ?? 0;
    let shortfall = false;
    for (const category of CONSUMED_CATEGORIES) {
      const demand = population * CONSUMPTION_RATE;
      if (colony.stockpiles[category] >= demand) {
        colony.stockpiles[category] -= demand;
      } else {
        colony.stockpiles[category] = 0;
        shortfall = true;
      }
    }
    if (shortfall) {
      colony.shortfallEpochs += 1;
      colony.growth = Math.max(-10, colony.growth - 1);
      colony.employment = Math.max(0, colony.employment - 1);
    } else {
      colony.growth = Math.min(10, colony.growth + 0.5);
      colony.employment = Math.min(100, colony.employment + 0.5);
    }
  }

  /** §Galaxy Events: weighted pick on the shared timer discipline
   * (an eighth appearance). Authored events apply their own delta
   * directly to a sampled colony's stockpiles; events that reuse an
   * AF-085/086 vocabulary are named here but resolved by their own real
   * mechanism elsewhere — this runtime never re-fires another module's
   * engine. */
  private rollGalaxyEconomicEvent(): GalaxyEconomicEvent | null {
    if (this.colonies.size === 0) return null;
    const totalWeight = GALAXY_ECONOMIC_EVENT_DEFS.reduce((sum, e) => sum + e.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    let chosen = GALAXY_ECONOMIC_EVENT_DEFS[0]!;
    for (const event of GALAXY_ECONOMIC_EVENT_DEFS) {
      roll -= event.weight;
      if (roll <= 0) {
        chosen = event;
        break;
      }
    }
    const ids = [...this.colonies.keys()];
    const subject = ids[Math.floor(this.rng.next() * ids.length)]!;
    if (chosen.realisation.kind === "authored") {
      const colony = this.colonies.get(subject)!;
      for (const [category, delta] of Object.entries(chosen.realisation.deltas) as Array<[GalacticResourceCategory, number]>) {
        colony.stockpiles[category] = Math.max(0, colony.stockpiles[category] + delta);
      }
    }
    this.lastEvent = { kind: chosen.kind, factionId: subject };
    return chosen.kind;
  }

  get lastEconomicEvent(): { kind: GalaxyEconomicEvent; factionId: FactionId } | null {
    return this.lastEvent;
  }

  // ─── §Player Participation — every action bounded, never dictating ───

  private cap(amount: number): number {
    return Math.max(-PLAYER_PARTICIPATION_MAX_DELTA, Math.min(PLAYER_PARTICIPATION_MAX_DELTA, amount));
  }

  deliverResources(factionId: FactionId, category: GalacticResourceCategory, amount: number): void {
    const colony = this.colonies.get(factionId);
    if (!colony) return;
    colony.stockpiles[category] = Math.max(0, colony.stockpiles[category] + this.cap(amount));
  }

  fundColonies(factionId: FactionId, amount: number): void {
    const colony = this.colonies.get(factionId);
    if (!colony) return;
    colony.growth = Math.min(10, colony.growth + this.cap(amount));
  }

  protectTrade(factionId: FactionId, amount: number): void {
    const colony = this.colonies.get(factionId);
    if (!colony) return;
    colony.defence = Math.min(100, Math.max(0, colony.defence + this.cap(amount)));
  }

  /** Recovering technology reaches into AF-086's REAL bounded feed — capped
   * twice over, once by this module and once by AF-086's own ceiling. */
  recoverTechnology(factionId: FactionId, amount: number): void {
    this.feedCivilisation(factionId, "science", amount);
  }

  supplyResearch(factionId: FactionId, amount: number): void {
    const colony = this.colonies.get(factionId);
    if (!colony) return;
    colony.researchContribution += Math.abs(this.cap(amount));
  }

  restoreInfrastructure(factionId: FactionId, amount: number): void {
    this.feedCivilisation(factionId, "galaxyStability", amount);
    this.investInDevelopment(factionId, amount);
  }

  openTradeRoutes(factionId: FactionId, route: TradeNetworkRoute): boolean {
    const colony = this.colonies.get(factionId);
    if (!colony || colony.openRoutes.has(route)) return false;
    colony.openRoutes.add(route);
    return true;
  }

  /** Investment accumulates toward AF-089's flat build threshold; crossing
   * it permanently constructs the next un-built LIVE infrastructure kind
   * (never a currency spend — AF-040's documented spend-path limitation). */
  investInDevelopment(factionId: FactionId, amount: number): string | null {
    const colony = this.colonies.get(factionId);
    if (!colony) return null;
    colony.investmentProgress += Math.abs(this.cap(amount));
    if (colony.investmentProgress < INFRASTRUCTURE_BUILD_THRESHOLD) return null;
    const next = INFRASTRUCTURE_KINDS.find((k: InfrastructureKindDef) => k.live && !colony.builtInfrastructure.has(k.id));
    if (!next) return null;
    colony.investmentProgress -= INFRASTRUCTURE_BUILD_THRESHOLD;
    colony.builtInfrastructure.add(next.id);
    return next.id;
  }

  private feedCivilisation(factionId: FactionId, surface: PlayerImpactSurface, amount: number): void {
    const colony = this.colonies.get(factionId);
    if (!colony) return;
    this.civSim.feedPlayerImpact(surface, this.cap(amount));
  }

  /** §Market System: a pure supply/demand multiplier — low stockpile
   * relative to the authored baseline raises price pressure, high
   * stockpile relaxes it. Combines with, never replaces, AF-040's own
   * `MarketRuntime.price()`. */
  marketPriceMultiplierFor(factionId: FactionId, category: GalacticResourceCategory): number {
    const colony = this.colonies.get(factionId);
    if (!colony) return 1;
    const stock = Math.max(1, colony.stockpiles[category]);
    return Math.max(0.5, Math.min(2.5, DEMAND_BASELINE / stock));
  }

  get snapshot(): GalacticEconomySnapshot {
    const colonies = [...this.colonies.values()];
    const count = colonies.length || 1;
    let totalSupply = 0;
    for (const colony of colonies) {
      for (const category of GALACTIC_RESOURCE_CATEGORIES) totalSupply += colony.stockpiles[category];
    }
    const totalDemand = colonies.reduce((sum, colony) => sum + (this.civSim.stateFor(colony.factionId)?.attributes.population ?? 0) * CONSUMPTION_RATE * CONSUMED_CATEGORIES.length, 0);
    const openTradeRouteCount = colonies.reduce((sum, colony) => sum + colony.openRoutes.size, 0);
    const averageIndustrialOutput = colonies.reduce((sum, colony) => sum + (this.civSim.stateFor(colony.factionId)?.attributes.industrialOutput ?? 0), 0) / count;
    const averagePopulation = colonies.reduce((sum, colony) => sum + (this.civSim.stateFor(colony.factionId)?.attributes.population ?? 0), 0) / count;
    const economicHealth = colonies.reduce((sum, colony) => sum + Math.max(0, 100 - colony.shortfallEpochs * 5), 0) / count;
    return {
      colonyCount: colonies.length,
      totalSupply,
      totalDemand,
      openTradeRouteCount,
      averageIndustrialOutput,
      averagePopulation,
      economicHealth,
    };
  }

  get epochCount(): number {
    return this.epochsSimulated;
  }
}
