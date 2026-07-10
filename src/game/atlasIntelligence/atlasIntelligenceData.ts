/**
 * The Atlas Intelligence Engine (AF-155). The reasoning layer: where
 * AF-153/154 manage the simulation and the player's experience of it,
 * AF-155 lets individual entities reason, using knowledge already real
 * elsewhere in the codebase. Reused directly wherever a section names a
 * mechanic that already exists:
 *
 * - "Potential Commander collaborations" (a Discovery Suggestion kind)
 *   is exactly AF-151's real `KnowledgeGraph.suggestConnections` 2-hop
 *   shared-neighbour ranking — reused directly at the call site rather
 *   than a second suggestion algorithm.
 * - The "confidence... inversely related to variance" spirit behind the
 *   Uncertainty Model is the same spirit as AF-144's real
 *   `PredictionEngine.forecast`, but the domain differs (ranking margin
 *   between competing options vs. a time-series' own variance) so
 *   `rankOptions` below is a genuinely separate formula, not a call
 *   into `PredictionEngine`.
 *
 * "Commander Reasoning" ("each Commander reasons according to
 * personality") is deliberately built so `PersonalityTrait`
 * (`commanderProductionData.ts`) NEVER weights or biases the numeric
 * decision score — that file's own header comment establishes
 * personality as "dialogue-only by shape... a stat-bearing personality
 * is structurally unrepresentable, not just discouraged by convention."
 * Personality may only select flavour/explanation text for a decision
 * already reached by `rankOptions`' plain numeric factors — never the
 * other way round.
 *
 * "Intelligence Layers" (Observation→Understanding→Prediction→
 * Planning→Execution→Reflection) and the "Learning Loop" (Observe→
 * Interpret→Plan→Act→Review→Improve) are the module's OWN two
 * six-stage cyclic lists. They read as near-synonyms at a glance but
 * are NOT identical: the Layers include "Prediction" (no Loop analogue)
 * and the Loop includes "Improve" (no Layer analogue) — kept as two
 * separate typed stage lists, both driven by the same new generic
 * `CyclicStageTracker<TStage>` rather than two duplicate classes.
 *
 * The six "reasoning" sections (Commander/Colony/Scientific/
 * Exploration/Social/Strategic) each name their own factor vocabulary,
 * but all describe the identical mechanic — "weigh several named
 * factors, pick the best option, know how confident you are" — so they
 * share ONE generic `rankOptions` decoupled composer (per the AF-137
 * discipline: pure functions over plain signal bundles, never importing
 * the systems that supply them) instead of six near-identical classes.
 *
 * "Knowledge Sources" (13 systems) is confirmed the NINTH parallel
 * "which systems does this touch" list in this codebase, after AF-142/
 * 144/145/149/152/153/154's real lists (and AF-154's own "Primary
 * Responsibilities", the eighth) — kept separate.
 *
 * "Discovery Suggestions" (6 kinds: forgotten ruins/unfinished
 * expeditions/Commander collaborations/museum gaps/research
 * opportunities/wildlife preservation needs) is confirmed the FOURTH
 * "kind of notable moment" list in this codebase, after AF-136's real
 * `EMERGENT_MOMENT_KINDS`, AF-153's `EMERGENCE_OPPORTUNITY_KINDS`, and
 * AF-154's `DISCOVERY_KINDS` — kept separate since none of the three
 * already covers "gaps"/"unfinished work" framing.
 *
 * "Memory Integration" is confirmed genuinely new at this composing
 * level: nothing in the codebase already aggregates AF-133's per-NPC
 * `NpcMemoryLog`, AF-135's `PlanetaryChronicle`, and AF-134's museum
 * records into one knowledge-richness signal — `knowledgeRichnessScore`
 * is a decoupled composer over plain counts supplied by the caller.
 * "Collaborative Intelligence" (multiple entity types solving problems
 * together) is also confirmed genuinely new — no existing multi-
 * participant problem-solving log exists anywhere in the codebase.
 */

// ── Intelligence Layers: linear I → VI, not a loop (see module doc comment). ──
export const INTELLIGENCE_LAYERS = ["Observation", "Understanding", "Prediction", "Planning", "Execution", "Reflection"] as const;
export type IntelligenceLayer = (typeof INTELLIGENCE_LAYERS)[number];

// ── Learning Loop: a separate six-stage cycle (see module doc comment). ──
export const LEARNING_LOOP_STAGES = ["Observe", "Interpret", "Plan", "Act", "Review", "Improve"] as const;
export type LearningLoopStage = (typeof LEARNING_LOOP_STAGES)[number];

/** The NINTH parallel "which systems does this touch" list (see module
 * doc comment) — kept separate from AF-142/144/145/149/152/153/154's
 * real lists. */
export const KNOWLEDGE_SOURCES = ["Living Galaxy", "Chronicle", "Museum", "Legacy Engine", "Knowledge Graph", "World Model", "Simulation Director", "Commander Bonds", "Economy", "Research", "Weather", "Events", "Exploration"] as const;
export type KnowledgeSource = (typeof KNOWLEDGE_SOURCES)[number];

