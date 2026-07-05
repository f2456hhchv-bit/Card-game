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
| 03  | Galaxy Bible — Structure & Design Framework / Flash Sheet — Galaxy Visual Language | `vol03-galaxy-bible.png` | ✅ canonical |
| 04  | Enemy Bible — Enemy Design Language & Silhouette Guide / Flash Sheet — Enemy Visual Language | `vol04-enemy-bible.png` | ✅ canonical |
| 05  | Boss Bible — Boss Design Language & Silhouette Guide / Flash Sheet — Boss Visual Language | `vol05-boss-bible.png` | ✅ canonical |
| 06  | Environment & Obstacles Bible — Hazards, Terrain & Interactive Objects / Flash Sheet — Environment & Obstacle Visual | `vol06-environment-obstacles-bible.png` | ✅ canonical |
| 07  | Items & Powerups Bible — Pickups, Upgrades & Gameplay Resources / Flash Sheet — Enemy & Boss Silhouettes | `vol07-items-powerups-bible.png` | ✅ canonical |
| 08  | Weapons & Projectiles Bible — Weapons, Projectiles & Combat FX Guide / Flash Sheet — Weapons, Projectiles & Combat FX | `vol08-weapons-projectiles-bible.png` | ✅ canonical |
| 09  | Enemies & Hazards Bible — Advanced Foes, Traps & World Threats / Flash Sheet — Enemies, Hazards & Threats | `vol09-enemies-hazards-bible.png` | ✅ canonical |
| 10  | Dungeons & Biomes Bible — Environments, Rooms & Visual Themes / Flash Sheet — Dungeons, Rooms & Environments | `vol10-dungeons-biomes-bible.png` | ✅ canonical |
| 11  | Traps & Mechanics Bible — Hazards, Triggers & Environmental Mechanics / Flash Sheet — Traps, Mechanics & Interactables | `vol11-traps-mechanics-bible.png` | ✅ canonical |
| 12  | Artifacts & Specials Bible — Unique Relics, Active Skills & Ultimate Powers / Flash Sheet — Artifacts, Actives & Specials | `vol12-artifacts-specials-bible.png` | ✅ canonical |
| 13  | Power-ups & Consumables Bible — Buffs, Potions & Utility Items / Flash Sheet — Power-ups, Consumables & Progression | `vol13-powerups-consumables-bible.png` | ✅ canonical |
| 13* | Power-ups & Consumables Bible (revised standalone — Global/Combat/Support power-ups) | `vol13-powerups-consumables-rev.png` | ✅ canonical (v2 series) |
| 13–15 | Power-ups / Status Effects / Factions (3-in-1 composite) | `vol13-15-powerups-status-factions.png` | ✅ canonical (v2 series) |
| 16  | Ships & Ship Classes Bible — Playable Ships, Classes & Design Language | `vol16-ships-classes-bible.png` | ✅ canonical (v2 series) |
| 17  | Weapon Bible — All Weapons, Upgrades & Signature Archetypes | `vol17-weapon-bible.png` | ✅ canonical (v2 series) |
| 18  | Equipment Bible — Hulls · Engines · Wings · Shields · Cores · Systems | `vol18-equipment-bible.png` | ✅ canonical (v2 series) |
| 19  | Projectile & VFX Bible — All Weapon Projectiles, Impacts & Visual Effects | `vol19-projectile-vfx-bible.png` | ✅ canonical (v2 series) |
| 20  | UI & HUD Bible — User Interface · HUD · Menus · Feedback | `vol20-ui-hud-bible.png` | ✅ canonical (v2 series) |
| 20* | Hazards & Environment Bible — Environmental Hazards, Traps & Level Elements (number collision on sheet) | `vol20-hazards-environment-bible.png` | ✅ canonical (v2 series) |
| 21  | Galaxy Bible — One Hundred Galaxies, Endless Discovery (campaign map) | `vol21-galaxy-bible.png` | ✅ canonical (v2 series) |
| 22  | Enemy Production Bible — Types · Roles · Parts · Variations · Factions | `vol22-enemy-production-bible.png` | ✅ canonical (v2 series) |
| 23  | Boss Production Bible — Types · Stages · Attack Patterns · Rewards | `vol23-boss-production-bible.png` | ✅ canonical (v2 series) |
| 24  | Power & Progression Bible — Systems · Resources · Upgrades · Mastery | `vol24-power-progression-bible.png` | ✅ canonical (v2 series) |
| 25  | Items Bible — Gear · Modules · Rarity · Affixes · Crafting | `vol25-items-bible.png` | ✅ canonical (v2 series) |

Connected volumes (per Vol 01 §1.12 index): 00 Studio Constitution ✅ ·
01 Universe ✅ · 02 Art ✅ · 03 Galaxy ✅ · 04 Enemy ✅ · 05 Boss ✅ ·
06 Environment & Obstacles ✅ · 07 Items & Powerups ✅ · 08 Weapons & Projectiles ✅ ·
09 Enemies & Hazards ✅ · 10 Dungeons & Biomes ✅ · 11 Traps & Mechanics ✅ ·
12 Artifacts & Specials ✅ · 13 Power-ups & Consumables ✅ (12–13 beyond the
original index).

> **Two series.** Volumes 00–13 are the **original one-per-sheet series**. Volumes
> **13–25 are a later, higher-production "v2" series** (richer, production-oriented,
> some sheets composite multiple volumes). The v2 series **renumbers over 13** and
> even collides internally (two Volume 20s: UI & HUD, and Hazards & Environment).
> Both are kept as canon; where they overlap, the **v2 production sheets are the
> more detailed reference** and the campaign redesign should follow them. Sheets are
> always the source of truth over any index label.

> **Delivered set (00–12).** All twelve volumes named in the Vol 01 §1.12 index have
> landed, **plus Volume 12 (Artifacts & Specials) which extends past the original
> index.** Delivered titles superseded two index labels (06 = Environment &
> Obstacles, 11 = Traps & Mechanics) — sheets are the source of truth. Equipment
> content (indexed at 06) has not arrived as its own sheet; equipment-slot
> iconography lives on the Vol 00/01 flash sheets (family I).

> **Numbering note:** the delivered Vol 06 is the **Environment & Obstacles Bible**;
> Vol 01's §1.12 index had listed slot 06 as "Equipment Bible". Sheets are the
> source of truth, so we follow the delivered title. Equipment content may arrive
> under a later/renumbered volume.

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

---

## Volume 03 — Galaxy Bible: Structure & Design Framework (v1.0, 17/05/2025)

The campaign spine. **A galaxy is the unit of the campaign** — each is a self-
contained world (biome + faction + hazard + resource + boss) the Lightbearer
cleanses. This is the template the whole campaign redesign is built on.

### §3.1 Purpose
Galaxies are the worlds of Afterlight. Each galaxy has a story, a biome,
inhabitants, enemies and treasures. You bring Light. You cleanse the Dark. You
restore what was lost.

### §3.2 Galaxy Elements (every galaxy = a unique combination)
**Biome · Faction · Hazard · Resource · Boss.**

### §3.3 Galaxy Design Rules
Unique theme & visual identity · readable at a glance · distinct enemy ecosystem ·
clear biome hazards · signature resource (light-mote type) · memorable boss ·
restoration objective · fun, fast, replayable.

### §3.4 Galaxy Difficulty Tiers (named)
1. **Awakening** — Easy (green)
2. **Rising** — Normal (blue)
3. **Ascended** — Hard (purple)
4. **Corrupted** — Very Hard (orange)
5. **Forgotten** — Extreme (red)

Difficulty affects enemy strength, density, elite chance and reward quality.

### §3.5 Galaxy Flow
**Arrive** (enter the galaxy) → **Survive** (waves attack from all sides) →
**Collect** (gather Light Motes) → **Level Up** (choose upgrades, grow stronger) →
**Boss** (defeat the boss) → **Restore** (bring Light back). Repeat. Improve.
Survive longer. Cleanse the darkness.

### §3.6 Light Restoration
As the boss falls, the galaxy is cleansed and Light returns. Restoration stages:
**0% → 25% → 50% → 75% → 100%** (dark crystal brightening to a blazing star).

### §3.7 Galaxy Template — worked example: **VOIDUST WASTES** (Corrupted Mining World)
- **Biome:** Abyssal Asteroid Field
- **Faction:** The Voidborn Scourge
- **Hazards:** Void Storms
- **Resource:** Void Shard
- **Boss:** The Core Devourer
- **Signature mechanic:** Void Rifts spawn enemies continuously.
- **Restoration goal:** Stabilise the Core and seal the Void.
- **Description:** A once-prosperous mining world consumed by the Void.

*This is the shape every galaxy definition must take: name + one-line world type +
the five elements + a signature mechanic + a restoration goal.*

