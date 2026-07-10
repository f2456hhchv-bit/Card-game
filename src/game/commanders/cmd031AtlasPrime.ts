/**
 * Commander CMD-031 — Atlas Prime "The Founder" (AF-129). The
 * canonical, individually-specified implementation of Afterlight's
 * thirty-first fully production-ready Commander and the roster's
 * secret post-game capstone, conforming to AF-071/072/098. Built
 * entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef
 * wrapper — never a modification of any of them. A thirty-second
 * codex-commander-* entry is added additively (codexData.ts itself is
 * untouched).
 *
 * Unlike every prior Commander, this spec's Relationships section
 * does not name three or four specific commanders — it states "Every
 * Commander recognises Atlas. Unique dialogue exists for every
 * interaction." Taken literally (per AF-000's "do not redesign, only
 * extend" — the relationships array has no length limit in AF-071's
 * shape), Atlas Prime holds a relationship entry for all thirty prior
 * commanders, each with its own real targetId and dialogueHint. His
 * Codex entry's relatedEntryIds mirrors this exactly, cross-referencing
 * all thirty prior commanders' entries — the largest of any Commander
 * in the roster, matching his role as the roster's finale/capstone.
 * No overlap-reduction directive is given in this spec (Atlas Prime is
 * explicitly meant to harmonise rather than specialise), so no
 * dedicated distinctness test against named commanders is required;
 * the real fingerprint/findOverlap law is still asserted.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { AETHER_CELESTIAL_CODEX_ENTRY, AETHER_CELESTIAL_ID, FULL_PROFILES_WITH_CELESTIAL, FULL_RECRUITMENT_WITH_CELESTIAL, FULL_ROSTER_WITH_CELESTIAL } from "./cmd030LysandraAether";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { KANE_VANGUARD_CODEX_ENTRY, KANE_VANGUARD_ID } from "./cmd002AdrianKane";
import { RYKER_ENGINEER_CODEX_ENTRY, RYKER_ENGINEER_ID } from "./cmd003EliasRyker";
import { CAEL_WEAVER_CODEX_ENTRY, CAEL_WEAVER_ID } from "./cmd004SeraphinaCael";
import { DRAKE_HUNTER_CODEX_ENTRY, DRAKE_HUNTER_ID } from "./cmd005KaelDrake";
import { SOL_RESONANT_CODEX_ENTRY, SOL_RESONANT_ID } from "./cmd006AriaSol";
import { VALE_VOIDRUNNER_CODEX_ENTRY, VALE_VOIDRUNNER_ID } from "./cmd007OrionVale";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import { THORNE_STARFORGED_CODEX_ENTRY, THORNE_STARFORGED_ID } from "./cmd009CassiaThorne";
import { VEX_CHRONOMANCER_CODEX_ENTRY, VEX_CHRONOMANCER_ID } from "./cmd010AurelionVex";
import { ASH_TEMPEST_CODEX_ENTRY, ASH_TEMPEST_ID } from "./cmd011ValenAsh";
import { KORVEN_PHANTOM_CODEX_ENTRY, KORVEN_PHANTOM_ID } from "./cmd012NyxKorven";
import { SYN_BIOFORGE_CODEX_ENTRY, SYN_BIOFORGE_ID } from "./cmd013MiraSyn";
import { SOLARI_PHOTON_CODEX_ENTRY, SOLARI_PHOTON_ID } from "./cmd014RheaSolari";
import { KAIN_SINGULARITY_CODEX_ENTRY, KAIN_SINGULARITY_ID } from "./cmd015ZephyrKain";
import { REYES_WARDEN_CODEX_ENTRY, REYES_WARDEN_ID } from "./cmd016AstridReyes";
import { ORION_STARLANCER_CODEX_ENTRY, ORION_STARLANCER_ID } from "./cmd017LucienOrion";
import { VOLKOV_TITAN_CODEX_ENTRY, VOLKOV_TITAN_ID } from "./cmd018IvanVolkov";
import { MYRR_ORACLE_CODEX_ENTRY, MYRR_ORACLE_ID } from "./cmd019SeleneMyrr";
import { NOVA_ARCHITECT_CODEX_ENTRY, NOVA_ARCHITECT_ID } from "./cmd020CaelusNova";
import { VEGA_ECHO_CODEX_ENTRY, VEGA_ECHO_ID } from "./cmd021TaliaVega";
import { RHEM_CATALYST_CODEX_ENTRY, RHEM_CATALYST_ID } from "./cmd022DariusRhem";
import { ROSS_HORIZON_CODEX_ENTRY, ROSS_HORIZON_ID } from "./cmd023ElianaRoss";
import { SOLACE_DIPLOMAT_CODEX_ENTRY, SOLACE_DIPLOMAT_ID } from "./cmd024KieranSolace";
import { ORIS_NANOFORGE_CODEX_ENTRY, ORIS_NANOFORGE_ID } from "./cmd025XantheOris";
import { DRAKE_SENTINEL_CODEX_ENTRY, DRAKE_SENTINEL_ID } from "./cmd026RonanDrake";
import { HELIX_ALCHEMIST_CODEX_ENTRY, HELIX_ALCHEMIST_ID } from "./cmd027SoraHelix";
import { FEN_BEASTMASTER_CODEX_ENTRY, FEN_BEASTMASTER_ID } from "./cmd028DorianFen";
import { NOCTIS_VOIDWALKER_CODEX_ENTRY, NOCTIS_VOIDWALKER_ID } from "./cmd029VegaNoctis";
import type { CodexEntryDef } from "../codex/codexData";

export const PRIME_FOUNDER_ID = "prime-founder";

export const PRIME_FOUNDER_COMMANDER: CommanderDef = {
  id: PRIME_FOUNDER_ID,
  name: "Atlas Prime",
  callsign: "Founder",
  archetype: "guardian",
  faction: "The First Expedition",
  biography: "The first expedition commander, architect of humanity's survival, and founder of the Afterlight Network, revived after more than four centuries in cryostasis — he never sought greatness; he simply refused to let humanity disappear.",
  passive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.05 } },
  active: { id: "command-protocol", name: "Command Protocol", cooldownMs: 11000 },
  ultimate: { id: "afterlight", name: "Afterlight", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "humanity-score-doctrine",
    description: "Every positive action — exploration, construction, scientific discoveries, civilian rescues, diplomacy, companion care, engineering — contributes Humanity. Higher Humanity unlocks exclusive dialogue, legendary encounters, unique endings, additional exploration content, and museum history. Atlas never rewards destruction, only rebuilding.",
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

export const PRIME_FOUNDER_PROFILE: CommanderProfileDef = {
  commanderId: PRIME_FOUNDER_ID,
  class: "hybrid",
  visualDesign: "Ancient white expedition armour with worn gold trim, the original Atlas insignia, visible repairs accumulated over centuries, a simple command cloak, and a prototype reactor — no unnecessary ornamentation; his appearance reflects history rather than power.",
  voice: "Warm, deep, calm, encouraging, never arrogant.",
  secondaryAbility: { id: "atlas-beacon", name: "Atlas Beacon", cooldownMs: 15000 },
  masteryPassive: { trigger: "onCriticalHit", bonus: { kind: "damage", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "prime-founder:founder:endgameNode",
    description: "Ascension III: the Founder branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(PRIME_FOUNDER_ID, "leadership", "Leadership", [
      ["shieldRegeneration", 3], ["boostEfficiency", 0.04], ["cooldownReduction", 0.04],
      ["resourceGain", 0.04], ["experienceGain", 0.04], ["shieldCapacity", 10],
    ]),
    branchNodes(PRIME_FOUNDER_ID, "legacy", "Legacy", [
      ["experienceGain", 0.05], ["resourceGain", 0.05], ["pickupRadius", 0.1],
      ["statusChance", 0.03], ["criticalChance", 0.03], ["experienceGain", 0.15],
    ]),
    branchNodes(PRIME_FOUNDER_ID, "founder", "Founder", [
      ["damage", 0.04], ["cooldownReduction", 0.05], ["droneEffectiveness", 0.05],
      ["orbitalPower", 0.05], ["statusDuration", 0.04], ["damage", 0.15],
    ]),
  ],
  masteryTrackId: "commander:prime-founder",
  personalMissions: [
    { beat: "originStory", name: "Earth, Before the Collapse", description: "Where he learned that he never sought greatness; he simply refused to let humanity disappear." },
    { beat: "recruitment", name: "The Founder", description: "Every major storyline completed, every colony restored, every recruitable Commander saved, the Museum completed, the original Atlas Cryostasis Chamber recovered from beneath Earth. He awakens after seeing humanity has finally become worthy of inheriting the future he sacrificed everything to create." },
    { beat: "personalObjectives", name: "Every System, Together", description: "He never specialised in one mechanic because humanity never survives on one strength alone." },
    { beat: "companionMissions", name: "You've All Done More Than I Dreamed", description: "Every commander he meets after waking already carries a piece of the future he built for them." },
    { beat: "legendaryMission", name: "The Last Promise", description: "The very first expedition replayed, the Collapse experienced through his memories, every choice made centuries ago made playable again, the Legendary Founder Core unlocked." },
    { beat: "finalResolution", name: "The First Light", description: "A title for the one commander every other commander already recognised before he ever said a word." },
  ],
  loreId: "LORE_COMMANDER_FOUNDER",
  relationships: [
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Atlas recognised the Pathfinder instantly — every expedition beyond the map still carries a little of his own first departure from Earth." },
    { subject: "otherCommanders", targetId: KANE_VANGUARD_ID, dialogueHint: "Atlas built the Vanguard doctrine himself, centuries before Kane ever wore its insignia." },
    { subject: "otherCommanders", targetId: RYKER_ENGINEER_ID, dialogueHint: "Atlas still recognises his own prototype reactor schematics in half of what Ryker builds." },
    { subject: "otherCommanders", targetId: CAEL_WEAVER_ID, dialogueHint: "Atlas knew the Weaver discipline's founders personally — precision like Cael's was never an accident." },
    { subject: "otherCommanders", targetId: DRAKE_HUNTER_ID, dialogueHint: "Atlas taught the first trackers everything Drake now takes for granted." },
    { subject: "otherCommanders", targetId: SOL_RESONANT_ID, dialogueHint: "Atlas remembers when resonance research was theory, not a Commander's signature." },
    { subject: "otherCommanders", targetId: VALE_VOIDRUNNER_ID, dialogueHint: "Atlas signed off on the first permanent Void expedition — he never expected someone to walk out of it centuries later." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Atlas commanded the first coordinated drone wings; Iskander commands their inheritance." },
    { subject: "otherCommanders", targetId: THORNE_STARFORGED_ID, dialogueHint: "Atlas laid the first forge that Thorne's entire discipline still stands on." },
    { subject: "otherCommanders", targetId: VEX_CHRONOMANCER_ID, dialogueHint: "Atlas has lived through four centuries most people only theorise about — Vex is the first person who has ever fully understood what that cost." },
    { subject: "otherCommanders", targetId: ASH_TEMPEST_ID, dialogueHint: "Atlas rode out worse storms than Ash's Tempest long before either of them had a name for it." },
    { subject: "otherCommanders", targetId: KORVEN_PHANTOM_ID, dialogueHint: "Atlas trained the Initiative's first shadow operatives; Korven's discipline never forgot who taught it patience." },
    { subject: "otherCommanders", targetId: SYN_BIOFORGE_ID, dialogueHint: "Atlas survived on the earliest bioforge medicine long enough to see Syn perfect it." },
    { subject: "otherCommanders", targetId: SOLARI_PHOTON_ID, dialogueHint: "Atlas chased his first light source across a dying solar system; Solari commands it now." },
    { subject: "otherCommanders", targetId: KAIN_SINGULARITY_ID, dialogueHint: "Atlas authorised the first singularity research charter, against every recommendation but his own." },
    { subject: "otherCommanders", targetId: REYES_WARDEN_ID, dialogueHint: "Atlas wrote the original warden doctrine Reyes still quotes without knowing its author." },
    { subject: "otherCommanders", targetId: ORION_STARLANCER_ID, dialogueHint: "Atlas piloted the first starlance run himself, back when nobody else believed it was survivable." },
    { subject: "otherCommanders", targetId: VOLKOV_TITAN_ID, dialogueHint: "Atlas built the first titan-class hull with his own hands, in a hangar that no longer exists." },
    { subject: "otherCommanders", targetId: MYRR_ORACLE_ID, dialogueHint: "Atlas kept the first probability logs the Oracle discipline was ever built from." },
    { subject: "otherCommanders", targetId: NOVA_ARCHITECT_ID, dialogueHint: "Atlas drew the first blueprint Nova's entire architecture discipline eventually grew out of." },
    { subject: "otherCommanders", targetId: VEGA_ECHO_ID, dialogueHint: "Atlas sent the very first Afterlight signal; Vega has spent her career listening for what answered it." },
    { subject: "otherCommanders", targetId: RHEM_CATALYST_ID, dialogueHint: "Atlas lit the first catalytic chain reaction on purpose, and only once — Rhem has since made a career of it." },
    { subject: "otherCommanders", targetId: ROSS_HORIZON_ID, dialogueHint: "Atlas mapped the very first horizon humanity ever crossed after the Collapse; Ross has been mapping every one since." },
    { subject: "otherCommanders", targetId: SOLACE_DIPLOMAT_ID, dialogueHint: "Atlas brokered the Initiative's first peace before there was an Initiative to broker it for." },
    { subject: "otherCommanders", targetId: ORIS_NANOFORGE_ID, dialogueHint: "Atlas kept the earliest nanite prototypes alive with nothing but patience — Oris turned that patience into a discipline." },
    { subject: "otherCommanders", targetId: DRAKE_SENTINEL_ID, dialogueHint: "Atlas stood the very first watch himself, long before there was a perimeter worth the name." },
    { subject: "otherCommanders", targetId: HELIX_ALCHEMIST_ID, dialogueHint: "Atlas ran the first unstable compound trials personally, and still keeps the scars to prove it." },
    { subject: "otherCommanders", targetId: FEN_BEASTMASTER_ID, dialogueHint: "Atlas made first contact with the earliest companion species himself — Fen inherited a friendship, not just a protocol." },
    { subject: "otherCommanders", targetId: NOCTIS_VOIDWALKER_ID, dialogueHint: "Atlas sealed the first Void fracture with his bare hands; Noctis is the first person he has ever trusted to walk through one instead." },
    { subject: "otherCommanders", targetId: AETHER_CELESTIAL_ID, dialogueHint: "Atlas named the first observatory after a promise, not a person — Aether is the only one who ever asked him why." },
  ],
  statisticKeys: ["commander:prime-founder:usage", "commander:prime-founder:victories", "commander:prime-founder:humanityScore"],
  cosmetics: [
    { kind: "armourVariants", id: "founder-first-light-armour" },
    { kind: "animations", id: "founder-afterlight-aura" },
    { kind: "colourThemes", id: "founder-golden-palette" },
  ],
  voiceLineIds: ["vo-founder-mission-start", "vo-founder-commander-recruitment", "vo-founder-boss-encounter", "vo-founder-ultimate", "vo-founder-victory", "vo-founder-low-health"],
  futureExpansionHooks: ["legendary-variant-founder-the-first-light"],
};

export const PRIME_FOUNDER_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: PRIME_FOUNDER_ID,
  age: 52,
  species: "Human",
  homeworld: "Earth",
  psychologicalProfile: "Compassionate, wise, patient, unbreakable, visionary, and selfless — he never sought greatness; he simply refused to let humanity disappear.",
  leadershipStyle: "Leads by having already lived every lesson everyone else is still learning — he has already forgiven the mistake before anyone else has finished admitting to it.",
  animationStyle: "Confident, calm, purposeful; every movement economical, no wasted effort, communicating absolute mastery.",
  musicMotif: "Entire orchestra and full choir beneath hopeful piano and ancient expedition motifs, built on the original Afterlight theme, representing humanity itself.",
  personality: "visionary",
  preferredShips: ["bastion-hull-mk1", "wayfarer-hull-mk2", "aurelia-hull-mk1", "dawnspire"],
  preferredWeapons: ["coil-ripper", "paragon-flux-driver", "foundry-sunlance", "helios-prism-array"],
  preferredEquipment: ["vanguard", "vanguard-core", "vanguard-thrusters", "aegis-bastion-array"],
  preferredRelics: ["ember-core", "frost-shard", "warden-token", "singularity-keepsake"],
  preferredResearch: ["ancient-conduit", "unified-theory", "expanded-archives", "rapid-refit"],
  preferredBiomes: ["ancient-core", "meridian-rest-frontier", "living-ecospheres"],
  endingStory: "The Last Promise keeps every choice he made centuries ago playable long after the Legendary Founder Core is unlocked, and every Commander who ever fielded him still measures their own Humanity Score against a founder who never once asked for the comparison. He still counts nothing for himself — to him, the only number that has ever mattered is how many people got to keep living after he stopped needing to be the one who saved them.",
  dialogueLibrary: [
    { category: "missionStart", line: "Let's bring everyone home." },
    { category: "recruitment", line: "You've all done more than I ever dreamed." },
    { category: "bosses", line: "We've survived worse." },
    { category: "legendaryMoments", line: "This... is Afterlight." },
    { category: "victory", line: "The future belongs to you now." },
    { category: "lowHealth", line: "Not yet..." },
  ],
  masteryChallenges: ["Complete 25 expeditions with maximum Humanity Score maintained throughout.", "Field every recruitable Commander at least once before recruiting Atlas.", "Complete \"The Last Promise\" without a single rebuilding opportunity missed."],
};

export const PRIME_FOUNDER_RECRUITMENT: RecruitmentDef = {
  commanderId: PRIME_FOUNDER_ID,
  source: "legendaryMissions",
  requirement: "Complete \"The Founder\": complete every major storyline, restore every colony, save every recruitable Commander, complete the Museum, and recover the original Atlas Cryostasis Chamber hidden beneath Earth.",
};

export const PRIME_FOUNDER_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-prime-founder",
  category: "commanders",
  title: "Atlas Prime — The Founder",
  lore: {
    summary: "Atlas Prime led the first expedition following Earth's Collapse, carrying the final hope of humanity into the stars.",
    detailed: "Every colony, every Commander, every Atlas facility and every expedition across the galaxy traces its origin back to his vision. Thought lost for centuries, his survival becomes the final revelation of the Afterlight story — a reminder that humanity's greatest legacy was never technology, but the people willing to build a future for those they would never meet. Every Commander recognises Atlas; he personally knew the founders of every Initiative division.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:prime-founder:humanityScore",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [
    LYRA_VOSS_CODEX_ENTRY.id, KANE_VANGUARD_CODEX_ENTRY.id, RYKER_ENGINEER_CODEX_ENTRY.id, CAEL_WEAVER_CODEX_ENTRY.id,
    DRAKE_HUNTER_CODEX_ENTRY.id, SOL_RESONANT_CODEX_ENTRY.id, VALE_VOIDRUNNER_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id,
    THORNE_STARFORGED_CODEX_ENTRY.id, VEX_CHRONOMANCER_CODEX_ENTRY.id, ASH_TEMPEST_CODEX_ENTRY.id, KORVEN_PHANTOM_CODEX_ENTRY.id,
    SYN_BIOFORGE_CODEX_ENTRY.id, SOLARI_PHOTON_CODEX_ENTRY.id, KAIN_SINGULARITY_CODEX_ENTRY.id, REYES_WARDEN_CODEX_ENTRY.id,
    ORION_STARLANCER_CODEX_ENTRY.id, VOLKOV_TITAN_CODEX_ENTRY.id, MYRR_ORACLE_CODEX_ENTRY.id, NOVA_ARCHITECT_CODEX_ENTRY.id,
    VEGA_ECHO_CODEX_ENTRY.id, RHEM_CATALYST_CODEX_ENTRY.id, ROSS_HORIZON_CODEX_ENTRY.id, SOLACE_DIPLOMAT_CODEX_ENTRY.id,
    ORIS_NANOFORGE_CODEX_ENTRY.id, DRAKE_SENTINEL_CODEX_ENTRY.id, HELIX_ALCHEMIST_CODEX_ENTRY.id, FEN_BEASTMASTER_CODEX_ENTRY.id,
    NOCTIS_VOIDWALKER_CODEX_ENTRY.id, AETHER_CELESTIAL_CODEX_ENTRY.id,
  ],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: PRIME_FOUNDER_ID },
};

export const PRIME_FOUNDER_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(PRIME_FOUNDER_RECRUITMENT.source);

export const FULL_ROSTER_WITH_FOUNDER: readonly CommanderDef[] = [...FULL_ROSTER_WITH_CELESTIAL, PRIME_FOUNDER_COMMANDER];
export const FULL_PROFILES_WITH_FOUNDER: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_CELESTIAL, PRIME_FOUNDER_PROFILE];
export const FULL_RECRUITMENT_WITH_FOUNDER: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_CELESTIAL, PRIME_FOUNDER_RECRUITMENT];

export function founderOverlapReport(): readonly string[] {
  const overlap = findOverlap(PRIME_FOUNDER_COMMANDER, FULL_ROSTER_WITH_CELESTIAL);
  return overlap ? [`${PRIME_FOUNDER_ID} overlaps ${overlap}`] : [];
}

export function founderArchitectureComplete(): boolean {
  const architecture = architectureFor(PRIME_FOUNDER_COMMANDER, PRIME_FOUNDER_PROFILE);
  return Object.values(architecture).every(Boolean);
}
