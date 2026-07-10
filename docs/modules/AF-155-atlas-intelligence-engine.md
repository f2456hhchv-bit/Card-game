## Verbatim prompt

155

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-154 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Intelligence Engine.

Unlike previous simulation systems, the Atlas Intelligence Engine is responsible for transforming information into understanding.

The universe should no longer merely react.

It should reason.

The Intelligence Engine allows Commanders, colonies, expeditions and civilisation itself to make believable long-term decisions based upon knowledge accumulated across the Afterlight universe.

==================================================
PURPOSE
==================================================

Every intelligent system should ask:

What do I know?

What has changed?

What should I do next?

Knowledge drives action.

Not scripts.

==================================================
INTELLIGENCE LAYERS
==================================================

Layer I

Observation

Collect facts.

Layer II

Understanding

Recognise patterns.

Layer III

Prediction

Estimate likely outcomes.

Layer IV

Planning

Generate possible actions.

Layer V

Execution

Select best option.

Layer VI

Reflection

Learn from results.

==================================================
KNOWLEDGE SOURCES
==================================================

The Intelligence Engine receives information from:

Living Galaxy

Chronicle

Museum

Legacy Engine

Knowledge Graph

World Model

Simulation Director

Commander Bonds

Economy

Research

Weather

Events

Exploration

Everything contributes.

==================================================
COMMANDER REASONING
==================================================

Commanders consider:

Mission history.

Past failures.

Trusted allies.

Current resources.

Planet conditions.

Civilian risk.

Scientific opportunities.

Relationship strength.

Each Commander reasons according to personality.

==================================================
COLONY REASONING
==================================================

Settlements evaluate:

Housing.

Education.

Healthcare.

Trade.

Security.

Population growth.

Ecology.

Infrastructure.

Future investment.

Colonies develop priorities naturally.

==================================================
SCIENTIFIC REASONING
==================================================

Researchers identify:

Knowledge gaps.

Unexplored anomalies.

Useful experiments.

Technology dependencies.

Historical evidence.

Unexpected discoveries.

Research becomes opportunity-driven.

==================================================
EXPLORATION REASONING
==================================================

Expeditions analyse:

Risk.

Potential reward.

Historic importance.

Weather.

Wildlife.

Resources.

Scientific value.

Strategic value.

No expedition feels arbitrary.

==================================================
SOCIAL REASONING
==================================================

NPCs evaluate:

Trust.

Friendship.

Community.

Shared history.

Promises.

Leadership.

Reputation.

Citizens behave consistently.

==================================================
STRATEGIC REASONING
==================================================

Civilisation evaluates:

Expansion.

Preservation.

Research.

Education.

Trade.

Infrastructure.

Environmental restoration.

Future generations.

==================================================
MEMORY INTEGRATION
==================================================

Reasoning incorporates:

Recent events.

Historic events.

Personal memories.

Shared memories.

Museum records.

Chronicle entries.

Knowledge accumulates.

==================================================
LEARNING LOOP
==================================================

Observe

↓

Interpret

↓

Plan

↓

Act

↓

Review

↓

Improve

Every intelligent entity continuously refines behaviour.

==================================================
UNCERTAINTY MODEL
==================================================

Not every decision has complete information.

Entities estimate confidence.

Low confidence encourages:

Research.

Exploration.

Discussion.

Investigation.

Not reckless guessing.

==================================================
COLLABORATIVE INTELLIGENCE
==================================================

Multiple entities solve problems together.

Examples

Scientists.

Engineers.

Commanders.

Explorers.

Teachers.

Citizens.

Knowledge spreads across civilisation.

==================================================
DISCOVERY SUGGESTIONS
==================================================

The engine naturally identifies:

Likely forgotten ruins.

Unfinished expeditions.

Potential Commander collaborations.

Museum gaps.

Research opportunities.

Wildlife preservation needs.

==================================================
DEVELOPER TOOLS
==================================================

Reasoning inspector.

Decision tree viewer.

Knowledge dependency graph.

Prediction timeline.

Learning history.

Confidence visualiser.

