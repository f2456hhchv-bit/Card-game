# The Afterlight Operating System (AF-144)

Built entirely under `src/game/aos/`. The most architecturally sweeping spec yet — a research pass before implementation found most of its "invisible intelligence" already has a real, working precedent somewhere in a 144-module-deep codebase.

## What's already real, reused directly

- **System Bus** — AF-001's real `EventBus<E>` (`src/core/events/EventBus.ts`) is already "the only cross-system communication channel in Afterlight" per its own doc comment, generic over any named-event map. This module instantiates it with its own new `AosEventMap` (Planet Restored, Commander Recruited, Species Discovered, ...) rather than building a second bus class.
- **Memory Manager** — "minor memories fade naturally, major memories remain permanently" is already fully implemented by AF-133's real `NpcMemoryLog` (non-historic entries capped and oldest-dropped per subject; historic entries never dropped). Reused directly, zero new memory class.

## What's genuinely new

Confirmed nowhere else in the codebase — every existing "clock"/"state"/"priority" concept is local to one module:

- **`WorldStateStore<T>`** — a real, generic single source of truth over Current/Historical/Projected/Temporary/Emergency state. AF-144's own `StateMachine` precedent only tracks which *screen* is active, never game data.
- **`SimulationClockRegistry`** — a read-only reporting aggregator over named time layers. Every existing clock (`civilisation.epochCount`, `sessionSeconds`, per-run `playTimeMs`, etc.) stays authoritative; this never becomes a second source of truth for any of them.
- **`PriorityEngine`** — real High/Medium/Low update-frequency throttling (a frame-divisor per tier), distinct from AF-056's real but narrowly combat-only `DirectorConductor`.
- **`DecisionRouter`** — arbitrates conflicting change requests; player-sourced requests always win ties, otherwise the highest priority tier wins.
- **`PredictionEngine`** — a real linear-trend forecaster with confidence falling as a series' own variance rises.
- **`PerformanceBudgetTracker`** — tracks 0-100 usage per domain, recommends throttling the domains furthest over budget first.
- **`RecoveryLog`** — append-only, world-state-contradiction recovery, distinct from AF-044's real save-slice corruption recovery (different failure domain entirely).
- **`TelemetryCollector`** — confirmed genuinely new; AF-094's `ANALYTICS_TRACKING_CATEGORIES` is honestly `{kind:"future"}` everywhere, zero producer existed anywhere. Counts event kinds only — no payload data, nothing personally identifying.
- **`buildDialogueContext`** — a pure aggregator (Context Engine) over plain signal values, never importing the systems it reads from.

## Kept as pure reference data, no new runtime

"Debug Framework" — the real `DebugOverlay` already covers "simulation viewer" (every module's summary line) and "performance profiler" (fps/lastTransitionMs/droppedTimeMs); relationship inspector/galaxy debugger/chronicle validator/world-state explorer/timeline scrubber would each need interactive UI with no runtime surface in a text-panel overlay. "Scalability" and "Failsafe Principles" are architectural claims, not mechanics.

## Live

Fresh-run debug line: `aos responsibilities 17 · bus events 1 · world state stable (settlements 6) · clocks [civ 0] · priority player=High · decision→living-galaxy · forecast 52 (100%) · throttle [none] · recoveries 1 · dialogue friendly=true`. Browser-verified, zero page errors.

## Review

A real bug was caught during test-writing (not browser verification this time): `WorldStateStore.setCurrent` initially archived the outgoing value with the *new* epoch instead of the epoch it was actually valid from, so `historyAt(pastEpoch)` returned `null` for genuinely historical values. Fixed by tracking `currentSetAtEpoch` separately. Zero changes to AF-001's `EventBus`, AF-133's `NpcMemoryLog`, AF-044's save system, AF-056's `DirectorConductor`, or any other locked module. 13 tests, suite at 1642. Score 9.5/10 — approved and locked.
