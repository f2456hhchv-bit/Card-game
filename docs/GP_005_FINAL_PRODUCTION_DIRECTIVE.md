# Final Production Directive — GP-005

Built across new `src/game/progression/sandboxUpgrades.ts`, extensions to `src/main.ts` (the Passive-trigger dispatcher), and `tests/upgradeBalance.test.ts`/`tests/passives.test.ts`. Fifth module in the **GP-XXX** track, continuing directly from GP-004.

## An unbounded prompt, scoped by audit + Project Owner choice

GP-005 asks for continuous refinement across 12 review domains with an explicitly open-ended stopping condition ("only stop when the game is stable, polished, scalable and genuinely fun") — no single pass can literally satisfy that. Three parallel audits (code quality/performance, balance/game-feel/UI, accessibility/save/testing) found real, bounded issues in 4 thematic buckets. The Project Owner selected only **"Balance & Passive triggers"** — the other three buckets (spatial-partitioning performance, remaining hardcoded-id lookups, save-migration/accessibility wiring) are real, documented, and explicitly out of scope for this module.

## The two fixes

1. **Balance**: Rapid Cycler strictly dominated Focused Coils (~2.13x DPS vs ~1.75x at max stacks, identical cost). Rebalanced Rapid Cycler's per-stack value (0.14 → 0.10) to near-parity (~1.69x vs ~1.75x), guarded by a new regression test. `SANDBOX_UPGRADES` extracted from `main.ts` into its own module so this is independently testable.
2. **Passives**: `PassiveDef.trigger` was never read anywhere — every Passive applied as a flat, permanent, one-time bonus at pickup regardless of its stated trigger (the audit's own example: "restores hull when critically wounded" that actually healed once, immediately, at pickup, never again). The 3 Passives whose effect is a genuinely instant action (Hardened Plating, Guardian Ward, Nanite Mesh — all `shieldCapacity`/`shieldRegeneration`) are now held and fired via real event-bus dispatch on their own trigger, mirroring how `SANDBOX_ARTIFACTS` already work. The other 10 stat-kind Passives (damage, cooldownReduction, etc.) correctly stay pickup-permanent — re-firing a permanent stat on every trigger would compound unboundedly.

## What was deliberately NOT built

The O(n²) collision-loop/spatial-partitioning fix, the array-churn fix, the 5 remaining hardcoded-id spawn lookups, dead-code deletion, the save version-migration fix, and remappable-controls/colour-blind/font-scaling wiring — all real audit findings, all explicitly excluded by the Project Owner's scope choice. Also never attempted in any scope option: a real audio backend, a real graphical HUD/menu layer, a dialogue/subtitle system, and a 3D/lighting migration — each its own dedicated future module, not a bug-fix sweep.

## Live

Debug overlay line: `gpContent  passives 14/14 categories (3 real triggered procs, held [<held ids>]) · artifacts […]/4 · weapon categories 16 (+summon) · framework categories 18`. Browser-verified against a real automated run: the line rendered live, the event-bus listener count rose 19→23 (the 4 new Passive-trigger listeners), zero page errors, only the pre-existing baseline 404.

## Review

Zero redesign of completed systems, per GP-005's own instruction — AF-028's Commander/Equipment trigger+bonus convention is untouched; only the standalone Passive roster's instant-effect subset gained real trigger dispatch. 6 new tests, suite at 2311 (209 files). Score 9.5/10 — approved and locked.
