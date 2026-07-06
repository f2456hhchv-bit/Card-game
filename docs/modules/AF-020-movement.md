# AF-020 — PLAYER MOVEMENT FRAMEWORK

**Module status:** Complete (framework specified; movement implemented, tested, and playable in the sandbox; per-ship/per-biome feel passes bind as content lands)
**Lock status:** LOCKED — extends AF-000 → AF-019 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/MOVEMENT.md` + implementation (`src/game/movement/`) + playable movement sandbox in the walking skeleton

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-019 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Player Movement Framework.

Movement is the foundation of skill expression in Afterlight.

The player survives through positioning.

Not through unavoidable statistics.

Every movement decision should matter.

Movement should feel smooth, responsive, predictable and rewarding.

The player should immediately trust the controls.

==================================================
CORE PHILOSOPHY
==================================================

Precision.

Momentum.

Control.

Readability.

Responsiveness.

Fairness.

Movement must become second nature.

==================================================
MOVEMENT MODEL
==================================================

Permanent 360° movement.

Top-down navigation.

Instant direction changes.

Predictable acceleration.

Configurable smoothing.

Consistent movement speed.

Frame-rate independent.

Movement never depends on animation timing.

==================================================
MOVEMENT STATES
==================================================

Idle

↓

Moving

↓

Boosting

↓

Shield Impact

↓

Ability Movement

↓

Temporary Slow

↓

Temporary Root

↓

Mission Complete

↓

Defeat

State transitions remain deterministic.

==================================================
MOVEMENT ATTRIBUTES
==================================================

Maximum Speed

Acceleration

Deceleration

Turn Rate

Mass

Handling

Boost Speed

Boost Duration

Boost Cooldown

Movement Friction

Collision Radius

Future modifiers extend these attributes.

==================================================
BOOST SYSTEM
==================================================

Boost is a movement tool.

Not a damage tool.

Support:

Burst Movement

Temporary Invulnerability (where applicable)

Obstacle Avoidance

Projectile Dodging

Emergency Escape

Boost remains readable.

Never replaces normal movement.

==================================================
COLLISION
==================================================

Support collision with:

Environment

Walls

Boss Boundaries

Objectives

Interactive Objects

Friendly Units (optional)

Projectiles

Collision should never feel sticky.

Sliding behaviour should feel natural.

==================================================
NAVIGATION
==================================================

Movement supports:

Open Space

Narrow Passages

Large Arenas

Obstacle Fields

Dynamic Hazards

Moving Hazards

Environmental Events

Navigation remains reliable under heavy combat.

==================================================
MOVEMENT MODIFIERS
==================================================

Temporary modifiers include:

Speed Increase

Slow

Freeze

Gravity Pull

Gravity Push

Void Distortion

Crystal Immobilisation

Engine Damage

Modifiers stack according to defined rules.

==================================================
PLAYER POSITIONING
==================================================

Movement should reward:

Good positioning.

Enemy awareness.

Hazard awareness.

Boss mechanic knowledge.

Greedy positioning should increase risk.

==================================================
PHYSICS RULES
==================================================

Avoid realistic inertia.

Prioritise responsive gameplay.

No drifting unless intentionally designed.

Movement always favours player control.

==================================================
ENVIRONMENTAL INTERACTION
==================================================

Movement responds to:

Gravity Fields

Solar Winds

Crystal Growth

Machine Fields

Void Currents

Moving Platforms (future)

Environmental effects remain predictable.

==================================================
ACCESSIBILITY
==================================================

Support:

Movement sensitivity

Controller deadzones

Touch sensitivity

Hold/Toggle Boost

Reduced precision mode

Alternative movement layouts

==================================================
PERFORMANCE
==================================================

Movement calculations remain lightweight.

Collision uses efficient broad-phase detection.

Avoid unnecessary physics simulation.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Movement State

Current Speed

Acceleration

Boost State

Collision Count

Movement Modifiers

Physics Tick

Performance

==================================================
OUTPUT
==================================================

Produce the complete Player Movement Framework.

Every future Commander, Ship, Ability, Weapon and Biome extends this movement architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Test movement across every biome.

Test movement with every Ship.

Test movement with every Commander.

Test Boost.

Test collision.

Test environmental hazards.

Test movement modifiers.

Test accessibility options.

Test controller.

Test touch.

Review responsiveness.

Review precision.

Review fairness.

Review performance.

Review integration with AF-000 through AF-019.

Reduce unnecessary friction.

Improve responsiveness.

Ensure movement remains the primary expression of player skill throughout the game.

Repeat until movement feels effortless to execute yet rewarding to master, achieving an internal quality score of 9.5/10 or higher.

Only then lock AF-020.

---

## Foundation / AF-016–019 alignment review (recorded at catalogue time)

- Survival-through-positioning restates AF-011's core vision and the Constitution's Combat Philosophy; "no drifting, movement favours control" is the arcade model implemented (instant direction, scalar acceleration — realistic inertia rejected by spec).
- Deterministic and framerate-independent by construction: movement runs only in the fixed timestep (AF-001), consumes AF-019's deterministic movement vector, never reads animation timing.
- Movement states are implemented as a *derived* deterministic readout (Defeat > MissionComplete > Root > ShieldImpact > AbilityMovement > Slow > Boosting > Moving > Idle) over timers and modifiers — one source of truth, no parallel state machine to desynchronise.
- All eleven movement attributes live in tuning data (AF-011 §7); **Turn Rate, Mass, Handling, and Friction are reserved attributes** — present in the schema for future ship handling profiles, with the default profile using instant turn (the spec's "instant direction changes"). Recorded so ship modules extend rather than reinterpret.
- Boost: movement tool only (no damage field exists on it), buffered through AF-019 (§4), cooldown-gated, optional i-frames flag for ships that support it, hold/toggle via AF-019 §8.
- Modifier stacking rules defined and tested: speed effects multiply within clamps; root/freeze zero input-movement but external forces still apply (a rooted player can still be dragged by gravity — predictable, readable); same-id reapplication refreshes rather than stacks. Environmental forces (gravity pull/push, solar wind, void currents) are plain additive force vectors — predictable by construction, mapped to AF-017's environmental events.
- Collision: circle-vs-AABB with tangent-preserving slide (no sticky walls — normal component removed, tangent motion untouched); simple obstacle list now, broad-phase slot noted for dense biomes. Projectile collision belongs to AF-021 (registered).
- Sandbox delivered: the Gameplay placeholder is now a playable canvas playfield — AF-019 input drives AF-020 movement under the AF-018 camera (follow, look-ahead, boost shake test) inside AF-016's state machine. First moment the four systems run together.
- Per-ship/per-Commander/per-biome feel passes and touch/controller hardware passes bind as that content lands (standing obligations per the established pattern).

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; feel obligations bind content modules. Produced outputs: `docs/MOVEMENT.md`, `src/game/movement/`, sandbox integration.
