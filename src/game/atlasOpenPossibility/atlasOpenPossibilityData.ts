/**
 * The Atlas Possibility Engine (AF-194). "The Excellence Engine ensures
 * civilisation continually improves. The Possibility Engine ensures
 * civilisation never believes improvement has ended."
 *
 * ⚠ CRITICAL NAMING COLLISION — the most severe of the entire session:
 * this spec's title, "The Atlas Possibility Engine," is a VERBATIM,
 * word-for-word duplicate of AF-159's own real, already-locked module
 * title (`src/game/atlasPossibility/`, "Sits above AF-158's Future
 * Engine... imagines opportunities nobody has considered yet"). Every
 * prior naming collision this session (AF-185/186/188/191/192) involved
 * at most a shared WORD inside a differently-worded title; this is the
 * first FULL exact-title duplicate. Flagged prominently here, in the
 * catalogue doc, and in the closing summary for Project Owner
 * awareness — resolved the same way every prior collision was resolved
 * (own directory, `atlasOpenPossibility/`, extend rather than
 * redefine), but the display name is disambiguated as "The Atlas
 * Possibility Engine (AF-194)" wherever it must appear alongside
 * AF-159's identical title.
 *
 * A research pass before implementation found AF-159 already built the
 * near-entirety of this spec's apparatus. Reused directly:
 *
 * - "The Possibility Web" ("every possibility links to existing
 *   knowledge, current challenges, available resources, historical
 *   context, potential contributors, future consequences") is exactly
 *   AF-159's real `PossibilityRegistry`/`Possibility` interface — that
 *   interface already carries `requiredKnowledge`/`requiredPeople`/
 *   `requiredLocations`/`potentialRisks`/`potentialRewards`/
 *   `historicalSignificance`/`futureImplications`. Reused directly;
 *   zero new registry.
 * - "The Unknown Reserve" ("the universe intentionally retains
 *   unexplored sectors, unanswered questions... unknown remains
 *   valuable") reuses AF-159's real `MysteryLog` directly —
 *   `unsolved()` already guarantees the reserve is never empty by
 *   construction once opened.
 * - "Player Possibility" ("the player always has meaningful options...
 *   no playstyle reaches a dead end") reuses AF-159's real
 *   `PlayerInspirationLog` directly.
 * - "The Open Door Principle" ("every completed objective should
 *   naturally unlock at least one new opportunity/question") is
 *   exactly AF-169's real `ensureNextHorizonOpen` directly — the
 *   precise "completion opens the next mystery" composition it already
 *   formalises, at least the sixth-plus reuse of this guarantee.
 * - "Possibility Through Cooperation" reuses AF-155's real
 *   `CollaborativeProblemLog` directly.
 * - "Civilisational Possibility" ("which worlds remain unseen... which
 *   ideas remain unexplored") composes AF-151's real
 *   `KnowledgeGraph.suggestConnections` directly — the same shared-
 *   neighbour convergence AF-159's own "Serendipity" section already
 *   reused for an identical purpose.
 *
 * Confirmed genuinely new: "The Possibility Cycle" (Observation→
 * Question→Possibility→Exploration→Experiment→Discovery→Reflection→
 * "New Possibilities") never draws an arrow back to Observation by
 * name — its final stage is a distinct new concept, not a repeat of
 * its first — so it is modelled as an ORDERED, NON-CYCLIC ladder via
 * the new `possibilityCycleRank`, mirroring the established
 * `xRank(stage): number` pattern rather than AF-155's real
 * `CyclicStageTracker`. It shares 2 of 8 stages exactly with AF-191's
 * real `CREATION_CYCLE_STAGES` (Question/Reflection) and zero with
 * either AF-192's `CRAFT_CYCLE_STAGES` or AF-193's
 * `EXCELLENCE_CYCLE_STAGES` — the fourth sibling process ladder
 * authored in a row, still fragmented membership, verified via AF-170's
 * real `detectOverlap`.
 *
 * "The Possibility Index" (8 categories, "evaluate... Curiosity...
 * Future readiness") mirrors AF-143/149/170/173/179/180/182/184/188/
 * 190/193's real scoring-rubric shape exactly — the TWELFTH such rubric
 * in this codebase, typed to its own new `PossibilityIndexCategory`
 * union, reusing the same established 9.5 gate. Shares zero exact
 * members with AF-193's real `EXCELLENCE_INDEX_CATEGORIES`.
 *
 * "Possibility Domains" (12) shares 11 of 12 exact-string members with
 * AF-193's real `EXCELLENCE_DOMAINS` (only "Civilisation" here vs
 * "Governance" there) — ties but does not break the absolute overlap
 * record (AF-191's own 12/12 remains highest) — and only 2 of 12 with
 * AF-159's own real `DISCOVERY_CATEGORIES` (Engineering/Exploration),
 * both verified via `detectOverlap`. The Scientific/Engineering/
 * Commander Possibility sections, "Limitations," and "Possibility
 * Through Cooperation"'s own participant list are kept as pure
 * reference vocabulary — the same honest scope boundary AF-143/149/
 * 171/191/192/193 already established for enumeration sections with no
 * distinct mechanic of their own.
 */

