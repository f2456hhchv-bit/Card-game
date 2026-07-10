## Verbatim prompt

141

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-140 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Galactic Creator Engine.

Players are no longer only explorers.

They become creators.

Builders.

Designers.

Historians.

Educators.

Artists.

The game should eventually allow players to leave permanent creations that enrich their own universe without breaking canon.

Everything created should strengthen humanity rather than undermine it.

==================================================
CORE PHILOSOPHY
==================================================

Every civilisation leaves culture behind.

The player should do the same.

Creations are not cheats.

They are contributions.

The galaxy slowly becomes shaped by generations of explorers.

==================================================
CREATION CATEGORIES
==================================================

Architecture

Ships

Commander Rooms

Museum Exhibits

Gardens

Parks

Research Facilities

Planet Decorations

Photography

Stories

Music Playlists

Expedition Flags

Memorials

Statues

Educational Displays

==================================================
SETTLEMENT DESIGN
==================================================

Late game.

Players may help design:

Public parks.

Observation plazas.

Research campuses.

Memorial gardens.

Museums.

Housing districts.

Landmarks.

Decoration never interferes with gameplay.

==================================================
PLAYER GALLERY
==================================================

Personal gallery stores:

Screenshots.

Artwork.

Favourite expeditions.

Commander portraits.

Historic moments.

Time-lapses.

Museum photography.

==================================================
CUSTOM MUSEUM EXHIBITIONS
==================================================

Players curate exhibitions.

Choose:

Theme.

Artifacts.

Lighting.

Narration.

Music.

Educational notes.

Visitors react differently.

==================================================
MEMORIAL DESIGN
==================================================

Create memorials for:

Great expeditions.

Historic discoveries.

Commanders.

Civilisations.

Wildlife recovery.

Scientific breakthroughs.

Every memorial becomes part of history.

==================================================
PHOTO STORIES
==================================================

Photos can be grouped into albums.

Examples

"The Restoration of Helios."

"My First Expedition."

"The Rise of Atlas Prime."

"The Wildlife of Eden."

Albums receive captions.

Museum visitors read them.

==================================================
EXPEDITION FLAGS
==================================================

Players create:

Colours.

Symbols.

Mottos.

History.

Flags appear on:

Ships.

Colonies.

Research stations.

Museum displays.

==================================================
LIBRARY CONTRIBUTIONS
==================================================

Players may write:

Travel journals.

Scientific notes.

Engineering observations.

Planet guides.

Commander tributes.

Future generations may reference them.

==================================================
BOTANICAL DESIGN
==================================================

Create gardens.

Select:

Plants.

Trees.

Water.

Benches.

Walking paths.

Lighting.

Wildlife.

Different planets produce unique gardens.

==================================================
OBSERVATORY DESIGN
==================================================

Players create public observatories.

Choose:

Telescopes.

Exhibits.

Educational displays.

Sky projections.

School visits.

Research functions.

==================================================
SOUNDTRACK COLLECTION
==================================================

Favourite music unlocked.

Players create playlists for:

Ship.

Museum.

Gardens.

Commander rooms.

Celebrations.

Exploration.

==================================================
PLAYER HERITAGE
==================================================

As decades pass:

Creations age.

Gardens grow.

Trees mature.

Buildings weather naturally.

Historical plaques appear.

Children visit.

Researchers reference them.

==================================================
COMMANDER PARTICIPATION
==================================================

Commanders contribute ideas.

Cassia suggests engineering.

Lyra suggests educational content.

Orion adds wildlife.

Atlas records history.

Relationships influence collaboration.

==================================================
COMMUNITY PROJECTS
==================================================

Large-scale creations include:

Galaxy Arboretum.

Atlas Monument.

Planetary Museum District.

Children's Science Centre.

Explorer Memorial.

Great Observatory.

Each requires contributions over time.

==================================================
HISTORICAL VALUE
==================================================

Older creations become:

Protected landmarks.

Museum entries.

Tourist destinations.

School curriculum.

Historical documentaries.

==================================================
ACCESSIBILITY
==================================================

Template mode.

