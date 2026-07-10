/**
 * The Legacy Engine (AF-133). An additive layer composing with, and
 * never duplicating, the real locked stack.
 *
 * Confirmed by research before implementation: `MetaProgression`
 * already persists a free-form `statistics: Record<string, number>`
 * map (no fixed enum, so new stat keys are safe to add); the Museum
 * already has a real `MuseumWing` concept (4 roster-based kinds) that
 * this module extends with a genuinely new, player-authored kind
 * rather than modifying the locked union; `GalacticHistoryRuntime`
 * (AF-086) already exposes a real, externally-callable `record(kind,
 * factionId, description)` — this module can forward into it via an
 * optional hook rather than re-implementing history; AF-130's
 * `EmotionalMemoryLog` already takes a free-string `kind`, so Commander
 * Memories reuses that class directly instead of duplicating it;
 * `SaveProfileManager` (AF-044) has multiple isolated profiles but no
 * inheritance between them — genuinely new territory, addressed here
 * as a pure, composable snapshot/summary layer, not a modification of
 * SaveProfileManager itself. No photo-capture system exists anywhere;
 * this module defines the real data contract a future capture pipeline
 * can plug into, not a fake screenshot mechanism.
 */

export const LEGACY_CATEGORIES = [
  "Explorer",
  "Scientist",
  "Commander",
  "Engineer",
  "Builder",
  "Diplomat",
  "Guardian",
  "Conqueror",
  "Conservationist",
  "Collector",
  "Historian",
  "Mentor",
  "Founder",
] as const;
export type LegacyCategory = (typeof LEGACY_CATEGORIES)[number];

export const PLAYER_CHRONICLE_FIELDS = [
  "Personal timeline",
  "Achievements",
  "Favourite Commander",
  "Most visited planets",
  "Most used ship",
  "Greatest victories",
  "Hardest defeats",
  "Relationships",
  "Memories",
  "Travel history",
  "Playable statistics",
] as const;
export type PlayerChronicleField = (typeof PLAYER_CHRONICLE_FIELDS)[number];

export const GALACTIC_RECORD_KINDS = [
  "Fastest expedition",
  "Highest Humanity Score",
  "Largest colony",
  "Most wildlife preserved",
  "Highest research output",
  "Best diplomacy record",
  "Biggest engineering achievement",
  "Longest uninterrupted exploration",
  "Deepest Void expedition",
] as const;
export type GalacticRecordKind = (typeof GALACTIC_RECORD_KINDS)[number];

/** "Fastest expedition" is the only lower-is-better record; every other kind is higher-is-better. */
export const GALACTIC_RECORD_DIRECTIONS: Record<GalacticRecordKind, "higher" | "lower"> = {
  "Fastest expedition": "lower",
  "Highest Humanity Score": "higher",
  "Largest colony": "higher",
  "Most wildlife preserved": "higher",
  "Highest research output": "higher",
  "Best diplomacy record": "higher",
  "Biggest engineering achievement": "higher",
  "Longest uninterrupted exploration": "higher",
  "Deepest Void expedition": "higher",
};

export const MEMORY_SYSTEM_EVENT_KINDS = [
  "Player kindness",
  "Player mistakes",
  "Broken promises",
  "Heroic rescues",
  "Scientific achievements",
  "Diplomatic decisions",
  "Infrastructure projects",
  "Wildlife conservation",
  "Museum donations",
] as const;
export type MemorySystemEventKind = (typeof MEMORY_SYSTEM_EVENT_KINDS)[number];

/** Reuses AF-130's EmotionalMemoryLog (its `kind` param is a free
 * string) rather than duplicating a new per-commander memory class. */
export const COMMANDER_MEMORY_KINDS = [
  "Favourite missions",
  "Near-death moments",
  "Funny moments",
  "Shared discoveries",
  "Major disagreements",
  "Legendary victories",
  "Personal gifts",
  "Important conversations",
] as const;
export type CommanderMemoryKind = (typeof COMMANDER_MEMORY_KINDS)[number];

export const PERSONAL_GIFT_KINDS = [
  "Books",
  "Photographs",
  "Blueprints",
  "Plants",
  "Small sculptures",
  "Historical artifacts",
  "Letters",
] as const;
export type PersonalGiftKind = (typeof PERSONAL_GIFT_KINDS)[number];

export const PLAYER_JOURNAL_ENTRY_KINDS = [
  "Discoveries",
  "Interesting conversations",
  "Rare wildlife",
  "Personal notes",
  "Planet sketches",
  "Weather",
  "Historic events",
] as const;
export type PlayerJournalEntryKind = (typeof PLAYER_JOURNAL_ENTRY_KINDS)[number];

export const PHOTO_DESTINATION_KINDS = [
  "Museum displays",
  "Commander room decorations",
  "Loading screens",
  "Historical archives",
  "Books",
  "News articles",
] as const;
export type PhotoDestinationKind = (typeof PHOTO_DESTINATION_KINDS)[number];

export const TIME_CAPSULE_CONTENT_KINDS = [
  "Messages",
  "Photos",
  "Favourite builds",
  "Commander lineup",
  "Statistics",
] as const;
export type TimeCapsuleContentKind = (typeof TIME_CAPSULE_CONTENT_KINDS)[number];

export const ANNIVERSARY_KINDS = [
  "Player's first expedition",
  "Commander recruitment anniversaries",
  "Planet restorations",
  "Historic discoveries",
  "Museum milestones",
  "Founders Day",
] as const;
export type AnniversaryKind = (typeof ANNIVERSARY_KINDS)[number];
export const ANNIVERSARY_CYCLE_EPOCHS = 12;

/** A genuinely new museum-wing kind — the player's own accumulated
 * legacy, not a roster of game objects like the four existing
 * MuseumWing kinds ("shipGalleries" etc.) already are. */
export const LEGACY_MUSEUM_DISPLAY_KINDS = [
  "Journey map",
  "Recovered relics",
  "Commander friendships",
  "Favourite equipment",
  "Legendary moments",
  "Historical interviews",
] as const;
export type LegacyMuseumDisplayKind = (typeof LEGACY_MUSEUM_DISPLAY_KINDS)[number];

export const ENDING_LEGACY_OUTPUT_KINDS = [
  "Historical documentaries",
  "Museum exhibitions",
  "Commander interviews",
  "Planetary celebrations",
  "Historical textbooks",
  "Galaxy-wide memorials",
] as const;
export type EndingLegacyOutputKind = (typeof ENDING_LEGACY_OUTPUT_KINDS)[number];

export interface OfficialHistoricalRecord {
  id: string;
  title: string;
  epoch: number;
  planetId: string | null;
  commanderIds: readonly string[];
  description: string;
  hasPhoto: boolean;
  hasDialogue: boolean;
  hasNewsCoverage: boolean;
  hasMuseumEntry: boolean;
}

export interface PersonalGiftDef {
  id: string;
  kind: PersonalGiftKind;
  commanderId: string;
  museumDescription: string;
}

export interface JournalEntryDef {
  kind: PlayerJournalEntryKind;
  text: string;
  sequence: number;
}

export interface PhotoDef {
  id: string;
  caption: string;
  destinationKinds: readonly PhotoDestinationKind[];
}

export interface TimeCapsuleDef {
  id: string;
  createdAtEpoch: number;
  contentKinds: readonly TimeCapsuleContentKind[];
  message: string;
}

export interface LegacyMuseumWing {
  displayKind: LegacyMuseumDisplayKind;
  items: readonly string[];
}
