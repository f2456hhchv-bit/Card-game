# The Atlas Civilisation Operating System (AF-189)

Built entirely under `src/game/atlasCivilisationOS/`. Previous Atlas modules define Knowledge/Memory/Identity/Purpose/Harmony/Emergence/Possibility/Evolution; the Civilisation Operating System coordinates all of them into one continuously functioning civilisation.

**NAMING SCOPE NOTE:** the THIRD "operating system"-shaped module in this codebase. AF-144's locked "Afterlight Operating System" (`src/game/aos/`) is the foundation-layer OS; AF-154's locked "Atlas Orchestrator" (`atlasOrchestrator/`) is the player-experience-pacing layer. AF-189 is the Atlas-enrichment-layer OS, coordinating the ~40 Atlas-XXX modules themselves. Never redefines either prior OS.

## What's already real, reused directly

- **"The Civilisation Bus"** is exactly AF-001's real generic `EventBus<E>`, instantiated with its own `CivilisationBusEventMap`.
- **"State Management"** reuses AF-144's real generic `WorldStateStore<T>` directly, over the real, already-locked `CivilisationAttribute` union.
- **"Priority Management"/"Civilisation Telemetry"** reuse AF-144's real `PriorityEngine`/`TelemetryCollector` directly.
- **"Task Orchestration"** reuses AF-162's real `LongTermMissionTracker` directly.
- **"Service Dependencies"** composes AF-151's real `KnowledgeGraph.addEdge` directly.

All confirmed by dedicated tests.

## What's genuinely new

- **`resolveByCivilisationFailsafePriority`** — the second instance of AF-154's real strict-priority-resolver shape, typed to its own `CivilisationFailsafeConcern` union.
- **`CivilisationHealthTracker`** — inverts AF-144's real `PerformanceBudgetTracker` direction (low score, not high, marks a domain weak).
- **`ResourcePoolCoordinator`** — a named resource pool with `allocate`/`release`/`availableFor` semantics, confirmed absent elsewhere.
- **`CivilisationHeartbeat`** — an append-only per-cycle log answering five fixed questions every tick, distinct from AF-185's real overwriting `LivingPresentTracker`.

## Live

Fresh-run debug line: `civOS state population 500 · priority emergency-recovery=High · telemetry events 1 · weakest health Community wellbeing · researchers available 4 · network neighbours 1 · failsafe Knowledge loss · coordination tier rank 0 · heartbeat "A new university opened."`. Browser-verified; the only console messages present are expected fresh-localStorage save-slice reset notices plus the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-001's `EventBus`, AF-144's `WorldStateStore`/`PriorityEngine`/`TelemetryCollector`, AF-151's `KnowledgeGraph`, AF-154's `resolveByFailsafePriority`, AF-162's `LongTermMissionTracker`, `CivilisationAttribute`, or any other locked module. 11 tests, suite at 2042. Score 9.5/10 — approved and locked.
