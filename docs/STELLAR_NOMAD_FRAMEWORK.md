# AFTERLIGHT — Stellar Nomad Enemy Framework

**Authority:** Produced output of AF-052. Extends AF-000 → AF-051. Every future independent fleet, mercenary organisation and frontier civilisation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** Nomads use whatever is available — Scrap is earned, then spent, and every tactical action can fail for poverty as easily as for cooldown.

---

## 1. Faction Identity — the seventh profiled faction

`nomadFleet` was a registered-but-unprofiled AF-039 `FactionId`, exactly like AF-046's Mercenary Guild and AF-050's Ancient Custodians before it. This module gives it a full `FactionDef` — territory, government, technology, unique resource — paying off that content debt.

## 2. Visual Language — data now, art at the asset pass

`NOMAD_VISUAL_LANGUAGE` records mixed hull tones, an improvised-orange marking accent, and a scrap-grey; live today in the debug overlay's fleet summary, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — fourteen registered, six fully authored, zero schema changes

Scout Skiff, Hunter, Escort Fighter, Junker Gunship, Repair Frigate, and Elite Nomad Flagship are plain AF-033 `EnemyDef`s, checked distinct from the base roster and all six prior factions. Ranged attacks ARE AF-032 `WeaponDef`s, including the first real use of the dormant `stasis` status and `returning` projectile behaviour. Eight further unit kinds are registered vocabulary.

## 4. Combat Style & Fleet Coordination — Scrap is the weapon

Live today: an actively-spent Scrap economy (`NomadFleetRuntime.scrap`) earned passively and spent on three cost-AND-cooldown-gated actions — Deployable Turrets, Scrap Shields, Emergency Repairs. Target Priority (Scrap-derived damage bonus) and Escort Protection (headcount-derived incoming-damage reduction, fully independent of Scrap) are the two mechanically-live Fleet Coordination traits.

## 5. Command Ship — disrupt the rate, not the value

The deliberate seventh doctrine, and the first kill-consequence that changes a derivative rather than a value: destroying the Nomad Flagship (both the AF-034 Elite leader and the fleet's Command Ship) leaves banked Scrap untouched and only throttles future income. "Disrupts fleet cohesion" is exactly that — a slowdown, not a snap.

## 6. Elite Variants & Mini-Bosses

Nomad Flagships spawn as AF-034 Elites through the unchanged pipeline. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 7. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Ship Components, Rare Scrap, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Command Ship kill.

## 8. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); fleet state is surfaced plainly on the debug overlay (Scrap level, command-ship state, crew/escort counts); tactical actions reuse the shared spawn path and hull-heal pattern established by every prior faction's reinforcement/heal mechanics.

## 9. Debug

Live: per-fleet Scrap level, Command Ship status, crew and escort counts — the shared `DebugOverlay` `nomadFleets` field. A dev-only spawn key ("3") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), Crystals' (7), Void's (6), Ancient Custodians' (5), and the Xenomorph Hive's (4).

---

## Internal review loop (AF-052, recorded)

- **No duplicated systems** — schema, weapons, elites, formation math reuse, loot, Codex, and faction profiling all reuse AF-032/033/034/039/043/046/050 exactly; `NomadFleetRuntime` is the only genuinely new surface. ✔
- **Spent, not shared** — verified live and across a 1,000-encounter sweep: every tactical action is gated on both affordability and cooldown, and Scrap never exceeds its cap. ✔
- **Disrupts a rate, never a value** — the Command Ship's death was verified to leave banked Scrap exactly where it was, only slowing future income, distinct from every one of the six prior doctrines' kill-consequences. ✔
- **Two independent live inputs, not one** — Target Priority (Scrap) and Escort Protection (headcount) never influence each other, verified live and in unit tests. ✔
- **Sandbox proof** — a live fleet's Scrap climbed from 1 to 8 at the tuned rate under real combat, and an Escort Fighter's death was tracked distinctly from ordinary crew losses, zero page errors. ✔
- **Self-review found no defect to fix** — the cost-and-cooldown double-gate worked correctly on the first pass, including the "unaffordable even with cooldown ready" case verified explicitly in `tests/nomads.test.ts`. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining eight unit defs, seven Special Mechanics beyond Salvage Recovery/Deployable Turrets/Repair Fields/Magnetic Harpoons/Scrap Shields, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
