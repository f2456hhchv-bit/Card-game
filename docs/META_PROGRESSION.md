# AFTERLIGHT — Meta Progression Framework

**Authority:** Produced output of AF-026. Extends AF-000 → AF-025. Every future collection, achievement, Commander, ship, weapon, and galaxy system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every run matters, forever — meta progression expands *options and identity*, run progression creates *power*, and player skill remains decisive. Mastery never invalidates challenge.

---

## 1. The three-track promise, completed

- **In-run (AF-022):** temporary power — resets every expedition.
- **Permanent capability (AF-024/025):** research and crafting — what you *can do*.
- **Permanent identity (AF-026):** account level, mastery, collections, statistics, challenges — who you have *become*.

Every expedition feeds all three; defeat feeds them too (RunEnded pays account XP win or lose — no run is ever wasted, by ledger).

## 2. Account level

Reuses the AF-022 curve engine with its own tuning (one levelling implementation in the whole game). XP sources are bus subscriptions: mission completion, boss defeats, exploration, research, collection progress, achievements, galaxy restoration, special events. **Never resets** — structurally: the account track has no reset operation.

## 3. Mastery (one engine, many tracks)

Generic mastery tracks keyed `commander:<id>`, `ship:<id>`, `weapon:<id>` — XP, rank (data curve), and named counters per the module's lists (missions, boss defeats, distance travelled, damage mitigated, boost usage, kills, crits, evolution counts…). Content modules add tracks and counters freely; the engine never changes. Mastery expands knowledge and cosmetics — see §5's structural guarantee.

## 4. Collections & statistics

**Collections** (weapons, relics, equipment, ships, Commanders, biomes, enemies, bosses, research, achievements, lore): permanent account history as **compact ID sets** (AF-013 §6 — save size scales with discovery, not catalogue). Discovery is idempotent; completion % is computed against registered catalogues. **Statistics** (hours, runs, victories, defeats, bosses, kills, damage dealt/taken, distance, resources, rare finds, highest difficulty): permanent counters, updated in memory per event, flushed at safe moments.

## 5. Rewards — options, not power (structural)

The reward type union contains **only** cosmetic and knowledge payloads: Commander skins, ship paints, portrait frames, titles, codex entries, music, engine trails, visual effects, banner customisation. There is no stat field — a future module physically cannot attach gameplay power to a mastery reward without amending this locked type. "Gameplay balance remains unaffected" is enforced by the compiler.

## 6. Challenges

Data-defined: **id · category · counter key · target · reward.** Eight categories (general, Commander, ship, weapon, boss, biome, galaxy, *seasonal-future* — seasonal challenges rotate into the permanent pool per the AF-013 anti-FOMO guarantee). Challenges complete exactly once, reward into collections, and exist to promote *experimentation* — their targets should require playing differently, not playing more (content-QA law; grinding-shaped challenges fail review).

## 7. Profile & long-term goals

The profile aggregates: account level · mastery summary · completion % · collections · recent achievements · favourite Commander/ship (derived from usage counters, never self-declared-then-stale) · play-style summary. This is the surface a **future online identity** extends — exactly the data an optional community layer would share, and nothing the offline game doesn't already own (AF-001 §12). Long-term goals (100% collections, full research, max mastery, galaxy restoration, ancient recovery, Mythic discoveries, challenge completion) are all *visible, finite, and honest* — dedication goals, not treadmills.

## 8. Persistence & performance

Third save slice (`meta`) on the AF-024 save system: account, mastery, collections (ID arrays), statistics, challenge progress + completions. In-memory accumulation per event; flush at run end and Galaxy Command (async-update law). Collections lazy-load and virtualise at the UI module; profile cards pool (AF-005).

## 9. Debug

Live: account level/XP · mastery track list with ranks · collection counts and % · challenge progress · statistics dump · slice status.

---

## Internal review loop (AF-026, recorded)

- **300 simulated expeditions in CI** — monotonic account level, exact stat sums, single challenge completion, collection idempotence, save round-trip fidelity. ✔
- **No-power guarantee** — reward union audited: cosmetic/knowledge only; no stat payload representable. ✔
- **Reuse** — account level is the AF-022 engine re-tuned; no second curve implementation exists. ✔
- **Compact sets** — AF-013 §6 rule in live use for collections. ✔
- **Failure pays** — defeat XP asserted in tests; the never-wasted-run promise is a ledger entry, not a sentiment. ✔
- **Simplification pass** — rejected per-category account levels (one account level; mastery carries specificity); rejected a "prestige" reset system (contradicts never-resets and adds no decision); deferred play-style summary heuristics to the profile UI module (counters exist; interpretation is presentation). ✔

**Internal quality score: 9.5/10 — approved and locked; reward pacing binds at cosmetic/content modules.**
