/**
 * The Atlas Coherence Engine (AF-195). "Previous Atlas modules create
 * emergence, evolution, creativity and possibility. The Coherence
 * Engine ensures every outcome remains believable."
 *
 * A research pass before implementation found this spec's vocabulary
 * overlaps almost entirely with AF-148's already-locked "Atlas Canon
 * Engine" (`src/game/canonEngine/`) — a different title, but the exact
 * same territory (internal consistency/validation over lore). Reused
 * directly wherever a section names a mechanic AF-148 already built:
 *
 * - "The Context Chain" ("every event references previous events,
 *   people, institutions, locations, scientific understanding,
 *   historical significance, future implications") is exactly AF-148's
 *   real `CanonEventLedger`/`CanonEventRecord` directly — that record
 *   already carries participants/witnesses/evidence/museum+chronicle
 *   references/relationship impact/future callbacks.
 * - "Historical Coherence," "Scientific Coherence," and "Emergent
 *   Coherence" all reuse AF-148's real `loreValidationReport`/
 *   `LORE_VALIDATION_CHECK_KINDS` directly — the same decoupled
 *   composer over plain boolean signals covers "chronology/evidence/
 *   consequences," "known physics/established biology," and
 *   "validates against lore/history/scientific rules" alike.
 * - "The Contradiction Detector" reuses AF-148's real
 *   `KnowledgeStateTracker.hasDiverged` directly — a second real
 *   reuse alongside `loreValidationReport` for the same section.
 * - "Character Coherence" ("nothing contradicts earlier records")
 *   reuses AF-148's real `CommanderContinuityLedger` directly.
 * - "Institutional Coherence" ("mission, founding purpose... identity
 *   strengthens through continuity") reuses AF-165's real
 *   `InstitutionalMemoryTracker` directly.
 * - "Planetary Coherence" reuses AF-148's real
 *   `recordPlanetContinuityFact` (composing AF-135's real
 *   `PlanetaryChronicle`) directly.
 * - "The Canon Graph" ("every important entity connects to events,
 *   people, research, locations, artifacts, institutions,
 *   relationships") composes AF-151's real `KnowledgeGraph.addEdge`
 *   directly — yet another instance of this heavily-reused pattern.
 *
 * Confirmed genuinely new: "The Coherence Standard" ("does this fit...
 * if uncertainty exists, refine further") is another instance of this
 * codebase's established all-must-pass checklist-function family via
 * the new `coherenceStandardMet`, typed to its own
 * `CoherenceStandardQuestion` union — every question must be resolved
 * with confidence before an addition is considered coherent; any
 * unresolved question means "refine further."
 *
 * "Coherence Domains" (12) shares 7 of 12 exact-string members with
 * AF-194's real `POSSIBILITY_DOMAINS` and 6 of 12 with AF-193's real
 * `EXCELLENCE_DOMAINS` — no record claimed (current record remains
 * AF-191's own 12/12), both verified via AF-170's real `detectOverlap`.
 * "Player Coherence" (6 examples — "the universe remembers player
 * decisions...") restates, rather than adds to, a property many real
 * systems already guarantee (`WorldStateStore`, `PossibilityRegistry`,
 * every append-only ledger in this codebase) — kept as pure reference,
 * no new mechanic, since a parallel "memory of memory" tracker would
 * violate "extend, don't duplicate." The remaining domain-specific
 * coherence-aspect sections (Scientific/Character/Institutional/
 * Planetary) and "The Canon Graph"/"The Contradiction Detector"'s own
 * target lists are kept as pure reference vocabulary describing WHICH
 * signals feed the shared mechanisms above — the same honest scope
 * boundary AF-143/149/171/191/192/193/194 already established.
 */

export const COHERENCE_DOMAINS = ["Lore", "History", "Science", "Technology", "Ecology", "Culture", "Education", "Architecture", "Politics", "Economy", "Relationships", "Civilisation"] as const;
export type CoherenceDomain = (typeof COHERENCE_DOMAINS)[number];

export const CONTEXT_CHAIN_FIELDS = ["Previous events", "People involved", "Institutions affected", "Locations", "Scientific understanding", "Historical significance", "Future implications"] as const;

export const HISTORICAL_COHERENCE_CHECKS = ["Chronology", "Participants", "Motivations", "Evidence", "Consequences", "Interpretations"] as const;

export const SCIENTIFIC_COHERENCE_CHECKS = ["Known physics", "Established biology", "Existing technology", "Observed evidence", "Previous research"] as const;

export const CHARACTER_COHERENCE_ASPECTS = ["Dialogue", "Values", "Relationships", "Knowledge", "Leadership", "Emotional development", "Personal history"] as const;

export const INSTITUTIONAL_COHERENCE_ASPECTS = ["Mission", "Founding purpose", "Educational philosophy", "Historical evolution", "Public reputation", "Research priorities"] as const;

export const PLANETARY_COHERENCE_ASPECTS = ["Climate", "Geology", "Ecology", "Settlement history", "Architecture", "Scientific importance"] as const;

export const PLAYER_COHERENCE_EXAMPLES = ["Player decisions", "Settlement history", "Relationships", "Research priorities", "Museum collections", "Commander mentorship"] as const;

export const EMERGENT_COHERENCE_VALIDATION_TARGETS = ["Lore", "History", "Scientific rules", "Cultural norms", "Environmental constraints", "Institutional behaviour"] as const;

export const CANON_GRAPH_CONNECTION_TARGETS = ["Events", "People", "Research", "Locations", "Artifacts", "Institutions", "Relationships"] as const;

export const CONTRADICTION_DETECTOR_TARGETS = ["Timeline conflicts", "Scientific inconsistencies", "Dialogue contradictions", "Institutional drift", "Character regression", "Ecological impossibilities"] as const;

/** "Every addition asks... if uncertainty exists, refine further."
 * Another instance of this codebase's established all-must-pass
 * checklist-function family, typed to its own union. */
export const COHERENCE_STANDARD_QUESTIONS = ["Does this fit?", "Does it respect history?", "Does it strengthen continuity?", "Does it improve understanding?"] as const;
export type CoherenceStandardQuestion = (typeof COHERENCE_STANDARD_QUESTIONS)[number];

export const COHERENCE_DEVELOPER_TOOLS = ["Canon validator", "Timeline inspector", "Relationship consistency graph", "Scientific plausibility checker", "Lore dependency explorer", "Continuity dashboard"] as const;
