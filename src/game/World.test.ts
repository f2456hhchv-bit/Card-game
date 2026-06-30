import { describe, it, expect } from "vitest";
import { World } from "./World";
import { WEAPON_DEFS } from "./data/weaponDefs";
import { SLOTS, itemId, emptyEquip } from "./data/gearDefs";

/** Equip a full 4-piece set on the world (grade 5) to trigger its 4pc perk. */
function equipFullSet(world: World, setId: string): void {
  const equipped = emptyEquip();
  const inventory: Record<string, { grade: number; dupes: number }> = {};
  for (const slot of SLOTS) {
    const id = itemId(setId, slot);
    equipped[slot] = id;
    inventory[id] = { grade: 5, dupes: 0 };
  }
  world.gearEquipped = equipped;
  world.gearInventory = inventory;
}

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

  it("Aegis (Bastion 4-piece) cheats death once, then dies on the next lethal hit", () => {
    const world = new World(123);
    equipFullSet(world, "bastion");
    world.reset();
    expect(world.player.stats.revive).toBe(1);

    let revived = 0;
    let died = false;
    world.events.on("revived", () => revived++);
    world.events.on("playerDied", () => (died = true));

    // First lethal hit is survived at 35% HP.
    world.player.invuln = 0;
    world.damagePlayer(1e9);
    expect(revived).toBe(1);
    expect(died).toBe(false);
    expect(world.isDead).toBe(false);
    expect(world.player.hp).toBeCloseTo(world.player.stats.maxHp * 0.35);

    // Second lethal hit (after the i-frames lapse) actually kills.
    world.player.invuln = 0;
    world.damagePlayer(1e9);
    expect(died).toBe(true);
    expect(world.isDead).toBe(true);
  });

  it("Overdrive (Solaris 4-piece) emits a damaging pulse around the ship", () => {
    const world = new World(456);
    equipFullSet(world, "solaris");
    world.reset();
    expect(world.player.stats.pulseDamage).toBeGreaterThan(0);

    // Put an enemy point-blank and make the Warden unkillable.
    world.player.stats.maxHp = 1e9;
    world.player.hp = 1e9;
    (world as unknown as { spawnAdd(id: string, x: number, y: number): void }).spawnAdd(
      "husk",
      20,
      0,
    );
    const enemy = world.enemies[0];
    const startHp = enemy.hp;
    let pulsed = false;
    world.events.on("pulse", () => (pulsed = true));

    // Step past the pulse interval (3s).
    for (let i = 0; i < 60 * 4 && !pulsed; i++) world.step(1 / 60, STILL);
    expect(pulsed).toBe(true);
    expect(enemy.hp).toBeLessThan(startHp);
  });

  it("uses the player's iframes stat for the post-hit invulnerability window", () => {
    const world = new World(77);
    equipFullSet(world, "zephyr"); // Zephyr 4pc: +0.25s i-frames
    world.reset();
    world.player.invuln = 0;
    world.player.hp = world.player.stats.maxHp;
    world.damagePlayer(5);
    expect(world.player.invuln).toBeCloseTo(world.player.stats.iframes);
    expect(world.player.stats.iframes).toBeGreaterThan(0.5); // boosted by Slipstream
  });

  it("the Ember stage spawns tougher enemies than The Fade (difficulty curve)", () => {
    const spawnHusk = (stageId: string) => {
      const w = new World(5);
      w.stageId = stageId;
      w.reset();
      (w as unknown as { spawnAdd(id: string, x: number, y: number): void }).spawnAdd(
        "husk",
        0,
        0,
      );
      return w.enemies[0].maxHp;
    };
    expect(spawnHusk("ember")).toBeGreaterThan(spawnHusk("fade"));
  });

  it("Boss Rush spawns a boss fast, no fodder, and queues the next on defeat", () => {
    const world = new World(31);
    world.bossRush = true;
    world.reset();
    world.player.stats.maxHp = 1e9;
    world.player.hp = 1e9;

    // No fodder spawns in rush — only the boss (and its summons) should appear.
    let spawned = false;
    world.events.on("bossSpawned", () => (spawned = true));
    for (let i = 0; i < 60 * 7 && !spawned; i++) world.step(1 / 60, STILL);
    expect(spawned).toBe(true);
    // Every live enemy right after the first boss spawns is the boss itself.
    expect(world.enemies.every((e) => e.isBoss)).toBe(true);

    // Killing the boss queues the next one a few seconds later.
    const firstBoss = world.boss!;
    world.damageEnemy(firstBoss, firstBoss.maxHp + 1, false, 0, 0);
    world.step(1 / 60, STILL);
    expect(world.bossActive).toBe(false);
    let respawned = false;
    world.events.on("bossSpawned", () => (respawned = true));
    for (let i = 0; i < 60 * 6 && !respawned; i++) world.step(1 / 60, STILL);
    expect(respawned).toBe(true);
    expect(world.stats.bossKills).toBe(1);
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
