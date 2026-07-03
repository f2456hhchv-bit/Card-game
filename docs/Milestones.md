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
- [x] **Salvage & reroll economy**: dismantle spare cores into **Alloy**, spend it
      to **reroll** an item's affixes — agency over drop RNG.
- [x] **Endless / Ascension mode**: unbounded difficulty ramp every 45s (HP/damage/
      spawn-rate + faster bosses); live ▲ badge, best Ascension tracked in Records.
- [x] **Stage Gauntlet mode**: clear Fade→Ember→Deep on one life (HP carries over,
      boss-kill advances stage with live palette/pool swap); best stages in Records.
- [x] **Boss signatures**: each boss drops a unique equippable relic (one slot,
      themed proc/passive) on first defeat; collect all six for the Warlord
      achievement (now 16 achievements).
- [x] **Weapon pass + new Wardens + Warden mastery**: 3 new weapons & evolutions,
      3 new Wardens, per-Warden mastery levelling (Veteran achievement → 17).

- [x] **Campaign progression** (Galaxies → Sectors): a "clear it, warp onward"
      loop replacing casual stage-select as the primary mode. 10 Sectors/Galaxy,
      slow per-Sector strength ramp, boss Sectors (5 & 10), finite levels with
      clear conditions, a Campaign map + Sector-Cleared flow, and **endless**
      procedurally-generated Galaxies beyond the 5 authored ones.
