import { describe, expect, it } from "vitest";
import {
  CIVILISATION_POSSIBILITY_EXAMPLES,
  COMMANDER_THINKING_EXAMPLES,
  ENGINEERING_POSSIBILITY_EXAMPLES,
  FAILED_POSSIBILITY_EXAMPLES,
  INNOVATION_FILTER_CRITERIA,
  INNOVATION_FILTER_GATE_THRESHOLD,
  PLAYER_POSSIBILITY_EXAMPLES,
  POSSIBILITY_CATEGORIES,
  POSSIBILITY_DEVELOPER_TOOLS,
  POSSIBILITY_NETWORK_LINKS,
  SAFE_EXPERIMENTATION_VENUES,
  SCIENTIFIC_POSSIBILITY_EXAMPLES,
  SIMULATION_SANDBOX_DOMAINS,
} from "../src/game/atlasPossibilitySpace/atlasPossibilitySpaceData";
import { InnovationFilterScoreCard, SandboxScenarioRegistry } from "../src/game/atlasPossibilitySpace/AtlasPossibilitySpaceRuntime";
import { detectOverlap } from "../src/game/atlasPrimeDirective/AtlasPrimeDirectiveRuntime";
import { DISCOVERY_CATEGORIES } from "../src/game/atlasPossibility/atlasPossibilityData";
import { InnovationMemoryArchive, PossibilityRegistry } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { FUTURE_STATE_KINDS, mostLikelyFutureState } from "../src/game/atlasFuture/atlasFutureData";
import { HypothesisTracker } from "../src/game/atlasImagination/AtlasImaginationRuntime";

describe("The Atlas Possibility Space (AF-173)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(POSSIBILITY_CATEGORIES.length).toBe(12);
    expect(SIMULATION_SANDBOX_DOMAINS.length).toBe(8);
    expect(COMMANDER_THINKING_EXAMPLES.length).toBe(7);
    expect(SCIENTIFIC_POSSIBILITY_EXAMPLES.length).toBe(6);
    expect(ENGINEERING_POSSIBILITY_EXAMPLES.length).toBe(6);
    expect(CIVILISATION_POSSIBILITY_EXAMPLES.length).toBe(6);
    expect(PLAYER_POSSIBILITY_EXAMPLES.length).toBe(6);
    expect(SAFE_EXPERIMENTATION_VENUES.length).toBe(6);
    expect(FAILED_POSSIBILITY_EXAMPLES.length).toBe(5);
    expect(POSSIBILITY_NETWORK_LINKS.length).toBe(7);
    expect(INNOVATION_FILTER_CRITERIA.length).toBe(6);
    expect(POSSIBILITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("POSSIBILITY_CATEGORIES ties the 8/12 absolute overlap record, sharing 8 of 12 exact-string members with the real DISCOVERY_CATEGORIES, verified via AF-170's real detectOverlap", () => {
    const report = detectOverlap(POSSIBILITY_CATEGORIES, DISCOVERY_CATEGORIES);
    expect(report.shared.length).toBe(8);
  });

  it("Possibility Network reuses AF-159's real PossibilityRegistry/Possibility directly, since its fields already match required discoveries/people/resources, risks, benefits, historical context and future opportunities field-for-field", () => {
    const registry = new PossibilityRegistry();
    registry.register({
      id: "possibility-living-city",
      discoveryCategory: "Engineering",
      requiredKnowledge: ["Adaptive materials science"],
      requiredPeople: ["scientist-vale"],
      requiredLocations: ["settlement-verdance"],
      potentialRisks: ["Structural instability during early growth"],
      potentialRewards: ["A self-restoring settlement"],
      historicalSignificance: 0.6,
      futureImplications: ["Planetary engineering becomes routine"],
    });
    expect(registry.get("possibility-living-city")?.requiredPeople).toEqual(["scientist-vale"]);
    expect(registry.all().length).toBe(1);
  });

  it("Multiple Futures reuses AF-158's real FUTURE_STATE_KINDS/FutureStateForecast/mostLikelyFutureState directly, since five parallel never-committed branch confidences is the identical mechanic regardless of wording", () => {
    expect(FUTURE_STATE_KINDS.length).toBe(5);
    const forecast = {
      entityId: "possibility-living-city",
      confidences: {
        "Most Likely Future": 0.5,
        "Optimistic Future": 0.3,
        "Conservative Future": 0.15,
        "High-Risk Future": 0.04,
        "Unknown Future": 0.01,
      },
    };
    expect(mostLikelyFutureState(forecast)).toBe("Most Likely Future");
  });

  it("Scientific Possibility's evidence gate reuses AF-172's real HypothesisTracker directly", () => {
    const tracker = new HypothesisTracker();
    tracker.propose("possibility-alt-ecosystem", "An alternative ecosystem may thrive in low gravity.", 5);
    expect(tracker.isGrounded("possibility-alt-ecosystem")).toBe(false);
    tracker.supportWithEvidence("possibility-alt-ecosystem", 20);
    expect(tracker.isGrounded("possibility-alt-ecosystem")).toBe(true);
  });

  it("Failed Possibilities reuses AF-159's real InnovationMemoryArchive directly", () => {
    const archive = new InnovationMemoryArchive();
    archive.archive("possibility-failed-reactor", ["Academic disciplines", "Museum exhibits"], 20);
    expect(archive.outcomesFor("possibility-failed-reactor")).toEqual(["Academic disciplines", "Museum exhibits"]);
  });

  it("SandboxScenarioRegistry keeps a scenario proposal-only until explicitly committed, guaranteeing no real-world consequences until decisions are made", () => {
    const sandbox = new SandboxScenarioRegistry();
    sandbox.propose("scenario-living-ring", "Future technologies", "A ring habitat that grows with its population.", 5);
    expect(sandbox.isCommitted("scenario-living-ring")).toBe(false);
    sandbox.commit("scenario-living-ring", 20);
    expect(sandbox.isCommitted("scenario-living-ring")).toBe(true);
    expect(sandbox.isCommitted("scenario-unknown")).toBe(false);
  });

  it("InnovationFilterScoreCard mirrors AF-143/149/170's real scoring-rubric shape, requiring every criterion before passing the shared 9.5 gate", () => {
    const card = new InnovationFilterScoreCard();
    expect(card.isComplete()).toBe(false);
    expect(card.passesGate()).toBe(false);
    for (const criterion of INNOVATION_FILTER_CRITERIA) card.score(criterion, 9.6);
    expect(card.isComplete()).toBe(true);
    expect(card.overallScore()).toBeCloseTo(9.6, 5);
    expect(card.overallScore()).toBeGreaterThanOrEqual(INNOVATION_FILTER_GATE_THRESHOLD);
    expect(card.passesGate()).toBe(true);
  });
});