export const POSSIBILITY_DOMAINS = ["Science", "Engineering", "Medicine", "Education", "Exploration", "Architecture", "Culture", "Ecology", "History", "Community", "Leadership", "Civilisation"] as const;
export type PossibilityDomain = (typeof POSSIBILITY_DOMAINS)[number];

// ── The Possibility Cycle: ordered, non-cyclic — mirrors the established xRank pattern, never CyclicStageTracker. ──
export const POSSIBILITY_CYCLE_STAGES = ["Observation", "Question", "Possibility", "Exploration", "Experiment", "Discovery", "Reflection", "New Possibilities"] as const;
export type PossibilityCycleStage = (typeof POSSIBILITY_CYCLE_STAGES)[number];

/** Mirrors AF-139/156/157/162/166/170/179/180/192's real rank
 * functions — an ordered, non-cyclic ladder, never described as
 * wrapping back to its first stage by name (see module doc comment). */
export function possibilityCycleRank(stage: PossibilityCycleStage): number {
  return POSSIBILITY_CYCLE_STAGES.indexOf(stage);
}

export const SCIENTIFIC_POSSIBILITY_EXAMPLES = ["New hypotheses", "New instruments", "New disciplines", "New collaborations", "New educational opportunities"] as const;

export const ENGINEERING_POSSIBILITY_EXAMPLES = ["Improved infrastructure", "New habitats", "Advanced restoration", "Safer exploration", "Creative architecture"] as const;

export const COMMANDER_POSSIBILITY_EXAMPLES = ["New leadership styles", "Research opportunities", "Teaching approaches", "Mentorship networks", "Exploration goals"] as const;

export const PLAYER_POSSIBILITY_EXAMPLES = ["Restore another ecosystem", "Mentor new Commanders", "Build a new academy", "Investigate ancient signals", "Expand museums", "Design new cities", "Support scientific initiatives"] as const;

export const CIVILISATIONAL_POSSIBILITY_QUESTIONS = ["Which worlds remain unseen?", "Which species remain unknown?", "Which histories remain incomplete?", "Which ideas remain unexplored?"] as const;

export const POSSIBILITY_COOPERATION_PARTICIPANTS = ["Scientists", "Engineers", "Teachers", "Artists", "Communities", "Explorers", "Children"] as const;

export const LIMITATION_BENEFITS = ["Efficiency", "Creativity", "Collaboration", "Adaptation", "Better long-term solutions"] as const;

export const UNKNOWN_RESERVE_EXAMPLES = ["Unexplored sectors", "Unanswered questions", "Undiscovered species", "Untranslated archives", "Emerging sciences", "Future technologies"] as const;

// ── The Possibility Index: the TWELFTH mirrored scoring-rubric shape in this codebase. ──
export const POSSIBILITY_INDEX_CATEGORIES = ["Curiosity", "Research diversity", "Exploration opportunities", "Educational growth", "Community innovation", "Creative expression", "Scientific openness", "Future readiness"] as const;
export type PossibilityIndexCategory = (typeof POSSIBILITY_INDEX_CATEGORIES)[number];

export const POSSIBILITY_INDEX_GATE_THRESHOLD = 9.5;

export const OPEN_DOOR_UNLOCK_KINDS = ["A new opportunity", "A new question", "A new relationship", "A new direction"] as const;

export const POSSIBILITY_DEVELOPER_TOOLS = ["Possibility explorer", "Opportunity graph", "Future pathway viewer", "Curiosity dashboard", "Knowledge frontier browser", "Potential analyser"] as const;
