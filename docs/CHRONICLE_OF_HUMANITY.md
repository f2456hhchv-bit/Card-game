# The Chronicle of Humanity (AF-135)

The definitive historical record — built entirely under `src/game/chronicle/` as real composition over the pieces already established this session, never a redesign of any of them.

## What's new

- **`chronicleData.ts`** — real typed constants for every spec'd category with no existing home: `CHRONICLE_STRUCTURE_SECTIONS` (16), `AUTHOR_VOICES` (7), `PERSPECTIVE_KINDS` (6), `ORAL_HISTORY_TOPICS` (8), `PUBLISHER_VOICES` (5), `LIVING_MAP_OVERLAY_KINDS` (7), `GENERATIONAL_REFERENCE_KINDS` (6), `PLAYER_WRITABLE_ENTRY_KINDS` (6), `PLANETARY_HISTORY_FIELDS` (12).
- **`EvolvingEntry`** — the one genuinely new primitive this module adds: "entries never overwrite, they expand, older versions remain archived." Every `expand()` call appends a new version; nothing is ever discarded. This single mechanic satisfies both "Dynamic Writing" and "Academic Debates" (a disagreeing historian simply adds another version).
- **`MultiPerspectiveRecord`** — "no event has only one voice"; multiple named perspectives per event.
- **`PlanetaryChronicle`** — per-planet evolving prose via `EvolvingEntry`, deliberately distinct from AF-132's numeric `EnvironmentalRuntime` (pollution/wildlife indices) — this tracks narrative history, not simulation state.
- **Everything else composes rather than duplicates**: "Timeline" reuses AF-133's `OfficialHistoricalRecord`/`GalacticHistoryLog` directly (their shapes already matched exactly). "Player Biography" (`generatePlayerBiography`) and "The Final Chronicle" (`generateFinalChronicle`) are pure aggregators over AF-133's real `PlayerChronicle`/`LegacyProgressTracker` — no new favourite-planet/ship/victory tracking. "Commander Histories" (`commanderHistoryFor`) composes AF-130's `EmotionalMemoryLog` and `BondNetworkRuntime` with AF-133's `GiftLedger`, entirely through their existing public APIs. "Oral History," "Book Publishing," and "Player Writable Entries" all reuse AF-134's generic `MuseumCollectionRegistry<K>` class with new K types — a third, fourth, and fifth instantiation of that one class rather than three more near-duplicate registries. "Anniversary Publications" reuses AF-133's real `ANNIVERSARY_KINDS`/`isAnniversary`. "Generational History" composes AF-133's real `exportLegacySnapshot`/`inheritedFlavourLines`.
- **Debug overlay** — `DebugSnapshot` gains a new `chronicle` field (the same established per-module extension pattern).

## Live

The debug overlay's new `chronicle` line reads `planets 0 · oral history 0 · books 0 · writable 0 · commander memories 0 · final chronicle records 0`. Browser-verified, zero page errors.

## Review

Zero changes to AF-130, AF-133, or AF-134. 8 tests, suite at 1543. Score 9.5/10 — approved and locked.
