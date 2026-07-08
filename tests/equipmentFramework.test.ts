import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { EQUIPMENT_CATEGORIES, SANDBOX_EQUIPMENT, SANDBOX_SETS, SLOT_ACCEPTS } from "../src/game/equipment/equipmentData";
import { validateLoadout, aggregateLoadout } from "../src/game/equipment/EquipmentAggregate";
import { SHIP_MODULE_KINDS } from "../src/game/ships/shipFrameworkData";
import { MANUFACTURERS } from "../src/game/ships/shipRosterData";
import {
  CRYO_MANIFOLD,
  EQUIPMENT_ARCHITECTURE_PARTS,
  EQUIPMENT_COLLECTION_STATES,
  EQUIPMENT_CUSTOMISATION_KINDS,
  EQUIPMENT_EVOLUTION_ROUTES,
  EQUIPMENT_PROFILES,
  EQUIPMENT_UPGRADE_ROUTES,
  FRAMEWORK_EQUIPMENT,
  INSTALLATION_MECHANISMS,
  MODULE_CATEGORIES,
  MODULE_CATEGORY_TO_EQUIPMENT_CATEGORY,
  MODULE_SYNERGY_SURFACES,
  RESOURCE_MANAGEMENT_SURFACES,
  SHIP_MODULE_KIND_TO_MODULE_CATEGORY,
  SPEC_SLOT_KINDS,
  SPEC_SLOT_TO_MECHANISM,
  engineeringDimensionsFor,
  engineeringLoadFor,
  equipmentArchitectureFor,
} from "../src/game/equipment/equipmentFrameworkData";
import { EquipmentCollectionRuntime } from "../src/game/equipment/EquipmentCollectionRuntime";

function profileFor(itemId: string) {
  return EQUIPMENT_PROFILES.find((p) => p.itemId === itemId)!;
}
function defFor(itemId: string) {
  return FRAMEWORK_EQUIPMENT.find((d) => d.id === itemId)!;
}

describe("Equipment Framework vocabulary — registered shelves (AF-079)", () => {
  it("registers sixteen module categories, seventeen architecture parts, seven resource surfaces, eight synergy surfaces, six slot kinds on four mechanisms, six upgrade routes, six evolution routes, seven collection states, six customisation kinds", () => {
    expect(MODULE_CATEGORIES.length).toBe(16);
    expect(EQUIPMENT_ARCHITECTURE_PARTS.length).toBe(17);
    expect(RESOURCE_MANAGEMENT_SURFACES.length).toBe(7);
    expect(MODULE_SYNERGY_SURFACES.length).toBe(8);
    expect(SPEC_SLOT_KINDS.length).toBe(6);
    expect(INSTALLATION_MECHANISMS.length).toBe(4);
    expect(EQUIPMENT_UPGRADE_ROUTES.length).toBe(6);
    expect(EQUIPMENT_EVOLUTION_ROUTES.length).toBe(6);
    expect(EQUIPMENT_COLLECTION_STATES.length).toBe(7);
    expect(EQUIPMENT_CUSTOMISATION_KINDS.length).toBe(6);
  });

  it("the sixteen categories map TOTALLY onto AF-028's twelve, and AF-073's eight ship-module kinds map TOTALLY onto the sixteen — one engineering vocabulary", () => {
    for (const category of MODULE_CATEGORIES) {
      expect([...EQUIPMENT_CATEGORIES]).toContain(MODULE_CATEGORY_TO_EQUIPMENT_CATEGORY[category]);
    }
    for (const kind of SHIP_MODULE_KINDS) {
      expect([...MODULE_CATEGORIES]).toContain(SHIP_MODULE_KIND_TO_MODULE_CATEGORY[kind]);
    }
    // The six spec slot kinds are realised by EXISTING AF-028 mechanisms — no second slot system.
    for (const slotKind of SPEC_SLOT_KINDS) {
      expect([...INSTALLATION_MECHANISMS]).toContain(SPEC_SLOT_TO_MECHANISM[slotKind]);
    }
  });
});

