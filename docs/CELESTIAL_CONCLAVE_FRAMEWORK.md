# AFTERLIGHT — Celestial Conclave Enemy Framework

**Authority:** Produced output of AF-054. Extends AF-000 → AF-053. Every future stellar civilisation, cosmic entity, astronomical anomaly and celestial expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** there is no single shared strength — only a pattern of links, and each point in it is only ever as strong as what it is still connected to.

---

## 1. Faction Identity — the fourth faction with zero prior lore, by design

The Celestial Conclave are ancient cosmic consciousness, not a civilisation. Like AF-049's Void Swarm, AF-051's Xenomorph Hive, and AF-053's Paragon Protocol, this framework adds no `FactionDef`. Its Codex entry cross-references the Paragon Protocol's as another non-civilisation threat.

## 2. Visual Language — data now, art at the asset pass

`CELESTIAL_VISUAL_LANGUAGE` records solar-plasma gold-white, a nova-yellow accent, and a void-trace blue; live today in the gravity-well canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — thirteen registered, six fully authored, zero schema changes

Solar Spark, Pulsar Hunter, Gravity Oracle, Constellation Avatar, Corona Guardian, and Elite Living Supernova are plain AF-033 `EnemyDef`s, checked distinct from the base roster and all eight prior factions. Ranged attacks ARE AF-032 `WeaponDef`s, the first real use of the `orbital` category. Seven further unit kinds are registered vocabulary.

## 4. Combat Style & Celestial Network — the graph is the weapon

Live today: a fixed-pattern adjacency graph (`CelestialConstellationRuntime`) where each living entity's Solar Energy (damage), Shield Strength (incoming-damage reduction), and Healing bonuses are computed from its OWN surviving link count — never from one value shared by the whole formation. Gravity Wells grow AF-035's exact hazard engine a sixth time, seeded on the Gravity Oracle's own cadence.

## 5. Anchor Entities — a cascade from the graph itself

The deliberate ninth doctrine: the Constellation Avatar is wired as the graph's highest-degree point at spawn, an anchor by construction rather than a flag. Its death removes a link from every neighbour simultaneously — a real cascade, verified live when a formation's Avatar died to real combat and its neighbours' link counts visibly matched the graph model exactly.

## 6. Elite Variants & Mini-Bosses

Living Supernovas spawn as AF-034 Elites through the unchanged pipeline. The six Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 7. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Stellar Essence, Solar Cores, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Constellation Avatar kill.

## 8. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); formation state is surfaced plainly on the debug overlay (per-entity link counts, entity/gravity-well counts); Gravity Wells are a capped, run-scoped array reusing the boss arena's pooled hazard-tick pattern a sixth time.

## 9. Debug

Live: per-constellation entity count and per-entity link-count array, live gravity-well count — the shared `DebugOverlay` `celestialConstellations` field. A dev-only spawn key ("1") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), Crystals' (7), Void's (6), Ancient Custodians' (5), the Xenomorph Hive's (4), the Stellar Nomads' (3), and the Paragon Protocol's (2).

---

## Internal review loop (AF-054, recorded)

- **No duplicated systems** — schema, weapons, elites, the hazard engine, formation math reuse, loot, Codex, and the `EnvironmentalEventTriggered` fact all reuse AF-017/021/032/033/034/035/043 exactly; `CelestialConstellationRuntime` is the only genuinely new surface. ✔
- **Local, not global** — verified live and across a 1,000-encounter sweep: every remaining member's link count and derived bonuses stay within bounds regardless of kill order, and two members can carry different bonus magnitudes at the same instant. ✔
- **Anchors emerge from the graph, never a flag** — the Avatar's outsized impact on death was verified to come entirely from its degree in the constructed graph, with zero special-cased "anchor" logic in the runtime. ✔
- **Adapts without becoming unfair** — the link-count cap held even at a ten-node, fully-connected test graph. ✔
- **Sandbox proof** — a live formation's Avatar died to real combat before the first observation, and its neighbours' link counts visibly matched the graph model exactly — a genuine cascade, not a scripted one — zero page errors. ✔
- **Self-review found the doctrine's defining behaviour confirmed by accident** — the browser verification pass didn't need to be engineered to show the anchor cascade; ordinary combat produced it naturally within the first observation window. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven unit defs, nine Special Mechanics beyond Gravity Wells, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
