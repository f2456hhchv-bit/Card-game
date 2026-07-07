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
import {
  REALITY_DISTORTION_ACTIONS,
  VOID_COMBAT_STYLES,
  VOID_CORRUPTION_TUNING,
  VOID_ELITE_GAINS,
  VOID_ENEMIES,
  VOID_MINI_BOSS_KINDS,
  VOID_NETWORK_TRAITS,
  VOID_SPECIAL_MECHANICS,
  VOID_UNIT_KINDS,
  VOID_ZONE_TUNING,
  createCorruptionZone,
} from "../src/game/enemies/voidData";
import { VoidCorruptionRuntime } from "../src/game/enemies/VoidCorruption";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeSwarm(): VoidCorruptionRuntime {
  return new VoidCorruptionRuntime("swarm-1", ["wisp", "parasite", "hunter", "beacon", "guardian"], ["beacon"]);
}

describe("Void vocabulary — registered shelves (AF-049 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, six network traits, seven distortion actions, six mini-bosses, seven elite gains", () => {
    expect(VOID_UNIT_KINDS.length).toBe(13);
    expect(VOID_COMBAT_STYLES.length).toBe(8);
    expect(VOID_SPECIAL_MECHANICS.length).toBe(10);
    expect(VOID_NETWORK_TRAITS.length).toBe(6);
    expect(REALITY_DISTORTION_ACTIONS.length).toBe(7);
    expect(VOID_MINI_BOSS_KINDS.length).toBe(6);
    expect(VOID_ELITE_GAINS.length).toBe(7);
  });
});

