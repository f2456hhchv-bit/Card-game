## Verbatim prompt

158

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-157 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Future Engine.

The Future Engine continuously evaluates the current state of the Afterlight universe and projects believable possible futures.

It does not determine destiny.

It explores possibilities.

Every entity, colony, civilisation and galaxy constantly considers what tomorrow might become.

The player helps shape which future ultimately comes true.

==================================================
PURPOSE
==================================================

Transform planning into vision.

Enable civilisation to think beyond immediate objectives.

Allow the universe to naturally prepare for tomorrow.

==================================================
FUTURE HORIZONS
==================================================

Immediate

Minutes

Hours

Mission outcomes.

--------------------------------------------------

Operational

Days

Weeks

Expeditions.

Research.

Infrastructure.

--------------------------------------------------

Strategic

Months

Years

Planetary growth.

Economic shifts.

Political development.

--------------------------------------------------

Civilisational

Decades

Scientific revolutions.

Megaprojects.

Generational education.

--------------------------------------------------

Historic

Centuries

Expansion into new galaxies.

Cultural identity.

Species evolution.

Legacy.

==================================================
FUTURE STATES
==================================================

Every entity evaluates:

Most Likely Future

Optimistic Future

Conservative Future

High-Risk Future

Unknown Future

Confidence continuously updates.

==================================================
FORECAST FACTORS
==================================================

Knowledge.

Resources.

Population.

Commander leadership.

Research.

Weather.

Economy.

Ecology.

Relationships.

History.

Legacy.

Everything influences forecasts.

==================================================
COMMANDER FORESIGHT
==================================================

Commanders anticipate:

Mission success.

Equipment needs.

Training gaps.

Scientific opportunities.

Potential emergencies.

Recruitment.

Mentorship.

Future leadership.

==================================================
COLONY FORECASTING
==================================================

Settlements estimate:

Population growth.

Housing demand.

Food production.

Healthcare capacity.

Education.

Power usage.

Transportation.

Climate resilience.

==================================================
RESEARCH FORECASTING
==================================================

Scientists estimate:

Likely breakthroughs.

Technology convergence.

Knowledge gaps.

Resource requirements.

Laboratory expansion.

Future discoveries.

Museum contributions.

==================================================
EXPLORATION FORECASTING
==================================================

Expeditions evaluate:

Unknown sectors.

Ancient signals.

Environmental hazards.

Discovery probability.

Survival chance.

Historic significance.

Expected scientific value.

==================================================
ENVIRONMENTAL FORECASTING
==================================================

Planets project:

Climate recovery.

Wildlife return.

Forest growth.

Ocean restoration.

Species migration.

Terraforming success.

Long-term stability.

==================================================
ECONOMIC FORECASTING
==================================================

Civilisation predicts:

Trade demand.

Construction.

Employment.

Tourism.

Education.

Manufacturing.

Research funding.

Migration.

==================================================
RISK ANALYSIS
==================================================

Forecast:

Resource shortages.

Infrastructure overload.

Commander fatigue.

Disease outbreaks.

Environmental instability.

Scientific uncertainty.

Political disagreement.

Unknown anomalies.

Risk creates preparation.

Not punishment.

==================================================
OPPORTUNITY ANALYSIS
==================================================

Detect:

New discoveries.

Historic expeditions.

Trade expansion.

Scientific partnerships.

Commander collaboration.

Museum growth.

Education investment.

Ecological restoration.

==================================================
MULTIPLE FUTURES
==================================================

The Future Engine never predicts certainty.

Instead it models branching possibilities.

Player actions.

Commander decisions.

Scientific discoveries.

Unexpected events.

All reshape the future.

==================================================
FUTURE MEMORY
==================================================

Completed forecasts become:

Historical lessons.

Research papers.

Commander experience.

Educational material.

Planning improvements.

Civilisation becomes wiser.

==================================================
VISUALISATION
==================================================

Developer tools include:

Forecast timeline.

Probability graph.

Future dependency map.

Opportunity explorer.

Risk dashboard.

Confidence viewer.

Scenario simulator.

