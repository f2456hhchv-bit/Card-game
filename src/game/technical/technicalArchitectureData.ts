/**
 * Technical Architecture Framework (AF-094). A "meta" module: rather than
 * building 14 new manager classes, it HONESTLY documents which of the
 * spec's architectural claims are already true of the real, locked
 * codebase (EventBus/GameEvents AF-001, SaveSlice/SaveCoordinator
 * AF-024/044, GameManager/Pool AF-001, 44 real *Runtime classes, 59
 * *Data.ts + 7 *Tuning.ts files) versus honest future work — the
 * AF-091/092/093 realisation-map pattern applied to the engineering
 * architecture itself. Zero changes to any locked module.
 */
import type { GameEvents } from "../../core/events/GameEvents";
import type { EventBus } from "../../core/events/EventBus";

export const ARCHITECTURE_PRINCIPLES: Readonly<Record<string, boolean>> = {
  dataDrivenArchitecture: true, // 59 *Data.ts + 7 *Tuning.ts files
  compositionOverInheritance: true, // AF-086→093's "take a locked runtime as a constructor collaborator" pattern
  eventDrivenSystems: true, // EventBus + GameEvents, 26/28 kinds actually flowing
  serviceBasedArchitecture: true, // 44 real *Runtime classes
  modularComponents: true, // one *Data.ts/*Runtime.ts pair per domain
  looseCoupling: true, // runtimes read each other's public API only, never private state
  dependencyInjection: true, // constructor-parameter injection throughout main.ts's composition root
  configurationFiles: true, // *Tuning.ts files externalise balance
};

export type ManagerRealisation =
  | { kind: "existing"; ref: string }
  | { kind: "renamed"; ref: string; note: string }
  | { kind: "distributed"; ref: string; note: string }
  | { kind: "orphaned"; ref: string; note: string }
  | { kind: "future" };

export const CORE_MODULES = [
  "gameManager",
  "missionManager",
  "galaxyManager",
  "combatManager",
  "aiManager",
  "factionManager",
  "economyManager",
  "researchManager",
  "audioManager",
  "visualManager",
  "uiManager",
  "saveManager",
  "analyticsManager",
  "expansionManager",
] as const;
export type CoreModule = (typeof CORE_MODULES)[number];

/** Names the real class serving each spec "Manager" role, or the honest
 * gap. main.ts is the one composition root — no manager wraps it, and
 * GameManager itself exists but is never wired into the real loop. */
export const CORE_MODULE_REALISATION: Readonly<Record<CoreModule, ManagerRealisation>> = {
  gameManager: { kind: "orphaned", ref: "core/GameManager.ts GameManager + core/time/GameLoop.ts GameLoop", note: "GameManager's isolate-on-error registry exists but main.ts drives systems directly, not through it" },
  missionManager: { kind: "renamed", ref: "game/missions/MissionRuntime", note: "polled, not event-driven" },
  galaxyManager: { kind: "renamed", ref: "game/galaxy/GalaxyRuntime", note: "" },
  combatManager: { kind: "distributed", ref: "game/combat/DefenceState + StatusEngine + combatTuning.ts", note: "no single CombatRuntime — combat logic is inline in main.ts plus tuning data" },
  aiManager: { kind: "renamed", ref: "game/director/EnemyDirector (the one real System) + EnemyRuntime", note: "" },
  factionManager: { kind: "renamed", ref: "game/factions/FactionRuntime + game/civilisation/CivilisationFrameworkRuntime", note: "" },
  economyManager: { kind: "renamed", ref: "game/economy/GalacticEconomyRuntime + MarketRuntime", note: "" },
  researchManager: { kind: "renamed", ref: "game/research/ResearchTree + ScientificArchiveRuntime", note: "" },
  audioManager: { kind: "renamed", ref: "game/audio/AudioEngine + AudioMixer/VoicePool", note: "" },
  visualManager: { kind: "future" },
  uiManager: { kind: "distributed", ref: "core/state/StateMachine + main.ts screen() renderer + uxFrameworkData.ts", note: "no UIRuntime — UI is inline screen functions driven by the FSM" },
  saveManager: { kind: "existing", ref: "core/save/SaveCoordinator + SaveProfileManager + SaveSlice/SaveStorage" },
  analyticsManager: { kind: "future" },
  expansionManager: { kind: "renamed", ref: "game/liveops/LiveOpsRegistry", note: "" },
};

