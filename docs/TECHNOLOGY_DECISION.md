# AFTERLIGHT — Technology Decision Record

**Status:** APPROVED by Project Owner — 2026-07-05. Rendering/art-style amended by Project Owner — 2026-07-09 (see amendment below).
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
