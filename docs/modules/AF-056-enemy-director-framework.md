# AF-056 — ENEMY DIRECTOR FRAMEWORK

**Module status:** Complete (framework specified; conductor layer implemented and tested over the unmodified AF-017 engine; live recovery windows, adaptive tempo, and spawn queueing verified in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-055 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ENEMY_DIRECTOR_FRAMEWORK.md` + implementation (`src/game/director/conductorData.ts`, `DirectorConductor.ts`)

---

*(Module catalogued verbatim below.)*

56

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-055 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Enemy Director Framework.

The Enemy Director is the invisible intelligence controlling every expedition.

Its purpose is not to make the game harder.

Its purpose is to make every run feel handcrafted.

Every encounter should feel intentional.

Every escalation should feel earned.

Every quiet moment should prepare players for the next challenge.

==================================================
CORE PHILOSOPHY
==================================================

Rhythm.

Escalation.

Recovery.

Surprise.

Fairness.

The player should constantly experience tension followed by relief.

Never constant chaos.

==================================================
DIRECTOR RESPONSIBILITIES
==================================================

The Enemy Director manages:

Enemy Spawning

Elite Frequency

Boss Timing

Encounter Density

Event Timing

Recovery Windows

Resource Drops

Environmental Pressure

Mission Tempo

Every system operates together.

==================================================
MISSION FLOW
==================================================

Mission Start

↓

Exploration

↓

Light Combat

↓

Escalation

↓

Recovery

↓

Elite Encounter

↓

Exploration

↓

Major Event

↓

Heavy Combat

↓

Boss

↓

Extraction

Every mission follows natural pacing.

==================================================
SPAWN SYSTEM
==================================================

Spawn logic considers:

Mission Progress

Biome

Difficulty

Threat Budget

Player Performance

Active Events

Current Enemy Count

Environmental Hazards

Galaxy State

Spawn generation remains deterministic.

==================================================
THREAT BUDGET
==================================================

Every encounter consumes a configurable threat budget.

Threat values include:

Enemy Type

Elite Tier

Special Units

Environmental Hazards

Mission Modifiers

Events

Boss Influence

Budgets remain data-driven.

==================================================
ENCOUNTER TYPES
==================================================

Support:

Patrol

Ambush

Swarm

Elite Hunt

Defensive Line

Mixed Factions

Roaming Threat

Environmental Defence

Ancient Activation

Dynamic Reinforcements

Future encounters extend naturally.

==================================================
SPAWN RULES
==================================================

Prevent:

Enemy overlap

Unfair ambushes

Spawn inside player vision

Soft locks

Impossible situations

Spawn locations must always respect gameplay fairness.

==================================================
PACING SYSTEM
==================================================

Alternate between:

Low Pressure

↓

Medium Pressure

↓

High Pressure

↓

Recovery

↓

Escalation

↓

Boss Preparation

Players should naturally feel rising tension.

==================================================
RECOVERY WINDOWS
==================================================

Director provides breathing room after:

Elite Battles

Major Events

Boss Phases

Large Enemy Waves

Resource Discoveries

Recovery should never feel excessive.

==================================================
ADAPTIVE RESPONSE
==================================================

Director evaluates:

Player Health

Damage Taken

Average Kill Speed

Build Strength

Movement Efficiency

Mission Time

Resource Economy

Adaptation adjusts pacing.

Not hidden difficulty.

==================================================
FACTION MIXING
==================================================

Support encounters featuring:

Single Faction

Dual Faction

Environmental Creatures

Corrupted Variants

Special Events

Hybrid Encounters

Mixing remains lore-consistent.

==================================================
EVENT INTEGRATION
==================================================

Director coordinates with:

Galaxy Events

Weather

Biome Hazards

Mission Objectives

Faction Activity

Story Events

Ancient Discoveries

Everything feels interconnected.

==================================================
BALANCE PRINCIPLES
==================================================

Difficulty increases through:

Better combinations.

Better positioning.

Better enemy cooperation.

Not excessive health.

Not unavoidable damage.

==================================================
ACCESSIBILITY
==================================================

Support:

Difficulty Presets

Reduced Enemy Density

Recovery Assistance

Visual Threat Indicators

High Contrast

Photosensitivity Support

Controller Optimisation

==================================================
PERFORMANCE
==================================================

Pool spawn requests.

Optimise AI activation.

Deactivate distant enemies.

Reuse encounter templates.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Threat Budget

Spawn Queue

Encounter State

Director Phase

Enemy Count

Recovery Timer

Performance

==================================================
OUTPUT
==================================================

Produce the complete Enemy Director Framework.

Every future mission, biome, faction, Boss and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate hundreds of thousands of missions.

Review pacing.

Review encounter variety.

Review spawn fairness.

Review Elite timing.

Review Boss preparation.

Review recovery windows.

Review adaptive behaviour.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-055.

Adjust threat budgets.

Adjust pacing curves.

Adjust spawn logic.

Remove repetitive encounters.

Ensure every expedition feels handcrafted through intelligent pacing, escalating tension and fair encounter design while remaining endlessly replayable.

Repeat until the Enemy Director Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-056.

---

## Foundation / AF-000–055 / GP-FINAL alignment review (recorded at catalogue time)

- **This module's central alignment question is unique in the series: the Enemy Director already exists, and it is LOCKED.** AF-017 built the phase engine, the threat budget, the wave costs, the spawn-fairness contract (min distance + telegraph), the census caps, the decision cadence, and the environmental-event roller — and AF-046 → AF-055 built the ten-faction encounter catalogue on top of it. AF-056 is therefore fulfilled the only way the Foundation Lock permits: as a CONDUCTOR LAYER over the Director's output. `EnemyDirector.ts` and `directorTuning.ts` remain **byte-for-byte unmodified**; `DirectorConductor` receives directives through the same `onDirective` seam `main.ts` always used, and its runtime is generic over the directive type — it never even inspects what it queues.
- **Most of AF-056's sections are audits of already-locked systems, and the framework doc records them as such.** Mission Flow IS AF-017's `phaseSequence`; the Threat Budget, deterministic spawning, and spawn-fairness rules ARE AF-017 §6/§9; Elite Frequency is AF-017's `maxSimultaneousElites` + AF-034's pipeline; Boss Timing is AF-017's MiniBoss phase + AF-035's handoff; Event Integration is the `EnvironmentalEventTriggered` fact that AF-036/037/038/039/040/041 already share and that AF-049/050/053/054 spawn factions from; Resource Drops are AF-022/023's own systems reading the same kill facts. The conductor adds the two responsibilities nothing yet owned: **Recovery Windows** and **Mission Tempo**.
- **Recovery Windows are reactive, with all five specified triggers live.** Elite Battles and Boss Phases hook the existing `EnemyKilled` fact's `elite`/`boss` flags; Major Events hook `EnvironmentalEventTriggered`; Large Enemy Waves hook a new `notifyWaveLanded(count)` call at both spawn sites in `executeWave`; Resource Discoveries hook the existing `LootCollected` handler's legendary+ branch. While a window is open, ordinary directives wait in the Spawn Queue — and boss directives bypass the gate entirely, because Boss Timing belongs to AF-017/035, not to the conductor.
- **The Spawn Queue defers pressure; it never deletes it.** FIFO, capped at `maxQueuedDirectives`, with overflow flushing the oldest immediately — so hiding in a recovery window cannot soft-lock the Director (§Spawn Rules), and the integration test proves `executed === issued` across a full simulated two-minute mission against the REAL `EnemyDirector`. A queue flush that releases two different faction directives in one tick is the live mechanical form of a Dual Faction moment (§Faction Mixing) — emergent from the queue, not scripted.
- **Adaptive Response adjusts pacing, not hidden difficulty — structurally.** The conductor's two live inputs (Damage Taken via the existing `PlayerDamaged` fact; Player Health via the per-tick hull fraction) combine into a struggle score that scales ONLY the window duration between `minWindowMs` and `maxWindowMs`. Nothing in the class can reach an enemy stat, a budget, or the phase engine — the spec's promise is enforced by what the code cannot do, the same discipline as every faction cap. Both extremes were observed live: struggle 0% produced the 2.0s minimum window; struggle 100% produced the full ~9s window.
- **Encounter Types formalise what AF-046 → AF-055 built.** The total `WAVE_TYPE_TO_ENCOUNTER_TYPE` mapping names every existing wave routing (Nomad patrols, Outlaw ambushes, Eclipsed elite hunts, Machine dynamic reinforcements, Hive roaming threats, Crystal mixed rosters, the Hollow Sentinel's ancient activation) — nine of ten encounter types realised by existing content, `defensiveLine`/`environmentalDefence` registered. The Pacing System's six pressures are a pure derivation (`pressureFor`) from the Director's own phase plus the window state — never stored, never a second state machine.
- **The conductor holds no RNG at all** — determinism by construction, verified by an identical-runs test, and consistent with AF-017's own seeded-fork discipline.
- **A held encounter is named, not hidden** (§Accessibility, Visual Threat Indicators): queueing surfaces a notice with the encounter type ("PATROL HOLDING — RECOVERY WINDOW"), and the debug overlay's `conductor` line shows pressure, window + trigger, queue depth, struggle, and window count — the DEBUG section's Spawn Queue and Recovery Timer, live.
- **Self-review executed:** 15 new tests — vocabulary registration, the total wave→encounter mapping, all-six-pressures derivation with window override, all five triggers opening windows, both adaptive extremes with the hard cap, the no-chaining cooldown, the large-wave threshold, pass-through/queue/flush behaviour, FIFO overflow flush, the zero-RNG determinism check, struggle rise/decay and the live health input, an end-to-end integration run over the real `EnemyDirector` (every issued directive eventually executed, none lost), and a 5,000-mission randomised sweep in which the window/queue/struggle bounds hold on every step of every timeline and `executed === issued` on every mission. Live in the browser across three runs: a `largeEnemyWaves` window opening the moment the Director's first real faction wave landed; the minimum 2s window at struggle 0% and the full ~9s window at struggle 100%; struggle visibly tracking real damage (0→26→42→100%); the cooldown counting down; pressure labels transitioning lowPressure→recovery→mediumPressure with the Director's own phases; an `eliteBattles` window opening live when a Void Avatar elite died to real auto-fire; and a real Director directive held at `queue 1` inside that window — zero page errors throughout.

**Review verdict:** ALIGNED (zero changes to the locked AF-017 engine or its tuning — the strictest reuse constraint in the series, met with a wrapper over the existing `onDirective` seam; zero new spawn paths — deferred directives land through the same `executeWave` every wave always used, re-deriving spawn-fairness distance at flush time). `DirectorConductor` is the only genuinely new mechanical surface, and it is the first module whose new surface governs TIME rather than a faction. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ENEMY_DIRECTOR_FRAMEWORK.md`, `src/game/director/conductorData.ts` + `DirectorConductor.ts`.
