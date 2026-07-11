import type { World } from "../World";

const PLAYER_RADIUS = 18;

export function resolveCombat(world: World): void {
  resolveFriendlyProjectiles(world);
  resolveEnemyProjectiles(world);
  resolveEnemyContact(world);
  resolvePickupCollection(world);
}

function resolveFriendlyProjectiles(world: World): void {
  for (const proj of world.projectiles) {
    if (proj.dead || !proj.friendly) continue;

    if (proj.isMine) {
      if ((proj.armTimer ?? 0) > 0) continue;
      const targets = world.enemiesWithinRadius(proj.x, proj.y, proj.radius);
      if (targets.length > 0) {
        for (const t of targets) world.dealDamageToEnemy(t, proj.damage);
        world.effects.push({ kind: "ring", x: proj.x, y: proj.y, radius: proj.radius, life: 0.25, maxLife: 0.25, color: "#ffb266" });
        proj.dead = true;
      }
      continue;
    }

    if (!proj.hitEnemyIds) proj.hitEnemyIds = new Set();
    const candidates = world.enemiesWithinRadius(proj.x, proj.y, proj.radius + 24);
    for (const enemy of candidates) {
      if (proj.hitEnemyIds.has(enemy.id)) continue;
      const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
      if (dist > enemy.radius + proj.radius) continue;

      world.dealDamageToEnemy(enemy, proj.damage);
      proj.hitEnemyIds.add(enemy.id);
      if (proj.pierceRemaining <= 0) {
        proj.dead = true;
        break;
      }
      proj.pierceRemaining -= 1;
    }
  }
}

function resolveEnemyProjectiles(world: World): void {
  const p = world.player;
  for (const proj of world.projectiles) {
    if (proj.dead || proj.friendly) continue;
    const dist = Math.hypot(p.x - proj.x, p.y - proj.y);
    if (dist <= proj.radius + PLAYER_RADIUS) {
      world.dealDamageToPlayer(proj.damage);
      proj.dead = true;
    }
  }
}

function resolveEnemyContact(world: World): void {
  const p = world.player;
  for (const enemy of world.enemies) {
    if (enemy.dead) continue;
    const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
    if (dist <= enemy.radius + PLAYER_RADIUS) {
      world.dealDamageToPlayer(enemy.contactDamage);
    }
  }
}

function resolvePickupCollection(world: World): void {
  const p = world.player;
  for (const pickup of world.pickups) {
    if (pickup.dead) continue;
    const dist = Math.hypot(pickup.x - p.x, pickup.y - p.y);
    if (dist <= pickup.radius + PLAYER_RADIUS) world.collectPickup(pickup);
  }
}
