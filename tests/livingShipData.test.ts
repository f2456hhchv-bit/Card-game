import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import { RYKER_ENGINEER_ID } from "../src/game/commanders/cmd003EliasRyker";
import { THORNE_STARFORGED_ID } from "../src/game/commanders/cmd009CassiaThorne";
import { ISKANDER_SWARMMASTER_ID } from "../src/game/commanders/cmd008NovaIskander";
import { NOVA_ARCHITECT_ID } from "../src/game/commanders/cmd020CaelusNova";
import { ORIS_NANOFORGE_ID } from "../src/game/commanders/cmd025XantheOris";
import { LYRA_VOSS_ID } from "../src/game/commanders/cmd001LyraVoss";
import { CAEL_WEAVER_ID } from "../src/game/commanders/cmd004SeraphinaCael";
import { SYN_BIOFORGE_ID } from "../src/game/commanders/cmd013MiraSyn";
import { HELIX_ALCHEMIST_ID } from "../src/game/commanders/cmd027SoraHelix";
import {
  BRIDGE_FUNCTIONS,
  DAILY_LIFE_ACTIVITIES,
  ENGINEERING_BAY_COMMANDER_IDS,
  LABORATORY_COMMANDER_IDS,
  MEMORIAL_GARDEN_ENTRY_KINDS,
  PLAYER_INTERACTIONS,
  PLAYER_ROOM,
  PLAYER_ROOM_DISPLAY_CATEGORIES,
  SHIP_AUDIO_LAYERS,
  SHIP_DEFAULT_NAME,
  SHIP_DYNAMIC_EVENTS,
  SHIP_NAME_MEANING,
  SHIP_SEASONAL_EVENTS,
  SHIP_SECTIONS,
  SHIP_UPGRADE_CATEGORIES,
  SHIP_UPGRADE_MAX_LEVEL,
  INITIAL_SHIP_UPGRADES,
  commanderRoomsFor,
} from "../src/game/livingShip/livingShipData";
import { CompanionHabitatRuntime, LivingShipRuntime, MemorialGardenLog } from "../src/game/livingShip/LivingShipRuntime";

