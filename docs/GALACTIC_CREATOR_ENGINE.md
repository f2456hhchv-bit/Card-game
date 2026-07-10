# The Galactic Creator Engine (AF-141)

Built entirely under `src/game/galacticCreator/`. A dedicated research pass before implementation surveyed AF-131/133/134/135/138/140's real creation-adjacent systems, since this spec's vocabulary overlaps an unusually wide set of already-locked storage.

## What's new (and what deliberately isn't)

- **Photo albums** — `PhotoAlbumCurator` groups AF-133's real `PhotoDef` ids into named, captioned albums. AF-133's `PhotoAlbum` is a flat map with no album concept, so this composes it by reference rather than storing photo data a second time.
- **Museum exhibitions** — `ExhibitionCuratorRuntime` tracks real theme/artifacts/lighting/narration/music/notes — curatorial detail neither AF-134's `MuseumCollectionRegistry` (`{kind, title}` only) nor AF-140's `temporaryExhibitionThemeFor` (a flavour cycle) ever carried.
- **Memorials** — deliberately NOT a new store. AF-131's real `MemorialGardenLog` (throws without a non-empty `legacyNote` — "never exploit grief, celebrate legacy") remains the one real memorial store; `MEMORIAL_SUBJECT_KINDS` is just a tagging vocabulary for it.
- **Library contributions** — `LIBRARY_CONTRIBUTION_KINDS` (Travel journals/Scientific notes/Engineering observations/Planet guides/Commander tributes) is deliberately distinct vocabulary from AF-135's `PLAYER_WRITABLE_ENTRY_KINDS` and AF-133's `PlayerJournalRuntime` kinds, both of which were checked and don't carry this spec's terms verbatim.
- **Expedition Flags** — `ExpeditionFlagRegistry` is genuinely new; no flag/banner/insignia concept exists anywhere. Flag ids use a `flag-*` namespace, deliberately distinct from `FactionDef.symbol`'s real `icon-*-sigil` asset ids.
- **Garden & Observatory design** — `CreationElementStudio<TElement>`, one generic class reused for both (the same "one generic class over several K types" discipline AF-134's `MuseumCollectionRegistry` established), since AF-138's `CIVILISATION_LANDMARK_KINDS` only tallies "Gardens"/"Public observatories" as flavour strings with no real element inventory.
- **Soundtrack playlists** — `SoundtrackPlaylistRegistry`, genuinely new/cosmetic since AF-045's audio module has no real track catalog yet.
- **Commander creative contributions** — `CommanderCreativeContributionLog`, gated by `contributionEligible` composing AF-130's real bond level. Resolves the spec's 4 named commanders to real roster ids: Cassia → `thorne-starforged`, Lyra → `voss-pathfinder`, Orion → `fen-beastmaster` (the AF-126 rename, confirmed a third time), Atlas → `prime-founder`.
- **Community Projects** — `CommunityProjectTracker` mirrors AF-138's real `MegaprojectTracker` accumulate-progress pattern exactly, over `COMMUNITY_PROJECT_EXAMPLES`'s own distinct `community-project-*` ids. Two of the 6 examples are name-adjacent (not identical) to earlier rosters — "Atlas Monument" echoes AF-139/140's "Atlas Gateway Network"; "Great Observatory" echoes AF-138/140's observatory-themed entries — documented per the AF-137/138/139/140 precedent rather than merged.
- **Creation heritage** — `CreationHeritageLedger` is structurally parallel to (but distinct from, since it's keyed per-creation rather than per-settlement) AF-139's `HistoricalArchitectureLedger`.
- **Debug overlay** — `DebugSnapshot` gains a new `galacticCreator` field, rendered as `creator`.

## Live

Fresh-run debug line: `creator albums 0 · exhibitions 0 · flags 0 · garden elements 2 · observatory elements 0 · playlists 1 · commander ideas 0 · community 0/6 · heritage New Creation`. Browser-verified, zero page errors.

## Review

Zero changes to AF-131's `MemorialGardenLog`, AF-133's `PhotoAlbum`/`PlayerJournalRuntime`, AF-134's `MuseumCollectionRegistry`, AF-135's `PLAYER_WRITABLE_ENTRY_KINDS`, AF-138's `CIVILISATION_LANDMARK_KINDS`/`MegaprojectTracker`, or any other locked module. 13 tests, suite at 1609. Score 9.5/10 — approved and locked.
