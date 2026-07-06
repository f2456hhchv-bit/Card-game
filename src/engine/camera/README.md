# camera — gameplay camera (AF-018, engine layer)

**Purpose:** Battlefield awareness. Top-down orthographic camera as a gameplay communication tool — follow, zoom modes, shake, bounds. No rotation exists (AF-000 perspective lock is structural).

**Responsibilities:** Soft follow with predictive look-ahead and never-outrun lag clamp; locked gameplay zoom with smooth-returning mode zooms; impulse shake with decay, clarity cap, and accessibility scale; world-bounds clamping.

**Dependencies:** none beyond its own tuning data (engine layer; consumes positions handed to `update`).

**Events:** none directly — the composition root maps `GameStateChanged` to `setMode` and feedback events to `shake(source)`.

**Data structures:** `CameraTuning` (`cameraTuning.ts` — the complete tuning surface), `CameraSnapshot`, `WorldBounds`.

**Extension points:** new modes / shake sources are tuning-data rows; the renderer consumes `snapshot` (position, zoom, shake offset) with GameLoop interpolation alpha; boss/biome modules must size arenas against the locked gameplay zoom (composition contract).

**Known limitations:** headless until the renderer and movement (AF-020+) land; screen effects (flashes, fades) belong to the renderer, not the camera.
