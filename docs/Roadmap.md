# AFTERLIGHT — Roadmap

**Last updated:** 2026-06-28

High-level direction. Detailed task tracking lives in `docs/Milestones.md`.

## Now (v0.1) — Playable Core ✅ shipped
The vertical slice: a genuinely fun, complete core loop.
- Fixed-step engine, camera, input (keyboard + touch joystick)
- Pooled entities, spatial grid, deterministic RNG
- 5 weapons × 8 levels, 10 relics, level-up drafting
- 5 enemy archetypes + elites, spawn director with scaling & surges
- XP/levels, pickups (XP, heal, magnet, bomb)
- HUD, main menu, pause, draft, game-over, settings
- Procedural audio, save/profile, achievements, records
- Unit tests + browser smoke test

## Next (v0.2) — Depth & Identity (in progress)
- ✅ Weapon **evolution** system (max weapon + paired relic ⇒ evolved form)
- ✅ First **boss** encounter ("The Maw", 3 phases) + enemy projectiles
- ✅ Ranged `shooter` enemy archetype (Caster)
- 2–3 more weapons and relics
- More bosses and enemy archetypes
- On-screen pause button + settings polish for touch
- Tutorial / first-run onboarding

## Now (v0.3) — Meta & Variety (in progress)
- ✅ Light Motes shop (9 permanent meta-upgrades)
- ✅ Unlockable Wardens (4 characters, distinct starter + perk)
- ✅ Second boss (The Choir); bosses alternate by encounter
- ✅ **Daily Run** (offline-seeded from the date, equal footing, daily best)
- Stage modifiers / mutators
- Multiple stages with distinct visuals and enemy pools
- Statistics screen and expanded achievements

## Polish track (continuous)
- Performance profiling pass at high entity counts
- Audio depth (layered ambience, weapon-specific SFX)
- Accessibility: high-contrast mode, colourblind-safe palette audit, remappable
  pause, screen-reader labels on menus
- Visual juice: hit-stop, evolved-weapon signature effects

## Far horizon
- Endless/ascension difficulty tiers
- Optional procedural narrative flavour between runs
- PWA packaging for true installable offline play on mobile
