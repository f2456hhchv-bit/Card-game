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
  /** An enemy was defeated (AF-021 §7) — XP/loot/research/achievements subscribe. */
  EnemyKilled: { enemyId: string; elite: boolean; boss: boolean };
  /** The player took hull/shield damage (AF-021 §4). */
  PlayerDamaged: { amount: number; source: string };
  /** A damage resolution landed on a target (AF-021 §1). */
  DamageDealt: { amount: number; critical: boolean; kind: string; targetId: string };
  /** A status effect was applied (AF-021 §2). */
  StatusApplied: { status: string; targetId: string };
  /** A shield collapsed to zero — distinct learned-instantly feedback (AF-003 §4). */
  ShieldBroken: { targetId: string };
  /** The Commander gained a level (AF-022 §4) — the signature moment. */
  CommanderLevelUp: { level: number };
  /** An XP pickup was collected (AF-022 §2). */
  XpCollected: { amount: number; tier: string };
  /** A loot drop hit the ground (AF-023 §3). */
  LootDropped: { itemId: string; rarity: string; category: string; seed: number };
  /** A ground drop was collected (AF-023 §5). */
  LootCollected: { itemId: string; rarity: string; category: string };
  /** A research node was unlocked (AF-024 §3) — permanent progression. */
  ResearchUnlocked: { nodeId: string; category: string };
  /** Research points were banked (AF-024 §1). */
  ResearchPointsGained: { amount: number };
  /** A blueprint permanently joined the archive (AF-025 §2). */
  BlueprintUnlocked: { blueprintId: string };
  /** The Lightforge produced an item (AF-025 §3). */
  ItemCrafted: { recipeId: string; itemId: string; rarity: string; quality: number };
  /** An item was salvaged into materials (AF-025 §4). */
  ItemSalvaged: { itemId: string; rarity: string };
  /** A challenge completed — cosmetic/knowledge reward granted (AF-026 §6). */
  ChallengeCompleted: { challengeId: string; rewardKind: string; rewardId: string };
  /** The account gained a level — permanent, never resets (AF-026 §2). */
  AccountLevelUp: { level: number };
}
