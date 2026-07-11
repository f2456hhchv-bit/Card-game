import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { findShipOverlap, shipFingerprint, SANDBOX_SHIPS } from "../src/game/ships/shipData";
import { SHIP_ARCHITECTURE_PARTS, shipArchitectureFor } from "../src/game/ships/shipFrameworkData";
import {
  BUILD_ARCHITECTURE_KINDS,
  FLEET_ENTRIES,
  FLEET_PROFILES,
  LAUNCH_FLEET,
  LEGENDARY_TRAITS,
  MANUFACTURERS,
  MANUFACTURER_IDS,
  PROTOTYPE_MECHANICS,
  SHIP_BALANCE_AXES,
  SHIP_COLLECTION_KINDS,
  SHIP_RESEARCH_KINDS,
  SHIP_ROSTER_CUSTOMISATION,
  SHIP_ROSTER_STAT_KINDS,
  SHIP_SPECIALISATIONS,
  SHIP_TIERS,
  STARTING_SHIP_IDS,
  syntheticShipFor,
  type ShipCollectionKind,
} from "../src/game/ships/shipRosterData";
import { ShipCollectionRuntime } from "../src/game/ships/ShipCollectionRuntime";

describe("Ship Roster vocabulary — registered shelves (AF-074)", () => {
  it("registers twelve manufacturers, eight tiers, ten specialisations, seven build kinds, seven collection kinds, six research kinds, six legendary traits, five prototype mechanics, eight stat kinds, five balance axes, eight customisation kinds", () => {
    expect(MANUFACTURER_IDS.length).toBe(12);
    expect(SHIP_TIERS.length).toBe(8);
    expect(SHIP_SPECIALISATIONS.length).toBe(10);
    expect(BUILD_ARCHITECTURE_KINDS.length).toBe(7);
    expect(SHIP_COLLECTION_KINDS.length).toBe(7);
    expect(SHIP_RESEARCH_KINDS.length).toBe(6);
    expect(LEGENDARY_TRAITS.length).toBe(6);
    expect(PROTOTYPE_MECHANICS.length).toBe(5);
    expect(SHIP_ROSTER_STAT_KINDS.length).toBe(8);
    expect(SHIP_BALANCE_AXES.length).toBe(5);
    expect(SHIP_ROSTER_CUSTOMISATION.length).toBe(8);
  });

  it("ships never balance on raw statistics: the axis shelf excludes them", () => {
    expect(SHIP_BALANCE_AXES).not.toContain("rawStatistics" as never);
    expect(SHIP_BALANCE_AXES).not.toContain("damage" as never);
  });

  it("every manufacturer carries all five identity parts, and every fleet entry's manufacturer resolves", () => {
    for (const manufacturer of MANUFACTURERS) {
      expect(manufacturer.visualIdentity.length).toBeGreaterThan(0);
      expect(manufacturer.technologyPhilosophy.length).toBeGreaterThan(0);
      expect(manufacturer.engineeringStrengths.length).toBeGreaterThan(0);
      expect(manufacturer.historicalLore.length).toBeGreaterThan(0);
      expect(manufacturer.signatureSystem.length).toBeGreaterThan(0);
    }
    for (const entry of FLEET_ENTRIES) expect(MANUFACTURER_IDS).toContain(entry.manufacturerId);
  });
});

describe("The launch fleet — ten hulls, one specialisation each (AF-074 §Ship Specialisation)", () => {
  it("ships ten hulls on unchanged shapes with a specialisation BIJECTION, and the locked pair heads the fleet", () => {
    expect(LAUNCH_FLEET.length).toBe(10);
    expect(FLEET_PROFILES.length).toBe(10);
    expect(FLEET_ENTRIES.length).toBe(10);
    expect(LAUNCH_FLEET.slice(0, 2)).toEqual(SANDBOX_SHIPS); // AF-031's pair, untouched
    expect(new Set(FLEET_ENTRIES.map((e) => e.specialisation)).size).toBe(10); // one per specialisation
  });

  it("no two hulls overlap: AF-031's fingerprint law AND unique (trigger, passive bonus) pairs across all ten", () => {
    for (const ship of LAUNCH_FLEET) expect(findShipOverlap(ship, LAUNCH_FLEET)).toBeNull();
    expect(new Set(LAUNCH_FLEET.map(shipFingerprint)).size).toBe(10);
    const pairs = LAUNCH_FLEET.map((s) => `${s.passive.trigger}|${s.passive.bonus.kind}`);
    expect(new Set(pairs).size).toBe(10);
  });

  it("every hull passes AF-073's 22-part completeness function, and defence/offence PAIRS never repeat", () => {
    for (const ship of LAUNCH_FLEET) {
      const profile = FLEET_PROFILES.find((p) => p.shipId === ship.id)!;
      const architecture = shipArchitectureFor(ship, profile);
      for (const part of SHIP_ARCHITECTURE_PARTS) expect(architecture[part], `${ship.id} missing ${part}`).toBe(true);
    }
    const identityPairs = FLEET_PROFILES.map((p) => `${p.primaryDefence}|${p.offensiveIdentity}`);
    expect(new Set(identityPairs).size).toBe(10);
  });

  it("tiers affect acquisition, never viability: entries carry no stat field, and seven of eight tiers are in use — mythic honestly awaits its first hull", () => {
    for (const entry of FLEET_ENTRIES) {
      expect(Object.keys(entry).sort()).toEqual(["collectionKind", "discoveryMethod", "manufacturerId", "shipId", "specialisation", "tier"]);
      expect(SHIP_TIERS).toContain(entry.tier);
    }
    const usedTiers = new Set(FLEET_ENTRIES.map((e) => e.tier));
    expect(usedTiers.size).toBe(7);
    expect(usedTiers.has("mythic")).toBe(false); // registered vocabulary awaiting content — the bossId-null pattern
    // Legendary does not mean strictly stronger: the Dawnspire's hull is not the fleet's largest.
    const dawnspire = LAUNCH_FLEET.find((s) => s.id === "dawnspire")!;
    expect(Math.max(...LAUNCH_FLEET.map((s) => s.hull))).toBeGreaterThan(dawnspire.hull);
  });
});

