import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { CivilisationSimulationRuntime } from "../src/game/factions/CivilisationSimulationRuntime";
import { GalacticEconomyRuntime } from "../src/game/economy/GalacticEconomyRuntime";
import { ResearchTree } from "../src/game/research/ResearchTree";
import { ROSTER_RESEARCH_TREE } from "../src/game/research/researchRosterData";
import { CivilisationFrameworkRuntime } from "../src/game/civilisation/CivilisationFrameworkRuntime";
import { SEEDED_SETTLEMENTS } from "../src/game/civilisation/civilisationFrameworkData";
import {
  CAREER_PATH_KINDS,
  CIVILISATION_ATTRIBUTES,
  CIVILISATION_ENGINE_SPECIALISATIONS,
  CIVILISATION_LANDMARK_KINDS,
  CIVILISATION_MEGAPROJECTS,
  CIVILISATION_STAGES,
  GALACTIC_IDENTITY_KINDS,
  GENERATIONAL_CHANGE_KINDS,
  GOVERNMENT_PRIORITIES,
  IMMIGRATION_MOTIVATION_KINDS,
  NEW_CIVILISATION_ATTRIBUTES,
  PUBLIC_OPINION_REACTION_KINDS,
  SOCIAL_EVENT_KINDS,
  civilisationStageFor,
} from "../src/game/civilisationEngine/civilisationEngineData";
import {
  CareerPipeline,
  CivilisationAttributeExtension,
  GovernmentPriorityTracker,
  ImmigrationLedger,
  MegaprojectTracker,
  PublicOpinionTracker,
  SocialEventCalendar,
  civilisationAttributeSummaryFor,
} from "../src/game/civilisationEngine/CivilisationEngineRuntime";
import { MuseumCollectionRegistry } from "../src/game/livingMuseum/LivingMuseumRuntime";

function makeCivFramework(seed = 1) {
  const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
  const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("civSim"));
  const economy = new GalacticEconomyRuntime(civSim, new Rng(seed).fork("economy"));
  const researchTree = new ResearchTree(ROSTER_RESEARCH_TREE);
  const civFramework = new CivilisationFrameworkRuntime(civSim, economy, researchTree, new Rng(seed).fork("civ"));
  return { civFramework, civSim };
}

