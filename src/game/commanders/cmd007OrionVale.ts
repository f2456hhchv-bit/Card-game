/**
 * Commander CMD-007 — Orion Vale "The Voidrunner" (AF-105). The
 * canonical, individually-specified implementation of Afterlight's
 * seventh fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. An eighth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-004/001/002
 * per his spec'd relationships to exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_RESONANT, FULL_RECRUITMENT_WITH_RESONANT, FULL_ROSTER_WITH_RESONANT } from "./cmd006AriaSol";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const VALE_VOIDRUNNER_ID = "vale-voidrunner";

export const VALE_VOIDRUNNER_COMMANDER: CommanderDef = {
  id: VALE_VOIDRUNNER_ID,
  name: "Orion Vale",
  callsign: "Voidrunner",
  archetype: "voidSpecialist",
  faction: "Afterlight Initiative",
  biography: "A void expedition specialist, dimensional navigator, and reality recovery operative who volunteered for humanity's first successful expeditions into permanent Void anomalies after witnessing countless failed rescue attempts — believes someone must willingly walk into darkness so others never have to.",
  passive: { trigger: "onLowHealth", bonus: { kind: "movementSpeed", value: 0.06 } },
  active: { id: "phase-step", name: "Phase Step", cooldownMs: 9000 },
  ultimate: { id: "beyond-the-horizon", name: "Beyond the Horizon", chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.04 },
  signature: {
    tag: "corruption-balance-doctrine",
    description: "Void actions generate Corruption — managed correctly it grants higher damage, improved mobility, and rare discoveries; ignored, it reduces effectiveness until stabilised.",
    passive: { trigger: "onLowHealth", bonus: { kind: "resourceGain", value: 0.05 } },
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

export const VALE_VOIDRUNNER_PROFILE: CommanderProfileDef = {
  commanderId: VALE_VOIDRUNNER_ID,
  class: "experimental",
  visualDesign: "Black adaptive void armour with deep violet energy veins, a floating fractured cloak, a distorted helmet visor, micro-singularity stabilisers, dark energy gauntlets, subtle gravitational lensing, and reality fractures that appear around his every movement.",
  voice: "Low, calm, reflective, emotionally restrained — occasionally haunted.",
  secondaryAbility: { id: "collapse-field", name: "Collapse Field", cooldownMs: 13000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "movementSpeed", value: 0.05 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "vale-voidrunner:stability:endgameNode",
    description: "Ascension III: the Stability branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(VALE_VOIDRUNNER_ID, "voidwalker", "Voidwalker", [
      ["movementSpeed", 0.05],
      ["boostEfficiency", 0.05],
      ["pickupRadius", 0.07],
      ["shieldCapacity", 0.05],
      ["cooldownReduction", 0.04],
      ["movementSpeed", 0.14],
    ]),
    branchNodes(VALE_VOIDRUNNER_ID, "collapse", "Collapse", [
      ["statusDuration", 0.06],
      ["criticalDamage", 0.08],
      ["statusChance", 0.05],
      ["resourceGain", 0.05],
      ["criticalChance", 0.03],
      ["criticalDamage", 0.16],
    ]),
    branchNodes(VALE_VOIDRUNNER_ID, "stability", "Stability", [
      ["shieldRegeneration", 4],
      ["boostEfficiency", 0.05],
      ["shieldCapacity", 0.06],
      ["experienceGain", 0.05],
      ["cooldownReduction", 0.04],
      ["shieldRegeneration", 10],
    ]),
  ],
  masteryTrackId: "commander:vale-voidrunner",
  personalMissions: [
    { beat: "originStory", name: "Null Reach", description: "The world at the edge of known space, where he first learned reality has a texture if you know how to feel for it." },
    { beat: "recruitment", name: "The Black Crossing", description: "A collapsing Void corridor, trapped explorers, multiple singularities to stabilise. He joins after watching the player accept overwhelming risk to save them anyway." },
    { beat: "personalObjectives", name: "Every Corridor Mapped", description: "No void corridor stays unmapped once he's crossed it, however briefly it holds still." },
    { beat: "companionMissions", name: "Escort to the Edge", description: "He leads from the front on the missions no one else can survive, and never asks anyone to follow further than they're ready for." },
    { beat: "legendaryMission", name: "The Endless Horizon", description: "The Null Expanse, regions beyond known space mapped, total reality collapse prevented." },
    { beat: "finalResolution", name: "The Horizon Walker", description: "A title for someone who kept walking into the dark so no one else had to." },
  ],
  loreId: "LORE_COMMANDER_VOIDRUNNER",
  relationships: [
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Close respect for Seraphina Cael — she studies the edge of reality from the theory side; he studies it from inside." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional trust in Dr. Voss — her curiosity about the unknown never once tips into recklessness, and he notices." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Respects Kane's discipline — a line held is a line he doesn't have to walk into the dark to protect." },
  ],
  statisticKeys: ["commander:vale-voidrunner:usage", "commander:vale-voidrunner:victories", "commander:vale-voidrunner:corruptionManaged"],
  cosmetics: [
    { kind: "armourVariants", id: "voidrunner-void-armour" },
    { kind: "animations", id: "voidrunner-gravitational-effects" },
    { kind: "colourThemes", id: "voidrunner-void-palette" },
  ],
  voiceLineIds: ["vo-voidrunner-mission-start", "vo-voidrunner-void-anomaly", "vo-voidrunner-boss-encounter", "vo-voidrunner-ultimate", "vo-voidrunner-victory"],
  futureExpansionHooks: ["legendary-variant-voidrunner-horizon-walker"],
};

export const VALE_VOIDRUNNER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: VALE_VOIDRUNNER_ID,
  age: 36,
  species: "Human",
  homeworld: "Null Reach",
  psychologicalProfile: "Fearless, reserved, calculating, determined, and selfless, with a quiet compassion he rarely shows — believes someone must willingly walk into darkness so others never have to.",
  leadershipStyle: "Leads by going first — never sends anyone somewhere he hasn't already survived himself.",
  animationStyle: "Extremely agile with short-range phase movements; reality flickers around weightless transitions and rapid directional changes.",
  musicMotif: "Dark ambient synth and deep bass drones over slow electronic pulses and minimal piano, representing isolation and perseverance.",
  personality: "fearless",
  preferredShips: ["caduceus-mk1", "maelstrom-x1", "dawnspire", "sable-dart-mk1"],
  preferredWeapons: ["voidlance", "paragon-flux-driver", "novasplitter", "hailborn-array"],
  preferredEquipment: ["nova-warden-hive", "horizon-flux-capacitor", "cryo-manifold", "vanguard"],
  preferredRelics: ["static-node", "singularity-keepsake", "veil-fragment", "conduit-loop"],
  preferredResearch: ["harmonic-overload", "ancient-conduit", "unified-theory", "deep-scanning"],
  preferredBiomes: ["void-expanse", "singularity-zone", "ancient-core"],
  endingStory: "The Null Expanse gets mapped, region by region, and the Horizon Drive works exactly once before anyone else is ready to follow him through it. He goes anyway, because that's always been the point.",
  dialogueLibrary: [
    { category: "missionStart", line: "The darkness isn't empty. Listen carefully." },
    { category: "discoveries", line: "Reality is thinner here." },
    { category: "bosses", line: "Even monsters fear the abyss." },
    { category: "legendaryMoments", line: "Beyond fear lies understanding." },
    { category: "victory", line: "We came back. That's enough." },
  ],
  masteryChallenges: ["Survive 200 encounters while keeping Corruption balanced.", "Phase Step through 1,000 hazards without taking damage.", "Complete 15 expeditions entering Beyond the Horizon at least once each."],
};

export const VALE_VOIDRUNNER_RECRUITMENT: RecruitmentDef = {
  commanderId: VALE_VOIDRUNNER_ID,
  source: "legendaryMissions",
  requirement: "Complete \"The Black Crossing\": navigate the collapsing Void corridor, rescue the trapped explorers, and escape before total dimensional collapse.",
};

export const VALE_VOIDRUNNER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-vale-voidrunner",
  category: "commanders",
  title: "Orion Vale — The Voidrunner",
  lore: {
    summary: "Orion Vale volunteered for humanity's first successful expeditions into permanent Void anomalies after witnessing countless failed rescue attempts.",
    detailed: "His pioneering navigation techniques allowed scientific teams to safely investigate regions previously considered permanently inaccessible, fundamentally expanding the frontier of exploration. He holds close respect for Seraphina Cael, professional trust in Dr. Lyra Voss, and quiet respect for Adrian Kane's discipline — a commander who walks into the dark precisely so others never have to.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:vale-voidrunner:corruptionManaged",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [CAEL_WEAVER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: VALE_VOIDRUNNER_ID },
};

export const VALE_VOIDRUNNER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(VALE_VOIDRUNNER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_VOIDRUNNER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_RESONANT, VALE_VOIDRUNNER_COMMANDER];
export const FULL_PROFILES_WITH_VOIDRUNNER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_RESONANT, VALE_VOIDRUNNER_PROFILE];
export const FULL_RECRUITMENT_WITH_VOIDRUNNER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_RESONANT, VALE_VOIDRUNNER_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 28-commander roster via the
 * real AF-030 fingerprint/findOverlap law. */
export function voidrunnerOverlapReport(): readonly string[] {
  const overlap = findOverlap(VALE_VOIDRUNNER_COMMANDER, FULL_ROSTER_WITH_RESONANT);
  return overlap ? [`${VALE_VOIDRUNNER_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function voidrunnerArchitectureComplete(): boolean {
  const architecture = architectureFor(VALE_VOIDRUNNER_COMMANDER, VALE_VOIDRUNNER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
