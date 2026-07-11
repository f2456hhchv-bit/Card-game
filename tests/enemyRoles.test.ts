import { describe, expect, it } from "vitest";
import { ENEMY_ROLES, SANDBOX_ENEMIES, type EnemyRole } from "../src/game/enemies/enemyData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";

const ALL_ROSTERS = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...XENO_ENEMIES, ...VOID_ENEMIES, ...ECLIPSED_ENEMIES, ...NOMAD_ENEMIES];

describe("GP-002 — seven previously-untagged roles now used by at least one real enemy", () => {
  const newRoles: readonly EnemyRole[] = ["assassin", "commander", "charger", "ambusher", "burrower", "exploder", "shieldUnit"];

  it("ENEMY_ROLES registers all seven additively, alongside the original twelve", () => {
    for (const role of newRoles) expect(ENEMY_ROLES).toContain(role);
    expect(ENEMY_ROLES.length).toBe(19);
  });

  it.each(newRoles)("role %s is tagged on at least one real enemy across the full roster", (role) => {
    const tagged = ALL_ROSTERS.filter((e) => e.roles.includes(role));
    expect(tagged.length).toBeGreaterThanOrEqual(1);
  });

  it("charger: wisp-chaser (fast direct-pursuit melee rush)", () => {
    expect(SANDBOX_ENEMIES.find((e) => e.id === "wisp-chaser")?.roles).toContain("charger");
  });

  it("exploder: flak-orbiter (statusExplosion death event)", () => {
    const flak = SANDBOX_ENEMIES.find((e) => e.id === "flak-orbiter")!;
    expect(flak.roles).toContain("exploder");
    expect(flak.deathEvents).toContain("statusExplosion");
  });

  it("burrower: hive-drone (burrow movementBehaviour)", () => {
    const hive = XENO_ENEMIES.find((e) => e.id === "hive-drone")!;
    expect(hive.roles).toContain("burrower");
    expect(hive.movementBehaviour).toBe("burrow");
  });

  it("ambusher: lost-scout (ambush movementBehaviour)", () => {
    const scout = ECLIPSED_ENEMIES.find((e) => e.id === "lost-scout")!;
    expect(scout.roles).toContain("ambusher");
    expect(scout.movementBehaviour).toBe("ambush");
  });

  it("assassin: shadow-hunter (teleport-mobility burst melee)", () => {
    const hunter = VOID_ENEMIES.find((e) => e.id === "shadow-hunter")!;
    expect(hunter.roles).toContain("assassin");
    expect(hunter.movementBehaviour).toBe("teleport");
  });

  it("commander: outlaw-captain, eclipsed-champion, nomad-flagship — never machine-command-core (its own lore denies being a leader)", () => {
    expect(OUTLAW_ENEMIES.find((e) => e.id === "outlaw-captain")?.roles).toContain("commander");
    expect(ECLIPSED_ENEMIES.find((e) => e.id === "eclipsed-champion")?.roles).toContain("commander");
    expect(NOMAD_ENEMIES.find((e) => e.id === "nomad-flagship")?.roles).toContain("commander");
    expect(MACHINE_ENEMIES.find((e) => e.id === "machine-command-core")?.roles).not.toContain("commander");
  });

  it("shieldUnit: machine-shield-generator, outlaw-shield-carrier", () => {
    expect(MACHINE_ENEMIES.find((e) => e.id === "machine-shield-generator")?.roles).toContain("shieldUnit");
    expect(OUTLAW_ENEMIES.find((e) => e.id === "outlaw-shield-carrier")?.roles).toContain("shieldUnit");
  });
});
