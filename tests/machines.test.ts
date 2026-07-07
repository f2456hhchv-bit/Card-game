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
import {
  ADAPTIVE_AI_INPUTS,
  MACHINE_ADAPTATION_TUNING,
  MACHINE_COMBAT_STYLES,
  MACHINE_ELITE_GAINS,
  MACHINE_ENEMIES,
  MACHINE_MINI_BOSS_KINDS,
  MACHINE_NETWORK_TUNING,
  MACHINE_SPECIAL_MECHANICS,
  MACHINE_UNIT_KINDS,
  NETWORK_COMMANDS,
} from "../src/game/enemies/machineData";
import { MachineNetworkRuntime } from "../src/game/enemies/MachineNetwork";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeNetwork(): MachineNetworkRuntime {
  return new MachineNetworkRuntime("net-1", "core", ["drone", "sniper", "shieldgen", "repair", "factory"], "shieldgen", "repair", "factory");
}

describe("Machine vocabulary — registered shelves (AF-047 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers fourteen unit kinds, eight combat styles, eight special mechanics, seven adaptive-AI inputs, six network commands, six mini-boss kinds, seven elite gains", () => {
    expect(MACHINE_UNIT_KINDS.length).toBe(14);
    expect(MACHINE_COMBAT_STYLES.length).toBe(8);
    expect(MACHINE_SPECIAL_MECHANICS.length).toBe(8);
    expect(ADAPTIVE_AI_INPUTS.length).toBe(7);
    expect(NETWORK_COMMANDS.length).toBe(6);
    expect(MACHINE_MINI_BOSS_KINDS.length).toBe(6);
    expect(MACHINE_ELITE_GAINS.length).toBe(7);
  });
});

