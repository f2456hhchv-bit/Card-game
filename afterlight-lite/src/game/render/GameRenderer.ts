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

function buildStarfield(): Star[] {
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed >>> 8) / 0x7fffff;
  };
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

export function renderWorld(renderer: Renderer, camera: Camera, world: World, input: Input): void {
  const ctx = renderer.ctx;
  renderer.begin("#05060f");

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