describe("Equipment architecture — every module feels handcrafted (AF-079 §Equipment Architecture)", () => {
  it("all seventeen parts hold for every profiled module, and manufacturers are AF-074's REAL register", () => {
    expect(EQUIPMENT_PROFILES.length).toBe(5);
    for (const profile of EQUIPMENT_PROFILES) {
      const def = defFor(profile.itemId);
      expect(def).toBeDefined();
      const architecture = equipmentArchitectureFor(def, profile);
      for (const part of EQUIPMENT_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${profile.itemId} missing ${part}`).toBe(true);
      }
      expect(MANUFACTURERS.some((m) => m.id === profile.manufacturerId)).toBe(true);
    }
  });

  it("THE ENGINEERING LAW: no profiled module exists only to increase numbers — every one carries a non-numeric dimension", () => {
    for (const profile of EQUIPMENT_PROFILES) {
      expect(engineeringDimensionsFor(defFor(profile.itemId)), `${profile.itemId} is bare-stat`).toBeGreaterThanOrEqual(1);
    }
    // The counterexample proving the law has teeth: the refit cannon is bare-stat —
    // weapon-category content, deliberately outside the module architecture.
    const refit = SANDBOX_EQUIPMENT.find((d) => d.id === "refit-cannon")!;
    expect(engineeringDimensionsFor(refit)).toBe(0);
    expect(EQUIPMENT_PROFILES.some((p) => p.itemId === "refit-cannon")).toBe(false);
  });

  it("actives draw AF-031's real energy: the Cryo Manifold has an active module and a positive energy requirement", () => {
    expect(CRYO_MANIFOLD.active).not.toBeNull();
    expect(CRYO_MANIFOLD.active!.cooldownMs).toBeGreaterThan(0);
    expect(profileFor("cryo-manifold").energyRequirement).toBeGreaterThan(0);
    // Passive-only modules owe no energy — the requirement is honest, not decorative.
    for (const profile of EQUIPMENT_PROFILES) {
      if (defFor(profile.itemId).active === null) expect(profile.energyRequirement).toBe(0);
    }
  });
});

describe("The workshop through AF-028's REAL engine (AF-079 §Installation Rules)", () => {
  it("the Cryo Manifold installs beside the sandbox loadout and aggregates through the unchanged validator", () => {
    expect(FRAMEWORK_EQUIPMENT.length).toBe(6);
    expect(FRAMEWORK_EQUIPMENT.slice(0, 5)).toEqual(SANDBOX_EQUIPMENT); // AF-028's five head the workshop unchanged
    expect(SLOT_ACCEPTS.equipment4).toContain(CRYO_MANIFOLD.category);
    const byId = new Map(FRAMEWORK_EQUIPMENT.map((item) => [item.id, item]));
    const slots = {
      primaryWeapon: "refit-cannon",
      equipment1: "barrier-plate",
      equipment2: "vanguard-thrusters",
      equipment3: "vanguard-core",
      equipment4: "cryo-manifold",
    } as const;
    const validation = validateLoadout(slots, byId);
    expect(validation.ok, JSON.stringify(validation)).toBe(true);
    const aggregate = aggregateLoadout(slots, byId, SANDBOX_SETS);
    expect(aggregate.bonuses.boostEfficiency ?? 0).toBeCloseTo(0.16, 5); // vanguard 2pc 0.10 + manifold 0.06
    expect(aggregate.activeSetBonuses.length).toBeGreaterThan(0);
    expect(aggregate.activeModules.some((a) => a.itemId === "cryo-manifold" && a.cooldownMs === 15000)).toBe(true); // the first live active module
  });

  it("engineering load sums energy draw, heat, and mass across installed profiles (§Debug)", () => {
    const installed = EQUIPMENT_PROFILES.filter((p) => p.itemId !== "ancient-relay");
    const load = engineeringLoadFor(installed);
    expect(load.energyDraw).toBe(20); // only the manifold's active draws
    expect(load.heatLoad).toBe(2 + 4 + 6 + 0);
    expect(load.mass).toBe(14 + 8 + 12 + 6);
    expect(engineeringLoadFor([])).toEqual({ energyDraw: 0, heatLoad: 0, mass: 0 });
  });
});

describe("The workshop collection — a monotone lattice (AF-079 §Collection)", () => {
  it("states only advance: unseen → discovered → crafted → mastered, with evolved as a permanent parallel mark", () => {
    const shop = new EquipmentCollectionRuntime(EQUIPMENT_PROFILES);
    expect(shop.stateFor("cryo-manifold")).toBe("unseen");
    expect(shop.recordDiscovered("cryo-manifold")).toBe(true);
    expect(shop.recordDiscovered("cryo-manifold")).toBe(false); // no re-discovery
    expect(shop.recordMastered("cryo-manifold")).toBe(false); // mastery requires crafting first
    expect(shop.recordCrafted("cryo-manifold")).toBe(true);
    expect(shop.recordDiscovered("cryo-manifold")).toBe(false); // no demotion
    expect(shop.recordMastered("cryo-manifold")).toBe(true);
    expect(shop.stateFor("cryo-manifold")).toBe("mastered");
    expect(shop.recordCrafted("barrier-plate")).toBe(true); // crafting implies discovery
    expect(shop.recordEvolved("vanguard-core")).toBe(true);
    expect(shop.recordEvolved("vanguard-core")).toBe(false);
    expect(shop.hasEvolved("vanguard-core")).toBe(true);
    expect(shop.recordCrafted("refit-cannon")).toBe(false); // no profile — not a module
    const snapshot = shop.snapshot;
    expect(snapshot.workshopSize).toBe(5);
    expect(snapshot.discoveredCount).toBe(2);
    expect(snapshot.craftedCount).toBe(2);
    expect(snapshot.masteredCount).toBe(1);
    expect(snapshot.evolvedCount).toBe(1);
  });

  it("NO REMOVAL API: the workshop's prototype offers no way to demote, delete, or reset a module", () => {
    const methods = Object.getOwnPropertyNames(EquipmentCollectionRuntime.prototype);
    for (const method of methods) {
      expect(/remove|delete|revoke|reset|retire|forget/i.test(method), `forbidden API: ${method}`).toBe(false);
    }
  });
});

describe("Equipment Framework — self-review sweep (AF-079 §Self Review Loop)", () => {
  it("1,000 seeded engineering careers: the lattice never regresses and the load never goes negative", () => {
    const ids = EQUIPMENT_PROFILES.map((p) => p.itemId);
    const order = { unseen: 0, discovered: 1, crafted: 2, mastered: 3 } as const;
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const shop = new EquipmentCollectionRuntime(EQUIPMENT_PROFILES);
      const seen = new Map<string, number>();
      const installed: string[] = [];
      for (let step = 0; step < 30; step += 1) {
        const itemId = ids[Math.floor(rng.next() * ids.length)]!;
        const action = rng.next();
        if (action < 0.35) shop.recordDiscovered(itemId);
        else if (action < 0.7) {
          shop.recordCrafted(itemId);
          if (!installed.includes(itemId)) installed.push(itemId);
        } else if (action < 0.9) shop.recordMastered(itemId);
        else shop.recordEvolved(itemId);
        const rank = order[shop.stateFor(itemId)];
        if (rank < (seen.get(itemId) ?? 0)) throw new Error(`career ${career}: ${itemId} regressed`);
        seen.set(itemId, rank);
        const load = engineeringLoadFor(EQUIPMENT_PROFILES.filter((p) => installed.includes(p.itemId)));
        if (load.energyDraw < 0 || load.heatLoad < 0 || load.mass <= 0 && installed.length > 0) {
          throw new Error(`career ${career}: engineering load broke`);
        }
      }
      const snapshot = shop.snapshot;
      if (snapshot.craftedCount > snapshot.discoveredCount) throw new Error("crafted exceeded discovered");
      if (snapshot.masteredCount > snapshot.craftedCount) throw new Error("mastered exceeded crafted");
    }
  });
});
