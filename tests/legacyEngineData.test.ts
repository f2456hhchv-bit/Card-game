import { describe, expect, it } from "vitest";
import { EmotionalMemoryLog } from "../src/game/commanders/BondNetworkRuntime";
import {
  ANNIVERSARY_KINDS,
  COMMANDER_MEMORY_KINDS,
  ENDING_LEGACY_OUTPUT_KINDS,
  GALACTIC_RECORD_KINDS,
  LEGACY_CATEGORIES,
  LEGACY_MUSEUM_DISPLAY_KINDS,
  MEMORY_SYSTEM_EVENT_KINDS,
  PERSONAL_GIFT_KINDS,
  PHOTO_DESTINATION_KINDS,
  PLAYER_CHRONICLE_FIELDS,
  PLAYER_JOURNAL_ENTRY_KINDS,
  TIME_CAPSULE_CONTENT_KINDS,
} from "../src/game/legacy/legacyEngineData";
import {
  GalacticHistoryLog,
  GalacticRecordBoard,
  GiftLedger,
  LegacyProgressTracker,
  NpcMemoryLog,
  PhotoAlbum,
  PlayerChronicle,
  PlayerJournalRuntime,
  TimeCapsuleVault,
  exportLegacySnapshot,
  inheritedFlavourLines,
  isAnniversary,
} from "../src/game/legacy/LegacyEngineRuntime";

