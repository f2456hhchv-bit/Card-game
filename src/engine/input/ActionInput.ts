/**
 * Device-agnostic action input core (AF-019). Pure and deterministic:
 * adapters feed binding activations and analogue axes; gameplay consumes
 * actions, edges, a smoothed movement vector, and buffered presses — never
 * raw keys (AF-001 input law). Context gating makes suppressed input
 * structurally impossible.
 */
import {
  ACTION_CLASS,
  CONTEXT_PERMISSIONS,
  GAME_ACTIONS,
  type BindingCode,
  type BindingProfile,
  type GameAction,
  type InputContext,
  type InputTuning,
} from "./inputTuning";

export type BindResult =
  | { ok: true }
  | { ok: false; reason: "duplicate"; conflictAction: GameAction }
  | { ok: false; reason: "lastBinding" | "unknownAction" };

interface BufferedPress {
  action: GameAction;
  atMs: number;
  consumed: boolean;
}

const BUFFER_RING_SIZE = 16;

export class ActionInput {
  private readonly bindings = new Map<GameAction, BindingCode[]>();
  private readonly codeToAction = new Map<BindingCode, GameAction>();
  private readonly down = new Set<GameAction>();
  private readonly latched = new Set<GameAction>();
  private readonly toggleMode = new Set<GameAction>();
  private pressedAccumulator = new Set<GameAction>();
  private releasedAccumulator = new Set<GameAction>();
  private pressedThisUpdate = new Set<GameAction>();
  private releasedThisUpdate = new Set<GameAction>();

  private readonly buffer: BufferedPress[] = [];
  private bufferIndex = 0;

  private context: InputContext = "menu";
  private simTimeMs = 0;

  private analogX = 0;
  private analogY = 0;
  private moveX = 0;
  private moveY = 0;

  /** Most recent action edge, for the debug overlay. */
  lastAction: GameAction | null = null;

  constructor(
    private readonly tuning: InputTuning,
    profile: BindingProfile,
  ) {
    for (const action of GAME_ACTIONS) {
      const codes = [...profile[action]];
      this.bindings.set(action, codes);
      for (const code of codes) this.codeToAction.set(code, action);
    }
    for (let i = 0; i < BUFFER_RING_SIZE; i += 1) {
      this.buffer.push({ action: "Pause", atMs: -Infinity, consumed: true });
    }
  }

  // ── Adapter surface ──────────────────────────────────────────────────────

  /** Adapters call on device press. Returns the mapped action, if any. */
  handleCodeDown(code: BindingCode): GameAction | null {
    const action = this.codeToAction.get(code);
    if (!action) return null;
    if (!this.isAllowed(action)) return null;
    if (this.toggleMode.has(action)) {
      if (this.latched.has(action)) {
        this.latched.delete(action);
        this.releasedAccumulator.add(action);
      } else {
        this.latched.add(action);
        this.pressedAccumulator.add(action);
        this.recordBuffered(action);
      }
    } else if (!this.down.has(action)) {
      this.down.add(action);
      this.pressedAccumulator.add(action);
      this.recordBuffered(action);
    }
    this.lastAction = action;
    return action;
  }

  handleCodeUp(code: BindingCode): void {
    const action = this.codeToAction.get(code);
    if (!action) return;
    if (this.toggleMode.has(action)) return; // toggle releases on next press
    if (this.down.has(action)) {
      this.down.delete(action);
      this.releasedAccumulator.add(action);
    }
  }

  /** Analogue movement axis from stick/touch joystick, each in [-1, 1]. */
  setAnalogMove(x: number, y: number): void {
    this.analogX = x;
    this.analogY = y;
  }

  // ── Fixed-timestep surface ───────────────────────────────────────────────

  /** Promote accumulated edges and advance the movement vector. */
  update(fixedDtMs: number): void {
    this.simTimeMs += fixedDtMs;

    this.pressedThisUpdate = this.pressedAccumulator;
    this.releasedThisUpdate = this.releasedAccumulator;
    this.pressedAccumulator = new Set();
    this.releasedAccumulator = new Set();

    const [targetX, targetY] = this.movementTarget();
    const k = 1 - Math.exp(-this.tuning.movementSmoothingPerSecond * (fixedDtMs / 1000));
    this.moveX += (targetX - this.moveX) * k;
    this.moveY += (targetY - this.moveY) * k;
    if (Math.abs(this.moveX) < 1e-4 && targetX === 0) this.moveX = 0;
    if (Math.abs(this.moveY) < 1e-4 && targetY === 0) this.moveY = 0;
  }

