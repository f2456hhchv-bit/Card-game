# debug — dev-build instrumentation (AF-001 §4)

**Purpose:** Make every framework law observable (AF-016 §10). Dev builds only — guarded by `import.meta.env.DEV` at the call site, excluded from production bundles.

**Responsibilities:** Debug overlay (state, overlays, run phase, seed, difficulty, build, session timer, FPS, transition time vs 250ms budget, dropped sim time).

**Dependencies:** DOM only; reads snapshots handed to it — it never reaches into systems.

**Events:** none published; consumers pass snapshots.

**Extension points:** future panels (UI census AF-005 §12, asset panel AF-006 §12, colour panel AF-008 §11, readability panel AF-004 §11) attach as additional overlay sections as their systems land.

**Known limitations:** memory display depends on platform API availability (`performance.memory` is non-standard); shown where available.
