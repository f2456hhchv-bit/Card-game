# The Atlas Purpose Engine (AF-162)

Built entirely under `src/game/atlasPurpose/`. Sits above AF-161's Philosophy Engine: philosophy asks why, purpose answers "what are we building toward?"

## The module's heaviest-ever overlap (kept separate anyway)

**"Purpose Domains"** (12) is confirmed the HEAVIEST vocabulary overlap yet recorded in this codebase — 8 of its 12 members are exact-string matches with AF-161's real `PHILOSOPHICAL_DOMAINS` (verified by a dedicated test), surpassing even AF-161's own 3-exact-match overlap with AF-160's `WISDOM_DIMENSIONS`. Kept separate anyway: three lists now ask three different questions over largely the same vocabulary — judgement, debate topic, and meaningful goal/vocation. **"Cultural Purpose"** is itself almost entirely a subset of this module's own `PURPOSE_DOMAINS` (5 of 6 members) — flagged as the module's own internal near-duplicate rather than silently repeated.

## What's already real, reused directly

- **"Shared Purpose"** ("every colony contributes") is confirmed the FOURTH instance of the identical mechanic in this codebase, after AF-155/156/157's real `CollaborativeProblemLog` uses — reused directly via the existing `collaborativeProblems` instance.
- **"Purpose Network"** ("purposes connect through people, history, knowledge...") is exactly the shape AF-151's real `KnowledgeGraph` already provides — composed directly via the existing `knowledgeGraph` instance.

## The module's structural resolution

- **"Player Purpose"** is deliberately LESS strict than AF-161's real `PlayerPhilosophyObserver` ("the game observes, it never labels"). The spec's own "the player's actions reveal purpose" wording licenses a `dominantPurpose()` argmax over real tallies — confirmed by a dedicated test that it returns null until at least one action has been observed, an emergent read rather than an assigned destiny.

## What's genuinely new

- **`IndividualPurposeTracker`** / **`CommanderPurposeTracker`** — mirror AF-161's real `CommanderBeliefTracker` full-history shape.
- **`LongTermMissionTracker`** — real progress tracking for "Long-term Missions" rather than reference-only flavour text.
- **`PurposeMemoryArchive`** — the FIFTH mirrored "completed work becomes a named output" archive in this codebase.

## Live

Fresh-run debug line: `purpose individual Scientist · commander legacy "Found a wildlife sanctuary." · player dominant Conservationist (stewardship? 1) · mission progress 40% complete=false · evolution rank 1 · shared contributors 2 · network neighbours 1 · memory 0`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-161's `PHILOSOPHICAL_DOMAINS`/`PlayerPhilosophyObserver`/`CommanderBeliefTracker`, AF-155's `CollaborativeProblemLog`, AF-151's `KnowledgeGraph`, AF-157/158/159/160's memory-archive classes, or any other locked module. 11 tests, suite at 1803. Score 9.5/10 — approved and locked.
