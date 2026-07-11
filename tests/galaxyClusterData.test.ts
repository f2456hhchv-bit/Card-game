import { describe, expect, it } from "vitest";
import { GALAXY_CLUSTERS, isClusterUnlocked } from "../src/game/galaxy/galaxyClusterData";
import { SANDBOX_CAMPAIGN, CAMPAIGN_COUNTER_MISSIONS, CAMPAIGN_COUNTER_SYSTEMS, CAMPAIGN_COUNTER_BOSSES } from "../src/game/campaign/campaignData";
import { CampaignRuntime } from "../src/game/campaign/CampaignRuntime";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { ROSTER_RESEARCH_TREE } from "../src/game/research/researchRosterData";
import { SANDBOX_SHIP_MODULES } from "../src/game/ships/shipFrameworkData";
import { FULL_ROSTER_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import { BOSS_ARTIFACTS } from "../src/game/bosses/bossArtifacts";
import { MUSIC_STATES } from "../src/game/audio/audioData";

describe("GP-003 §Galaxy Progression — GalaxyClusterDef (a real tier above star systems)", () => {
  it("registers at least two distinct clusters, each with a real, distinct GalaxyDef", () => {
    expect(GALAXY_CLUSTERS.length).toBeGreaterThanOrEqual(2);
    const galaxyRefs = new Set(GALAXY_CLUSTERS.map((c) => c.galaxy));
    expect(galaxyRefs.size).toBe(GALAXY_CLUSTERS.length); // no two clusters share one GalaxyDef instance
  });

  it("every cluster's named content composes with already-registered ids — no duplicated systems", () => {
    const bossIds = new Set(SANDBOX_BOSSES.map((b) => b.id));
    const researchIds = new Set(ROSTER_RESEARCH_TREE.map((n) => n.id));
    const moduleIds = new Set(SANDBOX_SHIP_MODULES.map((m) => m.id));
    const commanderIds = new Set(FULL_ROSTER_WITH_FOUNDER.map((c) => c.id));
    const artifactIds: Set<string> = new Set(BOSS_ARTIFACTS.map((a) => a.id));
    for (const cluster of GALAXY_CLUSTERS) {
      for (const bossId of cluster.bossPoolIds) expect(bossIds.has(bossId)).toBe(true);
      expect(researchIds.has(cluster.uniqueTechnologyId)).toBe(true);
      expect(moduleIds.has(cluster.uniqueShipPartId)).toBe(true);
      expect(commanderIds.has(cluster.uniqueCommanderUnlockId)).toBe(true);
      expect(artifactIds.has(cluster.uniqueArtifactId)).toBe(true);
      expect(MUSIC_STATES).toContain(cluster.musicStateId);
    }
  });

  it("the first cluster is always unlocked; the second gates on a real CampaignRuntime unlock", () => {
    const [first, second] = GALAXY_CLUSTERS;
    expect(isClusterUnlocked(first!, [])).toBe(true);
    expect(isClusterUnlocked(second!, [])).toBe(false);
    expect(isClusterUnlocked(second!, [second!.requiredUnlock!])).toBe(true);
  });

  it("the second cluster's gate is actually granted by playing the real campaign to the majorCrisis chapter", () => {
    const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
    const second = GALAXY_CLUSTERS[1]!;
    expect(isClusterUnlocked(second, campaign.unlocks)).toBe(false);
    campaign.recordProgress(CAMPAIGN_COUNTER_MISSIONS, 8);
    campaign.recordProgress(CAMPAIGN_COUNTER_SYSTEMS, 10);
    campaign.recordProgress(CAMPAIGN_COUNTER_BOSSES, 3); // reaches majorCrisis's own objective threshold
    expect(isClusterUnlocked(second, campaign.unlocks)).toBe(true);
  });

  it("every cluster's systems reference real regions declared on that same GalaxyDef", () => {
    for (const cluster of GALAXY_CLUSTERS) {
      const regionIds = new Set(cluster.galaxy.regions.map((r) => r.id));
      for (const system of cluster.galaxy.systems) expect(regionIds.has(system.region)).toBe(true);
    }
  });
});
