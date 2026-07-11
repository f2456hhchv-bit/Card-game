import { targetScore, type World } from "../World";
import type { Enemy, WeaponInstance } from "../entities";
import { allocId } from "../entities";
import { getUpgradeDef } from "../data/upgradeDefs";
import { resolveWeapon, type ResolvedWeapon } from "./StatEngine";

const ACQUIRE_RANGE = 950;
const NO_TARGET_RETRY = 0.15;

export function updateWeapons(dt: number, world: World): void {
  const player = world.player;

  for (const weapon of player.weapons) {
    const def = getUpgradeDef(weapon.upgradeId);
    if (!def.weaponBase) continue;
    const resolved = resolveWeapon(def, weapon.stackCount, world.stats);

    if (resolved.pattern === "orbit") {
      updateOrbitDrones(dt, world, weapon, resolved);
      continue;
    }

    weapon.cooldown -= dt;
    if (weapon.cooldown > 0) continue;

    const fired = firePattern(world, weapon, resolved);
    weapon.cooldown = fired ? resolved.interval : NO_TARGET_RETRY;
  }
}

function firePattern(world: World, weapon: WeaponInstance, resolved: ResolvedWeapon): boolean {
  const { x, y } = world.player;
  switch (resolved.pattern) {
    case "nearestBolt":
      return fireNearestBolt(world, weapon, resolved, x, y);
    case "chainBolt":
      return fireChainBolt(world, weapon, resolved, x, y);
    case "spread":
      return fireSpread(world, weapon, resolved, x, y);
    case "homing":
      return fireHoming(world, resolved, x, y);
    case "pulseAoe":
      return firePulseAoe(world, resolved, x, y);
    case "pierceLine":
      return firePierceLine(world, weapon, resolved, x, y);
    case "rearTurret":
      return fireRearTurret(world, resolved, x, y);
    case "meleeArc":
      return fireMeleeArc(world, resolved, x, y);
    case "mine":
      return fireMine(world, resolved, x, y);
    default:
      return false;
  }
}

/** Small preference margin (matching findPriorityTarget's distance-equivalent
 * scoring) a candidate needs over the current sticky target before it's
 * worth switching — prevents flip-flopping over trivial differences while
 * still letting a genuinely neglected target win. */
const TARGET_SWITCH_MARGIN = 60;

/** Keeps firing at the same enemy across shots rather than re-aiming at
 * whatever's nearest every single shot, but still re-checks each time
 * whether a meaningfully higher-priority target exists (see
 * `findPriorityTarget`) and switches to it — a pure "stay locked until it
 * dies" rule would let the weapon get stuck on one target indefinitely
 * while an enemy that holds its distance (an orbiter, a kiter) sits
 * neglected the whole time, never getting a chance to be picked at all. */
function resolveTarget(world: World, weapon: WeaponInstance, x: number, y: number): Enemy | null {
  const current =
    weapon.currentTargetId !== undefined ? (world.enemies.find((e) => e.id === weapon.currentTargetId && !e.dead) ?? null) : null;
  const currentValid = current !== null && Math.hypot(current.x - x, current.y - y) <= ACQUIRE_RANGE;

  const best = world.findPriorityTarget(x, y, ACQUIRE_RANGE);
  if (!best) return currentValid ? current : null;
  if (!currentValid) {
    weapon.currentTargetId = best.id;
    return best;
  }

  if (targetScore(x, y, best) > targetScore(x, y, current!) + TARGET_SWITCH_MARGIN) {
    weapon.currentTargetId = best.id;
    return best;
  }
  return current;
}

/** Light aim-assist applied to every non-dedicated-homing bolt: the initial
 * lead-aim angle alone isn't enough against erratic/dashing/teleporting
 * enemies, so bolts get a modest in-flight course correction. Seeker
 * Missiles pass their own, much stronger value on top of this. */
const AIM_ASSIST_HOMING = 0.5;

function spawnBolt(
  world: World,
  x: number,
  y: number,
  angle: number,
  resolved: ResolvedWeapon,
  targetId?: number,
  homing = AIM_ASSIST_HOMING,
): void {
  world.projectiles.push({
    id: allocId(),
    x,
    y,
    vx: Math.cos(angle) * resolved.projectileSpeed,
    vy: Math.sin(angle) * resolved.projectileSpeed,
    damage: resolved.damage,
    pierceRemaining: resolved.pierce,
    radius: resolved.radius,
    friendly: true,
    life: 3,
    homing,
    homingTargetId: targetId,
    color: "#6fd7ff",
    dead: false,
  });
}

/** First-order predictive aim: fast-moving/orbiting targets drift well outside
 * a bolt's tiny hit radius during its flight time otherwise, making them
 * effectively unhittable at range. */
function leadAngle(sx: number, sy: number, target: Enemy, projectileSpeed: number): number {
  const dx = target.x - sx;
  const dy = target.y - sy;
  const dist = Math.hypot(dx, dy) || 1;
  const t = dist / Math.max(1, projectileSpeed);
  const px = target.x + target.vx * t;
  const py = target.y + target.vy * t;
  return Math.atan2(py - sy, px - sx);
}

function fireNearestBolt(world: World, weapon: WeaponInstance, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const target = resolveTarget(world, weapon, x, y);
  if (!target) return false;
  const angle = leadAngle(x, y, target, resolved.projectileSpeed);
  for (let i = 0; i < resolved.count; i++) {
    spawnBolt(world, x, y, angle, resolved, target.id);
  }
  return true;
}

