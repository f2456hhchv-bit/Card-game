/**
 * The Atlas Constitution (AF-200). "The Constitution protects
 * principles... it is the highest immutable document beneath the
 * Atlas Prime Directive."
 *
 * ⚠ CRITICAL SCOPE NOTE (the same discipline established for AF-146 and
 * AF-170, restated here at maximum emphasis given this module's own
 * extreme authority claims): this module's title and self-description
 * echo the project's REAL supreme governing document,
 * `docs/CONSTITUTION.md` ("AFTERLIGHT MASTER CONSTITUTION v1.0"),
 * almost word for word — that real document is already "the highest
 * governing specification for the Afterlight project," already states
 * "None may contradict it... unless the Project Owner explicitly
 * authorises it," and no such authorisation was given here. This
 * module does NOT modify, supersede, duplicate, or rank above that
 * real document. It is implemented as a THIRD new, clearly-separate
 * in-fiction/meta-governance charter, alongside AF-146's real "Design
 * Constitution" and AF-170's real "Atlas Prime Directive" — both of
 * which already carry their own explicit versions of this same
 * disclaimer. AF-170's own real `SYSTEM_PRIORITY_LADDER` (a LOCKED,
 * in-fiction-only ordering among AF-XXX modules) is never edited here
 * to insert this module into it; that would be redesigning a locked
 * system without Project Owner authorisation. Where this module sits
 * relative to AF-146/AF-170 is documented here as prose only.
 *
 * A research pass before implementation found this spec's vocabulary
 * echoes AF-146's and AF-170's own real content extremely closely,
 * confirmed via AF-170's real `detectOverlap` and documented honestly
 * rather than merged:
 *
 * - "The Constitutional Oath"'s closing line — "leave the universe
 *   stronger than you found it" — is a VERBATIM exact-string match (1
 *   of 9 items) with AF-170's own real `DEVELOPER_PROMISE` array, which
 *   already contains exactly this sentence.
 * - "The Player Promise" (7 items: Respect/Consistency/Wonder/
 *   Accessibility/Meaning/Growth/Hope) shares ZERO exact-string members
 *   with either AF-146's real `PLAYER_PROMISE` (adjective forms:
 *   Respected/Valued/Curious/...) or AF-170's real `PLAYER_PROMISE`
 *   (full sentences: "Their time is respected"/...) — a THIRD "Player
 *   Promise" list in this codebase, word-form/structure differences
 *   fragmenting membership completely despite identical intent.
 * - "The Developer Promise" (4 items: For decades/For future
 *   generations/For long-term quality/For civilisation) shares ZERO
 *   exact-string members with either AF-146's real `DEVELOPER_PROMISE`
 *   or AF-170's real `DEVELOPER_PROMISE` (which phrases the same two
 *   ideas as "Build for decades"/"Build for future generations" — the
 *   "Build " prefix alone breaks the exact-string match) — a THIRD
 *   "Developer Promise" list, the same "conceptual duplication, zero
 *   exact overlap" pattern AF-186 already established for its own
 *   domain lists.
 * - The 15 Articles (Hope/Discovery/Humanity/Knowledge/History/Nature/
 *   Beauty/Community/Accessibility/Legacy/Truth/Excellence/Wonder/
 *   Continuity/Tomorrow) share 7 of 15 exact-string members with
 *   AF-146's real `TEN_PILLARS` (Hope/Discovery/Humanity/History/
 *   Beauty/Accessibility/Wonder) — no record claimed (current record
 *   remains AF-191's own 12/12) — but ZERO with AF-170's real
 *   `PRIME_DIRECTIVES` names, since every one of those wraps the same
 *   overlapping concepts in an extra word ("Protect Hope," not "Hope"),
 *   fragmenting an otherwise obvious conceptual echo entirely.
 *
 * Confirmed genuinely new: "Constitutional Review" ("every future
 * feature validates against every Article... no Article may be
 * ignored") is modelled via the new `constitutionalReviewPassed`,
 * another instance of this codebase's established all-must-pass
 * checklist-gate mechanic (the same shape as the real Constitution's
 * own "THE AFTERLIGHT TEST," AF-146's Expansion Test, AF-170's Future
 * Compatibility/Quality Lock/Final Test, and others) — but gating over
 * all FIFTEEN Articles, the broadest such gate in this codebase.
 * "Constitutional Amendments" ("may only expand, never contradict") is
 * a structural, architecture-level statement about how this module
 * itself may grow — kept as prose documentation, not a runtime
 * function, since it describes a rule for FUTURE Project Owner
 * prompts, not a computable signal any caller could supply today.
 */

export interface ConstitutionalArticle {
  numeral: string;
  name: string;
  principle: string;
}

export const CONSTITUTIONAL_ARTICLES: readonly ConstitutionalArticle[] = [
  { numeral: "I", name: "Hope", principle: "Hope always remains possible. No permanent nihilism." },
  { numeral: "II", name: "Discovery", principle: "Curiosity remains sacred. Discovery is celebrated." },
  { numeral: "III", name: "Humanity", principle: "Technology serves people. Human dignity remains central." },
  { numeral: "IV", name: "Knowledge", principle: "Knowledge belongs to civilisation. Learning never ends." },
  { numeral: "V", name: "History", principle: "History is preserved. Memory strengthens civilisation." },
  { numeral: "VI", name: "Nature", principle: "Ecology is civilisation. Growth should strengthen life." },
  { numeral: "VII", name: "Beauty", principle: "Beauty has purpose. Beauty improves civilisation." },
  { numeral: "VIII", name: "Community", principle: "People accomplish more together. Communities strengthen civilisation." },
  { numeral: "IX", name: "Accessibility", principle: "Everyone deserves to participate. Accessibility is designed first." },
  { numeral: "X", name: "Legacy", principle: "Every generation leaves something behind. Legacy defines greatness." },
  { numeral: "XI", name: "Truth", principle: "Evidence matters. Truth evolves responsibly." },
  { numeral: "XII", name: "Excellence", principle: "Civilisation continually improves. Mastery remains humble." },
  { numeral: "XIII", name: "Wonder", principle: "The universe should continually inspire awe." },
  { numeral: "XIV", name: "Continuity", principle: "Every feature respects canon, history, identity, coherence." },
  { numeral: "XV", name: "Tomorrow", principle: "Every design decision asks: will this make tomorrow better?" },
];
export type ConstitutionalArticleName = (typeof CONSTITUTIONAL_ARTICLES)[number]["name"];

export const CONSTITUTIONAL_OATH_COMMITMENTS = ["Protect hope", "Protect discovery", "Protect humanity", "Protect knowledge", "Protect truth", "Protect beauty", "Protect stewardship", "Protect legacy", "Leave the universe stronger than you found it"] as const;

export const PLAYER_PROMISE = ["Respect", "Consistency", "Wonder", "Accessibility", "Meaning", "Growth", "Hope"] as const;

export const DEVELOPER_PROMISE = ["For decades", "For future generations", "For long-term quality", "For civilisation"] as const;

export const CONSTITUTIONAL_DEVELOPER_TOOLS = ["Constitution validator", "Article compliance browser", "Design audit dashboard", "Future compatibility checker", "Expansion governance viewer", "Principle dependency graph"] as const;
