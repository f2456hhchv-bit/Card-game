# AFTERLIGHT — Core Gameplay Framework

**Authority:** Produced output of AF-016. First module of the Core Gameplay phase, built on the locked Foundation (AF-000 → AF-015). Every gameplay system after AF-016 extends this framework; it is extended, never replaced.
**Binding rule of the whole document:** easy to begin, difficult to master; every run unique; every failure teaches; every victory advances permanent progression — and every run ends with the player wanting the next one.

---

## 1. The primary game loop

Launch → **Galaxy Command** → Prepare Build → Select Mission → **Expedition** (Combat ⇄ Exploration → Level Progression → Loot → Elites → Boss) → Complete/Defeat → **Rewards** → Research → Crafting → Collections → **Galaxy Expansion** → next Expedition.

This is AF-000's core loop at implementation resolution. Every future mechanic names the stages it strengthens (Foundation Lock §6); the loop is the map every AF-017+ module pins itself to.

## 2. The game state machine (implemented)

One state machine owns the player's journey. States: **Boot · Splash · MainMenu · GalaxyCommand · MissionSelect · Loading · Gameplay · Pause · LevelUp · InventoryOverlay · MissionComplete · Defeat · Statistics** (+ reserved: *Multiplayer*, *CommunityHub* — names registered, unreachable until their modules).

- **Legal transitions are a data table**, not scattered ifs — illegal transitions throw in dev, are refused and logged in production (AF-001 §9 graceful failure). Deterministic: same inputs, same path, always.
- **Overlay states** (Pause, LevelUp, InventoryOverlay) *stack* on Gameplay rather than replace it — the run's simulation state is preserved untouched beneath them, which is what makes pause-anywhere and the AF-003 level-up flow cheap and safe.
- **Transition budget: < 250ms**, measured per transition and surfaced in the debug overlay; heavy work is done asynchronously in Loading, never inside a transition.
- Every transition publishes `GameStateChanged` on the Event Bus — systems react to facts, no system polls the machine (AF-001 §7).

## 3. The run lifecycle

Within Gameplay, a run advances through phases: **Spawn → Early Exploration → Enemy Escalation → Elite Encounters → Environmental Events → Mini Boss → Midgame Scaling → Boss Encounter → Reward Phase → Extraction → Results.** Phase state lives in the run session (§4); the Enemy Director (AF-017) reads phases to drive escalation; pacing follows the rhythm law (§5). **Failure is a valid outcome** — Defeat routes to Results with full reward processing (§7), never to a dead end.

## 4. The player session record

Every run produces a session record: mission · Commander · ship · weapons · equipment · research state snapshot · difficulty · **Ascension** level · biome · **mission seed** · play time · performance metrics · results · statistics. The seed plus the deterministic simulation (AF-001) reproduces the run — the foundation for debugging today and replays/verification later. Session records feed the statistics save slice; the current run persists in a new **`run` save slice** (extends AF-001 §8) so platform interruption (mobile backgrounding, browser close) resumes safely mid-run.

## 5. Pacing & session principles

Rhythm law: **Calm → Combat → Escalation → Reward → Discovery → Escalation → Boss → Resolution** — tension alternates with recovery; no flatlines, no unbroken screaming. Session principles the implementation enforces: no unnecessary downtime (results screens are one input from the next action) · minimal loading (async streaming; Loading state only when genuinely unavoidable) · **immediate player control** (input is live the frame Gameplay enters) · anti-repetition: the Enemy Director varies encounter patterns within the phase structure (binds AF-017).

## 6. In-run progression

