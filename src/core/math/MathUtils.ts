/**
 * Core scalar math helpers. Kept allocation-free and dependency-free so they
 * can be called freely inside the hot game loop.
 */

export const TAU = Math.PI * 2;
export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Clamp into [0, 1]. */
export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Linear interpolation. `t` is not clamped. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Frame-rate independent exponential smoothing toward `target`.
 * `rate` is the fraction-of-distance-per-second factor (0..1-ish).
 */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-rate * dt));
}

/** Inverse lerp: where does `value` sit within [a, b], as 0..1 (clamped). */
export function inverseLerp(a: number, b: number, value: number): number {
  if (a === b) return 0;
  return clamp01((value - a) / (b - a));
}

/** Remap a value from one range to another. */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

/** Smallest signed difference between two angles, result in (-PI, PI]. */
export function angleDelta(from: number, to: number): number {
  let d = (to - from) % TAU;
  if (d < -Math.PI) d += TAU;
  if (d > Math.PI) d -= TAU;
  return d;
}

/** Rotate `current` toward `target` by at most `maxStep` radians. */
export function rotateToward(current: number, target: number, maxStep: number): number {
  const d = angleDelta(current, target);
  if (Math.abs(d) <= maxStep) return target;
  return current + Math.sign(d) * maxStep;
}

/** Smoothstep easing on a normalized [0,1] input. */
export function smoothstep(t: number): number {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
}

export function sign(value: number): number {
  return value < 0 ? -1 : value > 0 ? 1 : 0;
}

/** Approximate equality, useful for tests and tolerance checks. */
export function approxEqual(a: number, b: number, epsilon = 1e-6): boolean {
  return Math.abs(a - b) <= epsilon;
}