describe("Void units are plain AF-033 EnemyDefs — zero schema changes (AF-049 §Core Units)", () => {
  it("every void def uses only registered AF-033 vocabulary", () => {
    for (const def of VOID_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no void def overlaps any existing enemy, outlaw, machine, crystal, or another void entity (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES, ...VOID_ENEMIES];
    for (const def of VOID_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every void def uses the dormant voidEntity family — first use since AF-033 registered it", () => {
    for (const def of VOID_ENEMIES) expect(def.family).toBe("voidEntity");
  });

  it("every ranged void attack is a real Void Swarm weapon with a readable telegraph", () => {
    for (const def of VOID_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Void Swarm");
      }
    }
  });

  it("gives AF-033's dormant split, merge, and cloak ability kinds their first producers", () => {
    const parasite = VOID_ENEMIES.find((d) => d.id === "corruption-parasite")!;
    const guardian = VOID_ENEMIES.find((d) => d.id === "rift-guardian")!;
    const avatar = VOID_ENEMIES.find((d) => d.id === "ancient-void-avatar")!;
    expect(parasite.specialAbility?.kind).toBe("split");
    expect(guardian.specialAbility?.kind).toBe("merge");
    expect(avatar.specialAbility?.kind).toBe("cloak");
  });

  it("Shadow Hunter is the first EnemyDef to use the teleport movement behaviour", () => {
    const hunter = VOID_ENEMIES.find((d) => d.id === "shadow-hunter")!;
    expect(hunter.movementBehaviour).toBe("teleport");
    for (const def of [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES]) {
      expect(def.movementBehaviour).not.toBe("teleport");
    }
  });

  it("an Ancient Void Avatar runs through AF-034's Elite pipeline unchanged", () => {
    const avatar = VOID_ENEMIES.find((d) => d.id === "ancient-void-avatar")!;
    const elite = generateElite(avatar, "prime", new Rng(17));
    expect(elite.def.hull).toBeGreaterThan(avatar.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("VoidCorruptionRuntime — corruption climbs with time, not just a count (AF-049 §Corruption System)", () => {
  it("corruption climbs while Beacons live, proportional to live Beacon count", () => {
    const swarm = makeSwarm();
    expect(swarm.corruptionLevel).toBe(0);
    swarm.update(1000);
    expect(swarm.corruptionLevel).toBeCloseTo(VOID_CORRUPTION_TUNING.growthPerSecondPerBeacon, 5);
  });

  it("never exceeds the fairness cap no matter how long it is left unchecked", () => {
    const swarm = makeSwarm();
    for (let i = 0; i < 10000; i += 1) swarm.update(1000);
    expect(swarm.corruptionLevel).toBe(VOID_CORRUPTION_TUNING.maxCorruption);
  });

  it("destroying a Beacon immediately steps corruption down — not just a slower future climb", () => {
    const swarm = makeSwarm();
    for (let i = 0; i < 100; i += 1) swarm.update(1000);
    const before = swarm.corruptionLevel;
    expect(swarm.notifyDroneDestroyed("beacon")).toBe("beacon");
    expect(swarm.corruptionLevel).toBeLessThan(before);
  });

  it("decays once every Beacon is destroyed — contained, not instantly reset", () => {
    const swarm = makeSwarm();
    for (let i = 0; i < 100; i += 1) swarm.update(1000);
    swarm.notifyDroneDestroyed("beacon");
    const afterStep = swarm.corruptionLevel;
    swarm.update(1000);
    expect(swarm.corruptionLevel).toBeLessThan(afterStep);
    expect(swarm.corruptionLevel).toBeGreaterThanOrEqual(0);
  });

  it("destroying a non-beacon member does not change corruption level", () => {
    const swarm = makeSwarm();
    swarm.update(2000);
    const before = swarm.corruptionLevel;
    expect(swarm.notifyDroneDestroyed("wisp")).toBe("member");
    expect(swarm.corruptionLevel).toBe(before);
  });

  it("healing, damage bonus, and incoming-damage reduction all scale continuously with corruption", () => {
    const swarm = makeSwarm();
    swarm.update(3000);
    const ratio = swarm.corruptionLevel / VOID_CORRUPTION_TUNING.maxCorruption;
    expect(swarm.healPerSecond).toBeCloseTo(ratio * VOID_CORRUPTION_TUNING.healPerSecondAtFullCorruption, 5);
    expect(swarm.damageBonus).toBeCloseTo(ratio * VOID_CORRUPTION_TUNING.damageBonusAtFullCorruption, 5);
    expect(swarm.incomingDamageReduction).toBeCloseTo(ratio * VOID_CORRUPTION_TUNING.incomingDamageReductionAtFullCorruption, 5);
  });

  it("is eliminated once every member is destroyed", () => {
    const swarm = makeSwarm();
    for (const id of ["wisp", "parasite", "hunter", "beacon", "guardian"]) swarm.notifyDroneDestroyed(id);
    expect(swarm.eliminated).toBe(true);
  });
});

describe("Corruption Zones reuse AF-035's exact hazard-zone engine (AF-049 §Special Mechanics: Corruption Zones)", () => {
  it("createCorruptionZone produces a real HazardZoneDef ticking through stepHazardZone, carrying the corruption status", () => {
    const zone = createCorruptionZone("zone-1", 4, 4);
    expect(zone.statusOnTick?.kind).toBe("corruption");
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(zone, state, VOID_ZONE_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(zone, state, 1)).toBe(true);
  });
});

describe("Codex — the corruption archive entry (AF-049 §Codex)", () => {
  it("adds an additive Codex entry gated on the corruption-archive lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-void-corruption");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_VOID_CORRUPTION_ARCHIVE" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Void Swarm — self-review: thousands of encounters stay consistent (AF-049 §Self Review Loop)", () => {
  it("survives 1,000 randomised swarm encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4049);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["wisp", "parasite", "hunter", "beacon", "guardian"];
      const swarm = new VoidCorruptionRuntime(`swarm-${encounter}`, memberIds, ["beacon"]);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        swarm.update(rng.int(0, 2000));
        const role = swarm.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(swarm.corruptionLevel).toBeLessThanOrEqual(VOID_CORRUPTION_TUNING.maxCorruption);
        expect(swarm.corruptionLevel).toBeGreaterThanOrEqual(0);
      }
      swarm.update(20000); // let containment decay run out fully
      expect(swarm.eliminated).toBe(true);
      expect(swarm.corruptionLevel).toBe(0);
    }
  });
});
