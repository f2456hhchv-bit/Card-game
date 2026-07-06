/**
 * System registry and lifecycle owner (AF-001 §3). Systems are registered in
 * update order; a system throwing in update is isolated and reported, never
 * allowed to take down the loop (AF-001 §9). Three consecutive failures
 * disable the system until re-enabled.
 */
export interface System {
  readonly name: string;
  init?(): void;
  update?(fixedDtMs: number): void;
  dispose?(): void;
}

const CONSECUTIVE_ERRORS_TO_DISABLE = 3;

export class GameManager {
  private readonly systems: System[] = [];
  private readonly errorStreaks = new Map<string, number>();
  private readonly disabled = new Set<string>();

  constructor(
    private readonly onError: (system: string, error: unknown) => void,
  ) {}

  register(system: System): void {
    if (this.systems.some((s) => s.name === system.name)) {
      throw new Error(`GameManager: duplicate system name "${system.name}"`);
    }
    this.systems.push(system);
  }

  initAll(): void {
    for (const system of this.systems) {
      this.guard(system, () => system.init?.());
    }
  }

  update(fixedDtMs: number): void {
    for (const system of this.systems) {
      if (this.disabled.has(system.name)) continue;
      this.guard(system, () => system.update?.(fixedDtMs));
    }
  }

  dispose(): void {
    for (const system of this.systems) {
      this.guard(system, () => system.dispose?.());
    }
    this.systems.length = 0;
    this.disabled.clear();
    this.errorStreaks.clear();
  }

  isDisabled(name: string): boolean {
    return this.disabled.has(name);
  }

  reenable(name: string): void {
    this.disabled.delete(name);
    this.errorStreaks.delete(name);
  }

  private guard(system: System, run: () => void): void {
    try {
      run();
      this.errorStreaks.delete(system.name);
    } catch (error) {
      const streak = (this.errorStreaks.get(system.name) ?? 0) + 1;
      this.errorStreaks.set(system.name, streak);
      if (streak >= CONSECUTIVE_ERRORS_TO_DISABLE) {
        this.disabled.add(system.name);
      }
      this.onError(system.name, error);
    }
  }
}
