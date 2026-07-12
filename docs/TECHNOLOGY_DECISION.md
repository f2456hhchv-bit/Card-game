# AFTERLIGHT — Technology Decision Record

**Status:** APPROVED by Project Owner — 2026-07-05. Rendering/art-style amended by Project Owner — 2026-07-09, clarified 2026-07-12 (see amendments below).
**Authority:** Extends the Master Constitution (docs/CONSTITUTION.md). May only be revised by the Project Owner.

---

## Decision

Afterlight is built as a **web game**:

- **Language:** TypeScript
- **Rendering:** WebGL, real-time 3D (amended 2026-07-09 — see below); the current codebase's actual rendering (a 2D `CanvasRenderingContext2D` context, confirmed by AF-094) predates and does not yet reflect this amendment
- **Hosting (now):** GitHub Pages — free, public URL, zero server cost
- **Offline:** Progressive Web App (PWA) — after first visit the game runs fully offline, saves included, installable on desktop and mobile
- **Online (later):** optional backend layer on a free tier (e.g. Cloudflare / Supabase) for community features; the offline game never depends on it
- **Steam / Steam Deck (later):** Tauri desktop wrap of the same codebase — no rewrite

## Why

1. **Free hosting, forever** — Project Owner requirement. GitHub Pages costs nothing and distributes the game as a link: no download, no install, no account.
2. **Complete offline gameplay** (Constitution: Player Promise) — satisfied via PWA; the game is fully self-contained on the player's device.
3. **Optional online enhancements** (Constitution: Player Promise) — connectivity is an added layer, never a dependency. A community backend attaches later without rewriting the core.
4. **Platform targets** (Constitution: Performance Philosophy) — desktop browsers reach 120 FPS for disciplined 2D rendering; mobile plays via browser/PWA from day one; Steam Deck arrives via the Tauri wrap.
5. **Technical Philosophy alignment** — everything stays code: modular, data-driven, event-driven, inspectable, documented. No editor lock-in.

## Constraints this decision imposes

- The simulation core must be **platform-agnostic and self-contained** (no assumption of network, no coupling to the DOM beyond the rendering/input boundary).
- Performance disciplines are mandatory from the first module: object pooling, minimal per-frame allocation, asynchronous loading.
- All game content is **data-driven** so future online/community layers can consume the same definitions.

## Trade-offs accepted

- Console ports would be a separate future project (not excluded, not planned).
- No third-party engine editor tooling; Afterlight builds its own focused tools where needed.

## Amendment — 2026-07-09 (Project Owner)

**Primary art style: Nintendo-inspired stylized 3D mobile game art — chibi proportions, clean hand-painted textures, soft PBR lighting.**

This supersedes AF-002/AF-092's prior 2D-flavoured art-style vocabulary (`nasaRealism`/`hardScienceFiction`/`optimisticFuturism`/etc. in `ART_STYLE_INFLUENCES`) wherever it conflicts, and requires a real 3D rendering pipeline (mesh/material/lighting, most likely a WebGL2-based engine such as Three.js rather than the raw-WebGL "no heavyweight engine" framing above) in place of the current ad hoc 2D Canvas renderer AF-094 found in `main.ts`. Scope and sequencing for the rendering-layer migration and the AF-002/092 art-direction revision are tracked separately, pending Project Owner direction on how to phase the work.

## Amendment — 2026-07-12 (Project Owner) — render-style clarification, not a pivot

**Chibi proportions and the 3D pipeline direction above stand unchanged.** This amendment replaces "clean hand-painted textures, soft PBR lighting" with a flat **toon/cel-shaded** render treatment and a companion bold, chunky VFX/UI language — confirmed explicitly by the Project Owner as a *clarification* of the 2026-07-09 ruling, not a pivot away from 3D/chibi. Where the two amendments conflict on shading specifically, this one governs; chibi proportions, mesh-based 3D geometry, and the rendering-pipeline requirement (Three.js or equivalent, replacing the ad hoc 2D Canvas renderer) are untouched.

**The Visual Style Rules (verbatim, Project Owner's own numbering):**

1. Shapes are rounded and chunky. No 1px lines, no sharp rectangles. Minimum corner radius on any UI panel or bar. Health bars, buttons, frames all have visible thickness.
2. Colour is saturated and flat. No gradients longer than a subtle two-stop. No desaturated greys except the defined rarity/faction colours. Use the loot-tier hex values as the canonical accent palette.
3. VFX are bold and brief. Particles are large, few, and rounded — fat circles, chunky stars, thick rings. Never fine dust, never realistic smoke, never lens flares. Additive glow is allowed but clipped tight to the source.
4. Outlines over realism. Where an entity needs separation from the background, prefer a soft dark outline or drop-glow, never a realistic shadow.
5. Text is chunky and friendly. Rounded, heavy-weight type for damage numbers and headers. No thin or condensed faces anywhere in gameplay.
6. Status effects tint, they don't texture. Burn = warm orange tint + fat ember particles; freeze = pale blue tint + chunky frost ring. A tint plus one particle loop, never a material change.
7. Nothing gritty. No scratches, film grain, chromatic aberration, vignettes, or screen dirt. The camera is clean.
8. Readability beats fidelity. Any effect that obscures the player ship or enemy silhouettes for more than ~200ms gets scaled down. The silhouette is sacred.

**Litmus test for any new visual element:** shrink it to 32px. If you can't tell what it is, redesign it.

**Reading guide — what this governs vs. what it doesn't:**
- Rules 1, 5 govern **UI chrome** (panels, bars, buttons, type) directly — no 3D pipeline needed to start applying these to the existing DOM-rendered menus today.
- Rules 2, 4, 6 govern **material/shading treatment on the chibi-3D models** once the rendering pipeline (still unbuilt) lands — flat colour bands + rim-outline/drop-glow instead of PBR gradient falloff, exactly the toon-shading technique many stylized mobile 3D games use instead of full PBR.
- Rules 3, 7, 8 govern **VFX and camera treatment** — chunky/rounded particles, no post-processing grit, and a hard readability ceiling (silhouette-obscuring effects capped at ~200ms) that applies regardless of whether the underlying renderer is 2D or 3D.
- The **loot-tier hex values** referenced in rule 2 are AF-007's locked rarity ladder (`RARITY_TABLE` in `src/game/loot/lootTuning.ts`) — already-canonical, not new colours to invent.

Scope and sequencing for actually building the rendering pipeline and applying this style remain tracked separately (AF-095+), unchanged by this amendment — this records the *decision*, not an implementation.
