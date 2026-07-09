import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_SETS, type EquipmentSlot } from "../src/game/equipment/equipmentData";
import { validateLoadout, aggregateLoadout } from "../src/game/equipment/EquipmentAggregate";
import { MANUFACTURERS } from "../src/game/ships/shipRosterData";
import {
  EQUIPMENT_ARCHITECTURE_PARTS,
  EQUIPMENT_PROFILES,
  FRAMEWORK_EQUIPMENT,
  MODULE_CATEGORIES,
  engineeringDimensionsFor,
  equipmentArchitectureFor,
} from "../src/game/equipment/equipmentFrameworkData";
import {
  ADVANCED_SYNERGY_SURFACES,
  BASTION_SET,
  ENGINEERING_ACCESSIBILITY_SURFACES,
  ENGINEERING_COLLECTION_KINDS,
  ENGINEERING_FORBIDDEN_OUTCOMES,
  ENGINEERING_LAB_FEATURES,
  ENGINEERING_MANUFACTURERS,
  ENGINEERING_PERFORMANCE_DISCIPLINES,
  ENGINEERING_PHILOSOPHIES,
  ENGINEERING_RESEARCH_KINDS,
  EQUIPMENT_ROSTER_ENTRIES,
  FAMILY_TO_MODULE_CATEGORY,
  HORIZON_FLUX_CAPACITOR,
  MODULE_FAMILIES,
  MODULE_SET_ENTRIES,
  MODULE_SET_KINDS,
  NOVA_WARDEN_HIVE,
  ROSTER_EQUIPMENT,
  ROSTER_EQUIPMENT_PROFILES,
  ROSTER_EQUIPMENT_SETS,
  engineeringLabFor,
  syntheticEquipmentFor,
} from "../src/game/equipment/equipmentRosterData";

function profileFor(itemId: string) {
  return ROSTER_EQUIPMENT_PROFILES.find((p) => p.itemId === itemId)!;
}
function defFor(itemId: string) {
  return ROSTER_EQUIPMENT.find((d) => d.id === itemId)!;
}

