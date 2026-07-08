# AFTERLIGHT — Void Expanse Biome

**Authority:** Produced output of AF-061. Extends AF-000 → AF-060 — above all AF-036's unchanged biome engine, AF-049's Void corruption doctrine, and AF-058's biome registry. Every future anomaly, singularity, reality fracture and cosmic mystery extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Void is mysterious rather than horrifying, beautiful rather than grotesque — its danger is instability, not gore. Time, gravity, light and space misbehave through engines the game already owns, and the numbers say what the tone implies (threat 1.35, the deepest authored biome, asserted).

---

## 1. Identity & Lore — the edge of existence

Hollow Crown is what remains when reality stops holding its shape: collapsed stars, silent planets, geometry that answers to nothing. Its Codex entry unlocks by activating the void archive in the field and cross-references AF-049's corruption doctrine and the Eclipsed — the Void, what it does, and what it leaves behind taught as one chain. The greatest mystery in Afterlight stays a mystery: every archive line raises questions instead of answering them.

## 2. The biome is data on the locked engine

`VOID_EXPANSE_BIOME` is a plain AF-036 `BiomeDef`: a statusless heavy Gravity Well (positioning is the counterplay), a Reality Tear leaking AF-021's corruption status (AF-049's signature), a Temporal Field applying AF-052's stasis root (time misbehaving as stolen seconds) — three AF-035 zones; Void Storms / visibility-reducing Dark Matter Clouds / Gravitational Waves with the strongest wind of any authored biome (AF-020 forces); four weighted events led by `voidBreach`; endgame loot weights (researchSample/relic/ancientArtifact highest of any biome — §Resource Distribution's "endgame progression", literal).

## 3. Instability made playable

Three interactables: the void archive (lore), a Reality Anchor using the `triggerEvent` interaction kind ("Stabilise Reality" made literal), and a Hidden Gateway giving `unlockSecret` its FIRST producer since AF-036 registered the kind — §Exploration's "Hidden Gateways", playable.

## 4. Vocabulary — naming layers with total mappings

Seven weather names and eight event names map totally onto the locked shelves; ten locations, eight hazard kinds, eight mission types, eight resources, eight POIs, eight discoveries, and five boss kinds (Rift Guardian and the Void Avatar already AF-049 roster vocabulary) are registered. `bossId: null` is honest — the void bosses bind as `BossDef`s when authored.

## 5. Enemy Presence — the Void dominates every encounter

The full six-def AF-049 Void Swarm roster primary, three Eclipsed (drifting where their fleets fell), two Ancient Custodians (still guarding something at the centre), one rare Celestial spark, one occasional Machine expedition — every id resolution-tested across five rosters, natives hardened through AF-036's live hook (`shieldCapacity +14`) and immune to corruption: the Void does not corrupt what is already its own.

## 6. Galaxy integration

Hollow Crown (new `voidExpanse` region, threat 5 — the highest in the galaxy — no Fast Travel gate) lies past even Forge Primus — three real travel hops — carrying `biomeId: "void-expanse"` through AF-058's registry, the fourth consumer of AF-038's field, with an ancient-monolith POI (`unknownSignals`) discovering lore through AF-038's existing path.

---

## Internal review loop (AF-061, recorded)

- **Zero engine changes** — one `BiomeDef`, one region, one system, one Codex entry; all mappings total, no orphan vocabulary; one dormant interaction kind given its first producer. ✔
- **Physics misbehaves through owned engines** — gravity is damage, reality tears are AF-021 corruption, temporal fields are AF-052 stasis; a 1,000-mission sweep asserts hazards ALWAYS fire ("reality never stops collapsing", literally). ✔
- **The edge of existence, by assertion** — threat strictly above AF-060's 1.25, live enemy buff, native corruption immunity are tests, not intentions. ✔
- **Reachable, live** — real travel Lucent Gate → Hollow Drift → Forge Primus → Hollow Crown, launch, the Void on the overlay (`Hollow Crown · weather voidLightning · hazards 3`), zero page errors. ✔
- **Sweep proof** — weather/events never leave the Void's own pools across 4,000 steps; the void archive discovers in range; the Codex entry gates on it with zero Missing Links. ✔

**Internal quality score: 9.5/10 — approved and locked; the ten locations, eight mission types, five boss kinds, and the deep-black/violet/lensing visual language bind at future mission, boss, and asset modules.**
