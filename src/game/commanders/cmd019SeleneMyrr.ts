/**
 * Commander CMD-019 — Selene Myrr "The Oracle" (AF-117). The canonical,
 * individually-specified implementation of Afterlight's nineteenth
 * fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A twentieth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing CMD-010/001/004 per her spec'd relationships to
 * exactly those three. Per the spec's own self-review directive
 * ("Reduce overlap with reconnaissance and research Commanders"), her
 * archetype/class (support/support) deliberately AVOID the `recon`
 * archetype used four times already (Voss/Drake/Vex/Korven), leaning
 * instead into squad-wide strategic support — a fresh, untouched
 * archetype/class double-match.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_TITAN, FULL_RECRUITMENT_WITH_TITAN, FULL_ROSTER_WITH_TITAN } from "./cmd018IvanVolkov";
import { VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import type { CodexEntryDef } from "../codex/codexData";

export const MYRR_ORACLE_ID = "myrr-oracle";

export const MYRR_ORACLE_COMMANDER: CommanderDef = {
  id: MYRR_ORACLE_ID,
  name: "Selene Myrr",
  callsign: "Oracle",
  archetype: "support",
  faction: "Afterlight Initiative",
  biography: "A strategic forecast scientist, battlefield simulation director, and predictive systems architect who rebuilt humanity's predictive analytics systems using recovered Afterlight computational arrays — she believes perfect preparation saves more lives than perfect weapons.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "pickupRadius", value: 0.05 } },
  active: { id: "tactical-projection", name: "Tactical Projection", cooldownMs: 13000 },
  ultimate: { id: "future-vision", name: "Future Vision", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "prediction-level-doctrine",
    description: "Scanning, successful dodges, enemy analysis, and mission intelligence all generate Prediction — higher Prediction unlocks advanced simulations, automatic warnings, strategic enhancements, and rare battlefield opportunities.",
    passive: { trigger: "onKill", bonus: { kind: "resourceGain", value: 0.05 } },
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

export const MYRR_ORACLE_PROFILE: CommanderProfileDef = {
  commanderId: MYRR_ORACLE_ID,
  class: "support",
  visualDesign: "An elegant white command suit with silver neural circuitry, floating holographic prediction rings, a transparent tactical cloak, a blue quantum visor, orbiting tactical drones, and predictive holo-displays — a minimalist scientific aesthetic throughout.",
  voice: "Soft, confident, measured, calm, intellectually reassuring.",
  secondaryAbility: { id: "probability-matrix", name: "Probability Matrix", cooldownMs: 14000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "criticalChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "myrr-oracle:oracle:endgameNode",
    description: "Ascension III: the Oracle branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(MYRR_ORACLE_ID, "analysis", "Analysis", [
      ["criticalChance", 0.05], ["statusChance", 0.04], ["criticalDamage", 0.08],
      ["criticalChance", 0.04], ["pickupRadius", 0.04], ["criticalDamage", 0.16],
    ]),
    branchNodes(MYRR_ORACLE_ID, "strategy", "Strategy", [
      ["experienceGain", 0.05], ["resourceGain", 0.05], ["resourceGain", 0.06],
      ["cooldownReduction", 0.05], ["boostEfficiency", 0.04], ["cooldownReduction", 0.15],
    ]),
    branchNodes(MYRR_ORACLE_ID, "oracle", "Oracle", [
      ["statusDuration", 0.05], ["criticalChance", 0.05], ["experienceGain", 0.06],
      ["resourceGain", 0.05], ["shieldCapacity", 4], ["experienceGain", 0.15],
    ]),
  ],
  masteryTrackId: "commander:myrr-oracle",
  personalMissions: [
    { beat: "originStory", name: "Oracle Station Theta", description: "Where she learned that the future has already begun, and that perfect preparation saves more lives than perfect weapons." },
    { beat: "recruitment", name: "The Infinite Equation", description: "A lost predictive supercomputer to recover, hostile factions to keep from its simulations, tactical anomalies to solve, the Oracle Network to preserve. She joins after the player chooses to preserve knowledge rather than destroy it to deny enemy access." },
    { beat: "personalObjectives", name: "No Unweighted Decisions", description: "Leaders ruled by emotion and blind aggression both earn the same calm, unshakeable correction." },
    { beat: "companionMissions", name: "Charted Ahead", description: "Every ally's route gets simulated before they walk it, whether or not they notice the calculation being made on their behalf." },
    { beat: "legendaryMission", name: "Tomorrow's Memory", description: "The legendary Oracle Array restored, a galaxy-wide invasion predicted, multiple expedition fleets coordinated, the Legendary Predictive Core unlocked." },
    { beat: "finalResolution", name: "The Foresighted", description: "A title for someone who measured every victory by how many outcomes never had to happen at all." },
  ],
  loreId: "LORE_COMMANDER_ORACLE",
  relationships: [
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Close friend of Aurelion Vex — foresight and time turn out to be the same discipline, argued from opposite directions." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Lyra Voss — her caution about the unknown is the same discipline that keeps a prediction honest." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Collaborates with Seraphina Cael — quantum weaving and predictive modelling keep arriving at the same equations from different directions entirely." },
  ],
  statisticKeys: ["commander:myrr-oracle:usage", "commander:myrr-oracle:victories", "commander:myrr-oracle:threatsForecast"],
  cosmetics: [
    { kind: "armourVariants", id: "oracle-foresighted-armour" },
    { kind: "animations", id: "oracle-holographic-constellations" },
    { kind: "colourThemes", id: "oracle-silver-blue-palette" },
  ],
  voiceLineIds: ["vo-oracle-mission-start", "vo-oracle-boss-encounter", "vo-oracle-ultimate", "vo-oracle-victory", "vo-oracle-low-health"],
  futureExpansionHooks: ["legendary-variant-oracle-the-foresighted"],
};

export const MYRR_ORACLE_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: MYRR_ORACLE_ID,
  age: 39,
  species: "Human",
  homeworld: "Oracle Station Theta",
  psychologicalProfile: "Analytical, composed, patient, highly intelligent, empathetic, and visionary — she believes perfect preparation saves more lives than perfect weapons.",
  leadershipStyle: "Leads by forecast — she has already modelled the mission's likely failures before anyone else has finished reading the briefing.",
  animationStyle: "Calm, calculated, minimal movement; constant holographic interaction, with predictive displays orbiting naturally around her.",
  musicMotif: "Ambient piano and layered synth textures over gentle electronic pulses and subtle orchestral strings, representing foresight.",
  personality: "visionary",
  preferredShips: ["aurelia-hull-mk1", "dawnspire", "bastion-hull-mk1", "wayfarer-hull-mk2"],
  preferredWeapons: ["foundry-sunlance", "coil-ripper-mk2", "helios-prism-array", "voidlance"],
  preferredEquipment: ["horizon-flux-capacitor", "aegis-bastion-array", "vanguard-core", "aegis-ward-projector"],
  preferredRelics: ["veil-fragment", "conduit-loop", "static-node", "singularity-keepsake"],
  preferredResearch: ["deep-scanning", "unified-theory", "expanded-archives", "survey-protocols"],
  preferredBiomes: ["ancient-core", "singularity-zone", "void-expanse"],
  endingStory: "The Predictive Core keeps forecasting threats long after Tomorrow's Memory closes its last simulation, and every expedition commander who ever trusted her warnings remembers exactly how many disasters simply never happened. She still logs her rare wrong calls before her right ones — the wrong ones are the only data that ever teaches her anything new.",
  dialogueLibrary: [
    { category: "missionStart", line: "The future has already begun." },
    { category: "bosses", line: "I've seen this outcome before." },
    { category: "legendaryMoments", line: "Look beyond the present." },
    { category: "victory", line: "The correct decision was made." },
    { category: "lowHealth", line: "I failed to account for that..." },
  ],
  masteryChallenges: ["Reach maximum Prediction and hold it for an entire boss encounter.", "Complete 25 expeditions where Future Vision reveals every hidden objective in the mission.", "Complete \"Tomorrow's Memory\" without a single squad member taking an unpredicted hit."],
};

export const MYRR_ORACLE_RECRUITMENT: RecruitmentDef = {
  commanderId: MYRR_ORACLE_ID,
  source: "research",
  requirement: "Complete \"The Infinite Equation\": recover a lost predictive supercomputer, prevent hostile factions from obtaining its simulations, solve tactical anomalies, and preserve the Oracle Network.",
};

export const MYRR_ORACLE_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-myrr-oracle",
  category: "commanders",
  title: "Selene Myrr — The Oracle",
  lore: {
    summary: "Selene Myrr rebuilt humanity's predictive analytics systems using recovered Afterlight computational arrays, enabling expedition commanders to forecast large-scale threats before they emerged.",
    detailed: "Her strategic doctrines dramatically reduced expedition casualties and became the foundation of modern Afterlight operational planning. Close friends with Aurelion Vex, professionally respectful of Dr. Lyra Voss, and a collaborator with Seraphina Cael, she distrusts leaders ruled by emotion and blind aggression in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:myrr-oracle:threatsForecast",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [VEX_CHRONOMANCER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: MYRR_ORACLE_ID },
};

export const MYRR_ORACLE_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(MYRR_ORACLE_RECRUITMENT.source);

export const FULL_ROSTER_WITH_ORACLE: readonly CommanderDef[] = [...FULL_ROSTER_WITH_TITAN, MYRR_ORACLE_COMMANDER];
export const FULL_PROFILES_WITH_ORACLE: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_TITAN, MYRR_ORACLE_PROFILE];
export const FULL_RECRUITMENT_WITH_ORACLE: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_TITAN, MYRR_ORACLE_RECRUITMENT];

export function oracleOverlapReport(): readonly string[] {
  const overlap = findOverlap(MYRR_ORACLE_COMMANDER, FULL_ROSTER_WITH_TITAN);
  return overlap ? [`${MYRR_ORACLE_ID} overlaps ${overlap}`] : [];
}

export function oracleArchitectureComplete(): boolean {
  const architecture = architectureFor(MYRR_ORACLE_COMMANDER, MYRR_ORACLE_PROFILE);
  return Object.values(architecture).every(Boolean);
}
