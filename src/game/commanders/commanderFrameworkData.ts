/**
 * Commander Framework data shapes (AF-071). EXTENDS AF-030's locked
 * commander system — `CommanderDef`, the archetype shelf, the four-hook
 * ability signature, and the fingerprint no-overlap law are untouched.
 * AF-071 wraps each commander in a PROFILE carrying everything else the
 * framework demands: class (a naming layer mapped totally onto AF-030's
 * archetypes), the three ability-structure additions (secondary ability,
 * mastery passive, ascension upgrade — the last gated by AF-069's
 * ascension level), three talent branches whose node bonuses are AF-028
 * `EquipmentBonus` vocabulary (no new bonus system), AF-026 mastery-track
 * IDs, six personal-mission beats, relationships that are DIALOGUE-ONLY
 * by shape (no bonus field exists — "not gameplay balance" is
 * unrepresentable), cosmetics with no stat field, and future expansion
 * hooks. `architectureFor` proves the 17-part architecture is complete
 * for every profiled commander — "nothing is left undefined" is a
 * function, not a hope.
 */
import type { ActiveModule, BonusKind, EquipmentBonus } from "../equipment/equipmentData";
import {
  SANDBOX_COMMANDERS,
  type CommanderArchetype,
  type CommanderDef,
  type CommanderPassive,
} from "./commanderData";

/** Commander classes (AF-071 §Commander Classes) — eight registered, mapped totally onto AF-030's locked archetypes. */
export const COMMANDER_CLASSES = [
  "assault",
  "defender",
  "engineer",
  "scientist",
  "recon",
  "support",
  "hybrid",
  "experimental",
] as const;
export type CommanderClass = (typeof COMMANDER_CLASSES)[number];

export const COMMANDER_CLASS_TO_ARCHETYPE: Readonly<Record<CommanderClass, CommanderArchetype>> = {
  assault: "assault",
  defender: "guardian",
  engineer: "engineer",
  scientist: "crystalSpecialist",
  recon: "recon",
  support: "support",
  hybrid: "droneCommander",
  experimental: "prototypePilot",
};

/** The 17-part architecture (AF-071 §Commander Architecture) — nothing is left undefined. */
export const COMMANDER_ARCHITECTURE_PARTS = [
  "identity",
  "background",
  "visualDesign",
  "voice",
  "passiveTrait",
  "primaryAbility",
  "secondaryAbility",
  "ultimateAbility",
  "commanderTrait",
  "talentTree",
  "masteryTrack",
  "personalMissions",
  "lore",
  "relationships",
  "statistics",
  "cosmetics",
  "futureExpansionHooks",
] as const;
export type CommanderArchitecturePart = (typeof COMMANDER_ARCHITECTURE_PARTS)[number];

/** The seven-stage ability structure (AF-071 §Ability Structure). AF-030's four hooks
 * cover the first five stages (its signature mechanic IS the fifth); AF-071 adds the rest. */
export const ABILITY_STRUCTURE_STAGES = [
  "passive",
  "abilityOne",
  "abilityTwo",
  "ultimate",
  "signatureMechanic",
  "masteryPassive",
  "ascensionUpgrade",
] as const;
export type AbilityStructureStage = (typeof ABILITY_STRUCTURE_STAGES)[number];

/** Talent node kinds (AF-071 §Talent Trees) — every branch carries all six. */
export const TALENT_NODE_KINDS = ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"] as const;
export type TalentNodeKind = (typeof TALENT_NODE_KINDS)[number];

export interface TalentNodeDef {
  id: string;
  kind: TalentNodeKind;
  description: string;
  /** AF-028's exact EquipmentBonus vocabulary — no new bonus system. */
  bonus: EquipmentBonus;
}

export interface TalentBranchDef {
  id: string;
  name: string;
  nodes: readonly TalentNodeDef[];
}

/** Personal mission beats (AF-071 §Personal Missions) — six, in narrative order. */
export const PERSONAL_MISSION_BEATS = [
  "originStory",
  "recruitment",
  "personalObjectives",
  "companionMissions",
  "legendaryMission",
  "finalResolution",
] as const;
export type PersonalMissionBeat = (typeof PERSONAL_MISSION_BEATS)[number];

