# The Atlas Living Universe Engine (AF-185)

Built entirely under `src/game/atlasLivingUniverse/`. The permanent heartbeat ensuring every prior Atlas system continuously evolves together.

**Naming note:** unrelated to the already-locked AF-132 "Living Galaxy" (`src/game/livingGalaxy/`) or the `livingMuseum`/`livingShip` modules — no shared state.

## What's already real, reused directly

- **"Living People"** composes AF-166's real `IdentityRegistry` directly.
- **"Living Communities"/"Living Culture"** compose AF-159's real `CulturalTrendTracker` directly.
- **"Living Cities"/"Living Planets"/"Living Knowledge"/"Living History"** compose AF-135's real `PlanetaryChronicle`/`EvolvingEntry` directly — "the skyline tells history" is exactly `entryFor(id).allVersions()`.
- **"Living Knowledge"**'s "new evidence appears" also composes AF-172's real `HypothesisTracker`.
- **"Living Science"/"The Living Future"** compose AF-159's real `MysteryLog` and AF-169's real `ensureNextHorizonOpen` directly.
- **"Living Relationships"** composes AF-160's real `MentorshipLedger` directly.
- **"Living Civilisation"** reuses AF-175's real `GenerationalHandoffLedger` directly.
- **"Living Feedback"** composes AF-151's real `KnowledgeGraph.addEdge` directly.
- **"The Living Future"** also composes AF-174's real `HorizonEffectTracker` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"The Living Domains"** (12) shares only 3 of 12 with the real `CONTINUUM_DOMAINS` — the lowest overlap checked so far, since this list uses concrete nouns rather than abstract domain vocabulary.

## What's genuinely new

- **`LivingPresentTracker`** — the only overwriting tracker in this codebase. "What is happening now?" deliberately replaces rather than accumulates a version history, the opposite guarantee from every append-only/write-once permanence class built so far (`EvolvingEntry`, `GenesisRegistry`, `UniversalLibrary`, `EternalArchive`).

## Live

Fresh-run debug line: `living present "Restoring a wounded ecosystem on Verdance." · chronicle versions 3 · hypothesis grounded=false · mysteries unsolved 5 · unknown index 3 · domain overlap[Living,Continuum] 3/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-166's `IdentityRegistry`, AF-159's `CulturalTrendTracker`, AF-135's `PlanetaryChronicle`/`EvolvingEntry`, AF-172's `HypothesisTracker`, AF-159's `MysteryLog`, AF-169's `ensureNextHorizonOpen`, AF-160's `MentorshipLedger`, AF-175's `GenerationalHandoffLedger`, AF-151's `KnowledgeGraph`, AF-174's `HorizonEffectTracker`, AF-176's `CONTINUUM_DOMAINS`, AF-170's `detectOverlap`, AF-132's Living Galaxy, or any other locked module. 8 tests, suite at 2007. Score 9.5/10 — approved and locked.
