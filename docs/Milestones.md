# AFTERLIGHT — Milestones

**Last updated:** 2026-06-28

Granular, checkable tasks per milestone. The current milestone is at the top.

---

## ✅ M1 — Playable Core (v0.1) — COMPLETE

Goal: a complete, fun, self-contained core loop that proves the architecture.

### Engine & core
- [x] Project scaffold (TypeScript + Vite + Vitest), strict config
- [x] Fixed-timestep game loop with interpolation & FPS telemetry
- [x] Renderer with high-DPI handling and resize
- [x] Camera with follow + screen shake
- [x] Input: keyboard (WASD/arrows) + virtual touch joystick
- [x] Object pool, spatial hash grid, seedable RNG, typed event bus, math utils

### Gameplay
- [x] Warden with derived stat block & movement, arena bounds
- [x] 5 weapons × 8 levels across 5 firing patterns
- [x] 10 relics (passives) with stat modifiers
- [x] Level-up draft (3 choices, slot caps, recompute stats)
- [x] 5 enemy archetypes (chase/charger/orbiter) + elites
- [x] Spawn director: scaling, surges, elites, soft cap, enemy separation
- [x] XP shards, leveling curve, pickups (xp/heal/magnet/bomb)
- [x] Combat: damage, crit, knockback, contact damage, i-frames, death

### Presentation & systems
- [x] Procedural vector rendering for all entities + additive glow
- [x] Damage numbers, particles, hit-flash, screen shake
- [x] Procedural Web Audio SFX + ambient pulse
- [x] HUD (XP, level, timer, kills, HP, loadout, perf overlay)
- [x] Screens: main menu, pause, draft, game over, settings
- [x] Save profile (versioned), achievements, best-time/kills records
- [x] Accessibility: volumes/mute, shake, reduce-motion, damage-numbers toggle

### Quality
- [x] Typecheck clean, production build green (~17 KB gz JS)
- [x] 34 unit tests passing (core systems)
- [x] Browser smoke test (boots, plays, no console errors)

---

## ▶ M2 — Depth & Identity (v0.2) — NEXT

Goal: the build-defining payoff and a first marquee encounter.

- [ ] Weapon evolution system + UI for evolved drafts
- [ ] Define evolution pairings (weapon max + specific relic)
- [ ] First boss: telegraphed attacks, phases, arena event
- [ ] Ranged `shooter` enemy archetype + enemy projectiles
- [ ] 2–3 new weapons, 2–3 new relics
- [ ] On-screen pause button; touch settings polish
- [ ] First-run tutorial / control hints
- [ ] Tests for evolution eligibility & boss state machine
- [ ] Update all catalogues + balancing notes

**Definition of done:** a run can reach an evolved weapon and a boss fight, both
feel great, docs updated, build + tests green.

---

## M3 — Meta & Variety (v0.3) — PLANNED
- [ ] Light Motes shop + persistent unlocks
- [ ] Offline-seeded Daily Run
- [ ] Second stage with distinct enemy pool & palette
- [ ] Statistics screen
- [ ] Expanded achievement set

(See `docs/Roadmap.md` for the longer horizon.)
