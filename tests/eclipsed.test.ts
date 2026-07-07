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
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import {
  ECLIPSED_COMBAT_STYLES,
  ECLIPSED_CORRUPTION_STAGES,
  ECLIPSED_CORRUPTION_TUNING,
  ECLIPSED_ECHO_LINES,
  ECLIPSED_ELITE_GAINS,
  ECLIPSED_ENEMIES,
  ECLIPSED_MINI_BOSS_KINDS,
  ECLIPSED_SPECIAL_MECHANICS,
  ECLIPSED_UNIT_KINDS,
  MEMORY_ECHO_KINDS,
} from "../src/game/enemies/eclipsedData";
import { EclipsedCorruptionRuntime } from "../src/game/enemies/EclipsedCorruption";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function makeGroup(): EclipsedCorruptionRuntime {
  return new EclipsedCorruptionRuntime("eclipsed-1", ["scout", "pilot", "drone", "warden", "guardian", "champion"], "champion", "warden");
}

describe("Eclipsed vocabulary — registered shelves (AF-055 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, five corruption stages, five echo kinds, six echo lines, six mini-bosses, six elite gains", () => {
    expect(ECLIPSED_UNIT_KINDS.length).toBe(13);
    expect(ECLIPSED_COMBAT_STYLES.length).toBe(8);
    expect(ECLIPSED_SPECIAL_MECHANICS.length).toBe(10);
    expect(ECLIPSED_CORRUPTION_STAGES.length).toBe(5);
    expect(MEMORY_ECHO_KINDS.length).toBe(5);
    expect(ECLIPSED_ECHO_LINES.length).toBe(6);
    expect(ECLIPSED_MINI_BOSS_KINDS.length).toBe(6);
    expect(ECLIPSED_ELITE_GAINS.length).toBe(6);
  });
});

