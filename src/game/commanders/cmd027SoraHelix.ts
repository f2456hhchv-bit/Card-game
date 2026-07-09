/**
 * Commander CMD-027 — Sora Helix "The Alchemist" (AF-125). The
 * canonical, individually-specified implementation of Afterlight's
 * twenty-seventh fully production-ready Commander, conforming to
 * AF-071/072/098. Built entirely on AF-030's unchanged CommanderDef,
 * AF-071's unchanged CommanderProfileDef, and AF-098's
 * CommanderExpandedProfileDef wrapper — never a modification of any of
 * them. A twenty-eighth codex-commander-* entry is added additively
 * (codexData.ts itself is untouched), cross-referencing CMD-022/013/025/004
 * per her spec'd relationships to exactly those four — the roster's
 * ninth commander with four spec'd relationships instead of three.
 * Per the spec's own self-review directive ("Reduce overlap with
 * Darius Rhem and Valen Ash"), her archetype/class (engineer/scientist)
 * and passive/signature trigger+bonus pairs are deliberately distinct
 * from Rhem's prototypePilot/experimental kit and Ash's
 * orbitalCommander/assault kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_SENTINEL, FULL_RECRUITMENT_WITH_SENTINEL, FULL_ROSTER_WITH_SENTINEL } from "./cmd026RonanDrake";
import { RHEM_CATALYST_CODEX_ENTRY, RHEM_CATALYST_ID } from "./cmd022DariusRhem";
import { SYN_BIOFORGE_CODEX_ENTRY, SYN_BIOFORGE_ID } from "./cmd013MiraSyn";
import { ORIS_NANOFORGE_CODEX_ENTRY, ORIS_NANOFORGE_ID } from "./cmd025XantheOris";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import type { CodexEntryDef } from "../codex/codexData";

export const HELIX_ALCHEMIST_ID = "helix-alchemist";

export const HELIX_ALCHEMIST_COMMANDER: CommanderDef = {
  id: HELIX_ALCHEMIST_ID,
  name: "Sora Helix",
  callsign: "Alchemist",
  archetype: "engineer",
  faction: "Afterlight Initiative",
  biography: "An experimental chemist, elemental reaction scientist, and hazard systems specialist who revolutionised applied chemistry after the Collapse — she treats every battlefield as a scientific laboratory.",
  passive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.05 } },
  active: { id: "elemental-injector", name: "Elemental Injector", cooldownMs: 11000 },
  ultimate: { id: "grand-synthesis", name: "Grand Synthesis", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "reaction-library-doctrine",
    description: "Every new elemental combination permanently unlocks Codex entries, laboratory upgrades, improved reactions, additional compounds, and advanced synthesis recipes.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "statusDuration", value: 0.05 } },
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

export const HELIX_ALCHEMIST_PROFILE: CommanderProfileDef = {
  commanderId: HELIX_ALCHEMIST_ID,
  class: "scientist",
  visualDesign: "An adaptive white research coat with amber chemical reservoirs, transparent reagent canisters, a multi-spectrum visor, mechanical synthesis gauntlets, portable analysis drones, a colour-changing reactor core, and a scientific expedition harness.",
  voice: "Bright, curious, enthusiastic, professional, fast speaking.",
  secondaryAbility: { id: "reaction-chamber", name: "Reaction Chamber", cooldownMs: 13000 },
  masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "statusChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "helix-alchemist:synthesis:endgameNode",
    description: "Ascension III: the Synthesis branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(HELIX_ALCHEMIST_ID, "chemistry", "Chemistry", [
      ["statusChance", 0.04], ["statusDuration", 0.05], ["damage", 0.04],
      ["cooldownReduction", 0.04], ["criticalChance", 0.03], ["statusDuration", 0.14],
    ]),
    branchNodes(HELIX_ALCHEMIST_ID, "research", "Research", [
      ["experienceGain", 0.05], ["resourceGain", 0.05], ["cooldownReduction", 0.04],
      ["experienceGain", 0.05], ["boostEfficiency", 0.03], ["experienceGain", 0.15],
    ]),
    branchNodes(HELIX_ALCHEMIST_ID, "synthesis", "Synthesis", [
      ["damage", 0.05], ["statusChance", 0.04], ["criticalDamage", 0.05],
      ["resourceGain", 0.04], ["statusDuration", 0.04], ["damage", 0.15],
    ]),
  ],
  masteryTrackId: "commander:helix-alchemist",
  personalMissions: [
    { beat: "originStory", name: "Elemental Research Nexus", description: "Where she learned to treat every battlefield as a scientific laboratory, and every hazard as an unanswered hypothesis." },
    { beat: "recruitment", name: "The Impossible Formula", description: "An abandoned atmospheric research station to investigate, runaway chemical reactions to prevent, experimental compounds to recover, surviving scientists to save. She joins after the player successfully contains the disaster while preserving decades of irreplaceable research." },
    { beat: "personalObjectives", name: "Nothing Wasted, Nothing Reckless", description: "Unsafe experimentation, chemical warfare, and scientific censorship all meet the same bright, unwavering refusal to compromise." },
    { beat: "companionMissions", name: "Now That's Fascinating", description: "Every hostile reaction she encounters becomes a recipe worth recording before it becomes a threat worth fighting." },
    { beat: "legendaryMission", name: "The Universal Solvent", description: "The largest experimental synthesis ever attempted completed, stable exotic matter created, the Galactic Materials Archive restored, the Legendary Synthesis Matrix unlocked." },
    { beat: "finalResolution", name: "The Innovator", description: "A title for someone who proved that curiosity, applied rigorously enough, could outlast any threat." },
  ],
  loreId: "LORE_COMMANDER_ALCHEMIST",
  relationships: [
    { subject: "otherCommanders", targetId: RHEM_CATALYST_ID, dialogueHint: "Close friend of Darius Rhem — a chain reaction and a compound reaction are just the same idea wearing different lab coats." },
    { subject: "otherCommanders", targetId: SYN_BIOFORGE_ID, dialogueHint: "Scientific collaboration with Mira Syn — biology and chemistry stopped being separate disciplines the moment the two of them started comparing notes." },
    { subject: "otherCommanders", targetId: ORIS_NANOFORGE_ID, dialogueHint: "Works with Xanthe Oris — programmable matter and programmable compounds were always going to end up in the same lab eventually." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Professional respect for Seraphina Cael — precision work of any kind earns her full attention, chemical or otherwise." },
  ],
  statisticKeys: ["commander:helix-alchemist:usage", "commander:helix-alchemist:victories", "commander:helix-alchemist:reactionsDiscovered"],
  cosmetics: [
    { kind: "armourVariants", id: "alchemist-innovator-armour" },
    { kind: "animations", id: "alchemist-reaction-effects" },
    { kind: "colourThemes", id: "alchemist-iridescent-palette" },
  ],
  voiceLineIds: ["vo-alchemist-mission-start", "vo-alchemist-new-reaction", "vo-alchemist-boss-encounter", "vo-alchemist-ultimate", "vo-alchemist-victory", "vo-alchemist-low-health"],
  futureExpansionHooks: ["legendary-variant-alchemist-the-innovator"],
};

export const HELIX_ALCHEMIST_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: HELIX_ALCHEMIST_ID,
  age: 34,
  species: "Human",
  homeworld: "Elemental Research Nexus",
  psychologicalProfile: "Curious, inventive, energetic, fearless, playful, and highly intelligent — she treats every battlefield as a scientific laboratory.",
  leadershipStyle: "Leads by demonstration — she has already run the experiment three times before anyone else has finished asking whether it is safe.",
  animationStyle: "Quick, creative; constant sample collection, chemical reactions animate naturally, equipment continually reconfigures.",
  musicMotif: "Electronic rhythms and glass percussion beneath experimental synths and playful orchestral layers, representing discovery.",
  personality: "curious",
  preferredShips: ["caduceus-mk1", "aurelia-hull-mk1", "maelstrom-x1", "dawnspire"],
  preferredWeapons: ["paragon-flux-driver", "helios-prism-array", "voidlance", "foundry-sunlance"],
  preferredEquipment: ["cryo-manifold", "horizon-flux-capacitor", "nova-warden-hive", "vanguard-core"],
  preferredRelics: ["ember-core", "frost-shard", "cinder-heart", "conduit-loop"],
  preferredResearch: ["harmonic-overload", "field-dynamics", "unified-theory", "expanded-archives"],
  preferredBiomes: ["solar-wastes", "frozen-reach", "machine-expanse"],
  endingStory: "The Universal Solvent keeps synthesising stable exotic matter long after the Galactic Materials Archive is restored, and every hostile world she ever touched with her compounds now counts among the safest frontier laboratories in the galaxy. She still logs every unique reaction discovered — to her, that number has always mattered more than any battle won.",
  dialogueLibrary: [
    { category: "missionStart", line: "Let's test a hypothesis." },
    { category: "combat", line: "Now that's fascinating." },
    { category: "bosses", line: "Everything reacts under the right conditions." },
    { category: "legendaryMoments", line: "Science... accelerated." },
    { category: "victory", line: "We learned something today." },
    { category: "lowHealth", line: "Interesting... not ideal... but interesting." },
  ],
  masteryChallenges: ["Complete 25 expeditions discovering a new reaction in every one.", "Reach maximum Research in 50 separate encounters.", "Complete \"The Universal Solvent\" without a single uncontained reaction."],
};

export const HELIX_ALCHEMIST_RECRUITMENT: RecruitmentDef = {
  commanderId: HELIX_ALCHEMIST_ID,
  source: "research",
  requirement: "Complete \"The Impossible Formula\": investigate an abandoned atmospheric research station, prevent runaway chemical reactions, recover experimental compounds, and save surviving scientists while preserving decades of irreplaceable research.",
};

export const HELIX_ALCHEMIST_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-helix-alchemist",
  category: "commanders",
  title: "Sora Helix — The Alchemist",
  lore: {
    summary: "Sora Helix revolutionised applied chemistry after the Collapse by developing safe programmable compounds capable of adapting to wildly different planetary environments.",
    detailed: "Her Elemental Reaction Library became a cornerstone of frontier survival, allowing explorers to transform hostile worlds into habitable environments through science rather than brute force. Close friends with Darius Rhem, in scientific collaboration with Mira Syn, working with Xanthe Oris, and professionally respectful of Seraphina Cael, she distrusts unsafe experimentation, chemical warfare, and scientific censorship in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:helix-alchemist:reactionsDiscovered",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [RHEM_CATALYST_CODEX_ENTRY.id, SYN_BIOFORGE_CODEX_ENTRY.id, ORIS_NANOFORGE_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: HELIX_ALCHEMIST_ID },
};

export const HELIX_ALCHEMIST_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(HELIX_ALCHEMIST_RECRUITMENT.source);

export const FULL_ROSTER_WITH_ALCHEMIST: readonly CommanderDef[] = [...FULL_ROSTER_WITH_SENTINEL, HELIX_ALCHEMIST_COMMANDER];
export const FULL_PROFILES_WITH_ALCHEMIST: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_SENTINEL, HELIX_ALCHEMIST_PROFILE];
export const FULL_RECRUITMENT_WITH_ALCHEMIST: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_SENTINEL, HELIX_ALCHEMIST_RECRUITMENT];

export function alchemistOverlapReport(): readonly string[] {
  const overlap = findOverlap(HELIX_ALCHEMIST_COMMANDER, FULL_ROSTER_WITH_SENTINEL);
  return overlap ? [`${HELIX_ALCHEMIST_ID} overlaps ${overlap}`] : [];
}

export function alchemistArchitectureComplete(): boolean {
  const architecture = architectureFor(HELIX_ALCHEMIST_COMMANDER, HELIX_ALCHEMIST_PROFILE);
  return Object.values(architecture).every(Boolean);
}