describe("Collection — permanent, gated, append-only (AF-074 §Ship Collection)", () => {
  it("the Wayfarer starts collected; acquisition gates on each entry's registered collection kind; nothing can be un-collected", () => {
    const fleet = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
    expect(fleet.snapshot.collectedCount).toBe(1);
    expect(fleet.isCollected("wayfarer-hull-mk2")).toBe(true);
    const none = new Set<ShipCollectionKind>();
    expect(fleet.tryCollect("dawnspire", none)).toBe(false);
    const legendaryReached = new Set<ShipCollectionKind>(["legendaryShips"]);
    expect(fleet.tryCollect("dawnspire", legendaryReached)).toBe(true);
    expect(fleet.tryCollect("dawnspire", legendaryReached)).toBe(false); // append-only
    fleet.recordMission("dawnspire", true);
    fleet.recordMission("dawnspire", false);
    expect(fleet.statsFor("dawnspire").successRate).toBe(0.5); // derived, never stored
    fleet.recordMission("maelstrom-x1", true); // not collected — ignored
    expect(fleet.statsFor("maelstrom-x1").uses).toBe(0);
    const api = Object.getOwnPropertyNames(ShipCollectionRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|retire|scrap/i.test(name)).toBe(false);
  });
});

describe("GP-003 §Ship Progression — ShipCollectionRuntime save/load round-trip (no Ship should become obsolete)", () => {
  it("toSave/loadSave round-trips collected hulls, uses, and successes", () => {
    const fleet = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
    fleet.tryCollect("dawnspire", new Set<ShipCollectionKind>(["legendaryShips"]));
    fleet.recordMission("dawnspire", true);
    fleet.recordMission("dawnspire", false);
    const saved = fleet.toSave();

    const restored = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
    restored.loadSave(saved);
    expect(restored.isCollected("dawnspire")).toBe(true);
    expect(restored.statsFor("dawnspire")).toEqual(fleet.statsFor("dawnspire"));
    expect(restored.snapshot).toEqual(fleet.snapshot);
  });

  it("drops unknown ship ids on load rather than throwing (deprecation-safe)", () => {
    const fleet = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
    fleet.loadSave({ collected: ["not-a-real-hull"], uses: { "not-a-real-hull": 4 }, successes: {} });
    expect(fleet.isCollected("not-a-real-hull")).toBe(false);
  });
});

describe("Long-term fleet — 25+/50+/100+ without redesign (AF-074 §Output)", () => {
  it("one hundred synthetic hulls pass AF-031's overlap law and AF-073's completeness function on unchanged shapes", () => {
    const synthetics = Array.from({ length: 100 }, (_, i) => syntheticShipFor(i));
    const combined = [...LAUNCH_FLEET, ...synthetics.map((s) => s.def)];
    expect(new Set(combined.map(shipFingerprint)).size).toBe(combined.length); // 110 distinct fingerprints
    for (const { def, profile, entry } of synthetics) {
      const architecture = shipArchitectureFor(def, profile);
      for (const part of SHIP_ARCHITECTURE_PARTS) expect(architecture[part]).toBe(true);
      expect(MANUFACTURER_IDS).toContain(entry.manufacturerId);
    }
  });
});

describe("Ship Roster — self-review: play every ship (AF-074 §Self Review Loop)", () => {
  it("1,000 seeded fleet careers keep collection and statistics consistent — and no hull is ever lost", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const fleet = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
      const reached = new Set<ShipCollectionKind>();
      let expectedUses = 0;
      let lastCollected = 1;
      for (let step = 0; step < 60; step += 1) {
        const roll = rng.next();
        if (roll < 0.2) {
          reached.add(SHIP_COLLECTION_KINDS[Math.floor(rng.next() * SHIP_COLLECTION_KINDS.length)]!);
        } else if (roll < 0.5) {
          const target = FLEET_ENTRIES[Math.floor(rng.next() * FLEET_ENTRIES.length)]!;
          fleet.tryCollect(target.shipId, reached);
        } else {
          const ids = fleet.collectedIds;
          fleet.recordMission(ids[Math.floor(rng.next() * ids.length)]!, rng.next() < 0.6);
          expectedUses += 1;
        }
        const snap = fleet.snapshot;
        if (snap.totalUses !== expectedUses) throw new Error("usage ledger drifted");
        if (snap.collectedCount < lastCollected) throw new Error("a hull was lost");
        lastCollected = snap.collectedCount;
      }
      expect(fleet.isCollected("wayfarer-hull-mk2")).toBe(true);
    }
  });
});
