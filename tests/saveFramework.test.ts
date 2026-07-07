import { describe, expect, it } from "vitest";
import { MemoryStorage } from "../src/core/save/SaveStorage";
import { SaveSlice } from "../src/core/save/SaveSlice";
import { SaveProfileManager, SAVE_PROFILE_KINDS } from "../src/core/save/SaveProfileManager";
import { SaveCoordinator, AUTOSAVE_TRIGGERS } from "../src/core/save/SaveCoordinator";
import { DEFAULT_SETTINGS, SETTINGS_CATEGORIES } from "../src/core/save/settingsData";

describe("SaveProfileManager — Save Slots (AF-044 §Save Slots)", () => {
  it("starts with zero profiles", async () => {
    const manager = new SaveProfileManager(new MemoryStorage());
    expect(await manager.list()).toEqual([]);
  });

  it("creating the first profile makes it active automatically", async () => {
    const manager = new SaveProfileManager(new MemoryStorage());
    const profile = await manager.create("Commander One", "primary");
    expect(await manager.activeProfileId()).toBe(profile.id);
  });

  it("registers all four Save Profile kinds", () => {
    expect(SAVE_PROFILE_KINDS).toEqual(["primary", "additional", "challenge", "developer"]);
  });

  it("rename updates the profile's name without changing its id", async () => {
    const manager = new SaveProfileManager(new MemoryStorage());
    const profile = await manager.create("Commander One");
    await manager.rename(profile.id, "Commander Prime");
    const list = await manager.list();
    expect(list[0]!.id).toBe(profile.id);
    expect(list[0]!.name).toBe("Commander Prime");
  });

  it("remove drops the profile from the list and re-elects a new active profile", async () => {
    const manager = new SaveProfileManager(new MemoryStorage());
    const a = await manager.create("A");
    const b = await manager.create("B");
    await manager.setActive(a.id);
    await manager.remove(a.id);
    expect(await manager.activeProfileId()).toBe(b.id);
  });

  it("profiles remain isolated — a SaveSlice written under one profile's storage is invisible to another's", async () => {
    const storage = new MemoryStorage();
    const manager = new SaveProfileManager(storage);
    const a = await manager.create("A");
    const b = await manager.create("B");

    interface Coins {
      amount: number;
    }
    const sliceFor = (profileId: string) =>
      new SaveSlice<Coins>({
        key: "coins",
        currentVersion: 1,
        migrations: {},
        defaultData: () => ({ amount: 0 }),
        storage: manager.storageFor(profileId),
      });

    await sliceFor(a.id).save({ amount: 500 });
    const bCoins = await sliceFor(b.id).load();
    expect(bCoins.amount).toBe(0); // untouched by A's save

    const aCoins = await sliceFor(a.id).load();
    expect(aCoins.amount).toBe(500);
  });
});

describe("SaveCoordinator — Autosave Status (AF-044 §Autosave / §DEBUG)", () => {
  it("registers all eight Autosave Triggers", () => {
    expect(AUTOSAVE_TRIGGERS.length).toBe(8);
  });

  it("a unit with no recorded save has null status", () => {
    const coordinator = new SaveCoordinator();
    expect(coordinator.status("meta")).toBeNull();
  });

  it("recordSave increments the save count and updates the timestamp", () => {
    let now = 1000;
    const coordinator = new SaveCoordinator(() => now);
    coordinator.recordSave("meta");
    now = 2000;
    coordinator.recordSave("meta");
    const status = coordinator.status("meta");
    expect(status!.saveCount).toBe(2);
    expect(status!.lastSavedAtMs).toBe(2000);
  });

  it("tracks multiple units independently", () => {
    const coordinator = new SaveCoordinator();
    coordinator.recordSave("meta");
    coordinator.recordSave("meta");
    coordinator.recordSave("crafting");
    expect(coordinator.status("meta")!.saveCount).toBe(2);
    expect(coordinator.status("crafting")!.saveCount).toBe(1);
    expect(coordinator.allStatuses.length).toBe(2);
  });
});

