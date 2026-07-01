import { describe, it, expect } from "vitest";
import { World } from "./World";
import { Enemy } from "./entities/Enemy";
import { Particle } from "./entities/Particle";

describe("combat VFX", () => {
  it("spawnImpact and spawnMuzzle emit particles", () => {
    const w = new World(5);
    w.reset();
    const before = w.particles.length;
    w.spawnImpact(0, 0, 200, 1, 0);
    const afterImpact = w.particles.length;
    expect(afterImpact).toBeGreaterThan(before);
    w.spawnMuzzle(0, 0, 0, 200);
    expect(w.particles.length).toBeGreaterThan(afterImpact);
  });

  it("a hit pops the enemy's hitScale for squash-and-stretch", () => {
    const w = new World(5);
    w.reset();
    const e = new Enemy();
    e.active = true;
    e.hp = 100;
    e.maxHp = 100;
    w.damageEnemy(e, 10, false, 0, 0);
    expect(e.hitScale).toBeGreaterThan(1);
    // Crits pop harder.
    const e2 = new Enemy();
    e2.active = true;
    e2.hp = 100;
    e2.maxHp = 100;
    w.damageEnemy(e2, 10, true, 0, 0);
    expect(e2.hitScale).toBeGreaterThan(e.hitScale);
  });

  it("VFX spawners respect the particle budget", () => {
    const w = new World(5);
    w.reset();
    for (let i = 0; i < 430; i++) {
      const pt = new Particle();
      pt.active = true;
      w.particles.push(pt);
    }
    const n = w.particles.length;
    w.spawnImpact(0, 0, 200, 1, 0);
    w.spawnMuzzle(0, 0, 0, 200);
    expect(w.particles.length).toBe(n); // over budget → no new particles
  });
});
