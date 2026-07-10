import { describe, expect, it } from "vitest";
import {
  CONTENT_ROTATION_CATEGORIES,
  DISCOVERY_KINDS,
  EMOTIONAL_TONE_RELIEF_SIGNALS,
  EMOTIONAL_TONE_STRAIN_SIGNALS,
  FAILSAFE_PRIORITY_ORDER,
  MILESTONE_KINDS,
  ORCHESTRATION_DIAGNOSTIC_TOOLS,
  ORCHESTRATOR_RESPONSIBILITIES,
  PACING_CYCLE_STAGES,
  PLAYER_JOURNEY_TIERS,
  emotionalToneNeedsRebalancing,
  nextPacingStage,
  playerJourneyTierRank,
  resolveByFailsafePriority,
} from "../src/game/atlasOrchestrator/atlasOrchestratorData";
import { ContentRotationTracker, DiscoveryCurveTracker, EngagementMap, LongTermMemoryLog, PacingCycleTracker, PlayerExperienceTracker } from "../src/game/atlasOrchestrator/AtlasOrchestratorRuntime";
import { DecisionRouter } from "../src/game/aos/AosRuntime";
import { EmergenceOpportunityLog } from "../src/game/simulationDirector/SimulationDirectorRuntime";
import { systemImpactReportFor, SYSTEM_IMPACT_CATEGORIES } from "../src/game/atlasProtocol/atlasProtocolData";

describe("The Atlas Orchestrator (AF-154)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(ORCHESTRATOR_RESPONSIBILITIES.length).toBe(17);
    expect(PACING_CYCLE_STAGES.length).toBe(8);
    expect(DISCOVERY_KINDS.length).toBe(8);
    expect(EMOTIONAL_TONE_STRAIN_SIGNALS.length).toBe(4);
    expect(EMOTIONAL_TONE_RELIEF_SIGNALS.length).toBe(6);
    expect(CONTENT_ROTATION_CATEGORIES.length).toBe(7);
    expect(MILESTONE_KINDS.length).toBe(6);
    expect(PLAYER_JOURNEY_TIERS.length).toBe(7);
    expect(FAILSAFE_PRIORITY_ORDER.length).toBe(6);
    expect(ORCHESTRATION_DIAGNOSTIC_TOOLS.length).toBe(8);
  });

  it("nextPacingStage cycles forward and wraps 'New Mystery' back to 'Combat', unlike AF-149's terminating next*Stage functions", () => {
    expect(nextPacingStage("Combat")).toBe("Discovery");
    expect(nextPacingStage("New Mystery")).toBe("Combat");
  });

  it("playerJourneyTierRank orders the fourth player-rank-title list in this codebase", () => {
    expect(playerJourneyTierRank("New Explorer")).toBe(0);
    expect(playerJourneyTierRank("Living Legend")).toBe(6);
  });

  it("emotionalToneNeedsRebalancing flags two-or-more strain signals with zero relief present", () => {
    expect(emotionalToneNeedsRebalancing(new Set(["Fatigue", "Stress"]), new Set())).toBe(true);
    expect(emotionalToneNeedsRebalancing(new Set(["Fatigue", "Stress"]), new Set(["Hope"]))).toBe(false);
    expect(emotionalToneNeedsRebalancing(new Set(["Fatigue"]), new Set())).toBe(false);
  });

  it("resolveByFailsafePriority always prioritises Player progress over lower-priority concerns", () => {
    expect(resolveByFailsafePriority(new Set(["Performance", "Player progress", "Accessibility"]))).toBe("Player progress");
    expect(resolveByFailsafePriority(new Set(["Performance"]))).toBe("Performance");
    expect(resolveByFailsafePriority(new Set())).toBeNull();
  });

  it("PacingCycleTracker flags a stall only once every beat in the window shares the same stage", () => {
    const tracker = new PacingCycleTracker();
    for (let i = 0; i < 5; i++) tracker.record("Combat", i);
    expect(tracker.isStalled(5)).toBe(true);
    tracker.record("Discovery", 5);
    expect(tracker.currentStage()).toBe("Discovery");
  });

  it("PlayerExperienceTracker stores the latest 9-factor snapshot and appends to history", () => {
    const tracker = new PlayerExperienceTracker();
    const factors = { excitement: 70, mentalWorkload: 30, explorationFatigue: 10, combatFatigue: 20, narrativeEngagement: 80, curiosity: 90, senseOfProgress: 60, emotionalInvestment: 50, wonderFrequency: 40 };
    tracker.record(factors);
    expect(tracker.latest()).toEqual(factors);
    expect(tracker.history().length).toBe(1);
  });

  it("DiscoveryCurveTracker detects a dry period once enough epochs pass since the last discovery of any kind", () => {
    const tracker = new DiscoveryCurveTracker();
    tracker.record("New species", 10);
    expect(tracker.isDryPeriod(50, 20)).toBe(true);
    expect(tracker.isDryPeriod(15, 20)).toBe(false);
  });

  it("ContentRotationTracker recommends the least-used category", () => {
    const tracker = new ContentRotationTracker();
    for (const category of CONTENT_ROTATION_CATEGORIES) tracker.recordUsage(category);
    tracker.recordUsage("Rare wildlife");
    expect(tracker.leastUsedCategory()).toBe("Forgotten planets");
  });

  it("LongTermMemoryLog tracks the most recent occurrence of each milestone kind independently", () => {
    const log = new LongTermMemoryLog();
    log.record("Major discovery", 5, "Found an ancient structure.");
    log.record("Major discovery", 12, "First contact.");
    expect(log.lastOf("Major discovery")?.epoch).toBe(12);
    expect(log.epochsSince("Major discovery", 20)).toBe(8);
    expect(log.epochsSince("Emergency", 20)).toBeNull();
  });

  it("EngagementMap recommends the system with the highest curiosity+satisfaction and lowest exposure, never forcing participation", () => {
    const map = new EngagementMap();
    map.setScores("weather", { curiosity: 20, satisfaction: 20, exposure: 80 });
    map.setScores("museum", { curiosity: 90, satisfaction: 80, exposure: 10 });
    expect(map.recommend()).toBe("museum");
  });

  it("System Negotiation reuses AF-144's real DecisionRouter directly, the same reuse AF-153 already made", () => {
    const router = new DecisionRouter();
    const resolution = router.resolve([
      { systemId: "weather", targetId: "settlement-verdance", tier: "Medium", fromPlayer: false },
      { systemId: "player-input", targetId: "settlement-verdance", tier: "Low", fromPlayer: true },
    ]);
    expect(resolution?.winner.fromPlayer).toBe(true);
  });

  it("Expansion Readiness reuses AF-149's real systemImpactReportFor/SYSTEM_IMPACT_CATEGORIES directly, no new 5-category list", () => {
    const report = systemImpactReportFor({ Gameplay: true, Narrative: true, Accessibility: true });
    expect(report.affected).toEqual(["Gameplay", "Narrative", "Accessibility"]);
    expect(SYSTEM_IMPACT_CATEGORIES.length).toBe(11);
  });

  it("Surprise Engine reuses AF-153's real EmergenceOpportunityLog directly, confirmed the same mechanic by shared example vocabulary", () => {
    const log = new EmergenceOpportunityLog();
    log.surface("Commander reunions", ["commander-fen-beastmaster", "commander-thorne-starforged"], "A shared mentor reconnects them.", 4);
    expect(log.countFor("Commander reunions")).toBe(1);
  });
});
