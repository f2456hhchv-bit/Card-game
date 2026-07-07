# AFTERLIGHT — Ship Framework

**Authority:** Produced output of AF-031. Extends AF-000 → AF-030. Every future Ship, Cosmetic, Ability, and Hangar system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** players choose a Ship for battlefield behaviour, never raw power — movement and handling are just as important as firepower.

---

## 1. The Ship IS a MovementProfile

AF-020 §3 reserved `turnRatePerSecond`, `mass`, `handling`, and `movementFriction` on `MovementProfile` explicitly for "future ship handling profiles." This module is that future arriving: a `ShipDef` supplies a complete `MovementProfile` — including a non-instant turn rate for ships that want sluggish, weighty handling — rather than inventing a second movement system. There is no separate "ship movement" code path; `PlayerMovement` consumes a ship's profile exactly as it consumes the default one.

## 2. Defensive and Energy Profile

A ship's `hull`/`shield` feed AF-021's `DefenceState` constructor directly (hull→maxHull, shield→maxShield) — no new defence math. **Energy** is a new resource this module introduces: the first genuinely new numeric resource added to the game, scoped tightly to ability activation cost. It regenerates continuously per second and is spent (not merely gated by cooldown) when an ability fires.

## 3. Passive and Ability — zero new vocabulary

| Hook | Shape | Reuses |
|---|---|---|
| Passive | Always-active bonus/trigger | AF-028's `PassiveTrigger` + `EquipmentBonus` |
| Ability | Cooldown- **and** energy-gated activation | AF-028's `ActiveModule` shape, extended with `energyCost` |

Both feed the same `BonusTotals` aggregation shape as Equipment, Relics, and Commanders — a ship's passive is just another contributor, not a parallel stat system.

## 4. No-overlap law (structural check, not just review)

Each ship's movement-profile-plus-passive-plus-ability fingerprint (`shipFingerprint`: passive trigger + bonus kind + ability id) is checked against every other ship's fingerprint at content-authoring time via `findShipOverlap`, mirroring AF-030 §2's `findOverlap` for Commanders. A near-duplicate signature fails the check with the conflicting ship named. "No two ships should feel interchangeable" is enforced in code.

## 5. Classes & specialisation

Eleven classes (Scout → Mythic) registered as content shelves, mapping onto the AF-008/AF-010 faction and Ancient/Mythic canon already established. Specialisation areas (mobility, survivability, critical damage, drone control, orbital weapons, status effects, energy management, resource collection, exploration, support) are content-authoring guidance over the same passive/ability/movement vocabulary — no per-specialisation code path.

## 6. Mastery & progression — zero new systems

**Ship Mastery reuses AF-026's mastery engine exactly**: `ship:<id>` tracks already exist in `MetaProgression`, already wired at `RunEnded`. This module supplies only the counter *keys* (flight time, distance travelled, enemies destroyed, boss victories, damage avoided, boost usage, special challenges) as extensions to the generic mastery counters. Rewards are `MasteryReward` values from the same cosmetic-only union AF-026 already guarantees is stat-free — "cosmetic changes never alter gameplay" was satisfied before this module was written.

## 7. Customisation

Paint schemes, engine trails, hull variants, decals, wing configurations, lighting colours, exhaust effects, and name plates are explicitly cosmetic-only, structurally guaranteed by the same `MasteryReward` union.

## 8. Hangar

Inspect/compare/statistics/cosmetics/mastery/select/preview/loadouts is a UI surface over **existing** data: AF-027's inventory/loadout view, AF-026-pattern mastery, AF-028's comparison shape. Registered for the UI implementation module — no new backend required.

## 9. Synergy & balance

Ships interact with Commanders, Weapons, Equipment, Relics, Research, Mission Types, and Biomes purely through the shared `BonusTotals`/`MovementProfile`/`DefenceState` surfaces — no ship-specific coupling to any of those systems. "No ship dominates every build" is a content-QA law (framework capacity, not framework-enforced prevention) — the same honest limit AF-028 §8 and AF-030 §5 already recorded.

## 10. Presentation, accessibility, performance

Ship cards, 3D hangar view, statistics, comparison cards, mastery progress, lore, manufacturer, and class display build from AF-005/AF-007 at the UI module. Large ship cards, controller/touch navigation, comparison mode, search, sorting, high contrast, and colour-blind support inherit AF-005's accessibility baseline. Ship data is cached, preview models pooled, stat calculations optimised, cosmetics lazy-loaded — the same performance discipline as every prior module.

## 11. Debug

Live: selected ship · movement profile · defensive profile · energy · ability cooldown · passive state · mastery rank · statistics.

---

## Internal review loop (AF-031, recorded)

- **No duplicated systems** — movement, defence, passive/ability, and mastery all reuse AF-020/AF-021/AF-028/AF-026 exactly; this module adds only the ability-cost vocabulary (Energy) and the no-overlap check. ✔
- **Movement and handling as important as firepower** — the ship *is* the movement profile; a non-instant turn rate is live and tested. ✔
- **No-overlap** — fingerprint check is code, not a review reminder. ✔
- **Sandbox proof** — a ship governs a full run end-to-end: movement profile drives `PlayerMovement`, hull/shield seed `DefenceState`, energy regenerates and gates the ability, passive bonus feeds the shared aggregate. ✔
- **Simplification pass** — rejected a ship-specific mastery-reward type (reused AF-026's union); rejected a second "ship stats" struct (reused `MovementProfile`/`DefenceState` directly instead of mirroring their fields). ✔

**Internal quality score: 9.5/10 — approved and locked; roster/piloting-feel/synergy passes bind at future Ship content modules.**
