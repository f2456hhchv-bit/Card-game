/**
 * Commander CMD-022 — Darius Rhem "The Catalyst" (AF-120). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-second fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-third codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-009/004/003/001
 * per his spec'd relationships to exactly those four — the roster's
 * fourth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Photon and Tempest Commanders"), his archetype/class
 * (prototypePilot/experimental) and passive/signature trigger+bonus
 * pairs are deliberately distinct from both Rhea Solari's
 * assault/scientist kit and Valen Ash's orbitalCommander/assault kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_ECHO, FULL_RECRUITMENT_WITH_ECHO, FULL_ROSTER_WITH_ECHO } from "./cmd021TaliaVega";
import { THORNE_STARFORGED_CODEX_ENTRY, THORNE_STARFORGED_ID } from "./cmd009CassiaThorne";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const RHEM_CATALYST_ID = "rhem-catalyst";

export const RHEM_CATALYST_COMMANDER: CommanderDef = {
  id: RHEM_CATALYST_ID,
  name: "Darius Rhem",
  callsign: "Catalyst",
  archetype: "prototypePilot",
  faction: "Afterlight Initiative",
  biography: "A reaction systems scientist, chain-reaction specialist, and energy cascade researcher who pioneered safe chain-reaction engineering after preventing one of the largest post-Collapse reactor failures in recorded history — he believes the smallest action can reshape an entire civilisation.",
  passive: { trigger: "onKill", bonus: { kind: "cooldownReduction", value: 0.04 } },
  active: { id: "catalytic-charge", name: "Catalytic Charge", cooldownMs: 11000 },
  ultimate: { id: "critical-mass", name: "Critical Mass", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "reaction-network-doctrine",
    description: "Successful chain reactions generate Network Progress — higher Progress unlocks additional chain jumps, larger detonations, status propagation, improved environmental interactions, and advanced reaction combinations.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "statusChance", value: 0.05 } },
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

export const RHEM_CATALYST_PROFILE: CommanderProfileDef = {
  commanderId: RHEM_CATALYST_ID,
  class: "experimental",
  visualDesign: "A white experimental combat suit with amber energy conduits, reactive plasma coils, floating catalyst spheres, scientific gauntlets, an adaptive reaction backpack, and a bright orange reactor core — particle emitters orbit him constantly.",
  voice: "Confident, curious, energetic, professional, calm under pressure.",
  secondaryAbility: { id: "cascade-field", name: "Cascade Field", cooldownMs: 14000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "damage", value: 0.05 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "rhem-catalyst:catalysis:endgameNode",
    description: "Ascension III: the Catalysis branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(RHEM_CATALYST_ID, "detonation", "Detonation", [
      ["damage", 0.06], ["criticalDamage", 0.08], ["criticalChance", 0.04],
      ["damage", 0.05], ["statusChance", 0.04], ["damage", 0.16],
    ]),
    branchNodes(RHEM_CATALYST_ID, "propagation", "Propagation", [
      ["statusChance", 0.05], ["statusDuration", 0.05], ["resourceGain", 0.04],
      ["statusChance", 0.05], ["experienceGain", 0.05], ["statusDuration", 0.15],
    ]),
    branchNodes(RHEM_CATALYST_ID, "catalysis", "Catalysis", [
      ["cooldownReduction", 0.05], ["cooldownReduction", 0.04], ["resourceGain", 0.05],
      ["experienceGain", 0.06], ["boostEfficiency", 0.04], ["cooldownReduction", 0.15],
    ]),
  ],
  masteryTrackId: "commander:rhem-catalyst",
  personalMissions: [
    { beat: "originStory", name: "Helix Research Complex", description: "Where he learned that the smallest action can reshape an entire civilisation, and that everything begins with one reaction." },
    { beat: "recruitment", name: "The Domino Principle", description: "An unstable experimental reactor to contain, a planetary chain reaction to prevent, trapped scientists to rescue, cascading energy failures to stabilise. He joins after the player contains the disaster instead of destroying the research complex." },
    { beat: "personalObjectives", name: "No Uncontrolled Cascades", description: "Reckless experimentation and uncontrolled energy research both draw the same calm, immediate correction." },
    { beat: "companionMissions", name: "Sequenced Support", description: "He times every ally's reinforcement into the reaction chain rather than throwing power at a problem all at once." },
    { beat: "legendaryMission", name: "The First Spark", description: "The ancient Stellar Reaction Engine restarted, multiple fusion cores synchronised, sector-wide energy collapse prevented, the Legendary Catalyst Matrix unlocked." },
    { beat: "finalResolution", name: "The First Spark", description: "A title for someone who proved that a single controlled reaction could rebuild worlds instead of destroying them." },
  ],
  loreId: "LORE_COMMANDER_CATALYST",
  relationships: [
    { subject: "otherCommanders", targetId: THORNE_STARFORGED_ID, dialogueHint: "Close friend of Cassia Thorne — a controlled cascade and a forge cycle are the same discipline, argued in different units of heat." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Scientific collaboration with Seraphina Cael — quantum weaving and reaction engineering both learned that the universe negotiates in sequences, not single moves." },
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Professional respect for Elias Ryker — a field engineer who never wastes a component and a scientist who never wastes a reaction understand each other completely." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Inspired by Dr. Lyra Voss — her insistence that curiosity stop exactly where consequence begins shaped every containment protocol he has ever designed." },
  ],
  statisticKeys: ["commander:rhem-catalyst:usage", "commander:rhem-catalyst:victories", "commander:rhem-catalyst:chainReactionsTriggered"],
  cosmetics: [
    { kind: "armourVariants", id: "catalyst-first-spark-armour" },
    { kind: "animations", id: "catalyst-reactive-particles" },
    { kind: "colourThemes", id: "catalyst-amber-palette" },
  ],
  voiceLineIds: ["vo-catalyst-mission-start", "vo-catalyst-chain-explosion", "vo-catalyst-boss-encounter", "vo-catalyst-ultimate", "vo-catalyst-victory", "vo-catalyst-low-health"],
  futureExpansionHooks: ["legendary-variant-catalyst-the-first-spark"],
};

export const RHEM_CATALYST_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: RHEM_CATALYST_ID,
  age: 38,
  species: "Human",
  homeworld: "Helix Research Complex",
  psychologicalProfile: "Creative, analytical, optimistic, bold, inventive, and calm — he believes the smallest action can reshape an entire civilisation.",
  leadershipStyle: "Leads by sequence — he has already mapped the chain of consequences three moves ahead of whatever the team is currently doing.",
  animationStyle: "Energetic, fluid; chain reactions ripple through nearby objects, his abilities flow naturally into one another, and his motion never fully stops.",
  musicMotif: "Fast electronic rhythms and industrial percussion over layered synth pulses and rising orchestral energy, representing acceleration.",
  personality: "optimistic",
  preferredShips: ["aurelia-hull-mk1", "maelstrom-x1", "dawnspire", "bastion-hull-mk1"],
  preferredWeapons: ["coil-ripper-mk2", "paragon-flux-driver", "foundry-sunlance", "helios-prism-array"],
  preferredEquipment: ["horizon-flux-capacitor", "vanguard-core", "cryo-manifold", "barrier-plate"],
  preferredRelics: ["cinder-heart", "conduit-loop", "gambler-die", "singularity-keepsake"],
  preferredResearch: ["harmonic-overload", "field-dynamics", "ancient-conduit", "deep-scanning"],
  preferredBiomes: ["machine-expanse", "singularity-zone", "solar-wastes"],
  endingStory: "The Catalyst Matrix keeps every synchronised fusion core in careful balance long after the First Spark restarts the Stellar Reaction Engine, and every reactor he ever stabilised still runs exactly as controlled as the day he contained it. He still calls a perfect chain reaction \"lucky sequencing\" — the numbers say otherwise, but he'd rather stay humble than stay careless.",
  dialogueLibrary: [
    { category: "missionStart", line: "Everything begins with one reaction." },
    { category: "combat", line: "There it is... beautiful." },
    { category: "bosses", line: "Let's test your stability." },
    { category: "legendaryMoments", line: "Critical mass achieved." },
    { category: "victory", line: "One spark changed everything." },
    { category: "lowHealth", line: "Still... enough energy." },
  ],
  masteryChallenges: ["Chain a single Catalytic Charge detonation through 10 linked enemies.", "Reach maximum Network Progress in 50 separate encounters.", "Complete \"The First Spark\" without a single fusion core destabilising."],
};

export const RHEM_CATALYST_RECRUITMENT: RecruitmentDef = {
  commanderId: RHEM_CATALYST_ID,
  source: "research",
  requirement: "Complete \"The Domino Principle\": contain an unstable experimental reactor, prevent a planetary chain reaction, rescue trapped scientists, and stabilise cascading energy failures.",
};

export const RHEM_CATALYST_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-rhem-catalyst",
  category: "commanders",
  title: "Darius Rhem — The Catalyst",
  lore: {
    summary: "Darius Rhem pioneered safe chain-reaction engineering after preventing one of the largest post-Collapse reactor failures in recorded history.",
    detailed: "His controlled cascade technologies revolutionised planetary power distribution, proving that carefully managed energy amplification could rebuild worlds instead of destroying them. Close friends with Cassia Thorne, a scientific collaborator with Seraphina Cael, professionally respectful of Elias Ryker, and inspired by Dr. Lyra Voss, he distrusts reckless experimentation and uncontrolled energy research in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:rhem-catalyst:chainReactionsTriggered",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [THORNE_STARFORGED_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id, RYKER_ENGINEER_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: RHEM_CATALYST_ID },
};

export const RHEM_CATALYST_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(RHEM_CATALYST_RECRUITMENT.source);

export const FULL_ROSTER_WITH_CATALYST: readonly CommanderDef[] = [...FULL_ROSTER_WITH_ECHO, RHEM_CATALYST_COMMANDER];
export const FULL_PROFILES_WITH_CATALYST: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_ECHO, RHEM_CATALYST_PROFILE];
export const FULL_RECRUITMENT_WITH_CATALYST: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_ECHO, RHEM_CATALYST_RECRUITMENT];

export function catalystOverlapReport(): readonly string[] {
  const overlap = findOverlap(RHEM_CATALYST_COMMANDER, FULL_ROSTER_WITH_ECHO);
  return overlap ? [`${RHEM_CATALYST_ID} overlaps ${overlap}`] : [];
}

export function catalystArchitectureComplete(): boolean {
  const architecture = architectureFor(RHEM_CATALYST_COMMANDER, RHEM_CATALYST_PROFILE);
  return Object.values(architecture).every(Boolean);
}
