import type { Renderer } from "../../engine/Renderer";
import type { Camera } from "../../engine/Camera";
import type { World } from "../World";
import type { Input } from "../../engine/Input";
import { TAU } from "../../core/math/MathUtils";

/**
 * Draws the world with procedural vector art — no image assets. The look:
 * luminous shapes against a dark void, additive glow for the Warden's light
 * and bruised, desaturated tones for the Hollow. All art is generated from
 * primitives so the build stays tiny and fully original.
 */
export class GameRenderer {
  private reduceMotion = false;

  setReduceMotion(v: boolean): void {
    this.reduceMotion = v;
  }

  render(renderer: Renderer, camera: Camera, world: World, input: Input): void {
    const ctx = renderer.ctx;
    this.drawBackground(renderer, camera);
    this.drawArenaBoundary(ctx, camera, world);
    this.drawPickups(ctx, camera, world);
    this.drawAura(ctx, camera, world);
    this.drawEnemies(ctx, camera, world);
    this.drawOrbitOrbs(ctx, camera, world);
    this.drawProjectiles(ctx, camera, world);
    this.drawPlayer(ctx, camera, world);
    this.drawParticles(ctx, camera, world);
    this.drawDamageNumbers(ctx, camera, world);
    if (input.joystickActive) this.drawJoystick(ctx, input);
  }

  private drawBackground(renderer: Renderer, camera: Camera): void {
    const ctx = renderer.ctx;
    // Parallax dot-grid suggesting depth without heavy cost.
    const grid = 120;
    const w = renderer.width;
    const h = renderer.height;
    ctx.fillStyle = "rgba(120,140,220,0.06)";
    const startX = -((camera.x * 0.6) % grid);
    const startY = -((camera.y * 0.6) % grid);
    for (let x = startX; x < w; x += grid) {
      for (let y = startY; y < h; y += grid) {
        ctx.fillRect(x + camera.offsetX, y + camera.offsetY, 2, 2);
      }
    }
  }

  private drawArenaBoundary(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    world: World,
  ): void {
    const cx = camera.worldToScreenX(0);
    const cy = camera.worldToScreenY(0);
    ctx.save();
    ctx.strokeStyle = "rgba(125,140,255,0.18)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, world.arenaRadius * camera.zoom, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const p = world.player;
    const x = camera.worldToScreenX(p.x);
    const y = camera.worldToScreenY(p.y);
    const r = p.radius * camera.zoom;

    // Soft light halo.
    if (!this.reduceMotion) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, "rgba(180,200,255,0.35)");
      g.addColorStop(1, "rgba(180,200,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, TAU);
      ctx.fill();
    }

