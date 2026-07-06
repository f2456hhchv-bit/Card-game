# core — engine-agnostic foundations (AF-001 core layer)

**Purpose:** Pure, portable runtime primitives. No DOM, no WebGL, no network — importable headless (tests, tooling, future server verification).

**Responsibilities:** Event Bus (`events/`), project event registry (`events/GameEvents.ts`), fixed-timestep game loop (`time/`), object pooling (`pool/`), deterministic seeded RNG (`rng/`), structured logging (`log/`), system registry/lifecycle (`GameManager.ts`), generic state machine (`state/`).

**Dependencies:** none (layer law: core depends on nothing).

**Events:** declares all cross-system events in `events/GameEvents.ts`; publishes none itself.

**Data structures:** `System`, `LogEntry`, `TransitionInfo`, `PoolOptions` — see per-file doc comments.

**Extension points:** new events are added to the `GameEvents` registry; new systems implement `System` and register with `GameManager`; new state graphs instantiate `StateMachine` with their own transition tables.

**Known limitations:** Save system, Data Registry, and net interfaces (AF-001 §3) are not yet implemented — they land with the modules that first need them (save: run-slice persistence; data: first content tables).