- [x] **Shop mote sinks**: infinite Supply Drop crate + 5 Tier-II upgrades.
- [x] **Three build ecosystems** (Commanders · Ships · Gear): the run is now shaped
      by three independent, growable layers.
  - **Commanders** (renamed from Wardens): pilots with a perk + an **activated
    special power** on a cooldown (Space / on-screen button) — nova, heal,
    empower, dash, guard.
  - **Ships (Chassis)**: a selectable hull — Skiff (free), Scout Shuttle, Warpstrike,
    Dreadnought, Gunship, Carrier, Bulwark — each with a stat identity and a passive
    **hull special** (magnet pulse / phase / drone volley / thorns). New "Ships" tab.
  - **Gear**: 12 sets × **6 ship parts** (Hull/Core/Engines/Wings/Shield/Targeting)
    = 72 items, with 2pc/4pc/**6pc capstone** set bonuses.
- [x] **Equipment expansion**: gear roster doubled to **12 sets / 48 items** — new
      sets **Vanguard** (offense), **Warp** (projectile speed/area), **Harvester**
      (XP/pickup greed), **Juggernaut** (bruiser), **Corona** (Overdrive/AoE) and
      **Phantom** (evasion) — each with distinct 2pc/4pc bonuses. Affix pool grown
      to 13 (added Projectile Speed & Evasion). Everything flows through the drop/
      boss-loot/Supply-Drop/Hangar/achievement systems with no wiring changes.
- [x] **Playtest feedback pass** (v0.3.x): (1) fodder is **throttled during boss
      fights** (halved cap + slower spawns) so adds no longer wall the player off
      from the boss; (2) **late-game bite** — enemy damage gains a quadratic tail
      and elites arrive faster and in pairs past ~14–16 min, fixing "too easy
      after 20 min / lvl 50"; (3) **per-boss signature attacks** (ringGap /
      spiralTwin / aimedSpread / cross / wall) woven into each boss's phase
      rotation so encounters play distinctly, not one shared pattern; (4) an
      in-game **Systems Guide** on the How-to-Play screen explaining Wardens,
      Hangar, Alloy/salvage, Campaign, Endless, Boss Rush, Gauntlet and the Shop.

## ▶ ART UPLIFT — IN PROGRESS (permanent standard, see docs/ArtDirection.md)
Visual quality is now a primary success criterion. Working toward Survivor.io /
Brotato-tier polish via a procedural+shader rendering pipeline (no external
artist; production-art seam via `ArtManifest`).
- [x] **Art Direction standard** recorded (`docs/ArtDirection.md`) + **Art Manifest**
      seam (`ArtManifest.ts`) tracking every asset's quality tier.
- [x] **Post-processing pipeline**: quarter-res **bloom** + subtle colour grade
      (`PostFx.ts`), toggleable in Settings — game-wide luminous uplift.
- [ ] Per-Warden & per-enemy **unique silhouettes** (manifest flags recolours as
      `placeholder` — REQUIRE production art).
- [~] **Animation state machine** (idle/walk/attack/hit/death) + squash/stretch.
      Started: enemies now **pop (squash-and-stretch)** on every hit — harder on
      crits — easing back over ~0.1s. (Idle bob + directional wobble already in.)
- [~] VFX library (trails, smoke, fire, explosions), unique boss presentations.
      Started: **impact spark bursts** where shots land, **muzzle flashes** in the
      firing direction, and **elemental ambient wisps** — embers rising off fire
      foes (Cinder/Revenant), frost drifting off ice foes (Shard/Colossus) — for
      instant on-field identity. All budget-capped so dense swarms stay cheap.
- [x] **Overlay scroll fix**: tall menus (Hangar) now scroll on phones.
- [x] **Painted pickup gems** (user crystal sheet): XP = cyan light shard, elite/
      boss XP = purple crystal, plus magnet / starburst bomb / heart-flask heal
      (tools/pickupSprites.mjs; procedural fallback intact).
- [x] **Painted small-enemy sprites** (user creature sheets): all 13 fodder
      enemies now use the artist's creatures — drifter/mote/lunger/wisp/spore/
      shard/husk/caster from the inked sheet, seer/cinder/revenant/colossus/
      lancer from the pixel sheet — chroma-flood keyed with per-sprite body
      radii (tools/enemySprites.mjs); SVG art remains the fallback.
- [x] **Campaign wave rework**: every Sector is now a ~5-minute, **ten-wave**
      fight — escalating waves (burst + trickle, per-wave HP/damage/rate mults
      balanced against in-run levelling), 25s auto-advance with an early skip on
      clearing the field, and **wave 10 is the Sector boss** (every Sector ends
      with a boss kill; bosses cycle the Galaxy pool by Sector; milestone
      Sectors field elite bosses). HUD shows Wave N/10 · ☠ BOSS WAVE.
- [x] **Per-chassis in-game ship sprites**: the flown ship is now the selected
      hull's painted design — background flood-keyed to transparency, floaters
      (stars/nebula) culled, rotated nose-up, with per-ship design radii so long
      hulls (Dreadnought/Monolith) render larger and stay readable. Generated by
      tools/shipSprites.mjs; classic warden art remains the fallback.
- [x] **Painted ship card art** (user-supplied card designs): all 9 chassis cards
      now show the artist's ship illustration (cropped via tools/shipCardArt.mjs
      into bundled WebP data-URIs; parametric SVG remains the fallback for any
      future hull without art). The Gunner hull was **renamed Infiltrator** to
      match its card.
- [x] **Painted boss illustrations** (user-supplied artwork, mapped by element):
      The Maw = toothed violet devourer · The Choir = cyan crystal chorus · The
      Pyre = blazing sun · The Forge = molten magma boulder · The Sovereign =
      violet crystal crown · The Rime = ice-spiked sphere · The Nadir = ringed
      deep planet. Cropped/keyed from the artist sheets into bundled WebP
      data-URIs (bossRaster.ts) that override the SVG bosses in AssetManager,
      with the procedural fallback intact.
- [x] **Journey page hand-inked art pass** (to the user's designed artwork): a
      procedural SVG **nebula backdrop** (feTurbulence cyan/magenta wisps), rough
      **stone-slab** panels for stats/Continue/Galaxy cards, an **electric aura**
      on the current Galaxy, inked padlocks (emblem + right-side), cyan dashed
      trail, chunky inked progress pips, and **hand-drawn stroke icons** for the
      tab bar. All original, generated in-code (`src/ui/inkArt.ts`).
- [x] **Main-menu redesign**: bottom **tab bar** (Journey / Play / Wardens /
      Hangar / Shop / More) declutters the main screen, and the hero screen is now
      a scrollable vertical **Galaxy pathway** — each Galaxy an emblem node joined
      by a trailing link, with per-Sector progress pips, locked Galaxies teased
      above, and the current Galaxy centred on open. Tapping a Galaxy opens its
      Sector map.
- [x] **Resumable runs**: leave mid-run (pause / close tab) and pick up exactly
      where you left off via a menu "Continue" button.
- [x] **Light Mote field drops + currency iconography**: Light Motes now drop
      on the battlefield as the painted gold octagon (elites always shed a
      3-Mote purse, fodder rarely sheds 1, bosses shower 6); collected Motes
      bank into a HUD counter and join the end-of-run / Sector-clear payout
      (boosted by Fortune). The gold octagon (Motes) and gold diamond (Alloy)
      from the user's crystal sheet now badge every balance, price button and
      reward stat across the UI in place of the old ✦/⬢ glyphs.
- [x] **Shop redesign to the user's mock**: hand-inked neon card frames
      (`inkFrame` in `src/ui/inkArt.ts`) in each upgrade's accent colour with
      an outer glow, accent-coloured names + Lv counters, gold "Next:" lines,
      full-width MAX/price slab buttons, a gold Supply Drop hero card with a
      price pill, and the balance as a glowing subtitle under LIGHT MOTES.
- [x] **Inked identity on every tab page**: the Journey's designed look now
      covers Crew, Ships, Hangar, Shop, Campaign, How-to-Play, Records and
      Settings — marbled nebula backdrop, the bundled hand-print font,
      ink-gradient page titles, and hand-cut stone-slab plaques (taller slab
      designs for tall cards) behind roster cards, gear sets, equip tiles,
      achievements, how-to rows and the settings sheet.
- [x] **Sector Modifiers**: from Galaxy 2, ~55% of non-boss Sectors carry a
      deterministic rule twist — Solar Winds (+25% enemy speed), Locust Swarm
      (+40% spawns, frailer), Iron Hollow (+35% HP), Unstable Cores (kills
      detonate), Dim Light (−25% XP), Crimson Nebula (elites ×2) — each paying
      ×1.25–1.4 Motes. Announced on the campaign map (inked notice card),
      at launch (toast) and in the HUD wave badge; stable across resume.
- [x] **Elite Affixes**: past Galaxy 2 (or 4 min into survival modes), 60% of
      elites roll a trait telegraphed by a coloured dashed ring — Swift,
      Warded (45% damage shrug), Volatile (death blast), Regenerator,
      Summoner (fodder reinforcements) — and shed a 5-Mote purse instead
      of 3. Toasts across the game also gained honest titles (Supply Drop /
      Sector Modifier / Mastery... instead of always "Achievement Unlocked").
- [x] **Achievements expanded 17 → 38**: slaughter/endurance tiers (Legion
      Ender, Eternal Flame, Paragon), economy + run-events (Prospector, Golden
      Wake, Salvager, Pod Runner, Ringbreaker), campaign journey (Trailblazer
      → Conqueror, Storm Rider), alt modes (Starclimber, Iron Vigil,
      Bossbreaker) and fleet/devotion (Fleet Admiral, Benefactor, Centennial,
      Dreadbane).
- [x] **Supply Pod run-events**: every ~80–115s (first at 55s, paused during
      boss fights) a golden beacon pod drifts in at the field's edge and
      self-destructs after 20s — reach it for a heal, a 4-Mote purse and a fan
      of XP shards. Announced by a "Run Event" toast, blinks its final 5s,
      never magnetised (the trek is the event), and tracked in run stats.
- [x] **Generative music engine + SFX depth pass** (quality-loop: audio was
      the weakest category): master bus gained a soft-knee compressor; music
      bus gained a filtered feedback-delay "space echo". Music is now a real
      generative score — an A-minor pad progression (two detuned triangles per
      chord tone through an intensity-driven lowpass) over a sub-bass root,
      with an arpeggio layer whose density rides battlefield pressure — and a
      darker, faster diminished progression while a boss holds the field
      (setBossMode, wired to boss spawn/defeat/run-start). SFX gained a shared
      white-noise layer: bomb sub-thump + debris, hurt crunch, kill tick, boss
      riser and victory sparkle. Damage numbers ≥10k abbreviate (12.4k).
- [x] **Movement flicker fixed (frame interpolation + turn smoothing)**: the
      60Hz sim now records previous-tick positions for the ship, enemies,
      projectiles and pickups, and the renderer interpolates between ticks
      using the loop's alpha — so 120Hz iPhones no longer double-image while
      scrolling. Camera follow/shake moved to the render loop (display
      refresh rate, tracking the interpolated ship), and the ship now turns
      toward the stick smoothly instead of snapping to every thumb wobble.
- [x] **New flyable ship art** (user hull sheet): all nine chassis re-keyed
      from the top-down sheet via tools/shipSheet.mjs (border-median chroma
      flood, nose-up as authored, geometric-mean radii) — Skiff's green
      arrowhead through Dreadnought's armoured twin-hull.
- [x] **Judder root cause fixed — aim/facing decoupled**: the real cause of
      the reported "flicker" was the WeaponSystem slamming `player.facing` to
      the nearest-enemy angle on every shot; in a swarm the nearest foe flips
      many times a second, whipping the hull's rotation back and forth. Added
      a separate `player.aim` (weapons snap it to the target; projectiles are
      unchanged) so the hull's visual `facing` is driven purely by movement
      (smoothly, holding still when stationary). Measured: hull rotation while
      stationary in a churning ring of foes went from ±π/frame to exactly 0.
      Plus earlier: frame interpolation for 120Hz displays, rAF delta snapping,
      boss prev-position capture, and a visible build stamp on the More page.
- [x] **Boss encounter drama** (quality-loop, presentation): bosses now arrive
      with a cinematic — a hue-tinted vignette wash, an alarm "⚠ WARNING ⚠"
      strip, the boss's painted portrait haloed in its colour, and the name +
      title sweeping in (`UIManager.showBossIntro`, auto-dismiss ~2s). Backed by
      a reusable slow-motion system (`Game.slowmo` — the fixed sim runs on a
      fractional carry, easing back to 1×; reduce-motion safe), a camera
      push-in (`Camera.punchZoom`/`updateZoom`), and a generalised screen flash
      (`UIManager.flashScreen`). Spawn = shake + push-in + held-breath slow-mo;
      death = bigger shake + white blowout + savour slow-mo. Verified in-browser.
- [x] **Game-feel juice pass** (quality-loop): (1) selective **hit-stop** —
      a ~40–50ms near-freeze via the slow-mo system on player hits (throttled
      by iframes) and elite kills, the classic impact punch; boss death keeps
      its longer savour beat. (2) **Damage numbers** rebuilt — pop-in with an
      overshoot ease, size that scales with hit magnitude (log-scaled, so a
      1500 dwarfs a 7), crits glow gold in the hand-print font, and a
      hold-then-fade so they stay readable. Verified in-browser across a spread
      of magnitudes + crits; 163 tests green, zero console errors.
- [x] **Weapon visual identity pass** (quality-loop): projectiles had only
      5 styles and only 'shard' had a real shape, so the 4 'nearest' weapons
      all looked like the same glowing bolt and the 4 'spread' weapons like
      the same diamond. Expanded `ProjectileStyle` to 11 distinct silhouettes
      (bolt streak, dart, lance, spark, orb, shard, crystal, hex, star, arc,
      beam), each with its own render (velocity-oriented where it reads),
      and reassigned weapons so every firing family is visually unique —
      Lumen Bolt=bolt, Seeker Swarm=dart, Sunlance=lance, Hornet Cloud=spark;
      Prism Shards=shard, Frost Fan=crystal, Prismatic Storm=star,
      Permafrost=hex. Verified in-browser; 163 tests, no console errors.
- [ ] Stage modifiers / more Wardens & weapons
- [x] **Visual variety pass** (quality-loop): each Galaxy's sky is now baked
      from a per-id seed (hashSeed), so star + nebula layouts are genuinely
      distinct galaxy-to-galaxy instead of the same sky recoloured; plus a new
      distant-planet parallax layer (`Background.bakeLandmarks`) — 1–3 soft
      gradient planets with a directional rim light and occasional rings, per
      Galaxy, tiled at a slower parallax (0.12 vs stars' 0.25) for real depth.
- [ ] Second stage with distinct enemy pool & palette
- [x] **Statistics screen** (quality-loop): the Records page is now a proper
      stats hub — three titled groups (Lifetime: runs, time played, total/elite
      felled, bosses, damage; Personal Bests: best time, most felled, Galaxy
      reached, Boss Rush/Endless/Gauntlet; Collection: Commanders, Ships, Gear
      Sets, Signatures, Achievements, Light Motes) rendered as inked slab
      tiles with compact number formatting (18.7k / 4.8M), above the existing
      per-stage bests and achievement grid.
- [ ] Expanded achievement set

(See `docs/Roadmap.md` for the longer horizon.)