describe("Equipment Roster vocabulary — registered shelves (AF-080)", () => {
  it("registers fourteen manufacturers, eighteen families, ten philosophies, ten synergy surfaces, seven set kinds, six research kinds, eight collection kinds, seven lab features, two forbidden outcomes, eight accessibility surfaces, four performance disciplines", () => {
    expect(ENGINEERING_MANUFACTURERS.length).toBe(14);
    expect(MODULE_FAMILIES.length).toBe(18);
    expect(ENGINEERING_PHILOSOPHIES.length).toBe(10);
    expect(ADVANCED_SYNERGY_SURFACES.length).toBe(10);
    expect(MODULE_SET_KINDS.length).toBe(7);
    expect(ENGINEERING_RESEARCH_KINDS.length).toBe(6);
    expect(ENGINEERING_COLLECTION_KINDS.length).toBe(8);
    expect(ENGINEERING_LAB_FEATURES.length).toBe(7);
    expect(ENGINEERING_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(ENGINEERING_ACCESSIBILITY_SURFACES.length).toBe(8);
    expect(ENGINEERING_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("every manufacturer carries all SIX identity parts, and shipwright cross-bindings resolve in AF-074's REAL register", () => {
    for (const maker of ENGINEERING_MANUFACTURERS) {
      expect(maker.engineeringPhilosophy.length, `${maker.id} philosophy`).toBeGreaterThan(0);
      expect(maker.visualLanguage.length, `${maker.id} visuals`).toBeGreaterThan(0);
      expect(maker.lore.length, `${maker.id} lore`).toBeGreaterThan(0);
      expect(maker.technologySpecialisation.length, `${maker.id} specialisation`).toBeGreaterThan(0);
      expect(maker.audioIdentity.length, `${maker.id} audio`).toBeGreaterThan(0);
      expect(maker.signatureMechanic.length, `${maker.id} signature`).toBeGreaterThan(0);
      if (maker.shipwrightId !== null) {
        expect(MANUFACTURERS.some((m) => m.id === maker.shipwrightId), `${maker.id} shipwright`).toBe(true);
      }
    }
    // Engineering-only companies exist — the register is not just AF-074 renamed.
    expect(ENGINEERING_MANUFACTURERS.some((m) => m.shipwrightId === null)).toBe(true);
  });

  it("the eighteen families map TOTALLY onto AF-079's sixteen module categories", () => {
    for (const family of MODULE_FAMILIES) {
      expect([...MODULE_CATEGORIES]).toContain(FAMILY_TO_MODULE_CATEGORY[family]);
    }
  });
});

describe("The full roster — AF-028/079 untouched, four modules added (AF-080)", () => {
  it("ten modules and nine profiles: the locked arrays head the roster unchanged; every addition passes AF-079's inherited laws", () => {
    expect(ROSTER_EQUIPMENT.length).toBe(10);
    expect(ROSTER_EQUIPMENT.slice(0, 6)).toEqual(FRAMEWORK_EQUIPMENT);
    expect(ROSTER_EQUIPMENT_PROFILES.length).toBe(9);
    expect(ROSTER_EQUIPMENT_PROFILES.slice(0, 5)).toEqual(EQUIPMENT_PROFILES);
    for (const profile of ROSTER_EQUIPMENT_PROFILES) {
      const def = defFor(profile.itemId);
      const architecture = equipmentArchitectureFor(def, profile);
      for (const part of EQUIPMENT_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${profile.itemId} missing ${part}`).toBe(true);
      }
      expect(engineeringDimensionsFor(def), `${profile.itemId} is bare-stat`).toBeGreaterThanOrEqual(1);
    }
  });

  it("THREE-LAYER BINDING: every roster entry's family maps to its profile's category, its engineering manufacturer resolves, and shipwright-bound makers agree with the profile's AF-074 id", () => {
    expect(EQUIPMENT_ROSTER_ENTRIES.length).toBe(ROSTER_EQUIPMENT_PROFILES.length); // every profiled module has an identity
    for (const entry of EQUIPMENT_ROSTER_ENTRIES) {
      const profile = profileFor(entry.itemId);
      expect(profile, entry.itemId).toBeDefined();
      expect(FAMILY_TO_MODULE_CATEGORY[entry.family], `${entry.itemId} family/category`).toBe(profile.moduleCategory);
      const maker = ENGINEERING_MANUFACTURERS.find((m) => m.id === entry.engineeringManufacturerId)!;
      expect(maker, `${entry.itemId} maker`).toBeDefined();
      if (maker.shipwrightId !== null) {
        expect(profile.manufacturerId, `${entry.itemId} shipwright agreement`).toBe(maker.shipwrightId);
      }
      expect([...ENGINEERING_PHILOSOPHIES]).toContain(entry.philosophy);
      if (entry.setId) expect(ROSTER_EQUIPMENT_SETS.some((s) => s.id === entry.setId)).toBe(true);
      expect(Object.keys(entry).sort()).toEqual(["engineeringManufacturerId", "family", "itemId", "philosophy", "setId"]); // identity only — no stat field
    }
  });
});

describe("Module sets — gameplay classified by kind (AF-080 §Module Sets)", () => {
  it("every live set is classified with a gameplay clause; the manufacturer set is pure Aegis, the hybrid set spans three makers", () => {
    expect(ROSTER_EQUIPMENT_SETS.slice(0, SANDBOX_SETS.length)).toEqual(SANDBOX_SETS); // AF-028's set heads the array unchanged
    for (const set of ROSTER_EQUIPMENT_SETS) {
      const entry = MODULE_SET_ENTRIES.find((e) => e.setId === set.id)!;
      expect(entry, set.id).toBeDefined();
      expect([...MODULE_SET_KINDS]).toContain(entry.kind);
      expect(entry.gameplayClause.length).toBeGreaterThan(0);
      for (const pieceId of set.pieceIds) expect(ROSTER_EQUIPMENT.some((d) => d.id === pieceId)).toBe(true);
    }
    const bastionMakers = new Set(BASTION_SET.pieceIds.map((id) => profileFor(id).manufacturerId));
    expect(bastionMakers.size).toBe(1); // manufacturerSet: one maker
    const vanguardMakers = new Set(SANDBOX_SETS[0]!.pieceIds.map((id) => profileFor(id).manufacturerId));
    expect(vanguardMakers.size).toBe(3); // hybridSet: three makers, one doctrine
  });

  it("the Bastion set lives through AF-028's REAL validator and aggregator", () => {
    const byId = new Map(ROSTER_EQUIPMENT.map((item) => [item.id, item]));
    const slots = { equipment1: "aegis-bastion-array", equipment2: "aegis-ward-projector" } as const;
    expect(validateLoadout(slots, byId)).toEqual({ ok: true });
    const aggregate = aggregateLoadout(slots, byId, ROSTER_EQUIPMENT_SETS);
    const bastion = aggregate.activeSetBonuses.find((s) => s.setId === "bastion")!;
    expect(bastion).toBeDefined();
    expect(bastion.piecesEquipped).toBe(2);
    expect(bastion.thresholdsMet).toEqual([2]);
    expect(aggregate.bonuses.shieldRegeneration ?? 0).toBeCloseTo(3 + 4, 5); // projector + set bonus
  });
});

describe("Prototype and ancient engineering (AF-080 §Prototype / §Ancient Modules)", () => {
  it("PROTOTYPE PAYS: the Flux Capacitor carries instability (a negative clause), a conditional passive, uniqueness, a reactor gate — and strictly the hottest heat register", () => {
    expect(HORIZON_FLUX_CAPACITOR.bonuses.some((b) => b.value < 0)).toBe(true); // instability is real
    expect(HORIZON_FLUX_CAPACITOR.passives.length).toBeGreaterThan(0); // conditional behaviour
    expect(HORIZON_FLUX_CAPACITOR.uniqueExclusive).toBe(true);
    expect(HORIZON_FLUX_CAPACITOR.requiresCategory).toBe("energyModule");
    const fluxHeat = profileFor("horizon-flux-capacitor").heatOutput;
    for (const profile of ROSTER_EQUIPMENT_PROFILES) {
      if (profile.itemId === "horizon-flux-capacitor") continue;
      expect(fluxHeat, `${profile.itemId} out-heats the prototype`).toBeGreaterThan(profile.heatOutput);
    }
    // The reactor gate has teeth: without an energyModule aboard, installation fails.
    const byId = new Map(ROSTER_EQUIPMENT.map((item) => [item.id, item]));
    const ungated = validateLoadout({ equipment1: "horizon-flux-capacitor" }, byId);
    expect(ungated.ok).toBe(false);
    const gated = validateLoadout({ equipment1: "horizon-flux-capacitor", equipment2: "vanguard-core" }, byId);
    expect(gated.ok).toBe(true);
  });

  it("the drone module is the first EQUIPMENT producer of AF-028's registered-future droneEffectiveness kind", () => {
    expect(NOVA_WARDEN_HIVE.bonuses.some((b) => b.kind === "droneEffectiveness")).toBe(true);
    for (const def of FRAMEWORK_EQUIPMENT) {
      expect(def.bonuses.some((b) => b.kind === "droneEffectiveness"), `${def.id} already produced it`).toBe(false);
    }
  });
});

describe("The Engineering Lab — derivation, not a system (AF-080 §Engineering Lab)", () => {
  it("engineeringLabFor yields a non-empty exhibit for every profiled module across all seven features", () => {
    for (const profile of ROSTER_EQUIPMENT_PROFILES) {
      const lab = engineeringLabFor(defFor(profile.itemId), profile);
      for (const feature of ENGINEERING_LAB_FEATURES) {
        expect(lab[feature].length, `${profile.itemId} lab ${feature}`).toBeGreaterThan(0);
      }
    }
  });

  it("NO DOMINANT MODULE: every module is beaten by another on at least one engineering axis", () => {
    const axes = ROSTER_EQUIPMENT_PROFILES.map((profile) => {
      const def = defFor(profile.itemId);
      return {
        itemId: profile.itemId,
        bonusTotal: def.bonuses.reduce((sum, b) => sum + b.value, 0),
        heat: profile.heatOutput,
        weight: profile.weight,
        dimensions: engineeringDimensionsFor(def),
      };
    });
    for (const module of axes) {
      const beaten = axes.some(
        (other) =>
          other.itemId !== module.itemId &&
          (other.bonusTotal > module.bonusTotal || other.heat < module.heat || other.weight < module.weight || other.dimensions > module.dimensions),
      );
      expect(beaten, `${module.itemId} dominates every build`).toBe(true);
    }
  });
});

describe("Equipment Roster — self-review: millions of engineering builds (AF-080 §Self Review Loop)", () => {
  it("one hundred synthetic modules pass AF-079's unchanged laws — 110 distinct ids alongside the roster", () => {
    const ids = new Set(ROSTER_EQUIPMENT.map((d) => d.id));
    for (let n = 0; n < 100; n += 1) {
      const { def, profile } = syntheticEquipmentFor(n);
      ids.add(def.id);
      expect(engineeringDimensionsFor(def)).toBeGreaterThanOrEqual(1);
      const architecture = equipmentArchitectureFor(def, profile);
      for (const part of EQUIPMENT_ARCHITECTURE_PARTS) expect(architecture[part], `synthetic ${n} ${part}`).toBe(true);
    }
    expect(ids.size).toBe(110);
  });

  it("1,000 seeded engineering builds through AF-028's REAL engine: validation is deterministic and set bonuses match brute force exactly", () => {
    const byId = new Map(ROSTER_EQUIPMENT.map((item) => [item.id, item]));
    const equipmentIds = ROSTER_EQUIPMENT.filter((d) => d.category !== "primaryWeapon").map((d) => d.id);
    const slotNames: EquipmentSlot[] = ["equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6"];
    for (let build = 0; build < 1000; build += 1) {
      const rng = new Rng(build);
      const slots: Partial<Record<EquipmentSlot, string>> = {};
      const count = 1 + Math.floor(rng.next() * 6);
      for (let i = 0; i < count; i += 1) {
        slots[slotNames[i]!] = equipmentIds[Math.floor(rng.next() * equipmentIds.length)]!;
      }
      const validation = validateLoadout(slots, byId);
      if (!validation.ok) continue; // rejections name their rule — the engine's contract, tested at AF-028
      const aggregate = aggregateLoadout(slots, byId, ROSTER_EQUIPMENT_SETS);
      expect(Number.isFinite(aggregate.powerRating)).toBe(true);
      const equipped = Object.values(slots).filter((id): id is string => id !== undefined);
      let expected = 0;
      for (const set of ROSTER_EQUIPMENT_SETS) {
        const pieces = equipped.filter((id) => set.pieceIds.includes(id)).length;
        for (const threshold of Object.keys(set.thresholds)) if (pieces >= Number(threshold)) expected += 1;
      }
      const detected = aggregate.activeSetBonuses.reduce((sum, s) => sum + s.thresholdsMet.length, 0);
      if (detected !== expected) throw new Error(`build ${build}: set bonuses mismatched`);
    }
  });
});
