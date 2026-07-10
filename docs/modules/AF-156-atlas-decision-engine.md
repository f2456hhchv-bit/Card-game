## Verbatim prompt

156

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-155 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Decision Engine.

The Decision Engine transforms reasoning into action.

Where the Atlas Intelligence Engine determines what an entity understands...

The Decision Engine determines what it actually chooses to do.

Every meaningful decision throughout the Afterlight universe flows through this engine.

==================================================
PURPOSE
==================================================

Create believable decision making.

Not random behaviour.

Not scripted behaviour.

Not perfect behaviour.

Every decision should emerge logically from:

Knowledge.

Goals.

Values.

Relationships.

Resources.

Risk.

Hope.

==================================================
DECISION PYRAMID
==================================================

Level I

Need

What problem exists?

--------------------------------------------------

Level II

Context

What is happening?

--------------------------------------------------

Level III

Knowledge

What is known?

--------------------------------------------------

Level IV

Possibilities

What options exist?

--------------------------------------------------

Level V

Evaluation

What are likely outcomes?

--------------------------------------------------

Level VI

Choice

Select an action.

--------------------------------------------------

Level VII

Reflection

Was it successful?

==================================================
DECISION FACTORS
==================================================

Every decision considers:

History

Personality

Current objectives

Commander Bonds

Planet condition

Available resources

Scientific knowledge

Player reputation

Risk tolerance

Civilisation values

==================================================
COMMANDER DECISIONS
==================================================

Commanders choose:

Mission priorities.

Research interests.

Training focus.

Leadership style.

Diplomatic responses.

Risk appetite.

Emergency actions.

Mentoring opportunities.

Every Commander behaves differently.

==================================================
CITIZEN DECISIONS
==================================================

Citizens decide:

Education.

Career.

Relocation.

Volunteering.

Family.

Travel.

Research.

Community projects.

Festival attendance.

==================================================
COLONY DECISIONS
==================================================

Settlements determine:

Expansion.

Construction.

Infrastructure.

Healthcare.

Education.

Trade.

Research.

Tourism.

Environmental restoration.

==================================================
RESEARCH DECISIONS
==================================================

Scientists evaluate:

Research value.

Historic importance.

Resource cost.

Collaboration opportunities.

Knowledge gaps.

Safety.

Future applications.

==================================================
EXPLORATION DECISIONS
==================================================

Expeditions choose:

Destination.

Route.

Team.

Equipment.

Scientific priorities.

Emergency contingencies.

Recovery plans.

==================================================
WILDLIFE DECISIONS
==================================================

Species evaluate:

Migration.

Breeding.

Shelter.

Food.

Threat avoidance.

Social grouping.

Territory.

Adaptation.

==================================================
SOCIAL DECISIONS
==================================================

Relationships influence:

Trust.

Forgiveness.

Mentorship.

Collaboration.

Celebrations.

Conflict resolution.

Gift giving.

Shared projects.

==================================================
UNCERTAINTY
==================================================

Every decision includes:

Confidence.

Known unknowns.

Estimated risk.

Potential reward.

Incomplete information.

Entities accept uncertainty naturally.

==================================================
ETHICAL FRAMEWORK
==================================================

Civilisation prioritises:

Preservation.

Education.

Compassion.

Scientific integrity.

Environmental stewardship.

Long-term prosperity.

Different factions may weigh values differently.

==================================================
PLAYER INFLUENCE
==================================================

The player influences decisions through:

Leadership.

Reputation.

Relationships.

Infrastructure.

Education.

Scientific progress.

Diplomacy.

Never absolute control.

==================================================
GROUP DECISIONS
==================================================

Groups reach consensus through:

Expertise.

Trust.

Evidence.

Urgency.

Historical precedent.

Shared objectives.

Examples:

Commander Council.

Scientific Congress.

Planetary Government.

Expedition Planning.

==================================================
LONG-TERM PLANNING
==================================================

Major decisions consider:

One mission.

One expedition.

One year.

One decade.

One generation.

Civilisation thinks beyond immediate rewards.

==================================================
DECISION EXPLANATIONS
==================================================

Developer tools expose:

Decision tree.

Evidence.

Confidence.

Rejected alternatives.

