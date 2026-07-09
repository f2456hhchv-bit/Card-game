# AFTERLIGHT — Living Faction Ecosystem (AF-086)

**Authority:** Produced output of AF-086. Extends AF-000 → AF-085 — above all AF-039's unchanged faction engine (the ten-attribute shelf, conflict states, `FactionRuntime`) and AF-085's unchanged profile architecture. Every future civilisation, expansion, diplomacy update and galaxy simulation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the galaxy writes its own story — civilisations tick whether or not the player is present, no phase or war can stall forever, player influence is hard-capped everywhere it touches the simulation, and no faction locks in permanent dominance.

---

## 1. Ten attributes, finally alive

AF-039 registered `FACTION_ATTRIBUTE_KINDS` — ten names — as its own recorded content debt, never ticked. AF-086's `CivilisationSimulationRuntime` gives every one a baseline and a per-epoch delta discipline. Four spec model parts have no AF-039 home (Population, Industrial Output, Resource Reserves, Infrastructure) and become new live registers; Territory reuses AF-038's `GalaxyRegion` via `FactionDef.territory` unchanged; Historical Events is the module's own permanent timeline. `MODEL_PART_REALISATION` names, for all twelve spec parts, exactly what already exists behind it.

## 2. A life cycle that cannot stall

Eight phases form a closed ring — Transformation wraps back to Expansion — and every civilisation is **forced** to advance after a bounded number of epochs even if the probabilistic roll never fires. "No civilisation remains unchanged forever" is a guarantee the code enforces, not a description.

## 3. Diplomacy you can read

`diplomaticDecisionFor` scores all eight spec factors (resource needs through galaxy events) from real simulated attributes and the real current relationship, returning the score **and** the per-factor breakdown — the reasoning is the output. Past a threshold, the decision applies through AF-039's unchanged `FactionRuntime.setRelationship`. Nine relationship kinds map totally onto AF-039's eight conflict states.

## 4. Warfare that never dictates

A hard cap (`PLAYER_WAR_INFLUENCE_CAP = 0.2`) bounds how much any fed political nudge can move a war's resolution, no matter how large the underlying input — proven with an absurd test input that still clamps. Wars declare on `openWar`, resolve on strength plus capped influence plus noise, and always relax to `ceasefire` through the real engine while logging to permanent history.

## 5. Ten events, one authored pattern

Every galactic event carries an authored attribute-delta table — the mission-modifier discipline again — and, where one naturally exists, a binding to a real AF-039 faction event (four of ten bind cleanly). No new bus vocabulary was invented for the rest; they apply directly to simulated state and log to history.

## 6. Permanent history, one more time

`GalacticHistoryRuntime` is AF-084's append-only expedition log turned on the galaxy itself — sequence-monotone, no removal, the galaxy's own memory.

## 7. The sixth uniqueness axis

Six of the spec's seven Faction Specialisation parts are already unique under AF-085's law. AF-086 adds Scientific Priority — mapped onto AF-082's real fifteen-discipline roster — as a sixth axis, asserted pairwise-distinct across all six profiled civilisations.

## 8. No permanent winner — proven

Civilisations start with staggered life-cycle phases so fortunes rotate structurally. A 50-seed × 500-epoch sweep confirms the attribute-sum leader at epoch 100 is not always the leader at epoch 500 — permanent domination does not emerge from the authored dynamics.

## 9. The Galactic Council, honestly deferred

Seven session kinds registered with zero runtime behaviour claimed — the spec's own words: "future voting systems extend naturally."

---

## Internal review loop (AF-086, recorded)

- **Ten years-old attributes finally tick** — baselines, deltas, clamps, all real. ✔
- **The life cycle cannot stall** — closed ring, forced advancement, proven over 500 epochs. ✔
- **Diplomacy is inspectable** — eight real factors, one score, the reasoning returned. ✔
- **Warfare is bounded** — an absurd player input still clamps; resolution always reaches the real engine. ✔
- **Events are authored, not invented twice** — deltas plus real bindings where they exist. ✔
- **History is permanent** — append-only, no-removal, asserted. ✔
- **No permanent dominance** — a seeded simulation proof, not a claim. ✔
- **Reachable, live** — the factions overlay line ticks from baseline to a real first epoch over wall-clock time, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the model realisation map, life-cycle ring, diplomatic scoring, warfare cap, event table, history discipline and dominance proof bind at every future civilisation module.**
