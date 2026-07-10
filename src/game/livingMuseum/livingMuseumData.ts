/**
 * The Living Museum (AF-134). Additive over the real, locked Museum/
 * Codex system (AF-043/087/088) — `MuseumWing["kind"]` is a closed
 * 4-value union in `CodexEcosystemRuntime.ts` and is never touched
 * here; this module's 15 sections are a genuinely new, parallel
 * structure. Commander donations reuse AF-133's `GiftLedger`/
 * `PersonalGiftDef` directly ("donates items" and "presents gifts"
 * are the same real concept) rather than a duplicate donation type.
 * Commander Hall room sizing composes with AF-130's real
 * `BondNetworkRuntime` through its existing public `bondFor()` API —
 * no new method was added to that locked class.
 *
 * "Orion — Companion field journal": the same AF-126 owner-authorised
 * rename applies here as it did for AF-130's "Orion + Mira" Dual
 * Ultimate — this is Dorian Fen (canonically "Orion Vale" in the
 * verbatim spec before the CMD-007 collision rename), whose
 * companion-beastmaster identity matches "Companion field journal"
 * exactly, and independently confirms the resolution again.
 */

export const MUSEUM_SECTIONS = [
  "Origins Wing",
  "Earth Archive",
  "Collapse Gallery",
  "Atlas Initiative",
  "Commander Hall",
  "Species Archive",
  "Engineering Wing",
  "Scientific Discoveries",
  "Planet Restoration",
  "Expedition Records",
  "The Living Galaxy",
  "Companion Sanctuary",
  "The Legacy Hall",
  "Player Chronicle",
  "Hall of Tomorrow",
] as const;
export type MuseumSection = (typeof MUSEUM_SECTIONS)[number];

export const EARTH_ARCHIVE_EXHIBIT_KINDS = [
  "Old photographs",
  "Books",
  "Music",
  "Art",
  "Historical recordings",
  "Sports memorabilia",
  "Computers",
  "Vehicles",
  "Scientific instruments",
  "Daily life exhibits",
  "Small forgotten objects",
] as const;
export type EarthArchiveExhibitKind = (typeof EARTH_ARCHIVE_EXHIBIT_KINDS)[number];

export const DISCOVERY_ARTIFACT_KINDS = [
  "Ancient technology",
  "Artwork",
  "Letters",
  "Children's drawings",
  "Research notes",
  "Music recordings",
  "Lost recipes",
  "Maps",
  "Historic clothing",
  "Scientific prototypes",
] as const;
export type DiscoveryArtifactKind = (typeof DISCOVERY_ARTIFACT_KINDS)[number];

export const CURATION_OPTIONS = [
  "Display layouts",
  "Lighting",
  "Themes",
  "Temporary exhibitions",
  "Educational tours",
  "Featured artifacts",
] as const;
export type CurationOption = (typeof CURATION_OPTIONS)[number];

export const VISITOR_TYPES = [
  "Scientists",
  "Students",
  "Families",
  "Tourists",
  "Veterans",
  "Explorers",
  "Commanders",
] as const;
export type VisitorType = (typeof VISITOR_TYPES)[number];

export const INTERACTIVE_EXHIBIT_KINDS = [
  "Playable simulations",
  "Recovered holograms",
  "Restored documentaries",
  "Interactive star maps",
  "Planet rebuilding displays",
  "Engineering demonstrations",
  "Companion habitats",
  "Music rooms",
  "History timelines",
] as const;
export type InteractiveExhibitKind = (typeof INTERACTIVE_EXHIBIT_KINDS)[number];

export const RESTORATION_ARTIFACT_TYPES = [
  "Books",
  "Photographs",
  "Machines",
  "Weapons",
  "Architecture",
  "Vehicles",
  "Data archives",
  "Audio recordings",
] as const;
export type RestorationArtifactType = (typeof RESTORATION_ARTIFACT_TYPES)[number];

export const SPECIAL_EXHIBITION_KINDS = [
  "Founders Week",
  "Earth Remembered",
  "Wildlife Festival",
  "Engineering Expo",
  "Commander Retrospective",
  "Museum Anniversary",
  "Player Photography Gallery",
] as const;
export type SpecialExhibitionKind = (typeof SPECIAL_EXHIBITION_KINDS)[number];

export const THEATER_PROGRAM_KINDS = [
  "Recovered Earth films",
  "Expedition documentaries",
  "Commander interviews",
  "Historic reconstructions",
  "Player achievements",
  "Community highlights",
] as const;
export type TheaterProgramKind = (typeof THEATER_PROGRAM_KINDS)[number];

export const LIBRARY_BOOK_KINDS = [
  "Engineering manuals",
  "Scientific papers",
  "Novels",
  "Poetry",
  "Children's stories",
  "Historical biographies",
  "Planetary atlases",
] as const;
export type LibraryBookKind = (typeof LIBRARY_BOOK_KINDS)[number];

export const AUDIO_ARCHIVE_KINDS = [
  "Ancient music",
  "Radio broadcasts",
  "Voice recordings",
  "Nature sounds",
  "Expedition logs",
  "Historic speeches",
  "Commander interviews",
] as const;
export type AudioArchiveKind = (typeof AUDIO_ARCHIVE_KINDS)[number];

export const PLAYER_EXHIBIT_DISPLAY_KINDS = [
  "Armour",
  "Favourite ship",
  "Journey map",
  "Relationships",
  "Statistics",
  "Legendary discoveries",
  "Personal quotes",
  "Commander testimonials",
] as const;
export type PlayerExhibitDisplayKind = (typeof PLAYER_EXHIBIT_DISPLAY_KINDS)[number];

export const GALACTIC_IMPACT_METRICS = [
  "Research",
  "Tourism",
  "Faction relations",
  "Commander morale",
  "Scientific discoveries",
  "Historic preservation",
] as const;
export type GalacticImpactMetric = (typeof GALACTIC_IMPACT_METRICS)[number];

export interface RestorationProject {
  id: string;
  artifactType: RestorationArtifactType;
  progress: number;
}

export interface CommanderDonationSeed {
  commanderId: string;
  item: string;
}

/** The spec's five named examples, resolved to real roster ids. */
export const COMMANDER_DONATION_EXAMPLES: readonly CommanderDonationSeed[] = [
  { commanderId: "prime-founder", item: "Original Beacon" },
  { commanderId: "voss-pathfinder", item: "First research journal" },
  { commanderId: "thorne-starforged", item: "Prototype forging hammer" },
  { commanderId: "fen-beastmaster", item: "Companion field journal" },
  { commanderId: "reyes-warden", item: "Civil Defence insignia" },
];

export function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, value));
}
