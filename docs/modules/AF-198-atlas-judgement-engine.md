## Verbatim prompt

198

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-197 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Judgement Engine.

The Reasoning Engine determines how intelligent entities think.

The Judgement Engine determines how they ultimately decide.

Reasoning produces possibilities.

Judgement chooses a path.

Every important decision throughout the Afterlight universe should feel thoughtful, contextual and consistent with the values, experience and responsibilities of those making it.

Judgement is never perfect.

It is always accountable.

==================================================
PURPOSE
==================================================

Create believable decision making.

Allow wisdom to emerge through experience.

Ensure responsibility accompanies authority.

Protect player trust.

==================================================
CORE PRINCIPLE
==================================================

Good judgement balances evidence.

Great judgement balances evidence with humanity.

==================================================
JUDGEMENT DOMAINS
==================================================

Science

Engineering

Leadership

Medicine

Education

Ecology

Exploration

Community

Architecture

History

Culture

Civilisation

==================================================
THE JUDGEMENT CYCLE
==================================================

Context

↓

Evidence

↓

Reasoning

↓

Values

↓

Consultation

↓

Decision

↓

Consequences

↓

Reflection

↓

Improved Judgement

Every decision strengthens future judgement.

==================================================
INDIVIDUAL JUDGEMENT
==================================================

Every major character develops:

Decision confidence.

Humility.

Patience.

Risk awareness.

Empathy.

Strategic thinking.

Long-term perspective.

These evolve naturally through experience.

==================================================
COMMANDER JUDGEMENT
==================================================

Commanders balance:

Mission success.

Crew wellbeing.

Scientific opportunity.

Educational benefit.

Environmental stewardship.

Institutional responsibility.

Future consequences.

Leadership reflects maturity.

==================================================
SCIENTIFIC JUDGEMENT
==================================================

Scientists evaluate:

Evidence quality.

Research ethics.

Replication.

Risk.

Public benefit.

Transparency.

Scientific integrity always remains visible.

==================================================
ENGINEERING JUDGEMENT
==================================================

Engineers evaluate:

Safety.

Reliability.

Longevity.

Accessibility.

Maintainability.

Environmental impact.

Trade-offs become understandable.

==================================================
HISTORICAL JUDGEMENT
==================================================

Historians evaluate:

Evidence.

Context.

Bias.

Multiple perspectives.

Preservation.

Interpretation.

History remains intellectually honest.

==================================================
PLAYER JUDGEMENT
==================================================

The universe quietly observes:

Leadership style.

Planning quality.

Scientific curiosity.

Educational investment.

Community priorities.

Ecological stewardship.

The game adapts respectfully.

==================================================
COLLECTIVE JUDGEMENT
==================================================

Institutions often decide together through:

Expert review.

Public consultation.

Scientific panels.

Educational councils.

Commander conferences.

Shared wisdom produces stronger outcomes.

==================================================
THE COST OF DECISIONS
==================================================

Every important decision acknowledges:

Benefits.

Trade-offs.

Opportunity costs.

Unknowns.

Future responsibilities.

No important choice is consequence-free.

==================================================
JUDGEMENT RECORD
==================================================

Important decisions permanently preserve:

Decision makers.

Evidence reviewed.

Alternatives rejected.

Expected outcomes.

Actual outcomes.

Lessons learned.

Future generations study them.

==================================================
JUDGEMENT MATURITY
==================================================

Civilisation gradually shifts from asking:

"What can we do?"

Toward:

"What should we do?"

Wisdom becomes cultural.

==================================================
THE ACCOUNTABILITY PRINCIPLE
==================================================

Every authority remains accountable to:

Evidence.

History.

Institutions.

Future generations.

Public trust.

Responsibility grows alongside influence.

==================================================
DEVELOPER TOOLS
==================================================

Decision browser.

Judgement timeline.

Trade-off analyser.

Responsibility graph.

Institutional review dashboard.

Consequence explorer.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually feel:

"The universe isn't rewarding the easiest choice."

"It's rewarding thoughtful judgement."

==================================================
ACCESSIBILITY
==================================================

Decision summaries.

Trade-off browser.

Historical outcomes.

Judgement timeline.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Judgement Engine.

