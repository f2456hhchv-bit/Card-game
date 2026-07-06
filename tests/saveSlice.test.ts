import { describe, expect, it } from "vitest";
import { SaveSlice, checksumOf } from "../src/core/save/SaveSlice";
import { MemoryStorage } from "../src/core/save/SaveStorage";

interface TestData {
  count: number;
  name: string;
}

const makeSlice = (storage: MemoryStorage, onWarning?: (m: string) => void) =>
  new SaveSlice<TestData>({
    key: "test",
    currentVersion: 1,
    migrations: {},
    defaultData: () => ({ count: 0, name: "fresh" }),
    storage,
    ...(onWarning ? { onWarning } : {}),
  });

describe("SaveSlice — round trip and integrity (AF-001 §8)", () => {
  it("saves and loads data intact", async () => {
    const storage = new MemoryStorage();
    const slice = makeSlice(storage);
    await slice.save({ count: 42, name: "answer" });
    expect(await slice.load()).toEqual({ count: 42, name: "answer" });
  });

  it("returns defaults when nothing is stored", async () => {
    const slice = makeSlice(new MemoryStorage());
    expect(await slice.load()).toEqual({ count: 0, name: "fresh" });
  });

  it("quarantines corrupt payloads and falls back to the backup", async () => {
    const storage = new MemoryStorage();
    const warnings: string[] = [];
    const slice = makeSlice(storage, (m) => warnings.push(m));

    await slice.save({ count: 1, name: "first" });
    await slice.save({ count: 2, name: "second" }); // first → backup

    // Corrupt the primary (bit-rot / tampering).
    const raw = (await storage.read("test")) as string;
    await storage.write("test", raw.replace("second", "hacked"));

    expect(await slice.load()).toEqual({ count: 1, name: "first" }); // backup wins
    expect(await storage.read("test.quarantine")).not.toBeNull(); // kept for diagnosis
    expect(warnings.some((w) => w.includes("quarantined"))).toBe(true);
  });

  it("resets only when primary AND backup are unreadable — never throws", async () => {
    const storage = new MemoryStorage();
    const slice = makeSlice(storage);
    await storage.write("test", "not json at all");
    await storage.write("test.backup", "{\"broken\":");
    expect(await slice.load()).toEqual({ count: 0, name: "fresh" });
  });

  it("checksum binds version and payload", () => {
    expect(checksumOf(1, '{"a":1}')).not.toBe(checksumOf(2, '{"a":1}'));
    expect(checksumOf(1, '{"a":1}')).not.toBe(checksumOf(1, '{"a":2}'));
  });
});

describe("SaveSlice — migration chain (AF-001 §8)", () => {
  it("upgrades old saves through every step", async () => {
    const storage = new MemoryStorage();
    // Write a v1 envelope by hand.
    const v1Json = JSON.stringify({ count: 7 }); // v1 had no name field
    await storage.write(
      "test",
      JSON.stringify({ version: 1, checksum: checksumOf(1, v1Json), data: { count: 7 } }),
    );

    const slice = new SaveSlice<TestData>({
      key: "test",
      currentVersion: 3,
      migrations: {
        1: (old) => ({ ...(old as { count: number }), name: "migrated" }), // v1→v2
        2: (old) => ({ ...(old as TestData), count: (old as TestData).count * 10 }), // v2→v3
      },
      defaultData: () => ({ count: 0, name: "fresh" }),
      storage: storage,
    });
    expect(await slice.load()).toEqual({ count: 70, name: "migrated" });
  });

  it("treats a future-version save as corrupt (quarantine, not crash)", async () => {
    const storage = new MemoryStorage();
    const dataJson = JSON.stringify({ count: 1, name: "x" });
    await storage.write(
      "test",
      JSON.stringify({ version: 99, checksum: checksumOf(99, dataJson), data: { count: 1, name: "x" } }),
    );
    const slice = makeSlice(storage);
    expect(await slice.load()).toEqual({ count: 0, name: "fresh" });
    expect(await storage.read("test.quarantine")).not.toBeNull();
  });
});
