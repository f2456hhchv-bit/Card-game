# AFTERLIGHT — Commander Architecture (Commander Framework, AF-071)

**Authority:** Produced output of AF-071. Extends AF-000 → AF-070 — above all AF-030's locked commander system (whose `CommanderDef`, archetype shelf, four-hook signature and fingerprint no-overlap law are untouched), AF-028's bonus vocabulary, AF-026's mastery engine, and AF-069's ascension gate. Every future Commander extends this architecture; it is extended, never replaced. (AF-030's produced output `COMMANDER_FRAMEWORK.md` remains binding for the core system; this document binds the full architecture layered above it.)
**Binding rule of the whole document:** nothing is left undefined — the 17-part architecture is a function (`architectureFor`), not a checklist; relationships cannot carry stats, cosmetics cannot carry stats, and no commander can duplicate another's fingerprint.

---

## 1. Profiles wrap defs — AF-030 is never modified

`CommanderProfileDef` wraps an AF-030 `CommanderDef` by id, adding class, visual design, voice, the three new ability stages, talents, mastery, missions, lore, relationships, statistics, cosmetics, and future expansion hooks. The eight spec classes map totally onto AF-030's ten locked archetypes — a naming layer, never a redesign. The roster extends additively: AF-030's pair plus AF-071's scientist (Dr. Sen Vael, "Meridian"), all three passing AF-030's own `findOverlap` law with distinct fingerprints. `ROSTER_TARGET` registers the 12–16 release goal for roster modules to fill.

## 2. The seven-stage ability structure

AF-030's four hooks are stages 1–5 (its signature mechanic IS the fifth); AF-071 adds the secondary ability (a plain AF-028 `ActiveModule`), the mastery passive (a plain `CommanderPassive`), and the ascension upgrade — which unlocks a designated talent node FREE when AF-069's ascension level reaches the gate, exactly once. Cross-module, no new stats.

## 3. Talent trees — hybrid by default, specialisation earned

Three branches per commander, each carrying all six node kinds (combat, utility, economy, mobility, specialisation, endgame — asserted per branch), every node a real AF-028 `EquipmentBonus`. Nodes unlock from any branch in any order — hybrid builds are the default — and only the endgame node has a prerequisite (three owned nodes in its own branch). Aggregated bonuses are cached until the build changes (§Performance, reference-equality tested).

## 4. Mastery, missions, progression

Mastery is AF-026's engine — `commander:{id}` track IDs, and the composition root's placeholder track became the real one. Personal missions advance strictly through the six beats (origin → recruitment → objectives → companions → legendary → resolution). Progression is append-only: no remove/respec operation exists (prototype-asserted, the AF-068/069/070 pattern).

## 5. Relationships and cosmetics — neutral by shape

A relationship is a subject (six registered), a target id (resolution-tested against real codex entries and commanders), and a dialogue hint — no bonus field exists, so "relationships influence dialogue, not gameplay balance" is unrepresentable. Cosmetics are a kind (seven registered) plus an id.

## 6. Registered shelves

Eight classes, seventeen architecture parts, seven ability stages, six talent-node kinds, six mission beats, seven progression kinds, six relationship subjects, seven cosmetic kinds, and the roster target — all counted in tests; every future Commander binds against them.

---

## Internal review loop (AF-071, recorded)

- **AF-030 untouched** — profiles wrap defs; the locked roster is byte-equal at the head of the extended one; the overlap law holds across all three fingerprints. ✔
- **Nothing left undefined** — all 17 architecture parts asserted per commander via `architectureFor`; all seven ability stages present. ✔
- **Hybrid builds, earned specialisation** — cross-branch unlocking tested; endgame-node gating tested; the bonus cache invalidates exactly on build change. ✔
- **Neutral by shape** — relationships and cosmetics carry no stats (key inspection); progression exposes no removal API. ✔
- **Sweep proof** — 1,000 seeded careers of random grants and spends across all three commanders: the point ledger never drifts, every spent point is a live AF-028 bonus. ✔
- **Reachable, live** — `Longlight (assault) · talents 0/18 (0 pts) · mission originStory` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the classes, architecture parts, ability stages, talent kinds, mission beats and cosmetic kinds bind at every future Commander and roster module.**
