/**
 * Commander CMD-016 — Astrid Reyes "The Warden" (AF-114). The
 * canonical, individually-specified implementation of Afterlight's
 * sixteenth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A seventeenth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-002/013/008
 * per her spec'd relationships to exactly those three. Per the spec's
 * own self-review directive ("Reduce overlap with Adrian Kane"), her
 * archetype/class (support/hybrid) and passive/signature trigger+bonus
 * pairs are deliberately distinct from Kane's guardian/defender kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_SINGULARITY, FULL_RECRUITMENT_WITH_SINGULARITY, FULL_ROSTER_WITH_SINGULARITY } from "./cmd015ZephyrKain";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { SYN_BIOFORGE_CODEX_ENTRY, SYN_BIOFORGE_ID } from "./cmd013MiraSyn";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import type { CodexEntryDef } from "../codex/codexData";

export const REYES_WARDEN_ID = "reyes-warden";

export const REYES_WARDEN_COMMANDER: CommanderDef = {
  id: REYES_WARDEN_ID,
  name: "Astrid Reyes",
  callsign: "Warden",
  archetype: "support",
  faction: "Afterlight Initiative",
  biography: "A civil defence commander, emergency response director, and planetary guardian who became the face of humanity's Civil Defence Corps after the Collapse — she believes the greatest victory is bringing everyone home alive.",
  passive: { trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 4 } },
  active: { id: "guardian-dome", name: "Guardian Dome", cooldownMs: 14000 },
  ultimate: { id: "last-sanctuary", name: "Last Sanctuary", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "civil-defence-rating-doctrine",
    description: "Successful rescues generate Rating — higher Rating unlocks stronger barriers, additional rescue drones, improved objective defence, and legendary protection protocols.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "shieldCapacity", value: 4 } },
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

export const REYES_WARDEN_PROFILE: CommanderProfileDef = {
  commanderId: REYES_WARDEN_ID,
  class: "hybrid",
  visualDesign: "A heavy rescue exosuit in white ceramic armour with gold emergency markings, blue shield emitters, expandable rescue drones, a medical backpack, an integrated command visor, a protective energy mantle, and the Civil Defence insignia worn plainly.",
  voice: "Warm, authoritative, reassuring, measured, never panicked.",
  secondaryAbility: { id: "emergency-protocol", name: "Emergency Protocol", cooldownMs: 15000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldCapacity", value: 5 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "reyes-warden:command:endgameNode",
    description: "Ascension III: the Command branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(REYES_WARDEN_ID, "protector", "Protector", [
      ["shieldCapacity", 4], ["shieldRegeneration", 3], ["shieldCapacity", 5],
      ["shieldRegeneration", 4], ["boostEfficiency", 0.04], ["shieldCapacity", 14],
    ]),
    branchNodes(REYES_WARDEN_ID, "emergency-response", "Emergency Response", [
      ["shieldRegeneration", 3], ["cooldownReduction", 0.04], ["pickupRadius", 0.05],
      ["resourceGain", 0.05], ["experienceGain", 0.05], ["shieldRegeneration", 10],
    ]),
    branchNodes(REYES_WARDEN_ID, "command", "Command", [
      ["shieldCapacity", 3], ["resourceGain", 0.05], ["cooldownReduction", 0.04],
      ["experienceGain", 0.06], ["statusDuration", 0.04], ["shieldCapacity", 12],
    ]),
  ],
  masteryTrackId: "commander:reyes-warden",
  personalMissions: [
    { beat: "originStory", name: "Sanctuary Bastion", description: "Where she learned that no one gets left behind, and that the greatest victory is bringing everyone home alive." },
    { beat: "recruitment", name: "The Final Evacuation", description: "A colony collapsing beneath orbital bombardment, civilian evacuations to lead, rescue fleets to protect, planetary shields to maintain. She joins after the player repeatedly prioritises civilian survival over personal rewards." },
    { beat: "personalObjectives", name: "No One Abandoned", description: "Those who abandon civilians and military leaders seeking unnecessary sacrifice both meet the same immovable refusal." },
    { beat: "companionMissions", name: "Between Danger and Home", description: "She positions herself between danger and civilians before she calculates anything else about the fight." },
    { beat: "legendaryMission", name: "The Shield of Humanity", description: "The legendary Sanctuary Defence Grid reactivated, millions of refugees protected, overwhelming assaults held, the Great Bastion Network restored, the Legendary Sanctuary Core unlocked." },
    { beat: "finalResolution", name: "The Last Bastion", description: "A title for someone who measured every mission's success by who got to go home." },
  ],
  loreId: "LORE_COMMANDER_WARDEN",
  relationships: [
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Close friend of Adrian Kane — two commanders who hold a line for entirely different reasons and have never once needed to argue about it." },
    { subject: "otherCommanders", targetId: SYN_BIOFORGE_ID, dialogueHint: "Professional respect for Dr. Mira Syn — a rescued colony and a restored ecosystem are the same kind of victory, counted differently." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Works closely with Nova Iskander — a hive of rescue drones and a hive of combat drones share more doctrine than either commander expected." },
  ],
  statisticKeys: ["commander:reyes-warden:usage", "commander:reyes-warden:victories", "commander:reyes-warden:civiliansRescued"],
  cosmetics: [
    { kind: "armourVariants", id: "warden-guardian-armour" },
    { kind: "animations", id: "warden-shield-effects" },
    { kind: "colourThemes", id: "warden-protection-palette" },
  ],
  voiceLineIds: ["vo-warden-mission-start", "vo-warden-civilian-rescue", "vo-warden-boss-encounter", "vo-warden-ultimate", "vo-warden-victory"],
  futureExpansionHooks: ["legendary-variant-warden-the-last-bastion"],
};

export const REYES_WARDEN_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: REYES_WARDEN_ID,
  age: 45,
  species: "Human",
  homeworld: "Sanctuary Bastion",
  psychologicalProfile: "Calm, protective, selfless, resilient, patient, and inspirational — she believes the greatest victory is bringing everyone home alive.",
  leadershipStyle: "Leads by anticipation — she has already planned the evacuation before anyone else on the team notices the danger.",
  animationStyle: "Confident, purposeful, protective; always positioned between danger and civilians, with shield generators unfolding mechanically around her.",
  musicMotif: "Hopeful orchestra and warm strings over deep brass, gentle choir, and steady percussion, representing resilience.",
  personality: "compassionate",
  preferredShips: ["bastion-hull-mk1", "caduceus-mk1", "hivemother-mk1", "dawnspire"],
  preferredWeapons: ["voidlance", "coil-ripper-mk2", "helios-prism-array", "atlas-cluster-battery"],
  preferredEquipment: ["aegis-bastion-array", "aegis-ward-projector", "nova-warden-hive", "vanguard-core"],
  preferredRelics: ["warden-token", "conduit-loop", "static-node", "singularity-keepsake"],
  preferredResearch: ["barrier-theory", "rapid-refit", "expanded-archives", "survey-protocols"],
  preferredBiomes: ["meridian-rest-frontier", "frozen-reach", "derelict-expanse"],
  endingStory: "The Sanctuary Core keeps every reinforced shield standing long after the last evacuation fleet clears, and every colony she protected afterward remembers her by the drones that never once stopped circling overhead. She still counts a mission's success in names, not kills — she stopped counting the other number years ago.",
  dialogueLibrary: [
    { category: "missionStart", line: "No one gets left behind." },
    { category: "combat", line: "You're safe now." },
    { category: "bosses", line: "If you want them, you'll go through me." },
    { category: "legendaryMoments", line: "This is humanity's sanctuary." },
    { category: "victory", line: "We saved them. That's enough." },
  ],
  masteryChallenges: ["Complete 25 expeditions without losing a single protected civilian.", "Keep Guardian Dome active through an entire boss encounter without it collapsing.", "Reach maximum Civil Defence Rating in 50 separate rescue operations."],
};

export const REYES_WARDEN_RECRUITMENT: RecruitmentDef = {
  commanderId: REYES_WARDEN_ID,
  source: "legendaryMissions",
  requirement: "Complete \"The Final Evacuation\": lead civilian evacuations from a colony collapsing beneath orbital bombardment, protect rescue fleets, and maintain planetary shields.",
};

export const REYES_WARDEN_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-reyes-warden",
  category: "commanders",
  title: "Astrid Reyes — The Warden",
  lore: {
    summary: "Astrid Reyes became the face of humanity's Civil Defence Corps during the decades following the Collapse.",
    detailed: "Responsible for coordinating the evacuation of countless frontier settlements, she transformed emergency response into one of the pillars of galactic reconstruction, proving that courage is measured by those protected rather than enemies defeated. Close friends with Adrian Kane, professionally respectful of Dr. Mira Syn, and working closely with Nova Iskander, she distrusts those who abandon civilians and military leaders seeking unnecessary sacrifice in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:reyes-warden:civiliansRescued",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [KANE_VANGUARD_CODEX_ENTRY.id, SYN_BIOFORGE_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: REYES_WARDEN_ID },
};

export const REYES_WARDEN_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(REYES_WARDEN_RECRUITMENT.source);

export const FULL_ROSTER_WITH_WARDEN: readonly CommanderDef[] = [...FULL_ROSTER_WITH_SINGULARITY, REYES_WARDEN_COMMANDER];
export const FULL_PROFILES_WITH_WARDEN: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_SINGULARITY, REYES_WARDEN_PROFILE];
export const FULL_RECRUITMENT_WITH_WARDEN: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_SINGULARITY, REYES_WARDEN_RECRUITMENT];

export function wardenOverlapReport(): readonly string[] {
  const overlap = findOverlap(REYES_WARDEN_COMMANDER, FULL_ROSTER_WITH_SINGULARITY);
  return overlap ? [`${REYES_WARDEN_ID} overlaps ${overlap}`] : [];
}

export function wardenArchitectureComplete(): boolean {
  const architecture = architectureFor(REYES_WARDEN_COMMANDER, REYES_WARDEN_PROFILE);
  return Object.values(architecture).every(Boolean);
}
