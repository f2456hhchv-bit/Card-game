# AFTERLIGHT — Architecture Notes

**Last updated:** 2026-06-28

How the codebase is structured and why. Read this before making structural
changes.

---

## Layering

The code is organised in strict dependency layers; lower layers never import
upper ones.

```
main.ts                     ← entry point, boots Game
  └─ game/Game.ts           ← orchestrator / state machine
       ├─ engine/           ← reusable, game-agnostic runtime
       │    Renderer, Camera, Input, GameLoop
       ├─ game/World.ts     ← authoritative simulation
       │    ├─ entities/    ← plain pooled data classes
       │    ├─ data/        ← static content (enemies/weapons/relics/bosses)
       │    ├─ systems/     ← WeaponSystem, BossController (operate on World)
       │    ├─ SpawnDirector, Loadout
       │    └─ core/        ← engine-agnostic primitives
       │         math/, ObjectPool, SpatialHashGrid, EventBus, Rng
       ├─ game/render/      ← GameRenderer (reads World, draws to canvas)
       ├─ game/audio/       ← AudioManager (procedural Web Audio)
       ├─ game/save/        ← SaveManager (localStorage, versioned)
       └─ ui/               ← UIManager (DOM overlays + HUD)
```

**Key boundary:** the simulation (`World`) never touches the DOM or the canvas,
and the renderer/UI never mutate the simulation. They communicate one-way
(render reads sim) or through the typed `EventBus` (sim emits, audio/UI listen).
This keeps the hot path clean and makes the sim unit-testable in plain Node.

---

## The game loop (`engine/GameLoop.ts`)

**Fixed timestep, 60 Hz simulation, with interpolated rendering.**

- Gameplay advances in fixed `1/60 s` slices so behaviour is identical at any
  display refresh rate (60 Hz phone ↔ 144 Hz desktop) and is deterministic.
- An accumulator drains leftover real time; a safety valve caps catch-up steps
  to avoid the "spiral of death" after a tab is backgrounded.
- Rendering runs once per `requestAnimationFrame`. Cosmetic-only systems
  (particles, damage numbers, ambient audio) update on real frame time for
  smoothness; they never affect the simulation.

The **120 FPS target** refers to render/display smoothness; the sim is a fixed
60 Hz. Render work is the budget that must scale, hence pooling + culling.

---

## Performance strategy

1. **Object pooling** (`core/ObjectPool.ts`) for every high-churn entity —
   enemies, projectiles, pickups, particles, damage numbers. No per-frame
   allocation in steady state ⇒ no GC hitches.
2. **Spatial hash grid** (`core/SpatialHashGrid.ts`) rebuilt each step for
   broad-phase collision and nearest-enemy queries. Turns O(n·m) into ~O(n).
3. **Inline `x`/`y` fields** on entities (not Vec2 objects) to avoid pointer
   chasing and allocation in the hot loop.
4. **Swap-and-pop** removal from entity arrays — O(1), no array shifting.
5. **Viewport culling** in the renderer; off-screen entities are skipped.
6. **DPR cap at 2** to bound fill-rate on dense scenes.
7. **Signature-gated DOM updates** — the HUD loadout bar only rebuilds when the
   loadout actually changes, not every frame.

If profiling ever shows Canvas2D fill-rate as the wall, the renderer is isolated
behind `engine/Renderer.ts` + `game/render/GameRenderer.ts` so a WebGL backend
can replace it without touching gameplay. This is the documented escape hatch
(see `docs/TechnicalDebtLog.md`).

---

## Determinism & RNG

All gameplay randomness routes through `core/math/Rng.ts` (seedable mulberry32).
`Math.random()` is only used for cosmetic, non-gameplay jitter (e.g. screen
shake direction). This enables reproducible playtests and the planned
offline-seeded Daily Runs (`Rng.seedFromString(dateString)`).

---

## Data-driven content

Enemies, weapons, and relics are declarative definitions in `game/data/`.
Adding content is editing data, not code — the systems interpret it. New firing
patterns are the only thing that requires a code branch (in `WeaponSystem`).

---

## Events (`core/EventBus.ts`)

A small typed pub/sub. `World` emits gameplay events (`enemyKilled`,
`playerHit`, `levelUp`, …). `Game` wires these to audio, screen shake, and the
HUD. This decouples feel/feedback from simulation.

---

## Boss system

A boss is realised as a normal `Enemy` with `isBoss = true`, but its behaviour
is driven by a `BossController` (one per boss) rather than the generic enemy AI.
The controller is a phase/attack **state machine** that talks to the world only
through a small `BossContext` interface (fire projectile, summon add, read
player position) — so its phase transitions and attack scheduling are unit-
tested in isolation, with no World or DOM. Bosses are immovable (skipped by
knockback and separation), telegraph every attack, and are scheduled by `World`
on a fixed interval.

## Debug hook

Opening the page with `#dev` attaches `window.afterlight` (see `main.ts` →
`Game.getDebugApi()`) exposing helpers like `spawnBoss()`, `addLevel()`,
`giveWeapon(id)` and the live `world`. It is **off by default** and exists purely
to playtest specific situations without grinding to them. Not a gameplay feature;
never enabled in normal play.

## Single-file build & `file://` compatibility

`npm run build:single` must produce an HTML file that runs by **double-clicking
it** — i.e. from a `file://` URL with no server. Two rules make that reliable in
every browser (see `vite.config.ts`, `index.html`, `main.ts`):

1. **Classic IIFE, not an ES module.** Browsers block `<script type="module">`
   over `file://` (module CORS), which silently halts boot. The single build
   bundles as an IIFE and strips `type="module"` from the inlined tag.
2. **Boot on `DOMContentLoaded`.** Classic scripts aren't deferred, so they can
   run before the body is parsed; `main.ts` waits for the DOM either way.
3. A classic **watchdog** in `index.html` surfaces a readable error if boot ever
   fails or stalls — no more silent infinite spinner. (See BUG-002.)

The served `dist/` build (`npm run build`) keeps standard ES modules; this only
applies to the single-file variant.

## Testing

Vitest covers the deterministic core (RNG, pool, spatial grid, math, loadout
drafting, evolution, spawn scaling, boss state machine) and World-level
integration (combat, evolved-weapon firing, boss lifecycle, enemy projectiles)
in a plain Node environment — no browser needed because those modules have no
DOM dependencies. Browser smoke-testing is done via Playwright against the
production build (including the `#dev` hook to verify the boss visually).
