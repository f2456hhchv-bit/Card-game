/**
 * Commander CMD-013 — Dr. Mira Syn "The Bioforge" (AF-111). The
 * canonical, individually-specified implementation of Afterlight's
 * thirteenth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A fourteenth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-006/001/004
 * per her spec'd relationships to exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_PHANTOM, FULL_RECRUITMENT_WITH_PHANTOM, FULL_ROSTER_WITH_PHANTOM } from "./cmd012NyxKorven";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import type { CodexEntryDef } from "../codex/codexData";

export const SYN_BIOFORGE_ID = "syn-bioforge";

export const SYN_BIOFORGE_COMMANDER: CommanderDef = {
  id: SYN_BIOFORGE_ID,
  name: "Dr. Mira Syn",
  callsign: "Bioforge",
  archetype: "support",
  faction: "Afterlight Initiative",
  biography: "A bioengineer, genetic systems director, and xenobiology specialist who rebuilt humanity's lost xenobiology programme after recovering intact genetic archives from forgotten colonies — she believes every living organism deserves understanding before judgement.",
  passive: { trigger: "onKill", bonus: { kind: "shieldRegeneration", value: 4 } },
  active: { id: "living-bloom", name: "Living Bloom", cooldownMs: 13000 },
  ultimate: { id: "genesis-protocol", name: "Genesis Protocol", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "evolution-level-doctrine",
    description: "Every successful biological interaction raises Evolution — unlocking advanced mutations, larger living structures, improved healing, and rare biological discoveries.",
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

export const SYN_BIOFORGE_PROFILE: CommanderProfileDef = {
  commanderId: SYN_BIOFORGE_ID,
  class: "scientist",
  visualDesign: "A white biological research suit with emerald energy veins, living bio-organic shoulder armour, floating DNA holograms, adaptive vine-like gauntlets, a portable laboratory backpack, and a luminescent green visor — subtle organic growths integrated throughout her equipment.",
  voice: "Gentle, calm, warm, confident, encouraging.",
  secondaryAbility: { id: "genome-rewrite", name: "Genome Rewrite", cooldownMs: 14000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "syn-bioforge:xenobiology:endgameNode",
    description: "Ascension III: the Xenobiology branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(SYN_BIOFORGE_ID, "mutation", "Mutation", [
      ["experienceGain", 0.05], ["statusChance", 0.04], ["shieldRegeneration", 3],
      ["damage", 0.04], ["criticalChance", 0.04], ["shieldRegeneration", 10],
    ]),
    branchNodes(SYN_BIOFORGE_ID, "cultivation", "Cultivation", [
      ["shieldRegeneration", 4], ["shieldCapacity", 4], ["resourceGain", 0.05],
      ["pickupRadius", 0.05], ["experienceGain", 0.05], ["shieldRegeneration", 12],
    ]),
    branchNodes(SYN_BIOFORGE_ID, "xenobiology", "Xenobiology", [
      ["statusDuration", 0.05], ["shieldCapacity", 0.05], ["resourceGain", 0.05],
      ["experienceGain", 0.06], ["statusChance", 0.05], ["experienceGain", 0.15],
    ]),
  ],
  masteryTrackId: "commander:syn-bioforge",
  personalMissions: [
    { beat: "originStory", name: "Eden Genesis Station", description: "Where she learned that evolution never truly stops, and that every living organism deserves understanding before judgement." },
    { beat: "recruitment", name: "The Last Seed", description: "The final surviving genetic archive from a dying world to recover, endangered native species to protect, illegal bio-harvesting to prevent, a planetary ecosystem to restore. She joins after the player chooses ecological preservation over immediate military gain." },
    { beat: "personalObjectives", name: "No Silent Extinctions", description: "Biological weapons research, genetic exploitation, and species extinction all draw the same quiet, immovable refusal." },
    { beat: "companionMissions", name: "Field Cultivation", description: "She grows a living structure at every campsite, whether or not anyone else notices, because the ecosystem doesn't care whether it's watched." },
    { beat: "legendaryMission", name: "The Garden Beyond Stars", description: "The mythical Genesis Vault restored, extinct DNA archives recovered, an ancient ecosystem revived, the Legendary Genesis Genome unlocked." },
    { beat: "finalResolution", name: "The Gardener", description: "A title for someone who measured victory in worlds that got to keep their future." },
  ],
  loreId: "LORE_COMMANDER_BIOFORGE",
  relationships: [
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Close friend of Aria Sol — resonance and genetics both listen for patterns most people miss entirely." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Scientific collaboration with Dr. Lyra Voss — her caution about the unknown and Mira's patience with living things turn out to be the same discipline." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Professional respect for Seraphina Cael — a quantum weaver and a bioengineer both learned that nature negotiates on its own terms." },
  ],
  statisticKeys: ["commander:syn-bioforge:usage", "commander:syn-bioforge:victories", "commander:syn-bioforge:ecosystemsRestored"],
  cosmetics: [
    { kind: "armourVariants", id: "bioforge-genesis-armour" },
    { kind: "animations", id: "bioforge-floral-particles" },
    { kind: "colourThemes", id: "bioforge-emerald-palette" },
  ],
  voiceLineIds: ["vo-bioforge-mission-start", "vo-bioforge-biological-discovery", "vo-bioforge-boss-encounter", "vo-bioforge-ultimate", "vo-bioforge-victory"],
  futureExpansionHooks: ["legendary-variant-bioforge-the-gardener"],
};

export const SYN_BIOFORGE_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: SYN_BIOFORGE_ID,
  age: 40,
  species: "Human",
  homeworld: "Eden Genesis Station",
  psychologicalProfile: "Compassionate, patient, brilliant, empathetic, curious, and protective — she believes every living organism deserves understanding before judgement.",
  leadershipStyle: "Leads by cultivation, not command — she grows the conditions for a team to thrive rather than directing every action herself.",
  animationStyle: "Graceful, precise, scientific; organic growth accompanies her abilities, with constant sample collection between engagements.",
  musicMotif: "Organic ambience and soft strings over nature-inspired synths, piano, and gentle choir, representing life and renewal.",
  personality: "compassionate",
  preferredShips: ["caduceus-mk1", "aurelia-hull-mk1", "hivemother-mk1", "wayfarer-hull-mk2"],
  preferredWeapons: ["hailborn-array", "novasplitter", "helios-prism-array", "coil-ripper-mk2"],
  preferredEquipment: ["aegis-ward-projector", "vanguard-core", "horizon-flux-capacitor", "aegis-bastion-array"],
  preferredRelics: ["warden-token", "frost-shard", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["survey-protocols", "deep-scanning", "expanded-archives", "barrier-theory"],
  preferredBiomes: ["living-ecospheres", "meridian-rest-frontier", "frozen-reach"],
  endingStory: "The Genesis Genome keeps every restored world's ecosystem breathing long after the last archive is catalogued, and every colony she visited afterward remembers her by the plants that shouldn't have survived there but did. She still logs every specimen by what it needs to thrive, never by what it's worth.",
  dialogueLibrary: [
    { category: "missionStart", line: "Life always finds another path." },
    { category: "combat", line: "Incredible... evolution never truly stops." },
    { category: "bosses", line: "Even predators are part of nature." },
    { category: "legendaryMoments", line: "Grow. Adapt. Endure." },
    { category: "victory", line: "Another world has a future." },
  ],
  masteryChallenges: ["Restore 25 planetary ecosystems to full Evolution without losing a native species.", "Heal 100,000 cumulative shield points through Living Bloom structures.", "Complete \"The Garden Beyond Stars\" without a single ally mutation lapsing."],
};

export const SYN_BIOFORGE_RECRUITMENT: RecruitmentDef = {
  commanderId: SYN_BIOFORGE_ID,
  source: "research",
  requirement: "Complete \"The Last Seed\": recover the final surviving genetic archive from a dying world, protect its endangered native species, prevent illegal bio-harvesting, and restore the planetary ecosystem.",
};

export const SYN_BIOFORGE_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-syn-bioforge",
  category: "commanders",
  title: "Dr. Mira Syn — The Bioforge",
  lore: {
    summary: "Dr. Mira Syn rebuilt humanity's lost xenobiology programme after recovering intact genetic archives from forgotten colonies.",
    detailed: "Her work restored countless endangered ecosystems and proved that rebuilding civilisation required protecting life in all its forms — not merely surviving among the stars. Close friends with Aria Sol, a scientific collaborator with Dr. Lyra Voss, and professionally respectful of Seraphina Cael, she distrusts biological weapons research, genetic exploitation, and species extinction in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:syn-bioforge:ecosystemsRestored",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [SOL_RESONANT_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: SYN_BIOFORGE_ID },
};

export const SYN_BIOFORGE_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(SYN_BIOFORGE_RECRUITMENT.source);

export const FULL_ROSTER_WITH_BIOFORGE: readonly CommanderDef[] = [...FULL_ROSTER_WITH_PHANTOM, SYN_BIOFORGE_COMMANDER];
export const FULL_PROFILES_WITH_BIOFORGE: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_PHANTOM, SYN_BIOFORGE_PROFILE];
export const FULL_RECRUITMENT_WITH_BIOFORGE: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_PHANTOM, SYN_BIOFORGE_RECRUITMENT];

export function bioforgeOverlapReport(): readonly string[] {
  const overlap = findOverlap(SYN_BIOFORGE_COMMANDER, FULL_ROSTER_WITH_PHANTOM);
  return overlap ? [`${SYN_BIOFORGE_ID} overlaps ${overlap}`] : [];
}

export function bioforgeArchitectureComplete(): boolean {
  const architecture = architectureFor(SYN_BIOFORGE_COMMANDER, SYN_BIOFORGE_PROFILE);
  return Object.values(architecture).every(Boolean);
}
