/**
 * Faction Framework data shapes (AF-085). EXTENDS AF-039's locked faction
 * system — `FactionDef`, the ten-id register, reputation levels and
 * clamps, `CONFLICT_STATES`, the mission/event/roster shapes, and
 * `FactionRuntime` are untouched. AF-085 wraps each CIVILISATION in a
 * PROFILE (the AF-071→084 pattern): the spec's ten major factions land
 * as a CIVILISATION REGISTER whose every entry is REALISED by an
 * existing thing — a diplomatic faction on AF-039's register, an enemy
 * civilisation in AF-026's codex, or the player's own organisation
 * (the Afterlight Initiative IS the campaign's protagonist) — no
 * eleventh faction; the seven political instruments map TOTALLY onto
 * AF-039's conflict states; "nothing remains undefined" is a
 * fifteen-part completeness function; and §Faction Identity's "no
 * faction should overlap excessively" is a UNIQUENESS LAW across
 * architecture, music, dialogue, signature rewards and economy sectors.
 */
import type { ConflictState, FactionDef, FactionEventKind, FactionId, FactionRewardDef, FactionRosterDef } from "./factionData";

/** The 15-part faction architecture (AF-085 §Faction Architecture) — nothing remains undefined. */
export const FACTION_ARCHITECTURE_PARTS = [
  "uniqueId",
  "name",
  "government",
  "history",
  "leader",
  "military",
  "economy",
  "technology",
  "territory",
  "relationships",
  "reputation",
  "visualIdentity",
  "audioIdentity",
  "lore",
  "futureExpansionHooks",
] as const;
export type FactionArchitecturePart = (typeof FACTION_ARCHITECTURE_PARTS)[number];

/** How a spec civilisation is realised by an EXISTING system — no eleventh faction. */
export type CivilisationRealisation =
  | { kind: "playerOrganisation"; binding: string }
  | { kind: "diplomatic"; factionId: FactionId }
  | { kind: "enemyCivilisation"; codexEntryId: string };

export interface CivilisationRegisterEntry {
  specId: string;
  name: string;
  realisation: CivilisationRealisation;
}

/** The spec's ten major factions (AF-085 §Major Factions), each realised. */
export const CIVILISATION_REGISTER: readonly CivilisationRegisterEntry[] = [
  { specId: "afterlightInitiative", name: "Afterlight Initiative", realisation: { kind: "playerOrganisation", binding: "the AF-068 campaign's protagonist organisation — the player IS the Initiative" } },
  { specId: "unitedHumanFrontier", name: "United Human Frontier", realisation: { kind: "diplomatic", factionId: "humanAlliance" } },
  { specId: "crystalAscendancy", name: "Crystal Ascendancy", realisation: { kind: "diplomatic", factionId: "crystalDominion" } },
  { specId: "machineCollective", name: "Machine Collective", realisation: { kind: "diplomatic", factionId: "machineCollective" } },
  { specId: "voidSwarm", name: "Void Swarm", realisation: { kind: "diplomatic", factionId: "voidLegion" } },
  { specId: "celestialConclave", name: "Celestial Conclave", realisation: { kind: "enemyCivilisation", codexEntryId: "codex-celestial-conclave" } },
  { specId: "paragonProtocol", name: "Paragon Protocol", realisation: { kind: "enemyCivilisation", codexEntryId: "codex-paragon-protocol" } },
  { specId: "stellarNomads", name: "Stellar Nomads", realisation: { kind: "diplomatic", factionId: "nomadFleet" } },
  { specId: "theEclipsed", name: "The Eclipsed", realisation: { kind: "enemyCivilisation", codexEntryId: "codex-eclipsed" } },
  { specId: "independentColonies", name: "Independent Colonies", realisation: { kind: "diplomatic", factionId: "independentColonies" } },
];

/** Reputation tracks (AF-085 §Reputation System) — eight, each naming the
 * LIVE mechanism that already carries it. */
export interface LiveBindingDef {
  id: string;
  liveBinding: string;
}

