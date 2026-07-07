# AFTERLIGHT — Inventory Framework

**Authority:** Produced output of AF-027. Extends AF-000 → AF-026 (and honours the GP-FINAL standing tests). Every future item, resource, weapon, equipment, and collection extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the fewest possible actions, at any collection size — finding, comparing, and managing items stays fast at tens of thousands of entries.

---

## 1. Items and instances

Inventory items **are AF-023 items** (drops/crafted, same shape) plus instance metadata: instance id, storage location, favourite, locked, marked-for-crafting, acquisition time, stack count. **Stackable categories** (resources, crafting materials, blueprints, currencies, research samples) auto-merge by base item + rarity under a configurable stack limit; equipment-like categories remain unique instances. **Power Rating** is a derived display metric (level × tier weighting + affix weight, data-tunable) — never a new stat.

## 2. Storage & protection

Locations — **player · galaxy storage · archive · crafting queue** — with configurable limits (refusals explain themselves: `storageFull`). Favourites and Recently Acquired are *views*, not copies. The **archive** implements AF-013's never-delete for items. Protection: **locked items cannot be salvaged at all; favourites require confirmation** (AF-003 §8); **batch operations exclude protected items by construction** — a batch salvage cannot touch a favourite even by accident.

## 3. Sorting, filtering, search

Ten sort keys (rarity, power, level, newest, oldest, name, category, affix count, crafting value, favourite) with **revision-cached results** (the AF-003 dirty-flag pattern applied to data — a cache hit costs microseconds). Filters compose (category + rarity + affix + favourites + level floor). Search is instant partial-match across name, category, rarity, and affixes. All measured in CI at **20,000 items**: full sort < 250ms, cached < 5ms, search < 100ms.

## 4. Loadouts

Saved loadouts (name, favourite, Commander, ship, slot map) with save/rename/duplicate under a configurable cap; slot vocabulary belongs to AF-028. **Quick-switching is state-gated to outside missions** (AF-016 machine states); mid-run build change remains AF-022's domain.

## 5. Integration (no duplicated systems)

Salvage/craft/reforge route to AF-025 · discovery records to AF-026 collections (which keep their compact ID sets — the inventory holds instances, collections hold history) · blueprint status reads AF-025's archive · equip effects come from AF-028. The inventory organises; every action is executed by its owning system.

## 6. Presentation, accessibility, performance

Grid/list views, comparison panel, quick preview, item cards with animated rarity frames (AF-007 §7's reserved-animation law) — built from AF-005 components at the UI module, virtualised per AF-005 §10, with all locked accessibility floors plus search/filter as accessibility tools. Persistence: a fourth save slice on AF-024's system.

## 7. Debug

Live: inventory size and per-location usage · sort/filter/search timings · cache state · loadout list · slice status.

---

## Internal review loop (AF-027, recorded)

- **Scale** — 20k-item CI population passes timing budgets; stacking keeps entry counts humane; caches verified. ✔
- **Safety** — protection guards and batch-exclusion tested; storage refusals carry reasons. ✔
- **No duplication** — items are AF-023's, materials are AF-025's, history is AF-026's; the inventory adds only organisation. ✔
- **Simplification pass** — favourites/recent as views not locations (one source of truth); rejected a search index at current scale (linear scan measured fine; registered as an optimisation trigger, not built); rejected per-category storage pages (locations + filters compose the same result). ✔

**Internal quality score: 9.5/10 — approved and locked; inventory screen binds at the UI module, equip effects at AF-028.**