function fireChainBolt(world: World, weapon: WeaponInstance, resolved: ResolvedWeapon, x: number, y: number): boolean {
  let target: Enemy | null = resolveTarget(world, weapon, x, y);
  if (!target) return false;
  const hit = new Set<number>();
  let fromX = x;
  let fromY = y;
  const jumps = 1 + resolved.pierce;
  for (let i = 0; i < jumps && target; i++) {
    world.dealDamageToEnemy(target, resolved.damage);
    world.effects.push({ kind: "beam", x1: fromX, y1: fromY, x2: target.x, y2: target.y, life: 0.15, maxLife: 0.15, color: "#8fe3ff" });
    hit.add(target.id);
    fromX = target.x;
    fromY = target.y;
    const next: Enemy[] = world.enemiesWithinRadius(target.x, target.y, resolved.radius).filter((e) => !hit.has(e.id));
    target = next.length > 0 ? next[0] : null;
  }
  return true;
}

function fireSpread(world: World, weapon: WeaponInstance, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const target = resolveTarget(world, weapon, x, y);
  if (!target) return false;
  const baseAngle = leadAngle(x, y, target, resolved.projectileSpeed);
  const spreadArc = 0.55;
  for (let i = 0; i < resolved.count; i++) {
    const t = resolved.count === 1 ? 0 : i / (resolved.count - 1) - 0.5;
    spawnBolt(world, x, y, baseAngle + t * spreadArc, resolved, target.id);
  }
  return true;
}

function fireHoming(world: World, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const targets = world.findPriorityTargets(x, y, ACQUIRE_RANGE, resolved.count);
  if (targets.length === 0) return false;
  for (let i = 0; i < resolved.count; i++) {
    const t = targets[i % targets.length];
    const angle = Math.atan2(t.y - y, t.x - x) + (world.rng.next() - 0.5) * 0.3;
    spawnBolt(world, x, y, angle, resolved, t.id, world.stats.homingStrength + 0.6);
  }
  return true;
}

function firePulseAoe(world: World, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const targets = world.enemiesWithinRadius(x, y, resolved.radius);
  world.effects.push({ kind: "ring", x, y, radius: resolved.radius, life: 0.3, maxLife: 0.3, color: "#ff8fe0" });
  for (const t of targets) world.dealDamageToEnemy(t, resolved.damage);
  return true;
}

function firePierceLine(world: World, weapon: WeaponInstance, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const target = resolveTarget(world, weapon, x, y);
  if (!target) return false;
  const angle = leadAngle(x, y, target, resolved.projectileSpeed);
  const perpAngle = angle + Math.PI / 2;
  const lanes = resolved.count;
  for (let i = 0; i < lanes; i++) {
    const offset = lanes === 1 ? 0 : (i - (lanes - 1) / 2) * 14;
    spawnBolt(world, x + Math.cos(perpAngle) * offset, y + Math.sin(perpAngle) * offset, angle, resolved, target.id);
  }
  return true;
}

function fireRearTurret(world: World, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const targets = world.findPriorityTargets(x, y, ACQUIRE_RANGE, resolved.count);
  if (targets.length === 0) return false;
  for (const t of targets) {
    const angle = leadAngle(x, y, t, resolved.projectileSpeed);
    spawnBolt(world, x, y, angle, resolved, t.id);
  }
  return true;
}

function fireMeleeArc(world: World, resolved: ResolvedWeapon, x: number, y: number): boolean {
  const facing = world.player.angle;
  const targets = world.enemiesWithinRadius(x, y, resolved.radius).filter((e) => {
    const angleTo = Math.atan2(e.y - y, e.x - x);
    let diff = Math.abs(angleTo - facing);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    return diff <= 1.9;
  });
  world.effects.push({ kind: "arc", x, y, angle: facing, spread: 1.9, radius: resolved.radius, life: 0.18, maxLife: 0.18, color: "#ff6fb0" });
  for (const t of targets) world.dealDamageToEnemy(t, resolved.damage);
  return true;
}

function fireMine(world: World, resolved: ResolvedWeapon, x: number, y: number): boolean {
  for (let i = 0; i < resolved.count; i++) {
    const angle = world.rng.angle();
    const offset = 20 + world.rng.range(0, 20);
    world.projectiles.push({
      id: allocId(),
      x: x + Math.cos(angle) * offset,
      y: y + Math.sin(angle) * offset,
      vx: 0,
      vy: 0,
      damage: resolved.damage,
      pierceRemaining: 99,
      radius: resolved.radius,
      friendly: true,
      life: 8,
      homing: 0,
      color: "#ffb266",
      dead: false,
      isMine: true,
      armTimer: 0.4,
    });
  }
  return true;
}

function updateOrbitDrones(dt: number, world: World, weapon: WeaponInstance, resolved: ResolvedWeapon): void {
  if (!weapon.orbitDrones || weapon.orbitDrones.length !== resolved.count) {
    weapon.orbitDrones = Array.from({ length: resolved.count }, (_, i) => ({
      angleOffset: (i / resolved.count) * Math.PI * 2,
      hitTimer: 0,
    }));
  }

  const spinSpeed = 2.2;
  for (const drone of weapon.orbitDrones) {
    drone.angleOffset += spinSpeed * dt;
    drone.hitTimer -= dt;
    const dx = Math.cos(drone.angleOffset) * resolved.radius;
    const dy = Math.sin(drone.angleOffset) * resolved.radius;
    const droneX = world.player.x + dx;
    const droneY = world.player.y + dy;

    if (drone.hitTimer <= 0) {
      const hit = world.enemiesWithinRadius(droneX, droneY, 16)[0];
      if (hit) {
        world.dealDamageToEnemy(hit, resolved.damage);
        drone.hitTimer = resolved.interval;
      }
    }
  }
}
