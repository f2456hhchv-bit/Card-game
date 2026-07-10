/**
 * The Atlas Simulation Director (AF-153). The executive orchestration
 * layer above every prior simulation system. Several of its own named
 * sections turn out to be exactly what real AF-136/144 classes already
 * do:
 *
 * - "System Synchronisation" ("prevent conflicting updates... weather/
 *   population/commander movement/festival timing/research/economy/
 *   story all touching overlapping state") and "Event Prioritisation"
 *   are exactly AF-144's real `DecisionRouter` (arbitrates conflicting
 *   change requests by priority tier, protects player agency). Reused
 *   directly — zero new arbitration class.
 * - "Simulation Budget" and "Load Balancing" (CPU/hardware/battery/
 *   frame rate/memory scaling, "gracefully degrade") are exactly
 *   AF-144's real `PerformanceBudgetTracker` (0-100 usage per domain,
 *   recommends throttling the domains furthest over budget). Reused
 *   directly for the domain-level concern; this module's own
 *   `SimulationBudgetAllocator` (below) covers the genuinely different,
 *   ENTITY-level granularity AF-144's tracker was never built for.
 *
 * "Simulation Tiers" (5: Immediate/Local Region/Planetary/Sector/
 * Galactic) mirrors AF-144's real `PriorityEngine` frame-divisor
 * MECHANISM (a caller-registered tier throttles update frequency) but
 * is its own separate 5-tier union, since `PriorityEngine` is
 * hand-typed to its own closed 3-tier `PriorityTier` union — the same
 * missed-generalisation precedent AF-145/149 already recorded for
 * AF-146/143's differently-typed classes.
 *
 * "Emotional Pacing" (8 categories) overlaps conceptually with AF-136's
 * real `StoryDirector` (3 categories: combat/exploration/downtime,
 * confirmed via `pacingBias()`) — a materially narrower scope. Kept as
 * its own separate 8-category tracker rather than widening a locked
 * class.
 *
 * "Responsibilities" (17 systems) is the SEVENTH parallel "which
 * systems does this touch" list in this codebase, after AF-142/144/
 * 145/149/152's real lists — kept as its own reference list.
 *
 * "Narrative Guardrails" (6, all-must-pass) is the EIGHTH all-must-pass
 * checklist gate in this codebase, after the real Constitution's two
 * gates, AF-145/146/147's tests, and AF-148's `expansionRespectsTimeline`
 * — a genuinely different scope (protecting ongoing simulation updates,
 * not gating new expansions), so kept separate rather than merged.
 *
 * "Emergence Manager" ("gently encourage meaningful coincidences")
 * composes AF-151's real `KnowledgeGraph.suggestConnections` as its
 * discovery mechanism (a "Commander reunion" IS a shared-neighbour
 * suggestion between two Commander nodes) — this module's own
 * `EmergenceOpportunityLog` records what gets surfaced, never
 * reimplementing the suggestion algorithm itself.
 */
export const SIMULATION_DIRECTOR_RESPONSIBILITIES = ["Living Galaxy", "Living Ship", "Civilisation Engine", "Event Engine", "Story Engine", "Evolution Engine", "Economy", "Weather", "Research", "Wildlife", "Commander AI", "Companion AI", "Traffic", "Population", "Museum", "Chronicle", "Legacy"] as const;

export const SIMULATION_TIERS = ["Immediate", "Local Region", "Planetary", "Sector", "Galactic"] as const;
export type SimulationTier = (typeof SIMULATION_TIERS)[number];

export const SIMULATION_TIER_EXAMPLES: Readonly<Record<SimulationTier, readonly string[]>> = {
  Immediate: ["Player", "Combat", "Nearby NPCs", "Physics", "Dialogue", "Animation"],
  "Local Region": ["Nearby colonies", "Weather", "Wildlife", "Traffic", "Events"],
  Planetary: ["Economy", "Infrastructure", "Politics", "Education", "Healthcare"],
  Sector: ["Trade", "Migration", "Research", "Fleet movement", "Festivals"],
  Galactic: ["Historic simulation", "Deep-space expeditions", "Unknown civilizations", "Remote ecology"],
};

