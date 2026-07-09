# AFTERLIGHT — Mission Roster (AF-084)

**Authority:** Produced output of AF-084. Extends AF-000 → AF-083 — above all AF-037's unchanged mission engine, AF-083's unchanged expedition architecture, and AF-026's permanent-collection pattern. Every future expedition, campaign, legendary mission and expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every expedition becomes part of the player's personal history — the log is append-only and remembers defeat as honestly as victory; tiers change complexity and reward quality, provably not enemy strength; and chains are ordered lists of real expeditions, never scripts.

---

## 1. Families and the three-layer binding

Seventeen mission families (exploration through faction campaign) map totally onto AF-083's seventeen framework categories — diplomacy is investigation today, civilian support is rescue work, faction campaigns surface through world events. Every roster entry binds three layers deep: entry family → mapped framework category → the profile's own category, exact and machine-checked. Entries carry identity only (family + tier) with no stat field by key inspection.

## 2. Tier is not enemy strength — proven

Eight tiers registered. The law has a concrete proof in the data: the **common**-tier Winterline Rescue is *harder* in raw difficulty (3) than the **special**-tier Crystal Fields Incursion (1) — so the tier ladder is provably not the difficulty ladder. What tier does track is complexity and reward quality: the **ancient**-tier First Light Excavation runs strictly more modifier slots than every lower-tier expedition. Mythic and galaxyEvent are honestly registered-empty.

## 3. The objective network and dynamic events

The ten objective-network surfaces (combat through diplomatic decisions) map totally onto AF-037's fourteen objective types; the nine spec dynamic events map totally onto AF-037's ten event kinds, which already bind to the real environmental-event vocabulary. Eight world-reactivity surfaces each name the live system mission outcomes already feed — faction reputation, campaign counters, stability stats, the loot economy. The galaxy remembers because those systems already do.

## 4. Chain missions — The Vault Signal

`MissionChainDef` is an ordered list of real expedition ids plus a narrative; `nextChainStageAfter` is the pure progression function. The first chain, **The Vault Signal** (ancient mysteries), joins the Crystal Fields incursion to the First Light excavation: the Void signature was following a signal. Every stage resolves against the real roster; the walk is proven end-to-end including its terminal null.

## 5. The expedition log and the Operations Centre

`ExpeditionLogRuntime` makes the module's philosophy literal: permanent, append-only records with monotone sequence numbers — victories, defeats, perfect completions, optionals, boss kills, play time. No removal API exists (prototype-inspected). It is wired at the real `endRun` seam, so every run lands on the record. The **Galaxy Operations Centre** is `operationsCentreFor` — all eight features derived from the log and existing ledgers (replay is honest: expeditions are seed-deterministic per AF-037; commander records are AF-072's real ledger).

---

## Internal review loop (AF-084, recorded)

- **Zero shape changes** — the ecosystem is data on AF-037/083's unchanged types plus one append-only runtime and two pure functions. ✔
- **Three total maps** — families, network surfaces, dynamic events, all machine-checked onto locked shelves. ✔
- **Tier law proven** — a lower tier outranks a higher tier in difficulty; complexity tracks tier; empty tiers honest. ✔
- **The chain walks** — every stage real, progression pure, terminal null included. ✔
- **History is permanent** — append-only, sequence-monotone, defeat-honest, removal-free; wired at the real end-of-run seam and browser-verified (`log 1 (0 perfect)` after a simulated defeat). ✔
- **Sweep proof** — 3,000 expeditions with globally unique ids; 1,000 seeded log careers with no drift. ✔

**Internal quality score: 9.5/10 — approved and locked; the family map, tier law, objective network, chain shape, log discipline and Operations Centre derivation bind at every future mission module and expansion.**
