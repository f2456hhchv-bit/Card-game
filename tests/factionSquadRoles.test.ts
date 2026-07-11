import { describe, expect, it } from "vitest";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import type { EnemyDef, EnemyRole } from "../src/game/enemies/enemyData";

/**
 * GP-004 §Content Engine: main.ts's ten faction squad-spawning functions
 * (spawnOutlawSquad, spawnMachineNetwork, ...) used to find each squad's
 * leader and special-role members via `def.id === "&lt;hardcoded-string&gt;"` —
 * an architecture violation the audit flagged, since adding a new enemy
 * required new main.ts code rather than just new data. They now find both
 * via `def.roles.includes(...)`, which only stays correct if the chosen
 * role is unique within each faction's own small squad roster. These tests
 * guard that invariant directly, so a future roster edit that breaks it
 * fails loudly here rather than silently mis-identifying a squad leader
 * (or crashing on a `.find()` that returns undefined) at runtime.
 */
const FACTION_ROSTERS: ReadonlyArray<{ name: string; roster: readonly EnemyDef[]; leaderRole: EnemyRole; specialRole?: EnemyRole }> = [
  { name: "Outlaw", roster: OUTLAW_ENEMIES, leaderRole: "elite" },
  // machine-command-core carries neither "elite" nor "commander" (its own
  // lore: "not a leader — a router") — "controller" is its real, unique role.
  { name: "Machine", roster: MACHINE_ENEMIES, leaderRole: "controller", specialRole: "shieldUnit" },
  { name: "Crystal", roster: CRYSTAL_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Void", roster: VOID_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Ancient", roster: ANCIENT_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Xeno", roster: XENO_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Nomad", roster: NOMAD_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Paragon", roster: PARAGON_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Celestial", roster: CELESTIAL_ENEMIES, leaderRole: "elite", specialRole: "support" },
  { name: "Eclipsed", roster: ECLIPSED_ENEMIES, leaderRole: "elite", specialRole: "support" },
];

describe("GP-004 §Content Engine — faction squad rosters: role-based leader/special-member lookup is unambiguous", () => {
  it.each(FACTION_ROSTERS)("$name: exactly one entry tagged with its own leader role", ({ roster, leaderRole }) => {
    const leaders = roster.filter((d) => d.roles.includes(leaderRole));
    expect(leaders).toHaveLength(1);
  });

  it.each(FACTION_ROSTERS.filter((f) => f.specialRole))(
    "$name: exactly one entry (excluding the leader) tagged with its special role",
    ({ roster, leaderRole, specialRole }) => {
      const leader = roster.find((d) => d.roles.includes(leaderRole))!;
      const specialEntries = roster.filter((d) => d !== leader && d.roles.includes(specialRole!));
      expect(specialEntries).toHaveLength(1);
    },
  );

  it("Machine's three tracked special roles (shieldUnit/healer/summoner) are each unique and distinct from one another", () => {
    const leader = MACHINE_ENEMIES.find((d) => d.roles.includes("controller"))!;
    const members = MACHINE_ENEMIES.filter((d) => d !== leader);
    for (const role of ["shieldUnit", "healer", "summoner"] as const) {
      expect(members.filter((d) => d.roles.includes(role))).toHaveLength(1);
    }
  });

  it("machine-command-core and ancient-void-avatar are found by role and carry the exact lore-respecting tags the refactor depends on", () => {
    const machineLeader = MACHINE_ENEMIES.find((d) => d.roles.includes("controller"))!;
    const voidLeader = VOID_ENEMIES.find((d) => d.roles.includes("elite"))!;
    expect(machineLeader.id).toBe("machine-command-core");
    expect(machineLeader.roles).not.toContain("elite");
    expect(machineLeader.roles).not.toContain("commander");
    expect(voidLeader.id).toBe("ancient-void-avatar");
    expect(voidLeader.roles).not.toContain("commander");
  });
});
