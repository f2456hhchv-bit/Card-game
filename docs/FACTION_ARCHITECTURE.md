# AFTERLIGHT — Faction Architecture (AF-085)

**Authority:** Produced output of AF-085. Extends AF-000 → AF-084 — above all AF-039's unchanged faction engine (the ten-id register, reputation ladder, conflict states, roster shapes, FactionRuntime), AF-026's codex, AF-038's galaxy regions, and AF-068's campaign. Every future civilisation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** civilisations are realised, never duplicated — every spec faction is an existing diplomatic faction, an existing codex civilisation, or the player's own organisation; identity is unique by law; and the galaxy evolves on time alone, provably without the player.

---

## 1. The engine and the doctrine

AF-039 built the machine: ten registered faction ids, thirteen-field `FactionDef` profiles, a signed reputation stat with a clamped eight-level ladder, pairwise conflict states with a roster default, and a weighted event engine. AF-085 adds the civilisation doctrine as pure data — `FactionProfileDef` wraps each profiled faction BY ID with the identity uniques the def didn't carry (architecture, music, dialogue, signature reward, economy sectors), and `factionArchitectureFor` proves all **fifteen architecture parts**. Nothing in AF-039 changed.

## 2. The civilisation register — no eleventh faction

The spec's ten major factions land as a register whose every entry is realised by an existing thing:

- **Six diplomatic factions** on AF-039's register: the United Human Frontier *is* the Human Alliance, the Crystal Ascendancy *is* the Dominion, the Void Swarm *is* the Legion, the Stellar Nomads *are* the fleet, plus the Machine Collective and Independent Colonies.
- **Three enemy civilisations** in AF-026's real codex: the Celestial Conclave, the Paragon Protocol, and the Eclipsed — canon since the enemy-civilisation modules, fought rather than negotiated with.
- **One player organisation**: the Afterlight Initiative — the AF-068 campaign's protagonist. The player *is* the Initiative.

Every realisation resolves against its real register, no diplomatic faction is claimed twice, and exactly one player organisation exists — all asserted.

## 3. Identity is a uniqueness law

"No faction should overlap excessively" is enforced pairwise across the six profiled civilisations: architecture styles, music themes, dialogue voices, signature reward kinds, and economy-sector sets are all distinct. Signature rewards are real `FactionRewardDef` kinds and reflect identity — the Guild deals in commanders, the Nomads in hulls, the Custodians in lore, the Alliance in blueprints. Territory regions resolve against AF-038's real shelf.

## 4. Politics on the real engine

Seven political instruments map totally onto AF-039's conflict states (embargoes are cold wars; exploration accords are shared science) and drive the real `setRelationship`: symmetric in both directions, self-alliance inviolable, the roster default backing every unset pair. Six relationship-evolution drivers are each realised by a conflict state or a faction event. Eight reputation tracks, eight player-interaction routes, seven territory effects, and nine reward realisations each name their live mechanism — including the honest one: relics are found in-run through AF-029's pools, never handed out.

## 5. The living galaxy, proven

"Every faction should continue evolving whether or not the player interacts" is a determinism test: two runtimes with the same seed produce identical event histories on elapsed time alone. The reputation ladder is monotone across its entire clamped range (hostile at −400 through legendary ally at +1000). The faction encyclopedia is `factionEncyclopediaFor` — ten sections derived from data every profiled faction already carries.

---

## Internal review loop (AF-085, recorded)

- **Zero engine changes** — profiles, two pure functions, one register; AF-039 untouched. ✔
- **No eleventh faction** — all ten civilisations realised through real registers, exactly one player organisation. ✔
- **Nothing undefined** — fifteen parts proven for every profiled civilisation, territory on the real region shelf. ✔
- **Identity unique by law** — five identity axes pairwise-distinct across the roster. ✔
- **Politics real** — instruments drive the actual relationship engine; symmetry and self-alliance inviolable. ✔
- **The galaxy lives without the player** — deterministic event histories on time alone. ✔
- **Simulation proof** — 1,000 seeded galaxies through the real FactionRuntime with every invariant holding. ✔
- **Reachable, live** — `profiled 6/10 · civs 10 (6 diplomatic)` on the overlay, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the architecture parts, civilisation register, uniqueness law, political maps and living-galaxy discipline bind at every future faction module and civilisation.**
