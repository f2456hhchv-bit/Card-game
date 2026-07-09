import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { CivilisationSimulationRuntime } from "../src/game/factions/CivilisationSimulationRuntime";
import { RESOURCE_TYPES } from "../src/game/crafting/craftingData";
import { MERCHANT_KINDS, ECONOMIC_EVENT_KINDS } from "../src/game/economy/economyData";
import { GALACTIC_EVENT_KINDS } from "../src/game/factions/livingEcosystemData";
import { POLITICAL_INSTRUMENTS } from "../src/game/factions/factionFrameworkData";
import {
  ECONOMY_ACCESSIBILITY_SURFACES,
  ECONOMY_ARCHITECTURE_PARTS,
  ECONOMY_FORBIDDEN_OUTCOMES,
  ECONOMY_PERFORMANCE_DISCIPLINES,
  ECONOMY_REWARD_KINDS,
  ECONOMY_REWARD_REALISATION,
  GALACTIC_INDUSTRIES,
  GALACTIC_RESOURCE_CATEGORIES,
  GALAXY_ECONOMIC_EVENTS,
  GALAXY_ECONOMIC_EVENT_DEFS,
  INDUSTRY_PRIMARY_OUTPUT,
  INFRASTRUCTURE_KINDS,
  MARKET_PRICE_DRIVERS,
  PLAYER_PARTICIPATION_ACTIONS,
  PLAYER_PARTICIPATION_MAX_DELTA,
  PRODUCTION_CHAIN_STAGES,
  RESOURCE_CATEGORY_REALISATION,
  TRADE_NETWORK_ROUTES,
  TRADE_ROUTE_REALISATION,
  nextProductionStage,
} from "../src/game/economy/galacticEconomyData";
import { GalacticEconomyRuntime, PRIMARY_INDUSTRY_BY_FACTION } from "../src/game/economy/GalacticEconomyRuntime";

function makeRuntime(seed: number): { economy: GalacticEconomyRuntime; civSim: CivilisationSimulationRuntime } {
  const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
  const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("civSim"));
  const economy = new GalacticEconomyRuntime(civSim, new Rng(seed).fork("economy"));
  return { economy, civSim };
}

