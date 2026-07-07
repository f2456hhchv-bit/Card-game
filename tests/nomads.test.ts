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
import {
  FLEET_COORDINATION_ACTIONS,
  NOMAD_COMBAT_STYLES,
  NOMAD_ELITE_GAINS,
  NOMAD_ENEMIES,
  NOMAD_FLEET_TUNING,
  NOMAD_MINI_BOSS_KINDS,
  NOMAD_SPECIAL_MECHANICS,
  NOMAD_UNIT_KINDS,
} from "../src/game/enemies/nomadData";
import { NomadFleetRuntime } from "../src/game/enemies/NomadFleet";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";

function makeFleet(): NomadFleetRuntime {
  return new NomadFleetRuntime("fleet-1", ["skiff", "hunter", "escort1", "escort2", "gunship", "flagship"], "flagship", ["escort1", "escort2"]);
}

describe("Nomad vocabulary — registered shelves (AF-052 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers fourteen unit kinds, eight combat styles, ten special mechanics, six fleet-coordination actions, six mini-bosses, seven elite gains", () => {
    expect(NOMAD_UNIT_KINDS.length).toBe(14);
    expect(NOMAD_COMBAT_STYLES.length).toBe(8);
    expect(NOMAD_SPECIAL_MECHANICS.length).toBe(10);
    expect(FLEET_COORDINATION_ACTIONS.length).toBe(6);
    expect(NOMAD_MINI_BOSS_KINDS.length).toBe(6);
    expect(NOMAD_ELITE_GAINS.length).toBe(7);
  });
});

