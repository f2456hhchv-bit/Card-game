import { describe, it, expect } from "vitest";
import { World } from "./World";
import type { Input } from "../engine/Input";

const STILL = { moveX: 0, moveY: 0 } as unknown as Input;

/** Drive the sim for `seconds` at 60Hz, standing still. */
function run(w: World, seconds: number): void {
  for (let i = 0; i < Math.round(seconds * 60); i++) w.step(1 / 60, STILL);
}

describe("Biome hazards", () => {
  it("only harms the Warden during the active beat, never while telegraphing", () => {
    const w = new World();
    w.reset();
    w.stageId = "ember"; // ember biome spawns lava vents
    w.player.stats.maxHp = 100000;
    w.player.hp = 100000;
    w.player.stats.iframes = 0; // measure raw hazard ticks
    w.player.stats.armor = 0;

    // Force a hazard directly on the Warden so we control the geometry.
    // (spawnHazard is private; drive via the public field once one appears.)
    // Fast-forward until a hazard exists, then teleport it onto the player.
    let guard = 0;
    while (w.hazards.length === 0 && guard++ < 60) run(w, 0.2);
    expect(w.hazards.length).toBeGreaterThan(0);
    const h = w.hazards[0];
    h.x = w.player.x;
    h.y = w.player.y;
    h.phase = 0;
    h.timer = 0;

    // Telegraph beat: no damage.
    const hp0 = w.player.hp;
    for (let i = 0; i < 30; i++) {
      w.step(1 / 60, STILL);
      h.x = w.player.x; // keep it centred on the (stationary) Warden
      h.y = w.player.y;
      if (h.phase === 0) expect(w.player.hp).toBe(hp0);
      else break;
    }

    // Active beat: damage lands.
    const hpBeforeActive = w.player.hp;
    for (let i = 0; i < 40 && h.phase <= 1; i++) {
      w.step(1 / 60, STILL);
      h.x = w.player.x;
      h.y = w.player.y;
    }
    expect(w.player.hp).toBeLessThan(hpBeforeActive);
  });

  it("leaves calm stages (The Fade) hazard-free", () => {
    const w = new World();
    w.reset();
    w.stageId = "fade";
    w.player.stats.maxHp = 100000;
    w.player.hp = 100000;
    run(w, 12);
    expect(w.hazards.length).toBe(0);
  });
});
