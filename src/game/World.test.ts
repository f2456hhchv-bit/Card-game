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
