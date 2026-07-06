# input — Input Framework (AF-019, engine layer)

**Purpose:** Actions, never keys. One device-agnostic action core; thin adapters per device. Controls that disappear into muscle memory.

**Responsibilities:** Action vocabulary + edges (`ActionInput`), context gating (system/gameplay/secondary classes), input buffering, deterministic deadzoned/smoothed movement vector, rebinding with validation (duplicates, unreachable actions, soft locks), hold/toggle modes; adapters for keyboard/mouse (event-driven), gamepad (polled, hot-swap, layout prompts), touch joystick (pure math).

**Dependencies:** `core` types only; adapters touch the DOM/Gamepad APIs and nothing else.

**Events:** none directly — gameplay systems query `isDown` / `wasPressed` / `consumeBuffered` / `movement` inside the fixed timestep; the composition root maps game state to `setContext`.

**Data structures:** `GameAction`, `ACTION_CLASS`, `CONTEXT_PERMISSIONS`, `BindingProfile`, `InputTuning` (`inputTuning.ts` — the complete tuning surface), `BindResult`.

**Extension points:** new devices = new adapters emitting binding codes; new actions = vocabulary additions via module review; layouts/prompts are data maps; binding profiles persist in the settings save slice when the save system lands.

**Known limitations:** touch DOM adapter (buttons/regions) arrives with the mobile UI pass; haptics arrive with platform feedback work; targeting assistance is AF-021's to implement under this module's never-override-intent law.
