/**
 * Chibi 3D rigs built from primitives — real geometry lit by real lights, not
 * a faked 2D look. Every material is a `MeshStandardMaterial` (roughness +
 * metalness = physically-based) or `MeshPhysicalMaterial` (adds clearcoat /
 * transmission for glassy canopies and translucent Hollow domes), so the
 * "soft PBR lighting" comes from Scene3D's light rig reflecting off real
 * surfaces, not a painted-on highlight.
 *
 * Each builder returns a fresh `Rig` (never cached/cloned) — encounters
 * change every few seconds at most, so rebuilding a dozen cheap primitives
 * is negligible, and it sidesteps any shared-material state bugs between a
 * cached template and the one live instance on screen.
 */
import * as THREE from "three";
import type { EnemyShape } from "../../data/enemyDefs";
import type { BossArchetype } from "../../data/enemyDefs";

export interface FlashableMaterial {
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
  baseEmissive: THREE.Color;
  baseEmissiveIntensity: number;
}

export interface Rig {
  group: THREE.Group;
  /** Materials that pulse white on a hit (everything except pure-glow bits). */
  flashables: FlashableMaterial[];
  /** Approximate half-height, used to place HP bars / ground the rig. */
  height: number;
}

function hsl(hue: number, s: number, l: number): THREE.Color {
  return new THREE.Color().setHSL(((hue % 360) + 360) % 360 / 360, s, l);
}

function standardMat(hue: number, s: number, l: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: hsl(hue, s, l),
    roughness: 0.55,
    metalness: 0.08,
    ...opts,
  });
}

function trackable(rig: Rig, mesh: THREE.Mesh, mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial): void {
  rig.group.add(mesh);
  rig.flashables.push({
    material: mat,
    baseEmissive: mat.emissive.clone(),
    baseEmissiveIntensity: mat.emissiveIntensity,
  });
}

function eyeDot(rig: Rig, x: number, y: number, z: number, r: number, hue = 190): void {
  const mat = new THREE.MeshStandardMaterial({
    color: "#0a0f1a",
    emissive: hsl(hue, 0.9, 0.62),
    emissiveIntensity: 1.6,
    roughness: 0.25,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  trackable(rig, mesh, mat);
}

function newRig(): Rig {
  const group = new THREE.Group();
  return { group, flashables: [], height: 1 };
}

// ---- Hero: a chibi Warden-class light-fighter -----------------------------

export function buildHero(): Rig {
  const rig = newRig();

  // Rounded fuselage — a squashed egg shape, the classic chibi-vehicle body.
  const hullMat = standardMat(212, 0.55, 0.78, { roughness: 0.32, metalness: 0.12 });
  const hull = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), hullMat);
  hull.scale.set(1, 0.72, 1.35);
  hull.position.y = 0.02;
  hull.castShadow = true;
  hull.receiveShadow = true;
  trackable(rig, hull, hullMat);

  // Belly accent stripe.
  const stripeMat = standardMat(228, 0.65, 0.55, { roughness: 0.4 });
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 20, 1, true), stripeMat);
  stripe.rotation.z = Math.PI / 2;
  stripe.position.set(0, -0.08, 0.05);
  trackable(rig, stripe, stripeMat);

  // Glassy cockpit canopy (physical material: clearcoat for a glossy PBR
  // highlight, the "clean hand-painted" glint on a toy-like hull).
  const canopyMat = new THREE.MeshPhysicalMaterial({
    color: "#0c1420",
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: hsl(200, 0.9, 0.4),
    emissiveIntensity: 0.35,
  });
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 16), canopyMat);
  canopy.position.set(0, 0.14, 0.28);
  canopy.scale.set(1, 0.85, 1);
  trackable(rig, canopy, canopyMat);

  // Stubby swept wings.
  const wingMat = standardMat(226, 0.6, 0.62, { roughness: 0.45 });
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), wingMat);
    wing.rotation.z = side * 1.15;
    wing.rotation.y = Math.PI / 4;
    wing.position.set(side * 0.4, -0.02, -0.05);
    wing.scale.set(0.5, 1, 0.9);
    wing.castShadow = true;
    trackable(rig, wing, wingMat);
  }

  // Engine glow (pure emissive, not flash-tracked — it should stay lit).
  const engineMat = new THREE.MeshStandardMaterial({
    color: "#0a1622",
    emissive: hsl(195, 1, 0.6),
    emissiveIntensity: 2.2,
    roughness: 0.4,
  });
  const engine = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), engineMat);
  engine.position.set(0, -0.02, -0.62);
  rig.group.add(engine);

  rig.height = 0.55;
  return rig;
}

