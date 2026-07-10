import { describe, expect, it } from "vitest";
import { GalacticHistoryLog, LegacyProgressTracker, PlayerChronicle } from "../src/game/legacy/LegacyEngineRuntime";
import { generateFinalChronicle } from "../src/game/chronicle/ChronicleRuntime";
import {
  CAMPAIGN_THEMES,
  EMERGENT_MOMENT_KINDS,
  GALACTIC_STORYLINE_ARCS,
  PERSONAL_STORYLINE_BEATS,
  PLAYER_REPUTATION_TITLES,
  POST_CAMPAIGN_DOCUMENTARY_SEGMENTS,
  QUIET_MOMENT_KINDS,
  STORY_BRANCH_AXES,
  STORY_PILLARS,
  WORLD_STORY_STATE_SIGNALS,
} from "../src/game/storyEngine/storyEngineData";
import {
  CommanderStorylineLog,
  NarrativeCallbackLog,
  StoryBranchTracker,
  StoryDirector,
  StoryPillarTracker,
  deriveCampaignTheme,
  generateEndingSummary,
  reputationTitleFor,
} from "../src/game/storyEngine/StoryEngineRuntime";

describe("The Dynamic Story Engine (AF-136)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(STORY_PILLARS.length).toBe(10);
    expect(WORLD_STORY_STATE_SIGNALS.length).toBe(8);
    expect(GALACTIC_STORYLINE_ARCS.length).toBe(8);
    expect(EMERGENT_MOMENT_KINDS.length).toBe(9);
    expect(PERSONAL_STORYLINE_BEATS.length).toBe(5);
    expect(PLAYER_REPUTATION_TITLES.length).toBe(8);
    expect(STORY_BRANCH_AXES.length).toBe(5);
    expect(QUIET_MOMENT_KINDS.length).toBe(7);
    expect(CAMPAIGN_THEMES.length).toBe(7);
    expect(POST_CAMPAIGN_DOCUMENTARY_SEGMENTS.length).toBe(7);
  });

  it("StoryPillarTracker only ever grows and reports multiple co-dominant pillars, not a single forced winner", () => {
    const tracker = new StoryPillarTracker();
    tracker.reinforce("Hope", 10);
    tracker.reinforce("Curiosity", 10);
    tracker.reinforce("Sacrifice", 3);
    expect([...tracker.dominantPillars(2)].sort()).toEqual(["Curiosity", "Hope"].sort());
    expect(tracker.valueFor("Sacrifice")).toBe(3);
  });

  it("deriveCampaignTheme emerges from the dominant pillar rather than being chosen", () => {
    const tracker = new StoryPillarTracker();
    tracker.reinforce("Exploration", 20);
    expect(deriveCampaignTheme(tracker)).toBe("Exploration");
  });

  it("reputationTitleFor derives from AF-133's real LegacyProgressTracker rather than new stat tracking", () => {
    const legacyProgress = new LegacyProgressTracker();
    legacyProgress.award("Founder", 50);
    expect(reputationTitleFor(legacyProgress)).toBe("The Founder");
  });

  it("StoryDirector tracks broad play-pattern proportions without touching AF-056's DirectorConductor", () => {
    const director = new StoryDirector();
    director.recordCombat();
    director.recordCombat();
    director.recordExploration();
    director.recordDowntime();
    const bias = director.pacingBias();
    expect(bias.combat).toBeCloseTo(0.5, 5);
    expect(bias.exploration).toBeCloseTo(0.25, 5);
    expect(bias.downtime).toBeCloseTo(0.25, 5);
  });

  it("CommanderStorylineLog reuses AF-135's real EvolvingEntry — Personal Storyline beats expand, never overwrite", () => {
    const log = new CommanderStorylineLog();
    log.write("kane-vanguard", "Origin Story", "Grew up on a dying colony ship.", 1);
    log.write("kane-vanguard", "Origin Story", "Now commands the very fleet that once abandoned him.", 40);
    const entry = log.beatFor("kane-vanguard", "Origin Story");
    expect(entry?.allVersions().length).toBe(2);
    expect(entry?.latest()?.text).toContain("commands the very fleet");
  });

  it("StoryBranchTracker keeps a running lean per axis — no binary morality", () => {
    const tracker = new StoryBranchTracker();
    tracker.lean("Curiosity vs Caution", 3);
    tracker.lean("Curiosity vs Caution", -1);
    expect(tracker.leaningFor("Curiosity vs Caution")).toBe(2);
  });

  it("NarrativeCallbackLog only surfaces entries once enough epochs have actually passed", () => {
    const log = new NarrativeCallbackLog();
    log.register("promise-1", "Promised to return to Meridian Rest.", 5);
    expect(log.eligibleCallbacks(10, 20).length).toBe(0);
    expect(log.eligibleCallbacks(30, 20).length).toBe(1);
  });

  it("generateEndingSummary composes AF-135's real generateFinalChronicle rather than a second aggregator", () => {
    const pillarTracker = new StoryPillarTracker();
    pillarTracker.reinforce("Unity", 15);
    const legacyProgress = new LegacyProgressTracker();
    legacyProgress.award("Diplomat", 40);
    const history = new GalacticHistoryLog();
    const playerChronicle = new PlayerChronicle();
    const finalChronicle = generateFinalChronicle(history, playerChronicle, legacyProgress);
    const summary = generateEndingSummary(pillarTracker, legacyProgress, finalChronicle);
    expect(summary.theme).toBe("Family");
    expect(summary.reputationTitle).toBe("The Diplomat");
    expect(summary.finalChronicle).toBe(finalChronicle);
  });
});
