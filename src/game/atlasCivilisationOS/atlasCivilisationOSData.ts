/**
 * The Atlas Civilisation Operating System (AF-189). Previous Atlas
 * modules define Knowledge/Memory/Identity/Purpose/Harmony/Emergence/
 * Possibility/Evolution; this module coordinates all of them into one
 * continuously functioning civilisation.
 *
 * NAMING SCOPE NOTE: this is the THIRD "operating system"-shaped module
 * in this codebase, distinct in scope from both. AF-144's locked
 * "Afterlight Operating System" (`src/game/aos/`) is the FOUNDATION-layer
 * OS — it coordinates Living Galaxy/Ship/Commanders/Museum/Chronicle/
 * Civilisation/Research/Economy/Weather/Wildlife/Events/Story Engine/
 * Evolution/Legacy/Endgame. AF-154's locked "Atlas Orchestrator"
 * (`atlasOrchestrator/`) is the player-EXPERIENCE-pacing layer above the
 * Simulation Director. AF-189 is the ATLAS-ENRICHMENT-layer OS,
 * coordinating the ~40 Atlas-XXX modules themselves. Distinct directory
 * (`atlasCivilisationOS/`), never redefining either prior OS's classes.
 *
 * Reused directly wherever a section names a mechanic AF-144 already
 * built generically:
 * - "The Civilisation Bus" reuses AF-001's real generic `EventBus<E>`
 *   directly (the same class AF-144's System Bus already reused) —
 *   instantiated with its own new `CivilisationBusEventMap` rather than
 *   a second bus class.
 * - "State Management" reuses AF-144's real generic `WorldStateStore<T>`
 *   directly, instantiated over the real, already-locked
 *   `CivilisationAttribute` union (`src/game/civilisationEngine/`,
 *   which already includes Population/Education/Health/Research/
 *   Ecology/Industry/Historical Preservation) rather than a new
 *   duplicate attribute list.
 * - "Priority Management" reuses AF-144's real `PriorityEngine` directly.
 * - "Civilisation Telemetry" reuses AF-144's real `TelemetryCollector`
 *   directly.
 * - "Task Orchestration" reuses AF-162's real `LongTermMissionTracker`
 *   directly — a megaproject/expansion/collaboration IS exactly a
 *   long-term ambition already modelled by `register`/`advance`/
 *   `isComplete`.
 * - "Service Dependencies" composes AF-151's real
 *   `KnowledgeGraph.addEdge` directly, using the already-real
 *   `"Influenced"` edge kind.
 *
 * "Failsafe Services" mirrors the SHAPE of AF-154's real
 * `resolveByFailsafePriority` (a strict single-highest-priority-match
 * resolver, never an all-must-pass gate) — the SECOND instance of this
 * family, typed to its own `CivilisationFailsafeConcern` union since the
 * concerns genuinely differ from AF-154's Player progress/Save
 * integrity/Historical consistency/Accessibility/Performance/Narrative
 * coherence.
 *
 * "Continuous Diagnostics" mirrors the SHAPE of AF-144's real
 * `PerformanceBudgetTracker` (report a per-domain score, then rank) but
 * INVERTS its direction — a LOW score is the concern here, not a high
 * one — and is typed to its own `CivilisationHealthDomain` union.
 *
 * "Adaptive Coordination" (Local settlements -> Planetary governments ->
 * Sector administrations -> Galactic institutions) is an ordered,
 * non-cyclic 4-tier ladder, mirroring this codebase's established
 * `xRank(stage): number` pattern.
 *
 * "The Civilisation Heartbeat" is confirmed genuinely new: an
 * append-only per-cycle log answering five fixed questions every tick —
 * distinct from AF-185's real `LivingPresentTracker` (the only
 * OVERWRITING tracker in this codebase) since every heartbeat tick is
 * preserved as history rather than replacing the last.
 *
 * "Core Services" (12 named services) and "Resource Coordination" are a
 * new reference list and a new resource-pool tracker respectively —
 * confirmed genuinely absent elsewhere: nothing tracks a named pool of
 * researchers/teachers/builders/etc. with allocate/release semantics
 * anywhere else in the codebase. "Self-Optimisation" stays prose-only
 * reference data, mirroring AF-144's own honest treatment of
 * "Scalability"/"Failsafe Principles" as architectural claims rather
 * than mechanics.
 */