/** Data Architecture — 13 domains (AF-094 §Data Architecture); 12 already
 * externalised as real *Data.ts registries, 1 honest gap. */
export const DATA_ARCHITECTURE_DOMAINS = ["weapons", "ships", "commanders", "enemies", "bosses", "research", "relics", "equipment", "biomes", "factions", "missions", "dialogue", "balancing"] as const;
export const DATA_ARCHITECTURE_LIVE: Readonly<Record<(typeof DATA_ARCHITECTURE_DOMAINS)[number], boolean>> = {
  weapons: true,
  ships: true,
  commanders: true,
  enemies: true,
  bosses: true,
  research: true,
  relics: true,
  equipment: true,
  biomes: true,
  factions: true,
  missions: true,
  dialogue: false, // no dialogue system exists anywhere yet
  balancing: true, // *Tuning.ts files
};

export type SaveCategoryRealisation = { kind: "existing"; sliceKey: string; note?: string } | { kind: "future" };

/** Save System — 15 categories (AF-094 §Save System), realised onto the 6
 * real SaveSlice instances main.ts already constructs, or honestly future. */
export const SAVE_SYSTEM_CATEGORIES = [
  "campaignProgress",
  "galaxyState",
  "commanderProgress",
  "shipCollection",
  "research",
  "equipment",
  "relics",
  "factionReputation",
  "civilisationGrowth",
  "statistics",
  "museum",
  "codex",
  "settings",
  "analytics",
  "futureCompatibilityVersion",
] as const;
export const SAVE_SYSTEM_CATEGORY_REALISATION: Readonly<Record<(typeof SAVE_SYSTEM_CATEGORIES)[number], SaveCategoryRealisation>> = {
  campaignProgress: { kind: "future" }, // CampaignRuntime is real, unpersisted
  galaxyState: { kind: "future" }, // GalaxyRuntime is real, unpersisted
  commanderProgress: { kind: "existing", sliceKey: "meta", note: "account level + run history; full commander roster unpersisted" },
  shipCollection: { kind: "future" }, // ship roster runtime real, unpersisted
  research: { kind: "existing", sliceKey: "research" },
  equipment: { kind: "existing", sliceKey: "crafting", note: "fed indirectly via crafting materials/blueprints/hangar" },
  relics: { kind: "existing", sliceKey: "crafting", note: "fed indirectly via crafting hangar; no dedicated relic slice" },
  factionReputation: { kind: "future" }, // FactionRuntime is real, unpersisted
  civilisationGrowth: { kind: "future" }, // CivilisationFrameworkRuntime is real, unpersisted
  statistics: { kind: "existing", sliceKey: "meta" },
  museum: { kind: "existing", sliceKey: "collectionLedger", note: "closest real analogue — extra collections + discovery log" },
  codex: { kind: "future" }, // CodexDiscoveryRuntime is real, unpersisted
  settings: { kind: "existing", sliceKey: "settings" },
  analytics: { kind: "future" }, // no analytics system exists at all
  futureCompatibilityVersion: { kind: "existing", sliceKey: "(every slice)", note: "SaveSlice's own numeric version field IS this requirement" },
};

/** Save Compatibility — 7 features (AF-094 §Save Compatibility); 5 real in
 * AF-024/044's SaveSlice, 2 honest future. */
