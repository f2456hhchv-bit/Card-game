import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { CivilisationSimulationRuntime } from "../src/game/factions/CivilisationSimulationRuntime";
import { GalacticEconomyRuntime } from "../src/game/economy/GalacticEconomyRuntime";
import { ResearchTree } from "../src/game/research/ResearchTree";
import { ROSTER_RESEARCH_TREE } from "../src/game/research/researchRosterData";
import { CivilisationFrameworkRuntime } from "../src/game/civilisation/CivilisationFrameworkRuntime";
import { MegaprojectTracker } from "../src/game/civilisationEngine/CivilisationEngineRuntime";
import { CIVILISATION_MEGAPROJECTS } from "../src/game/civilisationEngine/civilisationEngineData";
import {
  ARCHITECTURAL_EVOLUTION_STAGES,
  COMMANDER_MATURITY_STAGES,
  COMPANION_GROWTH_STAGES,
  EQUIPMENT_EVOLUTION_STAGES,
  EVOLUTION_PILLARS,
  GREAT_PROJECT_LINEAGE,
  PLAYER_EVOLUTION_RANKS,
  SPECIES_ADAPTATION_TRIGGER_KINDS,
  TECHNOLOGY_ERAS,
  TRANSPORT_EVOLUTION_TIERS,
  architecturalStageFor,
  commanderMaturityScore,
  commanderMaturityStageFor,
  playerEvolutionRankFor,
  technologyEraFor,
  transportTierFor,
} from "../src/game/evolutionEngine/evolutionEngineData";
import {
  CompanionEvolutionTracker,
  EquipmentEvolutionTracker,
  HistoricalArchitectureLedger,
  LanguageEvolutionLog,
  SpeciesAdaptationRegistry,
  greatProjectsProgressSummary,
} from "../src/game/evolutionEngine/EvolutionEngineRuntime";

function makeCivFramework(seed = 1) {
  const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
  const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("civSim"));
  const economy = new GalacticEconomyRuntime(civSim, new Rng(seed).fork("economy"));
  const researchTree = new ResearchTree(ROSTER_RESEARCH_TREE);
  return new CivilisationFrameworkRuntime(civSim, economy, researchTree, new Rng(seed).fork("civ"));
}

