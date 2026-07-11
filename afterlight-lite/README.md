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

## Status: placeholder art

There are no image assets yet — everything is drawn from simple vector
shapes, colour-coded per biome. The intended final look is described in the
project brief (Nintendo-inspired stylized 3D, hand-painted, transparent
cut-outs); art will be swapped in via `src/game/render/ArtManifest.ts`
without touching any gameplay code once it's available.

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
| `npm run preview` | Serve the production build |
| `npm run typecheck` | TypeScript checking only |
| `npm run test` | Run the unit test suite (Vitest) |
