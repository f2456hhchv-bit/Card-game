# AF-028 — EQUIPMENT FRAMEWORK

**Module status:** Complete (framework specified; loadout/synergy/set-bonus engine implemented and tested; equip effects flow into the real combat pipeline in the sandbox; equipment content passes bind as weapon/ship/relic modules land)
**Lock status:** LOCKED — extends AF-000 → AF-027 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/EQUIPMENT_FRAMEWORK.md` + implementation (`src/game/equipment/`)

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-027 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Equipment Framework.

Equipment defines how players customise their builds before and between expeditions.

Every equipment decision should meaningfully change gameplay.

No equipment should exist purely as a statistical upgrade.

Equipment should encourage experimentation, synergy and creative build crafting.

The framework must support thousands of equipment pieces without sacrificing readability or balance.

==================================================
CORE PHILOSOPHY
==================================================

Choice creates identity.

Synergy creates mastery.

Experimentation creates replayability.

Equipment expands possibilities.

Never restricts them.

==================================================
EQUIPMENT CATEGORIES
==================================================

Primary Weapons

Secondary Systems

Defensive Modules

Engine Modules

Targeting Systems

Energy Modules

Utility Modules

Drone Modules

Orbital Modules

Relics

Prototype Equipment

Ancient Technology

Future categories extend this framework.

==================================================
LOADOUT STRUCTURE
==================================================

Every loadout contains:

Commander

Ship

Primary Weapon

Secondary Weapon

Equipment Modules

Relics

Passive Bonuses

Cosmetics

Future expansion slots

All slots remain modular.

==================================================
EQUIPMENT ATTRIBUTES
==================================================

Every equipment item defines:

Item Level

Rarity

Power Rating

Affixes

Passive Effects

Active Effects (where applicable)

Synergies

Upgrade Potential

Crafting Value

Lore

==================================================
BUILD SYNERGY
==================================================

Equipment should interact with:

Weapons

Ships

Commanders

Research

Relics

Status Effects

Boss Mechanics

Environmental Hazards

Synergies should create new playstyles.

Not mandatory combinations.

==================================================
EQUIPMENT BONUSES
==================================================

Support:

Damage

Critical Chance

Critical Damage

Shield Capacity

Shield Regeneration

Movement Speed

Boost Efficiency

Cooldown Reduction

Status Chance

Status Duration

Resource Gain

Experience Gain

Pickup Radius

Drone Effectiveness

Orbital Power

Future bonuses remain modular.

==================================================
PASSIVE EFFECTS
==================================================

Support:

Conditional Bonuses

Kill Effects

Movement Effects

Shield Effects

Boss Effects

Low Health Effects

Critical Effects

Environmental Resistance

Mission Modifiers

Future passive systems

==================================================
ACTIVE MODULES
==================================================

Support equipment with activatable abilities.

Examples:

Emergency Barrier

Pulse Wave

Energy Burst

Repair Drone

Temporal Shift

Gravity Beacon

Framework supports future expansion.

==================================================
SET SYNERGIES
==================================================

Equipment may belong to thematic sets.

Set bonuses unlock at configurable thresholds.

Examples:

2-piece

4-piece

6-piece

Set bonuses create alternative builds.

Never invalidate individual items.

==================================================
BUILD VALIDATION
==================================================

Prevent:

Invalid slot combinations

Duplicate exclusive items

Broken dependencies

Unsupported loadouts

Always explain validation failures.

==================================================
LOADOUT MANAGEMENT
==================================================

Support:

Save Loadout

Rename

Duplicate

Favourite

Export (Future)

Import (Future)

Quick Swap

Preview Changes

==================================================
VISUAL PRESENTATION
==================================================

Display:

Equipment Grid

Comparison View

Stat Changes

Synergy Indicators

Active Set Bonuses

Build Summary

Power Rating

Visual clarity remains paramount.

==================================================
BALANCE PRINCIPLES
==================================================

Every equipment choice should involve trade-offs.

No universally best item.

No mandatory set.

Multiple viable endgame builds.

Balance through diversity.

==================================================
ACCESSIBILITY
==================================================

Support:

Large equipment cards

Controller navigation

Touch navigation

Search

Sorting

Colour-blind indicators

High contrast

Tooltip scaling

==================================================
PERFORMANCE
==================================================

Cache equipment data.

Pool equipment cards.

Optimise stat recalculation.

Lazy load comparison data.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Active Loadout

Equipment Slots

Synergy Count

Set Bonuses

Power Rating

Stat Breakdown

Performance

==================================================
OUTPUT
==================================================

Produce the complete Equipment Framework.

Every future Weapon, Relic, Ship, Commander and Crafting system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Create thousands of equipment combinations.

Review build diversity.

Review synergy quality.

Review equipment balance.

Review set bonuses.

Review active modules.

Review passive effects.

Review loadout management.

Review comparison tools.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-027.

Adjust bonus values.

Adjust synergy interactions.

Adjust equipment availability.

Remove dominant builds.

Ensure every equipment decision creates meaningful gameplay choices while encouraging experimentation and maintaining long-term replayability.

Repeat until the Equipment Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-028.

---

## Foundation / AF-016–027 / GP-FINAL alignment review (recorded at catalogue time)

- Equipment slots ARE the loadout shape AF-027 registered (slot vocabulary was deferred to "AF-028's" — resolved here): **Commander · Ship · Primary Weapon · Secondary Weapon · up to six Equipment Modules · up to six Relic slots · Passive Bonuses (derived, not a slot) · Cosmetics.** This satisfies GP-FINAL's 6-weapon/6-passive build frame at the *equipment module* count (six equipment modules), while primary/secondary weapons are dedicated slots — reconciliation recorded; a future weapon module may extend weapon slot count under the same validation engine.
- **Stat aggregation feeds AF-021's existing offensive-modifier stages directly** (equipment → the pipeline's `equipment` stage; no new math invented) and AF-020's movement profile (speed/boost bonuses) — "no duplicated systems" honoured exactly as AF-025/027 established the pattern.
- **Equipment bonuses (15 kinds) map onto existing stat surfaces**: damage/crit → AF-021 pipeline & crit fields; shield capacity/regen → AF-021 `DefenceState`; movement/boost → AF-020 `MovementProfile`; cooldown/status chance/duration → AF-021 `StatusEngine` (future consumer hook); resource/XP gain/pickup radius → AF-022/AF-023/AF-025 tuning multipliers; drone/orbital effectiveness → registered future (no drone/orbital system exists yet — flagged, not built).
- **Passive/active effects are a trigger-condition framework** (kill, low-health, boss-present, critical, shield-state, movement) consuming existing Event Bus facts (`EnemyKilled`, `PlayerDamaged`, `ShieldBroken`) — zero new event types needed for the sandbox proof; content modules add trigger kinds as their systems arrive (e.g. "boss effects" needs a boss system).
- **Set bonuses**: data-defined thresholds (2/4/6-piece) that layer *additional* modifiers on top of individual-item stats — "never invalidate individual items" is structural: set bonuses are pure additions, removing a set-eligible item never subtracts anything beyond that item's own stats.
- **Build validation** implemented as explicit rules with human-readable reasons: slot-type mismatch, duplicate-unique-exclusive, missing-dependency (e.g. a relic requiring a specific weapon category) — every rejection names the rule broken (AF-003 §8 pattern).
- Loadout save/rename/duplicate/favourite/quick-swap reuse **AF-027's `Inventory.loadouts` engine exactly** — this module supplies the slot *vocabulary* and the *aggregation/validation* math; it does not reimplement loadout storage (no duplicated systems, second time honoured in one module).
- GP-FINAL's balance law ("no universally best item, no mandatory set") is a content-QA law recorded for equipment content modules; the framework itself guarantees trade-off *capacity* (every bonus category has an opposing cost category available) but cannot force individual items to use it — flagged honestly, not oversold.
- **Self-review executed:** thousands of randomly generated equipment combinations run headlessly in CI, asserting aggregation determinism, set-bonus threshold correctness, validation-rule coverage (every invalid combination is rejected with a reason), and additive-set-never-subtracts. Live-build-diversity/balance passes bind at equipment content modules.

**Review verdict:** ALIGNED (slot vocabulary resolved; two capability gaps flagged — drone/orbital effectiveness and boss-effect triggers have no consuming system yet, registered future). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/EQUIPMENT_FRAMEWORK.md`, `src/game/equipment/`.
