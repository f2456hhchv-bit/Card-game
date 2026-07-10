import { describe, expect, it } from "vitest";
import {
  ACCESSIBILITY_GATE_CHECKS,
  ART_PIPELINE_STAGES,
  ATLAS_STANDARDS_CATEGORIES,
  AUDIO_PIPELINE_STAGES,
  AUTOMATED_QA_CHECKS,
  COMMANDER_VALIDATION_CHECKLIST,
  CONTENT_VALIDATION_CHECKS,
  DESIGN_SCORE_CATEGORIES,
  DESIGN_SCORE_GATE_THRESHOLD,
  DEVELOPER_TOOLSET_SURFACES,
  DOCUMENTATION_OUTPUTS,
  KNOWLEDGE_BASE_CATEGORIES,
  NARRATIVE_PIPELINE_ELEMENTS,
  PERFORMANCE_TARGET_KINDS,
  POST_LAUNCH_TRACKING_CATEGORIES,
  WORLD_VALIDATION_CHECKLIST,
  accessibilityGatePassed,
} from "../src/game/atlasFramework/atlasFrameworkData";
import {
  DesignScoreCard,
  KnowledgeBaseRegistry,
  PostLaunchSupportTracker,
  commanderCompletenessFor,
  worldCompletenessFor,
} from "../src/game/atlasFramework/AtlasFrameworkRuntime";

describe("The Atlas Development Framework (AF-143)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ATLAS_STANDARDS_CATEGORIES.length).toBe(10);
    expect(CONTENT_VALIDATION_CHECKS.length).toBe(10);
    expect(COMMANDER_VALIDATION_CHECKLIST.length).toBe(9);
    expect(WORLD_VALIDATION_CHECKLIST.length).toBe(10);
    expect(ART_PIPELINE_STAGES.length).toBe(9);
    expect(AUDIO_PIPELINE_STAGES.length).toBe(8);
    expect(NARRATIVE_PIPELINE_ELEMENTS.length).toBe(8);
    expect(PERFORMANCE_TARGET_KINDS.length).toBe(8);
    expect(ACCESSIBILITY_GATE_CHECKS.length).toBe(8);
    expect(DOCUMENTATION_OUTPUTS.length).toBe(8);
    expect(AUTOMATED_QA_CHECKS.length).toBe(8);
    expect(DESIGN_SCORE_CATEGORIES.length).toBe(9);
    expect(DEVELOPER_TOOLSET_SURFACES.length).toBe(9);
    expect(POST_LAUNCH_TRACKING_CATEGORIES.length).toBe(7);
    expect(KNOWLEDGE_BASE_CATEGORIES.length).toBe(6);
  });

  it("DESIGN_SCORE_GATE_THRESHOLD matches the spec's own 9.5 figure, kept distinct from FOUNDATION_LOCK's real 10-category gate", () => {
    expect(DESIGN_SCORE_GATE_THRESHOLD).toBe(9.5);
  });

  it("accessibilityGatePassed requires every one of the spec's own 8 checks, decoupled from AF-095's differently-named checklist", () => {
    const partial = new Set(ACCESSIBILITY_GATE_CHECKS.slice(0, 7));
    expect(accessibilityGatePassed(partial)).toBe(false);
    const full = new Set(ACCESSIBILITY_GATE_CHECKS);
    expect(accessibilityGatePassed(full)).toBe(true);
  });

  it("commanderCompletenessFor composes real signal values into a per-check report, never importing AF-130/131/134/135 directly", () => {
    const incomplete = commanderCompletenessFor({
      hasUniqueFantasy: true,
      gameplayDuplicatesExisting: false,
      bondLinkCount: 0,
      shipRoomAssigned: true,
      museumContributionCount: 1,
      hasChronicleBiography: true,
      personalQuestCount: 2,
      masteryTrackProgress: 5,
      accessibilityReviewed: true,
    });
    expect(incomplete.checks["Bond Network integration"]).toBe(false);
    expect(incomplete.passed).toBe(false);

    const complete = commanderCompletenessFor({
      hasUniqueFantasy: true,
      gameplayDuplicatesExisting: false,
      bondLinkCount: 3,
      shipRoomAssigned: true,
      museumContributionCount: 1,
      hasChronicleBiography: true,
      personalQuestCount: 2,
      masteryTrackProgress: 5,
      accessibilityReviewed: true,
    });
    expect(complete.passed).toBe(true);
  });

  it("worldCompletenessFor composes real signal values into a per-check report", () => {
    const incomplete = worldCompletenessFor({
      hasUniqueEcology: true,
      hasDistinctArchitecture: true,
      hasWeatherProfile: true,
      hasWildlife: true,
      hasHistory: true,
      hasEconomy: true,
      hasCulture: false,
      hasMusic: true,
      hasExplorationIdentity: true,
      museumCompatible: true,
    });
    expect(incomplete.checks.Culture).toBe(false);
    expect(incomplete.passed).toBe(false);

    const complete = worldCompletenessFor({
      hasUniqueEcology: true,
      hasDistinctArchitecture: true,
      hasWeatherProfile: true,
      hasWildlife: true,
      hasHistory: true,
      hasEconomy: true,
      hasCulture: true,
      hasMusic: true,
      hasExplorationIdentity: true,
      museumCompatible: true,
    });
    expect(complete.passed).toBe(true);
  });

  it("DesignScoreCard only passes the gate once every category is scored and the average clears the real 9.5 threshold", () => {
    const card = new DesignScoreCard();
    expect(card.passesGate()).toBe(false);
    for (const category of DESIGN_SCORE_CATEGORIES) card.score(category, 9);
    expect(card.isComplete()).toBe(true);
    expect(card.passesGate()).toBe(false);
    for (const category of DESIGN_SCORE_CATEGORIES) card.score(category, 9.8);
    expect(card.overallScore()).toBeCloseTo(9.8, 5);
    expect(card.passesGate()).toBe(true);
  });

  it("DesignScoreCard clamps scores to the 0-10 range", () => {
    const card = new DesignScoreCard();
    card.score("Originality", 15);
    card.score("Depth", -5);
    expect(card.scoreFor("Originality")).toBe(10);
    expect(card.scoreFor("Depth")).toBe(0);
  });

  it("PostLaunchSupportTracker is append-only and filterable by category — nothing is abandoned", () => {
    const tracker = new PostLaunchSupportTracker();
    tracker.record("Bug frequency", "Three reports of a rare docking-camera clip.", 4);
    tracker.record("Balance metrics", "Rail rifle usage up 12% post-patch.", 6);
    expect(tracker.all().length).toBe(2);
    expect(tracker.countFor("Bug frequency")).toBe(1);
  });

  it("KnowledgeBaseRegistry is append-only and filterable by category — future teams inherit accumulated experience", () => {
    const kb = new KnowledgeBaseRegistry();
    kb.contribute("Engineering patterns", "Decoupled composition", "Pass plain signals instead of importing modules directly.");
    kb.contribute("Optimisation guides", "Adjacency-list topological sort", "Avoid O(n^2) rescans in dependency graphs.");
    expect(kb.all().length).toBe(2);
    expect(kb.countFor("Engineering patterns")).toBe(1);
  });
});
