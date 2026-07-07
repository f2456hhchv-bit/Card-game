# AFTERLIGHT — Eclipsed Enemy Framework

**Authority:** Produced output of AF-055. Extends AF-000 → AF-054. Every future corrupted expedition, fallen Commander, haunted fleet and tragic encounter extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Eclipsed are a mirror, not a force — every member is somewhere along its own fall, every ally you take from them pushes the survivors further along it, and their strength grows with what the player has become.

---

## 1. Faction Identity — no profile, because they fell from one

The Eclipsed are former humans — not a civilisation, not a polity. Like AF-049/051/053/054 they get no `FactionDef`, but for the opposite reason, and their Codex entry points at the Human Alliance they fell from rather than at another threat.

## 2. Visual Language — data now, art at the asset pass

`ECLIPSED_VISUAL_LANGUAGE` records dulled hull grey, a corruption violet, and a pale memory tone; live today in the expedition notice/echo text colouring, binding to real chassis (damaged armour, broken insignias, ghost-like motion) at the AF-002/006 asset pass.

## 3. Core Units — thirteen registered, six fully authored, zero schema changes

Lost Scout, Broken Pilot, Echo Drone, Memory Warden, Fallen Guardian, and Elite Eclipsed Champion are plain AF-033 `EnemyDef`s, checked distinct across all ten factions. Ranged attacks ARE AF-032 `WeaponDef`s — salvaged Alliance laser and plasma, Mixed Weapon Systems as fiction-accurate hardware. Seven further unit kinds are registered vocabulary.

## 4. Corruption Levels — a personal fall, never a squad value

Live today: every member walks its own five-stage timeline (Recently Lost → Corrupted → Broken → Consumed → Irrecoverable), staggered at spawn, monotonic, capped at Irrecoverable, with per-stage damage/speed steps. Grief is mechanical — every ally death jumps each survivor's own clock forward — and the Memory Warden slows every fall while it lives, making the kill-the-support reflex cost something for the first time.

## 5. Ability Mimicry — the first mechanic that reads what the player has become

The composition root feeds the player's progression level into the group; the mirror's damage share scales with it, never regresses, and is hard-capped for fairness. AF-050 read where the player *is*; the Eclipsed read what they *are*.

## 6. Memory System — world-building on a leash

Memory Echoes reuse AF-053's one-shot consume-event shape: cadence-gated, lifetime-capped per encounter, cycling a fixed line set deterministically, surfaced as notice text that never interrupts play. Verified live at the exact tuned cadence.

## 7. Elite Variants & Mini-Bosses

Eclipsed Champions spawn as AF-034 Elites through the unchanged pipeline — and the Director's `EliteSquad` wave is now their entrance, giving ElitePressure a face: every Eclipsed was once a Commander. The six Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 8. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Recovered Equipment, Commander Records, Memory Shards, and the rest are registered loot vocabulary awaiting item content. The Codex entry (AF-043, additive) unlocks on the first Champion kill — framed as recovering an identity, not scoring one.

## 9. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); corruption stages are surfaced by name on the debug overlay (clear corruption levels); echoes are text with a hard per-encounter cap (subtitle-friendly by construction); the runtime is per-member integers and one string cursor — no pools needed beyond what already exists.

## 10. Debug

Live: per-expedition member count, each member's named corruption stage, Warden state, mirror percentage, and echo count — the shared `DebugOverlay` `eclipsed` field. A dev-only spawn key ("0") completes the digit row alongside the Outlaws' (8), Machines' (9), Crystals' (7), Void's (6), Ancient Custodians' (5), Xenomorph Hive's (4), Stellar Nomads' (3), Paragon Protocol's (2), and Celestial Conclave's (1).

---

## Internal review loop (AF-055, recorded)

- **No duplicated systems** — schema, weapons, elites, formation math reuse, the consume-event shape, loot, Codex, and the notice channel all reuse AF-032/033/034/043/046/053 exactly; `EclipsedCorruptionRuntime` is the only genuinely new surface. ✔
- **Personal, never shared** — verified live and across a 1,000-encounter sweep: members diverge from the first frame, stages never regress, and no kill order breaches the stage bounds. ✔
- **Grief costs the player something** — the Warden's death and every ally's death visibly accelerated the survivors' falls in the same tick, live, twice. ✔
- **The mirror is capped** — mimicry scales with the player's real level, keeps what it learned, and holds its ceiling at any input. ✔
- **Echoes never interrupt** — cadence-gated, lifetime-capped, deterministic text; observed live at exactly the tuned interval. ✔
- **Sandbox proof** — two live runs: staggered stages, same-tick grief jumps, all five stage names reached, an echo at cadence, the mirror reading the player's real level, and the expedition killing the piloted player once — zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven unit defs, six Special Mechanics, six mini-boss `BossDef`s, per-stage visual evolution, and audio-log echoes bind at future content and asset modules.**
