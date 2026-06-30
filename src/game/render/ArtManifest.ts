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
  { key: "enemy/drifter", domain: "enemy", tier: "production", notes: "Original SVG — floating shade ghost w/ tattered hem + cold eyes (iconic mook)." },
  { key: "enemy/mote", domain: "enemy", tier: "production", notes: "Original SVG — tiny darting light-sprite w/ fins + comet spark." },
  { key: "enemy/husk", domain: "enemy", tier: "production", notes: "Original SVG — armoured stone shambler w/ molten seam + shoulder plates." },
  { key: "enemy/lunger", domain: "enemy", tier: "production", notes: "Original SVG — fanged pouncing predator w/ swept haunches." },
  { key: "enemy/wisp", domain: "enemy", tier: "production", notes: "Original SVG — teal flame-spirit w/ trailing wisps." },
  { key: "enemy/caster", domain: "enemy", tier: "production", notes: "Original SVG — hooded hex-caster channelling a glowing orb." },
  { key: "enemy/spore", domain: "enemy", tier: "production", notes: "Original SVG — bulbous fungal sac swollen to burst." },
  { key: "enemy/cinder", domain: "enemy", tier: "production", notes: "Original SVG — angry living-flame imp (ember palette). Unique silhouette." },
  { key: "enemy/revenant", domain: "enemy", tier: "production", notes: "Original SVG — hooded ember-wraith caster w/ burning eyes + tattered hem." },
  { key: "enemy/shard", domain: "enemy", tier: "production", notes: "Original SVG — angular living-ice crystal cluster (frost palette)." },
  { key: "enemy/colossus", domain: "enemy", tier: "production", notes: "Original SVG — hulking armoured ice golem w/ glowing core." },
  { key: "enemy/seer", domain: "enemy", tier: "production", notes: "Original SVG — Fade arcane rune-sentinel: eye-sigil in a hex plate." },
  { key: "enemy/lancer", domain: "enemy", tier: "production", notes: "Original SVG — Fade void manta-dart that charges in a line." },

  // Bosses.
  { key: "boss/theMaw", domain: "boss", tier: "production", notes: "Original SVG — void devourer: toothed maw ring around a hungry star + tendrils. TODO: entrance/death sequence + phase shifts." },
  { key: "boss/theChoir", domain: "boss", tier: "production", notes: "Original SVG — broken halo studded with watching eyes around a great central eye." },
  { key: "boss/thePyre", domain: "boss", tier: "production", notes: "Original SVG — cracked obsidian shell over a molten heart, flame-crowned." },
  { key: "boss/theForge", domain: "boss", tier: "production", notes: "Original SVG — horned iron forge-golem w/ visor eyes + molten core." },
  { key: "boss/theRime", domain: "boss", tier: "production", notes: "Original SVG — crystal heart radiating an 8-point frost star." },
  { key: "boss/theNadir", domain: "boss", tier: "production", notes: "Original SVG — abyssal leviathan eye ringed with frozen tendrils." },
  { key: "boss/theSovereign", domain: "boss", tier: "production", notes: "Original SVG — crowned void regent w/ imperious eye + orbiting regalia." },

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
