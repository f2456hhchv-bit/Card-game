/**
 * Commander CMD-004 — Seraphina Cael "The Quantum Weaver" (AF-102). The
 * canonical, individually-specified implementation of Afterlight's
 * fourth fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A fifth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing all three prior commanders per her spec'd
 * relationships with each of them.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_ENGINEER, FULL_RECRUITMENT_WITH_ENGINEER, FULL_ROSTER_WITH_ENGINEER, RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const CAEL_WEAVER_ID = "cael-weaver";

export const CAEL_WEAVER_COMMANDER: CommanderDef = {
  id: CAEL_WEAVER_ID,
  name: "Seraphina Cael",
  callsign: "Weaver",
  archetype: "voidSpecialist",
  faction: "Afterlight Initiative",
  biography: "A quantum physicist, reality research specialist, and experimental systems director who became the first scientist to stabilise an artificial quantum singularity after the Collapse — trained at the Helios Quantum Institute, with ties to Quantum Horizon that she describes, cheerfully, as 'mutual professional obsession.'",
  passive: { trigger: "onCriticalHit", bonus: { kind: "experienceGain", value: 0.06 } },
  active: { id: "quantum-anchor", name: "Quantum Anchor", cooldownMs: 12000 },
  ultimate: { id: "reality-bloom", name: "Reality Bloom", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "stability-doctrine",
    description: "Every quantum interaction generates Stability — improved abilities, additional quantum effects, and more reliable probability manipulation, all rising together. Poor timing destabilises reality and reduces effectiveness.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.05 } },
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

export const CAEL_WEAVER_PROFILE: CommanderProfileDef = {
  commanderId: CAEL_WEAVER_ID,
  class: "experimental",
  visualDesign: "A white adaptive quantum suit with gold energy channels, floating holographic rings, and gravity stabilisers; white hair tied back, blue quantum eyes, a fractal energy cloak, and quantum particles that orbit her continuously — an elegant, unmistakably scientific silhouette.",
  voice: "Soft, confident, curious, calm — almost mesmerising.",
  secondaryAbility: { id: "probability-shift", name: "Probability Shift", cooldownMs: 15000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "cooldownReduction", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "cael-weaver:quantum-physics:endgameNode",
    description: "Ascension III: the Quantum Physics branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(CAEL_WEAVER_ID, "probability", "Probability", [
      ["criticalChance", 0.05],
      ["statusChance", 0.05],
      ["resourceGain", 0.06],
      ["experienceGain", 0.05],
      ["criticalDamage", 0.1],
      ["criticalChance", 0.12],
    ]),
    branchNodes(CAEL_WEAVER_ID, "quantum-physics", "Quantum Physics", [
      ["shieldCapacity", 0.06],
      ["experienceGain", 0.07],
      ["boostEfficiency", 0.05],
      ["cooldownReduction", 0.05],
      ["resourceGain", 0.05],
      ["experienceGain", 0.15],
    ]),
    branchNodes(CAEL_WEAVER_ID, "dimensional-control", "Dimensional Control", [
      ["statusDuration", 0.06],
      ["movementSpeed", 0.04],
      ["pickupRadius", 0.08],
      ["shieldRegeneration", 4],
      ["statusChance", 0.05],
      ["statusDuration", 0.16],
    ]),
  ],
  masteryTrackId: "commander:cael-weaver",
  personalMissions: [
    { beat: "originStory", name: "Helios Quantum Institute", description: "Where she decided reality was just another system that hadn't been properly peer-reviewed yet." },
    { beat: "recruitment", name: "The Impossible Equation", description: "An unstable singularity, a collapsing research station, and a choice: abandon the data or save both team and discovery. She joins after the player saves both." },
    { beat: "personalObjectives", name: "Every Anomaly Logged", description: "No quantum event goes unrecorded, no matter how briefly it exists." },
    { beat: "companionMissions", name: "Controlled Variables", description: "Field experiments run safer with someone watching her back. She insists this is purely methodological." },
    { beat: "legendaryMission", name: "The Seventh Probability", description: "A collapsing quantum dimension, seven impossible experiments, and the first permanent Quantum Relay." },
    { beat: "finalResolution", name: "The Observer", description: "The title she earned by refusing to look away from what she found, even once." },
  ],
  loreId: "LORE_COMMANDER_WEAVER",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Close friend of Dr. Voss — trades notes on impossible things until neither of them notices the hour." },
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Professional collaborator with Ryker — he builds the stabilisers her equations demand, and never once complains about the tolerances." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Respects Kane's discipline — reality bends more predictably around someone who refuses to panic." },
  ],
  statisticKeys: ["commander:cael-weaver:usage", "commander:cael-weaver:victories", "commander:cael-weaver:quantumEventsTriggered"],
  cosmetics: [
    { kind: "armourVariants", id: "weaver-quantum-armour" },
    { kind: "animations", id: "weaver-reality-effects" },
    { kind: "colourThemes", id: "weaver-quantum-palette" },
  ],
  voiceLineIds: ["vo-weaver-mission-start", "vo-weaver-quantum-discovery", "vo-weaver-boss-fight", "vo-weaver-ultimate", "vo-weaver-victory"],
  futureExpansionHooks: ["legendary-variant-weaver-the-observer"],
};

export const CAEL_WEAVER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: CAEL_WEAVER_ID,
  age: 34,
  species: "Human",
  homeworld: "Helios Quantum Institute",
  psychologicalProfile: "Highly curious, playful, fearless, analytical, and quietly obsessive, with a deep well of compassion beneath the theory — believes reality is merely another scientific system waiting to be understood.",
  leadershipStyle: "Leads by demonstration — shows the impossible working before asking anyone to trust the maths behind it.",
  animationStyle: "Weightless and graceful, mathematically precise; reality subtly distorts around her and particles orbit continuously, even at rest.",
  musicMotif: "Ambient synths and glass harmonics over a soft choir and quantum pulses, layered piano representing infinite possibility.",
  personality: "fearless",
  preferredShips: ["aurelia-hull-mk1", "maelstrom-x1", "dawnspire", "sable-dart-mk1"],
  preferredWeapons: ["helios-prism-array", "paragon-flux-driver", "voidlance", "novasplitter"],
  preferredEquipment: ["horizon-flux-capacitor", "aegis-ward-projector", "nova-warden-hive", "cryo-manifold"],
  preferredRelics: ["singularity-keepsake", "conduit-loop", "veil-fragment", "static-node"],
  preferredResearch: ["harmonic-overload", "unified-theory", "ancient-conduit", "deep-scanning"],
  preferredBiomes: ["singularity-zone", "crystal-expanse", "ancient-core"],
  endingStory: "The Quantum Relay holds stable, the first of its kind. She spends her downtime designing the next impossible experiment before anyone's finished writing up the last one, and insists — every single time — that this one will be the last variable she needs.",
  dialogueLibrary: [
    { category: "missionStart", line: "Reality is remarkably flexible." },
    { category: "discoveries", line: "Impossible... which means we're getting closer." },
    { category: "bosses", line: "Let's see which universe favours us today." },
    { category: "legendaryMoments", line: "Observe what possibility truly looks like." },
    { category: "victory", line: "Every answer creates a better question." },
  ],
  masteryChallenges: ["Trigger 200 Quantum Events across all expeditions.", "Reach maximum Quantum Stability in 50 separate encounters.", "Complete 10 expeditions relying only on Probability Shift and Quantum Anchor for crowd control."],
};

export const CAEL_WEAVER_RECRUITMENT: RecruitmentDef = {
  commanderId: CAEL_WEAVER_ID,
  source: "research",
  requirement: "Complete \"The Impossible Equation\": stabilise the collapsing quantum research station, prevent reality collapse, and save both the research team and their data.",
};

export const CAEL_WEAVER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-cael-weaver",
  category: "commanders",
  title: "Seraphina Cael — The Quantum Weaver",
  lore: {
    summary: "Seraphina Cael became the first scientist to successfully stabilise an artificial quantum singularity following the Collapse.",
    detailed: "Her research transformed theoretical quantum physics into practical technology, enabling humanity to safely investigate regions once considered beyond the limits of reality itself. Close friends with Dr. Lyra Voss, a professional collaborator of Elias Ryker's, and a quiet admirer of Adrian Kane's discipline, she treats the galaxy's newest mysteries the way most people treat unread mail.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:cael-weaver:quantumEventsTriggered",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [LYRA_VOSS_CODEX_ENTRY.id, RYKER_ENGINEER_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: CAEL_WEAVER_ID },
};

export const CAEL_WEAVER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(CAEL_WEAVER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_WEAVER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_ENGINEER, CAEL_WEAVER_COMMANDER];
export const FULL_PROFILES_WITH_WEAVER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_ENGINEER, CAEL_WEAVER_PROFILE];
export const FULL_RECRUITMENT_WITH_WEAVER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_ENGINEER, CAEL_WEAVER_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 25-commander roster (launch +
 * Batch 1 + CMD-001/002/003) via the real AF-030 fingerprint law. */
export function weaverOverlapReport(): readonly string[] {
  const overlap = findOverlap(CAEL_WEAVER_COMMANDER, FULL_ROSTER_WITH_ENGINEER);
  return overlap ? [`${CAEL_WEAVER_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function weaverArchitectureComplete(): boolean {
  const architecture = architectureFor(CAEL_WEAVER_COMMANDER, CAEL_WEAVER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
