# AFTERLIGHT — Design Bible

This folder is the **law of record** for AFTERLIGHT's visual + design language.
Sheets arrive from the Studio Lead bit by bit; each is stored here and treated as
canonical.

## Working method (non-negotiable)

1. **Fidelity above all.** When we use imagery from a sheet, we reproduce it
   **exactly** — same shapes, colours, silhouettes. We do **not** re-interpret,
   re-style, or "improve" the designs. Where an asset can be extracted, we
   extract the actual pixels (see `tools/*Sprites.mjs` for the proven pipeline)
   rather than redraw.
2. **Iconography matches the sheets.** In-game icons must match their flash-sheet
   reference (equipment slots, damage types, status effects, hazards, pickups,
   projectiles, ships, enemies, bosses).
3. **The Constitution governs.** Anything that violates §0.3 (below) does not
   ship, no matter how polished.

## Sheets received

| Vol | Title | File | Status |
|-----|-------|------|--------|
| 00  | The Studio Constitution / Flash Sheet — Visual Language Reference | `vol00-constitution.png` | ✅ canonical |
| 01  | Universe Bible — The World of Afterlight / Flash Sheet — Universe Visual Language | `vol01-universe-bible.png` | ✅ canonical |
| 02  | Art Bible — Visual Style & Asset Guidelines / Flash Sheet — Art Style & Asset Language | `vol02-art-bible.png` | ✅ canonical |

Connected volumes (per Vol 01 §1.12 index): 00 Studio Constitution ✅ ·
01 Universe ✅ · 02 Art ✅ · 03 Galaxy · 04 Enemy · 05 Boss · 06 Equipment ·
07 Flash Sheet · 08 Gameplay · 09 System · 10 Technical · 11 Claude Code Manual.

---

## Volume 00 — The Studio Constitution (v1.0, 17/05/2025)

**Purpose.** Afterlight is a rogue-lite survivor game. You pilot a ship of light
against endless waves of enemies from all directions. Shoot. Survive. Collect
Motes. Grow stronger. **Restore Light to the Hundred Galaxies.**

### §0.2 Core Pillars
- **SURVIVE** (pink skull) — Overwhelm. Adapt. Endure.
- **GROW** (green chevrons) — Level up. Evolve. Dominate.
- **COLLECT** (blue diamond/mote) — Motes fuel your power.
- **DESTROY** (orange reticle) — No mercy. Only light.
- **RESTORE** (yellow star) — Return light. Save galaxies.

### §0.3 Non-negotiable rules
**WE NEVER DO:** realistic/complex art · small hard-to-read details ·
photorealism or 3D renders · muted/washed-out colours · visual clutter or noise ·
slow, heavy gameplay · unclear gameplay feedback · anything not fun.

**WE ALWAYS DO:** bold readable silhouettes · hand-drawn, gamey style · neon glow
on dark · instant clarity at 64×64 · fast, addictive gameplay · big feedback,
always · simple to read, hard to forget · **fun above everything**.

### §0.4 Visual Style
Hand-drawn. Bold. Neon. Simplified. Designed for clarity in chaos.
Thick outlines · simple shapes · vibrant neon glow · high contrast ·
readable at 64×64 · expressive and fun.

### §0.5 Gameplay Loop
1. Waves / enemies attack → 2. Shoot / destroy → 3. Collect Motes →
4. Level up / get stronger → (repeat). Fast waves, constant action, every choice
matters, every run is a chance to break your record.

### §0.6 Quality Bar
If it is not instantly readable, it does not ship. If it is not fun, it does not
ship. If it does not feel Afterlight, it does not ship. **Simple. Clear. Impactful.**

### §0.7 Art Style Notes
Cartoon rogue-lite style · hand-painted look · slightly imperfect shapes ·
exaggerated forms · strong personality · not cute, not scary — just gamey ·
designed for mobile first.

### Style DNA
Hand-drawn · bold silhouettes · neon glow · high contrast · simple shapes ·
rogue-lite vibes.

---

## Flash Sheet — Visual Language Reference (all assets 64×64)

The right page catalogues the icon families. Each maps to a live game system that
must be brought into line with the sheet as dedicated bibles arrive:

