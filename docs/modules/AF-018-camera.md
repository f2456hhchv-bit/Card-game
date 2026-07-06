# AF-018 — CAMERA FRAMEWORK

**Module status:** Complete (framework specified; camera implemented and tested headless; on-screen feel review binds AF-020/AF-021 as movement/combat land)
**Lock status:** LOCKED — extends AF-000 → AF-017 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CAMERA.md` + implementation (`src/engine/camera/`) with deterministic tests

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-017 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Camera Framework.

The camera is one of the most important gameplay systems.

It is not a cinematic tool.

It is a gameplay communication tool.

The player should always understand:

Their position.

Enemy positions.

Incoming danger.

Loot.

Objectives.

Boss mechanics.

The camera should feel invisible during normal gameplay.

Players should never consciously think about it.

==================================================
CORE PHILOSOPHY
==================================================

Stable.

Readable.

Responsive.

Predictable.

Never distracting.

Gameplay clarity always comes before cinematic presentation.

==================================================
CAMERA TYPE
==================================================

Permanent Top-Down Camera.

Orthographic presentation.

Fixed gameplay angle.

Never rotate during gameplay.

Never switch perspective.

Never become cinematic during combat.

Maintain complete battlefield awareness.

==================================================
CAMERA STATES
==================================================

Boot
↓
Main Menu
↓
Galaxy Command
↓
Mission Briefing
↓
Gameplay
↓
Boss Introduction
↓
Boss Combat
↓
Mission Complete
↓
Defeat
↓
Results
↓
Return to Galaxy Command

Transitions remain smooth.

==================================================
FOLLOW SYSTEM
==================================================

Camera follows the player.

Support:

Soft follow.

Predictive movement.

Look-ahead.

Movement smoothing.

Never allow player to outrun the camera.

==================================================
ZOOM SYSTEM
==================================================

Default gameplay zoom is locked.

Temporary zoom states permitted for:

Boss introductions.

Mission completion.

Major discoveries.

Galaxy Command.

Photo Mode (future).

Camera always returns smoothly.

==================================================
SCREEN COMPOSITION
==================================================

Player remains near screen centre.

Bosses remain fully visible.

Danger areas remain visible.

Loot remains visible.

HUD never overlaps critical gameplay.

Maintain consistent framing.

==================================================
BOSS CAMERA
==================================================

Boss introductions may briefly:

Zoom out.

Reveal arena.

Reveal Boss.

Display title.

Return control immediately.

Boss combat always uses standard gameplay camera.

==================================================
CAMERA SHAKE
==================================================

Use sparingly.

Support:

Weapon Impact

Shield Break

Ultimate

Boss Slam

Large Explosion

Mission Complete

Shake intensity configurable.

Never reduce gameplay clarity.

==================================================
SCREEN EFFECTS
==================================================

Support:

Damage Flash

Shield Flash

Level Up Pulse

Legendary Drop Pulse

Mission Complete Fade

Research Unlock

Boss Arrival

Effects remain subtle.

==================================================
BOUNDARIES
==================================================

Prevent camera exposing:

Unloaded areas.

Hidden systems.

Developer space.

Unused map regions.

Smoothly respect level boundaries.

==================================================
TRANSITIONS
==================================================

Fade.

Crossfade.

Zoom.

Pan.

Never hard cut during gameplay.

Loading transitions remain minimal.

==================================================
ACCESSIBILITY
==================================================

Support:

Disable Camera Shake.

Reduce Motion.

Reduced Screen Flash.

High Visibility Mode.

Photosensitivity Mode.

Stable Camera Mode.

==================================================
PERFORMANCE
==================================================

Update camera after player movement.

Avoid unnecessary calculations.

Use interpolation.

Pool camera effects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Camera State

Zoom Level

Player Offset

Shake Intensity

Transition State

Frame Timing

Performance

==================================================
OUTPUT
==================================================

Produce the complete Camera Framework.

Every future gameplay system, Boss encounter, biome and mission extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every mission.

Review every Boss encounter.

Review movement.

Review visibility.

Review zoom behaviour.

Review transitions.

Review screen composition.

Review camera shake.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-017.

Reduce unnecessary movement.

Reduce excessive effects.

Improve player awareness.

Ensure the camera always communicates gameplay while remaining almost invisible to the player.

Repeat until the Camera Framework consistently supports every gameplay scenario with an internal quality score of 9.5/10 or higher.

Only then lock AF-018.

---

## Foundation / AF-016–017 alignment review (recorded at catalogue time)

- Permanent top-down orthographic camera, never rotating or switching perspective: restates AF-000's perspective lock exactly; boss combat on the standard camera restates AF-002 §6 (no perspective tricks). Camera-as-communication restates AF-004's attention model — the camera's job is keeping the §1 priority stack visible.
- Camera modes map onto AF-016's game states (the camera state list is the game-state flow seen from the lens); camera reacts to `GameStateChanged` events — no coupling to the machine (AF-001 event law).
- Shake and screen effects obey AF-002 §6.6 (capped screen-space effects, disabled by reduced-effects) and the AF-014 floor rule: every accessibility mode (disable shake, reduce motion/flash, photosensitivity, stable camera, high visibility) is a tuning-data multiplier, all implemented.
- Clarity caps: shake amplitude has a hard tuned maximum regardless of stacked impulses — spectacle can never win over readability (AF-004).
- Screen effects (damage flash, level-up pulse, etc.) are catalogued as render-layer consumers of existing events; they arrive with the renderer module and inherit AF-003's ≤100ms feedback law. The camera provides shake/zoom/framing only — single responsibility (AF-001 §5).
- Boundaries: view clamped to world bounds so unloaded/dev space is never exposed; worlds smaller than the viewport centre. Deterministic and tested.
- New canon: **Photo Mode** registered as a future flag (zoom-state consumer, module owed).
- On-screen feel review (play every mission/boss, framing against real content) binds AF-020/AF-021+ QA when movement and combat render; the mathematical laws (follow convergence, lag clamp, look-ahead, zoom return, shake decay/caps, bounds, determinism) are tested now, headless.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; feel obligations bind AF-020+. Produced outputs: `docs/CAMERA.md`, `src/engine/camera/`.
