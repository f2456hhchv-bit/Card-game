/**
 * Commander CMD-021 — Talia Vega "The Echo" (AF-119). The canonical,
 * individually-specified implementation of Afterlight's twenty-first
 * fully production-ready Commander, conforming to AF-071/072/098.
 * Built entirely on AF-030's unchanged CommanderDef, AF-071's unchanged
 * CommanderProfileDef, and AF-098's CommanderExpandedProfileDef
 * wrapper — never a modification of any of them. A twenty-second
 * codex-commander-* entry is added additively (codexData.ts itself is
 * untouched), cross-referencing CMD-019/001/012/008 per her spec'd
 * relationships to exactly those four — the roster's third commander
 * with four spec'd relationships instead of three. Per the spec's own
 * self-review directive ("Reduce overlap with Selene Myrr and Nyx
 * Korven"), her archetype/class (crystalSpecialist/scientist) and
 * passive/signature trigger+bonus pairs are deliberately distinct from
 * both Myrr's support/support kit and Korven's recon/recon kit.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, TALENT_NODE_KINDS, type CommanderProfileDef } from "./commanderFrameworkData";
import { type CommanderExpandedProfileDef } from "./commanderExpansionRoster";
import { RECRUITMENT_SOURCES, type RecruitmentDef } from "./rosterData";
import { FULL_PROFILES_WITH_ARCHITECT, FULL_RECRUITMENT_WITH_ARCHITECT, FULL_ROSTER_WITH_ARCHITECT } from "./cmd020CaelusNova";
import { MYRR_ORACLE_CODEX_ENTRY, MYRR_ORACLE_ID } from "./cmd019SeleneMyrr";
import { LYRA_VOSS_CODEX_ENTRY, LYRA_VOSS_ID } from "./cmd001LyraVoss";
import { KORVEN_PHANTOM_CODEX_ENTRY, KORVEN_PHANTOM_ID } from "./cmd012NyxKorven";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY, ISKANDER_SWARMMASTER_ID } from "./cmd008NovaIskander";
import type { CodexEntryDef } from "../codex/codexData";

export const VEGA_ECHO_ID = "vega-echo";

export const VEGA_ECHO_COMMANDER: CommanderDef = {
  id: VEGA_ECHO_ID,
  name: "Talia Vega",
  callsign: "Echo",
  archetype: "crystalSpecialist",
  faction: "Afterlight Initiative",
  biography: "A signal intelligence specialist, acoustic physicist, and deep space communications commander who restored the fragmented interstellar communications infrastructure that had remained silent since the Collapse — she believes silence contains more information than noise.",
  passive: { trigger: "onKill", bonus: { kind: "pickupRadius", value: 0.05 } },
  active: { id: "resonance-pulse", name: "Resonance Pulse", cooldownMs: 12000 },
  ultimate: { id: "deep-echo-network", name: "Deep Echo Network", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
  signature: {
    tag: "signal-clarity-doctrine",
    description: "Scanning, discoveries, communication, and environmental interaction all raise Clarity — higher Clarity unlocks longer scans, improved prediction, greater discovery rewards, and enhanced battlefield intelligence.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "statusDuration", value: 0.04 } },
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

export const VEGA_ECHO_PROFILE: CommanderProfileDef = {
  commanderId: VEGA_ECHO_ID,
  class: "scientist",
  visualDesign: "Slim white reconnaissance armour with turquoise resonance circuitry, circular shoulder emitters, a waveform visor, floating signal receivers, an adaptive communication pack, and concentric energy rings — an elegant scientific silhouette throughout.",
  voice: "Soft, gentle, thoughtful, highly articulate, calm.",
  secondaryAbility: { id: "signal-relay", name: "Signal Relay", cooldownMs: 14000 },
  masteryPassive: { trigger: "onLowHealth", bonus: { kind: "statusChance", value: 0.04 } },
  ascensionUpgrade: {
    requiredAscensionLevel: 3,
    talentNodeId: "vega-echo:resonance:endgameNode",
    description: "Ascension III: the Resonance branch's endgame node unlocks without a talent point.",
  },
  talentBranches: [
    branchNodes(VEGA_ECHO_ID, "recon", "Recon", [
      ["pickupRadius", 0.05], ["statusChance", 0.04], ["criticalChance", 0.04],
      ["resourceGain", 0.05], ["boostEfficiency", 0.03], ["pickupRadius", 0.15],
    ]),
    branchNodes(VEGA_ECHO_ID, "communications", "Communications", [
      ["cooldownReduction", 0.05], ["shieldRegeneration", 3], ["droneEffectiveness", 0.05],
      ["resourceGain", 0.05], ["experienceGain", 0.05], ["cooldownReduction", 0.15],
    ]),
    branchNodes(VEGA_ECHO_ID, "resonance", "Resonance", [
      ["damage", 0.05], ["statusChance", 0.05], ["statusDuration", 0.05],
      ["criticalDamage", 0.08], ["resourceGain", 0.04], ["statusDuration", 0.15],
    ]),
  ],
  masteryTrackId: "commander:vega-echo",
  personalMissions: [
    { beat: "originStory", name: "Echo Deep Observatory", description: "Where she learned that silence contains more information than noise, and that every signal deserves a listener." },
    { beat: "recruitment", name: "The Silent Signal", description: "An impossible distress beacon to investigate, an abandoned communications array to restore, ancient transmissions to decode, a stranded scientific expedition to rescue. She joins after the player chooses to recover humanity's lost knowledge rather than exploit abandoned technology." },
    { beat: "personalObjectives", name: "Nothing Left Unheard", description: "Information suppression, false propaganda, and signal jamming used against civilians all draw the same quiet, unwavering refusal." },
    { beat: "companionMissions", name: "Open Channel", description: "Every ally gets a Signal Relay in range before she ever asks what they need it for." },
    { beat: "legendaryMission", name: "The Last Transmission", description: "The complete Afterlight Communications Network reconnected, interstellar communications restored, the original Afterlight broadcast decoded, the Legendary Echo Array unlocked." },
    { beat: "finalResolution", name: "The Listener", description: "A title for someone who spent a career proving that nothing sent into the dark is ever truly lost." },
  ],
  loreId: "LORE_COMMANDER_ECHO",
  relationships: [
    { subject: "otherCommanders", targetId: MYRR_ORACLE_ID, dialogueHint: "Close friend of Selene Myrr — foresight and echo-location both turn absence of information into the most important data point available." },
    { subject: "otherCommanders", targetId: LYRA_VOSS_ID, dialogueHint: "Professional respect for Dr. Lyra Voss — her caution about the unknown is the same discipline that keeps a decoded signal trustworthy." },
    { subject: "otherCommanders", targetId: KORVEN_PHANTOM_ID, dialogueHint: "Works closely with Nyx Korven — a spy who reads silence and a scientist who reads echoes have learned to trust the same kind of quiet." },
    { subject: "otherCommanders", targetId: ISKANDER_SWARMMASTER_ID, dialogueHint: "Collaborates with Nova Iskander — a hive of drones listens better when every unit shares the same signal, and neither commander built that doctrine alone." },
  ],
  statisticKeys: ["commander:vega-echo:usage", "commander:vega-echo:victories", "commander:vega-echo:signalsDecoded"],
  cosmetics: [
    { kind: "armourVariants", id: "echo-listener-armour" },
    { kind: "animations", id: "echo-waveform-effects" },
    { kind: "colourThemes", id: "echo-resonance-palette" },
  ],
  voiceLineIds: ["vo-echo-mission-start", "vo-echo-ancient-signal", "vo-echo-boss-encounter", "vo-echo-ultimate", "vo-echo-victory", "vo-echo-low-health"],
  futureExpansionHooks: ["legendary-variant-echo-the-listener"],
};

export const VEGA_ECHO_EXPANDED_PROFILE: CommanderExpandedProfileDef = {
  commanderId: VEGA_ECHO_ID,
  age: 29,
  species: "Human",
  homeworld: "Echo Deep Observatory",
  psychologicalProfile: "Quiet, curious, highly observant, empathetic, creative, and patient — she believes silence contains more information than noise.",
  leadershipStyle: "Leads by listening — she has already mapped the mission's hidden dangers before anyone else has finished asking where to start.",
  animationStyle: "Graceful, precise; wave pulses ripple outward from her, and her equipment constantly analyses her surroundings with minimal wasted movement.",
  musicMotif: "Ambient piano and soft electronic pulses over layered echoes, subtle choir, and ocean-like ambience, representing distant communication.",
  personality: "curious",
  preferredShips: ["aurelia-hull-mk1", "dawnspire", "caduceus-mk1", "wayfarer-hull-mk2"],
  preferredWeapons: ["voidlance", "coil-ripper-mk2", "helios-prism-array", "foundry-sunlance"],
  preferredEquipment: ["aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "vanguard-core"],
  preferredRelics: ["static-node", "veil-fragment", "conduit-loop", "singularity-keepsake"],
  preferredResearch: ["resonant-collectors", "deep-scanning", "survey-protocols", "ancient-conduit"],
  preferredBiomes: ["void-expanse", "ancient-core", "derelict-expanse"],
  endingStory: "The Echo Array keeps every reconnected channel open long after the Last Transmission decodes its final signal, and every colony she ever reunited with the rest of the galaxy still recognises her voice on the relay. She still logs every silence as carefully as every signal — to her, the gaps have always been part of the message.",
  dialogueLibrary: [
    { category: "missionStart", line: "Listen carefully... the galaxy is speaking." },
    { category: "combat", line: "Someone wanted this message to survive." },
    { category: "bosses", line: "I've already heard your next move." },
    { category: "legendaryMoments", line: "Every voice. Every signal. Connected." },
    { category: "victory", line: "We're no longer alone." },
    { category: "lowHealth", line: "The signal... is breaking..." },
  ],
  masteryChallenges: ["Reach maximum Signal Clarity in 50 separate encounters.", "Complete 25 expeditions revealing every hidden secret with Echo Mapping.", "Complete \"The Last Transmission\" without a single relay link failing."],
};

export const VEGA_ECHO_RECRUITMENT: RecruitmentDef = {
  commanderId: VEGA_ECHO_ID,
  source: "hiddenDiscoveries",
  requirement: "Complete \"The Silent Signal\": investigate an impossible distress beacon, restore an abandoned communications array, decode ancient transmissions, and rescue a stranded scientific expedition.",
};

export const VEGA_ECHO_CODEX_ENTRY: CodexEntryDef = {
  id: "codex-commander-vega-echo",
  category: "commanders",
  title: "Talia Vega — The Echo",
  lore: {
    summary: "Talia Vega restored the fragmented interstellar communications infrastructure that had remained silent since the Collapse.",
    detailed: "Her reconstruction of the Afterlight Network reunited isolated colonies across the galaxy, transforming scattered survivors into a civilisation capable of sharing knowledge, hope and coordinated exploration once again. Close friends with Selene Myrr, professionally respectful of Dr. Lyra Voss, working closely with Nyx Korven, and a collaborator with Nova Iskander, she distrusts information suppression, false propaganda, and signal jamming used against civilians in equal measure.",
    historicalContext: null,
    recoveredArchives: null,
  },
  image: null,
  statKey: "commander:vega-echo:signalsDecoded",
  discoverySource: "Fielding this Commander in an expedition.",
  relatedEntryIds: [MYRR_ORACLE_CODEX_ENTRY.id, LYRA_VOSS_CODEX_ENTRY.id, KORVEN_PHANTOM_CODEX_ENTRY.id, ISKANDER_SWARMMASTER_CODEX_ENTRY.id],
  timelinePosition: null,
  version: 1,
  unlock: { kind: "collection", category: "commanders", id: VEGA_ECHO_ID },
};

export const VEGA_ECHO_RECRUITMENT_SOURCE_IS_REAL: boolean = (RECRUITMENT_SOURCES as readonly string[]).includes(VEGA_ECHO_RECRUITMENT.source);

export const FULL_ROSTER_WITH_ECHO: readonly CommanderDef[] = [...FULL_ROSTER_WITH_ARCHITECT, VEGA_ECHO_COMMANDER];
export const FULL_PROFILES_WITH_ECHO: readonly CommanderProfileDef[] = [...FULL_PROFILES_WITH_ARCHITECT, VEGA_ECHO_PROFILE];
export const FULL_RECRUITMENT_WITH_ECHO: readonly RecruitmentDef[] = [...FULL_RECRUITMENT_WITH_ARCHITECT, VEGA_ECHO_RECRUITMENT];

export function echoOverlapReport(): readonly string[] {
  const overlap = findOverlap(VEGA_ECHO_COMMANDER, FULL_ROSTER_WITH_ARCHITECT);
  return overlap ? [`${VEGA_ECHO_ID} overlaps ${overlap}`] : [];
}

export function echoArchitectureComplete(): boolean {
  const architecture = architectureFor(VEGA_ECHO_COMMANDER, VEGA_ECHO_PROFILE);
  return Object.values(architecture).every(Boolean);
}
