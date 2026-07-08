import { describe, expect, it } from "vitest";
import {
  COMMUNITY_OBJECTIVE_KINDS,
  CORE_GAME_PACK,
  EXPANSION_CONTENT_KINDS,
  FORBIDDEN_LIVE_PRACTICES,
  GALAXY_EVOLUTION_SOURCES,
  LIVE_CONTENT_TIERS,
  LIVE_EVENT_KINDS,
  MONETISATION_KINDS,
  QA_GATES,
  SEASONAL_CONTENT_KINDS,
  SEASONAL_REWARD_KINDS,
  SEASON_ONE,
  SEASON_ONE_PACK,
  type ContentPackDef,
} from "../src/game/liveops/liveOpsData";
import { LiveOpsRegistry } from "../src/game/liveops/LiveOpsRegistry";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { SANDBOX_CAMPAIGN } from "../src/game/campaign/campaignData";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { DERELICT_EXPANSE_BIOME } from "../src/game/biomes/derelictExpanseBiome";
import { LIVING_ECOSPHERES_BIOME } from "../src/game/biomes/livingEcospheresBiome";
import { SINGULARITY_ZONE_BIOME } from "../src/game/biomes/singularityZoneBiome";

const ALL_QA_PASS = { performance: true, balance: true, saveCompatibility: true, accessibility: true, loreConsistency: true, existingProgression: true } as const;
const AUTHORED_BIOME_IDS = new Set(
  [
    HUMAN_FRONTIER_BIOME,
    CRYSTAL_EXPANSE_BIOME,
    MACHINE_EXPANSE_BIOME,
    VOID_EXPANSE_BIOME,
    ANCIENT_CORE_BIOME,
    SOLAR_WASTES_BIOME,
    FROZEN_REACH_BIOME,
    DERELICT_EXPANSE_BIOME,
    LIVING_ECOSPHERES_BIOME,
    SINGULARITY_ZONE_BIOME,
  ].map((b) => b.id),
);

function bootedRegistry(): LiveOpsRegistry {
  const registry = new LiveOpsRegistry();
  expect(registry.registerPack(CORE_GAME_PACK).ok).toBe(true);
  expect(registry.registerPack(SEASON_ONE_PACK).ok).toBe(true);
  return registry;
}

describe("Live-ops vocabulary — registered shelves (AF-070)", () => {
  it("registers ten tiers, eight seasonal kinds, eight expansion kinds, seven evolution sources, eight live events, six community objectives, eight reward kinds, five forbidden practices, five monetisation kinds, six QA gates", () => {
    expect(LIVE_CONTENT_TIERS.length).toBe(10);
    expect(SEASONAL_CONTENT_KINDS.length).toBe(8);
    expect(EXPANSION_CONTENT_KINDS.length).toBe(8);
    expect(GALAXY_EVOLUTION_SOURCES.length).toBe(7);
    expect(LIVE_EVENT_KINDS.length).toBe(8);
    expect(COMMUNITY_OBJECTIVE_KINDS.length).toBe(6);
    expect(SEASONAL_REWARD_KINDS.length).toBe(8);
    expect(FORBIDDEN_LIVE_PRACTICES.length).toBe(5);
    expect(MONETISATION_KINDS.length).toBe(5);
    expect(QA_GATES.length).toBe(6);
  });

  it("gameplay power remains horizontal: every seasonal reward kind is cosmetic or lore, and additions carry no stat field", () => {
    const cosmeticOrLore = ["commanderSkins", "shipPaints", "portraitFrames", "titles", "engineTrails", "musicPacks", "codexEntries", "lore"];
    for (const kind of SEASONAL_REWARD_KINDS) expect(cosmeticOrLore).toContain(kind);
    for (const addition of [...CORE_GAME_PACK.additions, ...SEASON_ONE_PACK.additions]) {
      // A content addition is a kind, an id, and (for challenges) a temporary flag — nothing numeric to inflate.
      for (const key of Object.keys(addition)) expect(["kind", "id", "temporary"]).toContain(key);
    }
  });
});

describe("The core game is pack zero — the no-replacement gate protects REAL shipped ids (AF-070 §Content Philosophy)", () => {
  it("core pack ids resolve against the actual game: all ten biomes, the boss, the campaign chapters", () => {
    const biomeAdditions = CORE_GAME_PACK.additions.filter((a) => a.kind === "newBiomes");
    expect(biomeAdditions.length).toBe(10);
    for (const addition of biomeAdditions) expect(AUTHORED_BIOME_IDS.has(addition.id)).toBe(true);
    for (const addition of CORE_GAME_PACK.additions.filter((a) => a.kind === "newBosses")) {
      expect(SANDBOX_BOSSES.some((b) => b.id === addition.id)).toBe(true);
    }
    for (const addition of CORE_GAME_PACK.additions.filter((a) => a.kind === "newCampaignChapters")) {
      expect(SANDBOX_CAMPAIGN.some((c) => c.id === addition.id)).toBe(true);
    }
  });

  it("a pack that tries to re-ship an existing id is REJECTED — never invalidate previous content", () => {
    const registry = bootedRegistry();
    const before = registry.snapshot;
    const replacement: ContentPackDef = {
      id: "sneaky-remaster",
      tier: "majorExpansions",
      name: "Singularity Zone Remastered",
      additions: [{ kind: "newBiomes", id: "singularity-zone" }],
      qa: ALL_QA_PASS,
    };
    const result = registry.registerPack(replacement);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.some((r) => r.includes("never invalidate previous content"))).toBe(true);
    expect(registry.snapshot).toEqual(before); // a rejected pack mutates nothing
  });
});