describe("The Evolution Engine (AF-139)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EVOLUTION_PILLARS.length).toBe(11);
    expect(EQUIPMENT_EVOLUTION_STAGES.length).toBe(6);
    expect(ARCHITECTURAL_EVOLUTION_STAGES.length).toBe(6);
    expect(PLAYER_EVOLUTION_RANKS.length).toBe(6);
    expect(TRANSPORT_EVOLUTION_TIERS.length).toBe(6);
    expect(SPECIES_ADAPTATION_TRIGGER_KINDS.length).toBe(8);
    expect(COMPANION_GROWTH_STAGES.length).toBe(4);
    expect(COMMANDER_MATURITY_STAGES.length).toBe(4);
    expect(TECHNOLOGY_ERAS.length).toBe(5);
    expect(GREAT_PROJECT_LINEAGE.length).toBe(7);
  });

  it("every Great Project lineage entry with a real backing project points at a real AF-090/AF-138 id, never a third invented roster", () => {
    for (const entry of GREAT_PROJECT_LINEAGE) {
      if (entry.realSource === "deferred — no real backing project") {
        expect(entry.realId).toBeNull();
      } else if (entry.realSource === "AF-138 megaproject") {
        expect(CIVILISATION_MEGAPROJECTS.some((m) => m.id === entry.realId)).toBe(true);
      } else {
        expect(entry.realId).toMatch(/^[a-z-]+$/);
      }
    }
  });

  it("architecturalStageFor maps AF-090's real 7-stage settlement ladder onto this module's 6-stage visual ladder without a competing tracked value", () => {
    expect(architecturalStageFor("founding")).toBe("Emergency Shelters");
    expect(architecturalStageFor("legendaryStatus")).toBe("Iconic Skylines");
    expect(architecturalStageFor("prosperity")).toBe(architecturalStageFor("specialisation"));
  });

  it("playerEvolutionRankFor climbs Rookie to Legend as AF-026's real accountLevel rises", () => {
    expect(playerEvolutionRankFor(0)).toBe("Rookie");
    expect(playerEvolutionRankFor(80)).toBe("Legend");
    expect(PLAYER_EVOLUTION_RANKS).toContain(playerEvolutionRankFor(20));
  });

  it("transportTierFor caps below the top two tiers until the real fast-travel research unlock fires", () => {
    expect(transportTierFor(0, false)).toBe("Walking Paths");
    expect(transportTierFor(100, false)).toBe("Orbital Elevators");
    expect(transportTierFor(100, true)).toBe("Quantum Gateways");
  });

  it("commanderMaturityScore/Stage composes AF-071's talents+missions and AF-130's bond level into a real maturity stage", () => {
    const rookie = commanderMaturityScore(0, 0, 0);
    const legend = commanderMaturityScore(10, 6, 5);
    expect(commanderMaturityStageFor(rookie)).toBe("Rookie Officer");
    expect(commanderMaturityStageFor(legend)).toBe("Living Legend");
  });

  it("technologyEraFor composes AF-024's real unlocked-node count and average tier into a galaxy-wide era", () => {
    expect(technologyEraFor(0, 0)).toBe("Salvage Age");
    expect(technologyEraFor(30, 5)).toBe("Golden Age");
  });

  it("EquipmentEvolutionTracker is a grow-only stage ladder distinct from AF-007's RARITY_LADDER", () => {
    const tracker = new EquipmentEvolutionTracker();
    expect(tracker.stageFor("rail-rifle")).toBe("Prototype");
    for (let i = 0; i < 5; i++) tracker.advance("rail-rifle");
    expect(tracker.stageFor("rail-rifle")).toBe("Historic Masterpiece");
    expect(tracker.isHistoric("rail-rifle")).toBe(true);
    tracker.advance("rail-rifle");
    expect(tracker.stageFor("rail-rifle")).toBe("Historic Masterpiece");
  });

  it("HistoricalArchitectureLedger preserves every distinct stage a settlement has passed through", () => {
    const ledger = new HistoricalArchitectureLedger();
    ledger.record("settlement-a", "Emergency Shelters", 0);
    ledger.record("settlement-a", "Emergency Shelters", 1);
    ledger.record("settlement-a", "Homes", 5);
    expect(ledger.layersFor("settlement-a")).toEqual(["Emergency Shelters", "Homes"]);
  });

  it("SpeciesAdaptationRegistry tracks real per-species adaptation history, distinct from AF-132's single aggregate wildlife index", () => {
    const registry = new SpeciesAdaptationRegistry();
    registry.adapt("sys-lucent-gate", "crystal-moth", "Pollution", "Develops thicker chitin to filter airborne particulates.");
    registry.adapt("sys-lucent-gate", "crystal-moth", "Terraforming", "Begins nesting in the new hydroponic bays.");
    expect(registry.historyFor("sys-lucent-gate", "crystal-moth").length).toBe(2);
    expect(registry.all().length).toBe(2);
  });

  it("CompanionEvolutionTracker grows, learns, and reaches Legend status independently of AF-131's CompanionHabitatRuntime dedup registry", () => {
    const tracker = new CompanionEvolutionTracker();
    expect(tracker.stageFor("nova-the-fox")).toBe("Hatchling");
    tracker.grow("nova-the-fox", 150);
    tracker.learnBehaviour("nova-the-fox", "Fetches tools for the engineering crew.");
    tracker.unlockTrait("nova-the-fox", "Bioluminescent fur");
    tracker.unlockTrait("nova-the-fox", "Bioluminescent fur");
    expect(tracker.isLegend("nova-the-fox")).toBe(true);
    const snapshot = tracker.snapshotFor("nova-the-fox");
    expect(snapshot.behaviours.length).toBe(1);
    expect(snapshot.traits.length).toBe(1);
  });

  it("LanguageEvolutionLog reuses AF-135's real EvolvingEntry so earlier phrasings stay archived", () => {
    const log = new LanguageEvolutionLog();
    log.coin("first-light", "The light that never went out.", 0, "Explorers");
    log.coin("first-light", "The light our founders carried across the dark.", 40, "Military historians");
    expect(log.latestFor("first-light")).toContain("founders");
    expect(log.all()[0]!.allVersions().length).toBe(2);
  });

  it("greatProjectsProgressSummary reports one unified lens over AF-090's real megastructures AND AF-138's real megaprojects, never a third roster", () => {
    const civFramework = makeCivFramework();
    const megaprojectTracker = new MegaprojectTracker();
    const before = greatProjectsProgressSummary(civFramework, megaprojectTracker);
    expect(before.totalProjects).toBe(civFramework.allMegastructures.length + CIVILISATION_MEGAPROJECTS.length);
    expect(before.completedProjects).toBe(0);

    megaprojectTracker.contribute(CIVILISATION_MEGAPROJECTS[0]!.id, CIVILISATION_MEGAPROJECTS[0]!.threshold);
    const after = greatProjectsProgressSummary(civFramework, megaprojectTracker);
    expect(after.completedProjects).toBe(1);
    expect(after.averageProgress).toBeGreaterThan(before.averageProgress);
  });
});
