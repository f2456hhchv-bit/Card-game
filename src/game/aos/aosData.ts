/**
 * The Afterlight Operating System (AF-144). The most architecturally
 * sweeping spec yet — a research pass before implementation found most
 * of its "invisible intelligence" already has a real, working precedent
 * somewhere in a 144-module-deep codebase, and this module's job is to
 * compose those precedents into the specific new pieces confirmed absent.
 *
 * Confirmed already real, reused directly:
 * - "System Bus" — AF-001's real `EventBus<E>`
 *   (`src/core/events/EventBus.ts`) is already "the only cross-system
 *   communication channel in Afterlight" per its own doc comment —
 *   generic over any named-event map. This module instantiates it with
 *   its own new `AosEventMap` (the spec's own narrative examples:
 *   Planet Restored, Commander Recruited, etc. — confirmed absent from
 *   AF-094's real `KNOWN_EVENT_KINDS`, which is combat/mission-only)
 *   rather than building a second bus class.
 * - "Memory Manager" ("minor memories fade naturally, major memories
 *   remain permanently") — AF-133's real `NpcMemoryLog` already
 *   implements exactly this (non-historic entries capped and
 *   oldest-dropped per subject; `historic:true` entries never dropped).
 *   Reused directly; zero new memory class.
 *
 * Confirmed genuinely new (no unified analog exists anywhere; every
 * prior "clock"/"state"/"priority" concept is local to one module):
 * - "World State" — `stateMachine.test.ts`'s real `StateMachine` only
 *   tracks which SCREEN is active (Splash/MainMenu/Gameplay/...), never
 *   game data; nothing else is a single source of truth over game state.
 * - "Simulation Clock" — every module keeps its own private counter
 *   (`civilisation.epochCount`, `sessionSeconds`, per-run `playTimeMs`,
 *   etc.); no unifying multi-layer registry exists.
 * - "Priority Engine" — AF-056's `DirectorConductor` is real but
 *   narrowly combat-pacing; no generic High/Medium/Low update-frequency
 *   concept exists anywhere else.
 * - "Decision Router," "Prediction Engine," "Performance Orchestrator,"
 *   "Recovery System" (world-state-contradiction recovery, distinct from
 *   AF-044's real save-slice corruption recovery), and "Live Telemetry"
 *   (AF-094's `ANALYTICS_TRACKING_CATEGORIES` is honestly `{kind:"future"}`
 *   everywhere — zero producer exists) are all confirmed genuinely absent.
 *
 * Kept as pure reference data, no new runtime: "Debug Framework" — the
 * real `DebugOverlay` already covers "simulation viewer" (every module's
 * summary line) and "performance profiler" (fps/lastTransitionMs/
 * droppedTimeMs); relationship inspector/galaxy debugger/chronicle
 * validator/world-state explorer/timeline scrubber would each need
 * interactive UI with no runtime surface in this text-panel overlay —
 * the same honest scope boundary AF-140/141/142/143 already applied to
 * sections with no computational analog. "Scalability" and "Failsafe
 * Principles" are architectural claims/promises, not mechanics.
 */
export const AOS_RESPONSIBILITIES = [
  "Living Galaxy",
  "Living Ship",
  "Commanders",
  "Bond Network",
  "Museum",
  "Chronicle",
  "Civilisation",
  "Research",
  "Economy",
  "Weather",
  "Wildlife",
  "Events",
  "Story Engine",
  "Evolution",
  "Legacy",
  "Endgame",
  "Future Modules",
] as const;

/** The spec's own System Bus examples — new event kinds layered onto
 * AF-001's real, generic `EventBus<E>`. Confirmed absent from AF-094's
 * real `KNOWN_EVENT_KINDS` (combat/mission-only). */
export interface AosEventMap extends Record<string, unknown> {
  PlanetRestored: { planetId: string };
  CommanderRecruited: { commanderId: string };
  SpeciesDiscovered: { speciesId: string };
  ResearchCompleted: { nodeId: string };
  MuseumExpanded: { exhibitId: string };
  HistoricEventCreated: { description: string };
  RelationshipIncreased: { commanderId: string; amount: number };
  EconomyChanged: { settlementId: string; delta: number };
  WeatherShifted: { systemId: string; condition: string };
}
export type AosEventKind = keyof AosEventMap;
export const AOS_EVENT_KINDS: readonly AosEventKind[] = ["PlanetRestored", "CommanderRecruited", "SpeciesDiscovered", "ResearchCompleted", "MuseumExpanded", "HistoricEventCreated", "RelationshipIncreased", "EconomyChanged", "WeatherShifted"];

