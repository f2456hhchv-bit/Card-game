# movement — Player Movement (AF-020, game layer)

**Purpose:** The foundation of skill expression: survival through positioning. Arcade movement contract — instant direction, predictable scalar acceleration, zero drift.

**Responsibilities:** Movement simulation (fixed timestep only), boost (buffered, cooldown, optional i-frames), knockback impulse channel with stagger, modifier stacking (multiplicative speed with clamps; root vs forces distinction; refresh-not-stack), environmental force vectors, circle-vs-AABB sliding collision, bounds clamping, derived deterministic state readout.

**Dependencies:** `core` types + `engine/camera` WorldBounds type. Input arrives as a plain vector (AF-019's smoothed movement) — this system never reads devices.

**Events:** none yet — combat modules (AF-021+) will publish movement-relevant facts (boost used, collision, rooted) as they gain consumers.

**Data structures:** `MovementProfile` (`movementTuning.ts` — the tuning surface incl. reserved turnRate/mass/handling/friction for ship profiles), `MovementModifier`, `Obstacle`, `MovementSnapshot`.

**Extension points:** ships/Commanders supply their own `MovementProfile`; biomes supply obstacle lists and environmental force modifiers (mapped to AF-017 events); abilities use `setAbilityMovement` and `applyImpulse`; a spatial broad-phase slot is reserved for dense obstacle biomes.

**Known limitations:** projectile collision belongs to AF-021; moving platforms are a future flag; per-ship feel passes bind when ships exist.
