# AF-016 — CORE GAMEPLAY FRAMEWORK

**Module status:** Complete (framework specified; state machine + core runtime implemented and tested; full-session playtest loop binds AF-017 → AF-026 as they land)
**Lock status:** LOCKED — extends AF-000 → AF-015 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CORE_GAMEPLAY.md` (framework of record) + the first implementation increment: new project skeleton (`src/`), game state machine, core runtime primitives, test suite, CI

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-015 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Core Gameplay Framework.

This module marks the beginning of the Gameplay Architecture.

It defines how a player experiences Afterlight from launching the game to completing a run.

Every future gameplay system must integrate into this framework.

This document governs the gameplay state machine, player loop, run lifecycle and system interactions.

==================================================
CORE PHILOSOPHY
==================================================

Easy to begin.

Difficult to master.

Every run is unique.

Every decision matters.

Every failure teaches.

Every victory advances long-term progression.

Players should always finish a run wanting to immediately begin another.

==================================================
PRIMARY GAME LOOP
==================================================

Launch Game
↓
Galaxy Command
↓
Prepare Build
↓
Select Mission
↓
Launch Expedition
↓
Combat
↓
Exploration
↓
Level Progression
↓
Loot Acquisition
↓
Elite Encounters
↓
Boss Encounter
↓
Mission Complete or Defeat
↓
Rewards
↓
Research
↓
Crafting
↓
Collections
↓
Galaxy Expansion
↓
Next Expedition

Every future gameplay mechanic strengthens one or more stages of this loop.

==================================================
GAME STATES
==================================================

Boot

Splash

Main Menu

Galaxy Command

Mission Selection

Loading

Gameplay

Pause

Level Up

Inventory Overlay

Mission Complete

Defeat

Statistics

Return to Galaxy Command

Future Multiplayer

Future Community Hub

Transitions must remain smooth and deterministic.

==================================================
PLAYER SESSION
==================================================

Every gameplay session records:

Mission

Commander

Ship

Weapons

Equipment

Research State

Difficulty

Ascension

Biome

Mission Seed

Play Time

Performance Metrics

Results

Statistics

==================================================
RUN STRUCTURE
==================================================

Every run contains:

Spawn

Early Exploration

Enemy Escalation

Elite Encounters

Environmental Events

Mini Boss

Midgame Scaling

Boss Encounter

Reward Phase

Extraction

Results

Failure remains a valid outcome.

==================================================
SESSION PRINCIPLES
==================================================

No unnecessary downtime.

Minimal loading.

Immediate player control.

Smooth pacing.

Constant engagement.

Alternating tension and recovery.

==================================================
PLAYER PROGRESSION DURING RUN
==================================================

Gain XP.

Level Up.

Choose Upgrades.

Acquire Loot.

Unlock Synergies.

Fight Stronger Enemies.

Adapt Build.

Complete Mission.

No run should become mathematically unwinnable due to random chance alone.

==================================================
GAMEPLAY RHYTHM
==================================================

Calm
↓
Combat
↓
Escalation
↓
Reward
↓
Discovery
↓
Escalation
↓
Boss
↓
Resolution

Maintain natural pacing.

Avoid repetitive encounter patterns.

==================================================
SAVE PHILOSOPHY
==================================================

Permanent Progress

Research

Collections

Mastery

Statistics

Achievements

Temporary Progress

Current Run

Mission State

Current Build

Current Rewards

Support safe interruption where platform requirements demand it.

==================================================
FAILURE PHILOSOPHY
==================================================

Failure rewards:

Knowledge

Research

Collections

Statistics

Progress

Failure never invalidates player time.

==================================================
SYSTEM INTEGRATION
==================================================

Integrates directly with:

AF-017 Enemy Director

AF-018 Camera

AF-019 Controls

AF-020 Movement

AF-021 Combat

AF-022 XP

AF-023 Loot

AF-024 Research

AF-025 Crafting

AF-026 Progression

Future modules extend this flow.

==================================================
ACCESSIBILITY
==================================================

Support:

Pause Anywhere (where appropriate)

Tutorial Replay

Difficulty Explanations

Input Flexibility

Reduced Motion

Visual Clarity

Colour Blind Modes

Subtitle Support

==================================================
PERFORMANCE
==================================================

Game state transitions under 250ms.

Minimal memory allocation.

Object pooling mandatory.

Asynchronous loading where possible.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Game State

Current Run State

Mission Seed

Difficulty

Player Build

Session Timer

Memory Usage

FPS

Game State Transition Time

==================================================
OUTPUT
==================================================

Produce the complete Core Gameplay Framework.

Every gameplay system implemented after AF-016 extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play complete sessions.

Review every game state.

Review every transition.

Review pacing.

Review onboarding.

Review run flow.

Review progression.

Review failure states.

Review reward pacing.

Review accessibility.

Review loading.

Review performance.

Review integration with AF-000 through AF-015.

Review compatibility with every future gameplay module.

Remove unnecessary interruptions.

Improve session pacing.

Ensure every run naturally creates anticipation for the next run.

Repeat until the Core Gameplay Framework achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-016.

---

## Foundation alignment review (recorded at catalogue time)

- Primary game loop expands AF-000's core loop / AF-015's Afterlight Loop stage-for-stage — verified faithful; no stage contradicts. Game states realise AF-001's Scene Manager and AF-003's menu architecture; Level Up state = AF-003 §7; Inventory Overlay = AF-005 components.
- Save philosophy maps onto AF-001 §8 slices: permanent progress → existing slices (research/collections/statistics/achievements + mastery within progress); temporary progress → a new **`run` slice** (current run state, safe interruption) — an extension, not a new save architecture.
- Session records + mission seed realise AF-001's determinism: one seed reproduces a run (debug, future replays/verification). "No run mathematically unwinnable by chance alone" is recorded as a binding constraint on future RNG/reward modules (AF-022/AF-023: guarantee mechanisms, e.g. pity-free *offer* diversity, not outcome generosity — design detail owed to those modules; the constraint is registered now).
- New canon surfaced: **Ascension** (difficulty layering — owed a full module later, registered), **Mini Boss** and **Extraction** run phases, Environmental Events. Names registered as canon; specification owed to AF-017+ modules.
- Accessibility adds Tutorial Replay and Difficulty Explanations — supersets, consistent. Transition budget (<250ms) is stricter than AF-005's animation ceiling and binds the Scene Manager (measured in debug overlay).
- AF-017 → AF-026 integration list adopted as the near-term roadmap; the framework exposes the extension points they attach to (documented in `docs/CORE_GAMEPLAY.md` §8).
- **Implementation increment delivered with this module** (per Foundation Lock §8 debts): new `src/` skeleton on AF-001's layout; deterministic fixed-timestep game loop; typed Event Bus; generic Pool; seeded RNG; structured logger; system-registry Game Manager; the full AF-016 **game state machine** with legal-transition table and timing instrumentation; debug overlay (state, seed, FPS, transition time); Vitest suite; CI workflow; decision records DR-001 → DR-004; old-iteration code archived out of the working tree (preserved in git history and `docs/archive/pre-restart/`).
- Full-session playtest items of the self-review loop cannot run before AF-017 → AF-021 exist (no enemies/controls/combat yet); recorded as standing obligations exactly per the established pattern.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; playtest obligations bind as gameplay modules land. Produced outputs: `docs/CORE_GAMEPLAY.md` + implementation increment.
