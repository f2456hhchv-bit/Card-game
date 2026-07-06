# director — Adaptive Enemy Director (AF-017)

**Purpose:** The pacing brain of every expedition — decides what spawns, when, and how hard, without ever touching player performance.

**Responsibilities:** Phase cycle (pacing model), deterministic threat evaluation, spawn budget accrual/spending, wave selection with anti-repetition, elite caps, environmental event scheduling, boss handoff.

**Dependencies:** `core` only (`System`, `Rng`). Consumes a forked mission-seed RNG stream.

**Events:** emits via callbacks wired to the Event Bus at the composition root: `SpawnDirectiveIssued`, `DirectorPhaseChanged`, `EnvironmentalEventTriggered`.

**Data structures:** `SpawnDirective` (wave type, cost, elite count, fairness placement contract), `DirectorSnapshot`, `DirectorTuning` (the complete tuning surface — `directorTuning.ts`).

**Extension points:** new wave types / events / phases are tuning-data additions; the Enemy System (AF-021+) consumes directives and reports spawns/removals back via `notifyEnemiesSpawned/Removed`; biomes and missions supply threat inputs and modifiers.

**Known limitations:** directives are abstract until AF-021 materialises enemies; live-feel pacing tuning binds AF-021+ QA. Mutators are a registered input awaiting their module.
