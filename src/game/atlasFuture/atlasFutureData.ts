/**
 * The Atlas Future Engine (AF-158). Transforms AF-157's planning into
 * vision — where planning coordinates action, forecasting projects
 * state. Reused directly wherever a section names a mechanic that
 * already exists:
 *
 * - Numeric point-forecasts across "Colony/Research/Economic
 *   Forecasting" (Population growth, Trade demand, breakthroughs, ...)
 *   should compose AF-144's real `PredictionEngine.forecast` directly
 *   at the call site — "Population growth" is a verbatim shared member
 *   between this module's own `COLONY_FORECASTING_KINDS` and AF-144's
 *   real `PREDICTION_KINDS`, confirming this is the same time-series
 *   trend-forecasting mechanic AF-144 already provides (the same
 *   direct reuse AF-152's real World Model already made for its own
 *   "Predictive Reasoning"). No second time-series forecaster.
 *
 * "Future Horizons" (Immediate/Operational/Strategic/Civilisational/
 * Historic, minutes→centuries) is confirmed the FOURTH time/scope
 * ladder in this codebase that shares "Immediate" as a tier name, after
 * AF-153's real `SIMULATION_TIERS` (spatial simulation scope), AF-156's
 * real `LONG_TERM_PLANNING_HORIZONS` (decision scope), and AF-157's
 * real `PLANNING_TIME_HORIZONS` (concrete planning-action duration).
 * This one measures FORECAST horizon — how far into the future a
 * projection reaches — a genuinely different question from all three,
 * kept as its own `FutureHorizon` union.
 *
 * "Opportunity Analysis" (8 kinds) mirrors the SHAPE of AF-155's real
 * `DiscoverySuggestionLog`/`DiscoverySuggestionKind` (append-only,
 * surface-by-kind) but never its TYPE — that class is hand-typed to its
 * own closed 6-value union, not a reusable generic, the same missed-
 * generalisation precedent AF-149/153 already recorded for AF-143's
 * `DesignScoreCard`. `OpportunityAnalysisKind` shares zero members with
 * AF-155's `DiscoverySuggestionKind`, confirmed the FIFTH "kind of
 * notable moment" list in this codebase, after AF-136/153/154/155's
 * real lists.
 *
 * "Future Memory" (5 outputs) mirrors the SHAPE of AF-157's real
 * `PlanMemoryArchive`/`PlanMemoryOutcome` for the same missed-
 * generalisation reason — "Educational material" is the one verbatim
 * shared member with AF-157's real `PLAN_MEMORY_OUTCOMES`, but the
 * other four differ enough (Research papers/Commander experience/
 * Planning improvements vs. Museum exhibits/Academic publications/
 * Commander lessons/Future planning references) to keep as its own
 * separate `FutureMemoryOutcome` union rather than force a shared type.
 *
 * "Future States" (5 kinds: Most Likely/Optimistic/Conservative/High-
 * Risk/Unknown Future, each with its own continuously-updating
 * confidence) is confirmed genuinely new: nothing in the codebase
 * already models FIVE parallel branching scenarios per entity — AF-144's
 * real `PredictionEngine` produces exactly one point-forecast with one
 * confidence value, a fundamentally different shape.
 */

export const FUTURE_HORIZONS = ["Immediate", "Operational", "Strategic", "Civilisational", "Historic"] as const;
export type FutureHorizon = (typeof FUTURE_HORIZONS)[number];

export const FUTURE_STATE_KINDS = ["Most Likely Future", "Optimistic Future", "Conservative Future", "High-Risk Future", "Unknown Future"] as const;
export type FutureStateKind = (typeof FUTURE_STATE_KINDS)[number];

export interface FutureStateForecast {
  entityId: string;
  confidences: Readonly<Record<FutureStateKind, number>>;
}

/** "Confidence continuously updates." Picks the branch with the
 * highest currently-stored confidence — never a random pick. */
