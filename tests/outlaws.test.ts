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
import {
  COMMAND_ORDERS,
  OUTLAW_CALLSIGNS,
  OUTLAW_ELITE_PERKS,
  OUTLAW_ENEMIES,
  OUTLAW_MINE_TUNING,
  OUTLAW_MINI_BOSS_KINDS,
  OUTLAW_SPECIAL_MECHANICS,
  OUTLAW_TACTICS,
  OUTLAW_UNIT_KINDS,
  createOutlawMine,
} from "../src/game/enemies/outlawData";
import { OutlawSquadRuntime } from "../src/game/enemies/OutlawSquad";
import { isInsideHazard, stepHazardZone, type HazardZoneState } from "../src/game/bosses/BossArena";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

describe("Outlaw vocabulary — registered shelves (AF-046 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers fourteen Core Unit kinds, eight tactics, eight special mechanics, six command orders, six mini-boss kinds, seven elite perks", () => {
    expect(OUTLAW_UNIT_KINDS.length).toBe(14);
    expect(OUTLAW_TACTICS.length).toBe(8);
    expect(OUTLAW_SPECIAL_MECHANICS.length).toBe(8);
    expect(COMMAND_ORDERS.length).toBe(6);
    expect(OUTLAW_MINI_BOSS_KINDS.length).toBe(6);
    expect(OUTLAW_ELITE_PERKS.length).toBe(7);
    expect(OUTLAW_CALLSIGNS.length).toBeGreaterThan(0);
  });
});