describe("The Living Expedition Ship (AF-131)", () => {
  it("defaults to the spec'd ship name and meaning", () => {
    expect(SHIP_DEFAULT_NAME).toBe("A.S.V. Afterlight");
    expect(SHIP_NAME_MEANING).toBe("Atlas Survival Vessel");
  });

  it("registers exactly the spec'd section/upgrade/activity/event/interaction/audio/season/display/memorial counts", () => {
    expect(SHIP_SECTIONS.length).toBe(20);
    expect(SHIP_UPGRADE_CATEGORIES.length).toBe(10);
    expect(DAILY_LIFE_ACTIVITIES.length).toBe(11);
    expect(SHIP_DYNAMIC_EVENTS.length).toBe(10);
    expect(PLAYER_INTERACTIONS.length).toBe(10);
    expect(SHIP_AUDIO_LAYERS.length).toBe(7);
    expect(SHIP_SEASONAL_EVENTS.length).toBe(5);
    expect(PLAYER_ROOM_DISPLAY_CATEGORIES.length).toBe(9);
    expect(MEMORIAL_GARDEN_ENTRY_KINDS.length).toBe(5);
    expect(BRIDGE_FUNCTIONS.length).toBe(7);
    expect(PLAYER_ROOM.displayCategories).toBe(PLAYER_ROOM_DISPLAY_CATEGORIES);
  });

  it("resolves Engineering's first-name-only cast (Cassia, Elias, Caelus, Nova, Xanthe) to the real, correctly-named roster ids", () => {
    expect(ENGINEERING_BAY_COMMANDER_IDS.length).toBe(5);
    expect([...ENGINEERING_BAY_COMMANDER_IDS].sort()).toEqual([THORNE_STARFORGED_ID, RYKER_ENGINEER_ID, NOVA_ARCHITECT_ID, ISKANDER_SWARMMASTER_ID, ORIS_NANOFORGE_ID].sort());
    const rosterIds = new Set(FULL_ROSTER_WITH_FOUNDER.map((c) => c.id));
    for (const id of ENGINEERING_BAY_COMMANDER_IDS) expect(rosterIds, id).toContain(id);
    const cassia = FULL_ROSTER_WITH_FOUNDER.find((c) => c.id === THORNE_STARFORGED_ID);
    const nova = FULL_ROSTER_WITH_FOUNDER.find((c) => c.id === NOVA_ARCHITECT_ID);
    expect(cassia?.name).toBe("Cassia Thorne");
    expect(nova?.name).toBe("Caelus Nova");
  });

  it("resolves Laboratory's first-name-only cast (Lyra, Seraphina, Mira, Sora) to the real, correctly-named roster ids", () => {
    expect(LABORATORY_COMMANDER_IDS.length).toBe(4);
    expect([...LABORATORY_COMMANDER_IDS].sort()).toEqual([LYRA_VOSS_ID, CAEL_WEAVER_ID, SYN_BIOFORGE_ID, HELIX_ALCHEMIST_ID].sort());
    const rosterIds = new Set(FULL_ROSTER_WITH_FOUNDER.map((c) => c.id));
    for (const id of LABORATORY_COMMANDER_IDS) expect(rosterIds, id).toContain(id);
    const lyra = FULL_ROSTER_WITH_FOUNDER.find((c) => c.id === LYRA_VOSS_ID);
    expect(lyra?.name).toContain("Lyra Voss");
  });

  it("gives every real roster commander (53) exactly one real, uniquely-keyed room", () => {
    const rooms = commanderRoomsFor(FULL_ROSTER_WITH_FOUNDER);
    expect(rooms.length).toBe(FULL_ROSTER_WITH_FOUNDER.length);
    const roomIds = new Set(rooms.map((r) => r.roomId));
    expect(roomIds.size).toBe(rooms.length);
    for (const room of rooms) expect(room.personalBelongingIds.length).toBe(3);
  });

  it("LivingShipRuntime upgrades only ever increase, capped at the max level per category", () => {
    const ship = new LivingShipRuntime(INITIAL_SHIP_UPGRADES);
    expect(ship.name).toBe(SHIP_DEFAULT_NAME);
    expect(ship.upgradeLevel("Power Grid")).toBe(0);
    ship.upgrade("Power Grid");
    expect(ship.upgradeLevel("Power Grid")).toBe(1);
    for (let i = 0; i < 20; i++) ship.upgrade("Power Grid");
    expect(ship.upgradeLevel("Power Grid")).toBe(SHIP_UPGRADE_MAX_LEVEL);
  });

  it("the ship name is customisable later, per the spec", () => {
    const ship = new LivingShipRuntime(INITIAL_SHIP_UPGRADES);
    ship.rename("The Long Way Home");
    expect(ship.name).toBe("The Long Way Home");
    ship.rename("   ");
    expect(ship.name).toBe("The Long Way Home");
  });

  it("snapshot reports real, consistent upgrade totals", () => {
    const ship = new LivingShipRuntime(INITIAL_SHIP_UPGRADES);
    ship.upgrade("Research");
    ship.upgrade("Research");
    const snap = ship.snapshot();
    expect(snap.totalCategories).toBe(SHIP_UPGRADE_CATEGORIES.length);
    expect(snap.totalUpgradeLevel).toBe(2);
    expect(snap.maxUpgradeLevel).toBe(SHIP_UPGRADE_CATEGORIES.length * SHIP_UPGRADE_MAX_LEVEL);
    expect(snap.fullyUpgradedCategories).toBe(0);
  });

  it("MemorialGardenLog requires a non-empty legacyNote — 'never exploit grief, celebrate legacy' is structural, not just a promise", () => {
    const garden = new MemorialGardenLog();
    expect(() => garden.record("Major sacrifices", "Lost during the Meridian Rest defence.", "")).toThrow();
    garden.record("Major sacrifices", "Lost during the Meridian Rest defence.", "Remembered for saving the entire evacuation convoy.");
    expect(garden.all().length).toBe(1);
    expect(garden.all()[0]!.legacyNote.length).toBeGreaterThan(0);
  });

  it("CompanionHabitatRuntime rescues real companions and never duplicates by id", () => {
    const habitat = new CompanionHabitatRuntime();
    habitat.rescue({ id: "comp-1", species: "Verdant Fox", name: "Ember", mood: "curious" });
    habitat.rescue({ id: "comp-1", species: "Verdant Fox", name: "Ember", mood: "curious" });
    habitat.rescue({ id: "comp-2", species: "Sky Ray", name: "Glide", mood: "playful" });
    expect(habitat.count()).toBe(2);
    expect(habitat.all().map((c) => c.id).sort()).toEqual(["comp-1", "comp-2"]);
  });
});
