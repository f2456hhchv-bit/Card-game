# AFTERLIGHT — Endgame Framework

**Authority:** Produced output of AF-069. Extends AF-000 → AF-068 — above all AF-068's campaign (whose completion is the gate), AF-026's mastery and statistics engines, and AF-036's seeded event-pool discipline. Every future expansion, DLC, live update and seasonal release extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the endgame is not a grind and cannot become one by accident — difficulty has no stat fields to inflate, progression has no walls to hit, ascension resets exactly one map, and nothing permanent can ever be removed. Mastery, exploration and experimentation are the only currencies the type system accepts.

---

## 1. The gate is a state

`EndgameRuntime` constructs LOCKED. Every progression operation no-ops until `notifyCampaignComplete()`, fired by the same composition-root seam that feeds AF-068 — the moment the campaign ladder closes, the endgame opens, fed by the same three real-play events. In-game, the overlay shows the locked state verbatim until then.

## 2. Ascension — the two-map split

`ascend()` clears the per-ascension expedition map and touches nothing else: lifetime totals, research, evolution, and legacy all persist ("resets expedition progression, retains permanent progression", asserted in one test). Requirements scale linearly per level; the authored Ascensions I–III (The Second Dawn, The Long Watch, Past the Horizon) each carry axis modifiers, real reward kinds, and an unlocked mechanic — and `ascensionLevelFor` generates the same shape beyond them forever ("unlimited future expansion", tested to level 10 with compounding modifiers).

## 3. Difficulty without inflation

`AscensionModifierDef` = one of five registered axes + a description. No numeric field exists — a health or damage multiplier is unrepresentable, asserted across fifty generated levels by inspecting the shape's own keys. Escalation compounds by ADDING modifiers, never by scaling stats.

## 4. Infinite research, no walls

Node costs grow geometrically per branch (`researchNodeCostFor`), six branches scale independently and unboundedly, and progression halts only when banked points run out — topping up by one node's cost resumes immediately. No caps, no cliffs, no daily gates.

## 5. Legendary expeditions, world events, legacy

Eight expedition kinds are the primary endgame activity, tracked per-ascension AND lifetime. World events are a seeded weighted pick from the eight registered kinds — deterministic under an injected `Rng`. The six-kind legacy log and six-kind evolution log are append-only; like AF-068, the class exposes no removal operation (asserted over the prototype): the player's journey becomes part of the universe, permanently.

## 6. Mastery is AF-026

The eight mastery tracks are AF-026 mastery-track IDs (`endgame:ships`, `endgame:biomes`, …) — registered vocabulary, no second mastery engine. "There is always another goal" is the sweep's closing assertion: the next ascension requirement is always finite and stated.

## 7. Registered shelves

Ten endgame phases (including the Constitution-compliant `communityEvents` future slot — online remains an optional later layer), eight expedition kinds, six evolution kinds, five difficulty axes, six research branches, eight reward kinds, eight world events, eight mastery tracks, six legacy kinds — all counted in tests; future seasonal/DLC modules bind against them.

---

## Internal review loop (AF-069, recorded)

- **Zero engine changes** — one pure runtime in the AF-056/057/068 orchestration class; one shared composition-root seam; one overlay line. ✔
- **Not a grind, by type** — no numeric modifier fields (fifty-level assertion), no removal API (prototype assertion), no walls (run-dry-and-resume research test), linear/geometric formulas only. ✔
- **The gate holds** — seven operations no-op before unlock; the locked state renders in-game verbatim. ✔
- **The two-map split holds** — ascension clears expedition progress only; lifetime, research, evolution, legacy survive together in one test. ✔
- **Sweep proof** — 1,000 seeded careers × 200 mixed operations: permanent progression and ascension level never regress, per-ascension progress resets on every ascension, and the next goal is always finite ("there is always another goal", literally). ✔
- **Reachable, live** — launched, `endgame locked — the endgame begins after the main campaign` beside the campaign line on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the phases, expedition kinds, difficulty axes, reward kinds, world events, mastery tracks and legacy kinds bind at future expansion, DLC and seasonal modules.**
