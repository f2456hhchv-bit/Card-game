# AFTERLIGHT LITE

A simpler, space-faring companion to [AFTERLIGHT](../README.md) — an endless
top-down bullet-heaven roguelite. Your ship stays fixed at the centre of the
screen; drag (or use WASD) to scroll the galaxy underneath you, fight off
endless escalating waves, and grow stronger between runs.

This is a separate, independent app living alongside the main AFTERLIGHT
project in this repo — its own `package.json`, build, and source tree. It
shares no code with the main app except a handful of copied, theme-agnostic
engine utilities (game loop, camera, input, spatial hash grid, math, RNG).

## Play

```bash
npm install
npm run dev      # http://localhost:5174
```

- **Move**: drag anywhere (virtual joystick) or `WASD` / arrow keys.
- Weapons fire automatically. On level-up, pick one of 3 upgrades. Picking
  the same upgrade a 5th time evolves it into a more powerful "super" form.
- Elites join the fight from wave 4 onward (every other wave), a buffed
  elite headlines every 5th wave as a mini-boss, and a full boss gates every
  10th wave (cycling through all 6 biomes).
- On death, a portion of your light motes carry over to the **Ship
  Workshop** to permanently upgrade your ship's 6 attachment slots (weapon,
  shield, wings, thrusters, hull, cockpit) before your next run.

Append `#dev` to the URL to expose `window.__AL_DEBUG__()`, a small debug
snapshot (screen, wave, hp, xp, motes) for testing.

## Status: art in progress

The 5 ships and the Asteroid Belt enemy trio (grunt/elite/boss) have real
art; everything else still draws from simple vector shapes, colour-coded per
biome, as a placeholder. The intended final look is described in the project
brief (Nintendo-inspired stylized 3D, hand-painted, transparent cut-outs).
Art lives in `src/assets/art/` and is wired in via
`src/game/render/ArtManifest.ts` — dropping in the remaining 5 biomes
(Nebula Drift, Ice Field, Volcanic Moon, Derelict Station, Void Rift) is
just adding files there, no gameplay code changes needed.

## Project layout

```
src/
  engine/         game loop, camera, input, canvas renderer (generic)
  core/           event bus, object pool, spatial hash grid, math, RNG
  game/
    types.ts      content-catalog type definitions
    data/         ships, enemies, elites, bosses, upgrades, attachments
    entities.ts   runtime entity shapes (player, enemy, projectile, ...)
    systems/      AI, weapons, combat, spawn director, leveling, shop, stats
    render/       canvas rendering + placeholder-art / art-manifest
    save/         localStorage persistence
    World.ts      simulation owner, ties the systems together
    Game.ts       screen state machine (ship select / play / shop / ...)
  ui/             DOM overlay screens (ship select, HUD, level-up, shop)
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run build:single` | Typecheck + a single self-contained `dist-single/index.html` (art inlined as data URIs) — double-click to play offline, no server, or share as a standalone file |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | TypeScript checking only |
| `npm run test` | Run the unit test suite (Vitest) |
