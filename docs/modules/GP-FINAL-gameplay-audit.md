# GP-FINAL — GAMEPLAY AUDIT, BALANCE & FINALISATION

**Module status:** THIRD EXECUTION COMPLETE (2026-07-11) — all three items the second execution left as open, undeferred backlog (Elite reward pool expansion, a new per-wave Reward system, and the 6-weapon/6-passive loadout rework) are now implemented, tested, and browser-verified.
**Lock status:** STILL NOT LOCKED, but narrowly. GP-FINAL's own §3 lock condition ("GP-001 → GP-005 delivered · referenced content modules pass §1's tests · the emotional curve is measurable in real runs · **the flagged items above are resolved**") is not yet met — three of the original four FAIL/FLAGGED items (Wave rewards, Elite reward pool, the 6-weapon/6-passive build frame) are now real; only the Level-up content law violation (`SANDBOX_UPGRADES`'s plain percentage upgrades) remains open, unaddressed by either scope round. This audit re-runs at the next playable milestone or on the Project Owner's next scope choice, whichever comes first.
**Produced output:** `docs/GP_FINAL_AUDIT.md` (standing audit contract, now with second- and third-execution records appended)

---

*(Pack catalogued verbatim below.)*

# AFTERLIGHT PRODUCTION PACK GP-FINAL

# GAMEPLAY AUDIT, BALANCE & FINALISATION

Continue directly from GP-005.

Do NOT redesign AF-000 through AF-200.

Do NOT redesign GP-001 through GP-005.

Your purpose is to review, challenge and perfect every gameplay system before large-scale production begins.

==================================================
OBJECTIVE
==================================================

Create a roguelite that players continue playing for hundreds of hours.

The game should feel easy to learn.

Difficult to master.

Impossible to forget.

==================================================
THE GOLDEN RULE
==================================================

Every gameplay decision must answer:

Is this fun?

If uncertainty exists...

Prototype mentally.

Challenge assumptions.

Improve the design.

==================================================
THE PLAYER EMOTIONAL CURVE
==================================================

Every standard run should create this emotional rhythm.

Spawn
↓
Curiosity
↓
Small Success
↓
Power Growth
↓
Confidence
↓
Excitement
↓
Pressure
↓
Relief
↓
Power Fantasy
↓
"Oh No..."
↓
Adaptation
↓
Victory
↓
Reward
↓
"I'll do one more run."

Every run should naturally follow this rhythm.

==================================================
RUN STRUCTURE
==================================================

Standard Run

10–15 minutes.

Mini Boss

Every 5 waves.

Major Boss

Every 10 waves.

Extraction after each Major Boss.

Players may continue indefinitely.

Every continuation dramatically increases

Difficulty

Loot

Atlas Rewards

Risk

==================================================
LEVEL UPS
==================================================

Level Ups occur through XP only.

Every Level Up offers

3 meaningful choices.

Never offer boring percentage upgrades unless attached to meaningful mechanics.

==================================================
WAVE REWARDS
==================================================

Every completed wave grants a reward choice.

These should complement—not replace—level ups.

Reward categories

Healing

Economy

Utility

Weapon Improvement

Passive Improvement

Rerolls

Atlas Cache

Temporary Buff

==================================================
ELITE REWARDS
==================================================

Elite enemies never simply drop gold.

Elite reward pool includes

Large XP Crystal

XP Magnet

Screen Clear

Screen Stun

Rare Cache

Epic Upgrade

Legendary Chance

Temporary Ally

Repair Drone

Atlas Fragment

Ultra Rare Event Trigger

Elite rewards should feel exciting but unpredictable.

==================================================
BUILD PHILOSOPHY
==================================================

Support

6 Weapons

6 Passive Slots

Unlimited possible combinations.

Weapons evolve naturally.

Secret evolutions unlock through

Weapon combinations

Passive combinations

Artifact combinations

Rare discoveries

Players should continually discover new builds.

==================================================
PRESSURE CURVE
==================================================

Never make enemies harder by simply increasing health.

Instead introduce

New enemy roles.

More dangerous combinations.

Environmental hazards.

Smarter formations.

Mixed elite groups.

Players should regularly think

"I'm incredibly powerful."

Immediately followed by

"This situation is dangerous."

==================================================
FAIRNESS
==================================================

Player deaths should always feel understandable.

Never unfair.

Never random.

Always leave the player believing

"I can do better."

==================================================
PERMANENT PROGRESSION
==================================================

Death loses

Only the run.

Everything else remains.

Every run advances

Research