export interface PersonalMissionDef {
  beat: PersonalMissionBeat;
  name: string;
  description: string;
}

/** Progression unlock kinds (AF-071 §Commander Progression) — seven registered. */
export const COMMANDER_PROGRESSION_KINDS = [
  "talents",
  "voiceLines",
  "lore",
  "portraits",
  "cosmetics",
  "masteryRewards",
  "legendaryVariants",
] as const;
export type CommanderProgressionKind = (typeof COMMANDER_PROGRESSION_KINDS)[number];

/** Relationship subjects (AF-071 §Commander Relationships) — six registered. */
export const RELATIONSHIP_SUBJECTS = [
  "otherCommanders",
  "majorFactions",
  "civilisations",
  "research",
  "storyEvents",
  "galaxyHistory",
] as const;
export type RelationshipSubject = (typeof RELATIONSHIP_SUBJECTS)[number];

/** Relationships influence dialogue, NOT gameplay balance — there is no bonus
 * field in this shape, so a stat-bearing relationship is unrepresentable. */
export interface CommanderRelationshipDef {
  subject: RelationshipSubject;
  targetId: string;
  dialogueHint: string;
}

/** Cosmetic kinds (AF-071 §Cosmetics) — seven registered, gameplay neutral by shape. */
export const COMMANDER_COSMETIC_KINDS = [
  "armourVariants",
  "portraits",
  "voicePacks",
  "colourThemes",
  "animations",
  "victoryPoses",
  "shipInteriors",
] as const;
export type CommanderCosmeticKind = (typeof COMMANDER_COSMETIC_KINDS)[number];

export interface CommanderCosmeticDef {
  kind: CommanderCosmeticKind;
  id: string;
}

/** The AF-069 tie-in: the seventh ability stage unlocks a designated talent
 * node for free at the required ascension level — cross-module, no new stats. */
export interface AscensionUpgradeDef {
  requiredAscensionLevel: number;
  talentNodeId: string;
  description: string;
}

/** The AF-071 profile — wraps an AF-030 CommanderDef by id; the def itself is never modified. */
export interface CommanderProfileDef {
  commanderId: string;
  class: CommanderClass;
  visualDesign: string;
  voice: string;
  secondaryAbility: ActiveModule;
  masteryPassive: CommanderPassive;
  ascensionUpgrade: AscensionUpgradeDef;
  talentBranches: readonly TalentBranchDef[];
  /** AF-026 mastery-track ID — no new mastery engine. */
  masteryTrackId: string;
  personalMissions: readonly PersonalMissionDef[];
  loreId: string;
  relationships: readonly CommanderRelationshipDef[];
  /** AF-026 recordStat keys this commander accumulates. */
  statisticKeys: readonly string[];
  cosmetics: readonly CommanderCosmeticDef[];
  voiceLineIds: readonly string[];
  futureExpansionHooks: readonly string[];
}

/** Release roster target (AF-071 §Starting Roster) — roster modules fill this;
 * the framework ships three fully profiled commanders proving the architecture. */
export const ROSTER_TARGET = { min: 12, max: 16 } as const;

