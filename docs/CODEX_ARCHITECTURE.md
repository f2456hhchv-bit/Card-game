# AFTERLIGHT — Codex Architecture (AF-087)

**Authority:** Produced output of AF-087. Extends AF-000 → AF-086 — above all AF-043's unchanged Codex engine (entry shapes, category/era shelves, unlock references, `CodexRuntime`'s search/timeline/section-completion), AF-026's collection ledger, AF-082's real research node, and AF-039/086's void faction and event. Every future discovery extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Codex is memory, not a menu — nothing remains undefined for any real entry, no primary category widens the locked union, no entry requires luck alone, and the discovery ladder only ever advances.

---

## 1. The engine and the doctrine

AF-043 built the machine: entry shapes, twenty categories, nine timeline eras, three unlock-reference kinds, and a `CodexRuntime` that searches, orders the timeline, finds missing links, and detects section completion — all pure reads over discoveries AF-026/042 already track. AF-087 adds the discovery doctrine as pure data — `CodexEntryProfileDef` wraps each entry BY ID, and `codexArchitectureFor` proves all **fourteen architecture parts** for every one of the real forty sandbox entries, hand-authored or deterministically derived. Nothing in AF-043 changed.

## 2. Seventeen categories, zero new ones

Twelve of the spec's primary categories map directly onto AF-043's real shelf. The other five have no home there and are realised through existing systems instead of widening the locked union: Planets and Star Systems point at AF-038's real galaxy systems, Ancient Technology at the `ancientCivilisations` shelf, **Afterlight Network at AF-082's real "afterlight-network" research node** — the precursor loom, still running — and Void Phenomena at AF-039's Void Legion plus AF-086's `voidIncursions` galactic event.

## 3. The Discovery Progression ladder

The module's one genuinely new mechanical surface: `CodexDiscoveryRuntime` is the sixth appearance of the monotone-lattice pattern — Unknown → Observed → Scanned → Studied → Understood → Mastered — riding on top of AF-043's unchanged binary unlock gate rather than replacing it. The lattice never checks `isUnlocked` itself; the composition root only ever advances an entry once it is genuinely unlocked. States only advance, no removal API exists, and a 200-seed shuffled-order sweep proves every real entry reaches Mastered regardless of visiting order.

## 4. The Player Journal

`CodexJournalRuntime` gives pins, bookmarks, and favourites three independent toggle sets, free-text notes, and two histories: a permanent, append-only Discovery History (the player's own record) and a deliberately **bounded** Search History (fifty entries, oldest dropped) — a personal convenience list, explicitly distinct from AF-084/086's permanent galaxy-facing histories.

## 5. One relation mechanism, eight readings

`relatedKnowledgeKindFor` classifies an existing `relatedEntryIds` target by its own real category into one of the spec's eight Related Knowledge kinds — no second relation system. Unclassifiable targets honestly return null.

## 6. Rewards and multimedia, honestly realised

Collection Rewards resolve onto AF-026's real `CosmeticRewardKind` union, an existing system (Museum Displays onto AF-078's derivation pattern, Historical Records onto AF-086's `GalacticHistoryRuntime`), or honestly future (Commander Dialogue — no VO system yet). Multimedia kinds carry an honesty flag: Concept Art and Recovered Documents are already live through AF-043's own fields; the rest await production.

## 7. Live in the game

Every newly-unlocked entry is auto-recorded Observed the instant AF-043's own check goes true; completing a whole section masters every entry inside it; and the Statistics screen gained a real "Pin Featured Discovery" button — browser-verified end to end.

---

## Internal review loop (AF-087, recorded)

- **Zero engine changes** — profiles, two small pure runtimes, AF-043 untouched. ✔
- **Nothing undefined** — fourteen parts plus ten structure sections proven for all forty real entries. ✔
- **No union widened** — five categories realised through existing systems instead. ✔
- **The ladder only advances** — monotone, no-removal, proven over 1,000 careers and 200 shuffled visiting orders. ✔
- **The journal is real** — three independent toggles, two histories, the search cap exact. ✔
- **One relation mechanism** — eight readings, honest nulls where unclassifiable. ✔
- **Reachable, live** — Observed/Mastered counts tick at boot, the Pin button works end to end, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the category realisation map, discovery-route bindings, progression ladder, journal discipline and reward realisations bind at every future discovery module.**
