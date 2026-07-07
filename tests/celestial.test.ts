import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  ATTACK_TYPES,
  DEATH_EVENT_KINDS,
  ENEMY_FAMILIES,
  ENEMY_ROLES,
  MOVEMENT_BEHAVIOURS,
  SANDBOX_ENEMIES,
  SPECIAL_ABILITIES,
  findEnemyOverlap,
} from "../src/game/enemies/enemyData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import {
  CELESTIAL_COMBAT_STYLES,
  CELESTIAL_ELITE_GAINS,
  CELESTIAL_ENEMIES,
  CELESTIAL_MINI_BOSS_KINDS,
  CELESTIAL_NETWORK_TRAITS,
  CELESTIAL_SPECIAL_MECHANICS,
  CELESTIAL_UNIT_KINDS,
  CONSTELLATION_TUNING,
  COSMIC_MANIPULATION_ACTIONS,
  GRAVITY_WELL_TUNING,
  createGravityWell,
} from "../src/game/enemies/celestialData";
import { CelestialConstellationRuntime } from "../src/game/enemies/CelestialConstellation";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

/** Star pattern: the Avatar ("hub") links to every other member — the anchor by construction. */
function makeConstellation(): CelestialConstellationRuntime {
  return new CelestialConstellationRuntime(
    "constellation-1",
    ["spark", "hunter", "oracle", "hub", "guardian"],
    [
      ["hub", "spark"],
      ["hub", "hunter"],
      ["hub", "oracle"],
      ["hub", "guardian"],
      ["spark", "hunter"],
    ],
  );
}

describe("Celestial vocabulary — registered shelves (AF-054 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, six network traits, eight cosmic-manipulation actions, six mini-bosses, six elite gains", () => {
    expect(CELESTIAL_UNIT_KINDS.length).toBe(13);
    expect(CELESTIAL_COMBAT_STYLES.length).toBe(8);
    expect(CELESTIAL_SPECIAL_MECHANICS.length).toBe(10);
    expect(CELESTIAL_NETWORK_TRAITS.length).toBe(6);
    expect(COSMIC_MANIPULATION_ACTIONS.length).toBe(8);
    expect(CELESTIAL_MINI_BOSS_KINDS.length).toBe(6);
    expect(CELESTIAL_ELITE_GAINS.length).toBe(6);
  });
});

