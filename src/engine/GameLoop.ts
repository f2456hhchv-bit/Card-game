/**
 * Fixed-timestep game loop with render interpolation.
 *
 * Why fixed timestep: gameplay (movement, collisions, spawns, RNG) must be
 * deterministic and stable regardless of display refresh rate — a 60 Hz phone
 * and a 144 Hz desktop must simulate identically. We therefore step the
 * simulation in fixed slices and accumulate leftover real time.
 *
 * Rendering, meanwhile, runs once per animation frame and interpolates between
 * the previous and current simulation states (`alpha`) for buttery-smooth
 * motion even when the refresh rate doesn't divide evenly into the step rate.
 */
export interface GameLoopCallbacks {
  /** Advance the simulation by exactly `dt` seconds. */
  update(dt: number): void;
  /**
   * Draw a frame. `alpha` in [0,1) is how far we are between the last and next
   * simulation step, for interpolation. `frameDt` is real seconds since the
   * previous rendered frame (for non-gameplay visuals like UI tweens).
   */
  render(alpha: number, frameDt: number): void;
}

const FIXED_DT = 1 / 60; // 60 Hz simulation — the gameplay heartbeat.
const MAX_FRAME_TIME = 0.25; // Clamp huge gaps (tab switch) to avoid spirals.
/** Common display intervals for delta snapping (see tick). */
const REFRESH_RATES = [120, 90, 80, 60, 40, 30, 20];

export class GameLoop {
  private readonly callbacks: GameLoopCallbacks;
  private accumulator = 0;
  private lastTime = 0;
  private rafId = 0;
  private running = false;

  // Live performance telemetry, surfaced by the debug HUD / performance log.
  fps = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;

  constructor(callbacks: GameLoopCallbacks) {
    this.callbacks = callbacks;
  }

  get isRunning(): boolean {
    return this.running;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);

    let frameTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (frameTime > MAX_FRAME_TIME) frameTime = MAX_FRAME_TIME;
    // Delta snapping: Safari (especially iOS) coarsens rAF timestamps to ~1ms,
    // so measured deltas wobble around the true refresh interval. That noise
    // leaks into the interpolation alpha and reads as micro-judder against the
    // display's perfectly regular scanout. Snap to the nearest common refresh
    // interval when within 12% of it; genuine hitches fall through unsnapped.
    for (const hz of REFRESH_RATES) {
      const t = 1 / hz;
      if (Math.abs(frameTime - t) < t * 0.12) {
        frameTime = t;
        break;
      }
    }

    // FPS measurement (rolling, updated ~4x/sec).
    this.fpsAccum += frameTime;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.25) {
      this.fps = this.fpsFrames / this.fpsAccum;
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    this.accumulator += frameTime;
    // Drain the accumulator in fixed slices.
    let steps = 0;
    while (this.accumulator >= FIXED_DT) {
      this.callbacks.update(FIXED_DT);
      this.accumulator -= FIXED_DT;
      // Safety valve: never simulate more than a handful of steps per frame.
      if (++steps >= 5) {
        this.accumulator = 0;
        break;
      }
    }

    const alpha = Math.min(1, Math.max(0, this.accumulator / FIXED_DT));
    this.callbacks.render(alpha, frameTime);
  };
}

export { FIXED_DT };
