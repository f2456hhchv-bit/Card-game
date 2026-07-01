import { describe, it, expect } from "vitest";
import { World } from "../World";
import type { Input } from "../../engine/Input";
import { PASSIVE_LIST } from "../data/passiveDefs";

/** A minimal Input stub — World.step only reads moveX/moveY off it. */
const moving = { moveX: 1, moveY: 0 } as unknown as Input;

describe("run snapshot round-trip", () => {
  it("captures and restores the meaningful run state", () => {
    const w1 = new World(1234);
    w1.reset();
    for (let i = 0; i < 120; i++) w1.step(1 / 60, moving); // ~2s of progress

    // Give the loadout some depth to prove weapons + passives survive.
    w1.loadout.weapons[0].level = 4;
    w1.loadout.passives.set(PASSIVE_LIST[0].id, 2);
    w1.loadout.recomputeStats(w1.player);
    w1.player.hp = 55;

    const snap = w1.captureRunState();

    // A fresh World (different seed) reconstructs the run from the snapshot.
    const w2 = new World(999);
    w2.reset();
    w2.restoreRunState(snap);

    expect(w2.rng.getState()).toBe(snap.rngState);
    expect(w2.stats.elapsed).toBeCloseTo(w1.stats.elapsed, 5);
    expect(w2.player.level).toBe(w1.player.level);
    expect(w2.player.x).toBeCloseTo(w1.player.x, 3);
    expect(w2.loadout.weapons[0].level).toBe(4);
    expect(w2.loadout.passives.get(PASSIVE_LIST[0].id)).toBe(2);
    expect(w2.player.hp).toBeCloseTo(Math.min(55, w2.player.stats.maxHp), 3);
  });

  it("never leaves the Warden unarmed if the snapshot's weapons are unknown", () => {
    const w = new World(1);
    w.reset();
    const snap = w.captureRunState();
    snap.loadout.weapons = [{ id: "does-not-exist", level: 3, cooldownRemaining: 0 }];
    w.restoreRunState(snap);
    expect(w.loadout.weapons.length).toBeGreaterThan(0);
  });
});
