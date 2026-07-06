/**
 * The project event registry (AF-001 §7): every event that crosses a system
 * boundary is declared here, in one inspectable place. Names are PastTense
 * facts. Payloads use plain serialisable types so `core` stays free of
 * game-layer imports (AF-001 layer law); game code narrows string fields
 * to its own unions at the subscription site.
 */
export interface GameEvents extends Record<string, unknown> {
  /** A base-state transition began (from → to). */
  GameStateTransitionStarted: { from: string; to: string };
  /** A base-state transition completed. durationMs must stay < 250 (AF-016). */
  GameStateChanged: { from: string; to: string; durationMs: number };
  /** An overlay state (Pause / LevelUp / InventoryOverlay) was pushed. */
  OverlayPushed: { overlay: string; base: string };
  /** An overlay state was popped. */
  OverlayPopped: { overlay: string; base: string };
  /** The run advanced to a new phase (AF-016 §3 run lifecycle). */
  RunPhaseChanged: { from: string | null; to: string };
  /** A run ended. Feeds the unified Results flow (victory and defeat alike). */
  RunEnded: { result: "victory" | "defeat"; seed: number; playTimeMs: number };
  /** A registered system threw during update and was isolated (AF-001 §9). */
  SystemErrored: { system: string; message: string };
  /** The Enemy Director changed pacing phase (AF-017 §2). */
  DirectorPhaseChanged: { from: string; to: string };
  /** The Enemy Director issued a spawn directive for the Enemy System. */
  SpawnDirectiveIssued: { waveType: string; budgetCost: number; eliteCount: number };
  /** The Enemy Director triggered an environmental event (AF-017 §5). */
  EnvironmentalEventTriggered: { eventType: string };
}