export const SAVE_COMPATIBILITY_FEATURES = ["automaticMigration", "versionDetection", "rollbackProtection", "corruptionRecovery", "incrementalUpgrades", "expansionCompatibility", "crossPlatformCompatibility"] as const;
export const SAVE_COMPATIBILITY_LIVE: Readonly<Record<(typeof SAVE_COMPATIBILITY_FEATURES)[number], boolean>> = {
  automaticMigration: true, // SaveSlice's chained migrations[version]
  versionDetection: true, // SaveSlice's version field + future-version guard
  rollbackProtection: true, // SaveSlice's rolling .backup key
  corruptionRecovery: true, // checksum mismatch → quarantine → backup → isolated per-slice reset
  incrementalUpgrades: true, // the while(version < currentVersion) loop applies one step at a time
  expansionCompatibility: false, // no expansion-specific save schema yet
  crossPlatformCompatibility: false, // SaveStorage is pluggable but only LocalStorageAdapter exists
};

export type EventCategoryRealisation = { kind: "existing"; eventKinds: readonly (keyof GameEvents)[] } | { kind: "future" };

export const EVENT_SYSTEM_CATEGORIES = ["gameplayEvents", "missionEvents", "factionEvents", "researchEvents", "economyEvents", "uiEvents", "audioEvents", "analyticsEvents"] as const;

/** Event System — 8 categories (AF-094 §Event System), realised onto the
 * real GameEvents registry (AF-001 §7) wherever a kind actually exists. */
export const EVENT_SYSTEM_CATEGORY_REALISATION: Readonly<Record<(typeof EVENT_SYSTEM_CATEGORIES)[number], EventCategoryRealisation>> = {
  gameplayEvents: { kind: "existing", eventKinds: ["EnemyKilled", "PlayerDamaged", "DamageDealt", "StatusApplied", "ShieldBroken", "XpCollected", "LootDropped", "LootCollected"] },
  missionEvents: { kind: "existing", eventKinds: ["RunPhaseChanged", "RunEnded"] },
  factionEvents: { kind: "future" }, // FactionRuntime is polled, not event-driven
  researchEvents: { kind: "existing", eventKinds: ["ResearchUnlocked", "ResearchPointsGained"] },
  economyEvents: { kind: "future" }, // GalacticEconomyRuntime/MarketRuntime are polled, not event-driven
  uiEvents: { kind: "existing", eventKinds: ["OverlayPushed", "OverlayPopped", "GameStateChanged"] },
  audioEvents: { kind: "future" }, // AudioEngine is called directly, not subscribed to the bus
  analyticsEvents: { kind: "future" }, // no analytics system exists at all
};

/** Every declared keyof GameEvents this module references — kept as a
 * literal array so a typo fails typecheck against the real interface. */
export const KNOWN_EVENT_KINDS: readonly (keyof GameEvents)[] = [
  "GameStateTransitionStarted",
  "GameStateChanged",
  "OverlayPushed",
  "OverlayPopped",
  "RunPhaseChanged",
  "RunEnded",
  "SystemErrored",
  "DirectorPhaseChanged",
  "SpawnDirectiveIssued",
  "EnvironmentalEventTriggered",
  "EnemyKilled",
  "PlayerDamaged",
  "DamageDealt",
  "StatusApplied",
  "ShieldBroken",
  "CommanderLevelUp",
  "XpCollected",
  "LootDropped",
  "LootCollected",
  "ResearchUnlocked",
  "ResearchPointsGained",
  "BlueprintUnlocked",
  "ItemCrafted",
  "ItemSalvaged",
  "ChallengeCompleted",
  "AccountLevelUp",
  "RelicAcquired",
  "RelicEvolved",
];

export type PluginExtensionRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Plugin Architecture — 7 extension points (AF-094 §Plugin Architecture).
 * "Plugin" today means an informal, real extension point (add a data
 * entry, register with LiveOpsRegistry) — no formal plugin registry
 * exists, which is registered honestly for the 3 that need one. */