describe("Nomad units are plain AF-033 EnemyDefs — zero schema changes (AF-052 §Core Units)", () => {
  it("every nomad def uses only registered AF-033 vocabulary", () => {
    for (const def of NOMAD_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no nomad def overlaps any existing enemy across all seven factions (AF-033's no-overlap law)", () => {
    const all = [
      ...SANDBOX_ENEMIES,
      ...OUTLAW_ENEMIES,
      ...MACHINE_ENEMIES,
      ...CRYSTAL_ENEMIES,
      ...VOID_ENEMIES,
      ...ANCIENT_ENEMIES,
      ...XENO_ENEMIES,
      ...NOMAD_ENEMIES,
    ];
    for (const def of NOMAD_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged nomad attack is a real Stellar Nomads weapon with a readable telegraph", () => {
    for (const def of NOMAD_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Stellar Nomads");
      }
    }
  });

  it("gives AF-021's dormant stasis status and AF-032's dormant returning projectile behaviour their first producers", () => {
    const hunter = NOMAD_ENEMIES.find((d) => d.id === "hunter")!;
    expect(hunter.attack.mechanism.kind === "ranged" && hunter.attack.mechanism.weapon.statusOnHit?.kind).toBe("stasis");
    expect(hunter.attack.mechanism.kind === "ranged" && hunter.attack.mechanism.weapon.projectileBehaviour).toBe("returning");
  });

  it("a Nomad Flagship runs through AF-034's Elite pipeline unchanged", () => {
    const flagship = NOMAD_ENEMIES.find((d) => d.id === "nomad-flagship")!;
    const elite = generateElite(flagship, "prime", new Rng(37));
    expect(elite.def.hull).toBeGreaterThan(flagship.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("NomadFleetRuntime — an actively-spent economy, not a passive multiplier (AF-052 §Fleet Coordination)", () => {
  it("starts with zero scrap and a living Command Ship", () => {
    const fleet = makeFleet();
    expect(fleet.scrapLevel).toBe(0);
    expect(fleet.commandShipAlive).toBe(true);
  });

  it("scrap climbs from Salvage Recovery over time", () => {
    const fleet = makeFleet();
    fleet.update(1000);
    expect(fleet.scrapLevel).toBeCloseTo(NOMAD_FLEET_TUNING.scrapPerSecond, 5);
  });

  it("never exceeds maxScrap no matter how long the fleet salvages", () => {
    const fleet = makeFleet();
    for (let i = 0; i < 10000; i += 1) fleet.update(1000);
    expect(fleet.scrapLevel).toBeLessThanOrEqual(NOMAD_FLEET_TUNING.maxScrap);
  });

  it("destroying the Command Ship throttles future income but doesn't touch banked scrap", () => {
    const fleet = makeFleet();
    for (let i = 0; i < 5; i += 1) fleet.update(1000);
    const before = fleet.scrapLevel;
    expect(fleet.notifyDroneDestroyed("flagship")).toBe("commandShip");
    expect(fleet.scrapLevel).toBe(before); // untouched by the kill itself
    expect(fleet.commandShipAlive).toBe(false);
    const linkedGain = NOMAD_FLEET_TUNING.scrapPerSecond * 1;
    fleet.update(1000);
    const disruptedGain = fleet.scrapLevel - before;
    expect(disruptedGain).toBeLessThan(linkedGain);
    expect(disruptedGain).toBeGreaterThan(0); // disrupted, not erased
  });

  it("destroying an Escort Fighter is reported distinctly from a regular member", () => {
    const fleet = makeFleet();
    expect(fleet.notifyDroneDestroyed("escort1")).toBe("escort");
    expect(fleet.notifyDroneDestroyed("skiff")).toBe("member");
  });

  it("Escort Protection scales purely with living escort headcount, independent of scrap", () => {
    const fleet = makeFleet();
    for (let i = 0; i < 100; i += 1) fleet.update(1000); // scrap now high
    const before = fleet.escortDamageReduction;
    expect(fleet.notifyDroneDestroyed("escort1")).toBe("escort");
    expect(fleet.escortDamageReduction).toBeLessThan(before);
  });

  it("Target Priority scales continuously with scrap level", () => {
    const fleet = makeFleet();
    fleet.update(5000);
    const ratio = fleet.scrapLevel / NOMAD_FLEET_TUNING.maxScrap;
    expect(fleet.targetPriorityBonus).toBeCloseTo(ratio * NOMAD_FLEET_TUNING.targetPriorityBonusAtFullScrap, 5);
  });

  it("Deployable Turrets, Scrap Shields, and Emergency Repairs are gated on BOTH affordability and cooldown", () => {
    const fleet = makeFleet();
    expect(fleet.tryDeployTurret()).toBe(false); // no scrap yet, even with cooldown ready
    for (let i = 0; i < 30; i += 1) fleet.update(1000); // now well-funded
    expect(fleet.tryDeployTurret()).toBe(true);
    expect(fleet.tryDeployTurret()).toBe(false); // cooldown just reset
    expect(fleet.tryRaiseScrapShield()).toBe(true);
    expect(fleet.tryEmergencyRepair()).toBe(true);
  });

  it("is eliminated once every member is destroyed", () => {
    const fleet = makeFleet();
    for (const id of ["skiff", "hunter", "escort1", "escort2", "gunship", "flagship"]) fleet.notifyDroneDestroyed(id);
    expect(fleet.eliminated).toBe(true);
  });
});

describe("Faction profile — the seventh profiled faction (AF-052 §Faction Identity)", () => {
  it("Stellar Nomads is a full AF-039 FactionDef, paying off the registered-but-unprofiled FactionId", () => {
    const profile = SANDBOX_FACTION_ROSTER.factions.find((f) => f.id === "nomadFleet");
    expect(profile).toBeDefined();
    expect(profile!.loreId).toBe("LORE_NOMAD_FLEET_CODEX");
  });
});

describe("Codex — the Stellar Nomads faction entry (AF-052 §Codex)", () => {
  it("adds an additive Codex entry gated on the Command Ship lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-nomad-fleet");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_NOMAD_FLEET_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Stellar Nomads — self-review: thousands of encounters stay consistent (AF-052 §Self Review Loop)", () => {
  it("survives 1,000 randomised fleet encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4052);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["skiff", "hunter", "escort1", "escort2", "gunship", "flagship"];
      const fleet = new NomadFleetRuntime(`fleet-${encounter}`, memberIds, "flagship", ["escort1", "escort2"]);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        fleet.update(rng.int(0, 2000));
        const role = fleet.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(fleet.scrapLevel).toBeLessThanOrEqual(NOMAD_FLEET_TUNING.maxScrap);
        expect(fleet.scrapLevel).toBeGreaterThanOrEqual(0);
        expect(fleet.escortDamageReduction).toBeLessThanOrEqual(NOMAD_FLEET_TUNING.maxEscortDamageReduction);
      }
      expect(fleet.eliminated).toBe(true);
    }
  });
});