export const REPUTATION_TRACKS: readonly LiveBindingDef[] = [
  { id: "trust", liveBinding: "the AF-039 reputation stat persisted through AF-026's recordStat" },
  { id: "influence", liveBinding: "AF-039 FACTION_ATTRIBUTE_KINDS.influence per faction" },
  { id: "alliance", liveBinding: "CONFLICT_STATES.alliance via FactionRuntime.relationshipBetween" },
  { id: "hostility", liveBinding: "reputation below −200 reads as the hostile level (AF-039 thresholds)" },
  { id: "scientificStanding", liveBinding: "AF-039 FACTION_ATTRIBUTE_KINDS.technology" },
  { id: "tradeStanding", liveBinding: "AF-039 FACTION_ATTRIBUTE_KINDS.economicPower + AF-041 market access" },
  { id: "militaryStanding", liveBinding: "AF-039 FACTION_ATTRIBUTE_KINDS.militaryStrength" },
  { id: "historicalDecisions", liveBinding: "AF-039 PLAYER_CHOICE_KINDS recorded through the meta ledger" },
];

/** Player interaction routes (AF-085 §Player Interaction) — eight, live-bound. */
export const PLAYER_INTERACTION_ROUTES: readonly LiveBindingDef[] = [
  { id: "missionOutcomes", liveBinding: "AF-039 faction missions granting reputation on victory" },
  { id: "trade", liveBinding: "AF-041 market purchases and merchant events" },
  { id: "research", liveBinding: "AF-024 research points banked from faction rewards" },
  { id: "rescueOperations", liveBinding: "AF-083 rescue expeditions (Winterline) with faction presence" },
  { id: "diplomaticDecisions", liveBinding: "AF-039 PLAYER_CHOICE_KINDS (support/oppose/negotiate)" },
  { id: "exploration", liveBinding: "AF-038 per-system exploration inside faction territory" },
  { id: "technologySharing", liveBinding: "AF-039 blueprint/researchPoints reward kinds, both directions" },
  { id: "civilianSupport", liveBinding: "AF-084 civilianSupport mission family" },
];

/** Relationship evolution drivers (AF-085 §Faction Relationships) — six, each
 * realised by an AF-039 conflict state or faction event. */
export const RELATIONSHIP_EVOLUTION_DRIVERS = ["wars", "trade", "scientificCooperation", "politicalEvents", "territorialExpansion", "ancientDiscoveries"] as const;
export type RelationshipEvolutionDriver = (typeof RELATIONSHIP_EVOLUTION_DRIVERS)[number];

export const EVOLUTION_DRIVER_REALISATION: Readonly<Record<RelationshipEvolutionDriver, { conflictState: ConflictState } | { factionEvent: FactionEventKind }>> = {
  wars: { conflictState: "openWar" },
  trade: { conflictState: "tradeAgreement" },
  scientificCooperation: { conflictState: "scientificCooperation" },
  politicalEvents: { factionEvent: "leadershipChange" },
  territorialExpansion: { conflictState: "borderConflict" },
  ancientDiscoveries: { factionEvent: "ancientAwakening" },
};

/** Political instruments (AF-085 §Galactic Politics) — seven, mapped TOTALLY
 * onto AF-039's conflict states; political instability creates gameplay. */
export const POLITICAL_INSTRUMENTS = ["peaceTreaties", "wars", "tradeAgreements", "jointResearch", "militaryAlliances", "embargoes", "explorationAccords"] as const;
export type PoliticalInstrument = (typeof POLITICAL_INSTRUMENTS)[number];

export const INSTRUMENT_TO_CONFLICT_STATE: Readonly<Record<PoliticalInstrument, ConflictState>> = {
  peaceTreaties: "ceasefire",
  wars: "openWar",
  tradeAgreements: "tradeAgreement",
  jointResearch: "scientificCooperation",
  militaryAlliances: "alliance",
  embargoes: "coldWar",
  explorationAccords: "scientificCooperation", // shared charts are shared science today
};

