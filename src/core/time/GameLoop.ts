/**
 * Fixed-timestep game loop (AF-001 §10): the simulation always steps in
 * constant increments, making gameplay deterministic and framerate-
 * independent; rendering interpolates between steps via `alpha`.
 */
export interface GameLoopOptions {
  /** Advance the simulation by exactly `fixedDtMs`. */
  update: (fixedDtMs: number) => void;
  /** Draw, interpolating by alpha ∈ [0,1) between the last two sim states. */
  render?: (alpha: number) => void;
  /** Simulation step size. Defaults to 1000/60. */
  fixedDtMs?: number;
  /** Spiral-of-death guard: max sim steps consumed per tick. */
  maxUpdatesPerTick?: number;
  now?: () => number;
  /** Frame scheduler; defaults to requestAnimationFrame. */
  schedule?: (callback: () => void) => void;
}

const defaultSchedule = (callback: () => void): void => {
  requestAnimationFrame(() => callback());
};

export class GameLoop {
  private readonly update: (fixedDtMs: number) => void;
  private readonly render: ((alpha: number) => void) | undefined;
  private readonly fixedDtMs: number;
  private readonly maxUpdatesPerTick: number;
  private readonly now: () => number;
  private readonly schedule: (callback: () => void) => void;

  private accumulatorMs = 0;
  private lastTickMs: number | null = null;
  private running = false;

  /** Sim time discarded by the spiral-of-death guard (visible in debug). */
  droppedTimeMs = 0;
  /** Total fixed steps executed since construction. */
  stepCount = 0;

  constructor(options: GameLoopOptions) {
    this.update = options.update;
    this.render = options.render;
    this.fixedDtMs = options.fixedDtMs ?? 1000 / 60;
    this.maxUpdatesPerTick = options.maxUpdatesPerTick ?? 5;
    this.now = options.now ?? (() => performance.now());
    this.schedule = options.schedule ?? defaultSchedule;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTickMs = null;
    this.scheduleNext();
  }

  stop(): void {
    this.running = false;
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Advance using an explicit timestamp. Public so tests drive time directly. */
  tick(nowMs: number): void {
    if (this.lastTickMs === null) {
      this.lastTickMs = nowMs;
      this.render?.(1);
      return;
    }
    this.accumulatorMs += nowMs - this.lastTickMs;
    this.lastTickMs = nowMs;

    let updates = 0;
    while (this.accumulatorMs >= this.fixedDtMs && updates < this.maxUpdatesPerTick) {
      this.update(this.fixedDtMs);
      this.accumulatorMs -= this.fixedDtMs;
      this.stepCount += 1;
      updates += 1;
    }
    if (this.accumulatorMs >= this.fixedDtMs) {
      const excess = this.accumulatorMs - this.fixedDtMs;
      this.droppedTimeMs += excess;
      this.accumulatorMs = this.fixedDtMs;
    }
    this.render?.(this.accumulatorMs / this.fixedDtMs);
  }

  private scheduleNext(): void {
    if (!this.running) return;
    this.schedule(() => {
      if (!this.running) return;
      this.tick(this.now());
      this.scheduleNext();
    });
  }
}