export function mostLikelyFutureState(forecast: FutureStateForecast): FutureStateKind {
  return FUTURE_STATE_KINDS.reduce((best, state) => (forecast.confidences[state] > forecast.confidences[best] ? state : best), FUTURE_STATE_KINDS[0]!);
}

export const FORECAST_FACTORS = ["Knowledge", "Resources", "Population", "Commander leadership", "Research", "Weather", "Economy", "Ecology", "Relationships", "History", "Legacy"] as const;
export type ForecastFactor = (typeof FORECAST_FACTORS)[number];

export const COMMANDER_FORESIGHT_KINDS = ["Mission success", "Equipment needs", "Training gaps", "Scientific opportunities", "Potential emergencies", "Recruitment", "Mentorship", "Future leadership"] as const;
export type CommanderForesightKind = (typeof COMMANDER_FORESIGHT_KINDS)[number];

export const COLONY_FORECASTING_KINDS = ["Population growth", "Housing demand", "Food production", "Healthcare capacity", "Education", "Power usage", "Transportation", "Climate resilience"] as const;
export type ColonyForecastingKind = (typeof COLONY_FORECASTING_KINDS)[number];

export const RESEARCH_FORECASTING_KINDS = ["Likely breakthroughs", "Technology convergence", "Knowledge gaps", "Resource requirements", "Laboratory expansion", "Future discoveries", "Museum contributions"] as const;
export type ResearchForecastingKind = (typeof RESEARCH_FORECASTING_KINDS)[number];

export const EXPLORATION_FORECASTING_KINDS = ["Unknown sectors", "Ancient signals", "Environmental hazards", "Discovery probability", "Survival chance", "Historic significance", "Expected scientific value"] as const;
export type ExplorationForecastingKind = (typeof EXPLORATION_FORECASTING_KINDS)[number];

export const ENVIRONMENTAL_FORECASTING_KINDS = ["Climate recovery", "Wildlife return", "Forest growth", "Ocean restoration", "Species migration", "Terraforming success", "Long-term stability"] as const;
export type EnvironmentalForecastingKind = (typeof ENVIRONMENTAL_FORECASTING_KINDS)[number];

export const ECONOMIC_FORECASTING_KINDS = ["Trade demand", "Construction", "Employment", "Tourism", "Education", "Manufacturing", "Research funding", "Migration"] as const;
export type EconomicForecastingKind = (typeof ECONOMIC_FORECASTING_KINDS)[number];

export const RISK_ANALYSIS_KINDS = ["Resource shortages", "Infrastructure overload", "Commander fatigue", "Disease outbreaks", "Environmental instability", "Scientific uncertainty", "Political disagreement", "Unknown anomalies"] as const;
export type RiskAnalysisKind = (typeof RISK_ANALYSIS_KINDS)[number];

/** The FIFTH "kind of notable moment" list in this codebase (see
 * module doc comment) — kept separate from AF-136/153/154/155's real
 * lists. */
export const OPPORTUNITY_ANALYSIS_KINDS = ["New discoveries", "Historic expeditions", "Trade expansion", "Scientific partnerships", "Commander collaboration", "Museum growth", "Education investment", "Ecological restoration"] as const;
export type OpportunityAnalysisKind = (typeof OPPORTUNITY_ANALYSIS_KINDS)[number];

export const FUTURE_RESHAPING_FACTORS = ["Player actions", "Commander decisions", "Scientific discoveries", "Unexpected events"] as const;

export const FUTURE_MEMORY_OUTCOMES = ["Historical lessons", "Research papers", "Commander experience", "Educational material", "Planning improvements"] as const;
export type FutureMemoryOutcome = (typeof FUTURE_MEMORY_OUTCOMES)[number];

export const FUTURE_VISUALISATION_TOOLS = ["Forecast timeline", "Probability graph", "Future dependency map", "Opportunity explorer", "Risk dashboard", "Confidence viewer", "Scenario simulator"] as const;
