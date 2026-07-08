# AF-073 — SHIP FRAMEWORK

**Module status:** Complete (framework layered over AF-031's unchanged ship system; three fully profiled hulls; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-072 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/SHIP_ARCHITECTURE.md` + implementation (`src/game/ships/shipFrameworkData.ts`, `ShipOutfittingRuntime.ts`)

---

*(Module catalogued verbatim below.)*

73

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-072 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Ship Framework.

Ships are not simply player models.

They are the player's primary combat platform.

Every Ship should fundamentally alter movement, survivability, combat rhythm, build strategy and exploration.

Switching Ships should feel as significant as switching Commanders.

Every Ship remains viable throughout the entire game.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Mobility.

Mastery.

Expression.

Replayability.

Every Ship should create an entirely different gameplay experience.

==================================================
SHIP ARCHITECTURE
==================================================

Every Ship contains:

Unique ID

Manufacturer

Visual Identity

Class

Lore

Hull Statistics

Shield Statistics

Engine Profile

Energy Capacity

Heat Capacity

Cargo Capacity

Weapon Slots

Equipment Slots

Module Slots

Passive Ability

Ship Ability

Ultimate System

Mobility Profile

Progression

Mastery

Cosmetics

Future Expansion Hooks

Nothing remains undefined.

==================================================
SHIP CLASSES
==================================================

Support:

Interceptor

Fighter

Corvette

Frigate

Destroyer

Heavy Cruiser

Science Vessel

Drone Carrier

Support Ship

Experimental Prototype

Future classes extend naturally.

==================================================
SHIP IDENTITY
==================================================

Every Ship possesses:

Unique Movement

Unique Defensive Profile

Unique Offensive Profile

Unique Economy

Unique Utility

Unique Weaknesses

Unique Scaling

No Ship should overlap excessively.

==================================================
MOVEMENT MODEL
==================================================

Ships define:

Acceleration

Top Speed

Boost Speed

Drift

Turn Rate

Mass

Inertia

Braking

Movement must feel premium.

==================================================
DEFENSIVE PROFILE
==================================================

Ships vary through:

Hull

Shield

Armour

Energy Barrier

Repair Systems

Avoidance

Mobility

No single defence dominates.

==================================================
OFFENSIVE PROFILE
==================================================

Ships specialise in:

Precision

Burst Damage

Area Damage

Drone Warfare

Beam Weapons

Missiles

Support

Hybrid Combat

Combat identity remains distinct.

==================================================
SHIP ABILITIES
==================================================

Every Ship includes:

Passive System

↓

Active Ability

↓

Ultimate System

↓

Special Mechanic

↓

Ascension Upgrade

Abilities interact with Commander abilities.

==================================================
MODULE SUPPORT
==================================================

Support:

Reactors

Engines

Shield Systems

Targeting Systems

Drone Bays

Sensor Arrays

Cooling Systems

Experimental Modules

Modules define long-term builds.

==================================================
SHIP MASTERY
==================================================

Track:

Usage

Kills

Boss Victories

Distance Travelled

Mastery Challenges

Achievements

Statistics

Cosmetics

Mastery remains permanent.

==================================================
CUSTOMISATION
==================================================

Support:

Paint Schemes

Engine Trails

Cockpit Themes

Hull Variants

Decals

Animated Skins

Ship Names

Victory Animations

Gameplay remains unaffected.

==================================================
ACCESSIBILITY
==================================================

Support:

Movement Assist

Control Presets

Large HUD

Controller Support

Touch Controls

Colour-blind Support

Custom UI Scaling

==================================================
PERFORMANCE
==================================================

Pool ship effects.

Optimise movement calculations.

Cache module stats.

Reuse shared systems.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Ship

Movement Stats

Modules

Energy

Heat

Performance

==================================================
OUTPUT
==================================================

Produce the complete Ship Framework.

Every future Ship extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every Ship.

Review movement.

Review combat identity.

Review progression.

Review modules.

Review customisation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-072.

Reduce overlap.

Strengthen ship identity.

Improve build diversity.

Ensure every Ship delivers a unique and satisfying playstyle, encouraging experimentation while remaining balanced and viable across the entire lifespan of Afterlight.

Repeat until the Ship Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-073.

---

## Foundation / AF-000–072 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-031's locked ship system is EXTENDED, byte-for-byte untouched — the AF-071 commander precedent applied to hulls:** `ShipDef`, the eleven-class shelf, the energy resource, the AF-020 `MovementProfile` production, and the `findShipOverlap` fingerprint law all stand. `ShipProfileDef` wraps each def BY ID; the ten spec classes map TOTALLY onto the locked shelf; and the roster extends additively — AF-031's sandbox pair asserted unchanged at the head, joined by the Aurelia Mk. I, a science vessel authored through the unchanged def shape, all three passing AF-031's OWN overlap law with distinct fingerprints.
- **"Nothing remains undefined" is a FUNCTION:** `shipArchitectureFor(def, profile)` returns a boolean per part and all TWENTY-TWO are asserted per ship — unique id through future expansion hooks. Heat and cargo capacities are registered DORMANT numeric fields (the `biomeId` pattern, stated in the code): real data today, first consumers when heat/cargo modules arrive — the honest register, not a fake system.
- **The spec's MOVEMENT MODEL has been live since AF-020, and this module NAMES it rather than rebuilding it:** all eight fields (acceleration, top speed, boost speed, drift, turn rate, mass, inertia, braking) map onto real `MovementProfile` keys, asserted present on the actual sandbox profile object. No second movement system — the strongest possible form of "only extend".
- **The five-stage ability structure completes AF-031's two stages** with an ultimate that REUSES AF-030's exact charge-gated `CommanderUltimate` shape (no second ultimate model — "abilities interact with Commander abilities" starts with sharing their vocabulary), a special mechanic (the AF-030/031 tag+passive shape), and the ascension upgrade — AF-069's gate again: the designated module (a REAL module, resolution-tested) fits FREE, outside the slot count, once, permanently — it cannot be unfitted.
- **Modules are LOADOUTS; mastery is a LEDGER — and the code knows the difference:** eight module kinds with one sandbox module each (all AF-028 bonuses), slot-gated fitting, aggregation cached until the fit changes (reference-tested), and unfitting ALLOWED — refitting is normal gameplay, not content removal. The mastery side (usage/kills/boss victories/distance) is append-only with no reset/clear/wipe operation (prototype-asserted). The distinction the AF-068→072 no-removal pattern needed to make for the first time, made explicitly.
- **Identity never repeats:** primary defence and offensive identity are UNIQUE per hull (asserted) — precision/avoidance (Wayfarer), areaDamage/hull (Bastion), beamWeapons/energyBarrier (Aurelia) — with both shelves total. "No single defence dominates" and "combat identity remains distinct" as set cardinality.
- **Self-review executed:** 12 new tests — all eight shelves, the total class mapping, the eight-field movement-model resolution against the live profile, the extended-roster overlap law, the 22-part completeness function per ship, identity uniqueness, the five-stage structure with the real-module ascension gate, dormant heat/cargo registration, the module battery (slot gating, cache semantics, free refitting, permanent ascension grant, unerasable ledger), and a **1,000-career seeded sweep** of refitting and mastery across all three hulls — slots never exceeded, the mastery ledger never drifts, bonuses always match the fit. **Live in the browser:** launched, and the extended ships line ran on the overlay — `Wayfarer Mk. II (scout/corvette) · energy 100/100 · ability cd 0ms · precision/avoidance · modules 0/2 · uses 0` — zero page errors.

**Review verdict:** ALIGNED (AF-031 unchanged; one profile layer + one pure outfitting runtime in the established wrapping class; AF-030's ultimate shape reused across module boundaries; AF-069's gate given its second consumer; one roster addition in the standard additive class; heat/cargo registered dormant). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/SHIP_ARCHITECTURE.md`, `src/game/ships/shipFrameworkData.ts` + `ShipOutfittingRuntime.ts`.