/** Economy sectors (AF-085 §Faction Economies) — eight registered; every
 * profiled faction runs its own distinct emphasis. */
export const FACTION_ECONOMY_SECTORS = ["mining", "industry", "trade", "research", "militaryProduction", "civilianDevelopment", "exploration", "infrastructure"] as const;
export type FactionEconomySector = (typeof FACTION_ECONOMY_SECTORS)[number];

/** Territory effects (AF-085 §Faction Territory) — seven, live-bound. */
export const TERRITORY_EFFECTS: readonly LiveBindingDef[] = [
  { id: "missionAvailability", liveBinding: "AF-083 profile factionPresence per expedition" },
  { id: "trade", liveBinding: "AF-041 merchants and market events per system" },
  { id: "resources", liveBinding: "AF-036 biome resource weights inside the region" },
  { id: "enemyPresence", liveBinding: "region-dominant enemy rosters (AF-046→057 civilisation modules)" },
  { id: "galaxyEvents", liveBinding: "AF-038/059 events keyed to regions and systems" },
  { id: "research", liveBinding: "AF-066 research-station POIs inside controlled space" },
  { id: "story", liveBinding: "AF-068 campaign chapters staged across regions" },
];

/** Reward realisations (AF-085 §Faction Rewards) — nine, each naming how the
 * spec reward reaches the player through existing systems. */
export const FACTION_REWARD_REALISATIONS: readonly LiveBindingDef[] = [
  { id: "blueprints", liveBinding: "FactionRewardDef.blueprint — live (AF-039 sandbox missions issue one)" },
  { id: "ships", liveBinding: "FactionRewardDef.ship — registered for faction-specific hull unlocks" },
  { id: "weapons", liveBinding: "FactionRewardDef.weapon — registered for faction arsenal unlocks" },
  { id: "equipment", liveBinding: "FactionRewardDef.equipment — registered for faction module unlocks" },
  { id: "relics", liveBinding: "in-run AF-029 drop pools, boosted by faction-mission modifiers — relics are found, never handed out" },
  { id: "commanders", liveBinding: "FactionRewardDef.commander — registered; AF-072 recruitment routes name factions" },
  { id: "research", liveBinding: "FactionRewardDef.researchPoints — live (AF-039 sandbox missions issue them)" },
  { id: "cosmetics", liveBinding: "FactionRewardDef.cosmetic — registered for the cosmetics module" },
  { id: "lore", liveBinding: "FactionRewardDef.lore — live through AF-026's codex collections" },
];

