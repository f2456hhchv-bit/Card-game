# AFTERLIGHT — Art Direction & Visual Production Standard

**Status: PERMANENT PROJECT STANDARD (set by the project owner).**
Visual quality is a **primary success criterion**, equal to gameplay and
performance. This document is the durable record of that directive so it persists
across the autonomous development loop. Read it at the start of every cycle and
finish every cycle with an **Art Polish Pass** (see end).

## The bar
Production quality comparable to **Survivor.io, Archero, Soul Knight, Brotato,
Vampire Survivors** — modern stylised 2D, hand-crafted appearance, strong
silhouettes, bold-but-controlled palette, consistent lighting & scale, high
readability under chaos, professional animation. Every asset must feel
**intentionally designed**, never "procedurally assembled" or programmer-art.

## Asset policy (hard rule)
Primitive circles/rectangles/polygons or flat colour placeholders are **not
acceptable as finished assets**. When art is missing:
1. Build/keep the framework that lets production art drop in without refactoring.
2. **Mark the asset as `requires production art`** in `ArtManifest`
   (`src/game/render/ArtManifest.ts`) with a quality tier.
3. Never sign a primitive shape off as "done".

### Honest constraint note
This project is built offline with **original, non-copyrighted** assets and no
external artist in the loop. Truly hand-painted sprite sheets require either an
artist or a generated-image pipeline. Until those land, the strategy is:
- Push the **procedural + shader-style rendering** (multi-pass baked sprites,
  lighting, bloom, grading, VFX, animation) to the highest achievable bar, and
- Treat every procedural sprite as a **PLACEHOLDER tier** in the manifest that a
  production PNG/atlas will replace through the same `SpriteForge`/atlas seam.

## Rendering pipeline — target capabilities
Tracked, with current status (▢ todo · ◐ partial · ✓ done):
- ✓ Baked multi-layer sprites (SpriteForge) — blit, not per-frame vectors
- ✓ Atmospheric layered background (nebula + parallax starfield + fog + vignette)
- ◐ Post-processing: **bloom** ✓ · colour grading ◐ · screen flash ✓
- ▢ Animation state machine (idle/walk/attack/hit/death) + blending
- ▢ Sprite atlases + atlas loader (production-art seam)
- ◐ Dynamic/additive lighting (glow halos ✓, true dynamic lights ▢)
- ◐ Soft shadows (grounding shadow ✓, soft/normal-mapped ▢)
- ◐ Particle VFX library (sparks/rings ✓ → smoke/dust/fire/trails ▢) + batching ▢
- ▢ Normal maps / shader support (Canvas2D limits — WebGL backend is the seam)

## Per-domain checklists
**Heroes** — unique silhouette, proportions, signature colours, personality;
idle/walk/attack/ability/hit/death anim; shadow, outline, lighting response, FX.
No two heroes alike; recognisable from silhouette alone.
**Enemies** — unique silhouette, movement, attack, theme; idle/spawn/death anim;
damage feedback; distinct colour language; planned SFX. No lazy recolours.
**Bosses** — large recognisable silhouette; multi-stage anim; multiple phases;
signature FX; entrance + death sequence; unique palette; environment interaction.
**Environment** — layered/parallax backgrounds, decorative + animated scenery,
dynamic lighting, ambient FX, shadows, weather where apt, depth. Never flat.
**VFX** — hit sparks, impact flashes, explosions, smoke, dust, fire, electricity,
energy/weapon trails, heal/buff/debuff, crit FX, shake, screen flash, bloom.
**UI** — styled panels, animated menus, smooth transitions, hover, responsive,
quality icons, consistent type, rarity colour, portraits, item art, animated toasts.

## Art Manifest
`src/game/render/ArtManifest.ts` registers every visual asset with a **quality
tier** (`placeholder` | `procedural-final` | `production`) and notes. The
end-of-cycle Art Polish Pass updates tiers and drives the next priorities.

## End-of-cycle Art Polish Pass (required)
Every cycle, review & improve: readability, animation quality, visual
consistency, lighting, colour balance, effects, shadows, environmental richness,
character individuality, boss presentation, UI polish. Keep going until the game
reads as a commercial indie title, not a prototype. A feature whose presentation
is below this bar is **not done**.
