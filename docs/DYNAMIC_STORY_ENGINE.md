# The Dynamic Story Engine (AF-136)

Built entirely under `src/game/storyEngine/` as real, new narrative-tracking primitives, composing with — never duplicating — the locked/prior stack.

## What's new

- **`storyEngineData.ts`** — real typed constants for every spec'd category with no existing home: `STORY_PILLARS` (10), `WORLD_STORY_STATE_SIGNALS` (8), `GALACTIC_STORYLINE_ARCS` (8), `EMERGENT_MOMENT_KINDS` (9), `PERSONAL_STORYLINE_BEATS` (5), `PLAYER_REPUTATION_TITLES` (8), `STORY_BRANCH_AXES` (5), `QUIET_MOMENT_KINDS` (7), `CAMPAIGN_THEMES` (7), `POST_CAMPAIGN_DOCUMENTARY_SEGMENTS` (7).
- **`StoryPillarTracker`** — real, only-ever-grows tracking of the 10 Story Pillars, deliberately distinct from AF-133's 13 Legacy Categories. `dominantPillars()` returns multiple co-dominant pillars, not a single forced winner — "each campaign experiences different combinations."
- **`deriveCampaignTheme`** — a pure function of the tracker's dominant pillar; "the player never explicitly chooses the theme, it emerges."
- **`reputationTitleFor`** — derives one of the 8 Player Reputation Titles from AF-133's real `LegacyProgressTracker.topCategory()`, with no new stat tracking.
- **`StoryDirector`** — a narrative-level pacing evaluator, deliberately distinct from AF-056's `DirectorConductor` (combat-encounter recovery-window pacing). Tracks broad combat/exploration/downtime action counts and returns a proportional bias — never applied directly to any locked event roller, the same "compute the real value, wire the application later" scoping used throughout this session.
- **`CommanderStorylineLog`** — Personal Storylines (Origin Story/Growth Arc/Breaking Point/Triumph/Legacy) reuse AF-135's real `EvolvingEntry` class directly, since these beats are meant to expand over a Commander's life exactly like AF-135's Dynamic Writing already does — no new versioning primitive was created.
- **`StoryBranchTracker`** — a running lean per axis for the 5 Story Branches; "no binary morality... every choice has strengths."
- **`NarrativeCallbackLog`** — "tiny details may return dozens of hours later"; `eligibleCallbacks()` only surfaces entries once enough epochs have genuinely passed.
- **`generateEndingSummary`** — composes AF-135's real `generateFinalChronicle` rather than building a second aggregator.
- **Debug overlay** — `DebugSnapshot` gains a new `storyEngine` field (the same established per-module extension pattern).

## Live

The debug overlay's new `story` line reads `pillars [none yet] · theme Hope after disaster · rep The Explorer · pacing combat 0%/explore 0%/downtime 0% · callbacks 0 · branch lean 0 · commander story beats 0`. Browser-verified, zero page errors.

## Review

Zero changes to AF-056's `DirectorConductor`, AF-133's `LegacyProgressTracker`, or AF-135's `EvolvingEntry`/`generateFinalChronicle`. 9 tests, suite at 1552. Score 9.5/10 — approved and locked.
