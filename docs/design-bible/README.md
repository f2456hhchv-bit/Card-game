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

Connected volumes (per Vol 01 §1.12 index): 00 Studio Constitution ✅ ·
01 Universe ✅ · 02 Art ✅ · 03 Galaxy ✅ · 04 Enemy ✅ · 05 Boss ✅ ·
06 Environment & Obstacles ✅ · 07 Items & Powerups ✅ · 08 Gameplay · 09 System ·
10 Technical · 11 Claude Code Manual.

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
