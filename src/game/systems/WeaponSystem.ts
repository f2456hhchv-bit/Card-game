import type { World } from "../World";
import type { Enemy } from "../entities/Enemy";
import { Loadout, type OwnedWeapon } from "../Loadout";
import { TAU } from "../../core/math/MathUtils";

/**
 * Drives every weapon's activation each simulation step. Reads the Warden's
 * derived stats so passives (attack speed, damage, area, projectile count)
 * flow into firing automatically. Kept separate from the World's bookkeeping
 * so firing patterns can be reasoned about and tested in isolation.
 */
export class WeaponSystem {
  /** Monotonic id so each projectile volley can avoid double-hitting an enemy. */
  private weaponSeq = 1;

  update(world: World, dt: number): void {
    const { player, loadout } = world;
    const stats = player.stats;

    for (const w of loadout.weapons) {
      if (w.def.pattern === "orbit") {
        this.updateOrbit(world, w, dt);
        continue;
      }

      const lvl = Loadout.levelStats(w.def, w.level);
      // Attack-speed shortens cooldown; clamp so it can't hit zero.
      const cooldown = Math.max(0.05, lvl.cooldown / Math.max(0.2, stats.attackSpeedMult));
      w.cooldownRemaining -= dt;
      if (w.cooldownRemaining > 0) continue;
      w.cooldownRemaining += cooldown;

      switch (w.def.pattern) {
        case "nearest":
          this.fireNearest(world, w);
          break;
        case "spread":
          this.fireSpread(world, w);
          break;
        case "radial":
          this.fireRadial(world, w);
          break;
        case "aura":
          this.fireAura(world, w);
          break;
        case "chain":
          this.fireChain(world, w);
          break;
      }
    }
  }

  /**
   * Chain lightning: strike the nearest enemy, then leap to the nearest
   * not-yet-hit enemy within jump range, repeating up to `count` targets.
   * Damage decays slightly per jump. Instant — only the visual arcs persist.
   */
  private fireChain(world: World, w: OwnedWeapon): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const s = world.player.stats;
    const maxTargets = lvl.count + Math.max(0, s.extraProjectiles);
    const jumpRange = lvl.speed * Math.max(1, s.areaMult);

    const first = world.enemyGrid.findNearest(world.player.x, world.player.y, 640);
    if (!first) return;

    const hit = new Set<Enemy>();
    let fromX = world.player.x;
    let fromY = world.player.y;
    let current: Enemy | null = first;
    let damageScale = 1;

