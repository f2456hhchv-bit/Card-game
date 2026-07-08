/**
 * Campaign data shapes (AF-068). The campaign is not a new engine — it is a
 * ledger over engines the game already owns: objectives reuse AF-026/035/037's
 * exact counterKey/target pattern; story is DELIVERED (consume-pattern beats,
 * the AF-055 echo / AF-057 ceremony seam) never blocking — gameplay never
 * pauses for it; milestone unlocks reference real registered content (biomes
 * through AF-058's registry, bosses through AF-035's defs, regions through
 * AF-038's shelf); and the post-campaign layer gives AF-038's LONG_TERM_GOAL
 * shelf — registered since AF-038 with no producer until now — its first
 * consumer. Choices are append-only by construction: the runtime exposes no
 * removal operation, so "never permanently remove core content" is a property
 * of the type, not a policy.
 */
import type { LongTermGoalKind } from "../galaxy/galaxyData";

/** The campaign ladder (AF-068 §Campaign Structure) — ten stages, strictly ordered; every stage naturally unlocks the next. */
export const CAMPAIGN_STAGES = [
  "prologue",
  "frontierRestoration",
  "factionDiscovery",
  "ancientAwakening",
  "galaxyExpansion",
  "majorCrisis",
  "civilisationRecovery",
  "endgameCampaign",
  "finalRevelation",
  "postCampaignGalaxy",
] as const;
export type CampaignStage = (typeof CAMPAIGN_STAGES)[number];

/** Chapter content kinds (AF-068 §Chapter Structure) — eight registered; bind as chapter content classes. */
export const CHAPTER_CONTENT_KINDS = [
  "primaryObjectives",
  "sideMissions",
  "factionMissions",
  "explorationGoals",
  "bossEncounters",
  "researchMilestones",
  "storyDiscoveries",
  "galaxyChanges",
] as const;
export type ChapterContentKind = (typeof CHAPTER_CONTENT_KINDS)[number];

/** World progression kinds (AF-068 §World Progression) — eight registered; what the campaign permanently changes. */
export const WORLD_PROGRESSION_KINDS = [
  "galaxyMap",
  "factionRelationships",
  "missionAvailability",
  "research",
  "technology",
  "tradeRoutes",
  "civilianPopulation",
  "ancientSystems",
] as const;
export type WorldProgressionKind = (typeof WORLD_PROGRESSION_KINDS)[number];

/** Choice domains (AF-068 §Player Choice) — eight registered; choices influence, never remove. */
export const CHOICE_DOMAINS = [
  "factionSupport",
  "scientificPriorities",
  "resourceAllocation",
  "civilianRescue",
  "ancientTechnology",
  "prototypeResearch",
  "exploration",
  "diplomaticIntervention",
] as const;
export type ChoiceDomain = (typeof CHOICE_DOMAINS)[number];

/** Story delivery channels (AF-068 §Story Delivery) — eight registered; players discover the story naturally. */
export const STORY_DELIVERY_CHANNELS = [
  "missionBriefings",
  "commanderDialogue",
  "codexEntries",
  "environmentalStorytelling",
  "recoveredLogs",
  "factionReports",
  "galaxyBroadcasts",
  "ancientArchives",
] as const;
export type StoryDeliveryChannel = (typeof STORY_DELIVERY_CHANNELS)[number];

/** Major campaign events (AF-068 §Major Campaign Events) — eight registered; permanently alter progression. */
export const MAJOR_EVENT_KINDS = [
  "newFactionContact",
  "ancientDiscovery",
  "galaxyEmergency",
  "sectorCollapse",
  "scientificBreakthrough",
  "civilianEvacuation",
  "fleetMobilisation",
  "realityInstability",
] as const;
export type MajorEventKind = (typeof MAJOR_EVENT_KINDS)[number];

/** Milestone unlock kinds (AF-068 §Campaign Milestones) — eight registered; progression always feels rewarding. */
export const MILESTONE_UNLOCK_KINDS = [
  "newBiomes",
  "newShips",
  "newWeapons",
  "newCommanders",
  "researchBranches",
  "galaxyRegions",
  "bosses",
  "difficultyLevels",
] as const;
export type MilestoneUnlockKind = (typeof MILESTONE_UNLOCK_KINDS)[number];

/** Post-campaign kinds (AF-068 §Post-Campaign) — seven registered; the galaxy remains alive forever. */
export const POST_CAMPAIGN_KINDS = [
  "galaxyRestoration",
  "hiddenCampaigns",
  "legendaryMissions",
  "worldEvents",
  "newDiscoveries",
  "ascensionProgression",
  "infiniteExploration",
] as const;
export type PostCampaignKind = (typeof POST_CAMPAIGN_KINDS)[number];

/** Every post-campaign pillar maps TOTALLY onto AF-038's LongTermGoalKind
 * shelf — dormant since AF-038, given its first producer here. */