describe("Outlaw units are plain AF-033 EnemyDefs — zero schema changes (AF-046 §Core Units)", () => {
  it("every outlaw def uses only registered AF-033 vocabulary", () => {
    for (const def of OUTLAW_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no outlaw def overlaps any existing enemy or another outlaw (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES];
    for (const def of OUTLAW_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged outlaw attack is a real weapon with a readable telegraph (AF-046 §Accessibility)", () => {
    for (const def of OUTLAW_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Mercenary Guild");
      }
    }
  });

  it("the Raider's missile barrage is a seeking burst — Missile Swarms as weapon data, not a new engine", () => {
    const raider = OUTLAW_ENEMIES.find((d) => d.id === "outlaw-raider")!;
    expect(raider.attack.mechanism.kind).toBe("ranged");
    if (raider.attack.mechanism.kind === "ranged") {
      expect(raider.attack.mechanism.weapon.firePattern).toBe("burst");
      expect(raider.attack.mechanism.weapon.projectilesPerShot).toBeGreaterThan(1);
      expect(raider.attack.mechanism.weapon.projectileBehaviour).toBe("seeking");
    }
  });

  it("an Outlaw Captain runs through AF-034's Elite pipeline unchanged", () => {
    const captain = OUTLAW_ENEMIES.find((d) => d.id === "outlaw-captain")!;
    const elite = generateElite(captain, "champion", new Rng(7));
    expect(elite.def.hull).toBeGreaterThan(captain.hull);
    expect(elite.tier).toBe("champion");
    expect(elite.mutations.length).toBeGreaterThan(0);
  });
});

describe("OutlawSquadRuntime — Command Structure (AF-046 §Command Structure)", () => {
  function makeSquad(): OutlawSquadRuntime {
    return new OutlawSquadRuntime("squad-1", "captain", ["m1", "m2", "m3", "m4"], 1500, 4000);
  }

  it("forms up, then becomes coordinated once the form-up window elapses", () => {
    const squad = makeSquad();
    expect(squad.state).toBe("forming");
    expect(squad.commandActive).toBe(false);
    squad.update(1500);
    expect(squad.state).toBe("coordinated");
    expect(squad.commandActive).toBe(true);
    expect(squad.currentOrder).toBe("attackOrders");
  });

  it("destroying the Captain scatters the squad and issues retreat orders", () => {
    const squad = makeSquad();
    squad.update(1500);
    expect(squad.notifyDroneDestroyed("captain")).toBe("captain");
    expect(squad.state).toBe("scattered");
    expect(squad.commandActive).toBe(false);
    expect(squad.scatterActive).toBe(true);
    expect(squad.currentOrder).toBe("retreatOrders");
  });

  it("scatter orders expire after the scatter window — survivors re-engage", () => {
    const squad = makeSquad();
    squad.update(1500);
    squad.notifyDroneDestroyed("captain");
    squad.update(4000);
    expect(squad.scatterActive).toBe(false);
    expect(squad.state).toBe("scattered"); // still leaderless, just no longer holding retreat
  });

  it("destroying members never breaks coordination while the Captain lives", () => {
    const squad = makeSquad();
    squad.update(1500);
    expect(squad.notifyDroneDestroyed("m1")).toBe("member");
    expect(squad.notifyDroneDestroyed("m2")).toBe("member");
    expect(squad.commandActive).toBe(true);
  });

  it("the squad is eliminated once the Captain and every member are destroyed", () => {
    const squad = makeSquad();
    squad.update(1500);
    for (const id of ["m1", "m2", "m3", "m4"]) squad.notifyDroneDestroyed(id);
    squad.notifyDroneDestroyed("captain");
    expect(squad.state).toBe("eliminated");
  });

  it("assigns each member a unique wedge Formation Flying offset", () => {
    const squad = makeSquad();
    const seen = new Set<string>();
    for (const id of ["m1", "m2", "m3", "m4"]) {
      const offset = squad.offsetFor(id);
      expect(offset).not.toBeNull();
      const key = `${offset!.x},${offset!.y}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    expect(squad.offsetFor("captain")).toBeNull(); // the Captain IS the anchor
  });

  it("an unknown drone id is a safe no-op", () => {
    const squad = makeSquad();
    expect(squad.notifyDroneDestroyed("someone-else")).toBeNull();
  });
});

describe("Deployable Mines reuse AF-035's exact hazard engine (AF-046 §Special Mechanics)", () => {
  it("a mine is a valid HazardZoneDef driven by the real stepHazardZone/isInsideHazard", () => {
    const mine = createOutlawMine("mine-1", 10, 10);
    const state: HazardZoneState = { tickClockMs: 0 };
    expect(isInsideHazard(mine, 10.5, 10.5)).toBe(true);
    expect(isInsideHazard(mine, 20, 20)).toBe(false);
    let ticks = 0;
    for (let i = 0; i < 10; i += 1) {
      if (stepHazardZone(mine, state, OUTLAW_MINE_TUNING.tickIntervalMs / 2)) ticks += 1;
    }
    expect(ticks).toBe(5); // exactly one tick per full interval
    expect(mine.damagePerTick).toBe(OUTLAW_MINE_TUNING.damagePerTick);
  });
});

describe("Faction Synergy — the Mercenary Guild profile and Codex entry (AF-046 §Faction Identity / §Codex)", () => {
  it("profiles AF-039's registered mercenaryGuild faction — the fourth full profile, not an eleventh faction", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    const guild = runtime.findFaction("mercenaryGuild");
    expect(guild).not.toBeNull();
    expect(guild!.uniqueUnits).toContain("outlaw-captain");
    expect(guild!.loreId).toBe("LORE_MERCENARY_GUILD_CODEX");
  });

  it("adds a Codex faction entry gated on the captain-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-mercenary-guild");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_MERCENARY_GUILD_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Outlaws — self-review: thousands of encounters stay consistent (AF-046 §Self Review Loop)", () => {
  it("survives 1,000 randomised squad encounters without ever reaching an invalid state", () => {
    const rng = new Rng(2046);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["m1", "m2", "m3", "m4"];
      const squad = new OutlawSquadRuntime(`squad-${encounter}`, "captain", memberIds, 1500, 4000);
      const killOrder = [...memberIds, "captain"];
      // Fisher–Yates via the project Rng — a different kill order every encounter.
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      squad.update(rng.int(0, 3000));
      let captainFell = false;
      for (const id of killOrder) {
        const role = squad.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        if (role === "captain") captainFell = true;
        if (captainFell) expect(squad.commandActive).toBe(false);
        squad.update(rng.int(0, 2000));
        expect(["forming", "coordinated", "scattered", "eliminated"]).toContain(squad.state);
      }
      expect(squad.state).toBe("eliminated");
    }
  });
});
