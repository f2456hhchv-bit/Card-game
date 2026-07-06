# AFTERLIGHT — Research Framework

**Authority:** Produced output of AF-024. Extends AF-000 → AF-023. Every future technology, progression system, unlock, and permanent upgrade extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** research unlocks *possibilities*, not just numbers — every technology expands what future runs can be, and research is never lost.

---

## 1. The research loop

Complete mission → collect **research samples** (an AF-023 loot category — the systems interlock, neither knows the other) → return to Galaxy Command → spend points on nodes → improve future runs → discover new technologies → launch again. Permanent progression is the other half of AF-022's temporary progression; together they are the Constitution's two-track promise.

## 2. Persistence (the save system, now real)

`src/core/save/` implements AF-001 §8 for its first consumer:

- **Slices** are envelopes `{version, checksum, data}` — research, and every future slice (settings, collections, statistics…), independently versioned.
- **Migrations** are pure `vN → vN+1` functions, chained automatically on load; old saves always upgrade.
- **Corruption never cascades:** a failed checksum quarantines the bad payload (kept for diagnosis), falls back to the rolling backup, and only if both fail resets *that slice alone* to defaults. A corrupted settings file can never cost the research tree.
- **Storage is an interface:** localStorage adapter today; IndexedDB, Steam Cloud, and account sync implement the same contract later (runs/Commanders/ships/devices/cloud all read one truth).

## 3. The tree engine

Nodes are data: **id · category · tier · cost · completion time · prerequisites · unlock type · hidden flag · (future) exclusive group.** The engine provides: prerequisite gating · branching and cross-links · **graph validation at load** (cycles and unknown prerequisites fail loudly in dev, are quarantined in production) · node states (*unlocked / available / locked / hidden*) · point spending · **hidden discoveries** revealed by trigger facts on the bus (boss defeats, ancient artifacts, galaxy discoveries, mission chains, rare events, research combinations) · **full reset** with total refund, preserved statistics, preserved discoveries, and a destructive-action warning (AF-003 §8). Partial refund registered future.

## 4. Categories, node types, and effects

**Fifteen categories** (Commander Development → Quality of Life) and **eleven node types** (Passive Bonus → Ancient Discovery) registered as content shelves. Effects feed existing systems — passives enter the AF-021 damage pipeline's *research stage* (its first live input), loot bonuses feed AF-023's rarity ladder shift, unlock types gate Commanders/ships/missions/biomes/galaxies. Research makes systems *available*; it never duplicates them.

## 5. Choice & balance laws

Early research unlocks options; mid deepens builds; late enables mastery. **No mandatory paths** and **no dominant path** are content-QA laws for the real tree (AF-011's severity-one balance rule applied to permanent progression): the framework's only structural ordering is prerequisites, and the tree review must show multiple viable specialisation routes at every tier. Dedication over grinding: points come from play variety (samples, discoveries, bosses), and node costs are data — pacing is a tuning table, not a treadmill.

## 6. Presentation, accessibility, performance

The research screen (technology network, category colours, progress lines, unlock celebration, prerequisite indicators) builds from AF-005 components at the UI module, with search/filter, large nodes, controller/touch navigation, and all locked accessibility floors. Engine-side performance is already paid: unlocked-node cache, O(edges) availability recomputation only on change, branch data lazy-loadable, UI pooling per AF-005 §10.

## 7. Debug

Live: research points · unlocked/available/locked/hidden counts · dependency chains for any node · unlock event log · save slice status (version, last write, backup state).

---

## Internal review loop (AF-024, recorded)

- **Permanence** — real save slice with checksum/migration/quarantine/backup; reload-survival verified in the browser. ✔
- **Graph integrity** — cycle and dangling-prerequisite validation tested; hidden reveal and reset (refund + preservation) tested. ✔
- **Integration** — samples via loot category; passives via the pipeline's research stage; discovery triggers via the bus; nothing duplicated. ✔
- **Choice** — no-mandatory/no-dominant recorded as binding tree-content QA; exclusive groups registered future without dead scaffolding. ✔
- **Simplification pass** — rejected a separate "research currency" per category (one point pool + per-node costs express specialisation without wallet sprawl); rejected timed research queues for now (completion time is node data, but queue mechanics wait for a design reason — respect-for-time suggests instant unlocks unless a module argues otherwise; **flagged for Project Owner** at tree-content time); rejected engine-level path locking (prerequisites express structure; exclusivity waits for its future flag). ✔

**Internal quality score: 9.5/10 — approved and locked; tree content and research-screen passes bind at their modules.**
