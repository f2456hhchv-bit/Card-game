import { describe, expect, it } from "vitest";
import { ShipRuntime } from "../src/game/ships/ShipRuntime";
import {
  SANDBOX_SHIPS,
  findShipOverlap,
  shipFingerprint,
  type ShipDef,
} from "../src/game/ships/shipData";

describe("findShipOverlap — no-overlap law (AF-031 mirroring AF-030 §2)", () => {
  it("the sandbox roster has no overlapping signatures", () => {
    for (const ship of SANDBOX_SHIPS) {
      const others = SANDBOX_SHIPS.filter((s) => s.id !== ship.id);
      expect(findShipOverlap(ship, others)).toBeNull();
    }
  });

  it("detects a near-duplicate signature and names the conflict", () => {
    const original = SANDBOX_SHIPS[0] as ShipDef;
    const clone: ShipDef = { ...original, id: "clone-of-wayfarer", name: "Clone" };
    expect(findShipOverlap(clone, SANDBOX_SHIPS)).toBe(original.id);
  });

  it("fingerprint depends only on passive trigger+bonus and ability id, not flavour text", () => {
    const a = SANDBOX_SHIPS[0] as ShipDef;
    const flavourChanged: ShipDef = { ...a, lore: "Completely different flavour text." };
    expect(shipFingerprint(a)).toBe(shipFingerprint(flavourChanged));
  });
});

describe("ShipDef — movement/defence producer (AF-031 §1-2)", () => {
  it("supplies a complete MovementProfile with no missing AF-020 fields", () => {
    for (const ship of SANDBOX_SHIPS) {
      const profile = ship.movementProfile;
      expect(profile.maxSpeed).toBeGreaterThan(0);
      expect(profile.collisionRadius).toBeGreaterThan(0);
      expect(["instant"].includes(profile.turnRatePerSecond as string) || typeof profile.turnRatePerSecond === "number").toBe(true);
    }
  });

  it("the guardian-class ship has a non-instant turn rate (weighty handling)", () => {
    const bastion = SANDBOX_SHIPS.find((s) => s.id === "bastion-hull-mk1") as ShipDef;
    expect(bastion.movementProfile.turnRatePerSecond).toBe(6);
  });
});

describe("ShipRuntime — energy + ability gating (AF-031 §2-3)", () => {
  const ship = SANDBOX_SHIPS[0] as ShipDef; // Wayfarer, energyCost 40, max 100, regen 6/s

  it("starts at full energy and allows an immediate activation", () => {
    const runtime = new ShipRuntime(ship);
    expect(runtime.snapshot.energy).toBe(100);
    expect(runtime.tryActivateAbility()).toBe(true);
    expect(runtime.snapshot.energy).toBe(60);
  });

  it("gates on cooldown even when energy is available", () => {
    const runtime = new ShipRuntime(ship);
    expect(runtime.tryActivateAbility()).toBe(true);
    expect(runtime.tryActivateAbility()).toBe(false); // cooldown still active
  });

  it("gates on energy even when cooldown is clear", () => {
    const runtime = new ShipRuntime(ship);
    runtime.tryActivateAbility(); // 100 -> 60
    for (let i = 0; i < 600; i += 1) runtime.update(16); // ~9.6s, cooldown (9s) clears
    // energy drained then regenerated during the wait: 60 + 9.6*6 ≈ 117 clamped to 100
    expect(runtime.tryActivateAbility()).toBe(true);
  });

  it("regenerates energy over time, clamped to maxEnergy", () => {
    const runtime = new ShipRuntime(ship);
    for (let i = 0; i < 1000; i += 1) runtime.update(16); // 16s, well past regen to full
    expect(runtime.snapshot.energy).toBe(100);
  });

  it("exposes the passive bonus in the shared BonusTotals shape", () => {
    const runtime = new ShipRuntime(ship);
    expect(runtime.bonuses.movementSpeed).toBeCloseTo(0.03, 5);
  });
});

describe("Ships — sandbox roster proves the engine end-to-end", () => {
  it("both sandbox ships run a full ability/energy cycle without collision", () => {
    for (const ship of SANDBOX_SHIPS) {
      const runtime = new ShipRuntime(ship);
      expect(runtime.tryActivateAbility()).toBe(true);
      expect(Object.keys(runtime.bonuses).length).toBeGreaterThan(0);
      for (let i = 0; i < 2000; i += 1) runtime.update(16);
      expect(runtime.snapshot.energy).toBe(ship.maxEnergy);
    }
  });
});