export const CORE_SERVICES = [
  "Knowledge Service",
  "Memory Service",
  "Identity Service",
  "Education Service",
  "Research Service",
  "Exploration Service",
  "Infrastructure Service",
  "Ecology Service",
  "Culture Service",
  "Economy Service",
  "Governance Service",
  "Legacy Service",
] as const;
export type CoreService = (typeof CORE_SERVICES)[number];

/** The spec's own Civilisation Bus examples — new event kinds layered
 * onto AF-001's real, generic `EventBus<E>`, confirmed distinct from
 * AF-094's combat-only `KNOWN_EVENT_KINDS` and AF-144's own foundation-
 * scoped `AosEventMap`. */
export interface CivilisationBusEventMap extends Record<string, unknown> {
  DiscoveryCompleted: { discoveryId: string };
  SpeciesRecovered: { speciesId: string };
  UniversityFounded: { institutionId: string };
  CommanderPromoted: { commanderId: string };
  MuseumExpanded: { exhibitId: string };
  PlanetRestored: { planetId: string };
  FestivalBegins: { festivalId: string };
  ResearchValidated: { nodeId: string };
}
export type CivilisationBusEventKind = keyof CivilisationBusEventMap;
export const CIVILISATION_BUS_EVENT_KINDS: readonly CivilisationBusEventKind[] = [
  "DiscoveryCompleted",
  "SpeciesRecovered",
  "UniversityFounded",
  "CommanderPromoted",
  "MuseumExpanded",
  "PlanetRestored",
  "FestivalBegins",
  "ResearchValidated",
];

export const RESOURCE_POOL_KINDS = ["Researchers", "Teachers", "Builders", "Explorers", "Citizens", "Commanders", "Infrastructure", "Knowledge"] as const;
export type ResourcePoolKind = (typeof RESOURCE_POOL_KINDS)[number];

// ── Failsafe Services: a strict priority order, not an all-must-pass gate (2nd instance, see AF-154's real resolveByFailsafePriority). ──
export const CIVILISATION_FAILSAFE_PRIORITY_ORDER = ["Knowledge loss", "Institution collapse", "Ecological decline", "Historical inconsistency", "Commander burnout", "Infrastructure overload"] as const;
export type CivilisationFailsafeConcern = (typeof CIVILISATION_FAILSAFE_PRIORITY_ORDER)[number];

export const CIVILISATION_HEALTH_DOMAINS = ["System health", "Institution health", "Commander workload", "Scientific productivity", "Environmental resilience", "Educational quality", "Community wellbeing"] as const;
export type CivilisationHealthDomain = (typeof CIVILISATION_HEALTH_DOMAINS)[number];

// ── Adaptive Coordination: ordered, non-cyclic 4-tier ladder. ──
export const ADAPTIVE_COORDINATION_TIERS = ["Local settlements", "Planetary governments", "Sector administrations", "Galactic institutions"] as const;
export type AdaptiveCoordinationTier = (typeof ADAPTIVE_COORDINATION_TIERS)[number];

/** Mirrors AF-148's real `canonPyramidRank` indexOf pattern. */
export function adaptiveCoordinationTierRank(tier: AdaptiveCoordinationTier): number {
  return ADAPTIVE_COORDINATION_TIERS.indexOf(tier);
}

export const CIVILISATION_HEARTBEAT_QUESTIONS = ["What has changed?", "What needs attention?", "What opportunities appeared?", "Who needs help?", "What should happen next?"] as const;
export type CivilisationHeartbeatQuestion = (typeof CIVILISATION_HEARTBEAT_QUESTIONS)[number];

export const SELF_OPTIMISATION_TARGETS = ["Coordination", "Scheduling", "Knowledge sharing", "Infrastructure", "Education", "Resource efficiency"] as const;

export const CIVILISATION_OS_DEVELOPER_TOOLS = ["Service monitor", "Dependency explorer", "Global state viewer", "Civilisation telemetry dashboard", "Task orchestration graph", "Subsystem diagnostics"] as const;
