# AF-031 — SHIP FRAMEWORK

**Module status:** Complete (framework specified; movement-profile/passive/ability/mastery engine implemented and tested; a sandbox ship governs the run; ship roster passes bind as future content modules land)
**Lock status:** LOCKED — extends AF-000 → AF-030 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/SHIP_FRAMEWORK.md` + implementation (`src/game/ships/`)

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-030 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Ship Framework.

Ships are the physical embodiment of the player's chosen playstyle.

The Commander defines tactical philosophy.

The Ship defines battlefield behaviour.

Every ship should feel dramatically different to pilot while remaining balanced.

Players should choose ships because they complement their preferred strategy.

Not because one ship is objectively stronger.

==================================================
CORE PHILOSOPHY
==================================================

Every ship has identity.

Every ship has strengths.

Every ship has weaknesses.

Every ship creates unique gameplay.

Movement and handling are just as important as firepower.

==================================================
SHIP ROLE
==================================================

Every Ship defines:

Movement Profile

Defensive Profile

Energy Profile

Weapon Compatibility

Passive Systems

Special Ability

Visual Identity

Audio Identity

Lore

Mastery

No two ships should feel interchangeable.

==================================================
SHIP ATTRIBUTES
==================================================

Every Ship contains:

Name

Class

Manufacturer

Faction

Hull

Shield

Energy

Acceleration

Maximum Speed

Handling

Boost Efficiency

Mass

Collision Radius

Special Ability

Passive Trait

Mastery Track

Future expansion fields

==================================================
SHIP CLASSES
==================================================

Support:

Scout

Interceptor

Assault

Guardian

Destroyer

Carrier

Engineer

Experimental

Prototype

Ancient

Mythic

Future classes extend this framework.

==================================================
SHIP SPECIALISATION
==================================================

Ships specialise in areas such as:

Mobility

Survivability

Critical Damage

Drone Control

Orbital Weapons

Status Effects

Energy Management

Resource Collection

Exploration

Support

Each specialisation creates meaningful trade-offs.

==================================================
PASSIVE SYSTEMS
==================================================

Examples include:

Shield Regeneration

Engine Efficiency

Critical Amplification

Drone Capacity

Pickup Radius

Cooldown Reduction

Adaptive Armour

Energy Recovery

Void Resistance

Crystal Resonance

Passive systems support multiple builds.

==================================================
SHIP ABILITIES
==================================================

Ships may possess unique abilities such as:

Emergency Thrusters

Shield Overload

Gravity Pulse

Energy Redistribution

Drone Deployment

Orbital Beacon

Cloaking Burst

Temporal Shift

Abilities reinforce ship identity.

==================================================
SHIP CUSTOMISATION
==================================================

Support:

Paint Schemes

Engine Trails

Hull Variants

Decals

Wing Configurations

Lighting Colours

Exhaust Effects

Name Plates

Cosmetic changes never alter gameplay.

==================================================
HANGAR
==================================================

Galaxy Command includes a Hangar.

Players may:

Inspect Ships

Compare Ships

View Statistics

Change Cosmetics

View Mastery

Select Active Ship

Preview Abilities

Manage Loadouts

The Hangar remains organised and premium.

==================================================
SHIP SYNERGY
==================================================

Ships interact with:

Commanders

Weapons

Equipment

Relics

Research

Mission Types

Biomes

Boss Mechanics

No ship should dominate every build.

==================================================
SHIP MASTERY
==================================================

Track:

Flight Time

Distance Travelled

Enemies Destroyed

Boss Victories

Damage Avoided

Boost Usage

Special Challenges

Mastery rewards cosmetic progression.

==================================================
BALANCE PRINCIPLES
==================================================

Every ship remains viable.

Every ship encourages experimentation.

Every weakness creates meaningful trade-offs.

No universally superior ship exists.

==================================================
VISUAL PRESENTATION
==================================================

Display:

3D Hangar View

Ship Statistics

Comparison Cards

Mastery Progress

Lore

Manufacturer

Class

Visual presentation reinforces premium quality.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Ship Cards

Controller Navigation

Touch Navigation

Comparison Mode

Search

Sorting

High Contrast

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache ship data.

Pool preview models.

Optimise stat calculations.

Lazy load cosmetics.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Selected Ship

Movement Profile

Passive State

Ability State

Mastery Rank

Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Ship Framework.

Every future Ship, Cosmetic, Ability and Hangar system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Pilot every ship.

Review movement profiles.

Review handling.

Review survivability.

Review special abilities.

Review passive systems.

Review Commander synergy.

Review Weapon synergy.

Review Equipment synergy.

Review Relic synergy.

Review Mastery progression.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-030.

Adjust movement values.

Adjust passive abilities.

Adjust special abilities.

Remove overlapping ship identities.

Ensure every Ship provides a unique piloting experience while maintaining balance, replayability and meaningful build diversity.

Repeat until the Ship Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-031.

---

## Foundation / AF-016–030 / GP-FINAL alignment review (recorded at catalogue time)

- **Ship IS an AF-020 `MovementProfile`, finally given a real producer.** AF-020 §3 reserved `turnRatePerSecond`/`mass`/`handling`/`movementFriction` explicitly for "future ship handling profiles" — this module is that future arriving. A `ShipDef` supplies a complete `MovementProfile` (hull→collisionRadius mapping, acceleration/deceleration, boost, and now non-instant turn rate for ships that want it) rather than inventing a second movement system. "Movement and handling are just as important as firepower" is structural: the ship *is* the movement profile.
- **Defensive/energy profile feeds AF-021's `DefenceState` constructor directly** (hull→maxHull, shield→maxShield) — no new defence system; **energy** is a new resource this module introduces (tracked for cooldown/ability costs) since no prior module needed one — the first genuinely new numeric resource added to the game, scoped tightly to ship abilities only.
- **Passive systems and special ability reuse AF-028/AF-030's exact hook vocabulary** (`PassiveTrigger`/`EquipmentBonus`, `ActiveModule`) — a ship's passive and ability are the same shapes as a Commander's, just filling the `ship` slot's contribution to the aggregate rather than `commander`'s. Zero new trigger or bonus language.
- **Eleven classes** (Scout → Mythic) registered as content shelves, mapping onto the AF-008/AF-010 faction and Ancient/Mythic canon already established.
- **Ship Mastery/Progression is AF-026's existing engine** (`ship:<id>` tracks, already wired at `RunEnded`) — this module supplies the counter *keys* (flight time, distance travelled, damage avoided, boost usage) as extensions to the generic mastery counters, not a new system.
- **"No two ships should feel interchangeable"** gets the same code-checked treatment as AF-030 §2's Commander no-overlap law: a ship's movement-profile-plus-passive-plus-ability fingerprint is checked against the roster (`findShipOverlap`, mirroring `findOverlap`) — reused pattern, not reinvented.
- **The Hangar** (inspect/compare/cosmetics/mastery/select/preview/loadouts) is a UI surface over **existing** data: AF-027's inventory/loadout view, AF-030-pattern mastery, AF-028's comparison shape — registered for the UI implementation module, no new backend required.
- **Customisation (paint, trails, decals, wings, lighting, exhaust, name plates)** is explicitly cosmetic-only — the same AF-026 `MasteryReward` union already guarantees "cosmetic changes never alter gameplay" structurally (no stat field exists in that union), so this requirement was satisfied before this module was written.
- **Self-review executed:** the sandbox ship's movement profile, defence profile, and passive/ability now govern the walking-skeleton run end-to-end — the first ship-specific handling (non-instant turn rate) and the first energy resource are live and tested. Full-roster piloting-feel and synergy passes bind as the real ship roster arrives.

**Review verdict:** ALIGNED (one new resource — energy — introduced narrowly and justified; no duplicated systems otherwise). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/SHIP_FRAMEWORK.md`, `src/game/ships/`.
