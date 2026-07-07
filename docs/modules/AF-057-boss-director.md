# AF-057 — BOSS DIRECTOR FRAMEWORK

**Module status:** Complete (framework specified; director layer implemented and tested against the unmodified AF-035 runtime; the full decorated encounter verified end-to-end in an integration test)
**Lock status:** LOCKED — extends AF-000 → AF-056 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/BOSS_DIRECTOR_FRAMEWORK.md` + implementation (`src/game/bosses/bossDirectorData.ts`, `BossDirector.ts`)

---

*(Module catalogued verbatim below.)*

57

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-056 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Boss Director Framework.

Bosses should never feel like isolated encounters.

Every Boss battle is a carefully orchestrated event.

The Boss Director controls pacing, arena evolution, phase transitions, environmental interactions and cinematic presentation.

Every Boss should become a memorable climax.

Not simply a larger enemy.

==================================================
CORE PHILOSOPHY
==================================================

Escalation.

Spectacle.

Fairness.

Readability.

Mastery.

Every Boss encounter should feel handcrafted regardless of procedural mission generation.

==================================================
BOSS DIRECTOR RESPONSIBILITIES
==================================================

Manage:

Boss Introduction

Arena Control

Music

Environmental Hazards

Phase Transitions

Summoned Enemies

Recovery Windows

Reward Ceremony

Narrative Events

Everything functions as one encounter.

==================================================
BOSS ENCOUNTER FLOW
==================================================

Mission Progress

↓

Arena Activation

↓

Boss Arrival

↓

Introduction Sequence

↓

Phase One

↓

Arena Evolution

↓

Phase Two

↓

Environmental Escalation

↓

Final Phase

↓

Defeat Sequence

↓

Reward Ceremony

↓

Mission Continuation

Every transition remains smooth.

==================================================
PHASE MANAGEMENT
==================================================

Each phase may alter:

Attack Patterns

Movement

Arena Layout

Environmental Hazards

Summons

Music

Lighting

Dialogue

Boss Personality

Phase progression always feels meaningful.

==================================================
ARENA CONTROL
==================================================

Boss arenas support:

Dynamic Walls

Energy Barriers

Gravity Fields

Moving Structures

Environmental Hazards

Safe Zones

Interactive Objects

Arena evolution reinforces Boss identity.

==================================================
SUMMON SYSTEM
==================================================

Bosses may summon:

Faction Reinforcements

Elite Guards

Environmental Hazards

Constructs

Living Structures

Drone Waves

Temporary Allies

Summons always support encounter mechanics.

==================================================
CINEMATIC PRESENTATION
==================================================

Support:

Boss Arrival

Camera Events

Lighting Changes

Environmental Animation

Music Transition

Dialogue

Victory Sequence

Presentation enhances gameplay.

Never interrupts it.

==================================================
PLAYER RECOVERY
==================================================

Provide recovery opportunities:

Between Phases

After Major Mechanics

Following Arena Changes

Following Summons

Players should recover through skill.

Not artificial healing.

==================================================
LEGENDARY MOMENTS
==================================================

Boss encounters may feature:

Planetary Collapse

Solar Flares

Ancient Weapon Activation

Reality Fracture

Fleet Arrival

Environmental Transformation

Civilisation Discovery

These moments remain rare.

==================================================
BOSS MEMORY
==================================================

Track:

Attempts

Victories

Fastest Kill

Difficulty

Commander Used

Ship Used

Weapon Used

Mastery Challenges

Players build lasting memories.

==================================================
MULTI-BOSS SUPPORT
==================================================

Support:

Dual Bosses

Sequential Bosses

Environmental Bosses

Faction Bosses

Ancient Guardians

World Events

Raid Encounters (Future)

Framework remains scalable.

==================================================
REWARD CEREMONY
==================================================

Boss defeat presents:

XP

Loot

Blueprints

Research

Achievements

Codex Updates

Lore

Galaxy Progress

Reward presentation feels significant.

==================================================
BALANCE PRINCIPLES
==================================================

Bosses reward:

Learning

Observation

Movement

Build Optimisation

Adaptation

Mechanical Skill

Never:

Artificial Health Inflation

Artificial Damage Inflation

Hidden Mechanics

==================================================
ACCESSIBILITY
==================================================

Support:

Clear Telegraphs

Reduced Camera Motion

Reduced Flash Effects

High Contrast

Photosensitivity Mode

Subtitle Support

Controller Optimisation

==================================================
PERFORMANCE
==================================================

Pool Boss effects.

Pool arena transitions.

Optimise phase logic.

Stream cinematics asynchronously.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Phase

Arena State

Boss Director State

Transition Queue

Summon Queue

Reward Queue

Performance

==================================================
OUTPUT
==================================================

Produce the complete Boss Director Framework.

Every future Boss, Raid, World Boss and Legendary Encounter extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Boss encounters.

Review pacing.

Review arena evolution.

Review phase transitions.

Review summon timing.

Review cinematic presentation.

Review recovery windows.

Review rewards.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-056.

Adjust transition pacing.

Adjust arena mechanics.

Adjust reward presentation.

Remove repetitive encounter flow.

Ensure every Boss battle becomes a cinematic, mechanically satisfying climax that rewards mastery while remaining fair, memorable and endlessly replayable.

Repeat until the Boss Director Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-057.

---

## Foundation / AF-000–056 / GP-FINAL alignment review (recorded at catalogue time)

- **Like AF-056, this module's subject already exists and is LOCKED — and the same answer applies.** AF-035 built the Boss engine (`BossRuntime`'s phases, enrage, weak points, intro/death/ceremony state machine, the arena hazard, mastery challenges, the reward flow); AF-045 owns boss music states; AF-056's conductor already opens a recovery window on the boss kill fact. AF-057 is fulfilled as a DIRECTOR layer that decorates the locked runtime through notifications — `BossRuntime.ts`, `BossArena.ts`, and `bossData.ts` remain **byte-for-byte unmodified**, and the composition root detects phase changes by polling the runtime's own `snapshot.phaseIndex`.
- **The twelve-beat encounter flow is derived, never duplicated.** `beatFor` computes the live beat purely from the BossRuntime's own state plus the director's transition window — introduction/defeat/ceremony from the runtime's state machine, phase-one/two/final from the phase position, arena-evolution/environmental-escalation from the transition window (escalating with phase depth). No second state machine exists; four beats (mission progress, arena activation, boss arrival, mission continuation) are owned by AF-017's MiniBoss phase, `spawnBoss`, and AF-037's mission flow.
- **Player Recovery between phases is skill-based, literally.** A phase change opens `phaseTransitionRecoveryMs` of breathing room during which `attacksHeld` gates the boss's `tryAttack` at the composition root — the boss holds fire, nothing heals, and the player recovers by repositioning. This is AF-056's recovery-window idea applied inside the encounter the conductor deliberately exempts.
- **The Summon System is a queue, never a dump — and it reuses everything.** A data-driven per-phase plan (`SANDBOX_BOSS_SUMMON_PLAN` — the Hollow Sentinel's Collapse phase wakes two drones and one elite guard) enqueues on phase entry, waits out the breathing room, then drains ONE spec per cadence tick through the same shared `spawnEnemyInstance` path every enemy uses, with elite guards through AF-034's unchanged elite flag and counts reported to AF-017's census. The queue is capped; defeat clears it (the guards stand down with their warden).
- **Arena Control escalates the hazard AF-035 already owns.** `hazardRadiusScaleFor(phaseIndex)` grows the existing Collapse-phase hazard zone per phase reached — arena evolution as one pure multiplier over locked content, the same shape as AF-048's `growCrystalZone` extension of the same engine.
- **Cinematic one-shots reuse AF-053's consume-event shape a third time** (after AF-055's echoes): `bossArrival` fires once at encounter start, `victorySequence` once at defeat — notices plus a camera shake, presentation that never interrupts. The four remaining cinematic beats are registered for the asset/audio passes.
- **Boss Memory persists through AF-026's existing stats — zero new persistence.** Every `spawnBoss` records `boss:{id}:attempts`; victory records `boss:{id}:victories` and adjusts `boss:{id}:fastestKillMs` via the pure `fastestKillStatDelta` (records outright the first time, adjusts down on improvement, never regresses — unit-tested at all three branches). Mastery challenges have been live since AF-035; the loadout keys are registered for when the Hangar records runs.
- **The Reward Ceremony is paced, additively.** AF-035's `grantBossRewards` is untouched; the director ADDS memory-summary lines that land one per cadence during the runtime's own rewardCeremony state — "reward presentation feels significant" as pacing, not as a new reward system.
- **Balance Principles hold structurally, again:** the director can hold attacks, queue summons, and scale a hazard radius — no code path can inflate health or damage. Deterministic — the director holds no RNG.
- **Self-review executed:** 13 new tests — vocabulary registration (all eight shelves), the summon plan's validity against real enemy defs, the full `beatFor` derivation, transition open/hold/expiry, arena escalation monotonicity, the summon queue's transition-wait + cadence + FIFO + cap + defeat-clear, cinematic one-shot semantics, ceremony pacing (first line immediate, rest cadenced), all three `fastestKillStatDelta` branches, an INTEGRATION test decorating a real Hollow Sentinel fight end-to-end (real `BossRuntime`, steady damage → phase change detected → breathing room measurably held fire → both summons flowed in plan order at cadence → victory cinematic fired), and a 5,000-encounter randomised sweep in which the summon queue never exceeds its cap, the transition window never exceeds its tuning, and no summon ever escapes during breathing room. **One honest verification gap, AF-046-style:** the full decorated boss fight was NOT observed live in the browser this session — the MiniBoss phase arrives ~98s into a run and the piloted player died at 14s/22s across two genuine evasion attempts; both live runs confirmed the new wiring loads with zero page errors and the `bossDir` overlay line renders correctly pre-encounter. The live observation binds at the next session that naturally reaches the vault.

**Review verdict:** ALIGNED (zero changes to the locked AF-035 engine, its arena, or its data; zero new spawn paths, persistence systems, or reward systems — summons, memory, and ceremony all route through AF-026/033/034's existing surfaces; the second consecutive module whose new surface is an orchestration layer rather than a combatant). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/BOSS_DIRECTOR_FRAMEWORK.md`, `src/game/bosses/bossDirectorData.ts` + `BossDirector.ts`.
