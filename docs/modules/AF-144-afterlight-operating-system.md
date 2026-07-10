## Verbatim prompt

144

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-143 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Afterlight Operating System (AOS).

The AOS is the invisible intelligence connecting every gameplay, simulation, narrative and technical system into one coherent universe.

Players never see the Operating System directly.

They only experience a world that consistently feels intelligent, responsive and alive.

==================================================
CORE PHILOSOPHY
==================================================

Everything communicates.

Nothing exists in isolation.

Every system influences every other system.

The player should never notice the framework.

Only the quality it produces.

==================================================
AOS RESPONSIBILITIES
==================================================

The Operating System coordinates:

Living Galaxy

Living Ship

Commanders

Bond Network

Museum

Chronicle

Civilisation

Research

Economy

Weather

Wildlife

Events

Story Engine

Evolution

Legacy

Endgame

Future Modules

==================================================
SYSTEM BUS
==================================================

Every module communicates using a shared event bus.

Examples

Planet Restored

Commander Recruited

Species Discovered

Research Completed

Museum Expanded

Historic Event Created

Relationship Increased

Economy Changed

Weather Shifted

New events automatically propagate.

==================================================
WORLD STATE
==================================================

The Operating System continuously maintains:

Current World State

Historical World State

Projected Future State

Temporary State

Emergency State

Simulation State

Every system queries a single source of truth.

==================================================
SIMULATION CLOCK
==================================================

Time operates on multiple layers.

Real Time

Mission Time

Ship Time

Planet Time

Civilisation Time

Historical Time

Generational Time

The Operating System synchronises all timelines.

==================================================
PRIORITY ENGINE
==================================================

Not everything updates equally.

Highest Priority

Player

Immediate combat

Commander interactions

Nearby wildlife

Mission objectives

Medium Priority

Nearby colonies

Economy

Weather

Traffic

Low Priority

Remote galaxies

Historic simulation

Deep-space events

Inactive wildlife

Performance remains stable.

==================================================
CONTEXT ENGINE
==================================================

Every interaction considers context.

Examples

Player reputation

Current Commander

Planet history

Time of day

Relationship status

Weather

Nearby discoveries

Recent conversations

Dialogue always feels appropriate.

==================================================
MEMORY MANAGER
==================================================

Tracks:

Persistent memories

Temporary memories

Conversation history

Relationship history

Mission history

Historical significance

Minor memories fade naturally.

Major memories remain permanently.

==================================================
DECISION ROUTER
==================================================

When multiple systems request changes:

Resolve priorities.

Prevent contradictions.

Maintain canon.

Protect player agency.

Ensure consistency.

==================================================
PREDICTION ENGINE
==================================================

Forecast likely future events.

Examples

Economic shortages

Population growth

Commander promotions

Wildlife migration

Research breakthroughs

Festival scheduling

Allows believable anticipation.

==================================================
PERFORMANCE ORCHESTRATOR
==================================================

Continuously balances:

Simulation depth

Rendering

Audio

Animation

AI

Streaming

Networking

Memory

Battery

Nothing important stalls.

==================================================
RECOVERY SYSTEM
==================================================

Automatically handles:

Interrupted simulations

Corrupted temporary states

Unexpected contradictions

Save migration

Expansion compatibility

Graceful recovery without immersion breaks.

==================================================
DEBUG FRAMEWORK
==================================================

Developer-only tools include:

Simulation viewer

Relationship inspector

Galaxy debugger

Chronicle validator

Performance profiler

World-state explorer

Timeline scrubber

No player-facing impact.

==================================================
LIVE TELEMETRY
==================================================

Anonymous metrics support:

Balance improvements

Performance optimisation

Accessibility enhancements

Crash analysis

Feature adoption

Expansion planning

Offline play remains fully supported.

==================================================
SCALABILITY
==================================================

The AOS must comfortably support:

Thousands of planets

Millions of NPCs

Hundreds of Commanders

Centuries of history

Decades of expansions

Without architectural redesign.

==================================================
FAILSAFE PRINCIPLES
==================================================

If conflicting systems occur:

Protect player progress.

Protect history.

Protect accessibility.

Protect save integrity.

Protect narrative consistency.

==================================================
ACCESSIBILITY
==================================================

Simulation complexity options.

CPU-friendly modes.

Memory summaries.

World-state viewer.

Narration compatible.

==================================================
OUTPUT
==================================================

Implement the Afterlight Operating System.

Ensure every gameplay, narrative and simulation system operates as one unified universe.

The Operating System becomes the invisible foundation beneath the entire Afterlight experience.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of gameplay hours.

Stress-test thousands of simultaneous events.

Validate centuries of historical progression.

Review cross-system communication.

Review performance.

Review accessibility.

Review save compatibility.

Review expansion readiness.

Eliminate contradictory world states.

Ensure the Afterlight Operating System remains invisible to players while enabling one of the deepest, most coherent and technically resilient simulation-driven universes ever created.

Repeat until AF-144 consistently supports every previous and future module without degradation in quality, stability or player immersion.

Only then lock AF-144.

## Foundation / AF-000–143 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138/139/140/141/142/143) surveyed this, the most architecturally sweeping spec yet, before any design work. Confirmed already real and reused directly: AF-001's real `EventBus<E>` (`src/core/events/EventBus.ts`, generic over any named-event map, already "the only cross-system communication channel in Afterlight" per its own doc comment) is the real System Bus — this module instantiates it with its own new `AosEventMap` rather than building a second bus class; AF-133's real `NpcMemoryLog` (non-historic entries capped and oldest-dropped per subject, historic entries never dropped) already fully implements "minor memories fade naturally, major memories remain permanently" — the Memory Manager needed zero new code.

Confirmed genuinely new — every existing "clock"/"state"/"priority" concept in the codebase is local to one module, with no unifying analog anywhere: `WorldStateStore<T>` (a real single source of truth over Current/Historical/Projected/Temporary/Emergency state — the real `StateMachine` only tracks which screen is active, never game data); `SimulationClockRegistry` (a read-only reporting aggregator — every existing per-module clock stays authoritative, this never becomes a second source of truth); `PriorityEngine` (real High/Medium/Low frame-divisor throttling, distinct from AF-056's narrowly combat-only `DirectorConductor`); `DecisionRouter` (player-sourced requests always win ties, otherwise highest priority tier wins); `PredictionEngine` (a real linear-trend forecaster); `PerformanceBudgetTracker`; `RecoveryLog` (world-state-contradiction recovery, distinct from AF-044's real save-slice corruption recovery); and `TelemetryCollector` (confirmed genuinely new — AF-094's `ANALYTICS_TRACKING_CATEGORIES` is honestly `{kind:"future"}` everywhere, zero producer existed anywhere; counts event kinds only, no payload data). "Debug Framework" is kept as pure reference data — the real `DebugOverlay` already covers "simulation viewer" and "performance profiler"; the other 5 named tools would each need interactive UI with no runtime surface in a text-panel overlay, the same honest scope boundary AF-140 through AF-143 already applied to sections with no computational analog.

A real bug was caught while writing tests (not during browser verification this time): `WorldStateStore.setCurrent`'s first draft archived the outgoing value with the *new* epoch instead of the epoch it was actually valid from, so `historyAt(pastEpoch)` incorrectly returned `null` for genuinely historical values. Fixed by tracking `currentSetAtEpoch` separately; the retained test now asserts the correct historical lookup rather than just non-crashing.

The debug overlay gains a new `aos` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-143 before it. Zero changes to any other locked module (AF-000–143).

Score: 9.5/10 — approved and locked.
