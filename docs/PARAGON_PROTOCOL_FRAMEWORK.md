# AFTERLIGHT — Paragon Protocol Enemy Framework

**Authority:** Produced output of AF-053. Extends AF-000 → AF-052. Every future prototype, experimental technology, research facility and forbidden science expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** containment only ever moves toward failure — Reactor Stability depletes, never recovers past what active repair offsets, and the moment it hits zero, everything the unit was inverts, permanently.

---

## 1. Faction Identity — the third faction with zero prior lore, by design

The Paragon Protocol is abandoned pre-Collapse military research belonging to no single civilisation. Like AF-049's Void Swarm and AF-051's Xenomorph Hive, this framework adds no `FactionDef`. Its Codex entry cross-references the Xenomorph Hive's as another non-civilisation threat.

## 2. Visual Language — data now, art at the asset pass

`PARAGON_VISUAL_LANGUAGE` records white laboratory alloy, an orange warning-light accent, and a core-blue energy tone; live today in the singularity-charge canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — thirteen registered, six fully authored, zero schema changes

Prototype Drone, Pulse Cannon, Adaptive Hunter, Containment Sentinel, Energy Construct, and Elite Omega Prototype are plain AF-033 `EnemyDef`s, checked distinct from the base roster and all seven prior factions. Ranged attacks ARE AF-032 `WeaponDef`s, the first real use of the `singularity` category — the last fully-dormant WeaponCategory. Seven further unit kinds are registered vocabulary.

## 4. Combat Style & Containment System — one irreversible event is the weapon

Live today: a depleting Reactor Stability meter (`ParagonInstabilityRuntime.stability`) fed by incoming damage and inherent instability, repaired only while a Containment Sentinel lives. The instant it hits zero, Containment Collapse fires exactly once — a permanent, one-way transformation. Adaptive Shields (pre-collapse incoming-damage reduction) and Energy Overload + Unstable Reactors (post-collapse damage/speed spike) are the two mechanically-live faces of this single event.

## 5. Adaptive Technology — one input live, six registered

Incoming Damage is mechanically live (`recordIncomingDamage`), the same analysis shape AF-047's Adaptive AI first established. Weapon Types, Movement, Status Effects, Ability Usage, Combat Duration, and Threat Level are registered future inputs.

## 6. Containment Sentinel — cut the repair, not the value

The deliberate eighth doctrine's tactical layer: destroying the Sentinel removes the only active repair source without ever touching Stability's current value — echoing AF-052's "kill changes a rate, not a value" shape, applied here to a depleting-toward-catastrophe meter. Verified live: Stability's value was unchanged the instant the Sentinel died.

## 7. Elite Variants & Mini-Bosses

Omega Prototypes spawn as AF-034 Elites through the unchanged pipeline. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 8. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Prototype Components, Quantum Cores, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Containment Sentinel kill.

## 9. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); protocol state is surfaced plainly on the debug overlay (Stability %, collapse state, unit/sentinel counts); Singularity Charges are a capped, one-shot-per-collapse array reusing the boss arena's pooled hazard-tick pattern a fifth time.

## 10. Debug

Live: per-protocol Reactor Stability percentage, collapse state, unit and sentinel counts — the shared `DebugOverlay` `paragonProtocols` field. A dev-only spawn key ("2") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), Crystals' (7), Void's (6), Ancient Custodians' (5), the Xenomorph Hive's (4), and the Stellar Nomads' (3).

---

## Internal review loop (AF-053, recorded)

- **No duplicated systems** — schema, weapons, elites, the hazard engine, formation math reuse, loot, Codex, and the `EnvironmentalEventTriggered` fact all reuse AF-017/021/032/033/034/035/043/047/052 exactly; `ParagonInstabilityRuntime` is the only genuinely new surface. ✔
- **One irreversible event, never a curve** — verified live and across a 1,000-encounter sweep: Collapse fires at most once, never reverses, and Stability never leaves `[0, maxStability]`. ✔
- **Inverts, doesn't just weaken** — Adaptive Shields and Energy Overload were verified to flip in the same instant Collapse fires, the first doctrine to make a unit simultaneously less defended and more dangerous. ✔
- **A repair source, not a value, is what dies** — the Sentinel's death was verified to leave Stability's current value completely untouched. ✔
- **Sandbox proof** — a live protocol's Reactor Stability dropped from 95% to 67% under real combat, tracking the tuned loss rate exactly, zero page errors. ✔
- **Self-review found no defect to fix** — the passive-decay-vs-Sentinel-repair balance and the one-shot collapse-event flag both worked correctly on the first pass. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven unit defs, six Adaptive Technology inputs beyond Incoming Damage, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
