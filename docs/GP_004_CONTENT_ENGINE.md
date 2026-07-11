# Content Engine — GP-004

Built across new `src/game/passives/passiveData.ts`, new `src/game/artifacts/artifactData.ts`, extensions to `src/game/weapons/weaponData.ts`/`weaponFrameworkData.ts`/`weaponRosterData.ts`, `src/game/commanders/commanderData.ts`, `src/game/progression/xpTuning.ts`, and direct `main.ts` wiring. Fourth module in the **GP-XXX** track, continuing directly from GP-003.

## The six architecture fixes

GP-004 asks a different question than GP-001/002/003: not "does mechanic X exist," but "can the data architecture scale to 1000+ weapons / 500+ Commanders / 500+ artifacts without requiring engine-code changes." A dedicated audit distinguished genuine **architecture violations** (adding content would require editing code) from **content-volume gaps** (the mechanism is already generic; only more authored data is missing — which the spec itself frames as future work). The Project Owner's explicit scope answer was **"Fix the real architecture violations"** — the first GP module where the answer was NOT "everything the audit found":

1. **Faction squad-spawning: hardcoded ids → generic roles.** All 10 squad-spawning functions in `main.ts` found their leader/special member via `def.id === "<hardcoded-string>"`. Now `EnemyDef.roles.includes(...)` (GP-002's own role tags), guarded by a new `tests/factionSquadRoles.test.ts` (21 tests) — which caught a real bug: `machine-command-core` carries `"controller"`, not `"elite"` (its own lore denies leadership).
2. **Scattered `drone.def.id` checks** (a constellation-destroyed handler, a mine-layer hazard loop) fixed the same way.
3. **Commander Ultimates gained a real effect interpreter.** A new optional `effect?: CommanderUltimateEffect` field (`novaDamage`/`barrierBurst`/`healBurst`) plus one generic `switch(effect.kind)` in `main.ts`, dispatching onto already-existing mechanisms. Previously every Ultimate was camera-shake-and-toast only, regardless of which Commander.
4. **Standalone Passive registry.** 14 named categories (`PASSIVE_CATEGORIES`), reusing AF-028's `PassiveTrigger`/`EquipmentBonus` vocabulary, wired into the real, tested level-up flow (`SANDBOX_UPGRADES`/`applyUpgrade` — whose own `switch(id)` was the same anti-pattern as item 1, just in the core level-up system).
5. **Standalone Artifact registry.** 4 real, permanent, build-altering entries distinct from `bossArtifacts.ts`'s 5 boss-kill-gated rewards — dispatched via 4 new bus listeners (`EnemyKilled`/`PlayerDamaged`/`ShieldBroken`/`CommanderLevelUp`), bought at the mid-run Travelling Merchant.
6. **Weapon-category vocabulary gap.** `WEAPON_CATEGORIES` gains `"summon"` (the one genuine gap — no category, naming layer, or weapon existed for it); two new real weapons (`SWARM_TENDER`, `SPORE_LANCE`) prove both the new Summon category and the pre-existing-but-unused Biological naming layer.

## What was deliberately NOT built

Mass content-authoring for Events/Galaxies/Blueprints/Cosmetics/Museum (the spec's own framing already treats volume growth here as future work — GP-003 built the real generic mechanisms behind most of these), and a JSON-based mod-loader (the spec asks the architecture to make mod support *possible* later, which a data-driven `kind`+`value` interpreter already satisfies, not to build a loader now).

## Live

Debug overlay line: `gpContent  passives 14/14 categories · artifacts [<held>]/4 · weapon categories 16 (+summon) · framework categories 18`. Browser-verified against a real automated run (Splash → GalaxyCommand → MissionSelect → Gameplay): the line rendered live with real counts, the weapon debug line showed `arsenal 1/12` (the two new weapons folded into the existing shelf), zero page errors, only the pre-existing baseline 404.

## Review

Zero new gameplay mechanics invented — every new `kind`-based interpreter (Commander Ultimates, Passives, Artifacts) dispatches onto mechanisms that already existed and were already tested (`dealAreaDamageToEnemies`, `DefenceState.addBarrier`/`healHull`, `dropLoot`'s `researchBonus`, the XP-pickup callback). Two categories (Passives' Summons/Synergy) are honestly labelled "no consumer system yet" rather than backed by a fabricated mechanism, matching `BonusKind`'s own pre-existing convention for `droneEffectiveness`/`orbitalPower`. 38 new tests, suite at 2305 (208 files). Score 9.5/10 — approved and locked.
