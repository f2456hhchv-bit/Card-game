import { describe, it, expect } from "vitest";
import { Loadout } from "./Loadout";
import { Player } from "./entities/Player";
import { Rng } from "../core/math/Rng";

function freshLoadout(): { loadout: Loadout; player: Player } {
  const loadout = new Loadout();
  const player = new Player();
  loadout.reset();
  loadout.recomputeStats(player);
  return { loadout, player };
}

describe("Loadout", () => {
  it("starts with exactly one starter weapon", () => {
    const { loadout } = freshLoadout();
    expect(loadout.weapons.length).toBe(1);
    expect(loadout.weapons[0].level).toBe(1);
  });

  it("rolls the requested number of distinct draft options", () => {
    const { loadout } = freshLoadout();
    const rng = new Rng(1);
    const opts = loadout.rollDraft(rng, 3);
    expect(opts.length).toBe(3);
    const ids = opts.map((o) => `${o.kind}:${o.id}`);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("applies a passive draft and recomputes stats", () => {
    const { loadout, player } = freshLoadout();
    const baseHp = player.stats.maxHp;
    loadout.applyDraft(
      {
        kind: "passive-new",
        id: "vitalCore",
        name: "Vital Core",
        description: "",
        hue: 0,
        note: "",
        level: 1,
      },
      player,
    );
    expect(player.stats.maxHp).toBeGreaterThan(baseHp);
    expect(loadout.passives.get("vitalCore")).toBe(1);
  });

  it("levels an owned weapon rather than duplicating it", () => {
    const { loadout, player } = freshLoadout();
    const id = loadout.weapons[0].def.id;
    loadout.applyDraft(
      { kind: "weapon-up", id, name: "", description: "", hue: 0, note: "", level: 2 },
      player,
    );
    expect(loadout.weapons.length).toBe(1);
    expect(loadout.weapons[0].level).toBe(2);
  });

  it("never offers more than six weapon slots", () => {
    const { loadout, player } = freshLoadout();
    const rng = new Rng(3);
    // Drain the draft repeatedly; weapon count must never exceed the cap.
    for (let i = 0; i < 60; i++) {
      const opts = loadout.rollDraft(rng, 3);
      if (opts.length === 0) break;
      loadout.applyDraft(opts[0], player);
      expect(loadout.weapons.length).toBeLessThanOrEqual(6);
    }
  });

  it("clamps armor into a sane range", () => {
    const { loadout, player } = freshLoadout();
    // Max out Ward Plate well past the cap.
    for (let i = 0; i < 5; i++) {
      loadout.applyDraft(
        { kind: "passive-up", id: "wardPlate", name: "", description: "", hue: 0, note: "", level: i + 1 },
        player,
      );
    }
    expect(player.stats.armor).toBeLessThanOrEqual(0.85);
    expect(player.stats.armor).toBeGreaterThan(0);
  });
});

describe("Loadout — weapon evolution", () => {
  // The starter (Lumen Bolt) evolves into Sunlance, requiring Keen Edge L3.
  function masterStarter(loadout: Loadout): void {
    const starter = loadout.weapons[0];
    starter.level = starter.def.maxLevel;
  }

  it("offers no evolution until the weapon is mastered", () => {
    const { loadout } = freshLoadout();
    loadout.passives.set("keenEdge", 3);
    expect(loadout.getEvolutions()).toHaveLength(0);
  });

  it("offers no evolution until the paired relic meets the threshold", () => {
    const { loadout } = freshLoadout();
    masterStarter(loadout);
    loadout.passives.set("keenEdge", 2); // one short
    expect(loadout.getEvolutions()).toHaveLength(0);
  });

  it("offers the evolution when weapon is mastered and relic qualifies", () => {
    const { loadout } = freshLoadout();
    masterStarter(loadout);
    loadout.passives.set("keenEdge", 3);
    const evos = loadout.getEvolutions();
    expect(evos).toHaveLength(1);
    expect(evos[0].kind).toBe("weapon-evolve");
    expect(evos[0].kind === "weapon-evolve" && evos[0].into).toBe("sunlance");
  });

  it("replaces the base weapon in-place on evolve, keeping slot count", () => {
    const { loadout, player } = freshLoadout();
    masterStarter(loadout);
    loadout.passives.set("keenEdge", 3);
    const evo = loadout.getEvolutions()[0];
    loadout.applyDraft(evo, player);
    expect(loadout.weapons).toHaveLength(1);
    expect(loadout.weapons[0].def.id).toBe("sunlance");
    expect(loadout.weapons[0].level).toBe(1);
    // No longer eligible (evolved form has no further evolution).
    expect(loadout.getEvolutions()).toHaveLength(0);
  });

  it("guarantees an available evolution appears in the draft", () => {
    const { loadout } = freshLoadout();
    masterStarter(loadout);
    loadout.passives.set("keenEdge", 3);
    const rng = new Rng(123);
    const opts = loadout.rollDraft(rng, 3);
    expect(opts.some((o) => o.kind === "weapon-evolve")).toBe(true);
  });

  it("never offers an evolved form as a fresh weapon pick", () => {
    const { loadout, player } = freshLoadout();
    const rng = new Rng(5);
    const evolvedIds = new Set([
      "sunlance",
      "prismaticStorm",
      "aegisCorona",
      "cataclysm",
      "solaris",
    ]);
    for (let i = 0; i < 80; i++) {
      const opts = loadout.rollDraft(rng, 3);
      if (opts.length === 0) break;
      for (const o of opts) {
        if (o.kind === "weapon-new") expect(evolvedIds.has(o.id)).toBe(false);
      }
      loadout.applyDraft(opts[0], player);
    }
  });
});