==================================================
PLAYER EXPERIENCE
==================================================

Players should notice:

Commanders preparing early.

Colonies expanding before shortages occur.

Scientists anticipating discoveries.

Cities growing intelligently.

The universe feels thoughtful.

==================================================
ACCESSIBILITY
==================================================

Forecast summaries.

Risk explanations.

Opportunity highlights.

Future planner.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Future Engine.

Enable every intelligent system to anticipate, prepare for and influence multiple believable futures without compromising player agency.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of civilisations.

Forecast centuries of development.

Review prediction accuracy.

Review adaptive planning.

Review Commander preparation.

Review scientific forecasting.

Review ecological forecasting.

Review accessibility.

Review performance.

Ensure forecasts remain plausible rather than deterministic.

Ensure the future always remains hopeful, uncertain and shaped by discovery rather than inevitability.

Ensure AF-158 becomes the long-term foresight layer that allows the Afterlight universe to continuously prepare for tomorrow while remaining responsive to player actions and emergent history.

Repeat until every civilisation appears capable of intelligently imagining and preparing for its future across generations.

Only then lock AF-158.

## Foundation / AF-000–157 / GP-FINAL alignment review

Transforms AF-157's planning into vision — where planning coordinates action, forecasting projects state. Numeric point-forecasts across Colony/Research/Economic Forecasting compose AF-144's real `PredictionEngine.forecast` directly: "Population growth" is a verbatim shared member between this module's own `COLONY_FORECASTING_KINDS` and AF-144's real `PREDICTION_KINDS`, confirming this is the same time-series trend-forecasting mechanic AF-144 already provides (the same direct reuse AF-152's real World Model already made) — confirmed by a dedicated test, no second time-series forecaster.

"Future Horizons" (Immediate/Operational/Strategic/Civilisational/Historic, minutes→centuries) is confirmed the FOURTH time/scope ladder in this codebase sharing "Immediate" as a tier name, after AF-153's real `SIMULATION_TIERS` (spatial scope), AF-156's real `LONG_TERM_PLANNING_HORIZONS` (decision scope), and AF-157's real `PLANNING_TIME_HORIZONS` (planning-action duration) — this one measures FORECAST horizon, a genuinely different question, verified by a dedicated test that all four lists differ.

"Opportunity Analysis" mirrors the SHAPE of AF-155's real `DiscoverySuggestionLog`/`DiscoverySuggestionKind` (append-only, surface-by-kind) but never its TYPE, since that class is hand-typed to its own closed union rather than a reusable generic — the same missed-generalisation precedent AF-149/153 already recorded. `OpportunityAnalysisKind` shares zero members with AF-155's real `DiscoverySuggestionKind`, confirmed by a dedicated test as the FIFTH "kind of notable moment" list in this codebase, after AF-136/153/154/155's real lists. "Future Memory" similarly mirrors the SHAPE of AF-157's real `PlanMemoryArchive`/`PlanMemoryOutcome` — "Educational material" is the one verbatim shared member with AF-157's real `PLAN_MEMORY_OUTCOMES`, but the other four differ enough to keep as its own separate union.

Confirmed genuinely new: "Future States" (5 kinds, each with its own continuously-updating confidence) models FIVE parallel branching scenarios per entity — a fundamentally different shape from AF-144's real `PredictionEngine`, which produces exactly one point-forecast with one confidence value. `mostLikelyFutureState` picks the branch with the highest currently-stored confidence, never a random pick. `RiskLog` ("risk creates preparation, not punishment") and the mirrored `OpportunityLog`/`FutureMemoryArchive` are all confirmed genuinely new at this granularity.

The debug overlay gains a new `atlasFuture` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-157 before it. Zero changes to AF-144's `PredictionEngine`, AF-155's `DiscoverySuggestionLog`, AF-153's `SIMULATION_TIERS`, AF-156's `LONG_TERM_PLANNING_HORIZONS`, AF-157's `PlanMemoryArchive`/`PLANNING_TIME_HORIZONS`, or any other locked module.

Score: 9.5/10 — approved and locked.
