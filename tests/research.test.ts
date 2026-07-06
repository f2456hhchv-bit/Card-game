import { describe, expect, it } from "vitest";
import { ResearchTree } from "../src/game/research/ResearchTree";
import {
  SANDBOX_RESEARCH_TREE,
  type ResearchNodeDef,
} from "../src/game/research/researchData";

const node = (overrides: Partial<ResearchNodeDef> & { id: string }): ResearchNodeDef => ({
  name: overrides.id,
  category: "weaponTechnology",
  tier: 1,
  cost: 5,
  completionTimeMs: 0,
  prerequisites: [],
  nodeType: "passiveBonus",
  hidden: false,
  effect: null,
  ...overrides,
});

describe("ResearchTree — graph validation (AF-024 §3)", () => {
  it("rejects unknown prerequisites loudly", () => {
    expect(() => new ResearchTree([node({ id: "a", prerequisites: ["ghost"] })])).toThrow(/unknown node/);
  });

  it("rejects cycles loudly", () => {
    expect(
      () =>
        new ResearchTree([
          node({ id: "a", prerequisites: ["b"] }),
          node({ id: "b", prerequisites: ["a"] }),
        ]),
    ).toThrow(/cycle/);
  });

  it("accepts the sandbox tree", () => {
    expect(() => new ResearchTree(SANDBOX_RESEARCH_TREE)).not.toThrow();
  });
});

describe("ResearchTree — gating and spending (AF-024 §3)", () => {
  it("walks prerequisite chains: locked → available → unlocked", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    expect(tree.stateOf("focused-lattice")).toBe("available");
    expect(tree.stateOf("coherent-beams")).toBe("locked");

    tree.addPoints(10);
    expect(tree.unlock("coherent-beams")).toBe(false); // prerequisites unmet
    expect(tree.unlock("focused-lattice")).toBe(true);
    expect(tree.stateOf("coherent-beams")).toBe("available");
    expect(tree.unlock("coherent-beams")).toBe(true);
    expect(tree.snapshot.points).toBe(1); // 10 - 3 - 6
  });

  it("refuses to unlock without points, with the reason", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    expect(tree.canUnlock("focused-lattice")).toEqual({ ok: false, reason: "insufficient points" });
  });

  it("cross-links require every prerequisite", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    tree.addPoints(100);
    tree.unlock("focused-lattice");
    tree.unlock("coherent-beams");
    expect(tree.stateOf("unified-theory")).toBe("locked"); // still needs deep-scanning
    tree.unlock("survey-protocols");
    tree.unlock("deep-scanning");
    expect(tree.stateOf("unified-theory")).toBe("available");
  });
});

describe("ResearchTree — hidden discoveries (AF-024 §3)", () => {
  it("hidden nodes stay hidden until revealed, then gate normally", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    tree.addPoints(100);
    expect(tree.stateOf("ancient-conduit")).toBe("hidden");
    expect(tree.unlock("ancient-conduit")).toBe(false);

    expect(tree.reveal("ancient-conduit")).toBe(true);
    expect(tree.stateOf("ancient-conduit")).toBe("locked"); // revealed, prereq unmet
    tree.unlock("survey-protocols");
    expect(tree.stateOf("ancient-conduit")).toBe("available");
    expect(tree.reveal("ancient-conduit")).toBe(false); // reveal is once
  });
});

describe("ResearchTree — reset and persistence (AF-024 §2/§3)", () => {
  it("full reset refunds all points and preserves discoveries + lifetime stats", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    tree.addPoints(20);
    tree.unlock("focused-lattice"); // 3
    tree.unlock("field-dynamics"); // 3
    tree.reveal("ancient-conduit");

    const refund = tree.reset();
    expect(refund).toBe(6);
    expect(tree.snapshot.points).toBe(20);
    expect(tree.snapshot.totalPointsEarned).toBe(20); // lifetime stat preserved
    expect(tree.stateOf("focused-lattice")).toBe("available");
    expect(tree.stateOf("ancient-conduit")).toBe("locked"); // discovery preserved
  });

  it("round-trips through save data", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    tree.addPoints(15);
    tree.unlock("focused-lattice");
    tree.reveal("ancient-conduit");

    const restored = new ResearchTree(SANDBOX_RESEARCH_TREE);
    restored.loadSave(tree.toSave());
    expect(restored.isUnlocked("focused-lattice")).toBe(true);
    expect(restored.stateOf("ancient-conduit")).toBe("locked"); // revealed survives
    expect(restored.snapshot.points).toBe(12);
  });

  it("drops unknown ids from old saves (deprecation-safe, AF-013 §5)", () => {
    const tree = new ResearchTree(SANDBOX_RESEARCH_TREE);
    tree.loadSave({
      points: 5,
      unlocked: ["focused-lattice", "removed-node-from-2029"],
      revealed: ["gone-too"],
      totalPointsEarned: 50,
    });
    expect(tree.isUnlocked("focused-lattice")).toBe(true);
    expect(tree.snapshot.unlockedCount).toBe(1); // unknown id dropped, no crash
  });
});
