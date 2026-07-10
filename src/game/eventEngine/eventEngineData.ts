/**
 * The Galactic Event Engine (AF-137). A new scale-tier classification
 * layered alongside — never a redesign of — AF-041's real
 * `WorldEventRuntime`/`EventCategory` (10 type-based categories:
 * galaxy/sector/faction/ancient/environmental/economic/
 * scientificDiscovery/emergency/hidden/legendary, with real
 * PlayerParticipationKind handling and EventChainRef chaining
 * already built and locked). This module's `EventTier` is a
 * different axis — SCALE (how far an event's consequences reach),
 * not TYPE — so "Sector" and "Legendary" appearing in both this
 * module's tiers and AF-041's categories is coincidental vocabulary
 * overlap, not a shared type; the two unions never touch.
 *
 * "Events must emerge naturally from the Living Galaxy Simulation
 * (AF-132), the Dynamic Story Engine (AF-136), the Legacy Engine
 * (AF-133), and Commander relationships (AF-130)" is the spec's own
 * instruction to compose rather than duplicate — `tierWeightsFor`
 * below takes plain numeric summaries a caller extracts from those
 * four real runtimes, so this module has no import-time dependency on
 * any of them and stays fully testable in isolation.
 */

export const EVENT_TIERS = ["Local", "Regional", "Sector", "Galactic", "Legendary"] as const;
export type EventTier = (typeof EVENT_TIERS)[number];

export const EVENT_TIER_EXAMPLES: Record<EventTier, readonly string[]> = {
  Local: ["Research breakthrough", "Wildlife birth", "Equipment shipment", "Engineering competition", "Festival", "Small rescue"],
  Regional: ["Trade dispute", "Meteor impact", "Disease outbreak", "Pirate activity", "Ancient ruin uncovered", "Scientific conference"],
  Sector: ["Political election", "Massive migration", "Economic boom", "Colony expansion", "Solar storm", "Large expedition"],
  Galactic: ["First Contact", "Major alliance", "Supernova", "Ancient megastructure activation", "Historic discovery", "Galaxy-wide celebration"],
  Legendary: ["The Lost Ark", "The Founder Signal", "Unknown Intelligence", "The Silent Fleet", "Ancient AI Awakening"],
};

export const EVENT_GENERATION_INPUTS = [
  "Economy",
  "Weather",
  "Commander bonds",
  "Player reputation",
  "Colony growth",
  "Research",
  "Wildlife",
  "Population",
  "Politics",
  "History",
  "Exploration",
] as const;
export type EventGenerationInput = (typeof EVENT_GENERATION_INPUTS)[number];

export const COMMUNITY_EVENT_KINDS = [
  "Harvest",
  "Scientific success",
  "Engineering milestones",
  "School graduations",
  "Planet anniversaries",
  "Wildlife festivals",
  "Museum openings",
  "Sports championships",
  "Music concerts",
] as const;
export type CommunityEventKind = (typeof COMMUNITY_EVENT_KINDS)[number];

export const COMMANDER_EVENT_KINDS = [
  "Birthday",
  "Promotion",
  "Award ceremony",
  "Research publication",
  "Friendly rivalry",
  "Retirement",
  "Historic speech",
] as const;
export type CommanderEventKind = (typeof COMMANDER_EVENT_KINDS)[number];

export const WORLD_EVENT_KINDS = [
  "Planetary earthquakes",
  "Ice ages",
  "Ocean blooms",
  "Solar eclipses",
  "Meteor showers",
  "Auroras",
  "Volcanic eruptions",
  "Terraforming success",
  "Environmental recovery",
] as const;
export type WorldEventKind = (typeof WORLD_EVENT_KINDS)[number];

export const DISCOVERY_EVENT_KINDS = [
  "Unknown ruins",
  "Living megafauna",
  "Ancient satellites",
  "First alien artwork",
  "Historic recordings",
  "Lost colonies",
  "Experimental technology",
] as const;
export type DiscoveryEventKind = (typeof DISCOVERY_EVENT_KINDS)[number];

export const PLAYER_EVENT_KINDS = [
  "Parades",
  "Statues",
  "Interviews",
  "Requests for help",
  "Invitations",
  "Scientific lectures",
  "Children asking questions",
  "Commander celebrations",
] as const;
export type PlayerEventKind = (typeof PLAYER_EVENT_KINDS)[number];

export const EMERGENCY_EVENT_KINDS = [
  "Medical emergency",
  "Power failure",
  "Ship collision",
  "Research accident",
  "Wildfire",
  "Radiation leak",
  "Missing expedition",
  "Companion rescue",
] as const;
export type EmergencyEventKind = (typeof EMERGENCY_EVENT_KINDS)[number];

export const HISTORICAL_EVENT_TRIGGER_KINDS = [
  "Museum exhibitions",
  "Commander speeches",
  "Fireworks",
  "Memorials",
  "Educational broadcasts",
  "Historical documentaries",
] as const;
export type HistoricalEventTriggerKind = (typeof HISTORICAL_EVENT_TRIGGER_KINDS)[number];

export const SHIP_EVENT_KINDS = [
  "Movie night",
  "Cooking competition",
  "Engineering prank",
  "Lost pet",
  "Unexpected visitor",
  "Power outage",
  "Concert",
  "Meteor viewing",
  "Quiet evening",
] as const;
export type ShipEventKind = (typeof SHIP_EVENT_KINDS)[number];

export const EXPLORATION_EVENT_KINDS = [
  "Expedition distress calls",
  "Unknown beacons",
  "Living planets",
  "Impossible storms",
  "Quantum echoes",
  "Space whales",
  "Forgotten observatories",
  "Deep-space archaeology",
] as const;
export type ExplorationEventKind = (typeof EXPLORATION_EVENT_KINDS)[number];

export const ECONOMIC_EVENT_KINDS = [
  "Trade surplus",
  "Fuel shortage",
  "Construction contracts",
  "Research grants",
  "Market crash",
  "Medical donations",
  "Tourism boom",
  "Industrial expansion",
] as const;
export type EconomicEventKind = (typeof ECONOMIC_EVENT_KINDS)[number];

/** The spec's own worked example — eight real steps, each one a
 * plausible trigger for the next. */
export const EVENT_CHAIN_EXAMPLE: readonly string[] = [
  "Mining boom",
  "New settlement",
  "Trade route",
  "Pirates appear",
  "Security upgrades",
  "Commander mission",
  "Museum exhibit",
  "History entry",
];

export interface EventTierInputs {
  economyHealth: number;
  averagePollution: number;
  averageWildlife: number;
  reputationTotal: number;
  strongestBondLevel: number;
  dominantPillarCount: number;
}

/** Weights each tier by real composed inputs — nothing appears
 * randomly. Higher civilisation/reputation/bond signals bias toward
 * larger-scale tiers; Legendary is always the rarest regardless of
 * inputs ("never guaranteed"). */
export function tierWeightsFor(inputs: EventTierInputs): Record<EventTier, number> {
  const activity = Math.max(0, inputs.economyHealth) + Math.max(0, inputs.reputationTotal) * 0.1 + inputs.strongestBondLevel + inputs.dominantPillarCount;
  return {
    Local: 10,
    Regional: 5 + activity * 0.5,
    Sector: 2 + activity * 0.3,
    Galactic: 1 + activity * 0.1,
    Legendary: 0.1,
  };
}
