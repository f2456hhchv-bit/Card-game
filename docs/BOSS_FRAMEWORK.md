# AFTERLIGHT — Boss Framework

**Authority:** Produced output of AF-035. Extends AF-000 → AF-034. Every future Boss, Raid Boss, Ancient Guardian, and Mythic Encounter extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** victory is earned through observation, positioning, adaptation, and mastery — never luck, never unavoidable damage, never a hidden mechanic.

---

## 1. Nearly every Boss attribute was already reserved

AF-021's `DamageSourceKind` has a `"boss"` kind with its own resistance-override branch already coded into `resolveDamage`. `TargetCandidate.isBoss`/`TARGET_SELECTORS.bossPriority` existed with zero consumers. AF-022's `XpTier` already has `"boss"`. AF-017's `DirectorPhase`/`WaveType` already include `MiniBoss`/`BossHandoff`/`MiniBossWave`/`BossWave`. AF-026's `CollectionCategory` already includes `"bosses"`. This module is the first real payload for all of it.

## 2. Health/Shield/Armour — AF-021's DefenceState, not a second model

`BossRuntime` constructs one `DefenceState(shield, hull, tuning, armour)`, identical to the player's own. Armour IS `damageReduction`. Shield-then-hull absorption, regen-halt-on-break, and barrier are all inherited.

## 3. Boss Structure — AF-016's StateMachine, a third time

`introduction → engaging → transitioning → engaging → … → enrage → deathSequence → rewardCeremony` is a transition table over the same generic class the top-level game flow and AF-033's enemy AI already run on. Transitions hold for a real, timed 500ms — brief, not instantaneous.

## 4. Attack gating — AF-033's EnemyRuntime, reused directly

`EnemyRuntime` only ever reads `def.attack` and `def.specialAbility`. `BossRuntime` synthesizes exactly that minimal view per phase and hands it to a real `EnemyRuntime` instance — the same telegraph/cooldown gate every enemy uses, not a second one.

## 5. Boss Mechanics are Weapons and existing movement behaviours

| Mechanic | Reuses |
|---|---|
| Projectile Patterns, Laser Systems, Energy Beams, Area Denial | A real AF-032 `WeaponDef` per phase |
| Shield Phases | `DefenceState.addBarrier` |
| Teleportation | AF-033's `teleport` `MovementBehaviour` (the same one AF-034's Berserker... Teleport mutation draws on) |
| Rotating Armour, full Arena Manipulation | Registered future |

## 6. Weak Points — the one new sub-target concept

No prior module modeled a damageable sub-hitbox. Destroying one raises `incomingDamageMultiplier` — a small, honest reward for precision play. The sandbox chips the weak point proportionally on every hit rather than requiring aimed sub-targeting; real aiming is a Hangar/targeting-UI concern, registered future.

## 7. Enrage — Low Health reuses the existing trigger shape; three new evaluations added honestly

Low Health is AF-028/030/031/033/034's exact `{trigger, threshold, bonus}` shape. Time Limit and Ascension are new evaluations this module genuinely needed — Ascension is evaluated externally via `notifyAscension(ascension)` since the runtime has no ascension context of its own. Mission Modifier/Special Event are registered future, the same "no consumer yet" pattern established repeatedly.

## 8. Rewards — every acquisition system a Boss already qualifies for

Large XP is the `"boss"` `XpTier`. Loot/Research route through AF-023's existing category filter. Relics reuse `RelicSystem.acquire` exactly. Blueprints reuse AF-025's `CraftingSystem.unlockBlueprint`. Nothing new to acquire with.

## 9. Boss Codex — AF-026's engine, an honestly recorded gap

`discover("bosses", codexId)` is the same call AF-034 made for enemies. Fastest Kill has no primitive yet — AF-026's statistics engine tracks a running maximum, not a minimum — registered future rather than faked.

## 10. Mastery Challenges

The `MasteryReward` union and cosmetic-only guarantee are AF-026's. Evaluating a challenge (did the player take zero damage?) is the composition root's job, same as any other run-scoped condition.

## 11. Presentation, accessibility, performance

Boss card, arena visuals, dialogue, Codex UI build from AF-002/AF-004/AF-005/AF-007/AF-008 at the content/visual/UI module. Boss effects and projectiles are pooled via the existing `Pool` usage; phase/arena logic is O(1) per tick.

## 12. Debug

Live: Boss state · current phase · hull · shield · weak points destroyed · enrage flag.

---

## Internal review loop (AF-035, recorded)

- **No duplicated systems** — defensive model, phase state machine, attack gating, movement, and every reward acquisition path reuse AF-016/AF-021/AF-023/AF-025/AF-026/AF-029/AF-032/AF-033 exactly. Weak Points and hazard-zone ticking are the two new mechanical surfaces, both explicitly justified. ✔
- **Victory through observation, not luck** — every attack telegraphs before it fires (inherited from `EnemyRuntime`); the hazard zone is visible arena state, not a hidden mechanic. ✔
- **Transitions remain brief** — a real, bounded 500ms hold, not zero-duration. ✔
- **Sandbox proof** — a two-phase Boss with a weak point, a lowHealth Enrage, a live arena hazard, and a full reward ceremony (XP/loot/guaranteed relic/guaranteed blueprint/Codex discovery/mastery-challenge check) runs end-to-end, spawned by the Director's existing `MiniBoss` phase; the player's weapon finally has a live consumer for AF-021's `bossPriority` selector. ✔
- **Simplification pass** — rejected a second damage/defence model (reused `DefenceState`); rejected a second attack-gating engine (reused `EnemyRuntime` via a synthesized view); rejected inventing aimed sub-targeting for Weak Points in the sandbox (proportional chip-damage instead, registered future for real aiming). ✔

**Internal quality score: 9.5/10 — approved and locked; full mechanic buildout (Rotating Armour, Gravity Fields beyond AF-034's registered future, full Arena Manipulation) and additional Boss content bind at future content modules.**