| Sheet section | Game system | Current state | Action |
|---|---|---|---|
| A. Ship silhouettes | `chassisSprites` (user hull sheets) | user art in style | keep; align new ships to sheet |
| B. Boss silhouettes | `bossRaster` | user art | align to Boss Bible |
| C. Enemy — common | `enemyRaster` | user art | align to Enemy Bible |
| D. Enemy — elite | elite variants | procedural affix rings | align to Enemy Bible |
| E. Projectiles | `drawProjectileShape` / `drawEnemyBulletShape` | procedural inked | match to sheet |
| F. Status effects | buffs/debuffs, elite affixes | partial | build to sheet |
| G. Hazards | biome `Hazard` (lava/ice/…) | 2 procedural | match + extend to sheet set |
| H. Pickups & resources | `pickupRaster` (mote/heart/…) | user art | match to sheet |
| I. Equipment slots | gear slot icons (`gearIcon`) | illustrated | replace with sheet line-icons |
| J. Damage types | weapon/relic damage tags | none yet | introduce per sheet |
| K. Colour palette | UI + VFX palette | ad hoc | lock to sheet swatches |
| L. Correct vs incorrect | QA reference | — | enforce in review |

**Icon families to match (names per sheet):**
- **Equipment slots (I):** Hull · Core · Engine · Wings · Shield · Targeting ·
  Reactor · Drone · Aux · Module.
- **Damage types (J):** Physical · Fire · Ice · Poison · Plasma · Light · Dark ·
  Electric · Explosive · Void.
- **Status effects (F):** Fire · Freeze · Poison · Void-spiral · Target · Shield ·
  Buff (chevrons) · Heal (plus).
- **Hazards (G):** Crystal · Poison pool · Fire · Lightning · Spiral · Spikes ·
  Ice · Slime pool.
- **Pickups (H):** Mote (blue diamond) · Crate · Coin · Heart · Gem · Battery ·
  Star · Magnet.

> As each dedicated sheet lands, extract its exact assets, drop them here, and
> wire them into the mapped system without altering the designs.

---

## Volume 01 — Universe Bible: The World of Afterlight (v1.0, 17/05/2025)

The lore + world canon. Everything the campaign redesign draws from lives here.
Names below are **exact** — the game's copy, factions, resources and celestial
bodies must use these words.

### §1.1 Origin
Long ago, the universe was full of Light. The First Light created all things.
Then came The Darkness. It consumed galaxies. It twisted life. **You are the last
Lightbearer. You fly. You fight. You restore. You are Afterlight.**

### §1.2 The Hundred Galaxies
100 galaxies remain in the dark. Each galaxy holds: **Ancient civilisations ·
Corrupted lifeforms · Lost technology · Light Motes.** Restore the Light. Save
the universe.

### §1.3 The Darkness
The Darkness corrupts and transforms. It creates **twisted enemies, deadly
hazards and void storms.** It feeds on Light. **It fears you.**

### §1.4 The Light
Light is life. Light is power. Collect **Light Motes** from enemies, destroyed
objects and chests. Use Light to level up during a run. Become stronger. Push
further.

### §1.5 Core Gameplay Loop
1. **FIGHT** — Enemies come from all directions. Survive.
2. **DESTROY** — Shoot. Dodge. Stay alive.
3. **COLLECT** — Collect Light Motes and resources.
4. **LEVEL UP** — Choose upgrades. Expand your arsenal.
5. **SURVIVE** — Defeat elites and bosses. Last longer.
6. **PROGRESS** — Restore Light. Unlock more.

*Every run is a new battle. Every choice changes your build.*

### §1.6 Key Tones
Hope in darkness · Desperation · Power through choice · Fast, intense, addictive ·
Simple to learn, hard to master.

### §1.7 Factions (canonical five)
- **The Voidborn** — born of the dark itself (purple).
- **The Rotwalkers** — decay and corruption (toxic green).
- **The Ember Host** — burning fury (red/orange).
- **The Crystal Choir** — cold crystalline order (cyan/ice-blue).
- **The Iron Shroud** — armoured husks / lost machine-kin (steel/grey).

### §1.8 Ancient Technologies
Lost Weapons · Star Engines · Void Relics · Light Reactors · Ancient Drones.

### §1.9 Resources
- **Light Mote** — the core XP/currency (blue diamond).
- **Dark Shard** — dark-aligned crafting resource (violet crystal).
- **Scrap** — common salvage (grey ingot).
- **Nanite Cluster** — tech resource (teal cluster).
- **Void Core** — rare power source (purple orb).
- **Ancient Part** — relic component (bronze cog/part).

### §1.10 Celestial Bodies
Planets · Asteroids · Nebulae · Rift Zones · Void Storms.