    // Body — a faceted light-core.
    const flash = p.hitFlash > 0 ? Math.sin(p.hitFlash * 40) > 0 : false;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.facing + Math.PI / 2);
    ctx.beginPath();
    const spikes = 4;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? r : r * 0.5;
      const a = (i / (spikes * 2)) * TAU;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = flash ? "#ffffff" : "#dce6ff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(120,150,255,0.9)";
    ctx.stroke();
    // Inner core.
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.32, 0, TAU);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }

  private drawEnemies(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const bounds = camera.getVisibleBounds(60);
    for (let i = 0; i < world.enemies.length; i++) {
      const e = world.enemies[i];
      if (e.x < bounds.minX || e.x > bounds.maxX || e.y < bounds.minY || e.y > bounds.maxY)
        continue;
      const x = camera.worldToScreenX(e.x);
      const y = camera.worldToScreenY(e.y);
      const r = e.radius * camera.zoom;
      const light = e.hitFlash > 0 ? 85 : e.isElite ? 62 : 48;

      ctx.save();
      ctx.translate(x, y);
      // Subtle pulse.
      const pulse = this.reduceMotion ? 1 : 1 + Math.sin(world.stats.elapsed * 4 + e.animPhase) * 0.06;
      ctx.scale(pulse, pulse);

      if (e.isElite) {
        ctx.shadowColor = `hsl(${e.hue} 90% 60%)`;
        ctx.shadowBlur = 16;
      }
      // Body: a rough hexagon to read as "corrupted shard".
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * TAU + e.animPhase;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = e.hitFlash > 0 ? "#ffffff" : `hsl(${e.hue} 55% ${light}%)`;
      ctx.fill();
      ctx.lineWidth = e.isElite ? 3 : 1.5;
      ctx.strokeStyle = `hsl(${e.hue} 70% ${e.isElite ? 75 : 30}%)`;
      ctx.stroke();
      ctx.restore();

      // Health bar for damaged / elite enemies.
      if (e.isElite || e.hp < e.maxHp) {
        const w = r * 2;
        const frac = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(x - w / 2, y - r - 8, w, 3);
        ctx.fillStyle = e.isElite ? "#ffd166" : "#8affc1";
        ctx.fillRect(x - w / 2, y - r - 8, w * frac, 3);
      }
    }
  }

  private drawProjectiles(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.projectiles.length; i++) {
      const p = world.projectiles[i];
      const x = camera.worldToScreenX(p.x);
      const y = camera.worldToScreenY(p.y);
      const r = p.radius * camera.zoom;
      const sat = p.crit ? 100 : 90;
      const lum = p.crit ? 75 : 65;
      ctx.fillStyle = `hsl(${p.hue} ${sat}% ${lum}%)`;
      if (p.style === "shard") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.6);
        ctx.lineTo(r * 0.7, 0);
        ctx.lineTo(0, r * 1.6);
        ctx.lineTo(-r * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        // Bright core.
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(x, y, r * 0.45, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawOrbitOrbs(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.orbitOrbCount <= 0) return;
    const orbs = world.getOrbitOrbs();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.orbitOrbCount; i++) {
      const o = orbs[i];
      const x = camera.worldToScreenX(o.x);
      const y = camera.worldToScreenY(o.y);
      const r = o.radius * camera.zoom;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
      g.addColorStop(0, `hsl(${o.hue} 100% 80%)`);
      g.addColorStop(1, `hsla(${o.hue} 100% 60% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawAura(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.auraRadius <= 0) return;
    const x = camera.worldToScreenX(world.player.x);
    const y = camera.worldToScreenY(world.player.y);
    const r = world.auraRadius * camera.zoom;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, `hsla(${world.auraHue} 90% 60% / 0.18)`);
    g.addColorStop(0.8, `hsla(${world.auraHue} 90% 60% / 0.08)`);
    g.addColorStop(1, `hsla(${world.auraHue} 90% 60% / 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private drawPickups(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const bounds = camera.getVisibleBounds(40);
    for (let i = 0; i < world.pickups.length; i++) {
      const k = world.pickups[i];
      if (k.x < bounds.minX || k.x > bounds.maxX || k.y < bounds.minY || k.y > bounds.maxY)
        continue;
      const x = camera.worldToScreenX(k.x);
      const bobY = this.reduceMotion ? 0 : Math.sin(k.bob) * 2;
      const y = camera.worldToScreenY(k.y) + bobY;
      const r = k.radius * camera.zoom;
      let hue = 150;
      if (k.kind === "heal") hue = 140;
      else if (k.kind === "magnet") hue = 280;
      else if (k.kind === "bomb") hue = 20;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `hsl(${hue} 90% 60%)`;
      if (k.kind === "xp") {
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `${Math.round(r * 1.3)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const glyph = k.kind === "heal" ? "+" : k.kind === "magnet" ? "✦" : "✸";
        ctx.fillText(glyph, x, y + 1);
      }
      ctx.restore();
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.particles.length; i++) {
      const p = world.particles[i];
      const x = camera.worldToScreenX(p.x);
      const y = camera.worldToScreenY(p.y);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = `hsl(${p.hue} 90% 65%)`;
      ctx.beginPath();
      ctx.arc(x, y, p.size * camera.zoom, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  private drawDamageNumbers(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    world: World,
  ): void {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < world.damageNumbers.length; i++) {
      const d = world.damageNumbers[i];
      const x = camera.worldToScreenX(d.x);
      const y = camera.worldToScreenY(d.y);
      const t = d.life / d.maxLife;
      ctx.globalAlpha = Math.max(0, 1 - t);
      const size = (d.crit ? 22 : 15) * camera.zoom;
      ctx.font = `${d.crit ? "800" : "700"} ${size}px ui-sans-serif, system-ui, sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.fillStyle = d.crit ? "#ffe27a" : "#ffffff";
      const text = d.crit ? `${d.value}!` : `${d.value}`;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  private drawJoystick(ctx: CanvasRenderingContext2D, input: Input): void {
    const base = input.joystickOrigin;
    const knob = input.joystickKnob;
    ctx.save();
    ctx.strokeStyle = "rgba(180,200,255,0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(base.x, base.y, 70, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = "rgba(180,200,255,0.4)";
    ctx.beginPath();
    ctx.arc(knob.x, knob.y, 28, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}
