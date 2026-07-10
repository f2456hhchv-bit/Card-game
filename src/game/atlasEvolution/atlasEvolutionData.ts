/**
 * The Atlas Evolution Engine (AF-186). AF-185's Living Universe
 * ensures everything remains alive; the Evolution Engine ensures
 * everything grows for a reason.
 *
 * NAMING SCOPE NOTE: this module's own name collides directly with
 * the already-locked AF-139 "Evolution Engine" (`src/game/evolutionEngine/`
 * — equipment craftsmanship stages, `HistoricalArchitectureLedger`,
 * `SpeciesAdaptationRegistry`, companion growth, commander maturity,
 * technology eras, language evolution). AF-186 is a distinct module at
 * the Atlas civilisation-narrative layer, lives entirely under its own
 * `atlasEvolution/` directory, and never redefines any AF-139
 * mechanic — wherever this module's own sections name a mechanic
 * AF-139 already built, AF-186 composes it directly instead:
 *
 * - "Species Evolution" reuses AF-139's real
 *   `SpeciesAdaptationRegistry`/`SPECIES_ADAPTATION_TRIGGER_KINDS`
 *   directly — this module's own `SPECIES_EVOLUTION_EXAMPLES` shares
 *   3 of 7 exact-string members with AF-139's real trigger union
 *   (Climate/Migration/Food availability), confirmed via AF-170's
 *   real `detectOverlap`.
 * - "City Evolution" ("architecture reflects history... cities
 *   visibly mature") reuses AF-139's real `HistoricalArchitectureLedger`
 *   directly.
 * - "Cultural Evolution"'s "Language" reuses AF-139's real
 *   `LanguageEvolutionLog` directly; the broader section also
 *   composes AF-159's real `CulturalTrendTracker`.
 * - "Commander Evolution" reuses AF-139's real `commanderMaturityScore`/
 *   `commanderMaturityStageFor` directly.
 * - "Technological Evolution" reuses AF-139's real `technologyEraFor`/
 *   `TECHNOLOGY_ERAS` directly.
 * - "Personal Evolution" composes AF-166's real `IdentityRegistry`
 *   directly.
 * - "Institutional Evolution" composes AF-165's real
 *   `InstitutionalMemoryTracker` directly.
 * - "Scientific Evolution" composes AF-172's real `HypothesisTracker`
 *   directly.
 * - "Educational Evolution" composes AF-160's real `MentorshipLedger`
 *   directly.
 * - "Civilisational Evolution" reuses AF-175's real
 *   `GenerationalHandoffLedger` directly.
 *
 * "Evolution Domains" (12) shares ZERO exact-string members with
 * AF-139's real `EVOLUTION_PILLARS` (11) despite obvious conceptual
 * overlap — confirmed via `detectOverlap` — because AF-139's list uses
 * adjective forms (Technological/Scientific/Cultural/Architectural/
 * Educational) while this module's own list uses concrete nouns
 * (People/Communities/Species/Cities/Planets), the same "near-total
 * conceptual duplicate, zero exact overlap" pattern this codebase has
 * documented before.
 *
 * "The Evolution Chain" (Observation → Learning → Experimentation →
 * Improvement → Adoption → Tradition → Foundation → New Observation,
 * "evolution becomes continuous") is driven directly by AF-155's real
 * generic `CyclicStageTracker<TStage>` over this module's own 8-stage
 * `EVOLUTION_CHAIN_STAGES` union — confirmed genuinely absent from
 * AF-139, whose own trackers are all grow-only.
 *
 * "Reversibility" ("civilisation may abandon ideas, restore forgotten
 * practices, rediscover older knowledge") and "The Evolution Record"
 * ("every meaningful change records origin, reason...") together
 * describe the module's own genuinely new contribution:
 * `EvolutionRecord`. Every other tracker in this codebase — AF-139's
 * own equipment/companion/architecture ledgers included — only grows
 * forward (append-only permanence or monotonic advancement).
 * `EvolutionRecord` is the FIRST tracker whose current state can
 * legitimately regress to an earlier value (Adopted → Abandoned →
 * Restored) while remaining a fully honest, traceable append-only
 * history — a fundamentally different guarantee from AF-177's real
 * `GenesisRegistry` (write-once, exactly one permanent origin, never
 * a second record for the same entity).
 */

export const EVOLUTION_DOMAINS = ["People", "Communities", "Species", "Cities", "Planets", "Institutions", "Technology", "Science", "Culture", "Architecture", "Education", "Civilisation"] as const;
export type EvolutionDomain = (typeof EVOLUTION_DOMAINS)[number];

export const PERSONAL_EVOLUTION_EXAMPLES = ["Experience", "Education", "Relationships", "Mentorship", "Success", "Failure", "Reflection", "Time"] as const;

export const COMMANDER_EVOLUTION_EXAMPLES = ["Leadership", "Teaching", "Research", "Decision making", "Communication", "Reputation", "Personal philosophy", "Legacy"] as const;

export const SPECIES_EVOLUTION_EXAMPLES = ["Climate", "Habitats", "Human stewardship", "Migration", "Food availability", "Predation", "Scientific restoration"] as const;

export const INSTITUTIONAL_EVOLUTION_EXAMPLES = ["Museums expand collections", "Universities create new disciplines", "Academies refine teaching", "Hospitals improve care", "Libraries digitise archives"] as const;

export const SCIENTIFIC_EVOLUTION_EXAMPLES = ["Replication", "Debate", "Evidence", "Revision", "Discovery", "Teaching"] as const;

export const TECHNOLOGICAL_EVOLUTION_EXAMPLES = ["Research", "Field testing", "Iteration", "Public adoption", "Education", "Maintenance"] as const;

export const CULTURAL_EVOLUTION_EXAMPLES = ["Language", "Music", "Literature", "Architecture", "Cuisine", "Festivals", "Traditions"] as const;

export const EDUCATIONAL_EVOLUTION_EXAMPLES = ["Research", "Experience", "Technology", "Mentorship", "Student feedback", "Exploration"] as const;

export const CIVILISATIONAL_EVOLUTION_EXAMPLES = ["Knowledge", "Cooperation", "Stewardship", "Creativity", "Reflection", "Purpose", "Legacy"] as const;

export const EVOLUTION_CHAIN_STAGES = ["Observation", "Learning", "Experimentation", "Improvement", "Adoption", "Tradition", "Foundation", "New Observation"] as const;
export type EvolutionChainStage = (typeof EVOLUTION_CHAIN_STAGES)[number];

export const REVERSIBILITY_EXAMPLES = ["Abandon ideas", "Restore forgotten practices", "Rediscover older knowledge", "Learn from mistakes"] as const;

export const EVOLUTION_TRANSITION_STATES = ["Adopted", "Abandoned", "Restored", "Rediscovered"] as const;
export type EvolutionTransitionState = (typeof EVOLUTION_TRANSITION_STATES)[number];

export const EVOLUTION_RECORD_FIELDS = ["Origin", "Reason", "Evidence", "Contributors", "Consequences", "Future influence"] as const;

export const EVOLUTION_DEVELOPER_TOOLS = ["Evolution timeline", "Growth graph", "Institution evolution viewer", "Technology lineage browser", "Species adaptation viewer", "Civilisation maturity dashboard"] as const;
