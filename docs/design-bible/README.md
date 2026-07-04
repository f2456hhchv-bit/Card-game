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

Connected volumes named on Vol 00 (awaiting delivery): 01 Universe · 02 Art ·
03 Galaxy · 04 Enemy · 05 Boss · 06 Equipment · 07 Flash Sheet · 08 UI ·
09 Gameplay · 10 Technical.

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