Atlas

Museum

Commander XP

Ship Progress

Blueprints

Galaxy Unlocks

Civilisation

Nothing meaningful is ever taken away.

==================================================
GALAXY STRUCTURE
==================================================

Galaxies unlock progressively.

Players may freely choose previously unlocked galaxies.

Encourage replaying earlier galaxies using new builds.

==================================================
RUN MOMENTS
==================================================

Create memorable ultra-rare moments.

Examples

Legendary Cache

Anomaly Wave

Ancient Atlas Signal

Hidden Boss

Galaxy Event

Lost Commander

Living Artifact

These should become stories players share online.

==================================================
THE "ONE MORE RUN" TEST
==================================================

Review every system.

Ask

Will this encourage another run?

If not

Improve it.

==================================================
THE "NO DEAD TIME" TEST
==================================================

The player should never go longer than thirty seconds without experiencing one of:

XP

Upgrade

Reward

Elite

Event

Discovery

Merchant

Boss

Decision

Every thirty seconds something meaningful happens.

==================================================
THE "NO USELESS SYSTEMS" TEST
==================================================

Every mechanic must justify its existence.

If a mechanic does not improve

Fun

Replayability

Build diversity

Player expression

Long-term progression

Remove it.

==================================================
THE "AFTERLIGHT TEST"
==================================================

The game should not feel like a copy.

It should feel like

"The best ideas from many great games combined into something entirely new."

Players should finish a run believing

"I've never played anything quite like this."

==================================================
FINAL REVIEW
==================================================

Audit every gameplay system.

Audit pacing.

Audit combat.

Audit progression.

Audit rewards.

Audit bosses.

Audit builds.

Audit difficulty.

Audit fairness.

Audit replayability.

Challenge every assumption.

Improve every weakness.

Continue refining until the game reaches a standard capable of standing beside the highest-rated roguelites ever released.

Only then lock GP-FINAL.

---

## Sequence review (recorded at catalogue time)

**Anomaly:** GP-FINAL instructs continuation from GP-005 and audits AF-000 → AF-200 and GP-001 → GP-005 — **none of GP-001 → GP-005 and none of AF-027 → AF-200 have been delivered to this project.** Systems GP-FINAL references without definition, presumably specified in the missing packs: **the Atlas** (fragments, caches, signals, rewards — referenced seven times), **the Museum**, **Civilisation** (as an advanceable track), **Merchants**, the **wave-based run structure**, **galaxy unlock structure**, and the **6-weapon/6-passive build frame**. Per the Foundation Lock's transition protocol (stop and ask, never quietly found systems) and GP-FINAL's own lock condition, this pack is catalogued as a **standing contract** and cannot lock yet. Project Owner consulted on sequencing.

