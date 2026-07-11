# The Atlas Possibility Engine (AF-194)

Built entirely under `src/game/atlasOpenPossibility/`.

**⚠ NAMING COLLISION (critical, first of its kind):** this module's title is a VERBATIM duplicate of AF-159's own real, already-locked "Atlas Possibility Engine" (`src/game/atlasPossibility/`). Every prior collision this session shared only a word inside a differently-worded title; this is the first full exact-title duplicate. Disambiguated throughout as "(AF-194)" vs AF-159's "(AF-159)." See `docs/modules/AF-194-atlas-possibility-engine.md` for the full note.

## What's already real, reused directly

- **"The Possibility Web"** is exactly AF-159's real `PossibilityRegistry`/`Possibility` interface.
- **"The Unknown Reserve"** reuses AF-159's real `MysteryLog` directly.
- **"Player Possibility"** reuses AF-159's real `PlayerInspirationLog` directly.
- **"The Open Door Principle"** is exactly AF-169's real `ensureNextHorizonOpen` directly.
- **"Possibility Through Cooperation"** reuses AF-155's real `CollaborativeProblemLog` directly.
- **"Civilisational Possibility"** composes AF-151's real `KnowledgeGraph.suggestConnections` directly.

All confirmed by dedicated tests.

## Overlap (documented honestly with AF-170's own `detectOverlap`)

- **"Possibility Domains"** (12): 11/12 vs AF-193's real `EXCELLENCE_DOMAINS` (ties but does not break AF-191's own 12/12 record); only 2/12 vs AF-159's own real `DISCOVERY_CATEGORIES`.
- **"The Possibility Cycle"**: 2/8 vs AF-191's real `CREATION_CYCLE_STAGES`; zero vs either AF-192's or AF-193's own sibling cycle.
- **"The Possibility Index"**: zero exact categories vs AF-193's real `EXCELLENCE_INDEX_CATEGORIES`.

## What's genuinely new

- **`possibilityCycleRank`** — an ordered, non-cyclic rank lookup (the cycle's final stage, "New Possibilities," is never a repeat of its first stage by name).
- **`PossibilityIndexScoreCard`** — the twelfth mirrored scoring-rubric shape, same 9.5 gate.

## Live

Fresh-run debug line: `openDoor web required people 1 · mysteries unsolved 7 · inspiration surfaced 1 · collaborators 2 · network neighbours 1 · cycle rank 5 · index score 9.6 (passed) · domain overlap[Possibility,Excellence] 11/12`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-151's `KnowledgeGraph`, AF-155's `CollaborativeProblemLog`, AF-159's `PossibilityRegistry`/`MysteryLog`/`PlayerInspirationLog`, AF-169's `ensureNextHorizonOpen`, AF-170's `detectOverlap`, AF-191's `CREATION_CYCLE_STAGES`, AF-192's `CRAFT_CYCLE_STAGES`, AF-193's `EXCELLENCE_DOMAINS`/`EXCELLENCE_CYCLE_STAGES`/`EXCELLENCE_INDEX_CATEGORIES`, or any other locked module. 10 tests, suite at 2090. Score 9.5/10 — approved and locked.
