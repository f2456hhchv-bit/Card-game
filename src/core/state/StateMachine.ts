/**
 * Generic game state machine (AF-016 §2). Legal transitions live in a data
 * table, never scattered conditionals. Overlay states stack on a base state
 * without disturbing it (pause-anywhere, level-up). Illegal transitions
 * throw in strict (dev) mode and are refused-and-reported in production
 * (AF-001 §9 graceful failure). Transition durations are measured against
 * the 250ms budget.
 */
export interface StateHooks<S extends string> {
  onEnter?: (from: S | null) => void;
  onExit?: (to: S) => void;
}

export interface TransitionInfo<S extends string> {
  from: S;
  to: S;
  durationMs: number;
  kind: "transition" | "overlay-push" | "overlay-pop";
}

export interface StateMachineOptions<S extends string> {
  initial: S;
  /** Base-state adjacency: which states each state may transition to. */
  transitions: Readonly<Record<S, readonly S[]>>;
  /** Overlay → base states it may stack on. */
  overlayHosts?: Readonly<Partial<Record<S, readonly S[]>>>;
  hooks?: Readonly<Partial<Record<S, StateHooks<S>>>>;
  /** Throw on illegal transitions (dev) instead of refusing (production). */
  strict?: boolean;
  now?: () => number;
  onTransition?: (info: TransitionInfo<S>) => void;
  onRejected?: (from: S, to: S, reason: string) => void;
}

export class StateMachine<S extends string> {
  private baseState: S;
  private readonly overlayStack: S[] = [];
  private readonly transitions: Readonly<Record<S, readonly S[]>>;
  private readonly overlayHosts: Readonly<Partial<Record<S, readonly S[]>>>;
  private readonly hooks: Readonly<Partial<Record<S, StateHooks<S>>>>;
  private readonly strict: boolean;
  private readonly now: () => number;
  private readonly onTransition: ((info: TransitionInfo<S>) => void) | undefined;
  private readonly onRejected: ((from: S, to: S, reason: string) => void) | undefined;

  /** Duration of the most recent transition (AF-016: must stay < 250ms). */
  lastTransitionMs = 0;

  constructor(options: StateMachineOptions<S>) {
    this.transitions = options.transitions;
    this.overlayHosts = options.overlayHosts ?? ({} as Partial<Record<S, readonly S[]>>);
    this.hooks = options.hooks ?? ({} as Partial<Record<S, StateHooks<S>>>);
    this.strict = options.strict ?? false;
    this.now = options.now ?? (() => performance.now());
    this.onTransition = options.onTransition;
    this.onRejected = options.onRejected;
    this.baseState = options.initial;
    this.hooks[options.initial]?.onEnter?.(null);
  }

  /** The underlying base state (e.g. Gameplay while Pause is stacked). */
  get base(): S {
    return this.baseState;
  }

  /** The state the player currently sees: top overlay, else base. */
  get current(): S {
    const top = this.overlayStack[this.overlayStack.length - 1];
    return top ?? this.baseState;
  }

  get overlays(): readonly S[] {
    return this.overlayStack;
  }

  isOverlay(state: S): boolean {
    return this.overlayHosts[state] !== undefined;
  }

  /** Base-state transition. Pops all overlays (exiting each) first. */
  transitionTo(to: S): boolean {
    const from = this.baseState;
    if (this.isOverlay(to)) {
      return this.reject(from, to, "target is an overlay state; use pushOverlay");
    }
    if (!this.transitions[from].includes(to)) {
      return this.reject(from, to, "transition not in legal-transition table");
    }
    const started = this.now();
    while (this.overlayStack.length > 0) {
      const overlay = this.overlayStack.pop() as S;
      this.hooks[overlay]?.onExit?.(to);
    }
    this.hooks[from]?.onExit?.(to);
    this.baseState = to;
    this.hooks[to]?.onEnter?.(from);
    this.lastTransitionMs = this.now() - started;
    this.onTransition?.({ from, to, durationMs: this.lastTransitionMs, kind: "transition" });
    return true;
  }

  pushOverlay(overlay: S): boolean {
    const hosts = this.overlayHosts[overlay];
    if (!hosts) {
      return this.reject(this.current, overlay, "state is not a registered overlay");
    }
    if (!hosts.includes(this.baseState)) {
      return this.reject(this.current, overlay, `overlay not permitted on base "${this.baseState}"`);
    }
    if (this.overlayStack.includes(overlay)) {
      return this.reject(this.current, overlay, "overlay already active");
    }
    const started = this.now();
    const from = this.current;
    this.overlayStack.push(overlay);
    this.hooks[overlay]?.onEnter?.(from);
    this.lastTransitionMs = this.now() - started;
    this.onTransition?.({ from, to: overlay, durationMs: this.lastTransitionMs, kind: "overlay-push" });
    return true;
  }

  popOverlay(): S | null {
    const overlay = this.overlayStack.pop();
    if (overlay === undefined) return null;
    const started = this.now();
    this.hooks[overlay]?.onExit?.(this.current);
    this.lastTransitionMs = this.now() - started;
    this.onTransition?.({
      from: overlay,
      to: this.current,
      durationMs: this.lastTransitionMs,
      kind: "overlay-pop",
    });
    return overlay;
  }

  private reject(from: S, to: S, reason: string): boolean {
    if (this.strict) {
      throw new Error(`StateMachine: illegal transition ${from} → ${to}: ${reason}`);
    }
    this.onRejected?.(from, to, reason);
    return false;
  }
}
