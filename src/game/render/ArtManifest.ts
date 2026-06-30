/**
 * Art Manifest — the single registry of every visual asset and its production
 * quality tier. This is the seam mandated by docs/ArtDirection.md: it lets us
 * track what still needs production art and lets real PNG/atlas art drop in
 * without refactoring game systems (renderers look assets up by key here).
 *
 * Tiers:
 *  - "placeholder"       : programmer-art / primitive — MUST be replaced.
 *  - "procedural-final"  : high-quality baked procedural art; acceptable until a
 *                          production PNG/atlas exists, then swapped via the same key.
 *  - "production"        : final hand-crafted / generated production art.
 */
export type ArtTier = "placeholder" | "procedural-final" | "production";

export interface ArtEntry {
  /** Stable key (matches SpriteForge / atlas lookup). */
  key: string;
  /** Domain for grouping in reviews. */
  domain: "hero" | "enemy" | "boss" | "projectile" | "pickup" | "vfx" | "ui" | "environment";
  tier: ArtTier;
  /** What's still needed to reach production, or what's done. */
  notes: string;
  /** Animation states that exist for this asset (for the anim state machine). */
  anims?: string[];
}

/**
 * Current registry. As art is produced, bump `tier` and update `notes`; the
 * end-of-cycle Art Polish Pass uses the gaps here to pick the next work.
 */
export const ART_MANIFEST: ArtEntry[] = [
  // Heroes (the Guardian ship + per-Warden tints).
  { key: "hero/warden", domain: "hero", tier: "production", anims: ["idle"], notes: "Original illustrated SVG (layered hull/cockpit/swept wings/engine glow/rim light), loaded via AssetManager. TODO: per-Warden unique silhouettes + walk/attack/hit/death anim." },

  // Enemies.
  { key: "drifter", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked. TODO: spawn/death anim, unique movement tells." },
  { key: "mote", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "husk", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "lunger", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "wisp", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "caster", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "spore", domain: "enemy", tier: "procedural-final", anims: ["idle"], notes: "Baked." },
  { key: "cinder", domain: "enemy", tier: "placeholder", notes: "Recolour of lunger — REQUIRES unique silhouette per directive." },
  { key: "revenant", domain: "enemy", tier: "placeholder", notes: "Recolour of caster — REQUIRES unique silhouette." },
  { key: "shard", domain: "enemy", tier: "placeholder", notes: "Recolour of mote — REQUIRES unique silhouette." },
  { key: "colossus", domain: "enemy", tier: "placeholder", notes: "Recolour of husk — REQUIRES unique silhouette." },

  // Bosses.
  { key: "theMaw", domain: "boss", tier: "procedural-final", notes: "Baked. TODO: entrance + death sequence, phase visual shifts." },
  { key: "theChoir", domain: "boss", tier: "procedural-final", notes: "Baked." },
  { key: "thePyre", domain: "boss", tier: "placeholder", notes: "Recolour of theChoir — REQUIRES unique boss silhouette." },
  { key: "theForge", domain: "boss", tier: "placeholder", notes: "Recolour of theMaw — REQUIRES unique boss silhouette." },
  { key: "theRime", domain: "boss", tier: "placeholder", notes: "Recolour of theChoir — REQUIRES unique boss silhouette." },
  { key: "theNadir", domain: "boss", tier: "placeholder", notes: "Recolour of theMaw — REQUIRES unique boss silhouette." },

  // FX / rendering pipeline.
  { key: "postfx.bloom", domain: "vfx", tier: "procedural-final", notes: "Quarter-res threshold bloom composite — engine-level, applies to all art." },
  { key: "postfx.grade", domain: "vfx", tier: "placeholder", notes: "Colour grading not yet implemented." },
  { key: "vfx.trails", domain: "vfx", tier: "placeholder", notes: "Weapon/energy trails not yet implemented." },

  // Environment.
  { key: "bg.fade", domain: "environment", tier: "procedural-final", notes: "Nebula + parallax starfield + fog + vignette per stage palette." },
];

/** Count of assets still needing production art (for cycle reporting). */
export function placeholderCount(): number {
  return ART_MANIFEST.filter((a) => a.tier === "placeholder").length;
}
