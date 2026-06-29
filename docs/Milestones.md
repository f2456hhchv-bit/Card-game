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

## ▶ M2 — Depth & Identity (v0.2) — IN PROGRESS

Goal: the build-defining payoff and a first marquee encounter.

- [x] Weapon evolution system + UI for evolved drafts
- [x] Define evolution pairings (weapon max + specific relic) — 5 pairings
- [x] Evolved forms excluded from normal pool; guaranteed evolution draft card
- [x] Tests for evolution eligibility & application (+ in-sim firing)
- [x] First boss "The Maw": 3 telegraphed phases, summons, HUD health bar
- [x] Ranged `shooter` enemy archetype (Caster) + pooled enemy projectiles
- [x] Boss state-machine tests + enemy-projectile + boss integration tests
- [x] Debug console hook (`#dev`) for playtesting (spawnBoss/addLevel/giveWeapon)
- [~] New content: Arc Coil (chain) weapon + Tempest Coil evolution; Tidal Charm
      and Echo Stone relics. (More weapons/relics still welcome.)
- [x] On-screen pause button (touch) + mobile HUD layout pass (no corner overlap)
- [x] First-run tutorial / control hints (non-blocking coach hints, persisted)
- [x] "How to Play" menu screen (adapts to touch/keyboard)
- [x] Weapon-feel FX: projectile comet trails, evolved signature glints,
      crit sparks, death/elite/boss shockwave rings
- [ ] Touch settings polish
- [x] Update affected catalogues + balancing notes
- [x] **Fix:** single-file build infinite-spinner on `file://` (BUG-002)

**Definition of done:** a run can reach an evolved weapon and a boss fight, both
feel great, docs updated, build + tests green. ✅ Evolution + first boss both
done. Remaining M2: more content (weapons/relics), touch pause, tutorial.

---

## ✅ Visual Overhaul v1 — COMPLETE (within M2)

Goal: replace placeholder geometry with premium, original procedural art.
- [x] SpriteForge: bake detailed characters once → blit (faster + prettier)
- [x] Unique creature designs per archetype + the boss, with baked hit-flash
- [x] Atmospheric Background: nebula + parallax starfield + drifting fog + vignette
- [x] Grounding shadows, light halos, low-HP danger pulse, glow projectiles
- [x] Auto-deploy to GitHub Pages on push (live web link stays current)
- [x] Verified in-browser (no errors, 60 FPS under software rendering)

## ▶ M3 — Meta & Variety (v0.3) — IN PROGRESS
- [x] Light Motes shop: 9 permanent meta-upgrades, persisted, applied each run
- [x] Second boss: **The Choir** (ranged, summons Casters); bosses now alternate
- [x] Unlockable **Wardens** (4 characters, distinct starter weapon + perk)
- [ ] Stage modifiers / more Wardens & weapons
- [ ] Offline-seeded Daily Run
- [ ] Second stage with distinct enemy pool & palette
- [ ] Statistics screen
- [ ] Expanded achievement set

(See `docs/Roadmap.md` for the longer horizon.)
