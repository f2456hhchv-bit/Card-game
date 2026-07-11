## Verbatim prompt

197

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-196 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Reasoning Engine.

The Verification Engine establishes what is true.

The Reasoning Engine governs how every intelligent entity reaches conclusions from that truth.

Knowledge alone is not intelligence.

Reasoning is the ability to connect evidence, evaluate alternatives, understand consequences and continually refine understanding.

Every scientist.

Every Commander.

Every citizen.

Every institution.

Every AI.

Every civilisation.

Must reason differently according to experience, knowledge and personality.

==================================================
PURPOSE
==================================================

Create believable reasoning.

Allow intelligent decision-making.

Prevent scripted behaviour.

Ensure conclusions emerge logically.

==================================================
CORE PRINCIPLE
==================================================

Good reasoning follows evidence.

Great reasoning also questions itself.

==================================================
REASONING DOMAINS
==================================================

Science

Engineering

Leadership

Medicine

Education

History

Ecology

Exploration

Diplomacy

Architecture

Community

Civilisation

==================================================
THE REASONING CYCLE
==================================================

Observation

↓

Evidence

↓

Interpretation

↓

Alternative Explanations

↓

Evaluation

↓

Decision

↓

Reflection

↓

Learning

↓

Improved Reasoning

Reasoning continually matures.

==================================================
INDIVIDUAL REASONING
==================================================

Every intelligent character develops reasoning preferences.

Examples

Evidence-first.

Experimental.

Historical.

Pragmatic.

Creative.

Conservative.

Systems thinking.

Collaborative.

These influence—not dictate—behaviour.

==================================================
COMMANDER REASONING
==================================================

Commanders evaluate:

Mission objectives.

Crew wellbeing.

Scientific evidence.

Environmental impact.

Educational value.

Historical significance.

Long-term consequences.

Leadership becomes thoughtful.

==================================================
SCIENTIFIC REASONING
==================================================

Scientists evaluate:

Evidence quality.

Experimental design.

Replication.

Alternative hypotheses.

Unexpected observations.

Statistical confidence.

Scientific reasoning remains transparent.

==================================================
ENGINEERING REASONING
==================================================

Engineers balance:

Reliability.

Safety.

Efficiency.

Maintainability.

Accessibility.

Cost.

Longevity.

Trade-offs remain visible.

==================================================
HISTORICAL REASONING
==================================================

Historians compare:

Sources.

Biases.

Evidence.

Context.

Chronology.

Interpretation.

History remains intellectually honest.

==================================================
PLAYER REASONING
==================================================

The player naturally develops:

Planning habits.

Research priorities.

Leadership approaches.

Risk tolerance.

Educational philosophy.

Exploration style.

The universe adapts to reasoning patterns.

==================================================
COLLABORATIVE REASONING
==================================================

Groups often reach better conclusions through:

Discussion.

Peer review.

Debate.

Shared evidence.

Interdisciplinary expertise.

Civilisation reasons collectively.

==================================================
UNCERTAINTY
==================================================

Not every question has one answer.

Reasonable disagreement exists.

Civilisation remains comfortable with uncertainty.

Curiosity remains stronger than certainty.

==================================================
REASONING RECORD
==================================================

Important decisions preserve:

Evidence reviewed.

Alternatives considered.

Trade-offs.

Decision makers.

Expected outcomes.

Actual outcomes.

Future generations learn how decisions were made.

==================================================
META-REASONING
==================================================

Characters occasionally ask:

Was my reasoning sound?

What assumptions did I make?

What evidence did I overlook?

How can I improve?

Intelligence continually improves itself.

==================================================
THE REASONING STANDARD
==================================================

Every major conclusion asks:

What evidence supports this?

What evidence challenges this?

What assumptions exist?

What uncertainties remain?

What future information could change this?

==================================================
DEVELOPER TOOLS
==================================================

Reasoning graph.

Decision explorer.

Assumption inspector.

Evidence chain viewer.

Trade-off analyser.

Inference debugger.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually think:

"People in this universe don't simply know things."

"They genuinely think."

==================================================
ACCESSIBILITY
==================================================

Decision summaries.

Evidence explorer.

Reasoning timeline.

Alternative explanation viewer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Reasoning Engine.

Allow every intelligent entity within the Afterlight universe to form conclusions through transparent, believable and continually improving reasoning rather than scripted certainty.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-196.

Simulate one million years.

Review scientific reasoning.

Review Commander judgement.

Review educational thinking.

Review institutional decisions.

Review historical interpretation.

Review collaborative problem solving.

Review accessibility.

Review performance.

Prevent irrational behaviour without explanation.

Prevent perfect reasoning.