describe("Machine units are plain AF-033 EnemyDefs — zero schema changes (AF-047 §Core Units)", () => {
  it("every machine def uses only registered AF-033 vocabulary", () => {
    for (const def of MACHINE_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no machine def overlaps any existing enemy, outlaw, or another machine (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES];
    for (const def of MACHINE_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged machine attack is a real Machine Collective weapon with a readable telegraph", () => {
    for (const def of MACHINE_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Machine Collective");
      }
    }
  });

  it("gives AF-033's dormant healAllies and spawnReinforcements ability kinds their first producers", () => {
    const repair = MACHINE_ENEMIES.find((d) => d.id === "machine-repair-drone")!;
    const constructor_ = MACHINE_ENEMIES.find((d) => d.id === "machine-swarm-constructor")!;
    expect(repair.specialAbility?.kind).toBe("healAllies");
    expect(constructor_.specialAbility?.kind).toBe("spawnReinforcements");
  });

  it("a Command Core runs through AF-034's Elite pipeline unchanged", () => {
    const core = MACHINE_ENEMIES.find((d) => d.id === "machine-command-core")!;
    const elite = generateElite(core, "prime", new Rng(11));
    expect(elite.def.hull).toBeGreaterThan(core.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("MachineNetworkRuntime — Network Command (AF-047 §Network Command)", () => {
  it("starts linked with every network function online", () => {
    const network = makeNetwork();
    expect(network.state).toBe("linked");
    expect(network.targetSyncActive).toBe(true);
    expect(network.shieldNetworkUp).toBe(true);
    expect(network.repairUp).toBe(true);
    expect(network.factoryUp).toBe(true);
    expect(network.currentCommand).toBe("firePriority");
  });

  it("destroying the Command Core DEGRADES the network — machines keep fighting, coordination stops", () => {
    const network = makeNetwork();
    expect(network.notifyDroneDestroyed("core")).toBe("core");
    expect(network.state).toBe("degraded");
    expect(network.targetSyncActive).toBe(false);
    expect(network.shieldNetworkUp).toBe(false);
    expect(network.repairUp).toBe(false);
    expect(network.factoryUp).toBe(false);
    expect(network.targetSyncDamageBonus).toBe(0);
  });

  it("destroying the Shield Generator alone drops only the shield lattice", () => {
    const network = makeNetwork();
    network.notifyDroneDestroyed("shieldgen");
    expect(network.state).toBe("linked");
    expect(network.shieldNetworkUp).toBe(false);
    expect(network.repairUp).toBe(true);
    expect(network.factoryUp).toBe(true);
  });

  it("is eliminated once the Core and every member are destroyed", () => {
    const network = makeNetwork();
    for (const id of ["drone", "sniper", "shieldgen", "repair", "factory"]) network.notifyDroneDestroyed(id);
    network.notifyDroneDestroyed("core");
    expect(network.state).toBe("eliminated");
  });

  it("the Drone Factory fires once per interval and respects its lifetime spawn cap", () => {
    const network = makeNetwork();
    expect(network.tryConstructDrone()).toBe(false); // clock not elapsed
    let built = 0;
    for (let i = 0; i < 20; i += 1) {
      network.update(MACHINE_NETWORK_TUNING.factoryIntervalMs);
      if (network.tryConstructDrone()) built += 1;
    }
    expect(built).toBe(MACHINE_NETWORK_TUNING.maxFactorySpawnsPerNetwork);
    expect(network.factoryUp).toBe(false); // cap reached
  });

  it("factory-built drones enrol as ordinary members and extend the elimination condition", () => {
    const network = makeNetwork();
    network.enrolMember("built-1");
    for (const id of ["drone", "sniper", "shieldgen", "repair", "factory"]) network.notifyDroneDestroyed(id);
    network.notifyDroneDestroyed("core");
    expect(network.state).toBe("degraded"); // built-1 still fighting
    network.notifyDroneDestroyed("built-1");
    expect(network.state).toBe("eliminated");
  });
});

describe("Adaptive AI — capped, fair, and analytical (AF-047 §Adaptive AI)", () => {
  it("builds resistance to the most-used damage school in steps", () => {
    const network = makeNetwork();
    expect(network.adaptedReduction("energy")).toBe(0);
    for (let i = 0; i < MACHINE_ADAPTATION_TUNING.hitsPerStep; i += 1) network.recordIncomingDamage("energy");
    expect(network.adaptedReduction("energy")).toBeCloseTo(MACHINE_ADAPTATION_TUNING.reductionPerStep, 5);
    expect(network.adaptedReduction("physical")).toBe(0); // per-school analysis
  });

  it("never exceeds the fairness cap no matter how much damage is recorded", () => {
    const network = makeNetwork();
    for (let i = 0; i < 10000; i += 1) network.recordIncomingDamage("physical");
    expect(network.adaptedReduction("physical")).toBe(MACHINE_ADAPTATION_TUNING.maxReduction);
  });

  it("adaptation and Shared Shields both collapse when the Core dies — degraded machines take full damage", () => {
    const network = makeNetwork();
    for (let i = 0; i < 1000; i += 1) network.recordIncomingDamage("physical");
    expect(network.incomingDamageFactor("physical")).toBeLessThan(MACHINE_NETWORK_TUNING.sharedShieldDamageFactor);
    network.notifyDroneDestroyed("core");
    expect(network.incomingDamageFactor("physical")).toBe(1);
  });

  it("incomingDamageFactor composes the shield lattice and the adapted school reduction", () => {
    const network = makeNetwork();
    expect(network.incomingDamageFactor("energy")).toBe(MACHINE_NETWORK_TUNING.sharedShieldDamageFactor);
    network.notifyDroneDestroyed("shieldgen");
    expect(network.incomingDamageFactor("energy")).toBe(1); // no lattice, no adaptation yet
  });
});

describe("Codex — the network doctrine entry (AF-047 §Codex)", () => {
  it("adds an additive Codex entry gated on the core-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-machine-network");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_MACHINE_NETWORK_DOCTRINE" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Machines — self-review: thousands of encounters stay consistent (AF-047 §Self Review Loop)", () => {
  it("survives 1,000 randomised network encounters without ever reaching an invalid state", () => {
    const rng = new Rng(2047);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["drone", "sniper", "shieldgen", "repair", "factory"];
      const network = new MachineNetworkRuntime(`net-${encounter}`, "core", memberIds, "shieldgen", "repair", "factory");
      const killOrder = [...memberIds, "core"];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      let coreFell = false;
      for (const id of killOrder) {
        network.recordIncomingDamage(rng.next() < 0.5 ? "physical" : "energy");
        const role = network.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        if (role === "core") coreFell = true;
        if (coreFell) {
          expect(network.targetSyncActive).toBe(false);
          expect(network.incomingDamageFactor("physical")).toBe(1);
        }
        expect(network.adaptedReduction("energy")).toBeLessThanOrEqual(MACHINE_ADAPTATION_TUNING.maxReduction);
        expect(["linked", "degraded", "eliminated"]).toContain(network.state);
      }
      expect(network.state).toBe("eliminated");
    }
  });
});
