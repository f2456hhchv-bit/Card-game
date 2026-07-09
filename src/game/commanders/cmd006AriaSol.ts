/**
 * Commander CMD-006 — Aria Sol "The Resonant" (AF-104). The canonical,
 * individually-specified implementation of Afterlight's sixth fully
 * production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A seventh codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-004/001/003 per her spec'd relationships to
 * exactly those three (no relationship to CMD-002 or CMD-005 is
 * spec'd, so none is invented).
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_HUNTER, FULL_RECRUITMENT_WITH_HUNTER, FULL_ROSTER_WITH_HUNTER } from "./cmd005KaelDrake";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const SOL_RESONANT_ID = "sol-resonant";

export const SOL_RESONANT_COMMANDER: CommanderDef = {
  id: SOL_RESONANT_ID,
  name: "Aria Sol",
  callsign: "Resonant",
  archetype: "crystalSpecialist",
  faction: "Crystal Ascendancy",
  biography: "A resonance physicist, crystal harmonics specialist, and energy systems architect who led the rediscovery of resonance engineering after recovering surviving Crystal Ascendancy archives — allied with the Afterlight Initiative, and still describes her own work as 'conducting an orchestra that was already playing.'",
  passive: { trigger: "onShieldBreak", bonus: { kind: "boostEfficiency", value: 0.05 } },
  active: { id: "crystal-pulse", name: "Crystal Pulse", cooldownMs: 10000 },
  ultimate: { id: "symphony-of-light", name: "Symphony of Light", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "harmony-doctrine",
    description: "Every successful resonance interaction builds Harmony — ability radius, energy economy, and resonance chains all rising together. Perfect Harmony unlocks enhanced ability versions.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "cooldownReduction", value: 0.04 } },
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

export const SOL_RESONANT_PROFILE: CommanderProfileDef = {
  commanderId: SOL_RESONANT_ID,
  class: "support",
  visualDesign: "An elegant crystal-lined combat suit in pearlescent white with cyan resonance veins, a floating crystalline halo, holographic waveform ribbons, a lightweight scientific cloak, crystal gauntlets, a luminescent visor, and soft energy trails that follow every movement.",
  voice: "Warm, gentle, confident, measured — calming even mid-battle.",
  secondaryAbility: { id: "harmonic-link", name: "Harmonic Link", cooldownMs: 13000 },
  masteryPassive: { trigger: "onCriticalHit", bonus: { kind: "statusDuration", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "sol-resonant:support:endgameNode",
    description: "Ascension III: the Support branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(SOL_RESONANT_ID, "resonance", "Resonance", [
      ["statusChance", 0.05],
      ["statusDuration", 0.05],
      ["boostEfficiency", 0.05],
      ["cooldownReduction", 0.04],
      ["resourceGain", 0.05],
      ["statusChance", 0.13],
    ]),
    branchNodes(SOL_RESONANT_ID, "support", "Support", [
      ["shieldRegeneration", 4],
      ["shieldCapacity", 0.06],
      ["boostEfficiency", 0.05],
      ["statusDuration", 0.05],
      ["experienceGain", 0.05],
      ["shieldRegeneration", 9],
    ]),
    branchNodes(SOL_RESONANT_ID, "conductor", "Conductor", [
      ["statusDuration", 0.05],
      ["movementSpeed", 0.04],
      ["criticalChance", 0.03],
      ["cooldownReduction", 0.05],
      ["resourceGain", 0.04],
      ["statusDuration", 0.15],
    ]),
  ],
  masteryTrackId: "commander:sol-resonant",
  personalMissions: [
    { beat: "originStory", name: "Resonance Station Epsilon", description: "Where she first heard a crystal lattice hold a note longer than physics said it should." },
    { beat: "recruitment", name: "The Crystal Choir", description: "An abandoned Resonance Cathedral, a collapsing crystal network, and a choice: harvest it or save it. She joins after the player chooses to save it." },
    { beat: "personalObjectives", name: "Every Note Catalogued", description: "No resonance pattern goes unrecorded, however faint." },
    { beat: "companionMissions", name: "Synchronised Escort", description: "Field work runs smoother in harmony — she makes sure everyone's rhythm lines up before the first shot fires." },
    { beat: "legendaryMission", name: "The Song of Stars", description: "The first Galactic Resonance Engine, planetary crystal arrays synchronised, resonance collapse prevented." },
    { beat: "finalResolution", name: "The Conductor", description: "A title earned one perfectly-timed harmony at a time." },
  ],
  loreId: "LORE_COMMANDER_RESONANT",
  relationships: [
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Close friend of Seraphina Cael — quantum probability and crystal resonance turn out to rhyme more than either expected." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Voss — different instruments, the same patient curiosity about what the galaxy is trying to say." },
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Collaborates with Ryker constantly — he builds the resonators, she tunes them, and neither will admit whose idea came first." },
  ],
  statisticKeys: ["commander:sol-resonant:usage", "commander:sol-resonant:victories", "commander:sol-resonant:harmonyPeaks"],
  cosmetics: [
    { kind: "armourVariants", id: "resonant-crystal-armour" },
    { kind: "animations", id: "resonant-harmonic-wings" },
    { kind: "colourThemes", id: "resonant-crystal-palette" },
  ],
  voiceLineIds: ["vo-resonant-mission-start", "vo-resonant-crystal-discovery", "vo-resonant-boss-encounter", "vo-resonant-ultimate", "vo-resonant-victory"],
  futureExpansionHooks: ["legendary-variant-resonant-the-conductor"],
};

export const SOL_RESONANT_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: SOL_RESONANT_ID,
  age: 32,
  species: "Human",
  homeworld: "Resonance Station Epsilon",
  psychologicalProfile: "Compassionate, creative, patient, observant, and curious, with a quietly idealistic streak — believes every form of energy has a pattern waiting to be understood.",
  leadershipStyle: "Leads by synchronisation, not command — makes sure everyone's rhythm lines up, then lets the team play itself.",
  animationStyle: "Fluid, graceful, and musical; movements flow continuously and every energy pulse synchronises with her animation.",
  musicMotif: "Crystal chimes and synth pads over light orchestral strings, electronic harmonics, and layered vocal ambience, representing resonance and hope.",
  personality: "idealistic",
  preferredShips: ["dawnspire", "aurelia-hull-mk1", "caduceus-mk1", "maelstrom-x1"],
  preferredWeapons: ["helios-prism-array", "novasplitter", "voidlance", "hailborn-array"],
  preferredEquipment: ["horizon-flux-capacitor", "aegis-bastion-array", "aegis-ward-projector", "nova-warden-hive"],
  preferredRelics: ["frost-shard", "warden-token", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["resonant-collectors", "field-dynamics", "barrier-theory", "ancient-conduit"],
  preferredBiomes: ["crystal-expanse", "crystal-fields-alpha", "ancient-core"],
  endingStory: "The Galactic Resonance Engine holds its note. Frontier colonies start lighting their reactors from crystal harmonics instead of unstable fusion, and she insists, every time someone thanks her for it, that the crystals were singing long before she learned to listen.",
  dialogueLibrary: [
    { category: "missionStart", line: "Everything has a rhythm. Listen carefully." },
    { category: "discoveries", line: "They're still singing..." },
    { category: "bosses", line: "Even chaos follows patterns." },
    { category: "legendaryMoments", line: "Let the galaxy remember its song." },
    { category: "victory", line: "Harmony always finds a way." },
  ],
  masteryChallenges: ["Reach Perfect Harmony 100 times across all expeditions.", "Link 500 allies or enemies via Harmonic Link.", "Complete 15 expeditions maintaining Harmony above 75% for the full expedition."],
};

export const SOL_RESONANT_RECRUITMENT: RecruitmentDef = {
  commanderId: SOL_RESONANT_ID,
  source: "story",
  requirement: "Complete \"The Crystal Choir\": stabilise the crystal network, prevent harmonic collapse, and preserve the network instead of harvesting it.",
};

export const SOL_RESONANT_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-sol-resonant",
  category: "commanders",
  title: "Aria Sol — The Resonant",
  lore: {
    summary: "Aria Sol led the rediscovery of resonance engineering after recovering surviving Crystal Ascendancy archives.",
    detailed: "Her work transformed forgotten crystal harmonics into safe energy technologies, helping power the first restored frontier colonies without relying on unstable fusion reactors. Close friends with Seraphina Cael, a professional admirer of Dr. Lyra Voss, and a constant collaborator with Elias Ryker, she treats every unexplained energy signature as an invitation.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:sol-resonant:harmonyPeaks",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [CAEL_WEAVER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, RYKER_ENGINEER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: SOL_RESONANT_ID },
};

export const SOL_RESONANT_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(SOL_RESONANT_RECRUITMENT.source);

export const FULL_ROSTER_WITH_RESONANT: readonly CommanderDef[] = [...FULL_ROSTER_WITH_HUNTER, SOL_RESONANT_COMMANDER];
export const FULL_PROFILES_WITH_RESONANT: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_HUNTER, SOL_RESONANT_PROFILE];
export const FULL_RECRUITMENT_WITH_RESONANT: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_HUNTER, SOL_RESONANT_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 27-commander roster via the
 * real AF-030 fingerprint/findOverlap law. */
export function resonantOverlapReport(): readonly string[] {
  const overlap = findOverlap(SOL_RESONANT_COMMANDER, FULL_ROSTER_WITH_HUNTER);
  return overlap ? [`${SOL_RESONANT_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function resonantArchitectureComplete(): boolean {
  const architecture = architectureFor(SOL_RESONANT_COMMANDER, SOL_RESONANT_PROFILE);
  return Object.values(architecture).every(Boolean);
}
