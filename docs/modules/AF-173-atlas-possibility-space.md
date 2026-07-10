## Verbatim prompt

173

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-172 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Possibility Space.

The Possibility Space is the conceptual frontier of the Afterlight universe.

The Imagination Engine imagines ideas.

The Possibility Space evaluates which imagined futures are realistically achievable.

It continuously explores billions of potential futures, innovations and civilisational pathways without committing the universe to any one outcome.

It is humanity's laboratory of tomorrow.

==================================================
PURPOSE
==================================================

Allow civilisation to safely explore possibility before committing reality.

Encourage experimentation.

Reduce stagnation.

Increase believable innovation.

Protect long-term stability.

==================================================
CORE PRINCIPLE
==================================================

Every future begins as a possibility.

Not every possibility deserves to become reality.

Civilisation advances by exploring options before making commitments.

==================================================
POSSIBILITY CATEGORIES
==================================================

Scientific

Engineering

Medical

Architectural

Educational

Ecological

Social

Economic

Political

Exploratory

Cultural

Civilisational

==================================================
SIMULATION SANDBOX
==================================================

The Possibility Space evaluates:

Future technologies.

Planetary development.

Infrastructure.

Educational systems.

Species recovery.

Trade routes.

Exploration strategies.

Governance.

No real-world consequences occur until decisions are made.

==================================================
COMMANDER THINKING
==================================================

Commanders privately consider:

Alternative tactics.

Safer expeditions.

Scientific theories.

Leadership approaches.

Teaching methods.

Emergency responses.

Creative solutions.

These possibilities influence later decisions.

==================================================
SCIENTIFIC POSSIBILITY
==================================================

Scientists simulate:

Experiments.

Material combinations.

Medical treatments.

Environmental restoration.

Energy production.

Space exploration.

Only evidence-supported possibilities progress.

==================================================
ENGINEERING POSSIBILITY
==================================================

Engineers explore:

Prototype structures.

Habitat layouts.

Transit systems.

Power grids.

Construction methods.

Manufacturing improvements.

Many ideas remain conceptual.

==================================================
CIVILISATION POSSIBILITY
==================================================

Governments evaluate:

Urban expansion.

Educational reform.

Healthcare improvements.

Environmental policies.

Scientific priorities.

Economic investment.

Multiple futures remain open.

==================================================
PLAYER POSSIBILITY
==================================================

The game quietly recognises:

Unfinished ideas.

Interesting construction patterns.

Museum themes.

Exploration habits.

Commander combinations.

Potential discoveries.

The universe subtly supports experimentation.

==================================================
MULTIPLE FUTURES
==================================================

Every major decision generates:

Likely future.

Optimistic future.

Conservative future.

Unexpected future.

Unknown future.

No branch becomes inevitable.

==================================================
SAFE EXPERIMENTATION
==================================================

Universities.

Research labs.

Engineering academies.

Simulation facilities.

Training worlds.

Virtual expeditions.

Allow bold ideas without unnecessary risk.

==================================================
FAILED POSSIBILITIES
==================================================

Rejected ideas remain valuable.

They become:

Academic papers.

Museum exhibits.

Teaching material.

Historical lessons.

Future inspiration.

Failure becomes knowledge.

==================================================
POSSIBILITY NETWORK
==================================================

Every possibility links to:

Required discoveries.

Required people.

Required resources.

Potential risks.

Potential benefits.

Historical context.

Future opportunities.

==================================================
INNOVATION FILTER
==================================================

Every possibility evaluates:

Scientific plausibility.

Engineering feasibility.

Ethical responsibility.

Environmental sustainability.

Historical consistency.

Civilisational benefit.

==================================================
DEVELOPER TOOLS
==================================================

Possibility explorer.

Scenario simulator.

Future branch viewer.

Innovation dependency graph.

Feasibility analyser.

Opportunity dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should often think:

"Maybe one day we'll be able to do that."

Then, dozens of hours later...

Humanity actually can.

==================================================
ACCESSIBILITY
==================================================

Future scenarios.

Opportunity summaries.

Innovation roadmap.

Concept browser.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Possibility Space.

Allow civilisation to intelligently explore countless believable futures before transforming the best possibilities into reality.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of possible futures.

