/**
 * Commander Roster (AF-072). Fills AF-071's ROSTER_TARGET with a launch
 * roster of FOURTEEN commanders — one per gameplay philosophy, a bijection
 * asserted in tests — built entirely from AF-030's unchanged CommanderDef
 * and AF-071's unchanged CommanderProfileDef. No shape changed; the roster
 * is data.
 *
 * Distinctness is enforced three ways: AF-030's own fingerprint law, a
 * roster-level rule that no two commanders share a (passive trigger,
 * passive bonus kind) pair, and one philosophy each. Two of AF-028's
 * bonus kinds registered as "future — no producer" since AF-028 get their
 * FIRST producers here: droneEffectiveness (Aviary, the drone commander)
 * and orbitalPower (Thunderline, the artillery philosophy).
 *
 * "Architecture supports 25+/50+/100+" is proven, not promised:
 * syntheticCommanderFor(n) generates roster entries on the same shapes
 * forever, and the tests run a hundred of them through AF-030's overlap
 * law and AF-071's seventeen-part completeness function unchanged.
 */
import type { BonusKind, PassiveTrigger } from "../equipment/equipmentData";
import { type CommanderArchetype, type CommanderDef } from "./commanderData";
import {
  FRAMEWORK_COMMANDERS,
  FRAMEWORK_PROFILES,
  TALENT_NODE_KINDS,
  type CommanderClass,
  type CommanderProfileDef,
  type CommanderRelationshipDef,
} from "./commanderFrameworkData";

/** The fourteen launch philosophies (AF-072 §Initial Roster) — each commander embodies exactly one. */
export const ROSTER_PHILOSOPHIES = [
  "vanguard",
  "guardian",
  "engineer",
  "scientist",
  "scout",
  "hunter",
  "artillery",
  "technomancer",
  "droneCommander",
  "gravitySpecialist",
  "crystalResonator",
  "voidResearcher",
  "prototypePilot",
  "afterlightOperative",
] as const;
export type RosterPhilosophy = (typeof ROSTER_PHILOSOPHIES)[number];

/** Every philosophy maps totally onto AF-030's locked archetype shelf. */
export const PHILOSOPHY_TO_ARCHETYPE: Readonly<Record<RosterPhilosophy, CommanderArchetype>> = {
  vanguard: "assault",
  guardian: "guardian",
  engineer: "engineer",
  scientist: "crystalSpecialist",
  scout: "recon",
  hunter: "recon",
  artillery: "orbitalCommander",
  technomancer: "prototypePilot",
  droneCommander: "droneCommander",
  gravitySpecialist: "voidSpecialist",
  crystalResonator: "crystalSpecialist",
  voidResearcher: "voidSpecialist",
  prototypePilot: "prototypePilot",
  afterlightOperative: "support",
} as const;

/** Team synergy kinds (AF-072 §Team Synergy) — six registered FUTURE (online is an optional later layer). */
export const TEAM_SYNERGY_KINDS = [
  "commanderRoles",
  "supportBonuses",
  "abilitySynergy",
  "teamComposition",
  "revivalMechanics",
  "sharedObjectives",
] as const;
export type TeamSynergyKind = (typeof TEAM_SYNERGY_KINDS)[number];

/** AI commander contexts (AF-072 §AI Commanders) — four registered; the AI consumes the SAME
 * CommanderDef/CommanderProfileDef shapes — no AI-specific stat type exists in this module. */
export const AI_COMMANDER_CONTEXTS = ["storyMissions", "escortMissions", "simulationBattles", "futureCoop"] as const;
export type AiCommanderContext = (typeof AI_COMMANDER_CONTEXTS)[number];

/** Recruitment sources (AF-072 §Recruitment) — seven registered; every source recruits someone. */
export const RECRUITMENT_SOURCES = [
  "campaign",
  "exploration",
  "story",
  "research",
  "legendaryMissions",
  "hiddenDiscoveries",
  "factionReputation",
] as const;
export type RecruitmentSource = (typeof RECRUITMENT_SOURCES)[number];

