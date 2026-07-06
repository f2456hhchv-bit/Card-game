import { describe, expect, it, vi } from "vitest";
import { StateMachine } from "../src/core/state/StateMachine";
import {
  GAME_TRANSITIONS,
  OVERLAY_HOSTS,
  type GameStateId,
} from "../src/game/states/GameStates";

const makeMachine = (options?: { strict?: boolean; onRejected?: () => void }) =>
  new StateMachine<GameStateId>({
    initial: "Boot",
    transitions: GAME_TRANSITIONS,
    overlayHosts: OVERLAY_HOSTS,
    strict: options?.strict ?? true,
    now: () => 0,
    ...(options?.onRejected ? { onRejected: options.onRejected } : {}),
  });

describe("Game state machine (AF-016 §2)", () => {
  it("walks the full primary loop happy path", () => {
    const machine = makeMachine();
    const path: GameStateId[] = [
      "Splash",
      "MainMenu",
      "GalaxyCommand",
      "MissionSelect",
      "Loading",
      "Gameplay",
      "MissionComplete",
      "GalaxyCommand",
    ];
    for (const state of path) {
      expect(machine.transitionTo(state)).toBe(true);
    }
    expect(machine.base).toBe("GalaxyCommand");
  });

  it("routes defeat through the same results flow", () => {
    const machine = makeMachine();
    for (const s of ["Splash", "MainMenu", "GalaxyCommand", "MissionSelect", "Loading", "Gameplay"] as const) {
      machine.transitionTo(s);
    }
    expect(machine.transitionTo("Defeat")).toBe(true);
    expect(machine.transitionTo("GalaxyCommand")).toBe(true);
  });

  it("throws on illegal transitions in strict (dev) mode", () => {
    const machine = makeMachine();
    expect(() => machine.transitionTo("Gameplay")).toThrow(/illegal transition/);
  });

  it("refuses and reports illegal transitions in production mode", () => {
    const onRejected = vi.fn();
    const machine = makeMachine({ strict: false, onRejected });
    expect(machine.transitionTo("Gameplay")).toBe(false);
    expect(machine.base).toBe("Boot");
    expect(onRejected).toHaveBeenCalledTimes(1);
  });

  it("reserved states (Multiplayer, CommunityHub) are unreachable", () => {
    for (const [, targets] of Object.entries(GAME_TRANSITIONS)) {
      expect(targets).not.toContain("Multiplayer");
      expect(targets).not.toContain("CommunityHub");
    }
  });

  it("overlays stack on Gameplay and pop without disturbing the base state", () => {
    const machine = makeMachine();
    for (const s of ["Splash", "MainMenu", "GalaxyCommand", "MissionSelect", "Loading", "Gameplay"] as const) {
      machine.transitionTo(s);
    }
    expect(machine.pushOverlay("Pause")).toBe(true);
    expect(machine.current).toBe("Pause");
    expect(machine.base).toBe("Gameplay");
    expect(machine.popOverlay()).toBe("Pause");
    expect(machine.current).toBe("Gameplay");
  });

  it("overlays are refused outside their host states", () => {
    const machine = makeMachine({ strict: false });
    machine.transitionTo("Splash");
    expect(machine.pushOverlay("Pause")).toBe(false);
  });

  it("abandoning from Pause pops overlays and exits Gameplay in one transition", () => {
    const exits: string[] = [];
    const machine = new StateMachine<GameStateId>({
      initial: "Gameplay",
      transitions: GAME_TRANSITIONS,
      overlayHosts: OVERLAY_HOSTS,
      strict: true,
      now: () => 0,
      hooks: {
        Pause: { onExit: () => exits.push("Pause") },
        Gameplay: { onExit: () => exits.push("Gameplay") },
      },
    });
    machine.pushOverlay("Pause");
    expect(machine.transitionTo("GalaxyCommand")).toBe(true);
    expect(exits).toEqual(["Pause", "Gameplay"]); // overlay exited before base
    expect(machine.overlays).toHaveLength(0);
    expect(machine.base).toBe("GalaxyCommand");
  });

  it("records transition duration against the 250ms budget", () => {
    let clock = 0;
    const machine = new StateMachine<GameStateId>({
      initial: "Boot",
      transitions: GAME_TRANSITIONS,
      overlayHosts: OVERLAY_HOSTS,
      strict: true,
      now: () => (clock += 5),
    });
    machine.transitionTo("Splash");
    expect(machine.lastTransitionMs).toBeGreaterThan(0);
    expect(machine.lastTransitionMs).toBeLessThan(250);
  });
});
