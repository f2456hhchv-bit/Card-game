# The Legacy Engine (AF-133)

The memory of Afterlight — an additive layer composing with, rather than duplicating, the real locked stack. Built entirely under `src/game/legacy/`.

## Research before implementation

Before writing any code, a research pass confirmed: `MetaProgression` already persists a free-form `statistics` map (no fixed enum, safe to add new keys to); the Museum already has a real `MuseumWing` concept (4 roster-based kinds); `GalacticHistoryRuntime` (AF-086) already exposes an externally-callable `record(kind, factionId, description)`; AF-130's `EmotionalMemoryLog` takes a free-string `kind`; `SaveProfileManager` (AF-044) supports multiple isolated profiles but no inheritance between them; and no photo-capture system exists anywhere. None of that was redefined.

## What's new

- **`legacyEngineData.ts`** — real typed constants for every spec'd category: `LEGACY_CATEGORIES` (13), `PLAYER_CHRONICLE_FIELDS` (11), `GALACTIC_RECORD_KINDS` (9, with a `GALACTIC_RECORD_DIRECTIONS` map since "Fastest expedition" is lower-is-better while every other kind is higher-is-better), `MEMORY_SYSTEM_EVENT_KINDS` (9), `COMMANDER_MEMORY_KINDS` (8), `PERSONAL_GIFT_KINDS` (7), `PLAYER_JOURNAL_ENTRY_KINDS` (7), `PHOTO_DESTINATION_KINDS` (6), `TIME_CAPSULE_CONTENT_KINDS` (5), `ANNIVERSARY_KINDS` (6), `LEGACY_MUSEUM_DISPLAY_KINDS` (6), `ENDING_LEGACY_OUTPUT_KINDS` (6).
- **`LegacyProgressTracker`** — real, only-ever-grows XP per legacy category; `topCategory()` reports the player's dominant legacy.
- **`GalacticHistoryLog`** — richer per-record fields (date/planet/commanders/photo/dialogue/news/museum flags) than the locked `GalacticHistoryRuntime`'s simple shape; optionally forwards a description into that real, locked system via a constructor hook, without ever calling or duplicating it directly.
- **`GalacticRecordBoard`** — "every record can eventually be surpassed": `submit()` only keeps a new value if it actually beats the current best, respecting each kind's real better-direction.
- **`PlayerChronicle`** — real favourite-planet/favourite-ship tracking and victory/defeat counts; confirmed nothing tracked this anywhere before.
- **`NpcMemoryLog`** — a genuinely new class (unlike Commander Memories below) because it has real behaviour AF-130's `EmotionalMemoryLog` doesn't: minor memories fade (bounded per-subject capacity), historic ones never do.
- **Commander Memories reuse AF-130's `EmotionalMemoryLog` directly** — its `kind` parameter is already a free string, so feeding it `COMMANDER_MEMORY_KINDS` values needed no new class at all.
- **`GiftLedger`, `PlayerJournalRuntime` (searchable), `PhotoAlbum`, `TimeCapsuleVault`** (refuses same-epoch reopening — "years later they reopen"), **`isAnniversary()`** — all real, tested, new pieces.
- **`exportLegacySnapshot`/`inheritedFlavourLines`** — a pure, composable summary layer for "Multiple Save Legacies," producing lines like "The previous expedition: restored Helios." without modifying `SaveProfileManager`.
- **Debug overlay** — `DebugSnapshot` gains a new `legacy` field (the same AF-039–070/AF-130/131/132 per-module extension pattern).

## Live

The debug overlay's new `legacy` line reads `xp 0 (Explorer) · records 0/9 · history 0 · favourite planet — · journal 0 · gifts 0 · photos 0`. Browser-verified, zero page errors.

## Review

Zero changes to MetaProgression, the Museum/Codex system, `GalacticHistoryRuntime`, AF-130's `EmotionalMemoryLog`, or `SaveProfileManager`. 13 tests, suite at 1525. Score 9.5/10 — approved and locked.