/** "Nothing is left undefined" as a function: every architecture part must be present. */
export function architectureFor(def: CommanderDef, profile: CommanderProfileDef): Record<CommanderArchitecturePart, boolean> {
  return {
    identity: def.name.length > 0 && def.callsign.length > 0,
    background: def.biography.length > 0,
    visualDesign: profile.visualDesign.length > 0,
    voice: profile.voice.length > 0,
    passiveTrait: def.passive !== undefined,
    primaryAbility: def.active !== undefined,
    secondaryAbility: profile.secondaryAbility !== undefined,
    ultimateAbility: def.ultimate !== undefined,
    commanderTrait: def.signature !== undefined,
    talentTree: profile.talentBranches.length === 3,
    masteryTrack: profile.masteryTrackId.startsWith("commander:"),
    personalMissions: profile.personalMissions.length === PERSONAL_MISSION_BEATS.length,
    lore: profile.loreId.length > 0,
    relationships: profile.relationships.length > 0,
    statistics: profile.statisticKeys.length > 0,
    cosmetics: profile.cosmetics.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

/** Compact branch author — six nodes, one per kind, bonuses on AF-028's shelf. */
function branch(commanderId: string, branchId: string, name: string, bonuses: readonly [BonusKind, number][]): TalentBranchDef {
  return {
    id: `${commanderId}:${branchId}`,
    name,
    nodes: TALENT_NODE_KINDS.map((kind, i) => ({
      id: `${commanderId}:${branchId}:${kind}`,
      kind,
      description: `${name} — ${kind}`,
      bonus: { kind: bonuses[i]![0], value: bonuses[i]![1] },
    })),
  };
}

/** AF-071's roster addition — a scientist, authored through AF-030's UNCHANGED
 * CommanderDef shape (the same additive class as every faction roster). */
export const MERIDIAN_COMMANDER: CommanderDef = {
  id: "vael-meridian",
  name: "Dr. Sen Vael",
  callsign: "Meridian",
  archetype: "crystalSpecialist",
  faction: "Human Alliance",
  biography: "Wrote the paper proving the Afterlight Network was artificial. Has spent every year since trying to be wrong about the second half.",
  passive: { trigger: "onKill", bonus: { kind: "resourceGain", value: 0.08 } },
  active: { id: "resonance-survey", name: "Resonance Survey", cooldownMs: 10000 },
  ultimate: { id: "field-breakthrough", name: "Field Breakthrough", chargeRequired: 100, chargePerKill: 1, chargePerDamage: 0.02 },
  signature: {
    tag: "meridian-doctrine",
    description: "Every kill is a data point — knowledge compounds into momentum.",
    passive: { trigger: "onKill", bonus: { kind: "cooldownReduction", value: 0.03 } },
  },
};

/** The extended roster — AF-030's sandbox pair plus AF-071's addition, additively. */
export const FRAMEWORK_COMMANDERS: readonly CommanderDef[] = [...SANDBOX_COMMANDERS, MERIDIAN_COMMANDER];

export const FRAMEWORK_PROFILES: readonly CommanderProfileDef[] = [
  {
    commanderId: "reyes-longlight",
    class: "assault",
    visualDesign: "Scorched fleet-grey plate, one gold epaulette from a decommissioned uniform, targeting monocle always lit.",
    voice: "Low, dry, gunnery-deck cadence — counts everything out loud.",
    secondaryAbility: { id: "suppressing-volley", name: "Suppressing Volley", cooldownMs: 14000 },
    masteryPassive: { trigger: "onCriticalHit", bonus: { kind: "damage", value: 0.05 } },
    ascensionUpgrade: {
      requiredAscensionLevel: 1,
      talentNodeId: "reyes-longlight:doctrine:endgameNode",
      description: "Ascension I: the Longlight Doctrine's endgame node unlocks without a talent point.",
    },
    talentBranches: [
      branch("reyes-longlight", "doctrine", "Gunnery Doctrine", [
        ["damage", 0.06],
        ["statusChance", 0.04],
        ["resourceGain", 0.05],
        ["movementSpeed", 0.04],
        ["criticalChance", 0.05],
        ["criticalDamage", 0.15],
      ]),
      branch("reyes-longlight", "salvo", "Sustained Salvo", [
        ["criticalDamage", 0.08],
        ["cooldownReduction", 0.04],
        ["pickupRadius", 0.1],
        ["boostEfficiency", 0.06],
        ["damage", 0.08],
        ["cooldownReduction", 0.08],
      ]),
      branch("reyes-longlight", "vanguard", "Vanguard Instinct", [
        ["statusDuration", 0.08],
        ["shieldRegeneration", 4],
        ["experienceGain", 0.05],
        ["movementSpeed", 0.06],
        ["shieldCapacity", 12],
        ["damage", 0.12],
      ]),
    ],
    masteryTrackId: "commander:reyes-longlight",
    personalMissions: [
      { beat: "originStory", name: "The Last Gunnery Deck", description: "Where the fleet ended and the counting started." },
      { beat: "recruitment", name: "One More Volunteer", description: "She didn't join the restoration. She was already there." },
      { beat: "personalObjectives", name: "Names on the Hull", description: "Every relit system gets a name read out loud." },
      { beat: "companionMissions", name: "Covering Fire", description: "Escort duty with everyone she hasn't lost yet." },
      { beat: "legendaryMission", name: "The Longlight Shot", description: "One round, fired across a dying system, exactly on time." },
      { beat: "finalResolution", name: "Stand Down", description: "The order she has never once obeyed." },
    ],
    loreId: "LORE_COMMANDER_LONGLIGHT",
    relationships: [
      { subject: "otherCommanders", targetId: "vek-ironhull", dialogueHint: "Argues doctrine with Ironhull; trusts him at her back anyway." },
      { subject: "majorFactions", targetId: "codex-human-alliance", dialogueHint: "The Alliance is what's left of her chain of command." },
      { subject: "galaxyHistory", targetId: "codex-galaxy-history", dialogueHint: "Refers to the Collapse only as 'the miss'." },
    ],
    statisticKeys: ["commander:reyes-longlight:criticalHits", "commander:reyes-longlight:ultimates"],
    cosmetics: [
      { kind: "armourVariants", id: "longlight-fleet-grey" },
      { kind: "victoryPoses", id: "longlight-count-complete" },
    ],
    voiceLineIds: ["vo-longlight-launch", "vo-longlight-ultimate"],
    futureExpansionHooks: ["legendary-variant-longlight-prime"],
  },
  {
    commanderId: "vek-ironhull",
    class: "defender",
    visualDesign: "Salvage-plated bulk, three weld-seams across the chest — one per death — running lights set to dim amber.",
    voice: "Slow, resonant, machine-shop patience; never raises his volume, lowers everyone else's.",
    secondaryAbility: { id: "bulwark-lattice", name: "Bulwark Lattice", cooldownMs: 16000 },
    masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "shieldCapacity", value: 8 } },
    ascensionUpgrade: {
      requiredAscensionLevel: 2,
      talentNodeId: "vek-ironhull:rampart:endgameNode",
      description: "Ascension II: the Rampart endgame node unlocks without a talent point.",
    },
    talentBranches: [
      branch("vek-ironhull", "rampart", "Rampart Protocol", [
        ["damage", 0.04],
        ["statusDuration", 0.06],
        ["resourceGain", 0.05],
        ["boostEfficiency", 0.05],
        ["shieldCapacity", 15],
        ["shieldRegeneration", 6],
      ]),
      branch("vek-ironhull", "anchor", "Anchor Doctrine", [
        ["criticalChance", 0.03],
        ["cooldownReduction", 0.04],
        ["pickupRadius", 0.08],
        ["movementSpeed", 0.03],
        ["shieldRegeneration", 5],
        ["shieldCapacity", 20],
      ]),
      branch("vek-ironhull", "memory", "Three Deaths' Memory", [
        ["statusChance", 0.05],
        ["experienceGain", 0.06],
        ["resourceGain", 0.06],
        ["boostEfficiency", 0.06],
        ["damage", 0.06],
        ["cooldownReduction", 0.07],
      ]),
    ],
    masteryTrackId: "commander:vek-ironhull",
    personalMissions: [
      { beat: "originStory", name: "First Death", description: "The reactor breach he walked back out of." },
      { beat: "recruitment", name: "Spare Parts", description: "The Collective rebuilt him. The restoration recruited what they built." },
      { beat: "personalObjectives", name: "Load-Bearing", description: "Someone has to stand where the wall used to be." },
      { beat: "companionMissions", name: "Behind Me", description: "Convoy duty. Nothing gets through. Nothing has yet." },
      { beat: "legendaryMission", name: "The Fourth Death", description: "The one he intends to schedule himself." },
      { beat: "finalResolution", name: "Still Standing", description: "Three deaths in, the wall holds." },
    ],
    loreId: "LORE_COMMANDER_IRONHULL",
    relationships: [
      { subject: "otherCommanders", targetId: "reyes-longlight", dialogueHint: "Lets Longlight win the doctrine arguments; stands where she points." },
      { subject: "majorFactions", targetId: "codex-machine-collective", dialogueHint: "Owes the Collective three bodies. Keeps the ledger himself." },
      { subject: "research", targetId: "codex-machine-network", dialogueHint: "Reads network doctrine papers the way others read obituaries." },
    ],
    statisticKeys: ["commander:vek-ironhull:damageAbsorbed", "commander:vek-ironhull:barriersRaised"],
    cosmetics: [
      { kind: "armourVariants", id: "ironhull-salvage-amber" },
      { kind: "shipInteriors", id: "ironhull-machine-shop" },
    ],
    voiceLineIds: ["vo-ironhull-launch", "vo-ironhull-barrier"],
    futureExpansionHooks: ["legendary-variant-ironhull-bastion"],
  },
  {
    commanderId: "vael-meridian",
    class: "scientist",
    visualDesign: "Field-research whites gone expedition-grey, sample vials in bandolier rows, annotating everything mid-fight.",
    voice: "Quick, precise, footnoted — apologises before correcting you, corrects you anyway.",
    secondaryAbility: { id: "sample-lattice", name: "Sample Lattice", cooldownMs: 12000 },
    masteryPassive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.06 } },
    ascensionUpgrade: {
      requiredAscensionLevel: 3,
      talentNodeId: "vael-meridian:thesis:endgameNode",
      description: "Ascension III: the Thesis endgame node unlocks without a talent point.",
    },
    talentBranches: [
      branch("vael-meridian", "thesis", "Standing Thesis", [
        ["statusChance", 0.05],
        ["experienceGain", 0.08],
        ["resourceGain", 0.08],
        ["movementSpeed", 0.04],
        ["cooldownReduction", 0.06],
        ["experienceGain", 0.12],
      ]),
      branch("vael-meridian", "fieldwork", "Fieldwork", [
        ["damage", 0.04],
        ["pickupRadius", 0.12],
        ["resourceGain", 0.06],
        ["boostEfficiency", 0.06],
        ["statusDuration", 0.1],
        ["pickupRadius", 0.2],
      ]),
      branch("vael-meridian", "peer-review", "Peer Review", [
        ["criticalChance", 0.04],
        ["cooldownReduction", 0.05],
        ["experienceGain", 0.05],
        ["movementSpeed", 0.05],
        ["statusChance", 0.08],
        ["cooldownReduction", 0.09],
      ]),
    ],
    masteryTrackId: "commander:vael-meridian",
    personalMissions: [
      { beat: "originStory", name: "The Paper", description: "Proving the Network was built. Publishing anyway." },
      { beat: "recruitment", name: "Field Access", description: "The restoration needed a scientist. She needed the field." },
      { beat: "personalObjectives", name: "Sample Size", description: "One reading from every biome. No exceptions. Especially the Zone." },
      { beat: "companionMissions", name: "Peer Review", description: "Escorting the researchers brave enough to check her work." },
      { beat: "legendaryMission", name: "The Second Half", description: "The half of the paper she has spent her life hoping was wrong." },
      { beat: "finalResolution", name: "Errata", description: "She was not wrong. She publishes that too." },
    ],
    loreId: "LORE_COMMANDER_MERIDIAN",
    relationships: [
      { subject: "research", targetId: "codex-biome-singularity-zone", dialogueHint: "The Zone is the appendix her paper never dared include." },
      { subject: "civilisations", targetId: "codex-biome-ancient-core", dialogueHint: "Speaks of the precursors in the present tense. On purpose." },
      { subject: "storyEvents", targetId: "codex-galaxy-history", dialogueHint: "Treats the Collapse as data. Grieves it as data, too." },
    ],
    statisticKeys: ["commander:vael-meridian:discoveries", "commander:vael-meridian:samples"],
    cosmetics: [
      { kind: "portraits", id: "meridian-field-notes" },
      { kind: "colourThemes", id: "meridian-expedition-grey" },
    ],
    voiceLineIds: ["vo-meridian-launch", "vo-meridian-discovery"],
    futureExpansionHooks: ["legendary-variant-meridian-laureate"],
  },
];