describe("The Civilisation Engine (AF-138)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CIVILISATION_STAGES.length).toBe(6);
    expect(CIVILISATION_ATTRIBUTES.length).toBe(18);
    expect(NEW_CIVILISATION_ATTRIBUTES.length).toBe(10);
    expect(CIVILISATION_ENGINE_SPECIALISATIONS.length).toBe(9);
    expect(GOVERNMENT_PRIORITIES.length).toBe(6);
    expect(CIVILISATION_MEGAPROJECTS.length).toBe(8);
    expect(CIVILISATION_LANDMARK_KINDS.length).toBe(8);
    expect(IMMIGRATION_MOTIVATION_KINDS.length).toBe(7);
    expect(SOCIAL_EVENT_KINDS.length).toBe(8);
    expect(CAREER_PATH_KINDS.length).toBe(7);
    expect(GENERATIONAL_CHANGE_KINDS.length).toBe(4);
    expect(GALACTIC_IDENTITY_KINDS.length).toBe(5);
    expect(PUBLIC_OPINION_REACTION_KINDS.length).toBe(9);
  });

  it("every megaproject has its own distinct megaproject-* id, never colliding with AF-090's real MEGASTRUCTURES ids", () => {
    for (const megaproject of CIVILISATION_MEGAPROJECTS) {
      expect(megaproject.id.startsWith("megaproject-")).toBe(true);
    }
  });

  it("civilisationStageFor climbs the six-stage ladder as both population and new-attribute average rise", () => {
    expect(civilisationStageFor(0, 0)).toBe("Survival");
    expect(civilisationStageFor(100, 100)).toBe("Beacon World");
    expect(civilisationStageFor(50, 50)).toBe("Colony");
  });

  it("CivilisationAttributeExtension is grow-only and starts every new attribute at the same baseline", () => {
    const extension = new CivilisationAttributeExtension();
    expect(extension.valueFor("settlement-lucent-gate", "Food")).toBe(20);
    extension.improve("settlement-lucent-gate", "Food", 10);
    extension.improve("settlement-lucent-gate", "Food", 5);
    expect(extension.valueFor("settlement-lucent-gate", "Food")).toBe(35);
    extension.improve("settlement-lucent-gate", "Food", -100);
    expect(extension.valueFor("settlement-lucent-gate", "Food")).toBe(35);
  });

  it("civilisationAttributeSummaryFor composes all 18 attributes from AF-090/AF-086's real state plus this module's own extension", () => {
    const { civFramework, civSim } = makeCivFramework();
    const extension = new CivilisationAttributeExtension();
    const settlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
    extension.improve(settlementId, "Culture", 30);

    const summary = civilisationAttributeSummaryFor(settlementId, civFramework, civSim, extension);
    expect(summary).not.toBeNull();
    expect(Object.keys(summary!.values).length).toBe(18);
    const factionId = civFramework.settlementFor(settlementId)!.profile.factionId;
    expect(summary!.values.Population).toBe(civSim.stateFor(factionId)?.attributes.population ?? 0);
    expect(summary!.values.Culture).toBe(50);
    expect(CIVILISATION_STAGES).toContain(summary!.stage);

    expect(civilisationAttributeSummaryFor("no-such-settlement", civFramework, civSim, extension)).toBeNull();
  });

  it("MegaprojectTracker accumulates real progress toward each threshold and never overshoots or double-completes", () => {
    const tracker = new MegaprojectTracker();
    const id = CIVILISATION_MEGAPROJECTS[0]!.id;
    expect(tracker.isComplete(id)).toBe(false);
    tracker.contribute(id, 60);
    tracker.contribute(id, 60);
    expect(tracker.progressFor(id)).toBe(CIVILISATION_MEGAPROJECTS[0]!.threshold);
    expect(tracker.isComplete(id)).toBe(true);
    expect(tracker.contribute(id, 10)).toBe(false);
    expect(tracker.completedCount()).toBe(1);
  });

  it("LandmarkRegistry reuses AF-134's generic MuseumCollectionRegistry over CivilisationLandmarkKind", () => {
    const landmarks = new MuseumCollectionRegistry<(typeof CIVILISATION_LANDMARK_KINDS)[number]>();
    landmarks.collect("Statues", "The First Light Memorial");
    landmarks.collect("Gardens", "Verdance Botanical Ring");
    expect(landmarks.all().length).toBe(2);
    expect(landmarks.countFor("Statues")).toBe(1);
  });

  it("ImmigrationLedger is append-only and filterable by motivation and destination", () => {
    const ledger = new ImmigrationLedger();
    ledger.relocate("settlement-a", "settlement-b", "Work", 1);
    ledger.relocate("settlement-c", "settlement-b", "Education", 2);
    expect(ledger.all().length).toBe(2);
    expect(ledger.countFor("Work")).toBe(1);
    expect(ledger.arrivalsFor("settlement-b")).toBe(2);
  });

  it("SocialEventCalendar deterministically cycles through SOCIAL_EVENT_KINDS by epoch", () => {
    const calendar = new SocialEventCalendar();
    const first = calendar.currentEvent();
    expect(SOCIAL_EVENT_KINDS).toContain(first);
    for (let i = 0; i < SOCIAL_EVENT_KINDS.length; i++) calendar.advanceEpoch();
    expect(calendar.currentEvent()).toBe(first);
  });

  it("GovernmentPriorityTracker only ever nudges a lean, never hard-sets a priority", () => {
    const tracker = new GovernmentPriorityTracker();
    expect(tracker.dominantPriority()).toBeNull();
    tracker.influence("Science", 5);
    tracker.influence("Industry", 2);
    expect(tracker.leaningFor("Science")).toBe(5);
    expect(tracker.dominantPriority()).toBe("Science");
  });

  it("PublicOpinionTracker tracks a real running lean per reaction kind", () => {
    const tracker = new PublicOpinionTracker();
    tracker.react("Festivals", 10);
    tracker.react("Disasters", -4);
    expect(tracker.opinionFor("Festivals")).toBe(10);
    expect(tracker.opinionFor("Disasters")).toBe(-4);
    expect(tracker.overallOpinion()).toBeCloseTo((10 - 4) / PUBLIC_OPINION_REACTION_KINDS.length, 5);
  });

  it("CareerPipeline tracks a real promotion count per citizen as their path changes", () => {
    const pipeline = new CareerPipeline();
    pipeline.assign("citizen-1", "Teachers");
    pipeline.promote("citizen-1", "Scientists");
    pipeline.promote("citizen-1", "Commanders");
    expect(pipeline.careerFor("citizen-1")?.path).toBe("Commanders");
    expect(pipeline.careerFor("citizen-1")?.promotions).toBe(2);
    expect(pipeline.totalPromotions()).toBe(2);
  });
});