Snap placement.

Guided design.

Colour-safe palettes.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Galactic Creator Engine.

Allow players to leave beautiful, meaningful contributions that become permanent parts of the Living Galaxy.

Everything created should celebrate exploration, knowledge and humanity's future.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of player-created worlds.

Review visual quality.

Review historical integration.

Review Commander participation.

Review museum compatibility.

Review long-term evolution.

Prevent repetitive creations.

Ensure player creativity enhances rather than fragments the Afterlight universe.

Ensure every creation eventually feels like a genuine piece of galactic history.

Repeat until players feel they are no longer simply playing in Afterlight—they are helping build its civilisation.

Only then lock AF-141.

## Foundation / AF-000–140 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138/139/140) surveyed AF-131/133/134/135/138/140's real creation-adjacent systems before any design work, since this spec's vocabulary overlaps an unusually wide set of already-locked storage. Confirmed: AF-131's real `MemorialGardenLog` (throws without a non-empty `legacyNote`) remains the one real memorial store — `MEMORIAL_SUBJECT_KINDS` only tags it, never duplicates it. AF-133's real `PhotoAlbum` is a flat map keyed by photo id with no album-grouping concept, so `PhotoAlbumCurator` composes it by reference (real photo ids) rather than storing photo data again — the genuinely new piece is only the album grouping and its caption. AF-134's real `MuseumCollectionRegistry`/AF-140's real `temporaryExhibitionThemeFor` never carried curatorial detail (theme/artifacts/lighting/narration/music/notes), so `ExhibitionCuratorRuntime` fills exactly that gap. AF-135's real `PLAYER_WRITABLE_ENTRY_KINDS` and AF-133's `PlayerJournalRuntime` kinds were both checked; this spec's "Travel journals/Scientific notes/Engineering observations/Planet guides/Commander tributes" vocabulary is confirmed genuinely distinct, so `LIBRARY_CONTRIBUTION_KINDS` is its own list rather than added cases to either. AF-138's real `CIVILISATION_LANDMARK_KINDS` only tallies "Gardens"/"Public observatories" as flavour strings with zero real element inventory, so `CreationElementStudio<TElement>` — one generic class reused for both Garden and Observatory design, the same discipline `MuseumCollectionRegistry` established — is the genuinely new territory there.

Expedition Flags are confirmed genuinely new — no flag/banner/insignia concept exists anywhere; `ExpeditionFlagRegistry` uses a `flag-*` id namespace, deliberately distinct from `FactionDef.symbol`'s real `icon-*-sigil` asset ids. Soundtrack playlists are also confirmed genuinely new/cosmetic, since AF-045's audio module has no real track catalog yet. Commander participation resolves the spec's 4 named commanders (Cassia/Lyra/Orion/Atlas) to their real roster ids — `thorne-starforged`/`voss-pathfinder`/`fen-beastmaster`/`prime-founder` — with the AF-126 "Orion" → Dorian Fen rename now confirmed a third time via his real beastmaster identity, and `contributionEligible` composes AF-130's real bond level as the collaboration-eligibility signal ("relationships influence collaboration"). `CommunityProjectTracker` mirrors AF-138's real `MegaprojectTracker` accumulate-progress pattern exactly, over `COMMUNITY_PROJECT_EXAMPLES`'s own distinct `community-project-*` ids — two of the 6 examples are name-adjacent (not identical) to earlier rosters ("Atlas Monument" echoes AF-139/140's "Atlas Gateway Network"; "Great Observatory" echoes AF-138/140's observatory-themed entries), documented per the AF-137/138/139/140 precedent for generic vocabulary overlap rather than merged. `CreationHeritageLedger` is structurally parallel to AF-139's `HistoricalArchitectureLedger` but kept as its own class since it is keyed per individual creation id, not per settlement — a genuinely different granularity, not a reusable store.

The debug overlay gains a new `galacticCreator` field on `DebugSnapshot`, rendered as `creator` — the same established extension pattern used by AF-039 through AF-140 before it. Zero changes to any other locked module (AF-000–140).

Score: 9.5/10 — approved and locked.
