/**
 * Keyboard + mouse adapter (AF-019 §6): translates DOM events into binding
 * codes for the ActionInput core. Event-driven — zero polling cost. Raw
 * codes never leave this file except as "key:*" / "mouse:*" binding codes.
 */
import type { ActionInput } from "./ActionInput";

export class KeyboardMouseAdapter {
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return; // reduced button repetition: repeats never synthesise presses
    if (this.input.handleCodeDown(`key:${event.code}`) !== null) event.preventDefault();
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.input.handleCodeUp(`key:${event.code}`);
  };

  private readonly onMouseDown = (event: MouseEvent): void => {
    this.input.handleCodeDown(`mouse:${event.button}`);
  };

  private readonly onMouseUp = (event: MouseEvent): void => {
    this.input.handleCodeUp(`mouse:${event.button}`);
  };

  constructor(private readonly input: ActionInput) {}

  attach(target: Window = window): void {
    target.addEventListener("keydown", this.onKeyDown);
    target.addEventListener("keyup", this.onKeyUp);
    target.addEventListener("mousedown", this.onMouseDown);
    target.addEventListener("mouseup", this.onMouseUp);
  }

  detach(target: Window = window): void {
    target.removeEventListener("keydown", this.onKeyDown);
    target.removeEventListener("keyup", this.onKeyUp);
    target.removeEventListener("mousedown", this.onMouseDown);
    target.removeEventListener("mouseup", this.onMouseUp);
  }
}