/** Customisation kinds (AF-072 §Commander Customisation) — eight registered, gameplay-neutral by shape. */
export const CUSTOMISATION_KINDS = [
  "colourSchemes",
  "portraitVariants",
  "voicePacks",
  "animations",
  "shipDecorations",
  "callsigns",
  "backgroundStories",
  "victoryPoses",
] as const;
export type CustomisationKind = (typeof CUSTOMISATION_KINDS)[number];

/** Statistics kinds (AF-072 §Commander Statistics) — eight registered; AF-026 stat-key vocabulary. */
export const COMMANDER_STAT_KINDS = [
  "usage",
  "winRate",
  "buildDiversity",
  "favouriteWeapons",
  "favouriteShips",
  "missionSuccess",
  "masteryProgress",
  "historicalRecords",
] as const;
export type CommanderStatKind = (typeof COMMANDER_STAT_KINDS)[number];

/** Balance axes (AF-072 §Balance Principles) — five registered. "Raw damage" is
 * deliberately NOT on this shelf: balance never happens along it. */
export const BALANCE_AXES = ["decisionMaking", "positioning", "synergy", "timing", "knowledge"] as const;
export type BalanceAxis = (typeof BALANCE_AXES)[number];

export interface RecruitmentDef {
  commanderId: string;
  source: RecruitmentSource;
  requirement: string;
}

/** Compact roster spec — everything a new commander needs, built into full defs/profiles below. */
interface RosterSpec {
  id: string;
  name: string;
  callsign: string;
  philosophy: RosterPhilosophy;
  class: CommanderClass;
  faction: string;
  biography: string;
  passive: [PassiveTrigger, BonusKind, number];
  signature: [string, BonusKind, number];
  masteryPassive: [PassiveTrigger, BonusKind, number];
  activeName: string;
  secondaryName: string;
  ultimateName: string;
  balanceAxis: BalanceAxis;
  branchNames: [string, string, string];
  branchBonuses: readonly BonusKind[]; // six kinds cycled across branches with varied values
  recruitment: [RecruitmentSource, string];
  ascensionGate: 1 | 2 | 3;
  relationship: CommanderRelationshipDef;
  visualDesign: string;
  voice: string;
}