    for (let jump = 0; jump < maxTargets && current; jump++) {
      hit.add(current);
      const { dmg, crit } = this.rollDamage(world, lvl.damage * damageScale);
      const dx = current.x - fromX;
      const dy = current.y - fromY;
      const inv = 1 / (Math.hypot(dx, dy) || 1);
      world.damageEnemy(current, dmg, crit, dx * inv * lvl.knockback, dy * inv * lvl.knockback);
      world.spawnArc(fromX, fromY, current.x, current.y, w.def.hue);

      fromX = current.x;
      fromY = current.y;
      damageScale *= 0.88; // gentle falloff so long chains still matter
      current = this.nearestUnhit(world, fromX, fromY, jumpRange, hit);
    }
    world.events.emit("weaponFired", { weaponId: w.def.id });
  }

  /** Nearest active enemy to (x,y) within range whose id isn't in `hit`. */
  private nearestUnhit(
    world: World,
    x: number,
    y: number,
    range: number,
    hit: Set<Enemy>,
  ): Enemy | null {
    const near = world.enemyGrid.query(x, y, range);
    let best = null as Enemy | null;
    let bestSq = range * range;
    for (let i = 0; i < near.length; i++) {
      const e = near[i];
      if (!e.active || hit.has(e)) continue;
      const dx = e.x - x;
      const dy = e.y - y;
      const dSq = dx * dx + dy * dy;
      if (dSq < bestSq) {
        bestSq = dSq;
        best = e;
      }
    }
    return best;
  }

  private rollDamage(world: World, base: number): { dmg: number; crit: boolean } {
    const s = world.player.stats;
    let dmg = base * s.damageMult * world.damageBuff;
    let crit = false;
    if (world.rng.chance(s.critChance)) {
      dmg *= s.critMult;
      crit = true;
    }
    return { dmg: Math.round(dmg), crit };
  }

  private fireNearest(world: World, w: OwnedWeapon): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const { player } = world;
    const count = lvl.count + Math.max(0, player.stats.extraProjectiles);
    const target = world.enemyGrid.findNearest(player.x, player.y, 700);

    let baseAngle: number;
    if (target) {
      baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
      player.aim = baseAngle; // aim only — never rotates the hull sprite
    } else {
      baseAngle = player.aim;
    }

    // Slight fan when firing multiple bolts so they don't perfectly overlap.
    const spread = count > 1 ? 0.16 : 0;
    const seq = this.weaponSeq++;
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) - 0.5 : 0;
      const angle = baseAngle + t * spread * (count - 1);
      this.spawnProjectile(world, w, lvl, angle, seq);
    }
    const mr = world.player.radius + 6;
    world.spawnMuzzle(
      world.player.x + Math.cos(baseAngle) * mr,
      world.player.y + Math.sin(baseAngle) * mr,
      baseAngle,
      w.def.hue,
    );
    world.events.emit("weaponFired", { weaponId: w.def.id });
  }

  private fireSpread(world: World, w: OwnedWeapon): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const { player } = world;
    const count = lvl.count + Math.max(0, player.stats.extraProjectiles);
    const target = world.enemyGrid.findNearest(player.x, player.y, 700);
    const baseAngle = target
      ? Math.atan2(target.y - player.y, target.x - player.x)
      : player.aim;
    const arc = Math.min(TAU * 0.5, 0.18 * count);
    const seq = this.weaponSeq++;
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) - 0.5 : 0;
      this.spawnProjectile(world, w, lvl, baseAngle + t * arc, seq);
    }
    const mr = world.player.radius + 6;
    world.spawnMuzzle(
      world.player.x + Math.cos(baseAngle) * mr,
      world.player.y + Math.sin(baseAngle) * mr,
      baseAngle,
      w.def.hue,
    );
    world.events.emit("weaponFired", { weaponId: w.def.id });
  }

  private fireRadial(world: World, w: OwnedWeapon): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const count = lvl.count + Math.max(0, world.player.stats.extraProjectiles);
    const seq = this.weaponSeq++;
    const offset = world.rng.angle();
    for (let i = 0; i < count; i++) {
      this.spawnProjectile(world, w, lvl, offset + (i / count) * TAU, seq);
    }
    world.events.emit("weaponFired", { weaponId: w.def.id });
  }

  private spawnProjectile(
    world: World,
    w: OwnedWeapon,
    lvl: ReturnType<typeof Loadout.levelStats>,
    angle: number,
    seq: number,
  ): void {
    const s = world.player.stats;
    const { dmg, crit } = this.rollDamage(world, lvl.damage);
    const speed = lvl.speed * s.projectileSpeedMult;
    const p = world.obtainProjectile();
    p.x = world.player.x + Math.cos(angle) * (world.player.radius + 4);
    p.y = world.player.y + Math.sin(angle) * (world.player.radius + 4);
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.radius = 6 * lvl.area * s.areaMult;
    p.damage = dmg;
    p.crit = crit;
    p.life = 1.6;
    p.pierce = lvl.pierce;
    p.knockback = lvl.knockback;
    p.style = w.def.style;
    p.hue = w.def.hue;
    p.weaponSeq = seq;
    p.rotation = angle;
    p.rotationSpeed = w.def.style === "shard" ? 14 : 0;
    p.evolved = w.def.evolved ?? false;
    p.active = true;
  }

  /** Aura: tick damage to all enemies within the aura radius. */
  private fireAura(world: World, w: OwnedWeapon): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const s = world.player.stats;
    const radius = (60 + lvl.speed * 0.6) * lvl.area * s.areaMult;
    const { player } = world;
    const near = world.enemyGrid.query(player.x, player.y, radius);
    const r2 = radius * radius;
    for (let i = 0; i < near.length; i++) {
      const e = near[i];
      if (!e.active) continue;
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      if (dx * dx + dy * dy > r2) continue;
      const { dmg, crit } = this.rollDamage(world, lvl.damage);
      const inv = 1 / (Math.hypot(dx, dy) || 1);
      world.damageEnemy(e, dmg, crit, dx * inv * lvl.knockback, dy * inv * lvl.knockback);
    }
    world.auraRadius = radius; // cached for rendering
    world.auraHue = w.def.hue;
  }

  /**
   * Orbit weapon: orbs circle the Warden and damage enemies they sweep over.
   * Implemented inline (not as pooled projectiles) so their persistent, looping
   * lifetime needs no special-case in the projectile pool.
   */
  private updateOrbit(world: World, w: OwnedWeapon, dt: number): void {
    const lvl = Loadout.levelStats(w.def, w.level);
    const s = world.player.stats;
    const count = lvl.count;
    const orbitRadius = (70 + lvl.area * 18) * s.areaMult;
    const orbRadius = 12 * lvl.area * s.areaMult;
    world.orbitAngle += dt * 2.4 * s.attackSpeedMult;

    // Re-arm per-orb hit cooldown so a lingering orb re-hits enemies it touches.
    w.cooldownRemaining -= dt;
    const canHit = w.cooldownRemaining <= 0;
    if (canHit) w.cooldownRemaining = 0.35;

    for (let i = 0; i < count; i++) {
      const a = world.orbitAngle + (i / count) * TAU;
      const ox = world.player.x + Math.cos(a) * orbitRadius;
      const oy = world.player.y + Math.sin(a) * orbitRadius;
      world.setOrbitOrb(i, ox, oy, orbRadius, w.def.hue);
      if (!canHit) continue;
      const near = world.enemyGrid.query(ox, oy, orbRadius + 20);
      const hitR = orbRadius + 14;
      const hr2 = hitR * hitR;
      for (let j = 0; j < near.length; j++) {
        const e = near[j];
        if (!e.active) continue;
        const dx = e.x - ox;
        const dy = e.y - oy;
        if (dx * dx + dy * dy > hr2) continue;
        const { dmg, crit } = this.rollDamage(world, lvl.damage);
        const inv = 1 / (Math.hypot(dx, dy) || 1);
        world.damageEnemy(e, dmg, crit, dx * inv * lvl.knockback, dy * inv * lvl.knockback);
      }
    }
    world.orbitOrbCount = count;
  }
}
