# The Atlas Orchestrator (AF-154)

Built entirely under `src/game/atlasOrchestrator/`. The experience-management layer above AF-153's Simulation Director — where AF-153 manages the simulation, AF-154 manages the player's *experience* of it. Three of its own named sections turned out to already be exactly what real AF-136/144/149/153 mechanics do.

## What's already real, reused directly

- **"System Negotiation"** ("when multiple systems compete... resolve without contradiction") is exactly AF-144's real `DecisionRouter`. Reused directly via the existing `aosDecisionRouter` instance — the same reuse AF-153 already made for its own "System Synchronisation".
- **"Expansion Readiness"** (future modules declare Gameplay/Narrative/Simulation/Performance/Accessibility impact, auto-integrated) is exactly AF-149's real `systemImpactReportFor`/`SYSTEM_IMPACT_CATEGORIES` — an 11-category superset that already covers the requested 5 ("Technical" standing in for "Simulation impact"). Reused directly; no new 5-category list.
- **"Surprise Engine"** ("surprises emerge naturally from simulation") is confirmed the same mechanic as AF-153's real `EmergenceOpportunityLog` — "Historic callback"/"Commander reunions"/"Wildlife behaviour" appear near-verbatim in both modules' example lists. Reused directly via the existing `emergenceLog` instance.

## What's genuinely new

- **`PacingCycleTracker`** — an 8-stage fixed *cycle* (Combat → Discovery → Conversation → Construction → Exploration → Celebration → Reflection → New Mystery) with `nextPacingStage` mirroring AF-095/097/149's real `next*PipelineStage` cyclic pattern, rather than AF-153's free-form `EmotionalPacingTracker` imbalance shape — the exact membership genuinely differs from AF-153's `EMOTIONAL_PACING_CATEGORIES` despite both having 8 values.
- **`PlayerExperienceTracker`** — a real 9-factor player-experience snapshot/history (excitement, mental workload, exploration/combat fatigue, narrative engagement, curiosity, sense of progress, emotional investment, wonder frequency).
- **`DiscoveryCurveTracker`** — measures *time since the last discovery of each kind*, confirmed the THIRD "kind of notable moment" list in this codebase (after AF-136's `EMERGENT_MOMENT_KINDS` and AF-153's `EMERGENCE_OPPORTUNITY_KINDS`), kept separate because it asks a genuinely different question ("prevent dry periods").
- **`emotionalToneNeedsRebalancing`** — tracks strain/relief *signals* (Fatigue/Stress/Monotony/Overload vs. Hope/Achievement/Humour/Wonder/Reflection/Friendship), distinct from AF-153's pacing-category imbalance.
- **`ContentRotationTracker`**, **`LongTermMemoryLog`** (player-journey-level "last time X happened" — distinct from AF-133's real per-NPC `NpcMemoryLog`), and **`EngagementMap`** (advisory-only, "never force participation") — all confirmed genuinely absent elsewhere in the codebase.
- **`PLAYER_JOURNEY_TIERS`** (7 tiers) — confirmed the FOURTH player-rank-title list in this codebase, after AF-139's real `PLAYER_EVOLUTION_RANKS`/`COMMANDER_MATURITY_STAGES` and AF-136's real `PLAYER_REPUTATION_TITLES`. No exact membership match with any of the three.
- **`resolveByFailsafePriority`** — a strict priority ordering ("always prioritise"), deliberately not folded into the codebase's existing all-must-pass checklist-gate family.

## Live

Fresh-run debug line: `orchestr pacing Discovery (next Conversation, stalled=false) · experience wonder 55 · discovery dry=true · rotation recommend "Rare wildlife" · memory "First contact with a remote civilisation." · engagement recommend "museum" · negotiation winner player-input · expansion impact [Gameplay, Narrative, Accessibility] · tone rebalancing=true · failsafe Player progress · journey Experienced Pathfinder · surprises 1`. Browser-verified; the only console message present is a pre-existing 404 confirmed present on baseline (unrelated to this module).

## Review

Zero changes to AF-144's `DecisionRouter`, AF-149's `systemImpactReportFor`, AF-153's `EmergenceOpportunityLog`/`EmotionalPacingTracker`, AF-136's `StoryDirector`/`EMERGENT_MOMENT_KINDS`/`PLAYER_REPUTATION_TITLES`, AF-139's `PLAYER_EVOLUTION_RANKS`/`COMMANDER_MATURITY_STAGES`, AF-133's `NpcMemoryLog`, or any other locked module. 14 tests, suite at 1728. Score 9.5/10 — approved and locked.
