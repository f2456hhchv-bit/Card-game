import { describe, expect, it } from "vitest";
import { FULL_PROFILES_WITH_FOUNDER, FULL_ROSTER_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import { DUAL_ULTIMATES, seedBondGraph } from "../src/game/commanders/bondNetworkData";
import { BondNetworkRuntime } from "../src/game/commanders/BondNetworkRuntime";
import {
  AUDIO_ARCHIVE_KINDS,
  COMMANDER_DONATION_EXAMPLES,
  CURATION_OPTIONS,
  DISCOVERY_ARTIFACT_KINDS,
  EARTH_ARCHIVE_EXHIBIT_KINDS,
  GALACTIC_IMPACT_METRICS,
  INTERACTIVE_EXHIBIT_KINDS,
  LIBRARY_BOOK_KINDS,
  MUSEUM_SECTIONS,
  PLAYER_EXHIBIT_DISPLAY_KINDS,
  RESTORATION_ARTIFACT_TYPES,
  SPECIAL_EXHIBITION_KINDS,
  THEATER_PROGRAM_KINDS,
  VISITOR_TYPES,
  clampProgress,
} from "../src/game/livingMuseum/livingMuseumData";
import {
  MuseumCollectionRegistry,
  MuseumQualityTracker,
  RestorationLab,
  VisitorLog,
  galacticImpactFor,
  seedCommanderDonations,
  strongestBondLevelFor,
} from "../src/game/livingMuseum/LivingMuseumRuntime";

describe("The Living Museum (AF-134)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(MUSEUM_SECTIONS.length).toBe(15);
    expect(EARTH_ARCHIVE_EXHIBIT_KINDS.length).toBe(11);
    expect(DISCOVERY_ARTIFACT_KINDS.length).toBe(10);
    expect(CURATION_OPTIONS.length).toBe(6);
    expect(VISITOR_TYPES.length).toBe(7);
    expect(INTERACTIVE_EXHIBIT_KINDS.length).toBe(9);
    expect(RESTORATION_ARTIFACT_TYPES.length).toBe(8);
    expect(SPECIAL_EXHIBITION_KINDS.length).toBe(7);
    expect(THEATER_PROGRAM_KINDS.length).toBe(6);
    expect(LIBRARY_BOOK_KINDS.length).toBe(7);
    expect(AUDIO_ARCHIVE_KINDS.length).toBe(7);
    expect(PLAYER_EXHIBIT_DISPLAY_KINDS.length).toBe(8);
    expect(GALACTIC_IMPACT_METRICS.length).toBe(6);
  });

  it("clampProgress bounds to [0, 100]", () => {
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(150)).toBe(100);
    expect(clampProgress(50)).toBe(50);
  });

  it("resolves the spec's five named commander donations to real roster ids, including the Orion -> Dorian Fen rename resolution", () => {
    expect(COMMANDER_DONATION_EXAMPLES.length).toBe(5);
    const rosterIds = new Set(FULL_ROSTER_WITH_FOUNDER.map((c) => c.id));
    for (const donation of COMMANDER_DONATION_EXAMPLES) expect(rosterIds, donation.commanderId).toContain(donation.commanderId);
    const fen = COMMANDER_DONATION_EXAMPLES.find((d) => d.item === "Companion field journal");
    expect(fen?.commanderId).toBe("fen-beastmaster");
  });

  it("RestorationLab is its own progression system — progress only ever grows, capped at 100", () => {
    const lab = new RestorationLab();
    lab.beginRestoration("artifact-1", "Photographs");
    expect(lab.isComplete("artifact-1")).toBe(false);
    lab.advance("artifact-1", 60);
    lab.advance("artifact-1", 60);
    expect(lab.isComplete("artifact-1")).toBe(true);
    expect(lab.allProjects()[0]!.progress).toBe(100);
    expect(lab.completedCount()).toBe(1);
  });

  it("seedCommanderDonations reuses AF-133's real GiftLedger rather than a duplicate donation class", () => {
    const ledger = seedCommanderDonations(COMMANDER_DONATION_EXAMPLES);
    expect(ledger.all().length).toBe(5);
    expect(ledger.fromCommander("prime-founder")[0]!.museumDescription).toBe("Original Beacon");
  });

  it("strongestBondLevelFor composes with the real BondNetworkRuntime's public API — Commander Hall rooms expand alongside Bond Level", () => {
    const bondNetwork = new BondNetworkRuntime(seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER), DUAL_ULTIMATES);
    const level = strongestBondLevelFor("thorne-starforged", FULL_ROSTER_WITH_FOUNDER, bondNetwork);
    expect(level).toBeGreaterThanOrEqual(0);
    bondNetwork.growBond("thorne-starforged", "ryker-engineer", 5);
    const grown = strongestBondLevelFor("thorne-starforged", FULL_ROSTER_WITH_FOUNDER, bondNetwork);
    expect(grown).toBeGreaterThanOrEqual(level);
  });

  it("VisitorLog records real arrivals per visitor type", () => {
    const log = new VisitorLog();
    log.arrive("Students");
    log.arrive("Students");
    log.arrive("Scientists");
    expect(log.countFor("Students")).toBe(2);
    expect(log.countFor("Scientists")).toBe(1);
    expect(log.totalVisitors()).toBe(3);
  });

  it("MuseumCollectionRegistry serves Theater/Library/Audio Archive uniformly, no near-duplicate classes", () => {
    const theater = new MuseumCollectionRegistry<(typeof THEATER_PROGRAM_KINDS)[number]>();
    theater.collect("Commander interviews", "Astrid Reyes: The Long Watch");
    const library = new MuseumCollectionRegistry<(typeof LIBRARY_BOOK_KINDS)[number]>();
    library.collect("Novels", "The Last Light of Earth");
    expect(theater.countFor("Commander interviews")).toBe(1);
    expect(library.all().length).toBe(1);
  });

  it("galacticImpactFor scales every metric with museum quality and clamps", () => {
    const zero = galacticImpactFor(0);
    for (const metric of GALACTIC_IMPACT_METRICS) expect(zero[metric]).toBe(0);
    const full = galacticImpactFor(100);
    for (const metric of GALACTIC_IMPACT_METRICS) expect(full[metric]).toBeGreaterThan(0);
    expect(galacticImpactFor(500)).toEqual(full);
  });

  it("MuseumQualityTracker only ever improves, clamped at 100", () => {
    const tracker = new MuseumQualityTracker();
    expect(tracker.value()).toBe(10);
    tracker.improve(50);
    expect(tracker.value()).toBe(60);
    tracker.improve(1000);
    expect(tracker.value()).toBe(100);
  });
});
