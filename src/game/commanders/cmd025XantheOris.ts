/**
 * Commander CMD-025 — Xanthe Oris "The Nanoforge" (AF-123). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-fifth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-sixth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-003/008/009/020
 * per her spec'd relationships to exactly those four — the roster's
 * seventh commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with Elias
 * Ryker, Nova Iskander and Caelus Nova"), her archetype/class
 * (guardian/experimental) and passive/signature trigger+bonus pairs are
 * deliberately distinct from Ryker's engineer/engineer kit, Iskander's
 * droneCommander/hybrid kit, and Nova's orbitalCommander/support kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_DIPLOMAT, FULL_RECRUITMENT_WITH_DIPLOMAT, FULL_ROSTER_WITH_DIPLOMAT } from "./cmd024KieranSolace";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { THORNE_STARFORGED_CODEX_ENTRY, THORNE_STARFORGED_ID } from "./cmd009CassiaThorne";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import { NOVA_ARCHITECT_CODEX_ENTRY, NOVA_ARCHITECT_ID } from "./cmd020CaelusNova";
import type { CodexEntryDef } from "../codex/codexData";

export const ORIS_NANOFORGE_ID = "oris-nanoforge";

export const ORIS_NANOFORGE_COMMANDER: CommanderDef = {
  id: ORIS_NANOFORGE_ID,
  name: "Xanthe Oris",
  callsign: "Nanoforge",
  archetype: "guardian",
  faction: "Afterlight Initiative",
  biography: "A nanotechnology engineer, adaptive materials scientist, and matter reconstruction specialist who perfected safe programmable matter after decades of failed experiments — she believes perfection is not a destination, it is continuous adaptation.",
  passive: { trigger: "onKill", bonus: { kind: "shieldRegeneration", value: 4 } },
  active: { id: "nanite-swarm", name: "Nanite Swarm", cooldownMs: 12000 },
  ultimate: { id: "genesis-fabricator", name: "Genesis Fabricator", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "adaptation-matrix-doctrine",
    description: "Using abilities generates Adaptation Data — higher Adaptation unlocks smarter nanites, faster reconstruction, additional equipment forms, improved survivability, and permanent expedition upgrades.",
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

export const ORIS_NANOFORGE_PROFILE: CommanderProfileDef = {
  commanderId: ORIS_NANOFORGE_ID,
  class: "experimental",
  visualDesign: "Pearlescent adaptive armour with silver nanite swarms flowing beneath transparent plating, floating construction particles, morphing gauntlets, a programmable cloak, a blue-white nanite reactor, a dynamic helmet visor, and constant microscopic surface movement.",
  voice: "Soft, precise, professional, optimistic, measured.",
  secondaryAbility: { id: "matter-reconfiguration", name: "Matter Reconfiguration", cooldownMs: 10000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "shieldCapacity", value: 4 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "oris-nanoforge:fabrication:endgameNode",
    description: "Ascension III: the Fabrication branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(ORIS_NANOFORGE_ID, "reconstruction", "Reconstruction", [
      ["shieldRegeneration", 3], ["shieldCapacity", 3], ["resourceGain", 0.05],
      ["cooldownReduction", 0.04], ["experienceGain", 0.04], ["shieldRegeneration", 12],
    ]),
    branchNodes(ORIS_NANOFORGE_ID, "adaptation", "Adaptation", [
      ["damage", 0.04], ["shieldCapacity", 3], ["movementSpeed", 0.04],
      ["statusChance", 0.04], ["boostEfficiency", 0.04], ["shieldCapacity", 10],
    ]),
    branchNodes(ORIS_NANOFORGE_ID, "fabrication", "Fabrication", [
      ["droneEffectiveness", 0.05], ["resourceGain", 0.05], ["cooldownReduction", 0.05],
      ["experienceGain", 0.05], ["statusDuration", 0.04], ["droneEffectiveness", 0.15],
    ]),
  ],
  masteryTrackId: "commander:oris-nanoforge",
  personalMissions: [
    { beat: "originStory", name: "Nanite Research Nexus", description: "Where she learned that perfection is not a destination, it is continuous adaptation, after decades of failed nanotechnology experiments." },
    { beat: "recruitment", name: "The Grey Ocean", description: "A rogue self-replicating nanite colony to investigate, uncontrolled replication to prevent, the original adaptive AI to recover, trapped researchers to save. She joins after the player chooses containment and restoration rather than total destruction." },
    { beat: "personalObjectives", name: "Nothing Is Ever Truly Broken", description: "Uncontrolled self-replicating technology and military applications without ethical safeguards are the only things she has ever refused to fabricate." },
    { beat: "companionMissions", name: "Reconfigure, Not Replace", description: "Every damaged system she meets becomes raw material for something better, never scrap." },
    { beat: "legendaryMission", name: "The Infinite Machine", description: "Humanity's first Nanoforge Complex restored, planetary fabrication systems stabilised, adaptive expedition technology manufactured, the Legendary Nanite Core unlocked." },
    { beat: "finalResolution", name: "The Evolutionary", description: "A title for someone who proved that adaptation, not permanence, was the only lasting form of strength." },
  ],
  loreId: "LORE_COMMANDER_NANOFORGE",
  relationships: [
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Close friend of Elias Ryker — two engineers who would rather rebuild something twice than watch it stay broken once." },
    { subject: "otherCommanders", targetId: THORNE_STARFORGED_ID, dialogueHint: "Scientific collaboration with Cassia Thorne — forged metal and programmable matter turn out to have more in common than either of them expected." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Works with Nova Iskander — a swarm of drones and a swarm of nanites speak the same coordination language." },
    { subject: "otherCommanders", targetId: NOVA_ARCHITECT_ID, dialogueHint: "Professional respect for Caelus Nova — he builds structures that last; she builds structures that adapt, and each secretly envies the other's certainty." },
  ],
  statisticKeys: ["commander:oris-nanoforge:usage", "commander:oris-nanoforge:victories", "commander:oris-nanoforge:matterFragmentsCollected"],
  cosmetics: [
    { kind: "armourVariants", id: "nanoforge-evolutionary-armour" },
    { kind: "animations", id: "nanoforge-nanite-swarms" },
    { kind: "colourThemes", id: "nanoforge-silver-white-palette" },
  ],
  voiceLineIds: ["vo-nanoforge-mission-start", "vo-nanoforge-nanite-activation", "vo-nanoforge-boss-encounter", "vo-nanoforge-ultimate", "vo-nanoforge-victory", "vo-nanoforge-low-health"],
  futureExpansionHooks: ["legendary-variant-nanoforge-the-evolutionary"],
};

export const ORIS_NANOFORGE_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: ORIS_NANOFORGE_ID,
  age: 36,
  species: "Human",
  homeworld: "Nanite Research Nexus",
  psychologicalProfile: "Inventive, curious, calm, persistent, analytical, and hopeful — she believes perfection is not a destination, it is continuous adaptation.",
  leadershipStyle: "Leads by example — she has already rebuilt three versions of any plan before anyone else has finished objecting to the first.",
  animationStyle: "Fluid, adaptive; armour continuously reshapes itself, weapons assemble organically, nanites swarm during every ability.",
  musicMotif: "Minimal electronic pulses and soft industrial ambience beneath evolving orchestral textures and digital harmonics, representing constant transformation.",
  personality: "curious",
  preferredShips: ["aurelia-hull-mk1", "hivemother-mk1", "maelstrom-x1", "dawnspire"],
  preferredWeapons: ["voidlance", "paragon-flux-driver", "helios-prism-array", "coil-ripper"],
  preferredEquipment: ["vanguard-core", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor"],
  preferredRelics: ["static-node", "conduit-loop", "gambler-die", "singularity-keepsake"],
  preferredResearch: ["ancient-conduit", "rapid-refit", "expanded-archives", "unified-theory"],
  preferredBiomes: ["machine-expanse", "derelict-expanse", "singularity-zone"],
  endingStory: "The Infinite Machine keeps manufacturing adaptive expedition technology long after the Legendary Nanite Core is unlocked, and every colony she ever touched with her nanites now rebuilds itself a little faster than the last time damage found it. She still logs every Matter Fragment collected — to her, that number has always mattered more than any weapon she ever adapted.",
  dialogueLibrary: [
    { category: "missionStart", line: "Nothing is ever truly broken." },
    { category: "combat", line: "Adapt." },
    { category: "bosses", line: "Evolution always outlasts strength." },
    { category: "legendaryMoments", line: "Rebuild everything." },
    { category: "victory", line: "We leave this place better than we found it." },
    { category: "lowHealth", line: "Reconfigure... now." },
  ],
  masteryChallenges: ["Complete 25 expeditions without losing a single constructed structure.", "Reach maximum Adaptation Data in 50 separate encounters.", "Complete \"The Infinite Machine\" without a single failed reconstruction."],
};

export const ORIS_NANOFORGE_RECRUITMENT: RecruitmentDef = {
  commanderId: ORIS_NANOFORGE_ID,
  source: "hiddenDiscoveries",
  requirement: "Complete \"The Grey Ocean\": investigate a rogue self-replicating nanite colony, prevent uncontrolled replication, recover the original adaptive AI, and save trapped researchers by choosing containment and restoration over total destruction.",
};

export const ORIS_NANOFORGE_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-oris-nanoforge",
  category: "commanders",
  title: "Xanthe Oris — The Nanoforge",
  lore: {
    summary: "Xanthe Oris perfected safe programmable matter after decades of failed nanotechnology experiments.",
    detailed: "Her adaptive fabrication systems allowed damaged colonies, expedition fleets and ancient infrastructure to rebuild themselves in real time, dramatically accelerating humanity's recovery and redefining the limits of engineering. Close friends with Elias Ryker, in scientific collaboration with Cassia Thorne, working with Nova Iskander, and professionally respectful of Caelus Nova, she distrusts uncontrolled self-replicating technology and military applications without ethical safeguards in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:oris-nanoforge:matterFragmentsCollected",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [RYKER_ENGINEER_CODEX_ENTRY.id, THORNE_STARFORGED_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id, NOVA_ARCHITECT_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: ORIS_NANOFORGE_ID },
};

export const ORIS_NANOFORGE_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(ORIS_NANOFORGE_RECRUITMENT.source);

export const FULL_ROSTER_WITH_NANOFORGE: readonly CommanderDef[] = [...FULL_ROSTER_WITH_DIPLOMAT, ORIS_NANOFORGE_COMMANDER];
export const FULL_PROFILES_WITH_NANOFORGE: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_DIPLOMAT, ORIS_NANOFORGE_PROFILE];
export const FULL_RECRUITMENT_WITH_NANOFORGE: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_DIPLOMAT, ORIS_NANOFORGE_RECRUITMENT];

export function nanoforgeOverlapReport(): readonly string[] {
  const overlap = findOverlap(ORIS_NANOFORGE_COMMANDER, FULL_ROSTER_WITH_DIPLOMAT);
  return overlap ? [`${ORIS_NANOFORGE_ID} overlaps ${overlap}`] : [];
}

export function nanoforgeArchitectureComplete(): boolean {
  const architecture = architectureFor(ORIS_NANOFORGE_COMMANDER, ORIS_NANOFORGE_PROFILE);
  return Object.values(architecture).every(Boolean);
}