export const POST_CAMPAIGN_TO_LONG_TERM_GOAL: Readonly<Record<PostCampaignKind, LongTermGoalKind>> = {
  galaxyRestoration: "fullRestoration",
  hiddenCampaigns: "hiddenDiscoveries",
  legendaryMissions: "legendaryCollections",
  worldEvents: "galaxyStability",
  newDiscoveries: "completeExploration",
  ascensionProgression: "ancientRecovery",
  infiniteExploration: "completeExploration",
};

/** AF-026/035/037's exact counterKey/target objective pattern — no new progress engine. */
export interface CampaignObjectiveDef {
  id: string;
  description: string;
  counterKey: string;
  target: number;
}

export interface CampaignStoryBeatDef {
  channel: StoryDeliveryChannel;
  text: string;
}

export interface CampaignWorldChangeDef {
  kind: WorldProgressionKind;
  description: string;
}

export interface CampaignUnlockDef {
  kind: MilestoneUnlockKind;
  id: string;
}

export interface CampaignChapterDef {
  id: string;
  stage: CampaignStage;
  name: string;
  objectives: readonly CampaignObjectiveDef[];
  storyBeats: readonly CampaignStoryBeatDef[];
  /** Grant-only — the runtime has no operation that clears a flag. */
  storyFlags: readonly string[];
  worldChanges: readonly CampaignWorldChangeDef[];
  unlocks: readonly CampaignUnlockDef[];
  majorEvent: MajorEventKind | null;
}

/** Counter keys the composition root feeds — the campaign's whole input surface. */
export const CAMPAIGN_COUNTER_MISSIONS = "campaign:missionsCompleted";
export const CAMPAIGN_COUNTER_SYSTEMS = "campaign:systemsVisited";
export const CAMPAIGN_COUNTER_BOSSES = "campaign:bossesDefeated";

/** The sandbox campaign — ten chapters, one per stage, every objective bound
 * to real play the composition root already produces (missions, travel,
 * boss victories). The final stage is the open door: no objectives, forever. */
