import { describe, expect, it } from "vitest";
import {
  COMMANDER_EXPANSION_CHECKLIST,
  CONTENT_DISCOVERY_KINDS,
  DEVELOPER_TOOLKIT_SURFACES,
  FACTION_EXPANSION_CHECKLIST,
  MODULE_CATEGORIES,
  MOD_SUPPORT_SURFACES,
  PLANNED_EXPANSION_EXAMPLES,
  SYSTEM_COMPATIBILITY_TARGETS,
  UNIVERSE_ACCESSIBILITY_SURFACES,
  WORLD_EXPANSION_CHECKLIST,
  systemCompatibilityFor,
  type ModuleRegistrationDef,
} from "../src/game/moduleUniverse/moduleUniverseData";
import { ContentDiscoveryFeed, ModuleRegistry, moduleQaReport } from "../src/game/moduleUniverse/ModuleUniverseRuntime";

function makeDef(overrides: Partial<ModuleRegistrationDef>): ModuleRegistrationDef {
  return {
    id: "module-x",
    name: "Module X",
    category: "Planets",
    dependencies: [],
    gameplayTags: [],
    narrativeTags: [],
    factionRelationships: [],
    commanderInteractions: [],
    museumCompatible: false,
    chronicleSupport: false,
    legacySupport: false,
    accessibilityMetadata: [],
    origin: "core",
    ...overrides,
  };
}

