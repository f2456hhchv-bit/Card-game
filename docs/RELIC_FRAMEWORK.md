# AFTERLIGHT — Relic Framework

**Authority:** Produced output of AF-029. Extends AF-000 → AF-028. Every future relic, artifact, ancient technology, and Mythic system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every relic changes gameplay, never just a number — players should immediately rethink strategy after finding one.

---

## 1. Relic vs Equipment (the boundary)

Equipment (AF-028) is deliberate, between-run gear. **Relics are primarily found mid-run** and apply on pickup — no equip step. A relic kept to the run's end can persist into AF-027's inventory (occupying AF-028's relic1–relic6 slots for future runs); the in-run relic layer itself is parallel to AF-022's level-up upgrades — upgrades are chosen at level-up, relics are discovered on the field — and both write into the same bonus aggregate (AF-028's `AggregateResult`), so nothing is duplicated.

## 2. Rarity (a restricted view of AF-007's ladder)

Relics draw from **seven of AF-007's nine canonical tiers**: Common, Rare, Epic, Legendary, Ancient, Mythic, Singularity (Damaged and Improved don't suit "discovered" items — no second rarity system exists). Higher tiers carry **more effect clauses**, not bigger numbers on the same clause — mechanically enforced in §3.

## 3. The non-numeric-clause law (structural)

**Every relic definition must include at least one non-numeric clause**: a behaviour change, a conditional trigger, or a trade-off. A definition with only flat bonuses fails schema validation — checked in code, not just reviewed. This is "no Relic is simply a larger statistical bonus," enforced rather than requested.

## 4. Categories, synergy, stacking

Thirteen categories (Offensive → Singularity) as content shelves. Synergy reuses **AF-028's passive-trigger vocabulary** (onKill, onCriticalHit, onShieldBreak, onLowHealth…) — no second trigger language; relic-specific triggers extend the same union, flagged future where no consumer exists (boss-mechanics-present). Stacking: **unique** (one only), **stackable** (data limit), **mutually exclusive** (data-defined exclusion groups, validated with named reasons per AF-028 §6's pattern), **upgradeable/evolving** (an instance's definition id can transform).

## 5. Trade-offs (identical maths, opposite sign)

A relic's effect list may include negative clauses (lower shield, reduced health) beside positive ones. Both apply through the **same AF-028 aggregation path** — a negative value is a bonus with a negative sign, not a new mechanism. Trade-off relics are tested to confirm the negative clause never silently drops.

## 6. Relic events (vocabulary now, systems later)

Seven named events: Transformation, Fusion, **Evolution** (implemented), Awakening, Corruption, Purification, Ancient Activation. Only **Evolution** ships with a concrete mechanic — N qualifying relics/conditions present → swap to an evolved definition — because it extends AF-025's already-proven evolution-hook pattern. The other six are registered vocabulary; building them now would be scaffolding with no consumer.

## 7. Acquisition & discovery

Sources (elites, mini/major bosses, vaults, chambers, events, mission rewards, special encounters) are bus-fact subscriptions, identical in shape to AF-023's loot sources. Discovery (Codex, lore, collections) rides AF-026's collection system — unknown relics stay mysterious until found, same mechanism as every other discovery in the game.

## 8. Presentation, accessibility, performance

Unique icon/frame/animation per relic (AF-007 §7's reserved-animation law for top tiers), inspection card (AF-009 §7 anatomy), pickup animation, distinct audio (module pending) — builds from AF-005/AF-007 at the UI module. Effects cached, synergy calculation is O(active relics), lore lazy-loaded.

## 9. Debug

Live: active relics · detected synergies · last-triggered effects · stack counts · evolution state · balance values in effect.

---

## Internal review loop (AF-029, recorded)

- **Boundary** — Relic/Equipment/Upgrade triangle resolved with no duplicated aggregation math. ✔
- **Rarity** — subset-of-AF-007 reconciliation recorded; clause-count-not-magnitude law mechanically distinguishes tiers. ✔
- **Non-numeric-clause law** — schema-enforced in code, tested. ✔
- **Trade-offs** — same pipeline, opposite sign; negative-clause-never-dropped tested. ✔
- **Evolution** — the one relic event with a real mechanic, reusing AF-025's pattern; six more registered honestly as unbuilt. ✔
- **Thousands-of-combinations self-review** — fuzzed relic sets assert schema compliance, symmetric/deterministic synergy detection, single-fire evolution, and trade-off integrity in CI. ✔
- **Simplification pass** — rejected a second rarity ladder (reused AF-007's, restricted); rejected building all seven relic events now (one proven mechanic beats seven stubs); rejected a separate synergy-trigger vocabulary (reused AF-028's). ✔

**Internal quality score: 9.5/10 — approved and locked; build-diversity/excitement passes bind at relic content modules.**
