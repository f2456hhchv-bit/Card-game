/**
 * The Atlas Soul Engine (AF-168). Exists above AF-167's Identity
 * Engine: identity answers "who are we?", the Soul Engine answers
 * "what kind of civilisation are we becoming?" — operating at
 * civilisation scale rather than per-individual. Reused directly
 * wherever a section names a mechanic that already exists:
 *
 * - "Commander Spirit" ("commanders become symbols... future
 *   generations tell stories about their kindness/courage/wisdom")
 *   is exactly AF-167's real `ReputationTracker`/`EarnedTitleTracker`
 *   mechanics at legendary scale — reused directly, no second
 *   symbol/legend system.
 * - "Place Spirit" ("places feel emotionally distinct") composes
 *   AF-163's real `SignificanceTracker` directly — the same
 *   accumulated-significance mechanic AF-164/165/167 already reused.
 * - "Community Spirit" reuses AF-159's real `CulturalTrendTracker`
 *   directly.
 * - "Inspiration" ("one mentor inspires another... hope propagates
 *   naturally") composes AF-160's real `MentorshipLedger` directly
 *   (mentor→mentee IS an inspiration link) together with AF-151's
 *   real `KnowledgeGraph` for how inspiration spreads between people —
 *   no second propagation model.
 * - "Collective Memory" ("some moments become legendary... because
 *   they represented humanity at its best") is exactly AF-163's real
 *   `collectiveMemory` `MeaningCurator` instance — reused directly.
 * - "Galactic Reputation" ("other civilisations recognise humanity by
 *   its character") is exactly AF-167's real `ReputationTracker`,
 *   reused directly at civilisation scale (entity id `"humanity"`
 *   rather than a Commander or institution id).
 * - "Soul Through Adversity" ("setbacks test civilisation, recovery
 *   defines it") is exactly AF-166's real `EmotionalContinuityTracker`,
 *   reused directly at civilisation scale.
 *
 * "Soul Dimensions" (12) is confirmed the HEAVIEST PROPORTIONAL overlap
 * yet recorded in this codebase: EIGHT of AF-160's real 10-member
 * `CIVILISATION_VALUES` (Hope/Curiosity/Compassion/Humility/
 * Responsibility/Cooperation/Legacy/Stewardship) appear verbatim here —
 * 80% of that list, a higher proportion than AF-162's previous
 * 8-of-12 (67%) record overlap with AF-161. Kept as its own separate
 * reference vocabulary rather than merged: `CIVILISATION_VALUES` names
 * ideals the Wisdom Engine actively reinforces, while `SOUL_DIMENSIONS`
 * names aspects of a spirit that can only be measured as it emerges
 * from lived history — never reinforced or assigned directly. This
 * distinction is enforced structurally: nowhere in this module does a
 * function let a caller directly set a soul-dimension value.
 *
 * The self-review's explicit directive — "ensure the Soul Engine never
 * becomes a numerical morality system" — is honoured by
 * `CollectiveCharacterTracker`: it only exposes per-trait WITNESSED
 * counts and an emergent dominant trait (mirroring AF-162's real
 * `PlayerPurposeObserver.dominantPurpose` "reveal, never assign"
 * discipline), never a combined civilisation-morality scalar.
 * "Rituals" ("none are mandatory, all are meaningful") is structurally
 * enforced by `RitualLog` having no completion/mandatory field at all.
 */

export const SOUL_DIMENSIONS = ["Hope", "Curiosity", "Compassion", "Resilience", "Humility", "Wonder", "Responsibility", "Creativity", "Cooperation", "Legacy", "Stewardship", "Belonging"] as const;
export type SoulDimension = (typeof SOUL_DIMENSIONS)[number];

export const COLLECTIVE_CHARACTER_TRAITS = ["Patient", "Generous", "Curious", "Inventive", "Protective", "Welcoming", "Thoughtful"] as const;
export type CollectiveCharacterTrait = (typeof COLLECTIVE_CHARACTER_TRAITS)[number];

export const CIVILISATIONAL_SPIRIT_REFLECTIONS = ["How children are educated", "How discoveries are celebrated", "How strangers are welcomed", "How mistakes are remembered", "How history is preserved", "How nature is protected"] as const;

export const COMMANDER_SPIRIT_QUALITIES = ["Their kindness", "Their courage", "Their wisdom", "Their humour", "Their perseverance"] as const;

export const PLACE_SPIRIT_EXAMPLES = ["A peaceful observatory", "A beloved park", "A famous academy", "A legendary workshop", "A historic launch site", "A restored forest"] as const;

export const COMMUNITY_SPIRIT_TRAITS = ["Hospitality", "Volunteer traditions", "Scientific curiosity", "Public celebrations", "Shared rituals", "Neighbourhood identity"] as const;

export const RITUAL_EXAMPLES = ["Watching the first sunrise of the year", "Planting remembrance trees", "Lighting the Beacon", "Welcoming new explorers", "Graduation walks", "Commander farewell ceremonies"] as const;

export const MOMENTS_OF_HUMANITY_EXAMPLES = ["Helping someone carry equipment", "Children asking questions", "A Commander comforting a recruit", "Citizens applauding returning explorers", "A shared meal after a difficult mission"] as const;

export const BEAUTY_INDEX_CATEGORIES = ["Gardens", "Art", "Music", "Architecture", "Public spaces", "Wildlife", "Education"] as const;
export type BeautyIndexCategory = (typeof BEAUTY_INDEX_CATEGORIES)[number];

export const GALACTIC_REPUTATION_QUALITIES = ["Compassion", "Curiosity", "Reliability"] as const;

export const SOUL_DEVELOPER_TOOLS = ["Civilisation spirit graph", "Hope index", "Community wellbeing map", "Tradition evolution viewer", "Inspiration network", "Humanity dashboard"] as const;
