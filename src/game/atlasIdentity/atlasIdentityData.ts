/**
 * The Atlas Identity Engine (AF-167). Exists above AF-166's
 * Consciousness Engine: consciousness defines who someone believes
 * they are (internal), identity defines how they exist within the
 * wider universe (external, earned by others' recognition — "never
 * assigned").
 *
 * "Personal Identity" (9 externally-visible signature traits:
 * signature habits/favourite sayings/teaching style/humour/body
 * language/...) is a genuinely different axis from AF-166's real
 * `Identity` interface (personalHistory/currentSelfImage/
 * professionalIdentity/...), which models internal self-perception,
 * not externally-recognisable signatures. Rather than building a new
 * curated-entry class, this reuses AF-163's real `MeaningCurator<TCategory>`
 * DIRECTLY — that class was already written as a generic over any
 * category union (unlike AF-160's hand-typed `CommanderWisdomTracker`),
 * so no mirror-the-shape duplicate is needed here; `SignatureTraitKind`
 * is simply a new type parameter for the same real class.
 *
 * "Commander Identity" ("the galaxy recognises these qualities") and
 * "Institutional Identity" ("each develops its own reputation") both
 * describe the same underlying mechanic — OTHERS recognising a quality
 * over time — a fundamentally different axis from AF-160's real
 * `CommanderWisdomTracker` (internal growth) and AF-166's real
 * `PersonalGrowthTracker` (internal growth). One generic
 * `ReputationTracker`, keyed by plain entity id and quality string,
 * serves both sections rather than two near-identical trackers.
 *
 * "Cultural Identity" ("communities evolve stories, celebrations,
 * art... culture grows organically") is confirmed the reuse of AF-159's
 * real `CulturalTrendTracker` mechanic — the same "which entities have
 * adopted this" question, composed directly at the call site.
 * "Symbolism" ("symbols strengthen belonging") composes AF-163's real
 * `SignificanceTracker` directly for reinforcement, distinct from this
 * module's own `SYMBOLISM_CATEGORIES` (symbol KINDS: flags/colours/
 * mottos/...) which is a genuinely different list from AF-163's real
 * `SYMBOL_EXAMPLES` (specific artifact INSTANCES: Atlas Beacon/
 * Founder's helmet/...).
 *
 * "Historical Identity" ("the city that rebuilt the oceans"... "identity
 * becomes history") is confirmed genuinely new: an append-only earned
 * EPITHET per entity, distinct from AF-135's Chronicle (records what
 * happened) and AF-163's `MeaningCurator` (curates a single favourite
 * per category) — a title, once earned, is never replaced or curated
 * away, only added to.
 *
 * "Identity Layers" (10, personal→galactic scale) is a genuinely
 * different axis from AF-166's real `CULTURAL_IDENTITY_LAYERS` (6,
 * what a citizen identifies WITH — home world, profession, family) —
 * this list ranks the SCALE at which identity itself operates, kept
 * separate.
 */

export const IDENTITY_LAYERS = ["Personal", "Professional", "Social", "Institutional", "Planetary", "Cultural", "Scientific", "Historical", "Civilisational", "Galactic"] as const;
export type IdentityLayer = (typeof IDENTITY_LAYERS)[number];

export const PERSONAL_IDENTITY_SIGNATURES = ["Signature habits", "Favourite sayings", "Teaching style", "Leadership approach", "Research interests", "Humour", "Routine", "Body language", "Preferred environments"] as const;
export type SignatureTraitKind = (typeof PERSONAL_IDENTITY_SIGNATURES)[number];

export const PROFESSIONAL_IDENTITY_EXAMPLES = ["Engineer", "Explorer", "Scientist", "Medic", "Historian", "Architect", "Pilot", "Educator"] as const;

export const COMMANDER_IDENTITY_QUALITIES = ["Leadership", "Reliability", "Creativity", "Compassion", "Bravery", "Scientific curiosity", "Mentorship", "Exploration"] as const;
export type RecognizedQuality = (typeof COMMANDER_IDENTITY_QUALITIES)[number];

export const COLONY_IDENTITY_TRAITS = ["Architecture", "Industry", "Education", "Music", "Cuisine", "Festivals", "Research strengths", "Landmarks", "Public traditions"] as const;

export const PLANETARY_IDENTITY_TRAITS = ["Landscape identity", "Wildlife identity", "Scientific importance", "Historic role", "Tourism", "Economic speciality", "Architectural language", "Environmental philosophy"] as const;

export const INSTITUTIONAL_IDENTITY_KINDS = ["Museums", "Universities", "Academies", "Hospitals", "Observatories", "Libraries", "Research institutes"] as const;

export const CULTURAL_IDENTITY_EXPRESSIONS = ["Stories", "Celebrations", "Art", "Language", "Music", "Public rituals", "Education", "Shared values"] as const;

export const SYMBOLISM_CATEGORIES = ["Flags", "Architectural motifs", "Colours", "Songs", "Mottos", "Insignia", "Gardens", "Constellations"] as const;

export const IDENTITY_DEVELOPER_TOOLS = ["Identity graph", "Reputation map", "Institution browser", "Planet identity viewer", "Commander signature tracker", "Cultural evolution dashboard"] as const;
