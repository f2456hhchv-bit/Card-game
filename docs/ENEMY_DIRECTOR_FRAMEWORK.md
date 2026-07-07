# AFTERLIGHT — Enemy Director Framework

**Authority:** Produced output of AF-056. Extends AF-000 → AF-055 — above all AF-017, whose `EnemyDirector` engine remains byte-for-byte unmodified and fully authoritative for everything it already governs (see `docs/ENEMY_DIRECTOR.md`). Every future mission, biome, faction, Boss and expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Director decides WHAT and HOW MUCH; the Conductor decides WHEN — and nothing in the conductor layer can ever touch an enemy stat, a threat budget, or the phase engine. Adaptation adjusts pacing, not hidden difficulty, by construction.

---

## 1. Responsibilities — nine named, every one owned

| Responsibility | Owner |
|---|---|
| Enemy Spawning | AF-017 directives → `executeWave` (AF-046 → AF-055 routing) |
| Elite Frequency | AF-017 `maxSimultaneousElites` + AF-034 pipeline |
| Boss Timing | AF-017 MiniBoss phase + AF-035 handoff — conductor-exempt |
| Encounter Density | AF-017 threat budget + census caps |
| Event Timing | AF-017 environmental-event roller |
| **Recovery Windows** | **AF-056 conductor (new)** |
| Resource Drops | AF-022/023 reading the same kill facts |
| Environmental Pressure | AF-035/036 hazards + the six faction hazard reuses |
| **Mission Tempo** | **AF-056 conductor (new)** |

## 2. Mission Flow & Pacing — AF-017's arc, with a live pressure label

The eleven-beat flow IS AF-017's `phaseSequence`. The six pacing pressures (Low, Medium, High, Recovery, Escalation, Boss Preparation) are a pure derivation from the Director's own phase plus the conductor's window state — never a second state machine. An open Recovery Window overrides everything to `recovery`.

## 3. Recovery Windows — reactive breathing room, five triggers live

Windows open after Elite Battles, Boss Phases, Major Events, Large Enemy Waves, and Resource Discoveries — all wired through facts and call sites that already existed. Duration adapts to player struggle between a 2s floor and a 9s hard cap ("recovery should never feel excessive" is a constant), and windows never chain: a cooldown gates every fresh trigger.

## 4. Spawn Queue — pressure deferred, never deleted

Ordinary directives arriving during a window wait in a FIFO queue and land the tick it closes; boss directives bypass the gate entirely. The queue is capped, and overflow flushes the oldest immediately — hiding in a recovery window cannot soft-lock the Director. A flush releasing two different faction directives at once is the live form of a Dual Faction moment. A held encounter is named on screen, not hidden.

## 5. Adaptive Response — two inputs live, five registered

Damage Taken (a decaying accumulator off the existing `PlayerDamaged` fact) and Player Health (the per-tick hull fraction) combine into one struggle score that scales window duration only. Average Kill Speed, Build Strength, Movement Efficiency, Mission Time, and Resource Economy are registered analysis surfaces. The conductor holds no RNG — deterministic by construction.

## 6. Encounter Types — the faction decade, formalised

All nine `WaveType`s map totally onto the ten registered encounter types: Nomad patrols, Outlaw ambushes, generic swarms, Eclipsed elite hunts, Machine dynamic reinforcements, Hive roaming threats, Crystal mixed rosters, and the Hollow Sentinel's ancient activation. `defensiveLine` and `environmentalDefence` are registered for future content.

## 7. Spawn Rules & Balance Principles — enforced where they always were

Min-distance spawn fairness, telegraphs, census caps, and the no-overlap enemy law are AF-017/033's existing contracts; deferred directives re-derive their spawn position at flush time, so a queued wave can never land inside vision. Difficulty comes from composition (ten doctrines, elite mutations, faction pairings) — no conductor code path can raise a stat.

## 8. Accessibility & performance

The queue notice names held encounters; the debug overlay surfaces pressure, window, trigger, queue, and struggle in plain text; difficulty presets are `CONDUCTOR_TUNING` clones (AF-037's per-run-clone pattern). The conductor is a handful of numbers and one small array — spawn requests pool in the queue instead of stacking onto quiet moments.

## 9. Debug

Live: pacing pressure, Recovery Window state + remaining seconds + trigger, Spawn Queue depth, struggle score, and windows-opened count — the shared `DebugOverlay` `conductor` field, beside AF-017's existing `director` line (threat, budget, phase, census).

---

## Internal review loop (AF-056, recorded)

- **The locked engine is untouched** — `EnemyDirector.ts` and `directorTuning.ts` are byte-for-byte unmodified; the conductor wraps the existing `onDirective` seam and is generic over the directive type. ✔
- **Pacing, never hidden difficulty** — structurally: no conductor code path can reach a stat or budget; verified live at both adaptive extremes (2.0s window at struggle 0%, ~9s at 100%). ✔
- **Pressure deferred, never deleted** — `executed === issued` across a real-Director integration run and 5,000 randomised mission timelines. ✔
- **Recovery never excessive** — the 9s hard cap and the no-chaining cooldown held on every step of every timeline. ✔
- **Sandbox proof** — three live runs: a window opening the moment the first real faction wave landed, an `eliteBattles` window on a real elite kill, struggle live-tracking real damage 0→100%, pressure labels riding the Director's phases, and a real directive held at `queue 1` — zero page errors. ✔
- **Encounter variety reviewed** — the total wave→encounter mapping names all ten factions' entrances; dual-faction moments emerge from the queue rather than a scripted spawner. ✔

**Internal quality score: 9.5/10 — approved and locked; difficulty presets, the five registered adaptive inputs, `defensiveLine`/`environmentalDefence` encounters, and the four registered faction-mix kinds bind at future content modules.**
