# AFTERLIGHT — Bio-Engineered Xenomorph Framework

**Authority:** Produced output of AF-051. Extends AF-000 → AF-050. Every future Hive organism, biological ecosystem, adaptive mutation and organic expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Hive never wastes biomass — every death, its own included, strengthens future generations, and Biomass has no way down at all.

---

## 1. Faction Identity — the second faction with zero prior lore, by design

The Hive's own spec states it plainly: it is not a civilisation. Like AF-049's Void Swarm, this framework adds no `FactionDef`. Its Codex entry cross-references the Void Swarm's as the galaxy's other explicitly-non-civilisation threat.

## 2. Visual Language — data now, art at the asset pass

`XENO_VISUAL_LANGUAGE` records organic chitin, a bioluminescent-vein green, and a sharper acid-green accent; live today in the acid-pool canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — fourteen registered, six fully authored, zero schema changes

Hive Drone, Spitter, Stalker, Evolution Node, Crusher, and Elite Living Titan are plain AF-033 `EnemyDef`s, every one using the dormant `swarm` family — its first use since AF-033 registered it, which makes cross-faction overlap structurally impossible. Ranged attacks ARE AF-032 `WeaponDef`s. Eight further unit kinds are registered vocabulary.

## 4. Combat Style & Evolution System — biomass is the weapon

Live today: a monotonic Biomass pool (`HiveEvolutionRuntime.biomass`) climbing from encounter duration and from every death — never decreasing — driving a five-stage Evolution ratchet, hard-capped for fairness. Healing, Target Information, and Aggression are mechanically live, gated on the Hive Node's network link and stepped by the permanent stage. Rapid Reinforcement (stage 2+, linked) manufactures a real reinforcement, reusing AF-047's Drone Factory pattern a fifth time.

## 5. Hive Network — sever the node, cut the sharing, never the biomass

The deliberate sixth doctrine, and the first with no decrease of any kind: destroying the Evolution Node feeds Biomass like any death (nothing wasted) and severs the network link immediately, zeroing shared bonuses for the current encounter — but Biomass itself, and the Evolution Stage it drives, never moves backward. Verified live: the link visibly severed the instant the Node died while biomass kept climbing.

## 6. Elite Variants & Mini-Bosses

Living Titans spawn as AF-034 Elites through the unchanged pipeline. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 7. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Adaptive Tissue, Genetic Samples, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Evolution Node kill.

## 8. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); hive state is surfaced plainly on the debug overlay (stage, biomass %, link state, organism count, reinforcements called); Acid Pools are a capped, run-scoped array reusing the boss arena's pooled hazard-tick pattern a fourth time.

## 9. Debug

Live: per-hive stage name, biomass percentage, network-link state, organism count, and Rapid Reinforcement count — the shared `DebugOverlay` `xenoHive` field. A dev-only spawn key ("4") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), Crystals' (7), Void's (6), and Ancient Custodians' (5).

---

## Internal review loop (AF-051, recorded)

- **No duplicated systems** — schema, weapons, elites, the Drone Factory cadence pattern, the hazard engine, formation math reuse, loot, Codex all reuse AF-032/033/034/035/043/046/047 exactly; `HiveEvolutionRuntime` is the only genuinely new surface. ✔
- **Never wastes biomass, never scatters, degrades, weakens, corrupts, or de-escalates** — verified live and across a 1,000-encounter sweep: biomass never decreases across 100,000 accumulated update-and-kill ticks, regardless of kill order or encounter length. ✔
- **Adapts without becoming unfair** — the 100% cap held under sustained accumulation; "Evolution remains deterministic" is a numeric ceiling, not an assumption. ✔
- **The one thing that CAN be cut is tactical, not permanent** — severing the Hive Node's link zeroes shared bonuses immediately for the current fight, but Biomass and Evolution Stage never move backward, verified live. ✔
- **Sandbox proof** — a live hive's biomass climbed from 0% through the "adapting" threshold at 20%, and the Evolution Node's death registered as an immediate link-severance without halting biomass growth, zero page errors. ✔
- **Self-review found the doctrine composition itself was the interesting result** — resolving "never wastes biomass" against "destroying Hive Nodes weakens surrounding organisms" by giving Biomass and the network link fully independent axes, rather than treating the two spec lines as in tension. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining eight unit defs, six Special Mechanics beyond Burrowing/Wall Traversal/Acid Blood, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