const ROSTER_SPECS: readonly RosterSpec[] = [
  {
    id: "okoye-torque",
    name: "Jelan Okoye",
    callsign: "Torque",
    philosophy: "engineer",
    class: "engineer",
    faction: "Human Alliance",
    biography: "Kept a generation ship running for forty years with spare parts and spite. The restoration is just a bigger engine room.",
    passive: ["onDamageTaken", "cooldownReduction", 0.02],
    signature: ["torque-doctrine", "boostEfficiency", 0.04],
    masteryPassive: ["onKill", "cooldownReduction", 0.02],
    activeName: "Field Refit",
    secondaryName: "Overclock Governor",
    ultimateName: "Total Overhaul",
    balanceAxis: "timing",
    branchNames: ["Engine Room", "Jury Rig", "Redline Tolerance"],
    branchBonuses: ["cooldownReduction", "boostEfficiency", "resourceGain", "movementSpeed", "shieldRegeneration", "damage"],
    recruitment: ["story", "Complete the Frontier Restoration chapter."],
    ascensionGate: 1,
    relationship: { subject: "majorFactions", targetId: "codex-human-alliance", dialogueHint: "The Alliance owes her a generation ship. She keeps the receipt." },
    visualDesign: "Grease-marked utility rig, magnetic tool bandolier, one glove always off.",
    voice: "Fast, clipped, engine-deck shorthand — finishes your sentence with the correct part number.",
  },
  {
    id: "naru-whisper",
    name: "Ai Naru",
    callsign: "Whisper",
    philosophy: "scout",
    class: "recon",
    faction: "Stellar Nomads",
    biography: "Flew pathfinder for three convoys that never lost a ship. The dark isn't empty, she says. It's just quiet.",
    passive: ["onKill", "movementSpeed", 0.04],
    signature: ["whisper-doctrine", "pickupRadius", 0.08],
    masteryPassive: ["onCriticalHit", "movementSpeed", 0.03],
    activeName: "Ghost Vector",
    secondaryName: "Silent Running",
    ultimateName: "Pathfinder Protocol",
    balanceAxis: "positioning",
    branchNames: ["Pathfinder", "Slipstream", "Quiet Dark"],
    branchBonuses: ["movementSpeed", "pickupRadius", "experienceGain", "boostEfficiency", "criticalChance", "cooldownReduction"],
    recruitment: ["exploration", "Visit six star systems."],
    ascensionGate: 2,
    relationship: { subject: "majorFactions", targetId: "codex-nomad-fleet", dialogueHint: "Still flies convoy lead in her sleep. The fleet still saves her slot." },
    visualDesign: "Matte convoy leathers, route-tattoos on both forearms, engine trail dimmed to a breath.",
    voice: "Barely above a whisper on comms — the whole channel leans in.",
  },
  {
    id: "vex-longfang",
    name: "Dain Vex",
    callsign: "Longfang",
    philosophy: "hunter",
    class: "recon",
    faction: "Outlaw Havens",
    biography: "Hunted salvage claim-jumpers for the havens until the restoration offered better prey: everything the dark sends.",
    passive: ["onCriticalHit", "criticalChance", 0.03],
    signature: ["longfang-doctrine", "criticalDamage", 0.1],
    masteryPassive: ["onKill", "criticalDamage", 0.05],
    activeName: "Marked Quarry",
    secondaryName: "Blood Trail",
    ultimateName: "Apex Hour",
    balanceAxis: "knowledge",
    branchNames: ["Stalk", "Strike", "Trophy Wall"],
    branchBonuses: ["criticalChance", "criticalDamage", "resourceGain", "movementSpeed", "statusChance", "damage"],
    recruitment: ["factionReputation", "Reach honoured standing with the Mercenary Guild."],
    ascensionGate: 3,
    relationship: { subject: "otherCommanders", targetId: "naru-whisper", dialogueHint: "Tracks what Whisper finds. Neither admits the partnership works." },
    visualDesign: "Trophy-notched hull plating, one optic permanently zeroed, moves like a slow question.",
    voice: "Unhurried drawl, counts kills under his breath in old haven slang.",
  },
  {
    id: "holt-thunderline",
    name: "Petra Holt",
    callsign: "Thunderline",
    philosophy: "artillery",
    class: "assault",
    faction: "Human Alliance",
    biography: "Commanded the orbital batteries at the Collapse's last stand. Never stopped believing in preparation as a weapon.",
    passive: ["onKill", "orbitalPower", 0.05],
    signature: ["thunderline-doctrine", "orbitalPower", 0.08],
    masteryPassive: ["onDamageTaken", "damage", 0.03],
    activeName: "Ranging Shot",
    secondaryName: "Firing Solution",
    ultimateName: "Grid Bombardment",
    balanceAxis: "timing",
    branchNames: ["Battery Command", "Firing Tables", "Danger Close"],
    branchBonuses: ["orbitalPower", "damage", "resourceGain", "boostEfficiency", "statusDuration", "criticalDamage"],
    recruitment: ["legendaryMissions", "Complete a legendary expedition."],
    ascensionGate: 2,
    relationship: { subject: "galaxyHistory", targetId: "codex-galaxy-history", dialogueHint: "Keeps the last stand's firing logs. Reads them like scripture." },
    visualDesign: "Battery-command greatcoat, ranging monocle, chalk still on her gloves from the plotting table.",
    voice: "Parade-ground clear, calls every shot before it lands.",
  },
  {
    id: "anders-cipher",
    name: "Rell Anders",
    callsign: "Cipher",
    philosophy: "technomancer",
    class: "experimental",
    faction: "Independent",
    biography: "Speaks four machine dialects and one the Machines pretend not to recognise. Systems open for them like doors.",
    passive: ["onDamageTaken", "statusChance", 0.04],
    signature: ["cipher-doctrine", "statusDuration", 0.08],
    masteryPassive: ["onShieldBreak", "statusChance", 0.04],
    activeName: "Intrusion Suite",
    secondaryName: "Protocol Splice",
    ultimateName: "Root Access",
    balanceAxis: "knowledge",
    branchNames: ["Backdoor", "Payload", "Deep Access"],
    branchBonuses: ["statusChance", "statusDuration", "experienceGain", "cooldownReduction", "pickupRadius", "damage"],
    recruitment: ["research", "Unlock the galaxyNavigation research branch."],
    ascensionGate: 1,
    relationship: { subject: "research", targetId: "codex-machine-network", dialogueHint: "Annotates Collective network doctrine in a dialect only they read." },
    visualDesign: "Cable-laced duster, glyph projections orbiting one wrist, never quite looking at you.",
    voice: "Soft, layered, occasionally answers in a machine cadence by accident.",
  },
  {
    id: "kite-aviary",
    name: "Suno Kite",
    callsign: "Aviary",
    philosophy: "droneCommander",
    class: "hybrid",
    faction: "Stellar Nomads",
    biography: "Raised a flock of salvage drones from junked parts. They follow without being told. Nobody knows how, including Suno.",
    passive: ["onKill", "droneEffectiveness", 0.05],
    signature: ["aviary-doctrine", "droneEffectiveness", 0.08],
    masteryPassive: ["onLowHealth", "shieldRegeneration", 4],
    activeName: "Release the Flock",
    secondaryName: "Murmuration",
    ultimateName: "Full Wing",
    balanceAxis: "synergy",
    branchNames: ["Flock", "Roost", "Wingspan"],
    branchBonuses: ["droneEffectiveness", "shieldRegeneration", "resourceGain", "movementSpeed", "cooldownReduction", "damage"],
    recruitment: ["story", "Complete the Faction Discovery chapter."],
    ascensionGate: 3,
    relationship: { subject: "civilisations", targetId: "codex-nomad-fleet", dialogueHint: "The fleet calls the flock good luck. The flock agrees." },
    visualDesign: "Perch-scarred shoulder plating, a drone always idling at each shoulder like patient birds.",
    voice: "Warm, distracted, half the sentences addressed to the flock.",
  },
  {
    id: "sel-keystone",
    name: "Mara Sel",
    callsign: "Keystone",
    philosophy: "gravitySpecialist",
    class: "experimental",
    faction: "Independent",
    biography: "Survived a gravity-well collapse that should have folded her ship into a point. Came back understanding weight.",
    passive: ["onLowHealth", "boostEfficiency", 0.06],
    signature: ["keystone-doctrine", "movementSpeed", 0.05],
    masteryPassive: ["onDamageTaken", "shieldCapacity", 6],
    activeName: "Well Anchor",
    secondaryName: "Counterweight",
    ultimateName: "Collapse Point",
    balanceAxis: "positioning",
    branchNames: ["Anchor", "Orbit", "Event Horizon"],
    branchBonuses: ["boostEfficiency", "movementSpeed", "resourceGain", "shieldCapacity", "statusDuration", "cooldownReduction"],
    recruitment: ["exploration", "Travel to Hollow Crown."],
    ascensionGate: 2,
    relationship: { subject: "storyEvents", targetId: "codex-biome-void-expanse", dialogueHint: "Calls the Void Expanse 'the classroom'. Never explains the lesson." },
    visualDesign: "Counterweighted rig that hangs wrong in every gravity, hair drifting a half-second late.",
    voice: "Measured and heavy, every pause placed like ballast.",
  },
  {
    id: "vane-chord",
    name: "Ilex Vane",
    callsign: "Chord",
    philosophy: "crystalResonator",
    class: "scientist",
    faction: "Crystal Dominion",
    biography: "The only human the Dominion's ecosystems sing back to. The Ascendancy finds this hilarious, or possibly holy.",
    passive: ["onKill", "statusDuration", 0.06],
    signature: ["chord-doctrine", "statusChance", 0.05],
    masteryPassive: ["onCriticalHit", "statusDuration", 0.05],
    activeName: "Resonant Note",
    secondaryName: "Harmonic Shield",
    ultimateName: "Full Chorus",
    balanceAxis: "synergy",
    branchNames: ["Melody", "Harmony", "Crescendo"],
    branchBonuses: ["statusDuration", "statusChance", "experienceGain", "pickupRadius", "shieldCapacity", "damage"],
    recruitment: ["research", "Activate the resonance well at Prismheart."],
    ascensionGate: 1,
    relationship: { subject: "civilisations", targetId: "codex-crystal-resonance", dialogueHint: "Hums resonance doctrine off-key on purpose. The crystals correct her." },
    visualDesign: "Lattice-grown plating that chimes when struck, tuning forks where medals would go.",
    voice: "Musical, precise pitch, laughs in fifths.",
  },
  {
    id: "kael-nadir",
    name: "Dr. Oshen Kael",
    callsign: "Nadir",
    philosophy: "voidResearcher",
    class: "scientist",
    faction: "Independent",
    biography: "Studies the Void the way you study a predator: from inside the enclosure, taking excellent notes.",
    passive: ["onLowHealth", "statusChance", 0.05],
    signature: ["nadir-doctrine", "experienceGain", 0.06],
    masteryPassive: ["onDamageTaken", "experienceGain", 0.05],
    activeName: "Containment Sample",
    secondaryName: "Field Journal",
    ultimateName: "Publish or Perish",
    balanceAxis: "knowledge",
    branchNames: ["Observation", "Hypothesis", "Peer Terror"],
    branchBonuses: ["statusChance", "experienceGain", "resourceGain", "movementSpeed", "statusDuration", "cooldownReduction"],
    recruitment: ["hiddenDiscoveries", "Recover the void archive at Hollow Crown."],
    ascensionGate: 3,
    relationship: { subject: "research", targetId: "codex-void-corruption", dialogueHint: "Cites the corruption doctrine paper. He wrote the rebuttal. And the rebuttal to that." },
    visualDesign: "Containment-grade fieldsuit annotated in grease pencil, sample vials that occasionally move.",
    voice: "Dry lecture cadence that speeds up dangerously when something goes wrong.",
  },
  {
    id: "farr-redline",
    name: "Juno Farr",
    callsign: "Redline",
    philosophy: "prototypePilot",
    class: "experimental",
    faction: "Independent",
    biography: "Test-flew eleven prototypes the Protocol abandoned. Crashed nine. Bonded with the tenth. Nobody discusses the eleventh.",
    passive: ["onDamageTaken", "boostEfficiency", 0.05],
    signature: ["redline-doctrine", "cooldownReduction", 0.04],
    masteryPassive: ["onShieldBreak", "movementSpeed", 0.05],
    activeName: "Test Envelope",
    secondaryName: "Stability Off",
    ultimateName: "Eleventh Prototype",
    balanceAxis: "decisionMaking",
    branchNames: ["Flight Test", "Envelope Edge", "No Chase Plane"],
    branchBonuses: ["boostEfficiency", "cooldownReduction", "resourceGain", "movementSpeed", "criticalChance", "damage"],
    recruitment: ["legendaryMissions", "Complete a prototype-recovery expedition."],
    ascensionGate: 2,
    relationship: { subject: "storyEvents", targetId: "codex-paragon-protocol", dialogueHint: "Flies Protocol salvage better than the Protocol did. It notices." },
    visualDesign: "Mismatched prototype plating with eleven tally marks, one fresh weld always cooling.",
    voice: "Test-pilot calm that never once matches the telemetry.",
  },
  {
    id: "iman-relay",
    name: "Sera Iman",
    callsign: "Relay",
    philosophy: "afterlightOperative",
    class: "support",
    faction: "Human Alliance",
    biography: "Carries an Afterlight key that predates her family's records. The Network's doors open before she knocks.",
    passive: ["onShieldBreak", "shieldCapacity", 8],
    signature: ["relay-doctrine", "resourceGain", 0.05],
    masteryPassive: ["onKill", "shieldRegeneration", 3],
    activeName: "Network Ping",
    secondaryName: "Signal Boost",
    ultimateName: "Open Every Door",
    balanceAxis: "decisionMaking",
    branchNames: ["Signal", "Beacon", "The Key"],
    branchBonuses: ["shieldCapacity", "resourceGain", "experienceGain", "pickupRadius", "shieldRegeneration", "cooldownReduction"],
    recruitment: ["campaign", "Complete the Ancient Awakening chapter."],
    ascensionGate: 1,
    relationship: { subject: "galaxyHistory", targetId: "codex-biome-ancient-core", dialogueHint: "First Light's doors open for her key. The Custodians pretend not to watch." },
    visualDesign: "Courier greys with a single precursor-white gauntlet, the key worn openly — a statement.",
    voice: "Calm switchboard clarity; everyone sounds closer when she relays them.",
  },
];

