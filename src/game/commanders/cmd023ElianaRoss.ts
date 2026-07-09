/**
 * Commander CMD-023 — Eliana Ross "The Horizon" (AF-121). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-third fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-fourth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-001/017/020/021
 * per her spec'd relationships to exactly those four — the roster's
 * fifth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with Lyra
 * Voss"), her archetype/class (droneCommander/support) and
 * passive/signature trigger+bonus pairs are deliberately distinct from
 * Voss's recon/scientist kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_CATALYST, FULL_RECRUITMENT_WITH_CATALYST, FULL_ROSTER_WITH_CATALYST } from "./cmd022DariusRhem";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { ORION_STARLANCER_CODEX_ENTRY, ORION_STARLANCER_ID } from "./cmd017LucienOrion";
import { NOVA_ARCHITECT_CODEX_ENTRY, NOVA_ARCHITECT_ID } from "./cmd020CaelusNova";
import { VEGA_ECHO_CODEX_ENTRY, VEGA_ECHO_ID } from "./cmd021TaliaVega";
import type { CodexEntryDef } from "../codex/codexData";

export const ROSS_HORIZON_ID = "ross-horizon";

export const ROSS_HORIZON_COMMANDER: CommanderDef = {
  id: ROSS_HORIZON_ID,
  name: "Eliana Ross",
  callsign: "Horizon",
  archetype: "droneCommander",
  faction: "Afterlight Initiative",
  biography: "A long-range expedition commander, planetary survey director, and colonisation specialist who commanded the first successful post-Collapse deep-space colonisation programme — she believes humanity's future will always exist just beyond the next horizon.",
  passive: { trigger: "onCriticalHit", bonus: { kind: "movementSpeed", value: 0.05 } },
  active: { id: "survey-beacon", name: "Survey Beacon", cooldownMs: 13000 },
  ultimate: { id: "new-frontier", name: "New Frontier", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "expedition-progress-doctrine",
    description: "Every discovery generates Progress — unlocking improved surveying, expanded map visibility, higher exploration rewards, unique frontier encounters, and permanent expedition upgrades.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "resourceGain", value: 0.05 } },
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

export const ROSS_HORIZON_PROFILE: CommanderProfileDef = {
  commanderId: ROSS_HORIZON_ID,
  class: "support",
  visualDesign: "White expedition armour with sand-gold expedition markings, a long exploration cloak, a terrain analysis visor, portable survey drones, a planetary mapping backpack, adaptive climbing equipment, and blue atmospheric sensors — an unmistakable explorer silhouette.",
  voice: "Warm, confident, inspirational, calm, curious.",
  secondaryAbility: { id: "trailblazer", name: "Trailblazer", cooldownMs: 14000 },
  masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "movementSpeed", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "ross-horizon:colonist:endgameNode",
    description: "Ascension III: the Colonist branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(ROSS_HORIZON_ID, "explorer", "Explorer", [
      ["movementSpeed", 0.05], ["pickupRadius", 0.05], ["resourceGain", 0.05],
      ["criticalChance", 0.03], ["boostEfficiency", 0.04], ["movementSpeed", 0.15],
    ]),
    branchNodes(ROSS_HORIZON_ID, "surveyor", "Surveyor", [
      ["experienceGain", 0.05], ["resourceGain", 0.06], ["cooldownReduction", 0.04],
      ["pickupRadius", 0.04], ["statusChance", 0.03], ["experienceGain", 0.15],
    ]),
    branchNodes(ROSS_HORIZON_ID, "colonist", "Colonist", [
      ["shieldCapacity", 3], ["shieldRegeneration", 3], ["resourceGain", 0.05],
      ["experienceGain", 0.05], ["boostEfficiency", 0.05], ["resourceGain", 0.16],
    ]),
  ],
  masteryTrackId: "commander:ross-horizon",
  personalMissions: [
    { beat: "originStory", name: "Frontier Beacon One", description: "Where she learned that humanity's future will always exist just beyond the next horizon." },
    { beat: "recruitment", name: "Beyond the Map", description: "An expedition beyond every known star chart to lead, lost colony ships to recover, humanity's newest settlement to establish, the first settlers to protect. She joins after the player chooses exploration over military conquest." },
    { beat: "personalObjectives", name: "No Settlement Left Behind", description: "Isolationists, resource exploiters, and those who abandon frontier settlements all draw the same warm, unshakeable resolve to prove otherwise." },
    { beat: "companionMissions", name: "The Next Beacon", description: "She marks the safest route for every ally before she ever asks who's coming with her past it." },
    { beat: "legendaryMission", name: "The Edge of Tomorrow", description: "The furthest known sector reached, the first Frontier Beacon constructed, isolated colonies reconnected, the Legendary Pathfinder Core unlocked." },
    { beat: "finalResolution", name: "The Pioneer", description: "A title for someone who measured a life's work in how much farther humanity could still go." },
  ],
  loreId: "LORE_COMMANDER_HORIZON",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Close friend of Dr. Lyra Voss — a pathfinder and a horizon-chaser both learned that curiosity is only dangerous when it stops asking what it might cost." },
    { subject: "otherCommanders", targetId: ORION_STARLANCER_ID, dialogueHint: "Professional respect for Lucien Orion — momentum and distance are the same instinct, chasing different horizons at different speeds." },
    { subject: "otherCommanders", targetId: NOVA_ARCHITECT_ID, dialogueHint: "Works with Caelus Nova — every settlement she founds becomes one of his blueprints eventually, and neither of them minds the order." },
    { subject: "otherCommanders", targetId: VEGA_ECHO_ID, dialogueHint: "Collaborates with Talia Vega — a frontier is only truly reached once someone can hear it calling back." },
  ],
  statisticKeys: ["commander:ross-horizon:usage", "commander:ross-horizon:victories", "commander:ross-horizon:sectorsCharted"],
  cosmetics: [
    { kind: "armourVariants", id: "horizon-pioneer-armour" },
    { kind: "animations", id: "horizon-star-map-effects" },
    { kind: "colourThemes", id: "horizon-frontier-palette" },
  ],
  voiceLineIds: ["vo-horizon-mission-start", "vo-horizon-planet-discovery", "vo-horizon-boss-encounter", "vo-horizon-ultimate", "vo-horizon-victory", "vo-horizon-low-health"],
  futureExpansionHooks: ["legendary-variant-horizon-the-pioneer"],
};

export const ROSS_HORIZON_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: ROSS_HORIZON_ID,
  age: 37,
  species: "Human",
  homeworld: "Frontier Beacon One",
  psychologicalProfile: "Fearless, optimistic, independent, compassionate, highly curious, and resilient — she believes humanity's future will always exist just beyond the next horizon.",
  leadershipStyle: "Leads from the front edge of the map — she has already scouted the danger before anyone else even sees the frontier begin.",
  animationStyle: "Confident, athletic, purposeful; frequently scanning terrain, always moving forward, with a natural explorer's posture.",
  musicMotif: "Hopeful piano and wide orchestral strings over gentle electronic ambience and adventure percussion, representing exploration.",
  personality: "fearless",
  preferredShips: ["wayfarer-hull-mk2", "dawnspire", "bastion-hull-mk1", "caduceus-mk1"],
  preferredWeapons: ["coil-ripper-mk2", "coil-ripper", "foundry-sunlance", "helios-prism-array"],
  preferredEquipment: ["aegis-bastion-array", "horizon-flux-capacitor", "cryo-manifold", "vanguard-thrusters"],
  preferredRelics: ["gambler-die", "veil-fragment", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["survey-protocols", "warp-charting", "deep-scanning", "rapid-refit"],
  preferredBiomes: ["meridian-rest-frontier", "living-ecospheres", "void-expanse"],
  endingStory: "The Pathfinder Core keeps charting new sectors long after the Edge of Tomorrow reconnects the last isolated colony, and every settlement she ever founded still marks its founding date by the day she first stood there. She still logs every unmapped horizon as \"not yet\" — never \"impossible,\" because to her those have never once meant the same thing.",
  dialogueLibrary: [
    { category: "missionStart", line: "There's always another horizon." },
    { category: "combat", line: "No one has ever stood here before." },
    { category: "bosses", line: "Even the unknown can be understood." },
    { category: "legendaryMoments", line: "Let's chart tomorrow." },
    { category: "victory", line: "Another world welcomes us." },
    { category: "lowHealth", line: "The expedition... continues..." },
  ],
  masteryChallenges: ["Complete 25 expeditions with Frontier Spirit at maximum Discovery.", "Chart 100 unexplored sectors across all expeditions.", "Complete \"The Edge of Tomorrow\" without losing a single first settler."],
};

export const ROSS_HORIZON_RECRUITMENT: RecruitmentDef = {
  commanderId: ROSS_HORIZON_ID,
  source: "exploration",
  requirement: "Complete \"Beyond the Map\": lead an expedition beyond every known star chart, recover lost colony ships, establish humanity's newest settlement, and protect the first settlers.",
};

export const ROSS_HORIZON_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-ross-horizon",
  category: "commanders",
  title: "Eliana Ross — The Horizon",
  lore: {
    summary: "Eliana Ross commanded the first successful post-Collapse deep-space colonisation programme, leading expeditions beyond every surviving navigation archive.",
    detailed: "Her frontier doctrine transformed isolated exploration into sustainable expansion, allowing humanity to establish thriving settlements in regions once believed permanently unreachable. Close friends with Dr. Lyra Voss, professionally respectful of Lucien Orion, working with Caelus Nova, and a collaborator with Talia Vega, she distrusts isolationists, resource exploiters, and those who abandon frontier settlements in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:ross-horizon:sectorsCharted",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [LYRA_VOSS_CODEX_ENTRY.id, ORION_STARLANCER_CODEX_ENTRY.id, NOVA_ARCHITECT_CODEX_ENTRY.id, VEGA_ECHO_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: ROSS_HORIZON_ID },
};

export const ROSS_HORIZON_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(ROSS_HORIZON_RECRUITMENT.source);

export const FULL_ROSTER_WITH_HORIZON: readonly CommanderDef[] = [...FULL_ROSTER_WITH_CATALYST, ROSS_HORIZON_COMMANDER];
export const FULL_PROFILES_WITH_HORIZON: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_CATALYST, ROSS_HORIZON_PROFILE];
export const FULL_RECRUITMENT_WITH_HORIZON: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_CATALYST, ROSS_HORIZON_RECRUITMENT];

export function horizonOverlapReport(): readonly string[] {
  const overlap = findOverlap(ROSS_HORIZON_COMMANDER, FULL_ROSTER_WITH_CATALYST);
  return overlap ? [`${ROSS_HORIZON_ID} overlaps ${overlap}`] : [];
}

export function horizonArchitectureComplete(): boolean {
  const architecture = architectureFor(ROSS_HORIZON_COMMANDER, ROSS_HORIZON_PROFILE);
  return Object.values(architecture).every(Boolean);
}