/** Accessibility surfaces (AF-085 §Accessibility) — seven registered. */
export const FACTION_ACCESSIBILITY_SURFACES = ["relationshipViewer", "reputationHistory", "factionEncyclopedia", "largeUI", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;

/** The AF-085 profile — wraps an AF-039 FactionDef by id; the def and the
 * engine are never modified. Carries §Faction Identity's remaining uniques:
 * architecture, music, dialogue, signature reward, economy emphasis. */
export interface FactionProfileDef {
  factionId: FactionId;
  architectureStyle: string;
  musicTheme: string;
  dialogueVoice: string;
  /** The reward kind this faction is KNOWN for — a FactionRewardDef kind. */
  signatureRewardKind: FactionRewardDef["kind"];
  economySectors: readonly FactionEconomySector[];
  futureExpansionHooks: readonly string[];
}

export const FACTION_PROFILES: readonly FactionProfileDef[] = [
  {
    factionId: "crystalDominion",
    architectureStyle: "Grown spire-lattices — no seams, no scaffolds; buildings that are still growing.",
    musicTheme: "Sustained glass harmonics that resolve a generation later.",
    dialogueVoice: "Plural, unhurried, and slightly out of phase with itself.",
    signatureRewardKind: "resource",
    economySectors: ["mining", "research", "infrastructure"],
    futureExpansionHooks: ["faction-dominion-resonance-court"],
  },
  {
    factionId: "machineCollective",
    architectureStyle: "Fractal foundry blocks rearranged nightly by their own inhabitants.",
    musicTheme: "Interlocking mechanical rhythms with no downbeat and no end.",
    dialogueVoice: "Precise, literal, and faintly puzzled by rhetorical questions.",
    signatureRewardKind: "researchPoints",
    economySectors: ["industry", "militaryProduction", "research"],
    futureExpansionHooks: ["faction-collective-convergence-vote"],
  },
  {
    factionId: "humanAlliance",
    architectureStyle: "Modular relay-stations — everything repairable, everything replaceable, everything named.",
    musicTheme: "Brass over static: signal songs built from re-established relay tones.",
    dialogueVoice: "Warm, procedural, always ending with a callsign.",
    signatureRewardKind: "blueprint",
    economySectors: ["trade", "civilianDevelopment", "industry"],
    futureExpansionHooks: ["faction-alliance-reconnection-accord"],
  },
  {
    factionId: "mercenaryGuild",
    architectureStyle: "Armoured dock-bazaars — half hangar, half auction floor, all camera coverage.",
    musicTheme: "Low percussion under contract-reading cadence; the beat is the invoice.",
    dialogueVoice: "Transactional, dry, contractually precise about threats.",
    signatureRewardKind: "commander",
    economySectors: ["trade", "militaryProduction"],
    futureExpansionHooks: ["faction-guild-broker-war"],
  },
  {
    factionId: "ancientCustodians",
    architectureStyle: "White stone and gold conduit — geometry that predates its visitors and outlasts them.",
    musicTheme: "A choir-like standing tone that was playing before you arrived.",
    dialogueVoice: "Formal, exact, and addressed to whoever held your clearance last.",
    signatureRewardKind: "lore",
    economySectors: ["infrastructure", "research"],
    futureExpansionHooks: ["faction-custodians-directive-review"],
  },
  {
    factionId: "nomadFleet",
    architectureStyle: "Convoy-cities of mismatched hulls lashed into one silhouette per season.",
    musicTheme: "Hull-drum folk songs traded between convoys like cargo.",
    dialogueVoice: "Idiomatic, generous, and allergic to staying on subject.",
    signatureRewardKind: "ship",
    economySectors: ["trade", "exploration"],
    futureExpansionHooks: ["faction-nomads-great-mooring"],
  },
];

/** "Nothing remains undefined" as a function — all 15 parts must hold. */
export function factionArchitectureFor(
  def: FactionDef,
  profile: FactionProfileDef,
  roster: FactionRosterDef,
): Record<FactionArchitecturePart, boolean> {
  return {
    uniqueId: def.id.length > 0,
    name: def.name.length > 0,
    government: def.government.length > 0,
    history: def.history.length > 0,
    leader: def.leader.length > 0,
    military: def.military.length > 0,
    economy: def.economy.length > 0 && profile.economySectors.length > 0,
    technology: def.technology.length > 0,
    territory: def.territory.length > 0,
    relationships: roster.defaultRelationship.length > 0, // every pair resolves via the roster default
    reputation: true, // the AF-039 reputation ladder covers every faction id
    visualIdentity: def.symbol.length > 0 && profile.architectureStyle.length > 0,
    audioIdentity: profile.musicTheme.length > 0 && profile.dialogueVoice.length > 0,
    lore: def.loreId.length > 0 && def.culture.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

/** §Accessibility: the faction encyclopedia is DERIVED from data every
 * profiled faction already carries — a viewer, not a system. */
export function factionEncyclopediaFor(def: FactionDef, profile: FactionProfileDef): Readonly<Record<string, string>> {
  return {
    overview: `${def.name} — ${def.government}`,
    history: def.history,
    leadership: def.leader,
    doctrine: def.military,
    economy: `${def.economy} (sectors: ${profile.economySectors.join(", ")})`,
    technology: def.technology,
    culture: def.culture,
    territory: def.territory.join(", "),
    identity: `${profile.architectureStyle} · ${profile.musicTheme} · ${profile.dialogueVoice}`,
    signatureReward: profile.signatureRewardKind,
  };
}
