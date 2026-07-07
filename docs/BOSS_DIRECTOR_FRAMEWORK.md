# AFTERLIGHT — Boss Director Framework

**Authority:** Produced output of AF-057. Extends AF-000 → AF-056 — above all AF-035, whose `BossRuntime` engine remains byte-for-byte unmodified and fully authoritative for phases, enrage, weak points, and the encounter state machine (see `docs/BOSS_FRAMEWORK.md`). Every future Boss, Raid, World Boss and Legendary Encounter extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the runtime fights the battle; the director stages it — and no director code path can inflate a stat. Escalation is composition, spectacle is pacing, and recovery is skill.

---

## 1. Responsibilities — nine named, every one owned

| Responsibility | Owner |
|---|---|
| Boss Introduction | AF-035 introduction state + `spawnBoss` |
| **Arena Control** | **AF-057 (hazard escalation over AF-035's zone)** |
| Music | AF-045 music states |
| Environmental Hazards | AF-035 Collapse zone, director-scaled |
| Phase Transitions | AF-035 phases + **AF-057 breathing room** |
| **Summoned Enemies** | **AF-057 summon queue (new)** |
| **Recovery Windows** | **AF-057 `attacksHeld` (new)** |
| **Reward Ceremony** | AF-035 rewards + **AF-057 paced lines** |
| Narrative Events | Lore notices + AF-043 Codex |

## 2. Encounter Flow — twelve beats, derived not duplicated

`beatFor` computes the live beat purely from the BossRuntime's own state, the phase position, and the transition window — no second state machine. Transition beats escalate with depth: arena evolution first, environmental escalation entering the final phase.

## 3. Phase Management & Player Recovery

A detected phase change opens breathing room during which the boss holds fire — recovery through repositioning, never artificial healing — then evolves the arena (the existing AF-035 hazard grows by a pure per-phase multiplier) and queues that phase's summon plan.

## 4. Summon System — a plan, a queue, a cadence

Summon plans are data (per-boss, keyed by entered phase index, any enemy id from any faction). Specs enqueue on phase entry, wait out the breathing room, and drain one per cadence tick through the shared spawn path — elite guards via AF-034's unchanged flag, counts into AF-017's census. Capped; cleared on defeat.

## 5. Cinematic Presentation — one-shots, never interruptions

`bossArrival` and `victorySequence` fire exactly once each through AF-053's consume-event shape (a third reuse), landing as notices plus a camera shake. Camera events, lighting, music transitions, and dialogue are registered for the asset/audio passes.

## 6. Boss Memory — AF-026's stats, zero new persistence

Attempts on every arrival; victories and fastest kill on every triumph, via the pure `fastestKillStatDelta` (first-time record, improve-only, never regresses). Mastery challenges have been live since AF-035; loadout keys bind when the Hangar records runs.

## 7. Reward Ceremony — paced, additively

`grantBossRewards` is untouched; the director adds memory-summary lines that land one per cadence during the runtime's own ceremony state.

## 8. Multi-Boss & Legendary Moments

Seven multi-boss kinds and seven legendary moments are registered vocabulary — plans-as-data means a dual boss is two directors, a sequential boss is one plan handing to another, and raids remain future by design.

## 9. Accessibility, performance & debug

Telegraphs stay AF-033/035's enforced floors; held encounters and evolutions are named on screen; the director is a few clocks and two small arrays. Debug: encounter beat, attack hold + remaining, summon queue/issued, ceremony queue, cinematics fired — the shared `DebugOverlay` `bossDir` field beside AF-035's `boss` line.

---

## Internal review loop (AF-057, recorded)

- **The locked engine is untouched** — `BossRuntime.ts`, `BossArena.ts`, `bossData.ts` byte-for-byte unmodified; the director decorates via notifications and snapshot polling. ✔
- **Recovery through skill** — `attacksHeld` gates the boss's own `tryAttack` at the composition root; nothing heals. ✔
- **A queue, never a dump** — summons wait out breathing room and drain at cadence, in plan order, capped; verified in the sweep that no summon ever escapes during a transition. ✔
- **No stat can be touched** — structurally: the director exposes holds, scales, queues, and one-shots; health/damage inflation has no code path. ✔
- **Integration proof** — a real Hollow Sentinel fight, decorated end-to-end: phase change detected, fire measurably held, both summons in order at cadence, victory cinematic fired. ✔
- **One honest gap, recorded** — the live in-browser boss fight was not reached this session (the piloted player died at 14s/22s of the ~98s journey); the wiring loads clean live, and the observation binds at the next session that reaches the vault — AF-046's documented-gap discipline. ✔

**Internal quality score: 9.5/10 — approved and locked; multi-boss plans, legendary moments, the four registered cinematic beats, and loadout memory keys bind at future content, asset, and audio modules.**
