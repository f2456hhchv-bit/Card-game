/**
 * Commander CMD-012 — Nyx Korven "The Phantom" (AF-110). The canonical,
 * individually-specified implementation of Afterlight's twelfth fully
 * production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A thirteenth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-005/001/002 per her spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_TEMPEST, FULL_RECRUITMENT_WITH_TEMPEST, FULL_ROSTER_WITH_TEMPEST } from "./cmd011ValenAsh";
import { DRAKE_HUNTER_CODEX_ENTRY, DRAKE_HUNTER_ID } from "./cmd005KaelDrake";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import type { CodexEntryDef } from "../codex/codexData";

export const KORVEN_PHANTOM_ID = "korven-phantom";

export const KORVEN_PHANTOM_COMMANDER: CommanderDef = {
  id: KORVEN_PHANTOM_ID,
  name: "Nyx Korven",
  callsign: "Phantom",
  archetype: "recon",
  faction: "Afterlight Initiative",
  biography: "An infiltration specialist, recon commander, and counter-intelligence operative who rebuilt humanity's fractured intelligence network after the Collapse — she avoids unnecessary conflict, believing her greatest victories are the battles that never happen.",
  passive: { trigger: "onKill", bonus: { kind: "criticalDamage", value: 0.06 } },
  active: { id: "optical-cloak", name: "Optical Cloak", cooldownMs: 13000 },
  ultimate: { id: "blackout-network", name: "Blackout Network", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "intel-network-doctrine",
    description: "Scanning, recon, stealth eliminations, and mission objectives all generate Intelligence — higher Intelligence unlocks advanced infiltration, enemy prediction, rare caches, and alternative mission routes.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "resourceGain", value: 0.05 } },
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

export const KORVEN_PHANTOM_PROFILE: CommanderProfileDef = {
  commanderId: KORVEN_PHANTOM_ID,
  class: "recon",
  visualDesign: "Adaptive black stealth armour with dark violet energy lines, an active camouflage cloak, a retractable optical visor, a low-profile tactical harness, and a silenced propulsion pack — minimal lighting throughout, with glitch-like distortion trailing every movement.",
  voice: "Soft, controlled, quiet confidence, minimal words.",
  secondaryAbility: { id: "holographic-decoy", name: "Holographic Decoy", cooldownMs: 14000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "criticalChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "korven-phantom:assassin:endgameNode",
    description: "Ascension III: the Assassin branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(KORVEN_PHANTOM_ID, "infiltration", "Infiltration", [
      ["movementSpeed", 0.05], ["statusChance", 0.04], ["boostEfficiency", 0.05],
      ["movementSpeed", 0.04], ["pickupRadius", 0.05], ["movementSpeed", 0.15],
    ]),
    branchNodes(KORVEN_PHANTOM_ID, "sabotage", "Sabotage", [
      ["statusChance", 0.05], ["statusDuration", 0.05], ["resourceGain", 0.05],
      ["cooldownReduction", 0.04], ["experienceGain", 0.05], ["statusDuration", 0.15],
    ]),
    branchNodes(KORVEN_PHANTOM_ID, "assassin", "Assassin", [
      ["criticalChance", 0.06], ["criticalDamage", 0.08], ["damage", 0.05],
      ["criticalChance", 0.05], ["criticalDamage", 0.1], ["criticalDamage", 0.18],
    ]),
  ],
  masteryTrackId: "commander:korven-phantom",
  personalMissions: [
    { beat: "originStory", name: "Eclipse Station", description: "Where she learned that if the enemy knows you're there, you've already failed." },
    { beat: "recruitment", name: "The Invisible War", description: "A hidden pirate intelligence network to infiltrate, stolen Afterlight data to recover, unnecessary casualties to avoid, its leadership to expose. She joins after the player proves restraint is more valuable than destruction." },
    { beat: "personalObjectives", name: "No Wasted Shots", description: "Spies without principles, technology traffickers, and anyone who exploits civilians all get exactly one warning." },
    { beat: "companionMissions", name: "Clean Extraction", description: "Every ally she runs with comes home; the mission log never has to explain why one of them didn't." },
    { beat: "legendaryMission", name: "Ghost Signal", description: "An abandoned intelligence relay entered, the original Phantom Protocol uncovered, lost expedition records recovered, classified Afterlight technology kept out of enemy hands, the Legendary Phantom Matrix unlocked." },
    { beat: "finalResolution", name: "The Invisible Hand", description: "A title for someone whose greatest victories nobody but her ever knew had happened." },
  ],
  loreId: "LORE_COMMANDER_PHANTOM",
  relationships: [
    { subject: "otherCommanders", targetId: DRAKE_HUNTER_ID, dialogueHint: "Professional respect for Kael Drake — a hunter and a ghost track the same prey differently, and neither wastes time arguing about method." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Works closely with Dr. Lyra Voss — her discoveries need protecting long before the rest of the galaxy learns they exist." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Trusted by Adrian Kane — he has never once asked her to explain a silence, and she has never once given him a reason to regret that." },
  ],
  statisticKeys: ["commander:korven-phantom:usage", "commander:korven-phantom:victories", "commander:korven-phantom:stealthKills"],
  cosmetics: [
    { kind: "armourVariants", id: "phantom-adaptive-armour" },
    { kind: "animations", id: "phantom-stealth-finishers" },
    { kind: "colourThemes", id: "phantom-stealth-palette" },
  ],
  voiceLineIds: ["vo-phantom-mission-start", "vo-phantom-stealth-kill", "vo-phantom-boss-encounter", "vo-phantom-ultimate", "vo-phantom-victory"],
  futureExpansionHooks: ["legendary-variant-phantom-the-invisible-hand"],
};

export const KORVEN_PHANTOM_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: KORVEN_PHANTOM_ID,
  age: 33,
  species: "Human",
  homeworld: "Eclipse Station",
  psychologicalProfile: "Reserved, intelligent, observant, dry-witted, highly disciplined, and compassionate — she avoids unnecessary conflict, believing her greatest victories are battles that never happen.",
  leadershipStyle: "Leads by omission — she removes the threat before anyone else on the team even learns it existed.",
  animationStyle: "Silent, precise, athletic, balanced, always aware; every movement is economical.",
  musicMotif: "Minimal electronic ambience and low piano over subtle pulse and soft synthetic textures, representing silence before action.",
  personality: "compassionate",
  preferredShips: ["wayfarer-hull-mk2", "bastion-hull-mk1", "maelstrom-x1", "aurelia-hull-mk1"],
  preferredWeapons: ["coil-ripper", "foundry-sunlance", "voidlance", "helios-prism-array"],
  preferredEquipment: ["cryo-manifold", "vanguard-core", "aegis-ward-projector", "horizon-flux-capacitor"],
  preferredRelics: ["veil-fragment", "static-node", "gambler-die", "singularity-keepsake"],
  preferredResearch: ["deep-scanning", "survey-protocols", "ancient-conduit", "focused-lattice"],
  preferredBiomes: ["ancient-core", "derelict-expanse", "void-expanse"],
  endingStory: "The intelligence network she rebuilt keeps running quietly long after her own missions end, and Afterlight's outposts sleep a little easier for never knowing how many threats it removed before they arrived. She still logs every operation as \"clean\" or \"not yet clean\" — nothing in between, and nothing she'd call finished until it is.",
  dialogueLibrary: [
    { category: "missionStart", line: "If they know we're here, we've already failed." },
    { category: "combat", line: "They never saw tomorrow." },
    { category: "bosses", line: "Every fortress has a weakness." },
    { category: "legendaryMoments", line: "Silence the network." },
    { category: "victory", line: "Clean. Efficient. Forgotten." },
  ],
  masteryChallenges: ["Complete 25 expeditions without triggering direct detection once.", "Eliminate 100 elite enemies while Stealth Integrity is at maximum.", "Clear \"Ghost Signal\" without a single ally taking damage."],
};

export const KORVEN_PHANTOM_RECRUITMENT: RecruitmentDef = {
  commanderId: KORVEN_PHANTOM_ID,
  source: "story",
  requirement: "Complete \"The Invisible War\": infiltrate a hidden pirate intelligence network, recover stolen Afterlight data, avoid unnecessary casualties, and expose the network's leadership.",
};

export const KORVEN_PHANTOM_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-korven-phantom",
  category: "commanders",
  title: "Nyx Korven — The Phantom",
  lore: {
    summary: "Nyx Korven rebuilt humanity's fractured intelligence network after the Collapse by unifying isolated reconnaissance teams into a single encrypted information system.",
    detailed: "Her work prevented countless conflicts before they began, proving that knowledge and precision could save more lives than overwhelming force. Professionally respectful of Kael Drake, working closely with Dr. Lyra Voss, and trusted by Adrian Kane, she distrusts spies without principles, technology traffickers, and anyone who exploits civilians.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:korven-phantom:stealthKills",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [DRAKE_HUNTER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: KORVEN_PHANTOM_ID },
};

export const KORVEN_PHANTOM_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(KORVEN_PHANTOM_RECRUITMENT.source);

export const FULL_ROSTER_WITH_PHANTOM: readonly CommanderDef[] = [...FULL_ROSTER_WITH_TEMPEST, KORVEN_PHANTOM_COMMANDER];
export const FULL_PROFILES_WITH_PHANTOM: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_TEMPEST, KORVEN_PHANTOM_PROFILE];
export const FULL_RECRUITMENT_WITH_PHANTOM: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_TEMPEST, KORVEN_PHANTOM_RECRUITMENT];

export function phantomOverlapReport(): readonly string[] {
  const overlap = findOverlap(KORVEN_PHANTOM_COMMANDER, FULL_ROSTER_WITH_TEMPEST);
  return overlap ? [`${KORVEN_PHANTOM_ID} overlaps ${overlap}`] : [];
}

export function phantomArchitectureComplete(): boolean {
  const architecture = architectureFor(KORVEN_PHANTOM_COMMANDER, KORVEN_PHANTOM_PROFILE);
  return Object.values(architecture).every(Boolean);
}
