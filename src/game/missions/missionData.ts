/**
 * Mission data shapes (AF-037). Objective progress reuses the exact
 * counterKey/target pattern AF-026's ChallengeDef and AF-035's mastery
 * challenges already use (run-scoped here, not persisted — the same
 * distinction AF-035 drew for boss mastery-challenge tracking). Mission
 * Modifiers feed AF-017's reserved ThreatInputs.mutatorModifier and
 * AF-023's reserved DropContext.mutatorBonus directly. Dynamic Events
 * schedule the same concrete event-type strings AF-017/AF-036 already
 * fire through the shared EnvironmentalEventTriggered bus fact — a third
 * vocabulary layer over two existing systems, not a fourth event engine.
 */
import type { MasteryReward } from "../meta/metaData";
import type { XpTier } from "../progression/xpTuning";

export const MISSION_CATEGORIES = [
  "storyMission",
  "exploration",
  "recovery",
  "research",
  "ancientVault",
  "escort",
  "defense",
  "survival",
  "assassination",
  "rescue",
  "investigation",
  "prototypeRetrieval",
  "galaxyRestoration",
  "voidIncursion",
  "machineAssault",
] as const;
export type MissionCategory = (typeof MISSION_CATEGORIES)[number];

export const OBJECTIVE_TYPES = [
  "destroy",
  "survive",
  "escort",
  "collect",
  "investigate",
  "repair",
  "protect",
  "capture",
  "activate",
  "explore",
  "scan",
  "rescue",
  "escape",
  "hybrid",
] as const;
export type ObjectiveType = (typeof OBJECTIVE_TYPES)[number];

export const OPTIONAL_OBJECTIVE_KINDS = [
  "noDamage",
  "timeTrial",
  "eliteHunt",
  "hiddenVault",
  "researchRecovery",
  "ancientBeacon",
  "civilianRescue",
  "environmentalChallenge",
] as const;
export type OptionalObjectiveKind = (typeof OPTIONAL_OBJECTIVE_KINDS)[number];

export const MISSION_MODIFIER_KINDS = [
  "lowGravity",
  "radiation",
  "eliteActivity",
  "doubleRewards",
  "shieldInstability",
  "weaponOvercharge",
  "crystalBloom",
  "darkSector",
  "voidCorruption",
  "experimentalConditions",
] as const;
export type MissionModifierKind = (typeof MISSION_MODIFIER_KINDS)[number];

export const MISSION_EVENT_KINDS = [
  "distressCalls",
  "solarStorm",
  "meteorShower",
  "ancientSignal",
  "factionAmbush",
  "lostExplorer",
  "machineAwakening",
  "voidRift",
  "prototypeDiscovery",
  "travellingMerchant",
] as const;
export type MissionEventKind = (typeof MISSION_EVENT_KINDS)[number];

/**
 * Each Mission Event schedules the concrete event-type string AF-017's
 * EnvironmentalEventType or AF-036's BiomeEventKind already fires through
 * EnvironmentalEventTriggered — the payload is a plain string, so no
 * schema change was needed to add a third naming layer over the same fact.
 */
export const MISSION_EVENT_TO_ENVIRONMENTAL_EVENT: Readonly<Record<MissionEventKind, string>> = {
  distressCalls: "distressSignal",
  solarStorm: "SolarFlare",
  meteorShower: "MeteorShower",
  ancientSignal: "AncientSignal",
  factionAmbush: "factionConflict",
  lostExplorer: "lostExpedition",
  machineAwakening: "machineActivation",
  voidRift: "VoidDistortion",
  prototypeDiscovery: "prototypeWreckage",
  travellingMerchant: "wanderingMerchant",
};

export interface ObjectiveDef {
  id: string;
  type: ObjectiveType;
  description: string;
  counterKey: string;
  target: number;
  optional: boolean;
  reward: MasteryReward | null;
}

export interface MissionModifierDef {
  kind: MissionModifierKind;
  description: string;
  /** Added to AF-017's ThreatInputs.mutatorModifier baseline of 1. */
  mutatorModifierDelta: number;
  /** Added to AF-023's DropContext.mutatorBonus baseline of 0. */
  lootMutatorBonusDelta: number;
  /** Added to AF-017's DirectorTuning.eliteSquadSize for this run only. */
  eliteSquadSizeDelta: number;
  /** Added to the reward multiplier baseline of 1. */
  rewardMultiplierDelta: number;
}

export interface MissionEventDef {
  kind: MissionEventKind;
  weight: number;
}

export interface MissionDef {
  id: string;
  name: string;
  category: MissionCategory;
  briefing: string;
  biomeId: string;
  bossId: string | null;
  primaryObjectives: readonly ObjectiveDef[];
  optionalObjectives: readonly ObjectiveDef[];
  modifierPool: readonly MissionModifierDef[];
  /** How many modifiers a generated instance rolls (0..modifierPool.length). */
  modifierSlots: number;
  eventPool: readonly MissionEventDef[];
  difficulty: number;
  xpTier: XpTier;
}

/** Sandbox mission template — proves the objective/modifier/event/reward engine. */
export const SANDBOX_MISSIONS: readonly MissionDef[] = [
  {
    id: "crystal-fields-incursion",
    name: "Crystal Fields Incursion",
    category: "voidIncursion",
    briefing: "A Void signature has been tracked into the Crystal Fields. Clear the sector, recover what you can, and be ready for whatever is guarding it.",
    biomeId: "crystal-fields-alpha",
    bossId: "hollow-sentinel",
    primaryObjectives: [
      { id: "clear-drones", type: "destroy", description: "Destroy 15 hostiles", counterKey: "missionKills", target: 15, optional: false, reward: null },
      { id: "defeat-sentinel", type: "destroy", description: "Defeat the Hollow Sentinel", counterKey: "missionBossDefeated", target: 1, optional: false, reward: null },
    ],
    optionalObjectives: [
      {
        id: "no-damage-run",
        type: "survive",
        description: "Complete the expedition without taking damage",
        counterKey: "missionDamageTaken",
        target: 0,
        optional: true,
        reward: { kind: "title", id: "TITLE_UNTOUCHED" },
      },
      {
        id: "elite-hunt",
        type: "destroy",
        description: "Destroy 2 Elites",
        counterKey: "missionElitesKilled",
        target: 2,
        optional: true,
        reward: { kind: "portraitFrame", id: "FRAME_ELITE_HUNTER" },
      },
    ],
    modifierPool: [
      { kind: "eliteActivity", description: "Elite squads run larger.", mutatorModifierDelta: 0.15, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 1, rewardMultiplierDelta: 0.1 },
      { kind: "doubleRewards", description: "Loot ladder shifted upward.", mutatorModifierDelta: 0, lootMutatorBonusDelta: 0.3, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.5 },
      { kind: "voidCorruption", description: "Threat runs hotter throughout.", mutatorModifierDelta: 0.25, lootMutatorBonusDelta: 0, eliteSquadSizeDelta: 0, rewardMultiplierDelta: 0.15 },
    ],
    modifierSlots: 1,
    eventPool: [
      { kind: "distressCalls", weight: 3 },
      { kind: "voidRift", weight: 3 },
      { kind: "travellingMerchant", weight: 2 },
      { kind: "prototypeDiscovery", weight: 1 },
    ],
    difficulty: 1,
    xpTier: "large",
  },
];
