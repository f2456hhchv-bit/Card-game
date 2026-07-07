# bosses — Boss Framework (AF-035, game layer)

**Purpose:** Defining, memorable events won through observation and adaptation, never luck. A Boss's phase structure, attack gating, and defensive model all reuse existing engines — nothing here is a second combat system.

**Responsibilities:** Data shapes for phase/mechanic/enrage/mastery-challenge/reward vocabulary (`bossData`), the phase state machine (`BossAI`, a table over AF-016's existing `StateMachine`), the runtime that reuses AF-021's `DefenceState` for hull/shield/armour and AF-033's `EnemyRuntime` for attack telegraph/cooldown gating (`BossRuntime`), and deterministic arena hazard-zone ticking (`BossArena`).

**Dependencies:** `game/combat` (`DefenceState` — Armour IS `damageReduction`, not a second mitigation model; `StatusKind` for hazard-zone status application). `game/enemies` (`EnemyAttack`/`MovementBehaviour`/`EnemySpecialAbility`/`EnemyRuntime` — a Boss phase's attack and movement are the exact same shapes an enemy uses; `EnemyRuntime` gates the Boss's attack by receiving a synthesized minimal `EnemyDef`). `game/loot` (`LootCategory` — Boss rewards route through the existing categories). `game/meta` (`MasteryReward` — mastery challenge rewards are the same cosmetic-only union everything else uses).

**Data structures:** `BossDef`, `BossPhaseDef`, `WeakPointDef`, `BossEnrageDef`, `BossMasteryChallengeDef`, `BossRewards`, `BossSnapshot`, `HazardZoneDef`/`HazardZoneState`.

**Extension points:** new Bosses are data; `BOSS_MECHANICS` is a content-authoring vocabulary — Projectile Patterns/Laser Systems/Area Denial/Shield Phases/Gravity Fields/Energy Beams/Teleportation all pair with existing AF-032/033 fire-pattern, projectile-behaviour, `DefenceState.addBarrier`, and `teleport` movement-behaviour mechanisms rather than inventing new ones per mechanic; Rotating Armour and full Arena Manipulation (beyond hazard zones) are registered future. Enrage's `missionModifier`/`specialEvent` triggers are registered future — the same "no consumer yet" pattern AF-028/033/034 established.

**Known limitations:** Boss card, arena visuals, dialogue, and Codex UI build from AF-002/AF-004/AF-005/AF-007/AF-008 at the content/visual/UI module; mastery-challenge *evaluation* (did the player actually take zero damage this fight?) is tracked by the composition root during the encounter, not by this module, which only defines what the challenge is and what it rewards; only one sandbox Boss governs a live encounter today, triggered by AF-017's existing `MiniBoss` Director phase.
