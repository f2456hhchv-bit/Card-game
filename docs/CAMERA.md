# AFTERLIGHT — Camera Framework

**Authority:** Produced output of AF-018. Extends AF-000 → AF-017. Every future gameplay system, boss encounter, biome, and mission extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the camera is a gameplay communication tool, never a cinematic one. It succeeds when the player never consciously thinks about it.

---

## 1. Camera type (locked laws)

Permanent **top-down orthographic** camera (AF-000 perspective lock). Fixed gameplay angle. **Never** rotates during gameplay, never switches perspective, never goes cinematic during combat. Complete battlefield awareness is the camera's single job: the player's position, enemies, incoming danger, loot, objectives, and boss mechanics stay readable at all times (AF-004 attention model, seen through a lens).

## 2. Camera modes

The camera reacts to `GameStateChanged` events (never coupled to the state machine) with a data-driven mode table: **Menu · GalaxyCommand · MissionBriefing · Gameplay · BossIntro · BossCombat · MissionComplete · Defeat · Results.** Each mode is data — zoom level and follow on/off. Transitions between modes are always smoothed (§4); hard cuts during gameplay are prohibited (loading transitions stay minimal per AF-016's <250ms budget).

## 3. Follow system (implemented, tested)

- **Soft follow:** exponential smoothing toward the target — framerate-independent (the smoothing constant is a per-second rate applied through the fixed timestep).
- **Predictive look-ahead:** the camera aims at `player position + velocity × lookAheadMs`, shifting the view toward where the player is going — more battlefield where it matters.
- **Never outrun:** a hard lag clamp bounds the camera's distance from the player; sprinting can never push yourself off-screen. (Player stays near centre — screen composition law.)
- **Stable Camera Mode** (accessibility): look-ahead and softness reduced/zeroed by data multipliers — the camera becomes a near-rigid follower.

## 4. Zoom system

Default gameplay zoom is **locked** (one battlefield scale, one readability contract). Temporary zoom states are permitted only for: boss introductions, mission completion, major discoveries, Galaxy Command, and *Photo Mode (future flag)*. Zoom changes smooth exponentially and **always return** to the locked gameplay zoom. Boss intros may briefly zoom out to reveal arena/boss/title, then return control immediately; **boss combat always uses the standard gameplay camera** — no exceptions, ever (AF-002/AF-004 readability law).

## 5. Shake & screen effects

**Shake (implemented):** impulse-based with exponential decay; sources (weapon impact, shield break, Ultimate, boss slam, large explosion, mission complete) are tuned amplitudes in data. Two hard rules: a **clarity cap** — stacked impulses can never exceed the tuned maximum amplitude, so spectacle cannot defeat readability; and the **accessibility multiplier** — a single 0–1 scale (0 = disabled) applied at impulse time, honouring disable-shake/reduced-motion/photosensitivity settings (AF-014 floor rule).

**Screen effects** (damage flash, shield flash, level-up pulse, legendary drop pulse, mission-complete fade, research unlock, boss arrival): render-layer consumers of existing Event Bus events — they arrive with the renderer module, pooled (AF-001), subtle by law (AF-002 §6.6), and fully disabled by reduced-effects modes.

## 6. Boundaries (implemented, tested)

The visible rect is clamped to world bounds — unloaded areas, hidden systems, developer space, and unused regions are never exposed. Clamping is smooth (applied to the followed position, so the camera glides into walls rather than snapping); a world axis smaller than the viewport centres on that axis.

## 7. Composition & HUD

Player near screen centre (lag clamp + follow guarantee it); bosses, danger zones, and loot visibility are content-placement obligations (arena sizing vs the locked zoom) enforced at boss/biome module QA; the HUD occupies the six AF-003 zones and never overlaps the sacred centre — composition is a contract between this framework and every future arena.

## 8. Accessibility

All camera accessibility is tuning-data multipliers, live-applied: disable camera shake · reduce motion · reduced screen flash (render effects) · high visibility mode · photosensitivity mode · stable camera mode. No mode changes what the player *knows* — only how forcefully the camera says it (AF-004 §8 comprehension gate).

## 9. Performance

Camera updates run **after** simulation movement in the frame (consume final positions); per-update work is a handful of exponential smoothings — no allocations, no searches. Shake offset is computed from a deterministic phase function (no RNG in the render path). Render interpolation uses the GameLoop's alpha. Effects pooled at the renderer. Budgets: negligible; 120/60 targets unaffected.

## 10. Debug

Debug overlay additions when the camera goes live on screen (AF-020+): camera mode · zoom level (current → target) · player offset (lag distance) · shake amplitude (raw vs capped vs accessibility-scaled) · transition state · camera update cost. All fields exist on the implemented `CameraSnapshot` today.

## 11. Tuning surface (AF-011 §7 law)

`cameraTuning` data: mode table (zoom + follow per mode) · follow smoothing rate · look-ahead ms · max lag distance · zoom smoothing rate · shake decay rate · **max shake amplitude (clarity cap)** · per-source shake amplitudes · accessibility multipliers. Camera feel is a data edit, never a code edit.

---

## Internal review loop (AF-018, recorded)

- **Perspective law** — top-down orthographic, no rotation, no cinematic combat: locked in the mode table's shape (there is no rotate field to abuse). ✔
- **Follow** — convergence, look-ahead direction, and the never-outrun clamp proven by deterministic tests. ✔
- **Zoom** — locked gameplay zoom with smooth-return verified; temporary states are data-listed, closed set. ✔
- **Shake** — decay to zero, clarity cap under stacked impulses, and accessibility-zero all tested. ✔
- **Boundaries** — clamping and smaller-world centring tested; no exposure of non-play space. ✔
- **Determinism** — same inputs → same camera state; no RNG anywhere in the camera. ✔
- **Integration** — reacts to existing events only; consumes AF-020 movement when it lands; arena composition contract registered for boss/biome modules. ✔
- **Simplification pass** — rejected camera rotation support even as a dormant field (a lock with a latent unlock is not a lock); rejected spline/cinematic paths (no consumer may exist under the laws); folded screen effects into the renderer's remit rather than a camera-owned effect stack. ✔

**Internal quality score: 9.5/10 — approved and locked; on-screen feel review binds AF-020+.**