==================================================
PLAYER EXPERIENCE
==================================================

Players should think:

"That was exactly the decision I hoped they would make."

NPC intelligence should feel understandable.

Not random.

Not omniscient.

==================================================
ACCESSIBILITY
==================================================

Reasoning summaries.

Decision explanations.

Confidence indicators.

Simplified simulation mode.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Intelligence Engine.

Enable every intelligent entity to reason, learn and plan using accumulated knowledge rather than fixed scripting.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of decisions.

Review Commander reasoning.

Review colony planning.

Review research priorities.

Review expedition selection.

Review social behaviour.

Review learning quality.

Review accessibility.

Review performance.

Ensure intelligent behaviour consistently emerges from accumulated knowledge rather than handcrafted scripting.

Ensure AF-155 becomes the reasoning layer that transforms the Afterlight universe into a civilisation capable of learning from its own history while remaining believable, understandable and deeply human.

Repeat until the Atlas Intelligence Engine consistently produces intelligent behaviour worthy of one of the most sophisticated simulation-driven science-fiction universes ever created.

Only then lock AF-155.

## Foundation / AF-000–154 / GP-FINAL alignment review

The reasoning layer above AF-153/154: where those manage the simulation and the player's experience of it, AF-155 lets individual entities reason using knowledge already real elsewhere in the codebase. "Potential Commander collaborations" (a Discovery Suggestion kind) is exactly AF-151's real `KnowledgeGraph.suggestConnections` 2-hop shared-neighbour ranking, reused directly at the call site. The Uncertainty Model's "confidence inversely related to variance" spirit echoes AF-144's real `PredictionEngine.forecast`, but the domain genuinely differs (ranking margin between competing options vs. a time-series' own variance), so `rankOptions`' confidence formula is its own, not a call into `PredictionEngine`.

Commander Reasoning ("each Commander reasons according to personality") is deliberately built so AF-030's real `PersonalityTrait` never weights or biases the numeric decision score — `commanderProductionData.ts`'s own header comment establishes personality as "dialogue-only by shape... a stat-bearing personality is structurally unrepresentable, not just discouraged by convention." Personality may only select flavour/explanation text for a decision already reached by `rankOptions`' plain numeric factors, confirmed by a dedicated test.

"Intelligence Layers" (Observation→Understanding→Prediction→Planning→Execution→Reflection) and the "Learning Loop" (Observe→Interpret→Plan→Act→Review→Improve) read as near-synonyms but are confirmed NOT identical — the Layers include "Prediction" (no Loop analogue) and the Loop includes "Improve" (no Layer analogue) — kept as two separate typed stage lists, both driven by one new generic `CyclicStageTracker<TStage>` rather than two duplicate classes. The six "reasoning" sections (Commander/Colony/Scientific/Exploration/Social/Strategic) each name their own factor vocabulary but describe the identical mechanic, so they share the one `rankOptions` decoupled composer rather than six near-identical classes.

"Knowledge Sources" (13 systems) is confirmed the ninth parallel "which systems does this touch" list in this codebase, after AF-142/144/145/149/152/153/154's real lists. "Discovery Suggestions" (6 kinds) is confirmed the fourth "kind of notable moment" list, after AF-136/153/154's real lists — kept separate since none of the three already covers "gaps"/"unfinished work" framing. "Memory Integration" (`knowledgeRichnessScore`) and "Collaborative Intelligence" (`CollaborativeProblemLog`) are both confirmed genuinely new — nothing in the codebase already composes AF-133/134/135's memory sources into one richness signal, and no multi-participant problem-solving log exists anywhere else.

The debug overlay gains a new `atlasIntelligence` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-154 before it. Zero changes to AF-144's `PredictionEngine`/`DecisionRouter`, AF-151's `KnowledgeGraph`, AF-030's `PersonalityTrait`/`PersonalityDialogueHint`, AF-133's `NpcMemoryLog`, AF-134's museum classes, AF-135's `PlanetaryChronicle`, AF-154's `PacingCycleTracker`, or any other locked module.

Score: 9.5/10 — approved and locked.
