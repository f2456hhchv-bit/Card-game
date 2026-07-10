/**
 * The Atlas World Model (AF-152). The third layer in the Atlas stack —
 * "Where the Atlas Knowledge Graph (AF-151) stores relationships, the
 * World Model stores understanding." Two of its own named sections
 * turn out to already be exactly what real AF-133/144 classes do:
 *
 * - "Memory Model" ("minor memories fade, major memories remain") is
 *   already fully implemented by AF-133's real `NpcMemoryLog`
 *   (confirmed: non-historic entries capped and oldest-dropped per
 *   subject; `historic:true` entries never dropped) — the same
 *   mechanic AF-144's Memory Manager reused directly. Reused directly
 *   here too; zero new memory class.
 * - "Predictive Reasoning" (Housing shortage/Commander burnout/
 *   Scientific breakthrough/Wildlife migration/Festival attendance/
 *   Population growth/Infrastructure demand) overlaps heavily with
 *   AF-144's real `PREDICTION_KINDS`/`PredictionEngine` (Population
 *   growth, Wildlife migration, and Festival scheduling/attendance are
 *   near-exact matches) — and unlike AF-151's `suggestConnections`
 *   (a structurally different graph-traversal mechanic), this section
 *   asks for the SAME numeric trend-forecasting mechanic again.
 *   Reused directly via AF-144's real `PredictionEngine.forecast`.
 * - "Performance" ("only nearby entities simulate at full fidelity,
 *   remote entities use abstract simulation") is exactly AF-144's real
 *   `PriorityEngine` (High/Medium/Low frame-divisor throttling).
 *   Reused directly; zero new LOD class.
 *
 * "Simulation Support" (9 systems) is the SIXTH parallel "which
 * systems does this touch" list in this codebase, after AF-142/144/
 * 145/149's real lists — kept as its own reference list, not merged.
 *
 * "Spatial Awareness"/"Temporal Awareness"/"Social Awareness"/
 * "Ecological Awareness"/"Economic Awareness"/"Mission Understanding"
 * are domain-specific awareness catalogues that would each need a
 * near-duplicate class if built individually; instead this module
 * builds ONE genuinely new core (`WorldContext`/`WorldModelRegistry`/
 * `GoalTracker`/`SpatialAwarenessTracker`) that composes with real
 * domain systems (AF-086 civilisation sim, AF-089 economy, AF-132
 * wildlife, AF-084 missions) at the call site rather than declaring
 * six more parallel storage classes — the domain catalogues themselves
 * stay pure reference data, documenting what each domain SHOULD know,
 * not duplicating where that data already really lives.
 */
export const WORLD_OBJECT_KIND_EXAMPLES = ["Commander", "Citizen", "Species", "Planet", "Ship", "Building", "Settlement", "Artifact", "Vehicle", "Drone", "Companion", "Weather System", "Research Project", "Faction", "Museum Exhibit", "Expedition"] as const;

export const WORLD_CONTEXT_FIELDS = ["Identity", "Purpose", "Current State", "History", "Relationships", "Goals", "Threats", "Dependencies", "Future Opportunities", "Current Importance"] as const;

/** History/Relationships/Goals are deliberately NOT fields here —
 * they already have real homes (AF-135 Chronicle/AF-148 Canon Engine,
 * AF-151 Knowledge Graph, this module's own `GoalTracker`
 * respectively). `WorldContext` only holds what has no other home. */
export interface WorldContext {
  entityId: string;
  identity: string;
  purpose: string;
  currentState: string;
  threats: readonly string[];
  dependencies: readonly string[];
  futureOpportunities: readonly string[];
  currentImportance: number;
}

export const SPATIAL_AWARENESS_FIELDS = ["Current location", "Nearby entities", "Regional influence", "Travel routes", "Environmental hazards", "Safe zones", "Resources", "Important landmarks"] as const;

export const TEMPORAL_AWARENESS_FIELDS = ["Current time", "Season", "Historical events", "Recent changes", "Scheduled activities", "Future plans", "Anniversaries", "Predicted developments"] as const;

export const SOCIAL_AWARENESS_CITIZEN_FIELDS = ["Family", "Friends", "Employers", "Teachers", "Neighbours", "Community leaders", "Favourite locations", "Important public events"] as const;

export const SOCIAL_AWARENESS_COMMANDER_FIELDS = ["Professional networks", "Expedition partners", "Trusted specialists", "Historic collaborations"] as const;

export const ECOLOGICAL_AWARENESS_FIELDS = ["Food sources", "Migration paths", "Predators", "Climate", "Breeding grounds", "Population pressure", "Environmental health", "Habitat quality"] as const;

export const ECONOMIC_AWARENESS_FIELDS = ["Supply", "Demand", "Imports", "Exports", "Infrastructure", "Workforce", "Education", "Industrial priorities", "Future investments"] as const;

export const MISSION_UNDERSTANDING_FIELDS = ["Objectives", "Available specialists", "Risks", "Resources", "Weather", "History", "Potential discoveries", "Scientific opportunities"] as const;

export const WORLD_QUERY_EXAMPLES = ["Who needs help?", "Which colony is thriving?", "Which Commander knows this technology?", "Which species is endangered?", "Which cities require engineers?"] as const;

/** The SIXTH parallel "which systems does this touch" list in this
 * codebase (see module doc comment) — kept as its own separate list. */
export const SIMULATION_SUPPORT_TARGETS = ["Living Galaxy", "Story Engine", "Civilisation Engine", "Commander AI", "Wildlife AI", "Economy", "Research", "Relationships", "Event Engine"] as const;

export const PREDICTIVE_REASONING_EXAMPLES = ["Housing shortage", "Commander burnout", "Scientific breakthrough", "Wildlife migration", "Festival attendance", "Population growth", "Infrastructure demand"] as const;

export const VISUAL_DEBUGGING_TOOLS = ["Awareness viewer", "Goal inspector", "Need analysis", "Relationship heatmap", "Settlement priorities", "World influence map", "Future prediction overlay"] as const;

export const WORLD_MODEL_ACCESSIBILITY_SURFACES = ["Simplified world summaries", "Citizen overview", "Commander context viewer", "Colony health dashboard", "Narration ready"] as const;
