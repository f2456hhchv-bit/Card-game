import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_SHIPS, SHIP_CLASSES, findShipOverlap, shipFingerprint } from "../src/game/ships/shipData";
import {
  AURELIA_SHIP,
  DEFENSIVE_PROFILE_KINDS,
  FRAMEWORK_CLASS_TO_SHIP_CLASS,
  FRAMEWORK_SHIPS,
  MOVEMENT_MODEL_TO_PROFILE_KEY,
  OFFENSIVE_PROFILE_KINDS,
  SANDBOX_SHIP_MODULES,
  SHIP_ARCHITECTURE_PARTS,
  SHIP_ABILITY_STAGES,
  SHIP_CUSTOMISATION_KINDS,
  SHIP_FRAMEWORK_CLASSES,
  SHIP_MASTERY_METRICS,
  SHIP_MODULE_KINDS,
  SHIP_PROFILES,
  shipArchitectureFor,
} from "../src/game/ships/shipFrameworkData";
import { ShipOutfittingRuntime } from "../src/game/ships/ShipOutfittingRuntime";

function profileFor(shipId: string) {
  return SHIP_PROFILES.find((p) => p.shipId === shipId)!;
}

describe("Ship Framework vocabulary — registered shelves (AF-073)", () => {
  it("registers ten framework classes, 22 architecture parts, five ability stages, seven defensive kinds, eight offensive kinds, eight module kinds, eight mastery metrics, eight customisation kinds", () => {
    expect(SHIP_FRAMEWORK_CLASSES.length).toBe(10);
    expect(SHIP_ARCHITECTURE_PARTS.length).toBe(22);
    expect(SHIP_ABILITY_STAGES.length).toBe(5);
    expect(DEFENSIVE_PROFILE_KINDS.length).toBe(7);
    expect(OFFENSIVE_PROFILE_KINDS.length).toBe(8);
    expect(SHIP_MODULE_KINDS.length).toBe(8);
    expect(SHIP_MASTERY_METRICS.length).toBe(8);
    expect(SHIP_CUSTOMISATION_KINDS.length).toBe(8);
  });

  it("every framework class maps totally onto AF-031's locked eleven-class shelf", () => {
    for (const cls of SHIP_FRAMEWORK_CLASSES) expect(SHIP_CLASSES).toContain(FRAMEWORK_CLASS_TO_SHIP_CLASS[cls]);
  });

  it("the spec's eight movement-model fields map onto REAL AF-020 MovementProfile keys — live since AF-020, named here", () => {
    const profile = SANDBOX_SHIPS[0]!.movementProfile as unknown as Record<string, unknown>;
    for (const key of Object.values(MOVEMENT_MODEL_TO_PROFILE_KEY)) {
      expect(profile[key], `MovementProfile missing ${key}`).toBeDefined();
    }
    expect(Object.keys(MOVEMENT_MODEL_TO_PROFILE_KEY).length).toBe(8);
  });
});

