import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { aggregateLoadout, validateLoadout } from "../src/game/equipment/EquipmentAggregate";
import {
  EQUIPMENT_SLOTS,
  SANDBOX_EQUIPMENT,
  SANDBOX_SETS,
  type EquipmentSlot,
} from "../src/game/equipment/equipmentData";

const itemsById = new Map(SANDBOX_EQUIPMENT.map((item) => [item.id, item]));

describe("validateLoadout (AF-028 §6)", () => {
  it("accepts a valid loadout", () => {
    const result = validateLoadout({ primaryWeapon: "refit-cannon", equipment1: "barrier-plate" }, itemsById);
    expect(result).toEqual({ ok: true });
  });

  it("rejects slot-type mismatches with the slot and item named", () => {
    const result = validateLoadout({ primaryWeapon: "barrier-plate" }, itemsById);
    expect(result).toEqual({ ok: false, reason: "slotTypeMismatch", slot: "primaryWeapon", itemId: "barrier-plate" });
  });

  it("rejects missing dependencies by name", () => {
    const result = validateLoadout({ equipment1: "ancient-relay" }, itemsById);
    expect(result).toEqual({
      ok: false,
      reason: "missingDependency",
      itemId: "ancient-relay",
      requiresCategory: "primaryWeapon",
    });
  });

  it("satisfies a dependency once the required category is present", () => {
    const result = validateLoadout(
      { primaryWeapon: "refit-cannon", equipment1: "ancient-relay" },
      itemsById,
    );
    expect(result).toEqual({ ok: true });
  });

  it("rejects duplicate unique-exclusive items", () => {
    const result = validateLoadout(
      { primaryWeapon: "refit-cannon", equipment1: "ancient-relay", equipment2: "ancient-relay" },
      itemsById,
    );
    expect(result).toEqual({ ok: false, reason: "duplicateUniqueExclusive", itemId: "ancient-relay" });
  });
});

describe("aggregateLoadout — stat aggregation (AF-028 §3)", () => {
  it("sums bonuses additively across items", () => {
    const result = aggregateLoadout(
      { primaryWeapon: "refit-cannon", equipment1: "barrier-plate" },
      itemsById,
      [],
    );
    expect(result.bonuses.damage).toBeCloseTo(0.1, 5);
    expect(result.bonuses.shieldCapacity).toBeCloseTo(15, 5);
  });

  it("collects passives and active modules from equipped items", () => {
    const result = aggregateLoadout({ equipment1: "barrier-plate" }, itemsById, []);
    expect(result.passives).toHaveLength(1);
    expect(result.passives[0]?.trigger).toBe("onShieldBreak");
  });

  it("is deterministic for the same input", () => {
    const slots = { primaryWeapon: "refit-cannon", equipment1: "barrier-plate", equipment2: "vanguard-thrusters" };
    const a = aggregateLoadout(slots, itemsById, SANDBOX_SETS);
    const b = aggregateLoadout(slots, itemsById, SANDBOX_SETS);
    expect(a).toEqual(b);
  });
});

describe("aggregateLoadout — set bonuses (AF-028 §5)", () => {
  it("grants threshold bonuses additively, never subtracting individual stats", () => {
    const twoPiece = aggregateLoadout(
      { equipment1: "barrier-plate", equipment2: "vanguard-thrusters" },
      itemsById,
      SANDBOX_SETS,
    );
    expect(twoPiece.activeSetBonuses).toEqual([{ setId: "vanguard", piecesEquipped: 2, thresholdsMet: [2] }]);
    expect(twoPiece.bonuses.boostEfficiency).toBeCloseTo(0.1, 5);
    // Individual piece stats remain present alongside the set bonus.
    expect(twoPiece.bonuses.shieldCapacity).toBeCloseTo(15, 5);
    expect(twoPiece.bonuses.movementSpeed).toBeCloseTo(0.08, 5);

    const threePiece = aggregateLoadout(
      { equipment1: "barrier-plate", equipment2: "vanguard-thrusters", equipment3: "vanguard-core" },
      itemsById,
      SANDBOX_SETS,
    );
    expect(threePiece.activeSetBonuses[0]?.thresholdsMet).toEqual([2, 3]);
    // Threshold-3 bonus stacks on top of threshold-2 and individual stats.
    expect(threePiece.bonuses.shieldCapacity).toBeCloseTo(15 + 25, 5);
  });

  it("removing a set piece only removes that piece's own contribution", () => {
    const withThree = aggregateLoadout(
      { equipment1: "barrier-plate", equipment2: "vanguard-thrusters", equipment3: "vanguard-core" },
      itemsById,
      SANDBOX_SETS,
    );
    const withTwo = aggregateLoadout(
      { equipment1: "barrier-plate", equipment2: "vanguard-thrusters" },
      itemsById,
      SANDBOX_SETS,
    );
    // cooldownReduction came only from vanguard-core — it disappears.
    expect(withThree.bonuses.cooldownReduction).toBeCloseTo(0.1, 5);
    expect(withTwo.bonuses.cooldownReduction).toBeUndefined();
    // But shieldCapacity from barrier-plate itself is untouched (15 stays present).
    expect(withTwo.bonuses.shieldCapacity).toBeCloseTo(15, 5); // threshold-3 (+25) dropped, individual (15) remains
  });
});

describe("Equipment — thousands of randomised combinations (AF-028 self-review)", () => {
  it("every random loadout either validates cleanly or fails with a named reason", () => {
    const rng = new Rng(2026).fork("equipment-fuzz");
    const slotNames = [...EQUIPMENT_SLOTS];
    const itemIds = SANDBOX_EQUIPMENT.map((i) => i.id);

    for (let trial = 0; trial < 5000; trial += 1) {
      const slots: Partial<Record<EquipmentSlot, string>> = {};
      const slotCount = rng.int(1, 4);
      for (let i = 0; i < slotCount; i += 1) {
        const slot = rng.pick(slotNames);
        const itemId = rng.pick(itemIds);
        slots[slot] = itemId;
      }

      const validation = validateLoadout(slots, itemsById);
      expect(["ok", "slotTypeMismatch", "duplicateUniqueExclusive", "missingDependency"]).toContain(
        validation.ok ? "ok" : validation.reason,
      );

      if (validation.ok) {
        const result = aggregateLoadout(slots, itemsById, SANDBOX_SETS);
        // Aggregation invariants: no NaN, power rating non-negative, set
        // bonuses only present when pieces are actually equipped.
        for (const value of Object.values(result.bonuses)) {
          expect(Number.isFinite(value)).toBe(true);
        }
        expect(result.powerRating).toBeGreaterThanOrEqual(0);
        for (const setBonus of result.activeSetBonuses) {
          expect(setBonus.piecesEquipped).toBeGreaterThan(0);
        }
      }
    }
  });
});
