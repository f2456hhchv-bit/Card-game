/**
 * The space diorama behind the battle: a starfield, a sector-tinted nebula
 * backdrop (baked once per sector into a canvas texture — the same
 * gradient/blotch painting technique AFTERLIGHT uses for its own sky, just
 * applied to a 3D backdrop sphere instead of drawn straight to the frame),
 * and a small floating platform the hero and Hollow stand on.
 */
import * as THREE from "three";
import type { Biome } from "../../data/stageDefs";

function mulberry(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function makeStarSpriteTexture(): THREE.Texture {
  const size = 32;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function bakeNebulaTexture(biome: Biome, seed: number): THREE.Texture {
  const w = 512;
  const h = 512;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  const rng = mulberry(seed);

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, `hsl(${biome.fogHue} 45% 10%)`);
  sky.addColorStop(0.55, `hsl(${biome.fogHue} 40% 6%)`);
  sky.addColorStop(1, `hsl(${biome.fogHue} 35% 3%)`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    const x = rng() * w;
    const y = rng() * h * 0.7;
    const r = 80 + rng() * 160;
    const hue = biome.fogHue + rng() * 40 - 20;
    const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
    cloud.addColorStop(0, `hsla(${hue}, 60%, 45%, 0.22)`);
    cloud.addColorStop(1, `hsla(${hue}, 60%, 45%, 0)`);
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class SpaceBackdrop {
  readonly group = new THREE.Group();
  readonly platform: THREE.Mesh;
  private nebulaSphere: THREE.Mesh;
  private nebulaMat: THREE.MeshBasicMaterial;
  private stars: THREE.Points;
  private currentBiomeId = "";

  constructor() {
    const starTex = makeStarSpriteTexture();
    const starGeo = new THREE.BufferGeometry();
    const STAR_COUNT = 600;
    const positions = new Float32Array(STAR_COUNT * 3);
    const rng = mulberry(1337);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 30 + rng() * 20;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(rng() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.6 + 1;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.35,
      map: starTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.stars = new THREE.Points(starGeo, starMat);
    this.group.add(this.stars);

    this.nebulaMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, fog: false });
    this.nebulaSphere = new THREE.Mesh(new THREE.SphereGeometry(45, 24, 16), this.nebulaMat);
    this.group.add(this.nebulaSphere);

    const platformMat = new THREE.MeshStandardMaterial({ color: "#334", roughness: 0.6, metalness: 0.2 });
    this.platform = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 0.18, 28), platformMat);
    this.platform.receiveShadow = true;
    this.group.add(this.platform);

    const ringMat = new THREE.MeshStandardMaterial({
      color: "#0a1420",
      emissive: new THREE.Color("#7d8cff"),
      emissiveIntensity: 1.1,
      roughness: 0.4,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.03, 8, 48), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.1;
    this.group.add(ring);
  }

  setSector(biome: Biome): void {
    if (biome.id === this.currentBiomeId) return;
    this.currentBiomeId = biome.id;
    const seed = hashSeed(biome.id);
    this.nebulaMat.map?.dispose();
    this.nebulaMat.map = bakeNebulaTexture(biome, seed);
    this.nebulaMat.needsUpdate = true;
    const platformMat = this.platform.material as THREE.MeshStandardMaterial;
    const groundHue01 = (((biome.groundHue % 360) + 360) % 360) / 360;
    platformMat.color = new THREE.Color().setHSL(groundHue01, 0.3, 0.28);
  }

  update(dtSeconds: number): void {
    this.stars.rotation.y += dtSeconds * 0.004;
  }
}