Historical influences.

Predicted outcomes.

==================================================
PLAYER EXPERIENCE
==================================================

Players should think:

"That makes perfect sense."

Not:

"The AI cheated."

Or:

"That happened randomly."

==================================================
ACCESSIBILITY
==================================================

Decision summaries.

Reasoning explanations.

Difficulty scaling.

Reduced simulation mode.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Decision Engine.

Every intelligent entity should transform accumulated knowledge into believable, explainable and human decisions.

==================================================
SELF REVIEW LOOP
==================================================

Simulate billions of decisions.

Review Commander choices.

Review citizen behaviour.

Review colony development.

Review scientific priorities.

Review expedition planning.

Review wildlife adaptation.

Review ethical consistency.

Review accessibility.

Review performance.

Eliminate irrational behaviour.

Eliminate repetitive choices.

Ensure decisions remain understandable without becoming predictable.

Ensure AF-156 becomes the universal decision-making layer allowing the Afterlight universe to feel thoughtful, adaptive and authentically alive across centuries of simulated civilisation.

Repeat until every important decision appears to emerge naturally from accumulated history, knowledge and values rather than predefined scripts.

Only then lock AF-156.

## Foundation / AF-000–155 / GP-FINAL alignment review

Where AF-155 determines what an entity understands, AF-156 determines what it actually chooses to do. Four sections turned out to be exactly AF-155's real mechanics: Decision Pyramid Levels III–VI (Knowledge/Possibilities/Evaluation/Choice) are exactly AF-155's real `rankOptions`, composed directly by `explainDecision` rather than re-scoring anything; "Uncertainty" is exactly AF-155's real Uncertainty Model, with `suggestUncertaintyResponse` reused directly at the call site; the Decision Pyramid's own 7-level progression is driven by AF-155's real generic `CyclicStageTracker<TStage>` directly, no new stage-tracker class; "Group Decisions" is confirmed the same mechanic as AF-155's real "Collaborative Intelligence" (`CollaborativeProblemLog`) at a formal-body granularity, reused directly rather than a second consensus log.

The module's biggest apparent overlap — AF-155's six "reasoning" factor lists vs. this module's seven "Decisions" sections — is resolved by a structural distinction: AF-155's lists are EVALUATION CRITERIA that feed a score; this module's `*_DECISION_KINDS` unions are the DECISION SLOTS themselves (the actual choices being made — "Destination", "Route", "Team" — not evaluation criteria at all). Confirmed by direct comparison: `EXPLORATION_DECISION_KINDS` shares zero members with AF-155's real `EXPLORATION_REASONING_FACTORS`, verified by a dedicated test. Kept as seven new reference-vocabulary unions for tagging `DecisionLog` entries, never merged with AF-155's factor lists.

"Decision Factors" lists "Personality" as a top-level input; per AF-030/AF-155's established design law (`PersonalityTrait` is "dialogue-only by shape... structurally unrepresentable" as a stat weight), Personality here may only explain or flavour a decision `rankOptions` already reached by other numeric factors, never add its own weight — confirmed by a dedicated test that no code path feeds `PersonalityTrait` into a numeric score.

Confirmed genuinely new: `ethicalAlignmentScore` lets different factions weigh the same 6 Ethical Framework values differently, a decoupled composer over plain priority maps; `cappedPlayerInfluence` enforces "never absolute control" with a hard 0.5 ceiling regardless of the raw signal; `planningHorizonRank` orders the 5 Long-term Planning horizons (mirroring AF-148/154's real indexOf-rank pattern); `DecisionLog.isRepetitive` satisfies the self-review's "eliminate repetitive choices" directive by generalising AF-153/154's real "same value across the whole window" stall/imbalance check across any decision domain, rather than one hand-typed category union.

The debug overlay gains a new `atlasDecision` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-155 before it. Zero changes to AF-155's `rankOptions`/`suggestUncertaintyResponse`/`CyclicStageTracker`/`CollaborativeProblemLog`, AF-153's `EmotionalPacingTracker`, AF-154's `PacingCycleTracker`, AF-030's `PersonalityTrait`, AF-148's `canonPyramidRank`, or any other locked module.

Score: 9.5/10 — approved and locked.