describe("Eclipsed units are plain AF-033 EnemyDefs — zero schema changes (AF-055 §Core Units)", () => {
  it("every eclipsed def uses only registered AF-033 vocabulary", () => {
    for (const def of ECLIPSED_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no eclipsed def overlaps any existing enemy across all ten factions (AF-033's no-overlap law)", () => {
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
      ...ECLIPSED_ENEMIES,
    ];
    for (const def of ECLIPSED_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged eclipsed attack is a real Eclipsed weapon with a readable telegraph", () => {
    for (const def of ECLIPSED_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("The Eclipsed");
      }
    }
  });

  it("Lost Scout is the first base EnemyDef to use the ambush movement behaviour", () => {
    const scout = ECLIPSED_ENEMIES.find((d) => d.id === "lost-scout")!;
    expect(scout.movementBehaviour).toBe("ambush");
    const priorRosters = [
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
    for (const def of priorRosters) expect(def.movementBehaviour).not.toBe("ambush");
  });

  it("Broken Pilot gives the teleport special-ability kind its first base-def producer (Unstable Warp Jumps)", () => {
    const pilot = ECLIPSED_ENEMIES.find((d) => d.id === "broken-pilot")!;
    expect(pilot.specialAbility?.kind).toBe("teleport");
    const priorRosters = [
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
    for (const def of priorRosters) expect(def.specialAbility?.kind).not.toBe("teleport");
  });

  it("an Eclipsed Champion runs through AF-034's Elite pipeline unchanged", () => {
    const champion = ECLIPSED_ENEMIES.find((d) => d.id === "eclipsed-champion")!;
    const elite = generateElite(champion, "prime", new Rng(47));
    expect(elite.def.hull).toBeGreaterThan(champion.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("EclipsedCorruptionRuntime — personal falls, never a squad value (AF-055 §Corruption Levels)", () => {
  it("members begin staggered along their falls — no two at the same point", () => {
    const group = makeGroup();
    expect(group.stageIndexFor("scout")).toBe(0); // clock 0
    expect(group.stageIndexFor("warden")).toBeGreaterThan(group.stageIndexFor("scout")); // clock 3 * stagger
    expect(group.stageFor("scout")).toBe("recentlyLost");
  });

  it("two members can be at different stages at the same instant — no single shared stage", () => {
    const group = makeGroup();
    group.update(ECLIPSED_CORRUPTION_TUNING.stageDurationMs * 2);
    const stages = new Set(["scout", "pilot", "drone", "warden", "guardian", "champion"].map((id) => group.stageIndexFor(id)));
    expect(stages.size).toBeGreaterThan(1);
  });

  it("each member's fall advances with time and never walks backward, capped at Irrecoverable", () => {
    const group = makeGroup();
    let last = group.stageIndexFor("scout");
    for (let i = 0; i < 100; i += 1) {
      group.update(2000);
      const current = group.stageIndexFor("scout");
      expect(current).toBeGreaterThanOrEqual(last);
      last = current;
    }
    expect(group.stageIndexFor("scout")).toBe(ECLIPSED_CORRUPTION_STAGES.length - 1);
    expect(group.stageFor("scout")).toBe("irrecoverable");
  });

  it("the Memory Warden slows every survivor's fall while it lives", () => {
    const withWarden = makeGroup();
    const without = new EclipsedCorruptionRuntime("eclipsed-2", ["scout", "pilot"], "pilot", null);
    withWarden.update(ECLIPSED_CORRUPTION_TUNING.stageDurationMs * 2);
    without.update(ECLIPSED_CORRUPTION_TUNING.stageDurationMs * 2);
    expect(withWarden.stageIndexFor("scout")).toBeLessThan(without.stageIndexFor("scout"));
  });

  it("grief is mechanical — every ally death jumps each survivor's own clock forward", () => {
    const group = makeGroup();
    group.notifyDroneDestroyed("warden"); // also removes the slow
    const before = group.stageIndexFor("scout");
    // three more deaths: 3 * griefJumpMs = 15000 ≈ nearly two stages of clock
    group.notifyDroneDestroyed("pilot");
    group.notifyDroneDestroyed("drone");
    group.notifyDroneDestroyed("guardian");
    expect(group.stageIndexFor("scout")).toBeGreaterThanOrEqual(before);
    const clockJump = 3 * ECLIPSED_CORRUPTION_TUNING.griefJumpMs;
    expect(clockJump).toBeGreaterThan(ECLIPSED_CORRUPTION_TUNING.stageDurationMs); // enough to move at least one stage
    expect(group.stageIndexFor("scout")).toBeGreaterThan(before);
  });

  it("Ability Mimicry scales with the player's progression and is hard-capped for fairness", () => {
    const group = makeGroup();
    expect(group.mimicryDamageBonus).toBe(0);
    group.recordPlayerLevel(5);
    expect(group.mimicryDamageBonus).toBeCloseTo(5 * ECLIPSED_CORRUPTION_TUNING.mimicryDamagePerPlayerLevel, 5);
    group.recordPlayerLevel(1000);
    expect(group.mimicryDamageBonus).toBe(ECLIPSED_CORRUPTION_TUNING.maxMimicryDamageBonus);
    group.recordPlayerLevel(1); // never regresses — the mirror keeps what it learned
    expect(group.mimicryDamageBonus).toBe(ECLIPSED_CORRUPTION_TUNING.maxMimicryDamageBonus);
  });

  it("per-member damage combines its own stage with the shared mirror; dead members contribute nothing", () => {
    const group = makeGroup();
    group.recordPlayerLevel(5);
    const wardenBonus = group.damageBonusFor("warden");
    const scoutBonus = group.damageBonusFor("scout");
    expect(wardenBonus).toBeGreaterThan(scoutBonus); // further along its fall, same mirror
    group.notifyDroneDestroyed("scout");
    expect(group.damageBonusFor("scout")).toBe(0);
  });

  it("Memory Echoes fire on a cadence, cycle deterministically, and respect the lifetime cap", () => {
    const group = makeGroup();
    expect(group.consumeEchoEvent()).toBeNull(); // cadence not yet elapsed
    const seen: string[] = [];
    for (let i = 0; i < 20; i += 1) {
      group.update(ECLIPSED_CORRUPTION_TUNING.echoIntervalMs);
      const line = group.consumeEchoEvent();
      if (line) seen.push(line);
      expect(group.consumeEchoEvent()).toBeNull(); // never twice per cadence
    }
    expect(seen.length).toBe(ECLIPSED_CORRUPTION_TUNING.maxEchoesPerEncounter);
    expect(seen[0]).toBe(ECLIPSED_ECHO_LINES[0]);
    expect(seen[1]).toBe(ECLIPSED_ECHO_LINES[1]); // deterministic cycle, never randomised
  });

  it("is eliminated once every member is destroyed", () => {
    const group = makeGroup();
    for (const id of ["scout", "pilot", "drone", "warden", "guardian", "champion"]) group.notifyDroneDestroyed(id);
    expect(group.eliminated).toBe(true);
  });
});

describe("Codex — the Eclipsed entry (AF-055 §Codex)", () => {
  it("adds an additive Codex entry gated on the Champion-kill lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-eclipsed");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_ECLIPSED_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("The Eclipsed — self-review: thousands of encounters stay consistent (AF-055 §Self Review Loop)", () => {
  it("survives 1,000 randomised encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4055);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["scout", "pilot", "drone", "warden", "guardian", "champion"];
      const group = new EclipsedCorruptionRuntime(`eclipsed-${encounter}`, memberIds, "champion", "warden");
      group.recordPlayerLevel(rng.int(0, 30));
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        group.update(rng.int(0, 4000));
        group.consumeEchoEvent();
        const role = group.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        for (const remaining of memberIds) {
          const stage = group.stageIndexFor(remaining);
          expect(stage).toBeGreaterThanOrEqual(0);
          expect(stage).toBeLessThanOrEqual(ECLIPSED_CORRUPTION_STAGES.length - 1);
        }
        expect(group.mimicryDamageBonus).toBeLessThanOrEqual(ECLIPSED_CORRUPTION_TUNING.maxMimicryDamageBonus);
      }
      expect(group.eliminated).toBe(true);
      expect(group.echoesEmitted).toBeLessThanOrEqual(ECLIPSED_CORRUPTION_TUNING.maxEchoesPerEncounter);
    }
  });
});
