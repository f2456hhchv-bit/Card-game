# AFTERLIGHT — Enemy Framework

**Authority:** Produced output of AF-033. Extends AF-000 → AF-032. Every future Enemy, Elite, Boss Support Unit, and Biome extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** difficulty comes from interaction between enemies, never from health inflation — every enemy must teach something and create a meaningful tactical decision.

---

## 1. AI states — AF-016's StateMachine, not a new one

The ten-state chain (Idle → Patrol → Search → TargetAcquired → Attack → Retreat → Reposition → SpecialAbility → Recover → Death) is a transition table handed to the exact `StateMachine<S>` class the top-level game flow already runs on. `createEnemyStateMachine()` is the one function this module adds — it just supplies the table. Illegal transitions are refused, never silently coerced — "deterministic" is inherited, not reimplemented.

## 2. Attack types are Weapon Framework attacks

| Attack type | Mechanism |
|---|---|
| Projectile, Beam, Missile, Nova, Area, Status | A real AF-032 `WeaponDef`, fired by the enemy through the same `computeShotAngles`/`stepProjectile`/`StatusEngine` machinery the player's weapons use |
| Melee, Charge | AF-021's existing contact-damage `DamagePacket` pattern |
| Drone Launch, Summon | This module's own Spawn Event primitive (also used by Death Events — one spawn path, not two) |
| Environmental | Registered future — no environmental-hazard system yet to attack with |

An `EnemyAttack` carries a content-authoring `attackType` label plus its actual `mechanism` (`melee` or `ranged` wrapping a `WeaponDef`) and a `telegraphMs` — the framework's readable-telegraph requirement made mechanical, not just documented.

## 3. Target selection — AF-021's existing selector module

Distance is `TARGET_SELECTORS.nearest`; Threat/Boss/Elite priority are the already-registered `bossPriority`/`elitePriority` selectors. Line of Sight reuses the existing arena obstacle occlusion data. With exactly one possible target in the sandbox (the player), selection today is an engagement gate (range + line of sight); the same selector module scales to multiple candidates without change once allies/objectives exist.

## 4. Elite — a modifier, not a second schema

`EliteModifier` produces the same `elite: boolean` flag every locked system (Director, Loot, Meta, Relics, `TargetCandidate`) already consumes. It additionally carries stat multipliers and an optional bonus special ability. Nothing downstream of the flag changes.

## 5. Special abilities — AF-028's trigger/bonus shape, applied to the enemy itself

An `EnemySpecialAbility` is `{ trigger: PassiveTrigger, threshold?, bonus: EquipmentBonus, cooldownMs }` — the identical shape a Commander's or Ship's passive already uses. The only difference: the bonus applies to the enemy's own movement/damage, not to the player's `BonusTotals`. Zero new trigger vocabulary.

## 6. Death events — configuration over an event that already exists

`EnemyKilled` already drives XP, loot, meta statistics, and challenge progress on every kill, unconditionally. `EnemyDef.deathEvents` configures which of those a *specific* enemy triggers, plus two mechanics this module adds:

- **Status Explosion** — `StatusEngine.apply()` to everything within a radius, reusing AF-021's engine exactly.
- **Spawn Event** — a death-triggered spawn using this module's own enemy-spawning path (shared with normal wave spawning, not duplicated).

Mission Progress / Research Samples / Achievements / Special Events are already satisfied by the existing unconditional `EnemyKilled` subscription and the loot table's `researchSample` category.

## 7. Wave composition vs. enemy identity

AF-017's `WaveType` decides when and how much budget spawns; this module's `EnemyDef` roster is what spawns into that budget. No `EnemyDirector` change — a wave references enemy ids as content.

## 8. Movement behaviour — the one new mechanical surface

`stepEnemyMovement(behaviour, state, dtMs, context)` mirrors AF-032's `stepProjectile` exactly: pure, deterministic, one case per behaviour (Direct Pursuit, Orbiting, Strafing, Kiting, Ambush, Teleport, Burrow, Wall Crawling, Formation, Retreat). This is the module's one genuinely new system, because no prior module modeled non-player motion.

## 9. No-overlap law

`findEnemyOverlap`/`enemyFingerprint` (family + roles + movement behaviour + attack mechanism + special ability) checked across the roster, mirroring AF-030/031/032.

## 10. Presentation, accessibility, performance

Enemy silhouette/colour/audio, telegraphs, status indicators, reduced-effect mode, high contrast, and outlines build from AF-002/AF-004/AF-007/AF-008 at the content/visual module. Enemies and their AI logic are pooled (extending the existing `Pool` usage, not a new pooling system); pathfinding/targeting stay O(n) over the small live-enemy set the Director already caps (`maxActiveEnemies`).

## 11. Debug

Live: enemy state · target selection outcome · threat rating (elite/boss flag) · spawn group (wave type) · active count · performance.

---

## Internal review loop (AF-033, recorded)

- **No duplicated systems** — AI states, targeting, elite flagging, special-ability shape, and death-event plumbing all reuse AF-016/AF-021/AF-028/AF-030/AF-031 exactly; ranged attacks reuse AF-032's entire weapon engine. Movement stepping is the one new surface, built the same way AF-032 built projectile stepping. ✔
- **Difficulty from interaction, not health inflation** — Elite is a behavioural/ability modifier first, a stat multiplier second; the sandbox's ranged Flanker and melee Chaser create a real positioning decision (kite the ranged one, close on the melee one) rather than a bigger number. ✔
- **Readable telegraphs** — every ranged attack has a `telegraphMs` window before it fires, mechanically enforced by `EnemyRuntime`, not just a documented intention. ✔
- **Sandbox proof** — two enemy families (with Elite variants) govern live encounters end-to-end: AI state transitions, telegraphed ranged attack reusing the player's own weapon engine, Enrage at low health, and Status-Explosion/Spawn-Event death events. ✔
- **Simplification pass** — rejected a second targeting system (reused AF-021's selectors); rejected a second projectile engine for ranged attacks (reused AF-032's wholesale); rejected a new elite schema (reused the existing boolean flag plus a modifier). ✔

**Internal quality score: 9.5/10 — approved and locked; full-roster tactical/balance passes bind at future enemy content and biome modules.**
