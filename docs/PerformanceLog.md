# AFTERLIGHT — Performance Log

**Last updated:** 2026-06-28

Tracks performance targets, measurements, and optimisation decisions.

## Targets
- **120 FPS** render target on capable hardware; never below 60 in normal play.
- No GC hitches (steady-state zero allocation in the hot loop).
- Fast load: tiny static bundle, no network at runtime.
- Scalable to high enemy counts (cap currently 900).

## Bundle size (production build, v0.1)
| Asset | Raw | Gzipped |
| --- | --- | --- |
| JS | 54.3 KB | 17.2 KB |
| CSS | 5.9 KB | 1.9 KB |
| HTML | 3.1 KB | 1.3 KB |

No image/audio/font assets — all visuals and sound are procedural.

## Optimisations in place (v0.1)
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
