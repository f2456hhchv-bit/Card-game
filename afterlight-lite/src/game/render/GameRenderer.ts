import type { Renderer } from "../../engine/Renderer";
import type { Camera } from "../../engine/Camera";
import type { Input } from "../../engine/Input";
import type { World } from "../World";
import { drawCreatureSprite, drawEntitySprite } from "./PlaceholderArt";
import { getShipDef } from "../data/shipDefs";
import { getUpgradeDef } from "../data/upgradeDefs";

const STAR_FIELD_SIZE = 3000;
const STAR_COUNT = 220;

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
}

const stars: Star[] = buildStarfield();

function makeRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 8) / 0x7fffff;
  };
}

function buildStarfield(): Star[] {
  const rand = makeRng(1337);
  const list: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    list.push({
      x: rand() * STAR_FIELD_SIZE - STAR_FIELD_SIZE / 2,
      y: rand() * STAR_FIELD_SIZE - STAR_FIELD_SIZE / 2,
      r: rand() * 1.5 + 0.4,
      a: rand() * 0.5 + 0.25,
    });
  }
  return list;
}

// --------------------------------------------------------------- nebula

const NEBULA_TILE_SIZE = 2600;
const NEBULA_PALETTE = ["#5c2ce0", "#1c6fa8", "#8a1fb0", "#0e3a6b", "#3a0e6b", "#2c7e8a"];

interface NebulaBlob {
  x: number;
  y: number;
  r: number;
  color: string;
  alpha: number;
}

const nebulaBlobs: NebulaBlob[] = buildNebulaBlobs();

