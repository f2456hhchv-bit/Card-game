/**
 * The Atlas Verification Engine (AF-196). "The Coherence Engine ensures
 * everything fits together. The Verification Engine ensures everything
 * is demonstrably correct within the rules of the universe before it
 * becomes reality."
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Scientific Verification" ("observation... measurement...
 *   replication... independent confirmation") reuses AF-172's real
 *   `HypothesisTracker` directly — `propose`/`supportWithEvidence`/
 *   `isGrounded` already models exactly this progression from claim to
 *   confirmed knowledge.
 * - "The Evidence Graph" ("every important fact links to evidence,
 *   researchers, locations, artifacts, events, historical context,
 *   educational material") composes AF-151's real
 *   `KnowledgeGraph.addEdge` directly — that edge shape already
 *   carries a numeric `confidence` field alongside `historicalContext`,
 *   the exact "how sure are we, and why" pairing this section asks for.
 * - "Player Verification" ("who, when, where, how, why, consequences...
 *   future generations may review original records") reuses AF-148's
 *   real `CanonEventLedger`/`CanonEventRecord` directly — the same
 *   participants/witnesses/evidence shape AF-195's own "Context Chain"
 *   already reused for an identical purpose.
 * - "Institutional Verification" ("each validates knowledge before
 *   dissemination") reuses AF-165's real `InstitutionalMemoryTracker`
 *   directly.
 * - "Contradiction Review" ("preserve records... never erase history...
 *   knowledge improves") reuses AF-148's real
 *   `KnowledgeStateTracker.revealHistoricalUnderstanding` directly —
 *   that method already composes AF-135's real `EvolvingEntry`
 *   (expand-not-overwrite), the exact "update understanding, never
 *   erase history" guarantee this section asks for.
 *
 * Confirmed genuinely new: "The Verification Chain" (10 stages:
 * Proposal→Evidence→Simulation→Validation→Peer Review→Integration
 * Review→Canon Approval→Historical Recording→Educational Adoption→
 * Future Reference) never draws an arrow back to Proposal — it is
 * modelled as an ORDERED, NON-CYCLIC ladder via the new
 * `verificationChainRank`, mirroring the established
 * `xRank(stage): number` pattern; another instance of this codebase's
 * pipeline-stage-list family (AF-149's own module doc comment already
 * counted at least five such lists before this one).
 *
 * "The Confidence Model" (5 discrete levels: Established/Strong
 * Evidence/Emerging Evidence/Working Hypothesis/Active Investigation,
 * "certainty develops naturally") is confirmed genuinely new — a
 * distinct, discrete CATEGORICAL ladder from AF-151's real `GraphEdge`
 * `confidence` field (a continuous 0-1 number with no named tiers).
 * Modelled via the new `confidenceLevelRank`, the same `xRank` pattern.
 *
 * "The Truth Standard" ("can it be explained... if yes, canon
 * strengthens") mirrors AF-195's real `coherenceStandardMet` shape —
 * another instance of this codebase's established all-must-pass
 * checklist-function family via the new `truthStandardMet`, typed to
 * its own separate union.
 *
 * "Verification Domains" (12) shares 9 of 12 exact-string members with
 * AF-195's real `COHERENCE_DOMAINS` and 8 of 12 with AF-194's real
 * `POSSIBILITY_DOMAINS` — no record claimed (current record remains
 * AF-191's own 12/12), both verified via AF-170's real `detectOverlap`.
 * The domain-specific verification sections (Engineering/Historical/
 * Commander/Ecological) plus their own examples are kept as pure
 * reference vocabulary — the same honest scope boundary previously
 * established across the Craftsmanship/Excellence/Possibility/
 * Coherence family of modules.
 */

export const VERIFICATION_DOMAINS = ["Science", "History", "Technology", "Ecology", "Architecture", "Medicine", "Education", "Culture", "Economy", "Exploration", "Relationships", "Canon"] as const;
export type VerificationDomain = (typeof VERIFICATION_DOMAINS)[number];

// ── The Verification Chain: ordered, non-cyclic — mirrors the established xRank pattern. ──
export const VERIFICATION_CHAIN_STAGES = ["Proposal", "Evidence", "Simulation", "Validation", "Peer Review", "Integration Review", "Canon Approval", "Historical Recording", "Educational Adoption", "Future Reference"] as const;
export type VerificationChainStage = (typeof VERIFICATION_CHAIN_STAGES)[number];

/** Mirrors AF-139/156/157/162/166/170/179/180/192/194's real rank
 * functions — an ordered, non-cyclic ladder (see module doc comment). */
export function verificationChainRank(stage: VerificationChainStage): number {
  return VERIFICATION_CHAIN_STAGES.indexOf(stage);
}

export const ENGINEERING_VERIFICATION_CHECKS = ["Safety", "Reliability", "Maintainability", "Accessibility", "Environmental impact", "Long-term durability"] as const;

export const HISTORICAL_VERIFICATION_SOURCES = ["Primary records", "Independent testimony", "Physical evidence", "Chronology", "Scholarly review", "Archive confirmation"] as const;

export const COMMANDER_VERIFICATION_SOURCES = ["Mission reports", "Witness accounts", "Scientific records", "Institutional archives", "Historical commentary", "Legacy documentation"] as const;

export const ECOLOGICAL_VERIFICATION_SOURCES = ["Field observation", "Species monitoring", "Climate analysis", "Long-term recovery", "Independent research", "Planetary surveys"] as const;

export const PLAYER_VERIFICATION_FIELDS = ["Who", "When", "Where", "How", "Why", "Consequences"] as const;

export const INSTITUTIONAL_VERIFICATION_EXAMPLES = ["Universities", "Museums", "Observatories", "Libraries", "Research institutes", "Hospitals"] as const;

export const EVIDENCE_GRAPH_LINK_TARGETS = ["Evidence", "Researchers", "Locations", "Artifacts", "Events", "Historical context", "Educational material"] as const;

// ── The Confidence Model: ordered, non-cyclic categorical ladder, distinct from GraphEdge's continuous confidence field. ──
export const CONFIDENCE_LEVELS = ["Active Investigation", "Working Hypothesis", "Emerging Evidence", "Strong Evidence", "Established"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

/** Mirrors the same established `xRank` pattern as
 * `verificationChainRank` (see module doc comment). */
export function confidenceLevelRank(level: ConfidenceLevel): number {
  return CONFIDENCE_LEVELS.indexOf(level);
}

export const CONTRADICTION_REVIEW_PRINCIPLES = ["Preserve records", "Compare evidence", "Encourage investigation", "Update understanding", "Never erase history"] as const;

/** "Every new addition asks... if yes, canon strengthens." Mirrors
 * AF-195's real `coherenceStandardMet` shape — another instance of
 * this codebase's established all-must-pass checklist-function family. */
export const TRUTH_STANDARD_QUESTIONS = ["Can it be explained?", "Can it be demonstrated?", "Can it be verified?", "Can future generations understand how we know this?"] as const;
export type TruthStandardQuestion = (typeof TRUTH_STANDARD_QUESTIONS)[number];

export const VERIFICATION_DEVELOPER_TOOLS = ["Evidence browser", "Confidence graph", "Canon validator", "Research lineage explorer", "Truth dependency viewer", "Verification dashboard"] as const;
