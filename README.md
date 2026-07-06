# AFTERLIGHT

> The galaxy is dark. You carry the light.

A premium top-down 360° space roguelite survivor about **rebuilding civilisation**: every expedition pushes back the dark, every discovery restores hope. Fully playable offline (PWA); online community features arrive later as an optional layer.

**Project governance:** this project is built module-by-module under a design constitution. Start here:

1. `docs/CONSTITUTION.md` — the Master Constitution (supreme authority)
2. `docs/FOUNDATION_LOCK.md` — the locked Foundation Phase (AF-000 → AF-015) and production contract
3. `docs/modules/STATUS.md` — every AF module's status, version, and lock state
4. `docs/CORE_GAMEPLAY.md` — the gameplay framework (AF-016+, current phase)

**Stack:** TypeScript + WebGL (no engine), Vite, Vitest. Hosted free on GitHub Pages. See `docs/TECHNOLOGY_DECISION.md`.

## Development

```bash
npm install     # once
npm run dev     # play the current build locally (http://localhost:5173)
npm test        # run the test suite
npm run build   # typecheck + production build to dist/
```

Dev builds include a debug overlay — press `` ` `` to toggle.

## Player promise

Fair challenge · meaningful progression · respect for your time · complete offline play · no pay-to-win · no energy systems · no artificial retention · accessibility always.
