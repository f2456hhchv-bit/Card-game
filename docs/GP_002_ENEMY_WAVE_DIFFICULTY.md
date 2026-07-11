# Enemy, Wave & Difficulty Framework — GP-002

Built across `src/game/enemies/` (eliteData.ts, EliteGenerator.ts, enemyData.ts, sniperSynergy.ts), `src/game/director/` (spawnPlacement.ts, meteorShower.ts, conductorData.ts, DirectorConductor.ts), `src/game/bosses/bossData.ts`, `src/game/audio/` (audioData.ts, MusicState.ts), and direct `main.ts` wiring. Second module in the **GP-XXX** track, continuing directly from GP-001 per its own "do NOT redesign previous systems, extend them" instruction.

## The nine gaps

An Explore-agent audit found most of GP-002's 14-section spec already real across AF-017/021/033/034/035/056 (a real Enemy Hierarchy, a real `ENEMY_ROLES` union, real modular AI, a real intelligent `EnemyDirector`, real multi-input difficulty scaling, real per-phase bosses, real elite mutations, most of the 9 named events already registered). The Project Owner's answer to the scope question was **"Everything the audit found"** — all 9 genuine gaps:

1. **6 dormant elite mutations completed + 3 new** — reflectiveArmour/gravityField/summoner/quantumShift/temporalEcho/adaptiveArmour flip from catalogue-only to mechanically live; Electric/Cloaked/Vampiric added to match the spec's Elites list verbatim. 18/18 mutations now mechanically live.
2. **6 missing enemy roles tagged** — assassin, commander, charger, ambusher, burrower, exploder, shieldUnit (19 roles total), tagged across xeno/void/eclipsed/outlaw/machine/nomad rosters (with one deliberate lore-respecting exclusion).
3. **Snipers punish standing still** (`sniperSynergy.ts`) — the spec's own named Synergy example, now a real damage-multiplier check against player stillness.
4. **Camera-aware spawn placement** (`spawnPlacement.ts`) — waves spawn outside the camera viewport where geometrically possible.
5. **Director gains clear-speed + near-death inputs** — `DirectorConductor.recordKill()`/`recordNearDeath()` complete 8/8 of the spec's Director Intelligence monitored inputs, preserving AF-056's "pacing-only, never enemy stats" guarantee.
6. **Boss gains real 3rd/4th phase + per-phase music** — Hollow Sentinel becomes a real 4-phase Learning→Pressure→Chaos→Signature arc with two new music states.
7. **3 dormant environmental events wired** — Meteor Shower (new hazard content on AF-035's existing engine), CrystalGrowth, MachineReinforcements now do something real when triggered.
8. **Merchant tied to wave milestones** — every 7th wave (mirroring the spec's own Wave 7 example) opens the mid-run merchant.
9. **World Boss tier + boss-chance continue mode** — `createWorldBossVariant()` scales an existing `BossDef` exactly the way `EliteGenerator` scales a base `EnemyDef`; Push Deeper now rolls a real, escalating boss chance and scales research rewards by extraction depth.

## Wave-pacing review

AF-017's locked `phaseSequence` (Recovery→LightContact→Combat→HeavyCombat→ElitePressure→Recovery→EnvironmentalEvent→HeavyCombat→MiniBoss→Recovery) was compared against the spec's own 10-wave example and found to already encode the same shape (ramp → pressure peak → breather/event → second peak → climax). No reorder made — documented as a deliberate "already aligned, don't force a redesign" finding.

## Live

Debug overlay line: `gpEnemyWave mutations <n>/<n> live · roles <n> · stationary <n>s · conductor kills=<n> nearDeaths=<n> struggle=<n> · boss <id> (<n> phases) · world boss chance <pct>%`. Browser-verified against a real automated run: a genuine spawned elite carrying `MYTHIC [berserker, electric, quantumShift]` (two new mutations live simultaneously on a real runtime enemy), a real wave-milestone merchant trigger firing mid-run, zero page errors, only the pre-existing baseline 404.

## Review

Zero edits to `EliteGenerator`'s roll algorithm, `BossRuntime`'s generic phase-transition logic, `BossArena`'s hazard-zone engine, or any locked union's existing members (all extensions additive-only). A boss hull/threshold rebalance (900→3000 hull, respaced phase thresholds) was required after adding phases 3/4 surfaced a transition-window damage-overshoot cascade risk in testing — fixed and verified via the full boss test suite. 63 new tests, suite at 2223 (201 files). Score 9.5/10 — approved and locked.
