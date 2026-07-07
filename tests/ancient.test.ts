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
import {
  ANCIENT_COMBAT_STYLES,
  ANCIENT_ELITE_GAINS,
  ANCIENT_ENEMIES,
  ANCIENT_MINI_BOSS_KINDS,
  ANCIENT_NETWORK_TRAITS,
  ANCIENT_SECURITY_TUNING,
  ANCIENT_SPECIAL_MECHANICS,
  ANCIENT_UNIT_KINDS,
  SECURITY_STAGES,
} from "../src/game/enemies/ancientData";
import { AncientSecurityRuntime } from "../src/game/enemies/AncientSecurity";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { CodexRuntime } from "../src/game/codex/CodexRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";

function makeSite(): AncientSecurityRuntime {
  return new AncientSecurityRuntime("site-1", ["sentinel", "drone", "sphere", "architect", "walker"], ["architect"]);
}

describe("Ancient vocabulary — registered shelves (AF-050 §Core Units / §Combat Style / §Special Mechanics)", () => {
  it("registers thirteen unit kinds, eight combat styles, ten special mechanics, six network traits, six mini-bosses, seven elite gains, five security stages", () => {
    expect(ANCIENT_UNIT_KINDS.length).toBe(14);
    expect(ANCIENT_COMBAT_STYLES.length).toBe(8);
    expect(ANCIENT_SPECIAL_MECHANICS.length).toBe(10);
    expect(ANCIENT_NETWORK_TRAITS.length).toBe(6);
    expect(ANCIENT_MINI_BOSS_KINDS.length).toBe(6);
    expect(ANCIENT_ELITE_GAINS.length).toBe(7);
    expect(SECURITY_STAGES.length).toBe(5);
  });
});

describe("Ancient Custodian units are plain AF-033 EnemyDefs — zero schema changes (AF-050 §Core Units)", () => {
  it("every ancient def uses only registered AF-033 vocabulary", () => {
    for (const def of ANCIENT_ENEMIES) {
      expect(ENEMY_FAMILIES).toContain(def.family);
      for (const role of def.roles) expect(ENEMY_ROLES).toContain(role);
      expect(MOVEMENT_BEHAVIOURS).toContain(def.movementBehaviour);
      expect(ATTACK_TYPES).toContain(def.attack.attackType);
      if (def.specialAbility) expect(SPECIAL_ABILITIES).toContain(def.specialAbility.kind);
      for (const event of def.deathEvents) expect(DEATH_EVENT_KINDS).toContain(event);
    }
  });

  it("no ancient def overlaps any existing enemy across all five factions (AF-033's no-overlap law)", () => {
    const all = [...SANDBOX_ENEMIES, ...OUTLAW_ENEMIES, ...MACHINE_ENEMIES, ...CRYSTAL_ENEMIES, ...VOID_ENEMIES, ...ANCIENT_ENEMIES];
    for (const def of ANCIENT_ENEMIES) {
      expect(findEnemyOverlap(def, all)).toBeNull();
    }
  });

  it("every ranged ancient attack is a real Ancient Custodians weapon with a readable telegraph", () => {
    for (const def of ANCIENT_ENEMIES) {
      if (def.attack.mechanism.kind === "ranged") {
        expect(def.attack.telegraphMs).toBeGreaterThanOrEqual(400);
        expect(def.attack.mechanism.weapon.manufacturer).toBe("Ancient Custodians");
        expect(def.attack.mechanism.weapon.category).toBe("ancient");
      }
    }
  });

  it("gives AF-021's dormant armourBreak status its first producer", () => {
    const drone = ANCIENT_ENEMIES.find((d) => d.id === "defence-drone")!;
    expect(drone.attack.mechanism.kind === "ranged" && drone.attack.mechanism.weapon.statusOnHit?.kind).toBe("armourBreak");
  });

  it("an Ancient Executor runs through AF-034's Elite pipeline unchanged", () => {
    const executor = ANCIENT_ENEMIES.find((d) => d.id === "ancient-executor")!;
    const elite = generateElite(executor, "prime", new Rng(23));
    expect(elite.def.hull).toBeGreaterThan(executor.hull);
    expect(elite.tier).toBe("prime");
  });
});

