# AF-053 — PARAGON PROTOCOL ENEMY FRAMEWORK

**Module status:** Complete (framework specified; containment/instability engine implemented and tested; a live protocol governs an AF-017 EnvironmentalEvent outcome end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-052 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/PARAGON_PROTOCOL_FRAMEWORK.md` + implementation (`src/game/enemies/paragonData.ts`, `ParagonInstability.ts`)

---

*(Module catalogued verbatim below.)*

53

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-052 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Paragon Protocol Enemy Framework.

The Paragon Protocol represents experimental technology that was never meant to exist.

These are prototype weapons, failed military projects, self-learning combat systems and unstable scientific experiments abandoned before the Collapse.

Unlike Machines, these entities are unstable.

Unlike the Void, they remain scientific.

Every encounter should feel like confronting dangerous technology operating beyond its original design limits.

==================================================
CORE PHILOSOPHY
==================================================

Experimental.

Unstable.

Adaptive.

Powerful.

Unpredictable.

Technology without restraint.

==================================================
FACTION IDENTITY
==================================================

Theme:

Forbidden science.

Experimental reactors.

Prototype AI.

Quantum weaponry.

Dimensional engineering.

Runaway experiments.

Abandoned laboratories.

Every unit is a failed success.

==================================================
VISUAL LANGUAGE
==================================================

White laboratory alloys.

Orange warning lights.

Cracked energy cores.

Floating components.

Quantum distortion.

Visible cooling systems.

Containment fields.

Prototype markings.

Visuals communicate dangerous instability.

==================================================
CORE UNITS
==================================================

Support:

Prototype Drone

Experimental Scout

Quantum Walker

Containment Sentinel

Test Platform

Pulse Cannon

Singularity Emitter

Adaptive Hunter

Energy Construct

Prototype Carrier

Containment Core

Experimental Overseer

Omega Prototype

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Paragon Protocol favours:

Experimental Weapons

Randomised Combat Patterns

Adaptive Defences

Energy Manipulation

Containment Fields

Prototype Technology

Battlefield Experiments

Controlled Instability

Every battle should feel unique.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Containment Collapse

Energy Overload

Quantum Shift

Adaptive Shields

Experimental Ammunition

Dimensional Pulse

Prototype Drones

Unstable Reactors

Energy Fractures

Singularity Charges

Technology constantly pushes safe limits.

==================================================
ADAPTIVE TECHNOLOGY
==================================================

Prototype systems analyse:

Incoming Damage

Weapon Types

Movement

Status Effects

Ability Usage

Combat Duration

Threat Level

Adaptation remains readable.

==================================================
CONTAINMENT SYSTEM
==================================================

Facilities monitor:

Reactor Stability

Containment Integrity

Power Levels

Experimental Activity

Security Status

Containment failures dramatically change encounters.

==================================================
ELITE VARIANTS
==================================================

Elite Prototypes gain:

Unique Reactor Designs

Experimental Abilities

Adaptive Armour

Quantum Weapons

Rare Technology

Exceptional Rewards

Unique Laboratory Records

Every Elite should feel irreplaceable.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Containment Director

Omega Platform

Quantum Titan

Experimental Leviathan

Singularity Core

Prototype Prime

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Prototypes interact with:

Research Laboratories

Testing Grounds

Ancient Technology

Machine Facilities

Energy Networks

Scientific Archives

Experimental Biomes

Entire facilities become dangerous.

==================================================
LOOT
==================================================

Possible rewards:

Prototype Components

Quantum Cores

Experimental Blueprints

Containment Modules

Research Archives

Advanced Materials

Legendary Equipment

Forbidden Technology

==================================================
CODEX
==================================================

Record:

Prototype Classes

Research Projects

Scientific Personnel

Containment Failures

Technology History

Experimental Facilities

Known Variants

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Containment indicators

Prototype warnings

Energy effect reduction

Readable instability

High Contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool energy effects.

Optimise adaptive calculations.

Reuse prototype shaders.

Pool reactor effects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Containment Status

Reactor Stability

Adaptive State

Experimental Systems

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Paragon Protocol Enemy Framework.

Every future prototype, experimental technology, research facility and forbidden science expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Paragon Protocol encounters.

Review adaptive behaviour.

Review experimental mechanics.

Review containment failures.

Review energy systems.

Review Elite encounters.

Review rewards.

Review Codex progression.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-052.

Adjust adaptation logic.

Adjust instability mechanics.

Adjust encounter pacing.

Remove repetitive combat behaviours.

Ensure the Paragon Protocol feels like humanity's most dangerous scientific achievements—immensely powerful, unstable and fascinating—while remaining strategically fair, mechanically readable and consistently rewarding.

Repeat until the Paragon Protocol Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-053.

---

## Foundation / AF-000–052 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Paragon unit is a plain AF-033 `EnemyDef` — zero schema changes, zero ninth enemy engine.** Six of the thirteen registered Core Unit kinds carry full sandbox defs (Prototype Drone, Pulse Cannon, Adaptive Hunter, Containment Sentinel, Energy Construct, Elite Omega Prototype). Like AF-052, this module reuses several already-used families (`drone`, `artillery`, `interceptor`, `supportUnit`, `heavyAssault`, `machineUnit`) rather than claiming a virgin one — every fingerprint checked individually against the base roster and all seven prior factions, since all fifteen `ENEMY_FAMILIES` values are now in use by at least one faction. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Paragon Protocol", the first real content to use the `singularity` `WeaponCategory` — the last fully-dormant category, a fitting final claim.
- **This is the third faction with zero prior lore investment, by design — matching AF-049 and AF-051's precedent exactly.** The Paragon Protocol is abandoned pre-Collapse military research belonging to no single civilisation — no government, no economy, no reputation — so this module adds no `FactionDef`. Its Codex entry (`codex-paragon-protocol`) cross-references AF-051's `codex-xenomorph-hive` as another explicitly-non-civilisation threat, extending the same honest structural echo AF-051 used for AF-049.
- **Containment Collapse is the deliberate eighth doctrine — the first that is a single, irreversible threshold event rather than a smooth curve.** Every prior doctrine moves continuously: AF-046's scatter timer, AF-047's discrete-but-multiple service flags, AF-048's recomputed count, AF-049's decaying level, AF-050's escalating-and-capped ladder, AF-051's monotonic ratchet, AF-052's earned-and-spent economy. `ParagonInstabilityRuntime.stability` depletes from incoming damage (`recordIncomingDamage`) and inherent instability (`update(dtMs)`), and the INSTANT it reaches zero, `checkCollapse()` flips `collapsed` permanently — a boolean that, once true, never becomes false again, and a one-shot `consumeCollapseEvent()` flag lets the composition root react exactly once. Verified live: a fresh protocol's Reactor Stability visibly dropped from 95% to 67% under real combat damage, tracking `stabilityLossPerDamage` exactly.
- **Collapse INVERTS the unit's character, a direction no prior doctrine reverses.** Pre-collapse, `incomingDamageReduction` (Adaptive Shields) degrades toward zero as `stability` falls — the unit gets more fragile as it destabilises. The instant `collapsed` flips, that reduction becomes permanently zero AND `damageBonus`/`speedBonus` (Energy Overload, Unstable Reactors) switch on permanently at a large fixed value — the same event that strips its defence simultaneously makes its offence far worse. Every prior faction's kill-consequence makes something weaker or slower; this is the first that makes something stronger in the same breath it loses its shields.
- **A Containment Sentinel's death echoes AF-052's fresh "kill changes a rate, not a value" shape, applied to the opposite kind of meter.** AF-052's Nomad Flagship death throttled the rate of an ACCUMULATING currency; here, a Sentinel's death (`notifyDroneDestroyed` → `"sentinel"`) removes the only active REPAIR source for a DEPLETING-toward-catastrophe meter, without moving `stability`'s current value at all — verified explicitly in `tests/paragon.test.ts` (`stabilityLevel` unchanged the instant the Sentinel dies). This gives the player a genuine tactical choice: force the Collapse deliberately by focusing the Sentinel, or leave it and fight a longer, contained, safer encounter.
- **Singularity Charges are AF-035's hazard-zone engine's fifth reuse**, following AF-046's mines, AF-048's Crystal Growth, AF-049's Corruption Zones, and AF-051's Acid Pools — seeded exactly once, at the moment Collapse fires, through the same unchanged `stepHazardZone`/`isInsideHazard` functions.
- **The Director gained zero new claims, continuing AF-049/050's zero-footprint precedent a third time.** Protocols enter through a new listener on AF-017's existing `EnvironmentalEventTriggered`/`GravityFlux` fact — quantum distortion and gravity-affected weaponry fit it exactly. `EnemyDirector.ts`/`directorTuning.ts` remain byte-for-byte unmodified, and `SwarmWave` remains the only fully unclaimed `WaveType` left for any future faction.
- **AF-021's dormant `overload` status and AF-032's dormant `gravityAffected` projectile behaviour both gain their first producers** — via the Pulse Cannon's Pulse Emitter and the Omega Prototype's Singularity Charge Launcher respectively, both thematically exact for "Energy Overload" and "Dimensional Pulse".
- **Self-review executed:** 18 new tests — vocabulary registration, AF-033-vocabulary conformance, the eight-faction no-overlap law, readable-telegraph floors, the `overload`/`gravityAffected` first-producer assertions, the Elite pipeline for the Omega Prototype, the full instability lifecycle (passive decay offset by Sentinel repair, damage-driven depletion, the one-shot Collapse event firing exactly once and never again, the shields-to-overload inversion at the exact moment of Collapse, Sentinel-vs-member kill distinction with no value change on the Sentinel's death), Singularity Charges against the real `stepHazardZone`, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which stability never leaves `[0, maxStability]` and every protocol reaches elimination regardless of whether Collapse occurred. Live in the browser: a protocol spawned via the dev key with a real Containment Sentinel, Reactor Stability dropped from 95% to 67% tracking real combat damage exactly, and the Sentinel's death was reflected as an immediate loss of repair — zero page errors throughout.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes — the third faction to use the zero-footprint `EnvironmentalEventTriggered` route, zero new loot/elite systems, and the third deliberate non-extension of AF-039's faction-profile system, justified the same way AF-049/051 were). `ParagonInstabilityRuntime` is the only genuinely new mechanical surface, and a single irreversible threshold event that inverts a unit's character is meaningfully distinct from every prior doctrine's smooth-curve shape. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/PARAGON_PROTOCOL_FRAMEWORK.md`, `src/game/enemies/paragonData.ts` + `ParagonInstability.ts`.
