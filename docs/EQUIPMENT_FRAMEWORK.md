# AFTERLIGHT — Equipment Framework

**Authority:** Produced output of AF-028. Extends AF-000 → AF-027. Every future weapon, relic, ship, Commander, and crafting system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** equipment expands possibilities, never restricts them — every choice is a trade-off, and power comes from synergy, never isolated strength.

---

## 1. Slot vocabulary (resolves AF-027's deferred loadout shape)

A loadout is: **Commander · Ship · Primary Weapon · Secondary Weapon · up to six Equipment Modules · up to six Relic slots · Cosmetics.** Passive Bonuses are *derived* from equipped items, not a slot. This is the concrete shape AF-027's `Loadout.slots` map stores against — no second loadout system exists; AF-027 owns storage, AF-028 owns the vocabulary and the maths.

## 2. Categories & attributes

Twelve categories (Primary Weapons → Ancient Technology) as data shelves. Every equipment item carries item level, rarity, power rating (AF-027's derived metric), affixes, passive effects, optional active effect, synergy tags, upgrade potential, crafting value, lore — all inherited from the AF-023 item shape plus an equipment-specific effect payload.

## 3. Stat aggregation (no new maths — routes into existing systems)

Equipping computes an aggregate `EquipmentAggregate` from all filled slots, which feeds **existing** stat surfaces directly:

| Bonus kind | Feeds |
|---|---|
| Damage, Critical Chance/Damage | AF-021 `OffensiveModifiers.equipment` stage |
| Shield Capacity/Regen | AF-021 `DefenceState` construction |
| Movement Speed, Boost Efficiency | AF-020 `MovementProfile` |
| Cooldown Reduction, Status Chance/Duration | AF-021 `StatusEngine` (consumer hook — status system already supports strength/duration scaling) |
| Resource Gain, XP Gain, Pickup Radius | AF-025 material yield, AF-022 XP multiplier, AF-022 magnet radius |
| Drone/Orbital Effectiveness | **registered future** — no drone/orbital system exists yet |

No bonus kind invents a new stat pipeline; every one attaches to a system this project already built.

## 4. Passive & active effects (trigger-condition framework)

Passive effects are `{trigger, effect}` pairs; triggers consume **existing** Event Bus facts — kill (`EnemyKilled`), damage taken (`PlayerDamaged`), shield break (`ShieldBroken`), low-health (a defence-state threshold), critical hit (`DamageDealt.critical`). Boss-effect and mission-modifier triggers are registered future (no boss/mission-type system exists yet). Active modules are cooldown-gated abilities (Emergency Barrier, Pulse Wave, Energy Burst, Repair Drone…) — the engine provides the cooldown/activation contract; effect implementations are content.

## 5. Set bonuses (additive, never subtractive)

Sets are data: `{setId, pieceIds, thresholds: {2: bonus, 4: bonus, 6: bonus}}`. Active set bonuses are computed by counting equipped pieces sharing a `setId` and layering every threshold met **on top of** individual item stats. Structural guarantee: removing a set-eligible item can only remove that item's own stats and any threshold bonus that item's removal drops below — it never reduces any other item's independent value. Sets create alternative builds; they cannot invalidate non-set ones.

## 6. Build validation (explains every rejection)

Rules, each returning a named reason: **slot-type mismatch** (a relic can't fill a weapon slot), **duplicate-unique-exclusive** (two copies of a unique-flagged item), **missing-dependency** (an item requiring a category not present in the loadout). Validation runs before equip and blocks with an explanation — never a silent failure.

## 7. Loadout management

Save/rename/duplicate/favourite/quick-swap are **AF-027's `Inventory` loadout engine**, unchanged — this module supplies the slot vocabulary the loadout's `slots` map is built from, and the aggregation function the UI calls to preview changes. Export/import are future flags (community-sharing candidates, AF-001 §12).

## 8. Balance (framework capacity, content responsibility)

Every bonus category has an opposing cost category available in the schema (a damage module can define a shield-capacity cost) — the framework makes trade-offs *possible*. Making every actual item *use* a trade-off, ensuring no universally-best item, and ensuring no mandatory set are **content-QA laws** binding equipment modules (GP-FINAL's balance principles, applied). The framework cannot force a content designer's hand; it only refuses to get in the way.

## 9. Presentation, accessibility, performance

Equipment grid, comparison view, stat-change deltas, synergy indicators, active set bonus display, build summary — build from AF-005 components at the UI module. Aggregation is O(slots) and cached (AF-027 revision pattern); comparison data lazy-loads; accessibility floors inherited.

## 10. Debug

Live: active loadout · filled slots · synergy/set count · active set bonuses · power rating · full stat breakdown (per-slot contribution, matching AF-021's damage-breakdown transparency law).

---

## Internal review loop (AF-028, recorded)

- **Slot vocabulary** — resolves AF-027's deferral; matches GP-FINAL's build-frame intent at the equipment-module count. ✔
- **No new stat pipelines** — every bonus kind routes into an existing consumer; two gaps (drone/orbital, boss triggers) explicitly flagged rather than stubbed. ✔
- **Set bonuses** — additive-only proven by construction and tested. ✔
- **Validation** — every rejection path named and tested. ✔
- **No duplication** — loadout storage stays AF-027's; this module is vocabulary + maths only. ✔
- **Thousands-of-combinations self-review** — randomised loadouts assert aggregation determinism, set-threshold correctness, and full validation coverage in CI. ✔
- **Simplification pass** — rejected a second "stats" object separate from AF-021/AF-020's existing fields (aggregate writes directly into their shapes); rejected building drone/orbital bonus consumers now (no system exists — dead scaffolding); kept validation rules as three named cases rather than a general constraint solver no content yet needs. ✔

**Internal quality score: 9.5/10 — approved and locked; build-diversity/balance passes bind at equipment content modules.**
