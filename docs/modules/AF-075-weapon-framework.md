# AF-075 — WEAPON FRAMEWORK

**Module status:** Complete (framework layered over AF-032's unchanged weapon system; five fully profiled weapons; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-074 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/WEAPON_ARCHITECTURE.md` + implementation (`src/game/weapons/weaponFrameworkData.ts`, `WeaponMasteryRuntime.ts`)

---

*(Module catalogued verbatim below.)*

75

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-074 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Weapon Framework.

Weapons are not simple damage sources.

Every weapon should define combat rhythm.

Changing weapons should fundamentally alter movement, positioning, target priority, resource management and build strategy.

A weapon should feel like selecting an entirely new combat philosophy.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Precision.

Mastery.

Variety.

Expression.

Every weapon should feel satisfying from the very first shot.

==================================================
WEAPON ARCHITECTURE
==================================================

Every Weapon contains:

Unique ID

Manufacturer

Category

Visual Identity

Lore

Fire Behaviour

Damage Profile

Scaling

Range

Projectile Behaviour

Ammo / Energy Rules

Heat Generation

Critical Behaviour

Passive Trait

Unique Mechanic

Evolution Path

Mastery

Statistics

Cosmetics

Future Expansion Hooks

Nothing remains undefined.

==================================================
WEAPON CATEGORIES
==================================================

Support:

Assault Cannons

Pulse Rifles

Railguns

Laser Arrays

Beam Weapons

Missile Launchers

Rocket Batteries

Shotguns

Plasma Weapons

Arc Weapons

Drone Controllers

Gravity Weapons

Cryo Weapons

Flamethrowers

Biological Weapons

Void Weapons

Experimental Weapons

Future weapon types extend naturally.

==================================================
COMBAT IDENTITY
==================================================

Every weapon possesses:

Unique Rhythm

Unique Positioning

Unique Target Priority

Unique Scaling

Unique Strengths

Unique Weaknesses

Unique Synergies

No two weapons should feel interchangeable.

==================================================
FIRE MODES
==================================================

Support:

Single Fire

Burst Fire

Automatic

Charge Fire

Beam

Continuous Fire

Volley

Chain Fire

Orbital Strike

Area Pulse

Future firing modes extend naturally.

==================================================
PROJECTILE SYSTEM
==================================================

Support:

Hitscan

Physical Projectiles

Seeking Missiles

Ricochet

Piercing

Explosive

Chain Lightning

Gravity Wells

Orbiting Projectiles

Splitting Shots

Projectile behaviour remains data-driven.

==================================================
ELEMENTAL SUPPORT
==================================================

Weapons may inflict:

Kinetic

Thermal

Cryogenic

Electrical

Plasma

Corrosive

Radiation

Void

Resonance

Quantum

Elements integrate with status systems.

==================================================
WEAPON EVOLUTION
==================================================

Weapons evolve through:

Research

Blueprints

Mastery

Legendary Upgrades

Prototype Technology

Ancient Technology

Evolution enhances identity.

Not replaces it.

==================================================
WEAPON MASTERY
==================================================

Track:

Kills

Accuracy

Critical Hits

Boss Damage

Distance

Build Diversity

Challenges

Achievements

Mastery remains permanent.

==================================================
WEAPON SYNERGY
==================================================

Weapons interact with:

Ships

Commanders

Research

Relics

Equipment

Talents

Biome Modifiers

Every build feels interconnected.

==================================================
CUSTOMISATION
==================================================

Support:

Weapon Skins

Projectile Colours

Impact Effects

Audio Packs

Manufacturer Themes

Inspection Animations

Kill Effects

Gameplay remains unchanged.

==================================================
ACCESSIBILITY
==================================================

Support:

Reticle Options

Projectile Visibility

Colour-blind Support

Large HUD

Controller Aim Assist

Touch Controls

Motion Reduction

==================================================
PERFORMANCE
==================================================

Pool projectiles.

Optimise collision.

Cache weapon statistics.

Reuse visual effects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Weapon

Damage

Fire Rate

Accuracy

Projectile Count

Performance

==================================================
OUTPUT
==================================================

Produce the complete Weapon Framework.

Every future weapon extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every weapon.

Review combat identity.

Review projectile behaviour.

Review build diversity.

Review evolution.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-074.

Reduce overlap.

Strengthen weapon identity.

Improve combat satisfaction.

Ensure every weapon creates a distinct combat experience, encouraging experimentation and mastery while remaining balanced and satisfying throughout the entire lifespan of Afterlight.

Repeat until the Weapon Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-075.

---

## Foundation / AF-000–074 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-032's locked weapon system is EXTENDED, byte-for-byte untouched — the AF-071/073 profile precedent applied to weapons:** `WeaponDef`, the fifteen-category shelf, the twelve fire patterns, the twelve projectile behaviours, the evolution model, and the `findWeaponOverlap` fingerprint law all stand. `WeaponProfileDef` wraps each def BY ID, and the arsenal extends additively — AF-032's four weapons asserted unchanged at the head, joined by the HAILBORN ARRAY, a cryo weapon through the unchanged def shape that gives the `freeze` status its first WEAPON producer (AF-064's Frozen Reach was the first overall — the cold spreads from biome to arsenal through the same status registry).
- **THREE spec vocabularies land as TOTAL MAPS onto locked shelves:** seventeen framework categories onto AF-032's fifteen categories, ten fire modes onto its twelve patterns, ten projectile-system kinds onto its twelve behaviours — the biome-weather naming-layer discipline, applied three times in one module. No second fire, projectile, or category engine.
- **"Elements integrate with status systems" is a total map WITH a consistency law:** ten elements onto AF-021's status kinds (thermal→burn, cryogenic→freeze, electrical→shock, corrosive→armourBreak, radiation→poison, void→corruption, resonance→shieldBreak, quantum→overload) with kinetic→none — purity is a mapping too. And the layers are BOUND: every profile's element must agree with its def's actual `statusOnHit`, asserted across the arsenal — the element layer NAMES what the weapon already does; it cannot invent behaviour.
- **"Nothing remains undefined" is a FUNCTION:** `weaponArchitectureFor` asserts all TWENTY architecture parts per weapon — unique id through future expansion hooks — with heat generation as a registered DORMANT numeric (the AF-073 pattern, awaiting heat systems as first consumer).
- **"Evolution enhances identity. Not replaces it." follows AF-032's OWN precedent:** the Coil Ripper evolves into the Coil Ripper Mk. II with a category shift (ballistic→arc), so identity preservation is NAME LINEAGE and MANUFACTURER — both asserted to survive evolution — with each evolving weapon's profile naming one of the six registered evolution sources.
- **Mastery is a LEDGER fed by REAL combat:** `WeaponMasteryRuntime` accumulates shots/hits/criticals/kills/boss damage append-only with accuracy DERIVED and clamped (no reset/clear/wipe operation, prototype-asserted), and the composition root feeds it from the actual combat path — both damage-application sites record hits, boss hits record boss damage, and shots sync from AF-032's own fire counter at run end.
- **Self-review executed:** 9 new tests — all nine shelves, the three total maps, the element/status integration with the kinetic-null case, the extended-arsenal overlap law with the freeze-first-producer assertion, the twenty-part completeness function per weapon, the element-def consistency law, the evolution identity-preservation law over AF-032's own chain, the mastery ledger with derived accuracy and the no-erasure prototype assertion, and a **1,000-career seeded combat sweep** across all five weapons — the ledger never drifts and accuracy stays in range. **Live in the browser:** launched, and the extended weapons line ran on the overlay — `Coil Ripper (ballistic/singleShot) · railguns/electrical→shock · shots 0 · proj 0 · dmg 0%crit · mastery 0 kills 0%acc` — the element→status map visible in-game, zero page errors.

**Review verdict:** ALIGNED (AF-032 unchanged; one profile layer + one pure mastery ledger in the established wrapping class; three total vocabulary maps; the element layer bound to real def behaviour by law; one roster addition giving freeze its first weapon producer; real combat hooks feeding the ledger). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/WEAPON_ARCHITECTURE.md`, `src/game/weapons/weaponFrameworkData.ts` + `WeaponMasteryRuntime.ts`.