function buildNebulaBlobs(): NebulaBlob[] {
  const rand = makeRng(4242);
  const list: NebulaBlob[] = [];
  for (let i = 0; i < 8; i++) {
    list.push({
      x: rand() * NEBULA_TILE_SIZE - NEBULA_TILE_SIZE / 2,
      y: rand() * NEBULA_TILE_SIZE - NEBULA_TILE_SIZE / 2,
      r: rand() * 500 + 350,
      color: NEBULA_PALETTE[Math.floor(rand() * NEBULA_PALETTE.length)],
      alpha: rand() * 0.14 + 0.07,
    });
  }
  return list;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function drawNebula(ctx: CanvasRenderingContext2D, camera: Camera, renderer: Renderer): void {
  const tileX = Math.floor(camera.x / NEBULA_TILE_SIZE);
  const tileY = Math.floor(camera.y / NEBULA_TILE_SIZE);
  for (let ty = tileY - 1; ty <= tileY + 1; ty++) {
    for (let tx = tileX - 1; tx <= tileX + 1; tx++) {
      for (const b of nebulaBlobs) {
        const wx = b.x + tx * NEBULA_TILE_SIZE;
        const wy = b.y + ty * NEBULA_TILE_SIZE;
        const sx = camera.worldToScreenX(wx);
        const sy = camera.worldToScreenY(wy);
        if (sx < -b.r || sx > renderer.width + b.r || sy < -b.r || sy > renderer.height + b.r) continue;
        const [r, g, bch] = hexToRgb(b.color);
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, b.r);
        grad.addColorStop(0, `rgba(${r},${g},${bch},${b.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${bch},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(sx - b.r, sy - b.r, b.r * 2, b.r * 2);
      }
    }
  }
}

// ---------------------------------------------------------- bg asteroids

const BG_ASTEROID_TILE_SIZE = 1900;

interface BgAsteroid {
  x: number;
  y: number;
  r: number;
  sides: number;
  rot: number;
}

const bgAsteroids: BgAsteroid[] = buildBgAsteroids();

function buildBgAsteroids(): BgAsteroid[] {
  const rand = makeRng(909);
  const list: BgAsteroid[] = [];
  for (let i = 0; i < 6; i++) {
    list.push({
      x: rand() * BG_ASTEROID_TILE_SIZE - BG_ASTEROID_TILE_SIZE / 2,
      y: rand() * BG_ASTEROID_TILE_SIZE - BG_ASTEROID_TILE_SIZE / 2,
      r: rand() * 70 + 40,
      sides: 5 + Math.floor(rand() * 3),
      rot: rand() * Math.PI * 2,
    });
  }
  return list;
}

function drawBgAsteroids(ctx: CanvasRenderingContext2D, camera: Camera, renderer: Renderer): void {
  const tileX = Math.floor(camera.x / BG_ASTEROID_TILE_SIZE);
  const tileY = Math.floor(camera.y / BG_ASTEROID_TILE_SIZE);
  ctx.fillStyle = "rgba(24,22,34,0.6)";
  for (let ty = tileY - 1; ty <= tileY + 1; ty++) {
    for (let tx = tileX - 1; tx <= tileX + 1; tx++) {
      for (const a of bgAsteroids) {
        const wx = a.x + tx * BG_ASTEROID_TILE_SIZE;
        const wy = a.y + ty * BG_ASTEROID_TILE_SIZE;
        const sx = camera.worldToScreenX(wx);
        const sy = camera.worldToScreenY(wy);
        if (sx < -a.r || sx > renderer.width + a.r || sy < -a.r || sy > renderer.height + a.r) continue;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a.rot);
        ctx.beginPath();
        for (let i = 0; i < a.sides; i++) {
          const ang = (i / a.sides) * Math.PI * 2;
          const rr = a.r * (0.8 + 0.2 * Math.sin(i * 2.1 + a.sides));
          const px = Math.cos(ang) * rr;
          const py = Math.sin(ang) * rr;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

export function renderWorld(renderer: Renderer, camera: Camera, world: World, input: Input): void {
  const ctx = renderer.ctx;
  renderer.begin("#05060f");

  drawNebula(ctx, camera, renderer);
  drawBgAsteroids(ctx, camera, renderer);
  drawStarfield(ctx, camera, renderer);

  for (const pickup of world.pickups) drawPickup(ctx, camera, pickup);
  for (const enemy of world.enemies) drawEnemy(ctx, camera, enemy);
  drawOrbitDrones(ctx, camera, world);
  for (const fx of world.effects) drawEffect(ctx, camera, fx);
  for (const proj of world.projectiles) drawProjectile(ctx, camera, proj);
  drawPlayer(ctx, camera, world);

  if (input.joystickActive) drawJoystick(ctx, input);
}

function drawStarfield(ctx: CanvasRenderingContext2D, camera: Camera, renderer: Renderer): void {
  const tileX = Math.floor(camera.x / STAR_FIELD_SIZE);
  const tileY = Math.floor(camera.y / STAR_FIELD_SIZE);
  ctx.fillStyle = "#ffffff";
  for (let ty = tileY - 1; ty <= tileY + 1; ty++) {
    for (let tx = tileX - 1; tx <= tileX + 1; tx++) {
      for (const s of stars) {
        const wx = s.x + tx * STAR_FIELD_SIZE;
        const wy = s.y + ty * STAR_FIELD_SIZE;
        const sx = camera.worldToScreenX(wx);
        const sy = camera.worldToScreenY(wy);
        if (sx < -10 || sx > renderer.width + 10 || sy < -10 || sy > renderer.height + 10) continue;
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function drawEnemy(ctx: CanvasRenderingContext2D, camera: Camera, enemy: World["enemies"][number]): void {
  const sx = camera.worldToScreenX(enemy.x);
  const sy = camera.worldToScreenY(enemy.y);
  drawCreatureSprite(ctx, `enemy.${enemy.defId}`, enemy.shape, sx, sy, Math.cos(enemy.facingAngle), 1, enemy.hitFlash / 0.15);

  if (enemy.tier !== "grunt") {
    const barWidth = enemy.radius * 2.2;
    const barY = sy - enemy.radius - 14;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(sx - barWidth / 2, barY, barWidth, 5);
    const frac = Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = enemy.tier === "boss" ? "#ff6f6f" : enemy.tier === "miniboss" ? "#ff9f3c" : "#ffcf5c";
    ctx.fillRect(sx - barWidth / 2, barY, barWidth * frac, 5);
  }
}

function drawOrbitDrones(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
  for (const weapon of world.player.weapons) {
    if (!weapon.orbitDrones) continue;
    const def = getUpgradeDef(weapon.upgradeId);
    const baseRadius = def.weaponBase?.radius ?? 70;
    for (const drone of weapon.orbitDrones) {
      const wx = world.player.x + Math.cos(drone.angleOffset) * baseRadius;
      const wy = world.player.y + Math.sin(drone.angleOffset) * baseRadius;
      const sx = camera.worldToScreenX(wx);
      const sy = camera.worldToScreenY(wy);
      drawEntitySprite(ctx, "fx.orbitDrone", def.icon, sx, sy, drone.angleOffset, 0.7);
    }
  }
}

function drawEffect(ctx: CanvasRenderingContext2D, camera: Camera, fx: World["effects"][number]): void {
  const alpha = Math.max(0, fx.life / fx.maxLife);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = fx.color;
  ctx.fillStyle = fx.color;
  ctx.lineWidth = 2.5;

  switch (fx.kind) {
    case "ring": {
      const sx = camera.worldToScreenX(fx.x);
      const sy = camera.worldToScreenY(fx.y);
      ctx.beginPath();
      ctx.arc(sx, sy, fx.radius * (1 - alpha * 0.3), 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "beam": {
      ctx.beginPath();
      ctx.moveTo(camera.worldToScreenX(fx.x1), camera.worldToScreenY(fx.y1));
      ctx.lineTo(camera.worldToScreenX(fx.x2), camera.worldToScreenY(fx.y2));
      ctx.stroke();
      break;
    }
    case "arc": {
      const sx = camera.worldToScreenX(fx.x);
      const sy = camera.worldToScreenY(fx.y);
      ctx.beginPath();
      ctx.arc(sx, sy, fx.radius, fx.angle - fx.spread / 2, fx.angle + fx.spread / 2);
      ctx.lineWidth = 8;
      ctx.stroke();
      break;
    }
    case "hit": {
      const sx = camera.worldToScreenX(fx.x);
      const sy = camera.worldToScreenY(fx.y);
      ctx.beginPath();
      ctx.arc(sx, sy, fx.crit ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, camera: Camera, proj: World["projectiles"][number]): void {
  const sx = camera.worldToScreenX(proj.x);
  const sy = camera.worldToScreenY(proj.y);
  ctx.save();
  if (proj.isMine) {
    const armed = (proj.armTimer ?? 0) <= 0;
    ctx.globalAlpha = armed ? 0.9 : 0.4;
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(3, proj.radius * 0.4), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPickup(ctx: CanvasRenderingContext2D, camera: Camera, pickup: World["pickups"][number]): void {
  const sx = camera.worldToScreenX(pickup.x);
  const sy = camera.worldToScreenY(pickup.y);
  ctx.save();
  ctx.fillStyle = "#ffe08a";
  ctx.shadowColor = "#ffe08a";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(sx, sy - 6);
  ctx.lineTo(sx + 6, sy);
  ctx.lineTo(sx, sy + 6);
  ctx.lineTo(sx - 6, sy);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
  const ship = getShipDef(world.shipId);
  const p = world.player;
  const sx = camera.worldToScreenX(p.x);
  const sy = camera.worldToScreenY(p.y);
  drawEntitySprite(ctx, `ship.${ship.id}`, ship.shape, sx, sy, p.angle + Math.PI / 2, 1, p.hitFlash / 0.15);

  if (p.shieldCharges > 0) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#8fe3ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, ship.shape.radius + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawJoystick(ctx: CanvasRenderingContext2D, input: Input): void {
  const origin = input.joystickOrigin;
  const knob = input.joystickKnob;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = "#8fe3ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#8fe3ff";
  ctx.beginPath();
  ctx.arc(knob.x, knob.y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