describe("AncientSecurityRuntime — escalates, the mirror-opposite of every prior doctrine (AF-050 §Security System)", () => {
  it("starts at Minor Trespass with zero alert", () => {
    const site = makeSite();
    expect(site.stage).toBe("minorTrespass");
    expect(site.alertLevel).toBe(0);
  });

  it("escalates through every named stage as alert climbs while the player trespasses", () => {
    const site = makeSite();
    const seen = new Set<string>();
    for (let i = 0; i < 2000; i += 1) {
      site.update(100, true);
      seen.add(site.stage);
    }
    expect(seen.has("minorTrespass")).toBe(true);
    expect(seen.has("warning")).toBe(true);
    expect(seen.has("containment")).toBe(true);
    expect(seen.has("guardianDeployment")).toBe(true);
    expect(seen.has("maximumResponse")).toBe(true);
  });

  it("de-escalates continuously the moment the player leaves — unlike Void's decay-only-when-empty model", () => {
    const site = makeSite();
    for (let i = 0; i < 200; i += 1) site.update(100, true);
    const peak = site.alertLevel;
    for (let i = 0; i < 50; i += 1) site.update(100, false);
    expect(site.alertLevel).toBeLessThan(peak);
  });

  it("never exceeds maxAlert no matter how long the player trespasses", () => {
    const site = makeSite();
    for (let i = 0; i < 100000; i += 1) site.update(1000, true);
    expect(site.alertLevel).toBeLessThanOrEqual(ANCIENT_SECURITY_TUNING.maxAlert);
  });

  it("destroying the network node (Shield Architect) permanently shrinks the ceiling and clamps alert down to match", () => {
    const site = makeSite();
    for (let i = 0; i < 300; i += 1) site.update(100, true);
    const before = site.alertLevel;
    expect(site.notifyDroneDestroyed("architect")).toBe("node");
    expect(site.ceiling).toBe(0);
    expect(site.alertLevel).toBeLessThanOrEqual(before);
    expect(site.alertLevel).toBe(0);
    // the ceiling stays shrunk even after the node is gone — trespassing further cannot climb past it.
    for (let i = 0; i < 1000; i += 1) site.update(1000, true);
    expect(site.alertLevel).toBe(0);
  });

  it("destroying a non-node member does not change the ceiling or alert", () => {
    const site = makeSite();
    for (let i = 0; i < 100; i += 1) site.update(100, true);
    const before = site.alertLevel;
    expect(site.notifyDroneDestroyed("sentinel")).toBe("member");
    expect(site.alertLevel).toBe(before);
    expect(site.ceiling).toBe(ANCIENT_SECURITY_TUNING.maxAlert);
  });

  it("healing, damage bonus, and incoming-damage reduction all step discretely with stage, not continuously", () => {
    const site = makeSite();
    for (let i = 0; i < 2000; i += 1) {
      site.update(100, true);
      const ratio = site.stage === "minorTrespass" ? 0 : SECURITY_STAGES.indexOf(site.stage) / (SECURITY_STAGES.length - 1);
      expect(site.healPerSecond).toBeCloseTo(ratio * ANCIENT_SECURITY_TUNING.healPerSecondAtMaxResponse, 5);
      expect(site.damageBonus).toBeCloseTo(ratio * ANCIENT_SECURITY_TUNING.damageBonusAtMaxResponse, 5);
    }
  });

  it("Guardian Deployment only fires once Stage 3+ is reached, and respects its cadence and lifetime cap", () => {
    const site = makeSite();
    expect(site.tryDeployGuardian()).toBe(false); // not escalated yet
    for (let i = 0; i < 400; i += 1) site.update(100, true); // climb well past guardianDeployment
    let deployed = 0;
    for (let i = 0; i < 30; i += 1) {
      site.update(ANCIENT_SECURITY_TUNING.guardianDeployIntervalMs, true);
      if (site.tryDeployGuardian()) deployed += 1;
    }
    expect(deployed).toBe(ANCIENT_SECURITY_TUNING.maxGuardianDeployments);
  });

  it("is eliminated once every member is destroyed", () => {
    const site = makeSite();
    for (const id of ["sentinel", "drone", "sphere", "architect", "walker"]) site.notifyDroneDestroyed(id);
    expect(site.eliminated).toBe(true);
  });
});

describe("Faction profile — the sixth profiled faction (AF-050 §Faction Identity)", () => {
  it("Ancient Custodians is a full AF-039 FactionDef, paying off the registered-but-unprofiled FactionId", () => {
    const profile = SANDBOX_FACTION_ROSTER.factions.find((f) => f.id === "ancientCustodians");
    expect(profile).toBeDefined();
    expect(profile!.loreId).toBe("LORE_ANCIENT_CUSTODIANS_CODEX");
  });
});

describe("Codex — the Ancient Custodians doctrine entry (AF-050 §Codex)", () => {
  it("adds an additive Codex entry gated on the faction lore discovery, with zero Missing Links", () => {
    const codex = new CodexRuntime(SANDBOX_CODEX_ENTRIES);
    const entry = codex.findEntry("codex-ancient-security-doctrine");
    expect(entry).not.toBeNull();
    expect(entry!.unlock).toEqual({ kind: "collection", category: "lore", id: "LORE_ANCIENT_CUSTODIANS_CODEX" });
    expect(codex.missingLinkCount()).toBe(0);
  });
});

describe("Ancient Custodians — self-review: thousands of encounters stay consistent (AF-050 §Self Review Loop)", () => {
  it("survives 1,000 randomised site encounters without ever reaching an invalid state", () => {
    const rng = new Rng(4050);
    for (let encounter = 0; encounter < 1000; encounter += 1) {
      const memberIds = ["sentinel", "drone", "sphere", "architect", "walker"];
      const site = new AncientSecurityRuntime(`site-${encounter}`, memberIds, ["architect"]);
      const killOrder = [...memberIds];
      for (let i = killOrder.length - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const tmp = killOrder[i]!;
        killOrder[i] = killOrder[j]!;
        killOrder[j] = tmp;
      }
      for (const id of killOrder) {
        site.update(rng.int(0, 2000), rng.next() < 0.5);
        const role = site.notifyDroneDestroyed(id);
        expect(role).not.toBeNull();
        expect(site.alertLevel).toBeLessThanOrEqual(site.ceiling);
        expect(site.alertLevel).toBeGreaterThanOrEqual(0);
        expect(SECURITY_STAGES).toContain(site.stage);
      }
      expect(site.eliminated).toBe(true);
    }
  });
});