function buildDef(spec: RosterSpec): CommanderDef {
  return {
    id: spec.id,
    name: spec.name,
    callsign: spec.callsign,
    archetype: PHILOSOPHY_TO_ARCHETYPE[spec.philosophy],
    faction: spec.faction,
    biography: spec.biography,
    passive: { trigger: spec.passive[0], bonus: { kind: spec.passive[1], value: spec.passive[2] }, ...(spec.passive[0] === "onLowHealth" ? { threshold: 0.3 } : {}) },
    active: { id: `${spec.id}-active`, name: spec.activeName, cooldownMs: 10000 },
    ultimate: { id: `${spec.id}-ultimate`, name: spec.ultimateName, chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.04 },
    signature: {
      tag: spec.signature[0],
      description: `${spec.callsign}'s doctrine — ${spec.balanceAxis} over raw damage.`,
      passive: { trigger: spec.passive[0], bonus: { kind: spec.signature[1], value: spec.signature[2] } },
    },
  };
}

function buildProfile(spec: RosterSpec): CommanderProfileDef {
  const beats = ["originStory", "recruitment", "personalObjectives", "companionMissions", "legendaryMission", "finalResolution"] as const;
  return {
    commanderId: spec.id,
    class: spec.class,
    visualDesign: spec.visualDesign,
    voice: spec.voice,
    secondaryAbility: { id: `${spec.id}-secondary`, name: spec.secondaryName, cooldownMs: 14000 },
    masteryPassive: { trigger: spec.masteryPassive[0], bonus: { kind: spec.masteryPassive[1], value: spec.masteryPassive[2] }, ...(spec.masteryPassive[0] === "onLowHealth" ? { threshold: 0.3 } : {}) },
    ascensionUpgrade: {
      requiredAscensionLevel: spec.ascensionGate,
      talentNodeId: `${spec.id}:branch3:endgameNode`,
      description: `Ascension ${spec.ascensionGate}: ${spec.branchNames[2]}'s endgame node unlocks without a talent point.`,
    },
    talentBranches: spec.branchNames.map((name, branchIndex) => ({
      id: `${spec.id}:branch${branchIndex + 1}`,
      name,
      nodes: TALENT_NODE_KINDS.map((kind, i) => ({
        id: `${spec.id}:branch${branchIndex + 1}:${kind}`,
        kind,
        description: `${name} — ${kind}`,
        bonus: {
          kind: spec.branchBonuses[(i + branchIndex) % spec.branchBonuses.length]!,
          value: 0.03 + 0.01 * ((i + branchIndex) % 4) + (kind === "endgameNode" ? 0.05 : 0),
        },
      })),
    })),
    masteryTrackId: `commander:${spec.id}`,
    personalMissions: beats.map((beat, i) => ({
      beat,
      name: `${spec.callsign} · ${beat}`,
      description: `${spec.name}'s ${beat} — chapter ${i + 1} of six.`,
    })),
    loreId: `LORE_COMMANDER_${spec.callsign.toUpperCase()}`,
    relationships: [spec.relationship],
    statisticKeys: [`commander:${spec.id}:usage`, `commander:${spec.id}:victories`],
    cosmetics: [
      { kind: "colourThemes", id: `${spec.id}-theme-default` },
      { kind: "victoryPoses", id: `${spec.id}-pose-signature` },
    ],
    voiceLineIds: [`vo-${spec.id}-launch`, `vo-${spec.id}-ultimate`],
    futureExpansionHooks: [`legendary-variant-${spec.id}`],
  };
}