### §3.8 Galaxy Naming Rules
Short & impactful (2–4 words) · sci-fi / fantasy / cosmic themes · should feel
alien & unique · avoid real-world names. Examples: *"Xylaris Reach", "The Obsidian
Drift", "Nyx Cradle".*

---

## Flash Sheet — Galaxy Visual Language (Vol 03 right page, all assets 64×64)

New icon families this volume introduces (extract exactly as dedicated bibles land):

- **A. Biome icons:** Asteroid · Ice · Volcanic · Toxic · Void · Ancient ·
  Mechanical/Biogenic.
- **B. Faction crests:** Voidborn · Ashen · Crystalline · Swarm · Machine · Feral ·
  Celestial · Exiled. *(Crest visual language — a superset of Vol 01's five named
  factions; Voidborn & Crystalline/Crystal-Choir carry over.)*
- **C. Environment hazards:** Void Rift · Fire Storm · Ice Shards · Acid Pool ·
  Lightning · Meteor · Gravity Well · Laser Grid.
- **D. Signature resources:** Light Mote · Void Shard · Star Core · Crystal · Bio
  Sphere · Nano Core · Sol Ember · Dark Ether.
- **E/F. Enemy silhouettes** (common ★★★ / elite ★★★★) and **G. Boss silhouettes**
  (★★★★★) — faction-tinted variants.
- **H. Galaxy crests** — per-galaxy emblem shields.
- **I. Light restoration stages** — 0/25/50/75/100% crystal→star.
- **M. Asset complexity scale:** Bosses ★★★★★ · Elite ★★★★ · Common ★★★ ·
  Items/Pickups ★★ · Resources ★.

> **Campaign mapping.** Our three live stages (The Fade, Ember Wastes, Hollow Deep)
> become **galaxies** under this framework. The redesign will express each as a
> full §3.7 template (biome + faction + hazard + resource + boss + signature
> mechanic + restoration goal) and slot new galaxies along the §3.4 tier ladder
> (Awakening → Forgotten). Hazard set expands from the current 2 (lava/ice) toward
> the §C set (Void Rift, Gravity Well, Laser Grid, …).

---

## Volume 04 — Enemy Bible: Enemy Design Language & Silhouette Guide (v1.0, 17/05/2025)

The law for **how enemies read**. Governs our `enemyRaster` roster, elite variants,
spawners and special enemies.

### §4.1 Purpose
Enemies come in waves. You survive, you adapt, you grow. **Clarity at a glance is
everything.** Strong silhouette. Simple shape. Instant threat read.

### §4.2 Design Pillars
**CLEAR** (instantly recognisable) · **FAST READ** (readable at 64×64) · **SIMPLE**
(bold shapes) · **THREAT** (communicates danger) · **VARIETY** (many types, few
rules).

### §4.3 Silhouette Rules
Big shapes over detail · no thin limbs or tiny parts · **outer shape = identity,
inner shape = flavour** · readable at small size · strong contrast · distinct from
other enemies. *Bad examples: skeletal spiders, thin winged wisps, tentacled
horrors — too fine/limby to read.*

### §4.4 Threat Readability
Colour, shape and animation communicate threat. **Higher tier = bigger shape,
brighter accents, stronger silhouette.** Low → high threat: Common → Elite → Rare →
Boss.

### §4.5 Size Language
Size communicates importance — Common (small) → Elite → Rare → Boss (largest).

### §4.6 Movement Language
**Straight · Swoop · Zig-Zag · Homing · Spawner · Orbiter.**

### §4.7 Attack Language
**Shoot · Burst · Beam · Explode · Charge · Split.**

### §4.8 Colour Coding Guide
- **Neutral/Common** — teal
- **Elite** — purple
- **Rare** — orange
- **Boss** — red
- **Hazard/Spawner** — deep red/orange

### §4.9 Animation Guidelines
Snappy, not floaty · anticipate before attack · impact on hit/death · no long
wind-ups · keep it readable.

### §4.10 Complexity Scale (M, guide for all future enemy design)
**Common ★ · Elite ★★ · Rare ★★★ · Boss (red, top) · Spawner ★★★.**

---

## Flash Sheet — Enemy Visual Language (Vol 04 right page, all assets 64×64)

Enemy taxonomy (each a family of faction-tinted variants — extract exactly as the
roster is rebuilt):

- **A. Common enemies** · **B. Elite enemies** · **C. Rare enemies** ·
  **D. Boss enemies** · **E. Spawners & Summoners** · **F. Special enemies**
  (gravity/lightning/triangle-sentry/orbital/dasher forms).
- **G. Projectiles (shot types)** · **H. Death / Impact FX** · **I. Size comparison**
  (Player · Common · Elite · Rare · Boss).
- **L. Colour palette (enemy families)** — the per-family tint set behind §4.8.

> **Roster mapping.** Our Hollow bestiary (drifter, mote, husk, lunger, wisp,
> caster, spore, seer, lancer, cinder, revenant, shard, colossus …) re-sorts into
> Common/Elite/Rare/Boss tiers by §4.5 size + §4.8 colour, with movement/attack
> tagged from §4.6/§4.7. Silhouettes must satisfy §4.3 (outer=identity, no thin
> limbs) — the "bad examples" (thin spiders/wisps) are exactly the reads to avoid.

---

## Volume 05 — Boss Bible: Boss Design Language & Silhouette Guide (v1.0, 17/05/2025)

The law for **apex threats**. Directly governs the boss roster + the attack-pattern
rework (the Studio Lead's earlier "bosses too samey, bullets all the same" note is
answered here — bosses differentiate by **colour class**, **size tier**,
**attack-pattern vocabulary** and **phase evolution**).

### §5.1 Purpose
Bosses are apex threats. They test your build, movement and mastery. Each boss has
a clear silhouette, behaviour identity and attack pattern. Survive. Adapt. Overcome.

### §5.2 Boss Design Pillars
**SILHOUETTE** (instantly recognisable) · **READABILITY** (clear attacks & states) ·
**THREAT** (feels dangerous) · **VARIETY** (unique mechanics) · **MEMORABLE**
(stands out and sticks).

### §5.3 Boss Silhouette Rules
Large, bold, clear shape · distinct from enemy silhouettes · strong centre of focus ·
readable at small size · uses exaggerated features · avoid clutter and thin parts ·
**make it feel powerful.**

### §5.4 Boss Size Language (relative to player)
**Mini Boss → Mid Boss → Major Boss → Ancient Boss → Mythic Boss** (each markedly
larger than the last; all dwarf the player).

### §5.5 Colour Language (dominant colour = identity, six classes)
- **VOID** — purple
- **INFERNAL** — red
- **TOXIC** — green
- **CRYSTAL** — ice-blue
- **STORM** — cyan
- **CELESTIAL** — gold

### §5.6 Attack Pattern Language
**Spread · Spin · Beam · Dash · Summon · Ring · Barrage · Wave.** (Each boss owns a
signature subset — this is the vocabulary that fixes "all attacks feel the same".)

### §5.7 Phase System
Bosses escalate over time: **Phase 1 → Phase 2 → Phase 3**, gaining new attacks,
speed and difficulty as they go.

