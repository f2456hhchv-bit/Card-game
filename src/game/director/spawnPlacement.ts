/**
 * GP-002 §Spawning: "Never spawn directly on the player... spawn outside
 * camera where possible... allow surround tactics." The existing placement
 * math (a random angle + minDistanceFromPlayer radius) already satisfies
 * "never on the player"; this module adds the camera-visibility check that
 * was previously entirely absent — pure geometry, no RNG of its own, so the
 * composition root's own seeded combatRng stays the only randomness source.
 */
export interface ViewportRect {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** The camera's own visible rectangle, padded by `margin` world units so a
 * spawn doesn't appear right at the screen edge either. */
export function cameraViewportRect(cameraX: number, cameraY: number, halfWidth: number, halfHeight: number, margin: number): ViewportRect {
  return {
    minX: cameraX - halfWidth - margin,
    maxX: cameraX + halfWidth + margin,
    minY: cameraY - halfHeight - margin,
    maxY: cameraY + halfHeight + margin,
  };
}

export function isOutsideViewport(x: number, y: number, viewport: ViewportRect): boolean {
  return x < viewport.minX || x > viewport.maxX || y < viewport.minY || y > viewport.maxY;
}

/** Picks the first candidate that lands outside the viewport; falls back to
 * the first candidate untouched if none qualify (e.g. the arena is too
 * small to ever clear the viewport) — never blocks a spawn outright. */
export function pickSpawnOutsideViewport<T extends { x: number; y: number }>(candidates: readonly T[], viewport: ViewportRect): T {
  for (const candidate of candidates) {
    if (isOutsideViewport(candidate.x, candidate.y, viewport)) return candidate;
  }
  return candidates[0]!;
}
