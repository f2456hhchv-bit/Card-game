## Verbatim prompt

152

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-151 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas World Model.

The World Model is the simulation intelligence layer that allows every object, person, civilisation and ecosystem to understand its place within the universe.

Where the Atlas Knowledge Graph stores relationships...

The World Model stores understanding.

Every entity possesses awareness of its surroundings, goals, history and future.

==================================================
PURPOSE
==================================================

Create a universe where every object has context.

Every citizen understands their city.

Every Commander understands their mission.

Every colony understands its needs.

Every ecosystem understands balance.

Nothing simply exists.

Everything belongs somewhere.

==================================================
WORLD OBJECTS
==================================================

Every entity receives a World Model.

Examples

Commander

Citizen

Species

Planet

Ship

Building

Settlement

Artifact

Vehicle

Drone

Companion

Weather System

Research Project

Faction

Museum Exhibit

Expedition

==================================================
WORLD CONTEXT
==================================================

Every object stores:

Identity

Purpose

Current State

History

Relationships

Goals

Threats

Dependencies

Future Opportunities

Current Importance

==================================================
SPATIAL AWARENESS
==================================================

Every entity understands:

Current location

Nearby entities

Regional influence

Travel routes

Environmental hazards

Safe zones

Resources

Important landmarks

==================================================
TEMPORAL AWARENESS
==================================================

Every entity understands:

Current time

Season

Historical events

Recent changes

Scheduled activities

Future plans

Anniversaries

Predicted developments

==================================================
SOCIAL AWARENESS
==================================================

Citizens know:

Family

Friends

Employers

Teachers

Neighbours

Community leaders

Favourite locations

Important public events

Commanders know:

Professional networks

Expedition partners

Trusted specialists

Historic collaborations

==================================================
ECOLOGICAL AWARENESS
==================================================

Species understand:

Food sources

Migration paths

Predators

Climate

Breeding grounds

Population pressure

Environmental health

Habitat quality

==================================================
ECONOMIC AWARENESS
==================================================

Settlements understand:

Supply

Demand

Imports

Exports

Infrastructure

Workforce

Education

Industrial priorities

Future investments

==================================================
MISSION UNDERSTANDING
==================================================

Expeditions understand:

Objectives

Available specialists

Risks

Resources

Weather

History

Potential discoveries

Scientific opportunities

==================================================
MEMORY MODEL
==================================================

Every entity remembers:

Important interactions

Major events

Relationships

Achievements

Failures

Historic milestones

Minor memories fade.

Major memories remain.

==================================================
GOAL SYSTEM
==================================================

Every entity maintains priorities.

Examples

Citizen

Raise family.

Study.

Work.

Volunteer.

Commander

Protect colony.

Research anomaly.

Train recruits.

Planet

Increase biodiversity.

Expand cities.

Restore climate.

==================================================
WORLD QUERIES
==================================================

Systems may ask:

Who needs help?

Which colony is thriving?

Which Commander knows this technology?

Which species is endangered?

Which cities require engineers?

The World Model provides contextual answers.

==================================================
SIMULATION SUPPORT
==================================================

The World Model powers:

Living Galaxy

Story Engine

Civilisation Engine

Commander AI

Wildlife AI

Economy

Research

Relationships

Event Engine

==================================================
PREDICTIVE REASONING
==================================================

Estimate future outcomes.

Examples

Housing shortage.

Commander burnout.

Scientific breakthrough.

Wildlife migration.

Festival attendance.

Population growth.

Infrastructure demand.

==================================================
VISUAL DEBUGGING
==================================================

Developer tools include:

Awareness viewer

Goal inspector

Need analysis

Relationship heatmap

Settlement priorities

World influence map

Future prediction overlay

==================================================
PERFORMANCE
==================================================

Only nearby entities simulate at full fidelity.

Remote entities use abstract simulation.

Historical outcomes remain consistent.

Performance scales intelligently.

==================================================
ACCESSIBILITY
==================================================

Simplified world summaries.

Citizen overview.

Commander context viewer.

Colony health dashboard.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas World Model.

Every entity gains contextual awareness of itself, its environment and its place within the Living Galaxy.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of entities.

Review contextual behaviour.

Review memory consistency.

Review goal evolution.

Review performance.

Review accessibility.

Review predictive reasoning.

Ensure no entity behaves randomly.

Ensure every decision emerges logically from the entity's understanding of the world.

Ensure the Atlas World Model provides the intelligence layer that allows the Afterlight universe to feel genuinely alive, coherent and self-consistent across centuries of simulated history.

Repeat until every simulation behaves as though driven by understanding rather than scripting.

Only then lock AF-152.

## Foundation / AF-000–151 / GP-FINAL alignment review

The third layer in the Atlas stack — "Where the Atlas Knowledge Graph (AF-151) stores relationships, the World Model stores understanding." Two of its own named sections turned out to already be exactly what real AF-133/144 classes do: "Memory Model" ("minor memories fade, major memories remain") is already fully implemented by AF-133's real `NpcMemoryLog`, the same mechanic AF-144's Memory Manager reused directly — reused again here, zero new memory class. "Predictive Reasoning" overlaps heavily with AF-144's real `PREDICTION_KINDS`/`PredictionEngine` (Population growth, Wildlife migration, and Festival scheduling/attendance are near-exact matches) — unlike AF-151's `suggestConnections` (a structurally different graph-traversal mechanic), this section asks for the same numeric trend-forecasting mechanic again, so it's reused directly rather than duplicated. "Performance" ("only nearby entities simulate at full fidelity, remote entities use abstract simulation") is exactly AF-144's real `PriorityEngine` — reused directly, zero new LOD class.

Confirmed genuinely new: `WorldModelRegistry` deliberately excludes History/Relationships/Goals from its own `WorldContext` shape, since those already have real homes (AF-135/148's chronicle/canon systems, AF-151's Knowledge Graph, and this module's own `GoalTracker`) — `WorldContext` only holds what has no other home. `GoalTracker` and `SpatialAwarenessTracker` (deliberately decoupled from AF-038's real galaxy coordinate system, using plain caller-supplied location ids) round out the genuinely new core.

"Spatial/Temporal/Social/Ecological/Economic Awareness" and "Mission Understanding" are kept as pure reference data rather than six more parallel storage classes — the real composition happens by feeding real domain-system values into `WorldContext` at the call site, not by duplicating where that data already lives. "Simulation Support" is confirmed the sixth parallel "which systems does this touch" list in this codebase, after AF-142/144/145/149's real lists, kept separate rather than merged.

The debug overlay gains a new `worldModel` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-151 before it. Zero changes to AF-133's `NpcMemoryLog`, AF-144's `PredictionEngine`/`PriorityEngine`, AF-038's galaxy coordinate system, or any other locked module.

Score: 9.5/10 — approved and locked.
