import type { Renderer } from "../../engine/Renderer";
import type { Camera } from "../../engine/Camera";
import type { World } from "../World";
import type { Input } from "../../engine/Input";
import { TAU } from "../../core/math/MathUtils";
import { SpriteForge, type Sprite } from "./SpriteForge";
import { Background } from "./Background";
import { PostFx } from "./PostFx";
import { AssetManager } from "./AssetManager";
import { getAffix } from "../data/affixDefs";

/** Overshooting ease for pop-in animations (settles slightly past 1, back to 1). */
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * Draws the world. All art is procedural and asset-free: characters are baked
 * once by the SpriteForge into offscreen canvases and blitted here (fast +
 * detailed), set against the layered atmospheric Background. Luminous additive
 * effects (projectiles, auras, arcs, particles) are drawn live on top.
 */
export class GameRenderer {
  private reduceMotion = false;
  private readonly forge = new SpriteForge();
  private readonly background = new Background();
  private readonly postFx = new PostFx();
  private readonly assets = new AssetManager();

  setReduceMotion(v: boolean): void {
    this.reduceMotion = v;
  }

  /** Toggle the bloom/colour-grade post pass (Settings → Bloom). */
  setBloom(v: boolean): void {
    this.postFx.enabled = v;
  }

  /** Interpolation factor between the last two sim ticks (set per frame). */
  private alpha = 1;

  /** Interpolated coordinate — snaps on teleports/spawns/pool reuse. */
  private ix(prev: number, cur: number): number {
    return Math.abs(cur - prev) > 200 ? cur : prev + (cur - prev) * this.alpha;
  }

  render(renderer: Renderer, camera: Camera, world: World, input: Input, alpha = 1): void {
    this.alpha = alpha;
    const ctx = renderer.ctx;
    const w = renderer.width;
    const h = renderer.height;
    this.background.resize(w, h);
    this.background.setStage(world.paletteKey, world.palette);
    this.background.draw(ctx, camera.x, camera.y, w, h, world.stats.elapsed, this.reduceMotion);

    this.drawArenaBoundary(ctx, camera, world);
    this.drawPickups(ctx, camera, world);
    this.drawAura(ctx, camera, world);
    this.drawPulse(ctx, camera, world);
    this.drawEnemies(ctx, camera, world);
    this.drawBoss(ctx, camera, world);
    this.drawOrbitOrbs(ctx, camera, world);
    this.drawProjectiles(ctx, camera, world);
    this.drawEnemyProjectiles(ctx, camera, world);
    this.drawArcs(ctx, camera, world);
    this.drawPlayer(ctx, camera, world);
    this.drawParticles(ctx, camera, world);

    // Post-processing: bloom + colour grade over the lit gameplay layer (before
    // the vignette and crisp UI text, so glow blooms but readouts stay sharp).
    this.postFx.apply(ctx, renderer.canvas, renderer.dpr);

    // Cinematic post: vignette, plus a danger pulse when the Warden is low.
    this.background.drawVignette(ctx);
    this.drawDangerPulse(ctx, world, w, h);

    this.drawDamageNumbers(ctx, camera, world);
    if (input.joystickActive) this.drawJoystick(ctx, input);
  }

