import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  CAMPAIGN_COUNTER_BOSSES,
  CAMPAIGN_COUNTER_MISSIONS,
  CAMPAIGN_COUNTER_SYSTEMS,
  CAMPAIGN_STAGES,
  CHAPTER_CONTENT_KINDS,
  CHOICE_DOMAINS,
  MAJOR_EVENT_KINDS,
  MILESTONE_UNLOCK_KINDS,
  POST_CAMPAIGN_KINDS,
  POST_CAMPAIGN_TO_LONG_TERM_GOAL,
  SANDBOX_CAMPAIGN,
  STORY_DELIVERY_CHANNELS,
  WORLD_PROGRESSION_KINDS,
} from "../src/game/campaign/campaignData";
import { CampaignRuntime } from "../src/game/campaign/CampaignRuntime";
import { LONG_TERM_GOAL_KINDS, GALAXY_REGIONS } from "../src/game/galaxy/galaxyData";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { SANDBOX_BIOMES } from "../src/game/biomes/biomeData";
import { SINGULARITY_ZONE_BIOME } from "../src/game/biomes/singularityZoneBiome";

const FEED_KEYS = [CAMPAIGN_COUNTER_MISSIONS, CAMPAIGN_COUNTER_SYSTEMS, CAMPAIGN_COUNTER_BOSSES] as const;

function completedRuntime(): CampaignRuntime {
  const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
  campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS, 8);
  campaign.recordProgress(CAMPAIGN_COUNTER_SYSTEMS, 10);
  campaign.recordProgress(CAMPAIGN_COUNTER_BOSSES, 3);
  return campaign;
}

describe("Campaign vocabulary — registered shelves (AF-068)", () => {
  it("registers ten stages, eight chapter-content kinds, eight world-progression kinds, eight choice domains, eight delivery channels, eight major events, eight milestone kinds, seven post-campaign kinds", () => {
    expect(CAMPAIGN_STAGES.length).toBe(10);
    expect(CHAPTER_CONTENT_KINDS.length).toBe(8);
    expect(WORLD_PROGRESSION_KINDS.length).toBe(8);
    expect(CHOICE_DOMAINS.length).toBe(8);
    expect(STORY_DELIVERY_CHANNELS.length).toBe(8);
    expect(MAJOR_EVENT_KINDS.length).toBe(8);
    expect(MILESTONE_UNLOCK_KINDS.length).toBe(8);
    expect(POST_CAMPAIGN_KINDS.length).toBe(7);
  });

  it("every post-campaign pillar maps totally onto AF-038's LongTermGoalKind shelf — its first producer", () => {
    for (const kind of POST_CAMPAIGN_KINDS) {
      expect(LONG_TERM_GOAL_KINDS).toContain(POST_CAMPAIGN_TO_LONG_TERM_GOAL[kind]);
    }
  });
});

