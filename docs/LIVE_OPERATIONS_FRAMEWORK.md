# AFTERLIGHT — Live Operations Framework

**Authority:** Produced output of AF-070. Extends AF-000 → AF-069 — the third ledger module, and the one that guards all the others: every future season, expansion, DLC and major update enters the game through this registry's gauntlet. It is extended, never replaced.
**Binding rule of the whole document:** the galaxy only grows. Replacement is a rejection, power creep is unrepresentable, regression testing is a gate, temporary gameplay is refused by name, and nothing the registry accepts can ever be removed — a decade of updates runs through one unmodified class.

---

## 1. The registration gauntlet

`LiveOpsRegistry.registerPack` validates all-or-nothing — a rejected pack mutates nothing. Rejections: any failed QA gate (all six mandatory: performance, balance, saveCompatibility, accessibility, loreConsistency, existingProgression); any addition reusing a registered id (replacement attempt — "never invalidate previous content"); any temporary addition that isn't a challenge ("temporary gameplay content is FOMO"); any duplicate pack id (the timeline is append-only history).

## 2. The core game is pack zero

`CORE_GAME_PACK` registers the REAL shipped ids — all ten authored biomes, the Hollow Sentinel, the campaign chapters — so the no-replacement gate protects the actual game: "Singularity Zone Remastered" over the real id is rejected, tested. Existing content remains valuable because replacing it is impossible.

## 3. Horizontal by shape

A `ContentAdditionDef` is a kind + an id (+ a challenge-only temporary flag) — asserted by inspecting its own keys. No stat field exists in packs, additions, or the eight cosmetic/lore seasonal-reward kinds. Power creep and pay-to-win have nowhere to live; the five forbidden practices are registered BY NAME so tooling can assert against them.

## 4. Seasons — core progression never resets

Ending a season retires exactly its temporary challenges. Permanent discoveries, cosmetics, lore and every prior pack stay live; retired challenges remain in the registry as history (the Season Archive), and the class exposes no remove/delete/revoke/reset operation (prototype-asserted — the AF-068/069 pattern).

## 5. A decade without redesign

Versions are unbounded integers and compatibility is monotone: `compatibilityFor(anyOlderVersion)` is always compatible because packs only add. The decade sweep runs 40 quarterly seasons + 10 annual expansions through the same class: content grows every year, a year-one save loads at year ten, all 40 challenges retire while nothing else is removed, and `returningPlayerRecap` reconstructs the whole decade — players never feel lost returning after months away.

## 6. Registered shelves

Ten content tiers, eight seasonal kinds, eight expansion kinds, seven galaxy-evolution sources, eight live events, six community objectives (a Constitution-compliant FUTURE slot — online stays optional), eight reward kinds, five forbidden practices, five monetisation kinds, six QA gates — all counted in tests; every future live release binds against them.

---

## Internal review loop (AF-070, recorded)

- **Zero engine changes** — one pure registry; the core game as pack zero; one overlay line. ✔
- **The gauntlet holds** — replacement, failed QA (all six individually), FOMO, and duplicate packs each rejected with named reasons; rejected packs mutate nothing (snapshot equality). ✔
- **Horizontal by shape** — no stat field in any pack shape (key inspection); rewards all cosmetic/lore. ✔
- **Seasons retire only challenges** — permanence asserted for discoveries, cosmetics, lore, and the core game; no reset API exists. ✔
- **Decade sweep** — 50 packs over ten simulated years: monotone growth, permanent compatibility, full recap, the core game intact. ✔
- **Reachable, live** — `liveops v2 · packs 2 (19 additions) · season S1 "Embers of the Frontier" · compat ok` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the tiers, seasonal/expansion kinds, live events, reward kinds, QA gates and forbidden-practice registry bind at every future season, expansion and DLC module.**
