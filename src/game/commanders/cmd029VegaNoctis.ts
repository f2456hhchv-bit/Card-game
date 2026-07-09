/**
 * Commander CMD-029 — Vega Noctis "The Voidwalker" (AF-127). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-ninth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A thirtieth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-010/015/019/023
 * per her spec'd relationships to exactly those four — the roster's
 * eleventh commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Zephyr Kain and Aurelion Vex"), her archetype/class
 * (voidSpecialist/experimental) and passive/signature trigger+bonus
 * pairs are deliberately distinct from Kain's prototypePilot/scientist
 * kit and Vex's recon/support kit. Her Ability One's active.id is
 * deliberately disambiguated from CMD-007 Orion Vale's identically
 * named "Phase Step" ability (active.id is not part of the real
 * fingerprint/findOverlap law, but the spec's display name "Phase
 * Step" is kept verbatim while the id is namespaced to avoid two
 * different commanders sharing one ability id).
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_BEASTMASTER, FULL_RECRUITMENT_WITH_BEASTMASTER, FULL_ROSTER_WITH_BEASTMASTER } from "./cmd028DorianFen";
import { VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { KAIN_SINGULARITY_CODEX_ENTRY, KAIN_SINGULARITY_ID } from "./cmd015ZephyrKain";
import { MYRR_ORACLE_CODEX_ENTRY, MYRR_ORACLE_ID } from "./cmd019SeleneMyrr";
import { ROSS_HORIZON_CODEX_ENTRY, ROSS_HORIZON_ID } from "./cmd023ElianaRoss";
import type { CodexEntryDef } from "../codex/codexData";

export const NOCTIS_VOIDWALKER_ID = "noctis-voidwalker";

export const NOCTIS_VOIDWALKER_COMMANDER: CommanderDef = {
  id: NOCTIS_VOIDWALKER_ID,
  name: "Vega Noctis",
  callsign: "Voidwalker",
  archetype: "voidSpecialist",
  faction: "Afterlight Initiative",
  biography: "An anomaly navigator, deep void explorer, and reality boundary specialist who became the first explorer to successfully navigate and return from the expanding dimensional fractures that appeared after the Collapse — she has stared into the emptiness long enough to understand that hope shines brightest where light cannot reach.",
  passive: { trigger: "onKill", bonus: { kind: "criticalDamage", value: 0.05 } },
  active: { id: "void-phase-step", name: "Phase Step", cooldownMs: 9000 },
  ultimate: { id: "beyond-the-veil", name: "Beyond the Veil", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "void-stability-doctrine",
    description: "Controlled Void interactions generate Stability — higher Stability unlocks safer teleports, larger dimensional tears, enhanced exploration, and unique anomaly rewards; careless use causes temporary instability penalties.",
    passive: { trigger: "onLowHealth", bonus: { kind: "boostEfficiency", value: 0.04 } },
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

export const NOCTIS_VOIDWALKER_PROFILE: CommanderProfileDef = {
  commanderId: NOCTIS_VOIDWALKER_ID,
  class: "experimental",
  visualDesign: "Midnight-black adaptive armour with deep violet energy veins, a shifting starfield cloak, floating void crystals, a fractured visor, gravitational distortion surrounding her movement, small galaxies visible within her armour plating, and a dark silhouette with brilliant cosmic highlights.",
  voice: "Soft, calm, almost whispered, wise, confident.",
  secondaryAbility: { id: "reality-fracture", name: "Reality Fracture", cooldownMs: 13000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "movementSpeed", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "noctis-voidwalker:transcendence:endgameNode",
    description: "Ascension III: the Transcendence branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(NOCTIS_VOIDWALKER_ID, "traversal", "Traversal", [
      ["movementSpeed", 0.05], ["boostEfficiency", 0.04], ["cooldownReduction", 0.04],
      ["criticalChance", 0.03], ["statusChance", 0.03], ["movementSpeed", 0.15],
    ]),
    branchNodes(NOCTIS_VOIDWALKER_ID, "anomalies", "Anomalies", [
      ["statusDuration", 0.05], ["damage", 0.04], ["statusChance", 0.04],
      ["criticalDamage", 0.05], ["resourceGain", 0.04], ["statusDuration", 0.15],
    ]),
    branchNodes(NOCTIS_VOIDWALKER_ID, "transcendence", "Transcendence", [
      ["criticalDamage", 0.05], ["cooldownReduction", 0.05], ["boostEfficiency", 0.04],
      ["experienceGain", 0.04], ["resourceGain", 0.04], ["criticalDamage", 0.15],
    ]),
  ],
  masteryTrackId: "commander:noctis-voidwalker",
  personalMissions: [
    { beat: "originStory", name: "Unknown Origins", description: "Where she learned that hope shines brightest where light cannot reach, long before anyone else was willing to look." },
    { beat: "recruitment", name: "Into Nothing", description: "A permanently expanding Void fracture to enter, a lost expedition to rescue, impossible navigation data to recover, the anomaly to stabilise before nearby systems are consumed. She joins after the player chooses to save every survivor despite the increasing danger." },
    { beat: "personalObjectives", name: "The Void Is Not the Enemy", description: "Those seeking to weaponise the Void, and scientists willing to sacrifice lives for forbidden knowledge, both meet the same quiet, immovable refusal." },
    { beat: "companionMissions", name: "It Remembers Us", description: "Every rift she opens closes exactly the way she intended, never the other way around." },
    { beat: "legendaryMission", name: "The Silent Horizon", description: "Known space travelled beyond, the edge of observable reality mapped, the First Dimensional Gateway restored, the Legendary Void Compass unlocked." },
    { beat: "finalResolution", name: "The Between", description: "A title for someone who proved that the space between certainties was survivable, and worth exploring." },
  ],
  loreId: "LORE_COMMANDER_VOIDWALKER",
  relationships: [
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Close friend of Aurelion Vex — time and the Void both bend for the two of them, and neither has ever needed to explain that to the other." },
    { subject: "otherCommanders", targetId: KAIN_SINGULARITY_ID, dialogueHint: "Professional respect for Zephyr Kain — a singularity and a Void fracture are cousins, and she has never once doubted his nerve near either." },
    { subject: "otherCommanders", targetId: MYRR_ORACLE_ID, dialogueHint: "Works with Selene Myrr — a navigator who reads the unknown and an oracle who reads probability trade notes without needing a shared language." },
    { subject: "otherCommanders", targetId: ROSS_HORIZON_ID, dialogueHint: "Collaborates with Eliana Ross — every horizon Ross finds worth crossing, Vega has usually already walked past twice." },
  ],
  statisticKeys: ["commander:noctis-voidwalker:usage", "commander:noctis-voidwalker:victories", "commander:noctis-voidwalker:anomaliesStabilised"],
  cosmetics: [
    { kind: "armourVariants", id: "voidwalker-between-armour" },
    { kind: "animations", id: "voidwalker-galaxy-effects" },
    { kind: "colourThemes", id: "voidwalker-cosmic-palette" },
  ],
  voiceLineIds: ["vo-voidwalker-mission-start", "vo-voidwalker-void-rift", "vo-voidwalker-boss-encounter", "vo-voidwalker-ultimate", "vo-voidwalker-victory", "vo-voidwalker-low-health"],
  futureExpansionHooks: ["legendary-variant-voidwalker-the-between"],
};

export const NOCTIS_VOIDWALKER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: NOCTIS_VOIDWALKER_ID,
  age: 38,
  species: "Human",
  homeworld: "Unknown",
  psychologicalProfile: "Quiet, reflective, fearless, compassionate, intuitive, and resilient — she has stared into the emptiness long enough to understand that hope shines brightest where light cannot reach.",
  leadershipStyle: "Leads by presence — she has already walked the path once before anyone else has finished deciding whether it is safe to follow.",
  animationStyle: "Weightless, fluid; reality ripples around her footsteps, teleportation feels smooth rather than abrupt, stars briefly appear before fading.",
  musicMotif: "Deep ambient drones and celestial choir beneath slow piano and subtle reversed strings, with a cosmic atmosphere, representing infinite mystery.",
  personality: "fearless",
  preferredShips: ["maelstrom-x1", "sable-dart-mk1", "dawnspire", "wayfarer-hull-mk2"],
  preferredWeapons: ["voidlance", "novasplitter", "hailborn-array", "helios-prism-array"],
  preferredEquipment: ["horizon-flux-capacitor", "aegis-ward-projector", "cryo-manifold", "vanguard-core"],
  preferredRelics: ["veil-fragment", "singularity-keepsake", "static-node", "conduit-loop"],
  preferredResearch: ["warp-charting", "ancient-conduit", "unified-theory", "field-dynamics"],
  preferredBiomes: ["void-expanse", "singularity-zone", "derelict-expanse"],
  endingStory: "The Silent Horizon keeps mapping the edge of observable reality long after the Legendary Void Compass is unlocked, and every fracture she ever stabilised now stands as a gateway rather than a grave. She still counts every survivor she has ever brought home from the dark — to her, that number has always mattered more than any anomaly claimed.",
  dialogueLibrary: [
    { category: "missionStart", line: "The darkness is only another path." },
    { category: "combat", line: "It remembers us." },
    { category: "bosses", line: "Even infinity has boundaries." },
    { category: "legendaryMoments", line: "Walk beyond." },
    { category: "victory", line: "We returned... together." },
    { category: "lowHealth", line: "The Void is becoming louder..." },
  ],
  masteryChallenges: ["Complete 25 expeditions without a single unstabilised anomaly left behind.", "Reach maximum Void Stability in 50 separate encounters.", "Complete \"The Silent Horizon\" without a single careless Void interaction."],
};

export const NOCTIS_VOIDWALKER_RECRUITMENT: RecruitmentDef = {
  commanderId: NOCTIS_VOIDWALKER_ID,
  source: "hiddenDiscoveries",
  requirement: "Complete \"Into Nothing\": enter a permanently expanding Void fracture, rescue a lost expedition, recover impossible navigation data, and stabilise the anomaly before nearby systems are consumed — saving every survivor despite the increasing danger.",
};

export const NOCTIS_VOIDWALKER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-noctis-voidwalker",
  category: "commanders",
  title: "Vega Noctis — The Voidwalker",
  lore: {
    summary: "Vega Noctis became the first explorer to successfully navigate and return from the expanding dimensional fractures that appeared after the Collapse.",
    detailed: "Rather than sealing every anomaly, she demonstrated that some could be stabilised and transformed into gateways for exploration, opening entirely new frontiers beyond conventional space. Close friends with Aurelion Vex, professionally respectful of Zephyr Kain, working with Selene Myrr, and collaborating with Eliana Ross, she distrusts those seeking to weaponise the Void and scientists willing to sacrifice lives for forbidden knowledge in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:noctis-voidwalker:anomaliesStabilised",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [VEX_CHRONOMANCER_CODEX_ENTRY.id, KAIN_SINGULARITY_CODEX_ENTRY.id, MYRR_ORACLE_CODEX_ENTRY.id, ROSS_HORIZON_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: NOCTIS_VOIDWALKER_ID },
};

export const NOCTIS_VOIDWALKER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(NOCTIS_VOIDWALKER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_VOIDWALKER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_BEASTMASTER, NOCTIS_VOIDWALKER_COMMANDER];
export const FULL_PROFILES_WITH_VOIDWALKER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_BEASTMASTER, NOCTIS_VOIDWALKER_PROFILE];
export const FULL_RECRUITMENT_WITH_VOIDWALKER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_BEASTMASTER, NOCTIS_VOIDWALKER_RECRUITMENT];

export function voidwalkerOverlapReport(): readonly string[] {
  const overlap = findOverlap(NOCTIS_VOIDWALKER_COMMANDER, FULL_ROSTER_WITH_BEASTMASTER);
  return overlap ? [`${NOCTIS_VOIDWALKER_ID} overlaps ${overlap}`] : [];
}

export function voidwalkerArchitectureComplete(): boolean {
  const architecture = architectureFor(NOCTIS_VOIDWALKER_COMMANDER, NOCTIS_VOIDWALKER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
