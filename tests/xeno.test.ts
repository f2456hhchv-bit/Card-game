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
import {
  ACID_POOL_TUNING,
  BIOLOGICAL_TERRAIN_KINDS,
  EVOLUTION_STAGES,
  HIVE_EVOLUTION_TUNING,
  HIVE_NETWORK_TRAITS,
  XENO_COMBAT_STYLES,
  XENO_ELITE_GAINS,
  XENO_ENEMIES,
  XENO_MINI_BOSS_KINDS,
  XENO_SPECIAL_MECHANICS,
  XENO_UNIT_KINDS,
  createAcidPool,
} from "../src/game/enemies/xenoData";
import { HiveEvolutionRuntime } from "../src/game/enemies/HiveEvolution";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeHive(): HiveEvolutionRuntime {
  return new HiveEvolutionRuntime("hive-1", ["drone", "spitter", "stalker", "node", "crusher"], ["node"]);
}

describe("Xeno vocabulary — registered shelves (AF-051 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers fourteen unit kinds, eight combat styles, ten special mechanics, six network traits, seven terrain kinds, six mini-bosses, seven elite gains, five evolution stages", () => {
    expect(XENO_UNIT_KINDS.length).toBe(14);
    expect(XENO_COMBAT_STYLES.length).toBe(8);
    expect(XENO_SPECIAL_MECHANICS.length).toBe(10);
    expect(HIVE_NETWORK_TRAITS.length).toBe(6);
    expect(BIOLOGICAL_TERRAIN_KINDS.length).toBe(7);
    expect(XENO_MINI_BOSS_KINDS.length).toBe(6);
    expect(XENO_ELITE_GAINS.length).toBe(7);
    expect(EVOLUTION_STAGES.length).toBe(5);
  });
});

