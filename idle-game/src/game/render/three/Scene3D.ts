/**
 * The battle viewport, rendered in real WebGL/Three.js: chibi PBR-lit rigs
 * (see Rig.ts) standing on a small floating platform against a space
 * backdrop (see SpaceBackdrop.ts). Like the rest of the render layer, this
 * is purely a *view* — it derives what to show from `Game.state` every
 * frame and only uses combat events for hit-flash/pop-in/label timing, so
 * it can never drift out of sync with the numbers driving the idle loop.
 */
import * as THREE from "three";
import type { Game, GameEvent } from "../../Game";
import type { CombatEvent } from "../../sim/Combat";
import type { GameState } from "../../state/GameState";
import { biomeForStage, isBossStage, type Biome } from "../../data/stageDefs";
import { archetypeForStage, bossShapeForStage } from "../../data/enemyDefs";
import { enemyHpFor, KILLS_PER_STAGE } from "../../sim/Economy";
import { RARITY_COLOR, RARITY_LABEL, SALVAGE_ALLOY } from "../../data/gearDefs";
import { buildHero, buildEnemy, buildBoss, disposeRig, type Rig } from "./Rig";
import { SpaceBackdrop } from "./SpaceBackdrop";
import { clamp01, lerp } from "../../../core/math/MathUtils";

const HERO_X = -0.78;
const ENEMY_X = 0.78;
const PLATFORM_TOP_Y = 0.09;

interface Label {
  sprite: THREE.Sprite;
  life: number;
  maxLife: number;
  vy: number;
}

interface Particle {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = clamp01(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function makeLabelTexture(text: string, color: string): { texture: THREE.Texture; aspect: number } {
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d")!;
  ctx.font = "700 40px ui-sans-serif, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  cv.width = Math.ceil(metrics.width) + 24;
  cv.height = 56;
  ctx.font = "700 40px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillText(text, cv.width / 2, cv.height / 2);
  const texture = new THREE.CanvasTexture(cv);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { texture, aspect: cv.width / cv.height };
}

export class Scene3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private backdrop = new SpaceBackdrop();

  private heroAnchor = new THREE.Group();
  private hero: Rig;
  private heroBob = 0;
  private heroAttackT = 0;
  private heroFlashT = 0;
  private shakeT = 0;

  private enemyAnchor = new THREE.Group();
  private enemy: Rig | null = null;
  private enemyBob = 0;
  private enemyFlashT = 0;
  private enemySpawnT = 1;
  private enemyDeathT = 0;
  private lastEncounterKey = "";

  private hpBarGroup = new THREE.Group();
  private hpBarFill: THREE.Mesh;
  private hpBarWidth = 0.7;

  private labels: Label[] = [];
  private particles: Particle[] = [];

  private width = 0;
  private height = 0;
  private resizeHandler = () => this.resize();
  private unsubscribe: () => void;

  constructor(private canvas: HTMLCanvasElement, private game: Game) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    this.camera.position.set(0, 1.55, 3.3);
    this.camera.lookAt(0, 0.45, 0);

    this.scene.add(this.backdrop.group);
    this.buildLighting();

    this.hero = buildHero();
    this.heroAnchor.position.set(HERO_X, PLATFORM_TOP_Y, 0);
    this.heroAnchor.add(this.hero.group);
    this.scene.add(this.heroAnchor);

    this.enemyAnchor.position.set(ENEMY_X, PLATFORM_TOP_Y, 0);
    this.scene.add(this.enemyAnchor);

    this.hpBarGroup.visible = false;
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(this.hpBarWidth, 0.09),
      new THREE.MeshBasicMaterial({ color: "#0a0e0a", transparent: true, opacity: 0.65 }),
    );
    this.hpBarGroup.add(bg);
    const fillGeo = new THREE.PlaneGeometry(this.hpBarWidth, 0.075);
    fillGeo.translate(this.hpBarWidth / 2, 0, 0.001);
    this.hpBarFill = new THREE.Mesh(fillGeo, new THREE.MeshBasicMaterial({ color: "#8cffb0" }));
    this.hpBarFill.position.x = -this.hpBarWidth / 2;
    this.hpBarGroup.add(this.hpBarFill);
    this.scene.add(this.hpBarGroup);

