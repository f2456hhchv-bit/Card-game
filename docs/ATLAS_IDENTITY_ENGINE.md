# The Atlas Identity Engine (AF-167)

Built entirely under `src/game/atlasIdentity/`. Exists above AF-166's Consciousness Engine: consciousness defines who someone believes they are (internal), identity defines how they exist within the wider universe (external, earned by others' recognition — "never assigned").

## What's already real, reused directly

- **"Personal Identity"** (9 externally-visible signature traits) reuses AF-163's real generic `MeaningCurator<TCategory>` DIRECTLY over a new `SignatureTraitKind` type parameter — that class was already written as a reusable generic (unlike AF-160's hand-typed `CommanderWisdomTracker`), so no mirrored duplicate class was needed.
- **"Cultural Identity"** reuses AF-159's real `CulturalTrendTracker` directly.
- **"Symbolism"** composes AF-163's real `SignificanceTracker` directly for reinforcement, distinct from this module's own `SYMBOLISM_CATEGORIES` (symbol KINDS: flags/colours/mottos) which shares no members with AF-163's real `SYMBOL_EXAMPLES` (specific artifact instances).

## The module's unifying generalization

**"Commander Identity"** ("the galaxy recognises these qualities") and **"Institutional Identity"** ("each develops its own reputation") both describe the same underlying mechanic — others recognising a quality over time, a fundamentally different axis from AF-160's real `CommanderWisdomTracker` and AF-166's real `PersonalGrowthTracker` (both internal growth). One generic `ReputationTracker` serves both, confirmed by a dedicated test exercising it against both a Commander id and an institution id.

## What's genuinely new

- **`EarnedTitleTracker`** — "the city that rebuilt the oceans"... "identity becomes history." Append-only: a title, once earned, is never replaced or curated away, distinct from AF-135's Chronicle (records what happened) and AF-163's `MeaningCurator` (curates a single favourite per category).

## The module's structural resolutions

- **"Identity Layers"** (10, personal→galactic scale) is confirmed a genuinely different axis from AF-166's real `CULTURAL_IDENTITY_LAYERS` (6, what a citizen identifies WITH).
- **"Professional Identity"** shares 4 exact-string members with AF-162's real `INDIVIDUAL_PURPOSE_KINDS`, kept as reference vocabulary.

## Live

Fresh-run debug line: `identity signature ""The wild remembers kindness."" · reputation Mentorship (2) · titles 1 · cultural adopters 1 · symbol significance 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-163's `MeaningCurator`/`SignificanceTracker`, AF-159's `CulturalTrendTracker`, AF-160's `CommanderWisdomTracker`, AF-166's `PersonalGrowthTracker`/`CULTURAL_IDENTITY_LAYERS`, AF-162's `INDIVIDUAL_PURPOSE_KINDS`, or any other locked module. 9 tests, suite at 1854. Score 9.5/10 — approved and locked.
