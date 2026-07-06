# AFTERLIGHT — Input Framework

**Authority:** Produced output of AF-019. Extends AF-000 → AF-018. Every future gameplay mechanic integrates with this architecture; it is extended, never replaced.
**Binding rule of the whole document:** gameplay code binds **actions, never keys** (AF-001 input law). Controls succeed when they disappear into muscle memory — the player never fights them.

---

## 1. Architecture (device-agnostic core + thin adapters)

```
Keyboard/Mouse ─┐
Gamepad ────────┤→ device ADAPTERS (thin, browser-facing) → ACTION CORE (pure, tested)
Touch ──────────┘        raw events / axis values             actions · edges · buffer ·
Future devices ─┘                                             movement vector · gating
                                                                    ↓
                                                       gameplay systems (fixed timestep)
```

- The **action core** (`ActionInput`) is pure TypeScript: no DOM, fully deterministic, testable headless. Adapters translate device events into binding activations and analogue axis values — nothing else. A future console controller, accessibility device, or cloud-streaming source is *one new adapter*; the game never changes.
- Every device shares identical gameplay rules because every device speaks the same action vocabulary.

## 2. Action vocabulary & priority

Actions (canonical set, extended only by module review): **Movement** (axis) · **Boost · CommanderAbility · Ultimate · Pause · Interact · MissionMap · InventoryOverlay · StatisticsOverlay** · *QuickPing (future) · PhotoMode (future)* · **DevConsole** (debug builds only).

Three priority classes with **context gating** (evaluated in the core, so lower classes structurally cannot fire when suppressed):

| Class | Actions | gameplay ctx | overlay ctx | menu ctx |
|---|---|---|---|---|
| **System** | Pause | ✔ | ✔ | ✔ |
| **Gameplay** | Movement, Boost, CommanderAbility, Ultimate, Interact | ✔ | — | — |
| **Secondary** | MissionMap, InventoryOverlay, StatisticsOverlay | ✔ | — | ✔ |

The context follows the AF-016 state machine (Gameplay base → `gameplay`; overlays → `overlay`; everything else → `menu`). Inputs never block higher classes: Pause always works.

## 3. Movement

360° analogue (stick/touch joystick) and digital (keys) through one pipeline, computed **in the fixed-timestep update** so movement is deterministic (same event sequence → same vector sequence, always):

1. Analogue input passes a **radial deadzone with rescaling** (no dead ring, no snap at the deadzone edge), then a sensitivity curve.
2. If analogue magnitude is zero, digital keys synthesise the vector (normalised diagonals).
3. The result smooths exponentially at a tuned rate toward the target (framerate-independent; Stable/accessibility profiles can set smoothing to instant).

Deadzone, sensitivity, and smoothing are player sliders (tuning data).

## 4. Buffering

Bufferable actions — Boost, CommanderAbility, Ultimate, Interact, menu opens — record their press at sim-time; gameplay systems call `consumeBuffered(action)` and receive the press if it landed within the tuned window (default 150ms). A press during a state transition, a level-up overlay close, or one frame before an ability comes off cooldown is honoured, not lost. Window per action class is tuning data.

## 5. Rebinding & validation

Every action is fully rebindable on every device (keyboard, mouse buttons, controller buttons, touch layout), with alternative profiles persisted permanently (settings save slice). The validator enforces, with recovery information on every rejection:

- **No duplicate bindings** — binding a code already in use returns the conflicting action (the settings UI offers swap/replace, per AF-003 error prevention).
- **No unreachable actions** — an action can never lose its last binding.
- **No menu soft locks** — Pause must always have at least one binding on every connected device class.
- Invalid combinations rejected at bind time, never discovered at play time.

## 6. Devices

- **Keyboard + mouse:** event-driven (keydown/keyup/mousebutton), zero polling cost.
- **Controllers:** Gamepad API polling once per frame; Xbox/PlayStation/Nintendo/Steam Input layouts are prompt-map data; **dynamic button prompts** come from the active device's layout map; **hot-swap** without restart (last-used device wins, prompts update live). Adaptive controllers work by construction — any device the platform exposes maps to bindings.
- **Touch:** dynamic or fixed virtual joystick (pure math class, tested), resizable/repositionable buttons with opacity control, generous targets (≥44px, AF-002); *one-handed mode* is a future layout profile.
- **Haptics/feedback:** visual (existing AF-003 feedback law), audio (audio module), vibration/haptics per platform API — all behind one intensity setting (0 disables).

## 7. Targeting (philosophy registered; implementation = AF-021)

Automatic and smart targeting, controller/touch assisted aim, future manual aim and target filters — with one law that binds AF-021: **targeting never overrides player intent.** Assistance selects among what the player is plausibly aiming at; it never fights the stick.

## 8. Accessibility

Hold/Toggle per action (any held input can latch instead) · full remapping (§5) · reduced button repetition — registered as a *design constraint on future ability/weapon modules*: no mechanic may require rapid repeated presses as its only input · alternative layouts as profiles · sensitivity + deadzone sliders · single-button alternatives where a combination would otherwise be required. All floors (AF-014) — none tradeable.

## 9. Performance & latency

Event-driven where the platform allows (keyboard/mouse/touch), single poll per frame where it doesn't (gamepads). Adapter → core writes are O(1) state updates; the core's per-update work is edge promotion and one smoothing step. **Latency budget: <16ms** — device event to action visibility is same-frame; at 60Hz fixed timestep the worst case is one sim tick. No allocation in the input path (buffer entries reuse a small ring).

## 10. Debug

Debug overlay input line (live now) plus the input panel as UI lands: current device · move vector · last action + edge · buffered inputs with ages · active context · deadzone visualisation · controller/touch raw state · input-path cost.

## 11. Tuning surface (AF-011 §7 law)

`inputTuning` data: deadzone radius · sensitivity curve · movement smoothing rate · buffer windows · toggleable-action set · touch joystick radius/mode · haptic intensity · context permission table · default binding profiles per device. Feel is a data edit.

---

## Internal review loop (AF-019, recorded)

- **Actions-not-keys** — gameplay can only consume actions; raw codes exist solely inside adapters and binding tables. ✔
- **Priority/gating** — context permission table makes suppressed input structurally impossible; Pause always reachable, validated. ✔
- **Movement** — radial deadzone with rescale, digital synthesis, deterministic smoothing in fixed timestep; all tested. ✔
- **Buffering** — sim-time window, consume semantics, expiry; tested including press-before-ready cases. ✔
- **Rebinding** — duplicate/unreachable/soft-lock prevention with conflict info returned; tested. ✔
- **Hold/Toggle** — per-action latch mode; tested. ✔
- **Devices** — adapter seam proven by three adapters of three shapes (event keyboard, polled gamepad, math joystick); future devices are new adapters only. ✔
- **Simplification pass** — rejected a per-device action vocabulary (one vocabulary, many bindings); rejected input macros/combos at framework level (no consumer, and combos fight the accessibility law); kept the core allocation-free with a fixed ring buffer. ✔

**Internal quality score: 9.5/10 — approved and locked; per-device hardware passes bind at platform QA.**
