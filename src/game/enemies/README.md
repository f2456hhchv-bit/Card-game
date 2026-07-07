# enemies — Enemy Framework (AF-033, game layer)

**Purpose:** Instantly recognisable obstacles whose interaction — not health inflation — produces difficulty. Every enemy carries identity, counterplay, and a readable telegraph.

**Responsibilities:** Data shapes for family/role/movement/attack/special-ability/elite/death-events (`enemyData`), deterministic per-behaviour motion (`EnemyMovement`), AI state transitions (`EnemyAI`, a table over AF-016's existing `StateMachine`), per-instance telegraph/cooldown gating and condition-gated special-ability bonus (`EnemyRuntime`), death-event configuration lookup (`DeathEvents`), and the no-overlap fingerprint check (`findEnemyOverlap`).

**Dependencies:** `game/weapons` (`WeaponDef` — a ranged enemy attack IS a weapon, fired through the exact same engine the player uses). `game/combat` (`DamageSchool` for melee attacks; `StatusEngine` for status-on-hit and Status Explosion death events — reused, not duplicated). `game/equipment` (`PassiveTrigger`, `EquipmentBonus` — an enemy's special-ability trigger/effect is the identical shape a Commander's or Ship's passive uses). `core/state` (`StateMachine` — the AI state chain is a transition table over the existing generic class).

**Data structures:** `EnemyDef`, `EnemyAttack`/`AttackMechanism` (melee or a wrapped `WeaponDef`), `EnemySpecialAbility`, `EliteModifier`, `EnemyRuntimeSnapshot`.

**Extension points:** new enemies are data, checked against `findEnemyOverlap` before shipping; new families/roles extend their unions; Group Behaviour (Focus Fire, Support Buffs, Formation coordination, Retreat Logic) and most Special Abilities (Deploy Shields, Heal/Boost Allies, Spawn Reinforcements, Create Hazards, Teleport, Cloak, Split, Merge) are schema-complete but await their consuming systems — the same "registered, no consumer yet" pattern AF-028 used for `droneEffectiveness`/`orbitalPower`; only Enrage governs a live sandbox enemy today.

**Known limitations:** enemy card/silhouette/telegraph visuals build from AF-002/AF-004/AF-007/AF-008 at the content/visual module; target selection has exactly one real candidate (the player) until allies/objectives exist, so it degenerates to an engagement gate rather than a true choice among candidates — the underlying AF-021 selector module already supports more.
