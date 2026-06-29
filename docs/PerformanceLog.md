# AFTERLIGHT — Performance Log

**Last updated:** 2026-06-28

Tracks performance targets, measurements, and optimisation decisions.

## Targets
- **120 FPS** render target on capable hardware; never below 60 in normal play.
- No GC hitches (steady-state zero allocation in the hot loop).
- Fast load: tiny static bundle, no network at runtime.
- Scalable to high enemy counts (cap currently 900).

## Bundle size (production build)
| Build | Asset | Raw | Gzipped |
| --- | --- | --- | --- |
| v0.1 | JS | 54.3 KB | 17.2 KB |
| v0.2 (evolution) | JS | 58.9 KB | 18.4 KB |
| v0.2 (boss) | JS | 68.4 KB | 21.1 KB |
| v0.2 (chain wpn + relics) | JS | 75.9 KB | 22.8 KB |
| v0.2 (visual overhaul) | JS | 85.5 KB | 25.4 KB |
| v0.2 (weapon FX + howto) | JS | 90.6 KB | 26.9 KB |
| v0.3 (motes shop) | JS | 96.9 KB | 28.5 KB |
| v0.3 (boss 2 + wardens) | JS | 101.8 KB | 29.8 KB |
| v0.3 (daily run) | JS | 103.4 KB | 30.2 KB |
| v0.3 | CSS | ~10 KB | ~2.7 KB |
| v0.3 | HTML | 4.9 KB | 2.0 KB |
| v0.3 | single-file HTML | ~106 KB | ~31 KB |

> Single-file build is a classic IIFE (es2019) for `file://` compatibility; the
> served build uses ES modules. See ArchitectureNotes / BUG-002.

No image/audio/font assets — all visuals and sound are procedural.

## Optimisations in place
- **Baked sprites (v0.2):** characters are rendered once to offscreen canvases
  at startup and blitted with `drawImage`, which is cheaper than the previous
  per-frame vector path drawing *and* allows far more detail. The background is
  similarly a baked tile, drawn with wrap + parallax. Net effect: prettier with
  equal-or-lower per-frame cost.
- Object pooling for all high-churn entities (no per-frame allocation).
- Spatial hash grid (cell 96px) rebuilt per step for broad-phase queries.
- Swap-and-pop array removal (O(1)).
- Viewport culling for enemies and pickups.
- DPR capped at 2.
- Inline `x`/`y` entity fields (no Vec2 allocation in the loop).
- Enemy separation capped at 6 neighbour nudges per enemy per step.
- HUD loadout bar rebuilt only on loadout change (signature-gated).
- Additive-blend batching by composite-op group in the renderer.

## Measurements
| Date | Build | Scenario | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-06-28 | v0.1 | Boot + 5s play, headless Chromium (swiftshader) | Boots clean, no console errors, combat verified | Smoke test; software GL, not a perf number. |

> **TODO (M2):** capture real FPS at 300 / 600 / 900 enemies on representative
> hardware and record here. Add a scripted stress scene that fast-forwards the
> spawn director to high density for repeatable measurement.

## Watch list / potential future work
- Canvas2D fill-rate at 900 enemies with many additive glows is the most likely
  first wall. Mitigation path documented in TechnicalDebtLog (WebGL backend
  behind the existing renderer boundary).
- Radial gradients per orb/aura per frame allocate gradient objects — candidate
  for caching if profiling flags it.
- Particle counts on elite death bursts during surges — cap if needed.
