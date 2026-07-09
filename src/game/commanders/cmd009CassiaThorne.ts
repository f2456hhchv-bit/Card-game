/**
 * Commander CMD-009 — Cassia Thorne "The Starforged" (AF-107). The
 * canonical, individually-specified implementation of Afterlight's
 * ninth fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A tenth codex-commander-* entry
 * is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-003/008/002 per her spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_SWARMMASTER, FULL_RECRUITMENT_WITH_SWARMMASTER, FULL_ROSTER_WITH_SWARMMASTER, ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import type { CodexEntryDef } from "../codex/codexData";

export const THORNE_STARFORGED_ID = "thorne-starforged";

export const THORNE_STARFORGED_COMMANDER: CommanderDef = {
  id: THORNE_STARFORGED_ID,
  name: "Cassia Thorne",
  callsign: "Starforged",
  archetype: "engineer",
  faction: "Atlas Dynamics",
  biography: "Atlas Dynamics' Chief Weapons Architect, an experimental metallurgist and industrial commander who rebuilt humanity's first orbital forge complex after the Collapse — she believes true strength is earned through relentless refinement, never granted.",
  passive: { trigger: "onKill", bonus: { kind: "criticalDamage", value: 0.06 } },
  active: { id: "thermal-overdrive", name: "Thermal Overdrive", cooldownMs: 13000 },
  ultimate: { id: "starforge-core", name: "Starforge Core", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "forge-mastery-doctrine",
    description: "Every Heat cycle permanently improves weapon handling, thermal stability, critical efficiency, and forging speed — the longer the expedition runs, the stronger her engineering becomes.",
    passive: { trigger: "onKill", bonus: { kind: "cooldownReduction", value: 0.04 } },
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

export const THORNE_STARFORGED_PROFILE: CommanderProfileDef = {
  commanderId: THORNE_STARFORGED_ID,
  class: "engineer",
  visualDesign: "Heavy industrial combat armour in dark titanium plating with molten orange energy vents, forging gauntlets, a thermal reactor backpack, heat exhaust vents, a magnetic tool harness, and a glowing forge hammer emblem — an unmistakably industrial silhouette.",
  voice: "Confident, strong, measured, direct, experienced.",
  secondaryAbility: { id: "forge-barrier", name: "Forge Barrier", cooldownMs: 12000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "shieldCapacity", value: 6 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "thorne-starforged:living-forge:endgameNode",
    description: "Ascension III: the Living Forge branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(THORNE_STARFORGED_ID, "weaponsmith", "Weaponsmith", [
      ["criticalChance", 0.05], ["cooldownReduction", 0.04], ["damage", 0.05],
      ["criticalDamage", 0.08], ["statusChance", 0.04], ["criticalDamage", 0.16],
    ]),
    branchNodes(THORNE_STARFORGED_ID, "industrial-systems", "Industrial Systems", [
      ["resourceGain", 0.05], ["boostEfficiency", 0.05], ["resourceGain", 0.06],
      ["experienceGain", 0.05], ["cooldownReduction", 0.04], ["resourceGain", 0.15],
    ]),
    branchNodes(THORNE_STARFORGED_ID, "living-forge", "Living Forge", [
      ["shieldCapacity", 4], ["shieldRegeneration", 3], ["damage", 0.04],
      ["movementSpeed", 0.03], ["shieldCapacity", 5], ["shieldCapacity", 12],
    ]),
  ],
  masteryTrackId: "commander:thorne-starforged",
  personalMissions: [
    { beat: "originStory", name: "Forge World Helios IX", description: "Where she learned that nothing great is built without pressure." },
    { beat: "recruitment", name: "The Burning Foundry", description: "A collapsing planetary forge to recover, thermal reactors to stabilise, engineers to protect, prototype technology to save. She joins after witnessing the player's commitment to preserving humanity's industrial future." },
    { beat: "personalObjectives", name: "Every Weld Accounted For", description: "Waste, poor engineering, and reckless experimentation all draw the same disgusted look." },
    { beat: "companionMissions", name: "Field Refit", description: "She won't ship a build she hasn't personally overclocked and hasn't personally cooled down again." },
    { beat: "legendaryMission", name: "The First Forge", description: "The original Atlas Stellar Forge restored, the first Mythic weapon manufactured, the forge defended against overwhelming assaults, the Legendary Stellar Crucible unlocked." },
    { beat: "finalResolution", name: "The Master Smith", description: "A title for someone who never once called anything finished — only refined enough to ship." },
  ],
  loreId: "LORE_COMMANDER_STARFORGED",
  relationships: [
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Close friend of Elias Ryker — two engineers who trust each other's welds without checking them twice." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Professional respect for Nova Iskander — a swarm that never wastes a component is an engineering philosophy she can stand behind." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Works closely with Adrian Kane — a held line gives her forge the time it needs to finish the job." },
  ],
  statisticKeys: ["commander:thorne-starforged:usage", "commander:thorne-starforged:victories", "commander:thorne-starforged:heatCyclesCompleted"],
  cosmetics: [
    { kind: "armourVariants", id: "starforged-forge-armour" },
    { kind: "animations", id: "starforged-molten-particles" },
    { kind: "colourThemes", id: "starforged-thermal-palette" },
  ],
  voiceLineIds: ["vo-starforged-mission-start", "vo-starforged-weapon-overclock", "vo-starforged-boss-encounter", "vo-starforged-ultimate", "vo-starforged-victory"],
  futureExpansionHooks: ["legendary-variant-starforged-the-master-smith"],
};

export const THORNE_STARFORGED_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: THORNE_STARFORGED_ID,
  age: 43,
  species: "Human",
  homeworld: "Forge World Helios IX",
  psychologicalProfile: "Determined, focused, disciplined, inventive, blunt, and dependable — she believes true strength is earned through relentless refinement.",
  leadershipStyle: "Leads by example and by standard — she expects the same relentless refinement from everyone under her that she demands of herself.",
  animationStyle: "Powerful, heavy, mechanical, purposeful — every movement feels like controlled force.",
  musicMotif: "Industrial percussion and deep brass over mechanical rhythm and forging ambience, rising into orchestration that represents relentless creation.",
  personality: "visionary",
  preferredShips: ["dawnspire", "hivemother-mk1", "maelstrom-x1", "ballista-mk3"],
  preferredWeapons: ["atlas-cluster-battery", "coil-ripper", "foundry-sunlance", "helios-prism-array"],
  preferredEquipment: ["vanguard-core", "cryo-manifold", "horizon-flux-capacitor", "aegis-bastion-array"],
  preferredRelics: ["cinder-heart", "static-node", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["harmonic-overload", "barrier-theory", "rapid-refit", "field-dynamics"],
  preferredBiomes: ["machine-expanse", "solar-wastes", "derelict-expanse"],
  endingStory: "The Atlas Stellar Forge burns steady in orbit long after the last assault is repelled, and every hull Afterlight fields afterward carries a weld she inspected personally. She still calls a finished build \"refined enough to ship\" — never finished, never perfect, just ready for the next cycle.",
  dialogueLibrary: [
    { category: "missionStart", line: "Nothing great is built without pressure." },
    { category: "combat", line: "Push it further." },
    { category: "bosses", line: "Every titan eventually breaks." },
    { category: "legendaryMoments", line: "Become the forge." },
    { category: "victory", line: "Another masterpiece." },
  ],
  masteryChallenges: ["Complete 50 expeditions without letting Heat overflow into overheating.", "Reach maximum Forge Mastery stacks in 25 separate engagements.", "Manufacture a Mythic weapon during \"The First Forge\" without losing the forge platform."],
};

export const THORNE_STARFORGED_RECRUITMENT: RecruitmentDef = {
  commanderId: THORNE_STARFORGED_ID,
  source: "exploration",
  requirement: "Complete \"The Burning Foundry\": recover a collapsing planetary forge, stabilise its thermal reactors, protect its engineers, and prevent prototype technology from being destroyed.",
};

export const THORNE_STARFORGED_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-thorne-starforged",
  category: "commanders",
  title: "Cassia Thorne — The Starforged",
  lore: {
    summary: "Cassia Thorne rebuilt humanity's first orbital forge complex after the Collapse, allowing large-scale production of expedition equipment to resume.",
    detailed: "Her innovations in adaptive metallurgy transformed frontier manufacturing and became the foundation of Atlas Dynamics' modern engineering doctrine. Close friends with Elias Ryker, professionally respectful of Nova Iskander, and working closely with Adrian Kane, she has never once shipped a build she wasn't willing to put her own name on.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:thorne-starforged:heatCyclesCompleted",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [RYKER_ENGINEER_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: THORNE_STARFORGED_ID },
};

export const THORNE_STARFORGED_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(THORNE_STARFORGED_RECRUITMENT.source);

export const FULL_ROSTER_WITH_STARFORGED: readonly CommanderDef[] = [...FULL_ROSTER_WITH_SWARMMASTER, THORNE_STARFORGED_COMMANDER];
export const FULL_PROFILES_WITH_STARFORGED: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_SWARMMASTER, THORNE_STARFORGED_PROFILE];
export const FULL_RECRUITMENT_WITH_STARFORGED: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_SWARMMASTER, THORNE_STARFORGED_RECRUITMENT];

export function starforgedOverlapReport(): readonly string[] {
  const overlap = findOverlap(THORNE_STARFORGED_COMMANDER, FULL_ROSTER_WITH_SWARMMASTER);
  return overlap ? [`${THORNE_STARFORGED_ID} overlaps ${overlap}`] : [];
}

export function starforgedArchitectureComplete(): boolean {
  const architecture = architectureFor(THORNE_STARFORGED_COMMANDER, THORNE_STARFORGED_PROFILE);
  return Object.values(architecture).every(Boolean);
}
