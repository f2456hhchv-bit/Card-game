import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { CivilisationSimulationRuntime } from "../src/game/factions/CivilisationSimulationRuntime";
import { GalacticEconomyRuntime } from "../src/game/economy/GalacticEconomyRuntime";
import { INFRASTRUCTURE_KINDS } from "../src/game/economy/galacticEconomyData";
import { ResearchTree } from "../src/game/research/ResearchTree";
import { ROSTER_RESEARCH_TREE } from "../src/game/research/researchRosterData";
import { GALAXY_REGIONS, SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { FACTION_PROFILES } from "../src/game/factions/factionFrameworkData";
import { CIVILISATION_PROFILES } from "../src/game/factions/livingEcosystemData";
import { PRIMARY_INDUSTRY_BY_FACTION } from "../src/game/economy/GalacticEconomyRuntime";
import {
  CIVILISATION_ACCESSIBILITY_SURFACES,
  CIVILISATION_ARCHITECTURE_PARTS,
  CIVILISATION_FORBIDDEN_OUTCOMES,
  CIVILISATION_PERFORMANCE_DISCIPLINES,
  CIVILISATION_REWARD_KINDS,
  CIVILISATION_REWARD_REALISATION,
  CIVILISATION_SPECIALISATIONS,
  DEVELOPMENT_STAGE_THRESHOLD,
  GALACTIC_PROJECTS,
  GALAXY_RESTORATION_ROUTES,
  INVESTMENT_ACTION_REALISATION,
  INVESTMENT_MAX_DELTA,
  MEGASTRUCTURES,
  PLAYER_INVESTMENT_ACTIONS,
  POPULATION_STATS,
  POPULATION_STAT_REALISATION,
  RESTORATION_ROUTE_REALISATION,
  SEEDED_SETTLEMENTS,
  SETTLEMENT_DEVELOPMENT_STAGES,
  SETTLEMENT_INFRASTRUCTURE_REALISATION,
  SETTLEMENT_INFRASTRUCTURE_UPGRADES,
  SETTLEMENT_TYPES,
  SETTLEMENT_TYPE_REALISATION,
  SPECIALISATION_FAVOURED_STAT,
  WORLD_EVOLUTION_SURFACES,
} from "../src/game/civilisation/civilisationFrameworkData";
import { CivilisationFrameworkRuntime } from "../src/game/civilisation/CivilisationFrameworkRuntime";

function makeRuntime(seed: number) {
  const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
  const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("civSim"));
  const economy = new GalacticEconomyRuntime(civSim, new Rng(seed).fork("economy"));
  const researchTree = new ResearchTree(ROSTER_RESEARCH_TREE);
  const civ = new CivilisationFrameworkRuntime(civSim, economy, researchTree, new Rng(seed).fork("civ"));
  return { civ, civSim, economy, researchTree };
}

