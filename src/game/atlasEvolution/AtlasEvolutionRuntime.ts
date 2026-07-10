import type { EvolutionTransitionState } from "./atlasEvolutionData";

interface TransitionRecord {
  state: EvolutionTransitionState;
  reason: string;
  epoch: number;
}

/** "Not all evolution succeeds. Civilisation may abandon ideas,
 * restore forgotten practices, rediscover older knowledge... every
 * meaningful change records origin, reason." Confirmed genuinely new
 * (see atlasEvolutionData.ts module doc comment): the FIRST tracker in
 * this codebase whose current state can legitimately regress to an
 * earlier value (Adopted → Abandoned → Restored) while remaining a
 * fully honest, traceable append-only history — every transition
 * requires an explicit reason, and nothing is ever removed from
 * `history`. */
export class EvolutionRecord {
  private readonly records = new Map<string, TransitionRecord[]>();

  transition(entityId: string, state: EvolutionTransitionState, reason: string, epoch: number): void {
    const history = this.records.get(entityId) ?? [];
    history.push({ state, reason, epoch });
    this.records.set(entityId, history);
  }

  currentStateOf(entityId: string): EvolutionTransitionState | null {
    const history = this.records.get(entityId);
    return history && history.length > 0 ? history[history.length - 1]!.state : null;
  }

  history(entityId: string): readonly TransitionRecord[] {
    return this.records.get(entityId) ?? [];
  }

  wasEverAbandoned(entityId: string): boolean {
    return this.history(entityId).some((r) => r.state === "Abandoned");
  }
}