/** Philosophy assignments for the AF-030/071 trio — the roster's first three seats. */
export const EXISTING_PHILOSOPHIES: Readonly<Record<string, RosterPhilosophy>> = {
  "reyes-longlight": "vanguard",
  "vek-ironhull": "guardian",
  "vael-meridian": "scientist",
};

/** The launch roster — fourteen commanders, one per philosophy, all on unchanged shapes. */
export const LAUNCH_ROSTER: readonly CommanderDef[] = [...FRAMEWORK_COMMANDERS, ...ROSTER_SPECS.map(buildDef)];
export const LAUNCH_PROFILES: readonly CommanderProfileDef[] = [...FRAMEWORK_PROFILES, ...ROSTER_SPECS.map(buildProfile)];

export function philosophyFor(commanderId: string): RosterPhilosophy | null {
  const existing = EXISTING_PHILOSOPHIES[commanderId];
  if (existing) return existing;
  return ROSTER_SPECS.find((s) => s.id === commanderId)?.philosophy ?? null;
}

/** Recruitment table — the starting trio arrives via the campaign's opening; every source recruits someone. */
export const RECRUITMENT_TABLE: readonly RecruitmentDef[] = [
  { commanderId: "reyes-longlight", source: "campaign", requirement: "Available from the Prologue." },
  { commanderId: "vek-ironhull", source: "campaign", requirement: "Available from the Prologue." },
  { commanderId: "vael-meridian", source: "campaign", requirement: "Available from the Prologue." },
  ...ROSTER_SPECS.map((spec) => ({ commanderId: spec.id, source: spec.recruitment[0], requirement: spec.recruitment[1] })),
];

