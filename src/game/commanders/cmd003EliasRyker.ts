/**
 * Commander CMD-003 — Elias Ryker "The Engineer" (AF-101). The
 * canonical, individually-specified implementation of Afterlight's
 * third fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef wrapper
 * — never a modification of any of them. A fourth codex-commander-*
 * entry is added additively (codexData.ts itself is untouched),
 * cross-referencing both CMD-001 and CMD-002 per his spec'd "Close
 * Friend"/"Professional Respect" relationships.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_VANGUARD, FULL_RECRUITMENT_WITH_VANGUARD, FULL_ROSTER_WITH_VANGUARD, KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import type { CodexEntryDef } from "../codex/codexData";

export const RYKER_ENGINEER_ID = "ryker-engineer";

export const RYKER_ENGINEER_COMMANDER: CommanderDef = {
  id: RYKER_ENGINEER_ID,
  name: "Elias Ryker",
  callsign: "Engineer",
  archetype: "engineer",
  faction: "Afterlight Initiative",
  biography: "A systems engineer, prototype designer, and chief recovery technician who helped rebuild dozens of frontier colonies after the Collapse — trained at Atlas Dynamics, and still argues their hardpoint lattice was the last honest piece of engineering they shipped.",
  passive: { trigger: "onDamageTaken", bonus: { kind: "resourceGain", value: 0.06 } },
  active: { id: "auto-turret", name: "Auto Turret", cooldownMs: 11000 },
  ultimate: { id: "forward-operating-base", name: "Forward Operating Base", chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.03 },
  signature: {
    tag: "components-doctrine",
    description: "Destroyed enemies, recovered technology, and recycled equipment all generate Engineering Components, improving every piece of deployed technology for the rest of the expedition.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "droneEffectiveness", value: 0.05 } },
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

export const RYKER_ENGINEER_PROFILE: CommanderProfileDef = {
  commanderId: RYKER_ENGINEER_ID,
  class: "engineer",
  visualDesign: "Heavy industrial exosuit in dark steel with orange utility lights, a mechanical backpack with integrated fabrication arms, deployable tool drones at the hip, a protective visor, numerous repair tools, and a compact fabrication printer he's clearly used mid-fight before.",
  voice: "Calm, friendly, experienced, practical — occasionally sarcastic, always accurate.",
  secondaryAbility: { id: "repair-swarm", name: "Repair Swarm", cooldownMs: 13000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldRegeneration", value: 4 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 2,
    talentNodeId: "ryker-engineer:automation:endgameNode",
    description: "Ascension II: the Automation branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(RYKER_ENGINEER_ID, "automation", "Automation", [
      ["droneEffectiveness", 0.06],
      ["cooldownReduction", 0.05],
      ["boostEfficiency", 0.05],
      ["movementSpeed", 0.03],
      ["resourceGain", 0.05],
      ["droneEffectiveness", 0.15],
    ]),
    branchNodes(RYKER_ENGINEER_ID, "engineering", "Engineering", [
      ["shieldRegeneration", 4],
      ["boostEfficiency", 0.05],
      ["cooldownReduction", 0.04],
      ["resourceGain", 0.06],
      ["experienceGain", 0.05],
      ["shieldRegeneration", 10],
    ]),
    branchNodes(RYKER_ENGINEER_ID, "fortification", "Fortification", [
      ["shieldCapacity", 0.07],
      ["statusDuration", 0.05],
      ["resourceGain", 0.05],
      ["boostEfficiency", 0.04],
      ["shieldCapacity", 0.06],
      ["shieldCapacity", 0.16],
    ]),
  ],
  masteryTrackId: "commander:ryker-engineer",
  personalMissions: [
    { beat: "originStory", name: "Titan Foundry Station", description: "Where he learned that a working reactor outlasts a clever weapon every time." },
    { beat: "recruitment", name: "Echoes of the Foundry", description: "An abandoned orbital manufacturing station, corrupted machines, and workers worth saving. He joins after the player chooses to save the station instead of abandoning it." },
    { beat: "personalObjectives", name: "Nothing Gets Wasted", description: "Every recovered component gets catalogued, repaired, or repurposed. Never scrapped without a reason." },
    { beat: "companionMissions", name: "Field Repairs", description: "Escort duty for the technicians who don't have his instincts for incoming fire yet." },
    { beat: "legendaryMission", name: "The Last Forge", description: "The Atlas Foundry, reactivated — an ancient fabrication core, and the first prototype fleet built in centuries." },
    { beat: "finalResolution", name: "The Builder", description: "The title he'd never have chosen for himself, earned by everything he built anyway." },
  ],
  loreId: "LORE_COMMANDER_ENGINEER",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Close friend of Dr. Voss — she catalogues what the galaxy hides; he makes sure it still runs once she finds it." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Professional respect for Kane — neither wastes words, and both know a held line needs a working reactor behind it." },
    { subject: "majorFactions", targetId: "codex-machine-collective", dialogueHint: "Trained at Atlas Dynamics before the Collective ever certified a human engineer — still compares every integration project to the hardpoint lattice." },
  ],
  statisticKeys: ["commander:ryker-engineer:usage", "commander:ryker-engineer:victories", "commander:ryker-engineer:deployablesBuilt"],
  cosmetics: [
    { kind: "armourVariants", id: "engineer-prototype-armour" },
    { kind: "animations", id: "engineer-drone-swarm" },
    { kind: "colourThemes", id: "engineer-industrial-palette" },
  ],
  voiceLineIds: ["vo-engineer-mission-start", "vo-engineer-deploying-turret", "vo-engineer-ancient-machine", "vo-engineer-victory", "vo-engineer-low-health"],
  futureExpansionHooks: ["legendary-variant-engineer-the-builder"],
};

export const RYKER_ENGINEER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: RYKER_ENGINEER_ID,
  age: 44,
  species: "Human",
  homeworld: "Titan Foundry Station",
  psychologicalProfile: "Inventive, practical, patient, and analytical, with a dry sense of humour and a protective streak — believes every problem has an engineering solution, and is rarely wrong for long.",
  leadershipStyle: "Leads by fixing what's actually broken first — delegates cheerfully, but keeps the critical repairs for himself.",
  animationStyle: "Methodical and efficient, constantly mid-repair; precision movements with near-continuous mechanical interaction, even between engagements.",
  musicMotif: "Industrial percussion and mechanical ambience over warm synths and an electronic pulse, representing creation rather than conflict.",
  personality: "scientific",
  preferredShips: ["caduceus-mk1", "hivemother-mk1", "dawnspire", "maelstrom-x1"],
  preferredWeapons: ["hailborn-array", "coil-ripper-mk2", "voidlance", "novasplitter"],
  preferredEquipment: ["nova-warden-hive", "cryo-manifold", "horizon-flux-capacitor", "aegis-bastion-array"],
  preferredRelics: ["static-node", "conduit-loop", "veil-fragment", "singularity-keepsake"],
  preferredResearch: ["rapid-refit", "expanded-archives", "barrier-theory", "field-dynamics"],
  preferredBiomes: ["machine-expanse", "derelict-expanse", "solar-wastes"],
  endingStory: "The Atlas Foundry never goes cold again. The first prototype fleet built in centuries carries his fabrication signature in every hull, whether or not anyone reads the manifest closely enough to notice.",
  dialogueLibrary: [
    { category: "missionStart", line: "If we can build it, we can survive it." },
    { category: "combat", line: "Let's even the odds." },
    { category: "discoveries", line: "They don't make engineering like this anymore." },
    { category: "victory", line: "Nothing a little maintenance couldn't fix." },
    { category: "combat", line: "I probably should've reinforced that..." },
  ],
  masteryChallenges: ["Deploy 500 turrets across all expeditions.", "Repair 100,000 total hull/shield points via Repair Swarm.", "Complete 15 expeditions fully resupplying allies through an active Forward Operating Base."],
};

export const RYKER_ENGINEER_RECRUITMENT: RecruitmentDef = {
  commanderId: RYKER_ENGINEER_ID,
  source: "campaign",
  requirement: "Complete \"Echoes of the Foundry\": recover the production AI, repair the assembly lines, and save the station instead of abandoning it.",
};

export const RYKER_ENGINEER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-ryker-engineer",
  category: "commanders",
  title: "Elias Ryker — The Engineer",
  lore: {
    summary: "Elias Ryker helped rebuild dozens of frontier colonies after the Collapse.",
    detailed: "Rather than developing new weapons, he focused on restoring civilisation through engineering, infrastructure and practical innovation, becoming one of the architects behind humanity's recovery. A close friend of Dr. Lyra Voss and a professional counterpart to Adrian Kane, he holds that a held line and a mapped galaxy are both worthless without something that still runs underneath them.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:ryker-engineer:deployablesBuilt",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [LYRA_VOSS_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: RYKER_ENGINEER_ID },
};

export const RYKER_ENGINEER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(RYKER_ENGINEER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_ENGINEER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_VANGUARD, RYKER_ENGINEER_COMMANDER];
export const FULL_PROFILES_WITH_ENGINEER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_VANGUARD, RYKER_ENGINEER_PROFILE];
export const FULL_RECRUITMENT_WITH_ENGINEER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_VANGUARD, RYKER_ENGINEER_RECRUITMENT];

/** Proven distinct from the ENTIRE existing 24-commander roster (launch +
 * Batch 1 + CMD-001 + CMD-002) via the real AF-030 fingerprint law. */
export function engineerOverlapReport(): readonly string[] {
  const overlap = findOverlap(RYKER_ENGINEER_COMMANDER, FULL_ROSTER_WITH_VANGUARD);
  return overlap ? [`${RYKER_ENGINEER_ID} overlaps ${overlap}`] : [];
}

/** Proven complete against AF-071's real 17-part architectureFor, unmodified. */
export function engineerArchitectureComplete(): boolean {
  const architecture = architectureFor(RYKER_ENGINEER_COMMANDER, RYKER_ENGINEER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