// ---- Hollow creatures -------------------------------------------------

function buildWraith(hue: number): Rig {
  const rig = newRig();
  const robeMat = standardMat(hue, 0.42, 0.28, { roughness: 0.7 });
  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.62, 10), robeMat);
  robe.position.y = 0.22;
  robe.castShadow = true;
  trackable(rig, robe, robeMat);
  const hoodMat = standardMat(hue, 0.4, 0.32, { roughness: 0.65 });
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), hoodMat);
  hood.position.y = 0.5;
  hood.scale.set(1, 0.9, 1);
  trackable(rig, hood, hoodMat);
  eyeDot(rig, 0, 0.48, 0.19, 0.045, hue + 40);
  rig.height = 0.55;
  return rig;
}

function buildShard(hue: number): Rig {
  const rig = newRig();
  const mat = new THREE.MeshPhysicalMaterial({
    color: hsl(hue, 0.7, 0.55),
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1,
    emissive: hsl(hue, 0.9, 0.5),
    emissiveIntensity: 0.6,
  });
  const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), mat);
  shard.position.y = 0.3;
  shard.castShadow = true;
  trackable(rig, shard, mat);
  rig.height = 0.45;
  return rig;
}

function buildBrute(hue: number): Rig {
  const rig = newRig();
  const bodyMat = standardMat(hue, 0.45, 0.35, { roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), bodyMat);
  body.scale.set(1.05, 0.95, 1);
  body.position.y = 0.32;
  body.castShadow = true;
  trackable(rig, body, bodyMat);
  const plateMat = standardMat(hue, 0.4, 0.22, { roughness: 0.4, metalness: 0.25 });
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.4), plateMat);
  plate.position.y = 0.5;
  trackable(rig, plate, plateMat);
  for (const side of [-1, 1]) {
    const armMat = standardMat(hue, 0.4, 0.3, { roughness: 0.6 });
    const arm = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), armMat);
    arm.position.set(side * 0.4, 0.28, 0);
    trackable(rig, arm, armMat);
  }
  eyeDot(rig, -0.12, 0.36, 0.3, 0.05, hue + 20);
  eyeDot(rig, 0.12, 0.36, 0.3, 0.05, hue + 20);
  rig.height = 0.62;
  return rig;
}

function buildDarter(hue: number): Rig {
  const rig = newRig();
  const bodyMat = standardMat(hue, 0.6, 0.5, { roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), bodyMat);
  body.rotation.x = Math.PI / 2;
  body.position.y = 0.3;
  body.castShadow = true;
  trackable(rig, body, bodyMat);
  const finMat = standardMat(hue, 0.6, 0.4, { roughness: 0.5 });
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 3), finMat);
    fin.rotation.z = side * 1.3;
    fin.position.set(side * 0.2, 0.3, -0.1);
    trackable(rig, fin, finMat);
  }
  eyeDot(rig, 0, 0.32, 0.3, 0.05, hue + 25);
  rig.height = 0.5;
  return rig;
}

