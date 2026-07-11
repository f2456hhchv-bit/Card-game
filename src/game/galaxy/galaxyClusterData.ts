/**
 * GP-003 §Galaxy Progression / §Galaxy Unlocking: a real tier ABOVE
 * AF-038's StarSystemDef — the audit found no such tier existed at all
 * (AF-038's "regions" are flavour tags on systems within one single
 * GalaxyDef, not separate travel-gated instances). GalaxyClusterDef adds
 * that tier by composing entirely with already-registered content (a real
 * boss id, research node, ship module, commander, boss artifact, and music
 * state) rather than inventing a second copy of any of them — mirroring
 * this project's "compose, don't duplicate" rule everywhere else. Content
 * volume is deliberately small (one extra cluster, two extra systems): the
 * spec's "100 galaxies / 10,000 missions" describes scale for a shipped
 * game, not a quantity to hand-author in one pass — this proves the
 * mechanism (a second real gated cluster) rather than mass-producing filler.
 */
import type { MilestoneUnlockKind } from "../campaign/campaignData";
import type { MusicState } from "../audio/audioData";
import { SANDBOX_GALAXY, type GalaxyDef } from "./galaxyData";

export interface GalaxyClusterDef {
  id: string;
  name: string;
  theme: string;
  galaxy: GalaxyDef;
  /** Real BossDef ids (bossData.ts) — no duplicated boss content. */
  bossPoolIds: readonly string[];
  /** A real ResearchNodeDef id (researchData.ts) exclusive to this cluster's fiction. */
  uniqueTechnologyId: string;
  /** A real ShipModuleDef id (shipFrameworkData.ts). */
  uniqueShipPartId: string;
  /** A real CommanderDef id whose recruitment source gates within this cluster's fiction. */
  uniqueCommanderUnlockId: string;
  /** A real BossArtifactDef id (bossArtifacts.ts). */
  uniqueArtifactId: string;
  /** A real MUSIC_STATES entry (audioData.ts) — no new music-state vocabulary. */
  musicStateId: MusicState;
  /** Null means always reachable; otherwise gates on a real CampaignRuntime unlock. */
  requiredUnlock: { kind: MilestoneUnlockKind; id: string } | null;
}

/** Galaxy #2 — the Shattered Expanse. Two systems, reusing already-registered
 * biomes and mission templates as content (never a new biome/mission system),
 * proving the second-cluster mechanism without mass-authoring ten systems. */
const SHATTERED_EXPANSE_GALAXY: GalaxyDef = {
  regions: [
    {
      id: "shatteredExpanse",
      name: "Shattered Expanse",
      lore: "A galaxy fractured by a war nobody living remembers starting. The pieces never stopped drifting apart.",
    },
  ],
  systems: [
    {
      id: "sys-shatter-approach",
      name: "Shatter Approach",
      region: "shatteredExpanse",
      biomeId: "frozen-reach",
      missionIds: ["winterline-rescue"],
      connectedSystemIds: ["sys-shatter-core"],
      pointsOfInterest: [
        { id: "shatter-approach-relay", kind: "distressBeacons", discoveryCategory: "lore", discoveryId: "LORE_SHATTER_APPROACH_RELAY" },
      ],
      dominantFaction: "The Eclipsed",
      threatLevel: 5,
      requiresFastTravelUnlock: false,
    },
    {
      id: "sys-shatter-core",
      name: "Shatter Core",
      region: "shatteredExpanse",
      biomeId: "ancient-core",
      missionIds: ["first-light-excavation"],
      connectedSystemIds: ["sys-shatter-approach"],
      pointsOfInterest: [
        { id: "shatter-core-archive", kind: "ancientVaults", discoveryCategory: "lore", discoveryId: "LORE_SHATTER_CORE_ARCHIVE" },
      ],
      dominantFaction: "Ancient Custodians",
      threatLevel: 6,
      requiresFastTravelUnlock: false,
    },
  ],
  events: [
    { kind: "voidBreaches", weight: 3 },
    { kind: "ancientReactivations", weight: 2 },
  ],
};

export const GALAXY_CLUSTERS: readonly GalaxyClusterDef[] = [
  {
    id: "lucent-cluster",
    name: "The Lucent Cluster",
    theme: "The Dominion frontier — where the campaign begins.",
    galaxy: SANDBOX_GALAXY,
    bossPoolIds: ["hollow-sentinel"],
    uniqueTechnologyId: "warp-charting",
    uniqueShipPartId: "module-fusion-reactor",
    uniqueCommanderUnlockId: "reyes-longlight",
    uniqueArtifactId: "livingReactor",
    musicStateId: "exploration",
    requiredUnlock: null,
  },
  {
    id: "shattered-expanse-cluster",
    name: "The Shattered Expanse",
    theme: "A fractured war-galaxy revealed once the crisis widens the breach.",
    galaxy: SHATTERED_EXPANSE_GALAXY,
    bossPoolIds: ["hollow-sentinel"],
    uniqueTechnologyId: "unified-theory",
    uniqueShipPartId: "module-vector-engine",
    uniqueCommanderUnlockId: "naru-whisper",
    uniqueArtifactId: "voidEngine",
    musicStateId: "exploration",
    requiredUnlock: { kind: "galaxyRegions", id: "shatteredExpanse" },
  },
];

/** True once the cluster's real CampaignRuntime unlock has actually been granted. */
export function isClusterUnlocked(cluster: GalaxyClusterDef, grantedUnlocks: ReadonlyArray<{ kind: MilestoneUnlockKind; id: string }>): boolean {
  if (!cluster.requiredUnlock) return true;
  return grantedUnlocks.some((u) => u.kind === cluster.requiredUnlock!.kind && u.id === cluster.requiredUnlock!.id);
}
