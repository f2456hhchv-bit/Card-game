# The Atlas Evolution Engine (AF-186)

Built entirely under `src/game/atlasEvolution/`. Ensures everything grows for a reason.

**Naming note:** this module's name collides directly with the already-locked AF-139 "Evolution Engine" (`src/game/evolutionEngine/`). AF-186 is distinct, lives in its own directory, and composes AF-139's real classes directly wherever they already cover the same ground.

## What's already real, reused directly

- **"Species Evolution"** reuses AF-139's real `SpeciesAdaptationRegistry` directly.
- **"City Evolution"** reuses AF-139's real `HistoricalArchitectureLedger` directly.
- **"Cultural Evolution"**'s "Language" reuses AF-139's real `LanguageEvolutionLog` directly; the broader section composes AF-159's real `CulturalTrendTracker`.
- **"Commander Evolution"** reuses AF-139's real `commanderMaturityScore`/`commanderMaturityStageFor` directly.
- **"Technological Evolution"** reuses AF-139's real `technologyEraFor`/`TECHNOLOGY_ERAS` directly.
- **"Personal Evolution"** composes AF-166's real `IdentityRegistry` directly.
- **"Institutional Evolution"** composes AF-165's real `InstitutionalMemoryTracker` directly.
- **"Scientific Evolution"** composes AF-172's real `HypothesisTracker` directly.
- **"Educational Evolution"** composes AF-160's real `MentorshipLedger` directly.
- **"Civilisational Evolution"** reuses AF-175's real `GenerationalHandoffLedger` directly.
- **"The Evolution Chain"** is driven directly by AF-155's real generic `CyclicStageTracker<TStage>`.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Evolution Domains"** shares ZERO exact-string members with AF-139's real `EVOLUTION_PILLARS`, despite obvious conceptual overlap — different word forms (nouns vs. adjectives).
- **"Species Evolution Examples"** shares 3 of 7 with AF-139's real `SPECIES_ADAPTATION_TRIGGER_KINDS`.

## What's genuinely new

- **`EvolutionRecord`** — the first tracker in this codebase whose current state can legitimately regress to an earlier value (Adopted → Abandoned → Restored), while remaining a fully honest, traceable append-only history. Every transition requires an explicit reason; nothing is ever removed.

## Live

Fresh-run debug line (rendered as `atlasEvo` to avoid colliding with AF-139's own pre-existing `evolution` debug line): `atlasEvo species adaptations 1 · architecture layers 1 · phrase "May your dawn find the wild kind." · chain Observation (next Observation) · practice state Adopted · domain overlap[Evolution,Pillars] 0/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-139's `SpeciesAdaptationRegistry`/`HistoricalArchitectureLedger`/`LanguageEvolutionLog`/`commanderMaturityScore`/`technologyEraFor`/`EVOLUTION_PILLARS`, AF-166's `IdentityRegistry`, AF-165's `InstitutionalMemoryTracker`, AF-172's `HypothesisTracker`, AF-160's `MentorshipLedger`, AF-175's `GenerationalHandoffLedger`, AF-159's `CulturalTrendTracker`, AF-155's `CyclicStageTracker`, AF-170's `detectOverlap`, or any other locked module. 9 tests, suite at 2016. Score 9.5/10 — approved and locked.
