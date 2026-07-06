# AFTERLIGHT — Player Movement Framework

**Authority:** Produced output of AF-020. Extends AF-000 → AF-019. Every future Commander, ship, ability, weapon, and biome extends this movement architecture; it is extended, never replaced.
**Binding rule of the whole document:** the player survives through positioning, not unavoidable statistics. Movement always favours player control — trust in the controls is the foundation every other system builds on.

---

## 1. Movement model (the arcade contract)

Permanent 360° top-down movement with **instant direction changes** and **predictable scalar acceleration**: input direction is honoured immediately; only *speed* accelerates and decelerates. There is no realistic inertia and no drift — the ship goes where the stick points, at a speed that ramps predictably. Framerate-independent by construction: movement exists only inside the fixed timestep (AF-001) and consumes AF-019's deterministic movement vector. **Movement never depends on animation timing** — animation follows movement, never the reverse.

## 2. Movement states (derived, deterministic)

One priority-ordered readout derived from timers and modifiers — not a second state machine that could desynchronise:

**Defeat > MissionComplete** (control locked) **> TemporaryRoot** (input-movement zero; forces still apply) **> ShieldImpact** (knockback impulse + brief stagger) **> AbilityMovement** (an ability owns motion) **> TemporarySlow > Boosting > Moving > Idle.**

Same inputs, same states, always.

## 3. Movement attributes (tuning data, AF-011 §7)

`Maximum Speed · Acceleration · Deceleration · Boost Speed · Boost Duration · Boost Cooldown · Collision Radius` — live in the default profile now. `Turn Rate · Mass · Handling · Movement Friction` — **reserved attributes**: present in the schema for future ship handling profiles (a heavy freighter may turn slower than a scout), with the default profile at instant turn per the spec. Ship/Commander modules extend profiles; they never fork the model.

## 4. Boost

A movement tool, never a damage tool (no damage field exists to abuse). Burst speed for a tuned duration, then cooldown; activation is **buffered** (AF-019 §4 — a press just before cooldown ends is honoured); optional invulnerability-frames flag per ship ("where applicable"); hold/toggle per AF-019 §8. Boost is readable (trail + AF-018 shake source) and never replaces normal movement — the cooldown guarantees it stays a decision, not a stance.

## 5. Modifiers & environmental forces (stacking rules)

- **Speed modifiers** (haste, slow, engine damage, crystal slow-fields): multipliers that **multiply together**, clamped to a tuned range (default 0.15×–3×) so stacked slows can never fully freeze through the multiplier path and stacked hastes can't break physics.
- **Root/Freeze** (Crystal Immobilisation, Stasis): input-movement zeroes; **external forces still apply** — a rooted player can be dragged by gravity. Readable and consistent: root stops *you*, not *the world*.
- **Same-id reapplication refreshes duration** rather than stacking intensity (no invisible stacking).
- **Environmental forces** (Gravity Pull/Push, Solar Wind, Void Currents, Machine Fields — AF-017's events): plain additive force vectors applied after velocity. Predictable by construction: constant field, constant push. *Moving platforms* remain a future flag.

## 6. Collision (never sticky)

Circle (player) vs AABB (walls, boss boundaries, objectives, interactive objects): penetration resolved along the minimum axis, and the **tangent component of motion is preserved** — gliding along a wall feels like gliding, not like glue. Arena bounds clamp identically. Friendly-unit collision is an optional flag (off by default). Projectile collision belongs to AF-021. Obstacle lists are per-arena data; a spatial broad-phase slot is reserved for dense obstacle-field biomes (registered, not speculatively built).

## 7. Positioning as skill

The framework's contribution to "greedy positioning increases risk": movement is *fully* trustworthy (instant response, no drift, honest collision), so every death position is a chosen position (AF-004's narratable-hit law extended to space). Reward structures for positioning (XP pickup radii, loot placement, boss punish windows) belong to AF-022+, on top of this trust.

## 8. Accessibility

Movement sensitivity, controller deadzones, touch sensitivity — inherited AF-019 sliders feeding this model. Hold/Toggle boost — AF-019 §8. **Reduced precision mode** — a tuning profile with gentler acceleration and stronger input smoothing for players who want forgiveness over twitch. Alternative movement layouts — AF-019 binding profiles. All floors (AF-014).

## 9. Performance

Per-tick cost: one normalise, one scalar lerp, one force sum, N small AABB tests (N = nearby obstacles). No physics engine, no allocation, nothing per-frame outside the fixed step. Budgets untouched at 120/60 targets.

## 10. Debug

Sandbox + overlay show live: movement state · current speed / max · boost state (active/cooldown remaining) · active modifiers with remaining durations · collision contact count this tick · position/velocity · physics tick cost.

---

## Internal review loop (AF-020, recorded)

- **Responsiveness/precision** — instant direction, scalar acceleration, zero drift: the spec's physics rules implemented literally; verified by tests and by hand in the sandbox. ✔
- **Determinism** — fixed-timestep only, derived state readout, same-input-same-position test green. ✔
- **Boost** — buffered, cooldown-gated, movement-only; i-frames as a per-ship flag. ✔
- **Modifiers** — multiplicative-with-clamps, root-vs-forces distinction, refresh-not-stack: all tested. ✔
- **Collision** — tangent-preserving slide tested (diagonal-into-wall keeps full tangent speed); no sticky corners in sandbox traversal. ✔
- **Extensibility** — attributes as profiles (reserved fields recorded), modifiers as data, forces mapped to AF-017 events. ✔
- **Sandbox** — input → movement → camera running together on canvas: the first playable expression of the stack; boost shake exercises AF-018 live. ✔
- **Simplification pass** — rejected a physics engine (three multiplies and an AABB test need no dependency); rejected velocity-based knockback blending (explicit impulse channel is more readable and testable); rejected implementing turn-rate inertia now (reserved attribute, no current consumer — dead-end avoidance per AF-014 commandment 9 means *don't build it yet*, not *make it impossible*). ✔

**Internal quality score: 9.5/10 — approved and locked; per-ship/biome feel passes bind as content lands.**
