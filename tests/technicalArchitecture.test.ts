import { describe, expect, it } from "vitest";
import { EventBus } from "../src/core/events/EventBus";
import type { GameEvents } from "../src/core/events/GameEvents";
import {
  ACCESSIBILITY_PERSISTENCE_LIVE,
  ACCESSIBILITY_PERSISTENCE_PROPERTIES,
  ANALYTICS_TRACKING_CATEGORIES,
  ARCHITECTURE_PRINCIPLES,
  AUTOMATED_TESTING_KINDS,
  AUTOMATED_TESTING_LIVE,
  CONFIGURATION_AREAS,
  CORE_MODULES,
  CORE_MODULE_REALISATION,
  CRASH_RECOVERY_FEATURES,
  CRASH_RECOVERY_LIVE,
  DATA_ARCHITECTURE_DOMAINS,
  DATA_ARCHITECTURE_LIVE,
  DEVELOPER_TOOLS_KINDS,
  DEVELOPER_TOOLS_LIVE,
  EVENT_SYSTEM_CATEGORIES,
  EVENT_SYSTEM_CATEGORY_REALISATION,
  KNOWN_EVENT_KINDS,
  PLUGIN_ARCHITECTURE_EXTENSION_POINTS,
  PLUGIN_ARCHITECTURE_REALISATION,
  SAVE_COMPATIBILITY_FEATURES,
  SAVE_COMPATIBILITY_LIVE,
  SAVE_SYSTEM_CATEGORIES,
  SAVE_SYSTEM_CATEGORY_REALISATION,
  TECHNICAL_DEBUG_SURFACES,
  TECHNICAL_PERFORMANCE_DISCIPLINES,
  TECHNICAL_PERFORMANCE_LIVE,
  eventQueueSummary,
  moduleStatusSummary,
  saveVersionSummary,
} from "../src/game/technical/technicalArchitectureData";

describe("Technical Architecture Framework vocabulary (AF-094)", () => {
  it("registers 8 architecture principles, 14 core modules, 13 data domains, 15 save categories, 7 save-compatibility features, 8 event categories, 7 plugin points, 8 configuration areas, 8 testing kinds, 7 crash-recovery features, 8 analytics categories, 8 dev tools, 7 accessibility-persistence properties, 7 performance disciplines, 7 debug surfaces", () => {
    expect(Object.keys(ARCHITECTURE_PRINCIPLES).length).toBe(8);
    expect(CORE_MODULES.length).toBe(14);
    expect(DATA_ARCHITECTURE_DOMAINS.length).toBe(13);
    expect(SAVE_SYSTEM_CATEGORIES.length).toBe(15);
    expect(SAVE_COMPATIBILITY_FEATURES.length).toBe(7);
    expect(EVENT_SYSTEM_CATEGORIES.length).toBe(8);
    expect(PLUGIN_ARCHITECTURE_EXTENSION_POINTS.length).toBe(7);
    expect(Object.keys(CONFIGURATION_AREAS).length).toBe(8);
    expect(AUTOMATED_TESTING_KINDS.length).toBe(8);
    expect(CRASH_RECOVERY_FEATURES.length).toBe(7);
    expect(ANALYTICS_TRACKING_CATEGORIES.length).toBe(8);
    expect(DEVELOPER_TOOLS_KINDS.length).toBe(8);
    expect(ACCESSIBILITY_PERSISTENCE_PROPERTIES.length).toBe(7);
    expect(TECHNICAL_PERFORMANCE_DISCIPLINES.length).toBe(7);
    expect(Object.keys(TECHNICAL_DEBUG_SURFACES).length).toBe(7);
  });

  it("every architecture principle and configuration area is honestly true — both are already real, evidenced practices", () => {
    expect(Object.values(ARCHITECTURE_PRINCIPLES).every(Boolean)).toBe(true);
    expect(Object.values(CONFIGURATION_AREAS).every(Boolean)).toBe(true);
  });

  it("1 of 14 core modules exists as-is, 8 are renamed onto a real Runtime, 2 are distributed across several real files, 1 is orphaned (exists but unwired), 2 are honest future work — the register partitions cleanly", () => {
    const counts = { existing: 0, renamed: 0, distributed: 0, orphaned: 0, future: 0 };
    for (const module of CORE_MODULES) counts[CORE_MODULE_REALISATION[module].kind] += 1;
    expect(counts).toEqual({ existing: 1, renamed: 8, distributed: 2, orphaned: 1, future: 2 });
  });
});

