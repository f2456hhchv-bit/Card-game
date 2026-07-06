/**
 * Virtual touch joystick math (AF-019 §6). Pure and testable: converts
 * touch positions into an analogue vector for ActionInput.setAnalogMove.
 * Dynamic mode anchors the stick where the thumb lands; fixed mode uses a
 * configured anchor. The DOM touch adapter feeds this class.
 */
export interface TouchJoystickOptions {
  /** Stick radius in CSS pixels — full deflection at this distance. */
  radius: number;
  mode: "dynamic" | "fixed";
  /** Anchor for fixed mode (ignored in dynamic mode). */
  anchorX?: number;
  anchorY?: number;
}

export class TouchJoystick {
  private originX = 0;
  private originY = 0;
  private active = false;
  private vectorX = 0;
  private vectorY = 0;

  constructor(private readonly options: TouchJoystickOptions) {
    if (options.mode === "fixed") {
      this.originX = options.anchorX ?? 0;
      this.originY = options.anchorY ?? 0;
    }
  }

  touchStart(x: number, y: number): void {
    if (this.options.mode === "dynamic") {
      this.originX = x;
      this.originY = y;
    }
    this.active = true;
    this.touchMove(x, y);
  }

  touchMove(x: number, y: number): void {
    if (!this.active) return;
    const dx = x - this.originX;
    const dy = y - this.originY;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) {
      this.vectorX = 0;
      this.vectorY = 0;
      return;
    }
    const deflection = Math.min(1, distance / this.options.radius);
    this.vectorX = (dx / distance) * deflection;
    this.vectorY = (dy / distance) * deflection;
  }

  touchEnd(): void {
    this.active = false;
    this.vectorX = 0;
    this.vectorY = 0;
  }

  get isActive(): boolean {
    return this.active;
  }

  /** Analogue vector, magnitude ≤ 1. */
  get vector(): { x: number; y: number } {
    return { x: this.vectorX, y: this.vectorY };
  }
}
