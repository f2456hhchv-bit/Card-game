/**
 * Commander CMD-002 — Adrian Kane "The Vanguard" (AF-100). The canonical,
 * individually-specified implementation of Afterlight's second fully
 * production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A third codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-001's entry per his spec'd "Deep Respect" for
 * Dr. Lyra Voss.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_PATHFINDER, FULL_RECRUITMENT_WITH_PATHFINDER, FULL_ROSTER_WITH_PATHFINDER, LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const KANE_VANGUARD_ID = "kane-vanguard";

export const KANE_VANGUARD_COMMANDER: CommanderDef = {
  id: KANE_VANGUARD_ID,
  name: "Adrian Kane",
  callsign: "Vanguard",
  archetype: "guardian",
  faction: "United Human Frontier",
  biography: "A fleet commander and veteran officer who held humanity's final defensive lines through the darkest years after the Collapse — refuses, on principle, to abandon a civilian population, no matter the cost to the mission.",
  passive: { trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 5 } },
  active: { id: "guardian-barrier", name: "Guardian Barrier", cooldownMs: 13000 },
  ultimate: { id: "fortress-formation", name: "Fortress Formation", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.04 },
  signature: {
    tag: "leadership-doctrine",
    description: "Every defended objective generates Leadership — defensive efficiency, shield strength, and command effectiveness all rise together, persisting for the whole expedition.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "cooldownReduction", value: 0.03 } },
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

export const KANE_VANGUARD_PROFILE: CommanderProfileDef = {
  commanderId: KANE_VANGUARD_ID,
  class: "defender",
  visualDesign: "Heavy dark-graphite command armour with white military markings and blue command lights, a long reinforced officer's coat, a mechanical left arm, a command visor, decorated service medals, and a battle-worn finish that has clearly seen every one of them.",
  voice: "Deep, calm, authoritative, measured — never once panicked, even under fire.",
  secondaryAbility: { id: "command-protocol", name: "Command Protocol", cooldownMs: 15000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldCapacity", value: 8 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 2,
    talentNodeId: "kane-vanguard:defender:endgameNode",
    description: "Ascension II: the Defender branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(KANE_VANGUARD_ID, "defender", "Defender", [
      ["shieldCapacity", 0.08],
      ["shieldRegeneration", 5],
      ["statusDuration", 0.05],
      ["cooldownReduction", 0.04],
      ["boostEfficiency", 0.04],
      ["shieldCapacity", 0.18],
    ]),
    branchNodes(KANE_VANGUARD_ID, "commander", "Commander", [
      ["cooldownReduction", 0.05],
      ["experienceGain", 0.05],
      ["resourceGain", 0.05],
      ["statusChance", 0.04],
      ["shieldRegeneration", 4],
      ["cooldownReduction", 0.12],
    ]),
    branchNodes(KANE_VANGUARD_ID, "juggernaut", "Juggernaut", [
      ["shieldCapacity", 0.06],
      ["statusDuration", 0.06],
      ["criticalChance", 0.03],
      ["shieldRegeneration", 5],
      ["movementSpeed", 0.03],
      ["shieldCapacity", 0.16],
    ]),
  ],
  masteryTrackId: "commander:kane-vanguard",
  personalMissions: [
    { beat: "originStory", name: "Bastion Prime", description: "The world that taught him a wall is only as strong as the will behind it." },
    { beat: "recruitment", name: "The Last Bastion", description: "A frontier colony under overwhelming attack. He joins only after watching the player choose civilians over glory." },
    { beat: "personalObjectives", name: "Every Line Held", description: "No evacuation transport lost on his watch. Not one, not ever." },
    { beat: "companionMissions", name: "Escort Formation", description: "Convoy duty is not lesser duty. He treats every one the same." },
    { beat: "legendaryMission", name: "Stand Until Dawn", description: "The defence of the Bastion Array — the Afterlight Relay held against odds that should have ended the fight." },
    { beat: "finalResolution", name: "The Wall", description: "The line that never broke, named for the man who never left it." },
  ],
  loreId: "LORE_COMMANDER_VANGUARD",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Holds deep respect for Dr. Voss — she maps the doors forward; he makes sure there's still a colony standing to walk through them." },
    { subject: "majorFactions", targetId: "codex-human-alliance", dialogueHint: "Every frontier security force still uses his defensive doctrine, whether or not they credit him for it." },
    { subject: "civilisations", targetId: "codex-mercenary-guild", dialogueHint: "Distrusts mercenary contracts on principle — duty isn't a line item, no matter who's paying." },
  ],
  statisticKeys: ["commander:kane-vanguard:usage", "commander:kane-vanguard:victories", "commander:kane-vanguard:objectivesDefended"],
  cosmetics: [
    { kind: "armourVariants", id: "vanguard-command-armour" },
    { kind: "colourThemes", id: "vanguard-military-palette" },
    { kind: "portraits", id: "vanguard-officer-portrait" },
  ],
  voiceLineIds: ["vo-vanguard-mission-start", "vo-vanguard-objective-attacked", "vo-vanguard-boss-encounter", "vo-vanguard-victory", "vo-vanguard-low-health"],
  futureExpansionHooks: ["legendary-variant-vanguard-the-wall"],
};

export const KANE_VANGUARD_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: KANE_VANGUARD_ID,
  age: 47,
  species: "Human",
  homeworld: "Bastion Prime",
  psychologicalProfile: "Disciplined, protective, stoic, patient, and honourable to the point of self-sacrifice — believes every civilian life outweighs military glory, without exception.",
  leadershipStyle: "Leads from the front line, never behind it — every order is one he would carry out himself, and often has.",
  animationStyle: "Heavy and purposeful with military precision; minimal unnecessary movement, a confident posture, always visibly aware of his surroundings.",
  musicMotif: "Low brass and military percussion over deep synthesizers, a slow orchestral progression that represents determination rather than urgency.",
  personality: "stoic",
  preferredShips: ["dawnspire", "ballista-mk3", "caduceus-mk1"],
  preferredWeapons: ["atlas-cluster-battery", "coil-ripper-mk2", "paragon-flux-driver", "foundry-sunlance"],
  preferredEquipment: ["aegis-bastion-array", "bastion", "horizon-flux-capacitor", "aegis-ward-projector"],
  preferredRelics: ["warden-token", "static-node", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["barrier-theory", "rapid-refit", "expanded-archives"],
  preferredBiomes: ["derelict-expanse", "solar-wastes", "meridian-rest-frontier"],
  endingStory: "The Bastion Array holds. The Relay survives. Frontier colonies start naming their own militias after him without asking — he finds this mortifying and does nothing to stop it, because it means the doctrine outlives the man.",
  dialogueLibrary: [
    { category: "missionStart", line: "We hold the line. No exceptions." },
    { category: "combat", line: "Reinforce immediately!" },
    { category: "bosses", line: "Strength without discipline is weakness." },
    { category: "victory", line: "They're alive. That's what matters." },
    { category: "combat", line: "I've endured worse." },
  ],
  masteryChallenges: ["Defend 100 objectives without one falling.", "Absorb 500,000 damage total via Guardian Barrier across all expeditions.", "Complete 20 expeditions with zero ally defeats while Fortress Formation is active."],
};

export const KANE_VANGUARD_RECRUITMENT: RecruitmentDef = {
  commanderId: KANE_VANGUARD_ID,
  source: "campaign",
  requirement: "Complete \"The Last Bastion\": hold the defensive lines, protect the evacuation transports, and prevent orbital collapse.",
};

export const KANE_VANGUARD_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-kane-vanguard",
  category: "commanders",
  title: "Adrian Kane — The Vanguard",
  lore: {
    summary: "Adrian Kane commanded humanity's final defensive fleets during the darkest years following the Collapse.",
    detailed: "His refusal to abandon civilian populations became legendary throughout frontier space, inspiring countless colonies to resist extinction. He holds deep respect for Dr. Lyra Voss, whose discoveries he credits with giving his defence something worth defending.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:kane-vanguard:objectivesDefended",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: KANE_VANGUARD_ID },
};

export const KANE_VANGUARD_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(KANE_VANGUARD_RECRUITMENT.source);

export const FULL_ROSTER_WITH_VANGUARD: readonly CommanderDef[] = [...FULL_ROSTER_WITH_PATHFINDER, KANE_VANGUARD_COMMANDER];
export const FULL_PROFILES_WITH_VANGUARD: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_PATHFINDER, KANE_VANGUARD_PROFILE];
export const FULL_RECRUITMENT_WITH_VANGUARD: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_PATHFINDER, KANE_VANGUARD_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 23-commander roster (launch +
 * Batch 1 + CMD-001) via the real AF-030 fingerprint/findOverlap law. */
export function vanguardOverlapReport(): readonly string[] {
  const overlap = findOverlap(KANE_VANGUARD_COMMANDER, FULL_ROSTER_WITH_PATHFINDER);
  return overlap ? [`${KANE_VANGUARD_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function vanguardArchitectureComplete(): boolean {
  const architecture = architectureFor(KANE_VANGUARD_COMMANDER, KANE_VANGUARD_PROFILE);
  return Object.values(architecture).every(Boolean);
}