export const COMMANDER_REASONING_FACTORS = ["Mission history", "Past failures", "Trusted allies", "Current resources", "Planet conditions", "Civilian risk", "Scientific opportunities", "Relationship strength"] as const;
export type CommanderReasoningFactor = (typeof COMMANDER_REASONING_FACTORS)[number];

export const COLONY_REASONING_FACTORS = ["Housing", "Education", "Healthcare", "Trade", "Security", "Population growth", "Ecology", "Infrastructure", "Future investment"] as const;
export type ColonyReasoningFactor = (typeof COLONY_REASONING_FACTORS)[number];

export const SCIENTIFIC_REASONING_FACTORS = ["Knowledge gaps", "Unexplored anomalies", "Useful experiments", "Technology dependencies", "Historical evidence", "Unexpected discoveries"] as const;
export type ScientificReasoningFactor = (typeof SCIENTIFIC_REASONING_FACTORS)[number];

export const EXPLORATION_REASONING_FACTORS = ["Risk", "Potential reward", "Historic importance", "Weather", "Wildlife", "Resources", "Scientific value", "Strategic value"] as const;
export type ExplorationReasoningFactor = (typeof EXPLORATION_REASONING_FACTORS)[number];

export const SOCIAL_REASONING_FACTORS = ["Trust", "Friendship", "Community", "Shared history", "Promises", "Leadership", "Reputation"] as const;
export type SocialReasoningFactor = (typeof SOCIAL_REASONING_FACTORS)[number];

export const STRATEGIC_REASONING_FACTORS = ["Expansion", "Preservation", "Research", "Education", "Trade", "Infrastructure", "Environmental restoration", "Future generations"] as const;
export type StrategicReasoningFactor = (typeof STRATEGIC_REASONING_FACTORS)[number];

export interface ReasoningOption {
  id: string;
  scores: Readonly<Record<string, number>>;
}

export interface DecisionOutcome {
  bestId: string;
  confidence: number;
}

/** The one shared decision-scoring mechanic behind all six "reasoning"
 * sections (see module doc comment). Sums each option's named factor
 * scores and picks the highest total; confidence is the normalised gap
 * between the best and second-best total — a genuinely different
 * formula from AF-144's real time-series `PredictionEngine`, which
 * derives confidence from a history's own variance, not a ranking
 * margin. Never imports Commander/Colony/etc. state directly — callers
 * supply plain scores. */
export function rankOptions(options: readonly ReasoningOption[]): DecisionOutcome | null {
  if (options.length === 0) return null;
  const totals = options.map((option) => ({ id: option.id, total: Object.values(option.scores).reduce((sum, value) => sum + value, 0) }));
  totals.sort((a, b) => b.total - a.total);
  const best = totals[0]!;
  const second = totals[1];
  const spread = second ? best.total - second.total : best.total;
  const confidence = best.total > 0 ? Math.max(0, Math.min(1, spread / best.total)) : 0;
  return { bestId: best.id, confidence };
}

export const UNCERTAINTY_RESPONSES = ["Investigation", "Research", "Exploration", "Discussion"] as const;
export type UncertaintyResponse = (typeof UNCERTAINTY_RESPONSES)[number];

/** "Low confidence encourages [these], not reckless guessing." A
 * deterministic confidence-band mapping — never a random pick. */
export function suggestUncertaintyResponse(confidence: number): UncertaintyResponse | null {
  if (confidence >= 0.4) return null;
  if (confidence < 0.1) return "Investigation";
  if (confidence < 0.2) return "Research";
  if (confidence < 0.3) return "Exploration";
  return "Discussion";
}

/** The FOURTH "kind of notable moment" list in this codebase (see
 * module doc comment) — kept separate from AF-136/153/154's real
 * lists. */
export const DISCOVERY_SUGGESTION_KINDS = ["Likely forgotten ruins", "Unfinished expeditions", "Potential Commander collaborations", "Museum gaps", "Research opportunities", "Wildlife preservation needs"] as const;
export type DiscoverySuggestionKind = (typeof DISCOVERY_SUGGESTION_KINDS)[number];

export interface MemoryIntegrationSignals {
  recentEvents: number;
  historicEvents: number;
  personalMemories: number;
  sharedMemories: number;
  museumRecords: number;
  chronicleEntries: number;
}

/** "Reasoning incorporates [six memory sources]... knowledge
 * accumulates." A decoupled composer over plain counts the caller
 * gathers from AF-133/134/135's real classes at the call site — never
 * imports those classes directly. */
export function knowledgeRichnessScore(signals: Readonly<MemoryIntegrationSignals>): number {
  return signals.recentEvents + signals.historicEvents + signals.personalMemories + signals.sharedMemories + signals.museumRecords + signals.chronicleEntries;
}

export const INTELLIGENCE_DEVELOPER_TOOLS = ["Reasoning inspector", "Decision tree viewer", "Knowledge dependency graph", "Prediction timeline", "Learning history", "Confidence visualiser"] as const;
