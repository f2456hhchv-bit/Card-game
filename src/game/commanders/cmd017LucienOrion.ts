/**
 * Commander CMD-017 — Lucien Orion "The Starlancer" (AF-115). The
 * canonical, individually-specified implementation of Afterlight's
 * seventeenth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. An eighteenth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-011/005/002/001
 * per his spec'd relationships to exactly those four — the roster's
 * first commander with four spec'd relationships instead of three,
 * and the first "Professional Rival" relationship (with Kael Drake).
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_WARDEN, FULL_RECRUITMENT_WITH_WARDEN, FULL_ROSTER_WITH_WARDEN } from "./cmd016AstridReyes";
import { ASH_TEMPEST_CODEX_ENTRY, ASH_TEMPEST_ID } from "./cmd011ValenAsh";
import { DRAKE_HUNTER_CODEX_ENTRY, DRAKE_HUNTER_ID } from "./cmd005KaelDrake";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const ORION_STARLANCER_ID = "orion-starlancer";

export const ORION_STARLANCER_COMMANDER: CommanderDef = {
  id: ORION_STARLANCER_ID,
  name: "Lucien Orion",
  callsign: "Starlancer",
  archetype: "assault",
  faction: "Afterlight Initiative",
  biography: "A strike commander, experimental flight specialist, and deep space interceptor pilot who became the first pilot to successfully survive repeated flights through unstable prototype jump corridors — he believes hesitation is the only true enemy.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "movementSpeed", value: 0.05 } },
  active: { id: "star-dash", name: "Star Dash", cooldownMs: 10000 },
  ultimate: { id: "supernova-drive", name: "Supernova Drive", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "velocity-chain-doctrine",
    description: "Maintaining uninterrupted movement raises Chain Level — longer dashes, improved plasma damage, additional critical effects, and movement-based ability upgrades follow, though taking heavy damage or remaining stationary resets the Chain.",
    passive: { trigger: "onKill", bonus: { kind: "criticalDamage", value: 0.08 } },
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

export const ORION_STARLANCER_PROFILE: CommanderProfileDef = {
  commanderId: ORION_STARLANCER_ID,
  class: "assault",
  visualDesign: "Aerodynamic white combat armour with blue plasma fins, retractable thruster wings, magnetic flight stabilisers, a streamlined visor, a star-blue reactor core, glowing propulsion vents, and a long asymmetric flight coat.",
  voice: "Confident, energetic, friendly, focused, calm under pressure.",
  secondaryAbility: { id: "velocity-lock", name: "Velocity Lock", cooldownMs: 13000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "movementSpeed", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "orion-starlancer:starflight:endgameNode",
    description: "Ascension III: the Starflight branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(ORION_STARLANCER_ID, "velocity", "Velocity", [
      ["movementSpeed", 0.05], ["boostEfficiency", 0.05], ["movementSpeed", 0.04],
      ["criticalChance", 0.05], ["cooldownReduction", 0.04], ["movementSpeed", 0.16],
    ]),
    branchNodes(ORION_STARLANCER_ID, "interceptor", "Interceptor", [
      ["criticalChance", 0.05], ["criticalDamage", 0.08], ["damage", 0.05],
      ["statusChance", 0.04], ["criticalChance", 0.04], ["criticalDamage", 0.16],
    ]),
    branchNodes(ORION_STARLANCER_ID, "starflight", "Starflight", [
      ["boostEfficiency", 0.05], ["resourceGain", 0.04], ["statusDuration", 0.05],
      ["cooldownReduction", 0.05], ["experienceGain", 0.05], ["cooldownReduction", 0.15],
    ]),
  ],
  masteryTrackId: "commander:orion-starlancer",
  personalMissions: [
    { beat: "originStory", name: "Nova Reach", description: "Where he learned that hesitation is the only true enemy, and that standing still is failure." },
    { beat: "recruitment", name: "The Redline", description: "A rogue prototype vessel to pursue across an unstable asteroid belt, civilian shipping lanes to protect, a catastrophic reactor overload to prevent. He joins after the player prioritises saving trapped convoy pilots over capturing the prototype intact." },
    { beat: "personalObjectives", name: "Never Idle", description: "Every objective gets the same answer: move first, calculate the risk while already moving." },
    { beat: "companionMissions", name: "Wingmate", description: "He clears the path for every ally before he claims a single kill for himself." },
    { beat: "legendaryMission", name: "Beyond Lightspeed", description: "The first experimental Stellar Acceleration Gate reactivated, collapsing jump corridors raced through, the prototype drive stabilised, the Legendary Nova Engine unlocked." },
    { beat: "finalResolution", name: "The Comet", description: "A title for someone who was never once caught standing still when it mattered." },
  ],
  loreId: "LORE_COMMANDER_STARLANCER",
  relationships: [
    { subject: "otherCommanders", targetId: ASH_TEMPEST_ID, dialogueHint: "Close friend of Valen Ash — a storm and a comet both understand that stillness is the only real danger." },
    { subject: "otherCommanders", targetId: DRAKE_HUNTER_ID, dialogueHint: "Professional rival of Kael Drake — a hunter who tracks and a pilot who never stops moving keep score on completely different scales, loudly." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Great respect for Adrian Kane — a held line gives Lucien something worth racing back to defend." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Enjoys working with Dr. Lyra Voss — her calm curiosity is the perfect counterweight to a pilot who never sits still." },
  ],
  statisticKeys: ["commander:orion-starlancer:usage", "commander:orion-starlancer:victories", "commander:orion-starlancer:longestVelocityChain"],
  cosmetics: [
    { kind: "armourVariants", id: "starlancer-interceptor-armour" },
    { kind: "animations", id: "starlancer-plasma-trails" },
    { kind: "colourThemes", id: "starlancer-acceleration-palette" },
  ],
  voiceLineIds: ["vo-starlancer-mission-start", "vo-starlancer-boss-encounter", "vo-starlancer-ultimate", "vo-starlancer-victory", "vo-starlancer-low-health"],
  futureExpansionHooks: ["legendary-variant-starlancer-the-comet"],
};

export const ORION_STARLANCER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: ORION_STARLANCER_ID,
  age: 35,
  species: "Human",
  homeworld: "Nova Reach",
  psychologicalProfile: "Fearless, charismatic, competitive, optimistic, protective, and driven — he believes hesitation is the only true enemy.",
  leadershipStyle: "Leads from the front, at speed — he is already through the danger before anyone else has finished assessing it.",
  animationStyle: "Extremely agile, constant momentum; sliding, air dashes, and rapid directional changes keep him almost never fully stationary.",
  musicMotif: "Fast electronic percussion and rising strings over synth arpeggios and driving orchestral rhythm, representing speed and freedom.",
  personality: "fearless",
  preferredShips: ["sable-dart-mk1", "wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1"],
  preferredWeapons: ["coil-ripper", "coil-ripper-mk2", "helios-prism-array", "voidlance"],
  preferredEquipment: ["vanguard-thrusters", "cryo-manifold", "vanguard-core", "horizon-flux-capacitor"],
  preferredRelics: ["gambler-die", "static-node", "conduit-loop", "frost-shard"],
  preferredResearch: ["warp-charting", "survey-protocols", "rapid-refit", "deep-scanning"],
  preferredBiomes: ["derelict-expanse", "void-expanse", "crystal-fields-alpha"],
  endingStory: "The Nova Engine keeps every jump corridor stable long after the last unstable prototype is retired, and every convoy pilot he ever raced to save remembers exactly how fast he arrived. He still logs every mission's duration to the second — not to boast, but because standing still, even in memory, has never once felt safe to him.",
  dialogueLibrary: [
    { category: "missionStart", line: "Keep moving. Always." },
    { category: "bosses", line: "Let's see if you can keep up." },
    { category: "legendaryMoments", line: "Burn brighter." },
    { category: "victory", line: "Fast enough." },
    { category: "lowHealth", line: "Still flying." },
  ],
  masteryChallenges: ["Maintain an unbroken Velocity Chain for an entire expedition.", "Complete \"The Redline\" without Momentum ever decaying to zero.", "Eliminate 50 isolated targets with Velocity Lock refreshes chained back to back."],
};

export const ORION_STARLANCER_RECRUITMENT: RecruitmentDef = {
  commanderId: ORION_STARLANCER_ID,
  source: "exploration",
  requirement: "Complete \"The Redline\": pursue a rogue prototype vessel across an unstable asteroid belt, protect civilian shipping lanes, and prevent catastrophic reactor overload.",
};

export const ORION_STARLANCER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-orion-starlancer",
  category: "commanders",
  title: "Lucien Orion — The Starlancer",
  lore: {
    summary: "Lucien Orion became the first pilot to successfully survive repeated flights through unstable prototype jump corridors, proving that humanity could once again explore the deepest reaches of the galaxy at unprecedented speed.",
    detailed: "His experimental flight doctrine reshaped expedition tactics across the Afterlight Initiative. Close friends with Valen Ash, a professional rival of Kael Drake, holding great respect for Adrian Kane, and enjoying working with Dr. Lyra Voss, he has never once been caught standing still when it mattered.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:orion-starlancer:longestVelocityChain",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [ASH_TEMPEST_CODEX_ENTRY.id, DRAKE_HUNTER_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: ORION_STARLANCER_ID },
};

export const ORION_STARLANCER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(ORION_STARLANCER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_STARLANCER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_WARDEN, ORION_STARLANCER_COMMANDER];
export const FULL_PROFILES_WITH_STARLANCER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_WARDEN, ORION_STARLANCER_PROFILE];
export const FULL_RECRUITMENT_WITH_STARLANCER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_WARDEN, ORION_STARLANCER_RECRUITMENT];

export function starlancerOverlapReport(): readonly string[] {
  const overlap = findOverlap(ORION_STARLANCER_COMMANDER, FULL_ROSTER_WITH_WARDEN);
  return overlap ? [`${ORION_STARLANCER_ID} overlaps ${overlap}`] : [];
}

export function starlancerArchitectureComplete(): boolean {
  const architecture = architectureFor(ORION_STARLANCER_COMMANDER, ORION_STARLANCER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
