/**
 * AssetManager — the production-art ingestion layer. It loads real image assets
 * (original hand-authored SVGs today; PNG sprite-atlases tomorrow) and exposes
 * them by the same keys the procedural SpriteForge uses, so renderers prefer a
 * production asset when present and fall back to procedural otherwise — with no
 * changes to game systems (the seam mandated by docs/ArtDirection.md).
 *
 * Assets are imported as raw strings and turned into data-URI images so they are
 * bundled (work offline / in the single-file build), and remain ORIGINAL: every
 * asset here is authored in-repo under src/assets/art, never sourced externally.
 */
import wardenSvg from "../../assets/art/hero/warden.svg?raw";

export interface ArtImage {
  img: HTMLImageElement;
  /** Design-space body radius (in the asset's own units) for consistent scaling. */
  radius: number;
  loaded: boolean;
}

/** Registry of authored assets: key → [raw SVG, designRadius]. */
const ART_SOURCES: Record<string, { svg: string; radius: number }> = {
  // The asset's viewBox is 120×120 centred at (60,60); the ship body radius ≈ 30.
  "hero/warden": { svg: wardenSvg, radius: 30 },
};

export class AssetManager {
  private readonly map = new Map<string, ArtImage>();

  constructor() {
    for (const key in ART_SOURCES) {
      const { svg, radius } = ART_SOURCES[key];
      const img = new Image();
      const entry: ArtImage = { img, radius, loaded: false };
      img.onload = () => {
        entry.loaded = true;
      };
      img.onerror = () => {
        // Leave loaded=false → renderer keeps the procedural fallback.
      };
      // Bundled data URI: no network, works in file:// and on GitHub Pages.
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      this.map.set(key, entry);
    }
  }

  /** A loaded production asset for `key`, or null to use the procedural fallback. */
  get(key: string): ArtImage | null {
    const a = this.map.get(key);
    return a && a.loaded ? a : null;
  }
}
