import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Game } from "./Game";
import { PRESTIGE } from "./data/prestigeDefs";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  clear(): void {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
});

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(globalThis, "localStorage", originalDescriptor);
  } else {
    delete (globalThis as { localStorage?: Storage }).localStorage;
  }
});

describe("Game — shop", () => {
  it("buys an upgrade when affordable and refuses when not", () => {
    const game = new Game();
    game.state.gold = 0;
    expect(game.canBuyUpgrade("fortifyBlade")).toBe(false);
    expect(game.buyUpgrade("fortifyBlade")).toBe(false);

    game.state.gold = 1000;
    expect(game.canBuyUpgrade("fortifyBlade")).toBe(true);
    const before = game.state.gold;
    expect(game.buyUpgrade("fortifyBlade")).toBe(true);
    expect(game.upgradeLevel("fortifyBlade")).toBe(1);
    expect(game.state.gold).toBeLessThan(before);
  });

  it("rejects an unknown upgrade id", () => {
    const game = new Game();
    game.state.gold = 999999;
    expect(game.buyUpgrade("not-a-real-upgrade")).toBe(false);
  });
});

describe("Game — gear", () => {
  it("enhances equipped gear when affordable", () => {
    const game = new Game();
    game.state.gear.weapon = {
      id: "g1",
      slot: "weapon",
      rarity: "common",
      stat: "atk",
      name: "Test Blade",
      baseValue: 5,
      enhanceLevel: 0,
      foundAtStage: 1,
    };
    game.state.alloy = 0;
    expect(game.canEnhanceGear("weapon")).toBe(false);

    game.state.alloy = 1000;
    expect(game.enhanceGear("weapon")).toBe(true);
    expect(game.state.gear.weapon?.enhanceLevel).toBe(1);
  });

  it("cannot enhance an empty slot", () => {
    const game = new Game();
    expect(game.canEnhanceGear("armor")).toBe(false);
    expect(game.enhanceGear("armor")).toBe(false);
  });
});

describe("Game — prestige", () => {
  it("is locked until the unlock stage and resets progress on rebirth", () => {
    const game = new Game();
    expect(game.canPrestige()).toBe(false);

    game.state.highestStageReached = PRESTIGE.unlockStage;
    game.state.lifetimeHighestStage = PRESTIGE.unlockStage;
    game.state.stage = PRESTIGE.unlockStage;
    game.state.gold = 500;
    game.state.heroLevel = 10;
    expect(game.canPrestige()).toBe(true);

    const gained = game.prestigePreview();
    expect(gained).toBeGreaterThan(0);

    expect(game.prestige()).toBe(true);
    expect(game.state.stage).toBe(1);
    expect(game.state.gold).toBe(0);
    expect(game.state.heroLevel).toBe(1);
    expect(game.state.afterglow).toBe(gained);
    expect(game.state.rebirths).toBe(1);
    // The unlock gate resets with the cycle...
    expect(game.canPrestige()).toBe(false);
    // ...but the lifetime record does not.
    expect(game.state.lifetimeHighestStage).toBeGreaterThanOrEqual(PRESTIGE.unlockStage);
  });
});

describe("Game — offline progress", () => {
  it("shows an offline summary after a long absence", () => {
    const first = new Game();
    first.state.lastSeenAt = Date.now() - 3 * 3600 * 1000;
    first.save();

    const resumed = new Game();
    expect(resumed.offlineSummary).not.toBeNull();
    expect(resumed.offlineSummary!.simulatedActiveSeconds).toBeGreaterThan(0);
    resumed.dismissOfflineSummary();
    expect(resumed.offlineSummary).toBeNull();
  });

  it("stays quiet for a short absence", () => {
    const first = new Game();
    first.state.lastSeenAt = Date.now() - 5000;
    first.save();

    const resumed = new Game();
    expect(resumed.offlineSummary).toBeNull();
  });
});

describe("Game — live tick", () => {
  it("advances the sim and notifies listeners of combat events", () => {
    const game = new Game();
    const seen: string[] = [];
    game.on((e) => {
      if (e.kind === "combat") seen.push(e.event.type);
    });
    game.tick(5);
    expect(seen.length).toBeGreaterThan(0);
    expect(game.state.gold).toBeGreaterThan(0);
  });
});