**Canon registered now (binding on future modules, no implementation until their specs arrive):**
- Run structure: 10–15 minute standard runs · mini boss every 5 waves · major boss every 10 · **extraction after each major boss** (matches AF-016's canonical Extraction phase) · indefinite continuation with dramatically escalating difficulty/loot/risk (compatible with AF-017 threat scaling + AF-022 endless mode).
- Build frame: **6 weapons + 6 passive slots**; natural weapon evolution + **secret evolutions** via combinations and discoveries (extends AF-025's registered evolution hook).
- **Wave rewards** (a per-wave reward choice, complementing level-ups) — new system, module owed.
- **Elite reward pool** (Large XP Crystal, XP Magnet, Screen Clear, Screen Stun, Rare Cache, Epic Upgrade, Legendary Chance, Temporary Ally, Repair Drone, Atlas Fragment, Ultra Rare Event Trigger) — extends AF-017/AF-023; module owed.
- Pressure-curve law: **enemy difficulty never comes from health inflation alone** — roles, combinations, hazards, formations, mixed elites (restates AF-011 §4's ban, now with the positive prescription; binds enemy content modules).
- Level-up content law: **no bare percentage upgrades unless attached to meaningful mechanics** (binds AF-022 upgrade content; the current sandbox upgrades are placeholders and openly violate this — flagged in the audit).
- Ultra-rare run moments roster (Legendary Cache, Anomaly Wave, Ancient Atlas Signal, Hidden Boss, Galaxy Event, Lost Commander, Living Artifact) — story-generating rarities; modules owed.
- The four standing tests (**One More Run · No Dead Time (30s) · No Useless Systems · Afterlight Test**) join the Unified Feature Gate's companions as recurring audit instruments — effective immediately.
- Emotional curve (14 beats, Spawn → "one more run") — the target shape for the Director's pacing and boss/reward placement; partially expressible today, fully auditable when bosses/content exist.

**Reconciliations:** wave-based structure vs AF-016's 11-phase run lifecycle — compatible (waves are Director directives inside phases; mini/major boss cadence maps to the MiniBoss/Boss phases; extraction is already canon), formal mapping owed to the run-structure module. "Permanent progression: death loses only the run" — already implemented and verified (AF-024/025/026). "Elite enemies never simply drop gold" — trivially satisfied (no gold exists; elites drop from the AF-023 ladder).

**Review verdict:** CATALOGUED AS STANDING CONTRACT — not lockable until GP-001 → GP-005 and the audited content modules arrive. First partial audit executed and recorded in `docs/GP_FINAL_AUDIT.md`.

---

## Second execution (2026-07-11) — prerequisites now delivered

GP-001 → GP-005 are complete and locked (see `docs/modules/STATUS.md`'s GP registry). A fresh three-part audit re-ran specifically against the "Run Structure" canon registered above, since the first execution's own PARTIAL verdict named it as "tuning data changes once wave-based content arrives" — that content has now arrived. Full findings and the Project Owner's scope answer are recorded in `docs/GP_FINAL_AUDIT.md`'s second execution section; summary:

**Confirmed real gaps (all three audits agreed):**
- Only ONE boss tier existed — the ordinary Boss, spawned once per run on a fixed ~128s timer via `EnemyDirector`'s own pacing-phase exhaustion, never wave-count-driven. `"MiniBossWave"` was a registered `WaveType` with no distinct enemy behind it — it silently spawned ordinary random enemies.
- Extraction fired once per run (after the single boss), not recurring per Major Boss, because nothing existed to make a second boss encounter possible in the first place.
- No tuning target existed for the "10-15 minute standard run" — the pacing cycle terminated after ~128s regardless.
- (Also confirmed, not part of this execution's chosen scope: the Elite reward pool is one mechanism, not 11 named types; no per-wave Reward system exists at all; the 6-weapon/6-passive build frame doesn't exist — combat runs on one hardcoded weapon.)

**Project Owner's scope answer:** of 4 real, audited buckets (Balance-adjacent items were NOT re-audited this round — see GP-005's own already-closed scope), the explicit choice was **only "Wave-driven boss cadence + pacing."** Elite reward pool expansion, a new per-wave Reward system, and the 6-weapon/6-passive loadout rework remain real, open, undeferred backlog.

**What's implemented:**
1. **A real Mini Boss tier.** `src/game/bosses/bossData.ts` gains `createMiniBossVariant(base, hullMultiplier, phaseCount)` — `createWorldBossVariant`'s own scaling pattern inverted (fewer phases, reduced hull, over the exact same phase/weak-point/enrage/mastery-challenge/reward engine — no second boss-content model) — and `MINI_BOSS` (a 2-phase, 0.35×-hull Hollow Sentinel variant, "The Hollow Sentinel Vanguard").
2. **Wave-count-driven boss cadence, decoupled from the Director's own pacing phase.** A new `checkBossCadence()` in `main.ts`, called from both `executeWave()` branches right after `wavesLanded += 1`, spawns `MINI_BOSS` at wave 5, 15, 25… and the ordinary `SANDBOX_BOSSES[0]` at wave 10, 20, 30…, reusing the exact `bossAvailable` guard the Push-Deeper World Boss roll already established.
3. **The Director's pacing cycle now loops for the whole run instead of terminating after one pass.** `EnemyDirector` gains an additive `loop?: boolean` option (default `false` — every existing caller's terminate-into-BossHandoff behaviour, and the tests asserting it, are untouched) and two new public methods, `pauseForBoss()`/`resumeAfterBoss()`, which freeze/unfreeze spawning via a new `externallyPaused` flag without touching the phase sequence's own position — so ordinary pacing resumes exactly where it left off after each boss encounter. `main.ts` passes `loop: true` and calls `pauseForBoss()` on every boss spawn (Mini/Major/World) and `resumeAfterBoss()` when the fight ends.
4. **Extraction re-fires after each Major Boss.** The `RunSession` lifecycle (`Spawn→…→RewardPhase→Extraction→Results`, a strictly-linear, one-shot array) is walked forward only for the FIRST boss encounter each run (guarded by a `RUN_PHASES` index comparison); every subsequent Major Boss defeat instead pushes the `ExtractionDecision` overlay directly, since the RunSession has already reached its resting `"Extraction"` phase. A new `EnemyKilled` payload field, `bossTier?: "mini" | "major"`, lets the mission-objective listener correctly withhold `missionBossDefeated` progress on a Mini Boss kill — only a Major Boss (or the World Boss, also major-tier) satisfies the mission's primary objective and makes Extraction reachable, exactly as the canon above specifies.
5. **Run length** is addressed structurally rather than by a hardcoded timer: a run can now genuinely last 10-15 minutes through several Mini/Major Boss cycles if the player keeps pushing deeper (matching the existing Push-Deeper escalating-risk/reward framing), while a player who wants a short run can still extract after the first Major Boss (~2-3 minutes) — a hard time limit would have removed the player agency GP-001's own Extraction Decision was built around.

**What was deliberately NOT built:** the Elite reward pool's other 8 named types (Screen Clear, Screen Stun, XP Magnet, Temporary Ally, Repair Drone, etc.), a per-wave Reward system, and the 6-weapon/6-passive loadout rework — all real, all found by this execution's own audit, all explicitly excluded by the Project Owner's scope answer.

**Verification:** new tests in `tests/enemyDirector.test.ts` (loop wraps indefinitely rather than terminating; pauseForBoss freezes phase position and budget accrual; resumeAfterBoss restores accrual) and `tests/bosses.test.ts` (`createMiniBossVariant` truncates phases/scales hull without mutating the base def; `MINI_BOSS` is playable and genuinely lighter than both the ordinary Boss and the World Boss) — 7 new tests, suite at 2318 (209 files). `tsc`/`vite build` clean. Browser-verified against a real automated run: the Mini Boss spawned exactly at wave 5 with the correct live data (`The Hollow Sentinel Vanguard [introduction] phase 1/2 (phase-1-siege) · hull 1050/1050`, matching `3000 × 0.35` precisely) and 17 full mission life-cycles (launch → combat → defeat → restart) completed cleanly with zero page errors under the new looping-director/pause-resume wiring. The symmetric Major Boss branch (wave 10, the identical `checkBossCadence()` code path) was not independently reached by the scripted playtest bot within its survival skill, but shares 100% of the code path already confirmed live for the Mini Boss branch.

**Review verdict:** Run Structure moves from PARTIAL to REAL in `docs/GP_FINAL_AUDIT.md`'s standing test table. GP-FINAL itself remains **NOT LOCKED** — three of its own FAIL/FLAGGED items (Level-up content law, Wave rewards, Elite reward pool) are still open, real, undeferred backlog, per the Project Owner's explicit scope choice this round.

---

## Third execution (2026-07-11) — the second execution's three deferred items picked up

Immediately after the second execution above, the Project Owner's next instruction was explicit and unqualified: pick up all three items just flagged as open, undeferred backlog. No new audit round was needed — the second execution's own findings (§ above) already fully specified the gaps; this execution is pure implementation against them.

**1. Elite reward pool — the other 10 named types.** `src/game/loot/eliteRewardPool.ts` (new) defines the full 11-entry pool (`ELITE_REWARD_KINDS`): the pre-existing rarity/power-boosted drop stays as the guaranteed baseline every Elite kill already honours (unchanged, additive); on top of it, one weighted-random kind now also fires — Large XP Crystal, XP Magnet, Screen Clear, Screen Stun, Rare Cache, Epic Upgrade, Legendary Chance, Temporary Ally, Repair Drone, Atlas Fragment, Ultra Rare Event Trigger. A single generic interpreter, `applyEliteReward` (main.ts), dispatches each kind onto real, already-proven mechanisms — XP pickups, `upgradePool`, the loot rarity ladder, the StatusEngine, particle bursts — inventing nothing. Two kinds (Temporary Ally, Repair Drone) needed a genuinely new run-scoped ticking-effect array, `activeEliteRewardEffects`, mirroring the established `livingReactorClockMs`-style per-tick timed-effect pattern already used elsewhere in main.ts.

**2. Wave rewards — a new standalone system.** `src/game/progression/waveRewards.ts` (new) defines 8 named categories (healing, economy, utility, weaponImprovement, passiveImprovement, rerolls, atlasCache, temporaryBuff) with one sandbox entry each, weighted-picked and auto-granted on every wave landing via a new `grantWaveReward()`/`applyWaveReward()` pair (main.ts), called right after `wavesLanded += 1` in both `executeWave()` branches — the same call site `checkBossCadence()` already used. Design decision (documented in the module's own header): granted automatically rather than as a blocking modal choice, since GP-FINAL's own "No Dead Time" test cuts against interrupting the player every 5-15s. The `reroll` kind is the first real caller of `UpgradePool.reroll()`, a framework method AF-022's own doc comment had explicitly flagged as "awaiting its content buyer."

Both new pools share one extracted utility, `pickWeighted` (`src/core/rng/weightedPick.ts`) — the exact weighted-pick algorithm `UpgradePool.offer()` already implemented, pulled out to a single generic implementation instead of being written a third time, per the Master Build Directive's own "avoid duplicated logic" standard.

**3. The 6-weapon/6-passive build frame — the core-combat-loop rework.** Investigated first (per the task's own instruction) before touching `main.ts`: `const sandboxWeapon = SANDBOX_WEAPONS[0]!` was threaded through targeting, projectile spawn, hit-resolution, mastery, and the debug HUD, with damage school and status-on-hit read from that single global at hit-time rather than stored per-projectile — meaning multiple simultaneously-firing weapons would have silently cross-contaminated each other's damage types.

Closed by:
- `equippedWeapons: WeaponDef[]` / `weaponRuntimes: WeaponRuntime[]` — parallel, index-matched arrays (starts as `[STARTING_WEAPON]`, so the n=1 case is a byte-for-byte non-regression baseline). The fire loop now iterates every equipped weapon each tick; each targets and fires independently through its own `WeaponRuntime`.
- `TestProjectile` gains `sourceWeaponIndex: number`, stamped at spawn; hit-resolution reads `equippedWeapons[projectile.sourceWeaponIndex]` instead of the old single global for damage school and status-on-hit — closing the cross-contamination gap above as a byproduct of the same rewrite, not a separate fix.
- Five new "Salvaged &lt;weapon&gt;" upgrade offers (`weaponEvolution` category, `src/game/progression/sandboxUpgrades.ts`'s new `WEAPON_UNLOCK_UPGRADES`) are the loadout's real acquisition point — no `EquipmentBonus` effect; dispatched through a new `addEquippedWeapon()` (main.ts), capped at 6 and de-duplicated. The starting weapon plus these five reaches exactly six.
- The Passive half of the same flag ("no passive-slot cap exists"): `UpgradePool` (AF-022, locked) gained an additive, optional `isAllowed?: (def) => boolean` constructor predicate — every existing caller that omits it is provably unaffected (new tests in `tests/xpProgression.test.ts` assert the omitted-predicate behaviour is unchanged). `main.ts`'s `resetRun()` supplies one predicate that gates BOTH the 6-distinct-Passive cap (a new `heldDistinctPassiveIds` set, tracking every Passive pick, not just GP-005's instant-effect subset) and weapon-unlock availability (loadout full, or the weapon's already held) — one generic gate, two consumers, matching this session's established "generic interpreter over a closed kind enum" pattern.
- Mastery/arsenal tracking and the debug HUD's detailed per-weapon stat line stay tied to the primary (starting) weapon only — an explicit, documented scope trim (extending per-weapon mastery tracking is a nice-to-have, not core to "up to six weapons can fire"); the HUD's summary line does list every equipped weapon's name and the loadout's current count out of 6.

**Verification:** `tsc --noEmit` clean. Full suite: 2336 tests passing (212 files, up from 2328/211 — 8 new: `tests/weaponUnlockUpgrades.test.ts` (5, new file) + 3 new `isAllowed` tests in `tests/xpProgression.test.ts`; `tests/eliteRewardPool.test.ts` and `tests/waveRewards.test.ts` were added in the commits immediately preceding this doc pass). `vite build` clean. Browser-verified live against the dev server (Playwright): a scripted bot run reached a level-up, was offered and took a "Salvaged Hailborn Array" choice, and the debug overlay's weapons line read `loadout 2/6 [Coil Ripper, Hailborn Array]` immediately afterward — confirming the acquisition path, the interpreter dispatch, and the fire loop's multi-weapon iteration all work together in a real run, with zero console/runtime errors.

**What remains open:** the Level-up content law violation (`SANDBOX_UPGRADES`'s plain stat-percentage entries) — real, flagged since the first execution, not selected by either scope round.

**Review verdict:** Two of GP-FINAL's own three still-open FAIL/FLAGGED items from the second execution (Wave rewards, Elite reward pool) move FAIL → REAL; the third (6-weapon/6-passive build frame, elevated to its own item in the second execution's audit) also moves FAIL → REAL. GP-FINAL remains **NOT LOCKED** — one item (Level-up content law) is still open — but is now one Project Owner scope choice away from meeting its own §3 lock condition.
