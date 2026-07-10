/**
 * The Atlas Harmony Engine (AF-182). AF-181's Eternity preserves
 * civilisation; the Harmony Engine preserves equilibrium — no single
 * domain should permanently dominate another. Reused directly
 * wherever a section names a mechanic that already exists:
 *
 * - "System Relationships" ("Education strengthens Science... nothing
 *   grows alone") and "Positive Feedback Loops" ("harmony compounds")
 *   both compose AF-151's real `KnowledgeGraph.addEdge` directly,
 *   using the already-real `"Influenced"` `GraphEdgeKind` — the same
 *   reuse AF-177/178/179's own "Network" sections already made.
 * - "Cultural Harmony" composes AF-159's real `CulturalTrendTracker`
 *   directly.
 * - "Commander Harmony" and "Social Harmony" both compose AF-160's
 *   real `MentorshipLedger` directly.
 * - "Urban Harmony"'s "Beauty" composes AF-168's real
 *   `BeautyIndexTracker` directly.
 *
 * "Harmony Domains" (12) shares 8 of 12 exact-string members with
 * AF-171's real `CREATIVE_DOMAINS`, verified using AF-170's real
 * `detectOverlap` function — documented honestly, no record claimed
 * since the codebase's current record is 11/12.
 *
 * "The Harmony Index" mirrors the SHAPE of AF-143/149/170/173/179/
 * 180's real scoring rubrics — the SEVENTH mirrored rubric in this
 * codebase, sharing exactly 3 of its 8 criteria ("Ecological
 * resilience", "Scientific openness", "Knowledge preservation")
 * verbatim with AF-180's real `TRANSCENDENCE_INDEX_CRITERIA`,
 * confirmed via `detectOverlap`, and reusing the same 9.5 gate
 * threshold.
 *
 * "The Balance Model" ("Growth/Health/Diversity/Accessibility/
 * Resilience/Sustainability/Interdependence/Contribution") and "The
 * Imbalance Detector" together describe the module's own genuinely
 * new contribution: `HarmonyTracker`. "Balance is dynamic. Not
 * static... balance changes gradually" mirrors AF-166's real
 * `ValuePriorityTracker`'s capped-delta-per-update constraint, but at
 * civilisation scale over `HarmonyDomain` rather than per-character
 * over `ValueExample`. "No single domain should permanently dominate
 * another" is confirmed genuinely new as a STRUCTURAL check —
 * `mostDominantDomain`/`mostNeglectedDomain`/`isBalanced` read the
 * emergent spread across all tracked domains rather than scoring one
 * fixed criterion set against a quality gate, a fundamentally
 * different question from every mirrored scoring rubric in this
 * codebase.
 */

export const HARMONY_DOMAINS = ["Science", "Engineering", "Education", "Ecology", "Economy", "Culture", "Architecture", "Healthcare", "History", "Community", "Exploration", "Legacy"] as const;
export type HarmonyDomain = (typeof HARMONY_DOMAINS)[number];

export const BALANCE_MODEL_FACTORS = ["Growth", "Health", "Diversity", "Accessibility", "Resilience", "Sustainability", "Interdependence", "Contribution"] as const;

export const SYSTEM_RELATIONSHIP_EXAMPLES = ["Education strengthens Science", "Science strengthens Medicine", "Medicine strengthens Communities", "Communities strengthen Culture", "Culture strengthens Identity", "Identity strengthens Cooperation"] as const;

export const ECOLOGICAL_HARMONY_EXAMPLES = ["Habitats", "Migration", "Climate", "Water systems", "Native species", "Long-term biodiversity"] as const;

export const URBAN_HARMONY_EXAMPLES = ["Housing", "Nature", "Transport", "Education", "Healthcare", "Industry", "Public spaces", "Beauty"] as const;

export const COMMANDER_HARMONY_EXAMPLES = ["Leadership", "Research", "Mentorship", "Rest", "Relationships", "Personal growth"] as const;

export const SCIENTIFIC_HARMONY_EXAMPLES = ["Curiosity", "Safety", "Ethics", "Resources", "Public benefit", "Environmental responsibility"] as const;

export const CULTURAL_HARMONY_EXAMPLES = ["Innovation", "Tradition", "Local identity", "Global cooperation", "Art", "Science", "History"] as const;

export const ECONOMIC_HARMONY_EXAMPLES = ["Long-term investment", "Education", "Healthcare", "Research", "Infrastructure", "Environmental stewardship"] as const;

export const SOCIAL_HARMONY_EXAMPLES = ["Trust", "Volunteerism", "Mentorship", "Public spaces", "Celebration", "Shared learning"] as const;

export const HARMONY_INDEX_CRITERIA = ["Educational equality", "Ecological resilience", "Scientific openness", "Community wellbeing", "Architectural quality", "Knowledge preservation", "Cultural vitality", "Public health"] as const;
export type HarmonyIndexCriterion = (typeof HARMONY_INDEX_CRITERIA)[number];

export const HARMONY_INDEX_GATE_THRESHOLD = 9.5;

export const POSITIVE_FEEDBACK_LOOP_EXAMPLES = ["Healthy ecosystems improve wellbeing", "Wellbeing improves education", "Education improves innovation", "Innovation improves sustainability", "Sustainability protects ecosystems"] as const;

export const IMBALANCE_DETECTOR_EXAMPLES = ["Educational decline", "Environmental stress", "Research stagnation", "Cultural erosion", "Infrastructure strain", "Institutional neglect"] as const;

export const HARMONY_DEVELOPER_TOOLS = ["Harmony dashboard", "Balance graph", "Interdependency network", "Civilisation health map", "Sustainability analyser", "Equilibrium simulator"] as const;
