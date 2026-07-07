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
import {
  ADAPTIVE_TECHNOLOGY_INPUTS,
  PARAGON_COMBAT_STYLES,
  PARAGON_ELITE_GAINS,
  PARAGON_ENEMIES,
  PARAGON_INSTABILITY_TUNING,
  PARAGON_MINI_BOSS_KINDS,
  PARAGON_SPECIAL_MECHANICS,
  PARAGON_UNIT_KINDS,
  SINGULARITY_CHARGE_TUNING,
  createSingularityCharge,
} from "../src/game/enemies/paragonData";
import { ParagonInstabilityRuntime } from "../src/game/enemies/ParagonInstability";
import { stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeProtocol(): ParagonInstabilityRuntime {
  return new ParagonInstabilityRuntime("protocol-1", ["drone", "pulse", "hunter", "sentinel", "construct"], ["sentinel"]);
}

describe("Paragon vocabulary — registered shelves (AF-053 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, seven adaptive-technology inputs, six mini-bosses, seven elite gains", () => {
    expect(PARAGON_UNIT_KINDS.length).toBe(13);
    expect(PARAGON_COMBAT_STYLES.length).toBe(8);
    expect(PARAGON_SPECIAL_MECHANICS.length).toBe(10);
    expect(ADAPTIVE_TECHNOLOGY_INPUTS.length).toBe(7);
    expect(PARAGON_MINI_BOSS_KINDS.length).toBe(6);
    expect(PARAGON_ELITE_GAINS.length).toBe(7);
  });
});

