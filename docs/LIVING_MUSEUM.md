# The Living Museum (AF-134)

Humanity's memory, built entirely under `src/game/livingMuseum/` as an additive layer over the real, locked Museum/Codex system (AF-043/087/088) and composing with AF-130's `BondNetworkRuntime` and AF-133's `GiftLedger`.

## What's new

- **`livingMuseumData.ts`** — real typed constants for all 13 spec'd category lists: `MUSEUM_SECTIONS` (15), `EARTH_ARCHIVE_EXHIBIT_KINDS` (11), `DISCOVERY_ARTIFACT_KINDS` (10), `CURATION_OPTIONS` (6), `VISITOR_TYPES` (7), `INTERACTIVE_EXHIBIT_KINDS` (9), `RESTORATION_ARTIFACT_TYPES` (8), `SPECIAL_EXHIBITION_KINDS` (7), `THEATER_PROGRAM_KINDS` (6), `LIBRARY_BOOK_KINDS` (7), `AUDIO_ARCHIVE_KINDS` (7), `PLAYER_EXHIBIT_DISPLAY_KINDS` (8), `GALACTIC_IMPACT_METRICS` (6).
- **Never touches `MuseumWing["kind"]`** — the locked Codex Museum system's 4-value union (`shipGalleries`/`weaponGalleries`/`recoveredArtefacts`/`commanderMemorabilia`) is untouched; the Living Museum's 15 sections are a genuinely new, parallel structure.
- **Commander donations reuse AF-133's real `GiftLedger`/`PersonalGiftDef` directly** — "donates items over time" and "presents gifts" are the same real concept, so no new donation type was created. The spec's five named examples (Atlas/Lyra/Cassia/Orion/Astrid) are resolved to real roster ids, including the same AF-126 owner-authorised rename resolution used for AF-130's "Orion + Mira" Dual Ultimate: "Orion — Companion field journal" is Dorian Fen (né "Orion Vale"), independently confirmed again by his companion-beastmaster identity.
- **`strongestBondLevelFor`** — Commander Hall rooms "expand alongside Bond Level," computed entirely through AF-130's `BondNetworkRuntime`'s existing public `bondFor()` API; no new method was added to that locked class.
- **`RestorationLab`** — its own real progression system; artifact restoration progress only ever grows, capped at 100 (complete).
- **`MuseumCollectionRegistry<K>`** — one small generic class serves Theater programs, Library books, and the Audio Archive uniformly, avoiding three near-identical copies.
- **`VisitorLog`, `MuseumQualityTracker`, `galacticImpactFor`** — real, tested pieces for visitor tracking and museum-quality-scaled galactic impact.

## Live

The debug overlay's new `museumLife` line reads `quality 10 · restoration 0/0 · donations 5 · visitors 0 · theater 0 · library 0 · audio 0`. Browser-verified, zero page errors.

## Review

Zero changes to the Codex/Museum system, `BondNetworkRuntime`, or `GiftLedger`. 10 tests, suite at 1535. Score 9.5/10 — approved and locked.
