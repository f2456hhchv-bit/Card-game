## Verbatim prompt

157

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-156 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Planning Engine.

The Planning Engine transforms individual decisions into coordinated long-term action.

Where the Atlas Decision Engine determines the best immediate choice...

The Planning Engine coordinates sequences of decisions across hours, days, years and generations.

It enables Commanders, colonies, expeditions and civilisation itself to execute meaningful long-term strategies.

==================================================
PURPOSE
==================================================

Create believable planning.

Not scripted quest chains.

Not fixed AI routines.

Not omniscient optimisation.

Plans emerge naturally from goals, knowledge, available resources and changing circumstances.

==================================================
PLANNING HORIZONS
==================================================

Immediate

Seconds

Combat

Navigation

Emergency response

----------------------------------------------

Short-Term

Hours

Expeditions

Construction

Research

Resource logistics

----------------------------------------------

Medium-Term

Weeks

Settlement expansion

Infrastructure

Education

Fleet deployment

Wildlife recovery

----------------------------------------------

Long-Term

Years

Megaprojects

Scientific breakthroughs

Commander development

Planet restoration

Economic growth

----------------------------------------------

Generational

Decades

Civilisation evolution

Interstellar expansion

Cultural development

Historic preservation

==================================================
PLAN COMPONENTS
==================================================

Every plan contains:

Objective

Motivation

Requirements

Resources

Participants

Dependencies

Estimated duration

Risk profile

Fallback strategies

Success criteria

Historical importance

==================================================
COMMANDER PLANNING
==================================================

Commanders plan:

Training programmes

Recruitment

Expeditions

Scientific priorities

Infrastructure support

Emergency contingencies

Mentorship

Personal development

==================================================
COLONY PLANNING
==================================================

Settlements create:

Housing plans

Education expansion

Healthcare investment

Industrial growth

Tourism

Ecological restoration

Transit improvements

Disaster preparedness

==================================================
SCIENTIFIC PLANNING
==================================================

Research organisations coordinate:

Technology roadmaps

Laboratory construction

Cross-disciplinary collaboration

Equipment procurement

Field expeditions

Knowledge publication

Museum contributions

==================================================
EXPLORATION PLANNING
==================================================

Expeditions prepare:

Destination analysis

Crew selection

Risk mitigation

Scientific equipment

Emergency extraction

Supply chains

Historical objectives

==================================================
ECONOMIC PLANNING
==================================================

Civilisation forecasts:

Supply chains

Infrastructure demand

Trade expansion

Manufacturing

Education investment

Healthcare capacity

Population growth

==================================================
ENVIRONMENTAL PLANNING
==================================================

Planetary restoration plans include:

Reforestation

River recovery

Wildlife corridors

Pollution reduction

Climate stabilisation

Protected habitats

Long-term monitoring

==================================================
ADAPTIVE PLANNING
==================================================

Plans evolve automatically.

Unexpected discoveries.

Natural disasters.

Commander injuries.

Scientific breakthroughs.

Political changes.

Resource shortages.

Plans adapt instead of failing.

==================================================
COLLABORATIVE PLANNING
==================================================

Multiple organisations contribute.

Examples:

Scientists

Engineers

Commanders

Teachers

Doctors

Government

Citizens

Shared plans produce stronger outcomes.

==================================================
PLAN NEGOTIATION
==================================================

Competing priorities resolve through:

Evidence

Resources

Historical urgency

Scientific value

Civilian benefit

Environmental impact

Player influence

==================================================
PLAN MEMORY
==================================================

Completed plans become:

Historical case studies

Museum exhibits

Commander lessons

Academic publications

Educational material

Future planning references

Civilisation learns.

==================================================
CONTINGENCY SYSTEM
==================================================

Every major plan includes:

Primary approach

Alternative route

Emergency recovery

Resource reserve

Personnel replacement

Scientific backup

No critical project relies upon one path.

==================================================
VISUALISATION
==================================================

Developer tools include:

Planning graph

Dependency viewer

Timeline forecast

Risk heatmap