export const WORLD_STATE_SLOTS = ["Current", "Historical", "Projected", "Temporary", "Emergency", "Simulation"] as const;
export type WorldStateSlot = (typeof WORLD_STATE_SLOTS)[number];

/** Genuinely new — every existing "clock" in the codebase is a private,
 * local counter (see module doc comment); this is a read-only reporting
 * aggregator, never a replacement source of truth for any real clock. */
export const SIMULATION_TIME_LAYERS = ["Real Time", "Mission Time", "Ship Time", "Planet Time", "Civilisation Time", "Historical Time", "Generational Time"] as const;
export type SimulationTimeLayer = (typeof SIMULATION_TIME_LAYERS)[number];

export const PRIORITY_TIERS = ["High", "Medium", "Low"] as const;
export type PriorityTier = (typeof PRIORITY_TIERS)[number];

/** Illustrative examples from the spec, kept as reference — the real
 * per-system tier assignment happens at `PriorityEngine.register` call
 * sites in main.ts, not baked into this list. */
export const PRIORITY_TIER_EXAMPLES: Readonly<Record<PriorityTier, readonly string[]>> = {
  High: ["Player", "Immediate combat", "Commander interactions", "Nearby wildlife", "Mission objectives"],
  Medium: ["Nearby colonies", "Economy", "Weather", "Traffic"],
  Low: ["Remote galaxies", "Historic simulation", "Deep-space events", "Inactive wildlife"],
};

export interface DialogueContextSignals {
  playerReputation: number;
  currentCommanderId: string | null;
  planetHistoryCount: number;
  timeOfDay: string;
  relationshipStatus: string;
  weatherCondition: string;
  nearbyDiscoveryCount: number;
  recentConversationCount: number;
}

export const MEMORY_MANAGER_CATEGORIES = ["Persistent memories", "Temporary memories", "Conversation history", "Relationship history", "Mission history", "Historical significance"] as const;

export const PREDICTION_KINDS = ["Economic shortages", "Population growth", "Commander promotions", "Wildlife migration", "Research breakthroughs", "Festival scheduling"] as const;
export type PredictionKind = (typeof PREDICTION_KINDS)[number];

export const PERFORMANCE_ORCHESTRATOR_DOMAINS = ["Simulation depth", "Rendering", "Audio", "Animation", "AI", "Streaming", "Networking", "Memory", "Battery"] as const;
export type PerformanceOrchestratorDomain = (typeof PERFORMANCE_ORCHESTRATOR_DOMAINS)[number];

export const RECOVERY_SCENARIO_KINDS = ["Interrupted simulations", "Corrupted temporary states", "Unexpected contradictions", "Save migration", "Expansion compatibility"] as const;
export type RecoveryScenarioKind = (typeof RECOVERY_SCENARIO_KINDS)[number];

/** Confirmed real via `DebugOverlay`: simulation viewer, performance
 * profiler. Confirmed genuinely absent (no interactive UI exists):
 * relationship inspector, galaxy debugger, chronicle validator,
 * world-state explorer, timeline scrubber. Kept as pure reference data. */
export const DEBUG_FRAMEWORK_TOOLS = ["Simulation viewer", "Relationship inspector", "Galaxy debugger", "Chronicle validator", "Performance profiler", "World-state explorer", "Timeline scrubber"] as const;

export const LIVE_TELEMETRY_PURPOSES = ["Balance improvements", "Performance optimisation", "Accessibility enhancements", "Crash analysis", "Feature adoption", "Expansion planning"] as const;

export const SCALABILITY_TARGETS = ["Thousands of planets", "Millions of NPCs", "Hundreds of Commanders", "Centuries of history", "Decades of expansions"] as const;

export const FAILSAFE_PRINCIPLES = ["Protect player progress", "Protect history", "Protect accessibility", "Protect save integrity", "Protect narrative consistency"] as const;

export const AOS_ACCESSIBILITY_SURFACES = ["Simulation complexity options", "CPU-friendly modes", "Memory summaries", "World-state viewer", "Narration compatible"] as const;
