import { describe, expect, it } from "vitest";
import { ActionInput } from "../src/engine/input/ActionInput";
import { TouchJoystick } from "../src/engine/input/TouchJoystick";
import { detectLayout } from "../src/engine/input/GamepadAdapter";
import {
  DEFAULT_BINDINGS,
  DEFAULT_INPUT_TUNING,
} from "../src/engine/input/inputTuning";

const STEP = 1000 / 60;

function makeInput(): ActionInput {
  const input = new ActionInput(DEFAULT_INPUT_TUNING, DEFAULT_BINDINGS);
  input.setContext("gameplay");
  return input;
}

describe("ActionInput — edges and state", () => {
  it("maps codes to actions with press/hold/release edges", () => {
    const input = makeInput();
    expect(input.handleCodeDown("key:Space")).toBe("Boost");
    input.update(STEP);
    expect(input.wasPressed("Boost")).toBe(true);
    expect(input.isDown("Boost")).toBe(true);

    input.update(STEP);
    expect(input.wasPressed("Boost")).toBe(false); // edge lasts one update
    expect(input.isDown("Boost")).toBe(true);

    input.handleCodeUp("key:Space");
    input.update(STEP);
    expect(input.wasReleased("Boost")).toBe(true);
    expect(input.isDown("Boost")).toBe(false);
  });

  it("unknown codes are ignored", () => {
    const input = makeInput();
    expect(input.handleCodeDown("key:KeyZ")).toBeNull();
  });
});

describe("ActionInput — context gating (AF-019 §2)", () => {
  it("suppresses gameplay actions in overlay context, but Pause always fires", () => {
    const input = makeInput();
    input.setContext("overlay");
    expect(input.handleCodeDown("key:Space")).toBeNull(); // Boost suppressed
    expect(input.handleCodeDown("key:Escape")).toBe("Pause"); // system class always allowed
  });

  it("releases held gameplay actions when entering a suppressing context", () => {
    const input = makeInput();
    input.handleCodeDown("key:KeyW");
    input.update(STEP);
    expect(input.isDown("MoveUp")).toBe(true);

    input.setContext("overlay");
    input.update(STEP);
    expect(input.isDown("MoveUp")).toBe(false);
    expect(input.wasReleased("MoveUp")).toBe(true); // clean release, no stuck keys
  });

  it("secondary actions work in menus but not overlays", () => {
    const input = makeInput();
    input.setContext("menu");
    expect(input.handleCodeDown("key:KeyM")).toBe("MissionMap");
    input.setContext("overlay");
    expect(input.handleCodeDown("key:KeyO")).toBeNull();
  });
});

describe("ActionInput — movement (AF-019 §3)", () => {
  it("digital movement normalises diagonals and smooths deterministically", () => {
    const input = makeInput();
    input.handleCodeDown("key:KeyW");
    input.handleCodeDown("key:KeyD");
    for (let i = 0; i < 200; i += 1) input.update(STEP);
    const { x, y } = input.movement;
    expect(Math.hypot(x, y)).toBeCloseTo(1, 2); // normalised, not 1.41
    expect(x).toBeCloseTo(Math.SQRT1_2, 2);
    expect(y).toBeCloseTo(-Math.SQRT1_2, 2);
  });

  it("radial deadzone rescales without a snap at the edge", () => {
    const input = makeInput();
    input.setAnalogMove(DEFAULT_INPUT_TUNING.deadzone * 0.9, 0); // inside deadzone
    for (let i = 0; i < 200; i += 1) input.update(STEP);
    expect(input.movement.x).toBe(0);

    input.setAnalogMove(DEFAULT_INPUT_TUNING.deadzone + 0.01, 0); // just outside
    for (let i = 0; i < 200; i += 1) input.update(STEP);
    expect(input.movement.x).toBeGreaterThan(0);
    expect(input.movement.x).toBeLessThan(0.1); // rescaled from ~0, no jump
  });

  it("is deterministic: identical sequences produce identical vectors", () => {
    const play = (): string => {
      const input = makeInput();
      input.handleCodeDown("key:KeyD");
      for (let i = 0; i < 30; i += 1) input.update(STEP);
      input.setAnalogMove(0.7, -0.4);
      for (let i = 0; i < 30; i += 1) input.update(STEP);
      return `${input.movement.x},${input.movement.y}`;
    };
    expect(play()).toBe(play());
  });
});

