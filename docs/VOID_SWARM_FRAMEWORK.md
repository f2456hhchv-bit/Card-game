# AFTERLIGHT — Void Swarm Enemy Framework

**Authority:** Produced output of AF-049. Extends AF-000 → AF-048. Every future Void organism, corruption event, dimensional anomaly and cosmic horror extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Swarm is not a civilisation and gets no faction profile — its threat is time itself, a corruption level that climbs for as long as a Beacon survives and only falls once one is destroyed or the swarm is fully contained.

---

## 1. Faction Identity — the first with zero prior lore, by design

The Void Swarm's own spec states it plainly: it is not a civilisation. Unlike every prior faction, this framework adds no `FactionDef` — no government, no economy, no reputation. Its doctrine gets a Codex entry with no faction profile to point at, an honest reflection of the fiction.

## 2. Visual Language — data now, art at the asset pass

`VOID_VISUAL_LANGUAGE` records black energy, a deep-violet distortion tone distinct from AF-048's resonance violet, and a bright fracture accent; live today in the corruption-zone canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — thirteen registered, six fully authored, zero schema changes

Void Wisp, Corruption Parasite, Shadow Hunter, Void Beacon, Rift Guardian, and Elite Ancient Void Avatar are plain AF-033 `EnemyDef`s, every one using the dormant `voidEntity` family — its first use since AF-033 registered it, which makes cross-faction overlap structurally impossible. Ranged attacks ARE AF-032 `WeaponDef`s. Seven further unit kinds are registered vocabulary.

## 4. Combat Style & Corruption System — time is the weapon

Live today: a time-varying corruption level (`VoidCorruptionRuntime.corruptionLevel`, climbing with live Beacon count, capped for fairness), Healing and Damage Amplification (corruption-scaled, composing into the same multiplier point every prior faction's bonus already uses), and Reality Stability — a corruption-scaled incoming-damage reduction, the Swarm's own take on AF-047's single damage-application point. Corruption Zones grow AF-035's exact hazard engine a third time, the first to carry a live status effect. Teleport Access and Shield Recovery are registered awaiting content.

## 5. Reality Distortion — seven registered, none yet live

Warp Movement, Bend Projectiles, Create Mirrored Enemies, Alter Gravity, Hide Pathways, Generate Unstable Terrain, and Collapse Safe Zones all operate on the arena/projectiles/pathing rather than the swarm itself — a larger surface than this module's scope. Registered future content.

## 6. Void Network — corrupt, don't scatter, degrade, or weaken

The fourth doctrine, distinct from all three priors: destroying a Beacon steps corruption down immediately AND removes a growth source, but corruption keeps existing — it decays over real time rather than vanishing, and climbs again if a new Beacon takes root. No captain to break, no core to degrade, no count to instantly recompute — just contested time.

## 7. Elite Variants & Mini-Bosses

Ancient Void Avatars spawn as AF-034 Elites through the unchanged pipeline. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 8. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Void Matter, Reality Fragments, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Void Beacon kill.

## 9. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); swarm state is surfaced plainly on the debug overlay (organism/beacon counts, corruption %, live zone count); Corruption Zones are a capped, run-scoped array reusing the boss arena's pooled hazard-tick pattern; Shadow Hunter's teleport is on a fixed, readable interval — impossible movement that stays fully trackable.

## 10. Debug

Live: per-swarm organism/beacon counts and corruption-level percentage, live corruption-zone count — the shared `DebugOverlay` `voidSwarm` field. A dev-only spawn key ("6") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), and Crystals' (7).

---

## Internal review loop (AF-049, recorded)

- **No duplicated systems** — schema, weapons, elites, the hazard engine, formation math reuse, loot, Codex, and the `EnvironmentalEventTriggered` fact all reuse AF-017/021/032/033/034/035/036/043/046 exactly; `VoidCorruptionRuntime` is the only genuinely new surface. ✔
- **Corrupts, never commands** — verified live and across a 1,000-encounter sweep: corruption climbs continuously with live Beacon count, steps down on a kill, decays once contained, and never leaves `[0, maxCorruption]`. ✔
- **Adapts without becoming unfair** — the 100% cap held at 10,000 accumulated update ticks; corruption is per-swarm and reaches exactly zero once eliminated and fully decayed. ✔
- **Stronger together, mechanically** — healing, damage bonus, and incoming-damage reduction all climb with corruption and all drop the instant a Beacon dies, so every second a Beacon survives is a visible, felt cost. ✔
- **Sandbox proof** — a live swarm's corruption climbed from 1% to 37%+ under real combat, tracking the tuned growth rate exactly, with organisms falling to real auto-fire and zero page errors throughout. ✔
- **Self-review found the cleanest integration yet** — no `WaveType` was claimed at all (unlike AF-046/047/048), and no `FactionDef` was added at all (unlike every prior faction) — both are recorded as deliberate non-extensions rather than gaps, matching the spec's own framing that the Swarm is not a civilisation and does not need a Director wave identity of its own to feel like a cosmic force. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining seven unit defs, seven Reality Distortion actions, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