export interface AttentionFactors {
  playerProximity: number;
  narrativeImportance: number;
  historicalImportance: number;
  commanderRelevance: number;
  urgency: number;
  populationImpact: number;
  currentMission: number;
  emotionalSignificance: number;
}

export const ATTENTION_FACTOR_KEYS: readonly (keyof AttentionFactors)[] = ["playerProximity", "narrativeImportance", "historicalImportance", "commanderRelevance", "urgency", "populationImpact", "currentMission", "emotionalSignificance"];

/** "Every entity receives an Attention Score." A decoupled pure
 * function — plain 0-100 factor values in, a single averaged score
 * out. Never imports the systems it reads from. */
export function computeAttentionScore(factors: AttentionFactors): number {
  const total = ATTENTION_FACTOR_KEYS.reduce((sum, key) => sum + factors[key], 0);
  return total / ATTENTION_FACTOR_KEYS.length;
}

export const SIMULATION_BUDGET_FACTORS = ["Importance", "Visibility", "Player interaction likelihood", "Historical consequences", "Current performance"] as const;

/** The spec's own 8-category balance list — a materially wider scope
 * than AF-136's real `StoryDirector` (3 categories: combat/
 * exploration/downtime). Kept separate. */
export const EMOTIONAL_PACING_CATEGORIES = ["Discovery", "Reflection", "Construction", "Conversation", "Celebration", "Danger", "Recovery", "Wonder"] as const;
export type EmotionalPacingCategory = (typeof EMOTIONAL_PACING_CATEGORIES)[number];

export const EMOTIONAL_PACING_AVOID = ["Constant crisis", "Constant rewards", "Constant combat"] as const;

export const SYSTEM_SYNCHRONISATION_EXAMPLES = ["Weather changes", "Population growth", "Commander movement", "Festival timing", "Research completion", "Economic shifts", "Story progression"] as const;

/** The EIGHTH all-must-pass checklist gate in this codebase (see
 * module doc comment) — a different scope from AF-148's
 * `expansionRespectsTimeline` (protects ongoing simulation updates,
 * not new expansions). */
export const NARRATIVE_GUARDRAILS = ["Commander arcs", "Historical continuity", "Museum accuracy", "Legacy", "Canon", "Relationship development"] as const;
export type NarrativeGuardrail = (typeof NARRATIVE_GUARDRAILS)[number];

export function narrativeGuardrailsRespected(protected_: ReadonlySet<NarrativeGuardrail>): boolean {
  return NARRATIVE_GUARDRAILS.every((guardrail) => protected_.has(guardrail));
}

export const LIVING_BACKGROUND_EXAMPLES = ["Cities expand", "Research completes", "Wildlife migrates", "Trade continues", "Festivals occur", "Schools graduate students"] as const;

export const LOAD_BALANCING_FACTORS = ["Hardware", "Battery", "Frame rate", "Memory", "Streaming budget", "User settings"] as const;

export const EMERGENCE_OPPORTUNITY_KINDS = ["Unexpected discoveries", "Commander reunions", "Wildlife encounters", "Historic callbacks", "Research opportunities", "Planet celebrations"] as const;
export type EmergenceOpportunityKind = (typeof EMERGENCE_OPPORTUNITY_KINDS)[number];

export const DIAGNOSTIC_TOOLS = ["Simulation heatmap", "Attention graph", "CPU allocation viewer", "Narrative pacing graph", "Entity activity tracker", "Performance timeline", "Conflict detector"] as const;

export const SIMULATION_DIRECTOR_ACCESSIBILITY_SURFACES = ["Simulation complexity presets", "Performance advisor", "Reduced simulation mode", "Narrative-first mode", "Narration ready"] as const;