export const STARTING_COMMANDER_IDS: readonly string[] = ["reyes-longlight", "vek-ironhull", "vael-meridian"];

/** "Architecture supports 25+/50+/100+" — synthetic roster entries on the same shapes, forever.
 * Deterministic: the same index always yields the same commander. */
export function syntheticCommanderFor(index: number): { def: CommanderDef; profile: CommanderProfileDef } {
  const triggers: readonly PassiveTrigger[] = ["onKill", "onDamageTaken", "onShieldBreak", "onLowHealth", "onCriticalHit"];
  const bonuses: readonly BonusKind[] = [
    "damage", "criticalChance", "criticalDamage", "shieldCapacity", "shieldRegeneration", "movementSpeed",
    "boostEfficiency", "cooldownReduction", "statusChance", "statusDuration", "resourceGain", "experienceGain", "pickupRadius",
  ];
  const philosophy = ROSTER_PHILOSOPHIES[index % ROSTER_PHILOSOPHIES.length]!;
  const spec: RosterSpec = {
    id: `synthetic-${index}`,
    name: `Synthetic ${index}`,
    callsign: `SYN-${index}`,
    philosophy,
    class: "experimental",
    faction: "Independent",
    biography: `Roster expansion proof ${index}.`,
    passive: [triggers[index % triggers.length]!, bonuses[index % bonuses.length]!, 0.03],
    signature: [`synthetic-${index}-doctrine`, bonuses[(index + 3) % bonuses.length]!, 0.04],
    masteryPassive: [triggers[(index + 2) % triggers.length]!, bonuses[(index + 5) % bonuses.length]!, 0.03],
    activeName: `Synthetic Active ${index}`,
    secondaryName: `Synthetic Secondary ${index}`,
    ultimateName: `Synthetic Ultimate ${index}`,
    balanceAxis: BALANCE_AXES[index % BALANCE_AXES.length]!,
    branchNames: [`Branch A${index}`, `Branch B${index}`, `Branch C${index}`],
    branchBonuses: [bonuses[index % bonuses.length]!, bonuses[(index + 1) % bonuses.length]!, bonuses[(index + 2) % bonuses.length]!, bonuses[(index + 3) % bonuses.length]!, bonuses[(index + 4) % bonuses.length]!, bonuses[(index + 5) % bonuses.length]!],
    recruitment: ["exploration", `Expansion recruitment ${index}.`],
    ascensionGate: ((index % 3) + 1) as 1 | 2 | 3,
    relationship: { subject: "galaxyHistory", targetId: "codex-galaxy-history", dialogueHint: `Synthetic relationship ${index}.` },
    visualDesign: `Synthetic visual ${index}.`,
    voice: `Synthetic voice ${index}.`,
  };
  return { def: buildDef(spec), profile: buildProfile(spec) };
}
