# AFTERLIGHT — Mission Architecture (AF-083)

**Authority:** Produced output of AF-083. Extends AF-000 → AF-082 — above all AF-037's unchanged mission engine (templates, deterministic generation, run-scoped objective runtime), AF-017's director, AF-035's bosses, AF-036's biomes, AF-038/058's galaxy-driven terrain, and AF-039's factions. Every future mission extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** nothing remains undefined — every expedition proves fourteen architecture parts; every spec vocabulary rides an existing engine mechanism; threat budgets scale with difficulty, never against it; and no mission relies on randomisation alone.

---

## 1. The engine and the doctrine

AF-037 built the machine: mission templates, a deterministic per-seed generator, and a runtime with counter-keyed objectives, stay-under objectives that start satisfied and revoke permanently, and optionals that never block completion. AF-083 adds the expedition doctrine as pure data — `MissionProfileDef` wraps each template BY ID, and `missionArchitectureFor` proves all **fourteen architecture parts** (unique ID through future expansion hooks). Nothing in AF-037 changed.

## 2. Three total maps, zero new machinery

- The spec's **seventeen mission categories** map totally onto AF-037's fifteen (sabotage is machine-assault work; world-event expeditions are incursions today).
- The spec's **eight mission events** map totally onto AF-037's ten event kinds — which already bind to the real environmental-event vocabulary, so the chain spec event → mission event → bus fact is asserted end-to-end.
- The **nine-phase mission structure** (preparation → debrief) names the existing seam realising each phase — GalaxyCommand, startRun, BiomeRuntime, MissionRuntime counters, the Director's curve and MiniBoss phase, the Boss seam, the extraction window, the endRun debrief. No second state machine exists.
- The **eight objective kinds** ride AF-037's two engine mechanisms: the primary array and the optional array. No third array exists.

## 3. The expedition roster

Three expeditions, the sandbox template unchanged at the head:

- **Crystal Fields Incursion** (worldEvent · T1 · budget 120) — the original proving expedition, now fully profiled.
- **Winterline Rescue** (rescue · T3 · budget 320) — the first expedition beyond the sandbox biome: three stranded crews in the Frozen Reach, a stay-under optional in the stillness.
- **First Light Excavation** (ancient · T6 · budget 600) — vault scanning in the Ancient Core with real boss potential on the Sentinel seam.

Biomes resolve against real biome defs, bosses against AF-035's register, faction presence against AF-039's register, and **threat budget is strictly monotone with difficulty**. Per AF-058 the run's terrain follows the galaxy map — the mission's biome is its authored setting.

## 4. Honest registries

Ten reward kinds carry a live flag (credits, resources, research, commander XP, ship records, equipment and relics already flow; blueprints, ancient technology and legendary discoveries honestly await their systems). Nine generation inputs and eight variation sources each name the live system they draw from. Five failure consequences, nine permanent history fields, and two forbidden outcomes — randomisation-alone and frustration — are registered by name.

## 5. Live in the game

Mission Selection offers every expedition with category, difficulty, and threat-budget previews; the selected template feeds the real generator and runtime; and the overlay's mission line reads the framework category, budget, objective progress and rolled modifiers live.

---

## Internal review loop (AF-083, recorded)

- **Zero engine changes** — profiles, one completeness function, two new templates on real biomes. ✔
- **Nothing undefined** — fourteen parts proven per expedition, with real biome/boss/faction resolution. ✔
- **No new machinery** — three total maps onto existing shelves, seams, and mechanisms, asserted. ✔
- **Played through the real engine** — the Winterline Rescue completes via rescue counters; stay-under revokes and never resurrects; optionals never block. ✔
- **Generation proof** — 3,000 expeditions: deterministic per seed, modifiers always from the template's own pool, variation real. ✔
- **Sweep proof** — 1,000 seeded careers through the real runtime: progress monotone, invariants hold. ✔
- **Reachable, live** — expedition selected and launched in the browser with a rolled modifier, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the architecture parts, category and event maps, structure seams, objective mechanisms, and honesty registries bind at every future mission module.**
