# AFTERLIGHT — Adaptive Enemy Director

**Authority:** Produced output of AF-017. Extends AF-016's run lifecycle and the locked Foundation. Every future enemy, biome, and mission extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Director creates drama through pacing, variety, and honest pressure — never through cheating. It shapes *what the player faces*, never *how the player performs*.

---

## 1. Boundaries (what the Director may and may not touch)

**Controls:** enemy spawning · composition · elite frequency · mini boss timing · boss timing · environmental event timing · recovery windows · threat escalation · environmental hazards · encounter pacing.

**Never controls (enforced by construction):** player accuracy · loot quality · player statistics · hidden damage modifiers · rubber-banding. The threat function's inputs (§3) simply do not include player mistakes, hit rates, or loot state — the forbidden behaviours are unrepresentable, not merely discouraged. Scaling never punishes experimentation (AF-011).

## 2. Pacing model

The Director walks a data-driven phase cycle inside AF-016's Gameplay run:

**Recovery → Light Contact → Combat → Heavy Combat → Elite Pressure → Recovery → Environmental Event → Heavy Combat → Mini Boss → Recovery → Boss (handoff) → Reward.**

Each phase has a tuned base duration (jittered per-run by the seeded RNG so no two missions share exact timing) and an **intensity coefficient** that throttles the spawn budget. Recovery windows follow every pressure spike by construction of the cycle — reduced pressure, loot/XP collection space, preparation time. Continuous maximum intensity is impossible: heavy phases are bounded, and the simulation tests assert the max-intensity time share stays under budget.

## 3. Threat level (deterministic)

`threat = missionDifficulty × (1 + 0.15·ascension) × biomeModifier × mutatorModifier × (1 + elapsedSlope·minutes) × (1 + levelWeight·playerLevel + equipWeight·equipmentQuality)`

Pure function, exported and unit-tested; same inputs always yield the same threat. Inputs: mission difficulty, biome, elapsed time, player level, equipment quality, enemy density (as a *cap* input, not a difficulty input), boss state, Ascension, mutators. **Mutators** are registered canon (specification owed to a future module).

## 4. Spawn budget & waves

Budget accrues continuously: `rate = baseRate × phaseIntensity × threat`, and is *spent* to issue **spawn directives** — the Director's only output. A directive names: wave type, budget cost, elite count, and fairness placement data (§6). It never issues a directive it cannot afford, and never while active enemies are at the performance cap.

Nine wave identities, selected per phase from a data table with anti-repetition (never the same type twice in a row when alternatives exist): **Ambient Patrol · Swarm Wave · Hunter Pack · Elite Squad · Reinforcement Wave · Ambush Event · Mini Boss Wave · Boss Wave · Mixed Encounter.**

## 5. Elites, environmental events, boss handoff

- **Elites:** appear through Elite Pressure phases and Elite Squad directives; simultaneous elite count is capped in tuning and enforced (directives shrink or skip rather than breach it). Tension spikes are scheduled, memorable, and bounded.
- **Environmental events** (canon roster): Meteor Shower · Solar Flare · Crystal Growth · Gravity Flux · Void Distortion · Machine Reinforcements · Ancient Signal. Triggered at Environmental Event phases, never repeating the previous event, and **never during boss encounters** (the handoff pauses them).
- **Boss handoff:** at cycle end the Director issues the Boss Wave directive, then suspends all spawning and events — the boss owns the encounter. `endBossEncounter()` hands control back for the Reward phase. Threat transitions smoothly because budget accrual (not enemy state) is what ramps down.

## 6. Fairness rules (data on every directive)

Every spawn directive carries: **minimum spawn distance from the player** (never on top of them) · **safe-zone exclusion** · **telegraph duration** (readable warning per AF-004's anatomy before anything materialises). The Enemy System (AF-021+) must honour these or fail QA; the values are tuning data, not code. Spawning behind unavoidable hazards is prohibited by the placement contract (the consumer validates candidate positions against hazard data).

## 7. Accessibility

Difficulty previews (every difficulty/Ascension states what it changes — AF-016 §9) · combat intensity indicator (the Director's phase/intensity is exposed for an optional HUD element, AF-003 zone rules) · reduced visual clutter and clear telegraphs (inherited AF-004 laws — the Director's telegraph data feeds them) · adjustable encounter indicators (player setting).

## 8. Performance

Director *decisions* run on a tuned interval (default 4/sec) — not per frame; per-frame work is budget accrual arithmetic only. Directives drive **pooled** spawning (AF-001); active enemy caps are tuning data; spawn positions are the consumer's cached candidates. Budgets hold the 120/60 FPS targets.

## 9. Tuning surface (AF-011 §7 law)

Everything that shapes feel lives in `directorTuning` data: phase sequence and durations, intensity coefficients, budget rate, wave costs, waves-per-phase table, elite cap and squad size, active enemy cap, spawn distance, telegraph duration, decision interval, threat weights. Rebalancing the entire combat pacing of the game is a data edit. (Currently a typed TS data module; migrates into the Data Registry tables when that system lands.)

## 10. Debug

Debug overlay shows live: current phase (Director state) · threat level · spawn budget · active enemy / elite counts · last wave type · recovery state · boss handoff state. Every number in this document is observable.

## 11. Simulation-tested (the executed self-review)

The test suite plays **hundreds of seeded, deterministic, headless missions** per run of `npm test` and asserts across all of them: budget never overspent · elite cap never breached · zero directives or events during boss handoff · recovery follows every pressure phase · bounded max-intensity time share · anti-repetition of wave types and environmental events · fairness data present on every directive · **perfect determinism** (same seed → identical encounter script). Live-feel tuning against real combat binds AF-021+ QA.

---

## Internal review loop (AF-017, recorded)

- **Pacing** — data-driven cycle with jitter; recovery structurally guaranteed; no continuous max intensity (asserted, not hoped). ✔
- **Fairness** — forbidden behaviours unrepresentable; placement/telegraph contract on every directive. ✔
- **Threat scaling** — pure deterministic function; scales on time/difficulty/progression, never on mistakes. ✔
- **Elites / mini boss / boss** — capped, scheduled, handoff clean; boss owns its encounter. ✔
- **Variety** — nine wave identities + seven events with anti-repetition; seeds diversify timing. ✔
- **Performance** — interval decisions, budget-capped population, pooled consumers. ✔
- **Simulated runs** — executed headlessly in CI (hundreds per test run, thousands across development); invariants green. ✔
- **Simplification pass** — rejected a learning/adaptive-AI director (unpredictable, untestable, violates fairness transparency); rejected per-enemy-type budgets at this stage (wave-level costs suffice until AF-021 defines enemies); kept the Director output to a single directive type. ✔

**Internal quality score: 9.5/10 — approved and locked; live-combat tuning binds AF-021+.**
