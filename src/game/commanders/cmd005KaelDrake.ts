/**
 * Commander CMD-005 — Kael Drake "The Hunter" (AF-103). The canonical,
 * individually-specified implementation of Afterlight's fifth fully
 * production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A sixth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-001/002/004 per his spec'd relationships to
 * exactly those three (no relationship to CMD-003 is spec'd, so none is
 * invented).
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID, FULL_PROFILES_WITH_WEAVER, FULL_RECRUITMENT_WITH_WEAVER, FULL_ROSTER_WITH_WEAVER } from "./cmd004SeraphinaCael";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const DRAKE_HUNTER_ID = "drake-hunter";

export const DRAKE_HUNTER_COMMANDER: CommanderDef = {
  id: DRAKE_HUNTER_ID,
  name: "Kael Drake",
  callsign: "Hunter",
  archetype: "recon",
  faction: "Independent Frontier Rangers",
  biography: "A frontier tracker, elite recon specialist, and xeno hunter who spent decades protecting isolated colonies by studying threats long before they reached anyone — allied with the Afterlight Initiative, though he still answers to the Rangers first.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "pickupRadius", value: 0.08 } },
  active: { id: "hunter-drone", name: "Hunter Drone", cooldownMs: 12000 },
  ultimate: { id: "perfect-hunt", name: "Perfect Hunt", chargeRequired: 100, chargePerKill: 4, chargePerDamage: 0.04 },
  signature: {
    tag: "hunter-knowledge-doctrine",
    description: "Every enemy permanently analysed contributes Hunter Knowledge — critical efficiency, scanning, and rare-enemy detection all rising together. Hunter Knowledge never resets.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.04 } },
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

export const DRAKE_HUNTER_PROFILE: CommanderProfileDef = {
  commanderId: DRAKE_HUNTER_ID,
  class: "recon",
  visualDesign: "Light reconnaissance armour in dark forest green and graphite, an adaptive camouflage cloak, a compact tactical backpack, a retractable targeting visor, a biometric gauntlet, a magnetic utility belt, and a long-range sensor drone — every piece of it battle-scarred.",
  voice: "Quiet, controlled, experienced, measured — calm under pressure, and never wastes a word.",
  secondaryAbility: { id: "execution-protocol", name: "Execution Protocol", cooldownMs: 14000 },
  masteryPassive: { trigger: "onKill", bonus: { kind: "criticalChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 2,
    talentNodeId: "drake-hunter:apex-predator:endgameNode",
    description: "Ascension II: the Apex Predator branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(DRAKE_HUNTER_ID, "marksman", "Marksman", [
      ["criticalDamage", 0.09],
      ["criticalChance", 0.04],
      ["statusChance", 0.04],
      ["movementSpeed", 0.03],
      ["criticalDamage", 0.1],
      ["criticalDamage", 0.18],
    ]),
    branchNodes(DRAKE_HUNTER_ID, "tracker", "Tracker", [
      ["pickupRadius", 0.07],
      ["movementSpeed", 0.05],
      ["experienceGain", 0.05],
      ["cooldownReduction", 0.04],
      ["resourceGain", 0.05],
      ["pickupRadius", 0.16],
    ]),
    branchNodes(DRAKE_HUNTER_ID, "apex-predator", "Apex Predator", [
      ["criticalDamage", 0.06],
      ["statusDuration", 0.05],
      ["criticalChance", 0.04],
      ["shieldRegeneration", 3],
      ["statusChance", 0.05],
      ["criticalDamage", 0.15],
    ]),
  ],
  masteryTrackId: "commander:drake-hunter",
  personalMissions: [
    { beat: "originStory", name: "Ashfall Frontier", description: "Where he learned that a threat studied is a threat already half-defeated." },
    { beat: "recruitment", name: "The Last Trail", description: "A legendary apex organism, several destroyed expeditions, and a choice: rush the kill or understand it first. He joins after watching the player choose to understand." },
    { beat: "personalObjectives", name: "Every Trail Read", description: "No threat goes unstudied, no matter how tempting the shortcut." },
    { beat: "companionMissions", name: "Overwatch", description: "Escort duty from a distance — he covers the ground nobody else notices needs covering." },
    { beat: "legendaryMission", name: "The Silent Predator", description: "The mythical Void Stalker, tracked across biomes and taken down without ever being detected first." },
    { beat: "finalResolution", name: "The Apex", description: "A title he'd never claim for himself, earned by every threat he studied before it became one." },
  ],
  loreId: "LORE_COMMANDER_HUNTER",
  relationships: [
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Close respect for Kane — neither one mistakes discipline for hesitation." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Genuine friendship with Dr. Voss — she reads the galaxy the way he reads a trail, and neither has ever had to explain that to the other." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Professional trust in Cael's instincts, even when her science outruns his patience." },
  ],
  statisticKeys: ["commander:drake-hunter:usage", "commander:drake-hunter:victories", "commander:drake-hunter:elitesAnalysed"],
  cosmetics: [
    { kind: "armourVariants", id: "hunter-forest-green-armour" },
    { kind: "animations", id: "hunter-adaptive-camouflage" },
    { kind: "victoryPoses", id: "hunter-elite-kill-effect" },
  ],
  voiceLineIds: ["vo-hunter-mission-start", "vo-hunter-elite-enemy", "vo-hunter-boss-encounter", "vo-hunter-ultimate", "vo-hunter-victory"],
  futureExpansionHooks: ["legendary-variant-hunter-the-apex"],
};

export const DRAKE_HUNTER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: DRAKE_HUNTER_ID,
  age: 41,
  species: "Human",
  homeworld: "Ashfall Frontier",
  psychologicalProfile: "Observant, quiet, patient, loyal, and fiercely independent, with a dry sense of humour he rarely bothers sharing — speaks only when he has something worth saying, and values preparation over confidence.",
  leadershipStyle: "Leads by example from a distance — never gives an order he hasn't already scouted the ground for.",
  animationStyle: "Fluid and deliberate, low-profile, with constant environmental awareness; minimal unnecessary movement and a distinctly predatory posture.",
  musicMotif: "Low strings and minimal percussion over sparse electronic ambience, gradually increasing tension that represents patience before action.",
  personality: "strategic",
  preferredShips: ["sable-dart-mk1", "maelstrom-x1", "falchion-mk2", "dawnspire"],
  preferredWeapons: ["coil-ripper-mk2", "helios-prism-array", "novasplitter", "coil-ripper"],
  preferredEquipment: ["aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "vanguard"],
  preferredRelics: ["gambler-die", "veil-fragment", "static-node", "singularity-keepsake"],
  preferredResearch: ["survey-protocols", "deep-scanning", "harmonic-overload", "unified-theory"],
  preferredBiomes: ["solar-wastes", "void-expanse", "frozen-reach"],
  endingStory: "The Void Stalker's final data point gets logged, same as every other threat he's ever studied. He never claims the title 'The Apex' out loud, but the field journals that carry it outlast every trail he's ever walked.",
  dialogueLibrary: [
    { category: "missionStart", line: "Every trail tells a story." },
    { category: "combat", line: "Watch carefully... it's already made a mistake." },
    { category: "bosses", line: "No creature is invincible." },
    { category: "legendaryMoments", line: "The hunt ends now." },
    { category: "victory", line: "It was never luck." },
  ],
  masteryChallenges: ["Fully analyse 200 elite enemies across all expeditions.", "Land 1,000 Execution Protocol critical hits.", "Defeat 20 bosses with Perfect Hunt active during the killing blow."],
};

export const DRAKE_HUNTER_RECRUITMENT: RecruitmentDef = {
  commanderId: DRAKE_HUNTER_ID,
  source: "campaign",
  requirement: "Complete \"The Last Trail\": track the apex organism, analyse its behaviour instead of rushing combat, and defeat it only once fully understood.",
};

export const DRAKE_HUNTER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-drake-hunter",
  category: "commanders",
  title: "Kael Drake — The Hunter",
  lore: {
    summary: "Kael Drake spent decades protecting isolated frontier colonies by tracking and eliminating threats long before they reached civilian populations.",
    detailed: "His detailed field journals became the foundation for humanity's modern xeno-behaviour research programme, saving countless lives through observation rather than brute force. Close respect for Adrian Kane, genuine friendship with Dr. Lyra Voss, and professional trust in Seraphina Cael define a commander who studies everything before trusting anything.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:drake-hunter:elitesAnalysed",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [KANE_VANGUARD_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: DRAKE_HUNTER_ID },
};

export const DRAKE_HUNTER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(DRAKE_HUNTER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_HUNTER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_WEAVER, DRAKE_HUNTER_COMMANDER];
export const FULL_PROFILES_WITH_HUNTER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_WEAVER, DRAKE_HUNTER_PROFILE];
export const FULL_RECRUITMENT_WITH_HUNTER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_WEAVER, DRAKE_HUNTER_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 26-commander roster via the
 * real AF-030 fingerprint/findOverlap law. */
export function hunterOverlapReport(): readonly string[] {
  const overlap = findOverlap(DRAKE_HUNTER_COMMANDER, FULL_ROSTER_WITH_WEAVER);
  return overlap ? [`${DRAKE_HUNTER_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function hunterArchitectureComplete(): boolean {
  const architecture = architectureFor(DRAKE_HUNTER_COMMANDER, DRAKE_HUNTER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
