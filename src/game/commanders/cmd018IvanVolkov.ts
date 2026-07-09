/**
 * Commander CMD-018 — Ivan Volkov "The Titan" (AF-116). The canonical,
 * individually-specified implementation of Afterlight's eighteenth
 * fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A nineteenth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-002/016/009 per his spec'd relationships to
 * exactly those three. Per the spec's own self-review directive
 * ("Reduce overlap with Adrian Kane and Astrid Reyes"), his
 * archetype/class (engineer/assault) and passive/signature trigger+bonus
 * pairs are deliberately distinct from both Kane's guardian/defender kit
 * and Reyes's support/hybrid kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_STARLANCER, FULL_RECRUITMENT_WITH_STARLANCER, FULL_ROSTER_WITH_STARLANCER } from "./cmd017LucienOrion";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { REYES_WARDEN_CODEX_ENTRY, REYES_WARDEN_ID } from "./cmd016AstridReyes";
import { THORNE_STARFORGED_CODEX_ENTRY, THORNE_STARFORGED_ID } from "./cmd009CassiaThorne";
import type { CodexEntryDef } from "../codex/codexData";

export const VOLKOV_TITAN_ID = "volkov-titan";

export const VOLKOV_TITAN_COMMANDER: CommanderDef = {
  id: VOLKOV_TITAN_ID,
  name: "Ivan Volkov",
  callsign: "Titan",
  archetype: "engineer",
  faction: "Afterlight Initiative",
  biography: "A heavy assault commander, siege operations director, and planetary defence specialist who commanded humanity's largest planetary defence operations during the reconstruction era — he believes true strength exists only to protect those who cannot defend themselves.",
  passive: { trigger: "onDamageTaken", bonus: { kind: "shieldCapacity", value: 5 } },
  active: { id: "titan-charge", name: "Titan Charge", cooldownMs: 13000 },
  ultimate: { id: "bulwark-protocol", name: "Bulwark Protocol", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "fortitude-doctrine",
    description: "Blocking, defending, taking controlled damage, and protecting allies all generate Fortitude — maximum Fortitude unlocks enhanced abilities, massive shield bursts, area knockbacks, and legendary resilience.",
    passive: { trigger: "onKill", bonus: { kind: "shieldRegeneration", value: 3 } },
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

export const VOLKOV_TITAN_PROFILE: CommanderProfileDef = {
  commanderId: VOLKOV_TITAN_ID,
  class: "assault",
  visualDesign: "A massive reinforced exosuit in titanium-grey armour with gold reinforced plating, gigantic shoulder reactors, heavy magnetic boots, integrated shield emitters, industrial hazard markings, and a blue reactor core — a towering silhouette wherever he stands.",
  voice: "Deep, slow, confident, calm, commanding.",
  secondaryAbility: { id: "siege-hammer", name: "Siege Hammer", cooldownMs: 14000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldCapacity", value: 5 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "volkov-titan:guardian:endgameNode",
    description: "Ascension III: the Guardian branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(VOLKOV_TITAN_ID, "juggernaut", "Juggernaut", [
      ["shieldCapacity", 5], ["shieldRegeneration", 3], ["shieldCapacity", 6],
      ["criticalChance", 0.03], ["boostEfficiency", 0.03], ["shieldCapacity", 16],
    ]),
    branchNodes(VOLKOV_TITAN_ID, "siege", "Siege", [
      ["damage", 0.06], ["criticalDamage", 0.08], ["statusChance", 0.05],
      ["damage", 0.05], ["resourceGain", 0.04], ["damage", 0.16],
    ]),
    branchNodes(VOLKOV_TITAN_ID, "guardian", "Guardian", [
      ["shieldCapacity", 4], ["experienceGain", 0.05], ["shieldRegeneration", 4],
      ["resourceGain", 0.05], ["statusDuration", 0.04], ["shieldCapacity", 12],
    ]),
  ],
  masteryTrackId: "commander:volkov-titan",
  personalMissions: [
    { beat: "originStory", name: "Forge Bastion Sigma", description: "Where he learned that true strength exists only to protect those who cannot defend themselves." },
    { beat: "recruitment", name: "The Iron Gate", description: "The final defensive line to hold while engineers repair an orbital defence cannon, overwhelming enemy assaults to survive, civilians to protect, planetary defences to restore. He joins after witnessing the player's refusal to abandon the defence despite impossible odds." },
    { beat: "personalObjectives", name: "No Ground Given", description: "Cowardice, needless destruction, and leaders who sacrifice civilians for victory all meet the same immovable refusal." },
    { beat: "companionMissions", name: "The Line Holds", description: "He plants himself between every ally and the worst of an engagement before anyone else has finished sizing it up." },
    { beat: "legendaryMission", name: "The Mountain Walks", description: "The legendary Titan Defence Platform reactivated, the assault against an ancient war machine led, the planetary shield network restored, the Legendary Titan Reactor unlocked." },
    { beat: "finalResolution", name: "The Bastion", description: "A title for someone who never once needed to be fast, only immovable." },
  ],
  loreId: "LORE_COMMANDER_TITAN",
  relationships: [
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Close friend of Adrian Kane — two commanders who hold a line differently and have never once needed to compare methods." },
    { subject: "otherCommanders", targetId: REYES_WARDEN_ID, dialogueHint: "Professional respect for Astrid Reyes — she evacuates what he holds ground for, and neither mission works without the other." },
    { subject: "otherCommanders", targetId: THORNE_STARFORGED_ID, dialogueHint: "Works with Cassia Thorne — an engineer who forges the plating and a commander who wears it into the fire, trusting the weld completely." },
  ],
  statisticKeys: ["commander:volkov-titan:usage", "commander:volkov-titan:victories", "commander:volkov-titan:groundHeld"],
  cosmetics: [
    { kind: "armourVariants", id: "titan-bastion-armour" },
    { kind: "animations", id: "titan-ground-impact" },
    { kind: "colourThemes", id: "titan-steel-palette" },
  ],
  voiceLineIds: ["vo-titan-mission-start", "vo-titan-heavy-attack", "vo-titan-boss-encounter", "vo-titan-ultimate", "vo-titan-victory", "vo-titan-low-health"],
  futureExpansionHooks: ["legendary-variant-titan-the-bastion"],
};

export const VOLKOV_TITAN_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: VOLKOV_TITAN_ID,
  age: 49,
  species: "Human",
  homeworld: "Forge Bastion Sigma",
  psychologicalProfile: "Disciplined, patient, protective, honourable, quiet, and dependable — he believes true strength exists only to protect those who cannot defend themselves.",
  leadershipStyle: "Leads by presence — he says little and moves rarely, but every ally near him fights like the ground itself is guaranteed.",
  animationStyle: "Extremely heavy, deliberate; the ground shakes with his movement, his melee impacts land with mechanical precision.",
  musicMotif: "Deep orchestral brass and heavy percussion over industrial ambience and slow heroic strings, representing unstoppable force.",
  personality: "compassionate",
  preferredShips: ["dawnspire", "bastion-hull-mk1", "hivemother-mk1", "ballista-mk3"],
  preferredWeapons: ["novasplitter", "atlas-cluster-battery", "foundry-sunlance", "paragon-flux-driver"],
  preferredEquipment: ["barrier-plate", "aegis-bastion-array", "vanguard-core", "aegis-ward-projector"],
  preferredRelics: ["warden-token", "cinder-heart", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["barrier-theory", "harmonic-overload", "rapid-refit", "field-dynamics"],
  preferredBiomes: ["machine-expanse", "derelict-expanse", "meridian-rest-frontier"],
  endingStory: "The Titan Reactor keeps every restored fortress world standing long after the last siege is broken, and every line he ever held remembers exactly where it was drawn. He still calls a defended position \"held,\" never \"won\" — a line that stands is worth more to him than a battle that ends.",
  dialogueLibrary: [
    { category: "missionStart", line: "We advance together." },
    { category: "combat", line: "Stand aside." },
    { category: "bosses", line: "Even mountains can fall." },
    { category: "legendaryMoments", line: "I am the wall." },
    { category: "victory", line: "The line held." },
    { category: "lowHealth", line: "Still standing." },
  ],
  masteryChallenges: ["Complete 25 expeditions without a single objective lost while defending.", "Reach maximum Fortitude and hold it for an entire boss encounter.", "Complete \"The Mountain Walks\" without Bulwark Protocol ever collapsing."],
};

export const VOLKOV_TITAN_RECRUITMENT: RecruitmentDef = {
  commanderId: VOLKOV_TITAN_ID,
  source: "factionReputation",
  requirement: "Complete \"The Iron Gate\": hold the final defensive line while engineers repair an orbital defence cannon, survive overwhelming enemy assaults, protect civilians, and restore planetary defences.",
};

export const VOLKOV_TITAN_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-volkov-titan",
  category: "commanders",
  title: "Ivan Volkov — The Titan",
  lore: {
    summary: "Ivan Volkov commanded humanity's largest planetary defence operations during the reconstruction era, personally leading frontline engineering battalions that restored dozens of fortress worlds.",
    detailed: "His doctrine proved that resilience, preparation and unity could overcome even technologically superior enemies. Close friends with Adrian Kane, professionally respectful of Astrid Reyes, and working with Cassia Thorne, he distrusts cowardice, needless destruction, and leaders who sacrifice civilians for victory in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:volkov-titan:groundHeld",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [KANE_VANGUARD_CODEX_ENTRY.id, REYES_WARDEN_CODEX_ENTRY.id, THORNE_STARFORGED_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: VOLKOV_TITAN_ID },
};

export const VOLKOV_TITAN_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(VOLKOV_TITAN_RECRUITMENT.source);

export const FULL_ROSTER_WITH_TITAN: readonly CommanderDef[] = [...FULL_ROSTER_WITH_STARLANCER, VOLKOV_TITAN_COMMANDER];
export const FULL_PROFILES_WITH_TITAN: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_STARLANCER, VOLKOV_TITAN_PROFILE];
export const FULL_RECRUITMENT_WITH_TITAN: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_STARLANCER, VOLKOV_TITAN_RECRUITMENT];

export function titanOverlapReport(): readonly string[] {
  const overlap = findOverlap(VOLKOV_TITAN_COMMANDER, FULL_ROSTER_WITH_STARLANCER);
  return overlap ? [`${VOLKOV_TITAN_ID} overlaps ${overlap}`] : [];
}

export function titanArchitectureComplete(): boolean {
  const architecture = architectureFor(VOLKOV_TITAN_COMMANDER, VOLKOV_TITAN_PROFILE);
  return Object.values(architecture).every(Boolean);
}
