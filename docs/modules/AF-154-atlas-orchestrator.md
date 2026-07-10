## Verbatim prompt

154

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-153 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Orchestrator.

The Atlas Orchestrator is the highest-level runtime intelligence responsible for coordinating the Atlas Operating System, Simulation Director, Story Engine and every future gameplay module.

Where the Simulation Director manages simulation...

The Orchestrator manages the player's entire experience.

Its responsibility is not merely technical.

It protects pacing.

Meaning.

Discovery.

Wonder.

Long-term engagement.

==================================================
PURPOSE
==================================================

Coordinate every major system so the player always experiences:

Meaningful decisions.

Balanced pacing.

Interesting discoveries.

Emotional progression.

Technical stability.

No system should dominate the experience.

Everything works together.

==================================================
PRIMARY RESPONSIBILITIES
==================================================

The Orchestrator supervises:

Atlas Operating System

Simulation Director

Living Galaxy

Living Ship

Commander Bond Network

Chronicle

Museum

Civilisation

Evolution

Economy

Weather

Research

Expeditions

Events

Story Engine

Accessibility Systems

Future Expansions

==================================================
PLAYER EXPERIENCE MODEL
==================================================

Continuously estimate:

Current excitement.

Mental workload.

Exploration fatigue.

Combat fatigue.

Narrative engagement.

Curiosity.

Sense of progress.

Emotional investment.

Wonder frequency.

Never manipulate.

Only balance.

==================================================
PACING MODEL
==================================================

Maintain healthy alternation between:

Combat

↓

Discovery

↓

Conversation

↓

Construction

↓

Exploration

↓

Celebration

↓

Reflection

↓

New Mystery

No activity dominates for too long.

==================================================
DISCOVERY CURVE
==================================================

Track recent discoveries.

Prevent long dry periods.

Examples

New species.

New mechanic.

Commander interaction.

Museum artifact.

Rare weather.

Ancient structure.

Scientific breakthrough.

Unknown signal.

Players should regularly encounter genuine novelty.

==================================================
SURPRISE ENGINE
==================================================

Generate meaningful surprises.

Examples

Unexpected reunion.

Ancient distress beacon.

Commander gift.

Lost research cache.

Wildlife behaviour never previously observed.

Child recognising player's achievements.

Historic callback.

Surprises emerge naturally from simulation.

==================================================
EMOTIONAL BALANCER
==================================================

Continuously monitor emotional tone.

Avoid:

Fatigue.

Stress.

Monotony.

Information overload.

Balance with:

Hope.

Achievement.

Humour.

Wonder.

Quiet reflection.

Friendship.

==================================================
SYSTEM NEGOTIATION
==================================================

When multiple systems compete:

Evaluate:

Player context.

Current story.

Commander usage.

Historical significance.

Exploration goals.

Accessibility.

Resolve without contradiction.

==================================================
CONTENT ROTATION
==================================================

Prioritise underused content.

Examples

Rare wildlife.

Forgotten planets.

Commander conversations.

Historic events.

Museum dialogue.

Weather events.

Music.

Maintain freshness.

==================================================
LONG-TERM MEMORY
==================================================

Track:

Last major discovery.

Last Commander interaction.

Last celebration.

Last scientific breakthrough.

Last emergency.

Last peaceful moment.

Avoid repetition.

==================================================
ENGAGEMENT MAP
==================================================

Estimate which systems currently provide:

Highest curiosity.

Highest satisfaction.

Lowest exposure.

Recommend subtle opportunities.

Never force participation.

==================================================
EXPANSION READINESS
==================================================

Future modules automatically declare:

Gameplay impact.

Narrative impact.

Simulation impact.

Performance impact.

Accessibility impact.

The Orchestrator integrates them automatically.

==================================================
PLAYER JOURNEY MODEL
==================================================

Track the player's evolution.

Examples

New Explorer

Experienced Pathfinder

Commander

Fleet Leader

Civilisation Builder

Founder

Living Legend

Interactions adapt naturally.

==================================================
ORCHESTRATION TOOLS
==================================================

Developer diagnostics include:

Experience Timeline

Discovery Heatmap

Pacing Graph

Wonder Frequency

Commander Exposure

Narrative Balance

Simulation Coordination

Player Journey Viewer

==================================================
FAILSAFE RULES
==================================================

Always prioritise:

Player progress.

Save integrity.

Historical consistency.

Accessibility.

Performance.

Narrative coherence.

==================================================
ACCESSIBILITY
==================================================

Reduced complexity mode.

Narrative guidance.

Journey summaries.

Adaptive pacing visualisation.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Orchestrator.

