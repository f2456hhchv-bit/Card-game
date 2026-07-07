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
import {
  CRYSTAL_COMBAT_STYLES,
  CRYSTAL_ELITE_GAINS,
  CRYSTAL_ENEMIES,
  CRYSTAL_GROWTH_TUNING,
  CRYSTAL_MINI_BOSS_KINDS,
  CRYSTAL_SPECIAL_MECHANICS,
  CRYSTAL_UNIT_KINDS,
  ENVIRONMENTAL_CONTROL_ACTIONS,
  RESONANCE_SHARED_TRAITS,
  RESONANCE_TUNING,
  createCrystalGrowth,
  growCrystalZone,
} from "../src/game/enemies/crystalData";
import { CrystalResonanceRuntime } from "../src/game/enemies/CrystalResonance";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeEcosystem(): CrystalResonanceRuntime {
  return new CrystalResonanceRuntime("eco-1", ["drone", "hunter", "node1", "node2", "guardian"], ["node1", "node2"]);
}

describe("Crystal vocabulary — registered shelves (AF-048 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, six shared traits, seven environmental actions, six mini-bosses, seven elite gains", () => {
    expect(CRYSTAL_UNIT_KINDS.length).toBe(13);
    expect(CRYSTAL_COMBAT_STYLES.length).toBe(8);
    expect(CRYSTAL_SPECIAL_MECHANICS.length).toBe(10);
    expect(RESONANCE_SHARED_TRAITS.length).toBe(6);
    expect(ENVIRONMENTAL_CONTROL_ACTIONS.length).toBe(7);
    expect(CRYSTAL_MINI_BOSS_KINDS.length).toBe(6);
    expect(CRYSTAL_ELITE_GAINS.length).toBe(7);
  });
});

describe("Crystal units are plain AF-033 EnemyDefs — zero schema changes (AF-048 §Core Units)", () => {
  it("every crystal def uses only registered AF-033 vocabulary", () => {
    for (const def of CRYSTAL_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no crystal def overlaps any existing enemy, outlaw, machine, or another crystal (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES];
    for (const def of CRYSTAL_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged crystal attack is a real Crystal Dominion weapon with a readable telegraph", () => {
    for (const def of CRYSTAL_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Crystal Dominion");
      }
    }
  });

  it("a Crystal Titan runs through AF-034's Elite pipeline unchanged", () => {
    const titan = CRYSTAL_ENEMIES.find((d) => d.id === "crystal-titan")!;
    const elite = generateElite(titan, "prime", new Rng(13));
    expect(elite.def.hull).toBeGreaterThan(titan.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("CrystalResonanceRuntime — continuous strength, no state machine (AF-048 §Resonance Network)", () => {
  it("resonance strength scales with living node count, hard-capped for fairness", () => {
    const eco = makeEcosystem();
    expect(eco.resonanceStrength).toBeCloseTo(2 * RESONANCE_TUNING.perNodeBonus, 5);
    eco.notifyDroneDestroyed("node1");
    expect(eco.resonanceStrength).toBeCloseTo(RESONANCE_TUNING.perNodeBonus, 5);
    eco.notifyDroneDestroyed("node2");
    expect(eco.resonanceStrength).toBe(0);
  });

  it("never exceeds the fairness cap no matter how many nodes are added", () => {
    const eco = new CrystalResonanceRuntime("eco-cap", [], []);
    for (let i = 0; i < 50; i += 1) eco.enrolMember(`node-${i}`, true);
    expect(eco.resonanceStrength).toBe(RESONANCE_TUNING.maxResonanceStrength);
  });

  it("heal-per-second and speed bonus scale continuously with strength, not in steps", () => {
    const eco = makeEcosystem();
    expect(eco.healPerSecond).toBeCloseTo(
      (eco.resonanceStrength / RESONANCE_TUNING.maxResonanceStrength) * RESONANCE_TUNING.healPerSecondAtFullResonance,
      5,
    );
    expect(eco.speedBonus).toBeCloseTo(
      (eco.resonanceStrength / RESONANCE_TUNING.maxResonanceStrength) * RESONANCE_TUNING.speedBonusAtFullResonance,
      5,
    );
  });

  it("destroying a resonance node weakens nearby organisms immediately — no threshold, no delay", () => {
    const eco = makeEcosystem();
    const before = eco.damageBonus;
    expect(eco.notifyDroneDestroyed("node1")).toBe("node");
    expect(eco.damageBonus).toBeLessThan(before);
  });

  it("destroying a non-node member does not change resonance strength", () => {
    const eco = makeEcosystem();
    const before = eco.resonanceStrength;
    expect(eco.notifyDroneDestroyed("drone")).toBe("member");
    expect(eco.resonanceStrength).toBe(before);
  });

  it("is eliminated once every member is destroyed", () => {
    const eco = makeEcosystem();
    for (const id of ["drone", "hunter", "node1", "node2", "guardian"]) eco.notifyDroneDestroyed(id);
    expect(eco.eliminated).toBe(true);
  });

  it("factory/seeder-built organisms enrol as ordinary members or nodes", () => {
    const eco = makeEcosystem();
    eco.enrolMember("new-node", true);
    expect(eco.isMember("new-node")).toBe(true);
    expect(eco.isNode("new-node")).toBe(true);
  });
});

describe("Crystal Growth reuses AF-035's exact hazard-zone engine (AF-048 §Special Mechanics: Crystal Growth)", () => {
  it("createCrystalGrowth produces a real HazardZoneDef ticking through stepHazardZone", () => {
    const zone = createCrystalGrowth("growth-1", 4, 4);
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(zone, state, CRYSTAL_GROWTH_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(zone, state, 1)).toBe(true);
  });

  it("growCrystalZone grows the zone's radius over time, capped at maxRadius, without mutating the input", () => {
    let zone = createCrystalGrowth("growth-2", 0, 0);
    const initialRadius = zone.radius;
    zone = growCrystalZone(zone, 1);
    expect(zone.radius).toBeGreaterThan(initialRadius);
    for (let i = 0; i < 1000; i += 1) zone = growCrystalZone(zone, 10);
    expect(zone.radius).toBe(CRYSTAL_GROWTH_TUNING.maxRadius);
  });
});

describe("Codex — the resonance archive entry (AF-048 §Codex)", () => {
  it("adds an additive Codex entry gated on the resonance-archive lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-crystal-resonance");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_CRYSTAL_RESONANCE_ARCHIVE" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Crystals — self-review: thousands of encounters stay consistent (AF-048 §Self Review Loop)", () => {
  it("survives 1,000 randomised ecosystem encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4048);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["drone", "hunter", "node1", "node2", "guardian"];
      const nodeIds = ["node1", "node2"];
      const eco = new CrystalResonanceRuntime(`eco-${encounter}`, memberIds, nodeIds);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        const role = eco.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(eco.resonanceStrength).toBeLessThanOrEqual(RESONANCE_TUNING.maxResonanceStrength);
        expect(eco.resonanceStrength).toBeGreaterThanOrEqual(0);
      }
      expect(eco.eliminated).toBe(true);
      expect(eco.resonanceStrength).toBe(0);
    }
  });
});
