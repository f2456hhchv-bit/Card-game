# AFTERLIGHT — Experience & Level Progression Framework

**Authority:** Produced output of AF-022. Extends AF-000 → AF-021. Every future upgrade, weapon evolution, Commander progression, and gameplay modifier extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every level creates a meaningful decision, and no level is ever wasted — from the first enemy to the final boss, the player is always looking forward to the next one.

---

## 1. XP flow (event-driven, sources open-ended)

XP sources subscribe to facts on the shared bus — kills (`EnemyKilled`, elite/mini-boss/boss scaled), mission objectives, exploration, ancient discoveries, events, research bonuses, challenge modifiers. Combat and missions never know XP exists (AF-001 event law); new sources are new subscribers.

## 2. XP objects (seven tiers, one pooled system)

**Small · Medium · Large · Elite · Boss · Ancient · Research** — one pickup implementation, per-tier value/visual data (all `solar.gold` family per AF-002; size/pulse = significance). Collection: manual contact · auto-pickup radius · **magnet effect** (pickups inside the magnet radius accelerate toward the player — the satisfying vacuum). Radii and magnet strength are build-modifiable (collection relics, Commander bonuses, mission modifiers attach as modifiers). Pickups are pooled (AF-001), deterministic, and capped for density (oldest coalesce into larger gems rather than despawning — value is never lost).

## 3. Level curve (data, anti-grind guaranteed)

Thresholds come from a tuned polynomial with a soft knee: **early levels fast** (experimentation cheap), **mid steady** (build identity), **late slower but bounded** — the growth *ratio* between consecutive levels is capped, so late levels are deliberate, never grind walls. Curve parameters are mission-configurable data; **level cap** is mission data too, with infinite/endless/challenge modes supported (cap = null). Multi-level XP grants queue: each level gets its own upgrade choice.

## 4. The level-up moment

Implements AF-016's LevelUp overlay + AF-003 §7's flow verbatim: threshold → pause (overlay stacks; the run is preserved beneath) → **three upgrade choices** → immediate selection → effects apply → instant resume. Feedback per AF-003's law: gold pulse, celebration scaled to significance, audio (module pending) — levelling always feels important, never bureaucratic. Framework supports four/five choices, rerolls, choice locking, and weighting modifiers as data-driven future flags (relics/Commanders will buy them).

## 5. Upgrade pool (the build-formation engine)

Upgrade definitions are data: **id · category · weight · max stacks · effect payload.** Twelve categories registered (Weapon Upgrade, Weapon Evolution, Commander Ability, Passive, Movement, Shield, Critical, Status Effect, Drone, Orbital, Resource, Special Event). Offers are **seeded and weighted**: N distinct choices, maxed upgrades excluded, deterministic per mission seed (same run, same offers — AF-016 §6's constraint honoured: randomness varies which viable options appear, never whether one exists, because the pool always contains viable options by construction). Builds emerge from choices meeting circumstances — no predetermined paths, no dominant picks (AF-011 severity-one law; upgrades feed AF-021's additive stages, so inflation is structurally impossible).

## 6. Scaling consumers

Player level feeds: player strength (upgrades), **enemy scaling** (the Director's threat inputs — wired live), loot quality (AF-023), research bonuses (AF-024), mission difficulty context, boss readiness. Smooth by construction: every consumer reads the same level, and the curve itself is the only exponent anywhere.

## 7. Accessibility & performance

Pause-duration adjustment (the overlay waits as long as the player needs — it's an overlay, not a timer), large-card mode, font scaling, controller/touch parity, colour-blind support — inherited AF-003/AF-005 laws; narrated upgrades registered future. Pooled pickups and cards, lazy-loaded descriptions, O(1) XP arithmetic; budgets hold.

## 8. Debug

Live: current level · XP / next threshold · gain rate · pending level queue · current offer with weights · curve table dump · pickup counts (live/pooled).

---

## Internal review loop (AF-022, recorded)

- **Curve** — fast/steady/slow shape verified by tests; growth-ratio cap makes grind walls impossible; data-tunable per mission. ✔
- **Pickups** — one system, seven tiers, magnet feel, pooled, deterministic, density-coalescing (value never lost). ✔
- **Level-up** — AF-003 §7 flow exactly; multi-level queue means a boss kill's levels each get their choice. ✔
- **Pool** — weighted/seeded/exclusion-aware; reroll/lock/wider-offers as framework methods awaiting their content buyers. ✔
- **Integration** — pure event subscriber; Director threat now reads real player level; AF-023/024 attach points named. ✔
- **Simplification pass** — rejected per-source XP multiplier matrices (tier values suffice); rejected upgrade rarity tiers at framework level (weights already express scarcity; rarity belongs to loot, AF-023); pickups coalesce instead of a second "XP bank" system. ✔

**Internal quality score: 9.5/10 — approved and locked; pacing/balance passes bind at content QA.**