describe("Celestial units are plain AF-033 EnemyDefs — zero schema changes (AF-054 §Core Units)", () => {
  it("every celestial def uses only registered AF-033 vocabulary", () => {
    for (const def of CELESTIAL_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no celestial def overlaps any existing enemy across all nine factions (AF-033's no-overlap law)", () => {
    const all = [
      ...SANDBOX_ENEMIES,
      ...OUTLAW_ENEMIES,
      ...MACHINE_ENEMIES,
      ...CRYSTAL_ENEMIES,
      ...VOID_ENEMIES,
      ...ANCIENT_ENEMIES,
      ...XENO_ENEMIES,
      ...NOMAD_ENEMIES,
      ...PARAGON_ENEMIES,
      ...CELESTIAL_ENEMIES,
    ];
    for (const def of CELESTIAL_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged celestial attack is a real Celestial Conclave weapon with a readable telegraph", () => {
    for (const def of CELESTIAL_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Celestial Conclave");
      }
    }
  });

  it("gives AF-021's dormant shieldBreak status its first producer", () => {
    const hunter = CELESTIAL_ENEMIES.find((d) => d.id === "pulsar-hunter")!;
    expect(hunter.attack.mechanism.kind === "ranged" && hunter.attack.mechanism.weapon.statusOnHit?.kind).toBe("shieldBreak");
  });

  it("a Living Supernova runs through AF-034's Elite pipeline unchanged", () => {
    const supernova = CELESTIAL_ENEMIES.find((d) => d.id === "living-supernova")!;
    const elite = generateElite(supernova, "prime", new Rng(43));
    expect(elite.def.hull).toBeGreaterThan(supernova.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("CelestialConstellationRuntime — per-entity bonuses from a graph, not one shared value (AF-054 §Celestial Network)", () => {
  it("every member's link count reflects the fixed constellation pattern at full strength", () => {
    const c = makeConstellation();
    expect(c.linkCountFor("hub")).toBe(4); // linked to all four others
    expect(c.linkCountFor("spark")).toBe(2); // linked to hub AND hunter
    expect(c.linkCountFor("oracle")).toBe(1); // linked only to hub
  });

  it("two members can carry different bonus magnitudes at the same instant — no single shared value", () => {
    const c = makeConstellation();
    expect(c.damageBonusFor("hub")).toBeGreaterThan(c.damageBonusFor("oracle"));
    expect(c.damageBonusFor("hub")).toBeCloseTo(4 * CONSTELLATION_TUNING.solarEnergyDamageBonusPerLink, 5);
    expect(c.damageBonusFor("oracle")).toBeCloseTo(1 * CONSTELLATION_TUNING.solarEnergyDamageBonusPerLink, 5);
  });

  it("destroying the highest-degree anchor costs every neighbour a link simultaneously — a real cascade", () => {
    const c = makeConstellation();
    const before = c.linkCountFor("oracle");
    expect(c.notifyDroneDestroyed("hub")).toBe("member");
    expect(c.linkCountFor("oracle")).toBeLessThan(before);
    expect(c.linkCountFor("oracle")).toBe(0); // oracle's only link was the hub
    expect(c.linkCountFor("spark")).toBe(1); // spark still has hunter
  });

  it("destroying a leaf member only affects its own direct neighbour, not the whole formation", () => {
    const c = makeConstellation();
    const hubBefore = c.linkCountFor("hub");
    expect(c.notifyDroneDestroyed("oracle")).toBe("member");
    expect(c.linkCountFor("hub")).toBe(hubBefore - 1);
    expect(c.linkCountFor("guardian")).toBe(1); // untouched — guardian was never linked to oracle
  });

  it("link count, and every derived bonus, never exceeds the fairness cap regardless of graph density", () => {
    const memberIds = Array.from({ length: 10 }, (_, i) => `m${i}`);
    const links: Array<[string, string]> = [];
    for (let i = 1; i < memberIds.length; i += 1) links.push([memberIds[0]!, memberIds[i]!]); // hub linked to all nine others
    const dense = new CelestialConstellationRuntime("dense", memberIds, links);
    expect(dense.linkCountFor("m0")).toBe(CONSTELLATION_TUNING.maxContributingLinks);
    expect(dense.damageBonusFor("m0")).toBeCloseTo(CONSTELLATION_TUNING.maxContributingLinks * CONSTELLATION_TUNING.solarEnergyDamageBonusPerLink, 5);
  });

  it("healing and incoming-damage reduction also scale per-entity from link count", () => {
    const c = makeConstellation();
    expect(c.healPerSecondFor("hub")).toBeCloseTo(4 * CONSTELLATION_TUNING.healPerSecondPerLink, 5);
    expect(c.incomingDamageReductionFor("hub")).toBeCloseTo(4 * CONSTELLATION_TUNING.shieldStrengthReductionPerLink, 5);
    expect(c.healPerSecondFor("oracle")).toBeLessThan(c.healPerSecondFor("hub"));
  });

  it("a destroyed member's own link count and bonuses drop to zero", () => {
    const c = makeConstellation();
    c.notifyDroneDestroyed("hub");
    expect(c.linkCountFor("hub")).toBe(0);
    expect(c.damageBonusFor("hub")).toBe(0);
  });

  it("is eliminated once every member is destroyed", () => {
    const c = makeConstellation();
    for (const id of ["spark", "hunter", "oracle", "hub", "guardian"]) c.notifyDroneDestroyed(id);
    expect(c.eliminated).toBe(true);
  });
});

describe("Gravity Wells reuse AF-035's exact hazard-zone engine (AF-054 §Special Mechanics: Gravity Wells)", () => {
  it("createGravityWell produces a real HazardZoneDef ticking through stepHazardZone, the sixth faction to reuse the engine", () => {
    const well = createGravityWell("well-1", 4, 4);
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(well, state, GRAVITY_WELL_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(well, state, 1)).toBe(true);
  });
});

describe("Codex — the Celestial Conclave doctrine entry (AF-054 §Codex)", () => {
  it("adds an additive Codex entry gated on the Avatar-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-celestial-conclave");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_CELESTIAL_CONCLAVE_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Celestial Conclave — self-review: thousands of encounters stay consistent (AF-054 §Self Review Loop)", () => {
  it("survives 1,000 randomised constellation encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4054);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["spark", "hunter", "oracle", "hub", "guardian"];
      const links: Array<[string, string]> = [
        ["hub", "spark"],
        ["hub", "hunter"],
        ["hub", "oracle"],
        ["hub", "guardian"],
        ["spark", "hunter"],
      ];
      const c = new CelestialConstellationRuntime(`constellation-${encounter}`, memberIds, links);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        const role = c.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        for (const remaining of memberIds) {
          expect(c.linkCountFor(remaining)).toBeLessThanOrEqual(CONSTELLATION_TUNING.maxContributingLinks);
          expect(c.linkCountFor(remaining)).toBeGreaterThanOrEqual(0);
        }
      }
      expect(c.eliminated).toBe(true);
    }
  });
});
