# AFTERLIGHT — Playtest Notes

**Last updated:** 2026-06-28

Observations from playtests, and the actions they drive. Newest first.

## 2026-06-28 — Visual Overhaul v1 + live web hosting

**Method:** User feedback ("don't like the basic graphics… want original
artwork, next level"), plus in-browser screenshots of the new art.

**Observed:**
- The placeholder geometry (hexagons on a flat dotted void) was indeed the
  weakest part. The overhaul transforms the feel: an atmospheric nebula +
  starfield backdrop, characterful creatures (hooded wraith Drifters, etc.), a
  luminous crystal Warden, grounding shadows, vignette, and a glowing spiked-eye
  boss. Reads as a polished, premium game now.
- 60 FPS in headless software rendering with the boss active; no console errors.
- Hosting: after making the repo public + enabling Pages, the game is live at a
  tappable link and plays in mobile Safari. The single-file `file://` route is
  unusable inside the iPhone app's preview, so the hosted URL is now the primary
  way the user plays; deploys auto-publish on push.

**Actions taken:**
- Shipped SpriteForge (baked procedural characters) + Background (atmospheric
  layers) + shadows/vignette/danger-pulse polish.
- Enabled auto-deploy to GitHub Pages so the live link always reflects latest.

**Open questions:**
1. Real-device FPS at high enemy counts (300–900) — needs measurement on phone.
2. Are creature silhouettes readable enough at small sizes during dense swarms?
3. Next visual passes: weapon-specific effects, evolved-weapon signature visuals,
   boss attack telegraph flourishes.

## 2026-06-28 — Critical: single-file wouldn't load + new content

**Method:** User report ("spinning wheel of death" opening the shared file) +
headless Chromium reproduction of the single-file build from `file://`, plus
unit/integration tests for the new weapon and relics.

**Observed:**
- **Boot failure root cause:** the single-file build used `<script type=
  "module">`, which browsers block over `file://` (silent eternal spinner). The
  app's own error handling was inside that module, so nothing surfaced. Chromium
  had been permissive enough to hide it in earlier smoke tests.
- After the fix (classic IIFE + DOM-ready boot + watchdog), the single file
  boots and plays from `file://` with no errors, verified in headless Chromium.
- **Arc Coil (chain lightning)** reads great — a bright cyan bolt that visibly
  leaps between enemies; confirmed it deals damage and emits arcs in-sim.

**Actions taken:**
- Fixed BUG-002 (see BugTracker): classic-script single build, DOM-ready boot,
  non-module watchdog, es2019 target.
- Shipped Arc Coil + Tempest Coil and the Tidal Charm / Echo Stone relics.
- Added `giveWeapon(id)` to the `#dev` debug API.

**Open questions:**
1. Confirm the fixed file loads on the user's actual browser/OS.
2. Is chain falloff (0.88/jump) the right feel, or should chains hit harder?
3. Does Echo Stone (+projectiles, cap 2) over-scale Prism Shards / Nova Pulse?


## 2026-06-28 — M2 First boss + enemy projectiles

**Method:** Browser verification via the new `#dev` debug hook (force-spawn the
boss, inspect live world state) + unit/integration tests for the boss state
machine, enemy projectiles, and boss lifecycle.

**Observed:**
- "The Maw" spawns, renders with bespoke visuals (spiked rotating body, glowing
  eye, menacing aura), and fires readable projectile patterns; the magenta boss
  health bar shows "THE MAW — DEVOURER OF LIGHT" and tracks HP. 5 hostile
  projectiles in flight shortly after the fight begins. No console errors.
- Enemy projectiles read clearly as *hostile* — dark-cored orbs distinct from
  the Warden's bright light. Confirmed they damage the Warden and recycle.
- Boss telegraph (glowing wind-up ring + brighter eye) gives a fair tell before
  each volley; the boss slows while winding up.
- Integration test: boss spawns at the 3:00 interval and cleans up on defeat
  with a generous loot shower.

**Design read (to validate with human play):**
- The 3:00 first-boss timing should land right as a build is taking shape — needs
  human confirmation that HP/duration feel like a "check", not a wall.
- Phase-entry Husk summons add good pressure; watch they don't overwhelm a
  thin build stacked with the boss's bullets.

**Actions taken:**
- Shipped the boss system, Caster (ranged) enemy, enemy projectiles, boss HUD
  bar, audio cues, and screen shake.
- Added the `#dev` debug hook for future playtesting.

**Open questions for next playtest:**
1. Does the first boss feel fair and exciting on a real, un-cheated run?
2. Are Caster bullets readable amid a dense swarm, or do they get lost?
3. Should weapons signal "evolution-ready" in the HUD before the draft?


## 2026-06-28 — M2 Weapon Evolution + draft flow

**Method:** Automated browser playthrough (headless Chromium) of a real run to
the first level-up draft, plus unit + integration tests for evolution.

**Observed:**
- Draft flow works end-to-end: leveling opens the draft (sim freezes), three
  cards render with correct accent colours / kind labels / effect notes, picking
  applies the choice and resumes play. No console errors.
- Evolution logic verified by tests: eligibility (weapon L8 + relic L3), in-place
  replacement, evolved forms excluded from fresh picks, and an available
  evolution is guaranteed into the draft. An evolved weapon fires valid
  projectiles in the live simulation (integration test).
- **XP felt lossy when moving in one direction:** kiting in a wide arc, the
  Warden outran XP shards (they drop behind), so 6 kills yielded 0 collected XP
  in that pattern. A human doubles back, but base generosity was a touch low.

**Actions taken:**
- Base pickup radius 64 → 80 (see BalancingNotes change log).
- Shipped the full Weapon Evolution system (5 pairings) + golden evolution card.

**Open questions for next playtest:**
1. Does an evolution power spike *feel* as triumphant as intended in live play?
2. Is the relic-gate (L3) discoverable, or do players need a hint/telegraph that
   a weapon is "evolution-ready"? (Candidate: mark masterable weapons in the HUD.)
3. With pickup radius 80, does early XP flow feel right without trivialising
   Lodestone?


## 2026-06-28 — v0.1 developer smoke + first-loop review

**Method:** Automated browser smoke test (headless Chromium) plus design
review of the implemented loop against the GDD.

**Observed (smoke test):**
- Boots to the main menu cleanly; "Begin Vigil" starts a run.
- HUD updates correctly (XP bar, level, timer, kills, HP, weapon slot).
- Combat works end-to-end: Lumen Bolt auto-targets the nearest Drifter, deals
  damage (damage number "9" shown), kill registered within 5s.
- No console errors after adding the inline favicon (prior 404 removed).
- Procedural rendering reads clearly: luminous Warden vs. dark hexagonal Hollow.

**Design read (to validate with human play):**
- Early game (0–2 min) may feel slightly sparse with only one weapon — the
  second-weapon draft around L3 should arrive promptly. *Watch first-run pacing.*
- Orbit (Warden's Halo) and Aura (Radiance) give satisfying always-on feedback
  and are good "safety" picks; Nova Pulse's knockback feels impactful for
  crowd control.
- Elite hit-shake + loot burst reads as a satisfying "moment." Good.

**Actions taken:**
- Added inline SVG favicon (removed the only console error).
- Logged BUG-001 (test-only) as resolved.

**Open questions for next playtest (ideally human):**
1. Is the 0–2 min ramp engaging or slow?
2. Does difficulty at ~5 min feel fair given a coherent build?
3. Are draft choices legible and meaningfully different at a glance?
4. Is the swarm readable at high density, or does additive glow wash out?

> Template for future entries: Method · Observed · Design read · Actions ·
> Open questions.
