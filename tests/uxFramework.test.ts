import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  BUILD_MANAGEMENT_KINDS,
  BUILD_MANAGEMENT_REALISATION,
  CONTEXTUAL_UI_TRIGGERS,
  HUD_ELEMENTS,
  HUD_ELEMENT_LIVE,
  INVENTORY_EXPERIENCE_FEATURES,
  INVENTORY_EXPERIENCE_LIVE,
  NAVIGATION_DEVICE_LIVE,
  NAVIGATION_INPUT_DEVICES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CATEGORY_BINDING,
  ONBOARDING_FEATURES,
  PLAYER_FEEDBACK_CHANNELS,
  PLAYER_FEEDBACK_LIVE,
  PRIMARY_INTERFACES,
  PRIMARY_INTERFACE_REALISATION,
  UI_ARCHITECTURE_PARTS,
  UI_DEBUG_SURFACES,
  UI_INTERFACE_PROFILES,
  UX_ACCESSIBILITY_SURFACES,
  UX_PERFORMANCE_DISCIPLINES,
  UX_PILLARS,
  buildManagementLiveSummary,
  everyRealisedStateIsReal,
  hudLiveSummary,
  inputLatencyProxyMs,
  navigationRealisationSummary,
  uiArchitectureFor,
} from "../src/game/ux/uxFrameworkData";

describe("User Experience Framework vocabulary (AF-093)", () => {
  it("registers 8 pillars, 9 architecture parts, 14 primary interfaces, 11 HUD elements, 8 contextual triggers, 5 nav devices, 7 feedback channels, 8 inventory features, 7 build kinds, 7 notification categories, 7 onboarding features, 11 accessibility surfaces, 5 performance disciplines, 6 debug surfaces", () => {
    expect(UX_PILLARS.length).toBe(8);
    expect(UI_ARCHITECTURE_PARTS.length).toBe(9);
    expect(PRIMARY_INTERFACES.length).toBe(14);
    expect(HUD_ELEMENTS.length).toBe(11);
    expect(CONTEXTUAL_UI_TRIGGERS.length).toBe(8);
    expect(NAVIGATION_INPUT_DEVICES.length).toBe(5);
    expect(PLAYER_FEEDBACK_CHANNELS.length).toBe(7);
    expect(INVENTORY_EXPERIENCE_FEATURES.length).toBe(8);
    expect(BUILD_MANAGEMENT_KINDS.length).toBe(7);
    expect(NOTIFICATION_CATEGORIES.length).toBe(7);
    expect(ONBOARDING_FEATURES.length).toBe(7);
    expect(Object.keys(UX_ACCESSIBILITY_SURFACES).length).toBe(11);
    expect(UX_PERFORMANCE_DISCIPLINES.length).toBe(5);
    expect(Object.keys(UI_DEBUG_SURFACES).length).toBe(6);
  });

  it("3 of 14 primary interfaces have a dedicated live GameStateId; 4 are fused into one; 7 are honest future — every referenced state is real", () => {
    let existing = 0;
    let fused = 0;
    let future = 0;
    for (const iface of PRIMARY_INTERFACES) {
      const kind = PRIMARY_INTERFACE_REALISATION[iface].kind;
      if (kind === "existing") existing += 1;
      else if (kind === "fused") fused += 1;
      else future += 1;
    }
    expect(existing).toBe(3);
    expect(fused).toBe(4);
    expect(future).toBe(7);
    expect(everyRealisedStateIsReal()).toBe(true);
  });
});

describe("UI Architecture — nothing remains undefined (AF-093 §UI Architecture)", () => {
  it("every primary interface resolves a complete 9-part profile", () => {
    for (const iface of PRIMARY_INTERFACES) {
      expect(UI_INTERFACE_PROFILES[iface]).toBeDefined();
      const architecture = uiArchitectureFor(iface);
      for (const part of UI_ARCHITECTURE_PARTS) expect(architecture[part], `${iface} missing ${part}`).toBe(true);
    }
  });
});

describe("Live/future flag counts (AF-093)", () => {
  it("3 of 11 HUD elements live (health/shield/notifications); 2 of 5 nav devices live; 3 of 7 feedback channels live; 2 of 8 inventory features live; 5 of 7 build kinds live; 3 of 11 accessibility surfaces live", () => {
    expect(Object.values(HUD_ELEMENT_LIVE).filter(Boolean).length).toBe(3);
    expect(Object.values(NAVIGATION_DEVICE_LIVE).filter(Boolean).length).toBe(2);
    expect(Object.values(PLAYER_FEEDBACK_LIVE).filter(Boolean).length).toBe(3);
    expect(Object.values(INVENTORY_EXPERIENCE_LIVE).filter(Boolean).length).toBe(2);
    let liveBuild = 0;
    for (const kind of BUILD_MANAGEMENT_KINDS) if (BUILD_MANAGEMENT_REALISATION[kind].kind === "existing") liveBuild += 1;
    expect(liveBuild).toBe(5);
    expect(Object.values(UX_ACCESSIBILITY_SURFACES).filter(Boolean).length).toBe(3);
  });

  it("every notification category realises onto the real lootNotices toast queue", () => {
    for (const category of NOTIFICATION_CATEGORIES) {
      expect(NOTIFICATION_CATEGORY_BINDING[category]).toBe("lootNotices toast queue");
    }
  });
});

describe("Live summary functions (AF-093)", () => {
  it("navigationRealisationSummary/hudLiveSummary/buildManagementLiveSummary report the real counted totals", () => {
    expect(navigationRealisationSummary()).toBe("ui 3 live/4 fused/7 future");
    expect(hudLiveSummary()).toBe("hud 3/11 live");
    expect(buildManagementLiveSummary()).toBe("5/7 live");
  });

  it("inputLatencyProxyMs is a real, bounded frame-time proxy: higher fps means lower latency, 0 fps means 0", () => {
    expect(inputLatencyProxyMs(0)).toBe(0);
    expect(inputLatencyProxyMs(60)).toBeCloseTo(16.67, 1);
    expect(inputLatencyProxyMs(120)).toBeLessThan(inputLatencyProxyMs(60));
  });
});

describe("User Experience Framework — self-review (AF-093 §Self Review Loop)", () => {
  it("120 seeded fps samples: latency proxy stays non-negative and monotonically decreases as fps rises", () => {
    for (let seed = 0; seed < 120; seed += 1) {
      const rng = new Rng(seed);
      const fps = 1 + rng.next() * 240;
      const latency = inputLatencyProxyMs(fps);
      if (latency < 0) throw new Error(`seed ${seed}: negative latency`);
      const doubledFpsLatency = inputLatencyProxyMs(fps * 2);
      if (doubledFpsLatency > latency) throw new Error(`seed ${seed}: doubling fps increased latency`);
    }
  });
});
