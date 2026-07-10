# VANGUARD

> **Hold the line.**

VANGUARD is an offline, single-player **idle chronicle** set in the
[AFTERLIGHT](../README.md) universe. Where AFTERLIGHT puts you in direct
control of a Warden's starfighter for a fast, twitchy survival run, VANGUARD
steps back: your Vanguard vessel patrols the sectors and fights the Hollow
automatically, around the clock, whether you're watching or not. Spend Light
Motes on ship upgrades, equip and enhance salvaged gear with Alloy, and once
you've pushed deep enough, undergo **Renewal** — a prestige reset that trades
your current run for permanent Afterglow, making every future run faster.

Same universe, same principles as AFTERLIGHT:

- ✅ Single-player • ✅ Fully offline • ✅ Premium quality
- ❌ No multiplayer • ❌ No ads • ❌ No microtransactions
- ❌ No energy systems • ❌ No loot boxes • ❌ No pay-to-win

Everything is unlocked through play, including while you're away — offline
progress is simulated (at a discount) for up to 8 hours every time you
return.

---

## Play

Requirements: a modern browser with WebGL2. No install, no account, no
network.

```bash
npm install               # one-time, from the repo root
npm run dev:idle           # play locally with hot-reload (http://localhost:5174)
```

### One double-clickable file (true offline)

```bash
npm run build:idle:single   # → idle-game/dist-single/index.html
```

A single self-contained HTML file — copy it anywhere and double-click to
open in any modern browser. No server, no install, no network.

### Static multi-file build (for hosting)

```bash
npm run build:idle      # outputs to idle-game/dist/
npm run preview:idle    # serve the production build locally
```

---

## Art direction

VANGUARD is rendered in real **WebGL 3D via Three.js** — genuinely lit
`MeshStandardMaterial`/`MeshPhysicalMaterial` geometry (roughness, metalness,
soft shadows, clearcoat canopies, translucent Hollow domes), not a 2D
approximation. Every hero and Hollow creature is a small chibi rig built
from primitives at runtime (`src/game/render/three/Rig.ts`) — no external
model or texture files, same "no external art assets" principle as
AFTERLIGHT, just applied through a real-time 3D pipeline instead of baked
Canvas2D sprites.

---

## Tech stack

- **TypeScript** (strict) + **Vite**
- **Three.js** for the WebGL battle viewport (chibi PBR rigs, soft lighting,
  a sector-tinted space backdrop)
- Plain DOM + CSS for the idle-game chrome (HUD, tabs, shop/gear/prestige
  panels) — canvas is reserved for the battle scene itself
- **Vitest** for unit tests on the deterministic sim core (economy, combat,
  offline catch-up, gear rolls, save/load)

The sim (`src/game/sim/*`) is pure and framework-free: `simulateTick(state,
dtSeconds, rng)` drives both the live per-frame loop and the offline
fast-forward from a single deterministic function, batching identical kills
so an 8-hour offline return costs *O(waves crossed)*, not *O(enemies
killed)*.

---

## Project commands

Run from the repo root (this is a sibling project to AFTERLIGHT sharing its
`node_modules`):

| Command | Purpose |
| --- | --- |
| `npm run dev:idle` | Dev server with hot-reload |
| `npm run build:idle` | Typecheck + production build to `idle-game/dist/` |
| `npm run build:idle:single` | Typecheck + single-file build to `idle-game/dist-single/` |
| `npm run preview:idle` | Serve the production build |
| `npm run typecheck:idle` | TypeScript checking only |
| `npm run test:idle` | Run the unit test suite (Vitest) |

> Tip for testers: open the game with `#dev` in the URL to expose a debug
> console API at `window.vanguard` (`{ game, scene, ui }`).

---

## License & originality

All code, design, and art direction in this project are original. VANGUARD
shares its setting with AFTERLIGHT (the Vanguard, the Hollow, Light Motes)
but copies no assets or code from any existing game.