describe("Paragon units are plain AF-033 EnemyDefs — zero schema changes (AF-053 §Core Units)", () => {
  it("every paragon def uses only registered AF-033 vocabulary", () => {
    for (const def of PARAGON_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no paragon def overlaps any existing enemy across all eight factions (AF-033's no-overlap law)", () => {
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
    ];
    for (const def of PARAGON_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged paragon attack is a real Paragon Protocol weapon with a readable telegraph", () => {
    for (const def of PARAGON_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Paragon Protocol");
        expect(def.attack.mechanism.weapon.category).toBe("singularity");
      }
    }
  });

  it("gives AF-021's dormant overload status and AF-032's dormant gravity-affected projectile behaviour their first producers", () => {
    const pulse = PARAGON_ENEMIES.find((d) => d.id === "pulse-cannon")!;
    const omega = PARAGON_ENEMIES.find((d) => d.id === "omega-prototype")!;
    expect(pulse.attack.mechanism.kind === "ranged" && pulse.attack.mechanism.weapon.statusOnHit?.kind).toBe("overload");
    expect(omega.attack.mechanism.kind === "ranged" && omega.attack.mechanism.weapon.projectileBehaviour).toBe("gravityAffected");
  });

  it("an Omega Prototype runs through AF-034's Elite pipeline unchanged", () => {
    const omega = PARAGON_ENEMIES.find((d) => d.id === "omega-prototype")!;
    const elite = generateElite(omega, "prime", new Rng(41));
    expect(elite.def.hull).toBeGreaterThan(omega.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("ParagonInstabilityRuntime — one irreversible threshold event, the mirror of every prior doctrine (AF-053 §Containment System)", () => {
  it("starts at full stability, uncollapsed", () => {
    const protocol = makeProtocol();
    expect(protocol.stabilityLevel).toBe(PARAGON_INSTABILITY_TUNING.maxStability);
    expect(protocol.isCollapsed).toBe(false);
  });

  it("stability decays passively even with no damage taken, offset by the Sentinel's repair", () => {
    const withSentinel = makeProtocol();
    const withoutSentinel = new ParagonInstabilityRuntime("protocol-2", ["drone", "pulse", "hunter", "construct"], []);
    withSentinel.update(1000);
    withoutSentinel.update(1000);
    expect(withoutSentinel.stabilityLevel).toBeLessThan(withSentinel.stabilityLevel);
  });

  it("incoming damage cracks stability further, the Adaptive Technology live input", () => {
    const protocol = makeProtocol();
    const before = protocol.stabilityLevel;
    protocol.recordIncomingDamage(50);
    expect(protocol.stabilityLevel).toBeLessThan(before);
  });

  it("Containment Collapse fires exactly once when stability reaches zero, and never recovers afterward", () => {
    const protocol = makeProtocol();
    protocol.notifyDroneDestroyed("sentinel"); // remove repair so damage alone can force collapse
    expect(protocol.consumeCollapseEvent()).toBe(false);
    protocol.recordIncomingDamage(1000);
    expect(protocol.isCollapsed).toBe(true);
    expect(protocol.stabilityLevel).toBe(0);
    expect(protocol.consumeCollapseEvent()).toBe(true); // fires once
    expect(protocol.consumeCollapseEvent()).toBe(false); // never again
    protocol.recordIncomingDamage(1000); // further damage does nothing once collapsed
    expect(protocol.stabilityLevel).toBe(0);
  });

  it("Adaptive Shields degrade toward zero as stability falls, and vanish entirely post-collapse", () => {
    const protocol = makeProtocol();
    const fullShield = protocol.incomingDamageReduction;
    expect(fullShield).toBeCloseTo(PARAGON_INSTABILITY_TUNING.preCollapseShieldReductionAtFullStability, 5);
    protocol.notifyDroneDestroyed("sentinel");
    protocol.recordIncomingDamage(1000);
    expect(protocol.incomingDamageReduction).toBe(0);
  });

  it("Energy Overload and Unstable Reactors are zero pre-collapse and only ever apply post-collapse", () => {
    const protocol = makeProtocol();
    expect(protocol.damageBonus).toBe(0);
    expect(protocol.speedBonus).toBe(0);
    protocol.notifyDroneDestroyed("sentinel");
    protocol.recordIncomingDamage(1000);
    expect(protocol.damageBonus).toBe(PARAGON_INSTABILITY_TUNING.postCollapseDamageBonus);
    expect(protocol.speedBonus).toBe(PARAGON_INSTABILITY_TUNING.postCollapseSpeedBonus);
  });

  it("destroying the Sentinel removes future repair without touching stability's current value", () => {
    const protocol = makeProtocol();
    for (let i = 0; i < 50; i += 1) protocol.update(1000);
    const before = protocol.stabilityLevel;
    expect(protocol.notifyDroneDestroyed("sentinel")).toBe("sentinel");
    expect(protocol.stabilityLevel).toBe(before);
  });

  it("destroying a non-sentinel member does not affect stability or repair", () => {
    const protocol = makeProtocol();
    expect(protocol.notifyDroneDestroyed("drone")).toBe("member");
    expect(protocol.stabilityLevel).toBe(PARAGON_INSTABILITY_TUNING.maxStability);
  });

  it("is eliminated once every member is destroyed", () => {
    const protocol = makeProtocol();
    for (const id of ["drone", "pulse", "hunter", "sentinel", "construct"]) protocol.notifyDroneDestroyed(id);
    expect(protocol.eliminated).toBe(true);
  });
});

describe("Singularity Charges reuse AF-035's exact hazard-zone engine (AF-053 §Special Mechanics: Singularity Charges)", () => {
  it("createSingularityCharge produces a real HazardZoneDef ticking through stepHazardZone, the fifth faction to reuse the engine", () => {
    const charge = createSingularityCharge("charge-1", 4, 4);
    expect(charge.radius).toBe(SINGULARITY_CHARGE_TUNING.radius);
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(stepHazardZone(charge, state, SINGULARITY_CHARGE_TUNING.tickIntervalMs - 1)).toBe(false);
    expect(stepHazardZone(charge, state, 1)).toBe(true);
  });
});

describe("Codex — the Paragon Protocol doctrine entry (AF-053 §Codex)", () => {
  it("adds an additive Codex entry gated on the Sentinel-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-paragon-protocol");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_PARAGON_PROTOCOL_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Paragon Protocol — self-review: thousands of encounters stay consistent (AF-053 §Self Review Loop)", () => {
  it("survives 1,000 randomised protocol encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4053);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["drone", "pulse", "hunter", "sentinel", "construct"];
      const protocol = new ParagonInstabilityRuntime(`protocol-${encounter}`, memberIds, ["sentinel"]);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      let collapseSeen = false;
      for (const id of killOrder) {
        protocol.update(rng.int(0, 2000));
        protocol.recordIncomingDamage(rng.int(0, 40));
        if (protocol.consumeCollapseEvent()) collapseSeen = true;
        const role = protocol.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(protocol.stabilityLevel).toBeLessThanOrEqual(PARAGON_INSTABILITY_TUNING.maxStability);
        expect(protocol.stabilityLevel).toBeGreaterThanOrEqual(0);
        if (collapseSeen) {
          expect(protocol.isCollapsed).toBe(true);
          expect(protocol.incomingDamageReduction).toBe(0);
        }
      }
      expect(protocol.eliminated).toBe(true);
    }
  });
});
