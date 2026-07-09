/**
 * Commander CMD-028 — Dorian Fen "The Beastmaster" (AF-126). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-eighth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-ninth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-013/023/027/016
 * per his spec'd relationships to exactly those four — the roster's
 * tenth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Mira Syn"), his archetype/class (droneCommander/hybrid) and
 * passive/signature trigger+bonus pairs are deliberately distinct from
 * Syn's support/scientist kit.
 *
 * Owner-authorised name substitution: the verbatim AF-126 prompt's
 * Full Name "Orion Vale" collides with the already-locked CMD-007
 * "Orion Vale 'The Voidrunner'" (AF-105), an entirely unrelated
 * character. Flagged to the Project Owner before implementation; the
 * Owner chose to rename this Commander to Dorian Fen rather than
 * implement a duplicate full name. See docs/modules/AF-126-*.md.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_ALCHEMIST, FULL_RECRUITMENT_WITH_ALCHEMIST, FULL_ROSTER_WITH_ALCHEMIST } from "./cmd027SoraHelix";
import { SYN_BIOFORGE_CODEX_ENTRY, SYN_BIOFORGE_ID } from "./cmd013MiraSyn";
import { ROSS_HORIZON_CODEX_ENTRY, ROSS_HORIZON_ID } from "./cmd023ElianaRoss";
import { HELIX_ALCHEMIST_CODEX_ENTRY, HELIX_ALCHEMIST_ID } from "./cmd027SoraHelix";
import { REYES_WARDEN_CODEX_ENTRY, REYES_WARDEN_ID } from "./cmd016AstridReyes";
import type { CodexEntryDef } from "../codex/codexData";

export const FEN_BEASTMASTER_ID = "fen-beastmaster";

export const FEN_BEASTMASTER_COMMANDER: CommanderDef = {
  id: FEN_BEASTMASTER_ID,
  name: "Dorian Fen",
  callsign: "Beastmaster",
  archetype: "droneCommander",
  faction: "Afterlight Initiative",
  biography: "A xenobiologist, wildlife handler, and ecological restoration commander who rebuilt humanity's relationship with alien ecosystems by proving that native species could become trusted expedition partners rather than obstacles — he believes every species deserves coexistence before conflict.",
  passive: { trigger: "onKill", bonus: { kind: "droneEffectiveness", value: 0.05 } },
  active: { id: "call-companion", name: "Call Companion", cooldownMs: 12000 },
  ultimate: { id: "wild-dominion", name: "Wild Dominion", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "companion-evolution-doctrine",
    description: "Every expedition teaches companions — experience unlocks new behaviours, evolution stages, unique appearances, rare mutations, and permanent companion bonds.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "experienceGain", value: 0.05 } },
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

export const FEN_BEASTMASTER_PROFILE: CommanderProfileDef = {
  commanderId: FEN_BEASTMASTER_ID,
  class: "hybrid",
  visualDesign: "White frontier ranger armour with an emerald expedition cloak, a living bio-scanner, a creature command gauntlet, a portable habitat pack, adaptive survival equipment, a wildlife tracking visor, and a small companion that constantly accompanies him.",
  voice: "Warm, confident, patient, encouraging, calm.",
  secondaryAbility: { id: "pack-command", name: "Pack Command", cooldownMs: 10000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "droneEffectiveness", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "fen-beastmaster:conservation:endgameNode",
    description: "Ascension III: the Conservation branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(FEN_BEASTMASTER_ID, "predator", "Predator", [
      ["damage", 0.05], ["criticalChance", 0.04], ["criticalDamage", 0.05],
      ["droneEffectiveness", 0.04], ["statusChance", 0.03], ["damage", 0.15],
    ]),
    branchNodes(FEN_BEASTMASTER_ID, "guardian", "Guardian", [
      ["shieldCapacity", 3], ["shieldRegeneration", 3], ["droneEffectiveness", 0.04],
      ["boostEfficiency", 0.03], ["cooldownReduction", 0.04], ["shieldCapacity", 10],
    ]),
    branchNodes(FEN_BEASTMASTER_ID, "conservation", "Conservation", [
      ["resourceGain", 0.05], ["experienceGain", 0.05], ["pickupRadius", 0.1],
      ["droneEffectiveness", 0.05], ["resourceGain", 0.04], ["droneEffectiveness", 0.15],
    ]),
  ],
  masteryTrackId: "commander:fen-beastmaster",
  personalMissions: [
    { beat: "originStory", name: "Verdant Expanse", description: "Where he learned that every species deserves coexistence before conflict, and that nature is commanded, never dominated." },
    { beat: "recruitment", name: "The Last Guardian", description: "The final breeding grounds of an endangered alien apex species to protect, illegal wildlife hunters to expose, ecological balance to restore, the species' survival to ensure. He joins after the player proves that preservation matters more than profit." },
    { beat: "personalObjectives", name: "Guests, Not Conquerors", description: "Poachers, species traffickers, and ecological exploitation all meet the same calm, unwavering refusal to let a species go extinct on his watch." },
    { beat: "companionMissions", name: "Let's Go, Partner", description: "Every companion he calls stays with him until it chooses otherwise, never the reverse." },
    { beat: "legendaryMission", name: "Children of Eden", description: "The legendary Genesis Sanctuary restored, extinct alien species recovered, the galaxy's first protected wildlife reserve created, the Legendary Alpha Genome unlocked." },
    { beat: "finalResolution", name: "The Warden of Life", description: "A title for someone who proved that balance, patiently rebuilt, was worth more than any conquest." },
  ],
  loreId: "LORE_COMMANDER_BEASTMASTER",
  relationships: [
    { subject: "otherCommanders", targetId: SYN_BIOFORGE_ID, dialogueHint: "Close friend of Mira Syn — a biologist who heals and a biologist who befriends were always going to end up trading field notes." },
    { subject: "otherCommanders", targetId: ROSS_HORIZON_ID, dialogueHint: "Professional respect for Eliana Ross — new horizons are worth exploring, but only the ones that get to keep their wildlife intact." },
    { subject: "otherCommanders", targetId: HELIX_ALCHEMIST_ID, dialogueHint: "Works with Sora Helix — her compounds heal ecosystems as readily as they solve equations, and he has never once had to ask her to be careful." },
    { subject: "otherCommanders", targetId: REYES_WARDEN_ID, dialogueHint: "Collaborates with Astrid Reyes — a warden who protects people and a warden who protects species turn out to speak the exact same language." },
  ],
  statisticKeys: ["commander:fen-beastmaster:usage", "commander:fen-beastmaster:victories", "commander:fen-beastmaster:companionsEvolved"],
  cosmetics: [
    { kind: "armourVariants", id: "beastmaster-warden-armour" },
    { kind: "animations", id: "beastmaster-companion-effects" },
    { kind: "colourThemes", id: "beastmaster-emerald-gold-palette" },
  ],
  voiceLineIds: ["vo-beastmaster-mission-start", "vo-beastmaster-companion-summoned", "vo-beastmaster-boss-encounter", "vo-beastmaster-ultimate", "vo-beastmaster-victory", "vo-beastmaster-low-health"],
  futureExpansionHooks: ["legendary-variant-beastmaster-the-warden-of-life"],
};

export const FEN_BEASTMASTER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: FEN_BEASTMASTER_ID,
  age: 41,
  species: "Human",
  homeworld: "Verdant Expanse",
  psychologicalProfile: "Compassionate, patient, fearless, observant, respectful, and protective — he believes every species deserves coexistence before conflict.",
  leadershipStyle: "Leads by example — he has already earned a companion's trust three times over before anyone else has finished deciding whether the creature is dangerous.",
  animationStyle: "Relaxed, natural; constant interaction with companions, animals respond dynamically, minimal unnecessary aggression.",
  musicMotif: "Organic orchestral themes and woodwind textures beneath nature ambience and gentle percussion, with hopeful strings, representing harmony.",
  personality: "compassionate",
  preferredShips: ["wayfarer-hull-mk2", "hivemother-mk1", "aurelia-hull-mk1", "dawnspire"],
  preferredWeapons: ["coil-ripper", "salvage-scattergun", "hailborn-array", "voidlance"],
  preferredEquipment: ["nova-warden-hive", "horizon-flux-capacitor", "barrier-plate", "vanguard-core"],
  preferredRelics: ["warden-token", "veil-fragment", "conduit-loop", "static-node"],
  preferredResearch: ["survey-protocols", "deep-scanning", "resonant-collectors", "expanded-archives"],
  preferredBiomes: ["living-ecospheres", "meridian-rest-frontier", "derelict-expanse"],
  endingStory: "Children of Eden keeps recovering extinct alien species long after the Legendary Alpha Genome is unlocked, and every biosphere he ever restored still counts among the safest, most thriving refuges in the galaxy. He still keeps a running count of every companion bond formed — to him, that number has always mattered more than any battle won.",
  dialogueLibrary: [
    { category: "missionStart", line: "We're guests here." },
    { category: "combat", line: "Let's go, partner." },
    { category: "bosses", line: "Every apex predator eventually meets another." },
    { category: "legendaryMoments", line: "The wild remembers." },
    { category: "victory", line: "Balance restored." },
    { category: "lowHealth", line: "Stay with me... both of you." },
  ],
  masteryChallenges: ["Complete 25 expeditions without losing a single companion.", "Evolve a companion to its final stage in 50 separate encounters.", "Complete \"Children of Eden\" without a single wildlife casualty."],
};

export const FEN_BEASTMASTER_RECRUITMENT: RecruitmentDef = {
  commanderId: FEN_BEASTMASTER_ID,
  source: "exploration",
  requirement: "Complete \"The Last Guardian\": protect the final breeding grounds of an endangered alien apex species, expose illegal wildlife hunters, restore ecological balance, and ensure the species survives.",
};

export const FEN_BEASTMASTER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-fen-beastmaster",
  category: "commanders",
  title: "Dorian Fen — The Beastmaster",
  lore: {
    summary: "Dorian Fen rebuilt humanity's relationship with alien ecosystems by proving that native species could become trusted expedition partners rather than obstacles.",
    detailed: "His conservation initiatives restored dozens of collapsing biospheres and established the Galactic Wildlife Accord, protecting countless species while enriching frontier exploration. Close friends with Mira Syn, professionally respectful of Eliana Ross, working with Sora Helix, and collaborating with Astrid Reyes, he distrusts poachers, species traffickers, and ecological exploitation in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:fen-beastmaster:companionsEvolved",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [SYN_BIOFORGE_CODEX_ENTRY.id, ROSS_HORIZON_CODEX_ENTRY.id, HELIX_ALCHEMIST_CODEX_ENTRY.id, REYES_WARDEN_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: FEN_BEASTMASTER_ID },
};

export const FEN_BEASTMASTER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(FEN_BEASTMASTER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_BEASTMASTER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_ALCHEMIST, FEN_BEASTMASTER_COMMANDER];
export const FULL_PROFILES_WITH_BEASTMASTER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_ALCHEMIST, FEN_BEASTMASTER_PROFILE];
export const FULL_RECRUITMENT_WITH_BEASTMASTER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_ALCHEMIST, FEN_BEASTMASTER_RECRUITMENT];

export function beastmasterOverlapReport(): readonly string[] {
  const overlap = findOverlap(FEN_BEASTMASTER_COMMANDER, FULL_ROSTER_WITH_ALCHEMIST);
  return overlap ? [`${FEN_BEASTMASTER_ID} overlaps ${overlap}`] : [];
}

export function beastmasterArchitectureComplete(): boolean {
  const architecture = architectureFor(FEN_BEASTMASTER_COMMANDER, FEN_BEASTMASTER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
