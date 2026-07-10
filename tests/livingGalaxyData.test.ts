import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import {
  CRIME_CATEGORIES,
  DEEP_SPACE_PHENOMENA,
  DISCOVERY_KINDS,
  DYNAMIC_SEASONS,
  FESTIVALS,
  NEWS_CATEGORIES,
  POLITICAL_ORGANISATION_TYPES,
  POPULATION_LIFE_EVENTS,
  REPUTATION_CATEGORIES,
  RESEARCH_PROGRESS_EVENTS,
  TRADE_SHIP_TYPES,
  WEATHER_CONDITIONS,
  WILDLIFE_LIFECYCLE_EVENTS,
  clampIndex,
  seedEnvironmentalStates,
} from "../src/game/livingGalaxy/livingGalaxyData";
import {
  CrimeLedger,
  EnvironmentalRuntime,
  FestivalCalendar,
  LivingGalaxyChronicle,
  PlayerReputationLedger,
  drawDeepSpacePhenomenon,
  drawDiscovery,
  drawNewsItem,
} from "../src/game/livingGalaxy/LivingGalaxyRuntime";

describe("The Living Galaxy (AF-132)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(WEATHER_CONDITIONS.length).toBe(11);
    expect(DYNAMIC_SEASONS.length).toBe(4);
    expect(NEWS_CATEGORIES.length).toBe(11);
    expect(DISCOVERY_KINDS.length).toBe(10);
    expect(FESTIVALS.length).toBe(8);
    expect(CRIME_CATEGORIES.length).toBe(6);
    expect(DEEP_SPACE_PHENOMENA.length).toBe(6);
    expect(TRADE_SHIP_TYPES.length).toBe(9);
    expect(POLITICAL_ORGANISATION_TYPES.length).toBe(7);
    expect(REPUTATION_CATEGORIES.length).toBe(8);
    expect(POPULATION_LIFE_EVENTS.length).toBe(12);
    expect(WILDLIFE_LIFECYCLE_EVENTS.length).toBe(8);
    expect(RESEARCH_PROGRESS_EVENTS.length).toBe(6);
  });

  it("clampIndex bounds to [0, 100]", () => {
    expect(clampIndex(-10)).toBe(0);
    expect(clampIndex(150)).toBe(100);
    expect(clampIndex(42)).toBe(42);
  });

  it("seeds a real environmental state for every real galaxy star system, believably in the middle, never broken or perfect", () => {
    const seeded = seedEnvironmentalStates(SANDBOX_GALAXY.systems);
    expect(seeded.length).toBe(SANDBOX_GALAXY.systems.length);
    expect(seeded.length).toBeGreaterThan(0);
    for (const state of seeded) {
      expect(state.pollution).toBeGreaterThan(0);
      expect(state.pollution).toBeLessThan(100);
      expect(WEATHER_CONDITIONS).toContain(state.weatherCondition);
      expect(DYNAMIC_SEASONS).toContain(state.season);
    }
  });

  it("EnvironmentalRuntime.advanceEpoch drifts every real system's indices while always staying within [0, 100]", () => {
    const runtime = new EnvironmentalRuntime(seedEnvironmentalStates(SANDBOX_GALAXY.systems));
    const rng = new Rng(1234);
    for (let epoch = 0; epoch < 500; epoch++) {
      runtime.advanceEpoch(rng);
      for (const state of runtime.allStates()) {
        expect(state.pollution).toBeGreaterThanOrEqual(0);
        expect(state.pollution).toBeLessThanOrEqual(100);
        expect(state.wildlifeIndex).toBeGreaterThanOrEqual(0);
        expect(state.wildlifeIndex).toBeLessThanOrEqual(100);
        expect(state.healthcareIndex).toBeGreaterThanOrEqual(0);
        expect(state.healthcareIndex).toBeLessThanOrEqual(100);
        expect(state.crimeLevel).toBeGreaterThanOrEqual(0);
        expect(state.crimeLevel).toBeLessThanOrEqual(100);
      }
    }
    expect(runtime.averagePollution()).toBeGreaterThanOrEqual(0);
    expect(runtime.averageWildlife()).toBeGreaterThanOrEqual(0);
  });

  it("PlayerReputationLedger accumulates real totals across the 8 spec'd categories and is append-only", () => {
    const ledger = new PlayerReputationLedger();
    ledger.record("Saved worlds", 5, "Stabilised the Grey Ocean nanite colony.");
    ledger.record("Saved worlds", 3, "Evacuated Meridian Rest ahead of the storm.");
    ledger.record("Destroyed facilities", -2, "Collapsed an illegal mining rig.");
    expect(ledger.totalFor("Saved worlds")).toBe(8);
    expect(ledger.totalFor("Destroyed facilities")).toBe(-2);
    expect(ledger.grandTotal()).toBe(6);
    expect(ledger.history().length).toBe(3);
    expect(ledger.history()[0]!.sequence).toBe(0);
  });

  it("LivingGalaxyChronicle is append-only and never shrinks — history constantly progresses", () => {
    const chronicle = new LivingGalaxyChronicle();
    chronicle.record("news", "New colony founded on Verdance.");
    chronicle.record("festival", "Founders Day begins across the Initiative.");
    expect(chronicle.all().length).toBe(2);
    expect(chronicle.all()[1]!.sequence).toBe(1);
  });

  it("FestivalCalendar always returns a real festival and advances deterministically", () => {
    const calendar = new FestivalCalendar();
    const seen = new Set<string>();
    for (let i = 0; i < FESTIVALS.length; i++) {
      expect(FESTIVALS).toContain(calendar.currentFestival());
      seen.add(calendar.currentFestival());
      calendar.advanceEpoch();
    }
    expect(seen.size).toBe(FESTIVALS.length);
  });

  it("CrimeLedger reports real crime categories, and investigation is a player action, never mandatory", () => {
    const ledger = new CrimeLedger();
    const rng = new Rng(99);
    const report = ledger.report("sys-lucent-gate", rng);
    expect(CRIME_CATEGORIES).toContain(report.category);
    expect(report.investigated).toBe(false);
    expect(ledger.unresolvedCount()).toBe(1);
    ledger.investigate(report);
    expect(ledger.unresolvedCount()).toBe(0);
    expect(ledger.all().length).toBe(1);
  });

  it("drawNewsItem/drawDiscovery/drawDeepSpacePhenomenon never exhaust — drawing far more than the pool size still returns real values", () => {
    const rng = new Rng(7);
    for (let i = 0; i < 200; i++) {
      const news = drawNewsItem(rng);
      expect(NEWS_CATEGORIES).toContain(news.category);
      expect(DISCOVERY_KINDS).toContain(drawDiscovery(rng));
      expect(DEEP_SPACE_PHENOMENA).toContain(drawDeepSpacePhenomenon(rng));
    }
  });
});
