/**
 * The Atlas Possibility Space (AF-173). Sits above AF-172's Imagination
 * Engine: imagination invents ideas, the Possibility Space evaluates
 * which imagined futures are realistically achievable, without ever
 * committing the universe to one outcome. Reused directly wherever a
 * section names a mechanic that already exists:
 *
 * - "Possibility Network" ("every possibility links to required
 *   discoveries/people/resources, potential risks/benefits, historical
 *   context, future opportunities") is, field-for-field, AF-159's real
 *   `Possibility` interface/`PossibilityRegistry`
 *   (requiredKnowledge/requiredPeople/requiredLocations/
 *   potentialRisks/potentialRewards/historicalSignificance/
 *   futureImplications) — reused directly rather than authoring a
 *   second network-of-links registry.
 * - "Multiple Futures" ("Likely/Optimistic/Conservative/Unexpected/
 *   Unknown future... no branch becomes inevitable") is, mechanically,
 *   AF-158's real `FUTURE_STATE_KINDS`/`FutureStateForecast`/
 *   `mostLikelyFutureState` (Most Likely/Optimistic/Conservative/
 *   High-Risk/Unknown Future, each with a continuously-updating
 *   confidence) — the wording differs (lowercase, "Unexpected" vs.
 *   "High-Risk") but the shape is identical: five parallel,
 *   never-committed branch confidences per decision. Reused directly;
 *   no second five-branch forecaster.
 * - "Scientific Possibility"'s "only evidence-supported possibilities
 *   progress" is exactly AF-172's real `HypothesisTracker` — a
 *   speculative idea that starts ungrounded and only becomes grounded
 *   through an explicit later action. Reused directly.
 * - "Failed Possibilities" ("rejected ideas remain valuable... become
 *   academic papers, museum exhibits, teaching material, historical
 *   lessons, future inspiration... failure becomes knowledge") is the
 *   same "completed [or rejected] work becomes a named output" shape
 *   AF-159's real `InnovationMemoryArchive` already implements. Reused
 *   directly rather than mirroring a fourth near-duplicate archive.
 *
 * "Possibility Categories" (12) ties (does not break) the 8/12
 * absolute-count overlap record set by AF-162/AF-169's real domain
 * pairing: EIGHT of its 12 members are exact-string matches with
 * AF-159's real `DISCOVERY_CATEGORIES` (Scientific/Engineering/
 * Medical/Architectural/Educational/Ecological/Social/Cultural),
 * verified using AF-170's real `detectOverlap` function. Kept as its
 * own separate reference vocabulary: it tags the domain of a
 * SANDBOXED, not-yet-committed possibility, a distinct question from
 * AF-159's "which discipline discovered this" tag.
 *
 * "Simulation Sandbox" and its governing guarantee — "no real-world
 * consequences occur until decisions are made" — are confirmed
 * genuinely new: `SandboxScenarioRegistry` is a proposal registry with
 * an explicit proposed/committed state, structurally the commitment-
 * gate counterpart to AF-172's real evidence-gate `HypothesisTracker`,
 * but answering a different question (has civilisation chosen to act
 * on this, not whether the idea is scientifically grounded).
 *
 * "Innovation Filter" (6 criteria: Scientific plausibility/Engineering
 * feasibility/Ethical responsibility/Environmental sustainability/
 * Historical consistency/Civilisational benefit) mirrors the SHAPE of
 * AF-143's real `DesignScoreCard`/AF-149's real `AtlasScoreCard`/
 * AF-170's real `PrimeDirectiveScoreCard` — the FOURTH mirrored
 * scoring rubric in this codebase, typed to its own union, reusing the
 * same 9.5 gate threshold each of those three real rubrics already
 * settled on.
 */

export const POSSIBILITY_CATEGORIES = ["Scientific", "Engineering", "Medical", "Architectural", "Educational", "Ecological", "Social", "Economic", "Political", "Exploratory", "Cultural", "Civilisational"] as const;
export type PossibilityCategory = (typeof POSSIBILITY_CATEGORIES)[number];

export const SIMULATION_SANDBOX_DOMAINS = ["Future technologies", "Planetary development", "Infrastructure", "Educational systems", "Species recovery", "Trade routes", "Exploration strategies", "Governance"] as const;
export type SandboxDomain = (typeof SIMULATION_SANDBOX_DOMAINS)[number];

export const COMMANDER_THINKING_EXAMPLES = ["Alternative tactics", "Safer expeditions", "Scientific theories", "Leadership approaches", "Teaching methods", "Emergency responses", "Creative solutions"] as const;

export const SCIENTIFIC_POSSIBILITY_EXAMPLES = ["Experiments", "Material combinations", "Medical treatments", "Environmental restoration", "Energy production", "Space exploration"] as const;

export const ENGINEERING_POSSIBILITY_EXAMPLES = ["Prototype structures", "Habitat layouts", "Transit systems", "Power grids", "Construction methods", "Manufacturing improvements"] as const;

export const CIVILISATION_POSSIBILITY_EXAMPLES = ["Urban expansion", "Educational reform", "Healthcare improvements", "Environmental policies", "Scientific priorities", "Economic investment"] as const;

export const PLAYER_POSSIBILITY_EXAMPLES = ["Unfinished ideas", "Interesting construction patterns", "Museum themes", "Exploration habits", "Commander combinations", "Potential discoveries"] as const;

export const SAFE_EXPERIMENTATION_VENUES = ["Universities", "Research labs", "Engineering academies", "Simulation facilities", "Training worlds", "Virtual expeditions"] as const;

export const FAILED_POSSIBILITY_EXAMPLES = ["Academic papers", "Museum exhibits", "Teaching material", "Historical lessons", "Future inspiration"] as const;

export const POSSIBILITY_NETWORK_LINKS = ["Required discoveries", "Required people", "Required resources", "Potential risks", "Potential benefits", "Historical context", "Future opportunities"] as const;

export const INNOVATION_FILTER_CRITERIA = ["Scientific plausibility", "Engineering feasibility", "Ethical responsibility", "Environmental sustainability", "Historical consistency", "Civilisational benefit"] as const;
export type InnovationFilterCriterion = (typeof INNOVATION_FILTER_CRITERIA)[number];

export const INNOVATION_FILTER_GATE_THRESHOLD = 9.5;

export const POSSIBILITY_DEVELOPER_TOOLS = ["Possibility explorer", "Scenario simulator", "Future branch viewer", "Innovation dependency graph", "Feasibility analyser", "Opportunity dashboard"] as const;