describe("Regression testing is mandatory (AF-070 §Quality Assurance)", () => {
  it("a pack failing ANY of the six QA gates is rejected without mutating state", () => {
    const registry = bootedRegistry();
    const before = registry.snapshot;
    for (const gate of QA_GATES) {
      const pack: ContentPackDef = {
        id: `pack-missing-${gate}`,
        tier: "seasonUpdates",
        name: `Pack missing ${gate}`,
        additions: [{ kind: "newCosmetics", id: `cosmetic-${gate}` }],
        qa: { ...ALL_QA_PASS, [gate]: false },
      };
      const result = registry.registerPack(pack);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reasons.some((r) => r.includes(gate))).toBe(true);
    }
    expect(registry.snapshot).toEqual(before);
  });

  it("temporary gameplay content is FOMO and is rejected — only temporary CHALLENGES may expire", () => {
    const registry = bootedRegistry();
    const fomo: ContentPackDef = {
      id: "fomo-pack",
      tier: "seasonUpdates",
      name: "Limited-Time Biome",
      additions: [{ kind: "newBiomes", id: "limited-biome", temporary: true }],
      qa: ALL_QA_PASS,
    };
    const result = registry.registerPack(fomo);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.some((r) => r.includes("FOMO"))).toBe(true);
  });
});

describe("Seasons — core progression never resets (AF-070 §Seasonal Model)", () => {
  it("ending a season retires ONLY temporary challenges; permanent discoveries, cosmetics and lore remain live", () => {
    const registry = bootedRegistry();
    expect(registry.beginSeason(SEASON_ONE)).toBe(true);
    expect(registry.snapshot.activeSeason).toContain("Embers");
    const retired = registry.endSeason();
    expect(retired).toEqual(["challenge-s1-ember-run"]);
    expect(registry.isContentLive("challenge-s1-ember-run")).toBe(false); // the temporary challenge expires…
    expect(registry.isContentRegistered("challenge-s1-ember-run")).toBe(true); // …but history keeps it (Season Archive)
    expect(registry.isContentLive("discovery-s1-ember-cache")).toBe(true); // permanent discoveries persist
    expect(registry.isContentLive("skin-longlight-ember")).toBe(true); // cosmetics persist
    expect(registry.isContentLive("singularity-zone")).toBe(true); // and the core game is untouched
    const api = Object.getOwnPropertyNames(LiveOpsRegistry.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|wipe/i.test(name)).toBe(false); // no reset exists
  });
});

describe("Compatibility and the returning player (AF-070 §Roadmap Support, §Accessibility)", () => {
  it("every older save version stays compatible, and the recap lists exactly what shipped since", () => {
    const registry = bootedRegistry();
    expect(registry.compatibilityFor(0).compatible).toBe(true);
    expect(registry.compatibilityFor(0).packsSince).toBe(2);
    expect(registry.compatibilityFor(1).packsSince).toBe(1);
    const recap = registry.returningPlayerRecap(1);
    expect(recap.length).toBe(1);
    expect(recap[0]!.packId).toBe("season-1-embers");
    expect(registry.contentTimeline.length).toBe(2); // the append-only Content Timeline
  });
});

describe("Live ops — self-review: ten years of live development (AF-070 §Self Review Loop)", () => {
  it("simulates a decade — 40 seasons and 10 expansions — with monotone content, permanent compatibility, and zero architectural change", () => {
    const registry = bootedRegistry();
    const year1Version = registry.snapshot.liveVersion;
    let lastContentCount = registry.snapshot.contentCount;
    let packSerial = 0;
    for (let year = 1; year <= 10; year += 1) {
      for (let quarter = 1; quarter <= 4; quarter += 1) {
        packSerial += 1;
        const seasonPack: ContentPackDef = {
          id: `y${year}q${quarter}-season`,
          tier: "seasonUpdates",
          name: `Year ${year} Season ${quarter}`,
          additions: [
            { kind: "newCosmetics", id: `cosmetic-${packSerial}` },
            { kind: "newLore", id: `lore-${packSerial}` },
            { kind: "temporaryChallenges", id: `challenge-${packSerial}`, temporary: true },
            { kind: "permanentDiscoveries", id: `discovery-${packSerial}` },
          ],
          qa: ALL_QA_PASS,
        };
        expect(registry.registerPack(seasonPack).ok).toBe(true);
        expect(registry.beginSeason({ number: packSerial, name: seasonPack.name, packIds: [seasonPack.id] })).toBe(true);
        expect(registry.endSeason()).toContain(`challenge-${packSerial}`); // each season retires exactly its own challenge
      }
      const expansion: ContentPackDef = {
        id: `y${year}-expansion`,
        tier: "majorExpansions",
        name: `Year ${year} Expansion`,
        additions: [
          { kind: "newBiomes", id: `biome-y${year}` },
          { kind: "newBosses", id: `boss-y${year}` },
          { kind: "newCampaignChapters", id: `chapter-y${year}` },
        ],
        qa: ALL_QA_PASS,
      };
      expect(registry.registerPack(expansion).ok).toBe(true);
      const snap = registry.snapshot;
      expect(snap.contentCount).toBeGreaterThan(lastContentCount); // the galaxy only grows
      lastContentCount = snap.contentCount;
      expect(registry.compatibilityFor(year1Version).compatible).toBe(true); // a year-one save loads in year ten
    }
    const finalSnap = registry.snapshot;
    expect(finalSnap.packCount).toBe(2 + 40 + 10);
    expect(finalSnap.retiredTemporaryCount).toBe(40); // every seasonal challenge retired, nothing else ever removed
    expect(registry.isContentLive("singularity-zone")).toBe(true); // the core game, intact after a decade
    expect(registry.returningPlayerRecap(year1Version).length).toBe(50); // the decade, recapped
  });
});