describe("Realisation maps stay bound to real vocabulary (AF-094)", () => {
  it("12 of 13 data-architecture domains are already externalised as real *Data.ts registries; only dialogue is future", () => {
    const live = Object.values(DATA_ARCHITECTURE_LIVE).filter(Boolean).length;
    expect(live).toBe(12);
    expect(DATA_ARCHITECTURE_LIVE.dialogue).toBe(false);
  });

  it("8 of 15 save-system categories realise onto one of the 6 real SaveSlice keys; 7 are honest future", () => {
    let existing = 0;
    let future = 0;
    const realSliceKeys = new Set(["settings", "research", "crafting", "collectionLedger", "meta", "inventory", "(every slice)"]);
    for (const category of SAVE_SYSTEM_CATEGORIES) {
      const realisation = SAVE_SYSTEM_CATEGORY_REALISATION[category];
      if (realisation.kind === "existing") {
        expect(realSliceKeys.has(realisation.sliceKey), `${category} sliceKey ${realisation.sliceKey}`).toBe(true);
        existing += 1;
      } else future += 1;
    }
    expect(existing).toBe(8);
    expect(future).toBe(7);
  });

  it("every 'existing' event category names only real keyof GameEvents kinds", () => {
    let existing = 0;
    for (const category of EVENT_SYSTEM_CATEGORIES) {
      const realisation = EVENT_SYSTEM_CATEGORY_REALISATION[category];
      if (realisation.kind === "existing") {
        existing += 1;
        for (const kind of realisation.eventKinds) expect(KNOWN_EVENT_KINDS, `${category} → ${kind}`).toContain(kind);
      }
    }
    expect(existing).toBe(4);
  });

  it("4 of 7 plugin extension points are already real (data-driven or LiveOpsRegistry); 3 are honest future", () => {
    let existing = 0;
    for (const point of PLUGIN_ARCHITECTURE_EXTENSION_POINTS) if (PLUGIN_ARCHITECTURE_REALISATION[point].kind === "existing") existing += 1;
    expect(existing).toBe(4);
  });
});

describe("Live/future flag counts (AF-094)", () => {
  it("5 of 7 save-compatibility features live; 5 of 8 testing kinds live; 3 of 7 crash-recovery features live; 2 of 8 dev tools live; 3 of 7 accessibility-persistence properties live; 3 of 7 performance disciplines live; 6 of 7 debug surfaces live", () => {
    expect(Object.values(SAVE_COMPATIBILITY_LIVE).filter(Boolean).length).toBe(5);
    expect(Object.values(AUTOMATED_TESTING_LIVE).filter(Boolean).length).toBe(5);
    expect(Object.values(CRASH_RECOVERY_LIVE).filter(Boolean).length).toBe(3);
    expect(Object.values(DEVELOPER_TOOLS_LIVE).filter(Boolean).length).toBe(2);
    expect(Object.values(ACCESSIBILITY_PERSISTENCE_LIVE).filter(Boolean).length).toBe(3);
    expect(Object.values(TECHNICAL_PERFORMANCE_LIVE).filter(Boolean).length).toBe(3);
    expect(Object.values(TECHNICAL_DEBUG_SURFACES).filter(Boolean).length).toBe(6);
  });
});

describe("Live summary functions compose with the REAL EventBus, never a mock (AF-094)", () => {
  it("moduleStatusSummary reports the real counted total", () => {
    expect(moduleStatusSummary()).toBe("12/14 core modules realised");
  });

  it("saveVersionSummary formats real (key, version) pairs", () => {
    expect(saveVersionSummary([{ key: "settings", version: 1 }, { key: "research", version: 1 }])).toBe("settingsv1 researchv1");
  });

  it("eventQueueSummary sums real listenerCount() across every known kind on an actual EventBus instance", () => {
    const bus = new EventBus<GameEvents>();
    expect(eventQueueSummary(bus)).toBe(`0 active listeners / ${KNOWN_EVENT_KINDS.length} known event kinds`);
    const unsubscribe = bus.on("EnemyKilled", () => {});
    bus.on("ResearchUnlocked", () => {});
    expect(eventQueueSummary(bus)).toBe(`2 active listeners / ${KNOWN_EVENT_KINDS.length} known event kinds`);
    unsubscribe();
    expect(eventQueueSummary(bus)).toBe(`1 active listeners / ${KNOWN_EVENT_KINDS.length} known event kinds`);
  });
});

describe("Technical Architecture Framework — self-review (AF-094 §Self Review Loop)", () => {
  it("120 seeded rounds: eventQueueSummary's total always equals the manual sum of real listenerCount() calls on a real EventBus", () => {
    for (let seed = 0; seed < 120; seed += 1) {
      const bus = new EventBus<GameEvents>();
      const listenerCountPerKind = seed % 5;
      const kind = KNOWN_EVENT_KINDS[seed % KNOWN_EVENT_KINDS.length]!;
      for (let i = 0; i < listenerCountPerKind; i += 1) bus.on(kind, () => {});
      let manualTotal = 0;
      for (const knownKind of KNOWN_EVENT_KINDS) manualTotal += bus.listenerCount(knownKind);
      const summary = eventQueueSummary(bus);
      if (summary !== `${manualTotal} active listeners / ${KNOWN_EVENT_KINDS.length} known event kinds`) {
        throw new Error(`seed ${seed}: eventQueueSummary drifted from the real manual sum`);
      }
    }
  });
});
