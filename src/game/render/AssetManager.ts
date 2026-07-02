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
import drifterSvg from "../../assets/art/enemy/drifter.svg?raw";
import moteSvg from "../../assets/art/enemy/mote.svg?raw";
import huskSvg from "../../assets/art/enemy/husk.svg?raw";
import lungerSvg from "../../assets/art/enemy/lunger.svg?raw";
import wispSvg from "../../assets/art/enemy/wisp.svg?raw";
import casterSvg from "../../assets/art/enemy/caster.svg?raw";
import sporeSvg from "../../assets/art/enemy/spore.svg?raw";
import cinderSvg from "../../assets/art/enemy/cinder.svg?raw";
import revenantSvg from "../../assets/art/enemy/revenant.svg?raw";
import shardSvg from "../../assets/art/enemy/shard.svg?raw";
import colossusSvg from "../../assets/art/enemy/colossus.svg?raw";
import theMawSvg from "../../assets/art/boss/theMaw.svg?raw";
import theChoirSvg from "../../assets/art/boss/theChoir.svg?raw";
import thePyreSvg from "../../assets/art/boss/thePyre.svg?raw";
import theForgeSvg from "../../assets/art/boss/theForge.svg?raw";
import theRimeSvg from "../../assets/art/boss/theRime.svg?raw";
import theNadirSvg from "../../assets/art/boss/theNadir.svg?raw";
import theSovereignSvg from "../../assets/art/boss/theSovereign.svg?raw";
import seerSvg from "../../assets/art/enemy/seer.svg?raw";
import lancerSvg from "../../assets/art/enemy/lancer.svg?raw";
import { BOSS_RASTER } from "./bossRaster";

export interface ArtImage {
  img: HTMLImageElement;
  /** Design-space body radius (in the asset's own units) for consistent scaling. */
  radius: number;
  loaded: boolean;
}

/** Registry of authored assets: key → [raw SVG, designRadius]. */
const ART_SOURCES: Record<string, { svg: string; radius: number }> = {
  // All assets use a 120×120 viewBox centred at (60,60) with a design body
  // radius ≈ 30, matching SpriteForge so blit scaling is consistent.
  "hero/warden": { svg: wardenSvg, radius: 30 },
  "enemy/drifter": { svg: drifterSvg, radius: 30 },
  "enemy/mote": { svg: moteSvg, radius: 30 },
  "enemy/husk": { svg: huskSvg, radius: 30 },
  "enemy/lunger": { svg: lungerSvg, radius: 30 },
  "enemy/wisp": { svg: wispSvg, radius: 30 },
  "enemy/caster": { svg: casterSvg, radius: 30 },
  "enemy/spore": { svg: sporeSvg, radius: 30 },
  "enemy/cinder": { svg: cinderSvg, radius: 30 },
  "enemy/revenant": { svg: revenantSvg, radius: 30 },
  "enemy/shard": { svg: shardSvg, radius: 30 },
  "enemy/colossus": { svg: colossusSvg, radius: 30 },
  "enemy/seer": { svg: seerSvg, radius: 30 },
  "enemy/lancer": { svg: lancerSvg, radius: 30 },
  // Bosses use a 160×160 viewBox; main mass radius ≈ 52 (glow extends past it).
  "boss/theMaw": { svg: theMawSvg, radius: 52 },
  "boss/theChoir": { svg: theChoirSvg, radius: 52 },
  "boss/thePyre": { svg: thePyreSvg, radius: 52 },
  "boss/theForge": { svg: theForgeSvg, radius: 52 },
  "boss/theRime": { svg: theRimeSvg, radius: 52 },
  "boss/theNadir": { svg: theNadirSvg, radius: 52 },
  "boss/theSovereign": { svg: theSovereignSvg, radius: 52 },
};

export class AssetManager {
  private readonly map = new Map<string, ArtImage>();

  constructor() {
    for (const key in ART_SOURCES) {
      const { svg, radius } = ART_SOURCES[key];
      // Bundled data URI: no network, works in file:// and on GitHub Pages.
      this.register(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, radius);
    }
    // Painted boss illustrations (user-supplied artwork) override the SVG
    // bosses. 256px canvases, body filling ~82% → design radius ≈ 95 so the
    // painted mass reads slightly larger than the hit circle, like the SVGs.
    for (const id in BOSS_RASTER) {
      this.register(`boss/${id}`, BOSS_RASTER[id], 95);
    }
  }

  private register(key: string, src: string, radius: number): void {
    const img = new Image();
    const entry: ArtImage = { img, radius, loaded: false };
    img.onload = () => {
      entry.loaded = true;
    };
    img.onerror = () => {
      // Leave loaded=false → renderer keeps the procedural fallback.
    };
    img.src = src;
    this.map.set(key, entry);
  }

  /** A loaded production asset for `key`, or null to use the procedural fallback. */
  get(key: string): ArtImage | null {
    const a = this.map.get(key);
    return a && a.loaded ? a : null;
  }
}
