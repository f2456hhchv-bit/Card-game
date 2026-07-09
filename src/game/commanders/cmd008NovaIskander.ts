/**
 * Commander CMD-008 — Nova Iskander "The Swarmmaster" (AF-106). The
 * canonical, individually-specified implementation of Afterlight's
 * eighth fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A ninth codex-commander-* entry
 * is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-003/002/006 per her spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_VOIDRUNNER, FULL_RECRUITMENT_WITH_VOIDRUNNER, FULL_ROSTER_WITH_VOIDRUNNER } from "./cmd007OrionVale";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import type { CodexEntryDef } from "../codex/codexData";

export const ISKANDER_SWARMMASTER_ID = "iskander-swarmmaster";

export const ISKANDER_SWARMMASTER_COMMANDER: CommanderDef = {
  id: ISKANDER_SWARMMASTER_ID,
  name: "Nova Iskander",
  callsign: "Swarmmaster",
  archetype: "droneCommander",
  faction: "Afterlight Initiative",
  biography: "A drone fleet commander, autonomous systems engineer, and swarm intelligence architect who pioneered humanity's first ethical autonomous combat framework after the Collapse — believes automation should preserve life, never replace it.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "droneEffectiveness", value: 0.06 } },
  active: { id: "drone-deployment-matrix", name: "Drone Deployment Matrix", cooldownMs: 11000 },
  ultimate: { id: "hive-network", name: "Hive Network", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "swarm-intelligence-doctrine",
    description: "Every completed drone action generates Intelligence — improved AI, advanced formations, and shared learning all rising together, unlocking special drone evolutions.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "cooldownReduction", value: 0.04 } },
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

export const ISKANDER_SWARMMASTER_PROFILE: CommanderProfileDef = {
  commanderId: ISKANDER_SWARMMASTER_ID,
  class: "hybrid",
  visualDesign: "A white tactical command suit over a graphite exoskeleton with blue command lights, a floating holographic drone interface, mechanical shoulder drones, a compact command visor, adaptive control gauntlets, and orbiting utility drones — a minimalist engineering aesthetic throughout.",
  voice: "Calm, clear, authoritative, encouraging — always professional.",
  secondaryAbility: { id: "swarm-command", name: "Swarm Command", cooldownMs: 12000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "droneEffectiveness", value: 0.05 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "iskander-swarmmaster:adaptive-intelligence:endgameNode",
    description: "Ascension III: the Adaptive Intelligence branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(ISKANDER_SWARMMASTER_ID, "offensive-swarm", "Offensive Swarm", [
      ["droneEffectiveness", 0.06],
      ["criticalChance", 0.04],
      ["criticalDamage", 0.08],
      ["statusChance", 0.04],
      ["resourceGain", 0.05],
      ["droneEffectiveness", 0.16],
    ]),
    branchNodes(ISKANDER_SWARMMASTER_ID, "support-network", "Support Network", [
      ["shieldRegeneration", 4],
      ["resourceGain", 0.06],
      ["shieldCapacity", 0.06],
      ["boostEfficiency", 0.05],
      ["experienceGain", 0.05],
      ["shieldRegeneration", 10],
    ]),
    branchNodes(ISKANDER_SWARMMASTER_ID, "adaptive-intelligence", "Adaptive Intelligence", [
      ["droneEffectiveness", 0.05],
      ["experienceGain", 0.06],
      ["cooldownReduction", 0.05],
      ["movementSpeed", 0.03],
      ["boostEfficiency", 0.04],
      ["droneEffectiveness", 0.15],
    ]),
  ],
  masteryTrackId: "commander:iskander-swarmmaster",
  personalMissions: [
    { beat: "originStory", name: "Orbital Hive Sigma", description: "Where she learned that a thousand small minds working together outlasts any single strong one." },
    { beat: "recruitment", name: "Hive Protocol", description: "The lost Autonomous Hive Core, a hostile AI takeover to prevent, civilian engineers to protect. She joins after the player proves autonomy should protect life, not replace judgement." },
    { beat: "personalObjectives", name: "Every Drone Accounted For", description: "No unit gets left unreconstructed, however small its role." },
    { beat: "companionMissions", name: "Formation Escort", description: "Field deployments run smoother with a full hive online — she never sends allies in without adequate coverage." },
    { beat: "legendaryMission", name: "The Infinite Swarm", description: "Humanity's first autonomous orbital defence grid, thousands of drones coordinated, a Machine Collective invasion defeated." },
    { beat: "finalResolution", name: "The Architect", description: "A title for someone who built a mind that chose, every time, to protect rather than replace." },
  ],
  loreId: "LORE_COMMANDER_SWARMMASTER",
  relationships: [
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Close friend of Elias Ryker — he builds what her swarm needs, and neither of them has ever called that a small favour." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Professional respect for Kane — a held line gives her drones somewhere safe to reconstruct." },
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Collaborates constantly with Aria Sol — resonance and swarm intelligence turn out to synchronise better than either expected." },
  ],
  statisticKeys: ["commander:iskander-swarmmaster:usage", "commander:iskander-swarmmaster:victories", "commander:iskander-swarmmaster:dronesDeployed"],
  cosmetics: [
    { kind: "armourVariants", id: "swarmmaster-hive-armour" },
    { kind: "animations", id: "swarmmaster-drone-formations" },
    { kind: "colourThemes", id: "swarmmaster-command-palette" },
  ],
  voiceLineIds: ["vo-swarmmaster-mission-start", "vo-swarmmaster-drone-deployment", "vo-swarmmaster-boss-encounter", "vo-swarmmaster-ultimate", "vo-swarmmaster-victory"],
  futureExpansionHooks: ["legendary-variant-swarmmaster-the-architect"],
};

export const ISKANDER_SWARMMASTER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: ISKANDER_SWARMMASTER_ID,
  age: 39,
  species: "Human",
  homeworld: "Orbital Hive Sigma",
  psychologicalProfile: "Strategic, compassionate, inventive, confident, and patient, with a fiercely protective streak — believes automation should preserve life, never replace it.",
  leadershipStyle: "Leads by delegation with a conscience — every drone gets a role, and every role serves someone who's still alive because of it.",
  animationStyle: "Constant command gestures with drones reacting instantly; smooth, confident, tactical movements, always directing battlefield assets.",
  musicMotif: "Electronic pulses and military percussion over layered synthesizers and industrial ambience, representing coordination and precision.",
  personality: "compassionate",
  preferredShips: ["hivemother-mk1", "dawnspire", "caduceus-mk1", "maelstrom-x1"],
  preferredWeapons: ["hailborn-array", "coil-ripper", "helios-prism-array", "voidlance"],
  preferredEquipment: ["nova-warden-hive", "aegis-ward-projector", "horizon-flux-capacitor", "cryo-manifold"],
  preferredRelics: ["static-node", "warden-token", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["rapid-refit", "expanded-archives", "survey-protocols", "field-dynamics"],
  preferredBiomes: ["machine-expanse", "derelict-expanse", "solar-wastes"],
  endingStory: "The Hive Intelligence Matrix stabilises for good, and Afterlight's expedition support fleets carry her distributed doctrine into every future restoration. She still calls each drone by its function, never a number, and has never once explained why that matters to her so much.",
  dialogueLibrary: [
    { category: "missionStart", line: "One pilot is strong. A thousand minds are stronger." },
    { category: "combat", line: "Hive online." },
    { category: "bosses", line: "Adapt. Learn. Overcome." },
    { category: "legendaryMoments", line: "Synchronise the network." },
    { category: "victory", line: "Efficiency saved lives today." },
  ],
  masteryChallenges: ["Deploy 1,000 drones across all expeditions.", "Reach maximum Swarm Intelligence in 50 encounters.", "Complete 15 expeditions using Hive Network to double drone capacity."],
};

export const ISKANDER_SWARMMASTER_RECRUITMENT: RecruitmentDef = {
  commanderId: ISKANDER_SWARMMASTER_ID,
  source: "hiddenDiscoveries",
  requirement: "Complete \"Hive Protocol\": recover the lost Autonomous Hive Core, restore its intelligence, and prevent a hostile AI takeover.",
};

export const ISKANDER_SWARMMASTER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-iskander-swarmmaster",
  category: "commanders",
  title: "Nova Iskander — The Swarmmaster",
  lore: {
    summary: "Nova Iskander pioneered humanity's first ethical autonomous combat framework after the Collapse, ensuring that advanced AI would always enhance human decision-making rather than replace it.",
    detailed: "Her distributed drone doctrines became the foundation of Afterlight's modern expedition support fleets. Close friends with Elias Ryker, professionally respectful of Adrian Kane, and a constant collaborator with Aria Sol, she has never once let a drone become more important than the people it protects.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:iskander-swarmmaster:dronesDeployed",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [RYKER_ENGINEER_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id, SOL_RESONANT_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: ISKANDER_SWARMMASTER_ID },
};

export const ISKANDER_SWARMMASTER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(ISKANDER_SWARMMASTER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_SWARMMASTER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_VOIDRUNNER, ISKANDER_SWARMMASTER_COMMANDER];
export const FULL_PROFILES_WITH_SWARMMASTER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_VOIDRUNNER, ISKANDER_SWARMMASTER_PROFILE];
export const FULL_RECRUITMENT_WITH_SWARMMASTER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_VOIDRUNNER, ISKANDER_SWARMMASTER_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 29-commander roster via the
 * real AF-030 fingerprint/findOverlap law. */
export function swarmmasterOverlapReport(): readonly string[] {
  const overlap = findOverlap(ISKANDER_SWARMMASTER_COMMANDER, FULL_ROSTER_WITH_VOIDRUNNER);
  return overlap ? [`${ISKANDER_SWARMMASTER_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function swarmmasterArchitectureComplete(): boolean {
  const architecture = architectureFor(ISKANDER_SWARMMASTER_COMMANDER, ISKANDER_SWARMMASTER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