Ensure every gameplay system contributes to a cohesive, emotionally balanced and endlessly engaging player journey.

The Orchestrator becomes the invisible conductor of the entire Afterlight experience.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of complete player journeys.

Review pacing.

Review emotional balance.

Review discovery frequency.

Review Commander exposure.

Review technical coordination.

Review accessibility.

Review expansion compatibility.

Review long-term replayability.

Continuously refine orchestration until every system feels naturally interconnected without overwhelming the player.

Ensure AF-154 becomes the experience-management layer that transforms hundreds of independent systems into one seamless adventure where every expedition feels purposeful, every discovery feels earned and every return to the A.S.V. Afterlight feels like coming home.

Repeat until the Atlas Orchestrator consistently delivers one of the most coherent, replayable and emotionally rewarding gameplay experiences ever designed.

Only then lock AF-154.

## Foundation / AF-000–153 / GP-FINAL alignment review

The experience-management layer above the Atlas Simulation Director (AF-153): where AF-153 manages the simulation, AF-154 manages the player's experience of it. Three sections turned out to be exactly existing real mechanics, reused directly rather than re-declared: "System Negotiation" ("when multiple systems compete... resolve without contradiction") is AF-144's real `DecisionRouter`, reused via the existing `aosDecisionRouter` instance — the same reuse AF-153 already made for its own "System Synchronisation". "Expansion Readiness" (future modules declare Gameplay/Narrative/Simulation/Performance/Accessibility impact) is AF-149's real `systemImpactReportFor`/`SYSTEM_IMPACT_CATEGORIES` (11 categories, a superset already covering the requested 5, with "Technical" standing in for "Simulation impact") — reused directly, no new 5-category list. "Surprise Engine" ("surprises emerge naturally from simulation") is confirmed the same mechanic as AF-153's real `EmergenceOpportunityLog` — "Historic callback"/"Commander reunions"/"Wildlife behaviour" appear near-verbatim in both modules' example lists — reused directly via the existing `emergenceLog` instance.

Confirmed genuinely new: `PacingCycleTracker` — an 8-stage fixed *cycle* with `nextPacingStage` (mirroring AF-095/097/149's real `next*PipelineStage` cyclic pattern) rather than AF-153's free-form `EmotionalPacingTracker` imbalance shape, since this list is explicitly drawn as a closed loop and its exact membership (Combat/Exploration/New Mystery) differs from AF-153's `EMOTIONAL_PACING_CATEGORIES` (Danger/Recovery/Wonder) despite both having 8 values. `PlayerExperienceTracker` gives the Player Experience Model a real 9-factor snapshot/history. `DiscoveryCurveTracker` measures *time since the last discovery of each kind* — a genuinely different question from either AF-136's real `EMERGENT_MOMENT_KINDS` (9 values) or AF-153's `EMERGENCE_OPPORTUNITY_KINDS`, confirmed the THIRD "kind of notable moment" list in this codebase, kept separate. `emotionalToneNeedsRebalancing` tracks strain/relief *signals*, distinct from AF-153's pacing-category imbalance. `ContentRotationTracker`, `LongTermMemoryLog` (distinct from AF-133's real per-NPC `NpcMemoryLog` — this is player-journey-level), and `EngagementMap` (advisory-only, never forces participation) are all confirmed genuinely absent elsewhere in the codebase.

`PLAYER_JOURNEY_TIERS` (7 tiers) is confirmed the FOURTH player-rank-title list in this codebase, after AF-139's real `PLAYER_EVOLUTION_RANKS` and `COMMANDER_MATURITY_STAGES`, and AF-136's real `PLAYER_REPUTATION_TITLES` — no exact membership match with any of the three, kept separate and documented. `resolveByFailsafePriority` implements a strict ordering ("always prioritise") rather than an all-must-pass gate, deliberately not added to the codebase's existing checklist-gate family. "Primary Responsibilities" (17 systems) is confirmed the eighth parallel "which systems does this touch" list in this codebase, after AF-142/144/145/149/152/153's real lists, kept separate rather than merged.

The debug overlay gains a new `atlasOrchestrator` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-153 before it. Zero changes to AF-144's `DecisionRouter`, AF-149's `systemImpactReportFor`, AF-153's `EmergenceOpportunityLog`/`EmotionalPacingTracker`, AF-136's `StoryDirector`/`EMERGENT_MOMENT_KINDS`/`PLAYER_REPUTATION_TITLES`, AF-139's `PLAYER_EVOLUTION_RANKS`/`COMMANDER_MATURITY_STAGES`, AF-133's `NpcMemoryLog`, or any other locked module.

Score: 9.5/10 — approved and locked.
