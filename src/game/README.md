# game — gameplay layer (AF-001 game layer)

**Purpose:** Afterlight's gameplay systems and state definitions, built on `core` (and `engine` once rendering lands).

**Responsibilities:** AF-016 game states + legal-transition table (`states/`), run session records and lifecycle phases (`session/`).

**Dependencies:** `core` only (layer law: gameplay features never import each other — they communicate via the Event Bus).

**Events:** publishes `RunPhaseChanged`, `RunEnded` (via composition root today; via owning systems as AF-017+ land).

**Data structures:** `GameStateId`, `GAME_TRANSITIONS`, `OVERLAY_HOSTS`, `RunPhase`, `RunConfig`, `RunSessionRecord`.

**Extension points:** AF-017 → AF-026 attach per `docs/CORE_GAMEPLAY.md` §8 — new systems register with `GameManager`, pin to run phases, and extend the transition table only through module review.

**Known limitations:** all screens are placeholders in `main.ts`; combat, input, camera, and rendering arrive with their modules.
