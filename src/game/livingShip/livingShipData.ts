/**
 * The Living Expedition Ship (AF-131) — the A.S.V. Afterlight, the
 * player's home hub. Additive data layer: never modifies AF-031's
 * combat Ship Framework (src/game/ships/), AF-045's Audio Framework,
 * or AF-129's Museum — this module's own Museum/audio/season constants
 * are flavour-scoped to the ship hub and cross-reference those real
 * systems by id rather than redefining them.
 *
 * Engineering and Laboratory room rosters resolve the spec's
 * first-name-only cast lists onto real, existing Commander ids:
 * Engineering — Cassia Thorne, Elias Ryker, Caelus Nova, Nova
 * Iskander, Xanthe Oris (all five are fabrication/engineering
 * archetypes already); Laboratory — Lyra Voss, Seraphina Cael, Mira
 * Syn, Sora Helix (all four are science-class Commanders already).
 * Both resolutions are verified against the real roster by a
 * dedicated test.
 */
import type { CommanderDef } from "../commanders/commanderData";

export const SHIP_DEFAULT_NAME = "A.S.V. Afterlight";
export const SHIP_NAME_MEANING = "Atlas Survival Vessel";

export const SHIP_SECTIONS = [
  "Bridge",
  "Observation Deck",
  "Engineering",
  "Forge",
  "Laboratory",
  "Medical Wing",
  "Hydroponics",
  "Museum",
  "Living Quarters",
  "Hangar",
  "Training Hall",
  "Simulation Chamber",
  "Communications",
  "Diplomatic Hall",
  "Captain's Office",
  "Archive Library",
  "Founder's Wing",
  "Memorial Garden",
  "Companion Habitat",
  "Expedition Lounge",
] as const;
export type ShipSection = (typeof SHIP_SECTIONS)[number];

export const SHIP_UPGRADE_CATEGORIES = [
  "Power Grid",
  "Living Quarters",
  "Engineering",
  "Research",
  "Communications",
  "Hangar",
  "Museum",
  "Observation Dome",
  "Hydroponics",
  "Security",
] as const;
export type ShipUpgradeCategory = (typeof SHIP_UPGRADE_CATEGORIES)[number];
export const SHIP_UPGRADE_MAX_LEVEL = 5;

export const DAILY_LIFE_ACTIVITIES = [
  "Sleep",
  "Eat",
  "Exercise",
  "Read",
  "Repair equipment",
  "Talk",
  "Train",
  "Relax",
  "Watch stars",
  "Celebrate holidays",
  "React to news",
] as const;
export type DailyLifeActivity = (typeof DAILY_LIFE_ACTIVITIES)[number];

export const SHIP_DYNAMIC_EVENTS = [
  "Birthday celebrations",
  "Movie nights",
  "Founders Day",
  "Meteor showers",
  "Power failures",
  "Research breakthroughs",
  "Unexpected visitors",
  "Pets escaping",
  "Commander jokes",
  "Music performances",
] as const;
export type ShipDynamicEvent = (typeof SHIP_DYNAMIC_EVENTS)[number];

export const PLAYER_INTERACTIONS = [
  "Sit anywhere",
  "Read books",
  "Play tabletop games",
  "Cook",
  "Drink coffee",
  "Watch stars",
  "Feed companions",
  "Listen to music",
  "Decorate rooms",
  "Collect souvenirs",
] as const;
export type PlayerInteraction = (typeof PLAYER_INTERACTIONS)[number];

export const SHIP_AUDIO_LAYERS = [
  "Ship ambience",
  "Crew chatter",
  "Footsteps",
  "Distant engines",
  "Soft announcements",
  "Dynamic soundtrack",
  "Night ambience",
] as const;
export type ShipAudioLayer = (typeof SHIP_AUDIO_LAYERS)[number];

export const SHIP_SEASONAL_EVENTS = [
  "Founders Day",
  "Winter celebrations",
  "Spring renewal",
  "Museum anniversaries",
  "Commander birthdays",
] as const;
export type ShipSeasonalEvent = (typeof SHIP_SEASONAL_EVENTS)[number];

export const PLAYER_ROOM_DISPLAY_CATEGORIES = [
  "Weapons",
  "Armour",
  "Museum rewards",
  "Commander gifts",
  "Photos",
  "Aquarium",
  "Plants",
  "Achievements",
  "Pet interactions",
] as const;
export type PlayerRoomDisplayCategory = (typeof PLAYER_ROOM_DISPLAY_CATEGORIES)[number];

export const MEMORIAL_GARDEN_ENTRY_KINDS = [
  "Major sacrifices",
  "Historic events",
  "Legendary discoveries",
  "Player achievements",
  "Optional fallen companions",
] as const;
export type MemorialGardenEntryKind = (typeof MEMORIAL_GARDEN_ENTRY_KINDS)[number];

export const BRIDGE_FUNCTIONS = [
  "Mission Selection",
  "Galaxy Map",
  "Commander Assignments",
  "Fleet Overview",
  "Expedition Reports",
  "Planet Status",
  "World Restoration",
] as const;
export type BridgeFunction = (typeof BRIDGE_FUNCTIONS)[number];

/** Cassia Thorne, Elias Ryker, Caelus Nova, Nova Iskander, Xanthe Oris. */
export const ENGINEERING_BAY_COMMANDER_IDS = [
  "thorne-starforged",
  "ryker-engineer",
  "nova-architect",
  "iskander-swarmmaster",
  "oris-nanoforge",
] as const;

/** Lyra Voss, Seraphina Cael, Mira Syn, Sora Helix. */
export const LABORATORY_COMMANDER_IDS = [
  "voss-pathfinder",
  "cael-weaver",
  "syn-bioforge",
  "helix-alchemist",
] as const;

export interface ShipUpgradeState {
  category: ShipUpgradeCategory;
  level: number;
  maxLevel: number;
}

export const INITIAL_SHIP_UPGRADES: readonly ShipUpgradeState[] = SHIP_UPGRADE_CATEGORIES.map((category) => ({
  category,
  level: 0,
  maxLevel: SHIP_UPGRADE_MAX_LEVEL,
}));

export interface CommanderRoomDef {
  commanderId: string;
  roomId: string;
  journalId: string;
  personalBelongingIds: readonly string[];
}

/** Every roster Commander (foundation + individually-specified alike) gets a real room. */
export function commanderRoomsFor(roster: readonly CommanderDef[]): readonly CommanderRoomDef[] {
  return roster.map((commander) => ({
    commanderId: commander.id,
    roomId: `${commander.id}:room`,
    journalId: `${commander.id}:room-journal`,
    personalBelongingIds: [`${commander.id}:room-belonging-1`, `${commander.id}:room-belonging-2`, `${commander.id}:room-belonging-3`],
  }));
}

export interface PlayerRoomDef {
  displayCategories: readonly PlayerRoomDisplayCategory[];
}

export const PLAYER_ROOM: PlayerRoomDef = {
  displayCategories: PLAYER_ROOM_DISPLAY_CATEGORIES,
};

export interface CompanionHabitatEntry {
  id: string;
  species: string;
  name: string;
  mood: string;
}
