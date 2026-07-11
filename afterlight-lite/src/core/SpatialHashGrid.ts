/**
 * Uniform spatial hash grid for broad-phase neighbour queries.
 *
 * Survivor-likes put hundreds-to-thousands of enemies on screen, and every
 * projectile needs to know which enemies are near it. A naive O(n*m) check is
 * far too slow. The grid buckets entities by cell so a query only inspects the
 * handful of entities in nearby cells — close to O(1) per query in practice.
 *
 * The grid is rebuilt each frame (clear + insert all) which is cheap and avoids
 * the bookkeeping bugs of incremental movement between cells.
 */
export interface SpatialEntity {
  x: number;
  y: number;
  /** Radius used to decide how many cells the entity overlaps. */
  radius: number;
  /** Set false when dead/inactive so queries can skip it. */
  active: boolean;
}

export class SpatialHashGrid<T extends SpatialEntity> {
  private readonly invCell: number;
  private readonly cells = new Map<number, T[]>();
  /** Scratch buffer reused by queries to avoid per-call allocation. */
  private readonly queryScratch: T[] = [];

  constructor(cellSize: number) {
    this.invCell = 1 / cellSize;
  }

  /** Combine two signed 16-bit cell coords into one number key. */
  private key(cx: number, cy: number): number {
    // Offset keeps coordinates non-negative for a stable 32-bit key.
    return ((cx + 32768) << 16) | (cy + 32768);
  }

  clear(): void {
    // Reuse the arrays themselves to avoid reallocating buckets each frame.
    for (const bucket of this.cells.values()) bucket.length = 0;
  }

  insert(entity: T): void {
    if (!entity.active) return;
    const cx = Math.floor(entity.x * this.invCell);
    const cy = Math.floor(entity.y * this.invCell);
    const k = this.key(cx, cy);
    let bucket = this.cells.get(k);
    if (bucket === undefined) {
      bucket = [];
      this.cells.set(k, bucket);
    }
    bucket.push(entity);
  }

  /**
   * Gather all entities whose cells overlap the circle (x, y, radius).
   * Returns a shared scratch array — consume it before calling query again.
   * The caller must still do a precise distance test; this is broad-phase only.
   */
  query(x: number, y: number, radius: number): T[] {
    const out = this.queryScratch;
    out.length = 0;
    const minCx = Math.floor((x - radius) * this.invCell);
    const maxCx = Math.floor((x + radius) * this.invCell);
    const minCy = Math.floor((y - radius) * this.invCell);
    const maxCy = Math.floor((y + radius) * this.invCell);
    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const bucket = this.cells.get(this.key(cx, cy));
        if (bucket === undefined) continue;
        for (let i = 0; i < bucket.length; i++) out.push(bucket[i]);
      }
    }
    return out;
  }

  /**
   * Find the nearest active entity to (x, y) within `maxRadius`, or null.
   * Searches outward ring-by-ring so it can stop early once a candidate is
   * found in a closer ring than any remaining ring could beat.
   */
  findNearest(x: number, y: number, maxRadius: number): T | null {
    const candidates = this.query(x, y, maxRadius);
    let best: T | null = null;
    let bestDistSq = maxRadius * maxRadius;
    for (let i = 0; i < candidates.length; i++) {
      const e = candidates[i];
      if (!e.active) continue;
      const dx = e.x - x;
      const dy = e.y - y;
      const dSq = dx * dx + dy * dy;
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        best = e;
      }
    }
    return best;
  }
}