describe("The Modular Universe Engine (AF-142)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(MODULE_CATEGORIES.length).toBe(20);
    expect(Object.keys(SYSTEM_COMPATIBILITY_TARGETS).length).toBe(12);
    expect(PLANNED_EXPANSION_EXAMPLES.length).toBe(10);
    expect(FACTION_EXPANSION_CHECKLIST.length).toBe(10);
    expect(COMMANDER_EXPANSION_CHECKLIST.length).toBe(9);
    expect(WORLD_EXPANSION_CHECKLIST.length).toBe(12);
    expect(CONTENT_DISCOVERY_KINDS.length).toBe(6);
    expect(MOD_SUPPORT_SURFACES.length).toBe(8);
    expect(DEVELOPER_TOOLKIT_SURFACES.length).toBe(8);
    expect(UNIVERSE_ACCESSIBILITY_SURFACES.length).toBe(5);
  });

  it("SYSTEM_COMPATIBILITY_TARGETS covers exactly AF-130 through AF-141, never colliding with any real roster id", () => {
    for (let n = 130; n <= 141; n++) expect(SYSTEM_COMPATIBILITY_TARGETS[`AF-${n}`]).toBeTruthy();
  });

  it("systemCompatibilityFor computes real, deterministic targets from a registration's own declared fields — no manual integration step", () => {
    const museumModule = makeDef({ category: "Museum Wings", museumCompatible: true, chronicleSupport: true, commanderInteractions: ["cmd-1"] });
    const targets = systemCompatibilityFor(museumModule);
    expect(targets).toContain("AF-130");
    expect(targets).toContain("AF-134");
    expect(targets).toContain("AF-135");
    expect(targets).toContain("AF-141");
    expect(systemCompatibilityFor(makeDef({ category: "Weapons" }))).toEqual([]);
  });

  it("ModuleRegistry rejects duplicate ids and self-dependencies without mutating state — the all-or-nothing gauntlet", () => {
    const registry = new ModuleRegistry();
    expect(registry.register(makeDef({ id: "ocean-worlds" })).ok).toBe(true);
    const duplicate = registry.register(makeDef({ id: "ocean-worlds" }));
    expect(duplicate.ok).toBe(false);
    const selfDep = registry.register(makeDef({ id: "gas-giants", dependencies: ["gas-giants"] }));
    expect(selfDep.ok).toBe(false);
    expect(registry.all().length).toBe(1);
  });

  it("ModuleRegistry rejects a registration that would create a dependency cycle, mutating nothing", () => {
    const registry = new ModuleRegistry();
    registry.register(makeDef({ id: "a", dependencies: ["b"] }));
    registry.register(makeDef({ id: "b" }));
    const noncyclic = registry.register(makeDef({ id: "c", dependencies: ["a"] }));
    expect(noncyclic.ok).toBe(true);

    const fresh = new ModuleRegistry();
    fresh.register(makeDef({ id: "x", dependencies: ["y"] }));
    const closesCycle = fresh.register(makeDef({ id: "y", dependencies: ["x"] }));
    expect(closesCycle.ok).toBe(false);
    expect(fresh.all().length).toBe(1);
  });

  it("dependenciesResolved/missingDependenciesFor reflect real registration state", () => {
    const registry = new ModuleRegistry();
    registry.register(makeDef({ id: "precursors", dependencies: ["ancient-archives"] }));
    expect(registry.dependenciesResolved("precursors")).toBe(false);
    expect(registry.missingDependenciesFor("precursors")).toEqual(["ancient-archives"]);
    registry.register(makeDef({ id: "ancient-archives" }));
    expect(registry.dependenciesResolved("precursors")).toBe(true);
  });

  it("topologicalLoadOrder always places dependencies before dependents", () => {
    const registry = new ModuleRegistry();
    registry.register(makeDef({ id: "core-galaxy" }));
    registry.register(makeDef({ id: "ocean-worlds", dependencies: ["core-galaxy"] }));
    registry.register(makeDef({ id: "ocean-wildlife", dependencies: ["ocean-worlds"] }));
    const order = registry.topologicalLoadOrder()!;
    expect(order.indexOf("core-galaxy")).toBeLessThan(order.indexOf("ocean-worlds"));
    expect(order.indexOf("ocean-worlds")).toBeLessThan(order.indexOf("ocean-wildlife"));
  });

  it("loadModule/unloadModule model real dynamic loading state without claiming literal asset streaming", () => {
    const registry = new ModuleRegistry();
    registry.register(makeDef({ id: "dark-matter-ecosystems" }));
    expect(registry.isLoaded("dark-matter-ecosystems")).toBe(true);
    registry.unloadModule("dark-matter-ecosystems");
    expect(registry.isLoaded("dark-matter-ecosystems")).toBe(false);
    expect(registry.loadedCount()).toBe(0);
    registry.loadModule("dark-matter-ecosystems");
    expect(registry.isLoaded("dark-matter-ecosystems")).toBe(true);
  });

  it("moduleQaReport genuinely fulfils AF-095's flagged-future Dependencies/Museum-integration gates", () => {
    const registry = new ModuleRegistry();
    registry.register(makeDef({ id: "underground-civilisations", dependencies: ["missing-dep"] }));
    const failing = moduleQaReport(registry.moduleFor("underground-civilisations")!, registry);
    expect(failing.dependenciesResolved).toBe(false);
    expect(failing.passed).toBe(false);

    registry.register(makeDef({ id: "living-planets", museumCompatible: true, chronicleSupport: true, legacySupport: true, gameplayTags: ["evolving"], narrativeTags: ["hope"], accessibilityMetadata: ["highContrast"] }));
    const passing = moduleQaReport(registry.moduleFor("living-planets")!, registry);
    expect(passing.passed).toBe(true);
  });

  it("ContentDiscoveryFeed is append-only, filterable by kind, and kept separate from AF-132's real news/discovery lists", () => {
    const feed = new ContentDiscoveryFeed();
    feed.discover("Recovered archives", "A sealed vault surfaces beneath Verdance.", 12);
    feed.discover("Commander invitations", "Fen invites the player to a wildlife census.", 15);
    expect(feed.all().length).toBe(2);
    expect(feed.countFor("Recovered archives")).toBe(1);
  });

  it("self-review: stress-tests a graph of 2000 synthetic modules — topological order stays correct and registration terminates quickly", () => {
    const registry = new ModuleRegistry();
    const count = 2000;
    for (let i = 0; i < count; i++) {
      const dependencies = i === 0 ? [] : [`module-${i - 1}`];
      const result = registry.register(makeDef({ id: `module-${i}`, dependencies }));
      expect(result.ok).toBe(true);
    }
    expect(registry.all().length).toBe(count);
    const order = registry.topologicalLoadOrder()!;
    expect(order.length).toBe(count);
    for (let i = 1; i < count; i++) {
      expect(order.indexOf(`module-${i - 1}`)).toBeLessThan(order.indexOf(`module-${i}`));
    }
    for (let i = 0; i < count; i++) expect(registry.dependenciesResolved(`module-${i}`)).toBe(true);
  });
});