  isDown(action: GameAction): boolean {
    if (!this.isAllowed(action)) return false;
    return this.toggleMode.has(action) ? this.latched.has(action) : this.down.has(action);
  }

  wasPressed(action: GameAction): boolean {
    return this.pressedThisUpdate.has(action);
  }

  wasReleased(action: GameAction): boolean {
    return this.releasedThisUpdate.has(action);
  }

  /** Smoothed, deadzoned movement vector (magnitude ≤ 1). */
  get movement(): { x: number; y: number } {
    return { x: this.moveX, y: this.moveY };
  }

  /** Consume a buffered press if one landed within the buffer window. */
  consumeBuffered(action: GameAction): boolean {
    for (const entry of this.buffer) {
      if (
        !entry.consumed &&
        entry.action === action &&
        this.simTimeMs - entry.atMs <= this.tuning.bufferWindowMs
      ) {
        entry.consumed = true;
        return true;
      }
    }
    return false;
  }

  // ── Context & modes ──────────────────────────────────────────────────────

  setContext(context: InputContext): void {
    if (context === this.context) return;
    this.context = context;
    // Suppressed held actions release cleanly on context change.
    for (const action of [...this.down]) {
      if (!this.isAllowed(action)) {
        this.down.delete(action);
        this.releasedAccumulator.add(action);
      }
    }
  }

  get currentContext(): InputContext {
    return this.context;
  }

  /** Hold (default) or Toggle latch mode, for toggle-capable actions. */
  setActionMode(action: GameAction, mode: "hold" | "toggle"): boolean {
    if (!this.tuning.toggleCapableActions.includes(action)) return false;
    if (mode === "toggle") this.toggleMode.add(action);
    else {
      this.toggleMode.delete(action);
      this.latched.delete(action);
    }
    return true;
  }

  // ── Rebinding (AF-019 §5) ────────────────────────────────────────────────

  bind(action: GameAction, code: BindingCode): BindResult {
    if (!this.bindings.has(action)) return { ok: false, reason: "unknownAction" };
    const existing = this.codeToAction.get(code);
    if (existing !== undefined && existing !== action) {
      return { ok: false, reason: "duplicate", conflictAction: existing };
    }
    const codes = this.bindings.get(action) as BindingCode[];
    if (!codes.includes(code)) {
      codes.push(code);
      this.codeToAction.set(code, action);
    }
    return { ok: true };
  }

  unbind(action: GameAction, code: BindingCode): BindResult {
    const codes = this.bindings.get(action);
    if (!codes) return { ok: false, reason: "unknownAction" };
    if (codes.length <= 1) return { ok: false, reason: "lastBinding" }; // no unreachable actions
    const index = codes.indexOf(code);
    if (index >= 0) {
      codes.splice(index, 1);
      this.codeToAction.delete(code);
    }
    return { ok: true };
  }

  bindingsFor(action: GameAction): readonly BindingCode[] {
    return this.bindings.get(action) ?? [];
  }

  // ── Internals ────────────────────────────────────────────────────────────

  private isAllowed(action: GameAction): boolean {
    return CONTEXT_PERMISSIONS[this.context].includes(ACTION_CLASS[action]);
  }

  private recordBuffered(action: GameAction): void {
    if (!this.tuning.bufferableActions.includes(action)) return;
    const entry = this.buffer[this.bufferIndex] as BufferedPress;
    entry.action = action;
    entry.atMs = this.simTimeMs;
    entry.consumed = false;
    this.bufferIndex = (this.bufferIndex + 1) % BUFFER_RING_SIZE;
  }

  private movementTarget(): [number, number] {
    // Analogue first: radial deadzone with rescaling (no dead ring snap).
    const magnitude = Math.hypot(this.analogX, this.analogY);
    if (magnitude > this.tuning.deadzone) {
      const scaled =
        Math.min(1, (magnitude - this.tuning.deadzone) / (1 - this.tuning.deadzone)) *
        this.tuning.sensitivity;
      const clamped = Math.min(1, scaled);
      return [(this.analogX / magnitude) * clamped, (this.analogY / magnitude) * clamped];
    }
    // Digital synthesis, normalised diagonals.
    let x = 0;
    let y = 0;
    if (this.isDown("MoveLeft")) x -= 1;
    if (this.isDown("MoveRight")) x += 1;
    if (this.isDown("MoveUp")) y -= 1;
    if (this.isDown("MoveDown")) y += 1;
    if (x !== 0 && y !== 0) {
      const inv = 1 / Math.SQRT2;
      x *= inv;
      y *= inv;
    }
    return [x, y];
  }
}
