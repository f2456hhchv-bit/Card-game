/**
 * The Atlas Planning Engine (AF-157). Where AF-156 determines the best
 * immediate choice, AF-157 coordinates sequences of those choices
 * across hours, days, years and generations. Reused directly wherever
 * a section names a mechanic that already exists:
 *
 * - "Collaborative Planning" ("multiple organisations contribute...
 *   shared plans produce stronger outcomes") is confirmed the THIRD
 *   instance of the identical mechanic in this codebase, after AF-155's
 *   own "Collaborative Intelligence" (`CollaborativeProblemLog`) and
 *   AF-156's "Group Decisions" (same class, formal-body granularity).
 *   Reused directly again here — a plan's contributors are just another
 *   `CollaborativeProblemLog.propose` participant list.
 * - "Plan Negotiation" ("competing priorities resolve through
 *   [7 factors]") is the same weigh-factors-pick-best-know-the-
 *   rejected-alternatives mechanic as AF-156's real `explainDecision`
 *   (itself composing AF-155's real `rankOptions`). Reused directly —
 *   no third scoring formula.
 *
 * "Planning Horizons" (Immediate/Short-Term/Medium-Term/Long-Term/
 * Generational, each with concrete seconds→decades durations and
 * example activities) looks at a glance like two existing ladders but
 * is confirmed a genuinely different axis from both: AF-156's real
 * `LONG_TERM_PLANNING_HORIZONS` (One mission/One expedition/One year/
 * One decade/One generation) ranks by DECISION SCOPE, not a concrete
 * time unit, and AF-153's real `SIMULATION_TIERS` (Immediate/Local
 * Region/Planetary/Sector/Galactic) ranks SPATIAL simulation scope, not
 * time at all — "Immediate" is the shared name across all three, but
 * each names a different quantity. Kept as its own `PlanningTimeHorizon`
 * union rather than merged into either.
 *
 * The six planning-domain sections (Commander/Colony/Scientific/
 * Exploration/Economic/Environmental) each list concrete PLAN
 * categories for that domain — a different axis again from AF-155's
 * evaluation-criteria "reasoning factors" and AF-156's decision-slot
 * "*_DECISION_KINDS" — kept as six new `*_PLAN_KINDS` reference-
 * vocabulary unions.
 *
 * "Adaptive Planning" (plans mutate in response to 6 named triggers),
 * "Plan Memory" (completed plans feed 6 named outputs), and the
 * "Contingency System" (6 named fallback slots per major plan) are all
 * confirmed genuinely new: nothing in the codebase already models a
 * plan mutating in response to circumstance, composes completed work
 * into historical/museum/academic outputs at this granularity, or
 * requires a fixed set of fallback slots on a single structure.
 */

export const PLANNING_TIME_HORIZONS = ["Immediate", "Short-Term", "Medium-Term", "Long-Term", "Generational"] as const;
export type PlanningTimeHorizon = (typeof PLANNING_TIME_HORIZONS)[number];

export const COMMANDER_PLAN_KINDS = ["Training programmes", "Recruitment", "Expeditions", "Scientific priorities", "Infrastructure support", "Emergency contingencies", "Mentorship", "Personal development"] as const;
export type CommanderPlanKind = (typeof COMMANDER_PLAN_KINDS)[number];

export const COLONY_PLAN_KINDS = ["Housing plans", "Education expansion", "Healthcare investment", "Industrial growth", "Tourism", "Ecological restoration", "Transit improvements", "Disaster preparedness"] as const;
export type ColonyPlanKind = (typeof COLONY_PLAN_KINDS)[number];

export const SCIENTIFIC_PLAN_KINDS = ["Technology roadmaps", "Laboratory construction", "Cross-disciplinary collaboration", "Equipment procurement", "Field expeditions", "Knowledge publication", "Museum contributions"] as const;
export type ScientificPlanKind = (typeof SCIENTIFIC_PLAN_KINDS)[number];

export const EXPLORATION_PLAN_KINDS = ["Destination analysis", "Crew selection", "Risk mitigation", "Scientific equipment", "Emergency extraction", "Supply chains", "Historical objectives"] as const;
export type ExplorationPlanKind = (typeof EXPLORATION_PLAN_KINDS)[number];

export const ECONOMIC_PLAN_KINDS = ["Supply chains", "Infrastructure demand", "Trade expansion", "Manufacturing", "Education investment", "Healthcare capacity", "Population growth"] as const;
export type EconomicPlanKind = (typeof ECONOMIC_PLAN_KINDS)[number];

export const ENVIRONMENTAL_PLAN_KINDS = ["Reforestation", "River recovery", "Wildlife corridors", "Pollution reduction", "Climate stabilisation", "Protected habitats", "Long-term monitoring"] as const;
export type EnvironmentalPlanKind = (typeof ENVIRONMENTAL_PLAN_KINDS)[number];

export const ADAPTIVE_PLANNING_TRIGGERS = ["Unexpected discoveries", "Natural disasters", "Commander injuries", "Scientific breakthroughs", "Political changes", "Resource shortages"] as const;
export type AdaptivePlanningTrigger = (typeof ADAPTIVE_PLANNING_TRIGGERS)[number];

export const COLLABORATIVE_PLANNING_CONTRIBUTORS = ["Scientists", "Engineers", "Commanders", "Teachers", "Doctors", "Government", "Citizens"] as const;

export const PLAN_NEGOTIATION_FACTORS = ["Evidence", "Resources", "Historical urgency", "Scientific value", "Civilian benefit", "Environmental impact", "Player influence"] as const;

export const PLAN_MEMORY_OUTCOMES = ["Historical case studies", "Museum exhibits", "Commander lessons", "Academic publications", "Educational material", "Future planning references"] as const;
export type PlanMemoryOutcome = (typeof PLAN_MEMORY_OUTCOMES)[number];

export const PLANNING_VISUALISATION_TOOLS = ["Planning graph", "Dependency viewer", "Timeline forecast", "Risk heatmap", "Milestone tracker", "Resource projection", "Outcome simulator"] as const;

export interface ContingencySet {
  primaryApproach: string;
  alternativeRoute: string;
  emergencyRecovery: string;
  resourceReserve: string;
  personnelReplacement: string;
  scientificBackup: string;
}

/** "No critical project relies upon one path." All 6 fallback slots
 * must be present — a plain structural check, never a numeric score. */
export function hasContingencyCoverage(contingency: ContingencySet | null): boolean {
  if (!contingency) return false;
  return Object.values(contingency).every((value) => value.length > 0);
}

export interface Plan {
  id: string;
  objective: string;
  motivation: string;
  requirements: readonly string[];
  resources: readonly string[];
  participants: readonly string[];
  dependencies: readonly string[];
  estimatedDuration: number;
  riskProfile: number;
  fallbackStrategies: readonly string[];
  successCriteria: readonly string[];
  historicalImportance: number;
  horizon: PlanningTimeHorizon;
  contingency: ContingencySet | null;
}