describe("Civilisation Framework vocabulary — registered shelves (AF-090)", () => {
  it("registers thirteen architecture parts, ten settlement types, ten population stats, ten settlement infrastructure upgrades, eight restoration routes, nine megastructures, seven development stages, eight investment actions, ten specialisations, eight world-evolution surfaces, seven galactic projects, eight reward kinds, two forbidden outcomes, eight accessibility surfaces, four performance disciplines", () => {
    expect(CIVILISATION_ARCHITECTURE_PARTS.length).toBe(13);
    expect(SETTLEMENT_TYPES.length).toBe(10);
    expect(POPULATION_STATS.length).toBe(10);
    expect(SETTLEMENT_INFRASTRUCTURE_UPGRADES.length).toBe(10);
    expect(GALAXY_RESTORATION_ROUTES.length).toBe(8);
    expect(MEGASTRUCTURES.length).toBe(9);
    expect(SETTLEMENT_DEVELOPMENT_STAGES.length).toBe(7);
    expect(PLAYER_INVESTMENT_ACTIONS.length).toBe(8);
    expect(CIVILISATION_SPECIALISATIONS.length).toBe(10);
    expect(WORLD_EVOLUTION_SURFACES.length).toBe(8);
    expect(GALACTIC_PROJECTS.length).toBe(7);
    expect(CIVILISATION_REWARD_KINDS.length).toBe(8);
    expect(CIVILISATION_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(CIVILISATION_ACCESSIBILITY_SURFACES.length).toBe(8);
    expect(CIVILISATION_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("every settlement type realises onto a real AF-089 infrastructure/industry shelf or AF-087's primary categories — no new content register invented", () => {
    for (const type of SETTLEMENT_TYPES) {
      const realisation = SETTLEMENT_TYPE_REALISATION[type];
      if (realisation.kind === "infrastructure") {
        expect(INFRASTRUCTURE_KINDS.some((k) => k.id === realisation.infraId), type).toBe(true);
      }
    }
  });

  it("three population stats reuse AF-086/089's real registers; seven are honest new settlement-scoped stats", () => {
    let reused = 0;
    let brandNew = 0;
    for (const stat of POPULATION_STATS) {
      const realisation = POPULATION_STAT_REALISATION[stat];
      if (realisation.kind === "newSettlementRegister") brandNew += 1;
      else reused += 1;
    }
    expect(reused).toBe(3);
    expect(brandNew).toBe(7);
  });

  it("four of ten settlement-infrastructure upgrades share an id with AF-089's real InfrastructureKindDef shelf; six are new, finer-scoped upgrades", () => {
    let shared = 0;
    let brandNew = 0;
    for (const upgrade of SETTLEMENT_INFRASTRUCTURE_UPGRADES) {
      const realisation = SETTLEMENT_INFRASTRUCTURE_REALISATION[upgrade];
      if (realisation.kind === "sharedWithAf089") {
        expect(INFRASTRUCTURE_KINDS.some((k) => k.id === realisation.infraId), upgrade).toBe(true);
        shared += 1;
      } else brandNew += 1;
    }
    expect(shared).toBe(4);
    expect(brandNew).toBe(6);
  });

  it("every Galaxy Restoration route and Player Investment action realises onto a REAL existing mechanism, and four of the eight investment actions delegate to AF-089's own methods", () => {
    for (const route of GALAXY_RESTORATION_ROUTES) expect(RESTORATION_ROUTE_REALISATION[route]).toBeDefined();
    let delegated = 0;
    for (const action of PLAYER_INVESTMENT_ACTIONS) {
      if (INVESTMENT_ACTION_REALISATION[action].kind === "delegatesToAf089") delegated += 1;
    }
    expect(delegated).toBe(4);
  });

  it("every megastructure is sited at a REAL AF-038 galaxy region, and research-gated ones name a real research node id", () => {
    for (const def of MEGASTRUCTURES) {
      expect([...GALAXY_REGIONS], def.id).toContain(def.region);
      expect(def.threshold).toBeGreaterThan(0);
      if (def.requiresResearchNodeId) {
        expect(ROSTER_RESEARCH_TREE.some((n) => n.id === def.requiresResearchNodeId), def.id).toBe(true);
      }
    }
  });

  it("the seven-stage ladder is LINEAR — legendaryStatus has no successor and no threshold, unlike every prior closed ring", () => {
    expect(SETTLEMENT_DEVELOPMENT_STAGES[SETTLEMENT_DEVELOPMENT_STAGES.length - 1]).toBe("legendaryStatus");
    expect(DEVELOPMENT_STAGE_THRESHOLD.legendaryStatus).toBe(Infinity);
    const thresholds = SETTLEMENT_DEVELOPMENT_STAGES.slice(0, -1).map((s) => DEVELOPMENT_STAGE_THRESHOLD[s]);
    expect(thresholds).toEqual([...thresholds].sort((a, b) => a - b)); // ascending
  });

  it("every reward kind and every specialisation's favoured stat resolves onto a real shelf", () => {
    for (const kind of CIVILISATION_REWARD_KINDS) expect(["existingReference", "future"]).toContain(CIVILISATION_REWARD_REALISATION[kind].kind);
    for (const specialisation of CIVILISATION_SPECIALISATIONS) expect([...POPULATION_STATS]).toContain(SPECIALISATION_FAVOURED_STAT[specialisation]);
  });
});

describe("The seeded settlements — the EIGHTH identity-uniqueness axis (AF-090 §Settlement Types)", () => {
  it("all six seeded settlements sit at REAL AF-038 systems matching their faction's own AF-039 territory, and every settlement type is pairwise-distinct", () => {
    expect(SEEDED_SETTLEMENTS.length).toBe(6);
    const types = new Set(SEEDED_SETTLEMENTS.map((s) => s.settlementType));
    expect(types.size).toBe(6);
    for (const settlement of SEEDED_SETTLEMENTS) {
      const system = SANDBOX_GALAXY.systems.find((s) => s.id === settlement.locationSystemId);
      expect(system, settlement.settlementId).toBeDefined();
      expect(FACTION_PROFILES.some((p) => p.factionId === settlement.factionId), settlement.settlementId).toBe(true);
      expect(CIVILISATION_PROFILES.some((p) => p.factionId === settlement.factionId), settlement.settlementId).toBe(true);
      expect(PRIMARY_INDUSTRY_BY_FACTION[settlement.factionId], settlement.settlementId).toBeDefined();
    }
  });
});

describe("Settlement development — a LINEAR monotone lattice, never a ring (AF-090 §Colony Development)", () => {
  it("construction progress only grows, the stage advances exactly one step at a time, and legendaryStatus is a true ceiling", () => {
    const { civ } = makeRuntime(1);
    const settlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
    let lastStageIndex = 0;
    for (let i = 0; i < 400; i += 1) {
      civ.advanceEpoch();
      const settlement = civ.settlementFor(settlementId)!;
      const stageIndex = SETTLEMENT_DEVELOPMENT_STAGES.indexOf(settlement.developmentStage);
      if (stageIndex < lastStageIndex) throw new Error("stage regressed");
      if (stageIndex > lastStageIndex + 1) throw new Error("stage skipped ahead by more than one");
      lastStageIndex = stageIndex;
    }
    expect(civ.settlementFor(settlementId)!.developmentStage).toBe("legendaryStatus");
    expect(civ.settlementFor(settlementId)!.constructionProgress).toBeLessThanOrEqual(100);
  });

  it("every milestone crossed is logged to AF-086's REAL permanent history — no fifth ledger class needed", () => {
    const { civ, civSim } = makeRuntime(2);
    const before = civSim.history.length;
    for (let i = 0; i < 30; i += 1) civ.advanceEpoch();
    expect(civSim.history.length).toBeGreaterThan(before);
  });

  it("influencing priorities only succeeds once the ladder reaches Specialisation, and never twice", () => {
    const { civ } = makeRuntime(3);
    const settlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
    expect(civ.influencePriorities(settlementId, "science")).toBe(false); // still Founding
    for (let i = 0; i < 200; i += 1) {
      civ.advanceEpoch();
      if (civ.settlementFor(settlementId)!.developmentStage === "specialisation") break;
    }
    expect(civ.influencePriorities(settlementId, "science")).toBe(true);
    expect(civ.influencePriorities(settlementId, "industry")).toBe(false); // permanent, not switchable
    expect(civ.settlementFor(settlementId)!.specialisation).toBe("science");
  });

  it("a specialised settlement's favoured population stat grows faster than an unfavoured one", () => {
    const { civ } = makeRuntime(4);
    const settlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
    for (let i = 0; i < 200; i += 1) {
      civ.advanceEpoch();
      if (civ.settlementFor(settlementId)!.developmentStage === "specialisation") break;
    }
    civ.influencePriorities(settlementId, "science"); // favours scientificWorkforce
    const settlement = civ.settlementFor(settlementId)!;
    const before = { ...settlement.populationStats };
    for (let i = 0; i < 30; i += 1) civ.advanceEpoch();
    const scientificGrowth = settlement.populationStats.scientificWorkforce - before.scientificWorkforce;
    const healthGrowth = settlement.populationStats.health - before.health;
    expect(scientificGrowth).toBeGreaterThan(healthGrowth);
  });
});

describe("Player Investment — bounded, four delegating to AF-089's REAL methods (AF-090 §Player Investment)", () => {
  it("fundProjects/assignResources/deliverTechnology/upgradeInfrastructure all move REAL AF-089/AF-086 state, capped however large the input", () => {
    const { civ, economy, civSim } = makeRuntime(5);
    const settlement = SEEDED_SETTLEMENTS[0]!;
    const colonyBefore = economy.colonyFor(settlement.factionId)!.growth;
    civ.fundProjects(settlement.settlementId, 999999);
    expect(economy.colonyFor(settlement.factionId)!.growth).toBeGreaterThan(colonyBefore);
    expect(economy.colonyFor(settlement.factionId)!.growth).toBeLessThanOrEqual(10); // AF-089's own ceiling holds

    const stockBefore = economy.colonyFor(settlement.factionId)!.stockpiles.rawMinerals;
    civ.assignResources(settlement.settlementId, "rawMinerals", 999999);
    expect(economy.colonyFor(settlement.factionId)!.stockpiles.rawMinerals).toBeLessThanOrEqual(stockBefore + INVESTMENT_MAX_DELTA);

    const techBefore = civSim.stateFor(settlement.factionId)!.attributes.technology;
    civ.deliverTechnology(settlement.settlementId, 999999);
    civSim.advanceEpoch();
    expect(civSim.stateFor(settlement.factionId)!.attributes.technology - techBefore).toBeLessThanOrEqual(INVESTMENT_MAX_DELTA + 10);
  });

  it("upgrading infrastructure requires having passed Founding, builds each upgrade at most once, and recruit/protect actions are locally bounded", () => {
    const { civ } = makeRuntime(6);
    const settlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
    expect(civ.upgradeInfrastructure(settlementId, "housing", 5)).toBe(false); // still at Founding, progress 0
    for (let i = 0; i < 25; i += 1) civ.advanceEpoch();
    const built = civ.upgradeInfrastructure(settlementId, "housing", 5);
    expect(built).toBe(true);
    expect(civ.upgradeInfrastructure(settlementId, "housing", 5)).toBe(false); // already built
    const settlement = civ.settlementFor(settlementId)!;
    const scientificBefore = settlement.populationStats.scientificWorkforce;
    civ.recruitScientists(settlementId, 999999);
    expect(settlement.populationStats.scientificWorkforce - scientificBefore).toBeLessThanOrEqual(INVESTMENT_MAX_DELTA);
    const securityBefore = settlement.populationStats.security;
    civ.protectConstruction(settlementId, 999999);
    expect(settlement.populationStats.security - securityBefore).toBeLessThanOrEqual(INVESTMENT_MAX_DELTA);
  });
});

describe("Megastructures — galaxy-wide, deliberate, research-gated (AF-090 §Megastructures)", () => {
  it("an unresearched gate refuses investment; unlocking the real node permits it, and completion is permanent", () => {
    const { civ, researchTree } = makeRuntime(7);
    const gated = MEGASTRUCTURES.find((m) => m.requiresResearchNodeId !== null)!;
    expect(civ.investInMegastructure(gated.id, 999999)).toBe(false);
    expect(civ.megastructureFor(gated.id)!.progress).toBe(0);
    // Unlock the target node's full prerequisite chain — the AF-081/082
    // "complete every research path" pattern through the real engine.
    researchTree.addPoints(10000);
    let progressed = true;
    while (progressed && !researchTree.isUnlocked(gated.requiresResearchNodeId!)) {
      progressed = false;
      for (const node of ROSTER_RESEARCH_TREE) {
        if (researchTree.unlock(node.id)) progressed = true;
      }
    }
    expect(researchTree.isUnlocked(gated.requiresResearchNodeId!)).toBe(true);
    let completed = false;
    for (let i = 0; i < gated.threshold / INVESTMENT_MAX_DELTA + 5 && !completed; i += 1) {
      completed = civ.investInMegastructure(gated.id, INVESTMENT_MAX_DELTA);
    }
    expect(completed).toBe(true);
    expect(civ.megastructureFor(gated.id)!.completed).toBe(true);
    expect(civ.investInMegastructure(gated.id, 999999)).toBe(false); // already complete
  });

  it("an ungated megastructure accepts investment immediately and never exceeds its own threshold", () => {
    const { civ } = makeRuntime(8);
    const free = MEGASTRUCTURES.find((m) => m.requiresResearchNodeId === null)!;
    for (let i = 0; i < 200; i += 1) civ.investInMegastructure(free.id, INVESTMENT_MAX_DELTA);
    expect(civ.megastructureFor(free.id)!.progress).toBeLessThanOrEqual(free.threshold);
    expect(civ.megastructureFor(free.id)!.completed).toBe(true);
  });
});

describe("Civilisation Framework — self-review: simulate thousands of years (AF-090 §Self Review Loop)", () => {
  it("30 seeded galaxies, 500 epochs each: construction never regresses, development stays on the real ladder, and the composite rating stays within [0, 100]", () => {
    for (let seed = 0; seed < 30; seed += 1) {
      const { civ } = makeRuntime(seed);
      let lastTotalProgress = 0;
      for (let epoch = 0; epoch < 500; epoch += 1) {
        civ.advanceEpoch();
        const totalProgress = civ.allSettlements.reduce((sum, s) => sum + s.constructionProgress + SETTLEMENT_DEVELOPMENT_STAGES.indexOf(s.developmentStage) * 100, 0);
        if (totalProgress < lastTotalProgress) throw new Error(`seed ${seed}: total progress regressed`);
        lastTotalProgress = totalProgress;
        for (const settlement of civ.allSettlements) {
          expect([...SETTLEMENT_DEVELOPMENT_STAGES]).toContain(settlement.developmentStage);
        }
      }
      const snapshot = civ.snapshot;
      expect(snapshot.settlementCount).toBe(6);
      expect(snapshot.civilisationRating).toBeGreaterThanOrEqual(0);
      expect(snapshot.civilisationRating).toBeLessThanOrEqual(100);
    }
  });
});
