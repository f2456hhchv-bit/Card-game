/**
 * Typed publish/subscribe event bus — the only cross-system communication
 * channel in Afterlight (AF-001 §7). Systems publish past-tense facts;
 * no publisher knows who is listening.
 */
export type Listener<P> = (payload: P) => void;

export class EventBus<E extends Record<string, unknown>> {
  private readonly listeners = new Map<keyof E, Set<Listener<never>>>();

  /** Subscribe. Returns an unsubscribe function. */
  on<K extends keyof E>(event: K, listener: Listener<E[K]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as Listener<never>);
    return () => this.off(event, listener);
  }

  off<K extends keyof E>(event: K, listener: Listener<E[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<never>);
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of set) {
      (listener as Listener<E[K]>)(payload);
    }
  }

  listenerCount(event: keyof E): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