    this.resize();
    window.addEventListener("resize", this.resizeHandler);
    this.unsubscribe = game.on((event) => this.onGameEvent(event));
  }

  dispose(): void {
    window.removeEventListener("resize", this.resizeHandler);
    this.unsubscribe();
    if (this.enemy) disposeRig(this.enemy);
    disposeRig(this.hero);
    this.renderer.dispose();
  }

  private buildLighting(): void {
    const hemi = new THREE.HemisphereLight(0x9fb4ff, 0x100a18, 0.75);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff3e0, 1.3);
    key.position.set(2.2, 3.4, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.003;
    this.scene.add(key);

    const rim = new THREE.PointLight(0x7d8cff, 6, 8, 2);
    rim.position.set(-1.6, 1.4, -1.8);
    this.scene.add(rim);

    const fill = new THREE.PointLight(0xffffff, 1.2, 6, 2);
    fill.position.set(-1.2, 1.2, 2.4);
    this.scene.add(fill);
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  private onGameEvent(event: GameEvent): void {
    if (event.kind === "combat") this.onCombatEvent(event.event);
  }

  private onCombatEvent(event: CombatEvent): void {
    switch (event.type) {
      case "kill":
      case "bossKill":
        this.heroAttackT = 1;
        this.enemyFlashT = 1;
        this.enemyDeathT = 1;
        break;
      case "heroDeath":
        this.heroFlashT = 1;
        this.shakeT = 0.35;
        this.spawnLabel(this.heroAnchor.position, "Retreating...", "#ff8a8a");
        break;
      case "levelUp":
        this.spawnLabel(this.heroAnchor.position, `Level ${event.toLevel}!`, "#8cffb0");
        break;
      case "gearDrop": {
        const rarity = event.rarity ?? "common";
        const color = RARITY_COLOR[rarity];
        const label = event.equipped ? `${RARITY_LABEL[rarity]} equipped!` : `+${SALVAGE_ALLOY[rarity]} Alloy`;
        this.spawnLabel(this.enemyAnchor.position, label, color);
        break;
      }
    }
  }

  private spawnLabel(worldPos: THREE.Vector3, text: string, color: string): void {
    const { texture, aspect } = makeLabelTexture(text, color);
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.5 * aspect, 0.5, 1);
    sprite.position.copy(worldPos).add(new THREE.Vector3(0, 0.75, 0));
    sprite.renderOrder = 10;
    this.scene.add(sprite);
    this.labels.push({ sprite, life: 1.4, maxLife: 1.4, vy: 0.35 });
  }

  private spawnBurst(worldPos: THREE.Vector3, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 16;
      const ctx = cv.getContext("2d")!;
      const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 16, 16);
      const tex = new THREE.CanvasTexture(cv);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(0.12);
      sprite.position.copy(worldPos).add(new THREE.Vector3(0, 0.5, 0));
      this.scene.add(sprite);
      const a = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.1;
      this.particles.push({
        sprite,
        velocity: new THREE.Vector3(Math.cos(a) * speed, 1.2 + Math.random() * 0.8, Math.sin(a) * speed),
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
      });
    }
  }

  render(dtSeconds: number): void {
    const dt = Math.min(0.1, Math.max(0, dtSeconds));
    const state = this.game.state;
    const biome = biomeForStage(state.stage);
    this.backdrop.setSector(biome);
    this.backdrop.update(dt);

    const bossEncounter = isBossStage(state.stage) && state.killsInStage >= KILLS_PER_STAGE;
    const encounterKey = bossEncounter ? `boss:${state.stage}` : `mob:${state.stage}:${state.killsInStage}`;
    if (encounterKey !== this.lastEncounterKey) {
      this.lastEncounterKey = encounterKey;
      this.swapEnemy(biome, state, bossEncounter);
    }

    this.tick(dt);
    this.updateHpBar(state, bossEncounter);
    this.applyShake();
    this.renderer.render(this.scene, this.camera);
  }

  private swapEnemy(biome: Biome, state: GameState, bossEncounter: boolean): void {
    if (this.enemy) {
      disposeRig(this.enemy);
      this.enemyAnchor.remove(this.enemy.group);
    }
    const hue = bossEncounter ? biome.enemyHue + 10 : biome.enemyHue;
    this.enemy = bossEncounter
      ? buildBoss(bossShapeForStage(state.stage), hue)
      : buildEnemy(archetypeForStage(state.stage).shape, hue);
    this.enemyAnchor.add(this.enemy.group);
    this.enemySpawnT = 0;
  }

  private tick(dt: number): void {
    this.heroBob += dt;
    this.enemyBob += dt;
    this.heroAttackT = Math.max(0, this.heroAttackT - dt * 3.2);
    this.heroFlashT = Math.max(0, this.heroFlashT - dt * 4);
    this.enemyFlashT = Math.max(0, this.enemyFlashT - dt * 4);
    this.shakeT = Math.max(0, this.shakeT - dt * 2.4);
    this.enemySpawnT = Math.min(1, this.enemySpawnT + dt * 5);

    if (this.enemyDeathT > 0) {
      const wasAlive = this.enemyDeathT > 0.85;
      this.enemyDeathT = Math.max(0, this.enemyDeathT - dt * 3.4);
      if (wasAlive) this.spawnBurst(this.enemyAnchor.position, "#8cffb0", 10);
    }

    // Hero: idle bob + attack lean.
    this.heroAnchor.position.y = PLATFORM_TOP_Y + Math.sin(this.heroBob * 2.4) * 0.02;
    this.heroAnchor.rotation.z = -this.heroAttackT * 0.18;
    this.heroAnchor.position.x = HERO_X + this.heroAttackT * 0.1;
    this.applyFlash(this.hero, this.heroFlashT);

    // Enemy: idle bob + pop-in scale + death fade.
    if (this.enemy) {
      const popIn = easeOutBack(this.enemySpawnT);
      const deathFade = this.enemyDeathT > 0 ? this.enemyDeathT : 1;
      const deathScale = this.enemyDeathT > 0 ? lerp(1, 1.2, 1 - this.enemyDeathT) : 1;
      const scale = popIn * deathScale;
      this.enemy.group.scale.setScalar(scale);
      this.enemyAnchor.position.y = PLATFORM_TOP_Y + Math.sin(this.enemyBob * 2.1 + 1.4) * 0.02;
      this.setOpacity(this.enemy, clamp01(deathFade));
      this.applyFlash(this.enemy, this.enemyFlashT);
    }

    // Labels: float up and fade.
    for (const label of this.labels) {
      label.life -= dt;
      label.sprite.position.y += label.vy * dt;
      const mat = label.sprite.material as THREE.SpriteMaterial;
      mat.opacity = clamp01(label.life / label.maxLife);
    }
    for (const label of this.labels.filter((l) => l.life <= 0)) {
      this.scene.remove(label.sprite);
      (label.sprite.material as THREE.SpriteMaterial).map?.dispose();
      label.sprite.material.dispose();
    }
    this.labels = this.labels.filter((l) => l.life > 0);

    // Particles: burst outward, gravity, fade.
    for (const p of this.particles) {
      p.life -= dt;
      p.sprite.position.addScaledVector(p.velocity, dt);
      p.velocity.y -= dt * 2.4;
      const mat = p.sprite.material as THREE.SpriteMaterial;
      mat.opacity = clamp01(p.life / p.maxLife);
    }
    for (const p of this.particles.filter((p) => p.life <= 0)) {
      this.scene.remove(p.sprite);
      (p.sprite.material as THREE.SpriteMaterial).map?.dispose();
      p.sprite.material.dispose();
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  /** Painted sprite billboards have no emissive channel to pulse — over-
   * driving the (tone-mapped) sprite colour blows it toward white instead,
   * scaled up from the sprite's resting tint rather than a hard reset so a
   * sector-hue tint survives the flash. */
  private applyFlash(rig: Rig, flashT: number): void {
    const boost = 1 + Math.min(1, flashT) * 3;
    rig.spriteMaterial.color.copy(rig.spriteBaseColor).multiplyScalar(boost);
  }

  private setOpacity(rig: Rig, alpha: number): void {
    rig.group.traverse((obj) => {
      if (obj instanceof THREE.Sprite) {
        obj.material.opacity = alpha;
      }
    });
  }

  private updateHpBar(state: GameState, bossEncounter: boolean): void {
    if (!this.enemy || (this.enemyDeathT > 0 && this.enemyDeathT < 0.5)) {
      this.hpBarGroup.visible = false;
      return;
    }
    const maxHp = enemyHpFor(state.stage, bossEncounter);
    const frac = maxHp > 0 ? clamp01(state.enemyHp / maxHp) : 0;
    this.hpBarFill.scale.x = Math.max(0.02, frac);
    const fillMat = this.hpBarFill.material as THREE.MeshBasicMaterial;
    fillMat.color.set(bossEncounter ? "#ffb14a" : "#8cffb0");
    this.hpBarGroup.visible = true;
    this.hpBarGroup.position.set(
      this.enemyAnchor.position.x,
      this.enemyAnchor.position.y + this.enemy.height + (bossEncounter ? 0.35 : 0.15),
      this.enemyAnchor.position.z,
    );
    this.hpBarGroup.quaternion.copy(this.camera.quaternion);
  }

  private applyShake(): void {
    if (this.shakeT <= 0) {
      this.camera.position.set(0, 1.55, 3.3);
      return;
    }
    const s = this.shakeT * 0.05;
    this.camera.position.set((Math.random() - 0.5) * s, 1.55 + (Math.random() - 0.5) * s, 3.3);
    this.camera.lookAt(0, 0.45, 0);
  }
}