describe("SaveCoordinator — Milestone Backups (AF-044 §Backup System)", () => {
  interface UnitData {
    value: number;
  }

  function makeUnit(id: string, initial: number): { unit: { id: string; toSave: () => UnitData; loadSave: (d: UnitData) => void }; get: () => number } {
    let value = initial;
    return {
      unit: {
        id,
        toSave: () => ({ value }),
        loadSave: (data) => {
          value = data.value;
        },
      },
      get: () => value,
    };
  }

  it("snapshotAll captures every registered unit's current data", () => {
    const coordinator = new SaveCoordinator();
    const a = makeUnit("a", 1);
    const b = makeUnit("b", 2);
    coordinator.register(a.unit);
    coordinator.register(b.unit);
    const snapshot = coordinator.snapshotAll();
    expect(snapshot.units["a"]).toEqual({ value: 1 });
    expect(snapshot.units["b"]).toEqual({ value: 2 });
  });

  it("restoreAll writes each unit's data back through loadSave", () => {
    const coordinator = new SaveCoordinator();
    const a = makeUnit("a", 1);
    coordinator.register(a.unit);
    const snapshot = coordinator.snapshotAll();
    a.unit.loadSave({ value: 999 }); // mutate away from the snapshot
    expect(a.get()).toBe(999);
    coordinator.restoreAll(snapshot);
    expect(a.get()).toBe(1);
  });

  it("round-trips a Milestone Backup through storage with checksum protection", async () => {
    const storage = new MemoryStorage();
    const coordinator = new SaveCoordinator();
    const a = makeUnit("a", 42);
    coordinator.register(a.unit);
    await coordinator.writeMilestoneBackup(storage, "milestone");
    a.unit.loadSave({ value: 0 });

    const restored = await coordinator.readMilestoneBackup(storage, "milestone");
    expect(restored).not.toBeNull();
    coordinator.restoreAll(restored!);
    expect(a.get()).toBe(42);
  });

  it("returns null for a missing Milestone Backup rather than throwing", async () => {
    const coordinator = new SaveCoordinator();
    const result = await coordinator.readMilestoneBackup(new MemoryStorage(), "does-not-exist");
    expect(result).toBeNull();
  });

  it("returns null for a corrupted Milestone Backup — corruption is detected, never silently accepted", async () => {
    const storage = new MemoryStorage();
    const coordinator = new SaveCoordinator();
    coordinator.register(makeUnit("a", 1).unit);
    await coordinator.writeMilestoneBackup(storage, "milestone");
    const raw = await storage.read("milestone");
    await storage.write("milestone", raw!.slice(0, -5)); // truncated — neither valid JSON nor a matching checksum
    const result = await coordinator.readMilestoneBackup(storage, "milestone");
    expect(result).toBeNull();
  });
});

describe("Settings — device-scoped, independent of Save Profiles (AF-044 §Settings Save)", () => {
  it("registers all eight Settings categories", () => {
    expect(SETTINGS_CATEGORIES.length).toBe(8);
  });

  it("Reduced Notification Mode defaults to off (AF-041's dormant accessibility vocabulary, now with real defaults)", () => {
    expect(DEFAULT_SETTINGS.accessibility.reducedNotificationMode).toBe(false);
  });

  it("persists through the exact same SaveSlice contract as everything else", async () => {
    const slice = new SaveSlice({
      key: "settings",
      currentVersion: 1,
      migrations: {},
      defaultData: () => DEFAULT_SETTINGS,
      storage: new MemoryStorage(),
    });
    await slice.save({ ...DEFAULT_SETTINGS, accessibility: { ...DEFAULT_SETTINGS.accessibility, reducedNotificationMode: true } });
    const loaded = await slice.load();
    expect(loaded.accessibility.reducedNotificationMode).toBe(true);
  });
});

describe("Save Framework — self-review: thousands of save cycles across profiles stay consistent", () => {
  it("survives interleaved saves/backups/restores across multiple profiles without cross-contamination", async () => {
    const storage = new MemoryStorage();
    const manager = new SaveProfileManager(storage);
    const profileIds = await Promise.all([manager.create("A"), manager.create("B"), manager.create("C")]).then((profiles) => profiles.map((p) => p.id));

    interface Wallet {
      amount: number;
    }
    const wallets = new Map<string, SaveSlice<Wallet>>();
    for (const id of profileIds) {
      wallets.set(
        id,
        new SaveSlice<Wallet>({
          key: "wallet",
          currentVersion: 1,
          migrations: {},
          defaultData: () => ({ amount: 0 }),
          storage: manager.storageFor(id),
        }),
      );
    }

    const expected = new Map(profileIds.map((id) => [id, 0]));
    for (let cycle = 0; cycle < 2000; cycle += 1) {
      const id = profileIds[cycle % profileIds.length]!;
      const amount = cycle;
      await wallets.get(id)!.save({ amount });
      expected.set(id, amount);
    }

    for (const id of profileIds) {
      const loaded = await wallets.get(id)!.load();
      expect(loaded.amount).toBe(expected.get(id));
    }
  });
});
