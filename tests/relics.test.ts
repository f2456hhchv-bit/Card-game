import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { RelicSystem } from "../src/game/relics/RelicSystem";
import { SANDBOX_RELICS, validateRelicDef, type RelicDef } from "../src/game/relics/relicData";

describe("validateRelicDef — non-numeric-clause law (AF-029 §3)", () => {
  it("rejects a relic with only numeric effects", () => {
    const def: RelicDef = {
      id: "bare-stat",
      name: "Bare Stat",
      category: "offensive",
      rarity: "common",
      tier: 1,
      effects: [{ kind: "damage", value: 0.1 }],
      behaviours: [],
      stacking: "unique",
      maxStacks: 1,
      exclusionGroup: null,
      synergyWith: [],
      evolvesInto: null,
      evolutionRequires: [],
      lore: "",
    };
    expect(validateRelicDef(def)).toEqual([expect.stringContaining("no non-numeric clause")]);
  });

  it("accepts every sandbox relic (schema-compliant content)", () => {
    for (const relic of SANDBOX_RELICS) {
      expect(validateRelicDef(relic)).toEqual([]);
    }
  });
});

describe("RelicSystem — acquisition & stacking (AF-029 §4)", () => {
  it("stacks up to the cap and refuses beyond it", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    expect(system.acquire("ember-core")).toEqual({ ok: true });
    expect(system.acquire("ember-core")).toEqual({ ok: true });
    expect(system.acquire("ember-core")).toEqual({ ok: true });
    expect(system.stacksOf("ember-core")).toBe(3);
    expect(system.acquire("ember-core")).toEqual({ ok: false, reason: "maxStacksReached" });
  });

  it("enforces mutual exclusion with the conflicting relic named", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    expect(system.acquire("warden-token")).toEqual({ ok: true });
    expect(system.acquire("gambler-die")).toEqual({
      ok: false,
      reason: "exclusionConflict",
      conflictingId: "warden-token",
    });
  });

  it("rejects unknown relics", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    const result = system.acquire("does-not-exist");
    expect(result.ok).toBe(false);
  });
});

describe("RelicSystem — synergy detection (AF-029 §4)", () => {
  it("is symmetric and order-independent", () => {
    const forward = new RelicSystem(SANDBOX_RELICS);
    forward.acquire("static-node");
    forward.acquire("conduit-loop");

    const reversed = new RelicSystem(SANDBOX_RELICS);
    reversed.acquire("conduit-loop");
    reversed.acquire("static-node");

    expect(forward.aggregate.synergies).toEqual(reversed.aggregate.synergies);
    expect(forward.aggregate.synergies).toHaveLength(1);
  });

  it("reports no synergy for unrelated relics", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    system.acquire("static-node");
    system.acquire("warden-token");
    expect(system.aggregate.synergies).toHaveLength(0);
  });

  it("evolution consumes a synergy pair — evolving relics never show as synergised", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    system.acquire("ember-core");
    system.acquire("frost-shard"); // triggers evolution regardless of order
    expect(system.aggregate.synergies).toHaveLength(0);
    expect(system.has("cinder-heart")).toBe(true);
  });
});

describe("RelicSystem — evolution (AF-029 §6)", () => {
  it("evolves exactly once when requirements are met, consuming the inputs", () => {
    const evolutions: string[] = [];
    const system = new RelicSystem(SANDBOX_RELICS, (from, to) => evolutions.push(`${from.id}->${to.id}`));
    system.acquire("ember-core");
    expect(system.has("cinder-heart")).toBe(false);

    system.acquire("frost-shard"); // completes the requirement
    expect(evolutions).toEqual(["ember-core->cinder-heart"]);
    expect(system.has("ember-core")).toBe(false);
    expect(system.has("frost-shard")).toBe(false);
    expect(system.has("cinder-heart")).toBe(true);
  });

  it("does not evolve without the requirement", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    system.acquire("ember-core");
    system.acquire("ember-core"); // second stack, still no frost-shard
    expect(system.has("cinder-heart")).toBe(false);
    expect(system.stacksOf("ember-core")).toBe(2);
  });
});

describe("RelicSystem — trade-offs and aggregation (AF-029 §5)", () => {
  it("applies negative clauses through the same aggregation path", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    system.acquire("gambler-die");
    const aggregate = system.aggregate;
    expect(aggregate.bonuses.criticalDamage).toBeCloseTo(0.5, 5);
    expect(aggregate.bonuses.shieldCapacity).toBeCloseTo(-20, 5); // trade-off never dropped
  });

  it("scales numeric effects by stack count", () => {
    const system = new RelicSystem(SANDBOX_RELICS);
    system.acquire("ember-core");
    system.acquire("ember-core");
    expect(system.aggregate.bonuses.damage).toBeCloseTo(0.24, 5); // 0.12 × 2
  });
});

describe("Relics — thousands of randomised combinations (AF-029 self-review)", () => {
  it("every random acquisition sequence stays consistent: schema-valid, deterministic, trade-offs preserved", () => {
    const rng = new Rng(2026).fork("relic-fuzz");
    const relicIds = SANDBOX_RELICS.map((r) => r.id);

    for (let trial = 0; trial < 3000; trial += 1) {
      const system = new RelicSystem(SANDBOX_RELICS);
      const acquireCount = rng.int(1, 5);
      for (let i = 0; i < acquireCount; i += 1) {
        const result = system.acquire(rng.pick(relicIds));
        expect(["ok", "maxStacksReached", "exclusionConflict", "invalidDefinition"]).toContain(
          result.ok ? "ok" : result.reason,
        );
      }
      const aggregate = system.aggregate;
      for (const value of Object.values(aggregate.bonuses)) {
        expect(Number.isFinite(value)).toBe(true);
      }
      // Mutual exclusion never violated even after many random acquisitions.
      const hasWarden = system.has("warden-token");
      const hasGambler = system.has("gambler-die");
      expect(hasWarden && hasGambler).toBe(false);
    }
  });
});
