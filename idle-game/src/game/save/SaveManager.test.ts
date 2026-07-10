import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadState, saveState, clearSave } from "./SaveManager";
import { createDefaultState } from "../state/GameState";

/** Minimal in-memory localStorage polyfill — Node's test environment has no
 * DOM storage, and this project intentionally avoids a jsdom dependency for
 * pure-logic tests. */
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

describe("SaveManager", () => {
  it("returns a fresh default state when nothing is saved", () => {
    const state = loadState();
    expect(state.stage).toBe(1);
    expect(state.heroLevel).toBe(1);
  });

  it("round-trips a saved state", () => {
    const state = createDefaultState();
    state.stage = 12;
    state.gold = 4321;
    state.heroLevel = 7;
    state.upgrades.fortifyBlade = 3;
    state.gear.weapon = {
      id: "g1",
      slot: "weapon",
      rarity: "epic",
      stat: "atk",
      name: "Thornblade",
      baseValue: 42,
      enhanceLevel: 2,
      foundAtStage: 10,
    };
    saveState(state);

    const loaded = loadState();
    expect(loaded.stage).toBe(12);
    expect(loaded.gold).toBe(4321);
    expect(loaded.heroLevel).toBe(7);
    expect(loaded.upgrades.fortifyBlade).toBe(3);
    expect(loaded.gear.weapon).toEqual(state.gear.weapon);
  });

  it("falls back to defaults on corrupt JSON instead of throwing", () => {
    localStorage.setItem("vanguard.save.v1", "{not valid json");
    expect(() => loadState()).not.toThrow();
    const state = loadState();
    expect(state.stage).toBe(1);
  });

  it("ignores an invalid gear item rather than crashing", () => {
    const state = createDefaultState();
    state.gear.weapon = {
      id: "bad",
      slot: "weapon",
      // @ts-expect-error deliberately invalid rarity for the robustness test
      rarity: "mythic-does-not-exist",
      stat: "atk",
      name: "Broken",
      baseValue: 1,
      enhanceLevel: 0,
      foundAtStage: 1,
    };
    saveState(state);
    const loaded = loadState();
    expect(loaded.gear.weapon).toBeNull();
  });

  it("clearSave removes the persisted save", () => {
    saveState(createDefaultState());
    clearSave();
    expect(localStorage.getItem("vanguard.save.v1")).toBeNull();
  });
});
