/**
 * Lightweight 2D vector helpers operating on a plain `{ x, y }` shape.
 *
 * Design note: entities store their position as inline `x`/`y` number fields
 * rather than Vec2 objects to avoid per-entity allocation and pointer chasing
 * in the hot loop. These functions are therefore mostly static utilities used
 * for one-off geometry rather than per-frame-per-entity work.
 */

export interface IVec2 {
  x: number;
  y: number;
}

export function length(x: number, y: number): number {
  return Math.hypot(x, y);
}

export function lengthSq(x: number, y: number): number {
  return x * x + y * y;
}

export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

export function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
}

/** Returns true if (bx,by) is within `radius` of (ax,ay). Allocation-free. */
export function withinRange(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  radius: number,
): boolean {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy <= radius * radius;
}

/** Mutable 2D vector for the rare cases where an object is genuinely useful. */
export class Vec2 implements IVec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copyFrom(v: IVec2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  add(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }

  scale(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  get length(): number {
    return Math.hypot(this.x, this.y);
  }

  normalize(): this {
    const len = this.length;
    if (len > 1e-8) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }
}
