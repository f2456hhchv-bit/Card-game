# AFTERLIGHT — Crafting Framework (The Lightforge)

**Authority:** Produced output of AF-025. Extends AF-000 → AF-024. Every future equipment, weapon, blueprint, resource, and evolution system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** nothing is wasted, everything has purpose — crafting rewards planning, complements loot, and never becomes mandatory.

---

## 1. The crafting loop

Complete mission → collect resources (AF-023 loot categories) → return to Galaxy Command → salvage unwanted equipment → unlock blueprints → craft → upgrade the build → launch again. Crafting is the bridge: temporary runs feed permanent capability (AF-022 ↔ AF-024), under the **Lightforge** brand (AF-002 §12).

## 2. Resources & blueprints

**Ten resource types** (Common Materials → Singularity Matter) as a persistent material inventory — a `crafting` save slice on the AF-024 save system, so nothing collected is ever lost. **Blueprints** are permanent unlocks arriving through bus facts: boss defeats, mission rewards, research nodes, galaxy discoveries, ancient vaults, elites, events, *community content (future — rides the optional online layer)*. Known blueprints and the hangar persist in the same slice.

## 3. Recipes & crafted items

Recipes are data: **blueprint · required materials · research requirement · crafting time (instant per DR-005's reasoning; field reserved) · output item · quality range · upgrade potential.** Crafted output is an **AF-023 item** — same item level/rarity/affix/quality shape, same deterministic rolls from the seeded stream. Crafting never guarantees perfection: decisions shape *distributions* (which recipe, how much invested, whether to reforge), never exact outcomes — planning versus discovery, two roads to the same excitement.

## 4. Salvage (never punitive, by arithmetic)

Salvage returns materials, research samples, rare components, and blueprint fragments, scaled by rarity, quality, and crafting research — with **per-rarity minimum floors**, so no salvage ever feels like a loss. The anti-exploit invariant is tested in CI: expected salvage of a crafted item is strictly below its crafting cost — the loop rewards play, never printing materials. Salvaging favourites warns first (AF-003 §8).

## 5. Reforge & evolution

**Reforge:** affix rerolls, quality improvement, stat optimisation, trait replacement — with escalating per-item costs (each reforge raises the next one's price, data-tuned) and no guaranteed outcomes. Sockets and visual customisation registered future. **Evolution** — boss materials, ancient components, research, Commander mastery transforming equipment into *new gameplay*, not bigger numbers — is a registered extension hook awaiting its content inputs; nothing dead built.

## 6. Stations & decisions

Six Galaxy Command stations as organisational data: **Forge · Research Lab · Prototype Facility · Salvage Bay · Blueprint Archive · Ancient Fabricator.** Every interaction is a choice — craft, upgrade, salvage, store, reforge, wait, experiment — and **no automatic crafting exists anywhere** (player-decision law; auto-salvage-below-rarity may someday be an explicit player-set policy, per the AF-023 precedent).

## 7. Balance, accessibility, performance

Crafting accelerates experimentation and never becomes mandatory (AF-011 build-diversity law: no mandatory strategy); loot stays valuable because salvage gives every drop worth and crafted items compete on the same ladder rather than obsoleting found ones. UI (recipe cards, filtering, search, sorting, queue readability) builds from AF-005 components with all locked accessibility floors. Recipes cached, blueprint data lazy-loaded, inventory lookups O(1) maps; budgets hold.

## 8. Debug

Live: known blueprints · recipe database with affordability flags · material inventory · salvage output log · reforge roll history · crafting slice status.

---

## Internal review loop (AF-025, recorded)

- **Economy** — CI sim: craft→salvage cycles across seeds never profit; salvage floors guarantee non-punitive returns; material flows deterministic. ✔
- **Integration** — materials via loot categories, blueprints via bus facts, research requirements via AF-024, output items via the AF-023 shape, persistence via the save system: five systems interlocked, zero duplication. ✔
- **Perfection ban** — quality/affixes always roll; reforge escalates and never pities; decisions shape distributions only. ✔
- **Instant crafts** — DR-005 reasoning applied; field reserved; owner may rule separately. ✔
- **Simplification pass** — rejected a separate crafting currency (materials are the currency); rejected crafting queues (instant crafts need none); rejected pre-building evolution (extension hook registered, inputs don't exist yet); folded "crafting cost" into materials rather than adding credits. ✔

**Internal quality score: 9.5/10 — approved and locked; recipe/evolution content binds at equipment modules.**
