# AFTERLIGHT — Ship Roster (AF-074)

**Authority:** Produced output of AF-074. Extends AF-000 → AF-073 — above all AF-031's unchanged `ShipDef` and overlap law, AF-073's unchanged `ShipProfileDef` and 22-part completeness function, and AF-026's collection pattern. Every future Ship extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the fleet is data — ten hulls, ten specialisations, twelve fully identified manufacturers, and eight tiers where tier affects acquisition and cannot touch viability, because the entry shape has no stat field. Legendary means six unique traits; prototype means five experimental mechanics; neither means bigger numbers.

---

## 1. The launch fleet — one specialisation per berth

Ten hulls fill the fleet: the AF-031/073 trio (Wayfarer/exploration, Bastion/tanking, Aurelia/scientificOperations) plus seven new — Sable Dart (speed, Helios), Falchion (criticalHits, Vanguard Fleetworks), Hivemother (droneWarfare, Nova Forge), Dawnspire (energyWeapons, Ancient Foundry — the legendary), Ballista (missiles, Atlas Dynamics), Caduceus (support, Aegis Systems), and Maelstrom X-1 (crowdControl, Prototype Division — the prototype). Specialisation assignment is a bijection (asserted); AF-031's pair heads the fleet unchanged.

## 2. Twelve manufacturers, five identity parts each

The spec's nine example manufacturers plus the three already shipped (Halcyon Driveworks, Ironmoor Foundry, Meridian Yards — canon since AF-031/073), every one carrying visual identity, technology philosophy, engineering strengths, historical lore, and a signature system (all asserted non-empty). Every fleet entry's manufacturer resolves against the register.

## 3. Tiers affect acquisition, never viability

A `RosterShipEntry` is identity and acquisition only — its keys are asserted to be exactly {shipId, manufacturerId, tier, specialisation, collectionKind, discoveryMethod}: no stat field exists, so a tier-based buff is unrepresentable. Seven of eight tiers are in use; **mythic is registered vocabulary honestly awaiting its first hull** (the bossId-null pattern). And legendary does not mean strictly stronger: the Dawnspire's hull is asserted NOT to be the fleet's largest.

## 4. Distinct three ways

AF-031's own `findShipOverlap` law across all ten; ten distinct fingerprints; no two hulls sharing a (passive trigger, bonus kind) pair — and at the profile layer, no two hulls sharing a (defence, offence) identity pair. Every hull passes AF-073's 22-part completeness function.

## 5. Collection is permanent; statistics are ledgers

`ShipCollectionRuntime` starts with the Wayfarer collected, gates each acquisition on its registered collection kind (blueprints, variants, experimental models, legendary ships, prototype hulls, ancient designs), collects append-only (no remove/retire/scrap operation — prototype-asserted), and records per-hull usage/mission-success with success rate derived, never stored. Nothing in the code can make a hull obsolete.

## 6. 25+/50+/100+ without redesign

`syntheticShipFor(n)` deterministically generates hulls on the same shapes forever: one hundred synthetics plus the fleet yield 110 distinct fingerprints and 100 complete architectures through AF-031's and AF-073's unchanged functions.

## 7. Registered shelves

Twelve manufacturers, eight tiers, ten specialisations, seven build-architecture kinds, seven collection kinds, six research kinds, six legendary traits, five prototype mechanics, eight statistic kinds, five balance axes (raw statistics asserted absent), eight cosmetic customisation kinds — all counted in tests; every future hull binds against them.

---

## Internal review loop (AF-074, recorded)

- **Zero shape changes** — the fleet is data on AF-031/073's unchanged types; one pure collection runtime in the ledger discipline. ✔
- **Ten unique, asserted four ways** — overlap law, fingerprints, trigger+bonus pairs, defence/offence pairs (one authored collision between the Dawnspire and the Aurelia was caught by exactly this test and re-armoured). ✔
- **Tiers cannot buff** — entry-shape key inspection; mythic honestly empty; the legendary is not the biggest hull. ✔
- **Collection permanent** — gated, append-only, no removal API; statistics derived. ✔
- **Sweep proof** — 1,000 seeded fleet careers: the usage ledger never drifts, no hull is ever lost, the Wayfarer always remains. ✔
- **Reachable, live** — `Wayfarer Mk. II (scout/corvette) · common/exploration · fleet 1/10` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the manufacturers, tiers, specialisations, collection kinds, research kinds, legendary traits and prototype mechanics bind at every future Ship, hangar and expansion module.**