describe("The extended roster — AF-031 untouched, one science vessel added (AF-073 §Ship Classes)", () => {
  it("AF-031's sandbox pair remains the unmodified head; the Aurelia joins additively; the overlap law holds", () => {
    expect(FRAMEWORK_SHIPS.length).toBe(3);
    expect(FRAMEWORK_SHIPS.slice(0, 2)).toEqual(SANDBOX_SHIPS);
    for (const ship of FRAMEWORK_SHIPS) expect(findShipOverlap(ship, FRAMEWORK_SHIPS)).toBeNull();
    expect(new Set(FRAMEWORK_SHIPS.map(shipFingerprint)).size).toBe(3);
    expect(AURELIA_SHIP.maxEnergy).toBeGreaterThan(SANDBOX_SHIPS[0]!.maxEnergy); // a sensor platform runs on power
  });

  it("all 22 architecture parts are present for every profiled ship — nothing remains undefined", () => {
    for (const ship of FRAMEWORK_SHIPS) {
      const architecture = shipArchitectureFor(ship, profileFor(ship.id));
      for (const part of SHIP_ARCHITECTURE_PARTS) expect(architecture[part], `${ship.id} missing ${part}`).toBe(true);
    }
  });

  it("identity stays distinct: defensive and offensive profiles never repeat across the roster", () => {
    expect(new Set(SHIP_PROFILES.map((p) => p.primaryDefence)).size).toBe(SHIP_PROFILES.length);
    expect(new Set(SHIP_PROFILES.map((p) => p.offensiveIdentity)).size).toBe(SHIP_PROFILES.length);
    for (const profile of SHIP_PROFILES) {
      expect(DEFENSIVE_PROFILE_KINDS).toContain(profile.primaryDefence);
      expect(OFFENSIVE_PROFILE_KINDS).toContain(profile.offensiveIdentity);
    }
  });

  it("the five-stage ability structure is complete: AF-031's two stages plus ultimate (AF-030's charge-gated shape), special mechanic, ascension upgrade", () => {
    for (const ship of FRAMEWORK_SHIPS) {
      const profile = profileFor(ship.id);
      expect(ship.passive).toBeDefined(); // passiveSystem
      expect(ship.ability.energyCost).toBeGreaterThan(0); // activeAbility — AF-031's energy gate
      expect(profile.ultimate.chargeRequired).toBe(100); // ultimateSystem — AF-030's exact charge model
      expect(profile.specialMechanic.tag.length).toBeGreaterThan(0); // specialMechanic
      expect(profile.ascensionUpgrade.requiredAscensionLevel).toBeGreaterThan(0); // ascensionUpgrade — the AF-069 gate
      expect(SANDBOX_SHIP_MODULES.some((m) => m.id === profile.ascensionUpgrade.moduleId)).toBe(true); // gates a REAL module
    }
  });

  it("heat and cargo are registered dormant numeric fields — the biomeId pattern, awaiting their first consumers", () => {
    for (const profile of SHIP_PROFILES) {
      expect(profile.heatCapacity).toBeGreaterThan(0);
      expect(profile.cargoCapacity).toBeGreaterThan(0);
    }
  });
});

describe("Modules — AF-028 bonuses, one per kind (AF-073 §Module Support)", () => {
  it("ships eight modules covering all eight kinds, every bonus on AF-028's vocabulary", () => {
    expect(SANDBOX_SHIP_MODULES.length).toBe(8);
    expect(new Set(SANDBOX_SHIP_MODULES.map((m) => m.kind)).size).toBe(SHIP_MODULE_KINDS.length);
    for (const module of SANDBOX_SHIP_MODULES) expect(module.bonus.value).not.toBe(0);
  });

  it("outfitting gates on slots, caches bonuses until the fit changes, and allows refitting as a loadout decision", () => {
    const runtime = new ShipOutfittingRuntime(profileFor("wayfarer-hull-mk2"), SANDBOX_SHIP_MODULES); // 2 slots
    expect(runtime.tryFitModule("module-fusion-reactor")).toBe(true);
    const first = runtime.moduleBonuses();
    expect(runtime.moduleBonuses()).toBe(first); // cached — same reference
    expect(runtime.tryFitModule("module-vector-engine")).toBe(true);
    expect(runtime.tryFitModule("module-lattice-shield")).toBe(false); // slots full
    expect(runtime.moduleBonuses()).not.toBe(first); // fit changed, cache invalidated
    expect(runtime.unfitModule("module-fusion-reactor")).toBe(true); // refit freely
    expect(runtime.tryFitModule("module-lattice-shield")).toBe(true); // the slot reopened
    expect(runtime.moduleBonuses().length).toBe(2);
  });

  it("the ascension module fits FREE outside the slot count at the AF-069 gate, once, permanently", () => {
    const runtime = new ShipOutfittingRuntime(profileFor("wayfarer-hull-mk2"), SANDBOX_SHIP_MODULES); // gate 1, module-vector-engine
    runtime.tryFitModule("module-fusion-reactor");
    runtime.tryFitModule("module-lattice-shield"); // both slots used
    expect(runtime.tryApplyAscensionUpgrade(0)).toBe(false); // below the gate
    expect(runtime.tryApplyAscensionUpgrade(1)).toBe(true); // Ascension I — the Vector Engine fits free
    expect(runtime.isFitted("module-vector-engine")).toBe(true);
    expect(runtime.snapshot.fittedModules).toBe(3); // beyond the 2-slot count
    expect(runtime.tryApplyAscensionUpgrade(5)).toBe(false); // once only
    expect(runtime.unfitModule("module-vector-engine")).toBe(false); // the grant is permanent
    const api = Object.getOwnPropertyNames(ShipOutfittingRuntime.prototype);
    for (const name of api) expect(/reset|wipe|clear|delete/i.test(name)).toBe(false); // the mastery ledger cannot be erased
  });
});

