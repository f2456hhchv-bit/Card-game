/**
 * Asset Pipeline & Derivation Rules (DIRECTIVE, binding, 2026-07-12). Three
 * pipelines cover every art asset — the renderer selects blend mode from a
 * def's own `pipeline` field, never from filename or guesswork:
 *   - keyed: pre-keyed RGBA PNGs (ships/enemies/boss/commander sprites,
 *     pickups, and by extension every icon-shaped asset in this project —
 *     equipment/passive/artifact/relic/resource/currency/manufacturer
 *     icons are all the same technical shape as a "pickup").
 *   - additive: RGB-on-black, rendered with a "lighter" composite — muzzle
 *     flashes, impacts, status effects, elite mutation tells, elite tier
 *     rings, ultimate VFX, particle bursts, rarity frames, artifact
 *     activations. Black is the transparency; never alpha-key these.
 *   - fullbleed: opaque backgrounds — biomes, UI screens, briefings,
 *     star-map art. No keying, no blending.
 *
 * Kept deliberately pure (no CanvasRenderingContext2D here) — the same
 * split this codebase already uses for Particles.ts: simulation/derivation
 * logic is unit-tested directly, the raw ctx calls stay in main.ts's
 * render loop and are verified live instead.
 */

export const ASSET_PIPELINE_KINDS = ["keyed", "additive", "fullbleed"] as const;
export type AssetPipelineKind = (typeof ASSET_PIPELINE_KINDS)[number];

export const ASSET_STATUSES = ["missing", "placeholder", "delivered"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const ASSET_SOURCE_KINDS = ["source", "derived"] as const;
export type AssetSourceKind = (typeof ASSET_SOURCE_KINDS)[number];

/**
 * How a source asset gets made. Precision vector UI — input glyphs, HUD
 * bars, UI kit, rarity frames, tier rings, star-map chrome, particle
 * primitives — is CODE-DRAWN per the Visual Style Rules (rounded chunky
 * geometry is exactly what canvas primitives do best); image generation is
 * the wrong tool for it and those entries are excluded from the asset run.
 */
export const ASSET_PRODUCTION_KINDS = ["generated", "codeDrawn"] as const;
export type AssetProductionKind = (typeof ASSET_PRODUCTION_KINDS)[number];

/** Generation order: P1 = playable vertical slice, P2 = commanders/biomes, P3 = the long tail. */
export type AssetPriority = 1 | 2 | 3;

/** Canvas composite operation each pipeline renders with — the ONLY place blend mode is decided. */
export function blendModeFor(pipeline: AssetPipelineKind): GlobalCompositeOperation {
  return pipeline === "additive" ? "lighter" : "source-over";
}

export interface AssetRegistryEntry {
  id: string;
  name: string;
  category: string;
  pipeline: AssetPipelineKind;
  sourceOrDerived: AssetSourceKind;
  /** Set only when sourceOrDerived === "derived" — the parent asset id it's generated from. */
  derivedFrom?: string;
  status: AssetStatus;
  /** How the asset gets made — codeDrawn entries never enter the generation run. */
  production: AssetProductionKind;
  /** Generation order — P1 first (playable vertical slice), then P2, then P3. */
  priority: AssetPriority;
  /**
   * §4 colour law: KEYED sprites are pre-processed via chroma-key
   * extraction — green for everything except Crystal Dominion, which is
   * magenta-keyed. Only meaningful for pipeline === "keyed".
   */
  keyColour?: "green" | "magenta";
}

/**
 * §4 colour law: substitutions for lore-green assets in KEYED-pipeline
 * source art, so nothing green reaches the chroma-key extraction step.
 * Additive/fullbleed assets keep green freely — this only governs what an
 * artist paints into a keyed sprite's own palette.
 */
export const COLOUR_LAW_SUBSTITUTIONS: Readonly<Record<string, string>> = {
  regeneration: "gold",
  poison: "amber",
  toxic: "amber",
  biomass: "amber-yellow",
};

/** §2: ship roster thumbnails are a downscale of the ship's own in-run sprite — never a second source file. */
export function deriveThumbnailTransform(sourceWidth: number, sourceHeight: number, targetSize: number): { scale: number; width: number; height: number } {
  const scale = targetSize / Math.max(sourceWidth, sourceHeight);
  return { scale, width: sourceWidth * scale, height: sourceHeight * scale };
}

/**
 * §2: enemy move state — a rotation "lean" over the idle sprite, driven by
 * facing angle and a walk-cycle oscillation. Pure function of time so it's
 * deterministic and testable without touching the RNG discipline (AF-001).
 */
export function deriveEnemyMoveLean(facingRadians: number, elapsedMs: number, leanAmplitudeRadians = 0.12, cycleMs = 260): { rotationRadians: number } {
  const oscillation = Math.sin((elapsedMs / cycleMs) * Math.PI * 2) * leanAmplitudeRadians;
  return { rotationRadians: facingRadians + oscillation };
}

/**
 * §2: enemy attack state — a recoil offset (pulls back along the facing
 * axis then snaps forward) plus a brief additive flash, over the idle
 * sprite. Pure function of elapsed time within the attack's own telegraph window.
 */
export function deriveEnemyAttackOverlay(elapsedMs: number, telegraphMs: number): { recoilOffset: number; flashAlpha: number } {
  const progress = telegraphMs > 0 ? Math.min(1, Math.max(0, elapsedMs / telegraphMs)) : 1;
  const recoilOffset = -Math.sin(progress * Math.PI) * 0.35;
  const flashAlpha = progress < 0.15 ? 1 - progress / 0.15 : 0;
  return { recoilOffset, flashAlpha };
}

export interface DeathFragment {
  dx: number;
  dy: number;
  rotationRadians: number;
}

/**
 * §2: enemy death state — fragment-and-fade over the idle sprite. A fixed
 * fragment layout (deterministic per enemy, via a simple seeded spread —
 * not AF-001's combat Rng, since this is pure presentation with no
 * gameplay consequence) drifting outward and fading as deathElapsedMs
 * advances toward deathDurationMs.
 */
export function deriveEnemyDeathFrame(deathElapsedMs: number, deathDurationMs: number, fragmentCount = 5, seed = 1): { fragments: readonly DeathFragment[]; alpha: number } {
  const progress = deathDurationMs > 0 ? Math.min(1, Math.max(0, deathElapsedMs / deathDurationMs)) : 1;
  const fragments: DeathFragment[] = [];
  for (let i = 0; i < fragmentCount; i += 1) {
    const angle = (i / fragmentCount) * Math.PI * 2 + seed * 0.618;
    const distance = progress * (0.6 + (i % 3) * 0.15);
    fragments.push({
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rotationRadians: angle * progress * 2,
    });
  }
  return { fragments, alpha: 1 - progress };
}

/**
 * §2: boss variants (World-Ender, Vanguard) are the base model at a
 * different scale — never a separate source model. Reuses the exact
 * hullMultiplier already passed to createWorldBossVariant/
 * createMiniBossVariant (bossData.ts), cube-rooted so hull (a volume-like
 * quantity) maps to a believable linear visual scale rather than a literal
 * 1:1 (a 0.35-hull mini boss should not render at 35% linear size).
 */
export function bossVisualScale(hullMultiplier: number): number {
  return Math.cbrt(hullMultiplier);
}
