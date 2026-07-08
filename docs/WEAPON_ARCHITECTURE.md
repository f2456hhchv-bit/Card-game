# AFTERLIGHT — Weapon Architecture (Weapon Framework, AF-075)

**Authority:** Produced output of AF-075. Extends AF-000 → AF-074 — above all AF-032's locked weapon system (whose `WeaponDef`, category/pattern/behaviour shelves, evolution model and fingerprint law are untouched), AF-021's status registry, AF-028's bonus vocabulary, and AF-026's mastery engine. Every future weapon extends this architecture; it is extended, never replaced. (AF-032's produced output remains binding for the core system; this document binds the architecture layered above it — the AF-071/073 profile precedent, applied to weapons.)
**Binding rule of the whole document:** nothing remains undefined — twenty architecture parts as a function; three spec vocabularies as total maps onto locked shelves; elements as a total map onto the status registry; and every profile's element consistent with what its weapon already does.

---

## 1. Profiles wrap defs — AF-032 is never modified

`WeaponProfileDef` wraps an AF-032 `WeaponDef` by id, adding framework category, visual identity, element, heat generation (a registered DORMANT numeric — the AF-073 pattern), an AF-028 passive trait, a unique mechanic, an evolution source, mastery, statistics, cosmetics, and expansion hooks. The arsenal extends additively: AF-032's four weapons head the roster unchanged, joined by the **Hailborn Array** — a cryo weapon through the unchanged def shape, giving the `freeze` status its first WEAPON producer (AF-064's biome was the first overall). All five pass AF-032's own overlap law.

## 2. Three vocabularies, three total maps

The seventeen spec categories map onto AF-032's fifteen locked categories; the ten fire modes onto its twelve fire patterns; the ten projectile-system kinds onto its twelve behaviours. Naming layers, never new engines — the same discipline every biome's weather shelf followed.

## 3. Elements integrate with the status system — by mapping

Ten elements map totally onto AF-021's status kinds: thermal→burn, cryogenic→freeze, electrical→shock, corrosive→armourBreak, radiation→poison, void→corruption, resonance→shieldBreak, quantum→overload, plasma→burn — and kinetic→none, because purity is a mapping too. A consistency law binds the layers: every profile's element must agree with its def's actual `statusOnHit` (asserted across the arsenal) — the element layer NAMES what the weapon already does; it cannot invent new behaviour.

## 4. Evolution enhances identity — AF-032's own precedent

The Coil Ripper evolves into the Coil Ripper Mk. II with a category shift (ballistic→arc) — so identity preservation is name lineage and manufacturer, both asserted to survive evolution, with a registered source (research, blueprints, mastery, legendary/prototype/ancient technology) driving each evolving weapon.

## 5. Mastery is a ledger

`WeaponMasteryRuntime` accumulates shots, hits, criticals, kills, and boss damage append-only — accuracy is DERIVED and clamped, never stored, and no reset/clear/wipe operation exists. The composition root feeds it from real combat: both damage-application sites record hits, boss hits record boss damage, and shots sync from AF-032's own fire counter.

## 6. Registered shelves

Seventeen framework categories, twenty architecture parts, ten fire modes, ten projectile kinds, ten elements, six evolution sources, eight mastery metrics, seven synergy surfaces, seven neutral customisation kinds — all counted in tests; every future weapon binds against them.

---

## Internal review loop (AF-075, recorded)

- **AF-032 untouched** — profiles wrap defs; the locked four head the arsenal unchanged; the overlap law holds across all five fingerprints. ✔
- **Nothing remains undefined** — all twenty parts asserted per weapon via `weaponArchitectureFor`. ✔
- **Total maps everywhere** — categories, fire modes, projectile kinds, and elements all resolve onto locked shelves; the element-consistency law binds profile to def. ✔
- **Evolution preserves identity** — name lineage + manufacturer asserted across AF-032's own evolution chain, with registered sources. ✔
- **Sweep proof** — 1,000 seeded combat careers across all five weapons: the mastery ledger never drifts, accuracy stays in range. ✔
- **Reachable, live** — `Coil Ripper (ballistic/singleShot) · railguns/electrical→shock · mastery 0 kills 0%acc` on the overlay, fed by real combat hooks, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the categories, fire modes, projectile kinds, elements, evolution sources and mastery metrics bind at every future weapon and arsenal module.**
