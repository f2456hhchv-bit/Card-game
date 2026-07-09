/**
 * Commander CMD-020 — Caelus Nova "The Architect" (AF-118). The
 * canonical, individually-specified implementation of Afterlight's
 * twentieth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-first codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-003/009/008/001
 * per his spec'd relationships to exactly those four — the roster's
 * second commander with four spec'd relationships instead of three,
 * and the first "Inspired By" relationship (with Dr. Lyra Voss). Per
 * the spec's own self-review directive ("Reduce overlap with Elias
 * Ryker and Nova Iskander"), his archetype/class (orbitalCommander/
 * support) and passive/signature trigger+bonus pairs are deliberately
 * distinct from both Ryker's engineer/engineer kit and Iskander's
 * droneCommander/hybrid kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_ORACLE, FULL_RECRUITMENT_WITH_ORACLE, FULL_ROSTER_WITH_ORACLE } from "./cmd019SeleneMyrr";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { THORNE_STARFORGED_CODEX_ENTRY, THORNE_STARFORGED_ID } from "./cmd009CassiaThorne";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const NOVA_ARCHITECT_ID = "nova-architect";

export const NOVA_ARCHITECT_COMMANDER: CommanderDef = {
  id: NOVA_ARCHITECT_ID,
  name: "Caelus Nova",
  callsign: "Architect",
  archetype: "orbitalCommander",
  faction: "Atlas Dynamics",
  biography: "A megastructure engineer, orbital construction director, and stellar infrastructure commander who became the chief architect behind humanity's post-Collapse reconstruction programme — he believes civilisation is humanity's greatest invention, and every rebuilt structure is proof that hope survives.",
  passive: { trigger: "onKill", bonus: { kind: "shieldCapacity", value: 4 } },
  active: { id: "rapid-fabrication", name: "Rapid Fabrication", cooldownMs: 12000 },
  ultimate: { id: "frontier-citadel", name: "Frontier Citadel", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "construction-progress-doctrine",
    description: "Every completed structure generates Progress — advanced blueprints, larger structures, faster construction, unique infrastructure bonuses, and expedition-wide engineering upgrades follow.",
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

export const NOVA_ARCHITECT_PROFILE: CommanderProfileDef = {
  commanderId: NOVA_ARCHITECT_ID,
  class: "support",
  visualDesign: "A white industrial exosuit with graphite structural plating, gold engineering markings, floating holographic blueprint arrays, mechanical construction arms, adaptive fabrication gauntlets, a blueprint projector backpack, and an architectural visor — orbiting construction drones accompany him everywhere.",
  voice: "Confident, warm, professional, thoughtful, quiet authority.",
  secondaryAbility: { id: "atlas-network", name: "Atlas Network", cooldownMs: 14000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "nova-architect:expansion:endgameNode",
    description: "Ascension III: the Expansion branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(NOVA_ARCHITECT_ID, "construction", "Construction", [
      ["cooldownReduction", 0.05], ["shieldCapacity", 4], ["statusChance", 0.04],
      ["shieldRegeneration", 3], ["boostEfficiency", 0.04], ["shieldCapacity", 14],
    ]),
    branchNodes(NOVA_ARCHITECT_ID, "infrastructure", "Infrastructure", [
      ["resourceGain", 0.05], ["cooldownReduction", 0.04], ["resourceGain", 0.06],
      ["experienceGain", 0.05], ["shieldRegeneration", 3], ["resourceGain", 0.15],
    ]),
    branchNodes(NOVA_ARCHITECT_ID, "expansion", "Expansion", [
      ["shieldCapacity", 3], ["pickupRadius", 0.05], ["resourceGain", 0.05],
      ["experienceGain", 0.06], ["statusDuration", 0.04], ["resourceGain", 0.16],
    ]),
  ],
  masteryTrackId: "commander:nova-architect",
  personalMissions: [
    { beat: "originStory", name: "Atlas Prime", description: "Where he learned that civilisation is humanity's greatest invention, and every rebuilt structure is proof that hope survives." },
    { beat: "recruitment", name: "The First Foundation", description: "The abandoned Atlas Prime Orbital Ring to restore, damaged sectors to reconnect, engineering teams to protect, the orbital construction network to reactivate. He joins after the player rebuilds critical civilian infrastructure before pursuing military objectives." },
    { beat: "personalObjectives", name: "Nothing Torn Down Twice", description: "Those who destroy infrastructure for political gain get exactly one calm, professional warning." },
    { beat: "companionMissions", name: "Blueprint Ahead", description: "He starts drafting the next structure before the current one has even finished assembling." },
    { beat: "legendaryMission", name: "The City Among Stars", description: "Humanity's first post-Collapse megacity constructed, orbital shipyards coordinated, planetary logistics restored, the Atlas Network completed, the Legendary World Foundry unlocked." },
    { beat: "finalResolution", name: "The World Builder", description: "A title for someone who measured every mission by what got built afterward, not just what got destroyed during it." },
  ],
  loreId: "LORE_COMMANDER_ARCHITECT",
  relationships: [
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Close friend of Elias Ryker — a megastructure architect and a field engineer build at completely different scales and trust each other's math without checking it." },
    { subject: "otherCommanders", targetId: THORNE_STARFORGED_ID, dialogueHint: "Professional respect for Cassia Thorne — Atlas Dynamics runs on both her forge and his blueprints, and neither pretends the other's half is easy." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Works closely with Nova Iskander — construction drones and combat drones share more doctrine than either commander expected." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Inspired by Dr. Lyra Voss — her belief that exploration should restore rather than exploit shaped the entire philosophy behind the Atlas Network." },
  ],
  statisticKeys: ["commander:nova-architect:usage", "commander:nova-architect:victories", "commander:nova-architect:structuresCompleted"],
  cosmetics: [
    { kind: "armourVariants", id: "architect-world-builder-armour" },
    { kind: "animations", id: "architect-blueprint-projections" },
    { kind: "colourThemes", id: "architect-atlas-palette" },
  ],
  voiceLineIds: ["vo-architect-mission-start", "vo-architect-structure-complete", "vo-architect-boss-encounter", "vo-architect-ultimate", "vo-architect-victory", "vo-architect-low-health"],
  futureExpansionHooks: ["legendary-variant-architect-the-world-builder"],
};

export const NOVA_ARCHITECT_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: NOVA_ARCHITECT_ID,
  age: 46,
  species: "Human",
  homeworld: "Atlas Prime",
  psychologicalProfile: "Visionary, methodical, calm, patient, inventive, and protective — he believes civilisation is humanity's greatest invention, and every rebuilt structure is proof that hope survives.",
  leadershipStyle: "Leads by blueprint — every ally already knows their role because he designed the structure around it before the mission began.",
  animationStyle: "Precise, purposeful; every movement appears measured, structures assemble around him in real time, and blueprint holograms constantly update.",
  musicMotif: "Industrial ambience and hopeful orchestral strings over mechanical percussion and soft synth layers, representing rebuilding civilisation.",
  personality: "visionary",
  preferredShips: ["ballista-mk3", "hivemother-mk1", "dawnspire", "caduceus-mk1"],
  preferredWeapons: ["atlas-cluster-battery", "foundry-sunlance", "novasplitter", "coil-ripper-mk2"],
  preferredEquipment: ["vanguard-core", "nova-warden-hive", "aegis-ward-projector", "barrier-plate"],
  preferredRelics: ["conduit-loop", "static-node", "ember-core", "singularity-keepsake"],
  preferredResearch: ["rapid-refit", "expanded-archives", "barrier-theory", "field-dynamics"],
  preferredBiomes: ["machine-expanse", "meridian-rest-frontier", "derelict-expanse"],
  endingStory: "The Atlas Network keeps every reconnected sector powered long after the World Foundry breaks ground on its first megacity, and every colony he ever rebuilt remembers exactly what stood there before the Collapse — because he made sure the blueprint said so. He still calls a finished structure \"connected,\" never \"complete\" — the grid always has room for one more link.",
  dialogueLibrary: [
    { category: "missionStart", line: "We're not just surviving. We're rebuilding." },
    { category: "combat", line: "One more piece of tomorrow." },
    { category: "bosses", line: "You destroy. We create." },
    { category: "legendaryMoments", line: "Lay the foundations." },
    { category: "victory", line: "This is how civilisation returns." },
    { category: "lowHealth", line: "The blueprint... isn't finished." },
  ],
  masteryChallenges: ["Complete 25 expeditions with every deployed structure linked to the Atlas Grid.", "Reach maximum Construction Progress in a single expedition.", "Complete \"The City Among Stars\" without a single structure lost to enemy action."],
};

export const NOVA_ARCHITECT_RECRUITMENT: RecruitmentDef = {
  commanderId: NOVA_ARCHITECT_ID,
  source: "campaign",
  requirement: "Complete \"The First Foundation\": restore the abandoned Atlas Prime Orbital Ring, reconnect damaged sectors, protect engineering teams, and reactivate the orbital construction network.",
};

export const NOVA_ARCHITECT_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-nova-architect",
  category: "commanders",
  title: "Caelus Nova — The Architect",
  lore: {
    summary: "Caelus Nova became the chief architect behind humanity's post-Collapse reconstruction programme, designing modular orbital cities, planetary logistics hubs and expedition infrastructure capable of supporting civilisation's expansion back into the stars.",
    detailed: "His Atlas Network became one of the defining engineering achievements of the Afterlight Initiative. Close friends with Elias Ryker, professionally respectful of Cassia Thorne, working closely with Nova Iskander, and inspired by Dr. Lyra Voss, he distrusts those who destroy infrastructure for political gain.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:nova-architect:structuresCompleted",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [RYKER_ENGINEER_CODEX_ENTRY.id, THORNE_STARFORGED_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: NOVA_ARCHITECT_ID },
};

export const NOVA_ARCHITECT_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(NOVA_ARCHITECT_RECRUITMENT.source);

export const FULL_ROSTER_WITH_ARCHITECT: readonly CommanderDef[] = [...FULL_ROSTER_WITH_ORACLE, NOVA_ARCHITECT_COMMANDER];
export const FULL_PROFILES_WITH_ARCHITECT: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_ORACLE, NOVA_ARCHITECT_PROFILE];
export const FULL_RECRUITMENT_WITH_ARCHITECT: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_ORACLE, NOVA_ARCHITECT_RECRUITMENT];

export function architectOverlapReport(): readonly string[] {
  const overlap = findOverlap(NOVA_ARCHITECT_COMMANDER, FULL_ROSTER_WITH_ORACLE);
  return overlap ? [`${NOVA_ARCHITECT_ID} overlaps ${overlap}`] : [];
}

export function architectArchitectureComplete(): boolean {
  const architecture = architectureFor(NOVA_ARCHITECT_COMMANDER, NOVA_ARCHITECT_PROFILE);
  return Object.values(architecture).every(Boolean);
}