Review scientific plausibility.

Review engineering realism.

Review Commander creativity.

Review educational value.

Review civilisational outcomes.

Review accessibility.

Review performance.

Ensure possibilities continuously generate meaningful long-term goals without overwhelming players.

Ensure every realised innovation first existed as a believable possibility grounded in knowledge, imagination and collaboration.

Ensure AF-173 becomes the conceptual frontier of the Afterlight universe, where tomorrow is continuously explored long before it is built.

Repeat until every new generation inherits not only the achievements of the past—but a universe filled with exciting possibilities for the future.

Only then lock AF-173.

## Foundation / AF-000–172 / GP-FINAL alignment review

Sits directly above AF-172's Imagination Engine: imagination invents ideas, the Possibility Space evaluates which of those imagined futures are realistically achievable, without ever committing the universe to one outcome. Note on naming: AF-159's already-locked module occupies the literal directory name `atlasPossibility` (its own "Atlas Possibility Engine," a different, earlier module about serendipity/mysteries/opportunity), so this module's code lives under the distinct `src/game/atlasPossibilitySpace/` directory to avoid any collision — no existing AF-159 file was touched.

This module leans almost entirely on direct reuse of AF-159's real classes it turns out already model most of its own vocabulary field-for-field, confirmed by dedicated tests: "Possibility Network" ("every possibility links to required discoveries/people/resources, potential risks/benefits, historical context, future opportunities") is exactly AF-159's real `Possibility` interface/`PossibilityRegistry`, reused directly rather than authoring a second network-of-links registry. "Multiple Futures" ("Likely/Optimistic/Conservative/Unexpected/Unknown future... no branch becomes inevitable") is mechanically identical to AF-158's real `FUTURE_STATE_KINDS`/`FutureStateForecast`/`mostLikelyFutureState` — the wording differs but the shape (five parallel, never-committed branch confidences per decision) does not, reused directly with no second five-branch forecaster. "Scientific Possibility"'s "only evidence-supported possibilities progress" is exactly AF-172's real `HypothesisTracker`, reused directly. "Failed Possibilities" ("rejected ideas remain valuable... failure becomes knowledge") is the identical "completed [or rejected] work becomes a named output" shape AF-159's real `InnovationMemoryArchive` already implements, reused directly rather than mirroring a fourth near-duplicate archive.

"Possibility Categories" (12) is confirmed to tie (not break) the codebase's 8/12 absolute-count overlap record: EIGHT of its 12 members are exact-string matches with AF-159's real `DISCOVERY_CATEGORIES`, verified using AF-170's real `detectOverlap` function. Kept as its own separate reference vocabulary regardless, since it tags the domain of a sandboxed, not-yet-committed possibility, a distinct question from AF-159's "which discipline discovered this" tag.

"Simulation Sandbox" and its governing guarantee — "no real-world consequences occur until decisions are made" — are confirmed genuinely new. `SandboxScenarioRegistry` is a proposal registry with an explicit proposed/committed state, confirmed by a dedicated test to stay uncommitted until an explicit later action, structurally the commitment-gate counterpart to AF-172's real evidence-gate `HypothesisTracker` but answering a different question (has civilisation chosen to act on this, not whether the idea is scientifically grounded). "Innovation Filter" (6 criteria) mirrors the SHAPE of AF-143's real `DesignScoreCard`/AF-149's real `AtlasScoreCard`/AF-170's real `PrimeDirectiveScoreCard` — the FOURTH mirrored scoring rubric in this codebase, typed to its own union, reusing the same 9.5 gate threshold each of those three real rubrics already settled on, confirmed by a dedicated test.

The debug overlay gains a new `atlasPossibilitySpace` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-172 before it. Zero changes to AF-159's `Possibility`/`PossibilityRegistry`/`InnovationMemoryArchive`/`DISCOVERY_CATEGORIES`, AF-158's `FUTURE_STATE_KINDS`/`FutureStateForecast`/`mostLikelyFutureState`, AF-172's `HypothesisTracker`, AF-170's `detectOverlap`, AF-143/149's scoring-rubric classes, or any other locked module.

Score: 9.5/10 — approved and locked.
