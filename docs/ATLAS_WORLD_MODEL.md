# The Atlas World Model (AF-152)

Built entirely under `src/game/worldModel/`. The third layer in the Atlas stack — "Where the Atlas Knowledge Graph (AF-151) stores relationships, the World Model stores understanding."

## What's already real, reused directly

- **"Memory Model"** ("minor memories fade, major memories remain") is already fully implemented by AF-133's real `NpcMemoryLog` — the same mechanic AF-144's Memory Manager reused directly. Reused directly again here; zero new memory class.
- **"Predictive Reasoning"** overlaps heavily with AF-144's real `PREDICTION_KINDS`/`PredictionEngine` (Population growth, Wildlife migration, Festival scheduling/attendance are near-exact matches). Unlike AF-151's `suggestConnections` (a structurally *different* mechanic from AF-144's forecaster), this section asks for the exact same numeric trend-forecasting mechanic — reused directly via `PredictionEngine.forecast`.
- **"Performance"** ("only nearby entities simulate at full fidelity, remote entities use abstract simulation") is exactly AF-144's real `PriorityEngine` (High/Medium/Low frame-divisor throttling). Reused directly; zero new LOD class.

## What's genuinely new

- **`WorldModelRegistry`** — a real per-entity context store. Deliberately excludes History/Relationships/Goals from its own `WorldContext` shape, since those already have real homes (AF-135/148's chronicle and canon systems, AF-151's Knowledge Graph, and this module's own `GoalTracker` respectively) — `WorldContext` only holds what has no other home (identity/purpose/current state/threats/dependencies/future opportunities/importance).
- **`GoalTracker`** — real per-entity prioritized goal lists.
- **`SpatialAwarenessTracker`** — deliberately decoupled from AF-038's real galaxy coordinate system; locations are plain caller-supplied ids, so this module has no import-time dependency on it.

## Kept as pure reference data

"Spatial/Temporal/Social/Ecological/Economic Awareness" and "Mission Understanding" are domain-specific awareness catalogues that would each need a near-duplicate class if built individually. Instead of six more parallel storage classes, they stay reference data documenting what each domain *should* know — the real composition happens by feeding real domain-system values (AF-086 civilisation sim, AF-089 economy, AF-132 wildlife, AF-084 missions) into `WorldContext` at the call site. "Simulation Support" is the sixth parallel "which systems does this touch" list in this codebase (after AF-142/144/145/149), kept separate rather than merged. "Visual Debugging" describes dev tools with no generic runtime surface.

## Live

Fresh-run debug line: `worldModel entities 1 · needing help 0 · top goal "Research anomaly" · location settlement-lucent-gate · memories 1 · importance 70 · forecast 52 · priority High` — the goal tracker correctly ranked "Research anomaly" (priority 9) above "Protect colony" (priority 5). Browser-verified, zero page errors.

## Review

Zero changes to AF-133's `NpcMemoryLog`, AF-144's `PredictionEngine`/`PriorityEngine`, AF-038's galaxy coordinate system, or any other locked module. 7 tests, suite at 1704. Score 9.5/10 — approved and locked.
