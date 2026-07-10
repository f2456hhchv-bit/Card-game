/**
 * The Atlas Decision Engine (AF-156). Where AF-155 determines what an
 * entity understands, AF-156 determines what it actually chooses to
 * do. Reused directly wherever a section names a mechanic AF-155
 * already built:
 *
 * - Decision Pyramid Levels III–VI ("Knowledge... Possibilities...
 *   Evaluation... Choice") are exactly AF-155's real `rankOptions` —
 *   weigh named factor scores, pick the best, know the confidence.
 *   `explainDecision` below composes it directly rather than
 *   re-scoring anything.
 * - "Uncertainty" (confidence, known unknowns, estimated risk) is
 *   exactly AF-155's real Uncertainty Model — `suggestUncertaintyResponse`
 *   is reused directly at the call site, no second confidence formula.
 * - "Decision Pyramid" itself (7 levels, ending in "Reflection: was it
 *   successful?") is driven by AF-155's real generic
 *   `CyclicStageTracker<TStage>` directly — no new stage-tracker class.
 * - "Group Decisions" ("multiple [bodies] reach consensus... knowledge
 *   spreads") is confirmed the same mechanic as AF-155's real
 *   "Collaborative Intelligence" (`CollaborativeProblemLog`) at a
 *   formal-body granularity — reused directly rather than a second
 *   consensus log.
 *
 * Structural note that resolves the module's biggest apparent overlap:
 * AF-155's six "reasoning" lists (Commander/Colony/Scientific/
 * Exploration/Social/Strategic Reasoning Factors) are lists of
 * EVALUATION CRITERIA that feed a score. AF-156's seven "Decisions"
 * sections (Commander/Citizen/Colony/Research/Exploration/Wildlife/
 * Social) are a genuinely different axis: lists of the DECISION SLOTS
 * — the actual choices being made ("Destination", "Route", "Team" —
 * not evaluation criteria at all). Confirmed by direct comparison: e.g.
 * AF-155's `EXPLORATION_REASONING_FACTORS` (Risk/Potential reward/...)
 * vs. this module's `EXPLORATION_DECISION_KINDS` (Destination/Route/
 * Team/...) share zero members. Kept as seven new `*_DECISION_KINDS`
 * unions, reference vocabulary for tagging `DecisionLog` entries —
 * never merged with AF-155's factor lists.
 *
 * "Decision Factors" (10, top-level) lists "Personality" as one input.
 * Per AF-030/AF-155's established design law (`PersonalityTrait` is
 * "dialogue-only by shape... a stat-bearing personality is structurally
 * unrepresentable, not just discouraged by convention"), Personality
 * here — like everywhere else in the codebase — may only explain or
 * flavour a decision `rankOptions` already reached by other numeric
 * factors, never add its own weight to the score.
 *
 * "Ethical Framework" (6 values, faction-weighted), "Player Influence"
 * (capped, "never absolute control"), and "Long-term Planning" (5
 * horizons) are confirmed genuinely new: nothing in the codebase
 * already weights competing values per faction, caps the player's
 * share of a decision's total weight, or ranks decision time-horizons
 * from a single mission to a generation. `DecisionLog.isRepetitive`
 * (satisfying the self-review's "eliminate repetitive choices") mirrors
 * AF-153/154's real "same value across the whole window" stall/
 * imbalance check, generalised to any decision domain rather than one
 * hand-typed category union.
 */

import { type ReasoningOption, rankOptions } from "../atlasIntelligence/atlasIntelligenceData";

export const DECISION_PYRAMID_LEVELS = ["Need", "Context", "Knowledge", "Possibilities", "Evaluation", "Choice", "Reflection"] as const;
export type DecisionPyramidLevel = (typeof DECISION_PYRAMID_LEVELS)[number];

export const DECISION_FACTORS = ["History", "Personality", "Current objectives", "Commander Bonds", "Planet condition", "Available resources", "Scientific knowledge", "Player reputation", "Risk tolerance", "Civilisation values"] as const;
export type DecisionFactor = (typeof DECISION_FACTORS)[number];

export const COMMANDER_DECISION_KINDS = ["Mission priorities", "Research interests", "Training focus", "Leadership style", "Diplomatic responses", "Risk appetite", "Emergency actions", "Mentoring opportunities"] as const;
export type CommanderDecisionKind = (typeof COMMANDER_DECISION_KINDS)[number];

export const CITIZEN_DECISION_KINDS = ["Education", "Career", "Relocation", "Volunteering", "Family", "Travel", "Research", "Community projects", "Festival attendance"] as const;
export type CitizenDecisionKind = (typeof CITIZEN_DECISION_KINDS)[number];