Preserve diversity of thought while maintaining scientific integrity.

Ensure AF-197 becomes the cognitive reasoning layer that allows the Living Universe to think as intelligently as it remembers, learns and evolves.

Repeat until every important decision feels understandable because players can follow the reasoning that produced it—even when they might have chosen differently.

Only then lock AF-197.

## Foundation / AF-000–196 / GP-FINAL alignment review

A research pass before implementation found this spec's vocabulary overlaps almost entirely with AF-155's already-locked "Atlas Intelligence Engine" (`atlasIntelligence/`, literally the codebase's existing reasoning layer) and AF-156's already-locked "Atlas Decision Engine" (`atlasDecision/`, which decides what an entity does with that reasoning). Reused directly wherever a section names a mechanic either already built, confirmed by dedicated tests: "Uncertainty" is exactly AF-155's real `suggestUncertaintyResponse` directly. "Collaborative Reasoning" reuses AF-155's real `CollaborativeProblemLog` directly — at least the NINTH instance of this mechanic in this codebase. "Reasoning Record" reuses AF-156's real `explainDecision` together with AF-156's real `DecisionLog.record` directly. Commander/Scientific/Engineering/Historical Reasoning's underlying MECHANISM (weigh named factors, pick the best, know the confidence) is exactly AF-155's real `rankOptions`, reused directly for every one of these sections rather than four near-identical scoring functions.

Structural note resolving the module's biggest apparent overlap, mirroring AF-156's own precedent exactly: this spec's four domain-specific "Reasoning" sections name their own factor vocabulary, but despite describing the conceptually identical mechanic as AF-155's own six "Reasoning Factors" lists, they share ZERO exact-string members with either AF-155's real `COMMANDER_REASONING_FACTORS` or `SCIENTIFIC_REASONING_FACTORS` — confirmed via AF-170's real `detectOverlap`. Kept as four new reference lists (feeding the same shared `rankOptions` mechanism) rather than merged into AF-155's own unions.

"Individual Reasoning" (8 style preferences) is a THIRD distinct axis from both AF-155's evaluation-criteria factor lists and AF-156's decision-slot `*_DECISION_KINDS` lists — a reasoning STYLE preference. Per AF-030/155's established design law, these styles remain pure flavour vocabulary — no new tracker assigns or weights them.

Confirmed genuinely new: "The Reasoning Cycle" (9 stages) never draws an arrow back to Observation by name — modelled as an ORDERED, NON-CYCLIC ladder via the new `reasoningCycleRank`, mirroring the established `xRank(stage): number` pattern. It shares only 2 of 9 stages with AF-155's real `INTELLIGENCE_LAYERS` (Observation/Reflection), 2 of 9 with AF-156's real `DECISION_PYRAMID_LEVELS` (Evaluation/Reflection), and ZERO with AF-155's own `LEARNING_LOOP_STAGES` (word-form differences), confirmed via `detectOverlap`.

"Reasoning Domains" (12) shares 7 of 12 exact-string members with AF-196's real `VERIFICATION_DOMAINS` and 6 of 12 with AF-195's real `COHERENCE_DOMAINS` — no record claimed. "Meta-Reasoning" and "The Reasoning Standard" are both kept as pure reflective reference checklists, NOT gate functions — unlike AF-195/196's own "Coherence/Truth Standard" sections, neither spec text here uses an explicit "if yes/no then X" framing, so inventing a boolean gate for either would add behaviour the spec never actually asks for. "Player Reasoning" is kept as pure reference for the same reason "Player Coherence" was in AF-195.

**This module has no `AtlasReasoningRuntime.ts` file** — the first in the entire Afterlight session to consist solely of a data file. It introduces zero new stateful classes and its one new piece (`reasoningCycleRank`) is a pure lookup function, consistent with where every prior sibling module's own `xRank`-shaped functions live (in their data files, not runtime files). Adding an empty or padding Runtime.ts purely for consistency would violate "don't add abstractions beyond what the task requires."

The debug overlay gains a new `atlasReasoning` field on `DebugSnapshot`, rendered with the label `reasoning` — checked against every existing debug line for collisions before finalising and confirmed unique. Zero changes to AF-155's `rankOptions`/`suggestUncertaintyResponse`/`CollaborativeProblemLog`/`INTELLIGENCE_LAYERS`/`LEARNING_LOOP_STAGES`, AF-156's `explainDecision`/`DecisionLog`/`DECISION_PYRAMID_LEVELS`, AF-170's `detectOverlap`, AF-195's `COHERENCE_DOMAINS`, AF-196's `VERIFICATION_DOMAINS`, or any other locked module.

Score: 9.5/10 — approved and locked.
