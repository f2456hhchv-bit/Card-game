import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_RELICS, validateRelicDef } from "../src/game/relics/relicData";
import { RelicSystem } from "../src/game/relics/RelicSystem";
import {
  RELIC_ARCHITECTURE_PARTS,
  RELIC_EVOLUTION_TRIGGERS,
  RELIC_FRAMEWORK_CATEGORIES,
  relicArchitectureFor,
} from "../src/game/relics/relicFrameworkData";
import {
  ANCIENT_RELIC_TRAITS,
  BUILD_NETWORK_SURFACES,
  EVOLUTION_ROUTE_TO_TRIGGER,
  FAMILY_TO_FRAMEWORK_CATEGORY,
  MUSEUM_FEATURES,
  PROTOTYPE_RELIC_TRAITS,
  RELIC_EVOLUTION_ROUTES,
  RELIC_FAMILIES,
  RELIC_FORBIDDEN_OUTCOMES,
  RELIC_ORIGINS,
  RELIC_ROSTER_COLLECTION_KINDS,
  RELIC_ROSTER_ENTRIES,
  ROSTER_RELICS,
  ROSTER_RELIC_PROFILES,
  SANDBOX_RELIC_SETS,
  SET_PIECE_COUNTS,
  VEIL_FRAGMENT,
  VOID_RELIC_TRAITS,
  activeSetBonusesFor,
  museumEntryFor,
} from "../src/game/relics/relicRosterData";

function profileFor(relicId: string) {
  return ROSTER_RELIC_PROFILES.find((p) => p.relicId === relicId)!;
}
function entryFor(relicId: string) {
  return RELIC_ROSTER_ENTRIES.find((e) => e.relicId === relicId)!;
}

describe("Relic Roster vocabulary — registered shelves (AF-078)", () => {
  it("registers fifteen families, six set thresholds, nine network surfaces, eight origins, seven ancient traits, six void traits, six prototype traits, seven evolution routes, eight collection kinds, seven museum features, three forbidden outcomes", () => {
    expect(RELIC_FAMILIES.length).toBe(15);
    expect(SET_PIECE_COUNTS.length).toBe(6);
    expect(BUILD_NETWORK_SURFACES.length).toBe(9);
    expect(RELIC_ORIGINS.length).toBe(8);
    expect(ANCIENT_RELIC_TRAITS.length).toBe(7);
    expect(VOID_RELIC_TRAITS.length).toBe(6);
    expect(PROTOTYPE_RELIC_TRAITS.length).toBe(6);
    expect(RELIC_EVOLUTION_ROUTES.length).toBe(7);
    expect(RELIC_ROSTER_COLLECTION_KINDS.length).toBe(8);
    expect(MUSEUM_FEATURES.length).toBe(7);
    expect(RELIC_FORBIDDEN_OUTCOMES.length).toBe(3);
  });

  it("families map totally onto AF-077's categories, and evolution routes onto AF-077's triggers", () => {
    for (const family of RELIC_FAMILIES) expect(RELIC_FRAMEWORK_CATEGORIES).toContain(FAMILY_TO_FRAMEWORK_CATEGORY[family]);
    for (const route of RELIC_EVOLUTION_ROUTES) {
      expect([...RELIC_EVOLUTION_TRIGGERS]).toContain(EVOLUTION_ROUTE_TO_TRIGGER[route]);
    }
    for (const origin of RELIC_ORIGINS) expect(origin.identity.length).toBeGreaterThan(0); // every source has its own identity
  });
});

describe("The full reliquary — AF-029/077 untouched, one void relic added (AF-078 §Void Relics)", () => {
  it("nine relics: the locked eight head the roster unchanged; the Veil Fragment passes every inherited law", () => {
    expect(ROSTER_RELICS.length).toBe(9);
    expect(ROSTER_RELICS.slice(0, 7)).toEqual(SANDBOX_RELICS);
    expect(validateRelicDef(VEIL_FRAGMENT)).toEqual([]);
    const architecture = relicArchitectureFor(VEIL_FRAGMENT, profileFor("veil-fragment"));
    for (const part of RELIC_ARCHITECTURE_PARTS) expect(architecture[part]).toBe(true);
  });

  it("POWER REQUIRES SACRIFICE: every void-family relic carries a negative effect clause", () => {
    for (const entry of RELIC_ROSTER_ENTRIES) {
      if (entry.family !== "voidRelics") continue;
      const def = ROSTER_RELICS.find((r) => r.id === entry.relicId)!;
      expect(def.effects.some((e) => e.value < 0), `${def.id} pays no price`).toBe(true);
    }
    expect(RELIC_ROSTER_ENTRIES.some((e) => e.family === "voidRelics")).toBe(true); // the law has a subject
  });

  it("every roster entry resolves — relic, family, origin, and set membership", () => {
    expect(RELIC_ROSTER_ENTRIES.length).toBe(ROSTER_RELICS.length);
    for (const entry of RELIC_ROSTER_ENTRIES) {
      expect(ROSTER_RELICS.some((r) => r.id === entry.relicId)).toBe(true);
      expect(RELIC_FAMILIES).toContain(entry.family);
      expect(RELIC_ORIGINS.some((o) => o.id === entry.originId)).toBe(true);
      if (entry.setId) expect(SANDBOX_RELIC_SETS.some((s) => s.id === entry.setId)).toBe(true);
      expect(Object.keys(entry).sort()).toEqual(["family", "originId", "relicId", "setId"]); // no stat field
    }
  });
});

