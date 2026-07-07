# weapons — Weapon Framework (AF-032, game layer)

**Purpose:** Mechanical identity, not raw numbers. A weapon feeds AF-021's existing `DamagePacket`/`OffensiveModifiers` "weapon" stage and `StatusEngine` directly — no new damage or status plumbing, only new content flowing through pipes that already existed.

**Responsibilities:** Data shapes for category/fire pattern/projectile behaviour/status-on-hit/evolution (`weaponData`), deterministic spawn-angle geometry for the six geometric fire patterns (`FirePattern`), deterministic per-tick projectile motion for the twelve behaviours (`ProjectileBehaviour`), fire-interval and energy-cost gating (`WeaponRuntime`), the no-overlap fingerprint check (`findWeaponOverlap`, mirroring AF-030/031), and the evolution evaluator (`evaluateWeaponEvolution`).

**Dependencies:** `game/combat` (`DamageSchool`, `DamageSourceKind`, `StatusKind` — reused, not duplicated). `game/loot` (`Rarity` — same ladder relics/ships restrict a view of). `game/ships` (`ShipRuntime.trySpendEnergy` — a weapon's Energy Cost draws from the ship's existing Energy pool, not a second one).

**Data structures:** `WeaponDef`, `WeaponEvolution`/`WeaponEvolutionRequirement`/`WeaponEvolutionContext`, `ShotDescriptor`, `WeaponSnapshot`.

**Extension points:** new weapons are data, checked against `findWeaponOverlap` before shipping; new categories extend the `WeaponCategory` union; chain/split/explosion *hit-resolution* (as opposed to motion, which is implemented here) is a combat-module extension point, exactly as AF-021's "chain reactions" note anticipated; weapon cosmetics/mastery reuse AF-026's existing `MasteryReward` union and `weapon:<id>` tracks.

**Known limitations:** weapon card/comparison/evolution-tree UI builds from AF-005/AF-007 at the UI module; only one sandbox weapon drives live fire timing in the walking-skeleton run (roster switching and full on-hit chain/split/explosion resolution for every category bind at the weapon content module, mirroring AF-029's "one live mechanic, full vocabulary defined" precedent).