describe("GP-003 §Ship Progression — save/load round-trips (ships permanently improve)", () => {
  it("toSave/loadSave round-trips fitted modules, ascension, and mastery", () => {
    const runtime = new ShipOutfittingRuntime(profileFor("wayfarer-hull-mk2"), SANDBOX_SHIP_MODULES);
    runtime.tryFitModule("module-fusion-reactor");
    runtime.recordUse();
    runtime.recordKills(5);
    runtime.recordBossVictory();
    runtime.recordDistance(120);
    const saved = runtime.toSave();

    const restored = new ShipOutfittingRuntime(profileFor("wayfarer-hull-mk2"), SANDBOX_SHIP_MODULES);
    restored.loadSave(saved);
    expect(restored.snapshot).toEqual(runtime.snapshot);
    expect(restored.isFitted("module-fusion-reactor")).toBe(true);
  });

  it("drops unknown module ids on load rather than throwing (deprecation-safe)", () => {
    const runtime = new ShipOutfittingRuntime(profileFor("wayfarer-hull-mk2"), SANDBOX_SHIP_MODULES);
    runtime.loadSave({ fitted: ["not-a-real-module"], ascensionModuleFitted: false, mastery: { uses: 3, kills: 0, bossVictories: 0, distanceTravelled: 0 } });
    expect(runtime.isFitted("not-a-real-module")).toBe(false);
    expect(runtime.snapshot.mastery.uses).toBe(3);
  });
});

describe("Ship Framework — self-review: play every ship (AF-073 §Self Review Loop)", () => {
  it("1,000 seeded careers of refitting and mastery keep every ledger consistent and never exceed slots", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const profile = SHIP_PROFILES[career % SHIP_PROFILES.length]!;
      const runtime = new ShipOutfittingRuntime(profile, SANDBOX_SHIP_MODULES);
      let expectedUses = 0;
      let expectedKills = 0;
      for (let step = 0; step < 50; step += 1) {
        const roll = rng.next();
        const moduleId = SANDBOX_SHIP_MODULES[Math.floor(rng.next() * SANDBOX_SHIP_MODULES.length)]!.id;
        if (roll < 0.3) runtime.tryFitModule(moduleId);
        else if (roll < 0.5) runtime.unfitModule(moduleId);
        else if (roll < 0.7) {
          runtime.recordUse();
          expectedUses += 1;
        } else if (roll < 0.9) {
          const kills = 1 + Math.floor(rng.next() * 5);
          runtime.recordKills(kills);
          expectedKills += kills;
        } else {
          runtime.tryApplyAscensionUpgrade(Math.floor(rng.next() * 4));
        }
        const snap = runtime.snapshot;
        const freeAscension = snap.ascensionModuleFitted ? 1 : 0;
        if (snap.fittedModules - freeAscension > profile.moduleSlots) throw new Error("slots exceeded");
        if (snap.mastery.uses !== expectedUses || snap.mastery.kills !== expectedKills) throw new Error("mastery ledger drifted");
        if (runtime.moduleBonuses().length !== snap.fittedModules) throw new Error("bonus/fit mismatch");
      }
    }
  });
});
