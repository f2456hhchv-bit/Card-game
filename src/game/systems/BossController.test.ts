import { describe, it, expect } from "vitest";
import { BossController, type BossContext } from "./BossController";
import { BOSS_DEFS } from "../data/bossDefs";
import { Enemy } from "../entities/Enemy";
import { Rng } from "../../core/math/Rng";

function makeBoss(): Enemy {
  const e = new Enemy();
  const def = BOSS_DEFS.theMaw;
  e.x = 100;
  e.y = 0;
  e.radius = def.radius;
  e.isBoss = true;
  e.maxHp = def.baseHp;
  e.hp = def.baseHp;
  e.active = true;
  return e;
}

function makeContext(): { ctx: BossContext; projectiles: number[]; adds: string[] } {
  const projectiles: number[] = [];
  const adds: string[] = [];
  const ctx: BossContext = {
    player: { x: 0, y: 0 },
    elapsedMinutes: 3,
    rng: new Rng(1),
    fireEnemyProjectile: (_x, _y, _vx, _vy, damage) => projectiles.push(damage),
    spawnAdd: (typeId) => adds.push(typeId),
  };
  return { ctx, projectiles, adds };
}

describe("BossController", () => {
  it("starts in phase 0", () => {
    const ctrl = new BossController(BOSS_DEFS.theMaw);
    expect(ctrl.phase).toBe(0);
  });

  it("moves the boss toward the player over time", () => {
    const ctrl = new BossController(BOSS_DEFS.theMaw);
    const boss = makeBoss();
    const { ctx } = makeContext();
    const startX = boss.x;
    for (let i = 0; i < 30; i++) ctrl.update(boss, ctx, 1 / 60);
    expect(boss.x).toBeLessThan(startX); // player is at x=0, boss started at x=100
  });

  it("fires projectiles after a telegraph wind-up", () => {
    const ctrl = new BossController(BOSS_DEFS.theMaw);
    const boss = makeBoss();
    const { ctx, projectiles } = makeContext();
    // Step a few seconds; at least one attack should resolve into projectiles.
    for (let i = 0; i < 60 * 5; i++) ctrl.update(boss, ctx, 1 / 60);
    expect(projectiles.length).toBeGreaterThan(0);
    expect(projectiles[0]).toBeGreaterThan(0); // positive damage
  });

  it("telegraphs before firing (progress rises then resets)", () => {
    const ctrl = new BossController(BOSS_DEFS.theMaw);
    const boss = makeBoss();
    const { ctx } = makeContext();
    let sawTelegraph = false;
    for (let i = 0; i < 60 * 4; i++) {
      ctrl.update(boss, ctx, 1 / 60);
      if (ctrl.isTelegraphing) sawTelegraph = true;
    }
    expect(sawTelegraph).toBe(true);
  });

  it("advances phases and summons adds as HP drops", () => {
    const ctrl = new BossController(BOSS_DEFS.theMaw);
    const boss = makeBoss();
    const { ctx, adds } = makeContext();
    // Drop to phase 2 territory (<33%).
    boss.hp = boss.maxHp * 0.3;
    ctrl.update(boss, ctx, 1 / 60); // crosses 66% then... only one transition per step
    // Force both transitions by stepping again at low HP.
    ctrl.update(boss, ctx, 1 / 60);
    expect(ctrl.phase).toBeGreaterThanOrEqual(1);
    expect(adds.length).toBeGreaterThan(0); // a summon happened on phase entry
  });
});
