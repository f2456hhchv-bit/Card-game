import vanguardUrl from "../../assets/art/ships/vanguard.png";
import sparrowUrl from "../../assets/art/ships/sparrow.png";
import warhawkUrl from "../../assets/art/ships/warhawk.png";
import specterUrl from "../../assets/art/ships/specter.png";
import voltaicUrl from "../../assets/art/ships/voltaic.png";
import rockSkittererUrl from "../../assets/art/enemies/rockSkitterer.png";
import asteroidCrusherUrl from "../../assets/art/elites/asteroidCrusher.png";
import fractureKingUrl from "../../assets/art/bosses/fractureKing.png";

/**
 * Maps a content id (ship/enemy/elite/boss id) to a real sprite image.
 * Imported through Vite's asset pipeline (rather than referenced as a plain
 * /public path) so the single-file build can inline them as data URIs.
 * Afterlight Lite otherwise draws placeholder vector shapes; the renderer
 * prefers a loaded image over the placeholder automatically, so no other
 * code needs to change as more art is added here.
 */
export const ART_MANIFEST: Record<string, string> = {
  "ship.vanguard": vanguardUrl,
  "ship.sparrow": sparrowUrl,
  "ship.warhawk": warhawkUrl,
  "ship.specter": specterUrl,
  "ship.voltaic": voltaicUrl,

  // Asteroid Belt
  "enemy.rockSkitterer": rockSkittererUrl,
  "enemy.asteroidCrusher": asteroidCrusherUrl,
  "enemy.fractureKing": fractureKingUrl,
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
