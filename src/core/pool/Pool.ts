/**
 * Generic object pool (AF-001 §10: pooling is mandatory for anything spawned
 * repeatedly). Acquire returns a recycled instance when one is free;
 * release resets and stores it for reuse — zero steady-state allocation.
 */
export interface PoolOptions<T> {
  create: () => T;
  /** Restore an instance to its pristine state before reuse. */
  reset?: (item: T) => void;
  initialSize?: number;
  /** Released items beyond this count are dropped for GC instead of stored. */
  maxSize?: number;
}

export class Pool<T> {
  private readonly create: () => T;
  private readonly reset: ((item: T) => void) | undefined;
  private readonly maxSize: number;
  private readonly free: T[] = [];

  /** Total instances ever constructed (allocation pressure indicator). */
  createdCount = 0;
  /** Total acquisitions served from the free list (reuse indicator). */
  reusedCount = 0;

  constructor(options: PoolOptions<T>) {
    this.create = options.create;
    this.reset = options.reset;
    this.maxSize = options.maxSize ?? Number.POSITIVE_INFINITY;
    const initialSize = options.initialSize ?? 0;
    for (let i = 0; i < initialSize; i += 1) {
      this.free.push(this.create());
      this.createdCount += 1;
    }
  }

  acquire(): T {
    const item = this.free.pop();
    if (item !== undefined) {
      this.reusedCount += 1;
      return item;
    }
    this.createdCount += 1;
    return this.create();
  }

  release(item: T): void {
    this.reset?.(item);
    if (this.free.length < this.maxSize) {
      this.free.push(item);
    }
  }

  get freeCount(): number {
    return this.free.length;
  }
}
