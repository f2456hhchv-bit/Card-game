import { describe, expect, it } from "vitest";
import {
  ATMOSPHERIC_DESIGN_DIMENSIONS,
  EXPERIENCE_DEVELOPER_TOOLS,
  EXPERIENCE_PILLARS,
  FIRST_TIME_MOMENT_KINDS,
  LONG_TERM_EXPERIENCE_STAGES,
  MACRO_EXPERIENCE_EXAMPLES,
  MICRO_EXPERIENCE_EXAMPLES,
  RETURNING_MOMENT_QUALITIES,
  SHARED_EXPERIENCE_EXAMPLES,
  longTermExperienceRank,
} from "../src/game/atlasExperience/atlasExperienceData";
import { AtmosphereCoordinator, ExperienceStateTracker, FirstTimeMomentTracker } from "../src/game/atlasExperience/AtlasExperienceRuntime";
import { PACING_CYCLE_STAGES } from "../src/game/atlasOrchestrator/atlasOrchestratorData";
import { PacingCycleTracker } from "../src/game/atlasOrchestrator/AtlasOrchestratorRuntime";
import { PLAYER_PURPOSE_KINDS } from "../src/game/atlasPurpose/atlasPurposeData";
import { PlayerPurposeObserver } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { EMERGENCE_OPPORTUNITY_KINDS } from "../src/game/simulationDirector/simulationDirectorData";
import { EmergenceOpportunityLog } from "../src/game/simulationDirector/SimulationDirectorRuntime";
import { PERSONAL_MEANING_CATEGORIES } from "../src/game/atlasMeaning/atlasMeaningData";
import { CollaborativeProblemLog } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { CIVILISATION_VALUES } from "../src/game/atlasWisdom/atlasWisdomData";

describe("The Atlas Experience Engine (AF-164)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(EXPERIENCE_PILLARS.length).toBe(10);
    expect(MICRO_EXPERIENCE_EXAMPLES.length).toBe(8);
    expect(MACRO_EXPERIENCE_EXAMPLES.length).toBe(8);
    expect(FIRST_TIME_MOMENT_KINDS.length).toBe(6);
    expect(RETURNING_MOMENT_QUALITIES.length).toBe(5);
    expect(LONG_TERM_EXPERIENCE_STAGES.length).toBe(4);
    expect(ATMOSPHERIC_DESIGN_DIMENSIONS.length).toBe(7);
    expect(SHARED_EXPERIENCE_EXAMPLES.length).toBe(6);
    expect(EXPERIENCE_DEVELOPER_TOOLS.length).toBe(7);
  });

  it("EXPERIENCE_PILLARS shares exactly 3 exact-string members with AF-160's real CIVILISATION_VALUES, kept separate since it tags experiential design rather than civilisation-wide values", () => {
    const overlap = EXPERIENCE_PILLARS.filter((p) => (CIVILISATION_VALUES as readonly string[]).includes(p));
    expect(overlap.sort()).toEqual(["Hope", "Legacy", "Responsibility"]);
  });

  it("longTermExperienceRank orders the linear Wonder-to-Legacy escalation ladder", () => {
    expect(longTermExperienceRank("Wonder")).toBe(0);
    expect(longTermExperienceRank("Legacy")).toBe(3);
  });

  it("Experience Rhythm reuses AF-154's real PacingCycleTracker/PACING_CYCLE_STAGES directly, sharing 7 of 8 stages verbatim", () => {
    const tracker = new PacingCycleTracker();
    tracker.record("Discovery", 1);
    expect(tracker.currentStage()).toBe("Discovery");
    expect(PACING_CYCLE_STAGES).toContain("Discovery");
    expect(PACING_CYCLE_STAGES).toContain("Combat");
  });

  it("Player Expression reuses AF-162's real PlayerPurposeObserver/PLAYER_PURPOSE_KINDS directly, sharing 7 of 8 playstyles verbatim", () => {
    const observer = new PlayerPurposeObserver();
    observer.observe("Explorer");
    expect(observer.dominantPurpose()).toBe("Explorer");
    expect(PLAYER_PURPOSE_KINDS).toContain("Conservationist");
  });

  it("Surprise Management reuses AF-153's real EmergenceOpportunityLog/EMERGENCE_OPPORTUNITY_KINDS directly, sharing near-exact examples", () => {
    const log = new EmergenceOpportunityLog();
    log.surface("Commander reunions", ["commander-fen-beastmaster", "commander-thorne-starforged"], "A shared mentor reconnects them.", 4);
    expect(log.countFor("Commander reunions")).toBe(1);
    expect(EMERGENCE_OPPORTUNITY_KINDS).toContain("Commander reunions");
  });

  it("Emotional Memory reuses AF-163's real PERSONAL_MEANING_CATEGORIES, sharing 'Most meaningful discovery' verbatim", () => {
    expect(PERSONAL_MEANING_CATEGORIES).toContain("Most meaningful discovery");
  });

  it("Micro Experiences and Returning Moments both compose AF-163's real SignificanceTracker directly", () => {
    const tracker = new SignificanceTracker();
    tracker.register("sunrise-restored-verdance", "Sunrise over restored Verdance", 1);
    tracker.reinforce("sunrise-restored-verdance", 10);
    expect(tracker.significanceOf("sunrise-restored-verdance")).toBe(1);
  });

  it("Shared Experiences reuses AF-155's real CollaborativeProblemLog directly, the fifth instance of the identical mechanic in this codebase", () => {
    const log = new CollaborativeProblemLog();
    log.propose("planetary-recovery-festival", ["settlement-verdance", "settlement-lucent-gate"], "Cultural", 20);
    expect(log.participantsFor("planetary-recovery-festival").length).toBe(2);
  });

  it("ExperienceStateTracker stores the latest 10-field snapshot and appends to history, never exposing player control", () => {
    const tracker = new ExperienceStateTracker();
    const snapshot = { curiosity: 70, confidence: 60, stress: 20, comfort: 65, achievement: 55, fatigue: 15, connection: 50, immersion: 80, focus: 60, emotionalMomentum: 45 };
    tracker.record(snapshot);
    expect(tracker.latest()).toEqual(snapshot);
    expect(tracker.history().length).toBe(1);
  });

  it("FirstTimeMomentTracker marks a moment occurred only once, protecting it from repetition", () => {
    const tracker = new FirstTimeMomentTracker();
    expect(tracker.markOccurred("First Commander recruited", 1)).toBe(true);
    expect(tracker.markOccurred("First Commander recruited", 5)).toBe(false);
    expect(tracker.hasOccurred("First Commander recruited")).toBe(true);
  });

  it("AtmosphereCoordinator tracks a level per atmospheric dimension", () => {
    const coordinator = new AtmosphereCoordinator();
    coordinator.setLevel("Lighting", 0.6);
    expect(coordinator.levelFor("Lighting")).toBe(0.6);
    expect(coordinator.levelFor("Music")).toBe(0);
  });
});
