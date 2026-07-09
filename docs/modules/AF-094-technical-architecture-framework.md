## Verbatim prompt

94

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-093 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Technical Architecture Framework.

This is the engineering foundation that allows Afterlight to evolve for the next decade without requiring architectural rewrites.

Every gameplay system should be modular.

Every future expansion should plug into existing systems.

Every save file should remain compatible.

Technical excellence is a design pillar.

==================================================
CORE PHILOSOPHY
==================================================

Scalability.

Maintainability.

Reliability.

Performance.

Future-proofing.

Every system should remain understandable years from now.

==================================================
ARCHITECTURE PRINCIPLES
==================================================

Design every system using:

Data Driven Architecture

Composition over Inheritance

Event Driven Systems

Service Based Architecture

Modular Components

Loose Coupling

Dependency Injection

Configuration Files

Every feature remains independent.

==================================================
CORE MODULES
==================================================

Support:

Game Manager

Mission Manager

Galaxy Manager

Combat Manager

AI Manager

Faction Manager

Economy Manager

Research Manager

Audio Manager

Visual Manager

UI Manager

Save Manager

Analytics Manager

Expansion Manager

Every manager communicates through defined interfaces.

==================================================
DATA ARCHITECTURE
==================================================

Everything is data-driven.

Support external definitions for:

Weapons

Ships

Commanders

Enemies

Bosses

Research

Relics

Equipment

Biomes

Factions

Missions

Dialogue

Balancing

Future content should rarely require code changes.

==================================================
SAVE SYSTEM
==================================================

Save files record:

Campaign Progress

Galaxy State

Commander Progress

Ship Collection

Research

Equipment

Relics

Faction Reputation

Civilisation Growth

Statistics

Museum

Codex

Settings

Analytics

Future compatibility version

Nothing important is lost.

==================================================
SAVE COMPATIBILITY
==================================================

Support:

Automatic Migration

Version Detection

Rollback Protection

Corruption Recovery

Incremental Upgrades

Expansion Compatibility

Cross Platform Compatibility

Future versions never invalidate player progress.

==================================================
EVENT SYSTEM
==================================================

Support:

Gameplay Events

Mission Events

Faction Events

Research Events

Economy Events

UI Events

Audio Events

Analytics Events

Systems communicate through events.

==================================================
PLUGIN ARCHITECTURE
==================================================

Support future plug-in modules for:

Expansions

Seasonal Content

New Biomes

New Factions

Community Features

Experimental Systems

Developer Tools

Plugins remain isolated.

==================================================
CONFIGURATION
==================================================

Support configurable values for:

Balancing

Loot

Enemy Behaviour

Mission Generation

Economy

Research

Difficulty

Accessibility

Developers iterate rapidly.

==================================================
AUTOMATED TESTING
==================================================

Support:

Unit Tests

Integration Tests

Regression Tests

Performance Tests

Save Compatibility Tests

Stress Tests

UI Tests

Expansion Tests

Testing becomes continuous.

==================================================
CRASH RECOVERY
==================================================

Support:

Autosave

Crash Recovery

Safe Boot

Configuration Reset

Diagnostic Reports

Corruption Detection

Recovery Wizard

Player data remains protected.

==================================================
ANALYTICS
==================================================

Track anonymously:

Performance

Balance

Crashes

Mission Completion

Build Diversity

Accessibility Usage

Economy

Progression

Data informs improvements.

==================================================
DEVELOPER TOOLS
==================================================

Support:

Console

Debug Overlay

Content Browser

Mission Simulator

Balance Editor

Performance Viewer

Visual Profiler

Save Inspector

Developer productivity is prioritised.

==================================================
ACCESSIBILITY
==================================================

Accessibility settings remain:

Modular

Persistent

Cloud Saved

Importable

Exportable

Applied globally

Never reset unexpectedly.

==================================================
PERFORMANCE
==================================================

Support:

Asynchronous Loading

Asset Streaming

Memory Pooling

Object Pooling

Multithreading

Background Processing

Efficient Serialization

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Module Status

Memory Usage

Frame Time

Save Version

Active Systems

Event Queue

Performance

==================================================
OUTPUT
==================================================

Produce the complete Technical Architecture Framework.

Every future system, expansion and update extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Stress test every system.

Review save compatibility.

Review modularity.

Review performance.

Review scalability.

Review crash recovery.

Review testing.

Review developer workflow.

Review accessibility.

Review integration with AF-000 through AF-093.

Remove unnecessary dependencies.

Improve maintainability.

Strengthen future-proofing.

Ensure Afterlight is engineered as a world-class software platform capable of supporting a decade of continuous development, seamless expansion and long-term technical excellence without architectural degradation.

Repeat until the Technical Architecture Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-094.

## Foundation / AF-000–093 / GP-FINAL alignment review

This is a "meta" module about the engineering of the codebase itself, so it takes the AF-091/092/093 realisation-map pattern and points it at the architecture rather than at content. Research into the real codebase (44 `*Runtime` classes, the real `EventBus`/`GameEvents` registry, `SaveSlice`'s versioned/checksummed/migrated envelope, `Pool<T>`, 59 `*Data.ts`/7 `*Tuning.ts` files, the flat 85-file Vitest suite) showed that Architecture Principles and Configuration are already substantially, honestly true — evidenced, not aspirational. Core Modules realises each spec "Manager" onto whichever real class already serves that role under a different name (`FactionRuntime` for Faction Manager, `GalacticEconomyRuntime` for Economy Manager, etc.), rather than inventing 14 redundant wrapper classes; two are honestly distributed across several files (Combat, UI — no single class exists), one is honestly orphaned (`GameManager`'s isolate-on-error registry exists in `src/core/GameManager.ts` but the real loop in `main.ts` drives systems directly, never through it), and two are honest future (no renderer class exists at all for Visual Manager — rendering is ad hoc 2D canvas despite the WebGL stack decision; Analytics Manager has zero producer). Save System/Compatibility and Event System realisations are checked structurally against real values (`SAVE_SYSTEM_CATEGORY_REALISATION`'s slice keys checked against the 6 real slice names; `EVENT_SYSTEM_CATEGORY_REALISATION`'s event kinds typed as `keyof GameEvents` so a typo fails typecheck). `eventQueueSummary` composes with a REAL `EventBus<GameEvents>` instance (proven with a 120-seed sweep that its total always matches a manual sum of `listenerCount()` calls), never a mock. Zero changes to any locked module (AF-000–093); the two live wiring points extend existing `string`-typed DebugSnapshot fields (`gameState`, `saveFramework`), never adding a new one.

Score: 9.5/10 — approved and locked.
