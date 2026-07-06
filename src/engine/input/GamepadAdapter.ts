/**
 * Gamepad adapter (AF-019 §6): polls the Gamepad API once per frame,
 * translating buttons to "pad:*" binding codes and the left stick to the
 * analogue movement axis. Hot-swap: the most recently active pad wins;
 * layout maps drive dynamic button prompts.
 */
import type { ActionInput } from "./ActionInput";

/** Standard-mapping button indices → semantic pad codes (layout-agnostic). */
const BUTTON_CODES: Readonly<Record<number, string>> = {
  0: "pad:south",
  1: "pad:east",
  2: "pad:west",
  3: "pad:north",
  8: "pad:back",
  9: "pad:start",
  12: "pad:dpadUp",
  13: "pad:dpadDown",
  14: "pad:dpadLeft",
  15: "pad:dpadRight",
};

export type PadLayout = "xbox" | "playstation" | "nintendo" | "generic";

/** Prompt glyph names per layout — consumed by the UI for dynamic prompts. */
export const PROMPT_LABELS: Readonly<Record<PadLayout, Readonly<Record<string, string>>>> = {
  xbox: { "pad:south": "A", "pad:east": "B", "pad:west": "X", "pad:north": "Y" },
  playstation: { "pad:south": "Cross", "pad:east": "Circle", "pad:west": "Square", "pad:north": "Triangle" },
  nintendo: { "pad:south": "B", "pad:east": "A", "pad:west": "Y", "pad:north": "X" },
  generic: { "pad:south": "1", "pad:east": "2", "pad:west": "3", "pad:north": "4" },
};

export function detectLayout(id: string): PadLayout {
  const lower = id.toLowerCase();
  if (lower.includes("dualsense") || lower.includes("dualshock") || lower.includes("playstation")) {
    return "playstation";
  }
  if (lower.includes("nintendo") || lower.includes("joy-con") || lower.includes("pro controller")) {
    return "nintendo";
  }
  if (lower.includes("xbox") || lower.includes("xinput")) return "xbox";
  return "generic";
}

export class GamepadAdapter {
  private readonly previousDown = new Set<string>();
  private activePadIndex: number | null = null;

  layout: PadLayout = "generic";

  constructor(private readonly input: ActionInput) {}

  /** Poll once per rendered frame. */
  poll(): void {
    const pads = navigator.getGamepads?.() ?? [];
    let pad: Gamepad | null = null;
    if (this.activePadIndex !== null) pad = pads[this.activePadIndex] ?? null;
    if (!pad) {
      for (const candidate of pads) {
        if (candidate) {
          pad = candidate; // hot-swap: adopt the first live pad
          this.activePadIndex = candidate.index;
          this.layout = detectLayout(candidate.id);
          break;
        }
      }
    }
    if (!pad) return;

    for (const [indexText, code] of Object.entries(BUTTON_CODES)) {
      const pressed = pad.buttons[Number(indexText)]?.pressed ?? false;
      const wasDown = this.previousDown.has(code);
      if (pressed && !wasDown) {
        this.previousDown.add(code);
        this.input.handleCodeDown(code);
      } else if (!pressed && wasDown) {
        this.previousDown.delete(code);
        this.input.handleCodeUp(code);
      }
    }

    const x = pad.axes[0] ?? 0;
    const y = pad.axes[1] ?? 0;
    this.input.setAnalogMove(x, y);
  }
}