Milestone tracker

Resource projection

Outcome simulator

==================================================
PLAYER EXPERIENCE
==================================================

Players should observe:

Colonies preparing.

Commanders organising.

Scientists coordinating.

Citizens contributing.

Everything appears purposeful.

Nothing feels improvised.

==================================================
ACCESSIBILITY
==================================================

Planning summaries.

Simplified roadmap.

Priority explanations.

Forecast viewer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Planning Engine.

Enable every intelligent entity to coordinate meaningful long-term action across the Living Galaxy while remaining adaptive, believable and historically grounded.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of civilisations.

Review long-term planning.

Review Commander coordination.

Review colony expansion.

Review scientific progress.

Review environmental restoration.

Review contingency behaviour.

Review accessibility.

Review performance.

Ensure plans consistently evolve instead of collapsing when circumstances change.

Ensure planning always reflects accumulated knowledge, available resources and the values defined by the Atlas Core.

Ensure AF-157 becomes the strategic planning layer that allows the Afterlight universe to build not just intelligent decisions, but intelligent futures across generations.

Repeat until long-term planning appears indistinguishable from the coordinated efforts of a living interstellar civilisation.

Only then lock AF-157.

## Foundation / AF-000–156 / GP-FINAL alignment review

Where AF-156 determines the best immediate choice, AF-157 coordinates sequences of those choices across hours, days, years and generations. "Collaborative Planning" ("multiple organisations contribute... shared plans produce stronger outcomes") is confirmed the THIRD instance of the identical mechanic in this codebase, after AF-155's own "Collaborative Intelligence" (`CollaborativeProblemLog`) and AF-156's "Group Decisions" (same class, formal-body granularity) — reused directly again here. "Plan Negotiation" ("competing priorities resolve through 7 factors") is the same weigh-factors-pick-best-know-the-rejected-alternatives mechanic as AF-156's real `explainDecision` (itself composing AF-155's real `rankOptions`) — reused directly, no third scoring formula.

"Planning Horizons" (Immediate/Short-Term/Medium-Term/Long-Term/Generational, each with concrete seconds→decades durations) looks at a glance like two existing ladders but is confirmed a genuinely different axis from both, verified by a dedicated test: AF-156's real `LONG_TERM_PLANNING_HORIZONS` (One mission/One expedition/One year/One decade/One generation) ranks by decision SCOPE, not a concrete time unit, and AF-153's real `SIMULATION_TIERS` (Immediate/Local Region/Planetary/Sector/Galactic) ranks SPATIAL simulation scope, not time at all — "Immediate" is the shared name across all three, but each names a different quantity. Kept as its own `PlanningTimeHorizon` union.

The six planning-domain sections (Commander/Colony/Scientific/Exploration/Economic/Environmental) each list concrete PLAN categories for that domain — a different axis again from AF-155's evaluation-criteria "reasoning factors" and AF-156's decision-slot "*_DECISION_KINDS" — kept as six new `*_PLAN_KINDS` reference-vocabulary unions.

Confirmed genuinely new: "Adaptive Planning" (`PlanAdaptationLog`, plans mutating in response to 6 named triggers), "Plan Memory" (`PlanMemoryArchive`, completed plans feeding 6 named outputs), and the Contingency System (`ContingencySet`/`hasContingencyCoverage`, a fixed set of 6 fallback slots checked structurally rather than scored numerically — "no critical project relies upon one path"). `PlanRegistry.dependenciesSatisfied` gives "Plan Components: Dependencies" real teeth, mirroring AF-150's real dependency-graph philosophy at the plan granularity rather than the module granularity — a dependency only resolves once the referenced plan is both registered AND marked complete.

The debug overlay gains a new `atlasPlanning` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-156 before it. Zero changes to AF-155's `CollaborativeProblemLog`, AF-156's `explainDecision`/`LONG_TERM_PLANNING_HORIZONS`, AF-153's `SIMULATION_TIERS`, AF-150's dependency-graph algorithm, or any other locked module.

Score: 9.5/10 — approved and locked.