describe("ActionInput — buffering (AF-019 §4)", () => {
  it("honours a press within the buffer window, once", () => {
    const input = makeInput();
    input.handleCodeDown("key:KeyQ"); // Ultimate pressed
    input.update(STEP);
    input.update(STEP); // ~33ms later, well inside the 150ms window
    expect(input.consumeBuffered("Ultimate")).toBe(true);
    expect(input.consumeBuffered("Ultimate")).toBe(false); // consumed exactly once
  });

  it("expires presses outside the window", () => {
    const input = makeInput();
    input.handleCodeDown("key:KeyQ");
    for (let i = 0; i < 20; i += 1) input.update(STEP); // ~333ms > 150ms window
    expect(input.consumeBuffered("Ultimate")).toBe(false);
  });

  it("does not buffer non-bufferable actions", () => {
    const input = makeInput();
    input.handleCodeDown("key:KeyW"); // MoveUp is not bufferable
    input.update(STEP);
    expect(input.consumeBuffered("MoveUp")).toBe(false);
  });
});

describe("ActionInput — rebinding validation (AF-019 §5)", () => {
  it("rejects duplicate bindings with the conflicting action for recovery", () => {
    const input = makeInput();
    const result = input.bind("Boost", "key:KeyE"); // KeyE belongs to Interact
    expect(result).toEqual({ ok: false, reason: "duplicate", conflictAction: "Interact" });
  });

  it("never allows an action to lose its last binding", () => {
    const input = makeInput();
    expect(input.unbind("Ultimate", "pad:north").ok).toBe(true);
    const result = input.unbind("Ultimate", "key:KeyQ");
    expect(result).toEqual({ ok: false, reason: "lastBinding" });
  });

  it("accepts a fresh binding and routes it immediately", () => {
    const input = makeInput();
    expect(input.bind("Boost", "key:KeyB").ok).toBe(true);
    expect(input.handleCodeDown("key:KeyB")).toBe("Boost");
  });
});

describe("ActionInput — hold/toggle (AF-019 §8)", () => {
  it("toggle mode latches on press and unlatches on the next press", () => {
    const input = makeInput();
    expect(input.setActionMode("Boost", "toggle")).toBe(true);
    input.handleCodeDown("key:Space");
    input.handleCodeUp("key:Space"); // physical release does not end the action
    input.update(STEP);
    expect(input.isDown("Boost")).toBe(true);

    input.handleCodeDown("key:Space"); // second press unlatches
    input.update(STEP);
    expect(input.isDown("Boost")).toBe(false);
  });

  it("only toggle-capable actions accept toggle mode", () => {
    const input = makeInput();
    expect(input.setActionMode("Pause", "toggle")).toBe(false);
  });
});

describe("TouchJoystick (AF-019 §6)", () => {
  it("dynamic mode anchors where the thumb lands and deflects proportionally", () => {
    const stick = new TouchJoystick({ radius: 100, mode: "dynamic" });
    stick.touchStart(300, 300);
    stick.touchMove(350, 300); // half radius right
    expect(stick.vector.x).toBeCloseTo(0.5, 5);
    expect(stick.vector.y).toBeCloseTo(0, 5);
  });

  it("clamps deflection at full radius and resets on release", () => {
    const stick = new TouchJoystick({ radius: 100, mode: "dynamic" });
    stick.touchStart(0, 0);
    stick.touchMove(0, 500);
    expect(stick.vector.y).toBeCloseTo(1, 5);
    stick.touchEnd();
    expect(stick.vector).toEqual({ x: 0, y: 0 });
  });

  it("fixed mode uses the configured anchor", () => {
    const stick = new TouchJoystick({ radius: 100, mode: "fixed", anchorX: 100, anchorY: 100 });
    stick.touchStart(100, 50); // half radius up from the anchor
    expect(stick.vector.y).toBeCloseTo(-0.5, 5);
  });
});

describe("GamepadAdapter — layout detection (AF-019 §6)", () => {
  it("detects layouts from device ids for dynamic prompts", () => {
    expect(detectLayout("Xbox Wireless Controller (XInput)")).toBe("xbox");
    expect(detectLayout("Sony DualSense Wireless Controller")).toBe("playstation");
    expect(detectLayout("Nintendo Pro Controller")).toBe("nintendo");
    expect(detectLayout("USB Gamepad 8bitdo")).toBe("generic");
  });
});
