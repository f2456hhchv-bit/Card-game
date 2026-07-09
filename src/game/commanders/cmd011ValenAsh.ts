/**
 * Commander CMD-011 — Valen Ash "The Tempest" (AF-109). The canonical,
 * individually-specified implementation of Afterlight's eleventh fully
 * production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A twelfth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-006/001/010 per his spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_CHRONOMANCER, FULL_RECRUITMENT_WITH_CHRONOMANCER, FULL_ROSTER_WITH_CHRONOMANCER, VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const ASH_TEMPEST_ID = "ash-tempest";

export const ASH_TEMPEST_COMMANDER: CommanderDef = {
  id: ASH_TEMPEST_ID,
  name: "Valen Ash",
  callsign: "Tempest",
  archetype: "orbitalCommander",
  faction: "Afterlight Initiative",
  biography: "An atmospheric physicist, weather systems commander, and disaster response specialist who became the first commander to safely stabilise an artificial planetary weather network after the Collapse — he believes nature is never the enemy, only a failure to understand it.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "damage", value: 0.05 } },
  active: { id: "lightning-spear", name: "Lightning Spear", cooldownMs: 12000 },
  ultimate: { id: "planetfall-storm", name: "Planetfall Storm", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "storm-intensity-doctrine",
    description: "Abilities raise Storm Intensity — larger storms, longer chains, improved weather control, and unique environmental interactions, though storms naturally fade without maintenance.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "cooldownReduction", value: 0.04 } },
  },
};

function branchNodes(commanderId: string, branchId: string, name: string, bonuses: readonly [import("../equipment/equipmentData").BonusKind, number][]): import("./commanderFrameworkData").TalentBranchDef {
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

export const ASH_TEMPEST_PROFILE: CommanderProfileDef = {
  commanderId: ASH_TEMPEST_ID,
  class: "assault",
  visualDesign: "White storm armour with electric blue energy veins, a flowing weather cloak, a lightning reactor backpack, floating atmospheric sensors, crackling gauntlets, and a blue-white visor — static electricity constantly dances across the armour.",
  voice: "Clear, confident, inspiring, energetic, calm during crisis.",
  secondaryAbility: { id: "cyclone-field", name: "Cyclone Field", cooldownMs: 13000 },
  masteryPassive: { trigger: "onKill", bonus: { kind: "statusChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "ash-tempest:stormcaller:endgameNode",
    description: "Ascension III: the Stormcaller branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(ASH_TEMPEST_ID, "lightning", "Lightning", [
      ["criticalChance", 0.05], ["criticalDamage", 0.08], ["resourceGain", 0.05],
      ["damage", 0.06], ["statusChance", 0.05], ["criticalDamage", 0.16],
    ]),
    branchNodes(ASH_TEMPEST_ID, "atmosphere", "Atmosphere", [
      ["movementSpeed", 0.04], ["movementSpeed", 0.05], ["cooldownReduction", 0.04],
      ["boostEfficiency", 0.05], ["statusDuration", 0.05], ["movementSpeed", 0.12],
    ]),
    branchNodes(ASH_TEMPEST_ID, "stormcaller", "Stormcaller", [
      ["cooldownReduction", 0.05], ["damage", 0.05], ["shieldCapacity", 4],
      ["experienceGain", 0.05], ["resourceGain", 0.05], ["damage", 0.15],
    ]),
  ],
  masteryTrackId: "commander:ash-tempest",
  personalMissions: [
    { beat: "originStory", name: "Stormspire Colony", description: "Where he learned that nature always answers, and that every storm begins with a single spark." },
    { beat: "recruitment", name: "Eye of the Storm", description: "An artificial planetary superstorm to stabilise, civilian evacuation fleets to protect, atmospheric control towers to repair, total ecological collapse to prevent. He joins after the player chooses planetary preservation over rapid extraction." },
    { beat: "personalObjectives", name: "No Abandoned Worlds", description: "Planetary exploitation and environmental negligence draw the same immediate response." },
    { beat: "companionMissions", name: "Storm Cover", description: "He reads a battlefield's weather the way other commanders read a battlefield's terrain, and shares that reading freely." },
    { beat: "legendaryMission", name: "The First Thunder", description: "An ancient planetary climate engine restarted, continent-wide electrical storms survived, natural weather systems restored, the Legendary Tempest Core unlocked." },
    { beat: "finalResolution", name: "The Stormcaller", description: "A title for someone who never once let a storm be the excuse to give up on a world." },
  ],
  loreId: "LORE_COMMANDER_TEMPEST",
  relationships: [
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Close friend of Aria Sol — resonance and static both answer to the same patient listening." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Lyra Voss — her curiosity about the unknown never once outpaces her caution, and neither does his." },
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Works with Aurelion Vex — a storm and a clock keep different kinds of time, and both of them insist on respecting it." },
  ],
  statisticKeys: ["commander:ash-tempest:usage", "commander:ash-tempest:victories", "commander:ash-tempest:stormsSummoned"],
  cosmetics: [
    { kind: "armourVariants", id: "tempest-storm-armour" },
    { kind: "animations", id: "tempest-lightning-trails" },
    { kind: "colourThemes", id: "tempest-storm-palette" },
  ],
  voiceLineIds: ["vo-tempest-mission-start", "vo-tempest-lightning-strike", "vo-tempest-boss-encounter", "vo-tempest-ultimate", "vo-tempest-victory"],
  futureExpansionHooks: ["legendary-variant-tempest-the-stormcaller"],
};

export const ASH_TEMPEST_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: ASH_TEMPEST_ID,
  age: 37,
  species: "Human",
  homeworld: "Stormspire Colony",
  psychologicalProfile: "Confident, charismatic, fearless, protective, energetic, and optimistic — he believes nature is never the enemy, only a failure to understand it.",
  leadershipStyle: "Leads by inspiration — calm during crisis, always certain the storm can be understood rather than merely survived.",
  animationStyle: "Fast and fluid; wind constantly affects his clothing, electric arcs trail his movement, powerful stance throughout.",
  musicMotif: "Powerful strings and thunder percussion over deep electronic bass and atmospheric ambience, representing nature's power.",
  personality: "optimistic",
  preferredShips: ["sable-dart-mk1", "bastion-hull-mk1", "dawnspire", "maelstrom-x1"],
  preferredWeapons: ["coil-ripper-mk2", "paragon-flux-driver", "atlas-cluster-battery", "helios-prism-array"],
  preferredEquipment: ["horizon-flux-capacitor", "vanguard-core", "aegis-bastion-array", "aegis-ward-projector"],
  preferredRelics: ["static-node", "conduit-loop", "ember-core", "singularity-keepsake"],
  preferredResearch: ["harmonic-overload", "field-dynamics", "survey-protocols", "deep-scanning"],
  preferredBiomes: ["living-ecospheres", "solar-wastes", "meridian-rest-frontier"],
  endingStory: "The Tempest Core keeps every frontier world's climate on a steady, breathing rhythm long after the last superstorm is stabilised, and every reclaimed sky remembers the day someone chose to fix it instead of walking away. He still calls every disaster site by the name it had before the disaster — never the name the damage gave it.",
  dialogueLibrary: [
    { category: "missionStart", line: "Every storm begins with a single spark." },
    { category: "combat", line: "Nature always answers." },
    { category: "bosses", line: "You can't outrun the sky." },
    { category: "legendaryMoments", line: "Let the heavens decide." },
    { category: "victory", line: "The storm has passed." },
  ],
  masteryChallenges: ["Maintain maximum Storm Intensity for an entire expedition without letting it fade.", "Chain a single Lightning Spear through 10 conductive targets.", "Complete 25 expeditions on Storm World biomes without a civilian casualty."],
};

export const ASH_TEMPEST_RECRUITMENT: RecruitmentDef = {
  commanderId: ASH_TEMPEST_ID,
  source: "factionReputation",
  requirement: "Complete \"Eye of the Storm\": stabilise an artificial planetary superstorm, protect civilian evacuation fleets, repair atmospheric control towers, and prevent total ecological collapse — choosing planetary preservation over rapid extraction.",
};

export const ASH_TEMPEST_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-ash-tempest",
  category: "commanders",
  title: "Valen Ash — The Tempest",
  lore: {
    summary: "Valen Ash became the first commander to safely stabilise an artificial planetary weather network after the Collapse.",
    detailed: "His atmospheric engineering saved numerous frontier worlds from ecological collapse, proving that humanity could restore planets rather than simply abandon them. Close friends with Aria Sol, professionally respectful of Dr. Lyra Voss, and working closely with Aurelion Vex, he distrusts planetary exploitation and environmental negligence in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:ash-tempest:stormsSummoned",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [SOL_RESONANT_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, VEX_CHRONOMANCER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: ASH_TEMPEST_ID },
};

export const ASH_TEMPEST_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(ASH_TEMPEST_RECRUITMENT.source);

export const FULL_ROSTER_WITH_TEMPEST: readonly CommanderDef[] = [...FULL_ROSTER_WITH_CHRONOMANCER, ASH_TEMPEST_COMMANDER];
export const FULL_PROFILES_WITH_TEMPEST: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_CHRONOMANCER, ASH_TEMPEST_PROFILE];
export const FULL_RECRUITMENT_WITH_TEMPEST: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_CHRONOMANCER, ASH_TEMPEST_RECRUITMENT];

export function tempestOverlapReport(): readonly string[] {
  const overlap = findOverlap(ASH_TEMPEST_COMMANDER, FULL_ROSTER_WITH_CHRONOMANCER);
  return overlap ? [`${ASH_TEMPEST_ID} overlaps ${overlap}`] : [];
}

export function tempestArchitectureComplete(): boolean {
  const architecture = architectureFor(ASH_TEMPEST_COMMANDER, ASH_TEMPEST_PROFILE);
  return Object.values(architecture).every(Boolean);
}
