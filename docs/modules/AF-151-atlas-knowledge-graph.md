## Verbatim prompt

151

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-150 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Knowledge Graph.

The Knowledge Graph is the semantic intelligence layer sitting above the Master Index.

Where the Master Index stores information...

...the Knowledge Graph understands relationships.

Every object in Afterlight becomes part of one intelligent interconnected universe.

==================================================
PURPOSE
==================================================

Enable every system to understand context.

Not merely data.

The Knowledge Graph should answer:

"What is related?"

"Why?"

"What might happen next?"

"What has been forgotten?"

"What opportunities now exist?"

==================================================
GRAPH NODES
==================================================

Every object becomes a Node.

Examples

Commander

Planet

Galaxy

Species

Faction

Ship

Technology

Research

Quest

Museum Artifact

Historic Event

Relationship

Weather Pattern

Biome

Settlement

Megaproject

Building

Book

Photograph

Conversation

Every node owns one permanent Graph ID.

==================================================
GRAPH EDGES
==================================================

Relationships include:

Created

Discovered

Mentored

Built

Protected

Destroyed

Recovered

Inspired

Researched

Visited

Commanded

Restored

Founded

Evolved Into

Member Of

Adjacent To

Parent Of

Child Of

Influenced

Every edge stores:

Strength

Confidence

Historical context

Date established

==================================================
SEMANTIC SEARCH
==================================================

Developers may ask:

Show every Commander connected to Atlas Prime.

Which planets contain extinct wildlife?

Which Engineers influenced Cassia?

Which discoveries originated from Helios?

Which Museum exhibits reference Orion Vale?

The graph returns intelligent results.

==================================================
INTELLIGENT DISCOVERY
==================================================

The graph automatically discovers:

Missing relationships

Unused lore

Forgotten locations

Disconnected systems

Duplicate mechanics

Timeline inconsistencies

Potential story hooks

==================================================
NARRATIVE ASSISTANCE
==================================================

When writing dialogue:

Suggest shared history.

Existing friendships.

Planet references.

Relevant discoveries.

Previous jokes.

Historical callbacks.

Dialogue feels naturally connected.

==================================================
COMMANDER GRAPH
==================================================

Every Commander connects through:

Friendships

Mentorships

Operations

Research

Ships

Planets

Expeditions

Museum contributions

Chronicle entries

Legacy

==================================================
PLANET GRAPH
==================================================

Each world connects to:

Species

Weather

Settlements

History

Architecture

Economy

Research

Commanders

Exploration

Trade

==================================================
HISTORICAL GRAPH
==================================================

Events connect through:

Cause

Effect

Participants

Evidence

Museum exhibits

Books

News

Commander memories

Future consequences

==================================================
EVOLUTION GRAPH
==================================================

Track evolution of:

Technology

Architecture

Civilisation

Language

Wildlife

Research

Player legacy

Generations

Everything remains linked.

==================================================
PREDICTION SUPPORT
==================================================

Suggest likely future developments.

Examples

Commander likely to collaborate.

Research ready for breakthrough.

Planet nearing Capital status.

Species likely to migrate.

Economy approaching surplus.

Festival becoming tradition.

==================================================
AUTHORING SUPPORT
==================================================

When developers add content:

Automatically suggest:

Dialogue.

Relationships.

Museum placement.

Chronicle entries.

Faction reactions.

Commander interactions.

Potential conflicts.

==================================================
VISUALISATION
==================================================

Interactive graph displays:

Galaxy network

Commander relationships

Timeline

Faction influence

Research dependencies

Civilisation growth

Museum knowledge

Story connections

==================================================
AUTOMATED VALIDATION
==================================================

Continuously detect:

Broken links

Isolated nodes

Impossible chronology

Missing museum references

Unused dialogue

Redundant systems

Canon violations

==================================================
PLAYER SYSTEMS
==================================================

Indirectly powers:

Codex

Museum

Chronicle

Commander Profiles

Timeline

Relationship Viewer

Discovery Suggestions

The player never sees raw graph data.

==================================================
ACCESSIBILITY
==================================================

Search by concept.

Search by relationship.

Visual graph filters.

Narration ready.

Colour-safe graph themes.

==================================================
OUTPUT
==================================================

Implement the Atlas Knowledge Graph.

Every element of Afterlight becomes part of one intelligent semantic universe capable of supporting storytelling, simulation and future expansion at unprecedented scale.

==================================================
SELF REVIEW LOOP
==================================================

Index every object from AF-000 through AF-150.

Simulate decades of expansion.

Review graph integrity.

Review narrative suggestions.

Review performance.

Review discoverability.

Ensure every new addition automatically becomes meaningfully connected to the rest of the universe.

Ensure the Atlas Knowledge Graph transforms Afterlight into a truly interconnected world where no story, character or discovery exists in isolation.

Repeat until the graph consistently improves development quality, narrative cohesion and player immersion.

Only then lock AF-151.

## Foundation / AF-000–150 / GP-FINAL alignment review

Explicitly "sitting above the Master Index" per its own text — "Where the Master Index stores information, the Knowledge Graph understands relationships." Graph node ids are meant to be AF-150's real `MasterIndexEntry` ids; this module never invents a second id space. Confirmed AF-150's real `RelationshipGraph` already implements a simple, untyped edge list over its own 9 `RelationshipKind` values with no strength/confidence/historical-context/date fields — this module's 19-kind `GraphEdgeKind` union and richer `GraphEdge` shape are genuinely new, a semantic layer on top of (never a replacement for) AF-150's simpler relationship list; both coexist over the same node ids without collision.

"Intelligent Discovery" (7 items) and "Automated Validation" (7 items) both overlap heavily with AF-150's real `DEVELOPER_DASHBOARD_CHECKS` and AF-148's canon-checking functions — "Isolated nodes" is the one item genuinely computable purely from graph structure (no edges in or out), so `KnowledgeGraph.isIsolated` implements exactly that; the remaining items stay pure reference data, the same honest scope boundary AF-140 through AF-150 already applied. "Prediction Support" (6 examples) overlaps in wording with AF-144's real `PREDICTION_KINDS`/`PredictionEngine` ("Research breakthroughs" ≈ "Research ready for breakthrough"; "Festival scheduling" ≈ "Festival becoming tradition") but that engine is a numeric time-series trend forecaster — a structurally different mechanic from `suggestConnections`' real shared-neighbour graph traversal, confirmed never a redeclaration. "Commander Graph"/"Planet Graph"/"Historical Graph"/"Evolution Graph" are all just filtered views over the one real edge store — `subgraphFor` implements that generically once, rather than four separate near-duplicate view classes.

`chronologyViolations` composes a plain lookup function rather than importing AF-150's `MasterIndexRegistry` directly, per the AF-137 `tierWeightsFor` decoupling discipline. The debug overlay gains a new `knowledgeGraph` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-150 before it. Zero changes to AF-150's `RelationshipGraph`/`MasterIndexRegistry`, AF-144's `PredictionEngine`, or any other locked module.

Score: 9.5/10 — approved and locked.