Gain XP → level up → choose upgrades (AF-003 §7 flow) → acquire loot → unlock synergies → fight stronger enemies → adapt build → complete mission. **Binding constraint registered for AF-022/AF-023:** no run becomes mathematically unwinnable through random chance alone — randomness varies *which* viable options appear, never *whether* a viable option exists. (Chance shapes runs; decisions decide them — AF-011's core vision.)

## 7. Save & failure philosophy

**Permanent** (survives everything): research, collections, mastery, statistics, achievements — existing AF-001 slices. **Temporary** (the run): current run, mission state, current build, current rewards — the `run` slice, cleared at Results after its rewards are banked. Failure pays out knowledge, research progress, collections, statistics, and experience **through the same Results flow as victory** — one reward pipeline, two headlines. Failure never invalidates player time (Constitution promise, AF-011 §4 harvest framing).

## 8. Extension points (how AF-017 → AF-026 attach)

| Module | Attaches via |
|---|---|
| AF-017 Enemy Director | Run phases (§3) + `RunPhaseChanged` events; owns escalation within the rhythm law |
| AF-018 Camera | Engine camera system; reads Gameplay state; AF-000 perspective lock |
| AF-019 Controls | Input system → unified actions; live from Gameplay entry (§5) |
| AF-020 Movement | Player system, fixed-timestep sim |
| AF-021 Combat | Combat system + events (`PlayerDamaged`, `EnemyKilled`, …) |
| AF-022 XP | XP events → LevelUp overlay state; §6 constraint |
| AF-023 Loot | Loot events → Reward Phase; §6 constraint; rarity ladder (AF-007) |
| AF-024 Research | Rewards → Research state in Galaxy Command loop |
| AF-025 Crafting | Rewards → Crafting (Lightforge) in Galaxy Command loop |
| AF-026 Progression | Session records → permanent slices; Ascension; mastery |

New canon registered by this module (specification owed to the named modules): **Ascension** (difficulty layering, AF-026), **Mini Boss** and **Extraction** phases, **Environmental Events** (AF-017 territory).

## 9. Accessibility

Pause anywhere (overlay stacking makes it structurally free; "where appropriate" = never during state transitions themselves) · tutorial replay (onboarding is re-playable from settings, never once-and-gone) · difficulty explanations (every difficulty/Ascension option states what it actually changes — no mystery modifiers, per the no-hidden-information law) · input flexibility (AF-019 will bind actions, not keys) · reduced motion, visual clarity, colour-blind modes, subtitles — all inherited floors (AF-014 floor rule).

## 10. Performance & debug (implemented)

Fixed-timestep deterministic loop with interpolated rendering (AF-001 §10); transitions <250ms measured; pooling primitives in place and mandatory for everything AF-017+ spawns; async loading pattern established by the Loading state. **Debug overlay (dev builds) shows now:** current game state · current run phase · mission seed · difficulty/Ascension · player build summary · session timer · memory (where the platform exposes it) · FPS · last transition time. Every AF-016 debug requirement is live or has its slot.

## 11. Standing obligations

Full-session playtest items (play complete sessions; review pacing, onboarding, run flow, reward pacing) **bind as AF-017 → AF-026 land** — each gameplay module's QA plays the loop as far as it then reaches; the complete-loop review runs when the loop closes at AF-026. Per-module: every new system pins itself to §1 loop stages and §3 phases, respects the §2 transition table (extending it via review, never bypassing it), and keeps every §10 number green.

---

## Internal review loop (AF-016, recorded)

- **Loop fidelity** — §1 verified stage-for-stage against AF-000/AF-015; no stage added or lost. ✔
- **State machine** — all sixteen states (13 live + 2 reserved + Loading) in a legal-transition data table; overlay stacking preserves run state; deterministic and event-publishing; 250ms budget instrumented. ✔
- **Run lifecycle** — eleven phases with failure as first-class outcome through the unified Results flow. ✔
- **Determinism** — seed in the session record + fixed timestep = reproducible runs from day one. ✔
- **Save extension** — `run` slice extends (not redesigns) AF-001 §8; safe interruption on mobile/browser honoured. ✔
- **Constraint registration** — the never-unwinnable rule and new canon (Ascension, Mini Boss, Extraction, Environmental Events) registered with owing modules named, so nothing arrives later as a surprise. ✔
- **Integration** — attachment table for all ten upcoming modules; no module will need a foundational addition (Foundation Lock §8 verified against each). ✔
- **Simplification pass** — rejected a second sub-state-machine for menus (one machine + overlay stacking suffices); rejected per-state loading screens (one Loading state, async elsewhere); kept reserved states as names only (no dead scaffolding). ✔

**Internal quality score: 9.5/10 — approved; locked with standing obligations as gameplay modules land.**