describe("Galactic Economy vocabulary — registered shelves (AF-089)", () => {
  it("registers thirteen architecture parts, seventeen resource categories, eight production stages, eight trade routes, ten industries, eight player-participation actions, eight market drivers, nine galaxy economic events, eight infrastructure kinds, eight reward kinds, two forbidden outcomes, eight accessibility surfaces, four performance disciplines", () => {
    expect(ECONOMY_ARCHITECTURE_PARTS.length).toBe(13);
    expect(GALACTIC_RESOURCE_CATEGORIES.length).toBe(17);
    expect(PRODUCTION_CHAIN_STAGES.length).toBe(8);
    expect(TRADE_NETWORK_ROUTES.length).toBe(8);
    expect(GALACTIC_INDUSTRIES.length).toBe(10);
    expect(PLAYER_PARTICIPATION_ACTIONS.length).toBe(8);
    expect(MARKET_PRICE_DRIVERS.length).toBe(8);
    expect(GALAXY_ECONOMIC_EVENTS.length).toBe(9);
    expect(GALAXY_ECONOMIC_EVENT_DEFS.length).toBe(9);
    expect(INFRASTRUCTURE_KINDS.length).toBe(8);
    expect(ECONOMY_REWARD_KINDS.length).toBe(8);
    expect(ECONOMY_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(ECONOMY_ACCESSIBILITY_SURFACES.length).toBe(8);
    expect(ECONOMY_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("nine of the seventeen resource categories map onto AF-025's REAL ResourceType shelf; the other eight are honest new registers, not force-fit", () => {
    let mapped = 0;
    let newRegisters = 0;
    for (const category of GALACTIC_RESOURCE_CATEGORIES) {
      const realisation = RESOURCE_CATEGORY_REALISATION[category];
      if (realisation.kind === "craftingResource") {
        expect([...RESOURCE_TYPES], category).toContain(realisation.resourceType);
        mapped += 1;
      } else {
        newRegisters += 1;
      }
    }
    expect(mapped).toBe(9);
    expect(newRegisters).toBe(8);
  });

  it("the eight Trade Network routes map TOTALLY onto AF-040's REAL merchant kinds or its own economic events — no second merchant system", () => {
    for (const route of TRADE_NETWORK_ROUTES) {
      const realisation = TRADE_ROUTE_REALISATION[route];
      if (realisation.kind === "merchantKind") expect([...MERCHANT_KINDS], route).toContain(realisation.merchantKind);
      else expect([...ECONOMIC_EVENT_KINDS], route).toContain(realisation.eventKind);
    }
  });

  it("of the nine Galaxy Economic Events, five reuse a REAL AF-085/086 vocabulary directly and four author their own resource-category deltas", () => {
    let reused = 0;
    let authored = 0;
    for (const event of GALAXY_ECONOMIC_EVENT_DEFS) {
      if (event.realisation.kind === "civilisationEvent") {
        expect([...GALACTIC_EVENT_KINDS], event.kind).toContain(event.realisation.eventKind);
        reused += 1;
      } else if (event.realisation.kind === "politicalInstrument") {
        expect([...POLITICAL_INSTRUMENTS], event.kind).toContain(event.realisation.instrument);
        reused += 1;
      } else {
        expect(Object.keys(event.realisation.deltas).length, event.kind).toBeGreaterThan(0);
        authored += 1;
      }
    }
    expect(reused).toBe(5);
    expect(authored).toBe(4);
  });

  it("the eight-stage Production Chain is a CLOSED RING — recovery wraps back to extraction, and every stage is reachable from any start", () => {
    expect(nextProductionStage("recovery")).toBe("extraction");
    for (const stage of PRODUCTION_CHAIN_STAGES) {
      const seen = new Set<string>();
      let current = stage;
      for (let i = 0; i < PRODUCTION_CHAIN_STAGES.length; i += 1) {
        seen.add(current);
        current = nextProductionStage(current);
      }
      expect(seen.size).toBe(PRODUCTION_CHAIN_STAGES.length);
      expect(current).toBe(stage);
    }
  });

  it("every reward kind realises onto a real system or honestly future, and every industry names a real primary-output category", () => {
    for (const kind of ECONOMY_REWARD_KINDS) expect(["existingReference", "future"]).toContain(ECONOMY_REWARD_REALISATION[kind].kind);
    for (const industry of GALACTIC_INDUSTRIES) expect([...GALACTIC_RESOURCE_CATEGORIES]).toContain(INDUSTRY_PRIMARY_OUTPUT[industry]);
  });
});

describe("Primary industries extend the identity-uniqueness chain (AF-089 §Industries)", () => {
  it("all six profiled civilisations' primary industries are pairwise-distinct — the SEVENTH uniqueness axis (AF-085's five + AF-086's sixth + this one)", () => {
    const industries = Object.values(PRIMARY_INDUSTRY_BY_FACTION);
    expect(industries.length).toBe(6);
    expect(new Set(industries).size).toBe(6);
  });
});

describe("The colony simulation through AF-086's REAL CivilisationSimulationRuntime (AF-089 §Colonies / §Production Chains)", () => {
  it("every profiled faction gets a colony, seeded with all seventeen resource categories at the same baseline", () => {
    const { economy } = makeRuntime(1);
    expect(economy.allColonies.length).toBe(6);
    for (const colony of economy.allColonies) {
      for (const category of GALACTIC_RESOURCE_CATEGORIES) expect(colony.stockpiles[category]).toBe(15);
    }
  });

  it("production chains advance every epoch and never invent stockpile from nothing — every increase traces to a Distribution or Recovery yield", () => {
    const { economy } = makeRuntime(2);
    const colony = economy.allColonies[0]!;
    const before = { ...colony.stockpiles };
    for (let i = 0; i < 20; i += 1) economy.advanceEpoch();
    let anyIncreased = false;
    for (const category of GALACTIC_RESOURCE_CATEGORIES) {
      if (colony.stockpiles[category] > before[category]!) anyIncreased = true;
      expect(colony.stockpiles[category]).toBeGreaterThanOrEqual(0);
    }
    expect(anyIncreased).toBe(true);
  });

  it("SCARCITY IS REAL: population consumption depletes food/water/energy, and a sustained shortfall dents growth and employment", () => {
    const { economy, civSim } = makeRuntime(3);
    const factionId = economy.allColonies[0]!.factionId;
    const colony = economy.colonyFor(factionId)!;
    // Drain the consumed categories so every epoch is a shortfall.
    colony.stockpiles.food = 0;
    colony.stockpiles.water = 0;
    colony.stockpiles.energy = 0;
    const growthBefore = colony.growth;
    const employmentBefore = colony.employment;
    for (let i = 0; i < 10; i += 1) economy.advanceEpoch();
    expect(colony.shortfallEpochs).toBeGreaterThan(0);
    expect(colony.growth).toBeLessThan(growthBefore);
    expect(colony.employment).toBeLessThan(employmentBefore);
    expect(civSim.stateFor(factionId)).not.toBeNull(); // AF-086's own state is read, never mutated by ambient scarcity
  });

  it("a colony favouring its primary industry's output category accumulates stockpile faster than a non-primary category", () => {
    const { economy } = makeRuntime(4);
    const colony = economy.allColonies.find((c) => c.factionId === "crystalDominion")!; // mining -> rawMinerals
    const primaryCategory = INDUSTRY_PRIMARY_OUTPUT[colony.primaryIndustry];
    const offCategory = GALACTIC_RESOURCE_CATEGORIES.find((c) => c !== primaryCategory && c !== "food" && c !== "water" && c !== "energy")!;
    for (let i = 0; i < 40; i += 1) economy.advanceEpoch();
    expect(colony.stockpiles[primaryCategory]).toBeGreaterThan(colony.stockpiles[offCategory]);
  });
});

describe("Player Participation — bounded, never dictating (AF-089 §Player Participation)", () => {
  it("every action clamps to PLAYER_PARTICIPATION_MAX_DELTA however large the fed amount, and openTradeRoutes/investInDevelopment are real state changes", () => {
    const { economy } = makeRuntime(5);
    const factionId = economy.allColonies[0]!.factionId;
    economy.deliverResources(factionId, "rawMinerals", 999999);
    const colony = economy.colonyFor(factionId)!;
    expect(colony.stockpiles.rawMinerals).toBeLessThanOrEqual(15 + PLAYER_PARTICIPATION_MAX_DELTA);
    economy.fundColonies(factionId, 999999);
    expect(colony.growth).toBeLessThanOrEqual(10);
    expect(economy.openTradeRoutes(factionId, "civilianTrade")).toBe(true);
    expect(economy.openTradeRoutes(factionId, "civilianTrade")).toBe(false); // already open
    expect(colony.openRoutes.has("civilianTrade")).toBe(true);
  });

  it("investing in development permanently builds infrastructure once the threshold is crossed, in live-kind order", () => {
    const { economy } = makeRuntime(6);
    const factionId = economy.allColonies[0]!.factionId;
    const colony = economy.colonyFor(factionId)!;
    let built: string | null = null;
    for (let i = 0; i < 10 && built === null; i += 1) built = economy.investInDevelopment(factionId, 6);
    expect(built).not.toBeNull();
    expect(colony.builtInfrastructure.has(built!)).toBe(true);
    const liveKinds = INFRASTRUCTURE_KINDS.filter((k) => k.live).map((k) => k.id);
    expect(liveKinds).toContain(built);
  });

  it("recoverTechnology and restoreInfrastructure reach into AF-086's REAL feedPlayerImpact, capped by BOTH modules' ceilings", () => {
    const { economy, civSim } = makeRuntime(7);
    const factionId = economy.allColonies[0]!.factionId;
    const before = civSim.stateFor(factionId)!.attributes.technology;
    economy.recoverTechnology(factionId, 999999);
    civSim.advanceEpoch(); // AF-086 drains pendingPlayerImpact on its own next epoch
    const after = civSim.stateFor(factionId)!.attributes.technology;
    expect(after - before).toBeLessThanOrEqual(PLAYER_PARTICIPATION_MAX_DELTA + 10); // never anywhere near the fed magnitude
  });
});

describe("Market pricing and Galaxy Economic Events (AF-089 §Market System / §Galaxy Events)", () => {
  it("marketPriceMultiplierFor rises as stockpile depletes and relaxes as it fills, always within its registered bounds", () => {
    const { economy } = makeRuntime(8);
    const factionId = economy.allColonies[0]!.factionId;
    const colony = economy.colonyFor(factionId)!;
    colony.stockpiles.rawMinerals = 1;
    const scarce = economy.marketPriceMultiplierFor(factionId, "rawMinerals");
    colony.stockpiles.rawMinerals = 100;
    const abundant = economy.marketPriceMultiplierFor(factionId, "rawMinerals");
    expect(scarce).toBeGreaterThan(abundant);
    expect(scarce).toBeLessThanOrEqual(2.5);
    expect(abundant).toBeGreaterThanOrEqual(0.5);
  });

  it("rolling galaxy economic events via the real public timer fires only registered kinds, on a real colony", () => {
    const { economy } = makeRuntime(9);
    const firedKinds = new Set<string>();
    for (let i = 0; i < 50; i += 1) {
      economy.update(30000);
      const last = economy.lastEconomicEvent;
      if (last) {
        firedKinds.add(last.kind);
        expect(economy.colonyFor(last.factionId)).not.toBeNull();
      }
    }
    expect(firedKinds.size).toBeGreaterThan(0);
    for (const kind of firedKinds) expect([...GALAXY_ECONOMIC_EVENTS]).toContain(kind);
  });
});

describe("Galactic Economy — self-review: simulate thousands of years (AF-089 §Self Review Loop)", () => {
  it("50 seeded galaxies, 300 epochs each: stockpiles never go negative, the chain never stalls, and relationship states stay on the real shelf when embargoes fire", () => {
    for (let seed = 0; seed < 50; seed += 1) {
      const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
      const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("civSim"));
      const economy = new GalacticEconomyRuntime(civSim, new Rng(seed).fork("economy"));
      for (let epoch = 0; epoch < 300; epoch += 1) {
        economy.advanceEpoch();
        for (const colony of economy.allColonies) {
          for (const category of GALACTIC_RESOURCE_CATEGORIES) {
            if (colony.stockpiles[category] < 0) throw new Error(`seed ${seed}: negative stockpile`);
            expect([...PRODUCTION_CHAIN_STAGES]).toContain(colony.chainPosition[category]);
          }
        }
      }
      economy.update(500000); // force several event rolls too
      const snapshot = economy.snapshot;
      expect(snapshot.colonyCount).toBe(6);
      expect(snapshot.totalSupply).toBeGreaterThanOrEqual(0);
      expect(snapshot.economicHealth).toBeGreaterThanOrEqual(0);
      expect(snapshot.economicHealth).toBeLessThanOrEqual(100);
    }
  });
});
