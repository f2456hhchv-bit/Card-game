/**
 * Unified input: keyboard (WASD / arrows), and pointer/touch via a virtual
 * floating joystick. Exposes a single normalized movement vector so gameplay
 * code never cares which device produced it — key to good cross-platform feel.
 */
import { clamp } from "../core/math/MathUtils";

export class Input {
  /** Movement vector, each axis in [-1, 1]; magnitude clamped to 1. */
  moveX = 0;
  moveY = 0;

  private readonly keys = new Set<string>();
  private readonly element: HTMLElement;

  // Virtual joystick state (touch / mouse-drag).
  private pointerId: number | null = null;
  private originX = 0;
  private originY = 0;
  private stickX = 0;
  private stickY = 0;
  private readonly joystickRadius = 70;
  joystickActive = false;

  // One-shot action flags consumed by the UI layer.
  private pausePressed = false;
  private specialPressed = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.attach();
  }

  private attach(): void {
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
    this.element.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    window.addEventListener("blur", this.onBlur);
  }

  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.element.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
    window.removeEventListener("blur", this.onBlur);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (code === "Escape" || code === "KeyP") {
      this.pausePressed = true;
      e.preventDefault();
    }
    // Space triggers the Commander's special ability.
    if (code === "Space") this.specialPressed = true;
    // Prevent arrow keys / space from scrolling the page.
    if (MOVE_CODES.has(code) || code === "Space") e.preventDefault();
    this.keys.add(code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private onBlur = (): void => {
    this.keys.clear();
    this.pointerId = null;
    this.joystickActive = false;
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (this.pointerId !== null) return;
    this.pointerId = e.pointerId;
    this.originX = e.clientX;
    this.originY = e.clientY;
    this.stickX = e.clientX;
    this.stickY = e.clientY;
    this.joystickActive = true;
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    this.stickX = e.clientX;
    this.stickY = e.clientY;
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.joystickActive = false;
  };

  /** Where the joystick base is drawn (screen px). Valid when joystickActive. */
  get joystickOrigin(): { x: number; y: number } {
    return { x: this.originX, y: this.originY };
  }

  /** Where the joystick knob is drawn, clamped to the joystick radius. */
  get joystickKnob(): { x: number; y: number } {
    let dx = this.stickX - this.originX;
    let dy = this.stickY - this.originY;
    const len = Math.hypot(dx, dy);
    if (len > this.joystickRadius) {
      dx = (dx / len) * this.joystickRadius;
      dy = (dy / len) * this.joystickRadius;
    }
    return { x: this.originX + dx, y: this.originY + dy };
  }

  /** Recompute the unified movement vector. Call once per simulation step. */
  update(): void {
    let x = 0;
    let y = 0;

    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) x -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) x += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) y -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) y += 1;

    if (this.joystickActive) {
      const dx = this.stickX - this.originX;
      const dy = this.stickY - this.originY;
      const len = Math.hypot(dx, dy);
      const dead = 8;
      if (len > dead) {
        const mag = clamp((len - dead) / (this.joystickRadius - dead), 0, 1);
        x = (dx / len) * mag;
        y = (dy / len) * mag;
      }
    }

    // Normalize so diagonal keyboard movement isn't faster than cardinal.
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    this.moveX = x;
    this.moveY = y;
  }

  /** Returns true exactly once per pause keypress. */
  consumePause(): boolean {
    const v = this.pausePressed;
    this.pausePressed = false;
    return v;
  }

  /** Returns true exactly once per special-ability press (Space or the button). */
  consumeSpecial(): boolean {
    const v = this.specialPressed;
    this.specialPressed = false;
    return v;
  }

  /** Trigger the special from an on-screen button (touch). */
  pressSpecial(): void {
    this.specialPressed = true;
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }
}

const MOVE_CODES = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
]);
