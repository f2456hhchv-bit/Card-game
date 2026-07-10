/**
 * Chibi rigs for the battle viewport: real painted art (see
 * tools/vanguardArt.py, tools/alienCreatures.py) shown as camera-facing
 * THREE.Sprite billboards, lit by Scene3D's light rig and platform shadow
 * so they sit in the same soft-PBR scene as everything else, rather than a
 * flat 2D overlay.
 *
 * Each builder returns a fresh `Rig` (never cached/cloned) — encounters
 * change every few seconds at most, so rebuilding a lightweight sprite is
 * negligible, and it sidesteps any shared-material state bugs between a
 * cached template and the one live instance on screen.
 */
import * as THREE from "three";
import type { EnemyShape } from "../../data/enemyDefs";
import type { BossArchetype } from "../../data/enemyDefs";
import { HERO_PORTRAIT, BOSS_SPRITES, type PaintedSprite } from "./paintedArt";
import { ENEMY_SPRITES } from "./alienCreatures";

export interface Rig {
  group: THREE.Group;
  /** Approximate on-screen height, used to place HP bars / ground the rig. */
  height: number;
  spriteMaterial: THREE.SpriteMaterial;
  /** The sprite's resting tint, so a hit-flash can brighten from it and
   * reset back to it (rather than wiping a sector-hue tint to pure white). */
  spriteBaseColor: THREE.Color;
}

function hsl(hue: number, s: number, l: number): THREE.Color {
  return new THREE.Color().setHSL((((hue % 360) + 360) % 360) / 360, s, l);
}

const textureCache = new Map<string, THREE.Texture>();
function loadTexture(uri: string): THREE.Texture {
  let tex = textureCache.get(uri);
  if (!tex) {
    tex = new THREE.TextureLoader().load(uri);
    tex.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(uri, tex);
  }
  return tex;
}

/** A camera-facing painted-art billboard (THREE.Sprite auto-faces the
 * camera). `tintHue` applies a faint colour tint for per-sector variety
 * without muddying the art. */
function buildSpriteRig(sprite: PaintedSprite, worldHeight: number, tintHue?: number): Rig {
  const group = new THREE.Group();
  const mat = new THREE.SpriteMaterial({
    map: loadTexture(sprite.uri),
    transparent: true,
    color: tintHue === undefined ? 0xffffff : hsl(tintHue, 0.15, 0.92),
  });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(worldHeight * sprite.aspect, worldHeight, 1);
  spr.position.y = worldHeight / 2;
  group.add(spr);
  return { group, height: worldHeight, spriteMaterial: mat, spriteBaseColor: mat.color.clone() };
}

// ---- Hero: the Vanguard, a painted chibi Warden-class pilot ---------------

export function buildHero(): Rig {
  return buildSpriteRig(HERO_PORTRAIT, 0.85);
}

// ---- Hollow creatures -------------------------------------------------

const ENEMY_WORLD_HEIGHT: Record<EnemyShape, number> = {
  wraith: 0.55,
  shard: 0.45,
  brute: 0.62,
  darter: 0.5,
  dome: 0.5,
  robed: 0.58,
};

export function buildEnemy(shape: EnemyShape, hue: number): Rig {
  return buildSpriteRig(ENEMY_SPRITES[shape], ENEMY_WORLD_HEIGHT[shape], hue);
}

// ---- Bosses -----------------------------------------------------------

const BOSS_WORLD_HEIGHT: Record<BossArchetype["shape"], number> = {
  maw: 1.3,
  choir: 1.15,
};

export function buildBoss(shape: BossArchetype["shape"], hue: number): Rig {
  return buildSpriteRig(BOSS_SPRITES[shape], BOSS_WORLD_HEIGHT[shape], hue);
}

/** Free GPU resources — call when a rig is removed from the scene. Textures
 * are cached/shared across rigs (see loadTexture) and intentionally not
 * disposed here. */
export function disposeRig(rig: Rig): void {
  rig.spriteMaterial.dispose();
}
