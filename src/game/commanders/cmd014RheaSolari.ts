/**
 * Commander CMD-014 — Rhea Solari "The Photon" (AF-112). The canonical,
 * individually-specified implementation of Afterlight's fourteenth
 * fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A fifteenth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-011/006/001 per her spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_BIOFORGE, FULL_RECRUITMENT_WITH_BIOFORGE, FULL_ROSTER_WITH_BIOFORGE } from "./cmd013MiraSyn";
import { ASH_TEMPEST_CODEX_ENTRY, ASH_TEMPEST_ID } from "./cmd011ValenAsh";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const SOLARI_PHOTON_ID = "solari-photon";

export const SOLARI_PHOTON_COMMANDER: CommanderDef = {
  id: SOLARI_PHOTON_ID,
  name: "Rhea Solari",
  callsign: "Photon",
  archetype: "assault",
  faction: "Afterlight Initiative",
  biography: "A photon systems scientist, energy weapons specialist, and stellar array commander who restored humanity's first functioning stellar energy array after the Collapse — she believes every sunrise proves humanity deserves another chance.",
  passive: { trigger: "onKill", bonus: { kind: "damage", value: 0.05 } },
  active: { id: "photon-lance", name: "Photon Lance", cooldownMs: 12000 },
  ultimate: { id: "helios-cascade", name: "Helios Cascade", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "luminosity-doctrine",
    description: "Every successful beam interaction builds Luminosity — larger beams, longer reflections, improved critical damage, and enhanced solar abilities follow.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "criticalDamage", value: 0.08 } },
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

export const SOLARI_PHOTON_PROFILE: CommanderProfileDef = {
  commanderId: SOLARI_PHOTON_ID,
  class: "scientist",
  visualDesign: "A brilliant white combat suit with gold solar plating, radiant energy wings, floating solar mirrors, a golden visor, photon gauntlets, and a solar reactor backpack — constant shimmering light follows every movement.",
  voice: "Bright, warm, confident, energetic, encouraging.",
  secondaryAbility: { id: "solar-mirrors", name: "Solar Mirrors", cooldownMs: 13000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "solari-photon:radiance:endgameNode",
    description: "Ascension III: the Radiance branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(SOLARI_PHOTON_ID, "photon-weapons", "Photon Weapons", [
      ["damage", 0.05], ["criticalDamage", 0.08], ["criticalChance", 0.05],
      ["damage", 0.06], ["statusChance", 0.04], ["criticalDamage", 0.16],
    ]),
    branchNodes(SOLARI_PHOTON_ID, "solar-engineering", "Solar Engineering", [
      ["resourceGain", 0.05], ["cooldownReduction", 0.04], ["cooldownReduction", 0.05],
      ["resourceGain", 0.06], ["boostEfficiency", 0.05], ["cooldownReduction", 0.15],
    ]),
    branchNodes(SOLARI_PHOTON_ID, "radiance", "Radiance", [
      ["shieldRegeneration", 3], ["movementSpeed", 0.04], ["pickupRadius", 0.05],
      ["experienceGain", 0.05], ["shieldCapacity", 4], ["movementSpeed", 0.12],
    ]),
  ],
  masteryTrackId: "commander:solari-photon",
  personalMissions: [
    { beat: "originStory", name: "Helios Array", description: "Where she learned that hope travels at the speed of light, and every sunrise is a second chance." },
    { beat: "recruitment", name: "The Dying Sun", description: "A failing stellar energy collector to repair, planetary power to restore, civilian engineers to protect, stellar collapse to prevent. She joins after the player chooses to save millions of civilians despite sacrificing valuable technology." },
    { beat: "personalObjectives", name: "No Hoarded Light", description: "Energy monopolies and planetary exploitation both draw the same bright, immediate refusal." },
    { beat: "companionMissions", name: "Shared Sunrise", description: "She routes a Solar Mirror toward every ally's darkest sightline before she routes one toward her own." },
    { beat: "legendaryMission", name: "The First Dawn", description: "The legendary Helios Array restarted, planetary mirrors synchronised, the galaxy's largest solar network restored, the Legendary Stellar Prism unlocked." },
    { beat: "finalResolution", name: "The Dawnbringer", description: "A title for someone who measured every victory in how many more sunrises it bought." },
  ],
  loreId: "LORE_COMMANDER_PHOTON",
  relationships: [
    { subject: "otherCommanders", targetId: ASH_TEMPEST_ID, dialogueHint: "Close friend of Valen Ash — light and storm are opposite weathers with the same appetite for turning chaos into precision." },
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Scientific collaboration with Aria Sol — resonance and photon charge both reward patient listening to something most people only see as noise." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Lyra Voss — her caution about the unknown is the same discipline that keeps a solar array from burning out." },
  ],
  statisticKeys: ["commander:solari-photon:usage", "commander:solari-photon:victories", "commander:solari-photon:beamReflections"],
  cosmetics: [
    { kind: "armourVariants", id: "photon-solar-armour" },
    { kind: "animations", id: "photon-radiant-beams" },
    { kind: "colourThemes", id: "photon-solar-palette" },
  ],
  voiceLineIds: ["vo-photon-mission-start", "vo-photon-solar-device", "vo-photon-boss-encounter", "vo-photon-ultimate", "vo-photon-victory"],
  futureExpansionHooks: ["legendary-variant-photon-the-dawnbringer"],
};

export const SOLARI_PHOTON_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: SOLARI_PHOTON_ID,
  age: 31,
  species: "Human",
  homeworld: "Helios Array",
  psychologicalProfile: "Optimistic, energetic, fearless, brilliant, curious, and inspirational — she believes every sunrise proves humanity deserves another chance.",
  leadershipStyle: "Leads by illumination — she makes the path forward visible for everyone else before she takes a single step down it herself.",
  animationStyle: "Elegant, fast, confident; light trails follow her movement, and her abilities flow continuously into one another.",
  musicMotif: "Orchestral brass and bright strings over hopeful piano and radiant synthesizers, representing optimism.",
  personality: "optimistic",
  preferredShips: ["dawnspire", "aurelia-hull-mk1", "bastion-hull-mk1", "maelstrom-x1"],
  preferredWeapons: ["helios-prism-array", "foundry-sunlance", "voidlance", "paragon-flux-driver"],
  preferredEquipment: ["horizon-flux-capacitor", "vanguard-core", "aegis-ward-projector", "aegis-bastion-array"],
  preferredRelics: ["cinder-heart", "conduit-loop", "static-node", "singularity-keepsake"],
  preferredResearch: ["coherent-beams", "field-dynamics", "ancient-conduit", "resonant-collectors"],
  preferredBiomes: ["solar-wastes", "crystal-expanse", "ancient-core"],
  endingStory: "The Helios Array keeps every reflector synchronised long after the last dying star is stabilised, and every frontier world she visited afterward remembers the day the lights came back on. She still calls a fully-charged array \"nearly there\" — never finished, because there's always one more sunrise worth reaching for.",
  dialogueLibrary: [
    { category: "missionStart", line: "Let's give this galaxy another sunrise." },
    { category: "combat", line: "It's beautiful... it's still working." },
    { category: "bosses", line: "Even stars outlive tyrants." },
    { category: "legendaryMoments", line: "Rise with the dawn!" },
    { category: "victory", line: "Hope travels at the speed of light." },
  ],
  masteryChallenges: ["Chain a single Photon Lance through 8 reflective surfaces in one shot.", "Reach maximum Luminosity in 50 separate encounters.", "Complete \"The First Dawn\" without a single Solar Mirror destroyed."],
};

export const SOLARI_PHOTON_RECRUITMENT: RecruitmentDef = {
  commanderId: SOLARI_PHOTON_ID,
  source: "campaign",
  requirement: "Complete \"The Dying Sun\": repair a failing stellar energy collector, restore planetary power, protect civilian engineers, and prevent stellar collapse.",
};

export const SOLARI_PHOTON_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-solari-photon",
  category: "commanders",
  title: "Rhea Solari — The Photon",
  lore: {
    summary: "Rhea Solari restored humanity's first functioning stellar energy array after the Collapse, ending decades of energy shortages across multiple frontier systems.",
    detailed: "Her work proved that the stars themselves could once again become the foundation of civilisation's future. Close friends with Valen Ash, a scientific collaborator with Aria Sol, and professionally respectful of Dr. Lyra Voss, she distrusts energy monopolies and planetary exploitation in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:solari-photon:beamReflections",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [ASH_TEMPEST_CODEX_ENTRY.id, SOL_RESONANT_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: SOLARI_PHOTON_ID },
};

export const SOLARI_PHOTON_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(SOLARI_PHOTON_RECRUITMENT.source);

export const FULL_ROSTER_WITH_PHOTON: readonly CommanderDef[] = [...FULL_ROSTER_WITH_BIOFORGE, SOLARI_PHOTON_COMMANDER];
export const FULL_PROFILES_WITH_PHOTON: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_BIOFORGE, SOLARI_PHOTON_PROFILE];
export const FULL_RECRUITMENT_WITH_PHOTON: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_BIOFORGE, SOLARI_PHOTON_RECRUITMENT];

export function photonOverlapReport(): readonly string[] {
  const overlap = findOverlap(SOLARI_PHOTON_COMMANDER, FULL_ROSTER_WITH_BIOFORGE);
  return overlap ? [`${SOLARI_PHOTON_ID} overlaps ${overlap}`] : [];
}

export function photonArchitectureComplete(): boolean {
  const architecture = architectureFor(SOLARI_PHOTON_COMMANDER, SOLARI_PHOTON_PROFILE);
  return Object.values(architecture).every(Boolean);
}
