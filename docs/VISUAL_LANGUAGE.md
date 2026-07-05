# AFTERLIGHT — Visual Language

**Authority:** Produced output of AF-002. Extends AF-000/AF-001 and the Master Constitution. Every visual board, asset sheet, shader, and UI component originates here. Extended, never replaced.
**Binding rule of the whole document:** gameplay readability overrides artistic detail, always.

---

## 1. Identity in one sentence

A dying galaxy rendered in deep darkness, pushed back by luminous, elegant technology — **light is hope, and the player carries it.**

Every screenshot should show that sentence: oppressive dark field, readable luminous actors, premium restraint.

## 2. Art direction

- **Style:** stylised science fiction. Premium digital illustration sensibility with simplified, silhouette-first gameplay assets. Explicitly not: realistic, cartoon, pixel art, anime.
- **Render character:** clean vector-like shapes, controlled glow (bloom used as *meaning*, §4 — never as decoration), subtle gradients, crisp rim light against darkness.
- **Inspiration boundaries:** the elegance of Mass Effect/Destiny, the atmosphere of No Man's Sky, the combat readability of Diablo IV / Hades / Vampire Survivors — studied, never imitated. The Afterlight test for every asset: *could this exist in another game?* If yes, redesign.

## 3. Colour language (binding tokens)

Colours are **design tokens** stored as data (`src/data/visual/palette` when code lands) per AF-001's no-magic-numbers rule. Code and assets reference token names, never raw hex.

### Primary (the identity)

| Token | Hex | Role |
|---|---|---|
| `space.black` | `#05060A` | The universe. Base background of nearly every frame |
| `space.blue` | `#101A38` | Midnight blue — nebulae, environment mid-tones, panel bases |
| `energy.violet` | `#9B5CFF` | Electric violet — the signature Afterlight accent: ancient power, rare moments, brand |
| `energy.white` | `#F4F7FF` | White energy — pure light, hope, maximum-emphasis highlights |

### Secondary (the vocabulary)

| Token | Hex | Role |
|---|---|---|
| `plasma.cyan` | `#3FD4F5` | Player technology: player shots, friendly systems |
| `shield.blue` | `#4D7CFF` | Shields — all shield states and displays (always paired with arc/ring grammar) |
| `vitality.green` | `#4DE868` | Healing and regeneration (always paired with cross/regen-tick motif) |
| `solar.gold` | `#FFC652` | Reward, XP, ancient technology warmth |
| `crystal.teal` | `#3FE0C0` | Crystal faction, restoration themes |
| `warning.orange` | `#FF8A3D` | Warning states, telegraph pre-phase, machine heat |
| `danger.red` | `#FF4054` | Damage, enemy threat, critical states |

> **Palette extension — Project Owner ruling, 2026-07-05 (via AF-004 review):** `shield.blue` and `vitality.green` added as dedicated pure hues; the shield role moved from `plasma.cyan` and the healing role from `crystal.teal`. Authorised modification of this locked output under the Constitution's Implementation Principles. `shield.blue` sits clearly apart from both `plasma.cyan` and `energy.violet`; shape-pairing cues are retained so no meaning rests on hue alone.

### Non-negotiable colour roles (readability law)

- **Player-owned effects are cool light** (`plasma.cyan` → `energy.white`). **Hostile effects are hot** (`danger.red` / `warning.orange`) or **void-violet-magenta**. A player must know whose projectile it is from colour alone, peripherally, in one frame.
- `danger.red` is *reserved*: it may never be used decoratively. If it's red, it can hurt you.
- Rarity ramp (loot, future modules must reuse): common `#B8C2D9` → uncommon `crystal.teal` → rare `plasma.cyan` → epic `energy.violet` → legendary `solar.gold`.
- Faction colours are constant everywhere (world, UI, map, lore): **Human** cyan/white · **Crystal** teal/prismatic · **Void** violet-magenta on black · **Ancient** gold/white · **Machine** orange/industrial grey `#6E7687`.
- Colour never carries meaning alone (colour-blind law): every colour role is paired with a shape or brightness cue (§5, §11).

## 4. Light language

- Light = technology, hope, power, progress. Darkness = corruption, unknown, void, decay.
- **Glow is earned:** only sources of power emit light (the player, energy weapons, tech, XP, portals). Environment stays matte and dark. This single rule creates the recognisable Afterlight frame — luminous actors on oppressive dark.
- Player power growth reads as *more light*: upgraded builds visibly brighten. Galaxy restoration reads as light returning to the map — the core fantasy told entirely through lighting.
- Bloom/glow intensity is a gameplay channel, so it's capped: nothing may glow brighter than its gameplay importance. (Photosensitivity: all glow/flash respects the reduced-effects setting, §11.)

## 5. Shape language (silhouette law)

Faction identity must survive a solid-black silhouette test at gameplay scale:

| Faction | Silhouette | Never |
|---|---|---|
| **Human** | Clean, angular, engineered — flat planes, chamfered edges, purposeful greebles | Organic curves |
| **Crystal** | Geometric, symmetrical, prismatic — hexagons, facets, mirror symmetry | Irregularity |
| **Void** | Organic, distorted, asymmetrical — tendrils, tears, broken symmetry | Straight edges |
| **Ancient** | Massive, elegant, timeless — long sweeping arcs, monumental scale, thin light seams | Clutter |
| **Machine** | Industrial, mechanical, functional — boxes, pistons, exposed joints | Elegance |

Gameplay-object grammar (constant across the game): **player ship** = sharp forward-pointing arrow silhouette, brightest object on screen · **enemies** = faction silhouette, red-tinted highlights · **projectiles** = simple geometric primitives (bolts, orbs, blades) never detailed · **loot** = small glowing geometric solids with rarity colour + beacon pulse · **hazards** = always outlined, never ambient-only.