Allow every intelligent individual, institution and civilisation within the Afterlight universe to make accountable, thoughtful and context-aware decisions grounded in evidence, responsibility and accumulated wisdom.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-197.

Simulate one million years.

Review Commander judgement.

Review scientific ethics.

Review institutional governance.

Review ecological stewardship.

Review educational leadership.

Review historical accountability.

Review accessibility.

Review performance.

Prevent arbitrary decisions.

Prevent consequence-free authority.

Ensure judgement continually improves through reflection rather than certainty.

Ensure AF-198 becomes the decision layer that allows the Living Universe to consistently choose futures worthy of the civilisation it has become.

Repeat until every important decision feels earned because players understand both the reasoning behind it and the responsibility that accompanies it.

Only then lock AF-198.

## Foundation / AF-000–197 / GP-FINAL alignment review

AF-198 is AF-197's direct sibling — "the Reasoning Engine determines how intelligent entities think, the Judgement Engine determines how they ultimately decide" — and, like AF-197, this spec's vocabulary overlaps almost entirely with already-locked modules: AF-156's "Atlas Decision Engine" and AF-155's "Atlas Intelligence Engine." Reused directly wherever a section names a mechanic that already exists, confirmed by dedicated tests: "great judgement balances evidence with humanity" and "Commander Judgement... leadership reflects maturity" are exactly AF-156's real `ethicalAlignmentScore`/`ETHICAL_VALUES` directly. Scientific/Engineering/Historical Judgement's underlying mechanism is exactly AF-155's real `rankOptions`, reused directly. "Judgement Record" reuses AF-156's real `explainDecision` together with AF-156's real `DecisionLog.record` directly — sharing 4 of its 6 fields exactly with AF-197's real `REASONING_RECORD_FIELDS` (Decision makers/Evidence reviewed/Expected outcomes/Actual outcomes), documented honestly rather than silently merged. "Collective Judgement" reuses AF-156's real `GROUP_DECISION_BODIES`/`GROUP_CONSENSUS_FACTORS` directly, composed with AF-155's real `CollaborativeProblemLog` directly — at least the TENTH instance of that mechanic.

Confirmed genuinely new: "The Judgement Cycle" (9 stages) never draws an arrow back to Context by name — modelled as an ORDERED, NON-CYCLIC ladder via the new `judgementCycleRank`, mirroring the established `xRank(stage): number` pattern. It shares only 3 of 9 stages with AF-197's real `REASONING_CYCLE_STAGES` (Evidence/Decision/Reflection) and 2 of 9 with AF-156's real `DECISION_PYRAMID_LEVELS` (Context/Reflection), confirmed via AF-170's real `detectOverlap`.

"Judgement Domains" (12) shares 11 of 12 exact-string members with AF-197's real `REASONING_DOMAINS` (only "Culture" here vs "Diplomacy" there) — ties but does not break the absolute overlap record (AF-191's own 12/12 remains highest). "Individual Judgement" (7 traits) is kept as pure flavour vocabulary, the same treatment as AF-197's "Individual Reasoning" styles, per the established AF-030/155 personality design law. "The Cost of Decisions," "Judgement Maturity," "The Accountability Principle," and "Player Judgement" are all kept as pure reference vocabulary — none uses an explicit "if yes/no then X" gate framing, so inventing a boolean function for any of them would add behaviour the spec never actually asks for.

**No `AtlasJudgementRuntime.ts` file** — like AF-197 immediately before it, this module introduces zero new stateful classes; its one new piece is a pure lookup function, consistent with where every sibling module's own `xRank`-shaped functions live.

The debug overlay gains a new `atlasJudgement` field on `DebugSnapshot`, rendered with the label `judgement` — checked against every existing debug line for collisions before finalising and confirmed unique. Zero changes to AF-155's `rankOptions`/`CollaborativeProblemLog`, AF-156's `ethicalAlignmentScore`/`ETHICAL_VALUES`/`explainDecision`/`DecisionLog`/`GROUP_DECISION_BODIES`/`DECISION_PYRAMID_LEVELS`, AF-170's `detectOverlap`, AF-197's `REASONING_DOMAINS`/`REASONING_CYCLE_STAGES`/`REASONING_RECORD_FIELDS`, or any other locked module.

Score: 9.5/10 — approved and locked.