describe("The sandbox campaign is real content on locked engines (AF-068 §Chapter Structure)", () => {
  it("ships ten chapters, exactly one per stage, in strict ladder order", () => {
    expect(SANDBOX_CAMPAIGN.length).toBe(CAMPAIGN_STAGES.length);
    SANDBOX_CAMPAIGN.forEach((chapter, i) => expect(chapter.stage).toBe(CAMPAIGN_STAGES[i]));
  });

  it("every objective uses the AF-026/035/037 counterKey pattern on the composition root's real feed keys", () => {
    for (const chapter of SANDBOX_CAMPAIGN) {
      for (const objective of chapter.objectives) {
        expect(FEED_KEYS).toContain(objective.counterKey);
        expect(objective.target).toBeGreaterThan(0);
      }
    }
  });

  it("milestone unlocks reference REAL registered content — biomes, bosses, galaxy regions", () => {
    const biomeIds = new Set([...SANDBOX_BIOMES, SINGULARITY_ZONE_BIOME].map((b) => b.id));
    for (const chapter of SANDBOX_CAMPAIGN) {
      for (const unlock of chapter.unlocks) {
        expect(MILESTONE_UNLOCK_KINDS).toContain(unlock.kind);
        if (unlock.kind === "newBiomes") expect(biomeIds.has(unlock.id)).toBe(true);
        if (unlock.kind === "bosses") expect(SANDBOX_BOSSES.some((b) => b.id === unlock.id)).toBe(true);
        if (unlock.kind === "galaxyRegions") expect(GALAXY_REGIONS).toContain(unlock.id);
      }
    }
    for (const chapter of SANDBOX_CAMPAIGN) {
      for (const beat of chapter.storyBeats) expect(STORY_DELIVERY_CHANNELS).toContain(beat.channel);
      for (const change of chapter.worldChanges) expect(WORLD_PROGRESSION_KINDS).toContain(change.kind);
    }
  });

  it("the final chapter is the open door — postCampaignGalaxy with zero objectives", () => {
    const last = SANDBOX_CAMPAIGN[SANDBOX_CAMPAIGN.length - 1]!;
    expect(last.stage).toBe("postCampaignGalaxy");
    expect(last.objectives.length).toBe(0);
  });
});

describe("CampaignRuntime — every stage naturally unlocks the next (AF-068 §Campaign Structure)", () => {
  it("advances through the full ladder in order, never skipping a stage's payload", () => {
    const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
    expect(campaign.stage).toBe("prologue");
    campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS); // prologue: 1 mission
    expect(campaign.stage).toBe("frontierRestoration");
    campaign.recordProgress(CAMPAIGN_COUNTER_SYSTEMS, 2); // frontier: 2 systems
    expect(campaign.stage).toBe("factionDiscovery");
    campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS, 2); // 3 total missions
    expect(campaign.stage).toBe("ancientAwakening");
    campaign.recordProgress(CAMPAIGN_COUNTER_BOSSES); // first guardian
    expect(campaign.stage).toBe("galaxyExpansion");
    expect(campaign.hasStoryFlag("FLAG_ANCIENTS_AWAKE")).toBe(true);
    expect(campaign.isComplete).toBe(false);
  });

  it("counters persist across chapters — early progress counts toward later thresholds, chaining completions", () => {
    const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
    // Massive up-front progress satisfies chapters strictly in order — the
    // ladder halts at the boss-gated Ancient Awakening no matter how much
    // later-counter surplus is banked…
    campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS, 8);
    campaign.recordProgress(CAMPAIGN_COUNTER_SYSTEMS, 10);
    expect(campaign.stage).toBe("ancientAwakening");
    // …then a single feed chains straight through every banked chapter.
    campaign.recordProgress(CAMPAIGN_COUNTER_BOSSES, 3);
    expect(campaign.stage).toBe("postCampaignGalaxy");
    expect(campaign.isComplete).toBe(true);
  });

  it("chapter completion grants beats, flags, unlocks, world changes, and fires each major event exactly once", () => {
    const campaign = completedRuntime();
    const snap = campaign.snapshot;
    expect(snap.storyFlagCount).toBe(10); // one flag per chapter
    expect(snap.unlockCount).toBe(SANDBOX_CAMPAIGN.reduce((n, c) => n + c.unlocks.length, 0));
    expect(snap.worldChangeCount).toBe(SANDBOX_CAMPAIGN.reduce((n, c) => n + c.worldChanges.length, 0));
    expect(campaign.majorEventsFired.length).toBe(SANDBOX_CAMPAIGN.filter((c) => c.majorEvent !== null).length);
    expect(snap.pendingBeats).toBe(SANDBOX_CAMPAIGN.reduce((n, c) => n + c.storyBeats.length, 0));
  });
});

