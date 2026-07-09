/**
 * Commander CMD-010 — Aurelion Vex "The Chronomancer" (AF-108). The
 * canonical, individually-specified implementation of Afterlight's
 * tenth fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. An eleventh codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-004/001/006 per his spec'd relationships to
 * exactly those three.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_STARFORGED, FULL_RECRUITMENT_WITH_STARFORGED, FULL_ROSTER_WITH_STARFORGED } from "./cmd009CassiaThorne";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import type { CodexEntryDef } from "../codex/codexData";

export const VEX_CHRONOMANCER_ID = "vex-chronomancer";

export const VEX_CHRONOMANCER_COMMANDER: CommanderDef = {
  id: VEX_CHRONOMANCER_ID,
  name: "Aurelion Vex",
  callsign: "Chronomancer",
  archetype: "recon",
  faction: "Afterlight Initiative",
  biography: "A temporal physicist, chrono expedition specialist, and Timeline Recovery Director who led humanity's first successful expedition through a naturally occurring temporal fracture — he understands that changing history always carries a cost, and refuses to rewrite lives for personal gain.",
  passive: { trigger: "onLowHealth", bonus: { kind: "cooldownReduction", value: 0.05 } },
  active: { id: "time-fracture", name: "Time Fracture", cooldownMs: 13000 },
  ultimate: { id: "frozen-moment", name: "Frozen Moment", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "temporal-charge-doctrine",
    description: "Perfect timing generates Charge — rising ability efficiency, cooldown reduction, movement, and critical timing windows, with maximum Charge unlocking enhanced temporal abilities.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "movementSpeed", value: 0.04 } },
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

export const VEX_CHRONOMANCER_PROFILE: CommanderProfileDef = {
  commanderId: VEX_CHRONOMANCER_ID,
  class: "support",
  visualDesign: "White and silver temporal armour with floating clockwork rings, blue temporal energy, a golden chronometer core, a transparent flowing cloak, fractal clock fragments, and an elegant scientific silhouette — time distortion surrounds his every movement.",
  voice: "Calm, soft, reflective, measured, wise.",
  secondaryAbility: { id: "chrono-recall", name: "Chrono Recall", cooldownMs: 15000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "vex-chronomancer:chronology:endgameNode",
    description: "Ascension III: the Chronology branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(VEX_CHRONOMANCER_ID, "acceleration", "Acceleration", [
      ["cooldownReduction", 0.05], ["movementSpeed", 0.04], ["resourceGain", 0.05],
      ["cooldownReduction", 0.04], ["boostEfficiency", 0.05], ["cooldownReduction", 0.15],
    ]),
    branchNodes(VEX_CHRONOMANCER_ID, "temporal-control", "Temporal Control", [
      ["statusChance", 0.05], ["statusDuration", 0.05], ["criticalChance", 0.04],
      ["statusChance", 0.05], ["damage", 0.04], ["statusDuration", 0.15],
    ]),
    branchNodes(VEX_CHRONOMANCER_ID, "chronology", "Chronology", [
      ["shieldRegeneration", 3], ["experienceGain", 0.05], ["shieldCapacity", 4],
      ["resourceGain", 0.05], ["shieldRegeneration", 4], ["shieldCapacity", 12],
    ]),
  ],
  masteryTrackId: "commander:vex-chronomancer",
  personalMissions: [
    { beat: "originStory", name: "Chronos Research Ring", description: "Where he learned that time remembers everything, and that every beginning contains an ending." },
    { beat: "recruitment", name: "The Broken Hour", description: "A permanently looping research station, trapped scientists to rescue, collapsing timelines to repair, temporal collapse to escape before it consumes the station. He joins after the player preserves the researchers' lives instead of prioritising experimental technology." },
    { beat: "personalObjectives", name: "No Rewritten Lives", description: "He will bend a moment to save someone, but never to profit from someone else's loss." },
    { beat: "companionMissions", name: "Borrowed Seconds", description: "Every Chrono Recall he lends an ally is a second he could have kept for himself." },
    { beat: "legendaryMission", name: "The Last Second", description: "The destruction of the Chronos Ring prevented, multiple parallel timelines navigated, the Prime Timeline restored, the Legendary Chrono Engine unlocked." },
    { beat: "finalResolution", name: "The Keeper of Hours", description: "A title for someone who was offered every timeline and chose to protect the one everyone was already living in." },
  ],
  loreId: "LORE_COMMANDER_CHRONOMANCER",
  relationships: [
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Close friend of Seraphina Cael — two physicists who each learned the universe negotiates, and neither flinches from the terms." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Lyra Voss — her curiosity always stops exactly where consequence begins, the same discipline his own work demands." },
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Scientific collaboration with Aria Sol — resonance and temporal charge turn out to share more mathematics than either expected." },
  ],
  statisticKeys: ["commander:vex-chronomancer:usage", "commander:vex-chronomancer:victories", "commander:vex-chronomancer:perfectRecalls"],
  cosmetics: [
    { kind: "armourVariants", id: "chronomancer-keeper-armour" },
    { kind: "animations", id: "chronomancer-clock-effects" },
    { kind: "colourThemes", id: "chronomancer-temporal-palette" },
  ],
  voiceLineIds: ["vo-chronomancer-mission-start", "vo-chronomancer-time-anomaly", "vo-chronomancer-boss-encounter", "vo-chronomancer-ultimate", "vo-chronomancer-victory"],
  futureExpansionHooks: ["legendary-variant-chronomancer-the-keeper-of-hours"],
};

export const VEX_CHRONOMANCER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: VEX_CHRONOMANCER_ID,
  age: 35,
  species: "Human",
  homeworld: "Chronos Research Ring",
  psychologicalProfile: "Patient, thoughtful, highly intelligent, reserved, compassionate, and melancholic — he understands that changing history always carries a cost, and refuses to rewrite lives for personal gain.",
  leadershipStyle: "Leads by quiet example — he never orders a risk he wouldn't personally absorb the consequences of first.",
  animationStyle: "Graceful, minimal movement; reality briefly pauses around him, objects subtly rewind, particles reverse direction.",
  musicMotif: "Reverse piano and soft orchestral strings over clock percussion and ambient synthesizers, building in slow crescendos that represent inevitability.",
  personality: "haunted",
  preferredShips: ["aurelia-hull-mk1", "bastion-hull-mk1", "maelstrom-x1", "wayfarer-hull-mk2"],
  preferredWeapons: ["hailborn-array", "foundry-sunlance", "coil-ripper-mk2", "paragon-flux-driver"],
  preferredEquipment: ["horizon-flux-capacitor", "vanguard-core", "aegis-ward-projector", "cryo-manifold"],
  preferredRelics: ["frost-shard", "veil-fragment", "gambler-die", "singularity-keepsake"],
  preferredResearch: ["ancient-conduit", "deep-scanning", "survey-protocols", "warp-charting"],
  preferredBiomes: ["ancient-core", "singularity-zone", "frozen-reach"],
  endingStory: "The Prime Timeline holds, and the Chronos Ring keeps its quiet orbit long after the last fracture closes. He still logs every Recall he spends on someone else before he logs the ones he spends on himself — a discipline nobody asked him to keep, and one he has never once dropped.",
  dialogueLibrary: [
    { category: "missionStart", line: "Time remembers everything." },
    { category: "combat", line: "This moment has happened before." },
    { category: "bosses", line: "Every beginning contains an ending." },
    { category: "legendaryMoments", line: "Just... one more second." },
    { category: "victory", line: "The future remains unwritten." },
  ],
  masteryChallenges: ["Complete 50 expeditions without a single mistimed Chrono Recall.", "Freeze an elite encounter's entire duration with Frozen Moment timing alone.", "Reach maximum Temporal Charge in 25 separate engagements without overheating a single ally cooldown."],
};

export const VEX_CHRONOMANCER_RECRUITMENT: RecruitmentDef = {
  commanderId: VEX_CHRONOMANCER_ID,
  source: "research",
  requirement: "Complete \"The Broken Hour\": investigate a permanently looping research station, rescue its trapped scientists, repair collapsing timelines, and escape before temporal collapse consumes the station.",
};

export const VEX_CHRONOMANCER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-vex-chronomancer",
  category: "commanders",
  title: "Aurelion Vex — The Chronomancer",
  lore: {
    summary: "Aurelion Vex led humanity's first successful expedition through a naturally occurring temporal fracture.",
    detailed: "Rather than exploiting time for military advantage, he dedicated his research to preserving history, preventing paradoxes, and ensuring that scientific progress never came at the cost of humanity's past. Close friends with Seraphina Cael, professionally respectful of Dr. Lyra Voss, and a scientific collaborator with Aria Sol, he distrusts anyone who would weaponise time.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:vex-chronomancer:perfectRecalls",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [CAEL_WEAVER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, SOL_RESONANT_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: VEX_CHRONOMANCER_ID },
};

export const VEX_CHRONOMANCER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(VEX_CHRONOMANCER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_CHRONOMANCER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_STARFORGED, VEX_CHRONOMANCER_COMMANDER];
export const FULL_PROFILES_WITH_CHRONOMANCER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_STARFORGED, VEX_CHRONOMANCER_PROFILE];
export const FULL_RECRUITMENT_WITH_CHRONOMANCER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_STARFORGED, VEX_CHRONOMANCER_RECRUITMENT];

export function chronomancerOverlapReport(): readonly string[] {
  const overlap = findOverlap(VEX_CHRONOMANCER_COMMANDER, FULL_ROSTER_WITH_STARFORGED);
  return overlap ? [`${VEX_CHRONOMANCER_ID} overlaps ${overlap}`] : [];
}

export function chronomancerArchitectureComplete(): boolean {
  const architecture = architectureFor(VEX_CHRONOMANCER_COMMANDER, VEX_CHRONOMANCER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
