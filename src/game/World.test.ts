import { describe, it, expect } from "vitest";
import { World } from "./World";
import { WEAPON_DEFS } from "./data/weaponDefs";

/** Minimal input stub — the World only reads moveX/moveY/facing-relevant bits. */
const STILL = { moveX: 0, moveY: 0 } as unknown as Parameters<World["step"]>[1];

/** Place an enemy directly so weapons have a target. */
function addEnemyNear(world: World): void {
  // Drive one spawn by stepping until at least one enemy exists.
  for (let i = 0; i < 600 && world.enemies.length === 0; i++) {
    world.step(1 / 60, STILL);
  }
}

describe("World — combat integration", () => {
  it("spawns enemies and fires the starter weapon over time", () => {
    const world = new World(42);
    world.reset();
    addEnemyNear(world);
    expect(world.enemies.length).toBeGreaterThan(0);
    // Step long enough for the starter weapon to fire at least once.
    let fired = false;
    const off = world.events.on("weaponFired", () => (fired = true));
    for (let i = 0; i < 120 && !fired; i++) world.step(1 / 60, STILL);
    off();
    expect(fired).toBe(true);
  });

  it("an evolved weapon fires valid projectiles in the simulation", () => {
    const world = new World(7);
    world.reset();
    // Swap the starter for the evolved Sunlance and recompute.
    world.loadout.weapons[0].def = WEAPON_DEFS.sunlance;
    world.loadout.weapons[0].level = 1;
    world.loadout.recomputeStats(world.player);

    addEnemyNear(world);
    // Step a bit; Sunlance (nearest pattern) should emit projectiles.
    for (let i = 0; i < 60 && world.projectiles.length === 0; i++) {
      world.step(1 / 60, STILL);
    }
    expect(world.projectiles.length).toBeGreaterThan(0);
    const p = world.projectiles[0];
    expect(p.damage).toBeGreaterThan(0);
    expect(Number.isFinite(p.vx)).toBe(true);
    expect(Number.isFinite(p.vy)).toBe(true);
  });

  it("spawns a boss at the boss interval and cleans up when defeated", () => {
    const world = new World(3);
    world.reset();
    // Make the test Warden effectively unkillable so the run survives to 180s.
    world.player.stats.maxHp = 1e9;
    world.player.hp = 1e9;
    let spawned = false;
    let defeated = false;
    world.events.on("bossSpawned", () => (spawned = true));
    world.events.on("bossDefeated", () => (defeated = true));

    // Fast-forward past the first boss interval (180s).
    for (let i = 0; i < 60 * 185 && !spawned; i++) world.step(1 / 60, STILL);
    expect(spawned).toBe(true);
    expect(world.bossActive).toBe(true);
    expect(world.boss).not.toBeNull();

    // Slay the boss directly.
    const boss = world.boss!;
    world.damageEnemy(boss, boss.maxHp + 1, false, 0, 0);
    world.step(1 / 60, STILL);
    expect(defeated).toBe(true);
    expect(world.bossActive).toBe(false);
    expect(world.boss).toBeNull();
    // A boss drops a generous loot shower.
    expect(world.pickups.length).toBeGreaterThan(5);
  });

  it("enemy projectiles damage the player and are recycled", () => {
    const world = new World(8);
    world.reset();
    const startHp = world.player.hp;
    // Fire a hostile projectile straight at the Warden.
    world.fireEnemyProjectile(world.player.x + 40, world.player.y, -300, 0, 15, 320, 8);
    expect(world.enemyProjectiles.length).toBe(1);
    for (let i = 0; i < 30 && world.enemyProjectiles.length > 0; i++) {
      world.step(1 / 60, STILL);
    }
    expect(world.enemyProjectiles.length).toBe(0); // hit or expired → recycled
    expect(world.player.hp).toBeLessThan(startHp); // it connected
  });

  it("the chain weapon (Arc Coil) damages enemies and spawns visual arcs", () => {
    const world = new World(15);
    world.reset();
    // Swap the starter for Arc Coil (chain pattern).
    world.loadout.weapons[0].def = WEAPON_DEFS.arcCoil;
    world.loadout.weapons[0].level = 1;
    world.loadout.recomputeStats(world.player);

    addEnemyNear(world);
    // updateCosmetic (which expires arcs) isn't called here, so arcs accumulate
    // once the chain fires (cooldown ~1s).
    for (let i = 0; i < 120 && world.arcs.length === 0; i++) world.step(1 / 60, STILL);
    expect(world.arcs.length).toBeGreaterThan(0); // visual arcs were emitted
    expect(world.stats.damageDealt).toBeGreaterThan(0); // chain dealt damage
  });

  it("a Spore bursts into Sporelings when destroyed", () => {
    const world = new World(21);
    world.reset();
    // Spawn a Spore directly (spawnAdd is internal; cast for the test).
    (world as unknown as { spawnAdd(id: string, x: number, y: number): void }).spawnAdd(
      "spore",
      0,
      0,
    );
    const spore = world.enemies.find((e) => e.typeId === "spore");
    expect(spore).toBeDefined();
    world.damageEnemy(spore!, 99999, false, 0, 0);
    const sporelings = world.enemies.filter((e) => e.typeId === "sporeling");
    expect(sporelings.length).toBe(3);
    // The split product is summon-only and must not chain-split further.
    world.damageEnemy(sporelings[0], 99999, false, 0, 0);
    expect(world.enemies.filter((e) => e.typeId === "sporeling").length).toBe(2);
  });

  it("kills award XP and can trigger a level-up draft", () => {
    const world = new World(99);
    world.reset();
    addEnemyNear(world);
    // Nuke everything via a bomb-equivalent: directly damage all enemies.
    let killed = 0;
    const off = world.events.on("enemyKilled", () => killed++);
    for (let i = 0; i < 30; i++) {
      for (const e of [...world.enemies]) world.damageEnemy(e, 99999, false, 0, 0);
      world.step(1 / 60, STILL);
    }
    off();
    expect(killed).toBeGreaterThan(0);
    expect(world.stats.kills).toBe(killed);
  });
});
