/**
 * Commander CMD-030 — Lysandra Aether "The Celestial" (AF-128). The
 * canonical, individually-specified implementation of Afterlight's
 * thirtieth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A thirty-first codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-001/019/010/023
 * per her spec'd relationships to exactly those four — the roster's
 * twelfth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Photon, Oracle and Horizon Commanders"), her archetype/class
 * (orbitalCommander/hybrid) and passive/signature trigger+bonus pairs
 * are deliberately distinct from Solari's assault/scientist kit,
 * Myrr's support/support kit, and Ross's droneCommander/support kit —
 * the roster's third TRIPLE overlap-reduction directive.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_VOIDWALKER, FULL_RECRUITMENT_WITH_VOIDWALKER, FULL_ROSTER_WITH_VOIDWALKER } from "./cmd029VegaNoctis";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { MYRR_ORACLE_CODEX_ENTRY, MYRR_ORACLE_ID } from "./cmd019SeleneMyrr";
import { VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { ROSS_HORIZON_CODEX_ENTRY, ROSS_HORIZON_ID } from "./cmd023ElianaRoss";
import type { CodexEntryDef } from "../codex/codexData";

export const AETHER_CELESTIAL_ID = "aether-celestial";

export const AETHER_CELESTIAL_COMMANDER: CommanderDef = {
  id: AETHER_CELESTIAL_ID,
  name: "Lysandra Aether",
  callsign: "Celestial",
  archetype: "orbitalCommander",
  faction: "Afterlight Initiative",
  biography: "An astrophysicist, celestial navigation director, and cosmic energy research commander who restored the forgotten network of ancient observatories that once united humanity's earliest interstellar explorers — she believes humanity was never meant to conquer the stars, only to become worthy of them.",
  passive: { trigger: "onKill", bonus: { kind: "criticalChance", value: 0.04 } },
  active: { id: "starfall", name: "Starfall", cooldownMs: 12000 },
  ultimate: { id: "birth-of-a-galaxy", name: "Birth of a Galaxy", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "celestial-harmony-doctrine",
    description: "Every astronomical interaction increases Harmony — higher Harmony unlocks larger constellations, improved Starfall, longer celestial pathways, rare astronomical events, and permanent expedition blessings.",
    passive: { trigger: "onLowHealth", bonus: { kind: "cooldownReduction", value: 0.04 } },
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

export const AETHER_CELESTIAL_PROFILE: CommanderProfileDef = {
  commanderId: AETHER_CELESTIAL_ID,
  class: "hybrid",
  visualDesign: "Flowing white ceremonial armour with gold celestial trim, an animated constellation cloak, orbiting miniature stars, a living galaxy halo, a solar crown, cosmic energy wings, and a deep blue crystal visor — every movement leaves constellations behind.",
  voice: "Warm, wise, gentle, inspirational, timeless.",
  secondaryAbility: { id: "constellation-network", name: "Constellation Network", cooldownMs: 14000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "aether-celestial:cosmicAscension:endgameNode",
    description: "Ascension III: the Cosmic Ascension branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(AETHER_CELESTIAL_ID, "stars", "Stars", [
      ["criticalDamage", 0.05], ["damage", 0.04], ["criticalChance", 0.04],
      ["statusChance", 0.03], ["cooldownReduction", 0.04], ["criticalDamage", 0.15],
    ]),
    branchNodes(AETHER_CELESTIAL_ID, "celestialGuidance", "Celestial Guidance", [
      ["movementSpeed", 0.04], ["shieldRegeneration", 3], ["boostEfficiency", 0.04],
      ["criticalChance", 0.03], ["shieldCapacity", 3], ["movementSpeed", 0.14],
    ]),
    branchNodes(AETHER_CELESTIAL_ID, "cosmicAscension", "Cosmic Ascension", [
      ["cooldownReduction", 0.05], ["resourceGain", 0.05], ["experienceGain", 0.04],
      ["damage", 0.04], ["statusDuration", 0.04], ["cooldownReduction", 0.15],
    ]),
  ],
  masteryTrackId: "commander:aether-celestial",
  personalMissions: [
    { beat: "originStory", name: "Celestia Observatory", description: "Where she learned that humanity was never meant to conquer the stars, only to become worthy of them." },
    { beat: "recruitment", name: "When Stars Remember", description: "The oldest observatory ever constructed to repair, a forgotten constellation network to realign, a supernova catastrophe to prevent, humanity's connection to the galaxy to restore. She joins after the player chooses preservation of cosmic knowledge over military gain." },
    { beat: "personalObjectives", name: "Worthy of the Stars", description: "Civilisations that exploit stars without understanding them meet the same calm, unwavering disappointment, never anger." },
    { beat: "companionMissions", name: "They Never Stopped Shining", description: "Every observatory she restores keeps watching long after she has moved on to the next one." },
    { beat: "legendaryMission", name: "The First Light", description: "The birthplace of the Afterlight Network reached, the galaxy's oldest star witnessed, the Celestial Engine restored, the Legendary Astral Heart unlocked." },
    { beat: "finalResolution", name: "The Stargazer", description: "A title for someone who proved that hope, patiently tended, could outlast even the dark between stars." },
  ],
  loreId: "LORE_COMMANDER_CELESTIAL",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Close friend of Dr. Lyra Voss — the first explorer and the first stargazer have always understood each other without needing the observatory lights on." },
    { subject: "otherCommanders", targetId: MYRR_ORACLE_ID, dialogueHint: "Professional respect for Selene Myrr — probability and prophecy read the same sky from different angles, and Lysandra has never once dismissed either." },
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Scientific collaboration with Aurelion Vex — time and starlight are both just distance measured differently, and the two of them have spent years proving it." },
    { subject: "otherCommanders", targetId: ROSS_HORIZON_ID, dialogueHint: "Works with Eliana Ross — every new horizon Ross maps, Lysandra has usually already charted from above." },
  ],
  statisticKeys: ["commander:aether-celestial:usage", "commander:aether-celestial:victories", "commander:aether-celestial:constellationsAligned"],
  cosmetics: [
    { kind: "armourVariants", id: "celestial-stargazer-armour" },
    { kind: "animations", id: "celestial-constellation-effects" },
    { kind: "colourThemes", id: "celestial-cosmic-palette" },
  ],
  voiceLineIds: ["vo-celestial-mission-start", "vo-celestial-ancient-observatory", "vo-celestial-boss-encounter", "vo-celestial-ultimate", "vo-celestial-victory", "vo-celestial-low-health"],
  futureExpansionHooks: ["legendary-variant-celestial-the-stargazer"],
};

export const AETHER_CELESTIAL_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: AETHER_CELESTIAL_ID,
  age: 42,
  species: "Human",
  homeworld: "Celestia Observatory",
  psychologicalProfile: "Wise, calm, patient, compassionate, curious, and visionary — she believes humanity was never meant to conquer the stars, only to become worthy of them.",
  leadershipStyle: "Leads by inspiration — she has already shown everyone the constellation before anyone else has finished asking where to look.",
  animationStyle: "Elegant, weightless, majestic; constellations form beneath her footsteps, stars orbit naturally, her abilities resemble astronomical events.",
  musicMotif: "Large orchestra and celestial choir beneath soft piano and ethereal synthesizers, with a cosmic ambience, representing hope across eternity.",
  personality: "visionary",
  preferredShips: ["dawnspire", "aurelia-hull-mk1", "caduceus-mk1", "bastion-hull-mk1"],
  preferredWeapons: ["helios-prism-array", "foundry-sunlance", "novasplitter", "atlas-cluster-battery"],
  preferredEquipment: ["horizon-flux-capacitor", "aegis-bastion-array", "nova-warden-hive", "vanguard-core"],
  preferredRelics: ["ember-core", "singularity-keepsake", "veil-fragment", "conduit-loop"],
  preferredResearch: ["unified-theory", "ancient-conduit", "deep-scanning", "expanded-archives"],
  preferredBiomes: ["solar-wastes", "singularity-zone", "ancient-core"],
  endingStory: "The First Light keeps illuminating the birthplace of the Afterlight Network long after the Legendary Astral Heart is unlocked, and every observatory she ever restored still tracks the sky for a galaxy that finally remembers to look up. She still counts every constellation realigned — to her, that number has always mattered more than any war ended.",
  dialogueLibrary: [
    { category: "missionStart", line: "The stars have waited for us." },
    { category: "combat", line: "They never stopped shining." },
    { category: "bosses", line: "You stand beneath eternity." },
    { category: "legendaryMoments", line: "Become part of the cosmos." },
    { category: "victory", line: "The galaxy remembers humanity." },
    { category: "lowHealth", line: "The stars... still guide us..." },
  ],
  masteryChallenges: ["Complete 25 expeditions maintaining maximum Harmony throughout.", "Realign every constellation network in 50 separate encounters.", "Complete \"The First Light\" without a single lost observatory."],
};

export const AETHER_CELESTIAL_RECRUITMENT: RecruitmentDef = {
  commanderId: AETHER_CELESTIAL_ID,
  source: "legendaryMissions",
  requirement: "Complete \"When Stars Remember\": repair the oldest observatory ever constructed, realign a forgotten constellation network, prevent a supernova catastrophe, and restore humanity's connection to the galaxy by choosing preservation of cosmic knowledge over military gain.",
};

export const AETHER_CELESTIAL_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-aether-celestial",
  category: "commanders",
  title: "Lysandra Aether — The Celestial",
  lore: {
    summary: "Lysandra Aether restored the forgotten network of ancient observatories that once united humanity's earliest interstellar explorers.",
    detailed: "By reconnecting stellar navigation systems across the galaxy, she transformed the night sky from a symbol of isolation into one of hope, guiding a new generation of expeditions toward humanity's brightest future. Close friends with Dr. Lyra Voss, professionally respectful of Selene Myrr, in scientific collaboration with Aurelion Vex, and working with Eliana Ross, she distrusts civilisations that exploit stars without understanding them.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:aether-celestial:constellationsAligned",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [LYRA_VOSS_CODEX_ENTRY.id, MYRR_ORACLE_CODEX_ENTRY.id, VEX_CHRONOMANCER_CODEX_ENTRY.id, ROSS_HORIZON_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: AETHER_CELESTIAL_ID },
};

export const AETHER_CELESTIAL_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(AETHER_CELESTIAL_RECRUITMENT.source);

export const FULL_ROSTER_WITH_CELESTIAL: readonly CommanderDef[] = [...FULL_ROSTER_WITH_VOIDWALKER, AETHER_CELESTIAL_COMMANDER];
export const FULL_PROFILES_WITH_CELESTIAL: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_VOIDWALKER, AETHER_CELESTIAL_PROFILE];
export const FULL_RECRUITMENT_WITH_CELESTIAL: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_VOIDWALKER, AETHER_CELESTIAL_RECRUITMENT];

export function celestialOverlapReport(): readonly string[] {
  const overlap = findOverlap(AETHER_CELESTIAL_COMMANDER, FULL_ROSTER_WITH_VOIDWALKER);
  return overlap ? [`${AETHER_CELESTIAL_ID} overlaps ${overlap}`] : [];
}

export function celestialArchitectureComplete(): boolean {
  const architecture = architectureFor(AETHER_CELESTIAL_COMMANDER, AETHER_CELESTIAL_PROFILE);
  return Object.values(architecture).every(Boolean);
}
