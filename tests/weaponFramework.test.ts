import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  FIRE_PATTERNS,
  PROJECTILE_BEHAVIOURS,
  SANDBOX_WEAPONS,
  WEAPON_CATEGORIES,
  findWeaponOverlap,
  weaponFingerprint,
} from "../src/game/weapons/weaponData";
import {
  ELEMENT_TO_STATUS,
  FIRE_MODES,
  FIRE_MODE_TO_PATTERN,
  FRAMEWORK_CATEGORY_TO_WEAPON_CATEGORY,
  FRAMEWORK_WEAPONS,
  HAILBORN_ARRAY,
  PROJECTILE_SYSTEM_KINDS,
  PROJECTILE_SYSTEM_TO_BEHAVIOUR,
  WEAPON_ARCHITECTURE_PARTS,
  WEAPON_CUSTOMISATION_KINDS,
  WEAPON_ELEMENTS,
  WEAPON_EVOLUTION_SOURCES,
  WEAPON_FRAMEWORK_CATEGORIES,
  WEAPON_MASTERY_METRICS,
  WEAPON_PROFILES,
  WEAPON_SYNERGY_SURFACES,
  weaponArchitectureFor,
} from "../src/game/weapons/weaponFrameworkData";
import { WeaponMasteryRuntime } from "../src/game/weapons/WeaponMasteryRuntime";
import { STATUS_RULES } from "../src/game/combat/combatTuning";

function profileFor(weaponId: string) {
  return WEAPON_PROFILES.find((p) => p.weaponId === weaponId)!;
}

describe("Weapon Framework vocabulary — registered shelves (AF-075)", () => {
  it("registers seventeen categories, twenty architecture parts, ten fire modes, ten projectile kinds, ten elements, six evolution sources, eight mastery metrics, seven synergy surfaces, seven customisation kinds", () => {
    expect(WEAPON_FRAMEWORK_CATEGORIES.length).toBe(17);
    expect(WEAPON_ARCHITECTURE_PARTS.length).toBe(20);
    expect(FIRE_MODES.length).toBe(10);
    expect(PROJECTILE_SYSTEM_KINDS.length).toBe(10);
    expect(WEAPON_ELEMENTS.length).toBe(10);
    expect(WEAPON_EVOLUTION_SOURCES.length).toBe(6);
    expect(WEAPON_MASTERY_METRICS.length).toBe(8);
    expect(WEAPON_SYNERGY_SURFACES.length).toBe(7);
    expect(WEAPON_CUSTOMISATION_KINDS.length).toBe(7);
  });

  it("all three spec vocabularies map TOTALLY onto AF-032's locked shelves — naming layers, never new engines", () => {
    for (const category of WEAPON_FRAMEWORK_CATEGORIES) expect(WEAPON_CATEGORIES).toContain(FRAMEWORK_CATEGORY_TO_WEAPON_CATEGORY[category]);
    for (const mode of FIRE_MODES) expect(FIRE_PATTERNS).toContain(FIRE_MODE_TO_PATTERN[mode]);
    for (const kind of PROJECTILE_SYSTEM_KINDS) expect(PROJECTILE_BEHAVIOURS).toContain(PROJECTILE_SYSTEM_TO_BEHAVIOUR[kind]);
  });

  it("elements integrate with AF-021's status system by total mapping — kinetic maps to none, purity is a mapping too", () => {
    for (const element of WEAPON_ELEMENTS) {
      const status = ELEMENT_TO_STATUS[element];
      if (element === "kinetic") expect(status).toBeNull();
      else expect(Object.keys(STATUS_RULES)).toContain(status!);
    }
  });
});

