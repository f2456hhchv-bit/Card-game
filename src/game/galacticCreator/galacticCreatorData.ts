/**
 * The Galactic Creator Engine (AF-141). A dedicated research pass before
 * implementation surveyed AF-131/133/134/135/138/140's real creation-
 * adjacent systems, since this spec's vocabulary overlaps an unusually
 * wide set of already-locked storage.
 *
 * Confirmed already real, composed rather than duplicated:
 * - Memorials: AF-131's real `MemorialGardenLog` (throws without a
 *   non-empty `legacyNote` — "never exploit grief, celebrate legacy")
 *   remains the one real memorial store; this module tags entries with
 *   `MEMORIAL_SUBJECT_KINDS` rather than building a second store.
 * - Photo captions: AF-133's real `PhotoDef` already carries a caption
 *   per photo. Genuinely new here is only the ALBUM grouping on top
 *   (`PhotoAlbumCurator`), since AF-133's `PhotoAlbum` is a flat map
 *   with no album concept.
 * - Landmarks (Statues/Gardens/Commander memorials/Public observatories):
 *   AF-138's real `CIVILISATION_LANDMARK_KINDS`/`MuseumCollectionRegistry`
 *   already tallies these as settlement-level flavour. This module adds
 *   the actual per-creation DESIGN detail (garden elements, observatory
 *   elements) that tally never carried.
 *
 * Naming-adjacency note (documented, not merged, per the AF-137/138/139/140
 * precedent — generic vocabulary overlap, no uniquely-canonical identity
 * at stake): two of this spec's 6 Community Project examples are
 * name-adjacent to earlier modules' real rosters — "Atlas Monument"
 * echoes AF-139/140's "Atlas Gateway Network"; "Great Observatory"
 * echoes AF-138's `megaproject-deep-space-telescope` and AF-140's "Deep
 * Space Observatory Ring." None are exact-string duplicates, and
 * `COMMUNITY_PROJECT_EXAMPLES` below uses distinct `community-project-*`
 * ids, never colliding with any real roster id.
 *
 * Expedition Flags are genuinely new — no flag/banner/insignia concept
 * exists anywhere; `FactionDef.symbol` (an icon-asset id, e.g.
 * `icon-crystal-dominion-sigil`) is the nearest neighbour, so this
 * module's flag ids use a distinct `flag-*` namespace. Soundtrack
 * playlists are also genuinely new/cosmetic — AF-045's audio module has
 * no real track catalog yet.
 */
export const CREATION_CATEGORIES = [
  "Architecture",
  "Ships",
  "Commander Rooms",
  "Museum Exhibits",
  "Gardens",
  "Parks",
  "Research Facilities",
  "Planet Decorations",
  "Photography",
  "Stories",
  "Music Playlists",
  "Expedition Flags",
  "Memorials",
  "Statues",
  "Educational Displays",
] as const;
export type CreationCategory = (typeof CREATION_CATEGORIES)[number];

export const SETTLEMENT_DESIGN_KINDS = ["Public parks", "Observation plazas", "Research campuses", "Memorial gardens", "Museums", "Housing districts", "Landmarks"] as const;

/** Tags for AF-131's real `MemorialGardenLog` entries — never a second
 * memorial store. */
export const MEMORIAL_SUBJECT_KINDS = ["Great expeditions", "Historic discoveries", "Commanders", "Civilisations", "Wildlife recovery", "Scientific breakthroughs"] as const;
export type MemorialSubjectKind = (typeof MEMORIAL_SUBJECT_KINDS)[number];

/** Deliberately distinct from AF-135's `PLAYER_WRITABLE_ENTRY_KINDS`
 * (Notes/Letters/Expedition journals/Memorials/Scientific observations/
 * Personal reflections) and AF-133's `PlayerJournalRuntime` kinds — this
 * spec names vocabulary neither list carries verbatim. */
export const LIBRARY_CONTRIBUTION_KINDS = ["Travel journals", "Scientific notes", "Engineering observations", "Planet guides", "Commander tributes"] as const;
export type LibraryContributionKind = (typeof LIBRARY_CONTRIBUTION_KINDS)[number];

export const GARDEN_ELEMENT_KINDS = ["Plants", "Trees", "Water", "Benches", "Walking paths", "Lighting", "Wildlife"] as const;
export type GardenElementKind = (typeof GARDEN_ELEMENT_KINDS)[number];

export const OBSERVATORY_ELEMENT_KINDS = ["Telescopes", "Exhibits", "Educational displays", "Sky projections", "School visits", "Research functions"] as const;
export type ObservatoryElementKind = (typeof OBSERVATORY_ELEMENT_KINDS)[number];

export const PLAYLIST_CONTEXT_KINDS = ["Ship", "Museum", "Gardens", "Commander rooms", "Celebrations", "Exploration"] as const;
export type PlaylistContextKind = (typeof PLAYLIST_CONTEXT_KINDS)[number];

export const FLAG_DISPLAY_LOCATION_KINDS = ["Ships", "Colonies", "Research stations", "Museum displays"] as const;
export type FlagDisplayLocationKind = (typeof FLAG_DISPLAY_LOCATION_KINDS)[number];

export interface CommunityProjectDef {
  id: string;
  name: string;
  threshold: number;
}

/** 6 real community projects, distinct `community-project-*` ids —
 * see the module doc comment's naming-adjacency note. */
export const COMMUNITY_PROJECT_EXAMPLES: readonly CommunityProjectDef[] = [
  { id: "community-project-galaxy-arboretum", name: "Galaxy Arboretum", threshold: 100 },
  { id: "community-project-atlas-monument", name: "Atlas Monument", threshold: 100 },
  { id: "community-project-planetary-museum-district", name: "Planetary Museum District", threshold: 100 },
  { id: "community-project-childrens-science-centre", name: "Children's Science Centre", threshold: 100 },
  { id: "community-project-explorer-memorial", name: "Explorer Memorial", threshold: 100 },
  { id: "community-project-great-observatory", name: "Great Observatory", threshold: 100 },
];

export const HERITAGE_STAGES = ["New Creation", "Protected Landmark", "Museum Entry", "Tourist Destination", "School Curriculum", "Historical Documentary"] as const;
export type HeritageStage = (typeof HERITAGE_STAGES)[number];

export function heritageStageFor(ageEpochs: number): HeritageStage {
  if (ageEpochs < 5) return "New Creation";
  if (ageEpochs < 15) return "Protected Landmark";
  if (ageEpochs < 30) return "Museum Entry";
  if (ageEpochs < 50) return "Tourist Destination";
  if (ageEpochs < 80) return "School Curriculum";
  return "Historical Documentary";
}

/** Confirmed real roster ids for the spec's 4 named contributing
 * Commanders (Cassia/Lyra/Orion/Atlas), including the AF-126 "Orion" →
 * Dorian Fen rename resolution, now confirmed a third time via his real
 * beastmaster identity. */
export const CREATOR_COMMANDER_DOMAINS: Readonly<Record<string, string>> = {
  "thorne-starforged": "Engineering",
  "voss-pathfinder": "Educational content",
  "fen-beastmaster": "Wildlife",
  "prime-founder": "History",
};

/** "Relationships influence collaboration" — composes AF-130's real
 * `BondNetworkRuntime` average bond level as the eligibility signal. */
export function contributionEligible(bondLevel: number): boolean {
  return bondLevel >= 2;
}

export const CREATOR_ACCESSIBILITY_SURFACES = ["Template mode", "Snap placement", "Guided design", "Colour-safe palettes", "Narration ready"] as const;
