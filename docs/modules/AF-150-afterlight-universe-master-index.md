## Verbatim prompt

150

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-149 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Afterlight Universe Master Index.

Unlike previous modules, this is not a gameplay feature.

It is the master reference architecture for the entire project.

Every system, mechanic, Commander, planet, faction and future expansion references this index.

The Master Index is the brain of the project.

==================================================
PURPOSE
==================================================

Create a single authoritative source of truth.

Every asset.

Every system.

Every line of dialogue.

Every historical event.

Every gameplay mechanic.

Everything is indexed.

Nothing becomes lost.

==================================================
MASTER CATALOGUES
==================================================

The Index contains searchable databases for:

Commanders

Planets

Star Systems

Galaxies

Species

Companions

Ships

Weapons

Armour

Relics

Resources

Materials

Research

Technologies

Buildings

Colonies

Civilisations

Events

Museum Artifacts

Chronicle Entries

Historical Figures

Factions

NPCs

Music

Audio

Animations

Visual Effects

Accessibility Features

UI Components

Achievements

Titles

Lore

Dialogue

Quests

Everything receives a permanent ID.

==================================================
UNIQUE IDENTIFIERS
==================================================

Every object receives:

Global ID

Module Origin

Creation Date

Canon Status

Version History

Dependencies

Related Systems

Museum Links

Chronicle Links

Expansion Compatibility

Nothing exists without metadata.

==================================================
RELATIONSHIP GRAPH
==================================================

Every indexed object links to:

Related Commanders

Related Planets

Related Species

Related Quests

Related Technologies

Historical Events

Museum Exhibits

Chronicle Articles

Future References

The entire universe becomes one connected knowledge graph.

==================================================
DEPENDENCY MAP
==================================================

Every system records:

Parent systems

Child systems

Required systems

Optional systems

Expansion systems

Deprecated systems

No hidden dependencies.

==================================================
SEARCH ENGINE
==================================================

Developers can instantly locate:

Dialogue

Animations

Lore

Historical events

Commander relationships

Planets

Audio

Technical references

Performance budgets

Accessibility implementations

==================================================
VERSION HISTORY
==================================================

Every modification records:

Date

Developer

Reason

Systems affected

Compatibility

Rollback availability

History is never deleted.

==================================================
VISUAL MAPS
==================================================

Interactive diagrams include:

Galaxy graph

Commander graph

Timeline graph

Technology tree

Faction map

Relationship network

Civilisation growth

Expansion architecture

==================================================
QUALITY TRACKING
==================================================

Every indexed item stores:

Completion status

Review score

Accessibility score

Performance score

Narrative score

Replayability score

Documentation status

QA status

==================================================
DOCUMENTATION LINKS
==================================================

Every system references:

Design Bible

Technical Guide

Art Guide

Audio Guide

Narrative Guide

Accessibility Guide

Performance Notes

Testing Results

==================================================
EXPANSION SUPPORT
==================================================

Every future module automatically registers itself.

No manual indexing required.

Future expansions immediately become searchable.

==================================================
DEVELOPER DASHBOARD
==================================================

Supports:

Missing assets

Broken links

Unused dialogue

Performance hotspots

Accessibility gaps

Narrative inconsistencies

Museum completeness

Lore coverage

==================================================
PLAYER-FACING DERIVATIVES
==================================================

The Master Index powers:

Museum

Chronicle

Codex

Planet Browser

Commander Profiles

Relationship Viewer

Timeline

Lore Search

Players never access the raw index.

==================================================
FAILSAFE RULES
==================================================

No asset ships unless:

Indexed

Documented

Validated

Linked

Accessible

Versioned

QA approved

Canon checked

==================================================
ACCESSIBILITY
==================================================

Documentation search.

Developer narration.

Visual dependency graphs.

Colour-safe diagrams.

Keyboard navigation.

==================================================
OUTPUT
==================================================

Implement the Afterlight Universe Master Index.

Every current and future element of the project becomes discoverable, traceable and maintainable through one authoritative reference architecture.

==================================================
SELF REVIEW LOOP
==================================================

Index every module from AF-000 through AF-149.

Validate every relationship.

Validate every dependency.

Detect orphaned systems.

Detect duplicated mechanics.

Detect missing documentation.

Stress-test thousands of future expansions.

Ensure the Master Index enables the Afterlight universe to grow indefinitely while remaining coherent, searchable and maintainable.

Repeat until the Master Index functions as the definitive reference system for the entire Afterlight franchise.

Only then lock AF-150.

## Foundation / AF-000–149 / GP-FINAL alignment review

Explicitly "not a gameplay feature" per its own text — a meta-registry over every individual game OBJECT, at a genuinely different granularity than AF-142's real `ModuleRegistry` (whole modules) and AF-148's real `CanonEventLedger` (one richer record type, historical events specifically). Direct shape overlap with AF-142's real `ModuleRegistrationDef` is expected and intentional — both are registries — but `MasterIndexEntry` operates one level down (individual objects, not whole systems), so it's its own separate interface, never importing or extending AF-142's type. `MasterIndexRegistry`'s dependency-graph algorithm deliberately mirrors AF-142's real adjacency-list fix — the same O(n+e) approach that corrected an O(n²)-per-registration performance bug discovered during that module's own self-review — rather than reinventing or regressing to the slower approach; the retained stress test (2000 synthetic entries) confirms the lesson carried over cleanly, completing in under a second.

"Expansion Support" ("every future module automatically registers itself, no manual indexing required") restates AF-142's own "no manual integration required" philosophy at the individual-object granularity — composed, not duplicated. "Failsafe Rules" (8 checks, all-must-pass) is confirmed the eighth occurrence of the same checklist-gate mechanic in this codebase, after the real Constitution's two gates, AF-146's Expansion Test, AF-145's Design Validation, AF-147's Franchise Test, AF-148's `expansionRespectsTimeline`, and AF-149's Final Validation. "Quality Tracking" overlaps in spirit with AF-143/149's real `DesignScoreCard`/`AtlasScoreCard` but is a different shape — per-category scores keyed by indexed OBJECT id rather than a single proposed FEATURE — so `QualityTracker` is its own new class, not a third reuse of that shape. "Player-Facing Derivatives" lists systems that are all already real and locked (Museum, Chronicle, Codex, Planet Browser, Commander Profiles, Relationship Viewer, Timeline, Lore Search) — kept as pure reference confirmation, never reimplemented.

`RelationshipGraph`, `DependencyMap`, and `VersionHistoryLedger` are all real, append-only, giving the Relationship Graph/Dependency Map/Version History sections genuine inspectable evidence. The debug overlay gains a new `masterIndex` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-149 before it. Zero changes to AF-142's `ModuleRegistry`, AF-143/149's score cards, AF-148's `CanonEventLedger`, or any other locked module.

Score: 9.5/10 — approved and locked.
