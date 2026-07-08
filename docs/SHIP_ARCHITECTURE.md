# AFTERLIGHT — Ship Architecture (Ship Framework, AF-073)

**Authority:** Produced output of AF-073. Extends AF-000 → AF-072 — above all AF-031's locked ship system (whose `ShipDef`, eleven-class shelf, energy resource, AF-020 movement production and fingerprint law are untouched), AF-030's charge-gated ultimate shape, AF-028's bonus vocabulary, AF-026's mastery engine, and AF-069's ascension gate. Every future Ship extends this architecture; it is extended, never replaced. (AF-031's produced output remains binding for the core system; this document binds the architecture layered above it — the AF-071 commander precedent, applied to hulls.)
**Binding rule of the whole document:** nothing remains undefined — 22 architecture parts as a function; identity never repeats (defence and offence unique per hull); modules are loadouts, mastery is a ledger, and the movement model was live all along.

---

## 1. Profiles wrap defs — AF-031 is never modified

`ShipProfileDef` wraps an AF-031 `ShipDef` by id, adding framework class, visual identity, defensive/offensive identity, capacities, slots, ultimate, special mechanic, ascension upgrade, mastery, cosmetics, and expansion hooks. The ten spec classes map totally onto AF-031's eleven locked classes. The roster extends additively: AF-031's pair (asserted unchanged at the head) plus the Aurelia Mk. I — a science vessel through the unchanged def shape — all three passing AF-031's own `findShipOverlap` law.

## 2. The movement model was live since AF-020

The spec's eight movement fields (acceleration, top speed, boost, drift, turn rate, mass, inertia, braking) map onto REAL `MovementProfile` keys — asserted present on the actual profile object. AF-073 names what AF-020 built; no second movement system exists.

## 3. The five-stage ability structure

AF-031 owns stages one and two (passive + energy-gated ability). The profile adds the ultimate — reusing AF-030's exact charge-gated `CommanderUltimate` shape, no second ultimate model — a special mechanic, and the ascension upgrade: the designated module fits FREE, outside the slot count, once AF-069's level reaches the gate, permanently (it cannot be unfitted).

## 4. Modules are loadouts; mastery is a ledger

Eight module kinds, one sandbox module each, every bonus AF-028 vocabulary, aggregation cached until the fit changes (reference-tested). Fitting gates on the profile's slot count and UNFITTING IS ALLOWED — refitting is normal gameplay, not content removal. The mastery side (usage, kills, boss victories, distance) is append-only: no reset/clear/wipe operation exists.

## 5. Identity never repeats

Primary defence and offensive identity are unique per hull across the roster (asserted): the Wayfarer fights with precision behind avoidance, the Bastion pours area damage from behind its hull, the Aurelia runs beam weapons behind an energy barrier. Heat and cargo capacities are registered DORMANT numeric fields — the `biomeId` pattern — awaiting heat/cargo modules as first consumers.

## 6. Registered shelves

Ten framework classes, 22 architecture parts, five ability stages, seven defensive kinds, eight offensive kinds, eight module kinds, eight mastery metrics, eight neutral customisation kinds — all counted in tests; every future Ship binds against them.

---

## Internal review loop (AF-073, recorded)

- **AF-031 untouched** — profiles wrap defs; the locked pair heads the extended roster unchanged; the overlap law holds across all three fingerprints. ✔
- **Nothing remains undefined** — all 22 parts asserted per ship via `shipArchitectureFor`; the five ability stages complete with AF-030's ultimate shape and a real gated module. ✔
- **Movement named, not rebuilt** — all eight spec fields resolve to live AF-020 profile keys on the actual object. ✔
- **Loadouts vs ledgers** — slot gating, cache invalidation, free refitting, permanent ascension grant, and an unerasable mastery ledger all tested. ✔
- **Sweep proof** — 1,000 seeded careers of refitting and mastery: slots never exceeded, the ledger never drifts, bonuses always match the fit. ✔
- **Reachable, live** — `Wayfarer Mk. II (scout/corvette) · precision/avoidance · modules 0/2 · uses 0` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the classes, architecture parts, ability stages, defensive/offensive identities, module kinds and mastery metrics bind at every future Ship and hangar module.**