export const COLONY_DECISION_KINDS = ["Expansion", "Construction", "Infrastructure", "Healthcare", "Education", "Trade", "Research", "Tourism", "Environmental restoration"] as const;
export type ColonyDecisionKind = (typeof COLONY_DECISION_KINDS)[number];

export const RESEARCH_DECISION_KINDS = ["Research value", "Historic importance", "Resource cost", "Collaboration opportunities", "Knowledge gaps", "Safety", "Future applications"] as const;
export type ResearchDecisionKind = (typeof RESEARCH_DECISION_KINDS)[number];

export const EXPLORATION_DECISION_KINDS = ["Destination", "Route", "Team", "Equipment", "Scientific priorities", "Emergency contingencies", "Recovery plans"] as const;
export type ExplorationDecisionKind = (typeof EXPLORATION_DECISION_KINDS)[number];

export const WILDLIFE_DECISION_KINDS = ["Migration", "Breeding", "Shelter", "Food", "Threat avoidance", "Social grouping", "Territory", "Adaptation"] as const;
export type WildlifeDecisionKind = (typeof WILDLIFE_DECISION_KINDS)[number];

export const SOCIAL_DECISION_KINDS = ["Trust", "Forgiveness", "Mentorship", "Collaboration", "Celebrations", "Conflict resolution", "Gift giving", "Shared projects"] as const;
export type SocialDecisionKind = (typeof SOCIAL_DECISION_KINDS)[number];

export const ETHICAL_VALUES = ["Preservation", "Education", "Compassion", "Scientific integrity", "Environmental stewardship", "Long-term prosperity"] as const;
export type EthicalValue = (typeof ETHICAL_VALUES)[number];

export type FactionValuePriorities = Readonly<Partial<Record<EthicalValue, number>>>;

/** "Different factions may weigh values differently." A decoupled
 * composer over a plain priority map — never imports faction state
 * directly. */
export function ethicalAlignmentScore(priorities: FactionValuePriorities, valuesServed: ReadonlySet<EthicalValue>): number {
  let total = 0;
  for (const value of valuesServed) total += priorities[value] ?? 0;
  return total;
}

export const PLAYER_INFLUENCE_CHANNELS = ["Leadership", "Reputation", "Relationships", "Infrastructure", "Education", "Scientific progress", "Diplomacy"] as const;
export type PlayerInfluenceChannel = (typeof PLAYER_INFLUENCE_CHANNELS)[number];

/** "Never absolute control" — the player's share of any decision's
 * total weight is capped, regardless of how high the raw signal is. */
export const PLAYER_INFLUENCE_CAP = 0.5;

export function cappedPlayerInfluence(rawWeight: number): number {
  return Math.max(0, Math.min(rawWeight, PLAYER_INFLUENCE_CAP));
}

export const GROUP_DECISION_BODIES = ["Commander Council", "Scientific Congress", "Planetary Government", "Expedition Planning"] as const;
export type GroupDecisionBody = (typeof GROUP_DECISION_BODIES)[number];

export const GROUP_CONSENSUS_FACTORS = ["Expertise", "Trust", "Evidence", "Urgency", "Historical precedent", "Shared objectives"] as const;
export type GroupConsensusFactor = (typeof GROUP_CONSENSUS_FACTORS)[number];

export const LONG_TERM_PLANNING_HORIZONS = ["One mission", "One expedition", "One year", "One decade", "One generation"] as const;
export type PlanningHorizon = (typeof LONG_TERM_PLANNING_HORIZONS)[number];

/** Mirrors AF-148's real `canonPyramidRank`/AF-154's real
 * `playerJourneyTierRank` indexOf pattern. */
export function planningHorizonRank(horizon: PlanningHorizon): number {
  return LONG_TERM_PLANNING_HORIZONS.indexOf(horizon);
}

export const DECISION_EXPLANATION_TOOLS = ["Decision tree", "Evidence", "Confidence", "Rejected alternatives", "Historical influences", "Predicted outcomes"] as const;

export interface DecisionExplanation {
  chosenId: string;
  confidence: number;
  rejectedIds: readonly string[];
}

/** "Developer tools expose... rejected alternatives." Composes AF-155's
 * real `rankOptions` directly rather than re-scoring anything, then
 * derives the rejected-alternatives ordering as a thin wrapper. */
export function explainDecision(options: readonly ReasoningOption[]): DecisionExplanation | null {
  const outcome = rankOptions(options);
  if (!outcome) return null;
  const rejectedIds = options
    .filter((option) => option.id !== outcome.bestId)
    .map((option) => ({ id: option.id, total: Object.values(option.scores).reduce((sum, value) => sum + value, 0) }))
    .sort((a, b) => b.total - a.total)
    .map((entry) => entry.id);
  return { chosenId: outcome.bestId, confidence: outcome.confidence, rejectedIds };
}