export const SANDBOX_CAMPAIGN: readonly CampaignChapterDef[] = [
  {
    id: "ch-prologue",
    stage: "prologue",
    name: "Afterlight",
    objectives: [{ id: "obj-first-expedition", description: "Complete your first expedition", counterKey: CAMPAIGN_COUNTER_MISSIONS, target: 1 }],
    storyBeats: [
      { channel: "missionBriefings", text: "The Network is dark, Commander. Every light we relight is one the Collapse doesn't keep." },
      { channel: "commanderDialogue", text: "One expedition. That's how every restoration starts — with somebody going first." },
    ],
    storyFlags: ["FLAG_PROLOGUE_COMPLETE"],
    worldChanges: [{ kind: "missionAvailability", description: "Expedition command comes online." }],
    unlocks: [{ kind: "difficultyLevels", id: "standard" }],
    majorEvent: null,
  },
  {
    id: "ch-frontier-restoration",
    stage: "frontierRestoration",
    name: "The Frontier Answers",
    objectives: [{ id: "obj-reach-frontier", description: "Travel to two star systems", counterKey: CAMPAIGN_COUNTER_SYSTEMS, target: 2 }],
    storyBeats: [
      { channel: "galaxyBroadcasts", text: "Meridian Rest shipyard, broadcasting in the clear: we're still here. We never stopped being here." },
    ],
    storyFlags: ["FLAG_FRONTIER_CONTACT"],
    worldChanges: [
      { kind: "galaxyMap", description: "The Human Frontier route opens." },
      { kind: "civilianPopulation", description: "Frontier colonies begin rebuilding in public." },
    ],
    unlocks: [{ kind: "galaxyRegions", id: "humanFrontier" }],
    majorEvent: "newFactionContact",
  },
  {
    id: "ch-faction-discovery",
    stage: "factionDiscovery",
    name: "Who Else Survived",
    objectives: [{ id: "obj-three-expeditions", description: "Complete three expeditions", counterKey: CAMPAIGN_COUNTER_MISSIONS, target: 3 }],
    storyBeats: [
      { channel: "factionReports", text: "The Dominion grows its fleets. The Collective manufactures its own demand. Neither asked how we survived. Both are watching." },
    ],
    storyFlags: ["FLAG_FACTIONS_CHARTED"],
    worldChanges: [{ kind: "factionRelationships", description: "First formal contact protocols established." }],
    unlocks: [{ kind: "newCommanders", id: "longlight" }],
    majorEvent: null,
  },
  {
    id: "ch-ancient-awakening",
    stage: "ancientAwakening",
    name: "The Vigil Notices",
    objectives: [{ id: "obj-first-guardian", description: "Defeat a boss guardian", counterKey: CAMPAIGN_COUNTER_BOSSES, target: 1 }],
    storyBeats: [
      { channel: "ancientArchives", text: "The Sentinel did not fall. It stood down — and somewhere deeper in the dark, something updated a ledger." },
    ],
    storyFlags: ["FLAG_ANCIENTS_AWAKE"],
    worldChanges: [{ kind: "ancientSystems", description: "Custodian sites begin responding to your transponder." }],
    unlocks: [{ kind: "bosses", id: "hollow-sentinel" }],
    majorEvent: "ancientDiscovery",
  },
  {
    id: "ch-galaxy-expansion",
    stage: "galaxyExpansion",
    name: "The Map Grows Back",
    objectives: [{ id: "obj-six-systems", description: "Travel to six star systems", counterKey: CAMPAIGN_COUNTER_SYSTEMS, target: 6 }],
    storyBeats: [
      { channel: "recoveredLogs", text: "Route ledger, restored: six systems relit. The dark between them is still dark. But now it has edges." },
    ],
    storyFlags: ["FLAG_GALAXY_EXPANDING"],
    worldChanges: [
      { kind: "tradeRoutes", description: "Nomad convoys begin running the relit routes." },
      { kind: "technology", description: "Salvaged nav-arrays extend expedition range." },
    ],
    unlocks: [{ kind: "galaxyRegions", id: "machineExpanse" }],
    majorEvent: "fleetMobilisation",
  },
  {
    id: "ch-major-crisis",
    stage: "majorCrisis",
    name: "The Breach Widens",
    objectives: [{ id: "obj-six-expeditions", description: "Complete six expeditions", counterKey: CAMPAIGN_COUNTER_MISSIONS, target: 6 }],
    storyBeats: [
      { channel: "galaxyBroadcasts", text: "Emergency channel, all points: the Void is not receding. Whatever we relit, something noticed the light." },
    ],
    storyFlags: ["FLAG_CRISIS_DECLARED"],
    worldChanges: [{ kind: "missionAvailability", description: "Crisis-response operations authorised galaxy-wide." }],
    unlocks: [{ kind: "difficultyLevels", id: "veteran" }],
    majorEvent: "galaxyEmergency",
  },
  {
    id: "ch-civilisation-recovery",
    stage: "civilisationRecovery",
    name: "What We Kept",
    objectives: [{ id: "obj-eight-expeditions", description: "Complete eight expeditions", counterKey: CAMPAIGN_COUNTER_MISSIONS, target: 8 }],
    storyBeats: [
      { channel: "commanderDialogue", text: "Stations rebuilding. Trade lanes humming. People arguing about tariffs again. Commander, I think that's what winning sounds like." },
    ],
    storyFlags: ["FLAG_RECOVERY_UNDERWAY"],
    worldChanges: [
      { kind: "civilianPopulation", description: "Population returns to three restored sectors." },
      { kind: "research", description: "Civilian science academies reopen." },
    ],
    unlocks: [{ kind: "researchBranches", id: "galaxyNavigation" }],
    majorEvent: "scientificBreakthrough",
  },
  {
    id: "ch-endgame-campaign",
    stage: "endgameCampaign",
    name: "Past the Last Light",
    objectives: [{ id: "obj-deep-systems", description: "Travel to ten star systems", counterKey: CAMPAIGN_COUNTER_SYSTEMS, target: 10 }],
    storyBeats: [
      { channel: "ancientArchives", text: "First Light's council chamber holds one empty seat facing the Zone. It was not abandoned. It was vacated, deliberately, by someone who intended to return." },
    ],
    storyFlags: ["FLAG_ENDGAME_OPEN"],
    worldChanges: [{ kind: "galaxyMap", description: "The route past First Light resolves." }],
    unlocks: [{ kind: "newBiomes", id: "singularity-zone" }],
    majorEvent: "realityInstability",
  },
  {
    id: "ch-final-revelation",
    stage: "finalRevelation",
    name: "We Go to Ask It in Person",
    objectives: [{ id: "obj-three-guardians", description: "Defeat three boss guardians", counterKey: CAMPAIGN_COUNTER_BOSSES, target: 3 }],
    storyBeats: [
      { channel: "ancientArchives", text: "The Network was never a weapon and never a wall. It is a question, asked at galactic scale — and the Zone is where its builders went to hear the answer." },
      { channel: "commanderDialogue", text: "Then we keep the lights on until they come back. Or until we go and ask it ourselves." },
    ],
    storyFlags: ["FLAG_NETWORK_PURPOSE_KNOWN"],
    worldChanges: [{ kind: "ancientSystems", description: "The Afterlight Network accepts your authority." }],
    unlocks: [{ kind: "newShips", id: "wayfarer-mk2" }],
    majorEvent: "ancientDiscovery",
  },
  {
    // The open door: no objectives — the campaign completes INTO this stage
    // and the galaxy remains alive forever (§Post-Campaign).
    id: "ch-post-campaign",
    stage: "postCampaignGalaxy",
    name: "The Living Galaxy",
    objectives: [],
    storyBeats: [
      { channel: "galaxyBroadcasts", text: "All stations, all factions, all frequencies: the Network is lit. What happens next is up to everyone." },
    ],
    storyFlags: ["FLAG_CAMPAIGN_COMPLETE"],
    worldChanges: [{ kind: "galaxyMap", description: "The whole map stays open, and keeps changing." }],
    unlocks: [],
    majorEvent: null,
  },
];
