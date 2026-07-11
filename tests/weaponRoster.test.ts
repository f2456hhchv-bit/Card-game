import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_WEAPONS, findWeaponOverlap, weaponFingerprint } from "../src/game/weapons/weaponData";
import {
  ELEMENT_TO_STATUS,
  WEAPON_ARCHITECTURE_PARTS,
  WEAPON_FRAMEWORK_CATEGORIES,
  weaponArchitectureFor,
} from "../src/game/weapons/weaponFrameworkData";
import {
  ALL_WEAPON_FAMILIES,
  ARSENAL_ENTRIES,
  ARSENAL_PROFILES,
  LAUNCH_ARSENAL,
  LEGENDARY_WEAPON_TRAITS,
  PROTOTYPE_WEAPON_MECHANICS,
  STARTING_WEAPON_IDS,
  WEAPON_COLLECTION_KINDS,
  WEAPON_MANUFACTURERS,
  WEAPON_MANUFACTURER_IDS,
  WEAPON_ROSTER_BALANCE_AXES,
  WEAPON_ROSTER_RESEARCH_KINDS,
  WEAPON_ROSTER_STATS,
  WEAPON_TIERS,
  syntheticWeaponFor,
  type WeaponCollectionKind,
} from "../src/game/weapons/weaponRosterData";
import { WeaponCollectionRuntime } from "../src/game/weapons/WeaponCollectionRuntime";

function profileFor(weaponId: string) {
  return ARSENAL_PROFILES.find((p) => p.weaponId === weaponId)!;
}

describe("Weapon Roster vocabulary — registered shelves (AF-076)", () => {
  it("registers fourteen manufacturers, eight tiers, twenty-three families (twenty-one AF-076 + GP-004's summon/biological), seven collection kinds, six research kinds, seven legendary traits, seven prototype mechanics, eight stat kinds, five balance axes", () => {
    expect(WEAPON_MANUFACTURER_IDS.length).toBe(14);
    expect(WEAPON_TIERS.length).toBe(8);
    expect(ALL_WEAPON_FAMILIES.length).toBe(23);
    expect(WEAPON_COLLECTION_KINDS.length).toBe(7);
    expect(WEAPON_ROSTER_RESEARCH_KINDS.length).toBe(6);
    expect(LEGENDARY_WEAPON_TRAITS.length).toBe(7);
    expect(PROTOTYPE_WEAPON_MECHANICS.length).toBe(7);
    expect(WEAPON_ROSTER_STATS.length).toBe(8);
    expect(WEAPON_ROSTER_BALANCE_AXES.length).toBe(5);
    expect(WEAPON_ROSTER_BALANCE_AXES).not.toContain("numericalSuperiority" as never);
  });

  it("every manufacturer carries all six identity parts, and every arsenal entry's manufacturer resolves", () => {
    for (const manufacturer of WEAPON_MANUFACTURERS) {
      expect(manufacturer.visualIdentity.length).toBeGreaterThan(0);
      expect(manufacturer.engineeringStyle.length).toBeGreaterThan(0);
      expect(manufacturer.technologyFocus.length).toBeGreaterThan(0);
      expect(manufacturer.lore.length).toBeGreaterThan(0);
      expect(manufacturer.audioProfile.length).toBeGreaterThan(0);
      expect(manufacturer.signatureMechanic.length).toBeGreaterThan(0);
    }
    for (const entry of ARSENAL_ENTRIES) expect(WEAPON_MANUFACTURER_IDS).toContain(entry.manufacturerId);
  });

  it("the spec's four example categories carry four families each, and every family's category is on AF-075's shelf", () => {
    for (const exampleCategory of ["railguns", "laserArrays", "missileLaunchers", "gravityWeapons"] as const) {
      expect(ALL_WEAPON_FAMILIES.filter((f) => f.category === exampleCategory).length).toBe(4);
    }
    for (const family of ALL_WEAPON_FAMILIES) expect(WEAPON_FRAMEWORK_CATEGORIES).toContain(family.category);
    expect(new Set(ALL_WEAPON_FAMILIES.map((f) => f.id)).size).toBe(ALL_WEAPON_FAMILIES.length);
  });
});

