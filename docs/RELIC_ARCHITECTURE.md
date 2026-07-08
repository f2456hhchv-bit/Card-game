# AFTERLIGHT — Relic Architecture (Relic Framework, AF-077)

**Authority:** Produced output of AF-077. Extends AF-000 → AF-076 — above all AF-029's locked relic system (whose `RelicDef`, rarity/category shelves, stacking rules, exclusion/synergy/evolution model, and `validateRelicDef` law are untouched). Every future Relic extends this architecture; it is extended, never replaced. (AF-029's produced output remains binding for the core system; this document binds the architecture layered above it — the AF-071/073/075 profile precedent, applied to relics.)
**Binding rule of the whole document:** every relic feels handcrafted — fifteen architecture parts as a function; three spec vocabularies as total maps; and the spec's central demand ("relics should rarely provide only flat bonuses") turns out to have been AF-029's law all along, re-asserted here across the extended reliquary.

---

## 1. Profiles wrap defs — AF-029 is never modified

`RelicProfileDef` wraps an AF-029 `RelicDef` by id, adding framework category and tier, visual identity, origin, discovery source, build-defining kind, synergy tags, evolution trigger, codex note, statistics, and expansion hooks. The reliquary extends additively: AF-029's seven relics head the roster unchanged, joined by the **Singularity Keepsake** — a quantum relic with a real trade-off (+damage, −speed: the Zone charges rent), passing AF-029's own validator and working through its unchanged `RelicSystem` (acquisition, stack-cap uniqueness, synergy detection — all exercised in tests).

## 2. Three vocabularies, three total maps

Eight spec tiers onto AF-029's seven rarities; sixteen spec categories onto its thirteen categories; six spec stacking rules onto its four rules plus the `maxStacks` semantics — with fusion combinations binding to the existing `evolutionRequires` field (registered future, no second fusion engine).

## 3. "Never only flat bonuses" was already the law

AF-029's `validateRelicDef` rejects any relic without a behaviour clause — the conditional effect the architecture demands. The tests re-assert it across the extended reliquary, and the completeness function counts the behaviour clause AS the conditional-effect part.

## 4. Collection is a monotone lattice

`RelicCollectionRuntime` tracks discovered → owned → mastered (mastery requires ownership; states only advance; nothing demotes) with evolution as a permanent parallel mark. It is fed by REAL play: both relic-acquisition sites in the composition root advance the lattice, and AF-029's own evolution callback records evolutions forever. No remove/demote/forget operation exists (prototype-asserted).

## 5. Discovery, evolution, synergy — registered

Seven discovery sources, six evolution triggers (every evolving relic names one), six build-defining kinds (every profile names one — the Keepsake and the Gambler's Die both declare riskVsReward), eight synergy surfaces, six customisation kinds, seven collection states. All counted; every future relic binds against them.

## 6. Engine lessons recorded

Two authoring corrections were caught by AF-029's own machinery during this module: uniqueness is expressed through the stack cap (`maxStacks: 1`), and synergy declarations live on the alphabetically-earlier relic (the engine sorts ids and consults one side). Both are now documented conventions for every future relic author.

---

## Internal review loop (AF-077, recorded)

- **AF-029 untouched** — profiles wrap defs; the locked seven head the reliquary unchanged; the validator passes across all eight. ✔
- **Handcrafted, asserted** — all fifteen parts per relic; every profile stat-free by key inspection; trade-offs real (negative effect asserted on the Keepsake). ✔
- **Total maps everywhere** — tiers, categories, stacking rules all resolve onto locked shelves. ✔
- **The lattice holds** — mastery gates on ownership, states never regress, evolution is remembered once and forever; fed by both real acquisition sites and the real evolution callback. ✔
- **Sweep proof** — 1,000 seeded collection careers: the lattice never regresses, mastered ≤ owned ≤ discovered always. ✔
- **Reachable, live** — `relics · reliquary 0/8 owned, 0 evolved` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the tiers, categories, stacking rules, evolution triggers, discovery sources, build-defining kinds and synergy surfaces bind at every future relic and expansion module.**
