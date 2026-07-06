# DR-001 — Technology stack: TypeScript + WebGL web game

**Reason:** Project Owner requirement for free hosting; Constitution requirements for complete offline play, optional online layer, and desktop/Steam Deck/mobile targets.
**Alternatives considered:** Godot (strong 2D engine, weaker web export, editor dependency); Unity (licensing, weight); native engines (no free web distribution).
**Chosen solution:** TypeScript + WebGL purpose-built core, Vite build, GitHub Pages hosting, PWA offline, Tauri wrap later for Steam. Full record: `docs/TECHNOLOGY_DECISION.md`.
**Trade-offs:** console ports become a separate future project; we build our own tooling instead of using an engine editor (aligned with the data-driven Technical Philosophy).
**Dependencies:** everything — this is the root technical decision (AF-001 architecture assumes it).
**Future review:** revisit if a Steam release (Tauri wrap) or console port is scheduled.
**Status:** Approved by Project Owner, 2026-07-05.