export const PLUGIN_ARCHITECTURE_EXTENSION_POINTS = ["expansions", "seasonalContent", "newBiomes", "newFactions", "communityFeatures", "experimentalSystems", "developerTools"] as const;
export const PLUGIN_ARCHITECTURE_REALISATION: Readonly<Record<(typeof PLUGIN_ARCHITECTURE_EXTENSION_POINTS)[number], PluginExtensionRealisation>> = {
  expansions: { kind: "existing", ref: "game/liveops/LiveOpsRegistry" },
  seasonalContent: { kind: "existing", ref: "game/liveops/LiveOpsRegistry" },
  newBiomes: { kind: "existing", ref: "game/biomes/biomeData.ts — add a def, no code change" },
  newFactions: { kind: "existing", ref: "game/factions/factionData.ts — add a def, no code change" },
  communityFeatures: { kind: "future" }, // Multiplayer/CommunityHub are reserved GameStateIds with zero inbound edges
  experimentalSystems: { kind: "future" }, // no formal plugin isolation/registry exists
  developerTools: { kind: "future" }, // only DebugOverlay exists; no console/content-browser
};

/** Configuration — 8 areas (AF-094 §Configuration), all already real. */
export const CONFIGURATION_AREAS: Readonly<Record<string, boolean>> = {
  balancing: true, // combatTuning.ts
  loot: true, // lootTuning.ts
  enemyBehaviour: true, // directorTuning.ts + enemy *Data.ts files
  missionGeneration: true, // missionData.ts family
  economy: true, // economyData.ts / galacticEconomyData.ts
  research: true, // researchData.ts family
  difficulty: true, // session.difficulty / ascension
  accessibility: true, // settingsData.ts accessibility block
};

/** Automated Testing — 8 kinds (AF-094 §Automated Testing); 5 genuinely
 * practised (folded into the flat 84-file Vitest suite rather than
 * separate folders), 3 honest future. */
export const AUTOMATED_TESTING_KINDS = ["unitTests", "integrationTests", "regressionTests", "performanceTests", "saveCompatibilityTests", "stressTests", "uiTests", "expansionTests"] as const;
export const AUTOMATED_TESTING_LIVE: Readonly<Record<(typeof AUTOMATED_TESTING_KINDS)[number], boolean>> = {
  unitTests: true,
  integrationTests: true, // e.g. AF-090 tests drive civSim+economy+research together
  regressionTests: true, // e.g. AF-087's 1,000-career regression sweep
  performanceTests: false, // no frame-budget assertions exist
  saveCompatibilityTests: true, // saveSlice.test.ts + saveFramework.test.ts
  stressTests: true, // seeded sweeps of 50-2000 iterations across many modules
  uiTests: false, // Playwright is a devDependency but unused as a persisted suite (only ad hoc per-module verify scripts)
  expansionTests: false, // no plugin/expansion test harness exists
};

/** Crash Recovery — 7 features (AF-094 §Crash Recovery). */
export const CRASH_RECOVERY_FEATURES = ["autosave", "crashRecovery", "safeBoot", "configurationReset", "diagnosticReports", "corruptionDetection", "recoveryWizard"] as const;
export const CRASH_RECOVERY_LIVE: Readonly<Record<(typeof CRASH_RECOVERY_FEATURES)[number], boolean>> = {
  autosave: true, // SaveCoordinator's 8 real AUTOSAVE_TRIGGERS
  crashRecovery: false, // GameManager's isolate-and-disable exists but isn't wired into the main loop
  safeBoot: false, // no distinct safe-boot mode exists
  configurationReset: false, // no explicit "reset settings" function/UI exists yet
  diagnosticReports: true, // Log's ring buffer is a real, retrievable diagnostic source
  corruptionDetection: true, // SaveSlice's FNV-1a checksum
  recoveryWizard: false, // no recovery UI exists
};

/** Analytics — 8 categories (AF-094 §Analytics), all honestly future;
 * zero producer exists anywhere in the codebase. */
export const ANALYTICS_TRACKING_CATEGORIES = ["performance", "balance", "crashes", "missionCompletion", "buildDiversity", "accessibilityUsage", "economy", "progression"] as const;

/** Developer Tools — 8 kinds (AF-094 §Developer Tools); the DebugOverlay
 * and its live fps/timing fields are the only ones with a real producer. */
