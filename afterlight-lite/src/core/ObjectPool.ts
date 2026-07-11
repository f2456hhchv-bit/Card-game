/**
 * Generic object pool to eliminate per-frame allocation churn for short-lived,
 * high-volume entities (projectiles, enemies, XP gems, damage numbers, hit
 * particles). Reusing instances keeps the GC quiet, which is essential to hold
 * a steady 120 FPS when hundreds of entities spawn and die every second.
 *
 * Usage pattern:
 *   const p = pool.obtain();   // get a (possibly recycled) instance
 *   ...use it...
 *   pool.release(p);           // hand it back for reuse
 */
export class ObjectPool<T> {
  private readonly free: T[] = [];
  private readonly factory: () => T;
  private readonly reset: ((obj: T) => void) | undefined;
  private created = 0;

  /**
   * @param factory  Creates a brand-new instance when the pool is empty.
   * @param reset    Optional hook to clear an instance when it is released.
   * @param prewarm  Number of instances to allocate up front.
   */
  constructor(factory: () => T, reset?: (obj: T) => void, prewarm = 0) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < prewarm; i++) {
      this.free.push(factory());
      this.created++;
    }
  }

  obtain(): T {
    const obj = this.free.pop();
    if (obj !== undefined) return obj;
    this.created++;
    return this.factory();
  }

  release(obj: T): void {
    this.reset?.(obj);
    this.free.push(obj);
  }

  /** Total instances ever created (live + free). Useful for the perf HUD. */
  get totalCreated(): number {
    return this.created;
  }

  get freeCount(): number {
    return this.free.length;
  }
}
