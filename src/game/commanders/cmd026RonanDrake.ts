/**
 * Commander CMD-026 — Ronan Drake "The Sentinel" (AF-124). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-sixth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-seventh codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-017/002/016/008
 * per his spec'd relationships to exactly those four — the roster's
 * eighth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Adrian Kane, Astrid Reyes and Ivan Volkov"), his archetype/class
 * (orbitalCommander/recon) and passive/signature trigger+bonus pairs
 * are deliberately distinct from Kane's guardian/defender kit, Reyes's
 * support/hybrid kit, and Volkov's engineer/assault kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_NANOFORGE, FULL_RECRUITMENT_WITH_NANOFORGE, FULL_ROSTER_WITH_NANOFORGE } from "./cmd025XantheOris";
import { VOLKOV_TITAN_CODEX_ENTRY, VOLKOV_TITAN_ID } from "./cmd018IvanVolkov";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { REYES_WARDEN_CODEX_ENTRY, REYES_WARDEN_ID } from "./cmd016AstridReyes";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import type { CodexEntryDef } from "../codex/codexData";

export const DRAKE_SENTINEL_ID = "drake-sentinel";

export const DRAKE_SENTINEL_COMMANDER: CommanderDef = {
  id: DRAKE_SENTINEL_ID,
  name: "Ronan Drake",
  callsign: "Sentinel",
  archetype: "orbitalCommander",
  faction: "Afterlight Initiative",
  biography: "A perimeter defence commander, orbital security director, and threat assessment specialist who protected humanity's first restored core systems after the Collapse — he believes the best defence is one nobody notices because it never fails.",
  passive: { trigger: "onKill", bonus: { kind: "criticalChance", value: 0.04 } },
  active: { id: "interceptor-grid", name: "Interceptor Grid", cooldownMs: 12000 },
  ultimate: { id: "planetary-defence-matrix", name: "Planetary Defence Matrix", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "security-rating-doctrine",
    description: "Successful interceptions generate Rating — higher Rating unlocks additional interceptors, improved radar coverage, stronger automated responses, and advanced orbital support.",
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

export const DRAKE_SENTINEL_PROFILE: CommanderProfileDef = {
  commanderId: DRAKE_SENTINEL_ID,
  class: "recon",
  visualDesign: "White tactical defence armour with dark graphite reinforcement, blue defensive energy nodes, an orbital targeting visor, deployable defence pylons, a compact radar backpack, integrated shield emitters, and floating interceptor drones.",
  voice: "Low, calm, authoritative, measured, steady.",
  secondaryAbility: { id: "lockdown-protocol", name: "Lockdown Protocol", cooldownMs: 14000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "criticalChance", value: 0.03 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "drake-sentinel:orbitalCommand:endgameNode",
    description: "Ascension III: the Orbital Command branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(DRAKE_SENTINEL_ID, "interception", "Interception", [
      ["criticalChance", 0.03], ["statusChance", 0.04], ["cooldownReduction", 0.04],
      ["criticalDamage", 0.05], ["damage", 0.04], ["criticalChance", 0.12],
    ]),
    branchNodes(DRAKE_SENTINEL_ID, "fortification", "Fortification", [
      ["shieldCapacity", 3], ["shieldRegeneration", 3], ["resourceGain", 0.04],
      ["statusDuration", 0.04], ["boostEfficiency", 0.04], ["shieldCapacity", 10],
    ]),
    branchNodes(DRAKE_SENTINEL_ID, "orbitalCommand", "Orbital Command", [
      ["orbitalPower", 0.05], ["droneEffectiveness", 0.05], ["cooldownReduction", 0.05],
      ["damage", 0.04], ["resourceGain", 0.04], ["orbitalPower", 0.15],
    ]),
  ],
  masteryTrackId: "commander:drake-sentinel",
  personalMissions: [
    { beat: "originStory", name: "Watchtower Station", description: "Where he learned that the best defence is one nobody notices because it never fails." },
    { beat: "recruitment", name: "The Long Watch", description: "A forgotten orbital defence platform to restore, evacuation transports to protect, an enemy infiltration fleet to stop, the planetary warning network to rebuild. He joins after the player demonstrates patience and disciplined defence rather than reckless pursuit." },
    { beat: "personalObjectives", name: "Nothing Gets Through", description: "Pirates, saboteurs, and negligent commanders all meet the same calm, unhurried refusal to let a single breach stand." },
    { beat: "companionMissions", name: "Standing Watch", description: "He scans every horizon twice before he ever calls a perimeter secure." },
    { beat: "legendaryMission", name: "The Final Bastion", description: "The ancient Sentinel Grid reactivated, orbital defence satellites coordinated, a system-wide invasion prevented, the Legendary Sentinel Core unlocked." },
    { beat: "finalResolution", name: "The Watcher", description: "A title for someone who proved that vigilance, held long enough, was its own kind of victory." },
  ],
  loreId: "LORE_COMMANDER_SENTINEL",
  relationships: [
    { subject: "otherCommanders", targetId: VOLKOV_TITAN_ID, dialogueHint: "Close friend of Ivan Volkov — a wall that never falls and a watch that never blinks make an unshakeable pair." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Professional respect for Adrian Kane — Kane holds the line where it breaks; Ronan makes sure it never has to." },
    { subject: "otherCommanders", targetId: REYES_WARDEN_ID, dialogueHint: "Works with Astrid Reyes — a warden and a sentinel trade shifts without ever needing to compare notes." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Collaborates with Nova Iskander — his interceptor pylons and her drone swarms share targeting data as if they were built for each other." },
  ],
  statisticKeys: ["commander:drake-sentinel:usage", "commander:drake-sentinel:victories", "commander:drake-sentinel:interceptions"],
  cosmetics: [
    { kind: "armourVariants", id: "sentinel-watcher-armour" },
    { kind: "animations", id: "sentinel-orbital-targeting" },
    { kind: "colourThemes", id: "sentinel-defence-palette" },
  ],
  voiceLineIds: ["vo-sentinel-mission-start", "vo-sentinel-enemy-detected", "vo-sentinel-boss-encounter", "vo-sentinel-ultimate", "vo-sentinel-victory", "vo-sentinel-low-health"],
  futureExpansionHooks: ["legendary-variant-sentinel-the-watcher"],
};

export const DRAKE_SENTINEL_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: DRAKE_SENTINEL_ID,
  age: 48,
  species: "Human",
  homeworld: "Watchtower Station",
  psychologicalProfile: "Stoic, reliable, patient, observant, protective, and pragmatic — he believes the best defence is one nobody notices because it never fails.",
  leadershipStyle: "Leads by vigilance — he has already spotted the threat three scans before anyone else has finished asking whether one exists.",
  animationStyle: "Measured, deliberate; military precision, frequently scanning horizons, always maintaining awareness.",
  musicMotif: "Military percussion and low orchestral brass beneath electronic radar pulses and ambient synth layers, representing vigilance.",
  personality: "stoic",
  preferredShips: ["bastion-hull-mk1", "ballista-mk3", "sable-dart-mk1", "wayfarer-hull-mk2"],
  preferredWeapons: ["atlas-cluster-battery", "hailborn-array", "voidlance", "coil-ripper-mk2"],
  preferredEquipment: ["aegis-bastion-array", "aegis-ward-projector", "barrier-plate", "vanguard-core"],
  preferredRelics: ["warden-token", "static-node", "conduit-loop", "veil-fragment"],
  preferredResearch: ["barrier-theory", "deep-scanning", "survey-protocols", "field-dynamics"],
  preferredBiomes: ["derelict-expanse", "meridian-rest-frontier", "ancient-core"],
  endingStory: "The Final Bastion keeps every satellite in the Sentinel Grid synchronised long after the system-wide invasion it was built to stop, and every colony he ever watched over still sleeps easier knowing the perimeter has never once gone quiet. He still logs every interception cleanly resolved — to him, that number has always mattered more than any battle fought.",
  dialogueLibrary: [
    { category: "missionStart", line: "The watch begins." },
    { category: "combat", line: "I see you." },
    { category: "bosses", line: "You were expected." },
    { category: "legendaryMoments", line: "All batteries online." },
    { category: "victory", line: "Threat eliminated." },
    { category: "lowHealth", line: "The perimeter... still holds." },
  ],
  masteryChallenges: ["Complete 25 expeditions without a single objective breached.", "Reach maximum Security Rating in 50 separate encounters.", "Complete \"The Final Bastion\" without a single interceptor lost."],
};

export const DRAKE_SENTINEL_RECRUITMENT: RecruitmentDef = {
  commanderId: DRAKE_SENTINEL_ID,
  source: "story",
  requirement: "Complete \"The Long Watch\": restore a forgotten orbital defence platform, protect evacuation transports, stop an enemy infiltration fleet, and rebuild the planetary warning network.",
};

export const DRAKE_SENTINEL_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-drake-sentinel",
  category: "commanders",
  title: "Ronan Drake — The Sentinel",
  lore: {
    summary: "Ronan Drake commanded the orbital defence network that protected humanity's first restored core systems after the Collapse.",
    detailed: "By integrating predictive radar, autonomous interception platforms and civilian warning systems into a unified security grid, he ensured that countless invasions were defeated long before they reached populated worlds. Close friends with Ivan Volkov, professionally respectful of Adrian Kane, working with Astrid Reyes, and collaborating with Nova Iskander, he distrusts pirates, saboteurs, and negligent commanders in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:drake-sentinel:interceptions",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [VOLKOV_TITAN_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id, REYES_WARDEN_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: DRAKE_SENTINEL_ID },
};

export const DRAKE_SENTINEL_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(DRAKE_SENTINEL_RECRUITMENT.source);

export const FULL_ROSTER_WITH_SENTINEL: readonly CommanderDef[] = [...FULL_ROSTER_WITH_NANOFORGE, DRAKE_SENTINEL_COMMANDER];
export const FULL_PROFILES_WITH_SENTINEL: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_NANOFORGE, DRAKE_SENTINEL_PROFILE];
export const FULL_RECRUITMENT_WITH_SENTINEL: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_NANOFORGE, DRAKE_SENTINEL_RECRUITMENT];

export function sentinelOverlapReport(): readonly string[] {
  const overlap = findOverlap(DRAKE_SENTINEL_COMMANDER, FULL_ROSTER_WITH_NANOFORGE);
  return overlap ? [`${DRAKE_SENTINEL_ID} overlaps ${overlap}`] : [];
}

export function sentinelArchitectureComplete(): boolean {
  const architecture = architectureFor(DRAKE_SENTINEL_COMMANDER, DRAKE_SENTINEL_PROFILE);
  return Object.values(architecture).every(Boolean);
}