describe("The Legacy Engine (AF-133)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(LEGACY_CATEGORIES.length).toBe(13);
    expect(PLAYER_CHRONICLE_FIELDS.length).toBe(11);
    expect(GALACTIC_RECORD_KINDS.length).toBe(9);
    expect(MEMORY_SYSTEM_EVENT_KINDS.length).toBe(9);
    expect(COMMANDER_MEMORY_KINDS.length).toBe(8);
    expect(PERSONAL_GIFT_KINDS.length).toBe(7);
    expect(PLAYER_JOURNAL_ENTRY_KINDS.length).toBe(7);
    expect(PHOTO_DESTINATION_KINDS.length).toBe(6);
    expect(TIME_CAPSULE_CONTENT_KINDS.length).toBe(5);
    expect(ANNIVERSARY_KINDS.length).toBe(6);
    expect(LEGACY_MUSEUM_DISPLAY_KINDS.length).toBe(6);
    expect(ENDING_LEGACY_OUTPUT_KINDS.length).toBe(6);
  });

  it("LegacyProgressTracker only ever grows and correctly reports the top category", () => {
    const tracker = new LegacyProgressTracker();
    tracker.award("Explorer", 10);
    tracker.award("Scientist", 25);
    tracker.award("Explorer", 5);
    expect(tracker.xpFor("Explorer")).toBe(15);
    expect(tracker.xpFor("Scientist")).toBe(25);
    expect(tracker.topCategory()).toBe("Scientist");
    expect(tracker.totalXp()).toBe(40);
    tracker.award("Explorer", -100);
    expect(tracker.xpFor("Explorer")).toBe(15);
  });

  it("GalacticHistoryLog records richer fields than the locked GalacticHistoryRuntime and can forward into it", () => {
    const forwarded: string[] = [];
    const log = new GalacticHistoryLog((description) => forwarded.push(description));
    const record = log.record({
      title: "First colony restored",
      epoch: 12,
      planetId: "sys-lucent-gate",
      commanderIds: ["kane-vanguard"],
      description: "Lucent Gate's first colony was fully restored.",
      hasPhoto: true,
      hasDialogue: true,
      hasNewsCoverage: true,
      hasMuseumEntry: false,
    });
    expect(record.id).toBeTruthy();
    expect(log.all().length).toBe(1);
    expect(forwarded).toEqual(["Lucent Gate's first colony was fully restored."]);
  });

  it("GalacticRecordBoard only keeps a submission if it beats the current best — every record can eventually be surpassed", () => {
    const board = new GalacticRecordBoard();
    // "Fastest expedition" is lower-is-better.
    expect(board.submit("Fastest expedition", 120, "First attempt")).toBe(true);
    expect(board.submit("Fastest expedition", 200, "Slower attempt")).toBe(false);
    expect(board.submit("Fastest expedition", 90, "New record")).toBe(true);
    expect(board.recordFor("Fastest expedition")?.holderDescription).toBe("New record");
    // "Highest Humanity Score" is higher-is-better.
    expect(board.submit("Highest Humanity Score", 500, "First attempt")).toBe(true);
    expect(board.submit("Highest Humanity Score", 300, "Lower score")).toBe(false);
    expect(board.submit("Highest Humanity Score", 900, "New record")).toBe(true);
    expect(board.recordFor("Highest Humanity Score")?.holderDescription).toBe("New record");
  });

  it("PlayerChronicle tracks real favourite planet/ship and victory/defeat counts — nothing tracked this before", () => {
    const chronicle = new PlayerChronicle();
    chronicle.visitPlanet("sys-lucent-gate");
    chronicle.visitPlanet("sys-lucent-gate");
    chronicle.visitPlanet("sys-verdance");
    chronicle.useShip("wayfarer-hull-mk2");
    chronicle.recordVictory("Defeated the Ancient Custodian.");
    chronicle.recordDefeat("Lost the first Void incursion.");
    expect(chronicle.favouritePlanet()).toBe("sys-lucent-gate");
    expect(chronicle.favouriteShip()).toBe("wayfarer-hull-mk2");
    expect(chronicle.victoryCount()).toBe(1);
    expect(chronicle.defeatCount()).toBe(1);
  });

  it("NpcMemoryLog fades minor memories but keeps historic ones forever", () => {
    const log = new NpcMemoryLog(3);
    for (let i = 0; i < 6; i++) log.remember("npc-1", "Player kindness", `Minor kindness ${i}`, false);
    log.remember("npc-1", "Heroic rescues", "Saved the whole convoy.", true);
    const memories = log.memoriesFor("npc-1");
    expect(memories.filter((m) => !m.historic).length).toBe(3);
    expect(memories.some((m) => m.historic)).toBe(true);
    expect(memories.find((m) => m.historic)?.description).toBe("Saved the whole convoy.");
  });

  it("Commander Memories reuse AF-130's EmotionalMemoryLog directly rather than duplicating a new class", () => {
    const log = new EmotionalMemoryLog();
    log.record("kane-vanguard", "Favourite missions", "The defence of Meridian Rest.");
    log.record("kane-vanguard", "Personal gifts", "Gave the player a hand-drawn sketch.");
    expect(COMMANDER_MEMORY_KINDS).toContain("Favourite missions");
    expect(COMMANDER_MEMORY_KINDS).toContain("Personal gifts");
    expect(log.historyFor("kane-vanguard").length).toBe(2);
  });

  it("GiftLedger records real gifts per commander", () => {
    const ledger = new GiftLedger();
    ledger.receive({ id: "gift-1", kind: "Letters", commanderId: "voss-pathfinder", museumDescription: "A handwritten letter from the first expedition." });
    ledger.receive({ id: "gift-2", kind: "Plants", commanderId: "fen-beastmaster", museumDescription: "A cutting from the first restored biosphere." });
    expect(ledger.all().length).toBe(2);
    expect(ledger.fromCommander("voss-pathfinder").length).toBe(1);
  });

  it("PlayerJournalRuntime is append-only and searchable", () => {
    const journal = new PlayerJournalRuntime();
    journal.write("Discoveries", "Found a derelict ship near the Hollow Drift.");
    journal.write("Rare wildlife", "Spotted a Verdant Fox pack near Lucent Gate.");
    expect(journal.all().length).toBe(2);
    expect(journal.search("derelict").length).toBe(1);
    expect(journal.search("nothing here").length).toBe(0);
  });

  it("PhotoAlbum captures real photos and filters by destination", () => {
    const album = new PhotoAlbum();
    album.capture({ id: "photo-1", caption: "Sunrise over Lucent Gate.", destinationKinds: ["Museum displays", "Loading screens"] });
    expect(album.all().length).toBe(1);
    expect(album.forDestination("Museum displays").length).toBe(1);
    expect(album.forDestination("Books").length).toBe(0);
  });

  it("TimeCapsuleVault refuses to reopen a capsule in the same epoch it was created", () => {
    const vault = new TimeCapsuleVault();
    vault.create({ id: "capsule-1", createdAtEpoch: 10, contentKinds: ["Messages", "Photos"], message: "See you in the future." });
    expect(vault.reopen("capsule-1", 10)).toBeNull();
    expect(vault.reopen("capsule-1", 11)?.message).toBe("See you in the future.");
  });

  it("isAnniversary fires only on real multiples of the cycle length after the anchor", () => {
    expect(isAnniversary(12, 0)).toBe(true);
    expect(isAnniversary(24, 0)).toBe(true);
    expect(isAnniversary(13, 0)).toBe(false);
    expect(isAnniversary(0, 0)).toBe(false);
  });

  it("exportLegacySnapshot/inheritedFlavourLines produce real inheritance flavour for a new save, without touching SaveProfileManager", () => {
    const tracker = new LegacyProgressTracker();
    tracker.award("Founder", 50);
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
    const snapshot = exportLegacySnapshot(tracker, history);
    expect(snapshot.topCategory).toBe("Founder");
    expect(snapshot.totalXp).toBe(50);
    const lines = inheritedFlavourLines(snapshot);
    expect(lines[0]).toBe("The previous expedition: restored Helios.");
  });
});
