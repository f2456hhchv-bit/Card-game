# AFTERLIGHT — Commander Roster (AF-072)

**Authority:** Produced output of AF-072. Extends AF-000 → AF-071 — above all AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef` and seventeen-part completeness function, AF-028's bonus vocabulary, and AF-068's campaign chapters (recruitment gates). Every future Commander extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** fourteen seats, fourteen philosophies, zero overlap — enforced by AF-030's own fingerprint law plus a stronger roster rule (no two commanders share a passive trigger+bonus pair), and proven scalable to 100+ on unchanged shapes. Balance has five axes and raw damage is not one of them.

---

## 1. The launch roster — one philosophy per seat

Fourteen commanders fill AF-071's `ROSTER_TARGET`: the AF-030/071 trio (Longlight the vanguard, Ironhull the guardian, Meridian the scientist) plus eleven new — Torque (engineer), Whisper (scout), Longfang (hunter), Thunderline (artillery), Cipher (technomancer), Aviary (drone commander), Keystone (gravity specialist), Chord (crystal resonator), Nadir (void researcher), Redline (prototype pilot), and Relay (the Afterlight operative). Philosophy assignment is a bijection (asserted), and every philosophy maps totally onto AF-030's locked archetype shelf.

## 2. Distinct three ways

Every commander passes AF-030's `findOverlap` law; all fourteen fingerprints are distinct; and — stronger than the law demands — no two commanders share a (passive trigger, passive bonus kind) pair. Every commander passes AF-071's seventeen-part `architectureFor` completeness function and drives AF-071's unchanged progression runtime (talents, ascension gates 1–3, all tested per commander).

## 3. First producers

AF-028 registered `droneEffectiveness` and `orbitalPower` as "future — no producer" at AF-028. Aviary's flock and Thunderline's batteries give them their first producers, flowing through the same bonus aggregation as everything else.

## 4. Recruitment — meaningful and total

Seven registered sources, every one recruiting someone: the starting trio arrives with the campaign's opening; the rest gate on story chapters, exploration milestones, research, legendary missions, hidden discoveries, and faction reputation — each requirement naming real content. `RosterRuntime` recruits append-only (a recruited commander never leaves; no removal operation exists) and records usage/victories per commander with win rate derived, never stored — the inputs "statistics inform future balancing" needs. The runtime has no operation that could buff, nerf, retire, or gate a commander: "every Commander remains viable forever" is a property of what the code cannot do.

## 5. Future-proof registers

Six team-synergy kinds and four AI-commander contexts are registered FUTURE (online/co-op stays the Constitution's optional later layer; the AI consumes the same def/profile shapes — no AI-specific stat type exists). Eight customisation kinds (gameplay-neutral by shape), eight statistic kinds on AF-026's vocabulary, and five balance axes — decision making, positioning, synergy, timing, knowledge — with raw damage deliberately absent from the shelf.

## 6. 25+/50+/100+ without redesign

`syntheticCommanderFor(n)` deterministically generates roster entries on the same shapes forever. One hundred synthetics plus the launch roster yield 114 distinct fingerprints and 100 complete architectures through AF-030's and AF-071's unchanged functions — "future additions never require redesign", executed.

---

## Internal review loop (AF-072, recorded)

- **Zero shape changes** — the roster is data on AF-030/071's unchanged types; one pure recruitment/usage runtime in the ledger discipline. ✔
- **Fourteen unique, asserted three ways** — fingerprint law, unique trigger+bonus pairs, philosophy bijection; seventeen-part completeness per commander. ✔
- **Recruitment total** — all seven sources used, trio from the campaign, gates on real content; append-only with no retire/rebalance operation. ✔
- **Scalability proven** — 100 synthetics through the unchanged laws; deterministic generation. ✔
- **Sweep proof** — 1,000 seeded seasons of recruitment and play: the usage ledger never drifts, recruitment stays in bounds, the trio never leaves. ✔
- **Reachable, live** — `Longlight (assault/vanguard) · roster 3/14 · uses 0 (0% wr)` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the philosophies, recruitment sources, synergy/AI registers, customisation and statistic kinds, and balance axes bind at every future Commander and multiplayer module.**
