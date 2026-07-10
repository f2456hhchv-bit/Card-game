/**
 * The Atlas Imagination Engine (AF-172). Exists above AF-171's
 * Creative Intelligence: creativity produces new ideas, imagination
 * explores realities that do not yet exist. Reused directly wherever
 * a section names a mechanic that already exists:
 *
 * - "Commander Visions" ("their dreams evolve through experience") is
 *   exactly AF-161's real `CommanderBeliefTracker` — that class stores
 *   plain evolving strings per commander with no union constraint, so
 *   it's reused directly for visions too rather than mirrored, the
 *   same "already a real generic" situation AF-167 found with AF-163's
 *   `MeaningCurator`.
 * - "Engineering Imagination" ("ideas become future projects") and
 *   "Collective Dreams" ("new horizons unite society") both compose
 *   AF-162's real `LongTermMissionTracker.register` directly — an
 *   imagined idea becoming a tracked generational project is exactly
 *   what that class already models.
 * - "Historical Imagination" ("what remains undiscovered?") composes
 *   AF-159's real `MysteryLog.open` directly.
 * - "The Dream Network" (a child imagines → a teacher encourages → a
 *   scientist investigates → an engineer prototypes → a Commander
 *   funds → civilisation advances) is driven directly by AF-155's real
 *   generic `CyclicStageTracker<TStage>` over this module's own
 *   5-stage `DREAM_NETWORK_STAGES` union.
 * - "The Horizon Effect" ("every answer creates new questions... wonder
 *   never reaches completion") is exactly AF-169's real
 *   `ensureNextHorizonOpen`, reused directly rather than a second
 *   completion-chains-to-a-new-mystery mechanic.
 *
 * "Imagination Domains" (12) ties (does not break) the current
 * absolute overlap record set by AF-171: NINE of its 12 members are
 * exact-string matches with AF-171's real `CREATIVE_DOMAINS`
 * (Exploration/Science/Engineering/Medicine/Architecture/Education/
 * Culture/Ecology/Art), verified using AF-170's real `detectOverlap`
 * function. Kept as its own separate reference vocabulary: it tags
 * what a SPECULATIVE idea concerns, a fifth distinct question from
 * "meaningful goal" (Purpose), "emotional significance" (Meaning),
 * "cross-generational inheritance" (Legacy) and "creative act"
 * (Creative Intelligence).
 *
 * "Scientific Imagination" and "Imagination Without Fantasy"
 * ("imagination never breaks established science... every
 * extraordinary possibility eventually gains believable scientific
 * grounding") are confirmed genuinely new: `HypothesisTracker` is a
 * speculative-idea registry with an explicit grounded/ungrounded
 * state — a fundamentally different concept from AF-155's real
 * `rankOptions` (which weighs already-known options) and from AF-159's
 * real `PossibilityRegistry` (which stores a fully-specified
 * opportunity, not an open, possibly-wrong guess).
 */

export const IMAGINATION_DOMAINS = ["Exploration", "Science", "Engineering", "Medicine", "Architecture", "Education", "Culture", "Ecology", "History", "Art", "Leadership", "Civilisation"] as const;
export type ImaginationDomain = (typeof IMAGINATION_DOMAINS)[number];

export const INDIVIDUAL_IMAGINATION_INFLUENCES = ["Research", "Expeditions", "Teaching", "Conversation", "Innovation", "Personal growth"] as const;

export const COMMANDER_VISION_EXAMPLES = ["Unknown worlds", "Future academies", "Scientific revolutions", "Improved expeditions", "Safer colonies", "Better teaching"] as const;

export const SCIENTIFIC_IMAGINATION_TOPICS = ["Unknown particles", "Life beyond known biology", "Alternative ecosystems", "Ancient precursor technology", "Unexplored physical phenomena"] as const;
export type ScientificImaginationTopic = (typeof SCIENTIFIC_IMAGINATION_TOPICS)[number];

export const ENGINEERING_IMAGINATION_EXAMPLES = ["Impossible structures", "Adaptive habitats", "Living architecture", "Self-restoring cities", "Planetary engineering", "Deep-space habitats"] as const;

export const CHILDRENS_IMAGINATION_OUTCOMES = ["Future discoveries", "Art", "Stories", "Games", "Scientific inspiration", "Educational reforms"] as const;

export const CULTURAL_IMAGINATION_FORMS = ["Paintings", "Music", "Poetry", "Architecture", "Literature", "Performances"] as const;

export const EXPLORATION_IMAGINATION_EXAMPLES = ["Unknown galaxies", "Hidden civilisations", "Living nebulae", "Impossible ecosystems", "Forgotten histories"] as const;

export const HISTORICAL_IMAGINATION_QUESTIONS = ["What remains undiscovered?", "Which records are incomplete?", "How might earlier civilisations have lived?"] as const;

export const COLLECTIVE_DREAM_EXAMPLES = ["The next galaxy", "Universal education", "Perfect ecological restoration", "Living museums", "Interstellar gardens"] as const;

export const DREAM_NETWORK_STAGES = ["Imagine", "Encourage", "Investigate", "Prototype", "Fund"] as const;
export type DreamNetworkStage = (typeof DREAM_NETWORK_STAGES)[number];

export const FUTURE_MYTH_EXAMPLES = ["The Living Ring", "The Ocean Between Galaxies", "The Atlas Horizon", "The Garden Worlds"] as const;

export const IMAGINATION_DEVELOPER_TOOLS = ["Vision graph", "Dream network viewer", "Hypothesis explorer", "Future concept browser", "Imagination dependency map", "Speculation timeline"] as const;