export const DEVELOPER_TOOLS_KINDS = ["console", "debugOverlay", "contentBrowser", "missionSimulator", "balanceEditor", "performanceViewer", "visualProfiler", "saveInspector"] as const;
export const DEVELOPER_TOOLS_LIVE: Readonly<Record<(typeof DEVELOPER_TOOLS_KINDS)[number], boolean>> = {
  console: false,
  debugOverlay: true,
  contentBrowser: false,
  missionSimulator: false,
  balanceEditor: false,
  performanceViewer: true, // the DebugOverlay already surfaces fps/lastTransitionMs/droppedTimeMs live
  visualProfiler: false, // no renderer class exists to profile
  saveInspector: false,
};

/** Accessibility persistence properties — 7 (AF-094 §Accessibility). */
export const ACCESSIBILITY_PERSISTENCE_PROPERTIES = ["modular", "persistent", "cloudSaved", "importable", "exportable", "appliedGlobally", "neverResetUnexpectedly"] as const;
export const ACCESSIBILITY_PERSISTENCE_LIVE: Readonly<Record<(typeof ACCESSIBILITY_PERSISTENCE_PROPERTIES)[number], boolean>> = {
  modular: true, // SettingsData.accessibility is its own sub-object
  persistent: true, // settingsSlice persists it
  cloudSaved: false, // LocalStorageAdapter only; no cloud backend implemented
  importable: false, // no import function exists
  exportable: false, // no export function exists
  appliedGlobally: false, // AF-093 confirmed highContrast/colourBlindMode have no rendering consumer yet
  neverResetUnexpectedly: true, // SaveSlice only resets a slice to defaults when BOTH primary and backup are unreadable
};

/** Performance disciplines — 7 (AF-094 §Performance). */
export const TECHNICAL_PERFORMANCE_DISCIPLINES = ["asynchronousLoading", "assetStreaming", "memoryPooling", "objectPooling", "multithreading", "backgroundProcessing", "efficientSerialization"] as const;
export const TECHNICAL_PERFORMANCE_LIVE: Readonly<Record<(typeof TECHNICAL_PERFORMANCE_DISCIPLINES)[number], boolean>> = {
  asynchronousLoading: false, // everything is bundled synchronously via Vite
  assetStreaming: false,
  memoryPooling: true, // core/pool/Pool<T>
  objectPooling: true, // the same Pool<T>, used by projectiles/popups/xp pickups/ground loot
  multithreading: false, // single-threaded; no Web Workers
  backgroundProcessing: false,
  efficientSerialization: true, // SaveSlice's versioned, checksummed envelope
};

/** Debug — 7 surfaces (AF-094 §Debug); 6 real, 1 honest future. Frame
 * Time and Performance are already satisfied by DebugSnapshot's existing
 * fps/lastTransitionMs/droppedTimeMs scalars — no string extension needed. */
export const TECHNICAL_DEBUG_SURFACES: Readonly<Record<string, boolean>> = {
  moduleStatus: true,
  memoryUsage: false, // no cross-browser memory API instrumented
  frameTime: true,
  saveVersion: true,
  activeSystems: true,
  eventQueue: true,
  performance: true,
};

/** Counts CORE_MODULE_REALISATION kinds — the live text for Module
 * Status / Active Systems. */
export function moduleStatusSummary(): string {
  let live = 0;
  for (const module of CORE_MODULES) if (CORE_MODULE_REALISATION[module].kind !== "future") live += 1;
  return `${live}/${CORE_MODULES.length} core modules realised`;
}

/** Sums real listener counts across every known GameEvents kind against
 * the REAL EventBus instance passed in — never a mock. */
export function eventQueueSummary(bus: EventBus<GameEvents>): string {
  let total = 0;
  for (const kind of KNOWN_EVENT_KINDS) total += bus.listenerCount(kind);
  return `${total} active listeners / ${KNOWN_EVENT_KINDS.length} known event kinds`;
}

/** Formats the real (key, currentVersion) pairs main.ts already passes to
 * its 6 SaveSlice constructions — SaveSlice has no public version getter,
 * so the caller supplies the same literal numbers it already owns. */
export function saveVersionSummary(slices: ReadonlyArray<{ key: string; version: number }>): string {
  return slices.map((slice) => `${slice.key}v${slice.version}`).join(" ");
}