### §5.8 Tell & React
Every boss **telegraphs before it attacks**: **Tell → Attack → Gap.** Learn. React.
Survive. (The recovery Gap is the player's window.)

---

## Flash Sheet — Boss Visual Language (Vol 05 right page, all assets 64×64)

- **Boss classes (A–F):** Void · Infernal · Toxic · Crystal · Storm · Celestial —
  each a family of five silhouettes.
- **G. Attack examples (top-down):** Spread · Beam · Spin · Dash · Summon · Wave.
- **H. Phase evolution:** the same boss visibly upgraded across Phase 1→2→3.
- **J. Energy signatures** (boss auras / tells) · **K. Scale guide** (boss aura /
  projectile glow scaling by size tier) · **L. Colour palette (boss themes)** — the
  per-class swatch ramps.

> **Boss mapping.** Existing bosses sort into §5.5 colour classes and adopt a §5.6
> signature attack subset + §5.7 three-phase escalation: e.g. **The Pyre/The Forge**
> = Infernal; **The Rime/The Nadir** = Crystal/Void; **The Maw/The Choir/The
> Sovereign** = Void/Celestial. Projectile shapes follow §5.6 patterns and the
> rough-organic bullet direction already applied — every class visually distinct via
> §J energy signature + §L palette. Tell→Attack→Gap (§5.8) is the readability
> contract for every telegraph.

---

## Volume 06 — Environment & Obstacles Bible: Hazards, Terrain & Interactive Objects (v1.0)

The law for **the arena itself**. Governs the biome/`Hazard` system, plus terrain,
destructibles and interactive objects (much of this is *new* systems to build).

### §6.1 Purpose
The environment shapes the battle. Hazards create tension, terrain adds variation,
and interactables reward risk and exploration.

### §6.2 Hazard Types (12)
**Spikes · Lava · Acid · Electric · Fire · Ice · Void · Meteor · Laser · Gravity ·
Toxic · Explosive.** *(Live today: Lava = lavaVent, Ice = iceRift. The rest are the
expansion set — Void well already stubbed in `Hazard.ts`.)*

### §6.3 Terrain Types (8)
**Rock · Metal · Crystal · Organic · Ice · Volcanic · Toxic · Void.** Terrain tiles
theme the floor per biome.

### §6.4 Interactive Objects (6)
**Barrel · Crate · Power Node · Health Station · Teleporter · Safe Zone.** Risk/
reward interactables — new interactable layer.

### §6.5 Obstacle Silhouettes
Large blocking forms — crystal clusters, skull rocks, dead trees, pillars, boulders
— bold silhouettes, no thin parts (per Art Bible).

### §6.6 Destructible Objects
Barrels, crates, power nodes, crystal/rock/organic clusters that **break on hit**
and drop pickups (see §6.6/§F destructible variants: intact → hit → shattered).

### §6.7 Environment Theme Colours (5 themes)
- **Void Realm** — purple
- **Volcanic Wastes** — red/orange
- **Toxic Depths** — green
- **Frozen Wastes** — ice-blue
- **Mechanical Core** — steel/cyan

### §6.8 Visual Readability Guidelines
High contrast between hazards and safe areas · strong silhouette language · clear
glow for all critical elements · avoid mid-tone clutter · readable at 64×64.

---

## Flash Sheet — Environment & Obstacle Visual Language (Vol 06 right page, 64×64)

- **A. Hazards** (the §6.2 set, animated states) · **B. Terrain tiles** (§6.3
  themed floors) · **C. Interactive objects** (§6.4) · **D. Environment props** ·
  **E. Obstacles (large)** · **F. Destructible variants** (intact→break→shatter).
- **G. Environment theme preview:** Void Realm · Volcanic Wastes · Toxic Depths ·
  Frozen Wastes · Mechanical Core — the five biome looks.
- **H. Depth & layering guide:** background → foreground (parallax read).

> **Environment mapping.** The §6.7 five themes align with the galaxy biomes
> (Vol 03 §A). Ember Wastes = Volcanic Wastes, Hollow Deep = Frozen Wastes, plus
> new Void Realm / Toxic Depths / Mechanical Core galaxies. Our `Hazard` lifecycle
> (telegraph→active→fade) is the backbone for the full §6.2 hazard set; §6.4
> interactables (crates, power nodes, health stations) and §6.6 destructibles are
> **new arena layers** to add — each drops pickups/resources per the Universe Bible.

---

## Volume 07 — Items & Powerups Bible: Pickups, Upgrades & Gameplay Resources (v1.0)

The law for **the reward economy** — every pickup, upgrade, powerup, relic, chest,
mote tier and shop icon. Maps onto our in-run upgrade draft, relics, meta shop and
pickup roster.

### §7.1 Purpose
Collect, adapt, grow. Items and powerups fuel temporary strength and build unique
runs. Every choice matters. Risk. Reward. Evolve.

### §7.2 Currency & Motes (rarity ladder — used to level up & upgrade weapons)
- **Light Mote** — Common (blue diamond)
- **Nova Mote** — Uncommon (green)
- **Star Mote** — Rare (cyan)
- **Void Mote** — Epic (purple)
- **Chaos Mote** — Legendary (orange)
- **Boss Mote** — Boss Only (ringed/saturn)

### §7.3 Hearts & Shields
**Health** (restores HP) · **Shield** (adds barrier) · **Max HP** (increase max) ·
**Armor** (reduces dmg).

### §7.4 Powerups (temporary)
Attack Up (+damage) · Fire Rate Up · Speed Up (+movement) · Crit Chance (+crit%) ·
Damage Aura (area) · XP Boost · Magnet (pulls motes) · Revive Chance (one extra
life) · Dodge (+evade) · Invulnerable (brief immunity).

### §7.5 Weapon Upgrades (in-run)
**Piercing** (bullets pass through) · **Bounce** (projectiles bounce) · **Split**
(shots split in two) · **Chain** (jumps between enemies) · **Explosive** (on-hit
explode).

### §7.6 Evolution Tokens (evolve weapons into stronger forms — rarity)
Common · Uncommon · Rare · Epic · Legendary.

### §7.7 Chests & Rewards
**Common · Rare · Epic · Legendary · Cursed** chest (Cursed = high risk/reward).

### §7.8 Relics (passive bonuses)
Permanent passive effects **that stack**.

### §7.9 Reroll & Banish
**Reroll** (new choices) · **Banish** (remove an option permanently).

### §7.10 Shop Icons
**Weapon · Upgrade · Powerup · Relic.**

---

## Flash Sheet — Enemy & Boss Silhouettes (Vol 07 right page, 64×64)

*(The Vol 07 flash sheet doubles as an expanded enemy/boss silhouette reference.)*

- **A. Swarm enemies (common)** · **B. Ranged enemies** · **C. Charger enemies** ·
  **D. Elite enemies** · **E. Summoners & Support** · **F. Hazard creatures
  (environmental)**.
- **G. Boss silhouettes (named examples):** **Void Behemoth · Lava Colossus ·
  Toxic Harvester · Storm Wraith · Star Devourer** — one flagship boss per §5.5
  colour class (Void/Infernal/Toxic/Storm/Celestial).
- **H. Size comparison:** Player 1× · Swarm 1.5× · Elite 2.5× · Mini Boss 4× ·
  Boss 8×+.
- **I. Threat colours (at a glance):** Low (teal, Easy) · Moderate (green, Normal) ·
  High (purple, Hard) · Extreme (orange, Very Hard) · Lethal (red, Boss).

> **Economy mapping.** Our in-run upgrade draft = §7.4 powerups + §7.5 weapon
> upgrades; relics = §7.8; chests/reward tiers = §7.7; reroll/banish already exist
> and follow §7.9 icons. The mote rarity ladder (§7.2) formalises XP/currency tiers
> and pairs with §7.6 evolution tokens for a weapon-evolution path. Named bosses in
> §G give canonical archetype names per colour class to align our boss roster to.

---

## Volume 08 — Weapons & Projectiles Bible: Weapons, Projectiles & Combat FX (v1.0)

The law for **the player's arsenal and every bullet/FX on screen**. Directly governs
`drawProjectileShape` / `drawEnemyBulletShape`, weapon defs, and impact FX (answers
the earlier "rough-organic bullet iconography per boss/class" direction with a full
element+behaviour system).

### §8.1 Purpose
Weapons are extensions of the Light. Projectiles carry intent. FX communicate
impact. Clarity sells power. **Readability wins.**

### §8.2 Weapon Rarities (defines power, complexity, glow intensity)
Common (grey) · Uncommon (green) · Rare (blue) · Epic (purple) · Legendary (orange) ·
Mythic (pink).

### §8.3 Weapon Types
**Sidearm · Shotgun · Rifle · Launcher · Staff · Melee.**

### §8.4 Projectile Elements (8)
**Physical · Fire · Ice · Electric · Toxic · Void · Light · Gravity.** *(Element =
the projectile's colour + FX language; see §J palette.)*

### §8.5 Projectile Behaviours
**Straight · Homing · Bounce · Piercing · Split · Chain · Explode · Orbit.** (Aligns
with §7.5 weapon upgrades.)

### §8.6 Weapon Modifiers
Fire Rate+ · Damage+ · Crit Chance · Piercing+ · Life Steal · Knockback · Split
Shot · Bounce+.

### §8.7 Status Effects (applied by weapons)
**Burn · Freeze · Shock · Poison · Slow · Bleed · Weaken.**

### §8.8 Impact FX Intensity Guide
**Match FX to weapon rarity/power** — Common (small spark) → Mythic (huge burst).
Bigger rarity = bigger, brighter impact.

### §8.10 Contrast & Readability
High contrast between weapon and background · clear projectile silhouette at all
sizes · strong glow without obscuring gameplay · distinct colours per element ·
readable at 64×64 and below.

---

## Flash Sheet — Weapons, Projectiles & Combat FX (Vol 08 right page, 64×64)

- **A. Bullets & beams** · **B. Explosions (on impact)** · **C. Lasers & continuous**
  (beams, spiral/helix, ring) · **D. Area effects (on ground)** — fire ring, ice
  burst, toxic pool, void spiral, etc.
- **E. Melee weapons** · **F. Upgrade path example** (★→★★★★★ same weapon
  escalating) · **G. Projectile size guide** (XS·S·M·L·XXL — ensure visibility
  across devices) · **H. Stacking & combo examples** (weapon + element = synergy →
  bigger effect).
- **I. Weapon hold & shoot poses** · **J. Element colour palette (guide)** — the
  per-element swatch ramps (Physical/Fire/Ice/Electric/Toxic/Void/Light/Gravity) ·
  **K. Design rules quick view.**

> **Arsenal mapping.** Projectile rendering keys off **§8.4 element** (colour + FX)
> × **§8.5 behaviour** (shape/motion) — this is the system behind per-class bullet
> identity. Weapon rarity (§8.2) scales glow + impact FX (§8.8). §8.7 weapon status
> effects unify with Vol 04 enemy states and Vol 01 damage types. The §J element
> palette is the authoritative bullet-colour source; §G size guide keeps bullets
> visible on iPhone. Combos (§H) formalise the element-stacking synergies.

---

## Volume 09 — Enemies & Hazards Bible: Advanced Foes, Traps & World Threats (v1.0)

The **advanced-content** law — named advanced enemies, mini-bosses, boss tiers,
enemy attack patterns, hazard traps, elite affixes and threat zones. Extends Vol 04
(enemy language) and Vol 06 (hazards) into concrete named content + the elite-affix
system already live in-game.

### §9.1 Purpose
Not all threats come with a sword. Some stalk. Some explode. Some corrupt. Know your
enemy. Survive the lightless.

### §9.2 Enemy Factions (5 — matches the boss colour classes)
**Void · Infernal · Toxic · Mechanical · Ancient.**

### §9.3 Advanced Enemies (named archetypes — name · role · behaviour)
- **Shadow Lurker** — Stealthy · Melee
- **Light Eater** — Ranged · Drain
- **Blazeforge** — Elite · AoE
- **Toxic Orb Walker** — Tank · Aura
- **Void Stalker** — Dash · Burst
- **Rune Sentinel** — Shield · Support

### §9.4 Mini Bosses (elite threats — name · trait)
- **Scourge Beast** — Heavy · Charge
- **Crystal Colossus** — Tank · Reflect
- **Soul Harvester** — Ranged · Drain
- **Molten Tyrant** — AoE · Burn
- **Storm Revenant** — Chain · Teleport

### §9.5 Boss Tiers (scaled difficulty by level band)
**Normal** (Lv 1–20) · **Elite** (Lv 20–40) · **Champion** (Lv 40–60) ·
**Mythic** (Lv 60–80) · **Ancient** (Lv 80+).

### §9.6 Enemy Attack Patterns
**Cone** (front burst) · **Ring** (surround AoE) · **Spiral** (expanding) ·
**Tracking** (follows player) · **Telegraph** (warns impact).

### §9.7 Hazard Traps (placed)
**Spike Trap** (physical) · **Fire Trap** (burn) · **Acid Pool** (toxic) ·
**Ice Trap** (slow) · **Void Rift** (pull + damage).

### §9.8 Environmental Hazards (zone)
**Lava Flood** (damage over time) · **Poison Cloud** (disables regen) · **Electric
Field** (periodic damage) · **Collapsing Floor** (unstable ground) · **Darkness
Zone** (reduces vision).

### §9.9 Elite Modifiers (random affixes)
**Fast** (increased movement) · **Frenzied** (more attacks) · **Thick Skin** (damage
reduction) · **Vampiric** (heals on hit) · **Explosive** (on death) · **Shielded**
(immune to first hit) · **Enraged** (lower HP → more dmg) · **Corrupted** (spreads
status).

### §9.10 Threat Level Guide (zone indicator)
**Low** (Safe, green) · **Moderate** (Caution, yellow) · **High** (Danger, orange) ·
**Extreme** (Very Dangerous, red) · **Nightmare** (Prepare to die, purple).

---

## Flash Sheet — Enemies, Hazards & Threats (Vol 09 right page, 64×64)

- **A. Common enemies (by faction)** · **B. Elite & champion variants** ·
  **C. Projectile examples** · **D. Debuff / status icons** (Burn·Poison·Shock·
  Slow·Bleed·Curse·Silence·Stun·Weaken·Blind) · **E. Summons & minions**.
- **F. Boss attack telegraphs** (cone/ring/target/spiral/eruption red warnings) ·
  **G. World objects & interactables** (Chest·Altar·Seal·Gate·Lever·Shrine·Obelisk) ·
  **H. Death & revive FX** · **I. Size comparison** (Minion 1× · Common 1.5× · Elite
  2× · Mini Boss 3× · Ancient Boss 8×+).

> **Advanced-content mapping.** §9.9 elite modifiers formalise our live elite-affix
> rings — align names/effects to this list. §9.3/§9.4 give a named archetype +
> mini-boss roster to grow the bestiary into; §9.5 boss tiers pair with Vol 05 size
> tiers for level-banded scaling. §9.6 attack patterns + §F telegraphs extend the
> boss/enemy attack vocabulary (Vol 05 §5.6) with the Tell→React contract. §9.7/§9.8
> traps & zone hazards extend the Vol 06 hazard set; §D debuff icons are the
> canonical status-effect set to unify Vol 04/08 states against. §G interactables
> reinforce Vol 06 §6.4 (Chest/Altar/Seal/Gate/Lever/Shrine/Obelisk).

---

## Volume 10 — Dungeons & Biomes Bible: Environments, Rooms & Visual Themes (v1.0)

The law for **level structure** — biome themes, room shapes, room flow, doors,
special rooms and depth progression. Introduces an **optional room/dungeon layer**
(a structural alternative/companion to the current open-arena survival mode).

### §10.1 Purpose
The world is your enemy. Every biome hides its own dangers, treasures and secrets.
Learn the land. Adapt. Survive.

### §10.2 Biome Themes (6 — with emotional keywords)
- **Void Depths** — Mystery · Shadow · Madness (purple)
- **Infernal Wastes** — Fire · Brutality · Ash (red/orange)
- **Toxic Marshes** — Poison · Decay · Corruption (green)
- **Frozen Wastes** — Cold · Isolation · Endurance (ice-blue)
- **Mechanical Core** — Steel · Order · Precision (steel/cyan)
- **Ancient Ruins** — History · Mystery · Forgotten (gold)

*(These are the campaign's biome/galaxy set — aligns with Vol 03 §A biome icons and
Vol 06 §6.7 theme colours.)*

### §10.3 Room Shapes
**Start Room · Corridor · Crossroads · Arena · Loop Room · Trap Room · Treasure
Room · Boss Room** (each with a legend glyph).

### §10.4 Room Features (placement ideas)
**Entrance · Exit · Chest · Altar · Fountain · Shop · Trap · Switch.**

### §10.5 Environmental Hazards (room-scale)
**Lava Pits · Spike Floors · Poison Clouds · Ice Slide · Darkness · Laser Grid ·
Collapsing Floor · Cursed Ground.**

### §10.6 Lighting Moods
Per-theme light colour sets tone: **Void · Infernal · Toxic · Frozen · Tech ·
Ancient.** Use colour and contrast to guide the player and build atmosphere.

### §10.7 Decoration Examples
**Crystal · Bone Pile · Statue · Banner · Pipes · Rune Stone.**

---

## Flash Sheet — Dungeons, Rooms & Environments (Vol 10 right page, 64×64)

- **A. Biome tile sets (floor)** · **B. Wall styles** · **C. Floor decor
  variations** · **D. Door & gate types** (Wooden Door · Iron Gate · Arcane Seal ·
  Portal Gate · Boss Door) · **E. Room modifiers** (Monster · Damage · Trap ·
  Darkness · Curse · Berserk · Time Limit · No Heal).
- **F. Special room types:** Treasure · Event · Mini Boss · Shop · Puzzle.
- **G. Biome ambient details** (per-theme prop rows) · **H. Depth / progression
  themes:** Depth 1–2 (Surface/Entry) · 3–5 (Deeper/Stronger Foes) · 6–8 (Darkest/
  Deadliest) · 9–10+ (Endgame/Mythic).
- **I. Room flow examples** (node graphs Start→…→Boss/Exit) · **J. Legend** (room
  node types) · **K. Quick design checklist** (clear purpose · distinct identity ·
  readable 64×64 · strong contrast/lighting · hazards feel fair · rewards match risk ·
  flow encourages exploration).

> **Structure mapping.** §10.2's six biome themes are the definitive campaign biome
> set (Void Depths / Infernal Wastes / Toxic Marshes / Frozen Wastes / Mechanical
> Core / Ancient Ruins) — our Ember Wastes = Infernal, Hollow Deep = Frozen, The
> Fade = Void Depths, with Toxic/Mechanical/Ancient as new galaxies. §10.3 room
> shapes + §10.4 features + §F special rooms + §I flow describe an **optional
> room-based dungeon mode**; §E room modifiers (No Heal, Time Limit, Curse, Berserk)
> are per-room rule twists that echo our Directives/biome rules. §H depth ladder
> pairs with Vol 03 §3.4 difficulty tiers + Vol 09 §9.5 boss tiers for a unified
> progression curve.

---

## Volume 11 — Traps & Mechanics Bible: Hazards, Triggers & Environmental Mechanics (v1.0)

The law for **traps and interactive mechanics** — the deepest cut of the
environment system. Categorises every trap by purpose, trigger and difficulty, and
sets the **fairness contract** (always telegraph, always give a reaction window).

### §11.1 Purpose
Traps protect, punish and challenge. Mechanics create movement, choices and
consequences. Learn the pattern. Survive the dungeon.

### §11.2 Trap Categories (6)
- **Damage** — hurt/kill instantly or over time (red)
- **Control** — slow, stun, root or displace (purple)
- **Area Denial** — block paths or zones temporarily (orange)
- **Utility** — create effects, open paths, change state (green)
- **Puzzle** — require action, timing or sequence (blue)
- **Environmental** — passive hazards based on the environment (grey)

### §11.3 Trigger Types (6)
**Pressure Plate · Proximity · Line of Sight · Timer · Ranged · Manual.**

### §11.4 Damage Traps
Spike Pit · Dart Shooter · Flame Jet · Falling Rocks · Lightning Strike · Blade Wall.

### §11.5 Control Traps
Poison Dart · Freeze Burst · Knockback Pad · Root Vines · Slow Field · Teleport Pad.

### §11.6 Area Denial Traps
Fire Floor · Acid Pool · Void Zone · Sand Storm · Magma Stream · Shock Field.

### §11.7 Utility & Puzzle Mechanics
Pressure Gate · Weight Plate · Beam Reflector · Colour Switch · Statue Activator ·
Sequence Rune.

### §11.8 Environmental Hazards
Collapsing Floor · Toxic Gas · High Voltage · Water Rise · Ice Crack.

---

## Flash Sheet — Traps, Mechanics & Interactables (Vol 11 right page, 64×64)

- **A. Mechanical devices (interactables):** Lever · Crank · Pressure Pad · Button ·
  Gear Box · Valve.
- **B. Gates & barriers:** Portcullis · Stone Gate · Magic Seal · Energy Barrier ·
  Locked Door · One-Way Gate.
- **C. Trap warning signs:** Danger · Spikes · Fire · Poison · Shock · Crush.
- **D. Floor & wall markers:** Trap Mark · Safe Zone · Trigger Area · Directional ·
  Secret Wall · Puzzle Clue.
- **E. Movement hazards:** Rolling Spike · Swinging Blade · Crushing Wall · Wall Saw ·
  Pursuit Boulder · Floor Spikes.
- **F. Elemental traps (6 = boss colour classes):** Infernal · Frost · Toxic ·
  Arcane · Void · Holy.
- **G. Trap combinations** (trap + trap = escalated hazard) · **H. Trap chain
  example (room flow):** Entry → Trigger → Challenge → Escalate → Reward.
- **I. Trap difficulty guide:** Easy · Normal · Hard · Extreme · Nightmare (mirrors
  Vol 09 threat levels) · **J. Colour coding (meaning):** Red = Damage/Danger ·
  Purple = Control/Curse · Green = Poison/Nature · Blue = Ice/Water/Tech · Orange =
  Fire/Heat · Yellow = Holy/Light · Grey = Physical/Neutral.
- **K. Design rules quick view:** always telegraph before activation · give a fair
  reaction window · mix trap types for variety · combine mechanics for depth · use
  colour & sound for clarity · difficulty should feel earned · **traps are puzzles,
  not annoyances.**

> **Trap-system mapping.** §11.2 categories + §11.3 triggers formalise a trap layer
> atop our `Hazard` lifecycle (telegraph→active→fade already encodes §K's "always
> telegraph, fair reaction window"). §F elemental traps reuse the boss/damage colour
> classes so a Frost/Infernal/Void trap reads the same as its element everywhere.
> §H trap-chain flow (Entry→Trigger→Challenge→Escalate→Reward) is the template for
> hazard rooms in the optional dungeon mode (Vol 10). §J colour meanings are the
> project-wide semantic colour key — unify UI/VFX to it. §A/§B interactables extend
> Vol 06 §6.4 and Vol 10 §D doors.

---

## Volume 12 — Artifacts & Specials Bible: Unique Relics, Active Skills & Ultimate Powers (v1.0)

The law for **the power ceiling** — named artifacts (relics), player-activated
skills, and screen-clearing ultimate specials. This is the "build-defining loot +
active ability" layer that turns a run into a legend. Extends Vol 07 §7.8 relics
into named, socketed, evolving artifacts and adds two brand-new systems (active
skills, ultimates).

### §12.1 Purpose
Artifacts grant incredible power. Actives turn the tide. Specials change everything.
Find them. Master them. Become legend.

### §12.2 Artifact Rarities (6 — same ladder as weapons)
Common · Uncommon · Rare · Epic · Legendary · **Mythic** (relics of limitless
potential).

### §12.3 Artifact Categories (6, socket-coded)
- **Offense** (red) — deal more damage
- **Defense** (green) — survive longer
- **Utility** (blue) — improve mobility
- **Magic** (purple) — enhance spells
- **Summon** — call allies to fight
- **Chaotic** — wild power, risk & reward

### §12.4 Example Artifacts (named — effect)
Blood Lantern (heal on kill) · Rune Band (+spell dmg) · Time Shard (slows time on
hit) · Bone Crown (+minion dmg) · Guardian Coin (+armor stacking) · Void Heart
(chance to fear) · Storm Core (chain lightning) · Demon Seal (+crit) · Spirit
Feather (+move speed) · Ember Core (burn aura) · Frost Heart (chance to freeze) ·
Plague Vial (poison clouds on death) · Light Orb (holy blasts) · Shadow Cloak (go
invisible briefly) · War Horn (rally allies) · Chaos Dice (random effects).

### §12.5 Active Skills (player-activated)
Dash · Blade Spin · Frost Nova · Shadow Step · Healing Wave · Summon Golem · Arrow
Rain · Gravity Well. *(New system: a manually-triggered ability slot with cooldown.)*

### §12.6 Active Skill Upgrades
Longer Duration · Bigger Area · More Damage · Shorter Cooldown · Additional Charge ·
Status Effect · Resource Refund · Chain Effect.

---

## Flash Sheet — Artifacts, Actives & Specials (Vol 12 right page, 64×64)

- **A. Ultimate Specials (devastating powers):** **Meteor Strike** (call meteors) ·
  **Soul Eruption** (massive dmg + heal) · **Void Rupture** (tear reality, huge void
  dmg) · **Avatar Ascend** (transform & devastate) · **Time Stop** (freeze all
  enemies). *(New system: a charged ultimate.)*
- **B. Special upgrade paths (5 levels):** e.g. Meteor Strike → Burning Meteors →
  More Meteors → Larger Impact → **Apocalypse** (devastates entire screen).
- **D. Statue & Altar effects:** Damage Up · Defense Up · Speed Up · Life Steal ·
  Crit Chance · Resource Gain (shrine buffs — ties to Vol 10 §10.4 / Vol 09 §G).
- **E. Artifact sockets:** Offense (red) · Defense (green) · Utility (blue) · Magic
  (purple) gems slot into an artifact frame.
- **F. Combining artifacts** (two compatible → something greater) · **G. Relic
  evolution** (Common→…→Mythic upgrade chain) · **H. Special-effect icon legend**
  (Burn·Poison·Frost·Shock·Bleed·Stun·Fear·Silence·Curse·Invulnerable).
- Right-column interactables: **Chest · Shrine · Altar · Lever · Portal · Vendor ·
  Bonfire · Teleporter** (reinforces Vol 09/10/11 world objects).

> **Power-ceiling mapping.** §12.4 artifacts = our relics (Vol 07 §7.8), now with
> named identities, §12.3 socket categories, §F combining and §G Common→Mythic
> evolution. **§12.5 active skills** and **§A ultimate specials** are two NEW player
> systems to introduce: an active ability slot (cooldown-based) and a charged
> ultimate (built up over a run), each with §12.6/§B upgrade paths. §H effect icons
> reconcile with Vol 09 §D debuff icons and Vol 08 §8.7 weapon states as the single
> canonical status set. §D shrine buffs wire into Vol 10 altars/shrines. Together
> these deliver the Vol 05 "power through choice" tone and the veteran endgame
> ceiling.

---

## Volume 13 — Power-ups & Consumables Bible: Buffs, Potions & Utility Items (v1.0)

The law for **temporary boons and consumables** — the moment-to-moment buff layer
(power-ups, potions, scrolls/tomes) that sits between permanent relics (Vol 12) and
the reward economy (Vol 07). *(Sheet note: the left page is titled Volume 13; the
right flash-sheet header reads "Volume 14" — an internal label mismatch on the
sheet. Catalogued as Vol 13 per the bible title.)*

### §13.1 Power-up Types (8)
**Offense · Defense · Speed · Crit · Magic · Utility · Summon · Hybrid.**

### §13.2 Offensive Power-ups
Rage (+50% dmg) · Sharpshooter (+crit chance) · Fire Infusion (adds fire dmg) ·
Arcane Might (+spell dmg) · Bleeding Edge (+bleed dmg) · Frenzy (+attack speed) ·
Executioner (bonus vs low HP) · **Demonic Pact** (greatly increases dmg, drains HP).

### §13.3 Defensive Power-ups
Iron Skin (+armor) · Stoneskin (+dmg reduction) · Regeneration (heal over time) ·
Life Leech (heal on hit) · Spell Shield (blocks dmg) · Thorns (reflect dmg) ·
Barrier (absorb dmg) · Second Wind (revive once).

### §13.4 Utility Power-ups
Move Faster (+move speed) · Swiftness (+dodge chance) · Pickup Radius (attract
orbs) · Lucky (better rewards) · Extra Orb (more orbs drop) · Cooldown Cut (−skill
cooldowns) · Detect (reveal secrets) · Teleport (short-range blink).

### §13.5 Potions (instant use)
Health (restore HP) · Mana (restore MP) · Rage (full rage) · Antidote (cure
poison) · Elixir (all stats up) · Stoneform (invulnerable briefly) · Invisibility
(avoid enemies) · Purge (remove debuffs).

### §13.6 Scrolls & Tomes (activation use)
Scroll of Fireball · Scroll of Ice Storm · Scroll of Light · Scroll of Chaos ·
Tome of Power (+all dmg for a time) · Tome of Defense (+all resistances) · Tome of
Mastery (+skill levels for a time) · Scroll of Escape (teleport to safe room).

### §13.7 Rarity & Quality (applies to all power-ups — EXPANDED 8-tier ladder)
Common (Grey) · Uncommon (Green) · Rare (Blue) · Epic (Purple) · Legendary
(Orange) · Mythic (Red) · **Ancient (Gold)** · **Primal (White/Pink)**. Higher
rarity = stronger effect, longer duration, lower drop rate.

> *(This extends the 6-tier rarity used elsewhere with two apex tiers — Ancient &
> Primal — for consumables. When a unified rarity scale is needed, this is the
> longest ladder.)*

---

## Flash Sheet — Power-ups, Consumables & Progression (Vol 13 right page, 64×64)

- **A. Status effects (from power-ups/enemies):** Burn · Frost · Poison · Shock ·
  Bleed · Curse · Stun.
- **B. Stacking & duration icons:** Stack ×3 · Stack ×10 · Duration Short/Medium/
  Long · Permanent (∞).
- **C. Power-up combos:** Fire Infusion + Sharpshooter = **Incinerating Arrows** ·
  Lightning Strike + Chain Effect = **Thunderlord** · Life Leech + Thorns = **Blood
  Mirror**.
- **D. Consumable drop rarity (rates):** Common 60–70% · Uncommon 20–30% · Rare
  7–12% · Epic 2–5% · Legendary 0.5–1.5% · Mythic <0.5%.
- **E. Chests & rewards:** Basic · Elite · Magic · Legendary · Mythic · Cursed
  (risk vs reward).
- **F. Progression meters (UI):** Player Level · XP Progress · Battle Pass ·
  Reputation · Resource.
- **G. Power-up selection UI:** rarity-framed choice cards (name · effect ·
  duration · TAKE) — the in-run draft card layout.
- **H. Quick design checklist** · **I. Consumable hotbar** (6 numbered slots with
  counts) · **J. Player buff bar** (row of active buffs with countdown timers).

> **Buff-layer mapping.** §13.1–13.4 power-ups slot straight into our in-run upgrade
> draft (Vol 07 §7.4) with named identities and §13.1 type tags; §13.5 potions +
> §13.6 scrolls/tomes are a NEW active-consumable layer (see §I hotbar + §J buff
> bar for the UI). §C combos formalise the element-stacking synergies (with Vol 08
> §H). §D drop rates + §13.7 rarity give the loot tables concrete numbers. §G card
> layout is the canonical reference for our level-up choice UI; §F meters inform the
> HUD/progression screens.

---
---

# THE v2 PRODUCTION SERIES (Volumes 13–25)

A later, higher-fidelity set of production sheets. These are the **definitive
reference for the campaign redesign**. Where they overlap the original series,
follow these. Recorded verbatim below; extract exact assets as we wire each system.

## Volume 13 (v2) — Power-ups Bible: Temporary In-Run Upgrades

Two v2 forms exist (a standalone sheet and a composite). Canonical content:

- **Rarity (5):** Common (White) · Rare (Blue) · Epic (Purple) · Legendary (Gold) ·
  Mythic (Red). *(Power-ups do not persist between runs.)*
- **§13.2 Categories (6):** Offense · Defense · Utility · Summon · Special · Evolution.
- **§13.3 Example power-ups by rarity:** Common (Rapid Shot, Vitality, Focus, Reflex,
  Magnet, Thick Skin) · Rare (Triple Shot, Energy Shield, Explosive Bullets, Swift
  Strike, Life Leech, Lucky Strike) · Epic (Chain Lightning, Orbital Drones, Void
  Rift, Phantom Blade, Time Dilation, Bloodlust) · Legendary (Death Blossom, Divine
  Barrier, Nuke Beam, Black Hole, Seraphim, Infinity Core) · Mythic (Reality Break,
  Chrono Shift, Galactic Rain, Omnivamp, Starfall, Ascension).
- **§13.4 Evolution combinations:** Rapid Shot + Triple Shot = **Hailstorm** ·
  Lightning + Chain Lightning = **Storm Core** · Drones + Phantom Blade = **Sentinel
  Swarm** · Fire Infusion + Explosive Bullets = **Inferno Core**.
- **Build archetypes:** Bullet Hell · Critical Strike · Summoner · Elementalist ·
  Tank (each lists its key power-ups) — these are the **build-craft archetypes** the
  earlier design thread wanted.
- *(Standalone-sheet variant also names Global/Combat/Support power-up groups —
  Bloodlust, Iron Will, Haste, Arcane Surge, Death's Touch, Berserker, Vampiric
  Aura, Elemental Fury, etc. — and an expanded 8-tier rarity Common→Primal.)*

## Volume 14 (v2) — Status Effects Bible: Buffs, Debuffs & Damage Types

- **§14.1 Damage types (10):** **Fire** (burns over time) · **Frost** (slows/chills) ·
  **Poison** (damage over time) · **Plasma** (bypasses shields) · **Arcane** (magic
  resonance) · **Void** (ignores armor) · **Light** (purifies/blinds) · **Dark**
  (corrupts/drains) · **Radiation** (spreads contamination) · **Shock** (stuns/chains).
- **§14.2 Buffs (positive):** Berserk (dmg↑) · Barrier (absorb before HP) · Precision
  (crit↑) · Rapid Fire (fire rate↑) · Vampiric (heal % of dmg) · Overcharged (all dmg
  + speed↑) · Regeneration (heal over time) · Phase Shift (avoid next hit) · Lucky
  (drop-rarity↑). Each row lists **stacking rule + duration + example sources**.
- **§14.3 Debuffs (negative):** Burn · Frozen · Slow · Blind · Fear · Curse · Silence ·
  Corrupted · EMP · Cripple — each with stacking rule, duration, sources.
- **§14.4/14.5:** buff/debuff FX visual language, damage-type projectiles, icon set.

> **Canonical status set.** §14.1 damage types are the authoritative 10-type list
> (reconciles Vol 01/08/09/12). §14.2/14.3 buffs+debuffs with stacking+duration are
> the master status table the whole game unifies to.

## Volume 15 (v2) — Factions Bible: Civilisations of the Hundred Lights

Five core factions (each defines visual language, palette, enemies/elites, bosses,
projectiles, hazards, environment, architecture, mechanics, lore):
- **The Hollow Swarm** — living insectoid hordes that consume & adapt. *Keywords:
  Swarm · Adapt · Consume · Toxic · Organic.*
- **The Crystal Choir** — crystalline beings attuned to resonance. *Resonance ·
  Harmony · Crystal · Choir.*
- **The Iron Dominion** — ancient machines programmed to expand & dominate. *Machine ·
  Order · Forge · Construct · Empire.*
- **The Ember Covenant** — fanatics who worship the flame & seek transcendence. *Fire ·
  Ritual · Devotion · Magma · Cult.*
- **The Verdant Hive** — the living forest that spreads, roots & rebirths. *Growth ·
  Spore · Root · Nature · Hive.*
- Sub-names on sheet: The Voidborn · Choir of Light · Eclipse Cult · Ash Forged ·
  Abyss Watchers (per-faction cells). Each faction has a flash-sheet sample layout
  (Common enemies · Elites · Bosses · Projectiles · Hazards).

> **Faction mapping.** These supersede the looser faction lists in Vol 01/03/09 as
> the definitive five, each with a full asset language. The campaign's galaxies pick
> a primary + secondary faction (see Vol 21 §21.4 template).

## Volume 16 (v2) — Ships & Ship Classes Bible

- **§16.1 Philosophy:** identifiable by silhouette alone; bold readable shapes; no
  geometry placeholders; hand-painted sci-fi with neon accents; 6–8 major silhouette
  features max; distinct engine glow, cockpit shape, wing profile.
- **§16.2 Ship families (12):** Scout · Skiff · Interceptor · Gunship · Corsair ·
  Monolith · Bulwark · Carrier · Warpstrike · Dreadnought · Experimental · Ancient
  Light · Corrupted Void (each with a role line, e.g. Scout = fast/fragile recon).
- **§16.3 Class identity** (example Interceptor: role, passive ability, 5-step upgrade
  path Defender→Vanguard→Paragon→Ascendant→Apex, signature synergy).
- **§16.4 Hull components:** Cockpits · Wings · Engine Pods · Armour Plates ·
  Thrusters · Weapon Mounts · Energy Cores · Fins/Stabilisers · Antennae · Void
  Crystals.
- **§16.5 Stat archetypes** (Firepower/Mobility/Durability/Shield/Energy/Utility bars
  per family) · **§16.6 Size guide** (Scout ~12m → Dreadnought ~100m+).
- **Flash sheet §16.7:** 50 ship silhouettes · 20 cockpits · 20 wing sets · 20 engine
  types · 20 thruster FX · 30 hull-panel motifs · **15 faction paint schemes** ·
  25 damage decals · 20 class icons · 15 engine-glow styles · UI portraits.

## Volume 17 (v2) — Weapon Bible: All Weapons, Upgrades & Signature Archetypes

- **§17.2 Six weapon archetypes (foundation):** **Kinetic** (fast physical baseline
  DPS) · **Energy** (beams/bolts/charged) · **Explosive** (area/splash/impact) ·
  **Tech** (deployable/drone-assist) · **Void** (…) · **Ancient** (lost/light-based/
  sentient).
- **§17.3 Rarity (7):** Common · Uncommon · Rare · Epic · Legendary · Mythic · **Exotic**
  (one of a kind).
- **§17.4 Weapon stats:** Damage · Fire Rate · Projectiles · Crit Chance · Crit Damage ·
  Range · Piercing · Cooldown · Status Chance · Spread · Ammo/Energy · Reload.
- **§17.5 Upgrade path:** Base → Lv1 → Lv2 → Lv3 → **Evolution**.
- **§17.7 Evolution examples (named per archetype):** Kinetic *Rapid Cannon* · Energy
  *Arc Lance* · Explosive *Shard Launcher* · Tech *Sentry Drone* · Void *Gravity Rift* ·
  Ancient *Solar Prism*.
- **§17.9 Modifiers:** Homing · Bouncing · Piercing · Chain · Split · Ricochet ·
  Expanding · Penetrating.
- **§17.10 Synergies:** Arc Lance + Chain = Lightning further · Shard Launcher + Split =
  more shards · Sentry Drone + Homing = auto-track · Rapid Cannon + Overclock = fire
  rate · Gravity Rift + (…) = bigger pull · Solar Prism = beams ignore shields.

## Volume 18 (v2) — Equipment Bible (fills the earlier "Equipment" gap)

- **§18.2 Categories (6):** **Hulls** (base structure/core stats) · **Engines**
  (speed/accel/manoeuvre) · **Wings** (weapons/handling/specials) · **Shields**
  (capacity/recharge) · **Cores** (power/enable systems) · **Systems** (utility/
  defense/offense/unique).
- **§18.3 Rarity (7):** Common · Uncommon · Rare · Epic · Legendary · Mythic · **Exotic**.
- **§18.4 Equipment stats:** Damage · Fire Rate · Crit Chance · Crit Damage · Range ·
  Projectile Speed · Speed · Acceleration · Handling · Shield Capacity · Shield Regen ·
  Damage Reduction · Energy Capacity · Energy Regen · Cooldown Reduction · Luck · XP
  Bonus · Weight.
- **§18.5 Upgrade path:** Base → MK I → MK II → MK III → MK IV → **Ascended**.
- **§18.6 Library (12 each):** named Hulls, Engines (Ion/Plasma/Pulse/Arc/Grav/Warp/
  Nova/Sabre/Storm/Void/Hyper/Aeon), Wings, Shields (Basic→Singularity), Cores
  (Power/Reactor/Crystal/Void/Fusion/Star/Gravity/Warp/Nanite/Aeon/Dragon/Omega),
  Systems (Targeting AI, Auto Repair, Drone Bay, Missile Rack, EMP Field, Cloaking,
  Beam Focus, Energy Drain, Shield Amp, Hacking Suite, Mining Laser, Support Matrix).
- **§18.7 Set bonuses (5, 3/5 & 5/5 tiers):** Voidforged · Starforged · Swarmtech ·
  Ancient Light · Corrupted.
- **§18.8 Mod slots & socket types:** Slot types (Weapon/Utility/Core/Defense/
  Universal) · socket shapes (Round/Triangle/Square/Diamond = balanced/offense/
  defense/utility) · **polarity** (matching polarity grants bonus).

## Volume 19 (v2) — Projectile & VFX Bible

- **§19.2 Damage-type projectiles (8, player & enemy):** Kinetic · Energy · Explosive ·
  Tech · Void · Ancient · Light · Dark — each a distinct silhouette.
- **§19.4 Impact effects · §19.5 status-effect visuals** (Burn/Frozen/Poison/Shock/
  Corrupted/Slow/EMP/Bleed) · **§19.6 beam weapons** (per damage type).
- **§19.7 Large weapons/area effects:** Rail Shot · Missile Salvo · Orb Strike · Laser
  Barrage · Void Lance · Meteor Strike · Gravity Well · Nebula Bomb.
- **§19.8 AoE shapes:** Circle · Ring · Cone · Line · Cross · Wave · Spiral · Field.
- **§19.9 Enemy attack patterns:** Spread · Twin · Shotgun · Spiral · Wave · Homing ·
  Orb Swarm · Laser Sweep. **§19.13 Environment VFX:** Fire/Ice/Acid Storm · Void Rift ·
  Sand Storm · Electric Storm.
- **§19.15 Size guide:** Tiny→Massive. **§19.16 Colour-language guide** per damage type.
  **§19.12 Screen-space FX:** motion blur, bloom, shake, chromatic aberration, flash,
  distortion, vignette, **hit-stop**.

## Volume 20 (v2 — UI & HUD) — User Interface · HUD · Menus · Feedback

- **§20.1/20.2 principles:** Clarity · Hierarchy · Consistency · Feedback · Immersion ·
  Accessibility (colour + shape).
- **§20.3 HUD layouts:** Standard · Compact · Minimal · Boss Fight. **§20.4 HUD zones**
  (top-left health/shields/energy/relics; top-right score/currency/timer/objectives;
  bottom-left movement/status/build; bottom-right weapons/skills/cooldowns).
- **§20.5 Core UI:** bars (Health/Shields/Energy/Overheat), toggles, sliders,
  scrollbars, frame styles, panels, buttons (normal/hover/pressed/disabled).
- **§20.7 Feedback:** damage numbers (12 / 348! / 1.2K / 9.8K!), CRIT/ELITE/IMMUNE,
  +120 / LEVEL UP, WARNING, OBJECTIVE UPDATED / COMPLETE, status popups.
- **§20.8 Menus:** Main (Play/Hangar/Upgrades/Relics/Codex/Settings/Exit), Pause,
  Victory (Stage Clear/Fate Lost screens with rewards).
- **§20.14 Palette** (Primary Neon / Secondary / Neutrals / gradients) · **§20.15
  Typography — CANONICAL FONTS: Headings = Orbitron Bold; Body = Rajdhani Medium;
  Title = "Afterlight" display. Clean, futuristic, highly legible.**

## Volume 20 (v2 — Hazards & Environment) — *number collision on sheet*

- **§20.2 Hazard categories (8):** Energy · Projectile · Physical · Elemental · Gravity ·
  Environment · Trap · Boss-Env.
- **§20.4 Trap device library:** Turret · Laser Turret · Mine · Shock Mine · Plasma
  Mine · Drone Spawner · Flame Jet · Spike Floor · Rotating Saw · Crusher · Magnet
  Field · Portal Gate · Barrier Generator · Death Ray · Chain Anchor · Acid Vent ·
  Gravity Node · Time Bomb.
- **§20.5 Telegraph styles:** Ring · Cone · Line · Area Grid · Pulse · Trackers ·
  Countdown. **§20.6 Env hazards:** Space · Planet · Structural · Weather.
- **§20.8 Arena hazard layouts:** Circle · Linear · Multi-level · Boss · Survival.
- **§20.12 Level geometry kit** (platforms/walls/corners/pillars) · **§20.9 intensity**
  (Safe→Lethal) · **§20.15 colour language** per hazard category.

## Volume 21 (v2) — Galaxy Bible: One Hundred Galaxies (the campaign map)

- **§21.1:** 100 unique galaxies, grouped into **10 sectors of 10**; each galaxy has a
  distinct biome, faction, hazard profile, 3–5 star systems w/ zones.
- **§21.2 Sectors (10):** 01 The Crystal Edge · 02 The Hollow Reach · 03 The Iron
  Expanse · 04 The Ember Wastes · 05 The Verdant Depths · 06 The Void Frontier · 07
  The Ancient Rim · 08 The Storm Seas · 09 The Shattered Core · 10 The Beyond.
- **§21.3 Biome types (10):** Crystalline · Volcanic · Frozen · Toxic · Desert ·
  Nebula · Jungle · Mechanical · Corrupted · Abyssal.
- **§21.4 Galaxy data template** (worked example G-042 **Vorath Prime**, Sector 04, biome
  Volcanic/Ash Seas, primary faction Ember Covenant, secondary Iron Dominion, hazard
  level, difficulty tier, recommended power, unique mechanic *Lava Surge*, boss *Magma
  Colossus*, visual + music theme). **This is the galaxy definition schema.**
- **§21.6 Star-system icons:** Safe · Standard · Dangerous · Hazardous · Extreme ·
  Forbidden · Anomaly. **§21.7 Node types:** Start · Combat · Elite · Boss · Event ·
  Shop · Treasure · Rest · Portal.
- **§21.8 Progression tiers (6):** 1–10 · 11–20 · 21–40 · 41–60 · 61–80 · 81–100.
- **§21.9 Galaxy modifiers:** Gravity Shift · Meteor Storms · Ion Storms · Void Rifts ·
  Lava Surge · Solar Flare · EMP Pulse · Debris Field · Time Dilation · Resource Rich ·
  Corruption Spread · Frostbite Winds · Acid Rain · Arcane Surge · Peaceful Zone.
- **§21.12 Rewards by tier** (T1–2 Common → T9–10 Mythic/Relic/Light Cores) ·
  **§21.13 difficulty curve** (enemy power scales ~linearly across galaxies 1→100).

## Volume 22 (v2) — Enemy Production Bible

- **§22.2 Enemy factions (6):** Void Corrupt · Dread Legion · Xenith Prime · Crystal
  Conclave · Machine Cult · Ancient Wardens (each with primary/secondary/FX/energy
  colours in §22.11).
- **§22.3 Roles (8):** Swarmer · Rusher · Sniper · Artillery · Tank · Support · Boss ·
  Objective. **§22.4 Core archetypes:** Void Leech · Legion Fighter · Xenith Drone ·
  Crystal Sharder · Mech Hunter · Warden Sentinel · Collapse Behemoth.
- **§22.5 Modular parts library:** Heads/Cockpits (40) · Torsos (50) · Arms/Wings (60) ·
  Engines (40) · Weapons/Mounts (60) · Shields/Generators (30) — combine for infinite
  variation. **§22.6 Size (7):** Tiny <2m → Titan 300m+.
- **§22.7 Behaviours:** Linear · Swoop · Circle · Spiral · Zig-Zag · Hold · Flank ·
  Retreat. **§22.9 Attack telegraphs:** Charge · Laser · Missile · Area Blast · Swarm
  Spawn · Shield Up. **§22.12 Difficulty modifiers (stackable):** Armoured · Shielded ·
  Regen · Enraged · Swarm · EMP Aura · Plagued · Boss.

## Volume 23 (v2) — Boss Production Bible

- **§23.2 Archetypes:** Void Entity · Machine Colossus · Ancient Guardian · Corrupted
  Beast · Celestial Being · Swarm Queen · Dimensional Horror.
- **§23.3 Scale (5):** Minor 15–30m · Major 30–80m · Colossal 80–200m · Titan
  200–500m · **World Eater 500m+**.
- **§23.4 Boss stages (5):** Initiation → Escalate → Overdrive → Desperation → **Final
  Form** (each with key changes). **§23.5 Element themes:** Void · Machine · Celestial ·
  Corrupted · Natural · Ancient · Dimensional.
- **§23.6 Attack pattern categories:** Projectile Spam · Beam · AoE · Swarm Summon ·
  Charge/Dash · Rotating/Spin · Pulsing Waves · Homing · Gravity/Pull · Phase/Teleport.
- **§23.8 Reward tiers (T1–T5 Standard→Mythic)** + **§23.9 boss loot table** (credits,
  core fragment %, equipment drop %, unique component %, cosmetic %, mythic %, void
  crystals — scaling T1→T5). **§23.11 Phase transitions:** Shield Break → Core Overload
  → Arena Collapse → Final Evolution.

## Volume 24 (v2) — Power & Progression Bible

- **§24.4 Progression:** Play → Earn → Upgrade → Evolve → **Mastery**.
- **§24.5 Resources & currencies (6):** Credits (universal) · Core Fragments (upgrade/
  craft) · Void Crystals (premium) · Relic Essence (enhance relics) · Data Shards
  (research/codex) · Faction Tokens (faction shop).
- **§24.7 Mastery tiers:** Novice · Adept · Expert · Master · Grandmaster · **Legend**
  (XP bands to 600k+). **§24.8 Ascension system** (prestige: +stats/resource-find/relic
  slot per level; matches our live Ascendancy). **§24.9 Relic enhancement** (rank
  0–20, enhancement materials, success chance).
- **§24.6 Upgrade paths (5 trees):** Weapons · Armor · Core Systems · Abilities ·
  Support (5/5 nodes each). **§24.10 Talent masteries (5 classes):** Ranger · Berserker ·
  Techmancer · Voidwalker · Guardian. **§24.12 Endgame goals:** Endless Mode · Galactic
  Raids · Leaderboards · Mythic Gear · Faction War. **§24.3 Player stats** = the core
  stat list (Health, Shields, Armor, Damage, Crit%, Crit Dmg, Attack Speed, Ability
  Power, Energy Regen, Cooldown Reduction, Move Speed, Lifesteal, Resource Find, XP Gain).

## Volume 25 (v2) — Items Bible: Gear · Modules · Rarity · Affixes · Crafting

- **§25.2 Rarity (7):** Common · Uncommon · Rare · Epic · Legendary · Mythic · **Ancient**.
- **§25.3 Item slots (16):** Weapons · Armor · Helmet · Chest · Gloves · Boots · Shield ·
  Accessory · Amulet · Ring · Belt · Tech · Core · Reactor · Drone · Vehicle.
- **§25.4 Affix tiers & rolls:** T1 Low (50%) → T5 Perfect (1%), with roll ranges.
  **§25.5 Affix types (6):** Offensive · Defensive · Utility · Survival · Technical ·
  Conditional. **§25.7 Modifiers:** prefixes (+dmg/crit/elemental/atk-speed/all-skills/
  move) & suffixes (+armor/shield/health/dmg-resist/regen/pickup).
- **§25.8 Item sets** (e.g. **Voidforged Armament** 2/4/6-piece bonuses; sets stack) ·
  **§25.9 augments & sockets** (Square utility / Diamond offensive / Triangle defensive /
  Circle special; named augments Overclock Core, Vampiric Node, Phase Stabilizer,
  Singularity Lens, Fortress Matrix).
- **§25.10 Crafting flow:** Salvage → Craft → Enhance → Reforge → **Ascend**. **§25.11
  materials:** Common Alloy · Rare Crystal · Void Shard · Ancient Core · Legendary
  Essence · Mythic Fragment. **§25.13 Item Power Score (IPS)** Poor→Perfect bands ·
  **§25.15 item evolution** (Rare Lv20 → … → Ancient Lv120+).

> **v2 system mapping (headline).** Vol 21 is the **campaign spine** (100 galaxies /
> 10 sectors, galaxy = biome+faction+hazard+boss+modifier via the §21.4 schema).
> Vols 15/22/23 give the faction + enemy + boss production language; Vols 16/17/18/25
> the ship/weapon/equipment/item build systems; Vol 24 the meta-progression (resources,
> mastery, ascension, talent trees) that our meta-upgrades/Ascendancy already seed;
> Vol 20-UI fixes the **fonts (Orbitron/Rajdhani)** and HUD; Vol 19 + Vol 20-Hazards
> the VFX + arena hazards. Vol 14 is the **master status/damage-type table** (10 types)
> everything unifies to.
