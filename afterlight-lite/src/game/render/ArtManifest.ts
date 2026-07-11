/**
 * Maps a content id (ship/enemy/elite/boss id) to a real sprite image path.
 * Empty today — Afterlight Lite ships with placeholder vector shapes. When
 * real art (per the game's style guide) is supplied, add entries here; the
 * renderer prefers a loaded image over the placeholder shape automatically,
 * so no other code needs to change.
 */
export const ART_MANIFEST: Record<string, string> = {
  // "ship.vanguard": "/assets/art/ships/vanguard.png",
};

const imageCache = new Map<string, HTMLImageElement | null>();

/** Returns a loaded image for `id`, or null if none is manifested (yet) or still loading. */
export function getManifestedImage(id: string): HTMLImageElement | null {
  const path = ART_MANIFEST[id];
  if (!path) return null;

  const cached = imageCache.get(id);
  if (cached !== undefined) return cached;

  imageCache.set(id, null);
  const img = new Image();
  img.onload = () => imageCache.set(id, img);
  img.onerror = () => imageCache.set(id, null);
  img.src = path;
  return null;
}