describe("The launch arsenal — twelve weapons on unchanged shapes (AF-076/GP-004 §Weapon Families)", () => {
  it("ships twelve weapons; AF-032's four, AF-075's five, and GP-004's two head the arsenal unchanged; the overlap law holds across all twelve", () => {
    expect(LAUNCH_ARSENAL.length).toBe(12);
    expect(ARSENAL_PROFILES.length).toBe(12);
    expect(ARSENAL_ENTRIES.length).toBe(12);
    expect(LAUNCH_ARSENAL.slice(0, 4)).toEqual(SANDBOX_WEAPONS);
    for (const weapon of LAUNCH_ARSENAL) expect(findWeaponOverlap(weapon, LAUNCH_ARSENAL)).toBeNull();
    expect(new Set(LAUNCH_ARSENAL.map(weaponFingerprint)).size).toBe(12);
  });

  it("every weapon passes AF-075's twenty-part completeness function AND its element/status consistency law", () => {
    for (const weapon of LAUNCH_ARSENAL) {
      const profile = profileFor(weapon.id);
      const architecture = weaponArchitectureFor(weapon, profile);
      for (const part of WEAPON_ARCHITECTURE_PARTS) expect(architecture[part], `${weapon.id} missing ${part}`).toBe(true);
      const elementStatus = ELEMENT_TO_STATUS[profile.element];
      if (weapon.statusOnHit) expect(elementStatus).toBe(weapon.statusOnHit.kind);
      else expect(elementStatus).toBeNull();
    }
  });

  it("every entry's family resolves and matches its profile's framework category", () => {
    for (const entry of ARSENAL_ENTRIES) {
      const family = ALL_WEAPON_FAMILIES.find((f) => f.id === entry.familyId)!;
      expect(family).toBeDefined();
      expect(family.category).toBe(profileFor(entry.weaponId).frameworkCategory);
    }
  });

  it("tiers affect acquisition, never viability: no stat field, mythic honestly empty, the legendary is not the biggest number", () => {
    for (const entry of ARSENAL_ENTRIES) {
      expect(Object.keys(entry).sort()).toEqual(["collectionKind", "discoveryMethod", "familyId", "manufacturerId", "tier", "weaponId"]);
    }
    const usedTiers = new Set(ARSENAL_ENTRIES.map((e) => e.tier));
    expect(usedTiers.has("mythic")).toBe(false); // registered vocabulary awaiting content
    const sunlance = LAUNCH_ARSENAL.find((w) => w.id === "foundry-sunlance")!;
    expect(Math.max(...LAUNCH_ARSENAL.map((w) => w.baseDamage))).toBeGreaterThan(sunlance.baseDamage); // legendary ≠ strongest
  });

  it("prototype gameplay makes AF-075's dormant heat register a discipline: the Flux Driver runs the hottest heat in the arsenal", () => {
    const flux = profileFor("paragon-flux-driver");
    for (const profile of ARSENAL_PROFILES) {
      if (profile.weaponId === "paragon-flux-driver") continue;
      expect(flux.heatGenerationPerShot).toBeGreaterThan(profile.heatGenerationPerShot);
    }
    const fluxEntry = ARSENAL_ENTRIES.find((e) => e.weaponId === "paragon-flux-driver")!;
    expect(fluxEntry.tier).toBe("prototype");
  });
});

describe("Collection — permanent, gated, append-only (AF-076 §Weapon Collection)", () => {
  it("the Coil Ripper starts collected; acquisition gates on registered kinds; nothing can be un-collected", () => {
    const arsenal = new WeaponCollectionRuntime(ARSENAL_ENTRIES, STARTING_WEAPON_IDS);
    expect(arsenal.snapshot.collectedCount).toBe(1);
    const none = new Set<WeaponCollectionKind>();
    expect(arsenal.tryCollect("foundry-sunlance", none)).toBe(false);
    const legendary = new Set<WeaponCollectionKind>(["legendaryWeapons"]);
    expect(arsenal.tryCollect("foundry-sunlance", legendary)).toBe(true);
    expect(arsenal.tryCollect("foundry-sunlance", legendary)).toBe(false); // append-only
    arsenal.recordUse("foundry-sunlance");
    expect(arsenal.usesFor("foundry-sunlance")).toBe(1);
    arsenal.recordUse("paragon-flux-driver"); // not collected — ignored
    expect(arsenal.usesFor("paragon-flux-driver")).toBe(0);
    const api = Object.getOwnPropertyNames(WeaponCollectionRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|retire|scrap/i.test(name)).toBe(false);
  });
});

describe("Long-term arsenal — limitless expansion without redesign (AF-076 §Output)", () => {
  it("one hundred synthetic weapons pass AF-032's overlap law and AF-075's completeness function on unchanged shapes", () => {
    const synthetics = Array.from({ length: 100 }, (_, i) => syntheticWeaponFor(i));
    const combined = [...LAUNCH_ARSENAL, ...synthetics.map((s) => s.def)];
    expect(new Set(combined.map(weaponFingerprint)).size).toBe(combined.length); // 112 distinct fingerprints
    for (const { def, profile, entry } of synthetics) {
      const architecture = weaponArchitectureFor(def, profile);
      for (const part of WEAPON_ARCHITECTURE_PARTS) expect(architecture[part]).toBe(true);
      expect(WEAPON_MANUFACTURER_IDS).toContain(entry.manufacturerId);
    }
  });
});

describe("Weapon Roster — self-review: play every weapon (AF-076 §Self Review Loop)", () => {
  it("1,000 seeded arsenal careers keep collection and statistics consistent — and no weapon is ever lost", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const arsenal = new WeaponCollectionRuntime(ARSENAL_ENTRIES, STARTING_WEAPON_IDS);
      const reached = new Set<WeaponCollectionKind>();
      let expectedUses = 0;
      let lastCollected = 1;
      for (let step = 0; step < 60; step += 1) {
        const roll = rng.next();
        if (roll < 0.2) {
          reached.add(WEAPON_COLLECTION_KINDS[Math.floor(rng.next() * WEAPON_COLLECTION_KINDS.length)]!);
        } else if (roll < 0.5) {
          const target = ARSENAL_ENTRIES[Math.floor(rng.next() * ARSENAL_ENTRIES.length)]!;
          arsenal.tryCollect(target.weaponId, reached);
        } else {
          const ids = arsenal.collectedIds;
          arsenal.recordUse(ids[Math.floor(rng.next() * ids.length)]!);
          expectedUses += 1;
        }
        const snap = arsenal.snapshot;
        if (snap.totalUses !== expectedUses) throw new Error("usage ledger drifted");
        if (snap.collectedCount < lastCollected) throw new Error("a weapon was lost");
        lastCollected = snap.collectedCount;
      }
      expect(arsenal.isCollected("coil-ripper")).toBe(true);
    }
  });
});