describe("The extended arsenal — AF-032 untouched, one cryo weapon added (AF-075 §Weapon Categories)", () => {
  it("AF-032's sandbox four remain the unmodified head; the Hailborn Array joins additively; the overlap law holds", () => {
    expect(FRAMEWORK_WEAPONS.length).toBe(5);
    expect(FRAMEWORK_WEAPONS.slice(0, 4)).toEqual(SANDBOX_WEAPONS);
    for (const weapon of FRAMEWORK_WEAPONS) expect(findWeaponOverlap(weapon, FRAMEWORK_WEAPONS)).toBeNull();
    expect(new Set(FRAMEWORK_WEAPONS.map(weaponFingerprint)).size).toBe(5);
    expect(HAILBORN_ARRAY.statusOnHit?.kind).toBe("freeze"); // the freeze status's first WEAPON producer
  });

  it("all twenty architecture parts are present for every profiled weapon — nothing remains undefined", () => {
    for (const weapon of FRAMEWORK_WEAPONS) {
      const architecture = weaponArchitectureFor(weapon, profileFor(weapon.id));
      for (const part of WEAPON_ARCHITECTURE_PARTS) expect(architecture[part], `${weapon.id} missing ${part}`).toBe(true);
    }
  });

  it("every profile's element is consistent with its def's status — the element layer names what the weapon already does", () => {
    for (const weapon of FRAMEWORK_WEAPONS) {
      const profile = profileFor(weapon.id);
      const elementStatus = ELEMENT_TO_STATUS[profile.element];
      if (weapon.statusOnHit) expect(elementStatus).toBe(weapon.statusOnHit.kind);
      else expect(elementStatus).toBeNull(); // kinetic — no status, honestly
    }
  });

  it("evolution enhances identity, not replaces it — AF-032's own precedent: name lineage and manufacturer survive evolution", () => {
    for (const weapon of FRAMEWORK_WEAPONS) {
      if (!weapon.evolution) continue;
      const evolved = FRAMEWORK_WEAPONS.find((w) => w.id === weapon.evolution!.evolvesInto);
      if (!evolved) continue;
      expect(evolved.name.startsWith(weapon.name)).toBe(true); // Coil Ripper → Coil Ripper Mk. II
      expect(evolved.manufacturer).toBe(weapon.manufacturer);
      expect(profileFor(weapon.id).evolutionSource).not.toBeNull(); // a registered source drives it
    }
  });
});

describe("Weapon mastery — an append-only ledger with derived accuracy (AF-075 §Weapon Mastery)", () => {
  it("accumulates shots, hits, criticals, kills, and boss damage; accuracy is derived and clamped; no erasure exists", () => {
    const mastery = new WeaponMasteryRuntime(profileFor("coil-ripper"));
    mastery.recordShots(10);
    mastery.recordHit(false);
    mastery.recordHit(true);
    mastery.recordKills(2);
    mastery.recordBossDamage(35.5);
    const snap = mastery.snapshot;
    expect(snap.shots).toBe(10);
    expect(snap.hits).toBe(2);
    expect(snap.criticalHits).toBe(1);
    expect(snap.kills).toBe(2);
    expect(snap.bossDamage).toBe(35.5);
    expect(snap.accuracy).toBe(0.2); // derived, never stored
    expect(snap.elementStatus).toBe("shock"); // electrical, through the total map
    const api = Object.getOwnPropertyNames(WeaponMasteryRuntime.prototype);
    for (const name of api) expect(/reset|clear|wipe|delete/i.test(name)).toBe(false);
  });
});

describe("Weapon Framework — self-review: play every weapon (AF-075 §Self Review Loop)", () => {
  it("1,000 seeded combat careers across all five weapons keep the mastery ledger consistent", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const profile = WEAPON_PROFILES[career % WEAPON_PROFILES.length]!;
      const mastery = new WeaponMasteryRuntime(profile);
      let shots = 0;
      let hits = 0;
      for (let step = 0; step < 80; step += 1) {
        const roll = rng.next();
        if (roll < 0.5) {
          const fired = 1 + Math.floor(rng.next() * 4);
          mastery.recordShots(fired);
          shots += fired;
        } else if (roll < 0.85) {
          mastery.recordHit(rng.next() < 0.2);
          hits += 1;
        } else {
          mastery.recordKills(1);
        }
        const snap = mastery.snapshot;
        if (snap.shots !== shots || snap.hits !== hits) throw new Error("mastery ledger drifted");
        if (snap.accuracy < 0 || snap.accuracy > 1) throw new Error("accuracy out of range");
      }
    }
  });
});