  /** Blit a baked sprite centred at (x,y) so its body radius equals `r`. */
  private blit(
    ctx: CanvasRenderingContext2D,
    sprite: Sprite,
    x: number,
    y: number,
    r: number,
    rotation = 0,
    alpha = 1,
  ): void {
    const k = r / sprite.bodyRadius;
    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.scale(k, k);
    if (alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(sprite.canvas, -sprite.canvas.width / 2, -sprite.canvas.height / 2);
    ctx.restore();
  }

  /**
   * Blit a production art asset for `key` if one is loaded, otherwise fall back
   * to the procedural `fallback` sprite. This is the seam that lets authored
   * PNG/SVG art replace procedural art with no game-system changes.
   */
  private blitKey(
    ctx: CanvasRenderingContext2D,
    key: string,
    fallback: Sprite,
    x: number,
    y: number,
    r: number,
    rotation = 0,
    alpha = 1,
  ): void {
    const art = this.assets.get(key);
    if (!art) {
      this.blit(ctx, fallback, x, y, r, rotation, alpha);
      return;
    }
    const k = r / art.radius;
    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.scale(k, k);
    if (alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(art.img, -art.img.width / 2, -art.img.height / 2);
    ctx.restore();
  }

  /** Grounding shadow beneath an entity. */
  private shadow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    this.blit(ctx, this.forge.shadow, x, y + r * 0.55, r * 1.05, 0, 0.9);
  }

  private drawArenaBoundary(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    world: World,
  ): void {
    const cx = camera.worldToScreenX(0);
    const cy = camera.worldToScreenY(0);
    const r = world.arenaRadius * camera.zoom;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(120,140,255,0.22)";
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const p = world.player;
    const x = camera.worldToScreenX(this.ix(p.prevX, p.x));
    const y = camera.worldToScreenY(this.ix(p.prevY, p.y));
    const r = p.radius * camera.zoom;

    this.shadow(ctx, x, y, r);

    // Soft light halo (additive).
    if (!this.reduceMotion) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const pulse = 1 + Math.sin(world.stats.elapsed * 3) * 0.08;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2 * pulse);
      g.addColorStop(0, "rgba(150,180,255,0.28)");
      g.addColorStop(1, "rgba(150,180,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 4.2 * pulse, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // Body sprite faces up; rotate toward facing. Invuln blink after a hit.
    // Rendered noticeably larger than the hitbox so the ship reads big on screen.
    // The flown ship is the selected chassis' painted sprite when available,
    // falling back to the classic warden art (then procedural).
    const blink = p.invuln > 0 && Math.sin(p.invuln * 40) < -0.2 ? 0.45 : 1;
    const chassisKey = `chassis/${world.selectedChassis}`;
    const shipKey = this.assets.get(chassisKey) ? chassisKey : "hero/warden";
    this.blitKey(ctx, shipKey, this.forge.warden, x, y, r * 2.0, p.facing + Math.PI / 2, blink);
  }

  private drawEnemies(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const bounds = camera.getVisibleBounds(80);
    const t = world.stats.elapsed;
    const px = world.player.x;
    const py = world.player.y;
    for (let i = 0; i < world.enemies.length; i++) {
      const e = world.enemies[i];
      if (e.isBoss) continue; // bespoke draw
      if (e.x < bounds.minX || e.x > bounds.maxX || e.y < bounds.minY || e.y > bounds.maxY)
        continue;
      const ex = this.ix(e.prevX, e.x);
      const ey = this.ix(e.prevY, e.y);
      const x = camera.worldToScreenX(ex);
      const yBob = this.reduceMotion ? 0 : Math.sin(t * 5 + e.animPhase) * e.radius * 0.07 * camera.zoom;
      const y = camera.worldToScreenY(ey) + yBob;
      // Spawn-in "birth": scale up with a slight overshoot over the first ~0.24s.
      const spawnT = Math.min(1, e.age / 0.24);
      const spawnScale = this.reduceMotion ? 1 : spawnT * (1.14 - 0.14 * spawnT);
      // Gentle breathing pulse so idle/moving foes feel alive, not static.
      const breathe = this.reduceMotion ? 1 : 1 + Math.sin(t * 6 + e.animPhase) * 0.045;
      const r = e.radius * camera.zoom * 1.25 * e.hitScale * spawnScale * breathe;

      this.shadow(ctx, x, camera.worldToScreenY(ey), e.radius * camera.zoom);

      // Directional types point at the Warden; others wobble gently.
      let rot = this.reduceMotion ? 0 : Math.sin(t * 2.5 + e.animPhase) * 0.08;
      if (e.behaviour === "charger") {
        rot = Math.atan2(py - e.y, px - e.x) + Math.PI / 2;
      }

      // Elite backing glow.
      if (e.isElite) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
        g.addColorStop(0, `hsla(${e.hue} 90% 60% / 0.5)`);
        g.addColorStop(1, `hsla(${e.hue} 90% 60% / 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.8, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      // Affix telegraph: a rotating dashed ring in the affix colour, so the
      // twist (Warded / Volatile / Summoner...) is readable before contact.
      if (e.affix) {
        const affix = getAffix(e.affix);
        if (affix) {
          ctx.save();
          ctx.strokeStyle = affix.color;
          ctx.lineWidth = Math.max(2, r * 0.09);
          ctx.globalAlpha = 0.85;
          ctx.setLineDash([r * 0.42, r * 0.26]);
          ctx.lineDashOffset = this.reduceMotion ? 0 : -t * r * 1.4;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.32, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Prefer a production asset; fall back to the procedural baked sprite.
      const art = this.assets.get(`enemy/${e.typeId}`);
      if (art) {
        const k = r / art.radius;
        ctx.save();
        ctx.translate(x, y);
        if (rot !== 0) ctx.rotate(rot);
        ctx.scale(k, k);
        ctx.drawImage(art.img, -art.img.width / 2, -art.img.height / 2);
        // Hit flash: an additive self-blend brightens the silhouette (no mask).
        if (e.hitFlash > 0) {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = Math.min(1, e.hitFlash / 0.08) * 0.85;
          ctx.drawImage(art.img, -art.img.width / 2, -art.img.height / 2);
        }
        ctx.restore();
      } else {
        const sprite = this.forge.enemy(e.typeId);
        this.blit(ctx, sprite, x, y, r, rot);
        if (e.hitFlash > 0) {
          this.blit(ctx, this.forge.enemyWhite(e.typeId), x, y, r, rot, Math.min(1, e.hitFlash / 0.08));
        }
      }

      // Health bar for damaged / elite enemies.
      if (e.isElite || e.hp < e.maxHp) {
        const bw = r * 1.6;
        const frac = Math.max(0, e.hp / e.maxHp);
        const by = y - r - 7;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x - bw / 2, by, bw, 3.5);
        ctx.fillStyle = e.isElite ? "#ffd166" : "#8affc1";
        ctx.fillRect(x - bw / 2, by, bw * frac, 3.5);
      }
    }
  }

  private drawBoss(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const boss = world.boss;
    if (!boss || !boss.active) return;
    const x = camera.worldToScreenX(this.ix(boss.prevX, boss.x));
    const y = camera.worldToScreenY(this.ix(boss.prevY, boss.y));
    const r = boss.radius * camera.zoom;
    const t = world.stats.elapsed;

    this.shadow(ctx, x, y, r * 0.95);

    // Telegraph: a dramatic charge-up during the attack wind-up. `tele` runs
    // 0→1 as the boss finishes winding up, so the ring contracts inward (classic
    // anticipation), a charge arc fills, and energy streaks are pulled in.
    const tele = world.bossTelegraph;
    if (tele > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const hue = boss.hue;

      // Building glow around the boss, brightening as release nears.
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
      glow.addColorStop(0, `hsla(${hue} 100% 70% / ${0.14 + 0.26 * tele})`);
      glow.addColorStop(1, `hsla(${hue} 100% 60% / 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.5, 0, TAU);
      ctx.fill();

      // Contracting warning ring — the tell the player reads to dodge.
      const ringR = r * (2.35 - tele * 1.05);
      ctx.strokeStyle = `hsla(${hue} 100% 78% / ${0.3 + 0.55 * tele})`;
      ctx.lineWidth = (2 + tele * 5) * camera.zoom;
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, TAU);
      ctx.stroke();

      // Charge arc filling clockwise around the boss as it winds up.
      ctx.strokeStyle = `hsl(${hue} 100% 82%)`;
      ctx.lineWidth = 3.5 * camera.zoom;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.32, -Math.PI / 2, -Math.PI / 2 + TAU * tele);
      ctx.stroke();

      // Energy streaks pulled inward toward the boss (renderer-only, no state).
      if (!this.reduceMotion) {
        const streaks = 10;
        const spin = t * 1.6;
        ctx.lineWidth = 2 * camera.zoom;
        for (let i = 0; i < streaks; i++) {
          const a = (i / streaks) * TAU + spin;
          const outer = ringR + 14 * (1 - tele);
          const inner = ringR - 6;
          ctx.strokeStyle = `hsla(${hue} 100% 80% / ${0.15 + 0.55 * tele})`;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
          ctx.lineTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Bosses pop on being hit too, but at half the amplitude of fodder so the
    // huge silhouette only flinches rather than lurching.
    const pop = 1 + (boss.hitScale - 1) * 0.5;

    const art = this.assets.get(`boss/${boss.typeId}`);
    if (art) {
      // Illustrated bosses sway/breathe rather than spinning like the abstract
      // procedural sprite, so their silhouette stays readable.
      const sway = this.reduceMotion ? 0 : Math.sin(t * 0.7) * 0.05;
      const breathe = this.reduceMotion ? 1 : 1 + Math.sin(t * 1.6) * 0.02;
      const rr = r * 1.2 * breathe * pop;
      const k = rr / art.radius;
      ctx.save();
      ctx.translate(x, y);
      if (sway !== 0) ctx.rotate(sway);
      ctx.scale(k, k);
      ctx.drawImage(art.img, -art.img.width / 2, -art.img.height / 2);
      if (boss.hitFlash > 0) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(1, boss.hitFlash / 0.08) * 0.85;
        ctx.drawImage(art.img, -art.img.width / 2, -art.img.height / 2);
      }
      ctx.restore();
    } else {
      const rot = this.reduceMotion ? 0 : t * 0.35;
      this.blit(ctx, this.forge.bossSprite(boss.typeId), x, y, r * 1.2 * pop, rot);
      if (boss.hitFlash > 0) {
        this.blit(
          ctx,
          this.forge.bossWhite(boss.typeId),
          x,
          y,
          r * 1.2 * pop,
          rot,
          Math.min(1, boss.hitFlash / 0.08),
        );
      }
    }
  }

  /** A tapered comet trail behind a moving projectile, in its travel direction. */
  private projectileTrail(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    vx: number,
    vy: number,
    r: number,
    hue: number,
    sat: number,
    lum: number,
    evolved: boolean,
    zoom: number,
  ): void {
    const sp = Math.hypot(vx, vy);
    if (sp < 1) return;
    const ang = Math.atan2(vy, vx);
    const len = (Math.min(46, sp * 0.035) * (evolved ? 1.7 : 1) + r * 1.4) * zoom;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    const g = ctx.createLinearGradient(0, 0, -len, 0);
    g.addColorStop(0, `hsla(${hue} ${sat}% ${lum}% / 0.8)`);
    g.addColorStop(1, `hsla(${hue} ${sat}% ${lum}% / 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.8);
    ctx.lineTo(-len, 0);
    ctx.lineTo(0, r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawProjectiles(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.projectiles.length; i++) {
      const p = world.projectiles[i];
      const x = camera.worldToScreenX(this.ix(p.prevX, p.x));
      const y = camera.worldToScreenY(this.ix(p.prevY, p.y));
      const r = p.radius * camera.zoom * (p.evolved ? 1.2 : 1);
      const sat = p.crit ? 100 : 92;
      const lum = p.crit ? 80 : 66;

      this.projectileTrail(ctx, x, y, p.vx, p.vy, r, p.hue, sat, lum, p.evolved, camera.zoom);

      this.drawProjectileShape(ctx, p, x, y, r, sat, lum, world.stats.elapsed, i);

      // Evolved signature: a bright spinning glint ring on the head.
      if (p.evolved) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(world.stats.elapsed * 6 + i);
        ctx.strokeStyle = `hsla(${p.hue} 100% 85% / 0.9)`;
        ctx.lineWidth = 1.5 * camera.zoom;
        ctx.beginPath();
        for (let s = 0; s < 8; s++) {
          const rr = s % 2 === 0 ? r * 1.5 : r * 0.9;
          const a = (s / 8) * TAU;
          const px = Math.cos(a) * rr;
          const py = Math.sin(a) * rr;
          s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  /** Chain-lightning: a jagged, additive bolt between two points, fading out. */
  private drawArcs(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.arcs.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (let i = 0; i < world.arcs.length; i++) {
      const a = world.arcs[i];
      const alpha = Math.max(0, 1 - a.life / a.maxLife);
      const x1 = camera.worldToScreenX(a.x1);
      const y1 = camera.worldToScreenY(a.y1);
      const x2 = camera.worldToScreenX(a.x2);
      const y2 = camera.worldToScreenY(a.y2);
      const segs = 5;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let s = 1; s < segs; s++) {
        const t = s / segs;
        const jitter = Math.sin(a.life * 90 + s * 12.9) * 0.5 * 14 * (1 - Math.abs(t - 0.5) * 2 + 0.2);
        ctx.lineTo(x1 + dx * t + nx * jitter, y1 + dy * t + ny * jitter);
      }
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${a.hue} 100% 70% / ${alpha * 0.6})`;
      ctx.lineWidth = 6 * camera.zoom;
      ctx.stroke();
      ctx.strokeStyle = `hsla(${a.hue} 100% 92% / ${alpha})`;
      ctx.lineWidth = 2 * camera.zoom;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawEnemyProjectiles(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    world: World,
  ): void {
    const t = world.stats.elapsed;
    for (let i = 0; i < world.enemyProjectiles.length; i++) {
      const p = world.enemyProjectiles[i];
      const x = camera.worldToScreenX(this.ix(p.prevX, p.x));
      const y = camera.worldToScreenY(this.ix(p.prevY, p.y));
      const r = p.radius * camera.zoom;
      const ang = Math.atan2(p.vy, p.vx);

      // Additive halo — keeps every bullet legible against a busy field.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.9);
      g.addColorStop(0, `hsl(${p.hue} 100% 82%)`);
      g.addColorStop(0.55, `hsla(${p.hue} 92% 58% / 0.75)`);
      g.addColorStop(1, `hsla(${p.hue} 90% 50% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.9, 0, TAU);
      ctx.fill();
      ctx.restore();

      // Solid silhouette on top — the boss's signature bullet shape.
      this.drawEnemyBulletShape(ctx, p.style, x, y, r, p.hue, ang, t + i);
    }
  }

  /**
   * One hostile-bullet silhouette, hand-inked to match the game's art: a rough,
   * organic outline (never a clean geometric primitive), a dark ink stroke, a
   * shaded painterly fill and a small glint — the same language as the ships,
   * galaxy bodies and glyph icons.
   */
  private drawEnemyBulletShape(
    ctx: CanvasRenderingContext2D,
    style: string,
    x: number,
    y: number,
    r: number,
    hue: number,
    ang: number,
    spin: number,
  ): void {
    const INK = "rgba(9,7,15,0.92)";
    const lite = `hsl(${hue} 100% 85%)`;
    const body = `hsl(${hue} 90% 58%)`;
    const deep = `hsl(${hue} 82% 32%)`;
    ctx.save();
    ctx.translate(x, y);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Trace a closed path smoothed through segment midpoints — the wobble baked
    // into the vertices reads as a drawn-by-hand edge, not a crisp polygon.
    const sub = (pts: [number, number][]): void => {
      const n = pts.length;
      const mid = (a: [number, number], b: [number, number]): [number, number] => [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
      ];
      const m0 = mid(pts[n - 1], pts[0]);
      ctx.moveTo(m0[0], m0[1]);
      for (let i = 0; i < n; i++) {
        const mp = mid(pts[i], pts[(i + 1) % n]);
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], mp[0], mp[1]);
      }
    };
    // A lumpy blob of `count` vertices — an irregular near-circle.
    const lump = (count: number, scale: number, amp: number, ph: number, sy = 1): [number, number][] => {
      const pts: [number, number][] = [];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU;
        const w = 1 + amp * Math.sin(a * 3 + ph) + amp * 0.55 * Math.sin(a * 5 + ph * 1.7);
        pts.push([Math.cos(a) * r * scale * w, Math.sin(a) * r * scale * w * sy]);
      }
      return pts;
    };
    const grad = (rad: number): CanvasGradient => {
      const g = ctx.createRadialGradient(-rad * 0.35, -rad * 0.4, rad * 0.1, 0, 0, rad * 1.1);
      g.addColorStop(0, lite);
      g.addColorStop(0.55, body);
      g.addColorStop(1, deep);
      return g;
    };
    const paint = (pts: [number, number][], gradR: number, w = 0.15): void => {
      ctx.beginPath();
      sub(pts);
      ctx.closePath();
      ctx.fillStyle = grad(gradR);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = r * w;
      ctx.stroke();
    };
    const glint = (gx: number, gy: number, gr: number): void => {
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.beginPath();
      ctx.ellipse(gx, gy, gr, gr * 0.6, -0.6, 0, TAU);
      ctx.fill();
    };

    switch (style) {
      case "shard": {
        // A jagged rock sliver flung point-first.
        ctx.rotate(ang);
        const pts: [number, number][] = [
          [r * 2.1, r * 0.06],
          [r * 0.3, r * 0.82],
          [-r * 0.7, r * 0.5],
          [-r * 0.5, 0],
          [-r * 0.8, -r * 0.55],
          [r * 0.25, -r * 0.7],
        ];
        paint(pts, r * 1.3, 0.16);
        glint(-r * 0.1, -r * 0.28, r * 0.28);
        break;
      }
      case "crystal": {
        // A chipped ice shard — angular but hand-cut, flying point-first.
        ctx.rotate(ang);
        const pts: [number, number][] = [
          [r * 1.7, 0],
          [r * 0.45, r * 0.62],
          [-r * 0.5, r * 0.9],
          [-r * 1.5, r * 0.08],
          [-r * 0.5, -r * 0.85],
          [r * 0.45, -r * 0.66],
        ];
        paint(pts, r * 1.4, 0.14);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = r * 0.1;
        ctx.beginPath();
        ctx.moveTo(r * 1.2, 0);
        ctx.lineTo(-r * 0.5, -r * 0.1);
        ctx.stroke();
        break;
      }
      case "star": {
        // A four-point star with slightly bent, organic arms.
        ctx.rotate(spin * 1.2);
        const pts: [number, number][] = [];
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * TAU - Math.PI / 2 + Math.sin(s * 1.3) * 0.06;
          const rad = (s % 2 ? r * 0.6 : r * 1.75) * (1 + 0.05 * Math.sin(s * 2.1));
          pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
        }
        paint(pts, r * 1.5, 0.13);
        ctx.fillStyle = lite;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.34, 0, TAU);
        ctx.fill();
        break;
      }
      case "hex": {
        // A broken hex chunk of frozen rock, with a fracture line.
        ctx.rotate(spin * 0.8);
        const pts: [number, number][] = [];
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * TAU + 0.3;
          const rad = r * 1.35 * (1 + 0.13 * Math.sin(s * 1.7 + 0.5));
          pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
        }
        paint(pts, r * 1.35, 0.15);
        ctx.strokeStyle = "rgba(9,7,15,0.5)";
        ctx.lineWidth = r * 0.1;
        ctx.beginPath();
        ctx.moveTo(-r * 0.9, -r * 0.3);
        ctx.lineTo(r * 0.2, r * 0.15);
        ctx.lineTo(r * 0.6, -r * 0.6);
        ctx.stroke();
        glint(-r * 0.35, -r * 0.4, r * 0.24);
        break;
      }
      case "bolt": {
        // A heavy forged chunk, chipped and hot-cored — stout, not a needle.
        ctx.rotate(ang);
        const pts: [number, number][] = [
          [r * 1.5, 0],
          [r * 0.55, r * 0.78],
          [-r * 0.6, r * 0.74],
          [-r * 1.25, r * 0.06],
          [-r * 0.6, -r * 0.72],
          [r * 0.55, -r * 0.76],
        ];
        paint(pts, r * 1.35, 0.16);
        ctx.fillStyle = lite;
        ctx.beginPath();
        sub([
          [r * 0.85, 0],
          [r * 0.1, r * 0.32],
          [-r * 0.45, 0],
          [r * 0.1, -r * 0.32],
        ]);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "ring": {
        // A rough, uneven echo-ring — a hand-drawn torus with a true hollow so
        // the halo shows through the centre.
        ctx.rotate(spin * 0.5);
        const outer = lump(11, 1.2, 0.08, 0.7);
        const inner = lump(11, 0.56, 0.11, 2.3);
        ctx.beginPath();
        sub(outer);
        ctx.closePath();
        sub(inner);
        ctx.closePath();
        ctx.fillStyle = grad(r * 1.2);
        ctx.fill("evenodd");
        ctx.strokeStyle = INK;
        ctx.lineWidth = r * 0.12;
        ctx.beginPath();
        sub(outer);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        sub(inner);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case "ember": {
        // A licking flame-mote: a wavering teardrop with a hot heart, tail
        // trailing behind its flight and flickering over time.
        ctx.rotate(ang);
        const fl = 1 + Math.sin(spin * 11) * 0.14;
        const pts: [number, number][] = [
          [r * 1.35, 0],
          [r * 0.5, r * 0.74],
          [-r * 0.55, r * 0.6],
          [-r * 1.85 * fl, r * 0.07],
          [-r * 0.55, -r * 0.6],
          [r * 0.5, -r * 0.74],
        ];
        paint(pts, r * 1.4, 0.14);
        // Hot inner tongue.
        ctx.fillStyle = `hsl(${(hue + 12) % 360} 100% 82%)`;
        ctx.beginPath();
        sub([
          [r * 0.9, 0],
          [r * 0.1, r * 0.3],
          [-r * 0.7, 0],
          [r * 0.1, -r * 0.3],
        ]);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "spike": {
        // A rough caltrop — four stubby organic spikes.
        ctx.rotate(spin);
        const pts: [number, number][] = [];
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * TAU + Math.sin(s) * 0.05;
          const rad = s % 2 ? r * 0.42 : r * 1.6;
          pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
        }
        paint(pts, r * 1.4, 0.15);
        glint(-r * 0.2, -r * 0.24, r * 0.2);
        break;
      }
      default: {
        // orb — a devouring void mote: a lumpy sphere with a dark, ragged heart.
        ctx.rotate(spin * 0.3);
        const pts = lump(9, 0.98, 0.1, 1.3);
        paint(pts, r, 0.15);
        ctx.fillStyle = `hsl(${hue} 85% 14%)`;
        ctx.beginPath();
        sub(lump(8, 0.5, 0.16, 3.0));
        ctx.closePath();
        ctx.fill();
        glint(-r * 0.42, -r * 0.44, r * 0.22);
      }
    }
    ctx.restore();
  }

  private drawOrbitOrbs(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.orbitOrbCount <= 0) return;
    const orbs = world.getOrbitOrbs();
    const t = world.stats.elapsed;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.orbitOrbCount; i++) {
      const o = orbs[i];
      const x = camera.worldToScreenX(o.x);
      const y = camera.worldToScreenY(o.y);
      const r = o.radius * camera.zoom;
      // Render in the same shape language as projectiles, oriented along the
      // orbit tangent (bladed shapes cut forward; the saw spins on its own).
      this.drawProjectileShape(
        ctx,
        {
          style: o.style,
          hue: o.hue,
          vx: Math.cos(o.angle),
          vy: Math.sin(o.angle),
          rotation: t * 9 + i,
          evolved: false,
        },
        x,
        y,
        r,
        95,
        70,
        t,
        i,
      );
    }
    ctx.restore();
  }

  private drawAura(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.auraRadius <= 0) return;
    const x = camera.worldToScreenX(this.ix(world.player.prevX, world.player.x));
    const y = camera.worldToScreenY(this.ix(world.player.prevY, world.player.y));
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

  /** Overdrive light pulse: a bright expanding ring at the moment it fires. */
  private drawPulse(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    if (world.pulseFx <= 0) return;
    const x = camera.worldToScreenX(this.ix(world.player.prevX, world.player.x));
    const y = camera.worldToScreenY(this.ix(world.player.prevY, world.player.y));
    const r = world.pulseFx * camera.zoom;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "hsla(35 100% 70% / 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r);
    g.addColorStop(0, "hsla(35 100% 65% / 0)");
    g.addColorStop(1, "hsla(35 100% 65% / 0.22)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private drawPickups(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    const bounds = camera.getVisibleBounds(40);
    const t = world.stats.elapsed;
    for (let i = 0; i < world.pickups.length; i++) {
      const k = world.pickups[i];
      if (k.x < bounds.minX || k.x > bounds.maxX || k.y < bounds.minY || k.y > bounds.maxY)
        continue;
      const x = camera.worldToScreenX(this.ix(k.prevX, k.x));
      const bobY = this.reduceMotion ? 0 : Math.sin(k.bob) * 2.5;
      const y = camera.worldToScreenY(this.ix(k.prevY, k.y)) + bobY;
      const r = k.radius * camera.zoom * 1.5;
      const spin = k.kind === "xp" && !this.reduceMotion ? Math.sin(t * 2 + k.bob) * 0.3 : 0;
      // Painted gems when available; big XP drops (elite/boss shards) get the
      // purple crystal. Procedural sprite remains the fallback.
      const artKey = k.kind === "xp" && k.radius >= 10 ? "pickup/xpBig" : `pickup/${k.kind}`;
      // Motes fall back to the xp shard shape (the forge predates the kind).
      const fallback = this.forge.pickup(k.kind === "mote" ? "xp" : k.kind);
      // Supply Pods: a beacon glow, and an urgent blink over the final 5s.
      let alpha = 1;
      if (k.kind === "pod") {
        if (k.life > 0 && k.life < 5 && !this.reduceMotion) {
          alpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 6));
        }
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const pulse = this.reduceMotion ? 1 : 1 + Math.sin(t * 3 + k.bob) * 0.18;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6 * pulse);
        g.addColorStop(0, `hsla(45 95% 62% / ${0.4 * alpha})`);
        g.addColorStop(1, "hsla(45 95% 62% / 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 2.6 * pulse, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      this.blitKey(ctx, artKey, fallback, x, y, r, spin, alpha);
    }
  }

  /** Render one projectile in its per-weapon style (distinct silhouettes). */
  private drawProjectileShape(
    ctx: CanvasRenderingContext2D,
    p: { style: string; hue: number; vx: number; vy: number; rotation: number; evolved: boolean },
    x: number,
    y: number,
    r: number,
    sat: number,
    lum: number,
    t: number,
    i: number,
  ): void {
    const core = `hsl(${p.hue} ${sat}% ${lum}%)`;
    const white = "rgba(255,255,255,0.95)";
    const ang = Math.atan2(p.vy, p.vx);
    // A soft round glow underlays most styles — drawn additively for bloom, even
    // though the solid body below is painted source-over so its ink rim shows.
    const glow = (rad: number): void => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `hsla(${p.hue} ${sat}% ${lum}% / 0.9)`);
      g.addColorStop(1, `hsla(${p.hue} ${sat}% ${lum}% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, TAU);
      ctx.fill();
      ctx.restore();
    };
    // Paint the solid body + ink rim over the additive glow, so the dark rim is
    // visible (a purely additive dark stroke would vanish).
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    // Hand-inked treatment (matches the enemy bullets, ships and glyphs): a thin
    // dark rim around each bright shape, and organic silhouettes traced with a
    // baked-in wobble. The bright core + additive glow are kept so the Warden's
    // light stays visibly "the light" — distinct from the dark-hearted foe fire.
    const INK = "rgba(7,5,13,0.8)";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    const rim = (w = 0.13): void => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = r * w;
      ctx.stroke();
    };
    // A closed, gently-irregular path smoothed through segment midpoints (the
    // per-vertex wobble is deterministic per shape, so it reads hand-drawn but
    // never jitters frame to frame).
    const rough = (verts: [number, number][]): void => {
      const n = verts.length;
      const mid = (a: [number, number], b: [number, number]): [number, number] => [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
      ];
      const w: [number, number][] = verts.map((v, k) => {
        const j = 1 + 0.07 * Math.sin(k * 3.3 + 1.1);
        return [v[0] * j, v[1] * j];
      });
      ctx.beginPath();
      const m0 = mid(w[n - 1], w[0]);
      ctx.moveTo(m0[0], m0[1]);
      for (let k = 0; k < n; k++) {
        const mp = mid(w[k], w[(k + 1) % n]);
        ctx.quadraticCurveTo(w[k][0], w[k][1], mp[0], mp[1]);
      }
      ctx.closePath();
    };
    // A lumpy near-ellipse (for the capsule/lance bodies).
    const lozenge = (rx: number, ry: number): [number, number][] => {
      const pts: [number, number][] = [];
      const N = 10;
      for (let k = 0; k < N; k++) {
        const a = (k / N) * TAU;
        const wob = 1 + 0.06 * Math.sin(a * 3 + 0.7);
        pts.push([Math.cos(a) * rx * wob, Math.sin(a) * ry * wob]);
      }
      return pts;
    };

    switch (p.style) {
      case "bolt": {
        // A lumpy energy capsule streaking along its travel direction.
        glow(r * 1.7);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = core;
        rough(lozenge(r * 1.9, r * 0.72));
        ctx.fill();
        rim();
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.ellipse(r * 0.3, 0, r * 0.85, r * 0.3, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "lance": {
        // A long thin piercing spear, inked.
        glow(r * 1.4);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = core;
        rough(lozenge(r * 3.1, r * 0.44));
        ctx.fill();
        rim(0.1);
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.ellipse(r * 0.8, 0, r * 1.5, r * 0.14, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "dart": {
        // A sharp little arrowhead pointing where it flies.
        glow(r * 1.2);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = core;
        rough([
          [r * 1.7, 0],
          [-r * 0.9, r * 1.0],
          [-r * 0.3, 0],
          [-r * 0.9, -r * 1.0],
        ]);
        ctx.fill();
        rim();
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.moveTo(r * 1.1, 0);
        ctx.lineTo(-r * 0.2, r * 0.36);
        ctx.lineTo(-r * 0.2, -r * 0.36);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case "spark": {
        // A tiny buzzing fizz-dot with jittering micro-sparks.
        glow(r * 1.5);
        ctx.fillStyle = core;
        for (let s = 0; s < 3; s++) {
          const a = t * 22 + i + s * 2.1;
          const d = r * 1.1;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.34, 0, TAU);
          ctx.fill();
          rim(0.16);
        }
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.5, 0, TAU);
        ctx.fill();
        break;
      }
      case "shard": {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = core;
        rough([
          [0, -r * 1.7],
          [r * 0.7, 0],
          [0, r * 1.7],
          [-r * 0.7, 0],
        ]);
        ctx.fill();
        rim();
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "crystal": {
        // An icy elongated crystal along travel, with a cold white facet.
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = `hsl(${p.hue} ${sat}% ${Math.min(88, lum + 12)}%)`;
        rough([
          [r * 1.9, 0],
          [0, r * 0.85],
          [-r * 1.5, 0],
          [0, -r * 0.85],
        ]);
        ctx.fill();
        rim();
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.moveTo(r * 1.1, 0);
        ctx.lineTo(0, r * 0.28);
        ctx.lineTo(0, -r * 0.28);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case "hex": {
        // A frosted spinning hex chunk, rough-edged.
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation * 0.6);
        ctx.fillStyle = core;
        const pts: [number, number][] = [];
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * TAU;
          pts.push([Math.cos(a) * r * 1.4, Math.sin(a) * r * 1.4]);
        }
        rough(pts);
        ctx.fill();
        rim();
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.42, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "star": {
        // A four-point twinkle with slightly bent, organic arms.
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 3 + i);
        ctx.fillStyle = core;
        const pts: [number, number][] = [];
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * TAU - Math.PI / 2;
          const rad = s % 2 ? r * 0.5 : r * 2.0;
          pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
        }
        rough(pts);
        ctx.fill();
        rim(0.11);
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.46, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "glaive": {
        // A curved crescent blade, cutting edge forward along the orbit.
        glow(r * 1.5);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.5, -1.15, 1.15);
        ctx.arc(r * 0.7, 0, r * 1.35, 0.95, -0.95, true);
        ctx.closePath();
        ctx.fill();
        rim();
        ctx.strokeStyle = white;
        ctx.lineWidth = r * 0.26;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.5, -1.02, 1.02);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case "saw": {
        // A spinning saw disc with rough, hand-cut teeth.
        glow(r * 1.4);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);
        const teeth = 9;
        ctx.fillStyle = core;
        const pts: [number, number][] = [];
        for (let s = 0; s < teeth; s++) {
          const a0 = (s / teeth) * TAU;
          const a1 = ((s + 0.5) / teeth) * TAU;
          pts.push([Math.cos(a0) * r * 1.7, Math.sin(a0) * r * 1.7]);
          pts.push([Math.cos(a1) * r * 1.05, Math.sin(a1) * r * 1.05]);
        }
        rough(pts);
        ctx.fill();
        rim(0.1);
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, TAU);
        ctx.fill();
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.22, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "arc": {
        // A jagged energy bolt: glow + a short crackling zigzag along travel,
        // backed by a dark under-stroke so it reads inked.
        glow(r * 1.8);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        const zig = (): void => {
          ctx.beginPath();
          const n = 4;
          for (let s = 0; s <= n; s++) {
            const px = (s / n - 0.5) * r * 3.2;
            const py = s === 0 || s === n ? 0 : (((s + i) % 2) - 0.5) * r * 1.1;
            s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        };
        ctx.strokeStyle = INK;
        ctx.lineWidth = Math.max(2.4, r * 0.5);
        zig();
        ctx.strokeStyle = white;
        ctx.lineWidth = Math.max(1.5, r * 0.3);
        zig();
        ctx.restore();
        break;
      }
      default: {
        // orb / beam — a bright light-mote with a thin inked rim.
        glow(r * 1.9);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(x, y, r * (p.evolved ? 0.85 : 0.72), 0, TAU);
        ctx.fill();
        rim(0.12);
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(x - r * 0.12, y - r * 0.12, r * (p.evolved ? 0.5 : 0.42), 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, camera: Camera, world: World): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < world.particles.length; i++) {
      const p = world.particles[i];
      const x = camera.worldToScreenX(p.x);
      const y = camera.worldToScreenY(p.y);
      if (p.shape === "ring") {
        // Expanding shockwave: grows and fades over its life.
        const t = p.maxLife > 0 ? p.life / p.maxLife : 1;
        const rr = (p.size + p.size * 2.2 * t) * camera.zoom;
        ctx.globalAlpha = Math.max(0, (1 - t) * 0.7);
        ctx.strokeStyle = `hsl(${p.hue} 95% 72%)`;
        ctx.lineWidth = Math.max(0.5, (3 * (1 - t) + 0.5) * camera.zoom);
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, TAU);
        ctx.stroke();
        continue;
      }
      ctx.globalAlpha = Math.max(0, p.alpha);
      const r = p.size * camera.zoom;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
      g.addColorStop(0, `hsl(${p.hue} 95% 72%)`);
      g.addColorStop(1, `hsla(${p.hue} 95% 65% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /** Red edge pulse when the Warden's vitality is low. */
  private drawDangerPulse(
    ctx: CanvasRenderingContext2D,
    world: World,
    w: number,
    h: number,
  ): void {
    const frac = world.player.hp / world.player.stats.maxHp;
    if (frac >= 0.3 || world.isDead) return;
    const intensity = (1 - frac / 0.3) * (0.35 + 0.25 * Math.sin(world.stats.elapsed * 6));
    const g = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.3,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.7,
    );
    g.addColorStop(0, "rgba(255,30,60,0)");
    g.addColorStop(1, `rgba(255,30,60,${Math.max(0, intensity)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
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
      // Hold full opacity, then fade only over the last third — readable, punchy.
      ctx.globalAlpha = t < 0.66 ? 1 : Math.max(0, 1 - (t - 0.66) / 0.34);
      // Pop-in: scale up from small with an overshoot over the first ~90ms.
      const popT = this.reduceMotion ? 1 : Math.min(1, d.life / 0.09);
      const pop = popT >= 1 ? 1 : 0.35 + easeOutBack(popT) * 0.65;
      // Bigger hits read bigger: a gentle log-scaled size bonus.
      const mag = Math.max(0, Math.min(3, Math.log10(Math.max(1, d.value)) - 1));
      const size = ((d.crit ? 21 : 14) + mag * 4) * camera.zoom * pop;
      ctx.font = `${d.crit ? "800" : "700"} ${size}px "Afterlight Hand", ui-sans-serif, system-ui, sans-serif`;
      ctx.lineWidth = Math.max(2.5, size * 0.14);
      ctx.strokeStyle = "rgba(0,0,0,0.65)";
      ctx.fillStyle = d.crit ? "#ffe27a" : "#ffffff";
      // Large hits abbreviate (12.4k) so late-game numbers stay readable.
      const v =
        d.value >= 100000
          ? `${Math.round(d.value / 1000)}k`
          : d.value >= 10000
            ? `${(d.value / 1000).toFixed(1)}k`
            : `${d.value}`;
      const text = d.crit ? `${v}!` : v;
      if (d.crit) {
        ctx.shadowColor = "rgba(255,190,60,0.9)";
        ctx.shadowBlur = 12 * camera.zoom;
      }
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
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