function buildDome(hue: number): Rig {
  const rig = newRig();
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: hsl(hue, 0.7, 0.7),
    roughness: 0.2,
    transmission: 0.55,
    thickness: 0.4,
    emissive: hsl(hue, 0.8, 0.5),
    emissiveIntensity: 0.35,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), domeMat);
  dome.position.y = 0.4;
  trackable(rig, dome, domeMat);
  const tendrilMat = standardMat(hue, 0.6, 0.6, { roughness: 0.5, transparent: true, opacity: 0.75 });
  for (let i = -1; i <= 1; i++) {
    const tendril = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.32, 6), tendrilMat);
    tendril.position.set(i * 0.12, 0.16, 0);
    trackable(rig, tendril, tendrilMat);
  }
  eyeDot(rig, 0, 0.4, 0.24, 0.045, hue + 30);
  rig.height = 0.5;
  return rig;
}

function buildRobed(hue: number): Rig {
  const rig = newRig();
  const robeMat = standardMat(hue, 0.5, 0.32, { roughness: 0.65 });
  const robe = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.55, 12), robeMat);
  robe.position.y = 0.24;
  robe.castShadow = true;
  trackable(rig, robe, robeMat);
  const headMat = standardMat(hue, 0.45, 0.36, { roughness: 0.6 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), headMat);
  head.position.y = 0.55;
  trackable(rig, head, headMat);
  eyeDot(rig, 0, 0.54, 0.14, 0.035, hue + 20);
  const orbMat = new THREE.MeshStandardMaterial({
    color: "#150a1e",
    emissive: hsl(hue + 25, 0.9, 0.6),
    emissiveIntensity: 1.8,
    roughness: 0.3,
  });
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), orbMat);
  orb.position.set(0.3, 0.32, 0.1);
  rig.group.add(orb);
  rig.height = 0.58;
  return rig;
}

const ENEMY_BUILDERS: Record<EnemyShape, (hue: number) => Rig> = {
  wraith: buildWraith,
  shard: buildShard,
  brute: buildBrute,
  darter: buildDarter,
  dome: buildDome,
  robed: buildRobed,
};

export function buildEnemy(shape: EnemyShape, hue: number): Rig {
  return ENEMY_BUILDERS[shape](hue);
}

// ---- Bosses ----------------------------------------------------------------

function buildMaw(hue: number): Rig {
  const rig = newRig();
  const mat = standardMat(hue, 0.5, 0.3, { roughness: 0.55, flatShading: true });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), mat);
  core.castShadow = true;
  trackable(rig, core, mat);
  eyeDot(rig, 0, 0.05, 0.5, 0.12, hue + 30);
  rig.height = 1.0;
  return rig;
}

function buildChoir(hue: number): Rig {
  const rig = newRig();
  const ringMat = standardMat(hue, 0.5, 0.32, { roughness: 0.55, metalness: 0.15 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.16, 14, 28), ringMat);
  ring.rotation.x = Math.PI / 2.4;
  ring.castShadow = true;
  trackable(rig, ring, ringMat);
  const coreMat = new THREE.MeshStandardMaterial({
    color: "#120a1a",
    emissive: hsl(hue, 0.9, 0.6),
    emissiveIntensity: 1.2,
    roughness: 0.4,
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), coreMat);
  rig.group.add(core);
  const eyeCount = 6;
  for (let i = 0; i < eyeCount; i++) {
    const a = (i / eyeCount) * Math.PI * 2;
    eyeDot(rig, Math.cos(a) * 0.5, Math.sin(a) * 0.5 * 0.4 + 0.05, Math.sin(a) * 0.5 * 0.9, 0.06, hue + 18);
  }
  rig.height = 0.9;
  return rig;
}

const BOSS_BUILDERS: Record<BossArchetype["shape"], (hue: number) => Rig> = {
  maw: buildMaw,
  choir: buildChoir,
};

export function buildBoss(shape: BossArchetype["shape"], hue: number): Rig {
  return BOSS_BUILDERS[shape](hue);
}

/** Recursively free GPU resources — call when a rig is removed from the scene. */
export function disposeRig(rig: Rig): void {
  rig.group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) m.dispose();
    }
  });
}
