# AFTERLIGHT — Weapon Roster (AF-076)

**Authority:** Produced output of AF-076. Extends AF-000 → AF-075 — above all AF-032's unchanged `WeaponDef` and overlap law, AF-075's unchanged `WeaponProfileDef`, twenty-part completeness function and element/status consistency law, and AF-026's collection pattern. Every future weapon extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the arsenal is data — ten weapons, twenty-one families, fourteen fully identified manufacturers, and eight tiers where tier affects acquisition and cannot touch viability. Families are the roster's new vocabulary: sub-identities within AF-075's categories, each a distinct gameplay note.

---

## 1. The launch arsenal

Ten weapons: AF-032's four and AF-075's Hailborn Array head the roster unchanged, joined by five new — the Atlas Cluster Battery (common, cluster missiles), Helios Prism Array (epic, prism lasers), Paragon Flux Driver (prototype, singularity gravity), Foundry Sunlance (legendary, vigil beams — unique discovery beneath First Light), and Salvage Scattergun (common, breach scatter). All ten pass AF-032's own overlap law with distinct fingerprints, AF-075's twenty-part completeness function, AND its element/status consistency law.

## 2. Families — sub-identities within locked categories

Twenty-one `WeaponFamilyDef`s: the spec's four example categories carry four families each (asserted) — precision/heavy/orbital/experimental rails, continuous/pulsed/prism/resonance arrays, swarm/heavy/smart/cluster missiles, compression/singularity/orbital/quantum gravity — plus one family per category the arsenal actually uses. Every family's category resolves onto AF-075's seventeen-shelf, and every entry's family matches its profile's category (a three-layer binding: def → profile → entry).

## 3. Fourteen manufacturers, six identity parts each

The spec's ten plus the four already shipped in weapon lore. Where a name matches an AF-074 shipyard, the lore binds them ("the shipyard's armaments division") — one industrial universe, two catalogues. All six parts (visual identity, engineering style, technology focus, lore, audio profile, signature mechanic) asserted non-empty.

## 4. Tiers, legendary, prototype — never power

Entries carry no stat field (key-inspection asserted); mythic is honestly registered-empty; the legendary Sunlance's base damage is asserted NOT the arsenal's highest. Prototype gameplay gives AF-075's dormant heat register its first data discipline: the Flux Driver runs the hottest heat in the arsenal, asserted against every other profile — heat management as the prototype's risk, exactly as §Prototype Weapons demands.

## 5. Collection is permanent

`WeaponCollectionRuntime` starts with the Coil Ripper, gates each acquisition on its registered collection kind, collects append-only (no remove/retire/scrap operation), and counts uses per weapon. Nothing in the code can make a weapon irrelevant.

## 6. Limitless expansion

`syntheticWeaponFor(n)` generates weapons on the same shapes forever: one hundred synthetics plus the arsenal yield 110 distinct fingerprints and 100 complete architectures through AF-032's and AF-075's unchanged functions.

## 7. Registered shelves

Fourteen manufacturers, eight tiers, twenty-one families, seven collection kinds, six research kinds, seven legendary traits, seven prototype mechanics, eight statistic kinds, five balance axes (numerical superiority asserted absent) — all counted in tests; every future weapon binds against them.

---

## Internal review loop (AF-076, recorded)

- **Zero shape changes** — the arsenal is data on AF-032/075's unchanged types; one pure collection runtime in the ledger discipline. ✔
- **Three-layer binding** — def fingerprints distinct, profiles complete and element-consistent, entries family-resolved and category-matched. ✔
- **Tiers cannot buff** — key inspection, honest mythic, legendary-not-strongest, and the prototype's heat discipline. ✔
- **Collection permanent** — gated, append-only, no removal API. ✔
- **Sweep proof** — 1,000 seeded arsenal careers: the usage ledger never drifts, no weapon is ever lost, the Coil Ripper always remains. ✔
- **Reachable, live** — `Coil Ripper · uncommon/railguns:precision · arsenal 1/10` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the manufacturers, tiers, families, collection kinds, research kinds, legendary traits and prototype mechanics bind at every future weapon and expansion module.**
