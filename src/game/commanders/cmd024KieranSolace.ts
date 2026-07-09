/**
 * Commander CMD-024 — Kieran Solace "The Diplomat" (AF-122). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-fourth fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-fifth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-016/019/021/002
 * per his spec'd relationships to exactly those four — the roster's
 * sixth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Selene Myrr and Astrid Reyes"), his archetype/class
 * (crystalSpecialist/defender) and passive/signature trigger+bonus
 * pairs are deliberately distinct from both Myrr's support/support kit
 * and Reyes's support/hybrid kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_HORIZON, FULL_RECRUITMENT_WITH_HORIZON, FULL_ROSTER_WITH_HORIZON } from "./cmd023ElianaRoss";
import { REYES_WARDEN_CODEX_ENTRY, REYES_WARDEN_ID } from "./cmd016AstridReyes";
import { MYRR_ORACLE_CODEX_ENTRY, MYRR_ORACLE_ID } from "./cmd019SeleneMyrr";
import { VEGA_ECHO_CODEX_ENTRY, VEGA_ECHO_ID } from "./cmd021TaliaVega";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import type { CodexEntryDef } from "../codex/codexData";

export const SOLACE_DIPLOMAT_ID = "solace-diplomat";

export const SOLACE_DIPLOMAT_COMMANDER: CommanderDef = {
  id: SOLACE_DIPLOMAT_ID,
  name: "Kieran Solace",
  callsign: "Diplomat",
  archetype: "crystalSpecialist",
  faction: "Afterlight Initiative",
  biography: "A chief diplomatic envoy, conflict resolution director, and first contact specialist who negotiated the first lasting interstellar alliance following the Collapse — he believes lasting peace requires courage equal to warfare.",
  passive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.05 } },
  active: { id: "peace-accord", name: "Peace Accord", cooldownMs: 13000 },
  ultimate: { id: "united-front", name: "United Front", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "influence-doctrine",
    description: "Successful diplomacy, mission choices, civilian rescues, and faction cooperation all raise Influence — higher Influence unlocks unique negotiations, exclusive rewards, faction alliances, and rare expedition support.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "resourceGain", value: 0.05 } },
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

export const SOLACE_DIPLOMAT_PROFILE: CommanderProfileDef = {
  commanderId: SOLACE_DIPLOMAT_ID,
  class: "defender",
  visualDesign: "An elegant white diplomatic uniform with gold ceremonial armour, a blue illuminated insignia, a holographic translation device, a compact negotiation interface, a light ceremonial cape, and minimal defensive plating — orbiting diplomatic drones accompany him at all times.",
  voice: "Warm, authoritative, reassuring, thoughtful, confident.",
  secondaryAbility: { id: "alliance-network", name: "Alliance Network", cooldownMs: 14000 },
  masteryPassive: { trigger: "onKill", bonus: { kind: "shieldRegeneration", value: 3 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "solace-diplomat:statesmanship:endgameNode",
    description: "Ascension III: the Statesmanship branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(SOLACE_DIPLOMAT_ID, "negotiation", "Negotiation", [
      ["resourceGain", 0.05], ["experienceGain", 0.05], ["resourceGain", 0.06],
      ["statusChance", 0.03], ["criticalChance", 0.03], ["resourceGain", 0.15],
    ]),
    branchNodes(SOLACE_DIPLOMAT_ID, "leadership", "Leadership", [
      ["shieldRegeneration", 3], ["shieldCapacity", 3], ["cooldownReduction", 0.04],
      ["experienceGain", 0.05], ["boostEfficiency", 0.04], ["shieldCapacity", 12],
    ]),
    branchNodes(SOLACE_DIPLOMAT_ID, "statesmanship", "Statesmanship", [
      ["resourceGain", 0.05], ["experienceGain", 0.06], ["cooldownReduction", 0.05],
      ["shieldRegeneration", 3], ["statusDuration", 0.03], ["experienceGain", 0.16],
    ]),
  ],
  masteryTrackId: "commander:solace-diplomat",
  personalMissions: [
    { beat: "originStory", name: "Unity Station", description: "Where he learned that lasting peace requires courage equal to warfare, and that understanding is stronger than fear." },
    { beat: "recruitment", name: "The Last Embassy", description: "A war between two surviving civilisations to prevent, sabotage to investigate, the true instigator to expose, the first post-Collapse peace accord to sign. He joins after the player successfully resolves the crisis without escalating violence." },
    { beat: "personalObjectives", name: "No Peace Left Unoffered", description: "Warmongers, political extremists, and those who manipulate fear for power all meet the same warm, unshakeable insistence on a better option." },
    { beat: "companionMissions", name: "Open Terms", description: "He offers every hostile force a ceasefire before he ever offers them a fight." },
    { beat: "legendaryMission", name: "The Accord of Stars", description: "The galaxy's major factions unified, the Galactic Restoration Charter negotiated, a second Collapse prevented, the Legendary Unity Charter unlocked." },
    { beat: "finalResolution", name: "The Peacemaker", description: "A title for someone who proved that standing together was always the more courageous choice." },
  ],
  loreId: "LORE_COMMANDER_DIPLOMAT",
  relationships: [
    { subject: "otherCommanders", targetId: REYES_WARDEN_ID, dialogueHint: "Close friend of Astrid Reyes — a peace kept and a civilian saved are the same kind of victory, and neither of them has ever needed to say so out loud." },
    { subject: "otherCommanders", targetId: MYRR_ORACLE_ID, dialogueHint: "Professional respect for Selene Myrr — a negotiation goes better when you can already see three moves past the next objection." },
    { subject: "otherCommanders", targetId: VEGA_ECHO_ID, dialogueHint: "Works with Talia Vega — no accord holds if the signal carrying it never arrives." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Trusted by Adrian Kane — he has never once asked Kane to stand down, and Kane has never once needed to be asked to hold." },
  ],
  statisticKeys: ["commander:solace-diplomat:usage", "commander:solace-diplomat:victories", "commander:solace-diplomat:accordsSigned"],
  cosmetics: [
    { kind: "armourVariants", id: "diplomat-peacemaker-armour" },
    { kind: "animations", id: "diplomat-unity-banners" },
    { kind: "colourThemes", id: "diplomat-white-gold-palette" },
  ],
  voiceLineIds: ["vo-diplomat-mission-start", "vo-diplomat-negotiation-success", "vo-diplomat-boss-encounter", "vo-diplomat-ultimate", "vo-diplomat-victory", "vo-diplomat-low-health"],
  futureExpansionHooks: ["legendary-variant-diplomat-the-peacemaker"],
};

export const SOLACE_DIPLOMAT_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: SOLACE_DIPLOMAT_ID,
  age: 44,
  species: "Human",
  homeworld: "Unity Station",
  psychologicalProfile: "Compassionate, patient, charismatic, wise, empathetic, and visionary — he believes lasting peace requires courage equal to warfare.",
  leadershipStyle: "Leads by trust — he has already offered every side a way to walk back from the edge before anyone else has finished counting the cost of not doing so.",
  animationStyle: "Relaxed, controlled; open posture, confident eye contact, measured gestures, calm under pressure at every moment.",
  musicMotif: "Hopeful orchestra and warm piano over soft choir and elegant strings, with subtle electronic ambience, representing unity.",
  personality: "diplomatic",
  preferredShips: ["dawnspire", "caduceus-mk1", "bastion-hull-mk1", "aurelia-hull-mk1"],
  preferredWeapons: ["coil-ripper", "paragon-flux-driver", "foundry-sunlance", "helios-prism-array"],
  preferredEquipment: ["aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "barrier-plate"],
  preferredRelics: ["warden-token", "veil-fragment", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["expanded-archives", "survey-protocols", "rapid-refit", "resonant-collectors"],
  preferredBiomes: ["meridian-rest-frontier", "living-ecospheres", "ancient-core"],
  endingStory: "The Unity Charter keeps every signed accord standing long after the Accord of Stars prevents a second Collapse, and every faction he ever brought to the table still calls his office first when a new crisis threatens to become a war. He still keeps a running count of the conflicts that never happened — to him, that number has always mattered more than any battle won.",
  dialogueLibrary: [
    { category: "missionStart", line: "We're here to build a future, not bury one." },
    { category: "combat", line: "Understanding is stronger than fear." },
    { category: "bosses", line: "If conflict is unavoidable, let it end today." },
    { category: "legendaryMoments", line: "Stand together." },
    { category: "victory", line: "Peace is never weakness." },
    { category: "lowHealth", line: "Don't let this become another war..." },
  ],
  masteryChallenges: ["Complete 25 expeditions resolving every optional conflict peacefully.", "Reach maximum Influence in 50 separate negotiations.", "Complete \"The Accord of Stars\" without a single allied faction withdrawing."],
};

export const SOLACE_DIPLOMAT_RECRUITMENT: RecruitmentDef = {
  commanderId: SOLACE_DIPLOMAT_ID,
  source: "story",
  requirement: "Complete \"The Last Embassy\": prevent war between two surviving civilisations, investigate sabotage, expose the true instigator, and sign the first post-Collapse peace accord.",
};

export const SOLACE_DIPLOMAT_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-solace-diplomat",
  category: "commanders",
  title: "Kieran Solace — The Diplomat",
  lore: {
    summary: "Kieran Solace negotiated the first lasting interstellar alliance following the Collapse, ending decades of isolation between surviving colonies.",
    detailed: "His diplomatic leadership transformed scattered settlements into a cooperative civilisation, proving that humanity's greatest strength was not its technology, but its willingness to stand together. Close friends with Astrid Reyes, professionally respectful of Selene Myrr, working with Talia Vega, and trusted by Adrian Kane, he distrusts warmongers, political extremists, and those who manipulate fear for power in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:solace-diplomat:accordsSigned",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [REYES_WARDEN_CODEX_ENTRY.id, MYRR_ORACLE_CODEX_ENTRY.id, VEGA_ECHO_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: SOLACE_DIPLOMAT_ID },
};

export const SOLACE_DIPLOMAT_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(SOLACE_DIPLOMAT_RECRUITMENT.source);

export const FULL_ROSTER_WITH_DIPLOMAT: readonly CommanderDef[] = [...FULL_ROSTER_WITH_HORIZON, SOLACE_DIPLOMAT_COMMANDER];
export const FULL_PROFILES_WITH_DIPLOMAT: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_HORIZON, SOLACE_DIPLOMAT_PROFILE];
export const FULL_RECRUITMENT_WITH_DIPLOMAT: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_HORIZON, SOLACE_DIPLOMAT_RECRUITMENT];

export function diplomatOverlapReport(): readonly string[] {
  const overlap = findOverlap(SOLACE_DIPLOMAT_COMMANDER, FULL_ROSTER_WITH_HORIZON);
  return overlap ? [`${SOLACE_DIPLOMAT_ID} overlaps ${overlap}`] : [];
}

export function diplomatArchitectureComplete(): boolean {
  const architecture = architectureFor(SOLACE_DIPLOMAT_COMMANDER, SOLACE_DIPLOMAT_PROFILE);
  return Object.values(architecture).every(Boolean);
}