### §1.13 Quote
> *"Even one mote of Light can defy the dark."*

---

## Flash Sheet — Universe Visual Language (Vol 01 right page, all assets 64×64)

Same icon families as Vol 00, now shown in-universe. The colour palette (K) is the
**locked swatch set**: violet, indigo, blue, cyan, teal, green (top row); yellow,
amber, orange, red, pink, white (bottom row). Damage-type and faction colours draw
from these.

**Icon families confirmed on Vol 01 (extract exactly as dedicated bibles land):**
- **Equipment slots (I):** Hull · Core · Engine · Wings · Shield · Targeting ·
  Reactor · Drone · Aux · Module.
- **Damage types (J):** Physical · Fire · Ice · Poison · Plasma · Light · Dark ·
  Electric · Explosive · Void.
- **Pickups & resources (H):** Light Mote · Scrap crate · Nanite gear · Heart ·
  Void Core · Battery · Star · Magnet (matches §1.9 resource set).

**§1.12 Connected Volumes index (canonical numbering):** 00 Studio Constitution ·
01 Universe Bible · 02 Art Bible · 03 Galaxy Bible · 04 Enemy Bible · 05 Boss
Bible · 06 Equipment Bible · 07 Flash Sheet Bible · 08 Gameplay Bible · 09 System
Bible · 10 Technical Bible · 11 Claude Code Manual.

---

## Volume 02 — Art Bible: Visual Style & Asset Guidelines (v1.0, 17/05/2025)

The **how-to-draw** law. Every asset we produce or extract is checked against this.

### §2.1 Art Style Overview
Afterlight uses a bold, hand-drawn rogue-lite style. Simple shapes, strong
silhouettes, and neon glow over dark backgrounds for maximum clarity in chaotic
gameplay.

### §2.2 Style Pillars
- **SIMPLE** — clear shapes, no clutter.
- **BOLD** — strong silhouettes, instant clarity.
- **NEON** — vibrant glow, life in the dark.
- **READABLE** — 64×64 first, always clear.
- **FUN** — expressive, not serious.

### §2.3 Do's & Don'ts
**DO:** simple shapes · strong silhouette language · high contrast & neon glow ·
readable at 64×64 · consistent line weight · stylised, not realistic · exaggerated
forms · clear visual hierarchy.

**DON'T:** overly detailed designs · thin lines or tiny parts · muted/washed-out
colours · complex textures or realism · symmetrical & sterile designs · hard to
read at small size · visual noise & clutter · copy other games directly.

> **Note on "shapes".** The sheet's DO list reads "use simple shapes" and §2.7
> resolves what *kind*: **broken/organic shapes over rigid geometry**, rounded
> corners over sharp. This matches the Studio Lead's standing direction — squiggly,
> organic silhouettes, avoid perfect spheres/rectangles. "Simple" = few clean
> forms, **not** sterile primitives.

### §2.4 Readability Scale (64×64 test)
If it's not clear at 64×64, simplify it. GOOD (clean spiked orb) → OKAY (busier)
→ TOO COMPLEX (simplify). Always test at target size.

### §2.5 Core Colour Philosophy
Neon colours represent energy, life and power. Dark backgrounds represent the void
and danger. Every colour has purpose and contrast. **Limit main colours per asset
to 2–4** for clarity. Palette ramps: **Energy** (violet→pink), **Tech**
(blue→cyan), **Nature** (green→lime), **Fire** (red→amber), **Void** (outlined
purples).

### §2.6 Glow Guide
Soft glow · Medium glow · Hard glow · Pulse glow. Use glow to separate layers and
add life — **don't overdo it.**

### §2.7 Line & Shape Language
Thick outer line for readability · minimal inner detail · rounded corners over
sharp · **broken shapes = more interesting.** (Broken/organic silhouettes preferred
over clean circle/square/triangle.)

### §2.8 Asset Complexity Scale
Detail budget rises with importance: **Resources ★ · Pickups ★★ · Projectiles ★★ ·
Enemies (common) ★★★ · Elite enemies ★★★★ · Bosses ★★★★★.** Keep to the scale —
simplest assets stay simplest.

### §2.10 Guiding line
*"Every asset must feel good to see, instantly understood, and exciting to
collect."* Built for speed, clarity and fun.

The Vol 02 right page repeats the same icon families (A–M) as the reference set,
with **K. Colour Palette (MAIN)** = the locked swatches. No changes to the
families; this volume governs *how* each is rendered, not *which* exist.
