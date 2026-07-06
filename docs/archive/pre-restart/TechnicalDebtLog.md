# AFTERLIGHT — Technical Debt Log

**Last updated:** 2026-06-28

Honest record of shortcuts and deferred work. Each entry: what, why, impact, and
the intended resolution. Empty is good; documented is acceptable; silent is not.

## Open

### TD-001 — Canvas2D rendering ceiling (accepted, monitored)
- **What:** Rendering uses Canvas2D, not WebGL.
- **Why:** Vastly simpler, zero asset pipeline, approachable, and comfortably
  fast for current entity counts. The right call for v0.1.
- **Impact:** At the highest enemy counts with heavy additive glow, fill-rate
  could eventually cap frame rate.
- **Resolution:** The renderer is isolated behind `engine/Renderer.ts` +
  `game/render/GameRenderer.ts`. If profiling (see PerformanceLog) shows the
  wall, a WebGL backend can be added without touching gameplay. Not needed yet.

### TD-002 — Per-frame gradient allocation for glows
- **What:** Orb/aura glows create `createRadialGradient` objects each frame.
- **Why:** Simplest correct implementation; not yet measured as a problem.
- **Impact:** Minor GC pressure proportional to orb/aura count.
- **Resolution:** Cache gradients keyed by (radius bucket, hue) if profiling
  flags it. Deferred until measured.

### TD-003 — `prefers-reduced-motion` default is sticky-on
- **What:** If the OS requests reduced motion on first run, the setting is forced
  on and can be toggled off, but the OS preference isn't re-checked each launch.
- **Why:** Respect the user's explicit later choice over the OS default.
- **Impact:** Cosmetic edge case only.
- **Resolution:** Revisit when the full accessibility pass lands (M2/polish).

## Resolved
_(none yet)_

## Policy
Introduce debt only when necessary, and log it here **in the same change**. Each
entry must name a concrete resolution path, even if deferred. Review this list at
the start of every milestone.
