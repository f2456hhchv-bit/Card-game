/**
 * The Atlas Reasoning Engine (AF-197). "The Verification Engine
 * establishes what is true. The Reasoning Engine governs how every
 * intelligent entity reaches conclusions from that truth."
 *
 * A research pass before implementation found this spec's vocabulary
 * overlaps almost entirely with AF-155's already-locked "Atlas
 * Intelligence Engine" (`atlasIntelligence/`, literally the codebase's
 * existing reasoning layer) and AF-156's already-locked "Atlas Decision
 * Engine" (`atlasDecision/`, which decides what an entity does with
 * that reasoning). Reused directly wherever a section names a mechanic
 * either already built:
 *
 * - "Uncertainty" ("not every question has one answer... civilisation
 *   remains comfortable with uncertainty") is exactly AF-155's real
 *   `suggestUncertaintyResponse` directly — "low confidence encourages
 *   investigation/research/exploration/discussion, never reckless
 *   guessing" already models exactly this comfort-with-uncertainty
 *   principle.
 * - "Collaborative Reasoning" ("discussion... peer review... shared
 *   evidence") reuses AF-155's real `CollaborativeProblemLog` directly
 *   — at least the NINTH instance of this mechanic in this codebase.
 * - "Reasoning Record" ("evidence reviewed... alternatives
 *   considered... decision makers... expected/actual outcomes") reuses
 *   AF-156's real `explainDecision` (confidence + rejected
 *   alternatives) together with AF-156's real `DecisionLog.record`
 *   (persistence across domains) directly — the same "developer tools
 *   expose rejected alternatives" composition AF-156 already built.
 * - Commander/Scientific/Engineering/Historical Reasoning's underlying
 *   MECHANISM (weigh named factors, pick the best, know the confidence)
 *   is exactly AF-155's real `rankOptions`, reused directly at the call
 *   site for every one of these sections rather than four near-
 *   identical scoring functions.
 *
 * Structural note resolving the module's biggest apparent overlap,
 * mirroring AF-156's own precedent exactly: this spec's four domain-
 * specific "Reasoning" sections (Commander/Scientific/Engineering/
 * Historical) name their own factor vocabulary, but despite describing
 * the conceptually identical mechanic as AF-155's own six "Reasoning
 * Factors" lists, they share ZERO exact-string members with either
 * AF-155's real `COMMANDER_REASONING_FACTORS` or
 * `SCIENTIFIC_REASONING_FACTORS` — confirmed via AF-170's real
 * `detectOverlap`. Kept as four new reference lists (feeding the same
 * shared `rankOptions` mechanism) rather than merged into AF-155's own
 * unions, the same "different exact wording, same shared mechanism"
 * treatment AF-156 itself established for its seven `*_DECISION_KINDS`
 * lists.
 *
 * "Individual Reasoning" (8 style preferences: Evidence-first/
 * Experimental/Historical/Pragmatic/Creative/Conservative/Systems
 * thinking/Collaborative, "these influence — not dictate — behaviour")
 * is a THIRD distinct axis from both AF-155's evaluation-CRITERIA
 * factor lists and AF-156's decision-SLOT `*_DECISION_KINDS` lists: a
 * reasoning STYLE preference. Per AF-030/155's established design law
 * (`PersonalityTrait` is dialogue-only by shape; personality may only
 * explain a decision already reached by plain numeric factors, never
 * bias the score), these styles remain pure flavour vocabulary — no
 * new tracker assigns or weights them.
 *
 * Confirmed genuinely new: "The Reasoning Cycle" (9 stages: Observation
 * →Evidence→Interpretation→Alternative Explanations→Evaluation→
 * Decision→Reflection→Learning→"Improved Reasoning") never draws an
 * arrow back to Observation by name — its final stage is a distinct new
 * concept, not a repeat of its first — so it is modelled as an
 * ORDERED, NON-CYCLIC ladder via the new `reasoningCycleRank`,
 * mirroring the established `xRank(stage): number` pattern. It shares
 * only 2 of 9 stages with AF-155's real `INTELLIGENCE_LAYERS`
 * (Observation/Reflection), 2 of 9 with AF-156's real
 * `DECISION_PYRAMID_LEVELS` (Evaluation/Reflection), and ZERO with
 * AF-155's own `LEARNING_LOOP_STAGES` (word-form differences:
 * "Observe" vs "Observation," "Interpret" vs "Interpretation") —
 * confirmed via `detectOverlap`.
 *
 * "Reasoning Domains" (12) shares 7 of 12 exact-string members with
 * AF-196's real `VERIFICATION_DOMAINS` and 6 of 12 with AF-195's real
 * `COHERENCE_DOMAINS` — no record claimed (current record remains
 * AF-191's own 12/12). "Meta-Reasoning" and "The Reasoning Standard"
 * are both kept as pure reflective reference checklists, NOT gate
 * functions — unlike AF-195/196's own "Coherence/Truth Standard"
 * sections, neither spec text here uses an explicit "if yes/no then X"
 * framing, so inventing a boolean gate for either would add behaviour
 * the spec never actually asks for. "Player Reasoning" is kept as pure
 * reference for the same reason "Player Coherence" was in AF-195 —
 * restating rather than adding to an existing property.
 */

