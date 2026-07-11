/**
 * Maps a content id (ship/enemy/elite/boss id) to a real sprite image path.
 * Afterlight Lite otherwise draws placeholder vector shapes; the renderer
 * prefers a loaded image over the placeholder automatically, so no other
 * code needs to change as more art is added here.
 */
export const ART_MANIFEST: Record<string, string> = {
  "ship.vanguard": "/art/ships/vanguard.png",
  "ship.sparrow": "/art/ships/sparrow.png",
  "ship.warhawk": "/art/ships/warhawk.png",
  "ship.specter": "/art/ships/specter.png",
  "ship.voltaic": "/art/ships/voltaic.png",
};

const imageCache = new Map<string, HTMLImageElement | null>();
const pendingLoads = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(id: string, path: string): Promise<HTMLImageElement | null> {
  const existing = pendingLoads.get(id);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(id, img);
      resolve(img);
    };
    img.onerror = () => {
      imageCache.set(id, null);
      resolve(null);
    };
    img.src = path;
  });
  pendingLoads.set(id, promise);
  return promise;
}

/** Returns a loaded image for `id`, or null if none is manifested (yet) or still loading.
 * Fire-and-forget: safe to call every frame from the render loop, which will
 * naturally pick up the image once it finishes loading. For a one-shot draw
 * (e.g. building a UI icon once), use `preloadImages` first instead. */
export function getManifestedImage(id: string): HTMLImageElement | null {
  const path = ART_MANIFEST[id];
  if (!path) return null;

  const cached = imageCache.get(id);
  if (cached !== undefined) return cached;

  imageCache.set(id, null);
  void loadImage(id, path);
  return null;
}

/** Ensures every manifested id in `ids` has finished loading (or failed) before resolving.
 * Use before a one-shot canvas draw so it doesn't fall back to the placeholder
 * shape just because the image request was still in flight. */
export async function preloadImages(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id) => {
      const path = ART_MANIFEST[id];
      if (!path) return Promise.resolve();
      const cached = imageCache.get(id);
      if (cached !== undefined) return Promise.resolve();
      return loadImage(id, path);
    }),
  );
}
