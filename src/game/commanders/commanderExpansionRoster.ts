/**
 * Commander Roster Expansion, Batch 1 (AF-098 content, produced through
 * the Commander Production Framework's pipeline). Extends AF-030's
 * CommanderDef and AF-071's CommanderProfileDef ADDITIVELY — the launch
 * roster (rosterData.ts's fourteen-philosophy bijection) is untouched;
 * these eight commanders are post-launch growth toward AF-097's 100+
 * target, proven distinct from the full existing set via the real
 * fingerprint law, not just eyeballed. `CommanderExpandedProfileDef`
 * carries the 16 AF-098 template fields that don't yet have a home on
 * CommanderDef/CommanderProfileDef (age, species, homeworld,
 * psychologicalProfile, leadershipStyle, animationStyle, musicMotif, the
 * six Preferred-X fields, endingStory, dialogueLibrary, masteryChallenges)
 * — a new, separate wrapper, never a modification of either locked shape.
 */
import { findOverlap, type CommanderDef } from "./commanderData";
import { architectureFor, type CommanderProfileDef } from "./commanderFrameworkData";
import { LAUNCH_PROFILES, LAUNCH_ROSTER, RECRUITMENT_TABLE, type RecruitmentDef } from "./rosterData";
import type { PersonalityTrait } from "./commanderProductionData";

export const EXPANSION_COMMANDERS: readonly CommanderDef[] = [
  {
    id: "korr-wardbreaker",
    name: "Thessaly Korr",
    callsign: "Wardbreaker",
    archetype: "guardian",
    faction: "Mercenary Guild",
    biography: "Broke a Guild contract to pull civilians out of a burning evacuation instead of finishing the job she was paid for. The Guild fined her everything she owned. The restoration paid the fine.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "shieldCapacity", value: 6 } },
    active: { id: "writ-of-cover", name: "Writ of Cover", cooldownMs: 11000 },
    ultimate: { id: "guild-writ-enforced", name: "Guild Writ Enforced", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.04 },
    signature: {
      tag: "wardbreaker-doctrine",
      description: "Every contract she keeps now is one she chose. The shield remembers that.",
      passive: { trigger: "onDamageTaken", bonus: { kind: "statusDuration", value: 0.05 } },
    },
  },
  {
    id: "voss-lanternkeep",
    name: "Dr. Imara Voss",
    callsign: "Lanternkeep",
    archetype: "recon",
    faction: "Ancient Custodians",
    biography: "Spent eleven years cataloguing First Light's collapsed archive by hand before the Custodians decided she'd earned the right to read what she'd catalogued. She still asks permission.",
    passive: { trigger: "onKill", bonus: { kind: "pickupRadius", value: 0.1 } },
    active: { id: "archive-lantern", name: "Archive Lantern", cooldownMs: 9000 },
    ultimate: { id: "unsealed-index", name: "Unsealed Index", chargeRequired: 100, chargePerKill: 3, chargePerDamage: 0.03 },
    signature: {
      tag: "lanternkeep-doctrine",
      description: "Nothing catalogued is ever truly lost — every find teaches the next find faster.",
      passive: { trigger: "onKill", bonus: { kind: "experienceGain", value: 0.05 } },
    },
  },
  {
    id: "devereux-static",
    name: "Ash Devereux",
    callsign: "Static",
    archetype: "prototypePilot",
    faction: "Independent",
    biography: "Flew reconnaissance for the Paragon Protocol until the Protocol reconnoitred a colony that hadn't done anything but exist. Defected mid-flight. Never fully trusts a clean scan again.",
    passive: { trigger: "onLowHealth", bonus: { kind: "criticalDamage", value: 0.12 } },
    active: { id: "burn-the-orders", name: "Burn the Orders", cooldownMs: 13000 },
    ultimate: { id: "static-line", name: "Static Line", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.05 },
    signature: {
      tag: "static-doctrine",
      description: "Every near-death is a system he refuses to let the Protocol's old logic explain away.",
      passive: { trigger: "onLowHealth", bonus: { kind: "cooldownReduction", value: 0.03 } },
    },
  },
  {
    id: "okafor-halcyon",
    name: "Rin Okafor",
    callsign: "Halcyon",
    archetype: "support",
    faction: "Human Alliance",
    biography: "Combat medic who has personally stabilised more restoration personnel than any single ship has lost. Keeps a ledger of names, not casualties. The ledger is longer than the losses.",
    passive: { trigger: "onDamageTaken", bonus: { kind: "experienceGain", value: 0.05 } },
    active: { id: "field-triage", name: "Field Triage", cooldownMs: 9000 },
    ultimate: { id: "halcyon-hour", name: "Halcyon Hour", chargeRequired: 100, chargePerKill: 1, chargePerDamage: 0.05 },
    signature: {
      tag: "halcyon-doctrine",
      description: "Every wound she treats teaches the crew around her to survive the next one.",
      passive: { trigger: "onDamageTaken", bonus: { kind: "shieldRegeneration", value: 3 } },
    },
  },
  {
    id: "ur-sella-chorus",
    name: "Vantha Ur-Sella",
    callsign: "Chorus",
    archetype: "crystalSpecialist",
    faction: "Crystal Dominion",
    biography: "Diplomat-scientist who negotiates with the Dominion's resonant ecosystems as readily as with its Ascendancy. Says the crystals were the easier audience.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "resourceGain", value: 0.06 } },
    active: { id: "harmonic-accord", name: "Harmonic Accord", cooldownMs: 10000 },
    ultimate: { id: "full-assembly", name: "Full Assembly", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.04 },
    signature: {
      tag: "chorus-doctrine",
      description: "Diplomacy and resonance are the same skill, applied to different audiences.",
      passive: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.04 } },
    },
  },
  {
    id: "kade-fulcrum",
    name: "Boren Kade",
    callsign: "Fulcrum",
    archetype: "engineer",
    faction: "Machine Collective",
    biography: "The first human the Collective certified as a full integration engineer. Argues the certification runs both ways — the Collective learned something too.",
    passive: { trigger: "onShieldBreak", bonus: { kind: "criticalChance", value: 0.04 } },
    active: { id: "lattice-splice", name: "Lattice Splice", cooldownMs: 12000 },
    ultimate: { id: "full-integration", name: "Full Integration", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.03 },
    signature: {
      tag: "fulcrum-doctrine",
      description: "A broken shield is a design note. He answers every one of them.",
      passive: { trigger: "onShieldBreak", bonus: { kind: "boostEfficiency", value: 0.05 } },
    },
  },
  {
    id: "calder-driftline",
    name: "Yuen Calder",
    callsign: "Driftline",
    archetype: "droneCommander",
    faction: "Stellar Nomads",
    biography: "Grew up navigating by convoy driftlines instead of star charts. Flies scout drones the way older pilots read weather — a sense, not a system.",
    passive: { trigger: "onKill", bonus: { kind: "damage", value: 0.05 } },
    active: { id: "driftline-scan", name: "Driftline Scan", cooldownMs: 8000 },
    ultimate: { id: "convoy-sense", name: "Convoy Sense", chargeRequired: 100, chargePerKill: 4, chargePerDamage: 0.03 },
    signature: {
      tag: "driftline-doctrine",
      description: "Reads the drift the way the convoy always has — a half-second before anyone explains it.",
      passive: { trigger: "onKill", bonus: { kind: "movementSpeed", value: 0.04 } },
    },
  },
  {
    id: "aldana-aftercare",
    name: "Dr. Petrin Aldana",
    callsign: "Aftercare",
    archetype: "voidSpecialist",
    faction: "Independent",
    biography: "Studies what the Void leaves behind in the people who come back from it. Survived contact with an Eclipsed vanguard herself; treats her own case notes with the same clinical honesty as everyone else's.",
    passive: { trigger: "onCriticalHit", bonus: { kind: "damage", value: 0.06 } },
    active: { id: "aftercare-protocol", name: "Aftercare Protocol", cooldownMs: 11000 },
    ultimate: { id: "case-closed", name: "Case Closed", chargeRequired: 100, chargePerKill: 2, chargePerDamage: 0.04 },
    signature: {
      tag: "aftercare-doctrine",
      description: "Every crisis she survives becomes a treatment plan for the next person who does.",
      passive: { trigger: "onCriticalHit", bonus: { kind: "criticalChance", value: 0.03 } },
    },
  },
];

