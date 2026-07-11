/**
 * The Atlas Judgement Engine (AF-198). "The Reasoning Engine determines
 * how intelligent entities think. The Judgement Engine determines how
 * they ultimately decide. Reasoning produces possibilities. Judgement
 * chooses a path." AF-197's direct sibling, and — like AF-197 — this
 * spec's vocabulary overlaps almost entirely with already-locked
 * modules: AF-156's "Atlas Decision Engine" (`atlasDecision/`) and
 * AF-155's "Atlas Intelligence Engine" (`atlasIntelligence/`).
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Great judgement balances evidence with humanity" and "Commander
 *   Judgement... leadership reflects maturity" are exactly AF-156's
 *   real `ethicalAlignmentScore`/`ETHICAL_VALUES` directly
 *   (Preservation/Education/Compassion/Scientific integrity/
 *   Environmental stewardship/Long-term prosperity) — the same
 *   "different factions may weigh values differently" composer already
 *   built for exactly this "balance evidence with values" question.
 * - Scientific/Engineering/Historical Judgement's underlying MECHANISM
 *   (weigh named factors, pick the best, know the confidence) is
 *   exactly AF-155's real `rankOptions`, reused directly — the same
 *   reuse AF-197's own Reasoning sections already made.
 * - "Judgement Record" ("decision makers, evidence reviewed,
 *   alternatives rejected, expected/actual outcomes, lessons learned")
 *   reuses AF-156's real `explainDecision` together with AF-156's real
 *   `DecisionLog.record` directly — the same pairing AF-197's own
 *   "Reasoning Record" already reused. Shares 4 of its 6 fields exactly
 *   with AF-197's real `REASONING_RECORD_FIELDS` (Decision makers/
 *   Evidence reviewed/Expected outcomes/Actual outcomes) — confirmed
 *   via AF-170's real `detectOverlap`, documented honestly rather than
 *   silently merged, since "Alternatives rejected"/"Lessons learned"
 *   genuinely differ from "Alternatives considered"/"Trade-offs."
 * - "Collective Judgement" ("institutions often decide together
 *   through expert review, public consultation, scientific panels")
 *   reuses AF-156's real `GROUP_DECISION_BODIES`/`GROUP_CONSENSUS_FACTORS`
 *   directly, composed with AF-155's real `CollaborativeProblemLog`
 *   directly — at least the TENTH instance of that mechanic in this
 *   codebase.
 *
 * Confirmed genuinely new: "The Judgement Cycle" (9 stages: Context→
 * Evidence→Reasoning→Values→Consultation→Decision→Consequences→
 * Reflection→"Improved Judgement") never draws an arrow back to
 * Context by name — modelled as an ORDERED, NON-CYCLIC ladder via the
 * new `judgementCycleRank`, mirroring the established
 * `xRank(stage): number` pattern. It shares only 3 of 9 stages with
 * AF-197's real `REASONING_CYCLE_STAGES` (Evidence/Decision/Reflection)
 * and 2 of 9 with AF-156's real `DECISION_PYRAMID_LEVELS`
 * (Context/Reflection), confirmed via `detectOverlap`.
 *
 * "Judgement Domains" (12) shares 11 of 12 exact-string members with
 * AF-197's real `REASONING_DOMAINS` (only "Culture" here vs
 * "Diplomacy" there) — ties but does not break the absolute overlap
 * record (AF-191's own 12/12 remains highest), confirmed via
 * `detectOverlap`. "Individual Judgement" (7 traits: Decision
 * confidence/Humility/Patience/Risk awareness/Empathy/Strategic
 * thinking/Long-term perspective, "these evolve naturally through
 * experience") is kept as pure flavour vocabulary, the same treatment
 * as AF-197's "Individual Reasoning" styles — per the established
 * AF-030/155 personality design law, no new tracker assigns or weights
 * these. "The Cost of Decisions," "Judgement Maturity," "The
 * Accountability Principle," and "Player Judgement" are all kept as
 * pure reference vocabulary — none uses an explicit "if yes/no then X"
 * gate framing, so inventing a boolean function for any of them would
 * add behaviour the spec never actually asks for (the same honest
 * restraint AF-197 already applied to its own "Meta-Reasoning"/
 * "Reasoning Standard").
 *
 * **No `AtlasJudgementRuntime.ts` file** — like AF-197 immediately
 * before it, this module introduces zero new stateful classes; its one
 * new piece is a pure lookup function, consistent with where every
 * sibling module's own `xRank`-shaped functions live.
 */

export const JUDGEMENT_DOMAINS = ["Science", "Engineering", "Leadership", "Medicine", "Education", "Ecology", "Exploration", "Community", "Architecture", "History", "Culture", "Civilisation"] as const;
export type JudgementDomain = (typeof JUDGEMENT_DOMAINS)[number];

// ── The Judgement Cycle: ordered, non-cyclic — mirrors the established xRank pattern. ──
export const JUDGEMENT_CYCLE_STAGES = ["Context", "Evidence", "Reasoning", "Values", "Consultation", "Decision", "Consequences", "Reflection", "Improved Judgement"] as const;
export type JudgementCycleStage = (typeof JUDGEMENT_CYCLE_STAGES)[number];

/** Mirrors AF-139/156/157/162/166/170/179/180/192/194/196/197's real
 * rank functions — an ordered, non-cyclic ladder (see module doc
 * comment). */
export function judgementCycleRank(stage: JudgementCycleStage): number {
  return JUDGEMENT_CYCLE_STAGES.indexOf(stage);
}

export const INDIVIDUAL_JUDGEMENT_TRAITS = ["Decision confidence", "Humility", "Patience", "Risk awareness", "Empathy", "Strategic thinking", "Long-term perspective"] as const;

export const COMMANDER_JUDGEMENT_CRITERIA = ["Mission success", "Crew wellbeing", "Scientific opportunity", "Educational benefit", "Environmental stewardship", "Institutional responsibility", "Future consequences"] as const;

export const SCIENTIFIC_JUDGEMENT_CRITERIA = ["Evidence quality", "Research ethics", "Replication", "Risk", "Public benefit", "Transparency"] as const;

export const ENGINEERING_JUDGEMENT_CRITERIA = ["Safety", "Reliability", "Longevity", "Accessibility", "Maintainability", "Environmental impact"] as const;

export const HISTORICAL_JUDGEMENT_CRITERIA = ["Evidence", "Context", "Bias", "Multiple perspectives", "Preservation", "Interpretation"] as const;

export const PLAYER_JUDGEMENT_EXAMPLES = ["Leadership style", "Planning quality", "Scientific curiosity", "Educational investment", "Community priorities", "Ecological stewardship"] as const;

export const COST_OF_DECISIONS_FACTORS = ["Benefits", "Trade-offs", "Opportunity costs", "Unknowns", "Future responsibilities"] as const;

/** Shares 4 of 6 fields exactly with AF-197's real
 * `REASONING_RECORD_FIELDS` (see module doc comment). */
export const JUDGEMENT_RECORD_FIELDS = ["Decision makers", "Evidence reviewed", "Alternatives rejected", "Expected outcomes", "Actual outcomes", "Lessons learned"] as const;

export const JUDGEMENT_MATURITY_QUESTIONS = ["What can we do?", "What should we do?"] as const;

export const ACCOUNTABILITY_TARGETS = ["Evidence", "History", "Institutions", "Future generations", "Public trust"] as const;

export const JUDGEMENT_DEVELOPER_TOOLS = ["Decision browser", "Judgement timeline", "Trade-off analyser", "Responsibility graph", "Institutional review dashboard", "Consequence explorer"] as const;
