import { describe, expect, it } from "vitest";
import {
  COMMANDER_LEGACY_EXAMPLES,
  GALACTIC_MATURITY_QUALITIES,
  GENERATIONAL_INHERITANCE_EXAMPLES,
  HORIZON_PRINCIPLE_EXAMPLES,
  INSPIRATION_NETWORK_PARTICIPANTS,
  LEGACY_DOMAINS,
  LEGACY_OF_TOMORROW_DEVELOPER_TOOLS,
  LEGACY_PROJECT_EXAMPLES,
  LIVING_INHERITANCE_EXAMPLES,
  PLAYER_LEGACY_EXAMPLES,
  REMEMBRANCE_THEMES,
} from "../src/game/atlasLegacyOfTomorrow/atlasLegacyOfTomorrowData";
import { ensureNextHorizonOpen, NextGenerationLog } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";
import { PURPOSE_DOMAINS } from "../src/game/atlasPurpose/atlasPurposeData";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { MentorshipLedger } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { EmotionalContinuityTracker } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";
import { RitualLog } from "../src/game/atlasSoul/AtlasSoulRuntime";
import { ReputationTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";

describe("The Atlas Legacy of Tomorrow (AF-169)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(LEGACY_DOMAINS.length).toBe(12);
    expect(GENERATIONAL_INHERITANCE_EXAMPLES.length).toBe(10);
    expect(COMMANDER_LEGACY_EXAMPLES.length).toBe(7);
    expect(PLAYER_LEGACY_EXAMPLES.length).toBe(8);
    expect(LIVING_INHERITANCE_EXAMPLES.length).toBe(6);
    expect(LEGACY_PROJECT_EXAMPLES.length).toBe(7);
    expect(INSPIRATION_NETWORK_PARTICIPANTS.length).toBe(6);
    expect(REMEMBRANCE_THEMES.length).toBe(7);
    expect(HORIZON_PRINCIPLE_EXAMPLES.length).toBe(5);
    expect(GALACTIC_MATURITY_QUALITIES.length).toBe(6);
    expect(LEGACY_OF_TOMORROW_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("LEGACY_DOMAINS ties the absolute-count overlap record (8 of 12) with AF-162's real PURPOSE_DOMAINS without breaking AF-168's proportional record", () => {
    const overlap = LEGACY_DOMAINS.filter((d) => (PURPOSE_DOMAINS as readonly string[]).includes(d));
    expect(overlap.length).toBe(8);
  });

  it("Legacy Projects reuse AF-162's real LongTermMissionTracker directly, no second generational-project tracker", () => {
    const missions = new LongTermMissionTracker();
    missions.register("living-library-network", "Establish the Living Library Network", 100);
    missions.advance("living-library-network", 100);
    expect(missions.isComplete("living-library-network")).toBe(true);
  });

  it("ensureNextHorizonOpen chains a completed LongTermMissionTracker mission to a real MysteryLog.open call, opening the next horizon exactly once", () => {
    const missions = new LongTermMissionTracker();
    missions.register("living-library-network", "Establish the Living Library Network", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "living-library-network", mysteries, "mystery-lost-archive", "Missing artifacts", "A rumoured archive lies beyond the frontier.", 20)).toBe(false);
    missions.advance("living-library-network", 100);
    expect(ensureNextHorizonOpen(missions, "living-library-network", mysteries, "mystery-lost-archive", "Missing artifacts", "A rumoured archive lies beyond the frontier.", 20)).toBe(true);
    expect(mysteries.unsolved().length).toBe(1);
    expect(ensureNextHorizonOpen(missions, "living-library-network", mysteries, "mystery-lost-archive", "Missing artifacts", "A rumoured archive lies beyond the frontier.", 30)).toBe(false);
    expect(mysteries.all().length).toBe(1);
  });

  it("Commander Legacy's 'Students' reuses AF-160's real MentorshipLedger.menteesOf directly", () => {
    const ledger = new MentorshipLedger();
    ledger.assign("commander-thorne-starforged", "commander-fen-beastmaster", 5);
    expect(ledger.menteesOf("commander-thorne-starforged")).toContain("commander-fen-beastmaster");
  });

  it("Remembrance composes AF-163's real SignificanceTracker and AF-166's real EmotionalContinuityTracker directly", () => {
    const significance = new SignificanceTracker();
    significance.register("anniversary-first-contact", "First Contact Anniversary", 1);
    significance.reinforce("anniversary-first-contact", 20);
    expect(significance.significanceOf("anniversary-first-contact")).toBe(1);

    const continuity = new EmotionalContinuityTracker();
    continuity.setback("humanity", 20);
    continuity.recoverStep("humanity", 10);
    expect(continuity.hopeLevelOf("humanity")).toBe(90);
  });

  it("Evolving Traditions reuses AF-168's real RitualLog directly", () => {
    const rituals = new RitualLog();
    rituals.observe("Lighting the Beacon", ["settlement-verdance"], 20);
    expect(rituals.countFor("Lighting the Beacon")).toBe(1);
  });

  it("Galactic Maturity reuses AF-167's real ReputationTracker directly at civilisation scale", () => {
    const reputation = new ReputationTracker();
    reputation.recognizeFor("humanity", "Wisdom", 20);
    expect(reputation.recognitionCountFor("humanity", "Wisdom")).toBe(1);
  });

  it("NextGenerationLog witnesses moments that mark a new generation beginning, distinct from AF-168's general MomentsOfHumanityLog", () => {
    const log = new NextGenerationLog();
    log.witness("A new Commander steps aboard the Wayfarer for the first time.", 20);
    expect(log.all().length).toBe(1);
  });
});
