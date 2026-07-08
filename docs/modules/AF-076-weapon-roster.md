# AF-076 — WEAPON ROSTER FRAMEWORK

**Module status:** Complete (ten-weapon launch arsenal on unchanged AF-032/075 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-075 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/WEAPON_ROSTER.md` + implementation (`src/game/weapons/weaponRosterData.ts`, `WeaponCollectionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

76

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-075 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Weapon Roster Framework.

The objective is not simply to create hundreds of weapons.

The objective is to ensure every weapon family feels mechanically distinct, strategically meaningful and endlessly expandable.

Players should constantly discover new combinations between Weapons, Ships, Commanders, Relics and Research.

Every weapon should remain relevant regardless of progression stage.

==================================================
CORE PHILOSOPHY
==================================================

Expression.

Variety.

Experimentation.

Mastery.

Replayability.

Weapons should encourage creativity rather than optimisation around a single best build.

==================================================
WEAPON MANUFACTURERS
==================================================

Support multiple manufacturers.

Each possesses its own engineering philosophy.

Example manufacturers:

Atlas Dynamics

Helios Industries

Nova Forge

Vanguard Systems

Aegis Armaments

Quantum Horizon

Black Horizon

Frontier Salvage

Ancient Foundry

Paragon Laboratories

Future manufacturers extend naturally.

Each manufacturer defines:

Visual identity

Engineering style

Technology focus

Lore

Audio profile

Signature mechanics

==================================================
WEAPON TIERS
==================================================

Support:

Common

Uncommon

Rare

Epic

Legendary

Ancient

Prototype

Mythic

Tier affects rarity and acquisition.

Never long-term viability.

==================================================
WEAPON FAMILIES
==================================================

Each category supports numerous families.

Examples:

Railguns

• Precision

• Heavy

• Orbital

• Experimental

Lasers

• Continuous

• Pulsed

• Prism

• Resonance

Missiles

• Swarm

• Heavy

• Smart

• Cluster

Gravity

• Compression

• Singularity

• Orbital

• Quantum

Every family introduces new gameplay.

==================================================
BUILD ARCHITECTURE
==================================================

Weapons combine with:

Ships

Commanders

Relics

Equipment

Research

Talents

Ascension

Environmental Effects

Every combination remains meaningful.

==================================================
LEGENDARY WEAPONS
==================================================

Legendary Weapons possess:

Unique Identity

Unique Lore

Unique Mechanics

Unique Progression

Unique Cosmetics

Unique Discovery

Unique Mastery

Legendary does not mean universally stronger.

==================================================
PROTOTYPE WEAPONS
==================================================

Prototype Weapons introduce:

Experimental Fire Modes

Risk vs Reward

Heat Management

Energy Instability

Unique Controls

Advanced Mechanics

High Skill Ceiling

Prototype gameplay rewards mastery.

==================================================
WEAPON COLLECTION
==================================================

Players permanently collect:

Blueprints

Manufacturers

Weapon Families

Legendary Weapons

Prototype Designs

Ancient Technology

Experimental Variants

Collection encourages exploration.

==================================================
WEAPON RESEARCH
==================================================

Research unlocks:

Alternative Fire Modes

Experimental Ammunition

Efficiency

Handling

Specialisation

Manufacturer Technologies

Research expands possibilities.

==================================================
WEAPON STATISTICS
==================================================

Track:

Usage

Accuracy

Critical Hits

Damage

Favourite Builds

Boss Performance

Mastery

Historical Records

Statistics support future balancing.

==================================================
CUSTOMISATION
==================================================

Support:

Weapon Skins

Manufacturer Themes

Projectile Colours

Impact Effects

Kill Animations

Inspection Animations

Audio Packs

Visual customisation never alters gameplay.

==================================================
BALANCE PRINCIPLES
==================================================

Weapons balance around:

Combat role.

Mechanical complexity.

Positioning.

Skill expression.

Build synergy.

Never numerical superiority alone.

==================================================
ACCESSIBILITY
==================================================

Support:

Reticle Customisation

Colour-blind Options

Projectile Visibility

Aim Assist

Large UI

Controller Navigation

Touch Controls

Motion Reduction

==================================================
PERFORMANCE
==================================================

Pool projectiles.

Optimise collision.

Cache weapon data.

Reuse visual effects.

Stream audio.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Weapon

Manufacturer

Family

Mastery

Damage

Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Weapon Roster Framework.

Every future weapon extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every weapon.

Review weapon identity.

Review manufacturers.

Review build diversity.

Review mastery.

Review progression.

Review customisation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-075.

Reduce overlap.

Improve mechanical depth.

Strengthen experimentation.

Ensure every weapon family offers a distinctive combat philosophy that remains viable, rewarding and enjoyable across thousands of hours of gameplay while supporting limitless future expansion.

Repeat until the Weapon Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-076.

---

## Foundation / AF-000–075 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-074 fleet move applied to the arsenal, on unchanged shapes:** all ten weapons are AF-032 `WeaponDef`s with AF-075 `WeaponProfileDef`s — no type changed, no locked file touched. AF-032's four and AF-075's Hailborn Array head the roster asserted-unchanged, joined by five new weapons: the Atlas Cluster Battery (common), Helios Prism Array (epic), Paragon Flux Driver (PROTOTYPE), Foundry Sunlance (LEGENDARY — unique discovery beneath First Light, the same vault thread as AF-074's Dawnspire), and Salvage Scattergun (common, traded at Gravewake). All ten pass AF-032's own overlap law AND AF-075's element/status consistency law.
- **WEAPON FAMILIES are the module's new vocabulary — a THREE-LAYER binding:** twenty-one `WeaponFamilyDef`s (the spec's four example categories carrying exactly four families each, asserted, plus one family per category the arsenal actually uses), every family's category resolving onto AF-075's seventeen-shelf, and every roster entry's family required to MATCH its profile's framework category — def fingerprint, profile completeness, entry family all bound and tested together.
- **Fourteen manufacturers with all SIX spec identity parts:** the spec's ten plus the four already shipped in weapon lore since AF-032/075. Where a name matches an AF-074 shipyard (Atlas, Helios, Nova Forge, Quantum Horizon, Ancient Foundry), the lore binds them as armaments divisions — one industrial universe, two catalogues, no id collision (weapon manufacturers are their own register).
- **"Tier affects rarity and acquisition. Never long-term viability." — the AF-074 law, re-proven:** entries carry no stat field (key-inspection asserted), MYTHIC is honestly registered-empty again, and "legendary does not mean universally stronger" is a number — the Sunlance's base damage is asserted NOT the arsenal's highest.
- **Prototype gameplay gives AF-075's dormant heat register its first DATA DISCIPLINE:** the Flux Driver's `heatGenerationPerShot` is asserted strictly above every other profile in the arsenal — "heat management" and "risk vs reward" as authored numbers on the registered-dormant field, exactly the consumer the register was waiting for. Its tier is asserted `prototype`; the seven prototype mechanics are registered vocabulary.
- **Collection is PERMANENT:** `WeaponCollectionRuntime` starts with the Coil Ripper, gates each acquisition on its registered collection kind (blueprints, ancient technology, legendary weapons, prototype designs, experimental variants — five of seven kinds used across the arsenal), collects append-only with no remove/retire/scrap operation (prototype-asserted), and counts uses per weapon — §Weapon Statistics' balancing inputs. "Every weapon should remain relevant regardless of progression stage" is what the code cannot violate — the AF-072/074 guarantee, a third time.
- **"Limitless future expansion" is EXECUTED:** `syntheticWeaponFor(n)` deterministically generates weapons on the same shapes forever — one hundred synthetics plus the arsenal yield 110 distinct fingerprints and 100 complete twenty-part architectures through AF-032's and AF-075's unchanged functions.
- **Self-review executed:** 11 new tests — all nine shelves with the numerical-superiority exclusion, the six-part manufacturer completeness with entry resolution, the four-families-per-example-category assertion with shelf totality and id uniqueness, the ten-weapon arsenal with the locked head and full overlap law, the combined completeness + element-consistency pass over all ten, the three-layer family binding, the tier key-inspection with honest-mythic and legendary-not-strongest, the prototype heat discipline, the gated append-only collection, the hundred-synthetic proof, and a **1,000-career seeded sweep** — the usage ledger never drifts, no weapon is ever lost, the Coil Ripper always remains. **Live in the browser:** launched, and the arsenal ran on the weapons line — `Coil Ripper (ballistic/singleShot) · uncommon/railguns:precision · railguns/electrical→shock · arsenal 1/10` — tier, family, element and collection all visible in-game, zero page errors.

**Review verdict:** ALIGNED (zero shape changes; ten weapons as pure data on AF-032/075's unchanged types; one pure collection runtime in the ledger discipline; fourteen manufacturers authored with full identities; twenty-one families as a new naming layer bound to locked categories; AF-075's dormant heat register given its first data discipline). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/WEAPON_ROSTER.md`, `src/game/weapons/weaponRosterData.ts` + `WeaponCollectionRuntime.ts`.