## 6. Gameplay visual rules (renderer-enforced)

These are constraints on the VFX/render systems, not suggestions:

1. Permanent top-down camera (AF-000 lock). No perspective tricks that hide gameplay.
2. The player ship is never fully occluded — effects that would cover it are faded or displaced.
3. Enemy and hazard visibility beats every aesthetic effect; explosions/particles render *below* the actor layer or fade fast.
4. Boss and elite attacks are telegraphed with a standard grammar: **warning-orange outline shape during windup → danger-red fill at commit**. Same grammar everywhere, learned once.
5. Draw-layer order is fixed: background → environment → hazard telegraphs → loot → enemies → player → projectiles → critical UI-in-world (damage numbers, pings).
6. Screen-space effects (shake, flash, chromatic pulses) are capped and fully disabled by reduced-effects mode.

## 7. UI & HUD

- **Panel style:** near-black translucent panels (`space.black` at ~85%), 1px `space.blue`-tinted borders, thin `energy.violet` accent line on the active element. Generous spacing on an 8px grid. No skeuomorphism, no texture noise.
- **HUD answers questions, never decorates.** Fixed set (extended only by future modules): Health, Shield, Abilities, Ultimate, XP, Loot notifications, Objectives, Minimap. Anything else must displace nothing and justify itself through the Design Decision Matrix.
- Health = `danger.red`-to-white bar; Shield = `shield.blue`; XP = `solar.gold`; Ultimate = `energy.violet` (the signature colour marks the most exciting button).
- Desktop and mobile share one layout system: anchored corner clusters that scale (HUD scaling setting), touch-safe hit targets ≥ 44px on mobile.

## 8. Icon language

- Designed on a **24px grid**, must read at 16 / 24 / 32 / 48 / 64 px. Test at 16px first — if it fails there, it fails.
- One silhouette = one concept. Consistent 2px line weight (at 24px), single light direction (top-left), flat or single-step gradient fills from palette tokens only, no excessive detail.
- Icon shape reinforces category (colour-blind law): weapons angular, defence shield-arcs, research hexagonal, crafting anvil/forge motifs (Lightforge), movement chevrons.

## 9. Typography

- **One sans-serif family** with tabular (fixed-width) numerals for damage numbers, stats, and timers — number readability is a combat feature. Font must cover all supported languages; licensed for embedding (final family chosen at UI implementation module; recorded then in the asset sheet).
- Hierarchy (fixed scale): Title 32 · Header 24 · Body 16 · Numbers 16 tabular · Tooltip 14. All sizes respond to the font-scaling setting.
- Letterspacing is the premium cue: titles wide-tracked uppercase, body normal case. No decorative fonts anywhere, including the logo lockup.

## 10. Animation & motion

- UI animations **< 300ms**, standard ease-out, never bounce/elastic. Combat feedback is immediate (0-frame response, ≤ 100ms accent).
- Motion communicates: windup = telegraphed threat, flash = damage taken, pulse = pickup available, brighten = power gained.
- Scene transitions are elegant light-based wipes (light spreading / receding — on-theme), never hard cuts, always skippable in spirit: gameplay is never delayed by decoration.
- Reduced-motion mode replaces movement animations with fades/instant states, everywhere, no exceptions.

## 11. Accessibility (binding, from Constitution)

All shipped and tested from the first playable build, not retrofitted: colour-blind modes (protanopia / deuteranopia / tritanopia palette remaps of the token table — shape/brightness pairing in §3 makes these viable), UI scaling, font scaling, high contrast mode (pure-black backgrounds, brightened tokens, thickened outlines), reduced effects, reduced motion, photosensitivity-safe caps on flash/strobe, and **visual clarity mode** (strips all non-gameplay VFX to minimum readable set).

Because colours are data tokens (§3), every accessibility mode is a palette/parameter swap — architecture (AF-001) already supports it.

## 12. Branding

One identity system: **Afterlight** logo (wordmark in the display treatment of §9, violet-white light gradient) plus consistent sub-brands — **Galaxy Command** (strategy layer), **Research**, **Lightforge** (crafting), **Commander** (identity/progression). Sub-brands share the panel style, palette, and icon language; each gets one accent motif, never a separate visual world.

## 13. Quality control (every asset, every time)

Does it match Afterlight? Is it readable? Does it improve gameplay? Is it visually consistent? **Could it exist in another game?** — if that last answer is yes, redesign until it couldn't be. This checklist is part of every future asset sheet's QA.

---

## Internal review loop (AF-002, recorded)

- **AF-000 comparison** — perspective lock honoured (§6.1); readability pillars restated as enforceable renderer rules. ✔
- **Readability / gameplay clarity** — ownership-by-colour law, reserved red, fixed draw order, standard telegraph grammar. ✔
- **Silhouettes** — five-faction silhouette law with a black-silhouette test; gameplay-object grammar fixed. ✔
- **Colour language** — full token table with hex values, stored as data per AF-001; roles non-negotiable. ✔
- **UI consistency** — one panel style, one grid, one icon grid, one type scale, shared desktop/mobile layout. ✔
- **Branding** — one system, four sub-brands, single visual world. ✔
- **Accessibility** — all Constitution-mandated modes specified as token/parameter swaps, feasible by architecture. ✔
- **Simplification pass** — rejected a second accent colour family and a decorative display font (identity through restraint: violet + glow-is-earned carries the brand); capped bloom as a readability rule rather than adding per-effect exceptions. ✔
- **Identity test** — dark field + earned glow + violet signature + faction silhouettes = a frame no other game produces, while every element remains readable. ✔

**Internal quality score: 9.5/10 — approved.**