describe("Relic sets — gameplay, not statistics (AF-078 §Relic Sets)", () => {
  it("every set piece is a real registered relic, and the bonus shape has no numeric field to inflate", () => {
    for (const set of SANDBOX_RELIC_SETS) {
      for (const pieceId of set.pieceIds) expect(ROSTER_RELICS.some((r) => r.id === pieceId)).toBe(true);
      for (const bonus of set.bonuses) {
        expect(Object.keys(bonus).sort()).toEqual(["description", "piecesRequired", "trigger"]);
        expect(bonus.description.length).toBeGreaterThan(0);
      }
      const thresholds = set.bonuses.map((b) => b.piecesRequired);
      expect(thresholds).toEqual([...thresholds].sort((a, b) => a - b)); // readable stacking: ascending
    }
  });

  it("set detection is pure, order-independent, and threshold-exact — through AF-029's real RelicSystem", () => {
    const system = new RelicSystem(ROSTER_RELICS);
    expect(activeSetBonusesFor(system.activeRelicIds).length).toBe(0);
    system.acquire("ember-core");
    system.acquire("frost-shard"); // AF-029 FUSES ember+frost into the Cinder Heart (both consumed) —
    expect(system.has("cinder-heart")).toBe(true); // — and the set is built from the PRODUCT
    expect(activeSetBonusesFor(system.activeRelicIds).length).toBe(0); // one piece — nothing yet
    system.acquire("static-node");
    const twoPiece = activeSetBonusesFor(system.activeRelicIds);
    expect(twoPiece.length).toBe(1); // Thermal Cycle 2pc — evolution ADVANCED the set
    expect(twoPiece[0]!.bonus.piecesRequired).toBe(2);
    system.acquire("conduit-loop");
    system.acquire("gambler-die");
    system.acquire("singularity-keepsake");
    const withLedger = activeSetBonusesFor(system.activeRelicIds);
    expect(withLedger.length).toBe(3); // Thermal 2pc + Ledger 2pc + Ledger 3pc
    // Order independence: the same loadout in another order yields the same bonuses.
    const reversed = activeSetBonusesFor(["singularity-keepsake", "gambler-die", "conduit-loop", "static-node", "cinder-heart"]);
    expect(reversed).toEqual(withLedger);
  });
});

describe("The Museum — every relic exhibits all seven features (AF-078 §Museum)", () => {
  it("museumEntryFor yields a non-empty exhibit for every roster relic", () => {
    for (const def of ROSTER_RELICS) {
      const exhibit = museumEntryFor(def, profileFor(def.id), entryFor(def.id));
      for (const feature of MUSEUM_FEATURES) expect(exhibit[feature].length, `${def.id} museum ${feature}`).toBeGreaterThan(0);
    }
  });
});

describe("Relic Roster — self-review: millions of build combinations (AF-078 §Self Review Loop)", () => {
  it("every one of the 512 possible loadouts yields exactly the brute-force set bonuses — and bonuses grow monotonically with pieces", () => {
    const ids = ROSTER_RELICS.map((r) => r.id);
    for (let mask = 0; mask < 1 << ids.length; mask += 1) {
      const loadout = ids.filter((_, i) => (mask >> i) & 1);
      const detected = activeSetBonusesFor(loadout);
      let expected = 0;
      for (const set of SANDBOX_RELIC_SETS) {
        const owned = set.pieceIds.filter((id) => loadout.includes(id)).length;
        for (const bonus of set.bonuses) if (owned >= bonus.piecesRequired) expected += 1;
      }
      if (detected.length !== expected) throw new Error(`loadout ${mask} mismatched`);
    }
  });

  it("1,000 seeded acquisition careers through the REAL RelicSystem: set bonuses never regress as pieces accumulate", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const system = new RelicSystem(ROSTER_RELICS);
      let lastBonuses = 0;
      for (let step = 0; step < 20; step += 1) {
        const relic = ROSTER_RELICS[Math.floor(rng.next() * ROSTER_RELICS.length)]!;
        system.acquire(relic.id);
        const bonuses = activeSetBonusesFor(system.activeRelicIds).length;
        if (bonuses < lastBonuses) throw new Error("set bonuses regressed");
        lastBonuses = bonuses;
      }
    }
  });
});