export const EXPANSION_PROFILES: readonly CommanderProfileDef[] = [
  {
    commanderId: "korr-wardbreaker",
    class: "defender",
    visualDesign: "Guild-issue plate re-forged into personal armour, contract seals filed off, one pauldron left blank on purpose.",
    voice: "Flat, transactional cadence that warms by exactly one degree when someone's actually safe.",
    secondaryAbility: { id: "escrow-shield", name: "Escrow Shield", cooldownMs: 15000 },
    masteryPassive: { trigger: "onKill", bonus: { kind: "damage", value: 0.04 } },
    ascensionUpgrade: { requiredAscensionLevel: 2, talentNodeId: "korr-wardbreaker:contract:endgameNode", description: "Ascension II: the Contract endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "korr-wardbreaker:contract", name: "Broken Contract", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `korr-wardbreaker:contract:${kind}`, kind: kind as never, description: `Broken Contract — ${kind}`, bonus: { kind: (["shieldCapacity", "statusDuration", "resourceGain", "movementSpeed", "shieldRegeneration", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "korr-wardbreaker:ward", name: "Standing Ward", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `korr-wardbreaker:ward:${kind}`, kind: kind as never, description: `Standing Ward — ${kind}`, bonus: { kind: (["shieldRegeneration", "cooldownReduction", "pickupRadius", "boostEfficiency", "shieldCapacity", "statusDuration"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "korr-wardbreaker:paid-in-full", name: "Paid in Full", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `korr-wardbreaker:paid-in-full:${kind}`, kind: kind as never, description: `Paid in Full — ${kind}`, bonus: { kind: (["damage", "experienceGain", "resourceGain", "movementSpeed", "criticalChance", "shieldCapacity"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:korr-wardbreaker",
    personalMissions: [
      { beat: "originStory", name: "The Broken Contract", description: "The evacuation the Guild billed her for finishing wrong." },
      { beat: "recruitment", name: "Fine Print", description: "The restoration read the contract she broke and hired her anyway." },
      { beat: "personalObjectives", name: "New Terms", description: "She writes her own contracts now. Every one gets kept." },
      { beat: "companionMissions", name: "Escrow", description: "Guarding the people who can't pay her, on purpose." },
      { beat: "legendaryMission", name: "The Second Fine", description: "The Guild sends a collector. She's still not paying." },
      { beat: "finalResolution", name: "Wardbreaker's Peace", description: "The Guild writes off the debt. Calls it a strategic loss." },
    ],
    loreId: "LORE_COMMANDER_WARDBREAKER",
    relationships: [{ subject: "majorFactions", targetId: "codex-mercenary-guild", dialogueHint: "Still gets Guild contract offers. Still says no on principle." }],
    statisticKeys: ["commander:korr-wardbreaker:usage", "commander:korr-wardbreaker:victories"],
    cosmetics: [{ kind: "colourThemes", id: "korr-wardbreaker-theme-default" }, { kind: "victoryPoses", id: "korr-wardbreaker-pose-signature" }],
    voiceLineIds: ["vo-korr-wardbreaker-launch", "vo-korr-wardbreaker-ultimate"],
    futureExpansionHooks: ["legendary-variant-korr-wardbreaker"],
  },
  {
    commanderId: "voss-lanternkeep",
    class: "scientist",
    visualDesign: "Archive-whites layered under a Custodian courtesy sash, a hand-lantern clipped at the hip out of habit, never electronic.",
    voice: "Soft, careful, footnotes every claim with where she found it.",
    secondaryAbility: { id: "index-flare", name: "Index Flare", cooldownMs: 13000 },
    masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "resourceGain", value: 0.05 } },
    ascensionUpgrade: { requiredAscensionLevel: 1, talentNodeId: "voss-lanternkeep:archive:endgameNode", description: "Ascension I: the Archive endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "voss-lanternkeep:archive", name: "Open Archive", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `voss-lanternkeep:archive:${kind}`, kind: kind as never, description: `Open Archive — ${kind}`, bonus: { kind: (["pickupRadius", "experienceGain", "resourceGain", "movementSpeed", "cooldownReduction", "experienceGain"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "voss-lanternkeep:permission", name: "Asked Permission", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `voss-lanternkeep:permission:${kind}`, kind: kind as never, description: `Asked Permission — ${kind}`, bonus: { kind: (["statusChance", "cooldownReduction", "experienceGain", "boostEfficiency", "statusDuration", "pickupRadius"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "voss-lanternkeep:catalogue", name: "The Catalogue", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `voss-lanternkeep:catalogue:${kind}`, kind: kind as never, description: `The Catalogue — ${kind}`, bonus: { kind: (["criticalChance", "resourceGain", "experienceGain", "movementSpeed", "pickupRadius", "cooldownReduction"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:voss-lanternkeep",
    personalMissions: [
      { beat: "originStory", name: "Eleven Years Cataloguing", description: "The archive she catalogued blind, one artefact at a time." },
      { beat: "recruitment", name: "Reading Rights", description: "The Custodians finally let her read what she'd already indexed." },
      { beat: "personalObjectives", name: "Marginalia", description: "Every artefact gets a note. Every note gets checked twice." },
      { beat: "companionMissions", name: "Escort to the Vault", description: "Nobody reads First Light's archive alone. Not even her." },
      { beat: "legendaryMission", name: "The Unsealed Index", description: "The one section the Custodians never let anyone open. Until now." },
      { beat: "finalResolution", name: "Lanternkeep", description: "She keeps the light on for whoever indexes next." },
    ],
    loreId: "LORE_COMMANDER_LANTERNKEEP",
    relationships: [{ subject: "civilisations", targetId: "codex-biome-ancient-core", dialogueHint: "First Light doesn't just tolerate her presence — it's started leaving things where she'll find them." }],
    statisticKeys: ["commander:voss-lanternkeep:usage", "commander:voss-lanternkeep:victories"],
    cosmetics: [{ kind: "colourThemes", id: "voss-lanternkeep-theme-default" }, { kind: "victoryPoses", id: "voss-lanternkeep-pose-signature" }],
    voiceLineIds: ["vo-voss-lanternkeep-launch", "vo-voss-lanternkeep-ultimate"],
    futureExpansionHooks: ["legendary-variant-voss-lanternkeep"],
  },
  {
    commanderId: "devereux-static",
    class: "experimental",
    visualDesign: "Stripped Protocol flight suit with every insignia burned off, a single unpatched scorch mark left where the Paragon crest used to sit.",
    voice: "Clipped, watchful, double-checks every readout out loud before believing it.",
    secondaryAbility: { id: "dead-drop", name: "Dead Drop", cooldownMs: 14000 },
    masteryPassive: { trigger: "onShieldBreak", bonus: { kind: "movementSpeed", value: 0.05 } },
    ascensionUpgrade: { requiredAscensionLevel: 3, talentNodeId: "devereux-static:defector:endgameNode", description: "Ascension III: the Defector endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "devereux-static:defector", name: "Mid-Flight Defector", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `devereux-static:defector:${kind}`, kind: kind as never, description: `Mid-Flight Defector — ${kind}`, bonus: { kind: (["criticalDamage", "cooldownReduction", "resourceGain", "movementSpeed", "criticalChance", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "devereux-static:clean-scan", name: "No Clean Scans", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `devereux-static:clean-scan:${kind}`, kind: kind as never, description: `No Clean Scans — ${kind}`, bonus: { kind: (["statusChance", "pickupRadius", "experienceGain", "boostEfficiency", "statusDuration", "criticalDamage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "devereux-static:burned-crest", name: "Burned Crest", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `devereux-static:burned-crest:${kind}`, kind: kind as never, description: `Burned Crest — ${kind}`, bonus: { kind: (["movementSpeed", "cooldownReduction", "resourceGain", "boostEfficiency", "criticalChance", "cooldownReduction"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:devereux-static",
    personalMissions: [
      { beat: "originStory", name: "The Colony That Wasn't a Threat", description: "The reconnaissance order he refused to finish flying." },
      { beat: "recruitment", name: "Static Line", description: "Defected mid-flight. Landed with the restoration instead of anywhere the Protocol could find him." },
      { beat: "personalObjectives", name: "Second Scans", description: "Every clean reading gets checked again. And again." },
      { beat: "companionMissions", name: "Nobody Alone Out There", description: "Won't let a squadmate fly recon solo. Doesn't explain why." },
      { beat: "legendaryMission", name: "The Protocol's Answer", description: "The Protocol finally sends someone to collect its property." },
      { beat: "finalResolution", name: "Not Property", description: "He was never property. It takes him a while to fully believe it." },
    ],
    loreId: "LORE_COMMANDER_STATIC",
    relationships: [{ subject: "storyEvents", targetId: "codex-paragon-protocol", dialogueHint: "Reads every Protocol intercept twice — once for the orders, once for what they're not saying." }],
    statisticKeys: ["commander:devereux-static:usage", "commander:devereux-static:victories"],
    cosmetics: [{ kind: "colourThemes", id: "devereux-static-theme-default" }, { kind: "victoryPoses", id: "devereux-static-pose-signature" }],
    voiceLineIds: ["vo-devereux-static-launch", "vo-devereux-static-ultimate"],
    futureExpansionHooks: ["legendary-variant-devereux-static"],
  },
  {
    commanderId: "okafor-halcyon",
    class: "support",
    visualDesign: "Field-medic whites gone road-worn, a hand-stitched ledger strapped where a sidearm would usually sit.",
    voice: "Warm, unhurried, says your name before she says anything else.",
    secondaryAbility: { id: "second-wind", name: "Second Wind", cooldownMs: 12000 },
    masteryPassive: { trigger: "onLowHealth", bonus: { kind: "shieldRegeneration", value: 5 } },
    ascensionUpgrade: { requiredAscensionLevel: 1, talentNodeId: "okafor-halcyon:ledger:endgameNode", description: "Ascension I: the Ledger endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "okafor-halcyon:ledger", name: "The Ledger", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `okafor-halcyon:ledger:${kind}`, kind: kind as never, description: `The Ledger — ${kind}`, bonus: { kind: (["experienceGain", "shieldRegeneration", "resourceGain", "movementSpeed", "shieldCapacity", "experienceGain"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "okafor-halcyon:triage", name: "Triage Line", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `okafor-halcyon:triage:${kind}`, kind: kind as never, description: `Triage Line — ${kind}`, bonus: { kind: (["shieldRegeneration", "cooldownReduction", "pickupRadius", "boostEfficiency", "statusDuration", "shieldCapacity"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "okafor-halcyon:names", name: "Every Name", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `okafor-halcyon:names:${kind}`, kind: kind as never, description: `Every Name — ${kind}`, bonus: { kind: (["statusChance", "experienceGain", "resourceGain", "movementSpeed", "shieldRegeneration", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:okafor-halcyon",
    personalMissions: [
      { beat: "originStory", name: "The Ledger, Not the Losses", description: "Every name she's stabilised, written down instead of counted." },
      { beat: "recruitment", name: "Field Access", description: "The restoration needed a medic who wouldn't burn out. She'd already decided not to." },
      { beat: "personalObjectives", name: "New Entries", description: "The ledger keeps growing. She reads it out loud on the bad nights." },
      { beat: "companionMissions", name: "Nobody Dies On My Ledger", description: "A promise she's kept exactly as often as physically possible." },
      { beat: "legendaryMission", name: "Halcyon Hour", description: "The hour where the ledger nearly grew a name it shouldn't have." },
      { beat: "finalResolution", name: "Still Writing", description: "The ledger is longer than the war. She intends to keep it that way." },
    ],
    loreId: "LORE_COMMANDER_HALCYON",
    relationships: [{ subject: "otherCommanders", targetId: "vek-ironhull", dialogueHint: "Has patched Ironhull up more times than either will admit out loud." }],
    statisticKeys: ["commander:okafor-halcyon:usage", "commander:okafor-halcyon:victories"],
    cosmetics: [{ kind: "colourThemes", id: "okafor-halcyon-theme-default" }, { kind: "victoryPoses", id: "okafor-halcyon-pose-signature" }],
    voiceLineIds: ["vo-okafor-halcyon-launch", "vo-okafor-halcyon-ultimate"],
    futureExpansionHooks: ["legendary-variant-okafor-halcyon"],
  },
  {
    commanderId: "ur-sella-chorus",
    class: "scientist",
    visualDesign: "Diplomatic Dominion vestments grown, not sewn, from lattice-silk that shifts colour with her mood.",
    voice: "Melodic and deliberate, negotiates every sentence like it might need to hold weight later.",
    secondaryAbility: { id: "counterpoint", name: "Counterpoint", cooldownMs: 11000 },
    masteryPassive: { trigger: "onKill", bonus: { kind: "statusDuration", value: 0.04 } },
    ascensionUpgrade: { requiredAscensionLevel: 2, talentNodeId: "ur-sella-chorus:assembly:endgameNode", description: "Ascension II: the Assembly endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "ur-sella-chorus:assembly", name: "Full Assembly", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `ur-sella-chorus:assembly:${kind}`, kind: kind as never, description: `Full Assembly — ${kind}`, bonus: { kind: (["resourceGain", "statusChance", "experienceGain", "movementSpeed", "cooldownReduction", "resourceGain"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "ur-sella-chorus:easier-audience", name: "Easier Audience", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `ur-sella-chorus:easier-audience:${kind}`, kind: kind as never, description: `Easier Audience — ${kind}`, bonus: { kind: (["statusDuration", "cooldownReduction", "pickupRadius", "boostEfficiency", "statusChance", "resourceGain"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "ur-sella-chorus:accord", name: "Standing Accord", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `ur-sella-chorus:accord:${kind}`, kind: kind as never, description: `Standing Accord — ${kind}`, bonus: { kind: (["criticalChance", "experienceGain", "resourceGain", "movementSpeed", "statusChance", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:ur-sella-chorus",
    personalMissions: [
      { beat: "originStory", name: "The Easier Audience", description: "Negotiating with resonant ecosystems before she ever addressed the Ascendancy." },
      { beat: "recruitment", name: "Full Assembly", description: "The Dominion sent its best voice to speak for the restoration." },
      { beat: "personalObjectives", name: "New Verses", description: "Every accord gets a resonance signature. She composes them herself." },
      { beat: "companionMissions", name: "Escort to Prismheart", description: "The crystals sing louder when she's close. Nobody's explained why." },
      { beat: "legendaryMission", name: "Full Chorus", description: "The negotiation that needed every voice in the Dominion at once." },
      { beat: "finalResolution", name: "Standing Accord", description: "The peace she wrote outlasts the war it ended." },
    ],
    loreId: "LORE_COMMANDER_CHORUS",
    relationships: [{ subject: "civilisations", targetId: "codex-crystal-resonance", dialogueHint: "The resonance wells answer her faster than they answer the Ascendancy itself." }],
    statisticKeys: ["commander:ur-sella-chorus:usage", "commander:ur-sella-chorus:victories"],
    cosmetics: [{ kind: "colourThemes", id: "ur-sella-chorus-theme-default" }, { kind: "victoryPoses", id: "ur-sella-chorus-pose-signature" }],
    voiceLineIds: ["vo-ur-sella-chorus-launch", "vo-ur-sella-chorus-ultimate"],
    futureExpansionHooks: ["legendary-variant-ur-sella-chorus"],
  },
  {
    commanderId: "kade-fulcrum",
    class: "engineer",
    visualDesign: "Integration-certified exoframe half-machined, half-grown, a visible lattice seam running from wrist to shoulder where the Collective's work meets his own.",
    voice: "Measured and generous with credit, narrates his own work like a shared project.",
    secondaryAbility: { id: "design-note", name: "Design Note", cooldownMs: 13000 },
    masteryPassive: { trigger: "onDamageTaken", bonus: { kind: "boostEfficiency", value: 0.04 } },
    ascensionUpgrade: { requiredAscensionLevel: 1, talentNodeId: "kade-fulcrum:integration:endgameNode", description: "Ascension I: the Integration endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "kade-fulcrum:integration", name: "Full Integration", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `kade-fulcrum:integration:${kind}`, kind: kind as never, description: `Full Integration — ${kind}`, bonus: { kind: (["criticalChance", "boostEfficiency", "resourceGain", "movementSpeed", "shieldRegeneration", "criticalChance"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "kade-fulcrum:certified", name: "Certified Both Ways", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `kade-fulcrum:certified:${kind}`, kind: kind as never, description: `Certified Both Ways — ${kind}`, bonus: { kind: (["boostEfficiency", "cooldownReduction", "pickupRadius", "shieldCapacity", "resourceGain", "shieldRegeneration"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "kade-fulcrum:design-notes", name: "Design Notes", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `kade-fulcrum:design-notes:${kind}`, kind: kind as never, description: `Design Notes — ${kind}`, bonus: { kind: (["statusChance", "experienceGain", "resourceGain", "movementSpeed", "boostEfficiency", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:kade-fulcrum",
    personalMissions: [
      { beat: "originStory", name: "First Certification", description: "The first human integration engineer the Collective ever signed off on." },
      { beat: "recruitment", name: "Both Ways", description: "He argued the certification taught the Collective something too. Nobody's disproven it." },
      { beat: "personalObjectives", name: "Every Design Note", description: "A broken shield is feedback. He answers all of it in writing." },
      { beat: "companionMissions", name: "Splice Duty", description: "Field repairs that half the fleet still doesn't fully understand." },
      { beat: "legendaryMission", name: "Full Integration", description: "The lattice project the Collective said couldn't be finished by one engineer." },
      { beat: "finalResolution", name: "The Fulcrum", description: "The point everything after him pivots on. He'd rather it not be about him." },
    ],
    loreId: "LORE_COMMANDER_FULCRUM",
    relationships: [{ subject: "majorFactions", targetId: "codex-machine-collective", dialogueHint: "The Collective calls him kin now. He still asks if that's official." }],
    statisticKeys: ["commander:kade-fulcrum:usage", "commander:kade-fulcrum:victories"],
    cosmetics: [{ kind: "colourThemes", id: "kade-fulcrum-theme-default" }, { kind: "victoryPoses", id: "kade-fulcrum-pose-signature" }],
    voiceLineIds: ["vo-kade-fulcrum-launch", "vo-kade-fulcrum-ultimate"],
    futureExpansionHooks: ["legendary-variant-kade-fulcrum"],
  },
  {
    commanderId: "calder-driftline",
    class: "hybrid",
    visualDesign: "Convoy-drift leathers patched from three different fleets, a scout-drone perch worn smooth at the shoulder from constant use.",
    voice: "Quick, bright, narrates the drift out loud like weather commentary.",
    secondaryAbility: { id: "convoy-call", name: "Convoy Call", cooldownMs: 10000 },
    masteryPassive: { trigger: "onCriticalHit", bonus: { kind: "movementSpeed", value: 0.04 } },
    ascensionUpgrade: { requiredAscensionLevel: 2, talentNodeId: "calder-driftline:drift:endgameNode", description: "Ascension II: the Drift endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "calder-driftline:drift", name: "The Drift", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `calder-driftline:drift:${kind}`, kind: kind as never, description: `The Drift — ${kind}`, bonus: { kind: (["damage", "movementSpeed", "resourceGain", "boostEfficiency", "criticalChance", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "calder-driftline:sense", name: "Convoy Sense", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `calder-driftline:sense:${kind}`, kind: kind as never, description: `Convoy Sense — ${kind}`, bonus: { kind: (["movementSpeed", "pickupRadius", "experienceGain", "boostEfficiency", "cooldownReduction", "movementSpeed"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "calder-driftline:scoutwork", name: "Scoutwork", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `calder-driftline:scoutwork:${kind}`, kind: kind as never, description: `Scoutwork — ${kind}`, bonus: { kind: (["droneEffectiveness", "cooldownReduction", "resourceGain", "movementSpeed", "pickupRadius", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:calder-driftline",
    personalMissions: [
      { beat: "originStory", name: "Navigating by Driftline", description: "Grew up reading convoy drift the way others read star charts." },
      { beat: "recruitment", name: "A Sense, Not a System", description: "The restoration needed a scout who trusted instinct over instruments." },
      { beat: "personalObjectives", name: "Half a Second Early", description: "Always calls the drift before the sensors confirm it." },
      { beat: "companionMissions", name: "Scout Formation", description: "Flies point for the convoys that trust her instincts over their own." },
      { beat: "legendaryMission", name: "Convoy Sense", description: "The drift nobody else could read, called correctly under fire." },
      { beat: "finalResolution", name: "Driftline", description: "Still navigates by feel. It's never once been wrong." },
    ],
    loreId: "LORE_COMMANDER_DRIFTLINE",
    relationships: [{ subject: "otherCommanders", targetId: "naru-whisper", dialogueHint: "Naru taught her to read the dark. Yuen taught Naru to read the drift back." }],
    statisticKeys: ["commander:calder-driftline:usage", "commander:calder-driftline:victories"],
    cosmetics: [{ kind: "colourThemes", id: "calder-driftline-theme-default" }, { kind: "victoryPoses", id: "calder-driftline-pose-signature" }],
    voiceLineIds: ["vo-calder-driftline-launch", "vo-calder-driftline-ultimate"],
    futureExpansionHooks: ["legendary-variant-calder-driftline"],
  },
  {
    commanderId: "aldana-aftercare",
    class: "scientist",
    visualDesign: "Clinical field-whites worn under a void-rated overcoat, case files bound in the same static-resistant cloth she wears.",
    voice: "Even, clinical, gentle in a way that never once condescends.",
    secondaryAbility: { id: "case-notes", name: "Case Notes", cooldownMs: 12000 },
    masteryPassive: { trigger: "onLowHealth", bonus: { kind: "statusChance", value: 0.04 } },
    ascensionUpgrade: { requiredAscensionLevel: 3, talentNodeId: "aldana-aftercare:treatment:endgameNode", description: "Ascension III: the Treatment endgame node unlocks without a talent point." },
    talentBranches: [
      { id: "aldana-aftercare:treatment", name: "Treatment Plan", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `aldana-aftercare:treatment:${kind}`, kind: kind as never, description: `Treatment Plan — ${kind}`, bonus: { kind: (["damage", "statusChance", "resourceGain", "movementSpeed", "criticalChance", "damage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "aldana-aftercare:own-case", name: "Her Own Case File", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `aldana-aftercare:own-case:${kind}`, kind: kind as never, description: `Her Own Case File — ${kind}`, bonus: { kind: (["criticalChance", "cooldownReduction", "experienceGain", "boostEfficiency", "statusDuration", "criticalDamage"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
      { id: "aldana-aftercare:aftercare", name: "Aftercare", nodes: ["combat", "utility", "economy", "mobility", "specialisation", "endgameNode"].map((kind, i) => ({ id: `aldana-aftercare:aftercare:${kind}`, kind: kind as never, description: `Aftercare — ${kind}`, bonus: { kind: (["statusChance", "experienceGain", "resourceGain", "movementSpeed", "shieldRegeneration", "statusDuration"] as const)[i]!, value: 0.05 + i * 0.01 } })) },
    ],
    masteryTrackId: "commander:aldana-aftercare",
    personalMissions: [
      { beat: "originStory", name: "Contact", description: "Survived an Eclipsed vanguard encounter that ended most careers." },
      { beat: "recruitment", name: "Her Own Case Notes", description: "Treats her own recovery with the same honesty as anyone else's." },
      { beat: "personalObjectives", name: "What the Void Leaves", description: "Every survivor's case file, catalogued without flinching." },
      { beat: "companionMissions", name: "Aftercare Rounds", description: "Checks in on every crew who's had contact. No exceptions." },
      { beat: "legendaryMission", name: "Case Closed", description: "The treatment plan for a crisis nobody thought treatable." },
      { beat: "finalResolution", name: "Aftercare", description: "The word she chose for herself, eventually, too." },
    ],
    loreId: "LORE_COMMANDER_AFTERCARE",
    relationships: [{ subject: "storyEvents", targetId: "codex-void-corruption", dialogueHint: "Her own case file is the appendix the corruption doctrine paper never had the nerve to include." }],
    statisticKeys: ["commander:aldana-aftercare:usage", "commander:aldana-aftercare:victories"],
    cosmetics: [{ kind: "colourThemes", id: "aldana-aftercare-theme-default" }, { kind: "victoryPoses", id: "aldana-aftercare-pose-signature" }],
    voiceLineIds: ["vo-aldana-aftercare-launch", "vo-aldana-aftercare-ultimate"],
    futureExpansionHooks: ["legendary-variant-aldana-aftercare"],
  },
];

export type DialogueLine = { category: string; line: string };

export interface CommanderExpandedProfileDef {
  commanderId: string;
  age: number;
  species: string;
  homeworld: string;
  psychologicalProfile: string;
  leadershipStyle: string;
  animationStyle: string;
  musicMotif: string;
  personality: PersonalityTrait;
  preferredShips: readonly string[];
  preferredWeapons: readonly string[];
  preferredEquipment: readonly string[];
  preferredRelics: readonly string[];
  preferredResearch: readonly string[];
  preferredBiomes: readonly string[];
  endingStory: string;
  dialogueLibrary: readonly DialogueLine[];
  masteryChallenges: readonly string[];
}

export const EXPANSION_EXPANDED_PROFILES: readonly CommanderExpandedProfileDef[] = [
  {
    commanderId: "korr-wardbreaker",
    age: 41,
    species: "Human",
    homeworld: "Kestrel's Rest",
    psychologicalProfile: "Transactional by training, loyal by choice now — measures every relationship in kept promises, including her own.",
    leadershipStyle: "Leads by contract: clear terms stated once, then absolute follow-through.",
    animationStyle: "Heavy plant-and-brace stance; the shield arm rises before the threat is visible on screen.",
    musicMotif: "Low brass ostinato under a single sustained violin note — contract and conscience in the same phrase.",
    personality: "strategic",
    preferredShips: ["bastion-hull-mk1", "ballista-mk3"],
    preferredWeapons: ["salvage-scattergun", "atlas-cluster-battery"],
    preferredEquipment: ["aegis-bastion-array", "bastion"],
    preferredRelics: ["warden-token", "static-node"],
    preferredResearch: ["barrier-theory", "rapid-refit"],
    preferredBiomes: ["derelict-expanse", "solar-wastes"],
    endingStory: "The Guild formally writes off her debt as a strategic loss rather than admit it was ever a matter of principle. Korr keeps the blank pauldron blank. She's still deciding what goes there.",
    dialogueLibrary: [
      { category: "missionStart", line: "Terms are simple. Everyone comes home. Move." },
      { category: "victory", line: "Contract fulfilled. This one, I mean." },
      { category: "defeat", line: "Note the terms. We renegotiate, not retreat." },
      { category: "recruitment", line: "You're not paying me. That's the part I like best." },
    ],
    masteryChallenges: ["Absorb 50,000 damage across active shields in a single expedition.", "Complete 20 expeditions without a squadmate falling below 20% hull."],
  },
  {
    commanderId: "voss-lanternkeep",
    age: 58,
    species: "Human",
    homeworld: "Meridian's Rest",
    psychologicalProfile: "Meticulous to the point of self-effacement — credits every discovery to whoever catalogued it first, including herself only reluctantly.",
    leadershipStyle: "Leads by citation: never gives an order without explaining the archive entry it's based on.",
    animationStyle: "Deliberate, economical movement; pauses mid-combat to note something before continuing, never breaking rhythm.",
    musicMotif: "A recurring solo kalimba figure, answered by a distant choir that never quite resolves.",
    personality: "curious",
    preferredShips: ["aurelia-hull-mk1", "caduceus-mk1"],
    preferredWeapons: ["helios-prism-array", "foundry-sunlance"],
    preferredEquipment: ["horizon-flux-capacitor", "cryo-manifold"],
    preferredRelics: ["conduit-loop", "singularity-keepsake"],
    preferredResearch: ["survey-protocols", "deep-scanning", "ancient-conduit"],
    preferredBiomes: ["ancient-core", "crystal-expanse"],
    endingStory: "The Custodians grant her permanent reading rights to First Light's full archive — the first ever extended to someone outside the order. She keeps asking permission anyway. They've stopped answering; it's become a kind of joke between them.",
    dialogueLibrary: [
      { category: "missionStart", line: "Every find gets catalogued. Even this one. Especially this one." },
      { category: "victory", line: "Add it to the index. Carefully." },
      { category: "defeat", line: "Noted. Filed. We try again with better footnotes." },
      { category: "recruitment", line: "I'll need to ask the Custodians. They'll say yes. They always do, eventually." },
    ],
    masteryChallenges: ["Discover 100 Codex entries while piloting.", "Complete an expedition into the Ancient Core biome without triggering a single security field."],
  },
  {
    commanderId: "devereux-static",
    age: 33,
    species: "Human",
    homeworld: "Unlisted (Paragon Protocol classified world)",
    psychologicalProfile: "Hypervigilant, self-doubting about his own instruments, fiercely protective of anyone flying recon near him.",
    leadershipStyle: "Leads by double-checking: no order goes out until he's personally verified the scan behind it.",
    animationStyle: "Sharp, reactive movement with a visible startle-flinch on shield break — recovers fast, but the flinch never fully trains out.",
    musicMotif: "A processed synth pulse that stutters and corrects itself, never quite steady.",
    personality: "haunted",
    preferredShips: ["maelstrom-x1", "sable-dart-mk1"],
    preferredWeapons: ["paragon-flux-driver", "voidlance"],
    preferredEquipment: ["nova-warden-hive", "vanguard"],
    preferredRelics: ["cinder-heart", "gambler-die"],
    preferredResearch: ["harmonic-overload", "unified-theory"],
    preferredBiomes: ["void-expanse", "singularity-zone"],
    endingStory: "The Protocol never comes to collect him. He decides, finally, that the silence means something other than a longer game — and stops waiting for it to end.",
    dialogueLibrary: [
      { category: "missionStart", line: "Scan twice. I mean it. Twice." },
      { category: "victory", line: "Clean. For real this time." },
      { category: "defeat", line: "That's on me. I should've called it earlier." },
      { category: "recruitment", line: "I'm not property. Took me a while to believe that. Ask me again in a year." },
    ],
    masteryChallenges: ["Survive 50 encounters starting a fight below 25% hull.", "Complete 10 expeditions into Paragon-affiliated missions without a single false-positive scan."],
  },
  {
    commanderId: "okafor-halcyon",
    age: 29,
    species: "Human",
    homeworld: "New Meridian",
    psychologicalProfile: "Radiates calm under pressure; privately keeps score of every name in her ledger and reads it on the nights it gets hard.",
    leadershipStyle: "Leads by presence: says your name before the order, so you know you're a person first.",
    animationStyle: "Fluid, economical medic motions; crouches to eye level with anyone she's treating, mid-combat or not.",
    musicMotif: "A warm cello line that never resolves to minor, even under threat cues.",
    personality: "compassionate",
    preferredShips: ["caduceus-mk1", "wayfarer-hull-mk2"],
    preferredWeapons: ["coil-ripper", "hailborn-array"],
    preferredEquipment: ["cryo-manifold", "aegis-ward-projector"],
    preferredRelics: ["frost-shard", "ember-core"],
    preferredResearch: ["field-dynamics", "resonant-collectors"],
    preferredBiomes: ["living-ecospheres", "meridian-rest-frontier"],
    endingStory: "The ledger outgrows the war it was started in. She keeps writing in it anyway — new names, for new reasons, none of them casualties.",
    dialogueLibrary: [
      { category: "missionStart", line: "I've got you. All of you. Let's go." },
      { category: "victory", line: "Everyone's name stays off the other list today." },
      { category: "defeat", line: "Hold on. I'm not writing this one down yet." },
      { category: "recruitment", line: "You're not a casualty waiting to happen. Not on my ledger." },
    ],
    masteryChallenges: ["Prevent 200 squadmate defeats across all expeditions.", "Complete an expedition without any ally dropping below 50% hull."],
  },
  {
    commanderId: "ur-sella-chorus",
    age: 46,
    species: "Human",
    homeworld: "Prismheart",
    psychologicalProfile: "Diplomatically patient to a fault, genuinely delighted by disagreement as long as it's articulate.",
    leadershipStyle: "Leads by consensus: builds the accord before giving the order, even under fire.",
    animationStyle: "Graceful, resonant gestures that leave faint harmonic trails; combat looks choreographed even when it isn't.",
    musicMotif: "A layered vocal chorus in shifting harmony, one voice always slightly ahead of the rest.",
    personality: "diplomatic",
    preferredShips: ["dawnspire", "aurelia-hull-mk1"],
    preferredWeapons: ["helios-prism-array", "novasplitter"],
    preferredEquipment: ["horizon-flux-capacitor", "cryo-manifold"],
    preferredRelics: ["singularity-keepsake", "veil-fragment"],
    preferredResearch: ["resonant-collectors", "coherent-beams"],
    preferredBiomes: ["crystal-expanse", "crystal-fields-alpha"],
    endingStory: "The accord she negotiates outlasts the war it ended — the first treaty in Dominion history co-authored with the ecosystems themselves as a named party. She calls it her best-reviewed paper.",
    dialogueLibrary: [
      { category: "missionStart", line: "Let's give them something worth negotiating with." },
      { category: "victory", line: "Accord reached. Signatures pending, as always." },
      { category: "defeat", line: "Not a rejection. A counter-offer, badly timed." },
      { category: "recruitment", line: "The crystals said yes before I finished asking. I'll take the omen." },
    ],
    masteryChallenges: ["Trigger 100 status effects across all encounters.", "Complete 15 expeditions into Crystal Dominion-aligned biomes."],
  },
  {
    commanderId: "kade-fulcrum",
    age: 47,
    species: "Human",
    homeworld: "Forge Primus",
    psychologicalProfile: "Generous with credit, restless with unsolved problems, treats every setback as an unfiled design note.",
    leadershipStyle: "Leads by iteration: every failure gets a fix proposal before the debrief ends.",
    animationStyle: "Precise, mechanical economy of motion; visibly cross-references his own lattice seam mid-repair, as if consulting himself.",
    musicMotif: "A percussive industrial pulse layered under a single sustained synthetic choir tone.",
    personality: "visionary",
    preferredShips: ["hivemother-mk1", "bastion-hull-mk1"],
    preferredWeapons: ["coil-ripper-mk2", "atlas-cluster-battery"],
    preferredEquipment: ["nova-warden-hive", "aegis-bastion-array"],
    preferredRelics: ["static-node", "conduit-loop"],
    preferredResearch: ["field-dynamics", "expanded-archives"],
    preferredBiomes: ["machine-expanse", "derelict-expanse"],
    endingStory: "The Collective formally certifies a second human integration engineer, trained under Kade himself. He argues that makes them even. The Collective disagrees, cheerfully, in writing.",
    dialogueLibrary: [
      { category: "missionStart", line: "Every system's got a design note. Let's go find today's." },
      { category: "victory", line: "Filed under: worked as intended, eventually." },
      { category: "defeat", line: "Noted. Revision incoming." },
      { category: "recruitment", line: "Certified both ways. I checked. Twice." },
    ],
    masteryChallenges: ["Repair or restore 10,000 units of shield capacity across all expeditions.", "Complete 20 expeditions using only Machine Collective-aligned equipment."],
  },
  {
    commanderId: "calder-driftline",
    age: 24,
    species: "Human",
    homeworld: "Convoy-born (Stellar Nomads fleet, no fixed world)",
    psychologicalProfile: "Instinctive and unshakably optimistic, trusts feeling over instruments and has rarely been wrong.",
    leadershipStyle: "Leads by example, one half-second ahead of everyone else's read on the situation.",
    animationStyle: "Loose, drifting movement that snaps to sudden precision the instant a threat resolves.",
    musicMotif: "A bright, syncopated string figure that seems to lead the beat rather than follow it.",
    personality: "optimistic",
    preferredShips: ["sable-dart-mk1", "hivemother-mk1"],
    preferredWeapons: ["salvage-scattergun", "coil-ripper"],
    preferredEquipment: ["nova-warden-hive", "vanguard"],
    preferredRelics: ["gambler-die", "veil-fragment"],
    preferredResearch: ["survey-protocols", "warp-charting"],
    preferredBiomes: ["meridian-rest-frontier", "void-expanse"],
    endingStory: "Naru Whisper formally hands her the pathfinder lead for the next convoy generation. Yuen protests she's not ready. The convoy already trusts her more than it ever admits.",
    dialogueLibrary: [
      { category: "missionStart", line: "Feel that? That's the drift. We're going this way." },
      { category: "victory", line: "Told you. Half a second early, every time." },
      { category: "defeat", line: "Read it wrong. Won't happen twice today." },
      { category: "recruitment", line: "The convoy trusts a feeling. I've never given them a reason not to." },
    ],
    masteryChallenges: ["Scout 500 star systems across all expeditions.", "Complete 10 expeditions without triggering a single ambush spawn."],
  },
  {
    commanderId: "aldana-aftercare",
    age: 52,
    species: "Human",
    homeworld: "New Meridian",
    psychologicalProfile: "Clinically honest with herself and everyone else — treats her own trauma as case data, not exception, and finds that discipline steadying rather than cold.",
    leadershipStyle: "Leads by disclosure: shares her own case notes first, so nobody else has to go first.",
    animationStyle: "Steady, unhurried motion even under duress; a visible half-second stillness after every critical hit, deliberate rather than hesitant.",
    musicMotif: "A slow, resolving piano line under a distant, unresolved void-drone that never quite fades.",
    personality: "idealistic",
    preferredShips: ["maelstrom-x1", "caduceus-mk1"],
    preferredWeapons: ["voidlance", "paragon-flux-driver"],
    preferredEquipment: ["cryo-manifold", "horizon-flux-capacitor"],
    preferredRelics: ["frost-shard", "cinder-heart"],
    preferredResearch: ["barrier-theory", "harmonic-overload"],
    preferredBiomes: ["void-expanse", "singularity-zone"],
    endingStory: "Her case file — the one she swore she'd treat like anyone else's — finally gets a closing note in her own hand: recovered, not cured, and that distinction turns out to be enough.",
    dialogueLibrary: [
      { category: "missionStart", line: "Whatever the Void shows you today, we treat it. Clinically. Together." },
      { category: "victory", line: "Case notes updated. Prognosis: improving." },
      { category: "defeat", line: "Add it to the file. We learn from every entry." },
      { category: "recruitment", line: "I survived contact. That's not the interesting part. What I did after is." },
    ],
    masteryChallenges: ["Survive 30 encounters against Void-aligned enemies.", "Complete 5 expeditions into the Singularity Zone without falling below 40% hull."],
  },
];

/** Real recruitment bindings for the 8 new commanders, on AF-072's
 * unchanged 7-value RECRUITMENT_SOURCES — genuinely recruitable through
 * RosterRuntime.tryRecruit, not inert data. */
export const EXPANSION_RECRUITMENT_TABLE: readonly RecruitmentDef[] = [
  { commanderId: "korr-wardbreaker", source: "factionReputation", requirement: "Reach honoured standing with the Mercenary Guild's rival contract circle." },
  { commanderId: "voss-lanternkeep", source: "hiddenDiscoveries", requirement: "Recover the sealed archive index at First Light." },
  { commanderId: "devereux-static", source: "legendaryMissions", requirement: "Complete a legendary expedition against Paragon Protocol forces." },
  { commanderId: "okafor-halcyon", source: "story", requirement: "Complete the Frontier Restoration chapter's medical relief detachment." },
  { commanderId: "ur-sella-chorus", source: "research", requirement: "Activate the resonance array at Crystal Expanse." },
  { commanderId: "kade-fulcrum", source: "exploration", requirement: "Visit Machine Expanse and complete a full integration survey." },
  { commanderId: "calder-driftline", source: "exploration", requirement: "Scout twelve star systems along an active convoy driftline." },
  { commanderId: "aldana-aftercare", source: "hiddenDiscoveries", requirement: "Recover survivor case files from a Void Expanse contact zone." },
];

export const FULL_COMMANDER_ROSTER: readonly CommanderDef[] = [...LAUNCH_ROSTER, ...EXPANSION_COMMANDERS];
export const FULL_COMMANDER_PROFILES: readonly CommanderProfileDef[] = [...LAUNCH_PROFILES, ...EXPANSION_PROFILES];
export const FULL_RECRUITMENT_TABLE: readonly RecruitmentDef[] = [...RECRUITMENT_TABLE, ...EXPANSION_RECRUITMENT_TABLE];

/** Every expansion commander is proven distinct from the ENTIRE existing
 * roster (launch + expansion), not just eyeballed — the same
 * findOverlap law AF-030 already enforces, run here against the full set. */
export function expansionOverlapReport(): readonly string[] {
  const conflicts: string[] = [];
  for (const candidate of EXPANSION_COMMANDERS) {
    const others = FULL_COMMANDER_ROSTER.filter((c) => c.id !== candidate.id);
    const overlap = findOverlap(candidate, others);
    if (overlap) conflicts.push(`${candidate.id} overlaps ${overlap}`);
  }
  return conflicts;
}

/** Every expansion commander satisfies AF-071's real 17-part architecture
 * completeness function, unmodified. */
export function expansionArchitectureComplete(): boolean {
  for (const profile of EXPANSION_PROFILES) {
    const def = EXPANSION_COMMANDERS.find((c) => c.id === profile.commanderId);
    if (!def) return false;
    const architecture = architectureFor(def, profile);
    if (!Object.values(architecture).every(Boolean)) return false;
  }
  return true;
}
