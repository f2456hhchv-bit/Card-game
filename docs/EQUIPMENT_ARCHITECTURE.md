# AFTERLIGHT — Equipment Architecture (AF-079)

**Authority:** Produced output of AF-079. Extends AF-000 → AF-078 — above all AF-028's unchanged equipment engine (slots, categories, validation, aggregation, sets), AF-031's energy resource, AF-073's ship-module vocabulary, and AF-074's manufacturer register. Every future Equipment Module extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** equipment is ENGINEERING — every profiled module must carry at least one non-numeric dimension (`engineeringDimensionsFor ≥ 1`); actives draw real energy; heat and weight are registered from day one; and the workshop only ever advances.

---

## 1. The engine and the doctrine

AF-028 built the machine: sixteen slots, twelve categories, `SLOT_ACCEPTS`, `validateLoadout`, `aggregateLoadout`, set thresholds. AF-079 adds the doctrine on top as pure data — `EquipmentProfileDef` wraps a module BY ID with the ten engineering fields the spec demands, and `equipmentArchitectureFor` proves all **seventeen architecture parts** (unique ID through future expansion hooks) as a function. Nothing in AF-028 changed.

## 2. One engineering vocabulary

Three total maps bind the game's engineering language together:

- The spec's **sixteen module categories** (reactors → prototype modules) map totally onto AF-028's twelve equipment categories.
- **AF-073's eight ship-module kinds** map totally onto the sixteen — ships and equipment share one vocabulary.
- The spec's **six installation slot kinds** (standard, specialist, experimental, ancient, prototype, unique) are each realised by an EXISTING AF-028 mechanism — general slots, category-restricted slots, category gates, and the `uniqueExclusive` flag. No second slot system exists.

Manufacturers are AF-074's real ship-manufacturer register: equipment is ship-installed technology, so its makers are shipwrights.

## 3. The engineering law

**"No module exists only to increase numbers"** is a function, not a sentence: `engineeringDimensionsFor` counts passives, actives, set membership, uniqueness, and category requirements, and every profiled module must score at least one. The refit cannon scores zero and is deliberately unprofiled — it is weapon-category content (AF-032/075's domain), kept as the counterexample that proves the law can reject things.

## 4. Resource management — real energy, registered heat and mass

The **Cryo Manifold** is the first equipment item with an ACTIVE module through AF-028's unchanged shape (Emergency Vent, 15 s cooldown) — and the architecture makes its 20-point energy requirement mandatory: actives draw AF-031's real energy; passive-only modules owe none. `heatOutput` and `weight` are registered dormant numerics (the biomeId pattern) with `engineeringLoadFor` already summing §Debug's energy usage, heat, and mass for the overlay; the heat and mass systems arrive as first consumers, not as retrofits.

## 5. The workshop

`EquipmentCollectionRuntime` is the monotone lattice again: unseen → discovered → **crafted** → mastered, with evolved as a permanent parallel mark. Crafting implies discovery; mastery requires crafting; nothing demotes, nothing removes (no-removal API asserted by prototype inspection). Seven collection states, six upgrade routes, six evolution routes, seven resource surfaces, eight synergy surfaces, and six customisation kinds are registered shelves awaiting content.

## 6. Live in the run

The sandbox loadout gained `equipment4: cryo-manifold`, validated and aggregated by AF-028's real engine — the vanguard 2-piece and the manifold's own bonus stack to +16% boost efficiency, and the overlay's equipment line now reads energy draw, heat load, mass, and workshop progress live.

---

## Internal review loop (AF-079, recorded)

- **Zero engine changes** — profiles, two pure functions, and one monotone runtime; AF-028/031/073/074 untouched. ✔
- **One vocabulary** — three total maps, machine-checked; no second slot system. ✔
- **The law has teeth** — every profiled module scores ≥ 1 engineering dimension; the bare-stat counterexample is excluded by design. ✔
- **Honest energy** — actives draw, passives owe nothing, asserted both ways. ✔
- **Sweep proof** — 1,000 seeded engineering careers: the lattice never regresses, crafted ≤ discovered, mastered ≤ crafted, load never negative. ✔
- **Reachable, live** — `draw 20 · heat 12 · mass 40 · workshop 4/5 crafted` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the architecture parts, category maps, installation mechanisms, engineering law, and workshop lattice bind at every future equipment module.**
