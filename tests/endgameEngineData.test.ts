import { describe, expect, it } from "vitest";
import {
  ANNUAL_ENDGAME_EVENT_KINDS,
  COMMANDER_LEGACY_ROLE_KINDS,
  EMERGENT_INDUSTRY_KINDS,
  ENDGAME_ACCESSIBILITY_SURFACES,
  ENDGAME_PILLARS,
  EXPEDITION_COUNCIL_PRIORITIES,
  GALACTIC_MUSEUM_EXHIBITION_THEMES,
  GREAT_EXPEDITION_DESTINATIONS,
  LEGENDARY_PROJECT_EXAMPLES,
  MEGA_DISCOVERY_KINDS,
  PLAYER_RECOGNITION_SIGNAL_KINDS,
  industryEmergenceEligible,
  megacityThresholdMet,
  temporaryExhibitionThemeFor,
} from "../src/game/endgameEngine/endgameEngineData";
import {
  AnnualEndgameCalendar,
  CommanderLegacyRuntime,
  EmergentIndustryLedger,
  ExpeditionCouncilTracker,
  FrontierExpeditionRegistry,
  GalacticMuseumExpansionTracker,
  MegaDiscoveryLog,
  MegacityLedger,
} from "../src/game/endgameEngine/EndgameEngineRuntime";

describe("The Infinite Endgame Engine (AF-140)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ENDGAME_PILLARS.length).toBe(8);
    expect(GREAT_EXPEDITION_DESTINATIONS.length).toBe(6);
    expect(LEGENDARY_PROJECT_EXAMPLES.length).toBe(8);
    expect(COMMANDER_LEGACY_ROLE_KINDS.length).toBe(7);
    expect(EXPEDITION_COUNCIL_PRIORITIES.length).toBe(6);
    expect(MEGA_DISCOVERY_KINDS.length).toBe(7);
    expect(ANNUAL_ENDGAME_EVENT_KINDS.length).toBe(8);
    expect(EMERGENT_INDUSTRY_KINDS.length).toBe(4);
    expect(PLAYER_RECOGNITION_SIGNAL_KINDS.length).toBe(4);
    expect(ENDGAME_ACCESSIBILITY_SURFACES.length).toBe(6);
    expect(GALACTIC_MUSEUM_EXHIBITION_THEMES.length).toBe(5);
  });

  it("every Great Expedition destination has its own expedition-* id, never colliding with AF-038's real SANDBOX_GALAXY systems", () => {
    for (const destination of GREAT_EXPEDITION_DESTINATIONS) {
      expect(destination.id.startsWith("expedition-")).toBe(true);
    }
  });

  it("megacityThresholdMet composes AF-090's real population + specialisation fields rather than a new specialisation axis", () => {
    expect(megacityThresholdMet(95, "science")).toBe(true);
    expect(megacityThresholdMet(95, null)).toBe(false);
    expect(megacityThresholdMet(50, "science")).toBe(false);
  });

  it("industryEmergenceEligible gates on AF-089's real economicHealth signal", () => {
    expect(industryEmergenceEligible(80)).toBe(true);
    expect(industryEmergenceEligible(30)).toBe(false);
  });

  it("temporaryExhibitionThemeFor deterministically cycles the museum's rotating exhibitions", () => {
    const first = temporaryExhibitionThemeFor(0);
    expect(GALACTIC_MUSEUM_EXHIBITION_THEMES).toContain(first);
    expect(temporaryExhibitionThemeFor(GALACTIC_MUSEUM_EXHIBITION_THEMES.length)).toBe(first);
  });

  it("FrontierExpeditionRegistry accumulates real progress per destination, capped at 100 and never regressing", () => {
    const registry = new FrontierExpeditionRegistry();
    const id = GREAT_EXPEDITION_DESTINATIONS[0]!.id;
    expect(registry.isComplete(id)).toBe(false);
    registry.advance(id, 60);
    registry.advance(id, 60);
    expect(registry.progressFor(id)).toBe(100);
    expect(registry.isComplete(id)).toBe(true);
    expect(registry.completedCount()).toBe(1);
  });

  it("CommanderLegacyRuntime tracks idempotent roles and append-only lore successors, never touching AF-030's real closed roster", () => {
    const legacy = new CommanderLegacyRuntime();
    legacy.assignRole("cmd-atlas-prime", "Teaching roles");
    legacy.assignRole("cmd-atlas-prime", "Teaching roles");
    expect(legacy.rolesFor("cmd-atlas-prime").length).toBe(1);
    legacy.induct("cmd-atlas-prime", "Nova Winters", 12);
    legacy.induct("cmd-atlas-prime", "Cael Byrne", 40);
    expect(legacy.successorsFor("cmd-atlas-prime").length).toBe(2);
    expect(legacy.all().length).toBe(2);
  });

  it("ExpeditionCouncilTracker only ever nudges a lean, mirroring AF-138's real GovernmentPriorityTracker mechanic", () => {
    const council = new ExpeditionCouncilTracker();
    expect(council.dominantPriority()).toBeNull();
    council.influence("Exploration targets", 5);
    council.influence("Diplomacy", 2);
    expect(council.leaningFor("Exploration targets")).toBe(5);
    expect(council.dominantPriority()).toBe("Exploration targets");
  });

  it("MegaDiscoveryLog is append-only and filterable by kind", () => {
    const log = new MegaDiscoveryLog();
    log.discover("Living planets", "A world whose oceans breathe with the tide.", 5);
    log.discover("Unknown physics", "Gravity briefly runs backwards near the ring.", 9);
    expect(log.all().length).toBe(2);
    expect(log.countFor("Living planets")).toBe(1);
  });

  it("GalacticMuseumExpansionTracker tracks real sector coverage and artifact arrivals, additive over AF-134's MuseumQualityTracker", () => {
    const tracker = new GalacticMuseumExpansionTracker();
    tracker.dispatchResearcher("sys-lucent-gate");
    tracker.dispatchResearcher("sys-lucent-gate");
    tracker.dispatchResearcher("sys-verdance");
    tracker.receiveArtifact();
    expect(tracker.sectorCount()).toBe(2);
    expect(tracker.artifactCount()).toBe(1);
  });

  it("MegacityLedger records each qualifying settlement exactly once", () => {
    const ledger = new MegacityLedger();
    expect(ledger.record("settlement-lucent-gate", 10)).toBe(true);
    expect(ledger.record("settlement-lucent-gate", 20)).toBe(false);
    expect(ledger.isMegacity("settlement-lucent-gate")).toBe(true);
    expect(ledger.all().length).toBe(1);
  });

  it("EmergentIndustryLedger is append-only and filterable by kind", () => {
    const ledger = new EmergentIndustryLedger();
    ledger.emerge("Tourism", 3);
    ledger.emerge("Tourism", 8);
    ledger.emerge("Scientific licensing", 8);
    expect(ledger.countFor("Tourism")).toBe(2);
    expect(ledger.all().length).toBe(3);
  });

  it("AnnualEndgameCalendar deterministically cycles ANNUAL_ENDGAME_EVENT_KINDS by epoch, kept separate from AF-132/AF-138's calendars", () => {
    const calendar = new AnnualEndgameCalendar();
    const first = calendar.currentEvent();
    expect(ANNUAL_ENDGAME_EVENT_KINDS).toContain(first);
    for (let i = 0; i < ANNUAL_ENDGAME_EVENT_KINDS.length; i++) calendar.advanceEpoch();
    expect(calendar.currentEvent()).toBe(first);
  });
});
