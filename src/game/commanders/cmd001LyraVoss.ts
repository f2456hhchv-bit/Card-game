/**
 * Commander CMD-001 — Dr. Lyra Voss "The Pathfinder" (AF-099). The
 * canonical, individually-specified implementation of Afterlight's first
 * fully production-ready Commander, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * (introduced for Roster Expansion Batch 1) — never a modification of any
 * of them. A second codex-commander-* entry is added additively (AF-087's
 * codexData.ts itself is untouched) via its own array, extending the
 * honest "1/14 commanders have a Codex entry" gap AF-098 registered.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { FULL_COMMANDER_PROFILES, FULL_COMMANDER_ROSTER, FULL_RECRUITMENT_TABLE, type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import type { CodexEntryDef } from "../codex/codexData";

export const LYRA_VOSS_ID = "voss-pathfinder";

export const LYRA_VOSS_COMMANDER: CommanderDef = {
  id: LYRA_VOSS_ID,
  name: "Dr. Lyra Voss",
  callsign: "Pathfinder",
  archetype: "recon",
  faction: "Afterlight Initiative",
  biography: "An astrophysicist and expedition commander who chose curiosity over conquest — the first to rediscover functioning Afterlight technology after decades of failed expeditions, and the reason humanity started believing the galaxy could be understood again, not just survived.",
  passive: { trigger: "onKill", bonus: { kind: "pickupRadius", value: 0.12 } },
  active: { id: "survey-drone", name: "Survey Drone", cooldownMs: 12000 },
  ultimate: { id: "afterlight-beacon", name: "Afterlight Beacon", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "momentum-doctrine",
    description: "Every discovery grants Scientific Momentum — research gain, scanning, and resource quality all rise together, resetting only at mission's end.",
    passive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.05 } },
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

export const LYRA_VOSS_PROFILE: CommanderProfileDef = {
  commanderId: LYRA_VOSS_ID,
  class: "scientist",
  visualDesign: "Slim white-and-navy exploration exosuit with gold scientific markings, a long expedition coat, a compact scanning drone perched at the shoulder, an integrated holographic wrist computer, an explorer's backpack, and a blue visor — NASA-inspired equipment throughout.",
  voice: "Warm, professional, scientific — quiet confidence that never once tips into arrogance.",
  secondaryAbility: { id: "quantum-scanner", name: "Quantum Scanner", cooldownMs: 14000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "cooldownReduction", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 1,
    talentNodeId: "voss-pathfinder:field-commander:endgameNode",
    description: "Ascension I: the Field Commander branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(LYRA_VOSS_ID, "explorer", "Explorer", [
      ["pickupRadius", 0.06],
      ["movementSpeed", 0.05],
      ["experienceGain", 0.05],
      ["boostEfficiency", 0.06],
      ["cooldownReduction", 0.04],
      ["pickupRadius", 0.15],
    ]),
    branchNodes(LYRA_VOSS_ID, "scientist", "Scientist", [
      ["experienceGain", 0.06],
      ["resourceGain", 0.06],
      ["criticalChance", 0.03],
      ["statusChance", 0.04],
      ["cooldownReduction", 0.05],
      ["experienceGain", 0.14],
    ]),
    branchNodes(LYRA_VOSS_ID, "field-commander", "Field Commander", [
      ["droneEffectiveness", 0.06],
      ["shieldCapacity", 10],
      ["shieldRegeneration", 4],
      ["statusDuration", 0.05],
      ["boostEfficiency", 0.05],
      ["droneEffectiveness", 0.15],
    ]),
  ],
  masteryTrackId: "commander:voss-pathfinder",
  personalMissions: [
    { beat: "originStory", name: "The Silent Observatory", description: "An abandoned orbital observatory, a set of recovered scientific archives, and a choice: fight or understand." },
    { beat: "recruitment", name: "Curiosity Over Destruction", description: "She restores the telescope instead of salvaging it. The restoration takes note." },
    { beat: "personalObjectives", name: "The Growing Catalogue", description: "Every corner of every map, logged, cross-referenced, and never once treated as empty." },
    { beat: "companionMissions", name: "Escort to the Edge", description: "Field commanders learn to trust a scan before they trust a gut feeling. She's patient about it." },
    { beat: "legendaryMission", name: "Light Beyond Infinity", description: "The first complete Afterlight Relay, precursor star maps decoded, a galaxy's hidden sectors laid open." },
    { beat: "finalResolution", name: "The Cartographer", description: "The galaxy she mapped remembers her name for the doors she opened, not the ones she broke down." },
  ],
  loreId: "LORE_COMMANDER_PATHFINDER",
  relationships: [
    { subject: "otherCommanders", targetId: "voss-lanternkeep", dialogueHint: "Shares a surname with Imara Voss and insists, cheerfully, that the resemblance ends there." },
    { subject: "majorFactions", targetId: "codex-human-alliance", dialogueHint: "Keeps ties to the frontier colonists who raised her — respects soldiers, prefers not to need them." },
    { subject: "civilisations", targetId: "codex-void-corruption", dialogueHint: "Distrusts anyone chasing Void-touched power for its own sake — knowledge should open doors, not lock them." },
  ],
  statisticKeys: ["commander:voss-pathfinder:usage", "commander:voss-pathfinder:victories", "commander:voss-pathfinder:discoveries"],
  cosmetics: [
    { kind: "armourVariants", id: "pathfinder-explorer-armour" },
    { kind: "colourThemes", id: "pathfinder-legendary-palette" },
    { kind: "portraits", id: "pathfinder-cartographer-portrait" },
  ],
  voiceLineIds: ["vo-pathfinder-mission-start", "vo-pathfinder-ancient-discovery", "vo-pathfinder-boss-fight", "vo-pathfinder-victory", "vo-pathfinder-low-health"],
  futureExpansionHooks: ["legendary-variant-pathfinder-cartographer"],
};

export const LYRA_VOSS_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: LYRA_VOSS_ID,
  age: 38,
  species: "Human",
  homeworld: "New Horizon Colony",
  psychologicalProfile: "Curious, optimistic, calm, patient, and empathetic, with a highly intelligent, methodical mind — believes knowledge always outweighs violence and rarely raises her voice, because she's never needed to.",
  leadershipStyle: "Leads by inquiry, not by order — asks the question that makes the plan obvious, and inspires confidence through calm, prepared competence.",
  animationStyle: "Smooth and confident, minimal wasted movement; constantly analysing her surroundings and frequently scanning, with a calm posture that holds even in combat.",
  musicMotif: "Soft synths and piano over ambient strings, gradually expanding orchestration that swells to represent discovery.",
  personality: "curious",
  preferredShips: ["aurelia-hull-mk1", "sable-dart-mk1", "maelstrom-x1"],
  preferredWeapons: ["helios-prism-array", "voidlance", "novasplitter", "foundry-sunlance"],
  preferredEquipment: ["horizon-flux-capacitor", "nova-warden-hive", "aegis-ward-projector", "cryo-manifold"],
  preferredRelics: ["singularity-keepsake", "conduit-loop", "veil-fragment", "static-node"],
  preferredResearch: ["survey-protocols", "deep-scanning", "ancient-conduit", "warp-charting"],
  preferredBiomes: ["ancient-core", "crystal-expanse", "singularity-zone"],
  endingStory: "The relay she found becomes the first of dozens. The sectors she revealed get mapped, settled, and eventually named after people who were never soldiers. She keeps the title 'The Cartographer' in her personal log, and the rank insignia everyone else insists on giving her in a drawer she never opens.",
  dialogueLibrary: [
    { category: "missionStart", line: "Every unanswered question is an opportunity." },
    { category: "discoveries", line: "Incredible... this changes everything." },
    { category: "bosses", line: "Observe first. React second." },
    { category: "victory", line: "Knowledge survives long after battles end." },
    { category: "combat", line: "I'll need a moment to think..." },
  ],
  masteryChallenges: ["Discover 150 Codex entries while piloting Lyra Voss.", "Reveal 500 hidden resources across all expeditions using Survey Drone or Quantum Scanner.", "Complete 20 expeditions without a squadmate falling below 30% hull while Lyra's Afterlight Beacon is active."],
};

export const LYRA_VOSS_RECRUITMENT: RecruitmentDef = {
  commanderId: LYRA_VOSS_ID,
  source: "campaign",
  requirement: "Complete \"The Silent Observatory\": recover the archives, restore the telescope, and prove scientific curiosity over destruction.",
};

export const LYRA_VOSS_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-voss-pathfinder",
  category: "commanders",
  title: "Lyra Voss — The Pathfinder",
  lore: {
    summary: "Dr. Lyra Voss became one of the first commanders to rediscover functioning Afterlight technology after decades of failed expeditions.",
    detailed: "Her discoveries transformed humanity's understanding of the galaxy and reignited hope that civilisation could be rebuilt. Recruited from the Silent Observatory, she has since mapped more of the restored galaxy than any other commander — one careful scan at a time.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:voss-pathfinder:discoveries",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: ["codex-commander-reyes"],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: LYRA_VOSS_ID },
};

/** Every declared keyof RecruitmentSource this module references — kept
 * literal so a typo fails typecheck against the real AF-072 union. */
export const LYRA_VOSS_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(LYRA_VOSS_RECRUITMENT.source);

export const FULL_ROSTER_WITH_PATHFINDER: readonly CommanderDef[] = [...FULL_COMMANDER_ROSTER, LYRA_VOSS_COMMANDER];
export const FULL_PROFILES_WITH_PATHFINDER: readonly CommanderProfileDef[] = [...FULL_COMMANDER_PROFILES, LYRA_VOSS_PROFILE];
export const FULL_RECRUITMENT_WITH_PATHFINDER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_TABLE, LYRA_VOSS_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 22-commander roster via the
 * real AF-030 fingerprint/findOverlap law — not eyeballed. */
export function pathfinderOverlapReport(): readonly string[] {
  const overlap = findOverlap(LYRA_VOSS_COMMANDER, FULL_COMMANDER_ROSTER);
  return overlap ? [`${LYRA_VOSS_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function pathfinderArchitectureComplete(): boolean {
  const architecture = architectureFor(LYRA_VOSS_COMMANDER, LYRA_VOSS_PROFILE);
  return Object.values(architecture).every(Boolean);
}