export const REASONING_DOMAINS = ["Science", "Engineering", "Leadership", "Medicine", "Education", "History", "Ecology", "Exploration", "Diplomacy", "Architecture", "Community", "Civilisation"] as const;
export type ReasoningDomain = (typeof REASONING_DOMAINS)[number];

// ── The Reasoning Cycle: ordered, non-cyclic — mirrors the established xRank pattern. ──
export const REASONING_CYCLE_STAGES = ["Observation", "Evidence", "Interpretation", "Alternative Explanations", "Evaluation", "Decision", "Reflection", "Learning", "Improved Reasoning"] as const;
export type ReasoningCycleStage = (typeof REASONING_CYCLE_STAGES)[number];

/** Mirrors AF-139/156/157/162/166/170/179/180/192/194/196's real rank
 * functions — an ordered, non-cyclic ladder (see module doc comment). */
export function reasoningCycleRank(stage: ReasoningCycleStage): number {
  return REASONING_CYCLE_STAGES.indexOf(stage);
}

export const INDIVIDUAL_REASONING_STYLES = ["Evidence-first", "Experimental", "Historical", "Pragmatic", "Creative", "Conservative", "Systems thinking", "Collaborative"] as const;

export const COMMANDER_REASONING_CRITERIA = ["Mission objectives", "Crew wellbeing", "Scientific evidence", "Environmental impact", "Educational value", "Historical significance", "Long-term consequences"] as const;

export const SCIENTIFIC_REASONING_CRITERIA = ["Evidence quality", "Experimental design", "Replication", "Alternative hypotheses", "Unexpected observations", "Statistical confidence"] as const;

export const ENGINEERING_REASONING_CRITERIA = ["Reliability", "Safety", "Efficiency", "Maintainability", "Accessibility", "Cost", "Longevity"] as const;

export const HISTORICAL_REASONING_CRITERIA = ["Sources", "Biases", "Evidence", "Context", "Chronology", "Interpretation"] as const;

export const PLAYER_REASONING_EXAMPLES = ["Planning habits", "Research priorities", "Leadership approaches", "Risk tolerance", "Educational philosophy", "Exploration style"] as const;

export const COLLABORATIVE_REASONING_CHANNELS = ["Discussion", "Peer review", "Debate", "Shared evidence", "Interdisciplinary expertise"] as const;

export const REASONING_RECORD_FIELDS = ["Evidence reviewed", "Alternatives considered", "Trade-offs", "Decision makers", "Expected outcomes", "Actual outcomes"] as const;

export const META_REASONING_QUESTIONS = ["Was my reasoning sound?", "What assumptions did I make?", "What evidence did I overlook?", "How can I improve?"] as const;

export const REASONING_STANDARD_QUESTIONS = ["What evidence supports this?", "What evidence challenges this?", "What assumptions exist?", "What uncertainties remain?", "What future information could change this?"] as const;

export const REASONING_DEVELOPER_TOOLS = ["Reasoning graph", "Decision explorer", "Assumption inspector", "Evidence chain viewer", "Trade-off analyser", "Inference debugger"] as const;
