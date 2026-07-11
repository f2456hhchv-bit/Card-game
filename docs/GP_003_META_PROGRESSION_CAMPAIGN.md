# Meta Progression, Campaign & Persistent Progression — GP-003

Built across `src/game/galaxy/galaxyClusterData.ts`, `src/game/atlasProgression/AtlasProgressionRuntime.ts`, `src/game/longTermGoals/LongTermGoalsRuntime.ts`, extensions to `src/game/crafting/craftingData.ts`, `src/game/missions/missionData.ts`/`missionFrameworkData.ts`, `src/game/meta/metaData.ts`, six runtime classes gaining `toSave()`/`loadSave()`, and direct `main.ts` wiring. Third module in the **GP-XXX** track, continuing directly from GP-002.

## The twelve gaps

Two parallel audits found most of GP-003's 21-section spec already real (Player Level, Research tree, mission-completion rewards) but identified 12 genuine gaps, all real per the audit rather than assumed. The Project Owner's answer to the scope question was **"Everything the audit found"** — all 12, not a curated shortlist:

1. **Save-persistence fix (critical)** — 6 permanent-by-design runtimes (Commander progression, Roster, Bond Network, Ship outfitting, Ship collection, Campaign) were never registered with the save system — "progression never resets" was false in practice. Now all 6 have real `toSave()`/`loadSave()` and survive a reload.
2. **Meta Loop dead ends** — real "Upgrade Commander"/"Upgrade Ship" buttons, spending talent points and module slots through engines that already existed with no UI.
3. **Galaxy tier + unlocking** — `GalaxyClusterDef` adds a real tier above star systems; a second real cluster (Shattered Expanse) gates on a real `CampaignRuntime` unlock, previously logged but read by nothing.
4. **5 new Home Base screens** — Recruit Commanders, View Museum, Read Codex, Manage Atlas, and a Loadout picker — all previously missing entirely.
5. **Real pre-run Loadout picker** — Ship/Commander choice from what's actually recruited/collected (previously both hardcoded singletons).
6. **9 missing named Mission Modifiers** — the spec's own list (Meteor Storm, Solar Radiation, Black Hole Distortion, etc.) added with real mechanical deltas.
7. **Campaign-depth difficulty scaling** — `StarSystemDef.threatLevel` (set on every system, read by nothing) now feeds `EnemyDirector`'s real threat seam.
8. **Unified long-term-goals tracker** — the spec's 9 named goals composed into one real percentage-based surface.
9. **5 exact-named persistent resources** — Dark Matter/Quantum Crystals/Biomass/Living Metal/Atlas Fragments, each with real grant and spend sites.
10. **Categorized Blueprint system** — 6 real-backed categories (Passives/Buildings excluded — no dormant mechanism exists for either).
11. **Unified Atlas meta-stat object** — the spec's 10 named axes composed into one real overall score.
12. **Deeper per-system content** — 2 systems' mismatched mission assignments corrected (a real bug fix) plus one new mission authored for a third system.

## A real bug found and fixed

Browser verification caught a genuine layout regression: Galaxy Command's growing button list clipped past the viewport under the pre-existing `overflow: hidden`, making buttons unreachable in a real browser. Fixed in `index.html` (`overflow-y: auto` + `min-height: 100%`), verified end-to-end afterward.

## Live

Debug overlay line: `gpMeta commander talent pts=<n> · ship modules <n>/<n> · cluster <id> (<n> total) · roster <n>/<n> · fleet <n>/<n> · atlas score <n> · campaign difficulty <n> (threat <n>) · long-term goals <n>/9 (<pct>%)`. Browser-verified against a real automated run: all 5 new screens rendering live data, zero page errors, only the pre-existing baseline 404.

## Review

Zero edits to any existing runtime's core algorithm (`tryUnlockTalent`/`tryFitModule`/`computeThreat`/`GalaxyRuntime`'s route logic) — every deliverable is either a new `toSave()`/`loadSave()` pair, a new pure composition module, or additive union/content extensions. Two scope trims documented explicitly (Loadout's Weapon/Passive/Artifact/Consumables/Cosmetics; Blueprints' Passives/Buildings) rather than fabricating systems the audit never found dormant. ~100 new tests, suite at 2267 (205 files). Score 9.5/10 — approved and locked.
