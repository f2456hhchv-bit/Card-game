import { describe, expect, it } from "vitest";
import {
  COLLECTIVE_MEMORY_CATEGORIES,
  COMMUNITY_MEANING_PLACE_TYPES,
  CULTURAL_MEANING_TRADITIONS,
  ECOLOGICAL_MEANING_OUTCOMES,
  EXPLORATION_MEANING_QUALITIES,
  HISTORICAL_MEANING_FOCUS,
  INSTITUTIONAL_MEANING_EXAMPLES,
  MEANING_DEVELOPER_TOOLS,
  MEANING_DOMAINS,
  PERSONAL_MEANING_CATEGORIES,
  PLAYER_MEANING_CATEGORIES,
  QUIET_MOMENT_EXAMPLES,
  SCIENTIFIC_MEANING_REASONS,
  SYMBOL_EXAMPLES,
} from "../src/game/atlasMeaning/atlasMeaningData";
import { CommunityMeaningTracker, MeaningCurator, QuietMomentLog, SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { PURPOSE_DOMAINS } from "../src/game/atlasPurpose/atlasPurposeData";

describe("The Atlas Meaning Engine (AF-163)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(MEANING_DOMAINS.length).toBe(12);
    expect(PERSONAL_MEANING_CATEGORIES.length).toBe(6);
    expect(PLAYER_MEANING_CATEGORIES.length).toBe(6);
    expect(COLLECTIVE_MEMORY_CATEGORIES.length).toBe(6);
    expect(COMMUNITY_MEANING_PLACE_TYPES.length).toBe(7);
    expect(SCIENTIFIC_MEANING_REASONS.length).toBe(5);
    expect(HISTORICAL_MEANING_FOCUS.length).toBe(6);
    expect(CULTURAL_MEANING_TRADITIONS.length).toBe(5);
    expect(ECOLOGICAL_MEANING_OUTCOMES.length).toBe(3);
    expect(EXPLORATION_MEANING_QUALITIES.length).toBe(5);
    expect(INSTITUTIONAL_MEANING_EXAMPLES.length).toBe(4);
    expect(SYMBOL_EXAMPLES.length).toBe(6);
    expect(QUIET_MOMENT_EXAMPLES.length).toBe(6);
    expect(MEANING_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("MEANING_DOMAINS shares exactly 5 exact-string members with AF-162's real PURPOSE_DOMAINS, confirmed not a new overlap record (AF-162's own 8-match overlap with AF-161 remains heaviest)", () => {
    const overlap = MEANING_DOMAINS.filter((d) => (PURPOSE_DOMAINS as readonly string[]).includes(d));
    expect(overlap.length).toBe(5);
  });

  it("MeaningCurator overwrites a category's entry as a new favourite emerges, rather than appending a full history", () => {
    const curator = new MeaningCurator<(typeof PERSONAL_MEANING_CATEGORIES)[number]>();
    curator.curate("commander-fen-beastmaster", "Favourite memory", "First contact with the Verdance wildlife.", 10);
    curator.curate("commander-fen-beastmaster", "Favourite memory", "Reuniting with a lost mentor.", 25);
    expect(curator.entryFor("commander-fen-beastmaster", "Favourite memory")?.description).toBe("Reuniting with a lost mentor.");
  });

  it("The same MeaningCurator generic class serves Personal Meaning, Player Meaning and Collective Memory without three near-identical trackers", () => {
    const playerCurator = new MeaningCurator<(typeof PLAYER_MEANING_CATEGORIES)[number]>();
    playerCurator.curate("player", "Favourite planet", "Verdance", 5);
    const collectiveCurator = new MeaningCurator<(typeof COLLECTIVE_MEMORY_CATEGORIES)[number]>();
    collectiveCurator.curate("civilisation", "Great kindness", "The Verdance famine relief.", 8);
    expect(playerCurator.entryFor("player", "Favourite planet")?.description).toBe("Verdance");
    expect(collectiveCurator.entryFor("civilisation", "Great kindness")?.description).toBe("The Verdance famine relief.");
  });

  it("SignificanceTracker accumulates weight through reinforcing moments rather than a fixed importance assigned up front", () => {
    const tracker = new SignificanceTracker();
    tracker.register("atlas-beacon", "Atlas Beacon", 1);
    expect(tracker.significanceOf("atlas-beacon")).toBe(0);
    tracker.reinforce("atlas-beacon", 10);
    tracker.reinforce("atlas-beacon", 20);
    expect(tracker.significanceOf("atlas-beacon")).toBe(2);
  });

  it("The same SignificanceTracker generic class serves both Symbols and Meaning Through Time", () => {
    const tracker = new SignificanceTracker();
    tracker.register("first-contact-event", "First Contact", 5);
    tracker.reinforce("first-contact-event", 10);
    expect(tracker.significanceOf("first-contact-event")).toBe(1);
  });

  it("CommunityMeaningTracker attaches emotional meaning to a real place", () => {
    const tracker = new CommunityMeaningTracker();
    tracker.attachMeaning("museum-verdance", "Museums", "Where the founder's helmet is displayed.", 12);
    expect(tracker.meaningOf("museum-verdance")?.placeType).toBe("Museums");
  });

  it("QuietMomentLog is a simple append-only record — quiet moments are never scored or ranked", () => {
    const log = new QuietMomentLog();
    log.record("Watching the sunrise over the Verdance canopy.", 15);
    expect(log.all().length).toBe(1);
  });
});
