# AFTERLIGHT — Crystal Ascendancy Enemy Framework

**Authority:** Produced output of AF-048. Extends AF-000 → AF-047. Every future organic, resonant, or growth-based faction extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** crystals resonate, never command — there is no state machine and no leader whose death flips a switch, only a strength value that recomputes continuously from how many nodes still live, and every ounce of threat is cooperation over hierarchy.

---

## 1. Faction Identity — already canon, zero new lore

The Crystal Dominion has been a fully-profiled AF-039 faction since that module (`uniqueResources: crystalFragments`, a live Codex entry). This framework gives its doctrine mechanical life; it invents nothing about who they are.

## 2. Visual Language — data now, art at the asset pass

`CRYSTAL_VISUAL_LANGUAGE` records translucent crystal, rare-blue and violet resonance tones, and a growth-green accent; live today in the growing-zone canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — thirteen registered, six fully authored, zero schema changes

Crystal Drone, Shard Hunter, Resonance Node, Growth Seeder, Crystal Guardian, and Elite Crystal Titan are plain AF-033 `EnemyDef`s passing the no-overlap law against every existing enemy across all three factions; ranged attacks ARE AF-032 `WeaponDef`s. Seven further unit kinds are registered vocabulary.

## 4. Combat Style & Resonance Network — the ecosystem is the weapon

Live today: continuous Resonance strength (`CrystalResonanceRuntime.resonanceStrength`, proportional to living Resonance Nodes, capped at 40%), Healing (scales with strength, no threshold), outgoing damage bonus (composed into the same multiplier point as AF-046's Focus Fire and AF-047's Target Synchronisation), and Movement Speed bonus. Crystal Growth grows a real AF-035 hazard zone's radius over its life via the Growth Seeder's own cadence. Shield Strength, Status Resistance, and Ability Cooldowns are registered awaiting content.

## 5. Environmental Control — one action live, six registered

Create Hazards is mechanically live through the Growth Seeder's `createHazards` special ability and the Crystal Growth engine. Grow Barriers, Spawn Crystal Forests, Alter Movement Routes, Generate Energy Fields, Reveal Hidden Organisms, and Transform Arenas are registered future content.

## 6. Resonance Command — weaken, don't scatter or degrade

The deliberate third mirror against AF-046 (scatter, fear) and AF-047 (degrade, logic): destroying a Resonance Node immediately and measurably weakens every trait the network shares — no delay, no threshold, no single point of failure. Destroying a non-node member changes nothing about resonance strength at all. Both behaviours verified live.

## 7. Elite Variants & Mini-Bosses

Crystal Titans spawn as AF-034 Elites through the unchanged pipeline — tiers, mutations, rewards, Codex signatures. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 8. Faction Synergy & Loot

Kills flow through every existing reward path (XP, drops, elite relics) unmodified. Crystal Fragments, Resonant Shards, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Resonance Node kill.

## 9. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); ecosystem state is surfaced plainly on the debug overlay (organism/node counts, resonance %, live growth count); growth zones are a capped, run-scoped array (`maxLiveGrowths`) reusing the boss arena's pooled hazard-tick pattern.

## 10. Debug

Live: per-ecosystem organism/node counts and resonance strength percentage, live growth-zone count — the shared `DebugOverlay` `crystals` field. A dev-only spawn key ("7") makes the encounter deterministically verifiable alongside the Outlaws' (8) and Machines' (9).

---

## Internal review loop (AF-048, recorded)

- **No duplicated systems** — schema, weapons, elites, Director waves, formation math reuse, hazard engine, loot, Codex, and faction canon all reuse AF-032/033/034/035/039/043/046 exactly; `CrystalResonanceRuntime` and the one small `growCrystalZone` pure function are the only genuinely new surfaces. ✔
- **Resonance, never command** — verified live and across a 1,000-encounter sweep: no ecosystem state machine exists, strength recomputes correctly on every kill order, and strength never leaves `[0, maxResonanceStrength]`. ✔
- **Adapts without becoming unfair** — the 40% cap held at 50 enrolled nodes; strength is per-ecosystem and hits exactly zero once every node is gone. ✔
- **Stronger together, mechanically** — healing, damage bonus, and speed all measurably drop the instant a node dies, so every kill the player chooses visibly subtracts a capability, continuously rather than in a step. ✔
- **Sandbox proof** — a live ecosystem ran with a real Resonance Node, its death collapsed displayed strength from 8% to 0% in the same tick, organism count fell under real auto-fire, and the Growth Seeder seeded two real, ticking, growing crystal hazard zones — zero page errors. ✔
- **Self-review found no defect to fix** — the Growth Seeder shipped with `retreat` movement from the start (AF-047's Constructor lesson applied pre-emptively rather than rediscovered), so the seeding cadence worked on the first live pass. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven unit defs, six registered Environmental Control actions, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
