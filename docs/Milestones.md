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
- [x] Offline-seeded **Daily Run** (fixed daily seed, equal footing, daily best)
- [x] **Records** screen (lifetime stats) + 12 **achievements** with unlock toasts
- [x] Richer end-of-run stats (elites, damage)
- [x] **Ship Gear + Hangar**: a collectable **inventory** of 16 items (4 sets ×
      4 slots), equip one per slot, **merge duplicate cores** to raise item grade,
      and **set bonuses** — a full 4-piece set grants a signature perk (Solaris
      Overdrive, Bastion Aegis revive, Zephyr Salvo, Salvager all-round). Items
      drop at end of run. Guardian sprite redesigned as a **starship**, larger.
- [x] **Second stage — Ember Wastes**: distinct warm palette + enemy pool (adds
      Cinder & Revenant), unlocked by felling a boss; chosen via menu stage chips.
- [x] **Stage-specific bosses**: each stage headlines its own boss pool — Ember
      Wastes adds **The Pyre** (fast Cinder swarm) & **The Forge** (Revenant siege).
- [x] **Two more gear sets**: **Tempest** (crit) & **Nebula** (sustain) — now 6
      sets / 24 collectable items.
- [x] **Boss-kill gear drops**: every boss defeat guarantees a gear salvage, so
      bosses advance set completion (on top of the loot shower).
- [x] **Per-stage difficulty curve**: Ember Wastes runs at ×1.35 enemy/boss
      strength (threat badge on the menu chip) — opt-in, richer salvage, no paywall.
- [x] **Third stage — Hollow Deep** (×1.80): frozen blue palette, Shard & Colossus
      natives, bosses **The Rime** & **The Nadir**; unlocked at 4 lifetime bosses.
- [x] **Set-completion achievements**: Quartermaster (a set), Outfitter (all sets),
      Master Smith (max-grade an item) — checked live after Hangar changes. 15 total.
- [x] **Gear rarity tiers**: every drop rolls Common/Rare/Epic/Legendary (×1.0–×2.1
      stat multiplier); luckier rolls upgrade an item's rarity. Coloured pills in
      the Hangar; a second chase axis atop grade-merging.
- [x] **Boss Rush mode**: endless escalating boss gauntlet (no fodder), unlocked
      after the first boss kill; +15 motes/boss, game-over headlines Bosses.
- [x] **Per-mode records** (per-stage best + Boss Rush best) and **drop pity**
      timers (force a new item / a Rare+ after dry streaks).
- [x] **Gear affixes**: rolled bonus sub-stats, count = rarity tier (0–3), from an
      11-stat pool; a second build-depth axis shown in the Hangar.
- [x] **Overlay scroll fix**: tall menus (Hangar) now scroll on phones.
- [ ] Stage modifiers / more Wardens & weapons
- [ ] Second stage with distinct enemy pool & palette
- [ ] Statistics screen
- [ ] Expanded achievement set

(See `docs/Roadmap.md` for the longer horizon.)
