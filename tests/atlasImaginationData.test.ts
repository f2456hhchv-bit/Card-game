import { describe, expect, it } from "vitest";
import {
  CHILDRENS_IMAGINATION_OUTCOMES,
  COLLECTIVE_DREAM_EXAMPLES,
  COMMANDER_VISION_EXAMPLES,
  CULTURAL_IMAGINATION_FORMS,
  DREAM_NETWORK_STAGES,
  ENGINEERING_IMAGINATION_EXAMPLES,
  EXPLORATION_IMAGINATION_EXAMPLES,
  FUTURE_MYTH_EXAMPLES,
  HISTORICAL_IMAGINATION_QUESTIONS,
  IMAGINATION_DEVELOPER_TOOLS,
  IMAGINATION_DOMAINS,
  INDIVIDUAL_IMAGINATION_INFLUENCES,
  SCIENTIFIC_IMAGINATION_TOPICS,
} from "../src/game/atlasImagination/atlasImaginationData";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { CREATIVE_DOMAINS } from "../src/game/atlasCreativeIntelligence/atlasCreativeIntelligenceData";
import { CommanderBeliefTracker } from "../src/game/atlasPhilosophy/AtlasPhilosophyRuntime";
import { LongTermMissionTracker } from "../src/game/atlasPurpose/AtlasPurposeRuntime";
import { MysteryLog } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { ensureNextHorizonOpen } from "../src/game/atlasLegacyOfTomorrow/AtlasLegacyOfTomorrowRuntime";

describe("The Atlas Imagination Engine (AF-172)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(IMAGINATION_DOMAINS.length).toBe(12);
    expect(INDIVIDUAL_IMAGINATION_INFLUENCES.length).toBe(6);
    expect(COMMANDER_VISION_EXAMPLES.length).toBe(6);
    expect(SCIENTIFIC_IMAGINATION_TOPICS.length).toBe(5);
    expect(ENGINEERING_IMAGINATION_EXAMPLES.length).toBe(6);
    expect(CHILDRENS_IMAGINATION_OUTCOMES.length).toBe(6);
    expect(CULTURAL_IMAGINATION_FORMS.length).toBe(6);
    expect(EXPLORATION_IMAGINATION_EXAMPLES.length).toBe(5);
    expect(HISTORICAL_IMAGINATION_QUESTIONS.length).toBe(3);
    expect(COLLECTIVE_DREAM_EXAMPLES.length).toBe(5);
    expect(DREAM_NETWORK_STAGES.length).toBe(5);
    expect(FUTURE_MYTH_EXAMPLES.length).toBe(4);
    expect(IMAGINATION_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("IMAGINATION_DOMAINS ties (does not break) AF-171's absolute overlap record, sharing 9 of 12 exact-string members with the real CREATIVE_DOMAINS, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(IMAGINATION_DOMAINS, CREATIVE_DOMAINS);
    expect(report.shared.length).toBe(9);
  });

  it("HypothesisTracker starts every idea ungrounded and only marks it grounded through an explicit later action", () => {
    const tracker = new HypothesisTracker();
    tracker.propose("hypothesis-ancient-precursor-tech", "The Verdance ruins may be precursor technology.", 5);
    expect(tracker.isGrounded("hypothesis-ancient-precursor-tech")).toBe(false);
    tracker.supportWithEvidence("hypothesis-ancient-precursor-tech", 20);
    expect(tracker.isGrounded("hypothesis-ancient-precursor-tech")).toBe(true);
    expect(tracker.isGrounded("hypothesis-unknown")).toBe(false);
  });

  it("Commander Visions reuses AF-161's real CommanderBeliefTracker directly, since that class already stores plain evolving strings with no union constraint", () => {
    const tracker = new CommanderBeliefTracker();
    tracker.setBelief("commander-fen-beastmaster", "I dream of a future academy on Verdance.", 5);
    tracker.setBelief("commander-fen-beastmaster", "I dream of safer colonies across the frontier.", 20);
    expect(tracker.beliefOf("commander-fen-beastmaster")).toBe("I dream of safer colonies across the frontier.");
    expect(tracker.history("commander-fen-beastmaster").length).toBe(2);
  });

  it("Engineering Imagination and Collective Dreams both compose AF-162's real LongTermMissionTracker directly", () => {
    const missions = new LongTermMissionTracker();
    missions.register("living-architecture-verdance", "Grow a self-restoring city on Verdance", 100);
    missions.advance("living-architecture-verdance", 50);
    expect(missions.progressFor("living-architecture-verdance")).toBeCloseTo(0.5, 5);
  });

  it("Historical Imagination composes AF-159's real MysteryLog.open directly", () => {
    const mysteries = new MysteryLog();
    mysteries.open("mystery-incomplete-records", "Incomplete research", "Which records from the First Contact era remain incomplete?", 20);
    expect(mysteries.unsolved().length).toBe(1);
  });

  it("The Dream Network is driven directly by AF-155's real generic CyclicStageTracker over the module's own 5-stage union", () => {
    const network = new CyclicStageTracker(DREAM_NETWORK_STAGES);
    network.record("Imagine", 1);
    expect(network.currentStage()).toBe("Imagine");
    expect(network.next("Fund")).toBe("Imagine");
  });

  it("The Horizon Effect reuses AF-169's real ensureNextHorizonOpen directly, opening the next horizon exactly once per completed idea", () => {
    const missions = new LongTermMissionTracker();
    missions.register("living-architecture-verdance", "Grow a self-restoring city on Verdance", 100);
    missions.advance("living-architecture-verdance", 100);
    const mysteries = new MysteryLog();
    expect(ensureNextHorizonOpen(missions, "living-architecture-verdance", mysteries, "mystery-next-question", "Unknown signals", "What made the city choose to restore itself this way?", 30)).toBe(true);
    expect(ensureNextHorizonOpen(missions, "living-architecture-verdance", mysteries, "mystery-next-question", "Unknown signals", "What made the city choose to restore itself this way?", 40)).toBe(false);
  });
});
