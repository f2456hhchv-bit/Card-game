# AFTERLIGHT

> **Hold back the dark.**

AFTERLIGHT is a polished, offline, single-player **bullet-heaven survival
roguelite**. You are a **Warden**, one of the last to carry a fragment of the
world's dying light. The **Hollow** — a swarm of things born from the
encroaching dark — close in from every side. Survive. Grow stronger. Hold the
line for as long as the light allows.

It is built to capture the addictive "just one more run" loop of the genre while
being **entirely original** in its world, mechanics, art, progression, and
naming. No copyrighted assets, characters, music, UI, or code.

---

## Principles

This project is, and will always be:

- ✅ Single-player &nbsp; ✅ Fully offline &nbsp; ✅ Premium quality
- ❌ No multiplayer &nbsp; ❌ No ads &nbsp; ❌ No microtransactions
- ❌ No battle pass &nbsp; ❌ No energy systems &nbsp; ❌ No loot boxes &nbsp; ❌ No pay-to-win

Everything is unlocked through play.

---

## Play

Requirements: a modern browser. No install, no account, no network.

```bash
npm install     # one-time
npm run dev      # play locally with hot-reload (http://localhost:5173)
```

To produce a self-contained, offline build you can open anywhere:

```bash
npm run build    # outputs to dist/ — fully static, runs from file://
npm run preview  # serve the production build locally
```

### Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | `WASD` / Arrow keys | Drag anywhere (virtual joystick) |
| Pause | `Esc` / `P` | Pause button (planned) |

Weapons fire **automatically** — your only job is to move, position, and choose
upgrades. On each level-up you draft one of three offered weapons or relics.

---

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | TypeScript checking only |
| `npm run test` | Run the unit test suite (Vitest) |

---

## Tech stack

- **TypeScript** (strict) for maintainability and strong architecture
- **Vite** for fast dev and a tiny static offline build (~17 KB gzipped JS)
- **HTML5 Canvas 2D** with object pooling and a spatial hash grid for
  high entity counts at a 120 FPS target
- **Web Audio API** for fully procedural, asset-free sound
- **Vitest** for unit tests on the deterministic core

Everything is drawn from primitives — there are **no image, audio, or font
assets** in the repository. The look and sound are generated at runtime.

---

## Documentation

The `docs/` folder is the living source of truth. Start with the
[Game Design Document](docs/GameDesignDocument.md). See also the
[Roadmap](docs/Roadmap.md) and [Milestones](docs/Milestones.md) for what's
built and what's next.

---

## License & originality

All code, design, art direction, and naming in this repository are original to
this project. AFTERLIGHT is inspired by the survival-roguelite genre but copies
no assets or code from any existing game.
