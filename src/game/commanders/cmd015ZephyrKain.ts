/**
 * Commander CMD-015 — Zephyr Kain "The Singularity" (AF-113). The
 * canonical, individually-specified implementation of Afterlight's
 * fifteenth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A sixteenth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-004/010/001
 * per his spec'd relationships to exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_PHOTON, FULL_RECRUITMENT_WITH_PHOTON, FULL_ROSTER_WITH_PHOTON } from "./cmd014RheaSolari";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const KAIN_SINGULARITY_ID = "kain-singularity";

export const KAIN_SINGULARITY_COMMANDER: CommanderDef = {
  id: KAIN_SINGULARITY_ID,
  name: "Zephyr Kain",
  callsign: "Singularity",
  archetype: "prototypePilot",
  faction: "Afterlight Initiative",
  biography: "A gravitational physicist, singularity engineer, and black hole navigation specialist who led the first successful expedition into the event horizon of a stable artificial singularity — he believes gravity is the universe's oldest language.",
  passive: { trigger: "onKill", bonus: { kind: "statusChance", value: 0.05 } },
  active: { id: "gravity-well", name: "Gravity Well", cooldownMs: 13000 },
  ultimate: { id: "event-horizon", name: "Event Horizon", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "gravitational-equilibrium-doctrine",
    description: "Using gravity abilities generates Equilibrium — perfect Equilibrium unlocks larger singularities, longer orbit chains, reduced cooldowns, and enhanced battlefield manipulation, while poor management destabilises gravity and weakens abilities.",
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

export const KAIN_SINGULARITY_PROFILE: CommanderProfileDef = {
  commanderId: KAIN_SINGULARITY_ID,
  class: "scientist",
  visualDesign: "Midnight-black research armour with gold gravitational rings orbiting his torso, a deep violet singularity core, a distorted cloak, a gravity lens visor, and micro-black-hole stabilisers — floating debris slowly orbits him at all times.",
  voice: "Deep, calm, analytical, soft spoken, quiet confidence.",
  secondaryAbility: { id: "orbital-collapse", name: "Orbital Collapse", cooldownMs: 15000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "statusDuration", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "kain-singularity:singularity:endgameNode",
    description: "Ascension III: the Singularity branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(KAIN_SINGULARITY_ID, "compression", "Compression", [
      ["damage", 0.05], ["statusChance", 0.05], ["statusDuration", 0.04],
      ["resourceGain", 0.04], ["criticalChance", 0.04], ["damage", 0.16],
    ]),
    branchNodes(KAIN_SINGULARITY_ID, "orbital-dynamics", "Orbital Dynamics", [
      ["movementSpeed", 0.04], ["statusDuration", 0.05], ["pickupRadius", 0.05],
      ["resourceGain", 0.06], ["boostEfficiency", 0.05], ["statusDuration", 0.15],
    ]),
    branchNodes(KAIN_SINGULARITY_ID, "singularity", "Singularity", [
      ["cooldownReduction", 0.05], ["damage", 0.05], ["statusChance", 0.05],
      ["shieldCapacity", 4], ["experienceGain", 0.05], ["cooldownReduction", 0.15],
    ]),
  ],
  masteryTrackId: "commander:kain-singularity",
  personalMissions: [
    { beat: "originStory", name: "Event Horizon Laboratory", description: "Where he learned that gravity is the universe's oldest language, and that everything falls eventually." },
    { beat: "recruitment", name: "The Falling Sky", description: "An unstable artificial black hole to investigate, complete sector collapse to prevent, a gravitational core to stabilise, trapped expedition fleets to save. He joins after the player sacrifices valuable research time to rescue stranded civilians." },
    { beat: "personalObjectives", name: "No Weaponised Catastrophes", description: "Anyone attempting to weaponise gravitational catastrophes gets exactly one calm, precise warning." },
    { beat: "companionMissions", name: "Balanced Orbit", description: "He calculates every ally's safe distance from a collapsing singularity before he calculates his own." },
    { beat: "legendaryMission", name: "The Heart of Infinity", description: "The galaxy's oldest known singularity entered, impossible space mapped, the Ancient Gravity Engine restored, the Legendary Event Horizon Core unlocked." },
    { beat: "finalResolution", name: "The Horizon", description: "A title for someone who spent a career proving that even the universe's harshest law could be read as a language, not a sentence." },
  ],
  loreId: "LORE_COMMANDER_SINGULARITY",
  relationships: [
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Scientific collaboration with Seraphina Cael — quantum weaving and gravitational engineering keep arriving at the same equations from opposite directions." },
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Professional respect for Aurelion Vex — gravity and time turn out to be closer relatives than either of them expected." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Close friend of Dr. Lyra Voss — her caution about the unknown is the same discipline that has kept his singularities from ever once going wrong." },
  ],
  statisticKeys: ["commander:kain-singularity:usage", "commander:kain-singularity:victories", "commander:kain-singularity:orbitalCollapses"],
  cosmetics: [
    { kind: "armourVariants", id: "singularity-horizon-armour" },
    { kind: "animations", id: "singularity-orbiting-debris" },
    { kind: "colourThemes", id: "singularity-gravity-palette" },
  ],
  voiceLineIds: ["vo-singularity-mission-start", "vo-singularity-gravity-anomaly", "vo-singularity-boss-encounter", "vo-singularity-ultimate", "vo-singularity-victory"],
  futureExpansionHooks: ["legendary-variant-singularity-the-horizon"],
};

export const KAIN_SINGULARITY_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: KAIN_SINGULARITY_ID,
  age: 42,
  species: "Human",
  homeworld: "Event Horizon Laboratory",
  psychologicalProfile: "Highly intelligent, reserved, methodical, patient, dry-humoured, and fearless — he believes gravity is the universe's oldest language.",
  leadershipStyle: "Leads by calculation — he maps every possible collapse before he ever asks anyone to stand near one.",
  animationStyle: "Controlled, weightless; nearby objects subtly drift, his movement gently bends surrounding space, and gravity ripples accompany his abilities.",
  musicMotif: "Low orchestral drones and sub-bass pulses over sparse piano and cosmic ambience, building to massive crescendos that represent impossible scale.",
  personality: "fearless",
  preferredShips: ["maelstrom-x1", "aurelia-hull-mk1", "hivemother-mk1", "dawnspire"],
  preferredWeapons: ["paragon-flux-driver", "voidlance", "atlas-cluster-battery", "foundry-sunlance"],
  preferredEquipment: ["horizon-flux-capacitor", "vanguard-core", "aegis-ward-projector", "aegis-bastion-array"],
  preferredRelics: ["singularity-keepsake", "veil-fragment", "conduit-loop", "frost-shard"],
  preferredResearch: ["unified-theory", "ancient-conduit", "warp-charting", "deep-scanning"],
  preferredBiomes: ["singularity-zone", "void-expanse", "ancient-core"],
  endingStory: "The Event Horizon Core keeps every stabilised singularity in careful balance long after the last collapse is mapped, and every gravity anomaly he ever studied afterward earns the same first question: what is it trying to say. He still calls a solved equation \"provisionally correct\" — gravity, in his experience, always keeps one more secret.",
  dialogueLibrary: [
    { category: "missionStart", line: "Everything falls eventually." },
    { category: "combat", line: "The universe is bending... beautifully." },
    { category: "bosses", line: "Even giants obey gravity." },
    { category: "legendaryMoments", line: "Collapse into possibility." },
    { category: "victory", line: "The stars remain in balance." },
  ],
  masteryChallenges: ["Maintain Perfect Equilibrium for an entire expedition without a single destabilisation.", "Collapse 50 Orbital Collapse formations without losing a single caught enemy.", "Complete \"The Heart of Infinity\" without Event Horizon ever destabilising."],
};

export const KAIN_SINGULARITY_RECRUITMENT: RecruitmentDef = {
  commanderId: KAIN_SINGULARITY_ID,
  source: "hiddenDiscoveries",
  requirement: "Complete \"The Falling Sky\": investigate an unstable artificial black hole, prevent complete sector collapse, stabilise the gravitational core, and save trapped expedition fleets.",
};

export const KAIN_SINGULARITY_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-kain-singularity",
  category: "commanders",
  title: "Zephyr Kain — The Singularity",
  lore: {
    summary: "Zephyr Kain led the first successful expedition into the event horizon of a stable artificial singularity.",
    detailed: "His discoveries revolutionised gravitational engineering, making controlled gravity manipulation one of humanity's greatest technological achievements since the rediscovery of the Afterlight Network. A scientific collaborator with Seraphina Cael, professionally respectful of Aurelion Vex, and a close friend of Dr. Lyra Voss, he distrusts anyone attempting to weaponise gravitational catastrophes.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:kain-singularity:orbitalCollapses",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [CAEL_WEAVER_CODEX_ENTRY.id, VEX_CHRONOMANCER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: KAIN_SINGULARITY_ID },
};

export const KAIN_SINGULARITY_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(KAIN_SINGULARITY_RECRUITMENT.source);

export const FULL_ROSTER_WITH_SINGULARITY: readonly CommanderDef[] = [...FULL_ROSTER_WITH_PHOTON, KAIN_SINGULARITY_COMMANDER];
export const FULL_PROFILES_WITH_SINGULARITY: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_PHOTON, KAIN_SINGULARITY_PROFILE];
export const FULL_RECRUITMENT_WITH_SINGULARITY: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_PHOTON, KAIN_SINGULARITY_RECRUITMENT];

export function singularityOverlapReport(): readonly string[] {
  const overlap = findOverlap(KAIN_SINGULARITY_COMMANDER, FULL_ROSTER_WITH_PHOTON);
  return overlap ? [`${KAIN_SINGULARITY_ID} overlaps ${overlap}`] : [];
}

export function singularityArchitectureComplete(): boolean {
  const architecture = architectureFor(KAIN_SINGULARITY_COMMANDER, KAIN_SINGULARITY_PROFILE);
  return Object.values(architecture).every(Boolean);
}