describe("Xenomorph units are plain AF-033 EnemyDefs — zero schema changes (AF-051 §Core Units)", () => {
  it("every xeno def uses only registered AF-033 vocabulary", () => {
    for (const def of XENO_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no xeno def overlaps any existing enemy across all six factions (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES, ...VOID_ENEMIES, ...ANCIENT_ENEMIES, ...XENO_ENEMIES];
    for (const def of XENO_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every xeno def uses the dormant swarm family — first use since AF-033 registered it", () => {
    for (const def of XENO_ENEMIES) expect(def.family).toBe("swarm");
  });

  it("every ranged xeno attack is a real Xenomorph Hive weapon with a readable telegraph", () => {
    for (const def of XENO_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Xenomorph Hive");
      }
    }
  });

  it("gives AF-021's dormant poison status its first producer", () => {
    const spitter = XENO_ENEMIES.find((d) => d.id === "spitter")!;
    expect(spitter.attack.mechanism.kind === "ranged" && spitter.attack.mechanism.weapon.statusOnHit?.kind).toBe("poison");
  });

  it("Hive Drone and Stalker are the first EnemyDefs to use burrow and wallCrawling movement", () => {
    const drone = XENO_ENEMIES.find((d) => d.id === "hive-drone")!;
    const stalker = XENO_ENEMIES.find((d) => d.id === "stalker")!;
    expect(drone.movementBehaviour).toBe("burrow");
    expect(stalker.movementBehaviour).toBe("wallCrawling");
    const priorRosters = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES, ...VOID_ENEMIES, ...ANCIENT_ENEMIES];
    for (const def of priorRosters) {
      expect(def.movementBehaviour).not.toBe("burrow");
      expect(def.movementBehaviour).not.toBe("wallCrawling");
    }
  });

  it("a Living Titan runs through AF-034's Elite pipeline unchanged", () => {
    const titan = XENO_ENEMIES.find((d) => d.id === "living-titan")!;
    const elite = generateElite(titan, "prime", new Rng(29));
    expect(elite.def.hull).toBeGreaterThan(titan.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("HiveEvolutionRuntime — Biomass only ever grows, the mirror of every prior doctrine (AF-051 §Evolution System)", () => {
  it("starts at baseline with zero biomass", () => {
    const hive = makeHive();
    expect(hive.stage).toBe("baseline");
    expect(hive.biomassLevel).toBe(0);
  });

  it("biomass climbs from encounter duration alone, even with no deaths", () => {
    const hive = makeHive();
    hive.update(1000);
    expect(hive.biomassLevel).toBeCloseTo(HIVE_EVOLUTION_TUNING.biomassPerSecond, 5);
  });

  it("every death feeds biomass, including the Hive's own — never wastes biomass", () => {
    const hive = makeHive();
    const before = hive.biomassLevel;
    expect(hive.notifyDroneDestroyed("drone")).toBe("member");
    expect(hive.biomassLevel).toBeGreaterThan(before);
  });

  it("biomass never decreases — no timer, no count, no disengagement undoes it", () => {
    const hive = makeHive();
    for (let i = 0; i < 50; i += 1) {
      const before = hive.biomassLevel;
      hive.update(500);
      if (i % 5 === 0) hive.notifyDroneDestroyed(`ghost-${i}`); // no-op kills (not real members) never lower it either
      expect(hive.biomassLevel).toBeGreaterThanOrEqual(before);
    }
  });

  it("never exceeds maxBiomass no matter how long the encounter runs or how many deaths occur", () => {
    const hive = makeHive();
    for (let i = 0; i < 100000; i += 1) {
      hive.update(1000);
      hive.notifyDroneDestroyed(`filler-${i}`);
    }
    expect(hive.biomassLevel).toBeLessThanOrEqual(HIVE_EVOLUTION_TUNING.maxBiomass);
  });

  it("destroying the Hive Node severs the network link immediately but does not touch biomass", () => {
    const hive = makeHive();
    for (let i = 0; i < 50; i += 1) hive.update(1000);
    const before = hive.biomassLevel;
    expect(hive.notifyDroneDestroyed("node")).toBe("node");
    expect(hive.nodeLinked).toBe(false);
    expect(hive.biomassLevel).toBeGreaterThanOrEqual(before); // it only ever grows, even on this kill
  });

  it("healing, damage bonus, and speed bonus all drop to zero the instant the link is severed", () => {
    const hive = makeHive();
    for (let i = 0; i < 5000; i += 1) hive.update(100);
    expect(hive.healPerSecond).toBeGreaterThan(0);
    hive.notifyDroneDestroyed("node");
    expect(hive.healPerSecond).toBe(0);
    expect(hive.damageBonus).toBe(0);
    expect(hive.speedBonus).toBe(0);
  });

  it("destroying a non-node member does not sever the link", () => {
    const hive = makeHive();
    expect(hive.notifyDroneDestroyed("drone")).toBe("member");
    expect(hive.nodeLinked).toBe(true);
  });

  it("Rapid Reinforcement only fires once evolved enough and linked, respecting cadence and lifetime cap", () => {
    const hive = makeHive();
    expect(hive.tryReinforce()).toBe(false); // not evolved yet
    for (let i = 0; i < 5000; i += 1) hive.update(100); // climb well past "evolved"
    let called = 0;
    for (let i = 0; i < 30; i += 1) {
      hive.update(HIVE_EVOLUTION_TUNING.reinforceIntervalMs);
      if (hive.tryReinforce()) called += 1;
    }
    expect(called).toBe(HIVE_EVOLUTION_TUNING.maxReinforcements);
  });

  it("is eliminated once every member is destroyed", () => {
    const hive = makeHive();
    for (const id of ["drone", "spitter", "stalker", "node", "crusher"]) hive.notifyDroneDestroyed(id);
    expect(hive.eliminated).toBe(true);
  });
});

describe("Acid Pools reuse AF-035's exact hazard-zone engine (AF-051 §Biological Terrain / §Special Mechanics)", () => {
  it("createAcidPool produces a real HazardZoneDef ticking through stepHazardZone, carrying the poison status", () => {
    const pool = createAcidPool("pool-1", 4, 4);
    expect(pool.statusOnTick?.kind).toBe("poison");
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(pool, state, ACID_POOL_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(pool, state, 1)).toBe(true);
  });
});

describe("Codex — the Hive evolution doctrine entry (AF-051 §Codex)", () => {
  it("adds an additive Codex entry gated on the Node-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-xenomorph-hive");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_XENOMORPH_HIVE_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Xenomorph Hive — self-review: thousands of encounters stay consistent (AF-051 §Self Review Loop)", () => {
  it("survives 1,000 randomised hive encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4051);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["drone", "spitter", "stalker", "node", "crusher"];
      const hive = new HiveEvolutionRuntime(`hive-${encounter}`, memberIds, ["node"]);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      let lastBiomass = 0;
      for (const id of killOrder) {
        hive.update(rng.int(0, 2000));
        expect(hive.biomassLevel).toBeGreaterThanOrEqual(lastBiomass); // never decreases
        lastBiomass = hive.biomassLevel;
        const role = hive.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(hive.biomassLevel).toBeGreaterThanOrEqual(lastBiomass);
        lastBiomass = hive.biomassLevel;
        expect(hive.biomassLevel).toBeLessThanOrEqual(HIVE_EVOLUTION_TUNING.maxBiomass);
        expect(EVOLUTION_STAGES).toContain(hive.stage);
      }
      expect(hive.eliminated).toBe(true);
    }
  });
});
