import { describe, expect, it } from "vitest";
import { FULL_PROFILES_WITH_FOUNDER, FULL_ROSTER_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import { DUAL_ULTIMATES, seedBondGraph } from "../src/game/commanders/bondNetworkData";
import { BondNetworkRuntime, EmotionalMemoryLog } from "../src/game/commanders/BondNetworkRuntime";
import { GalacticHistoryLog, GiftLedger, LegacyProgressTracker, PlayerChronicle } from "../src/game/legacy/LegacyEngineRuntime";
import { MuseumCollectionRegistry } from "../src/game/livingMuseum/LivingMuseumRuntime";
import {
  AUTHOR_VOICES,
  CHRONICLE_STRUCTURE_SECTIONS,
  EvolvingEntry,
  GENERATIONAL_REFERENCE_KINDS,
  LIVING_MAP_OVERLAY_KINDS,
  MultiPerspectiveRecord,
  ORAL_HISTORY_TOPICS,
  PERSPECTIVE_KINDS,
  PLANETARY_HISTORY_FIELDS,
  PLAYER_WRITABLE_ENTRY_KINDS,
  PUBLISHER_VOICES,
} from "../src/game/chronicle/chronicleData";
import {
  PlanetaryChronicle,
  commanderHistoryFor,
  generateFinalChronicle,
  generatePlayerBiography,
} from "../src/game/chronicle/ChronicleRuntime";

describe("The Chronicle of Humanity (AF-135)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CHRONICLE_STRUCTURE_SECTIONS.length).toBe(16);
    expect(AUTHOR_VOICES.length).toBe(7);
    expect(PERSPECTIVE_KINDS.length).toBe(6);
    expect(ORAL_HISTORY_TOPICS.length).toBe(8);
    expect(PUBLISHER_VOICES.length).toBe(5);
    expect(LIVING_MAP_OVERLAY_KINDS.length).toBe(7);
    expect(GENERATIONAL_REFERENCE_KINDS.length).toBe(6);
    expect(PLAYER_WRITABLE_ENTRY_KINDS.length).toBe(6);
    expect(PLANETARY_HISTORY_FIELDS.length).toBe(12);
  });

  it("EvolvingEntry never overwrites — every version stays archived, latest() reads the newest", () => {
    const entry = new EvolvingEntry("sys-lucent-gate");
    entry.expand("A small colony has been established.", 1, "Citizens");
    entry.expand("Helios Prime became one of the greatest engineering capitals in known space.", 200, "Engineers");
    expect(entry.allVersions().length).toBe(2);
    expect(entry.allVersions()[0]!.text).toBe("A small colony has been established.");
    expect(entry.latest()!.text).toContain("engineering capitals");
  });

  it("MultiPerspectiveRecord ensures no event has only one voice", () => {
    const record = new MultiPerspectiveRecord("event-first-contact");
    record.addPerspective("Military", "A calculated risk that paid off.");
    record.addPerspective("Scientific", "The single greatest discovery of the century.");
    expect(record.voiceCount()).toBe(2);
    expect(record.perspectiveFor("Military")).toContain("calculated risk");
  });

  it("PlanetaryChronicle tracks real evolving prose per planet, distinct from AF-132's numeric environment", () => {
    const chronicle = new PlanetaryChronicle();
    chronicle.write("sys-verdance", "Discovery logged.", 1, "Explorers");
    chronicle.write("sys-verdance", "A thriving colony now stands here.", 50, "Citizens");
    const entry = chronicle.entryFor("sys-verdance");
    expect(entry.allVersions().length).toBe(2);
    expect(chronicle.all().length).toBe(1);
  });

  it("generatePlayerBiography composes AF-133's real PlayerChronicle/LegacyProgressTracker rather than re-tracking anything", () => {
    const playerChronicle = new PlayerChronicle();
    playerChronicle.visitPlanet("sys-lucent-gate");
    playerChronicle.useShip("wayfarer-hull-mk2");
    playerChronicle.recordVictory("Defeated the Ancient Custodian.");
    const legacyProgress = new LegacyProgressTracker();
    legacyProgress.award("Explorer", 100);
    const bio = generatePlayerBiography(playerChronicle, legacyProgress);
    expect(bio.favouritePlanet).toBe("sys-lucent-gate");
    expect(bio.favouriteShip).toBe("wayfarer-hull-mk2");
    expect(bio.victoryCount).toBe(1);
    expect(bio.totalLegacyXp).toBe(100);
    expect(bio.leadershipStyle).toContain("explorer");
  });

  it("commanderHistoryFor composes AF-130's EmotionalMemoryLog + BondNetworkRuntime with AF-133's GiftLedger, all through their existing public APIs", () => {
    const memoryLog = new EmotionalMemoryLog();
    memoryLog.record("kane-vanguard", "Favourite missions", "The defence of Meridian Rest.");
    const giftLedger = new GiftLedger();
    giftLedger.receive({ id: "gift-1", kind: "Letters", commanderId: "kane-vanguard", museumDescription: "A handwritten letter." });
    const bondNetwork = new BondNetworkRuntime(seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER), DUAL_ULTIMATES);
    bondNetwork.growBond("kane-vanguard", "ryker-engineer", 4);
    const history = commanderHistoryFor("kane-vanguard", memoryLog, giftLedger, bondNetwork, FULL_ROSTER_WITH_FOUNDER);
    expect(history.memories).toBe(1);
    expect(history.giftsDonated).toBe(1);
    expect(history.strongestBondPartnerId).toBe("ryker-engineer");
    expect(history.strongestBondLevel).toBeGreaterThanOrEqual(4);
  });

  it("Oral History / Book Publishing / Player Writable Entries reuse AF-134's real MuseumCollectionRegistry rather than three new near-duplicate classes", () => {
    const oralHistory = new MuseumCollectionRegistry<(typeof ORAL_HISTORY_TOPICS)[number]>();
    oralHistory.collect("First expedition", "Kieran Solace on the road to the first accord.");
    const library = new MuseumCollectionRegistry<(typeof PUBLISHER_VOICES)[number]>();
    library.collect("Historians", "A People Reborn: The Afterlight Century.");
    const writable = new MuseumCollectionRegistry<(typeof PLAYER_WRITABLE_ENTRY_KINDS)[number]>();
    writable.collect("Letters", "To whoever finds this next: it was worth it.");
    expect(oralHistory.countFor("First expedition")).toBe(1);
    expect(library.all().length).toBe(1);
    expect(writable.countFor("Letters")).toBe(1);
  });

  it("generateFinalChronicle produces a real, deterministic aggregation of history, legacy, and biography", () => {
    const history = new GalacticHistoryLog();
    history.record({
      title: "First colony restored",
      epoch: 1,
      planetId: "sys-lucent-gate",
      commanderIds: [],
      description: "restored Helios.",
      hasPhoto: false,
      hasDialogue: false,
      hasNewsCoverage: false,
      hasMuseumEntry: true,
    });
    const playerChronicle = new PlayerChronicle();
    playerChronicle.recordVictory("Ended the war.");
    const legacyProgress = new LegacyProgressTracker();
    legacyProgress.award("Founder", 250);
    const finalChronicle = generateFinalChronicle(history, playerChronicle, legacyProgress);
    expect(finalChronicle.totalHistoricalRecords).toBe(1);
    expect(finalChronicle.totalLegacyXp).toBe(250);
    expect(finalChronicle.biography.victoryCount).toBe(1);
    expect(finalChronicle.inheritedFlavourLines[0]).toBe("The previous expedition: restored Helios.");
  });
});
