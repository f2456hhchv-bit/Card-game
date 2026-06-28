/**
 * Minimal typed publish/subscribe bus.
 *
 * Decouples gameplay systems from UI/audio: e.g. the combat system emits
 * `enemyKilled` without knowing that the HUD, audio, and statistics systems
 * each listen for it. Keeps systems modular and independently testable.
 */
export type Handler<P> = (payload: P) => void;

/**
 * `E` is an event-name → payload-type map (typically an interface). It is left
 * unconstrained so plain interfaces — which lack an implicit index signature —
 * can be used directly as the event map.
 */
export class EventBus<E> {
  private readonly handlers = new Map<keyof E, Set<Handler<unknown>>>();

  on<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    let set = this.handlers.get(event);
    if (set === undefined) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler as Handler<unknown>);
    // Return an unsubscribe function for ergonomic cleanup.
    return () => set!.delete(handler as Handler<unknown>);
  }

  once<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    const off = this.on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const set = this.handlers.get(event);
    if (set === undefined) return;
    for (const handler of set) (handler as Handler<E[K]>)(payload);
  }

  clear(): void {
    this.handlers.clear();
  }
}