describe("CampaignRuntime — choices influence, never remove (AF-068 §Player Choice)", () => {
  it("choices and flags are append-only; recording choices never shrinks unlocks, flags, or world changes", () => {
    const campaign = completedRuntime();
    const before = campaign.snapshot;
    for (const domain of CHOICE_DOMAINS) campaign.recordChoice(domain, `option-${domain}`);
    const after = campaign.snapshot;
    expect(after.choiceCount).toBe(CHOICE_DOMAINS.length);
    expect(after.unlockCount).toBeGreaterThanOrEqual(before.unlockCount);
    expect(after.storyFlagCount).toBeGreaterThanOrEqual(before.storyFlagCount);
    expect(after.worldChangeCount).toBeGreaterThanOrEqual(before.worldChangeCount);
    // Structural guarantee: the class exposes no removal operation at all.
    const api = Object.getOwnPropertyNames(CampaignRuntime.prototype);
    for (const name of api) expect(/remove|delete|clear|revoke|reset/i.test(name)).toBe(false);
  });
});

describe("CampaignRuntime — story never pauses gameplay (AF-068 §Story Delivery)", () => {
  it("beats queue on completion and drain FIFO through the consume seam, then return null", () => {
    const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
    expect(campaign.consumeStoryBeat()).toBeNull();
    campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS);
    const first = campaign.consumeStoryBeat();
    const second = campaign.consumeStoryBeat();
    expect(first?.channel).toBe("missionBriefings");
    expect(second?.channel).toBe("commanderDialogue");
    expect(campaign.consumeStoryBeat()).toBeNull();
  });
});

describe("CampaignRuntime — post-campaign is a state, not an ending (AF-068 §Post-Campaign)", () => {
  it("after completion the runtime keeps accepting progress forever and exposes AF-038's long-term goals", () => {
    const campaign = completedRuntime();
    expect(campaign.isComplete).toBe(true);
    for (const goal of campaign.postCampaignGoals) expect(LONG_TERM_GOAL_KINDS).toContain(goal);
    expect(campaign.postCampaignGoals.length).toBeGreaterThan(0);
    // The galaxy remains alive forever: more play never throws, never regresses.
    for (let i = 0; i < 1000; i += 1) campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS);
    expect(campaign.stage).toBe("postCampaignGalaxy");
    expect(campaign.isComplete).toBe(true);
  });
});

describe("CampaignRuntime — determinism (AF-068 §Core Philosophy)", () => {
  it("the same play sequence always produces the same campaign — personal, not random", () => {
    const a = new CampaignRuntime(SANDBOX_CAMPAIGN);
    const b = new CampaignRuntime(SANDBOX_CAMPAIGN);
    const rng = new Rng(68);
    for (let i = 0; i < 200; i += 1) {
      const key = FEED_KEYS[Math.floor(rng.next() * FEED_KEYS.length)]!;
      a.recordProgress(key);
      b.recordProgress(key);
    }
    expect(JSON.stringify(a.snapshot)).toBe(JSON.stringify(b.snapshot));
  });
});

describe("Campaign — self-review: thousands of playthroughs (AF-068 §Self Review Loop)", () => {
  it("1,000 seeded playthroughs in arbitrary orders all reach the post-campaign galaxy with monotone flags", () => {
    for (let run = 0; run < 1000; run += 1) {
      const rng = new Rng(run);
      const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
      let lastStageIndex = 0;
      let lastFlags = 0;
      while (!campaign.isComplete) {
        const key = FEED_KEYS[Math.floor(rng.next() * FEED_KEYS.length)]!;
        campaign.recordProgress(key, 1 + Math.floor(rng.next() * 2));
        const stageIndex = CAMPAIGN_STAGES.indexOf(campaign.stage);
        if (stageIndex < lastStageIndex) throw new Error("stage regressed");
        lastStageIndex = stageIndex;
        const flags = campaign.snapshot.storyFlagCount;
        if (flags < lastFlags) throw new Error("flags regressed");
        lastFlags = flags;
      }
      expect(campaign.stage).toBe("postCampaignGalaxy");
      expect(campaign.snapshot.storyFlagCount).toBe(10);
    }
  });
});
